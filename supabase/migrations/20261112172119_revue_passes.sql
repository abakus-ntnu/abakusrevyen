-- One pass covers a revue, including recordings added later. The entitlement
-- has no expiry; actual source availability has a separate hard deadline.
create table public.revue_sales (
  revue_id uuid primary key references public.revues(id) on delete restrict,
  first_show_at timestamptz not null,
  first_show_started_at timestamptz,
  sales_open_at timestamptz,
  sales_close_at timestamptz,
  stream_retire_at timestamptz not null,
  stream_delete_at timestamptz not null,
  terms_version text not null check (length(trim(terms_version)) > 0),
  check (sales_close_at is null or sales_open_at is null or sales_close_at > sales_open_at),
  check (stream_retire_at > first_show_at),
  check (stream_delete_at >= stream_retire_at and stream_delete_at <= stream_retire_at + interval '30 days')
);
create table public.revue_prices (
  revue_id uuid not null references public.revues(id) on delete restrict,
  user_type public.user_type not null,
  amount integer not null check (amount > 0),
  currency text not null default 'nok' check (currency ~ '^[a-z]{3}$'),
  primary key (revue_id, user_type)
);
create table public.revue_member_groups (
  revue_id uuid not null references public.revues(id) on delete restrict,
  lego_group_id text not null check (lego_group_id ~ '^[0-9]+$'),
  primary key (revue_id, lego_group_id)
);

alter table public.orders
  add column revue_id uuid references public.revues(id) on delete restrict,
  add column legacy_stream_purchase boolean not null default false,
  add column terms_version text,
  add column first_show_at timestamptz,
  add column cancellation_deadline_at timestamptz,
  add column refund_requested_at timestamptz,
  alter column stream_id drop not null;
update public.orders o set revue_id = s.revue_id, legacy_stream_purchase = true
  from public.streams s where s.id = o.stream_id;
alter table public.orders alter column revue_id set not null;
alter table public.orders add constraint orders_id_revue_key unique (id, revue_id);
alter table public.orders add constraint orders_stream_revue_fkey
  foreign key (stream_id, revue_id) references public.streams(id, revue_id) on delete restrict;
alter table public.orders add constraint orders_snapshot_window check (
  (first_show_at is null and cancellation_deadline_at is null)
  or (first_show_at is not null and cancellation_deadline_at = first_show_at - interval '2 hours')
);
create index orders_revue_idx on public.orders(revue_id);
create unique index orders_one_paid_revue_idx on public.orders(user_id, revue_id)
  where status = 'paid' and not legacy_stream_purchase;

create table public.revue_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  revue_id uuid not null references public.revues(id) on delete restrict,
  source text not null check (source in ('purchase', 'internal')),
  order_id uuid unique,
  verification_identity_id uuid references auth.identities(id) on delete set null,
  lego_subject text,
  lego_group_id text,
  verified_at timestamptz,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  revocation_reason text,
  foreign key (order_id, revue_id) references public.orders(id, revue_id) on delete restrict,
  check (
    (source = 'purchase' and order_id is not null and verification_identity_id is null
      and lego_subject is null and lego_group_id is null and verified_at is null)
    or (source = 'internal' and order_id is null and lego_subject is not null
      and lego_group_id is not null and verified_at is not null)
  ),
  check ((revoked_at is null) = (revocation_reason is null))
);
create unique index revue_access_internal_idx on public.revue_access(user_id, revue_id)
  where source = 'internal';
create index revue_access_user_revue_idx on public.revue_access(user_id, revue_id)
  where revoked_at is null;
create index revue_access_revue_idx on public.revue_access(revue_id);
create index revue_access_identity_idx on public.revue_access(verification_identity_id);
create index revue_access_group_idx on public.revue_access(revue_id, lego_group_id) where source = 'internal';

-- No partial-refund UI is required, but externally issued refunds must not be
-- lost. Store their actual amount and distinguish cancellation from redress.
create table public.order_refunds (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  provider_refund_id text not null unique check (length(provider_refund_id) > 0),
  amount integer not null check (amount > 0),
  status text not null check (status in ('pending', 'succeeded', 'failed')),
  reason text not null check (reason in ('cancellation', 'compensation')),
  requested_at timestamptz not null default now(),
  completed_at timestamptz,
  check ((status = 'succeeded') = (completed_at is not null))
);
create index order_refunds_order_idx on public.order_refunds(order_id);

