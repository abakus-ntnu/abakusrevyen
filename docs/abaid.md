# AbaID: opprett en testapp og koble til Supabase

AbaID er innlogging med Abakus-kontoen via LEGO OAuth2. Guiden gjelder en egen testapplikasjon og et Supabase-testprosjekt. Bruk separate applikasjoner og credentials for test og produksjon.

## Det som er kontrollert

29. oktober 2026 ble `custom:abakus` opprettet og aktivert manuelt i Supabase-testprosjektet. Authorization code-flyten med PKCE (`S256`), e-postbekreftelse og et direkte serverkall til LEGOs brukerendepunkt fungerte med `user`-scope. Ingen credentials, tokens eller personlige testresultater skal legges i denne guiden.

Dette er et faktisk testet skyoppsett, ikke en funksjon som allerede finnes i appen. Innloggingsside, kontokobling og serververifisering av studentfordeler gjenstår. Lokal `supabase/config.toml` setter ikke automatisk opp den hostede provideren.

## 1. Finn callback-adressen i Supabase

Åpne testprosjektet og gå til Authentication → Sign In / Providers → Custom Providers → New Provider. Velg **Manual configuration** (OAuth2).

| Felt | Verdi |
| --- | --- |
| Provider Identifier | `abakus` i Studio-feltet; full SDK-identifikator blir `custom:abakus` |
| Display Name | `AbaID` |
| Issuer URL | `https://lego.abakus.no` hvis skjemaet krever en baseadresse |
| Authorization URL | `https://lego.abakus.no/authorization/oauth2/authorize/` |
| Token URL | `https://lego.abakus.no/authorization/oauth2/token/` |
| Userinfo URL | `https://lego.abakus.no/api/v1/users/oauth2_userdata/` |
| Scopes | `user` |
| Allow users without email | Av |

Kopier **Callback URL** fra Supabase-skjemaet før du lagrer. For et vanlig hostet prosjekt har den formen `https://<project-ref>.supabase.co/auth/v1/callback`, men kopier alltid den faktiske verdien fra prosjektet. Client ID og Client Secret fylles inn etter neste steg.

LEGO er her konfigurert som OAuth2, ikke OIDC auto-discovery. Ikke bruk `openid` eller en gjettet discovery-adresse. Studio-versjonen vi undersøkte foreslo automatisk `https://lego.abakus.no/.well-known/jwks.json` når JWKS-feltet var tomt. Den adressen ga 404, men OAuth2-flyten og brukerdata-kallet lyktes likevel. Det er ikke et verifisert JWKS-endepunkt og skal ikke brukes som grunnlag for ID-tokenverifisering. Ved endret Supabase-oppførsel må dette testes på nytt.

## 2. Opprett LEGO-applikasjonen

