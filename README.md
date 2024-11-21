# <img src="./src/images/revy-logo.webp" width="30px" /> [Abakusrevyen.no](abakusrevyen.no)

Dette er koden til Abakusrevyen sin nettside. Utviklet med 🌯 av Teknikk.

## 🏗️ Utvikling

For å starte nettsiden lokalt i utviklingsmodus kan du kjøre følgende kommandoer

```sh
# Installer avhengigheter
$ pnpm install

# Start den lokale dev-serveren
$ pnpm run dev
```

### Filstruktur

```
 📂 ./
 ┣ 📂 src/
 ┃ ┣ 📂 components/          Komponenter
 ┃ ┃ ┣ 📂 islands/           Interaktive komponenter
 ┃ ┣ 📂 images/              Bilder
 ┃ ┣ 📂 layouts/             Underside-maler
 ┃ ┣ 📂 lib/                 Kode
 ┃ ┣ 📂 pages/               Undersider
 ┃ ┣ 📂 styles/              Delte CSS stil-filer
 ┃ ┣ 📜 page-1.md
 ┣ 📂 public/
 ┃ ┣ 📂 fonts/               Statiske font-filer
```

Filer i `📂 ./src` vil bli kompilert og optimisert. Filter i `📂 ./public` vil bli kopiert uendret til den kompilerte nettsiden.

Bilder og andre store filer som [Astro](astro.build) kan optimere bør være i `📂 ./src` slik at de blir det.

## 👔 Produksjon

For å bygge og vise nettsiden lokalt i produksjonsmodus kan du istedenfor kjøre følgende kommandoer

```sh
# Installer avhengigheter
$ pnpm install

# Bygg nettsiden og vis den lokalt
$ pnpm run build
$ pnpm run preview
```

## 🔋 STACK

- [Astro](astro.build) for statiske ressurser og HTML
- [Tailwindcss](tailwindcss.com) for CSS styling
- [Prettier](prettier.io) for formatering av kode
- [pnpm](pnpm.io) for avhengigheter
- [Typescript](typescriptlang.org) som programmeringspråk
