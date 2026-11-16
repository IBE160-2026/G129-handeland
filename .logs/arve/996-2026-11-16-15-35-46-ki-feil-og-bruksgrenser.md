# KI-feil og bruksgrenser

## 2026-11-16 kl. 15:35 — Arve

### Oppgave
Bygge to krav som stod i PRD-en, men ikke i koden: KI-feil (§5, FR-7, FR-13, FR-19, FR-20) og bruksgrenser (§6.4). Arve valgte «1, 2 nå, 4 underveis» og sa ja til Neon-migreringen.

### Plan
- Grenen `grenser`, to bolker med bmad-build, tre gjennomganger hver, retting og verifisering.
- Spesifikasjoner:
  - `_bmad-output/implementation-artifacts/spec-ki-feil-nytt-forsoek.md`
  - `_bmad-output/implementation-artifacts/spec-bruksgrenser.md`

### Resultat
- **KI-feil** (4366630):
  - `kjoerGenerator` prøver én gang til ved ugyldig utdata, tidsavbrudd og modellfeil. Ved 400, 401, 429 og i testmodus prøver den ikke på nytt.
  - Fagsamtalen lagrer svaret før vurderingen. En vurdering som feilet, teller ikke som runde (FR-19), og en oppfølging som feilet, beholder vurderingen (FR-20).
  - Meldinger per funksjon. Feil som ikke løses med «Prøv igjen», når eleven med riktig råd.
- **Bruksgrenser** (59239a8):
  - Ny tabell `forbruk` (migrering 0007). Den har én rad per API-kall med tokens, kostnad og konto, og hendelsesrader for nye tekster og fagsamtaler, så grensene også teller tekster som er slettet.
  - Taket på 30 kr sjekkes før hvert API-kall via en vakt fra datalaget.
  - SDK-ens egne forsøk er slått av, så `kjoerGenerator` eier alle forsøk og teller dem.
  - Meldingene fra EXPERIENCE.md. Bildeinnlesingen beholder teksten som alt er lest, når grensen slår inn midt i en serie.
- **Verifisert:** `npm test` 598 av 598, tilgjengelighetssjekken 222 av 222, demotesten 1 av 1 og README-testen 8 av 8. tsc, lint og bygget er grønne.
- **Gjennomgangene:** 62 funn, der 50 er rettet, 7 avvist og 5 utsatt. Detaljene står i spesifikasjonenes triagelogger og i deferred-work.md.

### Åpne punkter
- **Utrulling** (krever ja): `npm run db:migrer:https -- --kjoer` (0007 mot Neon), deretter merge til `main` og `vercel --prod`.
- **Punkt 4 (utsatte småting)** er ikke tatt ennå: favicon-reserve, små knapper, test av Hentefeil, `/logg-inn`, temaet etter utlogging, og nytt fra disse bolkene.
- **Mobilbolkene** er ikke testet på en ekte telefon.
