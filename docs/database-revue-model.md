# Datamodell for verifisering, revyvideoer og revypass

Dette beskriver databaseleveransen i #144. Innlogging, LEGO-kontroll, betaling, tokenutstedelse og automatisk videosletting bygges i egne issues. En tabell eller en kontrollfunksjon er ikke en ferdig integrasjon mot leverandøren.

## Sammenhengen

```mermaid
erDiagram
  auth_users ||--|| profiles : konto
  auth_users ||--o{ auth_identities : innloggingsmetoder
  auth_identities ||--o| student_verifications : aktuell_verifisering
  revues ||--o| revue_sales : salg_og_frister
  revues ||--o{ revue_prices : prisgrupper
  revues ||--o{ revue_videos : innhold
  revue_videos ||--o{ video_sources : kilder
  video_sources ||--o| youtube_video_sources : offentlig_lenke
  video_sources ||--o| cloudflare_video_sources : privat_identifikator
  revues ||--o| revue_playlists : spilleliste
  revues ||--o| revue_video_selections : hovedvideo_eller_akter
  profiles ||--o{ orders : kjoper
  revues ||--o{ orders : revypass
  orders ||--o{ order_refunds : refusjonshistorikk
  profiles ||--o{ revue_access : rettigheter
  revues ||--o{ revue_access : riktig_aargang
  orders |o--o| revue_access : kjopt_rett
  revues ||--o{ revue_member_groups : medlemsbevis
```

## Identitet og studentpris

Supabase Auth eier identitetene. Flere innloggingsmetoder gir ikke flere profiler når de kobles riktig. Databasen implementerer ikke OAuth-callback eller sammenslåing av to eksisterende kontoer; se #123/#137/#141. Ingen Auth-providerinnstillinger endres av migrasjonene.

Signup-triggeren gir alltid `external`. Eksisterende `student`-verdier som bare bygget på provider-navnet settes til `external`; profil-ID, interne roller, ordre og andre data beholdes. `profiles.user_type` er et foreldet kompatibilitetsfelt og skal ikke brukes som prisbevis.

`student_verifications` inneholder bruker, faktisk AbaID-identitet, LEGO-subject, resultat, maskinlesbar årsak, kriterieversjon, kontrolltid og utløp. Skriving er bare tillatt med service role. En trigger kontrollerer at identiteten har riktig bruker, provider `custom:abakus` og subject. Frakobling sletter det aktuelle resultatet gjennom fremmednøkkelen.

`current_price_type()` returnerer bare den innloggede brukerens effektive prisgruppe. Kontroll av utløp skjer ved oppslag; ingen cron-jobb må kjøre for at rabatten skal utløpe. Serverkode som kjører som brukeren kan bruke denne funksjonen. Service-role-kode kan lese det minimale resultatet og må gjøre samme gyldighetskontroll etter at sessionen og brukeren er verifisert.

Ingen gruppe-ID-er, faste kriterieversjoner eller standard levetid er lagt inn. Serveren må først kontrollere at personen fortsatt er student på data/cyber og oppgi avtalt utløp. LEGO-formatet alene beviser ikke fersk studieprogramtilhørighet. Negative resultater og tekniske feil skal håndteres i verifiseringsfunksjonen; en feil skal ikke forlenge et resultat. Ingen provider-tokens eller komplette medlemskapsresponser lagres.

## Videoer og kilder

`revue_videos` beskriver innhold: revy, eventuell forestilling/stream, tittel, beskrivelse, plakatsti, rekkefølge, publisering og `kind`. Mulige typer er `full`, `act_1`, `act_2`, `clip`, `trailer`, `behind_scenes` og `other`. Forestilling og stream må tilhøre samme revy; en eksplisitt forestilling på videoen må samsvare med streamens forestilling.

`video_sources` holder leverandør, publisering og teknisk tilstand (`processing`, `ready`, `error`, `removed`). Samme video kan ha flere kilder. En publisert metadata-rad betyr ikke at alle kildene er sluppet eller spillbare.

YouTube-ID-er ligger i `youtube_video_sources`. En lenke blir offentlig først når både video og kilde er publisert, kilden er klar, og revyen er synlig og navnet avslørt. `revue_playlists` har egen publiseringstid, slik at en fremtidig spillelistelenke ikke lekker via allerede publiserte metadata. ID-er valideres; HTML/iframe-kode lagres ikke.

