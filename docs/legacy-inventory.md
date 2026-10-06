# Legacy inventory

Captured 2026-10-06 before replacing the Astro application on `v2`.

## Immutable references

- Legacy main: `631e7660ed1f2b59a21e457789e32349c850a3d7`
- Legacy prod: `7c366cd3e2ae828e2e9679fc19d1f2b37199d3e5`

Fetched origin before branching. Local main already matched origin/main; working tree was clean,
with no untracked source changes. No pre-existing local or remote v2 branch was found.
`git diff origin/main origin/prod` was empty. Prod contains 18 additional commits
(17 merges and one image-orientation fix); main is an ancestor of prod, and their trees match.
Existing ignored build/dependency caches were moved to a local temporary backup, not committed.

README's production claim is confirmed by `.github/workflows/deploy.yml` at both references:
pushes to prod build Astro and deploy to GitHub Pages (`github-pages` environment).
It also accepts `workflow_dispatch`, without a branch guard. External GitHub Pages settings,
last deployment and DNS have not been inspected or changed; this confirms repository configuration.

All paths below refer to **both commits above**, not the new working tree. Restore only
reviewed, public content. Historical easter eggs are indexed by path, without copying their
activation strings. No new theme, unpublished imagery or credentials are introduced.

```sh
# Inspect a text file without restoring old application code:
git show 631e7660ed1f2b59a21e457789e32349c850a3d7:src/lib/constants.ts
# Recover selected assets into a separate directory:
mkdir -p /tmp/abakus-legacy-review
git archive 7c366cd3e2ae828e2e9679fc19d1f2b37199d3e5 src/images public/fonts | tar -x -C /tmp/abakus-legacy-review
```

## Content and behavior map

| Content | Source paths | Notes for recovery |
| --- | --- | --- |
| Homepage and seasonal text | `src/pages/index.astro`, `src/layouts/Home/*.astro` | Recruitment, countdown, show and break variants |
| Show dates, venue, tickets | `src/lib/shows.ts`, `src/lib/constants.ts`, `src/lib/periods.ts` | Dates are historical; reconcile before reuse |
| Revue archive, YouTube IDs and playlists | `src/lib/constants.ts`, `src/pages/revyer.astro` | Includes scheduled availability and per-revue logos |
| Recruitment | `src/pages/opptak.astro`, `src/layouts/Home/Recruitment.astro` | Links to external admissions service |
| Group descriptions and email addresses | `src/content/grupper/*.md`, `src/content/config.ts` | Group slug determines URL; leader references |
| Leader biographies, roles and portraits | `src/content/ledere/*.md`, `src/images/ledere/*` | Check accuracy and publication consent before reuse |
| About articles | `src/content/om_oss/*.md`, `src/layouts/ArticleLayout.astro` | Titles, descriptions, dates and full article copy |
| Contact and legal text | `src/pages/kontakt.astro`, `src/pages/personvern.astro` | Organization details and privacy copy need reassessment for new services |
| Gallery | `src/pages/galleri.astro`, `src/images/gallery/*` | Swiper/PhotoSwipe image viewer |
| Brand and group imagery | `src/images/revy-logo.webp`, `src/images/revy_logoer/*`, `src/images/gruppebilder/*`, `src/images/undergrupper_logoer/*` | Exact asset index below |
| Fonts and licenses | `public/fonts/*` | Inter, Tauri and Lcd; preserve each font license if reused |
| Site furniture and metadata | `src/components/Header/*`, `src/components/Footer/*`, `src/layouts/RootLayout.astro`, `public/favicon.webp` | Navigation, metadata, theme preference |

## Legacy URLs

No redirects or old content pages are implemented in v2 yet. Decide keep/redirect/retire for
these URLs before launch. Dynamic URLs derive from Markdown filenames listed below.

