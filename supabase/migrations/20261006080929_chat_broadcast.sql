-- Chat delivery: from Postgres Changes to Broadcast from database.
--
-- Messages are still written to public.chat_messages, so stream access, bans,
-- the chat switch, history and moderation work as before. A trigger sends each
-- message once to the private Realtime topic chat:<stream id>, and a policy on
-- realtime.messages lets only users with access to that stream join the topic.
--
-- Clients
--   * subscribe with supabase.channel('chat:<stream id>', { config: { private: true } })
--     after supabase.realtime.setAuth()
--   * post by inserting into chat_messages, not by broadcasting
--   * load history with a normal select on chat_messages
--
-- Events on the topic
--   message          a new message: id, stream_id, user_id, display_name, body, created_at
--   message_hidden   hidden by a moderator or deleted: id, stream_id
--   message_restored a hidden message is shown again: same fields as message

-- ---------------------------------------------------------------------------
-- Who may join a chat topic
-- ---------------------------------------------------------------------------

-- False for anything that is not chat:<uuid>, so a malformed topic cannot raise.
create function private.chat_topic_access(_topic text)
returns boolean
language sql
stable
set search_path = ''
as $$
  select case
    when _topic ~ '^chat:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      then private.has_stream_access(substr(_topic, 6)::uuid)
    else false
  end;
$$;

revoke execute on function private.chat_topic_access(text) from public;
grant execute on function private.chat_topic_access(text) to authenticated, service_role;

-- Realtime checks this when a client joins and caches the answer for the rest
-- of the connection. There is no insert policy, so clients cannot broadcast to
-- a private topic themselves.
create policy "Viewers receive the chat of streams they have access to"
  on realtime.messages for select to authenticated
  using (
    realtime.messages.extension = 'broadcast'
    and private.chat_topic_access((select realtime.topic()))
  );

-- ---------------------------------------------------------------------------
-- Send chat changes to the topic
-- ---------------------------------------------------------------------------

create function private.chat_message_broadcast()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  _row public.chat_messages := coalesce(new, old);
  _topic text := 'chat:' || _row.stream_id;
  _message jsonb := jsonb_build_object(
    'id', _row.id,
    'stream_id', _row.stream_id,
    'user_id', _row.user_id,
    'display_name', _row.display_name,
    'body', _row.body,
    'created_at', _row.created_at
  );
  _reference jsonb := jsonb_build_object('id', _row.id, 'stream_id', _row.stream_id);
begin
  if tg_op = 'INSERT' then
    if new.deleted_at is null then
      perform realtime.send(_message, 'message', _topic, true);
    end if;
  elsif tg_op = 'UPDATE' then
    if new.deleted_at is not null and old.deleted_at is null then
      -- The text of a hidden message is not sent again.
      perform realtime.send(_reference, 'message_hidden', _topic, true);
    elsif new.deleted_at is null and old.deleted_at is not null then
      perform realtime.send(_message, 'message_restored', _topic, true);
    end if;
  elsif tg_op = 'DELETE' then
    if old.deleted_at is null then
      perform realtime.send(_reference, 'message_hidden', _topic, true);
    end if;
  end if;
  return null;
end;
$$;

revoke execute on function private.chat_message_broadcast() from public;

create trigger chat_messages_broadcast
  after insert or update of deleted_at or delete on public.chat_messages
  for each row execute function private.chat_message_broadcast();

-- ---------------------------------------------------------------------------
-- Stop Postgres Changes for chat
-- ---------------------------------------------------------------------------

-- streams stays in the publication, for status changes.
alter publication supabase_realtime drop table public.chat_messages;

comment on table public.chat_messages is
  'Chat per stream. Delivered through Realtime Broadcast on the private topic chat:<stream id>. Clients insert only stream_id and body.';
comment on column public.chat_messages.display_name is
  'Copied from the profile by a trigger. Profiles are private, so the name has to be in the row.';
comment on column public.chat_messages.deleted_at is
  'Set by a moderator. Clients get a message_hidden event and hide the message.';