`cloudflare_video_sources` holder private video-ID-er. Bare admin og service role kan lese dem, og bare service role kan skrive dem. `signed_urls_verified_at` registrerer at serverintegrasjonen faktisk har kontrollert signert avspilling hos Cloudflare. Feltet slår ikke på beskyttelse hos Cloudflare. En ny/importert kilde er derfor ikke automatisk klarert for avspilling.

Byttes video-/live-input-ID eller gjenopprettes en slettet provider-kilde, nullstilles gammel verifisering. Kontroller den nye kilden hos Cloudflare før verifiseringsfeltet settes på nytt.

`revue_video_selections` velger enten én hel forestilling eller to matchende akter, samt en valgfri fremhevet video. Referansene er bundet til samme revy. Før en valgt videos type/forestillingskobling endres må hovedvalget fjernes. Referanse-ID-er opphever aldri publikasjonspolicyene på videoene/kildene.

Redaktører redigerer innhold, YouTube-lenker og publisering, men får ikke skrive teknisk kildeklarering eller lese private Cloudflare-ID-er. Ingen kjøpt rett åpner redaksjonelle videoutkast.

## Ett revypass, flere forestillinger

`orders.revue_id` er kjøpsomfanget. Et gyldig pass følger alle tilgjengelige sendinger/opptak i denne revyen, også innhold som legges til senere. Det åpner ingen annen årgang og gjelder ikke fysiske billetter.

`revue_access` har ingen utløpskolonne. Kilden er enten `purchase` eller `internal`:

- En kjøpt rett krever en faktisk betalt ordre med positivt beløp, riktig bruker og samme revy. Ordre-ID er unik på rettigheten. Refusjon/tilbakekalling stopper denne retten.
- En intern rett krever serververifisert AbaID og en gruppe-ID konfigurert i `revue_member_groups` for akkurat den revyen. Minimal dokumentasjon beholdes: subject, gruppe-ID og kontrolltid. Serveren må selv ha kontrollert det faktiske medlemskapet; en matchende ID i databasen erstatter ikke LEGO-kallet.

Opptjent intern tilgang beholdes etter avsluttede studier, jobbstart, frakoblet identitet eller utmelding. Senere revyer må kjøpes med mindre personen også kvalifiserer der. Kontodeling er ikke tillatt, men datamodellen innfører ikke øktsporing, IP-binding eller DRM. Feilaktige interne tildelinger kan tilbakekalles uttrykkelig med grunn.

`can_play_source(user_id, source_id)` og `can_play_stream(user_id, stream_id)` kan bare kalles med service role. De returnerer en boolsk avgjørelse, ikke token eller kilde-ID. Edge Function må først verifisere innlogget bruker og selv velge bruker-ID. Kontrollene krever riktig revyrett, publisering, klar/signert kilde og aktiv hosting. Ingen staff-rolle gir automatisk betalt avspilling.

