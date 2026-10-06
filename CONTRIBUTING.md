# Contributing

The rebuild lives on `v2`. Start feature branches from v2 and open pull requests
**against v2**. Keep changes small and describe their purpose, visible behavior and
verification. Do not merge the unfinished shell into main or prod.

The legacy production branch is `prod`; its GitHub Pages deployment is independent
of v2. The new CI does not deploy. A future release/cutover process must be agreed
before promoting v2. Do not restore the old deployment workflow on v2.

## Before merge

1. Use the pinned Node/pnpm versions from README.
2. Run `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm lint`, `pnpm build`.
3. Start `pnpm preview`; inspect `/`, a missing/deep URL and the link back home.
   Confirm refresh, browser back/forward, keyboard focus and narrow viewport behavior.
4. Review `git diff --check` and the diff for unintended files or secrets.
5. Commit `pnpm-lock.yaml` with any dependency changes. Use stable versions and
   check official migration guidance; keep Node pins and documentation aligned.
6. Update docs when behavior, environment variables or deployment assumptions change.

CI repeats install, typecheck, lint and build without credentials. Maintainers still
need to configure required checks and branch protection in GitHub after the branch
is published. A green local build does not confirm cloud integration.

Use English for code, comments and technical docs; Norwegian for public UI copy.
Follow the generated TypeScript/Oxlint conventions. Keep shared UI primitives in
`src/components/ui`, app code in `src`, and service clients in `src/lib`.
Add behavior tests when introducing meaningful application logic.

Agree content and design through [the content plan](docs/content-plan.md).
Recover reviewed public assets using [the legacy inventory](docs/legacy-inventory.md).
Do not copy old dates, personal information or privacy claims without checking them.
Never commit unpublished themes, private media, `.env.local`, service-role keys,
Supabase secret keys or Cloudflare API tokens. No backend credentials belong in `VITE_*`.
