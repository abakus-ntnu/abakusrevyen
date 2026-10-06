# Lokal utvikling

Her finner du litt mer bakgrunn enn i README. Du trenger ikke kunne alt dette for
å rette en tekst eller lage en komponent, men det er fint å ha ett sted som
forklarer valgene våre.

## Den vanlige arbeidsflyten

README viser hvordan de låste verktøyversjonene installeres. `pnpm dev` starter
Vite, og `pnpm preview` viser innholdet i `dist` etter `pnpm build`. `pnpm check`
kjører TypeScript, Oxlint og produksjonsbygg i én omgang.

TypeScript bruker strenge sjekkeregler. pnpm 12-innstillingene ligger i
`pnpm-workspace.yaml`, ikke `.npmrc`. Direkte avhengigheter har eksakte versjoner,
mens lockfilen låser resten av treet.

Grunnprosjektet ble laget med den offisielle generatoren:

```sh
pnpm create vite@latest <midlertidig-mappe> --template react-ts
```

Vi brukte create-vite **9.2.1** den 6. oktober 2026. Filene ble flyttet inn i
repo-roten uten å røre Git-metadata, `LICENSE` eller uavhengige editorinnstillinger.
Generatorens demo med logoer og teller ble fjernet. Oxlint følger med dagens
generator. Tailwind bruker `@tailwindcss/vite`, ikke det gamle oppsettet for
Tailwind 3 og PostCSS.

shadcn/ui ble satt opp med CLI **4.21.1** og et nøytralt utgangspunkt. Tokens og
farger er bare et praktisk startpunkt, ikke det ferdige designet. Koden til
komponentene ligger i repoet, slik shadcn/ui er ment å brukes. `button.tsx` ble
generert av shadcn CLI og er vanlig kildekode som vi kan tilpasse.

Legg til nye shadcn-komponenter etter hvert som vi trenger dem:

```sh
pnpm exec shadcn add dialog
pnpm exec shadcn add input label textarea
```

CLI-en legger komponentene i `src/components/ui` og oppdaterer nødvendige
avhengigheter. Vi bruker den låste CLI-en fra prosjektet, så kommandoene trenger
ikke `@latest`. Se også den korte forklaringen i `src/components/ui/README.md`.

`src/app/router.tsx` er den sentrale ruteren. Den bruker React Router Data Mode med
`createBrowserRouter`, et felles layout og egne sider for `/`, ukjente adresser og
uventede rutefeil. Aliaset `@/` peker på `src/` i både Vite og TypeScript. «Fant
ikke siden» er en klientrute; en statisk SPA-host vil derfor returnere HTML med
status 200. Vi trenger verken SSR eller Pages Functions for dette appskallet.

## Hvor ting skal ligge

Vi oppretter mapper når de får en tydelig jobb. Noen foreløpig tomme mapper har en
`.gitkeep`, slik at strukturen blir med i Git fra starten.

- `src/app` inneholder appens inngang og router.
- `src/pages` inneholder komponentene som svarer til ruter. En side setter vanligvis
  sammen mindre komponenter og funksjoner.
- `src/components/ui` er for shadcn-komponenter og små UI-primitiver.
- `src/components/layout` er for felles sidestruktur.
- `src/features` er for avgrensede områder som innlogging, forestillinger eller
  revyarkiv. Opprett undermapper først når området skal bygges.
- `src/lib` er for klienter og tekniske hjelpefunksjoner. Supabase-klienten og de
  genererte databasetypene ligger samlet i `src/lib/supabase`.
- `src/hooks` er bare for hooks som brukes på tvers av flere områder.
- `src/types` er bare for typer som faktisk er globale. Props og feature-typer bør
  ligge nær koden som bruker dem.
- `src/assets` er for filer som importeres og behandles av Vite. Filer som må ha en
  fast offentlig URL, hører hjemme i `public`.
- `src/styles` inneholder globale stiler. Komponentspesifikke stiler holdes sammen
  med komponenten.

Tester legges ved siden av koden de dekker, for eksempel `HomePage.test.tsx`.
Vi legger ikke inn en global state-løsning eller et eget datahentingsbibliotek før
behovet er tydelig.

`tsconfig.json` er den overordnede filen som peker på konfigurasjonen for nettleseren og
Node. Innstillinger i roten arves ikke automatisk av prosjektene. Derfor står
`@/*` også i `tsconfig.app.json`, der appfilene faktisk sjekkes. Kopien i roten
gjør at shadcn/ui finner aliaset. Vi lar `baseUrl` være borte: TypeScript løser
`paths` relativt til konfigurasjonsfilen, og har avviklet `baseUrl` for denne bruken.

Begge prosjektene sjekker blant annet valgfrie felter, oppslag i lister og objekter,
returverdier og sideeffekt-importer. Node-konfigurasjonen kobler eksplisitt
`module: nodenext` med `moduleResolution: nodenext`, så editoren og CLI-en er enige.

## Supabase: klart til å kobles på senere

Dette finnes allerede:

- `.env.example`
- en typet `getSupabaseClient()`
- en bevisst tom `Database`-type som startpunkt

Hvis tilgangsnøklene mangler eller fortsatt er eksempelverdiene, returnerer klienten
`null`. Kode som bruker den må håndtere det. Forsiden gjør ingen backend-kall.
Det finnes ennå ingen datamodell, migrasjoner, buckets, innloggingsside eller
Edge Functions.

