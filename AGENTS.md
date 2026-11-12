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

## Skills for dette repoet

Delte skills ligger i `.agents/skills`. Claude Code finner de samme filene gjennom relative lenker i `.claude/skills`. Les aktuell `SKILL.md` før bruk, og bare referansene som trengs for oppgaven. Se [oppsett og vedlikehold](docs/agent-skills.md).

| Skill | Når den brukes |
| --- | --- |
| [supabase](.agents/skills/supabase/SKILL.md) | Backend: Supabase Auth, kontokobling, Edge Functions, Realtime, klienter, CLI og databaseendringer. |
| [supabase-postgres-best-practices](.agents/skills/supabase-postgres-best-practices/SKILL.md) | Datamodell, SQL, RLS, grants, indekser og spørringsytelse. |

Relevante globale skills, hvis de finnes i agentens skill-katalog:

| Skill | Når den brukes |
| --- | --- |
| `frontend-design` | Nye sider eller bevisste designendringer. Følg eksisterende uttrykk og oppgavens avgrensning. |
| `humanizer` | Språkvask av norsk dokumentasjon og synlig tekst. Bevar fakta og mening. |
| `openai-docs` | Oppsett og bruk av Codex/OpenAI, inkludert skills. |
| `skill-installer`, `skill-creator` | Installere, oppdatere eller lage skills når oppgaven gjelder dette. |
| `imagegen` | Lage eller redigere rasterbilder når oppgaven krever det. |

Globale skills og plugins følger ikke med en klone av repoet. Ikke anta at en annen bidragsyter har dem. Hvis Supabase-pluginen allerede tilbyr samme skill, bruk én utgave per oppgave; ikke les begge. Bruk den delte utgaven som repoets dokumenterte utgangspunkt.

### Backend og database

- Les gjeldende issue, migrasjonene og relevant dokumentasjon før du foreslår en modell. Skill mellom vedtatte krav, åpne spørsmål og kode som bare finnes i en annen PR.
- Velg den enkleste modellen som dekker kravene. Forklar hvorfor en ny tabell trenger eget livsløp, tilgang eller flere rader, og vurder om eksisterende tabeller eller kolonner er nok. Skill mellom varige tilgangsrettigheter og hvor lenge videoer faktisk er lagret.
- Test tilgang både for tillatte og avviste handlinger. Ta med anonym bruker, eier, annen bruker og relevante roller når du endrer RLS. Kjør `pnpm test:db` ved endringer i databaseskjema eller tilgangsregler.
- Verifiser identitet, rettigheter, priser og webhook-signaturer på serveren. Ikke stol på klientdata eller brukerredigerbare metadata for studentstatus, interne medlemskap eller betalt tilgang. Ikke lagre avspillingstokener som en del av datamodellen.
- Migrasjoner i `supabase/migrations` er kildegrunnlaget. Ikke endre allerede anvendte migrasjoner. SQL-iterasjon fra en generell skill gjelder en lokal, disponibel database; ikke bruk et tilkoblet skyprosjekt som sandkasse. En bestilling om kode gir ikke i seg selv tillatelse til å anvende migrasjoner eller deploye Edge Functions i skyen.
- Kontroller prosjekt og miljø før autoriserte skyendringer. Bruk eksisterende connector når den dekker oppgaven; ikke opprett MCP-oppsett, be om nye tokens eller endre eksterne innstillinger bare fordi en skill nevner det. Repoets instruksjoner og brukerens bestilling styrer omfanget.

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