Logg inn på Abakus.no og åpne [Opprett applikasjon](https://abakus.no/users/me/settings/oauth2/new).

| Felt | Eksempel |
| --- | --- |
| Navn | `Abakusrevyen – test` |
| Beskrivelse | `Test av AbaID-innlogging, kontokobling og studentverifisering for Abakusrevyen.` |
| Redirect URL | Den eksakte Callback URL fra Supabase |

Beskrivelsen kan være **maks 100 tegn**. En lengre beskrivelse kan gi HTTP 400 med en generell feilmelding. Unngå mellomrom rundt redirect-adressen, og behold hele stien. Redirect URL her er Supabase sin callback, ikke nettsidens forside eller en lokal frontend-adresse.

Etter opprettelse kopierer du Client ID og Client Secret til de tilsvarende feltene i Supabase og lagrer provideren. Behandle begge som konfigurasjon som ikke skal publiseres, i tråd med beskjeden fra Abakus. Client Secret skal bare ligge i providerens serverkonfigurasjon; aldri i appkode, `VITE_*`, screenshots, issues eller PR-er. Vanlig innlogging trenger ikke at disse legges i frontendens `.env.local`.

Det var mulig å opprette testapplikasjonen selv. Kontakt William ved manglende rettigheter eller behov for avklaringer fra Webkom; ikke send meldinger automatisk på vegne av prosjektet.

## 3. Sett returadressen til frontend

Det finnes to forskjellige returadresser:

1. **LEGO → Supabase:** Callback URL fra steg 1, registrert hos LEGO.
2. **Supabase → frontend:** Lokal adresse eller testadresse der appen skal håndtere innloggingen. Konfigurer Site URL og tillatte Redirect URLs under Authentication → URL Configuration i testprosjektet.

Bruk den faktiske adressen Vite kjører på, inkludert port og eventuell callback-rute. Ikke endre produksjonsadresser for en lokal test. Testen brukte en midlertidig mottaker på `http://localhost:3000`; den mottakeren er stoppet og følger ikke med repoet. Uten en kjørende app på returadressen kan nettleseren vise tilkoblingsfeil selv om OAuth-delen er fullført.

Når appens Auth-flyt bygges, starter den innlogging med `signInWithOAuth({ provider: 'custom:abakus', ... })`. Callbacken må håndteres av Supabase-klienten med riktig flow og state/PKCE. Det finnes foreløpig ikke en ferdig innloggingsrute i appen.

## 4. Test innlogging og direkte brukerdata

- Start lokal testapp eller mottaker som håndterer den avtalte Auth-flyten, og logg inn med en egen testbruker.
- Kontroller at LEGO viser riktig applikasjon og bare `user`-tilgang. Godkjenn selv hvilke personopplysninger appen får lese.
- Hvis Supabase returnerer `provider_email_needs_verification`, bekreft e-posten som sendes til adressen fra LEGO. Ikke slå av e-postkontrollen for å omgå dette. Gjenta OAuth-innloggingen etter bekreftelsen ved behov.
- Kontroller at Supabase viser provider `custom:abakus` og bekreftet bruker.
- For direkte LEGO-data må en betrodd server motta **LEGO-access-tokenet** (`provider_token` i den testede innloggingsflyten) og gjøre `GET https://lego.abakus.no/api/v1/users/oauth2_userdata/` med `Authorization: Bearer <LEGO-access-token>`. Supabase-access-tokenet gir ikke tilgang til LEGO.
- Ikke bruk en tokenverdi sendt av klienten som bevis på at LEGO-brukeren tilhører en vilkårlig Supabase-konto. Produksjonsflyten må verifisere Supabase-sessionen og samsvar mellom LEGO-identiteten og brukerens tilknyttede identitet på serveren.
- Kontroller feltnavn og relevante statuser uten å dumpe hele responsen, tokens eller callback-URL-er til logger. Tokenet kan brukes midlertidig uten å lagres i databasen. Supabase fornyer ikke LEGO-tokenet automatisk; avklar om ny OAuth-innlogging er nok ved senere verifisering, før eventuell lagring av provider-refresh-token vurderes.

Den midlertidige testen hentet brukerdata på serveren, viste et begrenset resultat lokalt og lagret ingen tokens. Ikke del callback-URL-en: den kan inneholde både innloggings- og refresh-tokens. Fjern fragmentet fra adressefeltet etter at callbacken er behandlet, unngå tredjepartsressurser på mottakersiden og avslutt testsesjonen etter bruk.

## Hvilke data får vi?

Den direkte produksjonsresponsen brukte **camelCase**, selv om Python-koden bruker snake_case:

| Felt | Betydning |
| --- | --- |
| `id`, `sub` | LEGO-identitet; `sub` kom som tekst |
| `username`, `firstName`, `lastName`, `fullName` | Brukernavn og navn |
| `email`, `emailAddress` | Konto-e-post og kontaktadresse; de kan være forskjellige |
| `profilePicture`, `gender` | Profilbilde og kjønn; ikke lagre mer enn funksjonen trenger |
| `isActive` | Aktiv brukerkonto, ikke alene bevis på aktivt studium |
| `isStudent` | LEGOs lagrede studentverifisering |
| `isAbakusMember`, `isAbakomMember` | Medlemsstatuser; gir ikke automatisk roller i revyappen |
| `abakusGroups` | Grupper med blant annet ID, navn, type, parent og aktiv-status |
| `memberships` | Medlemskap med blant annet gruppetilknytning, rolle og `isActive` |

Supabase lagret bare et utvalg av opplysningene i brukermetadata under testen. Student- og medlemskapsfeltene var tilgjengelige i den direkte LEGO-responsen, men ikke i de lagrede metadataene. Ikke anta at `getUser()` alene gir alle LEGO-feltene, eller at brukerredigerbar metadata er et pålitelig verifiseringsgrunnlag.

## Studentfordeler og kontokobling

Alle kan opprette Abakus-konto. Provider-navnet alene er derfor ikke nok for studentpris. Dagens signup-trigger gjør likevel denne antakelsen og må erstattes gjennom en ny migrasjon (#144).

Kontroller aktiv konto, verifisert student og avtalt data-/cybertilhørighet på serveren. `isStudent` er en lagret status uten eget verifiseringstidspunkt i OAuth-responsen. Kildekoden viser verifisering via kullgruppe eller bestemte Feide-grupper og gjenbruk av allerede godkjent status. Vi må derfor avklare oppdateringsrutinen med Webkom før vi lover at statusen bekrefter nåværende studium. Et nytt API-kall gir nåværende LEGO-verdi, ikke nødvendigvis en ny kontroll mot Feide.

Responsen hadde ikke eget felt for studieprogram eller dato for siste studentverifisering. Ikke gjett programtilhørighet ut fra e-post eller et vilkårlig gruppenavn. Avtal godkjente gruppe-ID-er eller annen autoritativ kontroll, og lagre bare nødvendig resultat, tidspunkt og utløp i serverbeskyttede felt. Endret studentstatus skal ikke slette allerede kjøpt tilgang.

Vipps først → koble AbaID senere skal beholde samme Supabase-bruker, profil og kjøp. Dette krever manual identity linking i Supabase og en egen flyt fra innlogget konto (#137/#141). Den innstillingen var av ved testen. Provideropprettelse alene aktiverer ikke kontokobling, og to eksisterende kontoer skal ikke slås sammen automatisk.

## Feilsøking og kilder

- **400 ved appopprettelse:** Sjekk beskrivelsens lengde og full redirect-adresse. Les eventuelt valideringsfeilen i Network → Response uten å dele credentials eller cookies.
- **401 fra brukerendepunktet:** Kontroller at du bruker et gyldig LEGO-token, ikke et Supabase-token.
- **Andre brukerendepunkter avviser tokenet:** `user`-scope har en uttrykkelig tillatelsesliste med `/api/v1/users/oauth2_userdata/` og `/api/v1/search-autocomplete/`. `/api/v1/users/me/` er ikke på listen. Vi trenger ikke `all` for profil og medlemskap.
- **Nye felt eller endret oppførsel:** Undersøk faktisk respons og deployet versjon; offentlig `master` er ikke bevis på at alle endringer er i produksjon.

Kontrollert 29. oktober 2026:

- [LEGO: OAuth2-dokumentasjon](https://lego.abakus.no/docs/authentication.html#oauth2)
- [LEGO: appmodell og beskrivelsesgrense](https://github.com/webkom/lego/blob/master/lego/apps/oauth/models.py)
- [LEGO: OAuth-tilgangsregler](https://github.com/webkom/lego/blob/master/lego/apps/oauth/authentication.py)
- [LEGO: brukerrespons](https://github.com/webkom/lego/blob/master/lego/apps/users/serializers/users.py)
- [LEGO: studentverifisering](https://github.com/webkom/lego/blob/master/lego/apps/users/models.py)
- [Supabase: custom OAuth-providere](https://supabase.com/docs/guides/auth/custom-oauth-providers)
- [Supabase: identity linking](https://supabase.com/docs/guides/auth/auth-identity-linking)
- [Supabase: provider tokens](https://supabase.com/docs/guides/auth/social-sign-in#provider-tokens)