| URL | Source |
| --- | --- |
| `/galleri` | `src/pages/galleri.astro` |
| `/grupper/[slug]` | `src/pages/grupper/[slug].astro` |
| `/grupper` | `src/pages/grupper/index.astro` |
| `/` | `src/pages/index.astro` |
| `/kontakt` | `src/pages/kontakt.astro` |
| `/ledere/[slug]` | `src/pages/ledere/[slug].astro` |
| `/ledere` | `src/pages/ledere/index.astro` |
| `/om_oss/[slug]` | `src/pages/om_oss/[slug].astro` |
| `/om_oss` | `src/pages/om_oss/index.astro` |
| `/opptak` | `src/pages/opptak.astro` |
| `/personvern` | `src/pages/personvern.astro` |
| `/revyer` | `src/pages/revyer.astro` |
| `/grupper/arring` | `src/content/grupper/arring.md` |
| `/grupper/band` | `src/content/grupper/band.md` |
| `/grupper/dans` | `src/content/grupper/dans.md` |
| `/grupper/kostyme` | `src/content/grupper/kostyme.md` |
| `/grupper/manus` | `src/content/grupper/manus.md` |
| `/grupper/pr` | `src/content/grupper/pr.md` |
| `/grupper/revystyret` | `src/content/grupper/revystyret.md` |
| `/grupper/scene` | `src/content/grupper/scene.md` |
| `/grupper/skuespill` | `src/content/grupper/skuespill.md` |
| `/grupper/sosial` | `src/content/grupper/sosial.md` |
| `/grupper/teknikk` | `src/content/grupper/teknikk.md` |
| `/ledere/andreas-svendsrud` | `src/content/ledere/andreas-svendsrud.md` |
| `/ledere/brage-naustan` | `src/content/ledere/brage-naustan.md` |
| `/ledere/camilla-klem` | `src/content/ledere/camilla-klem.md` |
| `/ledere/carl-christian-steen` | `src/content/ledere/carl-christian-steen.md` |
| `/ledere/eirik-roed` | `src/content/ledere/eirik-roed.md` |
| `/ledere/ellen-urdal` | `src/content/ledere/ellen-urdal.md` |
| `/ledere/linnea-johannesen` | `src/content/ledere/linnea-johannesen.md` |
| `/ledere/madelen-lothe` | `src/content/ledere/madelen-lothe.md` |
| `/ledere/phillip-bjornevoll` | `src/content/ledere/phillip-bjornevoll.md` |
| `/ledere/rikke-schjonsby` | `src/content/ledere/rikke-schjonsby.md` |
| `/ledere/sander-skofsrud` | `src/content/ledere/sander-skofsrud.md` |
| `/ledere/sebastian-aarsheim` | `src/content/ledere/sebastian-aarsheim.md` |
| `/ledere/viktor-grevskott` | `src/content/ledere/viktor-grevskott.md` |
| `/ledere/william-saether` | `src/content/ledere/william-saether.md` |
| `/om_oss/hva_er_revyen` | `src/content/om_oss/hva_er_revyen.md` |
| `/om_oss/ny_nettside` | `src/content/om_oss/ny_nettside.md` |

Historical easter-egg routes: `src/pages/[secret]/index.astro` and
`src/pages/[secret]/off.astro`, with definitions in `src/lib/secrets/`. Not carried forward.

## Integrations

| Service / behavior | Source | Migration decision |
| --- | --- | --- |
| GitHub Pages / custom domain | `.github/workflows/deploy.yml`, `public/CNAME`, `astro.config.mjs` | Remove on v2; existing prod unchanged |
| Plausible (Webkom) | `src/layouts/RootLayout.astro` | `https://ls.webkom.dev/js/plausible.js`, domain abakusrevyen.no; not included in new shell |
| Admissions | `src/pages/opptak.astro`, `src/layouts/Home/Recruitment.astro` | External `https://opptak.abakus.no/`; future content decision |
| Tikkio / Vier / Maps | `src/lib/shows.ts` | External links only; exact destinations below |
| YouTube | `src/lib/constants.ts`, `src/layouts/Home/Show.astro`, `src/pages/revyer.astro` | Links, playlists and embeds; future video uses Cloudflare Stream |
| Social links | `src/lib/constants.ts` | Facebook, Instagram and YouTube |
| Email | `src/pages/kontakt.astro`, group/leader Markdown | mailto links; no server email integration found |
| Calendar | `src/lib/calendar.ts` | Browser-generated ICS data URL; no calendar backend |
| Browser storage | `src/layouts/RootLayout.astro`, `src/components/Header/ThemeSwitcher.astro`, `src/lib/secrets/*` | Theme/easter-egg preferences |