-- Backfill only traceable paid purchases. Generic staff/granted rows are NOT
-- evidence of verified revue membership and remain legacy stream grants.
insert into public.revue_access(user_id, revue_id, source, order_id, granted_at, revoked_at, revocation_reason)
select
  a.user_id, o.revue_id, 'purchase', o.id, a.created_at, a.revoked_at,
  case when a.revoked_at is not null then 'legacy_revocation' end
from public.stream_access a join public.orders o on o.id = a.order_id
join public.streams s on s.id = a.stream_id
where a.source = 'purchase' and o.status = 'paid' and o.amount > 0 and o.user_id = a.user_id
  and o.stream_id = a.stream_id and o.revue_id = s.revue_id;

-- Old per-stream prices are left in place for compatibility. Only unambiguous
-- non-zero prices can become a revue price. Sales stay closed until configured.
insert into public.revue_prices(revue_id, user_type, amount, currency)
select s.revue_id, p.user_type, min(p.amount), min(p.currency)
from public.stream_prices p join public.streams s on s.id = p.stream_id
group by s.revue_id, p.user_type
having min(p.amount) > 0 and count(distinct (p.amount, p.currency)) = 1;

create function private.prepare_revue_order()
returns trigger language plpgsql set search_path = '' as $$
declare config public.revue_sales;
begin
  if tg_op = 'INSERT' then
    new.legacy_stream_purchase := false;
    new.refund_requested_at := null;
    if new.stream_id is not null then
      select s.revue_id into new.revue_id from public.streams s
      where s.id = new.stream_id and (new.revue_id is null or s.revue_id = new.revue_id);
    end if;
    select * into config from public.revue_sales where revue_id = new.revue_id;
    if not found then
      raise exception 'Configure revue sale, terms and hosting deadlines before checkout' using errcode = '23514';
    end if;
    new.terms_version := config.terms_version;
    new.first_show_at := config.first_show_at;
    new.cancellation_deadline_at := config.first_show_at - interval '2 hours';
  elsif (new.revue_id, new.stream_id, new.user_id, new.amount, new.currency, new.terms_version, new.legacy_stream_purchase,
      new.first_show_at, new.cancellation_deadline_at)
    is distinct from (old.revue_id, old.stream_id, old.user_id, old.amount, old.currency, old.terms_version, old.legacy_stream_purchase,
      old.first_show_at, old.cancellation_deadline_at) then
    -- ON DELETE SET NULL preserves orders when the Auth user is deleted.
    if not (old.user_id is not null and new.user_id is null
      and (new.revue_id, new.stream_id, new.amount, new.currency, new.terms_version, new.legacy_stream_purchase, new.first_show_at, new.cancellation_deadline_at)
        is not distinct from (old.revue_id, old.stream_id, old.amount, old.currency, old.terms_version, old.legacy_stream_purchase, old.first_show_at, old.cancellation_deadline_at)) then
      raise exception 'Order purchase snapshot is immutable' using errcode = '23514';
    end if;
  end if;
  if tg_op = 'UPDATE' and old.status = 'refunded' and new.status <> 'refunded' then
    raise exception 'A refunded order cannot be reopened' using errcode = '23514';
  end if;
  if tg_op = 'UPDATE' and old.refund_requested_at is null and new.refund_requested_at is not null then
    new.refund_requested_at := now();
  elsif tg_op = 'UPDATE' and old.refund_requested_at is not null
    and new.refund_requested_at is distinct from old.refund_requested_at then
    raise exception 'The received cancellation timestamp is immutable' using errcode = '23514';
  end if;
  return new;
end;
$$;
revoke all on function private.prepare_revue_order() from public, anon, authenticated;
create trigger orders_revue_snapshot before insert or update on public.orders
  for each row execute function private.prepare_revue_order();

create function private.protect_started_revue()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.first_show_at is distinct from old.first_show_at
    and (old.first_show_started_at is not null or now() >= old.first_show_at - interval '2 hours') then
    raise exception 'Closed cancellation window requires an explicit rescheduling workflow' using errcode = '23514';
  end if;
  if old.first_show_started_at is not null and new.first_show_started_at is distinct from old.first_show_started_at then
    raise exception 'The first-show start marker cannot be cleared or moved' using errcode = '23514';
  end if;
  return new;
end;
$$;
revoke all on function private.protect_started_revue() from public, anon, authenticated;
create trigger revue_sales_started before update on public.revue_sales
  for each row execute function private.protect_started_revue();

