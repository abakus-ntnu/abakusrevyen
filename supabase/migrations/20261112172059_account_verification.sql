-- A login provider is an identity, not proof of current student eligibility.
create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    left(coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''), 'Anonym'
    ), 60),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

update public.profiles set user_type = 'external' where user_type = 'student';
comment on column public.profiles.user_type is
  'Deprecated compatibility field. Never use as proof of student pricing; use current_price_type() or private.verified_user_type(user_id).';

-- No default eligibility duration or group IDs: the verification service must
-- supply an agreed expiry and criteria version after checking LEGO directly.
create table public.student_verifications (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  identity_id uuid not null references auth.identities(id) on delete cascade,
  lego_subject text not null check (length(lego_subject) > 0),
  eligible boolean not null,
  reason text not null check (reason ~ '^[a-z][a-z0-9_]*$'),
  criteria_version text not null check (length(criteria_version) > 0),
  checked_at timestamptz not null,
  expires_at timestamptz not null,
  check (expires_at > checked_at)
);
create index student_verifications_identity_idx on public.student_verifications(identity_id);
alter table public.student_verifications enable row level security;
revoke all on public.student_verifications from public, anon, authenticated;
grant select on public.student_verifications to authenticated;
grant all on public.student_verifications to service_role;
create policy "Users read their verification, admins read all"
  on public.student_verifications for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));

-- This trigger only checks binding; the server remains responsible for proving
-- current data/cyber eligibility. No client may insert verification results.
create function private.check_student_identity()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if not exists (
    select 1 from auth.identities i
    where i.id = new.identity_id and i.user_id = new.user_id
      and i.provider = 'custom:abakus' and i.provider_id = new.lego_subject
  ) then
    raise exception 'Verification must match a linked AbaID identity' using errcode = '23514';
  end if;
  if new.checked_at > now() then
    raise exception 'Verification cannot be dated in the future' using errcode = '23514';
  end if;
  return new;
end;
$$;
revoke all on function private.check_student_identity() from public, anon, authenticated;
create trigger student_verification_identity
  before insert or update on public.student_verifications
  for each row execute function private.check_student_identity();

-- Invoker security: an authenticated caller can only see their own result
-- through RLS. Service-role checkout may evaluate a verified user's price.
create function private.verified_user_type(_user_id uuid)
returns public.user_type language sql stable set search_path = '' as $$
  select case when exists (
    select 1 from public.student_verifications v
    where v.user_id = _user_id and v.eligible
      and v.checked_at <= now() and v.expires_at > now()
  ) then 'student'::public.user_type else 'external'::public.user_type end;
$$;
revoke all on function private.verified_user_type(uuid) from public, anon;
grant execute on function private.verified_user_type(uuid) to authenticated, service_role;

create function public.current_price_type()
returns public.user_type language sql stable set search_path = '' as $$
  select private.verified_user_type((select auth.uid()));
$$;
revoke all on function public.current_price_type() from public, anon;
grant execute on function public.current_price_type() to authenticated, service_role;

comment on table public.student_verifications is
  'Minimal server-verified current eligibility. Linking and provider-token checks live in #123/#137; no OAuth tokens or full LEGO responses are stored here. Unlinking the identity removes this current result, not purchased/internal revue rights.';
