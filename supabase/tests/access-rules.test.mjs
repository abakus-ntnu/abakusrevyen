// Tests the migrations in ../migrations against a local Postgres (PGlite), with
// stand-ins for the parts a Supabase project provides: the auth schema, the anon,
// authenticated and service_role roles, and Realtime. Checks the access rules as
// anonymous visitor, viewer, moderator, editor, admin and service role.
//
// Run from the repo root:
//   pnpm test:db
import { PGlite } from '@electric-sql/pglite'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const db = new PGlite()
const dir = fileURLToPath(new URL('../migrations/', import.meta.url))
const migrations = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()

// Stand-ins for what a Supabase project already has.
await db.exec(`
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;
  create schema auth;
  create table auth.users (
    id uuid primary key default gen_random_uuid(),
    email text,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb
  );
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;
  grant usage on schema public, auth to anon, authenticated, service_role;
  create publication supabase_realtime;
  create schema realtime;
  create table realtime.messages (
    id uuid primary key default gen_random_uuid(),
    topic text not null,
    extension text not null,
    payload jsonb,
    event text,
    private boolean default false,
    inserted_at timestamp not null default now()
  );
  alter table realtime.messages enable row level security;
  create function realtime.topic() returns text language sql stable as $$
    select nullif(current_setting('realtime.topic', true), '')
  $$;
  create function realtime.send(payload jsonb, event text, topic text, private boolean default true)
  returns void language plpgsql as $$
  begin
    insert into realtime.messages (payload, event, topic, private, extension)
    values (payload, event, topic, private, 'broadcast');
  end $$;
  grant usage on schema realtime to anon, authenticated, service_role;
  grant select, insert on realtime.messages to authenticated;
`)

for (const file of migrations) await db.exec(readFileSync(dir + file, 'utf8'))
console.log(`${migrations.length} migrations applied`)

let pass = 0
let fail = 0
const ok = (name, cond, extra = '') => {
  if (cond) pass++
  else fail++
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${cond ? '' : '  ' + extra}`)
}

const as = async (role, uid, fn) => {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${uid ?? ''}', false); set role ${role};`)
  try {
    return await fn()
  } finally {
    await db.exec(`reset role; select set_config('request.jwt.claim.sub', '', false);`)
  }
}
const q = async (sql, params) => (await db.query(sql, params)).rows
const sent = async () => q(`select topic, event, payload, private, extension from realtime.messages order by inserted_at, event`)
// What Realtime does on join: look at realtime.messages as the user, with the topic set.
const canJoin = async (role, uid, topic) => {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${''}', false);`)
  await db.query(`select set_config('request.jwt.claim.sub', $1, false), set_config('realtime.topic', $2, false)`, [uid ?? '', topic])
  await db.exec(`set role ${role}`)
  try {
    return (await db.query(`select count(*)::int as n from realtime.messages`)).rows[0].n > 0
  } catch (e) {
    return 'error: ' + e.message
  } finally {
    await db.exec(`reset role; select set_config('request.jwt.claim.sub', '', false), set_config('realtime.topic', '', false);`)
  }
}
await db.exec(`create function public.test_sent() returns jsonb language sql security definer as $$
  select coalesce(jsonb_agg(to_jsonb(m) order by m.inserted_at, m.event), '[]'::jsonb) from realtime.messages m $$;`)
const as_superuser_sent = async () => (await db.query(`select public.test_sent() as s`)).rows[0].s
const fails = async (sql, params) => {
  try {
    const r = await db.query(sql, params)
    return { failed: false, affected: r.affectedRows }
  } catch (e) {
    return { failed: true, msg: e.message }
  }
}

// --- users ---------------------------------------------------------------
const mk = async (email, provider, meta) =>
  (await q(
    `insert into auth.users (email, raw_app_meta_data, raw_user_meta_data) values ($1, $2, $3) returning id`,
    [email, { provider }, meta]
  ))[0].id

const student = await mk('ola@stud.ntnu.no', 'custom:abakus', { full_name: 'Ola Student' })
const external = await mk('kari@example.com', 'custom:vipps', { name: 'Kari Ekstern' })
const other = await mk('per@example.com', 'custom:vipps', {})
const admin = await mk('admin@abakus.no', 'custom:abakus', { full_name: 'Admin' })
const mod = await mk('mod@abakus.no', 'custom:abakus', { full_name: 'Mod' })
const editor = await mk('pr@abakus.no', 'custom:abakus', { full_name: 'PR' })
await db.query(`update public.profiles set role = 'admin' where id = $1`, [admin])
await db.query(`update public.profiles set role = 'moderator' where id = $1`, [mod])
await db.query(`update public.profiles set role = 'editor' where id = $1`, [editor])

