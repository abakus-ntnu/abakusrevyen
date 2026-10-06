# Repository instructions

- Read README.md, CONTRIBUTING.md and relevant docs before changing architecture.
- Work on v2 or a feature branch from it. Preserve unrelated local changes and LICENSE.
- Do not modify main/prod, push, merge, deploy, change DNS or external service settings unless explicitly requested.
- Use pinned Node 24.21.0 and pnpm 12.9.1. Commit pnpm-lock.yaml with dependency changes.
- Keep this a client-rendered Vite app. Use React Router, Tailwind and shadcn/ui conventions.
- Keep the initial shell minimal; agree content, navigation and design before expanding it.
- Use Supabase for Auth/database/Storage/Edge Functions and Cloudflare Stream for video.
- Keep the shell runnable without credentials. Generate database types from the agreed schema; never invent tables.
- Treat every VITE_* value as public. Never add private keys, unpublished themes or private media.
- Write English code/comments/docs and Norwegian public UI copy.
- Run frozen installation, typecheck, lint and build; verify changed routes in a browser.
- Report checks performed and distinguish local scaffolding from configured cloud infrastructure.