No existing Auth, database, Storage, Supabase or Cloudflare Stream integration was found.

### Literal external URLs

Code fragments and interpolated URLs are not final destinations. Video IDs and playlist IDs
are held separately in `src/lib/constants.ts`; recover that file to rebuild complete URLs.
Personal email values are retained in their source files rather than duplicated here.

| Source | URL |
| --- | --- |
| `src/layouts/Home/Recruitment.astro` | `https://opptak.abakus.no/` |
| `src/layouts/Home/Show.astro` | `https://www.youtube.com/embed/MQBJf0hCznA?si=0ujbg3eG_sriNdCn` |
| `src/layouts/RootLayout.astro` | `https://ls.webkom.dev/js/plausible.js` |
| `src/lib/constants.ts` | `https://facebook.com/Abakusrevyen` |
| `src/lib/constants.ts` | `https://instagram.com/abakusrevyen` |
| `src/lib/constants.ts` | `https://www.youtube.com/@abakusrevyen` |
| `src/lib/constants.ts` | `https://www.youtube.com/embed/` |
| `src/lib/constants.ts` | `https://www.youtube.com/playlist?list=` |
| `src/lib/constants.ts` | `https://www.youtube.com/watch?v=` |
| `src/lib/shows.ts` | `https://maps.app.goo.gl/b8GwxaeLmXmZwPm66` |
| `src/lib/shows.ts` | `https://tikkio.com/events/61328-abakusrevyen-2026` |
| `src/lib/shows.ts` | `https://tikkio.com/events/61329-abakusrevyen-2026` |
| `src/lib/shows.ts` | `https://tikkio.com/events/61330-abakusrevyen-2026` |
| `src/lib/shows.ts` | `https://vier.live/act/abakusrevyen-2026---skal-skal-ikke-premiereshow-` |
| `src/lib/shows.ts` | `https://vier.live/act/abakusrevyen-2026---skal-skal-ikke-siste-forestilling-` |
| `src/pages/opptak.astro` | `https://opptak.abakus.no/` |

## Configuration decisions

| File | Decision and reason |
| --- | --- |
| `LICENSE` | Preserve byte-for-byte; Git history also preserved |
| `astro.config.mjs` | Remove: Astro-specific build and prefetch behavior |
| `tailwind.config.mjs` | Remove: old Tailwind 3 design tokens; use Tailwind Vite integration |
| `tsconfig.json` | Replace with official Vite React TS split configs and alias |
| `package.json`, `pnpm-lock.yaml` | Replace with fresh stable dependencies and pinned tools |
| `.gitignore` | Replace; retain legacy cache exclusions and broaden env protection |
| `.prettierrc` | Remove: Astro plugins and old theme paths; generated Oxlint is the code check |
| `.husky/pre-commit` | Remove: depends on retired lint-staged/Prettier setup; CI provides checks |
| `shell.nix` | Remove: unpinned Node/pnpm and automatic install conflict with explicit pinned tools |
| `.vscode/extensions.json` | Update for Oxlint/Tailwind, remove Astro recommendations |
| `.vscode/launch.json` | Preserve: pnpm dev/preview remain valid |
| `.vscode/settings.json` | Preserve: independent editor preference |
| `.vscode/tasks.json` | Replace with explicit pnpm check task; old npm/fmt/Astro tasks obsolete |
| `.github/workflows/build.yml` | Replace with v2-only typecheck, lint and build, read-only permissions |
| `.github/workflows/deploy.yml` | Remove from v2: includes manual production deployment entry point |
| `public/CNAME` | Remove from v2: avoid carrying production domain configuration |
| `README.md`, `CONTRIBUTING.md` | Rewrite for v2; originals remain at references above |

