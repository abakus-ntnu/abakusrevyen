# Kontrakter for kommende backend-flyter

Databasen gir avgrensede kontroller og atomisk checkout-klargjøring. Edge Functions, leverandørkall, UI og automatisk Cloudflare-opprydding bygges separat. Dette dokumentet beskriver hvordan de skal bruke skjemaet etter #144.

## Checkout og betaling (#121/#133)

1. Verifiser Supabase-sessionen på serveren. Velg bruker-ID fra den verifiserte identiteten, aldri fra en uverifisert body-parameter.
2. Vis gjeldende pris, avbestillingsfrist og vilkår fra revyen. Send versjonen kunden faktisk så og et uttrykkelig akseptvalg til serveren. Ikke oppgi `true` på kundens vegne.
3. Kall service-only `prepare_revue_checkout(_user_id, _revue_id, _terms_version, _accept_terms)`. Den returnerer én ordre med riktig prisgruppe, beløp, valuta, vilkårsversjon og frister. Manglende pris, skjult revy, stengt salg, gammel vilkårsversjon eller eksisterende rett/betaling gir avslag.
4. Bruk ordren som autoritativ kilde for beløp og valuta i leverandørkallet. Bruk `orders.id` som idempotensnøkkel hos Stripe. Samtidige/repetert klargjøringer gjenbruker den samme ventende ordren. Låsen omfatter databasearbeidet; den holdes ikke åpen mens et eksternt HTTP-kall kjører.
5. Lagre checkout-/payment-referansen på ordren. Den kan settes første gang, men ikke byttes til en annen betaling. Ved nettverksfeil: gjenbruk samme idempotensnøkkel og avstem leverandøren før du oppretter noe nytt.
6. Verifiser webhook-signatur, leverandørreferanse, valuta, beløp og at betalingen faktisk er gjennomført. Behandle `stripe_events.id` idempotent i samme transaksjon som statusendring og opprettelse av `revue_access`. Databasen gjør ikke dette leverandørkallet eller signatursjekken.

Pris/vilkår på en eksisterende ventende ordre kan ikke omskrives. Hvis gjeldende prisgruppe eller vilkår har endret seg, må den eksterne checkouten først bekreftes utløpt/kansellert og ordren avstemmes. En lokal timer alene er ikke nok til å markere en ekstern checkout utløpt.

Betalt kan ikke gå tilbake til `pending`, `failed` eller `expired`. Refundert kan ikke gjenåpnes. En sen faktisk betaling kan likevel oppdatere en tidligere `expired`/`failed` ordre til `paid`. Registrer alle faktiske belastninger, også dobbeltbetalinger. Flere betalte rader er ikke en grunn til å ignorere en webhook; avstem og refunder ekstra belastning uten å fjerne en annen gyldig rett.

Nye ordre har uforanderlige `price_type`, eventuell `eligibility_checked_at`, `terms_version`, `terms_accepted_at`, beløp/valuta og frister. `terms_accepted_at` er tidspunktet serveren mottok aksepten; Edge Function må fortsatt kontrollere at forespørselen representerer en faktisk kundehendelse. Gamle ordre får ikke oppdiktet historisk aksept eller prisgruppe.

## Refusjon (#133)

For frivillig avbestilling: registrer mottatt forespørsel ved å sette `orders.refund_requested_at`, som databasen tidfester. Kall `order_cancellation_allowed(order_id)` og bruk fristen for første forestilling i hele revyen, inklusive to timer før start. Behandling kan skje senere hvis forespørselen kom innen fristen. En betalt fredag etter torsdagspremiere får ikke ny frist.

Den ordinære appflyten tilbyr full refusjon. Bruk en stabil idempotensnøkkel hos leverandøren og opprett/oppdater `order_refunds` med faktisk referanse, beløp og status. Eksterne delrefusjoner må også kunne registreres. `reason = cancellation` avslutter den tilknyttede kjøpsretten ved vellykket refusjon; `compensation` brukes for prisavslag som ikke i seg selv opphever tilgangen. Dette er ikke en generell delrefusjonsknapp.

