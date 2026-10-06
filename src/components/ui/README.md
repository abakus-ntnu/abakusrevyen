# UI-komponenter

Denne mappen inneholder UI-primitiver fra shadcn/ui. Filene blir generert inn i repoet og er vanlig kildekode som vi kan lese og tilpasse. `button.tsx` er den første genererte komponenten.

Legg til flere komponenter fra repo-roten:

```sh
pnpm exec shadcn add dialog
pnpm exec shadcn add input label textarea
```

Legg bare til komponenter vi faktisk trenger. Komponenter som hører til én bestemt del av nettsiden, skal ligge under den aktuelle mappen i `src/features`, ikke her.