Gamle `has_stream_access()` er fortsatt en egen chat-/metadatakontroll som tillater modereringsarbeid. Den tar også hensyn til nye revypass for publiserte streams. Gamle uttrykkelige `granted`-rader beholdes for kompatibilitet i chat. Gamle kjøpsrader alene omgår ikke den nye kjøpskontrollen. Bruk aldri denne helperen som portvakt for betalt video. Realtime krever egen integrasjonstest av reconnect og tilbakekalling (#131).

## Salg, avbestilling og hosting er forskjellige klokker

`revue_sales` er påkrevd før nye ordre. Den har ett autoritativt tidspunkt for første forestilling, valgfri salgsperiode, vilkårsversjon og to hostingdatoer:

| Felt | Betydning |
| --- | --- |
| `first_show_at` | Første forestilling i hele revyen; ikke «neste stream» |
| `first_show_started_at` | Servermarkør for at første forestilling har startet; kan ikke flyttes/nullstilles |
| `stream_retire_at` | Planlagt overgang fra Stream (D) |
| `stream_delete_at` | Absolutt hosting-/slettefrist (H), fra D til maksimalt D + 30 dager |
| `terms_version` | Avtaleversjon som kopieres til nye ordre |

Nye ordre tar snapshot av revy, beløp, valuta, første forestilling, fristen to timer tidligere og vilkårsversjon. Snapshotet er uforanderlig. Konto-sletting kan fortsatt nullstille ordreeieren uten å slette økonomisk historikk.

`order_cancellation_allowed(order_id)` er en service-only kontroll for **frivillig avbestilling**. Fristen er inklusive to timer før første forestilling. Et fredagskjøp etter torsdagspremiere får ingen ny frist. En avbestillingsforespørsel datostemples av databasen når serveren registrerer den; tidspunktet kan ikke etterpå skrives om. En rettidig forespørsel kan behandles etter fristen. Når vinduet er stengt kan vanlig oppdatering av salgskonfigurasjonen ikke flytte første forestilling fremover og gjenåpne det. Avlysning/flyttet premiere og lovpålagte krav krever en separat avtalt flyt.

Appens ordinære refusjonsflyt er full refusjon. `order_refunds` bevarer likevel faktiske eksterne delrefusjoner, status og referanse. Beløp kan ikke overstige kjøpet; samtidige refusjoner låser ordren ved kontroll. En vellykket avbestillingsrefusjon setter ordren til `refunded` og tilbakekaller bare den tilhørende retten. Ved en ekstern delvis avbestillingsrefusjon betyr `refunded` at kjøpet er avsluttet, ikke at hele beløpet ble tilbakebetalt; faktiske beløp ligger i ledgeren. Kompensasjon/prisavslag er et separat tilfelle og tilbakekaller ikke automatisk tilgang. En sen paid-hendelse får ikke gjenåpne en refundert ordre. Refusjon hos Stripe og webhook-/retry-behandling implementeres fortsatt i #133.

En varig rett betyr **ikke evig hosting**. Ved H stoppes ny Cloudflare-avspilling, men ordren og rettigheten beholdes. Hvis innhold senere tilbys igjen, brukes samme rett. #150 skal varsle før D/H, bytte til verifiserte YouTube-kilder, slette Stream-kopier og stoppe kostnaden. Disse migrasjonene gjør ingen av disse eksterne operasjonene. Drive-/PC-originaler er utenfor databasen og slettes ikke.

## Oppgradering og kompatibilitet

Historiske migrasjoner er urørt. Oppgraderingen:

- beholder Auth-bruker, profil-ID, navn, roller, ordre, gamle stream-tilganger og eksisterende video-ID-er;
- migrerer sporbare, betalte kjøpsrettigheter fra gammel stream til riktig revy og bevarer uavhengige ordrekoblinger;
- gjør ikke generelle `granted`-rader om til verifisert intern medlemskap;
- kopierer gamle opptaks-ID-er til nye videokilder i `processing`, uten å late som signert tilgang eller sletting er kontrollert;
- kopierer bare entydige, positive priser fra streams til revy. Ulike priser må avklares manuelt;
- finner ikke på salgsdatoer, hostingfrister eller gamle avtaleversjoner. Nye salg må konfigureres eksplisitt;
- lar gamle felt/tabeller stå til avhengige konsumenter er flyttet. Nye kjøp bruker revypriser og revyrettigheter, ikke gammel `user_type`/`stream_prices` som autoritet.

Flere historiske streamkjøp fra samme bruker/revy kan finnes. De markeres `legacy_stream_purchase` og beholdes. Nye ordre kan ikke ha to samtidig betalte revypass for samme bruker og revy. Klienten kan aldri sette denne legacy-markøren, og den kan ikke endres etter opprettelse.

## Kontroll og gjenstående arbeid

`pnpm test:db` dekker blank database og oppgradering fra det gamle skjemaet med eksisterende profil, flere kjøp, priser og opptak. Testene bruker PGlite med minimale Auth-/Realtime-stand-ins. De er ikke en full OAuth-, provider-, Stripe- eller Cloudflare-test.

Gjenstår i egne leveranser: LEGO-kriterier/gruppe-ID-er og verifiseringslevetid; ekte linking/callback; serverautentisering; atomisk checkout/webhook-flyt; Stripe-godkjenning; tokenutstedelse/fornyelse; innholdsintegrasjon; varsler, Cloudflare-planlagt sletting og kontrollert faktureringsstopp. Manglende konfigurasjon skal gi avslag eller holde salg stengt, ikke åpne tilgang.

Lokal og faktisk hosted verifikasjon beskrives separat i PR-en. Genererte typer skal komme fra den migrerte databasen. Supabase MCP tildeler migrasjonsversjoner ved kjøring; de nye lokale filnavnene må samsvare med den faktiske hosted historikken før PR-en leveres.
