-- Abakusrevyen streaming site: initial schema
--
-- Conventions
--   * Every table has RLS enabled. Table privileges are granted explicitly, so
--     nothing depends on the project's default grants.
--   * RLS hides rows, not columns. Anything that must stay secret while the rest
--     of a row is public lives in its own table (revue_details, stream_playback).
--   * Content tables use nullable timestamps for scheduling. NULL means "not
--     scheduled yet", which is treated as hidden.
--   * Money is stored in minor units (øre) as integers.
--   * Writes that follow from a payment (orders, purchased stream_access,
--     stripe_events) are done by the Cloudflare Worker with the service role key.

-- ---------------------------------------------------------------------------
-- Schemas and enums
-- ---------------------------------------------------------------------------

-- Helper functions live here so they are not callable through the Data API.
create schema if not exists private;
grant usage on schema private to anon, authenticated, service_role;

create type public.user_type as enum ('student', 'external');
create type public.app_role as enum ('user', 'moderator', 'editor', 'admin');
create type public.stream_status as enum ('scheduled', 'live', 'ended', 'cancelled');
create type public.order_status as enum ('pending', 'paid', 'failed', 'expired', 'refunded');
create type public.access_source as enum ('purchase', 'granted');

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Profiles (one per auth user)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 60),
  avatar_url text,
  user_type public.user_type not null default 'external',
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'One row per auth user. Readable only by the user and admins, so names from Vipps are not exposed.';
comment on column public.profiles.user_type is
  'student = signed in through Abakus OAuth, external = everyone else. Decides which stream price applies. Not editable by the user.';
comment on column public.profiles.role is
  'user, moderator (chat), editor (content) or admin (everything). Change it from the dashboard or with the service role.';

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function private.set_updated_at();

-- Creates the profile when a user signs up. The provider check assumes the
-- Abakus OAuth provider id contains "abakus".
create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  _provider text := coalesce(new.raw_app_meta_data ->> 'provider', '');
  _name text := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'Anonym'
  );
begin
  insert into public.profiles (id, display_name, avatar_url, user_type)
  values (
    new.id,
    left(_name, 60),
    new.raw_user_meta_data ->> 'avatar_url',
    case
      when _provider ilike '%abakus%' then 'student'::public.user_type
      else 'external'::public.user_type
    end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- Role helpers used by the RLS policies.
create function private.user_role()
returns public.app_role
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select p.role from public.profiles p where p.id = (select auth.uid())),
    'user'::public.app_role
  );
$$;

create function private.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select private.user_role() = 'admin';
$$;

create function private.is_editor()
returns boolean
language sql
stable
set search_path = ''
as $$
  select private.user_role() in ('editor', 'admin');
$$;

create function private.is_moderator()
returns boolean
language sql
stable
set search_path = ''
as $$
  select private.user_role() in ('moderator', 'admin');
$$;

create function private.is_staff()
returns boolean
language sql
stable
set search_path = ''
as $$
  select private.user_role() <> 'user';
$$;

-- ---------------------------------------------------------------------------
-- Revues, the name reveal and ticket links
-- ---------------------------------------------------------------------------

