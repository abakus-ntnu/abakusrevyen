# Tjenester, grenser og kostnader

**Kontrollert 6. oktober 2026.** Dette er et arbeidsdokument for teknikkgjengen, ikke et pristilbud. Leverandørpriser, produktgrenser og betalingsvilkår kan endres. Tallene nedenfor er i leverandørens faktureringsvaluta; det er ikke gjort valutakonvertering.

## Hva som er valgt

| Status | Tjenester | Betydning |
| --- | --- | --- |
| Valgt i arkitekturen, ikke satt opp | Cloudflare Pages, Cloudflare Stream og Supabase | README og [deployplanen](deployment.md) beskriver ønsket bruk. Ingen av integrasjonene er opprettet eller koblet til appen. |
| Vurderes | Cloudflare R2, Mollie, Stripe, Vipps direkte og Adyen | Ingen leverandør eller betalingsflyt er valgt. R2 er et mulig bilde- eller backup-lager, ikke en Stream-erstatning. |
| Reservealternativ | GitHub Pages | Den gamle nettsiden ligger der ifølge repoets dokumentasjon. Det er ikke besluttet at v2 skal bruke Pages, og det må avklares mot GitHubs vilkår før produksjon. |

Appen er foreløpig et klientrendret Vite-skall. Den har ikke autentisering, database, chat, videoopplasting, betaling eller produksjonsdeploy. Kostnadsscenarioene er derfor modeller, ikke målinger eller løfter om kapasitet.

## Kostnads- og kapasitetsmodeller

For å kunne sammenligne er dette lagt til grunn:

- Hver Stream-forestilling varer 90 minutter. Ett 90-minutters opptak beholdes i Stream, og det finnes ikke andre opptak som bruker lagringskvoten.
- Stream har ikke inkludert gratis leveringsminutter. Lagring kjøpes i trinn på 1 000 minutter for USD 5 per måned; én 90-minutters video bruker dermed USD 5-trinnet. Levering koster USD 1 per 1 000 seerminutter. Se [Stream-prisene](https://developers.cloudflare.com/stream/pricing/).
- Vanlig måned: 1 000 sidebesøk, ingen liveforestilling, ett 90-minutters opptak beholdes, og 5 % av besøkene ser et 10-minutters klipp. Det gir 50 × 10 = 500 seerminutter.
- Forestillinger: alle oppgitte samtidige seere ser hele 90 minutter. Ingen buffering, omstarter eller ekstravisning er lagt til. Stream teller faktisk leverte segmenter, så ekte forbruk kan avvike.
- Chat: 30 minutters aktiv chat i løpet av forestillingen; hver seer og én moderator sender i snitt ett chatinnlegg per minutt. Alle er på samme kanal, og avsenderen mottar ikke sitt eget innlegg. Hvert innlegg gir én sendt hendelse og én levering til hver av de andre deltakerne. Presence, tilkobling, historikk, reconnects og andre systemmeldinger er ikke med.
- For Supabase-kostnad regnes ett aktivt produksjonsprosjekt. Pro koster USD 25 per organisasjon per måned og inkluderer USD 10 compute-kreditt som dekker én Micro-instans. Testprosjektet holdes utenfor scenarioets Pro-beløp fordi det kan være et separat Free-prosjekt. Se [Supabase-priser](https://supabase.com/pricing).

| Scenario | Stream levert | Stream lagret | Realtime-leveringer for chat | Kapasitetsmerknad | Modellert månedsbeløp |
| --- | --- | --- | --- | --- | --- |
| Vanlig måned, 1 000 besøk | 50 × 10 = 500 min = USD 0,50 | 90 min; 1 000-minutters trinn = USD 5 | Ingen | Supabase Free kan settes på pause etter en ukes inaktivitet. Vanlig statisk Pages-hosting og CI for offentlig repo er modellert til USD 0. | **USD 5,50** for Stream; Supabase Free USD 0 hvis prosjektet brukes og ikke trenger Pro. |
| Forestilling, 30 seere | 30 × 90 = 2 700 min = USD 2,70 | 90 min; USD 5 | 31 deltakere × 30 innlegg hver × 31 fakturerte enheter/innlegg = **28 830** | 31 samtidige forbindelser; ca. 16 Realtime-hendelser/s ved jevn trafikk. Innenfor oppgitte Free-grenser 200 forbindelser og 100 hendelser/s. | **USD 7,70** med Supabase Free og Stream. |
| Forestilling, 100 seere | 100 × 90 = 9 000 min = USD 9 | 90 min; USD 5 | 101 × 30 × 101 = **306 030** | 101 forbindelser er innenfor Free 200. Jevn chat blir ca. 170 hendelser/s, over Free-grensen 100/s, men under Pro med spend cap 500/s. | **USD 39,00** med Supabase Pro USD 25 og Stream. |
| Forestilling, 250 seere | 250 × 90 = 22 500 min = USD 22,50 | 90 min; USD 5 | 251 × 30 × 251 = **1 890 030** | Free stopper allerede ved 200 forbindelser. Jevn chat blir ca. 1 050 hendelser/s: over Pro med spend cap 500/s, men under oppgitt Pro uten spend cap 2 500/s. Krever belastningstest. | **USD 52,50** med Supabase Pro USD 25 og Stream, hvis faktisk trafikk holder seg innen 5 millioner månedlige Realtime-meldinger. |

Stream-beløpet er kapasitet + én forestilling eller det oppgitte VOD-forbruket. Lagringskapasitet faktureres per måned også når innholdet ikke blir sett. Flere opptak kan kreve neste 1 000-minutters trinn. Supabase-beløpet omfatter bare plannivå og forventet meldingstillegg i disse regnestykkene; det inkluderer ikke skatt, valutapåslag, ekstra prosjekter, overforbruk på andre Supabase-produkter eller kostnader hos betalingsleverandør. Pages er en gratis planmodell, ikke en bekreftelse på en opprettet konto eller et live domene.

### Slik er chat-regnestykket laget

La $n$ være antall seere pluss én moderator. Med ett innlegg per deltaker per minutt i 30 minutter blir antall innlegg $30n$. Hvert innlegg teller én sending og $n-1$ mottakere, altså $n$ Realtime-leveringer. Totalt blir det $30n^2$. Regnestykket teller leveringer, ikke bare det seeren skriver.

For 250 seere er gjennomsnittet $251/60 \approx 4{,}18$ innlegg sendt per sekund. Med 251 mottakere per innlegg blir belastningen omtrent $4{,}18 \times 251 \approx 1\,050$ sendte/mottatte Realtime-hendelser per sekund. Dette er en gjennomsnittlig jevnrate; korte samtidige meldingsbølger kan være høyere. Supabases [månedskvote](https://supabase.com/pricing) og [grenser per sekund/samtidige forbindelser](https://supabase.com/docs/guides/realtime/limits) er ulike grenser. Et lavt månedsforbruk gjør ikke at en kort topp automatisk godtas.

## Cloudflare Pages

**Ønsket bruk:** statisk hosting av Vite-appen, `pages.dev`-forhåndsvisninger og senere avtalt domene. Repoets [deployplan](deployment.md) beskriver foreløpige bygginnstillinger; ingen Pages-konto, deploy eller domene er bekreftet.

| Tema | Opplysninger kontrollert 6. oktober 2026 |
| --- | --- |
| Gratis og pris | Pages Free har opptil 500 bygg per måned, én samtidig byggjobb, ubegrensede aktive preview-deployer, 100 Pages-prosjekter per konto, 20 000 filer og 25 MiB per statisk fil. Se [Cloudflare Pages-grenser](https://developers.cloudflare.com/pages/platform/limits/) og [Pages-produktet](https://www.cloudflare.com/developer-platform/products/pages/). Den åpne grensesiden oppgir ikke her en egen månedspris for et Vite-statisk nettsted; modellér derfor statiske filer på Free, og verifiser kontoplan og eventuell funksjonsbruk i dashboardet. |
| Hva koster | Pages Functions bruker Workers-kvoter og prising. Ikke legg inn Functions bare for SPA-fallback; repoets Vite-app kan bruke Pages sin SPA-fallback. Egne domener kan ha ekstern registrerings-/fornyelseskostnad hos domeneregistraren; denne er ikke priset her. |
| Tekniske grenser | Free-bygg stopper etter 20 minutter. Maks 500 bygg/måned, én samtidig byggjobb, 20 000 filer/site og 25 MiB per fil. Preview-deployer har ingen oppgitt antallsgrense. Se [grensene](https://developers.cloudflare.com/pages/platform/limits/). |
| Når grense nås | Et bygg som ikke får kapasitet eller går over timeout kan ikke levere ny deploy. Statisk nettstedets løpende besøk er ikke det samme som Pages Functions-kall. Dokumentasjonen som er kontrollert angir ikke et generelt automatisk betalt oppgraderingsløp for Pages-grensene; følg dashboard og bygglogger. |
| Betaling og tilgang | Gratis statisk prosjekt krever ikke at vi aktiverer en betalt Pages-plan. Betalte Cloudflare-abonnementer støtter Visa, Mastercard, American Express, Discover, PayPal, Apple Pay, Google Pay, Stripe Link og UnionPay. Cloudflare kan forhåndsgodkjenne betalingsmåten for bruksmålte tjenester; ved mislykket kontroll kan tjenestetilgang stanses. Se [Cloudflare Billing Policy](https://developers.cloudflare.com/billing/understand/billing-policy/). |
| Følg med / oppgrader | Følg antall bygg per måned, byggets varighet, timeout/feil, filantall, største fil og Functions-bruk. Vurder endring før 500 bygg/måned, 20 000 filer eller gjentatte byggkøer; flytt store videoer til Stream og store statiske objekter til en vurdert objektlagring. |
| Uavklart for Abakusrevyen | Konto-/organisasjonseier, repo-integrasjon og rettigheter; om gratisnivået gir ønsket previewvern; domenevalg; første reelle bygg; innholdsstørrelse; og om noen framtidig backend trenger Functions. `noindex` er ikke tilgangskontroll. |

## Cloudflare Stream

**Ønsket bruk:** lagre opptak og levere livevideo/VOD. Stream er valgt i dokumentasjonen, men ingen konto, betalingsprofil, videoflyt, live-input eller avspiller er satt opp.

| Tema | Opplysninger kontrollert 6. oktober 2026 |
| --- | --- |
| Gratis og pris | Innlasting og koding er inkludert uten ekstra kostnad. Lagring er forhåndsbetalt: USD 5 per måned per 1 000 minutters lagringskapasitet. Levering etterfaktureres med USD 1 per 1 000 leverte minutter. Ingen separat båndbreddeavgift. Se [Stream-priser](https://developers.cloudflare.com/stream/pricing/). |
| Hva telles | Lagring måles etter videolengde, ikke filstørrelse, og omfatter opplastede videoer og RTMP/SRT-liveopptak. WebRTC-opptak kan for øyeblikket ikke lagres. Levering inkluderer avspilling i Stream Player/HLS/DASH, WebRTC/WHEP, MP4-nedlasting og RTMP/SRT-simulcast. Buffering/preloading kan faktureres; segmenter som faktisk kommer fra klientcache faktureres ikke. |
| Live og tekniske grenser | Standard videofil er maks 30 GB; opptil 120 videoer kan være i kø eller koding samtidig. Lagringskapasitet må være kjøpt for å laste opp video eller starte nye live-strømmer. Ved fullt lager avvises nye opplastinger/live starter til kapasitet kjøpes eller videoer slettes. Se [Stream FAQ](https://developers.cloudflare.com/stream/faq/). RTMP/SRT brukes når opptak trengs; WebRTC har ikke opptak etter den kontrollerte dokumentasjonen. |
| WebRTC-prisovergang | Cloudflare oppgir at WebRTC-levering begynner å faktureres 15. oktober 2026, etter GA-overgang. Første forestilling 4. mars 2027 er etter denne datoen. Bruk derfor samme leveringsmodell i scenarioet, men kontroller sats og faktisk måling på nytt før lansering. Se [Stream-priser](https://developers.cloudflare.com/stream/pricing/). |
| Signerte URL-er | Videoer er offentlige hvis de ikke krever signerte URL-er. Token-endepunktet er ment for lavt volum/test, anbefalt under 1 000 token per dag, og standardtokenet varer én time. Signeringsnøkkel eller Stream Workers-binding er alternativ for større volum. Token kan ikke utløpe mer enn 24 timer fram i tid, og har maks fem access rules. Se [sikring av Stream](https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/). |
| Når grense nås | Løpende levering blir fakturert etter bruk. Manglende lagringskvote stopper nye opplastinger og nye live-strømmer. Ubetalt/utløpt Stream-abonnement kan føre til at videoer fjernes dersom det ikke fornyes innen 30 dager, ifølge [FAQ](https://developers.cloudflare.com/stream/faq/). Ha reserveplan for selve forestillingen, ikke bare for opptaket. |
| Betaling og tilgang | Stream er en betalt add-on/forbruksbasert tjeneste, så Cloudflare-kontoen må ha en gyldig betalingsmetode og bestå eventuell forhåndsgodkjenning. Aksepterte Cloudflare-betalingsmåter og mulig tjenestesuspensjon står i [Billing Policy](https://developers.cloudflare.com/billing/understand/billing-policy/). Ikke opprett/aktiver dette før økonomiansvarlig har godkjent fakturering. |
| Følg med / oppgrader | Dashboard: kjøpt og brukt lagringsminutt, gjenværende kapasitet, leverte minutter, aktive seere, live-inputstatus, feilede opplastinger, tokenfeil og beregnet regning. Kjøp neste lagringstrinn før kapasiteten fylles; sett varsel internt før forventet leveringsvolum. Test avspillingsforsinkelse, mobilnett, reconnect og ende-til-ende live før forestilling. |
| Uavklart for Abakusrevyen | RTMP/SRT eller WebRTC; om live skal tas opp; bitrate/oppløsning og forventet ventetid; offentlig eller innlogget visning; token-/påloggingsflyt; faktisk betalingsmåte; dataansvar og samtykke; og hvor lenge opptak beholdes. |

## Cloudflare R2

**Mulig bruk:** offentlige bilder, nedlastbare filer eller en ekstra kopi av data. R2 er bare vurdert, og er ikke valgt som appens bilde- eller backup-løsning.

| Tema | Opplysninger kontrollert 6. oktober 2026 |
| --- | --- |
| Gratisnivå og priser | Per måned: 10 GB-month Standard-lagring, 1 million Class A-operasjoner og 10 millioner Class B-operasjoner. Standard over kvoten: USD 0,015/GB-month, USD 4,50 per million A og USD 0,36 per million B. Internett-egress fra R2 er uten trafikkavgift. Se [R2-priser](https://developers.cloudflare.com/r2/pricing/). Infrequent Access har ikke gratisnivå, retrieval-avgift og 30 dagers minste lagringstid; det er neppe riktig for ofte viste bilder. |
| Operasjoner | Opplasting/listing er normalt Class A; lesing/henting er Class B. Sletting, sletting av bøtte og abort av multipart-opplasting er gratis. Billable units rundes opp til neste faktureringsenhet. |
| Teknisk og live-risiko | Gratis egress fjerner ikke Class B-kostnaden: mange små bildefiler kan overskride 10 millioner GET-er selv ved lav lagringsmengde. R2s oppgitte pris- og startdokumenter er ikke grunnlag for å regne objektlager som videostreamingstjeneste. Bruk Stream til video. |
| Når grense nås / konto | R2 krever Cloudflare-konto og at R2-abonnement/checkout aktiveres. Bruksmålt fakturering krever gyldig betalingsmåte; ved betalingskontrollfeil kan R2-bøttene bli utilgjengelige og forespørsler feile, selv om data beholdes. Etter 30 dager uten å rette betalingsmåten kan data knyttet til bruksmålte tjenester slettes. Se [R2 kom i gang](https://developers.cloudflare.com/r2/get-started/) og [Billing Policy](https://developers.cloudflare.com/billing/understand/billing-policy/). |
| Følg med / oppgrader | Månedlig lagring, Class A/B-operasjoner, månedlig forbruk mot gratisnivå, avviste forespørsler og hvilke filer som faktisk blir hentet. For bilder, bruk cache/CDN der det passer og mål GET-er per sidevisning. Vurder betalt bruk før gratisoperasjonene eller 10 GB nås. |
| Backup | R2 kan være mål for en separat backup, men en kopi i samme konto er ikke alene en gjenopprettingsplan. Avklar versjonering, retention, separat tilgang/konto, kryptering og testet restore før data legges der. R2 er ikke en automatisk backup av Supabase. |
| Uavklart for Abakusrevyen | Om bilder skal bo i Vite-bygget, Supabase Storage eller R2; om R2 skal være offentlig; cachepolicy og domene; tilgangsnøkler og eier; og om det faktisk finnes et backupbehov med et definert restore-mål. |

## Supabase

**Ønsket bruk:** Auth, Postgres, Storage og Edge Functions; mulig Realtime-chat under forestilling. Supabase-klienten er bare gjort klar til senere, og repoet har ingen avtalt datamodell, migrasjoner, buckets, RLS-policyer eller funksjoner. Se [lokal utviklingsplan](development.md).

| Tema | Free | Pro |
| --- | --- | --- |
| Plattform | USD 0; opptil 2 aktive prosjekter; 500 MB database, 1 GB Storage, 5 GB egress, 50 000 MAU, 500 000 Edge Function-kall, 2 millioner Realtime-meldinger/mnd. | Fra USD 25/organisasjon/mnd; 8 GB disk per prosjekt, 100 GB Storage, 250 GB egress, 100 000 MAU og 2 millioner Edge Function-kall. Etter kvote: Storage USD 0,0213/GB, egress USD 0,09/GB, MAU USD 0,00325 og Functions USD 2 per million. Se [Supabase-priser](https://supabase.com/pricing/). |
| Database/compute | 500 MB database, delt Nano compute, lavere ytelsesnivå. Free-prosjekt pauses etter én ukes inaktivitet. | USD 10/mnd Micro compute dekkes av USD 10 compute-kreditt for ett prosjekt. Hvert ekstra prosjekt får egen compute-kostnad; to Micro-prosjekter gir ifølge Supabase USD 35/mnd totalt med Pro-plan og kreditt. Compute faktureres per time prosjektet kjører, også når Pro spend cap er på. Se [compute-priser og -fakturering](https://supabase.com/docs/guides/platform/manage-your-usage/compute). |
| Auth | 50 000 MAU. Standard e-postleverandør sender 2 e-poster/time per prosjekt; standardgrenser kan gi HTTP 429. | 100 000 MAU inkludert; mer koster per MAU. E-postegenskaper og øvrige rate limits må konfigureres ved behov. Se [Auth rate limits](https://supabase.com/docs/guides/auth/rate-limits). |
| Storage | 1 GB lagring, 5 GB cached egress, maks filopplasting 50 MB. | 100 GB, 250 GB cached egress; 500 GB maks filopplasting. Supabase Storage er ikke Stream. |
| Edge Functions | 500 000 kall/mnd. | 2 millioner kall/mnd, deretter USD 2 per million. |
| Backup | Daglige databasebackuper kan ikke lastes ned fra Free; eksporter selv med CLI og lagre utenfor prosjektet. Prosjektet kan pauses. | Daglig databasebackup med 7 dagers tilgjengelighet. Backup inneholder ikke Storage-objektene, bare metadata. PITR er tillegg: ca. USD 100/mnd for 7 dager, USD 200 for 14, USD 400 for 28, og krever minst Small compute. Se [databasebackuper](https://supabase.com/docs/guides/platform/backups). |
| Spend cap | Ingen betalt overforbruk under Free, men overskridelse kan begrense tjenesten. | Spend cap er på som standard. Når en dekket kvote er nådd, blokkeres mer bruk av den varen fram til neste syklus. Med spend cap av fortsetter tjenesten og overforbruk faktureres. Compute og flere eksplisitt valgte tillegg er ikke beskyttet av spend cap. Se [kostnadskontroll](https://supabase.com/docs/guides/platform/cost-control). |

| Praktisk drift | Hva vi må vite |
| --- | --- |
| Test vs produksjon | Bruk egne test- og produksjonsprosjekter, nøkler, Auth-returadresser og data. To Free-prosjekter er inkludert, men Free-prosjekter kan pauses. På Pro faktureres compute per prosjekt; et ekstra Micro-prosjekt er om lag USD 10/mnd utover den ene inkluderte compute-kreditten. Ikke anta at «test» er gratis bare fordi dataene er testdata. |
| Harde grenser og driftsfølge | Databaseplass, samtidige Realtime-forbindelser, meldingsrate, kvoter, Auth-rate limits og filstørrelser kan gi stopp eller feil. Pro-planens automatiske spend cap kan stoppe enkelte overkvoter i stedet for å fakturere dem; slå den ikke av uten godkjenning og overvåking. Pro prosjekt blir ikke pauset for inaktivitet. |
| Backup og gjenoppretting | Daglig databasebackup er ikke kopi av Storage-filene. Restoring gjør prosjektet utilgjengelig mens restore pågår. Bestem RPO/RTO og prøv restore før produksjon; vurder separat eksport/offsite-kopi. |
| Følg med / oppgrader | Supabase Organization Usage og Upcoming Invoice: databaseplass, compute-timer/CPU/minne, egress/cached egress, Storage, Functions, Auth MAU, Realtime-peak-forbindelser og meldinger. Oppgrader eller omform løsningen før kapasitet fylles, ikke først på forestillingskvelden. |
| Uavklart for Abakusrevyen | Datamodell, dataklassifisering, region, test-/prod-eiere, RLS/grants, Auth-behov og e-postleverandør, Storage-filtyper, backup/restore-krav, valgt compute, spend cap og betalingsmåte. |

### Supabase Realtime og chat

Månedskvoten fakturerer totalt antall meldinger/leveringer i måneden. Separate kapasitetsgrenser avgjør hvor mye som kan skje samtidig:

| Plan/innstilling | Samtidige forbindelser | Hendelser per sekund | Måned inkludert | Over månedskvote |
| --- | ---:| ---:| ---:| --- |
| Free | 200 | 100 | 2 millioner | Ingen Free-fakturering; kvote-/tjenestebegrensning kan slå inn. |
| Pro, spend cap på | 500 | 500 | 5 millioner | USD 2,50 per ekstra million hvis overforbruk er tillatt; spend cap på kan i stedet blokkere den varen ved kvoten. |
| Pro, spend cap av | 10 000 | 2 500 | 5 millioner | USD 2,50 per ekstra million. Høyere toppgrenser fritar ikke fra månedspris/kvote. |

Kilde for tall og håndtering: [Realtime limits](https://supabase.com/docs/guides/realtime/limits), [Realtime-kvoter/priser](https://supabase.com/pricing/) og [Supabase spend cap](https://supabase.com/docs/guides/platform/cost-control/). Broadcast til en kanal med 250 seere er ikke én levert melding: den faner ut til mottakerne. Derfor er regnestykket over $n^2$-skalert. Ved over grense kan channel join avvises, forbindelser kobles fra eller klienten reconnecte; Supabase logger limit-feil. Se [Broadcast](https://supabase.com/docs/guides/realtime/broadcast/) og [Realtime limits](https://supabase.com/docs/guides/realtime/limits/).

**Praktisk konklusjon:** 30 seere passer de oppgitte Free-forbindelses- og jevnrategrensene i denne modellen. 100 seere passer antatt Pro med spend cap, men ikke Free-meldingsraten. 250 seere passer ikke Free-forbindelsesgrensen eller vanlig Pro-rate med spend cap. Modellen for 250 krever høyere Pro-rate uten spend cap, og bør stresstestes med spisse meldingsmønstre og reconnects. Dette er kapasitetstall fra leverandøren, ikke en garanti for ytelse eller oppetid.

## Betaling

Betalingsleverandør er ikke valgt. Sammenligningen er for netbetaling; eventuelle billettsystemer kan allerede tilby betaling og gjøre egen integrasjon unødvendig. Priser under er bare det leverandørens offentlige sider faktisk viser. De er ikke norske tilbud til Abakusrevyen.

| Alternativ | Tilgjengelighet og aktivering | Offentlig pris som kan verifiseres | Utbetaling / fast kostnad | Uavklart |
| --- | --- | --- | --- | --- |
| Mollie | Mollies Vipps-side viser «Beta». Den oppgir norsk virksomhet, egen Vipps-avtale og Vipps Merchant ID (MSN) før aktivering. Mollie-konto må godkjennes og bankkonto verifiseres før utbetaling. Vipps krever Orders API eller oppført plugin. Se [Mollie Vipps](https://www.mollie.com/payments/vipps) og [utbetalinger](https://help.mollie.com/hc/en-us/articles/115000010065-When-do-I-receive-my-money-from-Mollie). | Vipps 1,80 % + €0,25. EØS-forbrukerkort 1,80 % + €0,25; EØS firmakort 2,90 % + €0,25; utenfor EØS 3,25 % + €0,25. Apple Pay prises etter kortet, uten eget tillegg. Se [prislisten](https://www.mollie.com/pricing) og [Apple Pay](https://www.mollie.com/payments/apple-pay). | Ingen månedlig betaling for standard online-modellen; betaling per vellykket transaksjon. Ukentlige og månedlige utbetalinger er gratis. Ved under €500 000 årlig: daglige/manuelle utbetalinger har fem gratis per måned, deretter €0,25 per utbetaling. | Bekreft om Vipps «Beta»-merking betyr begrenset/preview-tilgang for vår konto, at en norsk forening kan godkjennes, og hvordan gebyret i EUR håndteres mot NOK-salg/utbetaling. Bekreft også norsk korttilgjengelighet i vår konto; Mollies kortside og prisoversikt er ikke helt entydig for Norge. |
| Stripe | Vipps er uttrykkelig «private preview». Stripe ber om tilgangsforespørsel; dokumentasjonen sier at `vipps_preview=v1`-header må sendes under preview. Vipps støttes for norske Stripe-kontoer, NOK, Checkout/Payment Links API/Elements med forbehold. Se [Stripe Vipps](https://docs.stripe.com/payments/vipps). | Norsk kortbetaling 2,4 % + 2,00 kr; kort fra utenfor EØS 3,25 % + 2,00 kr, eventuelt ytterligere 2 % ved valutakonvertering. Vipps belastes som standard Stripe-kortgebyr **pluss et Vipps-tillegg**, men dokumentasjonen som ble kontrollert ikke angir Vipps-tilleggets beløp. Apple Pay følger kortavgift. Se [Stripe Norge-priser](https://stripe.com/en-no/pricing) og [Vipps-gebyrer](https://docs.stripe.com/payments/vipps#fees). | Standard online Payments har ingen oppstarts- eller månedsavgift. Utbetaling følger standardplan for Norge; frekvens, eventuell utsettelse og bankkrav må bekreftes i kontoen. | Vipps preview-tilgang, faktisk Vipps-gebyr, norsk organisasjons-/bankgodkjenning og utbetalingsfrist. Stripe oppgir at BankAxept ikke støttes; BankAxept-merkede kort behandles på Visa/Mastercard-nettverket. |
| Vipps direkte | Potensielt mest direkte norsk betalingsforhold, men det krever godkjent virksomhet/avtale og oppsett via Vipps MobilePay. | Den norske prissiden viser blant annet Vippskassa på stedet 1,75 %, betalingslenker 2,49 % + 1 NOK og faste betalinger 2,99 % + 1 NOK. Dette er **ikke** dokumentasjon på prisen for integrert netbetaling via API; ikke bruk Vippskassa-prisen for en nettintegrasjon. Se [Vipps-priser](https://www.vippsmobilepay.com/nb-NO/pricing). | Ingen verifisert fast månedspris eller direkte API-transaksjonspris for dette brukstilfellet i kildene som ble kontrollert. Utbetaling og eventuell avtalepris må innhentes fra Vipps. | Be om skriftlig tilbud på integrert betaling, eventuelle etablerings-/månedsgebyrer, oppgjørstid, organisasjonskrav, testmiljø og støtte for billett-/streamingprodukt. |
| Adyen | Alternativ ved behov for mer omfattende betalingsplattform. Offentlig side beskriver kommersiell onboarding; faktisk tjeneste og betalingsmetoder må godkjennes. | Oppgir ingen oppstarts- eller månedsavgift og beskriver pris som fast behandlingsgebyr + betalingsmetodegebyr. Den viste generelle siden gir ikke en verifiserbar norsk Vipps-/kortpris for Abakusrevyen. Se [Adyen-priser](https://www.adyen.com/pricing). | Standardpris omtales som per transaksjon; oppgjør kan velges i enkelte valutaer. Beløp, oppgjør og eventuelle minimums-/kontraktskrav er ikke verifisert for oss. | Be om skriftlig norsk tilbud og krav til volum, organisasjon, bankkonto, reserve og oppgjør før reell sammenligning. |

**Betalingsbeslutning bør følge arbeidsflyten, ikke bare prosenttallet.** Spør først om billettplattformen allerede håndterer kjøp, kvittering, refusjon og oppgjør. For hver leverandør må økonomiansvarlig få bekreftet hvem som juridisk selger, hvem som eier betalingskontoen, hvilke organisasjonsdokumenter kreves, hvilket land/valuta kontoen bruker, hvordan refusjoner og chargebacks prises, og når pengene står på bankkonto. Offisielle kilder som er kontrollert oppgir ikke en bekreftet nonprofit-rabatt for Abakusrevyen; ingen slik rabatt er lagt inn.

## GitHub: Projects, Actions og mulig reservehosting

**Ønsket bruk:** Projects for enkel planlegging, Actions for CI, og GitHub Pages kun som mulig statisk reserve. v2-workflowen i repoet er kun CI, har ikke publiseringssteg og er ikke bekreftet kjørt på GitHub. Se [deployplanen](deployment.md).

| Tema | Opplysninger kontrollert 6. oktober 2026 |
| --- | --- |
| Projects | GitHub Projects organiserer issues/PR-er som tabell, tavle eller roadmap. Ingen egen Project-betaling ble funnet i den kontrollerte prisoversikten; planens GitHub-tilgang, roller og organisasjonspolicy gjelder. Et prosjekt har maks 50 felter. Se [Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects) og [GitHub-priser](https://github.com/pricing). |
| Actions gratisnivå | Offentlige repoer bruker standard GitHub-hosted runners gratis. For Free-organisasjon er inkludert kvote 2 000 minutter/mnd, 500 MB artifacts og 10 GB cache per repo, men offentlige standard-runnerjobber er gratis. Private Free-repoer bruker kvoten; uten gyldig betalingsmåte blokkeres overforbruk. Se [Actions-fakturering](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions). |
| Actions når kvoten nås | Med gyldig betalingsmåte faktureres overforbruk i henhold til runner/storage-pris; uten betalingsmåte blokkeres det. Organisasjonseier kan begrense eller deaktivere Actions og tillatte actions. Pull requests fra eksterne bidragsytere kan kreve manuell godkjenning før workflow kjører. Se [organisasjonspolicy](https://docs.github.com/en/organizations/managing-organization-settings/disabling-or-limiting-github-actions-for-your-organization). |
| Pages reserve | Publisert nettsted maks 1 GB; anbefalt kilde-repo maks 1 GB; myk båndbreddegrense 100 GB/mnd; normalt maks 10 bygg/time; deploy stopper etter 10 minutter. Bruk utover grenser kan utløse 429, e-post fra support eller at nettstedet ikke blir servert. Se [GitHub Pages-grenser](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits). |
| Viktig Pages-vilkår | GitHub sier Pages ikke er ment eller tillatt som gratis hosting for nettbasert virksomhet/e-handel eller nettsted primært rettet mot å legge til rette for kommersielle transaksjoner. En revyside med lenke til ekstern billettkjøper ligger nær et tolkningspunkt; få skriftlig avklaring før Pages velges som reserve for produksjon. GitHub Pages logger besøkendes IP-adresse. Se [Pages-grenser/vilkår](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) og [Pages personverninfo](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#data-collection). |
| Organisasjonsgodkjenning og nonprofit | GitHub-organisasjoner kan ha overstyrte Actions-policyer og kreve workflow-godkjenning. Verified nonprofits kan søke om gratis GitHub Team; kvalifikasjon er 501(c)(3) eller tilsvarende og organisasjonen må være ikke-statlig, ikke-akademisk, ikke-kommersiell og ikke-politisk. Dette krever søknad/verifisering og er ikke forutsatt i scenarioene. Se [GitHub for Nonprofits](https://github.com/solutions/industry/nonprofits). |
| Følg med / uavklart | Actions: minutter, artifact/cache-lagring, kø, avviste workflows, eksterne PR-godkjenninger og tillatte actions. Pages: site-størrelse, båndbredde, deployvarighet, custom domain og vilkår. Avklar hvem som eier org, Pages-innstillinger, eventuelle nonprofit-søknader og om plattformen faktisk er tillatt for nettstedets bruk. |

## Største risikoer

| Risiko/kostnadsdriver | Mulig konsekvens | Praktisk mottiltak |
| --- | --- | --- |
| Stream-lagring og seerminutter | USD 5 for hvert 1 000-minutters lagringstrinn per måned, pluss USD 1 per 1 000 leverte minutter. Seerne og visningstiden multipliseres direkte. | Bestem opptakslengde/retention; varsle på bruk; test én forestilling med faktiske seertall; ikke la testopptak hope seg opp. |
| Realtime samtidighet og fan-out | Free kan avvise over 200 forbindelser eller 100 hendelser/s; 250-seersmodellen overskrider også Pro med spend cap sin 500/s-grense. | Lasttest realistisk chat før billettslipp; velg Pro-/kapasitetsoppsett; vurder chat-rate limits og lavere meldingsfrekvens; ha lesbar reservekanal. |
| Supabase pause/kvoter/compute | Free kan pauses; Pro krever planbetaling, prosjekter har compute hver, og spend cap kan stanse tjenesten ved kvote. | Separat test/prod; én eier for kostnad; sett varsler; dokumenter restore; vurder oppgradering før prøver. |
| Betalingsaktivering og oppgjør | Vipps hos Stripe er private preview; Mollie viser Beta og krever Vipps-avtale/MSN. Godkjenning eller bankoppgjør kan ta tid. | Skaff skriftlige tilbud/tilgangsbekreftelser tidlig; velg backupkjøpsmåte; test refusjon og utbetaling, ikke bare sandbox. |
| R2 betalingsprofil | Ugyldig betalingsmåte kan gjøre bøtter utilgjengelige; gratisnivå er ikke det samme som ingen betalings-/kontooppsett. | Ikke legg kritiske bilder eller eneste backup i R2 før eier, betalingsmåte, varsler og restore er kontrollert. |
| GitHub Pages som produksjonsreserve | Båndbredde er myk grense, og vilkårene begrenser kommersiell/transaksjonsrettet hosting. | Ikke regn Pages som godkjent failover før GitHub-vilkår er avklart. Ha en annen faktisk testet statisk deployplan. |

## Beslutninger før første forestilling 4. mars 2027

1. Velg liveprotokoll: RTMP/SRT med opptak, eller WebRTC uten opptak etter dokumentasjonen kontrollert her. Bekreft latency, encoder, nettlinje, strømbrudd og hvem som er teknisk operatør.
2. Bestem hvem som kan se live og opptak, om konto kreves, tokenlevetid, opptaksretention, samtykke og håndtering av delte lenker.
3. Bestem Supabase-test/prod-eiere, region, datamodell/RLS, Pro eller Free, spend cap, backup/restore-mål og forventet maksimum samtidighet. Gjennomfør lasttest med minst dimensjonerende seertall og chat-rate.
4. Velg chat-modell og begrensning: hvem kan skrive, frekvens per bruker, maks størrelse, reconnectoppførsel, moderering og plan ved Realtime-avbrudd.
5. Velg billett-/betalingsflyt. Få skriftlig bekreftelse på norsk foreningskonto, Vipps-preview/Beta, alle transaksjons- og oppgjørsgebyrer, refusjon/chargeback, bankkonto og faktisk utbetalingstid.
6. Avklar Cloudflare-kontoeier, betalingsprofil, fakturavarsler, Stream-lagringstrinn og hvem som kan stoppe/øke bruk. Bekreft at ingen endringer berører dagens produksjonsdomene før separat lanseringsplan.
7. Velg bildekilde og eventuell R2-bruk. Definer offentlighet, cache, livssyklus og backup/restore før opplasting.
8. Avklar om GitHub Pages kan brukes til noen del av løsningen etter vilkårene; ikke bruk det som utestet produksjonsfailover.

## Kilder og hva som ikke kunne verifiseres

Alle lenkene under er offisielle leverandørkilder. De ble åpnet 6. oktober 2026. «Sist oppdatert» er bare oppgitt der kilden selv publiserer dato; nettsider uten slik metadata er ikke tillagt en gjetningsdato.

| Leverandør/kilde | Sist oppdatert på siden | Brukt til |
| --- | --- | --- |
| [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/) | 5. sep. 2026 | Bygg, prosjekt, fil, størrelse og preview-grenser. |
| [Cloudflare Billing Policy](https://developers.cloudflare.com/billing/understand/billing-policy/) | 29. mai 2026 | Betalingsmåter og betalingskontroll/suspensjon. |
| [Cloudflare Stream pricing](https://developers.cloudflare.com/stream/pricing/) | 8. sep. 2026 | Lagring, levering, segmenter og WebRTC-faktureringsdato. |
| [Cloudflare Stream FAQ](https://developers.cloudflare.com/stream/faq/) | 8. sep. 2026 | Filstørrelse, koding, kvote og retention. |
| [Cloudflare Secure Stream](https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/) | 7. mai 2026 | Signerte URL-er/tokens. |
| [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/) | 1. okt. 2026 | Gratisnivå, lagring, operasjoner og egress. |
| [Cloudflare R2 getting started](https://developers.cloudflare.com/r2/get-started/) | 21. apr. 2026 | R2-abonnement og oppstart. |
| [Supabase pricing](https://supabase.com/pricing) | Dato ikke oppgitt | Free/Pro, produktkvoter, Realtime-månedspris og compute-kreditten. |
| [Supabase Realtime limits](https://supabase.com/docs/guides/realtime/limits) | Dato ikke oppgitt | Samtidighet, hendelser/s og grensefeil. |
| [Supabase cost control](https://supabase.com/docs/guides/platform/cost-control) | Dato ikke oppgitt | Spend cap, stopp og overforbruk. |
| [Supabase compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute) | Dato ikke oppgitt | Compute-timepris og prosjekteksempel. |
| [Supabase backups](https://supabase.com/docs/guides/platform/backups) | Dato ikke oppgitt | Daglige backuper, Storage-unntak og PITR. |
| [Supabase Auth rate limits](https://supabase.com/docs/guides/auth/rate-limits) | Dato ikke oppgitt | Auth-grenser. |
| [Supabase Broadcast](https://supabase.com/docs/guides/realtime/broadcast/) | Dato ikke oppgitt | Broadcast-flyt og fan-out. |
| [Mollie pricing](https://www.mollie.com/pricing), [Vipps](https://www.mollie.com/payments/vipps), [Apple Pay](https://www.mollie.com/payments/apple-pay), [payouts](https://help.mollie.com/hc/en-us/articles/115000010065-When-do-I-receive-my-money-from-Mollie) | Pris-/produktsidene viser publisering 6. okt. 2026; hjelpesiden uten dato | Avgifter, Vipps-beta, Apple Pay og oppgjør. |
| [Stripe Norway pricing](https://stripe.com/en-no/pricing), [Stripe Vipps](https://docs.stripe.com/payments/vipps) | Dato ikke oppgitt | Kortgebyrer, tilgjengelige metoder, preview-status og Vipps fee-oppsett. |
| [Vipps MobilePay pricing](https://www.vippsmobilepay.com/nb-NO/pricing) | Dato ikke oppgitt | Offentlige priser for navngitte produkter; ikke direkte API-pris. |
| [Adyen pricing](https://www.adyen.com/pricing) | Dato ikke oppgitt | Generell prismodell, ikke norsk tilbud. |
| [GitHub Actions billing](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions), [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), [Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects), [Nonprofits](https://github.com/solutions/industry/nonprofits) | Dato ikke oppgitt | Actions-kvoter, Pages-grenser/vilkår, Projects og kvalifikasjonskrav. |

**Ikke verifisert:** leverandørkontoer, kontospesifikke priser, norske nonprofit-rabatter, mva-/skattebehandling for Abakusrevyen, hvem som juridisk kan inngå avtaler, bankens oppgjørstid for Stripe/Vipps direkte/Adyen, Mollies Vipps-beta-tilgang for akkurat vår konto, Vipps direkte API-pris, Adyens konkrete norske pris, faktisk Cloudflare Pages-fakturering for valgt konto, reell forventet videobitrate/segmentrate og faktisk belastning/latency. Ingen konto er opprettet, ingen betalingsmåte lagt inn og ingen betalt tjeneste aktivert som del av dette dokumentet.