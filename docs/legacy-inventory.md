# Oversikt over den gamle nettsiden

Denne oversikten ble laget 6. oktober 2026, før Astro-appen ble erstattet på `v2`. Tenk på den som et kart tilbake til gamle tekster, bilder og løsninger hvis vi trenger dem senere.

## Faste referanser

- Gammel main: `631e7660ed1f2b59a21e457789e32349c850a3d7`
- Gammel prod: `7c366cd3e2ae828e2e9679fc19d1f2b37199d3e5`

Origin ble hentet før branchen ble laget. Lokal `main` var allerede lik `origin/main`, og arbeidstreet var rent uten usporede kildefiler. Det fantes ingen lokal eller ekstern `v2`-gren fra før. `git diff origin/main origin/prod` ga ingen forskjell i filinnhold. `prod` har 18 ekstra commits – 17 merges og én retting av bilderetning – men `main` er en forelder av `prod`, og de to Git-trærne er like. Ignorerte bygg- og dependency-cacher ble flyttet til en lokal, midlertidig backup og ble ikke commitet.

Påstanden i den gamle README-en om produksjon stemmer med `.github/workflows/deploy.yml` ved begge referansene: endringer som sendes til `prod`, bygger Astro og publiserer til GitHub Pages-miljøet `github-pages`. Workflowen kan også startes med `workflow_dispatch` uten begrensning til en bestemt gren. Eksterne GitHub Pages-innstillinger, siste publisering og DNS ble verken undersøkt eller endret; dette bekrefter bare oppsettet i repoet.

Alle stiene under viser til **begge commitene over**, ikke det nye arbeidstreet. Hent bare tilbake offentlig innhold som noen har sett gjennom. Historiske easter eggs er ført opp med filsti uten at aktiveringsfrasene kopieres hit. Oversikten legger ikke inn nye temaer, upubliserte bilder eller tilgangsnøkler.

```sh
# Se på en tekstfil uten å hente tilbake gammel appkode:
git show 631e7660ed1f2b59a21e457789e32349c850a3d7:src/lib/constants.ts
# Hent valgte filer til en egen mappe:
mkdir -p /tmp/abakus-legacy-review
git archive 7c366cd3e2ae828e2e9679fc19d1f2b37199d3e5 src/images public/fonts | tar -x -C /tmp/abakus-legacy-review
```

## Hvor lå innholdet?

| Innhold | Kildestier | Fint å vite før det hentes tilbake |
| --- | --- | --- |
| Forside og sesongstyrt tekst | `src/pages/index.astro`, `src/layouts/Home/*.astro` | Varianter for opptak, nedtelling, forestilling og pause |
| Datoer, lokale og billetter | `src/lib/shows.ts`, `src/lib/constants.ts`, `src/lib/periods.ts` | Datoene er historiske og må sjekkes før bruk |
| Revyarkiv, YouTube-ID-er og spillelister | `src/lib/constants.ts`, `src/pages/revyer.astro` | Har tidsstyrt publisering og logo for hver revy |
| Opptak | `src/pages/opptak.astro`, `src/layouts/Home/Recruitment.astro` | Lenker til den eksterne opptaksløsningen |
| Gruppebeskrivelser og e-postadresser | `src/content/grupper/*.md`, `src/content/config.ts` | Filnavnet styrer URL-en; gruppene peker til ledere |
| Ledertekster, roller og portretter | `src/content/ledere/*.md`, `src/images/ledere/*` | Sjekk riktighet og samtykke før gjenbruk |
| Om oss-artikler | `src/content/om_oss/*.md`, `src/layouts/ArticleLayout.astro` | Titler, beskrivelser, datoer og hele artikkelteksten |
| Kontakt og juridisk tekst | `src/pages/kontakt.astro`, `src/pages/personvern.astro` | Organisasjonsinfo og personvern må vurderes på nytt med nye tjenester |
| Galleri | `src/pages/galleri.astro`, `src/images/gallery/*` | Bildevisning med Swiper og PhotoSwipe |
| Profil- og gruppebilder | `src/images/revy-logo.webp`, `src/images/revy_logoer/*`, `src/images/gruppebilder/*`, `src/images/undergrupper_logoer/*` | Komplett filliste lenger ned |
| Fonter og lisenser | `public/fonts/*` | Inter, Tauri og Lcd; ta med fontlisensen ved gjenbruk |
| Navigasjon, footer og metadata | `src/components/Header/*`, `src/components/Footer/*`, `src/layouts/RootLayout.astro`, `public/favicon.webp` | Navigasjon, metadata og lagret temavalg |

## Gamle URL-er

`v2` har foreløpig verken videresendinger eller de gamle innholdssidene. Før lansering bestemmer vi om hver URL skal beholdes, videresendes eller få hvile. De dynamiske URL-ene kommer fra Markdown-filnavnene i tabellen.

| URL | Kilde |
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

De gamle easter egg-rutene lå i `src/pages/[secret]/index.astro` og `src/pages/[secret]/off.astro`, med definisjoner i `src/lib/secrets/`. De ble ikke med videre.

## Integrasjoner

