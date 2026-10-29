# Slik bidrar du

Hyggelig at du vil bidra! Utviklingen av den nye nettsiden skjer på `v2`. Lag en egen arbeidsgren fra `v2`, gjør en passe stor og forståelig endring, og åpne en pull request til `v2`. Skriv gjerne et par setninger om hva du har gjort, hvorfor, og hvordan du sjekket at det virker.

Den gamle produksjonssiden publiseres fortsatt fra `prod` til GitHub Pages. Den nye CI-en publiserer ingenting, og det halvferdige appskallet skal ikke slås sammen med `main` eller `prod`. Vi avtaler en egen lanseringsplan når nettsiden er klar.

## Opprydding av arbeidsgrener

Workflowen `Clean up merged branches` finner arbeidsgrener sju dager etter siste merge. Den hopper over `main`, `master`, `v2`, `prod`, standardgrenen og beskyttede grener, samt grener med åpne pull requests eller endret commit siden merge. Grener fra forks slettes ikke.

Den starter i tørrkjøring og viser kandidatene i kjøreloggen. Manuell kjøring har også tørrkjøring på som standard. For å aktivere sletting i den daglige kjøringen setter en administrator repository-variabelen `CLEANUP_MERGED_BRANCHES_ENABLED` til `true` under Settings → Secrets and variables → Actions → Variables. La GitHubs `Automatically delete head branches` være av, ellers slettes grenene umiddelbart.

Planlagt kjøring krever at workflow-filen finnes på repoets standardgren. En PR til `v2` alene aktiverer derfor ikke tidsplanen når standardgrenen er `main`. Ikke merge resten av `v2` til `main` for å aktivere opprydding; en eventuell overføring av bare workflowen må avtales separat.

## Før du ber om en gjennomgang

1. Bruk Node- og pnpm-versjonene fra README.
2. Kjør `pnpm install --frozen-lockfile` og `pnpm check`.
3. Start `pnpm preview`. Se på `/`, prøv en ukjent dyp URL, oppdater siden og test lenken hjem. Ta gjerne en rask titt på tastaturfokus og smal skjerm også.
4. Kjør `git diff --check`, og se gjennom endringene for uventede filer eller hemmeligheter.
5. Hvis du endrer avhengigheter, skal `pnpm-lock.yaml` være med. Bruk stabile versjoner og hold versjonsdokumentasjonen oppdatert.
6. Oppdater dokumentasjonen når oppførsel, miljøvariabler eller publiseringsplaner endres.

CI kjører installasjon, typekontroll, lint og produksjonsbygg uten tilgangsnøkler. Når branchen en gang publiseres, må vi fortsatt konfigurere hvilke CI-sjekker som kreves, og beskytte branchen i GitHub. Et grønt lokalt bygg betyr ikke automatisk at koblingen mot skyen virker.

Kode, variabelnavn og kommentarer kan gjerne være på engelsk, siden bibliotekene og resten av økosystemet er det. Dokumentasjon og synlig innhold skriver vi på norsk, med et vennlig og greit språk. Det viktigste er at neste person skjønner hva som skjer; teksten trenger ikke høres ut som en kontrakt.

Legg delte UI-komponenter i `src/components/ui`, appkode i `src` og klienter mot tjenester i `src/lib`. Legg til gode tester når vi får logikk som faktisk trenger det, uten å teste detaljer bare for å få flere tester.

Bruk [innholdsplanen](docs/content-plan.md) når vi begynner å forme nettsiden. Gamle bilder og tekster finner du gjennom [legacy-oversikten](docs/legacy-inventory.md). Sjekk datoer, personopplysninger, samtykke og personverntekst før noe hentes tilbake. Ikke legg til `.env.local`, service role keys, hemmelige Supabase-nøkler, Cloudflare-tokens, private medier eller noe som røper et upublisert revytema. Alt med `VITE_*` blir offentlig.