create table public.revues (
  id uuid primary key default gen_random_uuid(),
  year smallint not null unique,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  teaser text,
  visible_from timestamptz,
  name_reveal_at timestamptz,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.revues is
  'One row per year. Holds only what may be public before the name reveal. The name itself is in revue_details.';
comment on column public.revues.teaser is 'Text shown before the name is revealed.';
comment on column public.revues.visible_from is 'When the revue shows up on the website. NULL = hidden.';
comment on column public.revues.name_reveal_at is 'When revue_details becomes readable. NULL = not revealed.';
comment on column public.revues.is_current is 'The revue the front page is about. At most one row can be true.';

create unique index revues_one_current_idx on public.revues (is_current) where is_current;

create trigger revues_set_updated_at
  before update on public.revues
  for each row execute function private.set_updated_at();

create table public.revue_details (
  revue_id uuid primary key references public.revues (id) on delete cascade,
  name text not null,
  tagline text,
  description text,
  poster_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.revue_details is
  'Name, tagline, description and poster of a revue. Readable by the public only after revues.name_reveal_at.';

create trigger revue_details_set_updated_at
  before update on public.revue_details
  for each row execute function private.set_updated_at();

create table public.ticket_links (
  id uuid primary key default gen_random_uuid(),
  revue_id uuid not null references public.revues (id) on delete cascade,
  label text not null,
  description text,
  url text not null check (url ~ '^https?://'),
  show_starts_at timestamptz,
  visible_from timestamptz,
  visible_until timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (visible_from is null or visible_until is null or visible_until > visible_from)
);

comment on table public.ticket_links is
  'Links to buy tickets for the physical shows. A link is readable only inside its visibility window.';
comment on column public.ticket_links.show_starts_at is 'Start time of the show the tickets are for.';
comment on column public.ticket_links.visible_from is 'When the link shows up on the website. NULL = hidden.';
comment on column public.ticket_links.visible_until is 'When the link disappears again. NULL = no end.';

create index ticket_links_revue_id_idx on public.ticket_links (revue_id, sort_order);

create trigger ticket_links_set_updated_at
  before update on public.ticket_links
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- Streams
-- ---------------------------------------------------------------------------

create table public.streams (
  id uuid primary key default gen_random_uuid(),
  revue_id uuid not null references public.revues (id) on delete restrict,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  description text,
  thumbnail_path text,
  status public.stream_status not null default 'scheduled',
  starts_at timestamptz not null,
  ends_at timestamptz,
  visible_from timestamptz,
  visible_until timestamptz,
  sales_open_at timestamptz,
  sales_close_at timestamptz,
  replay_available_until timestamptz,
  chat_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or ends_at > starts_at),
  check (visible_from is null or visible_until is null or visible_until > visible_from),
  check (sales_open_at is null or sales_close_at is null or sales_close_at > sales_open_at)
);

comment on table public.streams is
  'Public metadata for a stream. Cloudflare identifiers are in stream_playback, prices in stream_prices.';
comment on column public.streams.status is 'Updated by the Worker from Cloudflare Stream webhooks, or by an admin.';
comment on column public.streams.visible_from is 'When the stream shows up on the website. NULL = hidden.';
comment on column public.streams.visible_until is 'When the stream disappears from the website. NULL = no end.';
comment on column public.streams.sales_open_at is 'When the buy button shows up. NULL = not for sale.';
comment on column public.streams.sales_close_at is 'When sales stop. NULL = no end.';
comment on column public.streams.replay_available_until is 'How long the recording can be watched after the stream. NULL = no replay.';
comment on column public.streams.chat_enabled is 'Switch for posting in the chat. Reading follows stream access.';

create index streams_revue_id_idx on public.streams (revue_id, starts_at);

create trigger streams_set_updated_at
  before update on public.streams
  for each row execute function private.set_updated_at();

create table public.stream_prices (
  stream_id uuid not null references public.streams (id) on delete cascade,
  user_type public.user_type not null,
  amount integer not null check (amount >= 0),
  currency text not null default 'nok' check (currency ~ '^[a-z]{3}$'),
  stripe_price_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (stream_id, user_type)
);

comment on table public.stream_prices is
  'Price of a stream per user type, so students and external users can pay different amounts.';
comment on column public.stream_prices.amount is 'Minor units (øre). 0 = free.';
comment on column public.stream_prices.stripe_price_id is
  'Optional. Leave NULL if the Worker sends the amount inline when it creates the Checkout Session.';

create trigger stream_prices_set_updated_at
  before update on public.stream_prices
  for each row execute function private.set_updated_at();

create table public.stream_playback (
  stream_id uuid primary key references public.streams (id) on delete cascade,
  cloudflare_live_input_id text unique,
  cloudflare_video_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.stream_playback is
  'Cloudflare Stream identifiers. Admins and the service role only. The Worker reads this after checking stream_access and returns a signed playback token. Do not store the RTMPS key here.';
comment on column public.stream_playback.cloudflare_live_input_id is 'Live input UID, used for live playback.';
comment on column public.stream_playback.cloudflare_video_id is 'Video UID of the recording, used for replay.';

create trigger stream_playback_set_updated_at
  before update on public.stream_playback
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- Payments and stream access
-- ---------------------------------------------------------------------------

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  stream_id uuid not null references public.streams (id) on delete restrict,
  status public.order_status not null default 'pending',
  amount integer not null check (amount >= 0),
  currency text not null default 'nok' check (currency ~ '^[a-z]{3}$'),
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text unique,
  paid_at timestamptz,
  refunded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.orders is
  'One Stripe Checkout per stream purchase. Written by the Worker with the service role. Kept when a user is deleted, for bookkeeping.';
comment on column public.orders.amount is 'Minor units (øre), copied from stream_prices when the checkout is created.';

create index orders_user_id_idx on public.orders (user_id);
create index orders_stream_id_idx on public.orders (stream_id);
create unique index orders_one_paid_per_user_stream_idx
  on public.orders (user_id, stream_id)
  where status = 'paid';

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function private.set_updated_at();

create table public.stream_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  stream_id uuid not null references public.streams (id) on delete cascade,
  source public.access_source not null,
  order_id uuid references public.orders (id) on delete set null,
  granted_by uuid references public.profiles (id) on delete set null,
  note text,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, stream_id)
);

