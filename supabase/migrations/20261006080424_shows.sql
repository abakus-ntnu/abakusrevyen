-- Physical shows: time and place of each performance.
--
-- A show is public from its own visible_from. Ticket links and streams can
-- point to a show, and keep their own visibility windows, so the time and place
-- of a show can be on the website before its buy link or its stream is.

-- ---------------------------------------------------------------------------
-- Shows
-- ---------------------------------------------------------------------------

create table public.shows (
  id uuid primary key default gen_random_uuid(),
  revue_id uuid not null references public.revues (id) on delete cascade,
  title text not null,
  description text,
  starts_at timestamptz not null,
  doors_open_at timestamptz,
  ends_at timestamptz,
  venue_name text,
  venue_address text,
  venue_map_url text check (venue_map_url ~ '^https?://'),
  is_sold_out boolean not null default false,
  visible_from timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Target of the composite foreign keys below.
  unique (id, revue_id),
  check (ends_at is null or ends_at > starts_at),
  check (doors_open_at is null or doors_open_at <= starts_at)
);

comment on table public.shows is
  'A physical performance of a revue: when and where. Ticket links and streams can point to a show.';
comment on column public.shows.title is 'For example Premiere or Lørdag kveld.';
comment on column public.shows.venue_map_url is 'Link to a map of the venue.';
comment on column public.shows.is_sold_out is 'Set by an editor. Nothing updates it automatically.';
comment on column public.shows.visible_from is 'When the show shows up on the website. NULL = hidden.';

create index shows_revue_id_idx on public.shows (revue_id, starts_at);

create trigger shows_set_updated_at
  before update on public.shows
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- Ticket links and streams point to a show
-- ---------------------------------------------------------------------------

-- The show time now comes from the show. The old column is left in place and
-- should be dropped in a later migration.
comment on column public.ticket_links.show_starts_at is
  'Deprecated: use shows.starts_at through show_id. To be dropped.';

-- The composite keys make sure the show belongs to the same revue as the row
-- that points to it.
alter table public.ticket_links
  add column show_id uuid,
  add constraint ticket_links_show_id_fkey
    foreign key (show_id, revue_id) references public.shows (id, revue_id)
    on delete cascade;

comment on column public.ticket_links.show_id is
  'The show the tickets are for. NULL = a link for the revue as a whole.';

create index ticket_links_show_id_idx on public.ticket_links (show_id);

alter table public.streams
  add column show_id uuid,
  add constraint streams_show_id_fkey
    foreign key (show_id, revue_id) references public.shows (id, revue_id)
    on delete set null (show_id);

comment on column public.streams.show_id is
  'The physical show this stream broadcasts. NULL = not tied to a show.';

create index streams_show_id_idx on public.streams (show_id);

-- ---------------------------------------------------------------------------
-- Privileges and row level security
-- ---------------------------------------------------------------------------

revoke all on public.shows from anon, authenticated;
grant all on public.shows to service_role;
grant select on public.shows to anon, authenticated;
grant insert, update, delete on public.shows to authenticated;

alter table public.shows enable row level security;

create policy "Visible shows are public, editors read all"
  on public.shows for select to anon, authenticated
  using (visible_from <= now() or (select private.is_editor()));

create policy "Editors insert shows"
  on public.shows for insert to authenticated
  with check ((select private.is_editor()));

create policy "Editors update shows"
  on public.shows for update to authenticated
  using ((select private.is_editor()))
  with check ((select private.is_editor()));

create policy "Editors delete shows"
  on public.shows for delete to authenticated
  using ((select private.is_editor()));
