import { createTestDatabase } from './test-database.mjs'

// Reproductions from the schema audit: payment history, checkout boundaries,
// source replacement, editorial cleanup and parent/child consistency.
export async function runReviewRegressions({ as, q, ok, fails, mk }) {
  const user = await mk('audit-buyer@example.test', 'custom:vipps', {})
  const editor = await mk('audit-editor@example.test', 'custom:vipps', {})
  await q(`update public.profiles set role = 'editor' where id = $1`, [editor])
  const revue = (await q(`insert into public.revues(year, slug, visible_from, name_reveal_at)
    values (2110, 'audit-regressions', now(), now()) returning id`))[0].id
  await q(`insert into public.revue_sales
    (revue_id, first_show_at, sales_open_at, stream_retire_at, stream_delete_at, terms_version)
    values ($1, now() + interval '1 day', now(), now() + interval '60 days', now() + interval '80 days', 'audit-v1')`, [revue])
  const prepare = `select * from public.prepare_revue_checkout($1, $2, $3, $4)`
  const args = [user, revue, 'audit-v1', true]
  ok('checkout is closed without a configured price', (await fails(prepare, args)).failed)
  await q(`insert into public.revue_prices(revue_id, user_type, amount) values ($1, 'external', 14900), ($1, 'student', 9900)`, [revue])
  ok('checkout rejects missing terms acceptance', (await fails(prepare, [user, revue, 'audit-v1', false])).failed)
  ok('checkout rejects stale terms', (await fails(prepare, [user, revue, 'old-terms', true])).failed)
  await q(`update public.revue_sales set sales_open_at = now() + interval '1 hour' where revue_id = $1`, [revue])
  ok('checkout rejects a sale that has not opened', (await fails(prepare, args)).failed)
  ok('direct server inserts also enforce the sales window', (await fails(`insert into public.orders
    (user_id, revue_id, amount, terms_version, terms_accepted_at) values ($1, $2, 1, 'audit-v1', now())`, [user, revue])).failed)
  await q(`update public.revue_sales set sales_open_at = now() - interval '2 hours', sales_close_at = now() - interval '1 hour' where revue_id = $1`, [revue])
  ok('checkout rejects a closed sale', (await fails(prepare, args)).failed)
  await q(`update public.revue_sales set sales_close_at = null where revue_id = $1`, [revue])
  await as('anon', null, async () => {
    ok('anonymous callers cannot prepare checkout', (await fails(prepare, args)).failed)
  })
  await as('authenticated', user, async () => {
    ok('browser users cannot prepare checkout for any user directly', (await fails(prepare, args)).failed)
  })
  let first
  await as('service_role', null, async () => { first = (await q(prepare, args))[0] })
  const repeated = (await q(prepare, args))[0]
  ok('retries reuse the same pending order and provider idempotency key', repeated.id === first.id)
  ok('order captures server price, category, terms and acceptance', first.amount === 14900 && first.currency === 'nok'
    && first.price_type === 'external' && first.terms_version === 'audit-v1' && first.terms_accepted_at && !first.eligibility_checked_at)
  ok('direct SQL cannot create a second active checkout', (await fails(`insert into public.orders
    (user_id, revue_id, amount, terms_version, terms_accepted_at) values ($1, $2, 1, 'audit-v1', now())`, [user, revue])).failed)
  await q(`update public.revue_prices set amount = 15900 where revue_id = $1 and user_type = 'external'`, [revue])
  ok('price changes require reconciliation of an existing provider checkout', (await fails(prepare, args)).failed)
  ok('accepted purchase price never changes with the current catalogue', (await q(`select amount from public.orders where id = $1`, [first.id]))[0].amount === 14900)
  await q(`update public.revue_prices set amount = 14900 where revue_id = $1 and user_type = 'external'`, [revue])
  // The provider confirmed expiry; it may still send a delayed captured-payment event.
  await q(`update public.orders set status = 'expired' where id = $1`, [first.id])
  const second = (await q(prepare, args))[0]
  await q(`update public.orders set status = 'paid', stripe_payment_intent_id = 'pi_audit_first' where id = $1`, [first.id])
  await q(`update public.orders set status = 'paid', stripe_payment_intent_id = 'pi_audit_second' where id = $1`, [second.id])
  ok('two actual charges can both be recorded for reconciliation', (await q(`select 1 from public.orders where user_id = $1 and revue_id = $2 and status = 'paid'`, [user, revue])).length === 2)
  for (const state of ['pending', 'failed', 'expired']) {
    ok('settled payment cannot regress to ' + state, (await fails(`update public.orders set status = $2 where id = $1`, [first.id, state])).failed)
  }
  ok('payment reference cannot be replaced', (await fails(`update public.orders set stripe_payment_intent_id = 'pi_substituted' where id = $1`, [first.id])).failed)
  ok('accepted terms timestamp cannot be rewritten', (await fails(`update public.orders set terms_accepted_at = now() + interval '1 hour' where id = $1`, [first.id])).failed)
  for (const id of [first.id, second.id]) await q(`insert into public.revue_access(user_id, revue_id, source, order_id) values ($1, $2, 'purchase', $3)`, [user, revue, id])
  await q(`insert into public.order_refunds(order_id, provider_refund_id, amount, status, reason, completed_at)
    values ($1, 'audit-first-refund', 100, 'succeeded', 'cancellation', now())`, [first.id])
  const receipt = (await q(`select refunded_at from public.orders where id = $1`, [first.id]))[0].refunded_at
  await q(`insert into public.order_refunds(order_id, provider_refund_id, amount, status, reason, completed_at)
    values ($1, 'audit-remainder-refund', 14800, 'succeeded', 'cancellation', now())`, [first.id])
  ok('multiple real refunds preserve their history and first refund receipt', (await q(`select refunded_at from public.orders where id = $1`, [first.id]))[0].refunded_at.getTime() === receipt.getTime())
  ok('refunding a duplicate charge preserves the other purchased right', (await q(`select private.user_has_revue_access($1, $2) as allowed`, [user, revue]))[0].allowed)
  await as('service_role', null, async () => {
    ok('service role cannot delete refund history', (await fails(`delete from public.order_refunds where provider_refund_id = 'audit-first-refund'`)).failed)
  })
  ok('delete trigger protects refund history even from table-owner SQL', (await fails(`delete from public.order_refunds where provider_refund_id = 'audit-first-refund'`)).failed)

  const spoofUser = await mk('audit-price@example.test', 'custom:vipps', {})
  const spoof = (await q(`insert into public.orders(user_id, revue_id, amount, currency, price_type, terms_version, terms_accepted_at)
    values ($1, $2, 1, 'usd', 'student', 'audit-v1', now()) returning *`, [spoofUser, revue]))[0]
  ok('server trigger replaces caller-supplied amount, currency and student category', spoof.amount === 14900 && spoof.currency === 'nok' && spoof.price_type === 'external')

  const show1 = (await q(`insert into public.shows(revue_id, title, starts_at) values ($1, 'Premiere', now() + interval '1 day') returning id`, [revue]))[0].id
  const show2 = (await q(`insert into public.shows(revue_id, title, starts_at) values ($1, 'Friday', now() + interval '2 days') returning id`, [revue]))[0].id
  ok('physical show cannot silently precede the configured premiere', (await fails(`update public.shows set starts_at = now() where id = $1`, [show1])).failed)
  ok('sale premiere cannot silently move after an existing show', (await fails(`update public.revue_sales set first_show_at = now() + interval '3 days' where revue_id = $1`, [revue])).failed)
  const stream = (await q(`insert into public.streams(revue_id, show_id, slug, title, starts_at)
    values ($1, $2, 'audit-stream', 'Premiere', now() + interval '1 day') returning id`, [revue, show1]))[0].id
  const video = (await q(`insert into public.revue_videos(revue_id, show_id, stream_id, title, kind, published_at)
    values ($1, $2, $3, 'Recording', 'full', now()) returning id`, [revue, show1, stream]))[0].id
  ok('moving a parent stream cannot invalidate an existing video show', (await fails(`update public.streams set show_id = $1 where id = $2`, [show2, stream])).failed)
  await q(`update public.revue_videos set show_id = null where id = $1`, [video])
  ok('parent stream can move once the explicit child show is cleared', !(await fails(`update public.streams set show_id = $1 where id = $2`, [show2, stream])).failed)
  ok('child cannot restore a conflicting show', (await fails(`update public.revue_videos set show_id = $1 where id = $2`, [show1, video])).failed)

  const cf = (await q(`insert into public.video_sources(video_id, revue_id, provider, state, published_at)
    values ($1, $2, 'cloudflare', 'ready', now()) returning id`, [video, revue]))[0].id
  await q(`insert into public.cloudflare_video_sources(source_id, cloudflare_video_id, signed_urls_verified_at)
    values ($1, 'audit-original', now())`, [cf])
  const canPlay = async () => (await q(`select public.can_play_source($1, $2) as allowed`, [user, cf]))[0].allowed
  ok('missing confirmed provider deletion schedule denies playback', !await canPlay())
  await q(`update public.cloudflare_video_sources set scheduled_deletion_at = now() + interval '90 days' where source_id = $1`, [cf])
  ok('provider schedule later than the hard deadline denies playback', !await canPlay())
  await q(`update public.cloudflare_video_sources set scheduled_deletion_at = now() + interval '70 days' where source_id = $1`, [cf])
  ok('verified protection and deletion schedule enable entitled playback', await canPlay())
  await q(`update public.cloudflare_video_sources set cloudflare_video_id = 'audit-replacement' where source_id = $1`, [cf])
  const replacement = (await q(`select * from public.cloudflare_video_sources where source_id = $1`, [cf]))[0]
  ok('replacement clears both protection and provider deletion confirmation', !replacement.signed_urls_verified_at && !replacement.scheduled_deletion_at && !await canPlay())
  await as('authenticated', editor, async () => {
    const deletion = await fails(`delete from public.video_sources where id = $1`, [cf])
    ok('editor cannot delete a Cloudflare source before external cleanup', !deletion.failed && deletion.affected === 0)
  })
  const yt = (await q(`insert into public.video_sources(video_id, revue_id, provider, youtube_video_id, published_at)
    values ($1, $2, 'youtube', 'abcdefghijk', now()) returning id`, [video, revue]))[0].id
  await as('anon', null, async () => {
    ok('unready YouTube identifiers remain hidden after source-table merge', (await q(`select youtube_video_id from public.video_sources where id = $1`, [yt])).length === 0)
  })
  await q(`update public.video_sources set state = 'ready' where id = $1`, [yt])
  await as('anon', null, async () => {
    ok('ready published YouTube identifier is public', (await q(`select youtube_video_id from public.video_sources where id = $1`, [yt]))[0]?.youtube_video_id === 'abcdefghijk')
  })
  ok('permanent paid rights remain after unrelated source changes', (await q(`select private.user_has_revue_access($1, $2) as allowed`, [user, revue]))[0].allowed)
  ok('refund history still includes both provider receipts', (await q(`select 1 from public.order_refunds where order_id = $1`, [first.id])).length === 2)
  await verifyLegacyGuards(ok)
}

async function verifyLegacyGuards(ok) {
  for (const kind of ['grant', 'price']) {
    let error
    try {
      await createTestDatabase(undefined, async (db, file) => {
        if (!file.endsWith('_harden_revue_checkout.sql')) return
        const q = async (sql, params = []) => (await db.query(sql, params)).rows
        const user = (await q(`insert into auth.users(email) values ('unmigrated@example.test') returning id`))[0].id
        const revue = (await q(`insert into public.revues(year, slug) values (2190, 'guard-test') returning id`))[0].id
        const stream = (await q(`insert into public.streams(revue_id, slug, title, starts_at)
          values ($1, 'guard-stream', 'Old stream', now()) returning id`, [revue]))[0].id
        if (kind === 'grant') await q(`insert into public.stream_access(user_id, stream_id, source) values ($1, $2, 'granted')`, [user, stream])
        else await q(`insert into public.stream_prices(stream_id, user_type, amount) values ($1, 'external', 123)`, [stream])
      })
    } catch (e) { error = e }
    ok('cleanup refuses unmigrated legacy ' + kind + ' records', error?.message.includes(kind === 'grant' ? 'Resolve legacy stream grants' : 'Resolve conflicting or free legacy prices'))
  }
}
