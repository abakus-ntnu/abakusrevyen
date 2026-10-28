# Abakusrevyen v2

Her bygger vi den nye nettsiden til Abakusrevyen. Det finnes nå et klientrendret appskall med responsiv navigasjon, de viktigste offentlige sidene og en enkel skisse av livestream og chat. Tekstene og uttrykket er et startpunkt som kan endres når innholds- og designarbeidet fortsetter.

Nettsiden bygges med Vite, React, TypeScript, React Router, Tailwind CSS og shadcn/ui. Supabase-testprosjektet er opprettet og kan brukes lokalt med offentlige verdier i `.env.local`, Databaseskjemaet med tilgangsregler ligger i `supabase/migrations` og er beskrevet i [databasedokumentasjonen](docs/database.md), men innlogging og Edge Functions er ikke bygget ennå. Offentlige bilder hentes fra test-bucketen i Cloudflare R2. Cloudflare Stream og Pages er fortsatt planlagt.

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

Åpne adressen Vite skriver i terminalen. Appen virker uten Supabase-nøkler og bruker den offentlige R2-testadressen som reserve. Hvis du skal koble til Supabase eller prøve en annen medieadresse, kopierer du `.env.example` til `.env.local` og endrer de offentlige verdiene der. Start Vite på nytt etter at miljøvariablene er endret.

Nyttige kommandoer:

```sh
pnpm typecheck
pnpm lint
pnpm test:db
pnpm build
pnpm preview
pnpm exec supabase --version

# Kjør typekontroll, lint og bygg i én omgang
pnpm check
```

`pnpm-lock.yaml` sørger for at alle får de samme avhengighetene. Det finnes ingen kommando for publisering til produksjon her ennå. CI sjekker bare endringer som sendes til `v2`, og pull requests som skal inn i `v2`.

## Videre lesing

- [Bidra til prosjektet](CONTRIBUTING.md)
- [Lokal utvikling og Supabase-plan](docs/development.md)
- [Databasen: tabeller, tilgangsregler og flyter](docs/database.md)
- [Deploy og miljøer](docs/deployment.md)
- [Bilder og filer i Cloudflare R2](docs/media-storage.md)
- [Tjenestegrenser og kostnader](docs/service-limits-and-costs.md)
- [Mal for innholdsplanlegging](docs/content-plan.md)
- [Oversikt over den gamle nettsiden](docs/legacy-inventory.md)
- [Instruksjoner for AI-verktøy](AGENTS.md)

Repoet er offentlig. Ikke legg inn hemmelig revytema, upubliserte bilder eller tilgangsnøkler. Den opprinnelige [LICENSE](LICENSE) og hele Git-historikken er bevart.
