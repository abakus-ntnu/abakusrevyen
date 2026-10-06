# Instruksjoner for arbeid i repoet

- Les README, CONTRIBUTING og relevante dokumenter før du endrer arkitekturen.
- Jobb på `v2` eller en arbeidsgren fra `v2`. Ta vare på lokale endringer og `LICENSE`.
- Ikke endre `main`/`prod`, send eller slå sammen kode, publiser, endre DNS eller rør eksterne innstillinger uten en tydelig bestilling.
- Bruk Node 24.21.0 og pnpm 12.9.1. Ta med `pnpm-lock.yaml` når avhengigheter endres.
- Behold appen klientrendret med Vite, React Router, Tailwind og shadcn/ui.
- Hold appskallet lite til innhold, navigasjon og design er avklart.
- Bruk Supabase til Auth, database, Storage og Edge Functions, og Cloudflare Stream til video.
- Appskallet skal virke uten tilgangsnøkler. Generer databasetyper fra en avtalt modell; ikke dikt opp tabeller.
- Alt med `VITE_*` er offentlig. Ikke legg inn private nøkler, hemmelige temaer eller private medier.
- Skriv kode, variabler og kodekommentarer på engelsk. Skriv dokumentasjon og synlig innhold på naturlig norsk.
- Vær vennlig og konkret i teksten. Unngå unødvendig stivt språk og lange regelverk når en enkel forklaring holder.
- Kjør frossen installasjon, typekontroll, lint og bygg. Sjekk endrede ruter i nettleseren.
- Fortell hva som er kontrollert, og skill tydelig mellom lokal klargjøring og faktisk skyoppsett.
