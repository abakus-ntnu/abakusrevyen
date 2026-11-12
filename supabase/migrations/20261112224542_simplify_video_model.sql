-- Keep public source identifiers together; Cloudflare identifiers remain private.
alter table public.video_sources add column youtube_video_id text;
update public.video_sources s set youtube_video_id = y.youtube_video_id
  from public.youtube_video_sources y where y.source_id = s.id;
alter table public.video_sources add constraint video_sources_youtube_id_check check (
  (provider = 'youtube' and (youtube_video_id is null or youtube_video_id ~ '^[A-Za-z0-9_-]{11}$')
    and (state <> 'ready' or youtube_video_id is not null))
  or (provider = 'cloudflare' and youtube_video_id is null)
);
drop table public.youtube_video_sources;
grant insert (youtube_video_id), update (youtube_video_id), delete on public.video_sources to authenticated;
drop policy "Published sources follow published video" on public.video_sources;
create policy "Released sources follow published video" on public.video_sources
  for select to anon, authenticated using (
    (state = 'ready' and published_at <= now() and removed_at is null
      and exists (select 1 from public.revue_videos v where v.id = video_id
        and v.published_at <= now() and private.revue_is_revealed(v.revue_id)))
    or (select private.is_editor())
  );
create policy "Editors delete YouTube sources" on public.video_sources
  for delete to authenticated using (provider = 'youtube' and (select private.is_editor()));

-- Main selections are attributes of the existing, reveal-protected revue row.
do $$ begin
  if exists (select 1 from public.revue_video_selections s
    where not exists (select 1 from public.revue_details d where d.revue_id = s.revue_id)) then
    raise exception 'Create revue details before migrating its video selections';
  end if;
end $$;
alter table public.revue_details
  add column full_video_id uuid,
  add column act_one_video_id uuid,
  add column act_two_video_id uuid,
  add column featured_video_id uuid,
  add constraint revue_details_full_video_fkey foreign key (full_video_id, revue_id)
    references public.revue_videos(id, revue_id) on delete restrict,
  add constraint revue_details_act_one_fkey foreign key (act_one_video_id, revue_id)
    references public.revue_videos(id, revue_id) on delete restrict,
  add constraint revue_details_act_two_fkey foreign key (act_two_video_id, revue_id)
    references public.revue_videos(id, revue_id) on delete restrict,
  add constraint revue_details_featured_video_fkey foreign key (featured_video_id, revue_id)
    references public.revue_videos(id, revue_id) on delete restrict,
  add constraint revue_details_main_video_check check (
    (full_video_id is null and act_one_video_id is null and act_two_video_id is null)
    or (full_video_id is not null and act_one_video_id is null and act_two_video_id is null)
    or (full_video_id is null and act_one_video_id is not null and act_two_video_id is not null)
  );
update public.revue_details d set full_video_id = s.full_video_id,
  act_one_video_id = s.act_one_video_id, act_two_video_id = s.act_two_video_id,
  featured_video_id = s.featured_video_id
from public.revue_video_selections s where s.revue_id = d.revue_id;
drop table public.revue_video_selections;
create index revue_details_full_video_idx on public.revue_details(full_video_id, revue_id);
create index revue_details_act_one_idx on public.revue_details(act_one_video_id, revue_id);
create index revue_details_act_two_idx on public.revue_details(act_two_video_id, revue_id);
create index revue_details_featured_idx on public.revue_details(featured_video_id, revue_id);
create trigger revue_details_selection_check before insert or update on public.revue_details
  for each row execute function private.check_video_selection();

create or replace function private.check_video_context()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.stream_id is not null and new.show_id is not null and not exists (
    select 1 from public.streams s where s.id = new.stream_id and s.revue_id = new.revue_id
      and s.show_id = new.show_id
  ) then
    raise exception 'Video show must match its stream show' using errcode = '23514';
  end if;
  if tg_op = 'UPDATE' and (new.kind, new.show_id, new.stream_id) is distinct from (old.kind, old.show_id, old.stream_id)
    and exists (select 1 from public.revue_details d
      where old.id in (d.full_video_id, d.act_one_video_id, d.act_two_video_id)) then
    raise exception 'Clear main selection before changing its video context' using errcode = '23514';
  end if;
  return new;
end;
$$;

-- A composite FK enforces the relationship on parent and child writes, also
-- when transactions race. The existing two-column FK handles NULL show_id.
alter table public.streams add constraint streams_video_context_key unique (id, show_id, revue_id);
alter table public.revue_videos add constraint revue_videos_stream_show_fkey
  foreign key (stream_id, show_id, revue_id) references public.streams(id, show_id, revue_id)
  on delete set null (stream_id);

create or replace function private.invalidate_video_protection()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.cloudflare_video_id is distinct from old.cloudflare_video_id
    or (old.deleted_at is not null and new.deleted_at is null) then
    new.signed_urls_verified_at := null;
    new.scheduled_deletion_at := null;
  end if;
  return new;
end;
$$;

-- Both timestamps describe externally verified state of this exact video.
-- The sale's hard deadline is the desired maximum, not proof of a provider job.
create or replace function public.can_play_source(_user_id uuid, _source_id uuid)
returns boolean language sql stable set search_path = '' as $$
  select exists (
    select 1 from public.video_sources s
    join public.revue_videos v on v.id = s.video_id and v.revue_id = s.revue_id
    join public.cloudflare_video_sources c on c.source_id = s.id
    join public.revue_sales sale on sale.revue_id = s.revue_id
    where s.id = _source_id and s.provider = 'cloudflare' and s.state = 'ready'
      and s.published_at <= now() and s.removed_at is null and v.published_at <= now()
      and private.revue_is_revealed(s.revue_id)
      and c.signed_urls_verified_at is not null and c.deleted_at is null
      and c.scheduled_deletion_at > now() and c.scheduled_deletion_at <= sale.stream_delete_at
      and sale.stream_delete_at > now()
      and private.user_has_revue_access(_user_id, s.revue_id)
  );
$$;
comment on column public.cloudflare_video_sources.scheduled_deletion_at is
  'Externally confirmed deletion time for this exact Cloudflare ID, not just a requested deadline. Reset on replacement/restoration. #150 must set and verify it at Cloudflare before playback.';