create function private.check_revue_access()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.source = 'purchase' then
    if new.revoked_at is null and not exists (
      select 1 from public.orders o where o.id = new.order_id
        and o.revue_id = new.revue_id and o.user_id = new.user_id and o.status = 'paid' and o.amount > 0
        and not exists (select 1 from public.order_refunds f
          where f.order_id = o.id and f.status = 'succeeded' and f.reason = 'cancellation')
    ) then
      raise exception 'Purchased access requires the matching paid order' using errcode = '23514';
    end if;
  elsif tg_op = 'INSERT' or (new.user_id, new.revue_id, new.source, new.lego_subject, new.lego_group_id, new.verified_at)
    is distinct from (old.user_id, old.revue_id, old.source, old.lego_subject, old.lego_group_id, old.verified_at)
    or (new.verification_identity_id is not null and new.verification_identity_id is distinct from old.verification_identity_id) then
    if not exists (select 1 from auth.identities i
      where i.id = new.verification_identity_id and i.user_id = new.user_id
        and i.provider = 'custom:abakus' and i.provider_id = new.lego_subject)
      or not exists (select 1 from public.revue_member_groups g
        where g.revue_id = new.revue_id and g.lego_group_id = new.lego_group_id)
      or new.verified_at > now() then
      raise exception 'Internal access requires a linked AbaID and the configured revue group' using errcode = '23514';
    end if;
  end if;
  return new;
end;
$$;
revoke all on function private.check_revue_access() from public, anon, authenticated;
create trigger revue_access_check before insert or update on public.revue_access
  for each row execute function private.check_revue_access();

create function private.check_refund_amount()
returns trigger language plpgsql set search_path = '' as $$
declare total integer; purchase_amount integer;
begin
  select amount into purchase_amount from public.orders where id = new.order_id for update;
  if tg_op = 'UPDATE' and old.status = 'succeeded' and new is distinct from old then
    raise exception 'Completed refund records are immutable' using errcode = '23514';
  end if;
  select coalesce(sum(amount), 0) into total from public.order_refunds
    where order_id = new.order_id and id <> new.id and status in ('pending', 'succeeded');
  if new.amount > purchase_amount or (new.status in ('pending', 'succeeded') and total + new.amount > purchase_amount) then
    raise exception 'Refund exceeds unrefunded purchase amount' using errcode = '23514';
  end if;
  return new;
end;
$$;
revoke all on function private.check_refund_amount() from public, anon, authenticated;
create trigger order_refunds_amount before insert or update on public.order_refunds
  for each row execute function private.check_refund_amount();

create function private.revoke_refunded_purchase()
returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_table_name = 'order_refunds' then
    if new.status = 'succeeded' and new.reason = 'cancellation' then
      update public.orders set status = 'refunded', refunded_at = new.completed_at where id = new.order_id;
    end if;
  elsif new.status = 'refunded' then
    update public.revue_access set revoked_at = coalesce(new.refunded_at, now()), revocation_reason = 'refund'
      where order_id = new.id and revoked_at is null;
  end if;
  return new;
end;
$$;
revoke all on function private.revoke_refunded_purchase() from public, anon, authenticated;
create trigger order_refunds_effect after insert or update on public.order_refunds
  for each row execute function private.revoke_refunded_purchase();
create trigger orders_refunded_access after update of status on public.orders
  for each row execute function private.revoke_refunded_purchase();

create function private.user_has_revue_access(_user_id uuid, _revue_id uuid)
returns boolean language sql stable set search_path = '' as $$
  select exists (
    select 1 from public.revue_access a where a.user_id = _user_id and a.revue_id = _revue_id and a.revoked_at is null
      and (a.source = 'internal' or exists (
        select 1 from public.orders o where o.id = a.order_id and o.user_id = a.user_id
          and o.revue_id = a.revue_id and o.status = 'paid' and o.amount > 0
          and not exists (select 1 from public.order_refunds f where f.order_id = o.id
            and f.status = 'succeeded' and f.reason = 'cancellation')
      ))
  );
$$;
revoke all on function private.user_has_revue_access(uuid, uuid) from public, anon;
grant execute on function private.user_has_revue_access(uuid, uuid) to authenticated, service_role;

create function public.can_play_source(_user_id uuid, _source_id uuid)
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
      and sale.stream_delete_at > now()
      and (c.scheduled_deletion_at is null or c.scheduled_deletion_at > now())
      and private.user_has_revue_access(_user_id, s.revue_id)
  );
