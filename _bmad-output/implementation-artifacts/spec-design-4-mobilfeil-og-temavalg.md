---
title: 'Designfase bolk 4: to mobilfeil og valg av lys eller mørk modus'
type: 'feature'
created: '2026-11-15'
status: 'done'
baseline_commit: 'c1ff3ba4535bae5ba1607f93052bdfebc959158b'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/DESIGN.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/EXPERIENCE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Produksjonen har to feil på telefon (375 px). På landingssiden står et stort tomt felt under fagorddemoen. På arbeidsbordet brytes titlene i de små bunkene midt i ordet («Novelleanalys-e»). Arve vil i tillegg kunne velge lys eller mørk modus selv, i kontoinnstillingene. Det skal ikke være en bryter som alltid står i topplinjen.

**Godkjent:** Arve 15.11: «Jatakk» (rett feilene), og «det går an å skru av og på mørk eller lys modus som bruker, inne fra kontoinnstillinger». Valget lagres i en informasjonskapsel per enhet, uten migrering. Det er notert som en avveining.

**Approach:** Finn og rett årsaken til det tomme feltet, som sannsynligvis er sporet eller høyden til effekt A på smal skjerm. Gjør at titlene på bunkene bare brytes mellom ord, og bare deler et ord når det ikke får plass alene. Legg til «Utseende» på kontosiden med tre valg: «Følg enheten» (standard), «Lys» og «Mørk». Valget settes som `data-tema` på `<html>` fra serveren, så siden ikke blinker i feil modus.

## Boundaries & Constraints

**Always:**
- Med «Følg enheten» er alt som i dag (`prefers-color-scheme`). Med «Lys» eller «Mørk» overstyrer valget systemet, både for CSS-variablene og for Tailwinds `dark:`-variant.
- Valget leses på serveren i rotlayouten (`cookies()`), så første tegning har riktig modus. Det skal ikke være noe flimmer.
- Valget er et vanlig skjema med radioknapper og «Lagre», og virker uten JavaScript (server action som setter informasjonskapselen). Det er tilgjengelig med tastatur og skjermleser (`fieldset` og `legend`).
- Informasjonskapselen: `SameSite=Lax`, ett år, og bare verdiene `lys`, `moerk` eller ingen.
- `color-scheme` på `<html>` følger valget, så skjemafelt og rullefelt også bytter.

**Never:**
- Ingen migrering og ingen ny tabell.
- Ingen bryter i topplinjen eller på landingssiden.
- Ingen andre endringer i landingssiden enn rettingen av det tomme feltet. Trykkdemoen (E) kommer i bolk 6.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Standard | Ingen informasjonskapsel | Følger systemet | N/A |
| Mørk valgt, system lys | `tema=moerk` | Hele appen mørk fra første tegning | N/A |
| Lys valgt, system mørk | `tema=lys` | Hele appen lys, også elementer med `dark:`-klasser | N/A |
| Ugyldig verdi | `tema=rosa` | Behandles som ingen | Ignoreres |
| Landingssiden 375 px | Utlogget, bevegelse tillatt | Ingen tomrom større enn vanlig seksjonsluft mellom demoen og neste seksjon | N/A |
| Lang bunketittel | «Novelleanalyse» i to kolonner ved 375 px | Ordet står helt, eller hele tittelen går over på neste linje uten bindestrek midt i ordet | N/A |

</frozen-after-approval>

## Code Map

- `app/globals.css` -- tokenene under `@media (prefers-color-scheme: dark)`. Må også gjelde `:root[data-tema="moerk"]`, og ikke gjelde `:root[data-tema="lys"]`. Tailwind v4 har `dark:` som mediavariant, og den må redefineres med `@custom-variant dark` slik at den følger `data-tema` når det er satt, og systemet ellers.
- `app/layout.tsx` -- `<html lang="nb">`. Les informasjonskapselen og sett `data-tema`.
- `app/konto/page.tsx` -- legg en ny seksjon «Utseende» under morsmålet.
- `app/handlinger.ts` -- ny server action som setter eller sletter informasjonskapselen og revaliderer layouten.
- `app/komponenter/LandingEffekter.tsx` og `.ls-demo*` i `globals.css` -- effekt A på smal skjerm. Finn hva som gir høyden, med playwright på 375 × 800, både innlogget og utlogget, og med og uten redusert bevegelse.
- `.bunke-tittel` i `globals.css` -- dagens brytning (`overflow-wrap` eller `hyphens`?). Bruk `overflow-wrap: break-word` (ikke `anywhere`) og `hyphens: manual`.
- `maaling/sjekk-tilgjengelighet.mjs` -- legg til kontroller for temavalget og de to feilene.

