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

## 2026-11-16 kl. 15:39 — Arve

### Oppgave
Rulle ut KI-feil og bruksgrenser («Rull ut!»).

### Plan
- Migrering 0007 mot Neon, deretter spole `main` fram til `grenser` og kjøre `vercel --prod`.

### Resultat
- Neon: 0007_forbruk er kjørt, så databasen har 8 av 8 migreringer.
- `main` er 80449ae, rullet ut på https://lesevenn.vercel.app.
- `/` gir 200, `/api/helse` svarer ok med 22 tabeller, og `/ny` gir 307 (omdirigerer til innlogging).

### Åpne punkter
- Punkt 4: de utsatte småtingene (se `deferred-work.md`).
- Test på ekte telefon.

## 2026-11-16 kl. 22:38 — Arve

### Oppgave
Punkt 4: rette de utsatte småtingene fra gjennomgangene («jupp, kjør dem nå»).

### Plan
- Grenen `smaating` med én spesifikasjon, `spec-smaating-fra-gjennomgangene.md`. Ti punkter fra `deferred-work.md`, tre gjennomganger og retting.

### Resultat
- **Commits:** cee7f82, ee4d7cb og b0fa5b2.
- **Tester:**
  - `lagreAktivering`, Hentefeil og grensene for PDF og bilde.
  - Rotasjon over 760 px og axe på gjennomsynet via PDF eller bilde.
  - Reglene på samtalesiden er trukket ut i `data/samtalevisning.ts`.
- **Rettinger:**
  - Ikon som reserve: PNG og apple-icon.
  - Knappene fare og lenke, alle minst 44 px, og røde farger byttet til tokenene.
  - `/logg-inn` og `/registrer` gir ikke lenger 500 når øktoppslaget feiler, og kontosiden kaster i stedet for å vise en tom adresse.
  - Temaet slettes ved utlogging og ved sletting av kontoen.
  - Innlimt tekst som ikke ble låst, prøver å låse på nytt i aktiveringen i stedet for å gå til gjennomsynet.
- **Verifisert:** `npm test` 628 av 628, tilgjengelighetssjekken 245 av 245, demotesten 3 av 3 og README-testen grønn. Lint og bygget er grønne.

### Åpne punkter
- Rull ut grenen `smaating` (krever ja).
- Utsatt: en vurdering som pågår, vises som «feilet» ved ny innlasting. Det krever et tidsstempel og dermed en migrering.

## 2026-11-16 kl. 22:51 — Arve

### Oppgave
Rulle ut småtingene («ja»).

### Plan
- Spole `main` fram til `smaating` og kjøre `vercel --prod`. Ingen migrering.

### Resultat
- `main` er 54bd5d0, rullet ut på https://lesevenn.vercel.app. `/` og `/logg-inn` gir 200, og `/api/helse` svarer ok.
- Ikonene: `/icon1?…` og `/apple-icon?…` gir 200 med `image/png`, i lenkene siden peker på. Uten suffiks gir `/apple-icon` 404, og det er ventet.

### Åpne punkter
- Test på ekte telefon.
- Vurdering som pågår, vises som «feilet» ved ny innlasting. Det krever migrering.
- Telefontestpunktene (punkt 3 fra 16.11) er ikke bygget.