const profs = await q(`select id, display_name, user_type from public.profiles`)
const prof = (id) => profs.find((p) => p.id === id)
ok('profile created for student with type student', prof(student)?.user_type === 'student' && prof(student)?.display_name === 'Ola Student')
ok('profile created for vipps user with type external', prof(external)?.user_type === 'external' && prof(external)?.display_name === 'Kari Ekstern')
ok('display name falls back to email local part', prof(other)?.display_name === 'per')

// --- content -------------------------------------------------------------
const revue = (await q(`insert into public.revues (year, slug, teaser, visible_from, name_reveal_at, is_current)
  values (2027, 'revy-2027', 'Noe stort kommer', now() - interval '1 day', now() + interval '7 days', true) returning id`))[0].id
await db.query(`insert into public.revue_details (revue_id, name, tagline) values ($1, 'Hemmelig navn', 'Tagline')`, [revue])
const hiddenRevue = (await q(`insert into public.revues (year, slug) values (2028, 'revy-2028') returning id`))[0].id
await db.query(`insert into public.ticket_links (revue_id, label, url, visible_from) values
  ($1, 'Premiere', 'https://example.com/a', now() + interval '1 day'),
  ($1, 'Fredag', 'https://example.com/b', now() - interval '1 day')`, [revue])
await db.query(`insert into public.ticket_links (revue_id, label, url, visible_from, visible_until) values
  ($1, 'Utgaatt', 'https://example.com/c', now() - interval '3 days', now() - interval '1 day'),
  ($1, 'Ikke planlagt', 'https://example.com/d', null, null)`, [revue])

const stream = (await q(`insert into public.streams (revue_id, slug, title, starts_at, visible_from, sales_open_at)
  values ($1, 'premiere', 'Premiere', now() + interval '2 days', now() - interval '1 hour', now()) returning id`, [revue]))[0].id
const hiddenStream = (await q(`insert into public.streams (revue_id, slug, title, starts_at)
  values ($1, 'lordag', 'Lordag', now() + interval '3 days') returning id`, [revue]))[0].id
await db.query(`insert into public.stream_prices (stream_id, user_type, amount) values
  ($1, 'student', 9900), ($1, 'external', 14900), ($2, 'student', 9900)`, [stream, hiddenStream])
await db.query(`insert into public.stream_playback (stream_id, cloudflare_live_input_id) values ($1, 'cf-live-123')`, [stream])
await db.query(`insert into public.posts (slug, title, body, published_at) values
  ('ute', 'Ute', 'x', now() - interval '1 hour'), ('kladd', 'Kladd', 'x', null), ('planlagt', 'Planlagt', 'x', now() + interval '1 day')`)
const album = (await q(`insert into public.gallery_albums (slug, title, published_at) values ('premiere', 'Premiere', now() - interval '1 hour') returning id`))[0].id
const draftAlbum = (await q(`insert into public.gallery_albums (slug, title) values ('kladd', 'Kladd') returning id`))[0].id
await db.query(`insert into public.gallery_photos (album_id, storage_path) values ($1, 'a/1.jpg'), ($2, 'b/1.jpg')`, [album, draftAlbum])
await db.query(`insert into public.site_settings (key, value, is_public, visible_from) values
  ('hero.banner', '{"text":"hei"}', true, null),
  ('internal.flag', 'true', false, null),
  ('later.banner', '"x"', true, now() + interval '1 day')`)

