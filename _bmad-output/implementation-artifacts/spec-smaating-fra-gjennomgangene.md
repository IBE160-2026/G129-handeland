---
title: 'Småting fra gjennomgangene (deferred-work.md)'
type: 'chore'
created: '2026-11-16'
status: 'done'
baseline_commit: 'cf9248e3259944f55eb2c70fc049bf073fbb8c26'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/deferred-work.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/DESIGN.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Gjennomgangene av bolkene siden 12.11 har lagt ti mindre funn i `deferred-work.md`. Det er manglende tester, en feilside (500), en gjenglemt informasjonskapsel og små knapper. Hvert av dem er lite, men sammen gjør de appen mindre robust før kodefrysen 27.11.

**Godkjent:** Arve 16.11: «jupp, kjør dem nå» (punkt 4, utsatte småting).

**Approach:** Rett de ti punktene under i én bolk. Ingen nye funksjoner og ingen migrering. Når et punkt er løst, markeres oppføringen i `deferred-work.md` som løst, med commit og en kort linje. Den gamle teksten blir stående.

## Boundaries & Constraints

**Always:**
- AGENTS.md: `await tilgang()` før en try, AD-8 og ASCII-transliterering i navn.
- Knapper og lenker med egen funksjon er minst 44 × 44 px (DESIGN.md).
- Fareknapper bruker `--lb-fare` og `--lb-fareflate` via tokenene (DESIGN.md danger).

**Never:**
- Ingen endring av prompter, modeller, datamodell eller migreringer.
- Ingen endring i oppførselen, bortsett fra punktene (5) og (6).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Øktoppslaget feiler | `/logg-inn` eller `/registrer`, auth-feil | Siden vises som for en utlogget | Feilen logges |
| Utlogging på delt PC | `tema=moerk`, logg ut | Informasjonskapselen er slettet, og landingssiden følger enheten | N/A |
| iPhone-hjemskjerm | `apple-touch-icon` | B-merket som PNG | N/A |

</frozen-after-approval>

## Code Map og oppgaver

Hvert punkt peker på oppføringen i `deferred-work.md`, som har mer bakgrunn.

- [ ] **(1) Test av `lagreAktivering`** (innlimt tekst: vellykket låsing, feilet låsing, feilet generering). Den ligger i `app/handlinger.ts`. Bruk mønsteret i `app/handlinger.test.ts` (PGlite, `vi.mock` av next og falsk klient).
- [ ] **(2) Tilgjengelighetssjekken når gjennomsynet** via PDF eller bilde. I `maaling/sjekk-tilgjengelighet.mjs`: lag en tekst med `vei` PDF i tilstand `aktivert` direkte i databasen, og kjør axe på `/tekst/[id]/gjennomsyn` i lys og mørk modus.
- [ ] **(3) Reserve for favicon:** `app/apple-icon.tsx` og `app/icon.png` (eller `icon.tsx` med `ImageResponse` fra `next/og`), med B-merket i primærfargen på hvit bakgrunn. Les `node_modules/next/dist/docs` om metadata-ikoner først.
- [ ] **(4) Knappesystemet** i `app/komponenter/knapper.ts`: legg til `KNAPP_FARE` (fyll `--lb-fare`, tekst i bakgrunnsfargen) og `KNAPP_LENKE` (understrek, minst 44 px høy trykkflate). Ta dem i bruk i «Slett for godt» (SlettTekstKnapp og SlettKonto), Kopier, «Lagre» i Morsmaal og `LITEN` i Overskriftskontroll, slik at alle er minst 44 px. Rester av `red-*` erstattes av tokenene.
- [ ] **(5) `/logg-inn` og `/registrer`:** `innloggetEpost()` i `data/konto.ts` får samme vakt som `valgfriTilgang` (`headers()` utenfor try, `unstable_rethrow` og `console.error`), og gir `null` ved feil. Legg til en test i `data/konto.test.ts`.
- [ ] **(6) Temaet etter utlogging:** ved «Logg ut» (`LoggUtKnapp` i `KontoSkjemaer.tsx`) slettes informasjonskapselen `tema` med en serverhandling (`slettTemaHandling`) før eller etter `authKlient.signOut()`. Gjør det samme ved sletting av kontoen.
- [ ] **(7) Test av Hentefeil:** trekk ut en liten ren hjelper, eller test siden med `vi.mock` som i `handlinger.test.ts`. Når `hentArbeidsbord` kaster, viser `/` Hentefeil, og `tilgang()` står fortsatt utenfor try (utlogget gir omdirigering, ikke Hentefeil).
- [ ] **(8) Rotasjon over 760 px:** i sjekkskriptet åpnes landingssiden på 375 px, endres til 1280 px og tilbake. Effekt A markerer `span.ls-fagord` (ingen knapper igjen), og trykkdemoen kommer tilbake. Det samme for arbeidsbordet med arket åpent: det går over til viften og tilbake uten feil og uten `inert`-rester. Rett det skriptet finner.
- [ ] **(9) Regelene på samtalesiden:** trekk `vurderingFeilet`, `oppfolgingFeilet` og vilkåret for `RevurderKnapp` ut i en ren funksjon (for eksempel `samtalevisning(runder)` i `data/fagsamtale.ts` eller en egen fil), med enhetstester. Siden bruker funksjonen.
- [ ] **(10) Grensetestene:** `limInnPdf` og `limInnBilde` returnerer `GRENSE_FEIL.tekster` ved sjette tekst (`app/handlinger.test.ts`).
- [ ] `deferred-work.md` -- marker hvert løst punkt.

