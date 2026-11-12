import { PGlite } from '@electric-sql/pglite'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export async function createTestDatabase(beforeExtension) {
  const db = new PGlite()
  const dir = fileURLToPath(new URL('../migrations/', import.meta.url))
  const migrations = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()
  // Stand-ins for what a Supabase project already has.
  await db.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin bypassrls;
    create schema auth;
    create table auth.users (
      id uuid primary key default gen_random_uuid(),
      email text,
      raw_app_meta_data jsonb,
      raw_user_meta_data jsonb
    );
    create table auth.identities (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null references auth.users(id) on delete cascade,
      provider text not null,
      provider_id text not null,
      unique (provider, provider_id)
    );
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;
    grant usage on schema public, auth to anon, authenticated, service_role;
    create publication supabase_realtime;
    create schema realtime;
    create table realtime.messages (
      id uuid primary key default gen_random_uuid(),
      topic text not null,
      extension text not null,
      payload jsonb,
      event text,
      private boolean default false,
      inserted_at timestamp not null default now()
    );
    alter table realtime.messages enable row level security;
    create function realtime.topic() returns text language sql stable as $$
      select nullif(current_setting('realtime.topic', true), '')
    $$;
    create function realtime.send(payload jsonb, event text, topic text, private boolean default true)
    returns void language plpgsql as $$
    begin
      insert into realtime.messages (payload, event, topic, private, extension)
      values (payload, event, topic, private, 'broadcast');
    end $$;
    grant usage on schema realtime to anon, authenticated, service_role;
    grant select, insert on realtime.messages to authenticated;
  `)


  for (const file of migrations) {
    if (file.endsWith('_account_verification.sql') && beforeExtension) await beforeExtension(db)
    await db.exec(readFileSync(dir + file, 'utf8'))
  }
  return { db, migrations }
}