// --- anon ----------------------------------------------------------------
await as('anon', null, async () => {
  const revues = await q(`select slug from public.revues`)
  ok('anon sees only the visible revue', revues.length === 1 && revues[0].slug === 'revy-2027')
  ok('anon cannot read the name before the reveal', (await q(`select * from public.revue_details`)).length === 0)
  const links = await q(`select label from public.ticket_links`)
  ok('anon sees only ticket links inside their window', links.length === 1 && links[0].label === 'Fredag', JSON.stringify(links))
  const streams = await q(`select slug from public.streams`)
  ok('anon sees only the visible stream', streams.length === 1 && streams[0].slug === 'premiere')
  ok('anon sees prices only for the visible stream', (await q(`select * from public.stream_prices`)).length === 2)
  ok('anon cannot read stream_playback', (await fails(`select * from public.stream_playback`)).failed)
  ok('anon cannot read profiles', (await fails(`select * from public.profiles`)).failed)
  ok('anon cannot read chat', (await fails(`select * from public.chat_messages`)).failed)
  ok('anon cannot read orders', (await fails(`select * from public.orders`)).failed)
  ok('anon cannot read stripe_events', (await fails(`select * from public.stripe_events`)).failed)
  const posts = await q(`select slug from public.posts`)
  ok('anon sees only published posts', posts.length === 1 && posts[0].slug === 'ute')
  ok('anon sees only published albums', (await q(`select * from public.gallery_albums`)).length === 1)
  ok('anon sees photos only from published albums', (await q(`select * from public.gallery_photos`)).length === 1)
  const settings = await q(`select key from public.site_settings`)
  ok('anon sees only public settings inside their window', settings.length === 1 && settings[0].key === 'hero.banner')
  ok('anon cannot insert posts', (await fails(`insert into public.posts (slug, title) values ('hack', 'Hack')`)).failed)
})

// --- reveal ----------------------------------------------------------------
await db.query(`update public.revues set name_reveal_at = now() - interval '1 minute' where id = $1`, [revue])
await as('anon', null, async () => {
  const d = await q(`select name from public.revue_details`)
  ok('anon reads the name after the reveal', d.length === 1 && d[0].name === 'Hemmelig navn')
})

// --- signed-in user without access -----------------------------------------
await as('authenticated', external, async () => {
  const p = await q(`select id from public.profiles`)
  ok('user reads only their own profile', p.length === 1 && p[0].id === external)
  ok('user cannot change their user_type', (await fails(`update public.profiles set user_type = 'student' where id = $1`, [external])).failed)
  ok('user cannot change their role', (await fails(`update public.profiles set role = 'admin' where id = $1`, [external])).failed)
  const r = await fails(`update public.profiles set display_name = 'Kari K' where id = $1`, [external])
  ok('user can change their display name', !r.failed && r.affected === 1, JSON.stringify(r))
  const r2 = await fails(`update public.profiles set display_name = 'Hacked' where id = $1`, [student])
  ok('user cannot change another profile', !r2.failed && r2.affected === 0, JSON.stringify(r2))
  ok('user cannot grant themselves access', (await fails(`insert into public.stream_access (user_id, stream_id, source) values ($1, $2, 'granted')`, [external, stream])).failed)
  ok('user cannot create an order', (await fails(`insert into public.orders (user_id, stream_id, amount) values ($1, $2, 0)`, [external, stream])).failed)
  ok('user without access cannot post in chat', (await fails(`insert into public.chat_messages (stream_id, body) values ($1, 'hei')`, [stream])).failed)
  ok('user without access does not see the hidden stream', (await q(`select * from public.streams`)).length === 1)
  ok('user cannot read stream_playback rows', (await q(`select * from public.stream_playback`)).length === 0)
  ok('user cannot insert posts', (await fails(`insert into public.posts (slug, title) values ('hack', 'Hack')`)).failed)
})

// --- purchase, done by the Worker with the service role ---------------------
await as('service_role', null, async () => {
  const order = (await q(`insert into public.orders (user_id, stream_id, status, amount, stripe_checkout_session_id, paid_at)
    values ($1, $2, 'paid', 14900, 'cs_test_1', now()) returning id`, [external, stream]))[0].id
  await db.query(`insert into public.stream_access (user_id, stream_id, source, order_id) values ($1, $2, 'purchase', $3)`, [external, stream, order])
  await db.query(`insert into public.stream_access (user_id, stream_id, source, note) values ($1, $2, 'granted', 'skuespiller')`, [student, hiddenStream])
  await db.query(`insert into public.stripe_events (id, type, payload) values ('evt_1', 'checkout.session.completed', '{}')`)
  ok('service role writes orders, access and stripe events', true)
  ok('a second paid order for the same user and stream is rejected', (await fails(`insert into public.orders (user_id, stream_id, status, amount) values ($1, $2, 'paid', 14900)`, [external, stream])).failed)
  ok('a redelivered stripe event is rejected', (await fails(`insert into public.stripe_events (id, type, payload) values ('evt_1', 'x', '{}')`)).failed)
  const pb = await q(`select cloudflare_live_input_id from public.stream_playback where stream_id = $1`, [stream])
  ok('service role reads stream_playback', pb.length === 1)
})