## Complete content and asset path index

Every entry is recoverable from either immutable reference above. This includes source
components because some legacy copy lives directly in templates rather than Markdown.

### `src/content/` (28 files)

- `src/content/config.ts`
- `src/content/grupper/arring.md`
- `src/content/grupper/band.md`
- `src/content/grupper/dans.md`
- `src/content/grupper/kostyme.md`
- `src/content/grupper/manus.md`
- `src/content/grupper/pr.md`
- `src/content/grupper/revystyret.md`
- `src/content/grupper/scene.md`
- `src/content/grupper/skuespill.md`
- `src/content/grupper/sosial.md`
- `src/content/grupper/teknikk.md`
- `src/content/ledere/andreas-svendsrud.md`
- `src/content/ledere/brage-naustan.md`
- `src/content/ledere/camilla-klem.md`
- `src/content/ledere/carl-christian-steen.md`
- `src/content/ledere/eirik-roed.md`
- `src/content/ledere/ellen-urdal.md`
- `src/content/ledere/linnea-johannesen.md`
- `src/content/ledere/madelen-lothe.md`
- `src/content/ledere/phillip-bjornevoll.md`
- `src/content/ledere/rikke-schjonsby.md`
- `src/content/ledere/sander-skofsrud.md`
- `src/content/ledere/sebastian-aarsheim.md`
- `src/content/ledere/viktor-grevskott.md`
- `src/content/ledere/william-saether.md`
- `src/content/om_oss/hva_er_revyen.md`
- `src/content/om_oss/ny_nettside.md`

### `src/images/` (108 files)

