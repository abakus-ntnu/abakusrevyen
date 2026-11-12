-- Proof of protection belongs to the specific external source, not its slot.
create function private.invalidate_video_protection()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.cloudflare_video_id is distinct from old.cloudflare_video_id
    or (old.deleted_at is not null and new.deleted_at is null) then
    new.signed_urls_verified_at := null;
  end if;
  return new;
end;
$$;
create function private.invalidate_live_protection()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.cloudflare_live_input_id is distinct from old.cloudflare_live_input_id then
    new.signed_urls_verified_at := null;
  end if;
  return new;
end;
$$;
revoke all on function private.invalidate_video_protection(), private.invalidate_live_protection()
  from public, anon, authenticated;
create trigger cloudflare_source_replaced before update on public.cloudflare_video_sources
  for each row execute function private.invalidate_video_protection();
create trigger cloudflare_live_replaced before update on public.stream_playback
  for each row execute function private.invalidate_live_protection();
