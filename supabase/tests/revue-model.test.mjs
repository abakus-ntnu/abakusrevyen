import { createTestDatabase } from './test-database.mjs'

export async function runRevueModelTests({ db, as, q, ok, fails, mk }) {
  const buyer = await mk('buyer@example.test', 'custom:vipps', { name: 'Chosen name' })
  const outsider = await mk('outsider@example.test', 'custom:abakus', {})
  const staff = await mk('staff@example.test', 'custom:abakus', {})
  await q(`update public.profiles set role = 'admin' where id = $1`, [staff])
  const identity = (await q(`insert into auth.identities(user_id, provider, provider_id)
    values ($1, 'custom:abakus', 'verified-subject') returning id`, [buyer]))[0].id
  const otherIdentity = (await q(`insert into auth.identities(user_id, provider, provider_id)
    values ($1, 'custom:abakus', 'other-subject') returning id`, [outsider]))[0].id
  const priceType = async (user) => {
    let value
    await as('authenticated', user, async () => { value = (await q(`select public.current_price_type() as value`))[0].value })
    return value
  }
  ok('AbaID identity linking does not duplicate the profile or overwrite chosen name',
    (await q(`select display_name from public.profiles where id = $1`, [buyer]))[0].display_name === 'Chosen name')
  ok('linked AbaID without a verification is external', await priceType(buyer) === 'external')
  const insertVerification = `insert into public.student_verifications
    (user_id, identity_id, lego_subject, eligible, reason, criteria_version, checked_at, expires_at)
    values ($1, $2, $3, true, 'qualified', 'test-policy', now(), now() + interval '1 hour')`
  ok('verification cannot bind another account identity', (await fails(insertVerification, [buyer, otherIdentity, 'other-subject'])).failed)
  ok('verification cannot substitute the provider subject', (await fails(insertVerification, [buyer, identity, 'other-subject'])).failed)
  await q(insertVerification, [buyer, identity, 'verified-subject'])
  ok('trusted eligible result enables student price', await priceType(buyer) === 'student')
  await as('authenticated', buyer, async () => {
    ok('user cannot write verification eligibility', (await fails(`update public.student_verifications set eligible = true`)).failed)
    ok('user cannot extend verification expiry', (await fails(`update public.student_verifications set expires_at = now() + interval '1 year'`)).failed)
  })
  await as('authenticated', outsider, async () => {
    ok('another user cannot read a verification', (await q(`select * from public.student_verifications`)).length === 0)
  })
  await q(`update public.student_verifications set eligible = false, reason = 'not_student' where user_id = $1`, [buyer])
  ok('negative verification removes student price', await priceType(buyer) === 'external')
  await q(`update public.student_verifications set eligible = true, checked_at = now() - interval '2 hours', expires_at = now() - interval '1 hour' where user_id = $1`, [buyer])
  ok('expiry removes student price without a cleanup job', await priceType(buyer) === 'external')
  await q(`update public.student_verifications set expires_at = now() + interval '1 hour' where user_id = $1`, [buyer])

  const revue = (await q(`insert into public.revues(year, slug, visible_from, name_reveal_at)
    values (2100, 'model-tests', now() - interval '1 day', now() - interval '1 day') returning id`))[0].id
  const future = (await q(`insert into public.revues(year, slug, visible_from, name_reveal_at)
    values (2101, 'model-future', now() - interval '1 day', now() + interval '1 day') returning id`))[0].id
  const makeSales = async (id, first = "now() + interval '1 day'") => q(`insert into public.revue_sales
    (revue_id, first_show_at, stream_retire_at, stream_delete_at, terms_version)
    values ($1, ${first}, now() + interval '60 days', now() + interval '80 days', 'terms-v1')`, [id])
  await makeSales(revue)
  await makeSales(future)
  ok('hard hosting deadline cannot exceed D plus thirty days', (await fails(`update public.revue_sales
    set stream_delete_at = stream_retire_at + interval '31 days' where revue_id = $1`, [revue])).failed)
  const makeVideo = async (id, title, kind = 'full', published = 'now()') => (await q(`insert into public.revue_videos
    (revue_id, title, kind, published_at) values ($1, $2, $3, ${published}) returning id`, [id, title, kind]))[0].id
  const video = await makeVideo(revue, 'Full performance')
  const act1 = await makeVideo(revue, 'Act one', 'act_1')
  const act2 = await makeVideo(revue, 'Act two', 'act_2')
  const clip = await makeVideo(revue, 'A sketch', 'clip')
  const draft = await makeVideo(revue, 'Not yet', 'clip', 'null')
  const unrevealed = await makeVideo(future, 'Hidden theme')
  const makeSource = async (vid, rev, provider, date = 'now()') => (await q(`insert into public.video_sources
    (video_id, revue_id, provider, state, published_at) values ($1, $2, $3, 'ready', ${date}) returning id`, [vid, rev, provider]))[0].id
  const cf = await makeSource(video, revue, 'cloudflare')
  const yt = await makeSource(video, revue, 'youtube', "now() + interval '1 day'")
  const hiddenSource = await makeSource(unrevealed, future, 'youtube')
  const draftSource = await makeSource(draft, revue, 'youtube')
  await q(`insert into public.cloudflare_video_sources(source_id, cloudflare_video_id) values ($1, 'private-video-uid')`, [cf])
  for (const id of [yt, hiddenSource, draftSource]) await q(`insert into public.youtube_video_sources(source_id, youtube_video_id) values ($1, 'abcdefghijk')`, [id])
  await q(`insert into public.revue_playlists(revue_id, youtube_playlist_id, published_at)
    values ($1, 'PL_test_playlist', now() + interval '1 day')`, [revue])
  await as('anon', null, async () => {
    ok('public video metadata excludes drafts and unrevealed revues', (await q(`select id from public.revue_videos where revue_id in ($1, $2)`, [revue, future])).length === 4)
    ok('scheduled, draft and unrevealed YouTube IDs are hidden', (await q(`select * from public.youtube_video_sources`)).length === 0)
    ok('playlist has an independent publication date', (await q(`select * from public.revue_playlists`)).length === 0)
    ok('anonymous API cannot read Cloudflare identifiers', (await fails(`select * from public.cloudflare_video_sources`)).failed)
    ok('anonymous API cannot invoke playback authorization', (await fails(`select public.can_play_source($1, $2)`, [buyer, cf])).failed)
  })
  await q(`update public.video_sources set published_at = now() where id = $1`, [yt])
  await q(`update public.revue_playlists set published_at = now() where revue_id = $1`, [revue])
  await as('anon', null, async () => {
    ok('published YouTube alternative is readable', (await q(`select * from public.youtube_video_sources`)).length === 1)
    ok('published playlist is readable alongside individual videos', (await q(`select * from public.revue_playlists`)).length === 1)
  })
  await as('authenticated', buyer, async () => {
    ok('normal viewer cannot read Cloudflare IDs', (await q(`select * from public.cloudflare_video_sources`)).length === 0)
    ok('normal viewer cannot request authorization for arbitrary user', (await fails(`select public.can_play_source($1, $2)`, [staff, cf])).failed)
  })
  const editor = await mk('video-editor@example.test', 'custom:vipps', {})
  await q(`update public.profiles set role = 'editor' where id = $1`, [editor])
  await as('authenticated', editor, async () => {
    const editorial = (await q(`insert into public.revue_videos(revue_id, title, kind)
      values ($1, 'Editorial draft', 'clip') returning id`, [revue]))[0].id
    const scheduled = (await q(`insert into public.video_sources(video_id, revue_id, provider, published_at)
      values ($1, $2, 'youtube', now() + interval '1 day') returning id`, [editorial, revue]))[0].id
    await q(`insert into public.youtube_video_sources(source_id, youtube_video_id) values ($1, '12345678901')`, [scheduled])
    ok('editor can create video metadata and scheduled YouTube links', (await q(`select 1 from public.youtube_video_sources where source_id = $1`, [scheduled])).length === 1)
    ok('editor cannot declare a source technically ready', (await fails(`update public.video_sources set state = 'ready' where id = $1`, [scheduled])).failed)
    ok('editor cannot read private Cloudflare identifiers', (await q(`select * from public.cloudflare_video_sources`)).length === 0)
    ok('referenced draft cannot be deleted before source cleanup', (await fails(`delete from public.revue_videos where id = $1`, [editorial])).failed)
    // Remove child rows first; video/source identity is deliberately restrictive.
    await q(`delete from public.youtube_video_sources where source_id = $1`, [scheduled])
  })
  ok('source cannot point into another revue', (await fails(`insert into public.video_sources
    (video_id, revue_id, provider) values ($1, $2, 'youtube')`, [video, future])).failed)
  ok('Cloudflare ID cannot be attached to YouTube source', (await fails(`insert into public.cloudflare_video_sources
    (source_id, cloudflare_video_id) values ($1, 'wrong-provider')`, [yt])).failed)
  ok('embed HTML cannot be used as a YouTube ID', (await fails(`update public.youtube_video_sources set youtube_video_id = '<iframe>' where source_id = $1`, [yt])).failed)
  await q(`insert into public.revue_video_selections(revue_id, full_video_id, featured_video_id) values ($1, $2, $3)`, [revue, video, clip])
  ok('main selection cannot mix full video and acts', (await fails(`update public.revue_video_selections
    set act_one_video_id = $2, act_two_video_id = $3 where revue_id = $1`, [revue, act1, act2])).failed)
  ok('main full performance cannot silently become a clip', (await fails(`update public.revue_videos set kind = 'clip' where id = $1`, [video])).failed)
  await q(`update public.revue_video_selections set full_video_id = null, act_one_video_id = $2, act_two_video_id = $3 where revue_id = $1`, [revue, act1, act2])
  ok('two matching acts replace one full performance', (await q(`select full_video_id from public.revue_video_selections where revue_id = $1`, [revue]))[0].full_video_id === null)
  ok('featured video cannot belong to another revue', (await fails(`update public.revue_video_selections set featured_video_id = $2 where revue_id = $1`, [revue, unrevealed])).failed)

  const order = (await q(`insert into public.orders(user_id, revue_id, status, amount, currency, terms_version)
    values ($1, $2, 'paid', 14900, 'nok', 'client-substitution') returning *`, [buyer, revue]))[0]
  ok('order takes its terms and first-show snapshot from server config', order.terms_version === 'terms-v1' && order.first_show_at && order.cancellation_deadline_at)
  const received = (await q(`update public.orders set refund_requested_at = '2000-01-01' where id = $1 returning refund_requested_at, created_at`, [order.id]))[0]
  ok('cancellation receipt time is assigned by the database, not backdated by the caller', new Date(received.refund_requested_at) >= new Date(received.created_at))
  ok('recorded cancellation receipt cannot be erased', (await fails(`update public.orders set refund_requested_at = null where id = $1`, [order.id])).failed)
  ok('order coverage cannot be moved to another revue', (await fails(`update public.orders set revue_id = $2 where id = $1`, [order.id, future])).failed)
  ok('second paid revue purchase is rejected', (await fails(`insert into public.orders(user_id, revue_id, status, amount)
    values ($1, $2, 'paid', 14900)`, [buyer, revue])).failed)
  ok('access cannot be granted to another orders owner', (await fails(`insert into public.revue_access
    (user_id, revue_id, source, order_id) values ($1, $2, 'purchase', $3)`, [outsider, revue, order.id])).failed)
  await q(`insert into public.revue_access(user_id, revue_id, source, order_id, granted_at)
    values ($1, $2, 'purchase', $3, now() - interval '6 years')`, [buyer, revue, order.id])
  const canPlay = async (user, src = cf) => (await q(`select public.can_play_source($1, $2) as allowed`, [user, src]))[0].allowed
  ok('unverified Cloudflare protection denies playback even after payment', !await canPlay(buyer))
  await q(`update public.cloudflare_video_sources set signed_urls_verified_at = now() where source_id = $1`, [cf])
  ok('six-year-old paid right still opens a currently hosted recording', await canPlay(buyer))
  await q(`update public.cloudflare_video_sources set scheduled_deletion_at = now() - interval '1 second' where source_id = $1`, [cf])
  ok('source-specific deletion deadline stops playback', !await canPlay(buyer))
  await q(`update public.cloudflare_video_sources set scheduled_deletion_at = null where source_id = $1`, [cf])
  await q(`update public.cloudflare_video_sources set cloudflare_video_id = 'replaced-video-uid' where source_id = $1`, [cf])
  ok('replacement video cannot reuse old signed-URL proof', !await canPlay(buyer))
  await q(`update public.cloudflare_video_sources set signed_urls_verified_at = now() where source_id = $1`, [cf])
  ok('replacement becomes playable after a fresh protection check', await canPlay(buyer))
  ok('admin role alone does not open paid playback', !await canPlay(staff))
  ok('another buyer without a revue right cannot play', !await canPlay(outsider))
  const lateVideo = await makeVideo(revue, 'Newly added second performance')
  const lateSource = await makeSource(lateVideo, revue, 'cloudflare')
  await q(`insert into public.cloudflare_video_sources(source_id, cloudflare_video_id, signed_urls_verified_at)
    values ($1, 'new-recording', now())`, [lateSource])
  ok('existing pass opens a later recording in the same revue', await canPlay(buyer, lateSource))
  await q(`update public.revue_videos set published_at = null where id = $1`, [lateVideo])
  ok('purchased access does not open a video draft', !await canPlay(buyer, lateSource))
  await q(`update public.revue_videos set published_at = now() where id = $1`, [lateVideo])
  await q(`update public.cloudflare_video_sources set deleted_at = now() where source_id = $1`, [lateSource])
  ok('removed physical source denies new tokens', !await canPlay(buyer, lateSource))
  await q(`update public.cloudflare_video_sources set deleted_at = null where source_id = $1`, [lateSource])
  ok('restored provider source must be reverified', !await canPlay(buyer, lateSource))
  await q(`update public.cloudflare_video_sources set signed_urls_verified_at = now() where source_id = $1`, [lateSource])
  ok('restored source uses the original entitlement', await canPlay(buyer, lateSource))
  ok('source deletion did not delete the order', (await q(`select 1 from public.orders where id = $1`, [order.id])).length === 1)

  const live = (await q(`insert into public.streams(revue_id, slug, title, starts_at, visible_from, status)
    values ($1, 'model-live', 'Live', now(), now(), 'live') returning id`, [revue]))[0].id
  await q(`insert into public.stream_playback(stream_id, cloudflare_live_input_id) values ($1, 'private-live-input')`, [live])
  const canLive = async (user) => (await q(`select public.can_play_stream($1, $2) as allowed`, [user, live]))[0].allowed
  ok('live input must be verified as protected before playback', !await canLive(buyer))
  await q(`update public.stream_playback set signed_urls_verified_at = now() where stream_id = $1`, [live])
  ok('same revue pass covers a newly added live stream', await canLive(buyer))
  await q(`update public.stream_playback set cloudflare_live_input_id = 'replacement-live-input' where stream_id = $1`, [live])
  ok('replacement live input loses old protection proof', !await canLive(buyer))
  await q(`update public.stream_playback set signed_urls_verified_at = now() where stream_id = $1`, [live])
  ok('admin role is not a live-viewing bypass', !await canLive(staff))
  await q(`update public.streams set visible_from = null where id = $1`, [live])
  ok('paid right does not reveal draft live metadata', !await canLive(buyer))
  await as('authenticated', buyer, async () => {
    ok('revue pass does not make a draft stream readable through legacy metadata RLS', (await q(`select id from public.streams where id = $1`, [live])).length === 0)
  })
  await q(`update public.streams set visible_from = now() where id = $1`, [live])

  await q(`insert into public.revue_member_groups(revue_id, lego_group_id) values ($1, '7001'), ($2, '7002')`, [revue, future])
  const grantInternal = `insert into public.revue_access(user_id, revue_id, source, verification_identity_id, lego_subject, lego_group_id, verified_at)
    values ($1, $2, 'internal', $3, $4, $5, now())`
  ok('wrong revue group cannot create internal entitlement', (await fails(grantInternal, [buyer, revue, identity, 'verified-subject', '7002'])).failed)
  ok('wrong account identity cannot create internal entitlement', (await fails(grantInternal, [outsider, revue, identity, 'verified-subject', '7001'])).failed)
  await q(grantInternal, [outsider, revue, otherIdentity, 'other-subject', '7001'])
  ok('correct group gives independent internal playback access', await canPlay(outsider))
  await q(`delete from auth.identities where id = $1`, [otherIdentity])
  ok('internal right survives AbaID unlinking', await canPlay(outsider))
  ok('internal right does not extend into next revue', !(await q(`select private.user_has_revue_access($1, $2) as allowed`, [outsider, future]))[0].allowed)
  await as('authenticated', outsider, async () => {
    ok('internal user cannot create or alter their own rights', (await fails(`update public.revue_access set revue_id = $1`, [future])).failed)
    ok('ordinary user cannot read configured private group IDs', (await q(`select * from public.revue_member_groups`)).length === 0)
  })
  await q(`delete from auth.identities where id = $1`, [identity])
  ok('unlinking removes current student eligibility', await priceType(buyer) === 'external')
  ok('unlinking does not remove purchased access', await canPlay(buyer))

  await q(`insert into public.order_refunds(order_id, provider_refund_id, amount, status, reason)
    values ($1, 'failed-refund', 14900, 'failed', 'cancellation')`, [order.id])
  ok('failed refund does not revoke access', await canPlay(buyer))
  ok('refund cannot exceed order amount', (await fails(`insert into public.order_refunds
    (order_id, provider_refund_id, amount, status, reason) values ($1, 'over-refund', 14901, 'pending', 'cancellation')`, [order.id])).failed)
  await q(`insert into public.order_refunds(order_id, provider_refund_id, amount, status, reason, completed_at)
    values ($1, 'full-refund', 14900, 'succeeded', 'cancellation', now())`, [order.id])
  ok('confirmed refund revokes only that purchase', !await canPlay(buyer) && await canPlay(outsider))
  ok('late paid webhook cannot reopen refunded order', (await fails(`update public.orders set status = 'paid' where id = $1`, [order.id])).failed)
  ok('completed refund cannot be rewritten', (await fails(`update public.order_refunds set amount = 1 where provider_refund_id = 'full-refund'`)).failed)
  const repurchase = (await q(`insert into public.orders(user_id, revue_id, status, amount)
    values ($1, $2, 'paid', 14900) returning id`, [buyer, revue]))[0].id
  await q(`insert into public.revue_access(user_id, revue_id, source, order_id) values ($1, $2, 'purchase', $3)`, [buyer, revue, repurchase])
  ok('repurchase preserves old order and opens access again', await canPlay(buyer) && (await q(`select 1 from public.orders where user_id = $1 and revue_id = $2`, [buyer, revue])).length === 2)
  await q(`insert into public.order_refunds(order_id, provider_refund_id, amount, status, reason, completed_at)
    values ($1, 'price-reduction', 100, 'succeeded', 'compensation', now())`, [repurchase])
  ok('compensation is not blindly treated as cancellation', await canPlay(buyer))
  await q(`insert into public.order_refunds(order_id, provider_refund_id, amount, status, reason, completed_at)
    values ($1, 'external-partial-cancel', 100, 'succeeded', 'cancellation', now())`, [repurchase])
  ok('external partial cancellation revokes the purchased right', !await canPlay(buyer))
  await q(`update public.revue_sales set first_show_at = now() - interval '6 years',
    stream_retire_at = now() - interval '30 days', stream_delete_at = now() - interval '1 day' where revue_id = $1`, [revue])
  ok('hard revue hosting deadline stops playback even with an internal right', !await canPlay(outsider))
  ok('hard deadline does not erase the permanent entitlement', (await q(`select private.user_has_revue_access($1, $2) as allowed`, [outsider, revue]))[0].allowed)
  await q(`update public.revue_sales set stream_retire_at = now() + interval '1 day', stream_delete_at = now() + interval '20 days' where revue_id = $1`, [revue])
  ok('explicitly restored hosting reuses the existing internal right', await canPlay(outsider))

  // A transaction gives all three boundary cases exactly the same server time.
  await db.exec('begin')
  for (const [year, offset, expected] of [[2102, "1 microsecond", true], [2103, "0 seconds", true], [2104, "-1 microsecond", false], [2105, "-3 days", false]]) {
    const id = (await q(`insert into public.revues(year, slug) values ($1, $2) returning id`, [year, 'cutoff-' + year]))[0].id
    await makeSales(id, `now() + interval '2 hours' + interval '${offset}'`)
    const purchase = (await q(`insert into public.orders(user_id, revue_id, status, amount) values ($1, $2, 'paid', 100) returning id`, [buyer, id]))[0].id
    ok('shared cancellation cutoff boundary ' + offset, (await q(`select public.order_cancellation_allowed($1) as allowed`, [purchase]))[0].allowed === expected)
  }
  await db.exec('commit')
  ok('closed first-show window cannot be moved to a future show', (await fails(`update public.revue_sales
    set first_show_at = now() + interval '10 days' where revue_id = (select id from public.revues where year = 2105)`)).failed)
  await q(`delete from auth.users where id = $1`, [buyer])
  ok('account deletion retains revue orders with no user', (await q(`select user_id from public.orders where id = $1`, [order.id]))[0].user_id === null)
  ok('account deletion removes owned current verification and rights', (await q(`select 1 from public.revue_access where user_id = $1`, [buyer])).length === 0)
  await runUpgradeTest(ok)
}