$$;
alter table public.stream_playback add column signed_urls_verified_at timestamptz;

create function public.can_play_stream(_user_id uuid, _stream_id uuid)
returns boolean language sql stable set search_path = '' as $$
  select exists (
    select 1 from public.streams s join public.stream_playback p on p.stream_id = s.id
    join public.revue_sales sale on sale.revue_id = s.revue_id
    where s.id = _stream_id and s.status = 'live' and s.visible_from <= now()
      and (s.visible_until is null or s.visible_until > now())
      and private.revue_is_revealed(s.revue_id) and sale.stream_delete_at > now()
      and p.cloudflare_live_input_id is not null and p.signed_urls_verified_at is not null
      and private.user_has_revue_access(_user_id, s.revue_id)
  );
$$;

create function public.order_cancellation_allowed(_order_id uuid)
returns boolean language sql stable set search_path = '' as $$
  select exists (
    select 1 from public.orders o join public.revue_sales s on s.revue_id = o.revue_id
    where o.id = _order_id and o.status = 'paid'
      and (s.first_show_started_at is null or coalesce(o.refund_requested_at, now()) < s.first_show_started_at)
      and coalesce(o.refund_requested_at, now()) >= o.created_at
      and coalesce(o.refund_requested_at, now()) <= now()
      and coalesce(o.refund_requested_at, now()) <= o.cancellation_deadline_at
      and coalesce(o.refund_requested_at, now()) <= s.first_show_at - interval '2 hours'
  );
$$;
revoke all on function public.can_play_source(uuid, uuid), public.can_play_stream(uuid, uuid),
  public.order_cancellation_allowed(uuid) from public, anon, authenticated;
grant execute on function public.can_play_source(uuid, uuid), public.can_play_stream(uuid, uuid),
  public.order_cancellation_allowed(uuid) to service_role;

alter table public.revue_sales enable row level security;
alter table public.revue_prices enable row level security;
alter table public.revue_member_groups enable row level security;
alter table public.revue_access enable row level security;
alter table public.order_refunds enable row level security;
revoke all on public.revue_sales, public.revue_prices, public.revue_member_groups,
  public.revue_access, public.order_refunds from public, anon, authenticated;
grant all on public.revue_sales, public.revue_prices, public.revue_member_groups,
  public.revue_access, public.order_refunds to service_role;
grant select on public.revue_sales, public.revue_prices to anon, authenticated;
grant select on public.revue_member_groups, public.revue_access, public.order_refunds to authenticated;
create policy "Sales after revue reveal, admins preview" on public.revue_sales for select to anon, authenticated
  using (private.revue_is_revealed(revue_id) or (select private.is_admin()));
create policy "Prices after revue reveal, admins preview" on public.revue_prices for select to anon, authenticated
  using (private.revue_is_revealed(revue_id) or (select private.is_admin()));
create policy "Admins read configured membership groups" on public.revue_member_groups for select to authenticated
  using ((select private.is_admin()));
create policy "Users read their revue rights, admins read all" on public.revue_access for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy "Users read their refunds, admins read all" on public.order_refunds for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid()))
    or (select private.is_admin()));

-- Chat moderation remains independent. This helper is NOT a playback gate.
create or replace function private.has_stream_access(_stream_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select private.is_staff()
    or exists (select 1 from public.streams s where s.id = _stream_id
      and s.visible_from <= now() and (s.visible_until is null or s.visible_until > now())
      and private.user_has_revue_access((select auth.uid()), s.revue_id))
    or exists (select 1 from public.stream_access a where a.stream_id = _stream_id
      and a.source = 'granted' and a.user_id = (select auth.uid()) and a.revoked_at is null
      and (a.expires_at is null or a.expires_at > now()));
$$;
comment on function private.has_stream_access(uuid) is
  'Legacy chat/metadata permission including staff moderation. NEVER use for paid playback; use service-only can_play_source/can_play_stream.';
comment on table public.revue_sales is
  'Required sale/retention contract. D = stream_retire_at, H = stream_delete_at (at most 30 days later). #150 implements notifications, external deletion and billing cancellation; these rows do not schedule any external action.';
comment on table public.revue_access is
  'Permanent entitlement while content is offered, not guaranteed hosting. Internal evidence survives identity unlinking. Only trusted server code writes; no staff playback bypass.';
