-- Public editorial metadata is separate from provider identifiers and access.
alter table public.streams add constraint streams_id_revue_key unique (id, revue_id);

create function private.revue_is_revealed(_revue_id uuid)
returns boolean language sql stable set search_path = '' as $$
  select exists (
    select 1 from public.revues r where r.id = _revue_id
      and r.visible_from <= now() and r.name_reveal_at <= now()
  );
$$;
revoke all on function private.revue_is_revealed(uuid) from public;
grant execute on function private.revue_is_revealed(uuid) to anon, authenticated, service_role;

create table public.revue_videos (
  id uuid primary key default gen_random_uuid(),
  revue_id uuid not null references public.revues(id) on delete restrict,
  show_id uuid,
  stream_id uuid,
  title text not null check (length(trim(title)) > 0),
  description text,
  kind text not null check (kind in ('full', 'act_1', 'act_2', 'clip', 'trailer', 'behind_scenes', 'other')),
  poster_path text,
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, revue_id),
  foreign key (show_id, revue_id) references public.shows(id, revue_id) on delete set null (show_id),
  foreign key (stream_id, revue_id) references public.streams(id, revue_id) on delete set null (stream_id)
);
create index revue_videos_revue_idx on public.revue_videos(revue_id, sort_order);
create index revue_videos_show_idx on public.revue_videos(show_id, revue_id);
create index revue_videos_stream_idx on public.revue_videos(stream_id, revue_id);
create trigger revue_videos_updated before update on public.revue_videos
  for each row execute function private.set_updated_at();

create table public.video_sources (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null,
  revue_id uuid not null,
  provider text not null check (provider in ('youtube', 'cloudflare')),
  state text not null default 'processing' check (state in ('processing', 'ready', 'error', 'removed')),
  published_at timestamptz,
  removed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, provider),
  foreign key (video_id, revue_id) references public.revue_videos(id, revue_id) on delete restrict,
  check ((state = 'removed') = (removed_at is not null))
);
create index video_sources_video_idx on public.video_sources(video_id, revue_id);
create index video_sources_revue_idx on public.video_sources(revue_id);
create trigger video_sources_updated before update on public.video_sources
  for each row execute function private.set_updated_at();

create table public.youtube_video_sources (
  source_id uuid primary key,
  provider text not null default 'youtube' check (provider = 'youtube'),
  youtube_video_id text not null check (youtube_video_id ~ '^[A-Za-z0-9_-]{11}$'),
  foreign key (source_id, provider) references public.video_sources(id, provider) on delete cascade
);

-- A YouTube alternative never changes the protection of this separate source.
create table public.cloudflare_video_sources (
  source_id uuid primary key,
  provider text not null default 'cloudflare' check (provider = 'cloudflare'),
  cloudflare_video_id text not null unique check (length(cloudflare_video_id) > 0),
  signed_urls_verified_at timestamptz,
  scheduled_deletion_at timestamptz,
  deleted_at timestamptz,
  foreign key (source_id, provider) references public.video_sources(id, provider) on delete restrict
);

create table public.revue_video_selections (
  revue_id uuid primary key references public.revues(id) on delete cascade,
  full_video_id uuid,
  act_one_video_id uuid,
  act_two_video_id uuid,
  featured_video_id uuid,
  foreign key (full_video_id, revue_id) references public.revue_videos(id, revue_id) on delete restrict,
  foreign key (act_one_video_id, revue_id) references public.revue_videos(id, revue_id) on delete restrict,
  foreign key (act_two_video_id, revue_id) references public.revue_videos(id, revue_id) on delete restrict,
  foreign key (featured_video_id, revue_id) references public.revue_videos(id, revue_id) on delete restrict,
  check (
    (full_video_id is null and act_one_video_id is null and act_two_video_id is null)
    or (full_video_id is not null and act_one_video_id is null and act_two_video_id is null)
    or (full_video_id is null and act_one_video_id is not null and act_two_video_id is not null)
  )
);
create index revue_selection_full_idx on public.revue_video_selections(full_video_id, revue_id);
create index revue_selection_act_one_idx on public.revue_video_selections(act_one_video_id, revue_id);
create index revue_selection_act_two_idx on public.revue_video_selections(act_two_video_id, revue_id);
create index revue_selection_featured_idx on public.revue_video_selections(featured_video_id, revue_id);

create function private.check_video_selection()
returns trigger language plpgsql set search_path = '' as $$
begin
  if (new.full_video_id is not null and not exists (
    select 1 from public.revue_videos where id = new.full_video_id and kind = 'full'
  )) or (new.act_one_video_id is not null and not exists (
    select 1 from public.revue_videos a join public.revue_videos b
      on b.id = new.act_two_video_id and b.kind = 'act_2'
      and a.show_id is not distinct from b.show_id
      and a.stream_id is not distinct from b.stream_id
    where a.id = new.act_one_video_id and a.kind = 'act_1'
  )) then
    raise exception 'Main selection must be a full performance or two matching acts' using errcode = '23514';
  end if;
  return new;
end;
$$;
revoke all on function private.check_video_selection() from public, anon, authenticated;
create trigger revue_selection_check before insert or update on public.revue_video_selections
  for each row execute function private.check_video_selection();

