# Deploy og miljøer

Dette dokumentet skiller mellom det vi allerede har gjort i repoet, og det som fortsatt må settes opp ute i tjenestene. Målet er at ingen ved et uhell skal forveksle en lokal klargjøring med en ferdig produksjonsløsning.

## Slik står det nå

Den gamle produksjonssiden ligger fortsatt på GitHub Pages. Ved commitene som er notert i [legacy-oversikten](legacy-inventory.md), starter `deploy.yml` når noen sender endringer til `prod`. Workflowen kan også startes manuelt. Vi har ikke endret `main`, `prod`, DNS eller andre eksterne produksjonsinnstillinger, og vi har heller ikke sjekket hvilken commit som faktisk serveres akkurat nå.

På `v2` er den gamle workflowen for publisering og `public/CNAME` tatt bort. GitHub Actions sjekker bare endringer som sendes til `v2`, og pull requests som skal inn i `v2`. Workflowen har lesetilgang, ingen hemmelige verdier, ingen publiseringssteg og ingen manuell startknapp. Den er klargjort lokalt, men ikke kjørt på GitHub. Ingenting er sendt eller publisert.

## Cloudflare Pages for testing – ikke satt opp ennå

Når vi er klare, lager vi et **eget testprosjekt** i Cloudflare Pages. Bruk `pages.dev`-adressen mens vi tester, og la `abakusrevyen.no` være i fred. Hvis testprosjektet kobles til GitHub, velger vi `v2` som prosjektets hovedgren og begrenser bygg til `v2` og relevante forhåndsvisningsgrener. Cloudflares ord «production» betyr da bare hovedbranchen i testprosjektet, ikke dagens nettside.

Foreslåtte bygginnstillinger:

| Innstilling | Verdi |
| --- | --- |
| Rotmappe | repoets rot |
| Byggkommando | `pnpm install --frozen-lockfile && pnpm check` |
| Mappe med ferdig bygg | `dist` |
| `NODE_VERSION` | `24.21.0` |
| `PNPM_VERSION` | `12.9.1` |
| `SKIP_DEPENDENCY_INSTALL` | `true` – installasjonen gjøres eksplisitt over |

Sjekk de faktiske versjonene i loggen fra det første skybygget. Miljøvariablene til appen settes inn under bygging, så en endring krever et nytt bygg.

Cloudflare Pages bruker SPA-fallback når det ikke finnes en `404.html` i roten. Derfor lager vi ikke den filen nå. Etter første publisering må vi prøve å åpne og oppdatere en dyp URL direkte. `_headers` og HTML-en sier `noindex` mens siden er uferdig. Fjern begge først når siden skal lanseres. `noindex` er ikke adgangskontroll; bruk Cloudflare Access hvis en forhåndsvisning faktisk skal være privat.

## Miljøer og variabler

| Variabel eller hemmelig verdi | Hvor skal den ligge? | Trengs nå? |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Lokal `.env.local` eller Pages-miljøet | Valgfri for appskallet; test-URL i testmiljø |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Samme miljø som prosjekt-URL-en | Valgfri for appskallet; bare offentlig publishable key |
| Administrative Supabase-nøkler | Framtidig secret-lager for server/CLI | Ikke satt opp; aldri med `VITE_` foran |
| Konto-ID og API-token for Cloudflare Stream | Framtidige secrets for Edge Functions | Ikke satt opp; tokenet skal aldri til nettleseren |

Test og produksjon skal ha hvert sitt Supabase-prosjekt og egne Pages-verdier. Tillatte returadresser for Auth må passe med adressene vi faktisk bruker. Før nettleseren kobles på data, lager vi riktige RLS-regler, grants og Storage-policyer. Stream-oppsett for avspilling og opplasting kommer sammen med videofunksjonen; vi legger ikke inn tomme Stream-variabler før de trengs.

## Før første testdeploy

- Gå gjennom `v2` lokalt og avklar at branchen er klar til å sendes til GitHub.
- Opprett det isolerte Pages-testprosjektet med innstillingene over.
- Gjør CI-sjekken obligatorisk i GitHub hvis teamet ønsker det.
- Appskallet trenger ikke Supabase. For backend-testing må vi først bli enige om modell, migrasjoner og policyer, og deretter sette opp et eget testprosjekt.
- Dobbeltsjekk at produksjon, live DNS og GitHub Pages fortsatt er urørt.
- Kjør CI og test `/`, en ukjent dyp URL, oppdatering, lenken hjem og nettleserhistorikk. Se også etter feil i konsollen og feil respons-headere.

Før en ordentlig produksjonslansering må vi i tillegg ha innhold og design på plass, bestemme videresendinger for gamle URL-er, gå gjennom personvern og mediesamtykke, teste sikkerheten i backend og avtale ansvar og en plan for å rulle tilbake. Produksjonsmiljøet settes opp separat. Den gamle prod-commiten er en trygg referanse, ikke en beskjed om å redeploye den nå.

Nyttige kilder:

- [Vite på Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite3-project/)
- [Hvordan Pages serverer SPA-er](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- [Bygginnstillinger](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Build image og versjonsstyring](https://developers.cloudflare.com/pages/configuration/build-image/)