async function runUpgradeTest(ok) {
  const legacy = {}
  const { db } = await createTestDatabase(async (db) => {
    const q = async (sql, params) => (await db.query(sql, params)).rows
    legacy.user = (await q(`insert into auth.users(email, raw_app_meta_data) values ('legacy@example.test', '{"provider":"custom:abakus"}') returning id`))[0].id
    legacy.revue = (await q(`insert into public.revues(year, slug) values (2090, 'upgrade-test') returning id`))[0].id
    legacy.orders = []
    for (const slug of ['first', 'second']) {
      const stream = (await q(`insert into public.streams(revue_id, slug, title, starts_at) values ($1, $2, 'Legacy recording', now()) returning id`, [legacy.revue, slug]))[0].id
      const order = (await q(`insert into public.orders(user_id, stream_id, status, amount) values ($1, $2, 'paid', 100) returning id`, [legacy.user, stream]))[0].id
      legacy.orders.push(order)
      await q(`insert into public.stream_access(user_id, stream_id, source, order_id) values ($1, $2, 'purchase', $3)`, [legacy.user, stream, order])
      await q(`insert into public.stream_playback(stream_id, cloudflare_video_id) values ($1, $2)`, [stream, 'old-' + slug])
      await q(`insert into public.stream_prices(stream_id, user_type, amount) values ($1, 'external', 100)`, [stream])
    }
  })
  const rows = async (sql) => (await db.query(sql)).rows
  ok('upgrade resets provider-only student eligibility', (await rows(`select user_type from public.profiles`))[0].user_type === 'external')
  ok('upgrade preserves both independent paid order references', (await rows(`select order_id from public.revue_access`)).length === 2)
  ok('upgrade preserves every existing Cloudflare recording identifier', (await rows(`select cloudflare_video_id from public.cloudflare_video_sources`)).length === 2)
  ok('upgrade does not pretend old Cloudflare sources are verified or ready', (await rows(`select 1 from public.cloudflare_video_sources where signed_urls_verified_at is not null`)).length === 0)
  ok('upgrade does not guess hosting deadlines or reopen sales', (await rows(`select 1 from public.revue_sales`)).length === 0)
  ok('upgrade maps consistent prices without discarding originals', (await rows(`select amount from public.revue_prices`))[0].amount === 100 && (await rows(`select 1 from public.stream_prices`)).length === 2)
  await db.query(`update public.orders set status = 'refunded' where id = $1`, [legacy.orders[0]])
  ok('refund of one migrated purchase preserves another independent right', (await db.query(`select private.user_has_revue_access($1, $2) as allowed`, [legacy.user, legacy.revue])).rows[0].allowed)
  await db.close()
}
