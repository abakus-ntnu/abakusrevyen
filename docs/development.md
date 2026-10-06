# Development

## Local workflow

See README for the pinned tool installation. `pnpm dev` runs Vite; `pnpm preview`
serves the `dist` output after `pnpm build`. `pnpm check` runs TypeScript project
checking, Oxlint and a production build. TypeScript strict mode is enabled. pnpm 12 settings live in `pnpm-workspace.yaml`,
not `.npmrc`. Direct dependencies are pinned exactly; lockfile freezes transitive dependencies.

The initial scaffold was produced using the official generator:

```sh
pnpm create vite@latest <temporary-directory> --template react-ts
```

Generator version: **create-vite 9.2.1**, resolved on 2026-10-06. Its source files
were moved into the root; Git metadata, LICENSE and independent editor settings
were retained. Demo logos/counter were removed. Oxlint is the current generator's
linter. Tailwind uses `@tailwindcss/vite` rather than an old PostCSS/Tailwind 3 recipe.
shadcn/ui was initialized with CLI **4.21.1** and a neutral starting preset;
its tokens are scaffolding, not the final design. Component source is checked in.

`src/App.tsx` declares BrowserRouter, `/` and `*`. `@/` resolves to `src/` in both
Vite and TypeScript. The not-found view is client-side; static SPA hosting returns
HTTP 200 for its HTML fallback. No SSR or Pages Functions are required.

`tsconfig.json` is the solution file that references the browser and Node configs;
its compiler options are not inherited by those projects. The `@/*` alias is therefore
also declared in `tsconfig.app.json`, where application files are checked. The root
copy lets shadcn/ui discover the alias. `baseUrl` is intentionally omitted: TypeScript
resolves `paths` relative to the config file and deprecated `baseUrl` for this use.
Both projects enable strict optional-property, indexed-access, return-path and
side-effect-import checks. The Node config explicitly pairs `module: nodenext` with
`moduleResolution: nodenext` so editor and CLI behavior cannot drift.

## Supabase: prepared versus pending

Prepared: `.env.example`, typed `getSupabaseClient()` and an explicitly empty
`Database` bootstrap type. Missing credentials or the example placeholders return
`null`. Callers must handle that state. The homepage makes no backend requests.
No schema, migrations, buckets, authentication UI or Edge Functions exist yet.

Pending: agree the data model and roles; choose separate test/production Supabase
projects. Auth handles identity, Postgres stores structured data, Storage holds
non-video files, and Edge Functions perform privileged operations. Design RLS,
grants and Storage policies before exposing data. The browser uses only the
publishable key. Never rely on a hidden URL or client-side route guard for access control.

## Planned local database and migration workflow

These commands are instructions for future backend work, not actions performed
by the scaffold. Install Docker first, then add and lock the current stable CLI
when backend development starts:

```sh
pnpm add -D --save-exact supabase@latest
pnpm exec supabase init
pnpm exec supabase start
pnpm exec supabase migration new <descriptive_name>
# Edit the new SQL migration, including RLS/grants where needed.
pnpm exec supabase db reset
```

`db reset` resets the **local** database and replays migrations; it destroys local
data. Use synthetic/public seed data only. Commit reviewed `supabase/config.toml`
and migrations. Do not commit local runtime state, login tokens or private seed data.
Remote linking and `db push` require a separately agreed test/prod release workflow;
no remote linking or mutation has happened here.

Generate types from the local schema after applying migrations:

```sh
pnpm exec supabase gen types typescript --local --schema public > /tmp/abakus-database.types.ts
# Only after the command succeeds, replace the bootstrap file:
cp /tmp/abakus-database.types.ts src/lib/database.types.ts
pnpm typecheck
```

Alternatively, after authenticating with the CLI, generate from a chosen **test**
project using `--project-id <test-project-ref> --schema public` instead of `--local`.
Inspect and commit the generated file with schema changes. The empty bootstrap
maps do not describe a deployed schema and must not be manually filled with guesses.

Cloudflare Stream will host video. A future authenticated Edge Function can issue
short-lived upload URLs, with the Cloudflare API token held only on the server.
Playback visibility, signed URLs, upload limits and authorization remain decisions.
No video uploads or function deploys were performed.

## Official references consulted

Checked 2026-10-06; dependencies resolve to stable versions in pnpm-lock.yaml.

- [Vite getting started](https://vite.dev/guide/)
- [Node release support](https://nodejs.org/en/about/previous-releases)
- [pnpm installation](https://pnpm.io/installation)
- [React Router declarative installation](https://reactrouter.com/start/declarative/installation)
- [Tailwind Vite integration](https://tailwindcss.com/docs/installation/using-vite)
- [shadcn/ui Vite setup](https://ui.shadcn.com/docs/installation/vite)
- [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)
- [Supabase type generation](https://supabase.com/docs/guides/api/rest/generating-types)
- [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys)
- [Stream direct creator uploads](https://developers.cloudflare.com/stream/uploading-videos/direct-creator-uploads/)

## Verified versions (2026-10-06)

| Tool / package | Version |
| --- | --- |
| Node.js LTS | 24.21.0 |
| pnpm | 12.9.1 |
| vite | 8.3.2 |
| react | 19.3.0 |
| react-dom | 19.3.0 |
| typescript | 7.0.2 |
| react-router | 8.4.0 |
| tailwindcss | 4.3.3 |
| @tailwindcss/vite | 4.3.3 |
| shadcn | 4.21.1 |
| @supabase/supabase-js | 2.117.2 |
| oxlint | 1.86.0 |

The generator initially constrained TypeScript to 6.0; it was updated to stable 7.0.2
and the full checks passed. No beta, canary or experimental direct packages are selected.
pnpm configuration follows the [current settings reference](https://pnpm.io/settings).

## Local verification of the initial scaffold

On 2026-10-06, using the pinned Node/pnpm versions:

- Frozen lockfile installation, typecheck, lint and production build passed.
- Vite dev server started without environment files or active Supabase credentials.
- Safari: homepage, direct `/ukjent/side`, refresh, return-home link and browser
  back/forward navigation passed on the dev server.
- Safari: production preview served the deep-route fallback and return-home page.
- The Supabase client module returned `null` with no credentials.
- `git diff --check` passed; LICENSE and the main/prod references were unchanged.

GitHub Actions, Cloudflare Pages behavior/headers and actual backend integrations
remain unverified remotely. No cloud resources were provisioned or mutated.