- `src/images/gallery/DSC01843.webp`
- `src/images/gallery/DSC01856.webp`
- `src/images/gallery/DSC01873.webp`
- `src/images/gallery/DSCF7591.webp`
- `src/images/gallery/DSCF7610.webp`
- `src/images/gallery/DSCF7721.webp`
- `src/images/gallery/DSCF7730.webp`
- `src/images/gallery/DSCF7751.webp`
- `src/images/gallery/DSCF7794.webp`
- `src/images/gallery/DSCF7805.webp`
- `src/images/gallery/DSCF7821.webp`
- `src/images/gallery/DSC_0021.webp`
- `src/images/gallery/DSC_1999.webp`
- `src/images/gallery/DSC_2156.webp`
- `src/images/gallery/DSC_2193.webp`
- `src/images/gallery/P3050036.webp`
- `src/images/gallery/P3170242.webp`
- `src/images/gallery/objektivt_sett/IMG_0033.webp`
- `src/images/gallery/objektivt_sett/IMG_0036.webp`
- `src/images/gallery/objektivt_sett/IMG_0057.webp`
- `src/images/gallery/objektivt_sett/IMG_0202.webp`
- `src/images/gallery/objektivt_sett/IMG_0221.webp`
- `src/images/gallery/objektivt_sett/IMG_0248.webp`
- `src/images/gallery/objektivt_sett/IMG_0256.webp`
- `src/images/gallery/objektivt_sett/IMG_0266.webp`
- `src/images/gallery/objektivt_sett/IMG_0299.webp`
- `src/images/gallery/objektivt_sett/IMG_0309.webp`
- `src/images/gallery/objektivt_sett/IMG_0329.webp`
- `src/images/gallery/objektivt_sett/IMG_0340.webp`
- `src/images/gallery/objektivt_sett/IMG_0445.webp`
- `src/images/gallery/objektivt_sett/IMG_0463.webp`
- `src/images/gallery/objektivt_sett/IMG_0467.webp`
- `src/images/gallery/objektivt_sett/IMG_0533.webp`
- `src/images/gallery/objektivt_sett/IMG_0544.webp`
- `src/images/gallery/objektivt_sett/IMG_0550.webp`
- `src/images/gallery/objektivt_sett/IMG_0572.webp`
- `src/images/gallery/objektivt_sett/IMG_0574.webp`
- `src/images/gallery/objektivt_sett/IMG_0617.webp`
- `src/images/gallery/objektivt_sett/IMG_0631.webp`
- `src/images/gallery/objektivt_sett/IMG_0634.webp`
- `src/images/gallery/objektivt_sett/IMG_0653.webp`
- `src/images/gallery/objektivt_sett/IMG_0683.webp`
- `src/images/gallery/objektivt_sett/IMG_0694.webp`
- `src/images/gallery/objektivt_sett/IMG_0709.webp`
- `src/images/gallery/skal_skal_ikke/IMG_1014.webp`
- `src/images/gallery/skal_skal_ikke/IMG_1028.webp`
- `src/images/gallery/skal_skal_ikke/IMG_1038.webp`
- `src/images/gallery/skal_skal_ikke/IMG_1056.webp`
- `src/images/gallery/skal_skal_ikke/IMG_1077.webp`
- `src/images/gallery/skal_skal_ikke/IMG_1094.webp`
- `src/images/gallery/skal_skal_ikke/IMG_1102.webp`
- `src/images/gallery/skal_skal_ikke/IMG_1119.webp`
- `src/images/gallery/skal_skal_ikke/IMG_1127.webp`
- `src/images/gallery/skal_skal_ikke/IMG_1142.webp`
- `src/images/gallery/skal_skal_ikke/IMG_1150.webp`
- `src/images/gallery/skal_skal_ikke/IMG_1164.webp`
- `src/images/gallery/skal_skal_ikke/IMG_1187.webp`
- `src/images/gallery/skal_skal_ikke/IMG_1228.webp`
- `src/images/gallery/skal_skal_ikke/IMG_1278.webp`
- `src/images/gallery/skal_skal_ikke/IMG_1283.webp`
- `src/images/gallery/skal_skal_ikke/IMG_1301.webp`
- `src/images/gallery/skal_skal_ikke/IMG_1308.webp`
- `src/images/gruppebilder/best_foer.webp`
- `src/images/gruppebilder/grevens_tid.webp`
- `src/images/gruppebilder/grevens_tid_2.webp`
- `src/images/gruppebilder/kult.webp`
- `src/images/gruppebilder/objektivt_sett.webp`
- `src/images/gruppebilder/skal_skal_ikke.webp`
- `src/images/gruppebilder/solidarisk.webp`
- `src/images/gruppebilder/svin_paa_skogen.webp`
- `src/images/ledere/andreas-svendsrud.webp`
- `src/images/ledere/brage-naustan.webp`
- `src/images/ledere/camilla-klem.webp`
- `src/images/ledere/carl-christian-steen.webp`
- `src/images/ledere/eirik-roed.webp`
- `src/images/ledere/ellen-urdal.webp`
- `src/images/ledere/linnea-johannesen.webp`
- `src/images/ledere/madelen-lothe.webp`
- `src/images/ledere/phillip-bjornevoll.webp`
- `src/images/ledere/rikke-schjonsby.webp`
- `src/images/ledere/sander-skofsrud.webp`
- `src/images/ledere/sebastian-aarsheim.webp`
- `src/images/ledere/viktor-grevskott.webp`
- `src/images/ledere/william-saether.webp`
- `src/images/revy-logo.webp`
- `src/images/revy_logoer/Svin_paa_skogen_logo.webp`
- `src/images/revy_logoer/Svin_paa_skogen_logo_hvit_skrift.webp`
- `src/images/revy_logoer/best_foer_logo.webp`
- `src/images/revy_logoer/best_foer_sentrert.webp`
- `src/images/revy_logoer/grevens_tid_logo.webp`
- `src/images/revy_logoer/kult.webp`
- `src/images/revy_logoer/marionett.webp`
- `src/images/revy_logoer/objektivt_sett_dark_logo.webp`
- `src/images/revy_logoer/objektivt_sett_light_logo.webp`
- `src/images/revy_logoer/pushpop_small.webp`
- `src/images/revy_logoer/satte_spor.webp`
- `src/images/revy_logoer/skal_skal_ikke.webp`
- `src/images/revy_logoer/solidarisk_web.webp`
- `src/images/undergrupper_logoer/band-logo.webp`
- `src/images/undergrupper_logoer/dans-logo.webp`
- `src/images/undergrupper_logoer/kostyme-logo.webp`
- `src/images/undergrupper_logoer/pr-logo.webp`
- `src/images/undergrupper_logoer/regi-logo.webp`
- `src/images/undergrupper_logoer/revystyret-logo.webp`
- `src/images/undergrupper_logoer/scene-logo.webp`
- `src/images/undergrupper_logoer/skuespill-logo.webp`
- `src/images/undergrupper_logoer/sosial-logo.webp`
- `src/images/undergrupper_logoer/teknikk-logo.webp`