// --- viewer with access ------------------------------------------------------
await as('authenticated', external, async () => {
  ok('user sees their own order', (await q(`select * from public.orders`)).length === 1)
  ok('user sees their own access row', (await q(`select * from public.stream_access`)).length === 1)
  const m = await q(`insert into public.chat_messages (stream_id, body) values ($1, 'Gleder meg!') returning id, user_id, display_name`, [stream])
  ok('viewer posts in chat and the name is filled in', m[0]?.user_id === external && m[0]?.display_name === 'Kari K', JSON.stringify(m))
  const b = await as_superuser_sent()
  ok('a new message is broadcast once to the private chat topic', b.length === 1 && b[0].topic === 'chat:' + stream && b[0].event === 'message' && b[0].private === true && b[0].extension === 'broadcast', JSON.stringify(b))
  ok('the broadcast carries the message fields', b[0]?.payload.body === 'Gleder meg!' && b[0]?.payload.display_name === 'Kari K' && b[0]?.payload.user_id === external && b[0]?.payload.id === Number(m[0].id) && b[0]?.payload.stream_id === stream, JSON.stringify(b[0]?.payload))
  ok('viewer cannot broadcast to the topic directly', (await fails(`insert into realtime.messages (topic, extension, event, payload, private) values ($1, 'broadcast', 'message', '{"body":"fake"}', true)`, ['chat:' + stream])).failed)
  ok('viewer cannot set display_name on a message', (await fails(`insert into public.chat_messages (stream_id, body, display_name) values ($1, 'x', 'Admin')`, [stream])).failed)
  ok('viewer cannot post as someone else', (await fails(`insert into public.chat_messages (stream_id, body, user_id) values ($1, 'x', $2)`, [stream, student])).failed)
  ok('viewer cannot post an empty message', (await fails(`insert into public.chat_messages (stream_id, body) values ($1, '')`, [stream])).failed)
  ok('viewer cannot post in a stream they have no access to', (await fails(`insert into public.chat_messages (stream_id, body) values ($1, 'x')`, [hiddenStream])).failed)
  const r = await fails(`update public.chat_messages set deleted_at = now()`)
  ok('viewer cannot hide messages', !r.failed && r.affected === 0, JSON.stringify(r))
  ok('viewer cannot edit a message body', (await fails(`update public.chat_messages set body = 'edited'`)).failed)
})

await as('authenticated', student, async () => {
  const s = await q(`select slug from public.streams order by slug`)
  ok('user with granted access sees the hidden stream', s.length === 2, JSON.stringify(s))
  ok('user sees no chat from a stream they lack access to', (await q(`select * from public.chat_messages`)).length === 0)
})

// --- joining the chat topic ---------------------------------------------------
ok('viewer with access can join the chat topic', (await canJoin('authenticated', external, 'chat:' + stream)) === true)
ok('viewer cannot join the chat topic of another stream', (await canJoin('authenticated', external, 'chat:' + hiddenStream)) === false)
ok('user without access cannot join the chat topic', (await canJoin('authenticated', other, 'chat:' + stream)) === false)
ok('granted access lets a user join that stream chat', (await canJoin('authenticated', student, 'chat:' + hiddenStream)) === true)
ok('moderator can join any chat topic', (await canJoin('authenticated', mod, 'chat:' + stream)) === true)
ok('nobody joins a topic that is not a chat topic', (await canJoin('authenticated', admin, 'something-else')) === false)
ok('a malformed chat topic is refused without an error', (await canJoin('authenticated', admin, 'chat:not-a-uuid')) === false)
ok('anonymous visitors cannot join the chat topic', (await canJoin('anon', null, 'chat:' + stream)) !== true)

// --- moderation --------------------------------------------------------------
await as('authenticated', mod, async () => {
  const msgs = await q(`select id from public.chat_messages`)
  ok('moderator reads all chat', msgs.length === 1)
  const r = await fails(`update public.chat_messages set deleted_at = now(), deleted_by = $1 where id = $2`, [mod, msgs[0].id])
  ok('moderator hides a message', !r.failed && r.affected === 1, JSON.stringify(r))
  const h = (await as_superuser_sent()).filter((x) => x.event === 'message_hidden')
  ok('hiding a message broadcasts message_hidden without the text', h.length === 1 && h[0].topic === 'chat:' + stream && h[0].payload.id === Number(msgs[0].id) && !('body' in h[0].payload), JSON.stringify(h))
  await db.query(`update public.chat_messages set deleted_at = null, deleted_by = null where id = $1`, [msgs[0].id])
  const r2 = (await as_superuser_sent()).filter((x) => x.event === 'message_restored')
  ok('restoring a message broadcasts it again', r2.length === 1 && r2[0].payload.body === 'Gleder meg!', JSON.stringify(r2))
  const b = await fails(`insert into public.chat_bans (user_id, stream_id, reason) values ($1, $2, 'spam')`, [external, stream])
  ok('moderator bans a user', !b.failed, JSON.stringify(b))
  ok('moderator cannot read the unrevealed revue', (await q(`select * from public.revues`)).length === 1)
  ok('moderator cannot edit streams', (await fails(`update public.streams set title = 'x'`)).affected === 0)
})

