# <img src="./src/images/revy-logo.webp" width="30px" /> [Abakusrevyen.no](https://abakusrevyen.no/)

⚠️ **Har du et problem, eller vil du delta med utviklingen til nettsiden? Se [CONTRIBUTING.md](CONTRIBUTING.md) først!** ⚠️

Dette er koden til Abakusrevyen sin nettside. Utviklet med 🌯 av Teknikk.

## 📋 Oppdater innhold

Må du oppdatere nettsidens innhold? Her er en sjekkliste!

### Ny revy!

- [ ] `src/lib/constants.ts`
  - [ ] Oppdater periodedatoene. Set datoen som første øyeblikk av den nye perioden.
  - [ ] Oppdater datoene for forestillingene (`SHOWS`).
- [ ] `src/images`
  - [ ] Oppdater revylogoen
  - [ ] Oppdater logoen til undergruppene i revyen

### Slipp av revyen

- [ ] `src/images/revy_logoer`
  - [ ] Legg til logoen til den nye revyen
- [ ] `src/components/branding/ShowLogo.astro`
  - [ ] Oppdater logoen på nettsiden

### Revyslutt

- [ ] `src/lib/constants.ts`
  - [ ] Oppdater `PREVIOUS_REVUES` med revyen. Husk rekkefølgen!
- [ ] `src/images/gruppebilder`
  - [ ] Legg til årets gruppebilde
- [ ] `src/layouts/Home/Break.astro`
  - [ ] Oppdater gruppebilde

## 🏗️ Utvikling

For å starte nettsiden lokalt i utviklingsmodus kan du kjøre følgende kommandoer

```sh
# Aktiver utviklerverktøy (kun for nix brukere)
$ nix-shell shell.nix

# Installer avhengigheter
$ pnpm install

# Start den lokale dev-serveren
$ pnpm run dev
```

## 👔 Produksjon

For å bygge og vise nettsiden lokalt i produksjonsmodus kan du istedenfor kjøre følgende kommandoer

```sh
# Aktiver utviklerverktøy (kun for nix brukere)
$ nix-shell shell.nix

# Installer avhengigheter
$ pnpm install

# Bygg nettsiden og vis den lokalt
$ pnpm run build
$ pnpm run preview
```

Hvis alt funker, kan du oppdatere den offentlige nettsiden med

```sh
$ ops! har ikke kommet så langt
```

## 🔋 STACK

- [Astro](astro.build) for statiske ressurser og HTML
- [Tailwindcss](tailwindcss.com) for CSS styling
- [Prettier](prettier.io) for formatering av kode
- [pnpm](pnpm.io) for avhengigheter
- [Typescript](typescriptlang.org) som programmeringspråk
- [nix](https://nixos.org/) for utviklerverktøy
