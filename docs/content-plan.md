# Innholdsplan og beslutninger – Abakusrevyen v2

Dette er arbeidsarket for hva nettsiden skal inneholde og hvordan den skal brukes. Oppdater det når vi tar beslutninger. Det er greit at detaljer fortsatt er åpne.

**Dette dokumentet ligger i et offentlig repo.** Hemmelige revytemaer, upubliserte bilder, personopplysninger og nøkler skal ikke legges inn her.

## Fastlagt for første lansering

Målet er lansering **31. januar 2027**. Nettsiden skal da ha:

- Livestream med tilgangskontroll
- Chat knyttet til livestreamen
- Betaling for tilgang til livestreamen

Andre funksjoner kan komme senere. `v2`-branchen er opprettet for arbeidet med den nye nettsiden.

## Hvem lager vi nettsiden for?

| Målgruppe | Hva vil de få gjort? | Prioritet | Hvem følger opp? |
| --- | --- | --- | --- |
| Publikum | Finne informasjon om Abakusrevyen, forestillinger og billetter | Høy | Avklares |
| Seere på nett | Betale, få tilgang til livestream og bruke chat | Høy | Avklares |
| Tidligere og nye besøkende | Finne offentlig informasjon, kontaktinfo og eventuelt tidligere innhold | Avklares | Avklares |
| De som oppdaterer nettsiden | Publisere og vedlikeholde tekst, datoer og medier | Høy | Avklares |

## Sider og innhold

Dette er et første forslag til struktur, ikke en ferdig navigasjon.

| Side / funksjon | Hvem og hvorfor? | Tekst og medier vi trenger | Ansvarlig | Status |
| --- | --- | --- | --- | --- |
| Forside | Gi publikum rask vei til det viktigste | Kort introduksjon, aktuelle datoer og tydelige lenker | Avklares | Må planlegges |
| Om Abakusrevyen | Forklare hvem vi er | Godkjent beskrivelse og kontaktinformasjon | Avklares | Må kartlegges |
| Forestillinger og billetter | Hjelpe publikum å finne tid, sted og billettkjøp | Datoer, praktisk informasjon og lenker | Avklares | Må planlegges |
| Livestream | Gi betalende seere tilgang til sendingen | Spiller, tilgangsinformasjon og hjelp ved problemer | Avklares | Påkrevd ved lansering |
| Betaling og tilgang | La seere kjøpe og finne igjen tilgangen sin | Pris, vilkår, kvittering og hjelpetekst | Avklares | Påkrevd ved lansering |
| Chat | La seere delta under sendingen | Enkle regler og informasjon om moderering | Avklares | Påkrevd ved lansering |
| Tidligere innhold | Vise relevant offentlig materiale | Tekster, bilder og eventuelle videoer vi har rett til å publisere | Avklares | Avklares |

## Beslutningslogg

Når vi bestemmer noe, skriv inn **hva vi valgte, hvorfor og hva som fortsatt er åpent**. Diskusjonen kan skje i Slack eller et GitHub-issue, men konklusjonen skal stå her. Lenke gjerne til issuet eller PR-en.

| Beslutning | Begrunnelse | Status |
| --- | --- | --- |
| Stream, chat og betaling skal være med ved første lansering | Dette er kjernefunksjonene i den nye nettsiden | Besluttet |
| Siktemål for første lansering er 31. januar 2027 | Nettsiden skal være klar til slippfesten | Besluttet |
| Bruke Vite, React, TypeScript og pnpm for den nye frontend-koden | Valgt retning for v2 | Planlagt |
| Bruke Cloudflare Pages, Cloudflare Stream og Supabase | Valgt retning for hosting, video og backend | Planlagt |
| Lagre bilder og andre aktuelle filer i Cloudflare R2 | Valgt lagringsløsning for v2 | Besluttet |
| Bruke Cloudflare Stream til livestream | Valgt løsning for sending og avspilling | Besluttet |
| Velge betalingsleverandør og utbetalingsoppsett | Må avklares med økans (CC) før implementasjonen låses | Åpent |

Endres en beslutning, oppdater raden og skriv kort hvorfor. Større tekniske valg kan få et eget dokument i `docs/decisions/` senere.

## Spørsmål vi fortsatt må avklare

- Hva kommer folk først og fremst til nettsiden for, og hva må derfor ligge på forsiden?
- Hvilke gamle sider skal bli med videre, videresendes eller fjernes? Se `legacy-inventory.md`.
- Hvordan finner brukeren veien fra betaling til livestream og chat?
- Hvordan skal seere få hjelp hvis betaling eller tilgang ikke fungerer?
- Hvem modererer chatten, og hvilke regler skal gjelde?
- Hva skal være åpent, og hvor trengs innlogging eller tilgangskontroll?
- Hvem skriver, godkjenner og holder tekst, datoer og kontaktinfo oppdatert?
- Hvilke bilder og videoer har vi lov til å publisere?
- Hvordan skal nettsiden fungere godt på mobil og med hjelpemidler?
- Hvilket uttrykk og språk passer Abakusrevyen uten å røpe årets tema før det er offentlig?

## Før vi begynner å bygge mye innhold

- [ ] Vi har prioritert målgruppene
- [ ] Vi har et enkelt sidekart og en foreslått navigasjon
- [ ] Flyten for betaling → tilgang → livestream og chat er beskrevet
- [ ] Hver side og funksjon har en ansvarlig
- [ ] Tekst og medier er sjekket for riktighet og publiseringsrettigheter
- [ ] Gamle URL-er er vurdert mot `legacy-inventory.md`
- [ ] Vi har blitt enige om en designretning