**Acceptance Criteria:**
- Given at alle punktene er rettet, then gir `npm test`, tilgjengelighetssjekken, demotesten og README-testen grønt, og `deferred-work.md` har ingen åpne punkter igjen fra listen over.

## Verification

**Commands:**
- `npx tsc --noEmit`, `npm test`, `npm run lint` og `npm run build` -- forventet: grønt
- `npm run sjekk:tilgjengelighet` -- forventet: bestått, med de nye sjekkene

## Review Triage Log

| # | Kilde | Funn | Vurdering | Rute |
|---|---|---|---|---|
| 1 | blind, edge, vgap | /konto viser tom e-post når oppslaget gir null | medium | patch |
| 2 | blind | Innlimt tekst i aktivert sendes til gjennomsynet etter låsefeil | medium, må verifiseres | patch |
| 3 | blind | Kapsler-Map deles mellom testene og har feil form | low, direkte retting | patch |
| 4 | blind, edge | Rekkefølgen ved utlogging og sletting: signOut-error, finally, setVenter, timeout | medium | patch |
| 5 | edge | slettTemaHandling tømmer hurtigbufferen også uten kapsel | low, direkte retting | patch |
| 6 | vgap | Sletting av temaet er ikke verifisert i flyten | patch | patch |
| 7 | vgap | Testen av slettTemaHandling kan ikke fange en tilgang-vakt | patch | patch |
| 8 | blind | ikonmerke kopierer icon.svg for hånd og bruker Buffer | low | patch |
| 9 | blind | PNG-ikonet har ingen mørk variant; ikonkoden er duplisert | low | avvist |
| 10 | blind | samtalevisning kobles på posisjon; begge flaggene sanne er ikke testet | low | patch |
| 11 | blind | Grønne farger i Quiz og slate i Overskriftskontroll | low: utenfor punkt 4 (rødt), og det finnes ingen token for riktig | avvist |
| 12 | blind | hentefeil-testen for Samlingen sjekker ikke logging | low, direkte retting | patch |
| 13 | blind | Grensetesten viser ikke at det ikke ble kalt eller registrert noe | low | patch |
| 14 | blind, edge | Sjekkskriptet: faste ventetider, ingen finally, null-vakt mangler, opprydding svelges | medium | patch |
