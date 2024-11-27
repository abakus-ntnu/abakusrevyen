# 💯 Delta og hjelp

## 💬 Delta som bruker

- **Jeg har funnet en feil:** Lag en feilrapport [her](https://github.com/abakus-ntnu/abakusrevyen/issues/new), så fikser vi det så fort som mulig! Husk å markere rapporten som en `🪲 bug`!
- **Jeg har en idée til nettsiden:** Lag et funksjonsønske [her](https://github.com/abakus-ntnu/abakusrevyen/issues/new)! Husk å markere rapporten som `✨ enhancement`!
- **Jeg har et spørsmål:** [Kontakt oss](https://abakus.no/pages/grupper/104-revyen)! Vi vil gjerne hjelpe. For å sende meldingen din til revyen må du velge `RevyStyret` som mottaker!

## 👩‍💻 Delta som utvikler

Nettsiden utvikles av Abakusrevyens [Teknikkgruppe](https://abakus.no/pages/grupper/104-revyen). Vi er ansvarlige for alt det tekniske ved revyen, som lys, lyd og video under selve revyen, og som denne nettsiden utenom revyen. Ser arbeidet vårt interessant ut? [Søk på Teknikk](https://abakusrevyen.no/opptak) ved neste revyopptak!

### Språk

Kun det _offentlige innholdet_ skrives på 🇳🇴 norsk. Resten av koden, kommentarene og annet skrives på 🇬🇧 engelsk, ettersom at programmeringsspråkene, bibliotekene, rammeverkene og det meste annet også er skrevet på engelsk.

### Konvensjoner

Generelle stilregler ikke dekket av prettier. Mye av dette er bare råd, og må ikke alltid følges. Det viktigste er at koden er så lesbar som mulig og har en konsistent utforming.

#### Filstruktur

```
 📂 ./
 ┣ 📂 src/
 ┃ ┣ 📂 components/          Komponenter
 ┃ ┃ ┣ 📂 islands/           Interaktive komponenter
 ┃ ┣ 📂 content/             Statisk innhold
 ┃ ┣ 📂 images/              Bilder
 ┃ ┣ 📂 layouts/             Underside-maler
 ┃ ┣ 📂 lib/                 Kode
 ┃ ┣ 📂 pages/               Undersider
 ┃ ┣ 📂 styles/              Delte CSS stil-filer
 ┣ 📂 public/
 ┃ ┣ 📂 fonts/               Statiske font-filer
```

Filer i `📂 ./src` vil bli kompilert og optimisert. Filter i `📂 ./public` vil bli kopiert uendret til den kompilerte nettsiden.

Bilder og andre store filer som [Astro](astro.build) kan optimere bør være i `📂 ./src` slik at de blir det.

#### Komponenter

Komponenter bør plasseres i `📂 ./src/components/` mappen. Alle komponenter bør grupperes i `📂 Mapper` gitt et passende gruppenavn. Dette er for å passe overens med konvensjonen i [Webkoms](https://abakus.no/pages/komiteer/98) [lego-webapp](https://github.com/webkom/lego-webapp/).

#### Øyer

[Astro](astro.build) bruker øyer (islands) for å lage interaktive komponenter. Disse kan skrives i en stor variasjon av rammeverk, men for enkelhets skyld bruker vi kun ett. Alle komponent øyer skal skrives i `⚛️ React`, og skal følge konvensjonene til vanlige komponenter.

#### Navning

- **📂 Mapper:** `snake_case` navn.
- **📂🧩 Komponent Mapper:** `PascalCase` navn.
- **🚀 Astro filer** og **🧩 Komponenter**: `PascalCase` navn.
- **📊 Variabler** og **🧮 Funksjoner:** `camelCase` navn.

Navn burde være korte og konsise. Unngå uvanlige forkortelser og indiskripte navn.
