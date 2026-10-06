# Abakusrevyen v2

Her bygger vi den nye nettsiden til Abakusrevyen. Foreløpig er dette et lite og
ryddig utgangspunkt: en klientrendret React-app med en enkel startside og en
«fant ikke siden»-rute. Innhold, navigasjon og endelig uttrykk finner vi ut av
sammen før vi bygger resten.

Nettsiden bygges med Vite, React, TypeScript, React Router, Tailwind CSS og
shadcn/ui. Planen er å bruke Supabase til innlogging, database, fillagring og
Edge Functions, Cloudflare Stream til video og Cloudflare Pages til publisering.
Ingen skytjenester er satt opp av denne endringen.

## Kom i gang

Du trenger:

- Node.js **24.21.0**, låst i `.node-version` og `.nvmrc`
- pnpm **12.9.1**, låst i `package.json`

Hvis du bruker nvm, kommer du i gang slik:

```sh
nvm install
nvm use
npm install --global pnpm@12.9.1
pnpm install --frozen-lockfile
pnpm dev
```

Åpne adressen Vite skriver i terminalen. Appskallet virker fint uten Supabase-nøkler.
Når vi har et prosjekt å koble til, kopierer du `.env.example` til `.env.local`
og fyller inn offentlig prosjekt-URL og publishable key. Start Vite på nytt etter
at miljøvariablene er endret.

Nyttige kommandoer:

```sh
pnpm typecheck
pnpm lint
pnpm build
pnpm preview

# Kjør typekontroll, lint og bygg i én omgang
pnpm check
```

`pnpm-lock.yaml` sørger for at alle får de samme avhengighetene. Det finnes ingen
kommando for publisering til produksjon her ennå. CI sjekker bare endringer som
sendes til `v2`, og pull requests som skal inn i `v2`.

## Videre lesing

- [Bidra til prosjektet](CONTRIBUTING.md)
- [Lokal utvikling og Supabase-plan](docs/development.md)
- [Deploy og miljøer](docs/deployment.md)
- [Mal for innholdsplanlegging](docs/content-plan.md)
- [Oversikt over den gamle nettsiden](docs/legacy-inventory.md)
- [Instruksjoner for AI-verktøy](AGENTS.md)

Repoet er offentlig. Ikke legg inn hemmelig revytema, upubliserte bilder eller
tilgangsnøkler. Den opprinnelige [LICENSE](LICENSE) og hele Git-historikken er bevart.