Vellykkede refusjoner kan verken endres eller slettes i vanlig flyt. Hver leverandørrefusjon har egen rad; samlet beløp kontrolleres under ordrelås. Flere refusjoner på samme avsluttede ordre bevarer første refusjonstidspunkt og hver faktisk transaksjon. Feilet eller ventende refusjon betyr ikke at pengene allerede er tilbakebetalt. Avlysning, tvist og andre krav må behandles etter en særskilt avtalt flyt.

## Studentstatus og interne rettigheter (#123/#137)

Innloggingsprovider beviser ikke at brukeren er student. Kontroller nåværende studentstatus og data/cyber-tilhørighet mot avtalte, autoritative LEGO-egenskaper. Gruppe-ID-er, kriterieversjon og gyldighetstid skal konfigureres etter avklaring, ikke utledes fra eksempler i tester. Lagre bare minimalt resultat i `student_verifications`; et teknisk oppslag som feiler skal ikke forlenge et gammelt resultat.

Intern tilgang krever faktisk medlemskap i en konfigurert gruppe for den aktuelle revyen. Verifiser det på serveren før `revue_access` opprettes. En intern rett har ingen utløpsdato og beholdes ved avsluttede studier, utmelding eller frakobling av AbaID. Den gir ingen rett til andre årganger. Kontoer skal ikke deles. Ingen provider-tokens, avspillingstokener eller komplette LEGO-responser trengs i datamodellen.

## Video, avspilling og kostnadsstopp (#130/#134/#135/#150)

`revue_videos` beskriver innholdet; `video_sources` inneholder YouTube-ID og teknisk kildestatus. Opprett YouTube-kilden som `processing`, verifiser ID/kilde på serveren og sett den `ready` før offentlig slipp. Redaktører kan slette YouTube-kilden og deretter metadata når ingen andre kilder eller hovedvalg peker dit. Cloudflare-kilder slettes bare gjennom serverflyten som også håndterer den eksterne filen.

Før VOD blir spillbar skal serveren kontrollere signert avspilling hos Cloudflare og sette/verifisere den faktiske sletteplanen for akkurat denne video-ID-en. Lagre bekreftet dato i `cloudflare_video_sources.scheduled_deletion_at`. Ønsket frist er `revue_sales.stream_delete_at` (H); bekreftet leverandørdato må være i fremtiden og ikke senere enn H. Ved ny ID eller gjenoppretting nullstilles begge bekreftelser. Ikke kopier et gammelt bevis til en ny video.

`can_play_source`/`can_play_stream` er service-only boolske kontroller. Verifiser bruker og velg ID på serveren før de kalles. Utsted deretter kortlivede signerte tokens uten å lagre dem i databasen. Allerede utstedte tokens kan virke til utløp. VOD krever bekreftet sletteplan; live krever kontrollert signert live-input og aktiv hosting. Staff-moderering gir ikke gratis betalt avspilling.

#150 skal implementere varselvindu fra én måned/to uker før fristen, ekstern sletteplan som sikkerhetsnett, tidsstyrt kontroll/opprydding og verifikasjon av at kostnader faktisk stopper. Avslag i `can_play_source` eller en timestamp i databasen sletter ikke filer eller avslutter et abonnement. Kontroller gjeldende Cloudflare-API-begrensninger før en faktisk sletteplan settes; hvis en gyldig plan ikke kan bekreftes innen H, skal VOD ikke åpnes ved å hoppe over kontrollen.

Ved YouTube-slipp kan hovedopptaket bli offentlig og andre opptak unlisted. Disse lenkene er delbare. Behold permanent kjøps-/intern rett selv etter at midlertidig Stream-hosting stopper. PC-/Drive-originalene inngår ikke i oppryddingen.

## Verifikasjon

Databasetestene dekker prisberegning, uttrykkelig aksept, samtidighetsmekanismens låser/unikhet ved sekvensielle forsøk, duplikate belastninger, statusoverganger, refusjoner, RLS, redaksjonell sletting og oppgradering med eksisterende data. PGlite serialiserer tilkoblinger; en faktisk test med flere Postgres-forbindelser og leverandør-/Auth-/Realtime-integrasjon må fortsatt kjøres når de flytene bygges.
