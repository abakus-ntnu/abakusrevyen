# Bilder og filer i Cloudflare R2

Vi bruker Cloudflare R2 til offentlige bilder og andre filer som ikke er video. Video skal fortsatt ligge i Cloudflare Stream. Oppsettet under er kontrollert mot Cloudflares dokumentasjon 16. oktober 2026.

## Bucket-navn og miljøer

Opprett to separate buckets i samme Cloudflare-konto som domenet:

| Miljø | Bucket-navn | Innhold nå |
| --- | --- | --- |
| Test og lokal utvikling | `abakusrevyen-v2-media-test` | Allerede offentlig materiale som teamet kan teste med |
| Produksjon | `abakusrevyen-v2-media-prod` | La den stå tom til lanseringsflyten og innholdet er godkjent |

Navnene følger Cloudflares krav om 3–63 tegn med små bokstaver, tall og bindestrek. En bucket er privat frem til offentlig tilgang aktiveres. [Cloudflare: opprett en bucket](https://developers.cloudflare.com/r2/buckets/create-buckets/)

## Innholdet i testbucketen

Testbucketen inneholder de 108 allerede publiserte bildene med samme relative stier som de hadde i den gamle kildekoden. «Mapper» i R2 er egentlig bare prefikser i objektnavnet.

```text
images/
  gallery/...
  gruppebilder/...
  ledere/...
  revy_logoer/...
  undergrupper_logoer/...
  revy-logo.webp
```

De norske mappenavnene er beholdt for å gjøre koblingen til legacy-innholdet tydelig. For nye områder bruker vi små bokstaver, bindestrek og stabile, beskrivende navn. Unngå personnavn hvis filen ikke trenger det. Ikke last opp hemmelig revytema, upubliserte temabilder, råfiler med unødvendige metadata eller filer vi mangler samtykke til. R2 har ingen ekte mappestruktur; prefiksene gjør det bare lettere å finne objektene. [Cloudflare: objekter og prefikser](https://developers.cloudflare.com/r2/objects/)

Dashboardet er greit for den første, lille opplastingen. Sett riktig `Content-Type`, og bruk gjerne `Cache-Control: public, max-age=31536000, immutable` på filer som får nytt filnavn når innholdet endres. Ikke bruk lang immutable-cache dersom samme URL skal overskrives. [Cloudflare: last opp objekter](https://developers.cloudflare.com/r2/objects/upload-objects/)

## Offentlig URL

Testbucketens **Public Development URL** er aktivert og offentlig. Appen har denne adressen som reserve, og den står også i `.env.example`:

```dotenv
VITE_MEDIA_BASE_URL=https://pub-562633bc548840b783ccab28f75a6915.r2.dev
```

Ikke commit `.env.local`. Selve utviklings-URL-en er offentlig og ingen hemmelighet. `VITE_MEDIA_BASE_URL` kan brukes lokalt for å prøve en annen bucket og skal senere settes separat i Cloudflare Pages for preview og produksjon.

`r2.dev` er ratebegrenset og laget for utvikling. Før produksjon kobler vi et eget underdomene, for eksempel `media.abakusrevyen.no`, til produksjons-bucketen og bruker `https://media.abakusrevyen.no` som base-URL. Et custom domain gir Cloudflare-cache og sikkerhetsregler; det krever at domenesonen finnes i samme Cloudflare-konto som bucketen. Ikke endre DNS ennå. [Cloudflare: offentlige buckets](https://developers.cloudflare.com/r2/buckets/public-buckets/) og [cache for R2](https://developers.cloudflare.com/cache/interaction-cloudflare-products/r2/)

Vanlig visning med `<img>` trenger ikke CORS. Vi legger først til en begrenset CORS-policy dersom nettleseren senere skal lese filene via `fetch`, canvas eller direkte opplasting. Direkte opplasting skal i så fall bruke kortlivede, signerte URL-er fra serverkode; R2 API-token og S3-nøkler skal aldri ha `VITE_`-prefiks eller ligge i frontend.

## Det appen bruker

`src/features/media/media-url.ts` bygger en offentlig URL fra `VITE_MEDIA_BASE_URL` og en objektnøkkel. Når variabelen mangler eller fortsatt inneholder en plassholder, bruker den testbucketens offentlige adresse. Komponentene og datafilene oppgir bare objektnøkler; de limer ikke inn hele R2-adressen hver for seg.

De 108 opplastede objektene ble lastet ned fra den offentlige adressen og sammenlignet med de lokale originalene med SHA-256. Alle var identiske før `src/images/` ble fjernet. For nye bilder skal vi:

1. laste opp og åpne objekt-URL-en i en privat nettleserøkt;
2. kontrollere filtype, størrelse, alternativ tekst og publiseringsrettighet;
3. bruke en objekt-nøkkel i datafilen, ikke lime en tilfeldig full URL inn i en komponent;
4. kjøre siden lokalt med standardadressen og ved behov med en overstyrt `VITE_MEDIA_BASE_URL`;
5. avtale hvem som kan slette eller overskrive produksjonsobjekter.
