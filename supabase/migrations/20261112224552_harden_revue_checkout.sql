-- Refuse to discard unmigrated legacy access, prices or provider identifiers.
-- The connected test project has no purchases; these guards protect other stacks.
do $$ begin
  if exists (select 1 from public.stream_access a
    where a.source = 'granted' or (a.source = 'purchase' and a.revoked_at is null
      and not exists (select 1 from public.revue_access r where r.order_id = a.order_id and r.user_id = a.user_id))) then
    raise exception 'Resolve legacy stream grants before retiring stream_access';
  end if;
  if exists (select 1 from public.stream_prices p join public.streams s on s.id = p.stream_id
    where not exists (select 1 from public.revue_prices r where r.revue_id = s.revue_id
      and r.user_type = p.user_type and r.amount = p.amount and r.currency = p.currency)) then
    raise exception 'Resolve conflicting or free legacy prices before retiring stream_prices';
  end if;
  if exists (select 1 from public.stream_playback p where p.cloudflare_video_id is not null
    and not exists (select 1 from public.cloudflare_video_sources c where c.cloudflare_video_id = p.cloudflare_video_id)) then
    raise exception 'Migrate every legacy recording before removing its old identifier';
  end if;
  if exists (select 1 from public.orders where status = 'pending' and user_id is not null group by user_id, revue_id having count(*) > 1) then
    raise exception 'Reconcile duplicate pending checkouts before enabling checkout serialization';
  end if;
end $$;

drop trigger orders_revue_snapshot on public.orders;
drop index public.orders_one_paid_revue_idx;
drop index public.orders_one_paid_per_user_stream_idx;
alter table public.orders
  add column price_type public.user_type,
  add column eligibility_checked_at timestamptz,
  add column terms_accepted_at timestamptz,
  drop column stream_id,
  drop column legacy_stream_purchase;
-- Historical orders deliberately retain NULL snapshots that were never captured.
create unique index orders_one_pending_revue_idx on public.orders(user_id, revue_id) where status = 'pending';