comment on table public.stream_access is
  'Who can watch which stream. This is the single source of truth for access. Rows come from a paid order (Stripe webhook) or are granted by an admin, for example to cast and crew.';
comment on column public.stream_access.expires_at is 'NULL = no expiry.';
comment on column public.stream_access.revoked_at is 'Set on refund or manual removal. A revoked row gives no access.';

create index stream_access_stream_id_idx on public.stream_access (stream_id);
create index stream_access_order_id_idx on public.stream_access (order_id);

create table public.stripe_events (
  id text primary key,
  type text not null,
  payload jsonb not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  error text
);

comment on table public.stripe_events is
  'Stripe webhook events keyed by the Stripe event id, so a redelivered event is not handled twice. Service role only.';

-- True for staff and for users with a live access row.
create function private.has_stream_access(_stream_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_staff() or exists (
    select 1
    from public.stream_access a
    where a.stream_id = _stream_id
      and a.user_id = (select auth.uid())
      and a.revoked_at is null
      and (a.expires_at is null or a.expires_at > now())
  );
$$;

-- ---------------------------------------------------------------------------
-- Chat
-- ---------------------------------------------------------------------------

create table public.chat_bans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  stream_id uuid references public.streams (id) on delete cascade,
  reason text,
  banned_by uuid default auth.uid() references public.profiles (id) on delete set null,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

comment on table public.chat_bans is 'Users who may not post in the chat.';
comment on column public.chat_bans.stream_id is 'NULL = banned from every stream chat.';
comment on column public.chat_bans.expires_at is 'NULL = until the row is deleted.';

create index chat_bans_user_id_idx on public.chat_bans (user_id);
create index chat_bans_stream_id_idx on public.chat_bans (stream_id);

create table public.chat_messages (
  id bigint generated always as identity primary key,
  stream_id uuid not null references public.streams (id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  display_name text not null,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  deleted_by uuid references public.profiles (id) on delete set null
);

comment on table public.chat_messages is
  'Chat per stream, delivered through Supabase Realtime. Clients insert only stream_id and body.';
comment on column public.chat_messages.display_name is
  'Copied from the profile by a trigger. Realtime payloads carry no joins and profiles are private, so the name has to be in the row.';
comment on column public.chat_messages.deleted_at is
  'Set by a moderator. The row stays so clients get the update and can hide the message.';

create index chat_messages_stream_id_idx on public.chat_messages (stream_id, id desc);
create index chat_messages_user_id_idx on public.chat_messages (user_id);

create function private.chat_message_before_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  select p.display_name into strict new.display_name
  from public.profiles p
  where p.id = new.user_id;
  return new;
end;
$$;

create trigger chat_messages_before_insert
  before insert on public.chat_messages
  for each row execute function private.chat_message_before_insert();

-- True when the current user may post in the chat of a stream.
create function private.can_chat(_stream_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.has_stream_access(_stream_id)
    and exists (
      select 1 from public.streams s
      where s.id = _stream_id and s.chat_enabled
    )
    and not exists (
      select 1 from public.chat_bans b
      where b.user_id = (select auth.uid())
        and (b.stream_id is null or b.stream_id = _stream_id)
        and (b.expires_at is null or b.expires_at > now())
    );
$$;

-- ---------------------------------------------------------------------------
-- Site settings
-- ---------------------------------------------------------------------------

create table public.site_settings (
  key text primary key check (key ~ '^[a-z0-9_.]+$'),
  value jsonb not null,
  description text,
  is_public boolean not null default true,
  visible_from timestamptz,
  visible_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (visible_from is null or visible_until is null or visible_until > visible_from)
);

comment on table public.site_settings is
  'Key/value switches and texts for everything on the website that is not a revue, stream, ticket link, post or album. Example: key hero.banner, value {"text": "..."}.';
comment on column public.site_settings.is_public is 'false = only admins and the service role can read the row.';
comment on column public.site_settings.visible_from is 'Optional schedule. Unlike the content tables, NULL here means no lower bound.';
comment on column public.site_settings.visible_until is 'Optional schedule. NULL = no upper bound.';

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- Photo gallery
-- ---------------------------------------------------------------------------

create table public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  revue_id uuid references public.revues (id) on delete set null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  description text,
  cover_photo_id uuid,
  event_date date,
  published_at timestamptz,
  sort_order integer not null default 0,
  created_by uuid default auth.uid() references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.gallery_albums.published_at is 'When the album shows up on the website. NULL = draft.';

create index gallery_albums_revue_id_idx on public.gallery_albums (revue_id);

create trigger gallery_albums_set_updated_at
  before update on public.gallery_albums
  for each row execute function private.set_updated_at();

create table public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.gallery_albums (id) on delete cascade,
  storage_path text not null,
  caption text,
  alt_text text,
  photographer text,
  width integer check (width > 0),
  height integer check (height > 0),
  sort_order integer not null default 0,
  taken_at timestamptz,
  created_at timestamptz not null default now()
);

comment on column public.gallery_photos.storage_path is
  'Object key of the image. Works for a Supabase Storage bucket or Cloudflare R2/Images.';

create index gallery_photos_album_id_idx on public.gallery_photos (album_id, sort_order);

alter table public.gallery_albums
  add constraint gallery_albums_cover_photo_id_fkey
  foreign key (cover_photo_id) references public.gallery_photos (id) on delete set null;

create index gallery_albums_cover_photo_id_idx on public.gallery_albums (cover_photo_id);

-- ---------------------------------------------------------------------------
-- Blog
-- ---------------------------------------------------------------------------

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  excerpt text,
  body text not null default '',
  cover_image_path text,
  author_id uuid default auth.uid() references public.profiles (id) on delete set null,
  author_name text,
  revue_id uuid references public.revues (id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.posts.body is 'Markdown.';
comment on column public.posts.author_name is 'Byline shown on the website. Profiles are private, so the name is stored here.';
comment on column public.posts.published_at is 'NULL = draft. A future time schedules the post.';

create index posts_published_at_idx on public.posts (published_at desc);
create index posts_author_id_idx on public.posts (author_id);
create index posts_revue_id_idx on public.posts (revue_id);

create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- Function privileges
-- ---------------------------------------------------------------------------

revoke execute on all functions in schema private from public;
grant execute on function
  private.user_role(),
  private.is_admin(),
  private.is_editor(),
  private.is_moderator(),
  private.is_staff(),
  private.has_stream_access(uuid),
  private.can_chat(uuid)
to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Table privileges
-- ---------------------------------------------------------------------------

revoke all on
  public.profiles, public.revues, public.revue_details, public.ticket_links,
  public.streams, public.stream_prices, public.stream_playback,
  public.orders, public.stream_access, public.stripe_events,
  public.chat_bans, public.chat_messages, public.site_settings,
  public.gallery_albums, public.gallery_photos, public.posts
from anon, authenticated;

grant all on
  public.profiles, public.revues, public.revue_details, public.ticket_links,
  public.streams, public.stream_prices, public.stream_playback,
  public.orders, public.stream_access, public.stripe_events,
  public.chat_bans, public.chat_messages, public.site_settings,
  public.gallery_albums, public.gallery_photos, public.posts
to service_role;

-- Public content: everyone reads what RLS lets through, staff write.
grant select on
  public.revues, public.revue_details, public.ticket_links,
  public.streams, public.stream_prices, public.site_settings,
  public.gallery_albums, public.gallery_photos, public.posts
to anon, authenticated;

grant insert, update, delete on
  public.revues, public.revue_details, public.ticket_links,
  public.streams, public.stream_prices, public.site_settings,
  public.gallery_albums, public.gallery_photos, public.posts
to authenticated;

-- Signed-in users only.
grant select on public.profiles to authenticated;
grant update (display_name, avatar_url) on public.profiles to authenticated;

grant select on public.orders to authenticated;
grant select, insert, update, delete on public.stream_access to authenticated;
grant select, insert, update, delete on public.stream_playback to authenticated;
grant select, insert, update, delete on public.chat_bans to authenticated;

grant select on public.chat_messages to authenticated;
grant insert (stream_id, body) on public.chat_messages to authenticated;
grant update (deleted_at, deleted_by) on public.chat_messages to authenticated;

-- stripe_events: no grants. Service role only.

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.revues enable row level security;
alter table public.revue_details enable row level security;
alter table public.ticket_links enable row level security;
alter table public.streams enable row level security;
alter table public.stream_prices enable row level security;
alter table public.stream_playback enable row level security;
alter table public.orders enable row level security;
alter table public.stream_access enable row level security;
alter table public.stripe_events enable row level security;
alter table public.chat_bans enable row level security;
alter table public.chat_messages enable row level security;
alter table public.site_settings enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery_photos enable row level security;
alter table public.posts enable row level security;

-- profiles
create policy "Users read their own profile, admins read all"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()));

create policy "Users update their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- revues
create policy "Visible revues are public, editors read all"
  on public.revues for select to anon, authenticated
  using (visible_from <= now() or (select private.is_editor()));

create policy "Editors insert revues"
  on public.revues for insert to authenticated
  with check ((select private.is_editor()));

create policy "Editors update revues"
  on public.revues for update to authenticated
  using ((select private.is_editor()))
  with check ((select private.is_editor()));

create policy "Editors delete revues"
  on public.revues for delete to authenticated
  using ((select private.is_editor()));

-- revue_details
create policy "Revue details are public after the reveal, editors read all"
  on public.revue_details for select to anon, authenticated
  using (
    (select private.is_editor())
    or exists (
      select 1 from public.revues r
      where r.id = revue_id
        and r.visible_from <= now()
        and r.name_reveal_at <= now()
    )
  );

create policy "Editors insert revue details"
  on public.revue_details for insert to authenticated
  with check ((select private.is_editor()));

create policy "Editors update revue details"
  on public.revue_details for update to authenticated
  using ((select private.is_editor()))
  with check ((select private.is_editor()));

create policy "Editors delete revue details"
  on public.revue_details for delete to authenticated
  using ((select private.is_editor()));

-- ticket_links
create policy "Ticket links are public inside their window, editors read all"
  on public.ticket_links for select to anon, authenticated
  using (
    (select private.is_editor())
    or (visible_from <= now() and (visible_until is null or visible_until > now()))
  );

create policy "Editors insert ticket links"
  on public.ticket_links for insert to authenticated
  with check ((select private.is_editor()));

create policy "Editors update ticket links"
  on public.ticket_links for update to authenticated
  using ((select private.is_editor()))
  with check ((select private.is_editor()));

create policy "Editors delete ticket links"
  on public.ticket_links for delete to authenticated
  using ((select private.is_editor()));

-- streams
create policy "Streams are public inside their window, viewers and staff read theirs"
  on public.streams for select to anon, authenticated
  using (
    (visible_from <= now() and (visible_until is null or visible_until > now()))
    or private.has_stream_access(id)
  );

create policy "Admins insert streams"
  on public.streams for insert to authenticated
  with check ((select private.is_admin()));

create policy "Admins update streams"
  on public.streams for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins delete streams"
  on public.streams for delete to authenticated
  using ((select private.is_admin()));

-- stream_prices
create policy "Prices follow the visibility of their stream"
  on public.stream_prices for select to anon, authenticated
  using (exists (select 1 from public.streams s where s.id = stream_id));

create policy "Admins insert stream prices"
  on public.stream_prices for insert to authenticated
  with check ((select private.is_admin()));

create policy "Admins update stream prices"
  on public.stream_prices for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins delete stream prices"
  on public.stream_prices for delete to authenticated
  using ((select private.is_admin()));

-- stream_playback
create policy "Admins read stream playback"
  on public.stream_playback for select to authenticated
  using ((select private.is_admin()));

create policy "Admins insert stream playback"
  on public.stream_playback for insert to authenticated
  with check ((select private.is_admin()));

create policy "Admins update stream playback"
  on public.stream_playback for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins delete stream playback"
  on public.stream_playback for delete to authenticated
  using ((select private.is_admin()));

-- orders
create policy "Users read their own orders, admins read all"
  on public.orders for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));