create function private.check_video_context()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.stream_id is not null and new.show_id is not null and not exists (
    select 1 from public.streams s where s.id = new.stream_id and s.revue_id = new.revue_id
      and s.show_id = new.show_id
  ) then
    raise exception 'Video show must match its stream show' using errcode = '23514';
  end if;
  if tg_op = 'UPDATE' and (new.kind, new.show_id, new.stream_id) is distinct from (old.kind, old.show_id, old.stream_id)
    and exists (select 1 from public.revue_video_selections x
      where old.id in (x.full_video_id, x.act_one_video_id, x.act_two_video_id)) then
    raise exception 'Clear main selection before changing its video context' using errcode = '23514';
  end if;
  return new;
end;
$$;
revoke all on function private.check_video_context() from public, anon, authenticated;
create trigger video_context_check before insert or update on public.revue_videos
  for each row execute function private.check_video_context();

-- Separate scheduling keeps an unreleased playlist URL out of public rows.
create table public.revue_playlists (
  revue_id uuid primary key references public.revues(id) on delete cascade,
  youtube_playlist_id text not null check (youtube_playlist_id ~ '^[A-Za-z0-9_-]{10,100}$'),
  published_at timestamptz
);

alter table public.revue_videos enable row level security;
alter table public.video_sources enable row level security;
alter table public.youtube_video_sources enable row level security;
alter table public.cloudflare_video_sources enable row level security;
alter table public.revue_video_selections enable row level security;
alter table public.revue_playlists enable row level security;

revoke all on public.revue_videos, public.video_sources, public.youtube_video_sources,
  public.cloudflare_video_sources, public.revue_video_selections, public.revue_playlists
  from public, anon, authenticated;
grant all on public.revue_videos, public.video_sources, public.youtube_video_sources,
  public.cloudflare_video_sources, public.revue_video_selections, public.revue_playlists to service_role;
grant select on public.revue_videos, public.video_sources, public.youtube_video_sources,
  public.revue_video_selections, public.revue_playlists to anon, authenticated;
grant insert, update, delete on public.revue_videos, public.youtube_video_sources,
  public.revue_video_selections, public.revue_playlists to authenticated;
grant insert (video_id, revue_id, provider, published_at) on public.video_sources to authenticated;
grant update (published_at) on public.video_sources to authenticated;
grant select on public.cloudflare_video_sources to authenticated;

create policy "Published videos after revue reveal, editors preview"
  on public.revue_videos for select to anon, authenticated
  using ((published_at <= now() and private.revue_is_revealed(revue_id)) or (select private.is_editor()));
create policy "Editors manage video metadata" on public.revue_videos for all to authenticated
  using ((select private.is_editor())) with check ((select private.is_editor()));
create policy "Published sources follow published video"
  on public.video_sources for select to anon, authenticated
  using ((published_at <= now() and removed_at is null
    and exists (select 1 from public.revue_videos v where v.id = video_id
      and v.published_at <= now() and private.revue_is_revealed(v.revue_id)))
    or (select private.is_editor()));
create policy "Editors schedule sources" on public.video_sources for all to authenticated
  using ((select private.is_editor())) with check ((select private.is_editor()));
create policy "Released YouTube links follow ready sources"
  on public.youtube_video_sources for select to anon, authenticated
  using (exists (select 1 from public.video_sources s where s.id = source_id
    and s.state = 'ready' and s.published_at <= now() and s.removed_at is null)
    or (select private.is_editor()));
create policy "Editors manage YouTube links" on public.youtube_video_sources for all to authenticated
  using ((select private.is_editor())) with check ((select private.is_editor()));
create policy "Only admins read private video identifiers"
  on public.cloudflare_video_sources for select to authenticated using ((select private.is_admin()));
create policy "Selections after revue reveal, editors preview"
  on public.revue_video_selections for select to anon, authenticated
  using (private.revue_is_revealed(revue_id) or (select private.is_editor()));
create policy "Editors manage selections" on public.revue_video_selections for all to authenticated
  using ((select private.is_editor())) with check ((select private.is_editor()));
create policy "Playlists have their own release date"
  on public.revue_playlists for select to anon, authenticated
  using ((published_at <= now() and private.revue_is_revealed(revue_id)) or (select private.is_editor()));
create policy "Editors manage playlists" on public.revue_playlists for all to authenticated
  using ((select private.is_editor())) with check ((select private.is_editor()));

-- Preserve legacy recording IDs without claiming that an old source is ready,
-- signed, or scheduled for deletion. #135/#150 must confirm those externally.
do $$
declare old_record record; video uuid; source uuid;
begin
  for old_record in
    select s.*, p.cloudflare_video_id from public.streams s
    join public.stream_playback p on p.stream_id = s.id
    where p.cloudflare_video_id is not null
  loop
    insert into public.revue_videos(revue_id, show_id, stream_id, title, kind, published_at)
    values(old_record.revue_id, old_record.show_id, old_record.id, old_record.title, 'full', old_record.visible_from)
    returning id into video;
    insert into public.video_sources(video_id, revue_id, provider, published_at)
    values(video, old_record.revue_id, 'cloudflare', old_record.visible_from) returning id into source;
    insert into public.cloudflare_video_sources(source_id, cloudflare_video_id)
    values(source, old_record.cloudflare_video_id);
  end loop;
end;
$$;

comment on table public.stream_playback is
  'Live input administration and legacy recording identifiers. New VOD uses revue_videos/video_sources/cloudflare_video_sources. Never return identifiers before server access checks.';
comment on table public.cloudflare_video_sources is
  'Server/admin-only VOD identifiers. No tokens. A non-null signed_urls_verified_at records an external protection check, not a Cloudflare configuration change.';
