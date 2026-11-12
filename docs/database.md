# Database

Databasen kjører i Supabase-testprosjektet `abakusrevyen.no` (`getffkktbyjusuyqxuzw`, eu-west-1). SQL-filene i `supabase/migrations` er kildegrunnlaget. Migrasjonshistorikken bevares, mens beskrivelsen her gjelder skjemaet **etter alle migrasjonene**.

[Modellguiden](database-revue-model.md) forklarer kontoverifisering, videokilder, revypass, checkout, refusjoner og hostingfrister. [Backend-kontraktene](backend-contracts.md) viser hvordan kommende Edge Functions skal bruke modellen.

## Tabelloversikt

Det finnes 25 tabeller i `public`, alle med RLS:

| Område | Tabeller | Formål |
| --- | --- | --- |
| Konto | `profiles`, `student_verifications` | Profil/roller og fersk, serververifisert studentkvalifikasjon. Supabase Auth eier innloggingsidentitetene. |
| Revy og forestillinger | `revues`, `revue_details`, `shows`, `ticket_links` | Årgang, navneslipp, hovedvideo/akter, tid/sted og lenker til fysiske billetter. |
| Live og video | `streams`, `stream_playback`, `revue_videos`, `video_sources`, `cloudflare_video_sources`, `revue_playlists` | Live-metadata, privat live-input, opptak/småvideoer, offentlige YouTube-kilder, private Cloudflare-kilder og spilleliste. |
| Salg og rettigheter | `revue_sales`, `revue_prices`, `revue_member_groups`, `orders`, `revue_access`, `order_refunds`, `stripe_events` | Revypass, prisgrupper, interne grupper, alle faktiske betalinger, varige rettigheter og leverandørhendelser/refusjoner. |
| Chat | `chat_messages`, `chat_bans` | Meldinger, skjuling og utestengelser. |
| Innhold | `site_settings`, `gallery_albums`, `gallery_photos`, `posts` | Innstillinger, bildegalleri og innlegg. |

To tidligere hjelpetabeller er slått sammen: YouTube-ID ligger på `video_sources`, og hovedvideo/akter på `revue_details`. De gamle `stream_prices`/`stream_access` er avviklet. Kjøp gjelder en hel revy, og betalingshistorikk skal ikke forsvinne når én stream fjernes.

## Tilgang og publisering

- `profiles.role` styrer redaksjon og moderering. En vanlig bruker kan lese egen profil og endre visningsnavn/avatar, men ikke rolle eller verifisering.
- Synlig revy og avslørt navn er ulike tidspunkt: `revues.visible_from` og `name_reveal_at`. `revue_details` og publiserte videokilder følger navneslippet.
- `shows`, `ticket_links` og `streams` har egne synlighetsvinduer. Kjøpt rett avslører ikke en upublisert sending.
- `revue_videos.published_at`, `video_sources.published_at`, kildeklarering og `revue_playlists.published_at` beskytter fremtidige lenker. Upubliserte eller ikke-klare YouTube-ID-er returneres ikke offentlig.
- Redaktører kan se/redigere redaksjonelt innhold og slette YouTube-kilder. Cloudflare-ID-er er bare lesbare for admin/service role; ekstern opprydding krever serveroperasjon.
- Ordre, refusjoner, rettigheter og studentverifisering er serverstyrt. Brukere leser egne rader; admin kan lese dem for drift. Klienten kan ikke opprette betaling, rabatt eller intern medlemsrett.
- `stripe_events` er service-only. RLS er aktivert uten klientpolicy med vilje. Ledgeren lagrer leverandørhendelser for idempotent behandling; ikke legg tokens eller secrets i payload.
- `private.has_stream_access()` gir chat-/metadatatilgang og lar staff moderere. Betalt video bruker bare service-only `can_play_stream`/`can_play_source`.
- RLS beskytter rader, ikke vilkårlige private kolonner i ellers offentlige rader. Derfor ligger Cloudflare-identifikatorer separat. Lesbare views må bruke `security_invoker` eller tilsvarende eksplisitt beskyttelse.

`NULL` publiseringstid betyr normalt skjult/ikke planlagt. Offentlige `site_settings` er et uttrykkelig unntak: `visible_from = NULL` betyr ingen tidsbegrensning. Tider er `timestamptz` og vises i norsk tid i appen. Beløp lagres som heltall i øre.

## Chat og innhold

`chat_messages` får bruker og visningsnavn fra serverkonteksten ved innsetting. Brukeren kan ikke sende som en annen eller endre selve meldingsteksten etterpå. Moderatorer kan skjule/gjenopprette meldinger og opprette `chat_bans`. `streams.chat_enabled` styrer om nye meldinger kan sendes.

Realtime leverer `message`, `message_hidden` og `message_restored` til private `chat:<stream-id>`-topics. Nettleseren har ikke lov til å sende egne Broadcast-hendelser. Reconnect og tilbakekalling må testes mot ekte Supabase Realtime i #131. En allerede åpen forbindelse får ikke nødvendigvis ny autorisasjon uten reconnect. Skjulte meldinger må også filtreres i UI der rader fortsatt returneres.

Gallerialbum og innlegg har publiseringstid; bildefiler ligger i R2 og databasen lagrer filstier. Publiserte filer i en offentlig bucket kan åpnes av alle som kjenner adressen. Ikke bruk skjulte databaserader som beskyttelse for private medier. Se [medielagring](media-storage.md).

## Endringer og kontroll

Opprett en ny migrasjon med den låste CLI-en, test den lokalt og gjennomgå grants, RLS, fremmednøkler og oppgraderingsdata. Ikke endre migrasjoner som allerede er anvendt. Oppryddingsmigrasjonene stopper hvis gamle grants, priser eller opptak ikke er overført; de skal ikke omgås ved å slette data manuelt.

`pnpm test:db` kjører en blank database, en oppgradering med eksisterende kjøp/videoer og regresjonstester for tilgang og checkout. Testene bruker PGlite med stand-ins for Auth/Realtime og erstatter ikke ekte OAuth-, betalings- eller videotester.

Typefilen i `src/lib/supabase/database.types.ts` genereres fra den migrerte databasen. Repoets CLI er ikke automatisk logget inn eller koblet til et prosjekt fordi Supabase-connectoren er tilkoblet. Anvendelse i skyen og eventuell produksjonsdeploy krever at riktig prosjekt og bestilling er avklart; se [utvikling](development.md) og [deploy](deployment.md).