### `public/` (11 files)

- `public/CNAME`
- `public/favicon.webp`
- `public/fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf`
- `public/fonts/Inter/Inter-VariableFont_opsz,wght.ttf`
- `public/fonts/Inter/OFL.txt`
- `public/fonts/Inter/README.txt`
- `public/fonts/Lcd/LCD14.otf`
- `public/fonts/Lcd/LICENSE.txt`
- `public/fonts/Tauri/OFL.txt`
- `public/fonts/Tauri/Tauri-Regular.ttf`
- `public/stars.webp`

### `src/pages/` (14 files)

- `src/pages/[secret]/index.astro`
- `src/pages/[secret]/off.astro`
- `src/pages/galleri.astro`
- `src/pages/grupper/[slug].astro`
- `src/pages/grupper/index.astro`
- `src/pages/index.astro`
- `src/pages/kontakt.astro`
- `src/pages/ledere/[slug].astro`
- `src/pages/ledere/index.astro`
- `src/pages/om_oss/[slug].astro`
- `src/pages/om_oss/index.astro`
- `src/pages/opptak.astro`
- `src/pages/personvern.astro`
- `src/pages/revyer.astro`

### `src/layouts/` (7 files)

- `src/layouts/ArticleLayout.astro`
- `src/layouts/Home/Break.astro`
- `src/layouts/Home/HomePageLayout.astro`
- `src/layouts/Home/Recruitment.astro`
- `src/layouts/Home/Show.astro`
- `src/layouts/PageLayout.astro`
- `src/layouts/RootLayout.astro`

### `src/components/` (28 files)

- `src/components/Branding/Logo.astro`
- `src/components/Branding/PreviousRevuesBanner.astro`
- `src/components/Branding/ShowLogo.astro`
- `src/components/Card/Card.astro`
- `src/components/Card/CardContent.astro`
- `src/components/Card/CardDetail.astro`
- `src/components/Card/CardField.astro`
- `src/components/Card/CardImage.astro`
- `src/components/Card/LinkCard.astro`
- `src/components/Card/MultiImageCard.astro`
- `src/components/Card/PersonCard.astro`
- `src/components/Common/Grid.astro`
- `src/components/Common/ProseArea.astro`
- `src/components/Common/Title.astro`
- `src/components/Countdown/Countdown.astro`
- `src/components/Countdown/Countdown.tsx`
- `src/components/FoldableFade/FoldableFade.astro`
- `src/components/Footer/Footer.astro`
- `src/components/Header/Header.astro`
- `src/components/Header/ThemeSwitcher.astro`
- `src/components/Images/ProfilePicture.astro`
- `src/components/LinkButton/Link.astro`
- `src/components/LinkButton/LinkButton.astro`
- `src/components/Show/ShowDetailsCard.astro`
- `src/components/Show/ShowsCard.tsx`
- `src/components/Subgroups/SubgroupGrid.astro`
- `src/components/Timeline/Timeline.astro`
- `src/components/Timeline/TimelineDate.astro`

### `src/lib/` (7 files)

- `src/lib/calendar.ts`
- `src/lib/constants.ts`
- `src/lib/periods.ts`
- `src/lib/secrets/index.ts`
- `src/lib/secrets/online.ts`
- `src/lib/secrets/starwars.ts`
- `src/lib/shows.ts`

### `src/styles/` (1 files)

- `src/styles/globals.css`