Når vi kommer dit, blir Supabase-prosjektene for test og produksjon separate.
Auth tar seg av identitet, Postgres av strukturerte data, Storage av filer som
ikke er video, og Edge Functions av operasjoner som trenger servertilgang. Vi
lager RLS, grants og Storage-policyer før data blir tilgjengelig fra nettleseren.
Nettleseren bruker bare publishable key. En skjult URL eller en rutesperre i React
er aldri tilgangskontroll.

## Planlagt flyt for database og migrasjoner

Kommandoene under er en oppskrift for senere. De er ikke kjørt mot noe prosjekt
i denne oppgaven. Installer Docker først. Når backend-arbeidet begynner, legger vi
til og låser den da gjeldende stabile Supabase CLI-en:

```sh
pnpm add -D --save-exact supabase@latest
pnpm exec supabase init
pnpm exec supabase start
pnpm exec supabase migration new <beskrivende_navn>
# Rediger migrasjonen og ta med RLS/grants der det trengs.
pnpm exec supabase db reset
```

`db reset` tømmer den **lokale** databasen og spiller migrasjonene på nytt. Lokale
data forsvinner, så bruk bare syntetiske eller offentlige testdata. Commit gjennomgått
`supabase/config.toml` og migrasjoner, men aldri lokale midlertidige data, innloggingstokener
eller private seed-data.

Kobling mot et eksternt prosjekt og `db push` trenger en egen, avtalt flyt for
test og produksjon. Ingenting er koblet eller skrevet til eksterne prosjekter her.

Når en modell finnes og migrasjonene er kjørt, genererer vi typer lokalt:

```sh
pnpm exec supabase gen types typescript --local --schema public > /tmp/abakus-database.types.ts
# Bytt først fil når kommandoen over har lyktes:
cp /tmp/abakus-database.types.ts src/lib/supabase/database.types.ts
pnpm typecheck
```

Et annet valg er å logge inn med CLI-en og bruke
`--project-id <test-project-ref> --schema public` mot et valgt **testprosjekt**.
Se gjennom og legg til den genererte filen sammen med skjemaendringen. Den tomme
starttypen beskriver ingen ekte database og skal ikke fylles med tabeller vi gjetter oss til.

## Video

Cloudflare Stream skal lagre video. Senere kan en innlogget Edge Function lage
kortlivede opplastingsadresser, mens Cloudflare-tokenet bare finnes på serveren. Vi må
fortsatt bestemme synlighet, signerte URL-er, størrelsesgrenser og hvem som får laste
opp. Ingen videoer eller Edge Functions er lastet opp eller publisert.

## Dokumentasjon vi sjekket

Kildene ble kontrollert 6. oktober 2026. De stabile versjonene ligger i
`pnpm-lock.yaml`.

- [Kom i gang med Vite](https://vite.dev/guide/)
- [Støttede Node-versjoner](https://nodejs.org/en/about/previous-releases)
- [Installer pnpm](https://pnpm.io/installation)
- [React Router i Data Mode](https://reactrouter.com/start/data/installation)
- [Tailwind med Vite](https://tailwindcss.com/docs/installation/using-vite)
- [shadcn/ui med Vite](https://ui.shadcn.com/docs/installation/vite)
- [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)
- [Generer Supabase-typer](https://supabase.com/docs/guides/api/rest/generating-types)
- [Supabase API-nøkler](https://supabase.com/docs/guides/getting-started/api-keys)
- [Direkte opplasting til Stream](https://developers.cloudflare.com/stream/uploading-videos/direct-creator-uploads/)
- [pnpm-innstillinger](https://pnpm.io/settings)

## Versjoner vi har kontrollert

| Verktøy eller pakke | Versjon |
| --- | --- |
| Node.js LTS | 24.21.0 |
| pnpm | 12.9.1 |
| Vite | 8.3.2 |
| React | 19.3.0 |
| React DOM | 19.3.0 |
| TypeScript | 7.0.2 |
| React Router | 8.4.0 |
| Tailwind CSS | 4.3.3 |
| `@tailwindcss/vite` | 4.3.3 |
| shadcn | 4.21.1 |
| `@supabase/supabase-js` | 2.117.2 |
| Oxlint | 1.86.0 |

Generatoren foreslo først TypeScript 6.0. Vi oppdaterte til stabile 7.0.2 og
kjørte hele sjekkrekken. Ingen direkte avhengigheter er beta, canary eller eksperimentelle.

## Det vi har sjekket lokalt

Med de låste Node- og pnpm-versjonene har vi kontrollert dette:

- Frossen installasjon, typekontroll, lint og produksjonsbygg
- Oppstart av Vite uten `.env` eller aktive Supabase-nøkler
- Forsiden, direkte `/ukjent/side`, oppdatering, lenken hjem og tilbake/fremover i Safari
- Den samme fallback-ruten i forhåndsvisningen av produksjonsbygget
- At Supabase-klienten returnerer `null` uten tilgangsnøkler
- `git diff --check`, uendret `LICENSE` og uendrede referanser til `main` og `prod`

GitHub Actions, respons-headere i Cloudflare Pages og ekte backend-integrasjoner er
ikke kontrollert eksternt. Ingen skyressurser er opprettet eller endret.
