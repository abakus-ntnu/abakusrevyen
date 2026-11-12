# Skills for arbeid med nettsiden

Repoet deler to skills fra Supabase: `supabase` for backend og integrasjoner, og `supabase-postgres-best-practices` for SQL, datamodell, RLS og ytelse. De er instruksjoner og referanser som agenten leser ved behov. De installerer ingen appavhengigheter og gir ingen tilgang til Supabase eller andre tjenester.

## Codex og Claude Code

Codex leser repo-skills fra `.agents/skills`. Claude Code finner samme innhold gjennom én relativ kataloglenke per skill i `.claude/skills`. `CLAUDE.md` importerer `AGENTS.md`, slik at vi vedlikeholder felles regler ett sted.

Etter at du har hentet branchen, send en ny melding eller start en ny agentsesjon hvis skillsene ikke vises. Kontroller skill-listen i verktøyet ditt. I Claude Code kan du bruke `/supabase` eller `/supabase-postgres-best-practices`; i Codex kan du be om `$supabase` eller `$supabase-postgres-best-practices`. Agentene kan også velge dem ut fra oppgaven.

Git må bevare symbolske lenker for at Claude-oppsettet skal virke. På Windows krever dette vanligvis Developer Mode eller administratorrettigheter og `core.symlinks=true` før utsjekking. Hvis miljøet ikke støtter lenker, kan du be agenten lese riktig `SKILL.md` direkte under `.agents/skills` i stedet. Ikke vedlikehold en ekstra kopi av innholdet.

Vanlig ChatGPT eller Claude uten tilgang til repoet leser ikke disse filene automatisk. Det må eventuelt settes opp separat i det aktuelle produktet.

## Globale skills

William har også relevante globale skills som `frontend-design`, `humanizer`, `openai-docs`, `skill-installer`, `skill-creator` og `imagegen`. Bruksområdene står i [AGENTS.md](../AGENTS.md). De er valgfrie for andre bidragsytere, og repoet peker ikke til personlige filstier eller plugin-cache. Forsknings-, presentasjons- og andre skills uten relevans for nettsiden tas ikke inn her.

Supabase-pluginen kan allerede tilby de to delte skillsene globalt. Da kan samme navn vises flere ganger; bruk den repo-lokale utgaven for prosjektarbeidet. Pluginens connector gir verktøytilgang, mens en skill gir arbeidsveiledning. Å legge inn en skill kobler ikke til connectoren og endrer ingen skyinnstillinger.

## Kilde og oppdatering

Begge skills er hentet fra [supabase/agent-skills](https://github.com/supabase/agent-skills/tree/c9be0e931b7930f7d02126d04774d904c381e7d7/skills), commit `c9be0e931b7930f7d02126d04774d904c381e7d7`, hentet 12. november 2026. Innholdet er uendret bortsett fra ett fjernet mellomrom på slutten av en linje i `_contributing.md`. Hver katalog inneholder Supabases MIT-lisens. Repoets opprinnelige `LICENSE` er uendret. Engelske instruksjoner i disse katalogene er tredjepartsinnhold.

Oppdater gjennom en egen PR:

1. Velg en bestemt upstream-commit. Les endringene i både `SKILL.md` og referansene, inkludert eventuelle nye skript eller verktøytillatelser.
2. Erstatt de to skill-katalogene fra samme commit og behold lisensene og lenkene. Ikke kjør en ukontrollert installasjon av alle skills i kilderepoet.
3. Oppdater commit og dato i denne filen. Kontroller at lenkene virker og at instruksjonene passer med `AGENTS.md`, versjonene og arbeidsflyten vår.

Generell veiledning kan omtale SSR, Supabase Storage eller andre funksjoner vi ikke bruker. Det endrer ikke valgene våre om Vite, klientrendring, R2 og Cloudflare Stream. Lokale migrasjonseksempler er heller ikke en bestilling om å endre skyprosjektet.

Offisiell dokumentasjon: [Codex-skills](https://learn.chatgpt.com/docs/build-skills), [Claude Code-skills](https://code.claude.com/docs/en/skills) og [deling av agentinstruksjoner](https://code.claude.com/docs/en/memory#share-one-file-with-other-coding-tools).