create or replace function private.has_stream_access(_stream_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select private.is_staff() or exists (
    select 1 from public.streams s where s.id = _stream_id and s.visible_from <= now()
      and (s.visible_until is null or s.visible_until > now())
      and private.user_has_revue_access((select auth.uid()), s.revue_id)
  );
$$;
drop table public.stream_access;
drop table public.stream_prices;
drop type public.access_source;
alter table public.profiles drop column user_type;
alter table public.streams drop column sales_open_at, drop column sales_close_at, drop column replay_available_until;
alter table public.stream_playback drop column cloudflare_video_id;

-- Configured first_show_at is the authoritative premiere, never the next stream.
-- Guard physical-show edits against silently making that premiere incorrect.
create function private.check_first_show_time()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_table_name = 'revue_sales' then
    if exists (select 1 from public.shows s where s.revue_id = new.revue_id and s.starts_at < new.first_show_at) then
      raise exception 'First-show time cannot be later than an existing physical show' using errcode = '23514';
    end if;
    if new.first_show_started_at > now() then
      raise exception 'First-show start marker cannot be in the future' using errcode = '23514';
    end if;
  elsif exists (select 1 from public.revue_sales s where s.revue_id = new.revue_id and new.starts_at < s.first_show_at) then
    raise exception 'Update the authoritative premiere before adding an earlier physical show' using errcode = '23514';
  end if;
  return new;
end;
$$;
revoke all on function private.check_first_show_time() from public, anon, authenticated;
create trigger revue_sales_first_show_check before insert or update on public.revue_sales
  for each row execute function private.check_first_show_time();
create trigger shows_first_show_check before insert or update on public.shows
  for each row execute function private.check_first_show_time();

create or replace function private.prepare_revue_order()
returns trigger language plpgsql set search_path = '' as $$
declare config public.revue_sales; price public.revue_prices; tier public.user_type;
begin
  if tg_op = 'INSERT' then
    -- Serialize every checkout creator for the same buyer, including direct SQL.
    perform 1 from public.profiles where id = new.user_id for update;
    if not found then
      raise exception 'Checkout requires an existing verified user' using errcode = '23514';
    end if;
    select * into config from public.revue_sales where revue_id = new.revue_id for share;
    if not found or not private.revue_is_revealed(new.revue_id)
      or config.sales_open_at is null or config.sales_open_at > now()
      or config.sales_close_at <= now() or config.stream_delete_at <= now() then
      raise exception 'Revue sales are not open' using errcode = '23514';
    end if;
    if new.status <> 'pending' then
      raise exception 'Create a pending checkout before recording payment' using errcode = '23514';
    end if;
    if new.terms_accepted_at is null or new.terms_version is distinct from config.terms_version then
      raise exception 'Accept the current terms before checkout' using errcode = '23514';
    end if;
    if private.user_has_revue_access(new.user_id, new.revue_id) or exists (select 1 from public.orders o where o.user_id = new.user_id and o.revue_id = new.revue_id and o.status = 'paid') then
      raise exception 'User already has access to this revue' using errcode = '23514';
    end if;
    tier := private.verified_user_type(new.user_id);
    select * into price from public.revue_prices where revue_id = new.revue_id and user_type = tier for share;
    if not found then
      raise exception 'Configure a price for the verified price category' using errcode = '23514';
    end if;
    new.price_type := tier;
    new.amount := price.amount;
    new.currency := price.currency;
    new.eligibility_checked_at := null;
    if tier = 'student' then
      select checked_at into new.eligibility_checked_at from public.student_verifications where user_id = new.user_id;
    end if;
    new.terms_version := config.terms_version;
    new.terms_accepted_at := now();
    new.created_at := now();
    new.first_show_at := config.first_show_at;
    new.cancellation_deadline_at := config.first_show_at - interval '2 hours';
    new.refund_requested_at := null;
    new.paid_at := null;
    new.refunded_at := null;
  else
    if (new.revue_id, new.amount, new.currency, new.terms_version, new.first_show_at,
      new.cancellation_deadline_at, new.price_type, new.eligibility_checked_at, new.terms_accepted_at, new.created_at)
      is distinct from (old.revue_id, old.amount, old.currency, old.terms_version, old.first_show_at,
      old.cancellation_deadline_at, old.price_type, old.eligibility_checked_at, old.terms_accepted_at, old.created_at)
      or (new.user_id is distinct from old.user_id and not (old.user_id is not null and new.user_id is null)) then
      raise exception 'Order purchase snapshot is immutable' using errcode = '23514';
    end if;
    if (old.status = 'paid' and new.status not in ('paid', 'refunded'))
      or (old.status = 'refunded' and new.status <> 'refunded') then
      raise exception 'A settled payment cannot regress or reopen' using errcode = '23514';
    end if;
    if (old.stripe_checkout_session_id is not null and new.stripe_checkout_session_id is distinct from old.stripe_checkout_session_id)
      or (old.stripe_payment_intent_id is not null and new.stripe_payment_intent_id is distinct from old.stripe_payment_intent_id) then
      raise exception 'Payment provider references cannot be reassigned' using errcode = '23514';
    end if;
    if old.paid_at is not null and new.paid_at is distinct from old.paid_at then
      raise exception 'Payment receipt time is immutable' using errcode = '23514';
    end if;
    if old.refunded_at is not null and new.refunded_at is distinct from old.refunded_at then
      raise exception 'Refund receipt time is immutable' using errcode = '23514';
    end if;
    if new.status = 'paid' then new.paid_at := coalesce(new.paid_at, now()); end if;
    if new.status = 'refunded' then new.refunded_at := coalesce(new.refunded_at, now()); end if;
    if old.refund_requested_at is null and new.refund_requested_at is not null then
      new.refund_requested_at := now();
    elsif old.refund_requested_at is not null and new.refund_requested_at is distinct from old.refund_requested_at then
      raise exception 'The received cancellation timestamp is immutable' using errcode = '23514';
    end if;
  end if;
  return new;
end;
$$;
create trigger orders_revue_snapshot before insert or update on public.orders
  for each row execute function private.prepare_revue_order();

-- The authenticated Edge Function chooses _user_id from a verified session.
-- Use the returned order ID as the payment provider's idempotency key.
-- Do not expire pending rows just because a local timer elapsed: first confirm
-- that the provider checkout can no longer capture a payment.
create function public.prepare_revue_checkout(_user_id uuid, _revue_id uuid, _terms_version text, _accept_terms boolean)
returns public.orders language plpgsql set search_path = '' as $$
declare config public.revue_sales; price public.revue_prices; tier public.user_type; checkout public.orders;
begin
  if _accept_terms is distinct from true then
    raise exception 'Explicit terms acceptance is required' using errcode = '23514';
  end if;
  perform 1 from public.profiles where id = _user_id for update;
  if not found then raise exception 'Unknown checkout user' using errcode = '23514'; end if;
  select * into config from public.revue_sales where revue_id = _revue_id for share;
  if not found or not private.revue_is_revealed(_revue_id)
    or config.sales_open_at is null or config.sales_open_at > now()
    or config.sales_close_at <= now() or config.stream_delete_at <= now() then
    raise exception 'Revue sales are not open' using errcode = '23514';
  end if;
  if _terms_version is distinct from config.terms_version then
    raise exception 'Terms changed; present the current version before checkout' using errcode = '23514';
  end if;
  if private.user_has_revue_access(_user_id, _revue_id) or exists (select 1 from public.orders o where o.user_id = _user_id and o.revue_id = _revue_id and o.status = 'paid') then
    raise exception 'User already has access to this revue' using errcode = '23514';
  end if;
  tier := private.verified_user_type(_user_id);
  select * into price from public.revue_prices where revue_id = _revue_id and user_type = tier for share;
  if not found then raise exception 'Price is not configured' using errcode = '23514'; end if;
  select * into checkout from public.orders where user_id = _user_id and revue_id = _revue_id and status = 'pending' for update;
  if found then
    if checkout.terms_version is distinct from config.terms_version or checkout.price_type is distinct from tier
      or checkout.amount <> price.amount or checkout.currency <> price.currency then
      raise exception 'Reconcile the existing provider checkout before changing its terms or price' using errcode = '23514';
    end if;
    return checkout;
  end if;
  insert into public.orders(user_id, revue_id, amount, terms_version, terms_accepted_at)
    values (_user_id, _revue_id, price.amount, _terms_version, now()) returning * into checkout;
  return checkout;
end;
$$;
revoke all on function public.prepare_revue_checkout(uuid, uuid, text, boolean) from public, anon, authenticated;
grant execute on function public.prepare_revue_checkout(uuid, uuid, text, boolean) to service_role;

-- Multiple confirmed provider refunds may settle one cancelled purchase.
-- Preserve the first receipt timestamp while recording every refund separately.
create or replace function private.revoke_refunded_purchase()
returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_table_name = 'order_refunds' then
    if new.status = 'succeeded' and new.reason = 'cancellation' then
      update public.orders set status = 'refunded', refunded_at = coalesce(refunded_at, new.completed_at)
        where id = new.order_id;
    end if;
  elsif new.status = 'refunded' then
    update public.revue_access set revoked_at = coalesce(new.refunded_at, now()), revocation_reason = 'refund'
      where order_id = new.id and revoked_at is null;
  end if;
  return new;
end;
$$;

create function private.protect_refund_history()
returns trigger language plpgsql set search_path = '' as $$
begin
  raise exception 'Refund history cannot be deleted' using errcode = '23514';
end;
$$;
revoke all on function private.protect_refund_history() from public, anon, authenticated;
create trigger order_refunds_preserve before delete on public.order_refunds
  for each row execute function private.protect_refund_history();
revoke delete, truncate on public.order_refunds, public.orders from service_role;

comment on table public.orders is
  'One payment-provider checkout attempt per row, covering a whole revue. Retain every actual charge, including duplicate external payments. Pending checkouts are serialized; settled payments never regress. Historical missing snapshots remain NULL.';
comment on column public.orders.amount is 'Minor units (ore), calculated from revue_prices using current verified eligibility at checkout.';
comment on table public.streams is 'Public live metadata and chat scheduling. Sales and entitlements belong to the revue, recordings to revue_videos.';
comment on table public.stream_playback is 'Private live-input administration. Recordings use cloudflare_video_sources. Never persist playback tokens or RTMPS keys.';
comment on column public.orders.price_type is 'Server-calculated student/external category at checkout, independent of later eligibility changes.';
comment on column public.orders.terms_accepted_at is 'Server receipt of explicit acceptance of terms_version, not automatic proof inferred from account creation.';
comment on function public.prepare_revue_checkout(uuid, uuid, text, boolean) is
  'Service-only atomic checkout preparation. Verify the user session and actual acceptance in the Edge Function. Reuse order ID for Stripe idempotency. Provider API calls and webhook reconciliation remain #133.';
