---
title: 'Design runde 2, bolk 9: øvekortknappene for én hånd og valget «Venstrehendt»'
type: 'feature'
created: '2026-11-18'
status: 'in-review'
baseline_commit: '94ba7bd3afe08faa03d2e72845975a96446ba971'
route: 'dispatch'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** På øvekortene står «← Forrige», «Må øve mer», «Kan» og «Neste →» i én rad under kortet. Det er lite intuitivt og vanskelig å treffe med én hånd. Utvikleren ønsker også et valg for venstrehendte.

**Approach:** Vedtatt av utvikleren 18.11.
- «Forrige» og «Neste» står ved siden av hverandre under kortet.
- «Må øve mer» og «Kan» står over hverandre, over kortet på høyre side.
- Et nytt valg i Konto, «Venstrehendt», speiler plasseringen, så «Må øve mer» og «Kan» står på venstre side. Valget lagres som temavalget.

## Boundaries & Constraints

**Always:**
- Rekkefølgen i dokumentet (og dermed for Tab og skjermleser) er logisk:
  1. kortet
  2. «Må øve mer»
  3. «Kan»
  4. «Forrige»
  5. «Neste»
- Merkeknappene står visuelt over kortet. Det lages med CSS (grid eller order), ikke ved å flytte dem foran kortet i DOM-en. Velger implementasjonen en annen rekkefølge, begrunnes det i Implementation Notes.
- `aria-pressed` og trykkflaten på minst 44 × 44 px er som før. Merkeknappene er like brede.
- «Venstrehendt» lagres i en informasjonskapsel på samme måte som temaet (`data/tema.ts`, `velgTemaHandling`, `slettTemaHandling`): i et skjema på /konto, uten skript, slettet ved utlogging og sletting av kontoen. Valget leses på serveren, så første tegning er riktig (ingen hopp).
- Valget settes som et attributt eller en klasse på `<html>` eller `<body>` (for eksempel `data-hand="venstre"`), så andre steder kan bruke det senere.
- Det virker likt i lys og mørk modus og fra 320 px.

**Never:**
- Ingen endring i øvekortenes logikk (rundene, merkingen, kilden).
- Valget lagres ikke på kontoen (det ville krevd migrasjon).
- Ingen andre sider speiles i denne bolken.

</frozen-after-approval>

## Code Map

- `app/komponenter/Oevekort.tsx:170-188` -- knappeplasseringen i dag. Kortet står over.
- `data/tema.ts` -- `TEMA_KAPSEL`, `TEMA_LEVETID` og `tolkTema` er mønsteret for en ny kapsel (`HAND_KAPSEL`).
- `app/handlinger.ts:1225-1262` -- `velgTemaHandling` og `slettTemaHandling` er mønsteret. Slettingen skjer etter `signOut` og etter at kontoen er slettet, så venstrehendt-kapselen må slettes på de samme stedene.
- `app/konto/page.tsx:17-40` -- temavalget, og der det nye valget skal stå.
- `app/layout.tsx` -- der `data-tema` settes på `<html>`. Sett venstrehendt-attributtet på samme måte.
- `maaling/sjekk-tilgjengelighet.mjs` -- ny sjekk på 375 px:
  - merkeknappene står over kortet til høyre, og «Forrige»/«Neste» ved siden av hverandre under
  - med venstrehendt valgt står merkeknappene til venstre
  - Tab-rekkefølgen er som over
  - axe er grønn
- EXPERIENCE.md (øvekortene og konto) og DESIGN.md.

## Tasks & Acceptance

**Execution:**
- [x] `app/komponenter/Oevekort.tsx`, `app/globals.css` -- ny plassering
- [x] `data/hand.ts` (eller en utvidelse av `data/tema.ts`), `app/handlinger.ts`, `app/konto/page.tsx`, `app/layout.tsx` -- valget
- [x] tester av tolkingen av kapselen og av sletting ved utlogging (som for temaet)
- [x] `maaling/sjekk-tilgjengelighet.mjs` -- sjekken over
- [x] EXPERIENCE.md, DESIGN.md

**Acceptance Criteria:**
- Given øvekortene på 375 px, when kortet vises, then står «Må øve mer» over «Kan» over kortet til høyre, og «Forrige» og «Neste» står ved siden av hverandre under.
- Given «Venstrehendt» valgt i Konto, when øvekortene åpnes, then står merkeknappene over kortet til venstre fra første tegning.
- Given en elev som logger ut, when neste elev åpner appen på samme PC, then er venstrehendt ikke valgt.

## Implementation Notes

- DOM-rekkefølgen er som vedtatt: kortet, (kildeavsnittet når kortet er snudd), feilmeldingen, «Må øve mer», «Kan», «Forrige», «Neste». `.oevekort-flate` er en flex-kolonne, og `.oevekort-merk` har `order: -1` og `align-self: flex-end` (`flex-start` under `:root[data-hand="venstre"]`). Merkeknappene står i en kolonne som er så bred som den bredeste knappen, og begge strekkes, så de er like brede. «Forrige» og «Neste» er et rutenett med to like kolonner i full bredde.
- Når kortet er snudd, står «Se hvor det står i teksten» mellom kortet og «Må øve mer» i Tab-rekkefølgen. Den hører til kortet, og rekkefølgen er ellers som vedtatt.
- Merkeknappene står i `role="group"` med `aria-label="Merk kortet"`.
- Kapselen heter `hand` med verdien `venstre` (`data/hand.ts`). Ingen kapsel betyr standardoppsettet. På /konto er valget en avkrysningsboks under legenden «Øvekortene», med «Lagre», som temavalget. Bekreftelsen er «Lagret: Venstrehendt.» eller «Lagret: Ikke venstrehendt.» (`?lagret=hand`).
- `slettTemaHandling` er omdøpt til `slettEnhetsvalgHandling` og sletter både `tema` og `hand` på de samme stedene (etter `signOut` og etter at kontoen er slettet). Ett kall, så utloggingen ikke venter to ganger.
- Demotesten (steg 14) sjekker nå også at `hand` er slettet ved utlogging. Sjekken av utlogging står der og ikke i `sjekk-tilgjengelighet.mjs`, fordi tilgjengelighetssjekken deler økten mellom kontekstene, og en utlogging der ville logget ut resten av sjekken.

## Spec Change Log

## Review Triage Log

## Verification

**Commands:** (fra PowerShell)
- `npx tsc --noEmit`, `npm test`, `npm run sjekk:tilgjengelighet`, `node maaling/demotest.mjs` -- alle grønne
