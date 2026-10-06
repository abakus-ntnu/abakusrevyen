# Abakusrevyen v2

Minimal foundation for rebuilding Abakusrevyen's website. The browser-rendered
React application currently has a Norwegian placeholder homepage and a not-found route.
Content, navigation and visual design remain to be agreed.

Frontend: Vite, React, TypeScript, React Router, Tailwind CSS and shadcn/ui.
Planned backend: Supabase Auth, Postgres, Storage and Edge Functions.
Planned video service: Cloudflare Stream. Hosting target: Cloudflare Pages.
No backend or hosting resources have been provisioned by this change.

## Requirements and quick start

- Node.js **24.21.0** (supported 24 LTS line), pinned in `.node-version` and `.nvmrc`.
- pnpm **12.9.1**, pinned in `package.json`; `engineStrict` in `pnpm-workspace.yaml` enforces engine requirements.

```sh
nvm install # if using nvm
nvm use
npm install --global pnpm@12.9.1
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by Vite. Supabase credentials are **optional** for the shell.
When a project is available, copy `.env.example` to `.env.local` and replace both
placeholders with its public URL and publishable key. Restart Vite after env changes.

```sh
pnpm typecheck
pnpm lint
pnpm build
pnpm preview
# Or run all three checks:
pnpm check
```

`pnpm-lock.yaml` is the reproducible dependency source. No production deploy command
is configured. The v2 CI only validates pull requests targeting v2 and pushes to v2.

## Documentation

- [Contributing](CONTRIBUTING.md): branch flow and review checks
- [Development](docs/development.md): architecture, versions and future Supabase workflow
- [Deployment](docs/deployment.md): configured versus pending infrastructure
- [Content plan](docs/content-plan.md): decisions before content work
- [Legacy inventory](docs/legacy-inventory.md): original commits, routes and recoverable assets
- [AI instructions](AGENTS.md)

The repository is public. Do not commit unpublished revue themes, imagery or credentials.
The original [LICENSE](LICENSE) and Git history are preserved.