## Tasks & Acceptance

**Execution:**
- [x] `app/globals.css` -- tema-overstyringen og `@custom-variant dark`, og rettingen av bunketitlene og det tomme feltet.
- [x] `app/layout.tsx` -- `data-tema` og `color-scheme` fra informasjonskapselen.
- [x] `data/tema.ts` (ny, ren) -- `tolkTema(verdi): "lys" | "moerk" | null`, med test.
- [x] `app/handlinger.ts` og `app/konto/page.tsx` -- valget «Utseende» med tre radioknapper og «Lagre».
- [x] `EXPERIENCE.md` (State Patterns, Gjelder overalt, raden «Mørk modus») -- erstatt «Det finnes ingen egen bryter i v1» med regelen over, og legg «Utseende» til i Konto-raden i IA.
- [x] `maaling/sjekk-tilgjengelighet.mjs` -- tre sjekker:
  - axe med `tema=moerk` og systemet i lys modus, og omvendt
  - ingen tomrom over 160 px mellom demoen og neste seksjon ved 375 px
  - ingen tittel i en liten bunke brytes midt i ordet. Sammenlign linjene med ordene, eller sjekk at «Novelleanalyse» står på én linje.

**Acceptance Criteria:**
- Given at eleven velger «Mørk» og trykker «Lagre», when hun laster en hvilken som helst side, then er den mørk fra første tegning, også når systemet er lyst.
- Given «Følg enheten», then er oppførselen den samme som før bolk 4.

## Verification

**Commands:**
- `npx tsc --noEmit` og `npm test` -- forventet: grønt
- `npm run lint` og `npm run build` -- forventet: grønt
- `npm run sjekk:tilgjengelighet` -- forventet: bestått

**Manual checks:**
- Skjermbilder på 375 px av landingssiden (hele siden) og av arbeidsbordet, og av kontosiden med hvert av de tre valgene.

## Review Triage Log

| # | Kilde | Funn | Vurdering | Rute |
|---|---|---|---|---|
| 1 | blind | Tema-kapselen blir igjen etter utlogging på delt PC | low: bare utseende, ingen data. Å slette den ved utlogging krever en serverhandling i utloggingsflyten | defer |
| 2 | blind, edge | «Lagret» leses ikke opp; ?lagret blir stående og gir en gammel melding | medium | patch |
| 3 | blind | Bunketitler deles midt i ordet ved 320 px og 200 % (uten bindestrek) | low: spec-en tillater det, men det mangler en sjekk | patch (sjekk) |
| 4 | blind | cookies() i layout gjør alle ruter dynamiske | low: de var allerede dynamiske, unntatt icon.svg | avvist |
| 5 | blind | EXPERIENCE.md-endringen er ikke i diffen | false: endringen ligger i arbeidstreet, og diffen dekket bare app, data og maaling | avvist |
| 6 | blind | color-scheme styres tre steder | low, direkte retting | patch |
| 7 | blind | Serverhandlingen er ikke testet for kanttilfeller | low: tolkTema er testet, og e2e dekker verdi og attributter | avvist |
| 8 | blind | Sjekken for effekt A har 4 fagord hardkodet | low, direkte retting | patch |
| 9 | blind | Rullevinduet for effekt A uten spor er kort på telefon | low: erstattes av trykkdemoen i bolk 6 | avvist |
| 10 | blind | Tallet for tomrommet er oppgitt ulikt | low, direkte retting | patch |
| 11 | vgap | Kontosiden: avkrysset valg og «Lagret: Mørk.» er ikke sjekket | patch | patch |
| 12 | edge | maalA kollapser sporet på brede skjermer, og siden kan hoppe | medium | patch |
| 13 | edge | Sjekken for delte ord slår ut ved ekte bindestrek | low, direkte retting | patch |