-- stream_access
create policy "Users read their own access, admins read all"
  on public.stream_access for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));

create policy "Admins grant access"
  on public.stream_access for insert to authenticated
  with check ((select private.is_admin()));

create policy "Admins update access"
  on public.stream_access for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins delete access"
  on public.stream_access for delete to authenticated
  using ((select private.is_admin()));

-- chat_bans
create policy "Users read their own bans, moderators read all"
  on public.chat_bans for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_moderator()));

create policy "Moderators insert bans"
  on public.chat_bans for insert to authenticated
  with check ((select private.is_moderator()));

create policy "Moderators update bans"
  on public.chat_bans for update to authenticated
  using ((select private.is_moderator()))
  with check ((select private.is_moderator()));

create policy "Moderators delete bans"
  on public.chat_bans for delete to authenticated
  using ((select private.is_moderator()));

-- chat_messages
create policy "Viewers read the chat of streams they have access to"
  on public.chat_messages for select to authenticated
  using (private.has_stream_access(stream_id));

create policy "Viewers post as themselves where they may chat"
  on public.chat_messages for insert to authenticated
  with check (user_id = (select auth.uid()) and private.can_chat(stream_id));

create policy "Moderators hide messages"
  on public.chat_messages for update to authenticated
  using ((select private.is_moderator()))
  with check ((select private.is_moderator()));