await as('authenticated', external, async () => {
  ok('banned user cannot post', (await fails(`insert into public.chat_messages (stream_id, body) values ($1, 'x')`, [stream])).failed)
  ok('banned user sees their ban', (await q(`select * from public.chat_bans`)).length === 1)
  ok('banned user still reads the chat', (await q(`select * from public.chat_messages`)).length === 1)
})

await db.query(`delete from public.chat_bans`)
await db.query(`update public.streams set chat_enabled = false where id = $1`, [stream])
await as('authenticated', external, async () => {
  ok('nobody posts when chat is switched off', (await fails(`insert into public.chat_messages (stream_id, body) values ($1, 'x')`, [stream])).failed)
})

// refund
await db.query(`update public.stream_access set revoked_at = now() where user_id = $1`, [external])
await as('authenticated', external, async () => {
  ok('revoked access hides the chat again', (await q(`select * from public.chat_messages`)).length === 0)
})

ok('revoked access cannot join the chat topic', (await canJoin('authenticated', external, 'chat:' + stream)) === false)

// --- editor and admin --------------------------------------------------------
await as('authenticated', editor, async () => {
  ok('editor reads drafts', (await q(`select * from public.posts`)).length === 3)
  const r = await fails(`insert into public.posts (slug, title, body) values ('ny', 'Ny', 'tekst')`)
  ok('editor writes posts', !r.failed, JSON.stringify(r))
  ok('editor reads hidden revues', (await q(`select * from public.revues`)).length === 2)
  ok('editor cannot create streams', (await fails(`insert into public.streams (revue_id, slug, title, starts_at) values ($1, 'x', 'x', now())`, [revue])).failed)
  ok('editor cannot read stream_playback rows', (await q(`select * from public.stream_playback`)).length === 0)
  ok('editor cannot read non-public settings', (await q(`select * from public.site_settings`)).length === 1)
})

await as('authenticated', admin, async () => {
  ok('admin reads all profiles', (await q(`select * from public.profiles`)).length === 6)
  ok('admin reads stream_playback', (await q(`select * from public.stream_playback`)).length === 1)
  ok('admin reads all settings', (await q(`select * from public.site_settings`)).length === 3)
  const r = await fails(`insert into public.stream_access (user_id, stream_id, source, granted_by) values ($1, $2, 'granted', $3)`, [other, stream, admin])
  ok('admin grants access', !r.failed, JSON.stringify(r))
  const s = await fails(`update public.streams set status = 'live' where id = $1`, [stream])
  ok('admin updates a stream', !s.failed && s.affected === 1, JSON.stringify(s))
  ok('admin cannot change roles through the API', (await fails(`update public.profiles set role = 'admin' where id = $1`, [other])).failed)
})

// --- shows -------------------------------------------------------------------
const show = (await q(`insert into public.shows (revue_id, title, starts_at, doors_open_at, venue_name, venue_address, visible_from)
  values ($1, 'Lordag kveld', now() + interval '3 days', now() + interval '3 days' - interval '30 minutes', 'Byscenen', 'Kongens gate 19, Trondheim', now() - interval '1 hour') returning id`, [revue]))[0].id
const hiddenShow = (await q(`insert into public.shows (revue_id, title, starts_at) values ($1, 'Ekstraforestilling', now() + interval '4 days') returning id`, [revue]))[0].id
const otherRevueShow = (await q(`insert into public.shows (revue_id, title, starts_at, visible_from) values ($1, 'Neste aar', now() + interval '400 days', now()) returning id`, [hiddenRevue]))[0].id
await db.query(`insert into public.ticket_links (revue_id, show_id, label, url, visible_from) values
  ($1, $2, 'Billetter lordag', 'https://example.com/lordag', now() + interval '1 day')`, [revue, show])
