-- Run only against an explicitly selected test project, after all migrations.
-- Requires one existing test profile. Everything, including synthetic orders,
-- is rolled back. No payment-provider or Cloudflare API is called.
begin;
set local role service_role;
do $$
declare buyer uuid; revue uuid; first_order public.orders; second_order public.orders;
  repeated public.orders; video uuid; source uuid; blocked boolean;
begin
  select id into buyer from public.profiles limit 1;
  if buyer is null then raise exception 'A test profile is required'; end if;
  insert into public.revues(year, slug, visible_from, name_reveal_at)
    values (2199, 'schema-smoke-' || gen_random_uuid()::text, now(), now()) returning id into revue;
  insert into public.revue_sales(revue_id, first_show_at, sales_open_at, stream_retire_at, stream_delete_at, terms_version)
    values (revue, now() + interval '1 day', now(), now() + interval '14 days', now() + interval '21 days', 'smoke-v1');
  insert into public.revue_prices(revue_id, user_type, amount)
    values (revue, 'external', 14900), (revue, 'student', 14900);
  select * into first_order from public.prepare_revue_checkout(buyer, revue, 'smoke-v1', true);
  select * into repeated from public.prepare_revue_checkout(buyer, revue, 'smoke-v1', true);
  if repeated.id <> first_order.id or first_order.amount <> 14900 or first_order.terms_accepted_at is null then
    raise exception 'Checkout idempotency or snapshot failed';
  end if;
  update public.orders set status = 'expired' where id = first_order.id;
  select * into second_order from public.prepare_revue_checkout(buyer, revue, 'smoke-v1', true);
  update public.orders set status = 'paid' where id in (first_order.id, second_order.id);
  blocked := false;
  begin
    update public.orders set status = 'pending' where id = first_order.id;
  exception when check_violation then blocked := true;
  end;
  if not blocked then raise exception 'Settled payment regressed'; end if;
  insert into public.revue_access(user_id, revue_id, source, order_id)
    values (buyer, revue, 'purchase', first_order.id), (buyer, revue, 'purchase', second_order.id);
  insert into public.order_refunds(order_id, provider_refund_id, amount, status, reason, completed_at)
    values (first_order.id, 'smoke-' || gen_random_uuid()::text, 14900, 'succeeded', 'cancellation', now());
  if not private.user_has_revue_access(buyer, revue) then
    raise exception 'Refunding duplicate charge removed the other right';
  end if;
  insert into public.revue_videos(revue_id, title, kind, published_at)
    values (revue, 'Synthetic test recording', 'full', now()) returning id into video;
  insert into public.video_sources(video_id, revue_id, provider, state, published_at)
    values (video, revue, 'cloudflare', 'ready', now()) returning id into source;
  insert into public.cloudflare_video_sources(source_id, cloudflare_video_id, signed_urls_verified_at)
    values (source, 'synthetic-' || gen_random_uuid()::text, now());
  if public.can_play_source(buyer, source) then raise exception 'Missing deletion plan allowed playback'; end if;
  update public.cloudflare_video_sources set scheduled_deletion_at = now() + interval '20 days' where source_id = source;
  if not public.can_play_source(buyer, source) then raise exception 'Valid purchase/source denied playback'; end if;
  update public.cloudflare_video_sources set cloudflare_video_id = 'replacement-' || gen_random_uuid()::text where source_id = source;
  if exists (select 1 from public.cloudflare_video_sources where source_id = source
    and (scheduled_deletion_at is not null or signed_urls_verified_at is not null)) then
    raise exception 'Replacement retained old provider confirmations';
  end if;
  if has_function_privilege('anon', 'public.prepare_revue_checkout(uuid,uuid,text,boolean)', 'EXECUTE')
    or has_function_privilege('authenticated', 'public.prepare_revue_checkout(uuid,uuid,text,boolean)', 'EXECUTE') then
    raise exception 'Checkout RPC is exposed to untrusted callers';
  end if;
end;
$$;
rollback;