-- site_settings
create policy "Public settings are readable inside their window, admins read all"
  on public.site_settings for select to anon, authenticated
  using (
    (select private.is_admin())
    or (
      is_public
      and (visible_from is null or visible_from <= now())
      and (visible_until is null or visible_until > now())
    )
  );

create policy "Admins insert settings"
  on public.site_settings for insert to authenticated
  with check ((select private.is_admin()));

create policy "Admins update settings"
  on public.site_settings for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Admins delete settings"
  on public.site_settings for delete to authenticated
  using ((select private.is_admin()));

-- gallery_albums
create policy "Published albums are public, editors read all"
  on public.gallery_albums for select to anon, authenticated
  using (published_at <= now() or (select private.is_editor()));

create policy "Editors insert albums"
  on public.gallery_albums for insert to authenticated
  with check ((select private.is_editor()));

create policy "Editors update albums"
  on public.gallery_albums for update to authenticated
  using ((select private.is_editor()))
  with check ((select private.is_editor()));

create policy "Editors delete albums"
  on public.gallery_albums for delete to authenticated
  using ((select private.is_editor()));

-- gallery_photos
create policy "Photos follow the visibility of their album"
  on public.gallery_photos for select to anon, authenticated
  using (exists (select 1 from public.gallery_albums a where a.id = album_id));

create policy "Editors insert photos"
  on public.gallery_photos for insert to authenticated
  with check ((select private.is_editor()));

create policy "Editors update photos"
  on public.gallery_photos for update to authenticated
  using ((select private.is_editor()))
  with check ((select private.is_editor()));

create policy "Editors delete photos"
  on public.gallery_photos for delete to authenticated
  using ((select private.is_editor()));

-- posts
create policy "Published posts are public, editors read all"
  on public.posts for select to anon, authenticated
  using (published_at <= now() or (select private.is_editor()));

create policy "Editors insert posts"
  on public.posts for insert to authenticated
  with check ((select private.is_editor()));

create policy "Editors update posts"
  on public.posts for update to authenticated
  using ((select private.is_editor()))
  with check ((select private.is_editor()));

create policy "Editors delete posts"
  on public.posts for delete to authenticated
  using ((select private.is_editor()));

-- ---------------------------------------------------------------------------
-- Realtime
-- ---------------------------------------------------------------------------

-- Chat messages for the live chat, streams so clients see status changes
-- (scheduled, live, ended) without polling.
alter publication supabase_realtime add table public.chat_messages, public.streams;
