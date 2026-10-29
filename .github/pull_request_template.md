## Hva og hvorfor

<!-- Beskriv problemet og hva som blir annerledes. Ta gjerne med før/etter. -->

## Relaterte issues

<!-- Bruk «Refs #123». Bruk «Closes #123» bare når hele issuen er løst. -->

## Kontrollert

<!-- Skriv hva du faktisk har kjørt og resultatet. Forklar kort hvis noe ikke er kjørt eller ikke er relevant. -->

- Frossen installasjon (`pnpm install --frozen-lockfile`):
- Typekontroll, lint og bygg (`pnpm check`):
- Andre relevante tester, for eksempel `pnpm test:db`:
- Nettleser: endrede ruter, mobilvisning og tastatur (legg gjerne ved skjermbilder):
- `git diff --check`:

## Database og skyoppsett

<!-- Slett denne delen hvis den ikke er relevant. -->

- Migrasjoner, RLS/grants og genererte typer:
- Hva er klargjort lokalt, hva er faktisk satt opp i testmiljøet, og hva gjenstår:
- Nye miljøvariabler eller secrets (bare navn og formål, aldri verdier):

## Før review

- [ ] Målgrenen er riktig (vanligvis `v2`).
- [ ] Jeg har sett gjennom diffen for utilsiktede filer, lokale `.env`-filer, hemmeligheter og upublisert materiale.
- [ ] Relevant dokumentasjon er oppdatert, og eventuelle begrensninger eller gjenstående oppgaver er beskrevet.
