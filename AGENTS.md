# Instruksjoner for arbeid i repoet

- Les README, CONTRIBUTING og relevante dokumenter før du endrer arkitekturen.
- Jobb på en egen arbeidsgren fra `v2`, og gjør commits og push til arbeidsgrenen. Ta vare på lokale endringer og `LICENSE`.
- Lever endringer som en pull request til `v2`. Hovedregelen er minst én godkjenning fra en annen bidragsyter før merge, selv om CI er grønn. `williamsaether` og `tobiaskallevik` kan bruke et personlig bypass-unntak for review, men må fortsatt bruke pull request.
- Ikke endre `main`/`prod`, merge kode, publiser, endre DNS eller rør eksterne innstillinger uten en tydelig bestilling. Godkjent review gir ikke i seg selv tillatelse til å merge.
- Bruk Node 24.21.0 og pnpm 12.9.1. Ta med `pnpm-lock.yaml` når avhengigheter endres.
- Behold appen klientrendret med Vite, React Router, Tailwind og shadcn/ui.
- Hold sider og komponenter enkle å endre mens innhold og design fortsatt avklares.
- Bruk Supabase til Auth, database og Edge Functions, Cloudflare R2 til bilder og filer, og Cloudflare Stream til video.
- Appskallet skal virke uten tilgangsnøkler. Generer databasetyper fra en avtalt modell; ikke dikt opp tabeller.
- Alt med `VITE_*` er offentlig. Ikke legg inn private nøkler, hemmelige temaer eller private medier.
- Behandle `.env` og `.env.*` som sensitive. Ikke les eller skriv ut innholdet uten at oppgaven krever det, og ikke kopier verdier til chat, logger, dokumentasjon eller kode.
- Ikke commit eller push lokale miljøfiler, som `.env`, `.env.local` og `.env.production`. Bare `.env.example` med ufarlige eksempelverdier kan spores i Git. Sjekk at lokale miljøfiler er ignorert, og se gjennom staged diff før commit; ikke bruk `git add -f` for å omgå dette.
- Ikke endre eller overskriv eksisterende miljøfiler uten en tydelig bestilling. Hvis en hemmelighet allerede er sporet eller eksponert, stopp videre deling og varsle brukeren uten å gjengi verdien; å legge filen i `.gitignore` fjerner den ikke fra historikken.
- Skriv kode, variabler og kodekommentarer på engelsk. Skriv dokumentasjon og synlig innhold på naturlig norsk.
- Vær vennlig og konkret i teksten. Unngå unødvendig stivt språk og lange regelverk når en enkel forklaring holder.
- Kjør frossen installasjon, typekontroll, lint og bygg. Sjekk endrede ruter i nettleseren.
- Fortell hva som er kontrollert, og skill tydelig mellom lokal klargjøring og faktisk skyoppsett.

## Avtalt branchbeskyttelse i GitHub

Dette er ønsket oppsett. Kontroller innstillingene i GitHub før du legger til grunn at de er aktive; denne filen konfigurerer dem ikke.

- Begge rulesettene skal være aktive og treffe `main` og `v2` med hvert sitt eksakte filtermønster.
- **Grunnbeskyttelse:** Tom bypass-liste, blokkering av sletting og force push, krav om pull request med 0 godkjenninger, løste samtaler før merge og bare squash som merge-metode. Andre regler og review-valg er av. Squash samler commitene i en pull request til én commit på målgrenen.
- **Review påkrevd:** Krav om pull request med minst 1 godkjenning. Nye kodeendringer skal oppheve gamle godkjenninger, og siste push med endringer som kan reviewes må godkjennes av en annen enn den som pushet. Samtaler må være løst, og bare squash er tillatt. Bare William Sæther og `tobiaskallevik` skal kunne avvise reviews.
- Bypass-listen i **Review påkrevd** skal bare inneholde William Sæther og `tobiaskallevik`, begge med **For pull requests only**. Unntaket gjelder personen som merger, også når vedkommende merger andres pull requests. Ikke legg til hele teamet eller rollen Repository admins.
- Krav om review fra bestemte team eller Code Owners og ekstra godkjenning for Copilot-PR-er uten menneskelig samarbeidspartner er av. Andre regler i **Review påkrevd** er av.
- Revyen-teamet bør ha Write, og administratortilgang bør gis individuelt til dem som trenger den. Admin gir ikke automatisk bypass, men gir mulighet til å endre eller deaktivere repository-rulesets.
- `.github/CODEOWNERS` ber automatisk `williamsaether` og `tobiaskallevik` om review for alle filer når en pull request er klar for review. Filen må finnes på målgrenen for at dette skal virke. Kravet om godkjenning fra Code Owners er fortsatt av i det avtalte oppsettet.
- Bypass og GitHub-tilgang gir ikke agenten tillatelse til å merge uten en tydelig bestilling.
