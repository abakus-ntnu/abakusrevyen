# Deployment

## Current state

Legacy production remains on GitHub Pages. At the references recorded in
[legacy inventory](legacy-inventory.md), pushes to `prod` trigger `deploy.yml`;
manual dispatch is also enabled there. Main and prod have not been changed.
External deployment settings, DNS and the currently served revision were not inspected.

On v2, the production deploy workflow and `public/CNAME` are removed. The only
GitHub Actions workflow checks pushes to v2 and PRs targeting v2. It has read-only
repository permission, no secrets, no deployment steps and no manual dispatch.
It has been prepared locally, not run on GitHub. Nothing has been pushed or deployed.

## Cloudflare Pages target (not configured)

Create a **separate test Pages project** in a later task. Use its `pages.dev` domain;
do not attach or move `abakusrevyen.no` during testing. If connected to GitHub,
select v2 as this test project's production branch and explicitly restrict builds
to v2/relevant preview branches. Cloudflare's label “production” for the test
project does not mean the live Abakusrevyen website.

Suggested build settings:

| Setting | Value |
| --- | --- |
| Root | repository root |
| Build | `pnpm install --frozen-lockfile && pnpm check` |
| Output | `dist` |
| `NODE_VERSION` | `24.21.0` |
| `PNPM_VERSION` | `12.9.1` |
| `SKIP_DEPENDENCY_INSTALL` | `true` (explicit frozen installation above) |

Verify these exact tool versions in the first cloud build log. All app environment
variables are substituted at build time; changing them requires a rebuild.

Cloudflare Pages provides an SPA fallback when no top-level `404.html` exists.
This project deliberately does not ship that file. Verify direct loading and
refreshing deep URLs after deployment. `_headers` contains `noindex` for the
unfinished site; remove the HTML and header noindex directives only at launch.
Noindex is not access control: use Cloudflare Access if a preview must be private.

## Environment separation

| Variable / secret | Location | Needed now? |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Local `.env.local` or Pages environment build variables | Optional for shell; test URL for test builds |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Same environment as matching project URL | Optional for shell; public publishable key only |
| Supabase administrative credentials | Future server/CLI secret store only | Not configured; never VITE-prefixed |
| Cloudflare Stream account ID/API token | Future Edge Function configuration/secrets | Not configured; token never in frontend |

Use separate test/prod Supabase projects and environment-specific Pages values.
Auth redirect allowlists must match approved origins. Use private Storage buckets
and policies where appropriate; review RLS before connecting the browser.
Cloudflare Stream playback/upload configuration will be added with the video feature.
There are deliberately no unused Stream env placeholders in the app yet.

## Before first test deployment

- Publish v2 only after local review and explicit authorization; no push is part of this setup.
- Create/configure the isolated test Pages project and build runtime above.
- Enable the CI check as a required PR check if desired (external setting, still pending).
- The shell can deploy without Supabase. For backend testing, provision a test project,
  agree schema/migrations/policies and configure public environment values and Auth origins.
- Confirm production is untouched; do not change live DNS or GitHub Pages settings.
- Run CI, then test `/`, an unknown nested path, refresh, return-home and history navigation
  on the deployed URL. Check response headers and browser console.

Before a **real production cutover**, agree content/design, old URL redirects, privacy,
media permissions, backend security, Stream behavior, release ownership and rollback.
Provision production separately; validate before scheduling a DNS/hosting change.
The old prod commit remains a recovery reference, not an instruction to redeploy now.

References: [Vite on Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite3-project/),
[SPA serving behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/),
[Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/),
[build image and version overrides](https://developers.cloudflare.com/pages/configuration/build-image/).
