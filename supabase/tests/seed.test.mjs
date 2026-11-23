import { readFileSync } from 'node:fs'
import { createTestDatabase } from './test-database.mjs'

const { db } = await createTestDatabase()
const seed = readFileSync(new URL('../seed.sql', import.meta.url), 'utf8')
await db.exec(seed)
await db.exec(seed) // must be safe to re-run

// Read the archive the way the website does: as an anonymous visitor through RLS.
await db.exec('set role anon')
const rows = (await db.query(`
  select r.year, d.name, count(s.id)::int as sources
  from public.revues r
  join public.revue_details d on d.revue_id = r.id
  join public.revue_videos v on v.revue_id = r.id
  join public.video_sources s on s.video_id = v.id
  group by r.year, d.name order by r.year`)).rows
await db.close()

const failures = [
  rows.length !== 10 && `expected 10 public revues, got ${rows.length}`,
  rows[0]?.sources !== 2 && '2017 should have two acts',
  rows.at(-1)?.sources !== 1 && '2026 should have one full video',
].filter(Boolean)
console.log(failures.length ? failures.join('\n') : 'seed: 10 revues readable by anon')
process.exit(failures.length ? 1 : 0)