| Tjeneste eller oppførsel | Kilde | Hva vi gjør videre |
| --- | --- | --- |
| GitHub Pages / eget domene | `.github/workflows/deploy.yml`, `public/CNAME`, `astro.config.mjs` | Fjernet på `v2`; eksisterende `prod` er urørt |
| Plausible fra Webkom | `src/layouts/RootLayout.astro` | `https://ls.webkom.dev/js/plausible.js` for abakusrevyen.no; ikke med i nytt skall |
| Opptak | `src/pages/opptak.astro`, `src/layouts/Home/Recruitment.astro` | Ekstern `https://opptak.abakus.no/`; innholdet avklares senere |
| Tikkio / Vier / Maps | `src/lib/shows.ts` | Bare eksterne lenker; adressene står under |
| YouTube | `src/lib/constants.ts`, `src/layouts/Home/Show.astro`, `src/pages/revyer.astro` | Lenker, spillelister og embeds; ny video skal bruke Cloudflare Stream |
| Sosiale medier | `src/lib/constants.ts` | Facebook, Instagram og YouTube |
| E-post | `src/pages/kontakt.astro`, Markdown for grupper/ledere | `mailto`-lenker; ingen serverintegrasjon ble funnet |
| Kalender | `src/lib/calendar.ts` | Nettleseren lagde en ICS-data-URL; ingen kalenderbackend |
| Lagring i nettleseren | `src/layouts/RootLayout.astro`, `src/components/Header/ThemeSwitcher.astro`, `src/lib/secrets/*` | Valg av tema og easter eggs |

Det fantes ingen integrasjon med Auth, database, Storage, Supabase eller Cloudflare Stream.

### Eksterne URL-er skrevet rett i koden

Kodebiter og sammensatte URL-er er ikke nødvendigvis komplette adresser. Video-ID-er og spilleliste-ID-er ligger separat i `src/lib/constants.ts`; hent den filen for å bygge de fulle lenkene. Personlige e-postadresser blir liggende i kildefilene i stedet for å dupliseres her.

| Kilde | URL |
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

## Hva skjedde med konfigurasjonsfilene?

| Fil | Valg og begrunnelse |
| --- | --- |
| `LICENSE` | Beholdt byte for byte; hele Git-historikken er også bevart |
| `astro.config.mjs` | Fjernet fordi den bare styrte Astro-bygg og prefetch |
| `tailwind.config.mjs` | Fjernet sammen med gamle Tailwind 3-tokens; Vite-integrasjonen brukes nå |
| `tsconfig.json` | Erstattet med Vites delte React/TypeScript-oppsett og `@`-alias |
| `package.json`, `pnpm-lock.yaml` | Erstattet med ferske, stabile avhengigheter og låste verktøy |
| `.gitignore` | Erstattet; gamle cache-unntak ble beholdt og miljøfiler bedre skjermet |
| `.prettierrc` | Fjernet sammen med Astro-plugins og gamle temastier; Oxlint sjekker koden |
| `.husky/pre-commit` | Fjernet fordi den var avhengig av det gamle lint-staged/Prettier-oppsettet |
| `shell.nix` | Fjernet fordi Node/pnpm var ulåst og automatisk installasjon kolliderte med det nye oppsettet |
| `.vscode/extensions.json` | Oppdatert for Oxlint og Tailwind; Astro-anbefalinger er borte |
| `.vscode/launch.json` | Beholdt fordi `pnpm dev` og `pnpm preview` fortsatt virker |
| `.vscode/settings.json` | Beholdt som en uavhengig editorinnstilling |
| `.vscode/tasks.json` | Erstattet med en tydelig `pnpm check`-oppgave |
| `.github/workflows/build.yml` | Erstattet med typekontroll, lint og bygg bare for `v2`, med lesetilgang |
| `.github/workflows/deploy.yml` | Fjernet på `v2` fordi den også kunne starte produksjonsdeploy manuelt |
| `public/CNAME` | Fjernet på `v2` så produksjonsdomenet ikke blir med i det nye bygget |
| `README.md`, `CONTRIBUTING.md` | Skrevet på nytt for `v2`; originalene finnes ved commitene over |

## Komplett liste over innhold og filer

Alt i listen kan hentes fra en av de faste referansene øverst. Komponentene er også med fordi noe av den gamle teksten lå rett i templater, ikke i Markdown.

### `src/content/` (28 filer)

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

### `src/images/` (108 filer)

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

### `public/` (11 filer)

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

### `src/pages/` (14 filer)

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

### `src/layouts/` (7 filer)

- `src/layouts/ArticleLayout.astro`
- `src/layouts/Home/Break.astro`
- `src/layouts/Home/HomePageLayout.astro`
- `src/layouts/Home/Recruitment.astro`
- `src/layouts/Home/Show.astro`
- `src/layouts/PageLayout.astro`
- `src/layouts/RootLayout.astro`

### `src/components/` (28 filer)

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

### `src/lib/` (7 filer)

- `src/lib/calendar.ts`
- `src/lib/constants.ts`
- `src/lib/periods.ts`
- `src/lib/secrets/index.ts`
- `src/lib/secrets/online.ts`
- `src/lib/secrets/starwars.ts`
- `src/lib/shows.ts`

### `src/styles/` (1 fil)

- `src/styles/globals.css`