await db.query(`update public.streams set show_id = $1 where id = $2`, [show, hiddenStream])

await as('anon', null, async () => {
  const s = await q(`select title, venue_name, venue_address, starts_at from public.shows`)
  ok('anon sees time and place of visible shows only', s.length === 2 && s.some((r) => r.venue_name === 'Byscenen' && r.venue_address && r.starts_at), JSON.stringify(s))
  ok('anon sees the show before its ticket link is visible', (await q(`select 1 from public.ticket_links where label = 'Billetter lordag'`)).length === 0)
  ok('anon cannot insert shows', (await fails(`insert into public.shows (revue_id, title, starts_at) values ($1, 'x', now())`, [revue])).failed)
})
await db.query(`update public.ticket_links set visible_from = now() - interval '1 minute' where label = 'Billetter lordag'`)
await as('anon', null, async () => {
  const l = await q(`select t.url, s.title from public.ticket_links t join public.shows s on s.id = t.show_id where t.label = 'Billetter lordag'`)
  ok('anon reads the ticket link with its show once the window opens', l.length === 1 && l[0].title === 'Lordag kveld', JSON.stringify(l))
})
await as('authenticated', student, async () => {
  ok('ordinary user cannot edit shows', (await fails(`update public.shows set is_sold_out = true`)).affected === 0)
})
await as('authenticated', editor, async () => {
  ok('editor reads hidden shows', (await q(`select * from public.shows`)).length === 3)
  const r = await fails(`update public.shows set is_sold_out = true where id = $1`, [show])
  ok('editor marks a show sold out', !r.failed && r.affected === 1, JSON.stringify(r))
  const i = await fails(`insert into public.shows (revue_id, title, starts_at, venue_name) values ($1, 'Sondag', now() + interval '5 days', 'Byscenen')`, [revue])
  ok('editor adds a show', !i.failed, JSON.stringify(i))
})
ok('a ticket link cannot point to a show of another revue', (await fails(`insert into public.ticket_links (revue_id, show_id, label, url) values ($1, $2, 'x', 'https://example.com/x')`, [revue, otherRevueShow])).failed)
ok('a stream cannot point to a show of another revue', (await fails(`update public.streams set show_id = $1 where id = $2`, [otherRevueShow, stream])).failed)
ok('doors cannot open after the show starts', (await fails(`insert into public.shows (revue_id, title, starts_at, doors_open_at) values ($1, 'x', now(), now() + interval '1 hour')`, [revue])).failed)
await db.query(`delete from public.shows where id = $1`, [show])
const after = await q(`select show_id, revue_id from public.streams where id = $1`, [hiddenStream])
ok('deleting a show unlinks its stream and keeps the stream', after.length === 1 && after[0].show_id === null && after[0].revue_id === revue, JSON.stringify(after))
ok('deleting a show removes its ticket links', (await q(`select 1 from public.ticket_links where label = 'Billetter lordag'`)).length === 0)

// --- integrity ---------------------------------------------------------------
ok('only one current revue', (await fails(`insert into public.revues (year, slug, is_current) values (2029, 'revy-2029', true)`)).failed)
ok('a stream with orders cannot be deleted', (await fails(`delete from public.streams where id = $1`, [stream])).failed)
await db.query(`delete from auth.users where id = $1`, [external])
const kept = await q(`select user_id from public.orders`)
ok('deleting a user keeps the order without the user', kept.length === 1 && kept[0].user_id === null)
const afterDelete = (await as_superuser_sent()).filter((x) => x.event === 'message_hidden')
ok('deleting a user tells clients to hide their messages', afterDelete.length === 2, JSON.stringify(afterDelete))
ok('deleting a user removes profile, access and chat', (await q(`select 1 from public.profiles where id = $1`, [external])).length === 0
  && (await q(`select 1 from public.chat_messages`)).length === 0)
const pub = await q(`select tablename from pg_publication_tables where pubname = 'supabase_realtime' order by 1`)
ok('only streams is left in the realtime publication', pub.map((r) => r.tablename).join() === 'streams', JSON.stringify(pub))
const cols = await q(`select 1 from information_schema.columns where table_schema = 'public' and table_name = 'ticket_links' and column_name = 'show_starts_at'`)
ok('ticket_links.show_starts_at is gone', cols.length === 0)
const norls = await q(`select relname from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity`)
ok('every public table has RLS enabled', norls.length === 0, JSON.stringify(norls))

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
