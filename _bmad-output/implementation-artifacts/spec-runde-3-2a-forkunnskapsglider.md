---
title: 'Runde 3, bolk 2a: forkunnskapen som glider'
type: 'feature'
created: '2026-11-23'
status: 'in-review'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '2bd6e45e1efbbba543ec84e6b88b7624542c9edf'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/oppdrag-design-runde-3.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Forkunnskapen («Hva vet du om dette fra før?») er fire like knapper per overskrift. Tre av dem er en skala, og det ser ikke ut som en skala.

**Approach:** Per overskrift en glider med tre trinn, `<input type="range">`: «Ingenting ennå» (venstre) – «Litt» – «Mye» (høyre), og under den, sentrert, en av/på-knapp «Skjønner ikke overskriften». Skjemaet sender de samme kodene som i dag, så lagrede verdier, «Før du leste» og den låste visningen er uendret.

## Boundaries & Constraints

**Always:**
- **Urørt = ikke merket (Arve, 23.11).** Håndtaket står dempet i midten, og glideren sier «Ikke merket ennå» (synlig og som `aria-valuetext`). Overskriften teller først når eleven drar, klikker/trykker på glideren eller bruker tastaturet på den. Alle tre verdiene kan velges fra urørt tilstand med mus, berøring og tastatur, også «Litt» der håndtaket allerede står (klikk på håndtaket, eller mellomrom/Enter).
- **«Skjønner ikke» overstyrer (Arve, 23.11):** knapp med `aria-pressed`. På: koden `uklar` sendes, glideren dempes og sier «Satt til side». Av igjen, eller eleven rører glideren: glideren gjelder (og knappen går av).
- Glideren har tilgjengelig navn fra overskriften (`legend`) og beskrivelsen fra spørsmålet (`aria-describedby`, som i dag); `aria-valuetext` er trinnets navn. Trinnmerkene «Ingenting ennå», «Litt», «Mye» står synlige under sporet. Minst 44 px trykkflate, synlig fokus, virker i lys/mørk modus, `forced-colors` og på 320 px med 200 % tekst.
- Skjemaet sender `merke-<nummer>` = `nytt` | `litt` | `kjent` | `uklar`, eller ingenting for urørt. `lesMerking` og handlingen endres ikke; den ene oppfordringen ved tomt skjema virker som før.
- Rekkefølgen for Tab: per overskrift glideren, så «Skjønner ikke overskriften», så neste overskrift.

**Never:** Ingen migrasjon, ingen nye koder, ingen endring i «Før du leste», i den låste aktiveringen («du merket: …») eller i `MERKENAVN`. Ingen standardverdi lagres for en urørt glider.

**Kjent følge:** glideren krever skript. EXPERIENCE.md sier i dag at merkene «virker uten skript»; det strykes for merkene (et tomt skjema uten skript gir oppfordringen og slipper eleven videre, som før).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Urørt | ingen interaksjon | ingenting sendes for overskriften; «Ikke merket ennå» | N/A |
| Dra til høyre | glider → 2 | `kjent`; «Mye» | N/A |
| «Litt» fra urørt | klikk på håndtaket i midten, eller mellomrom | `litt`; «Litt» | N/A |
| Tastatur | → fra urørt | `kjent`; ← fra urørt: `nytt` | N/A |
| Skjønner ikke på | knappen trykkes | `uklar`; glideren «Satt til side»; `aria-pressed=true` | N/A |
| Glider etter «Skjønner ikke» | knappen på, så ← | `nytt`; knappen av | N/A |
| Skjønner ikke av igjen | knappen på → av | glideren gjelder igjen: urørt hvis den aldri ble rørt, ellers sin verdi | N/A |
| Ingenting merket | alle urørt, tomt spørsmål | oppfordringen én gang, så videre | som før |

</frozen-after-approval>

## Code Map

- `app/komponenter/Skjemaer.tsx` -- `AktiveringSkjema` (~105–180): `fieldset`/`legend`, `MERKER.map` radioer med `.merkevalg`. Bytt til en ny klientkomponent per overskrift; resten (lurer på, `Send`, oppfordringens skjulte felt) uendret.
- `tekst/forkunnskap.ts` -- `MERKER`, `MERKENAVN`, `merkefelt`, `lesMerking`: gjenbrukes uendret. Trinnrekkefølgen (venstre→høyre) er `nytt`, `litt`, `kjent`.
- `app/globals.css` -- `.merkevalg` (~252–305): radiostilen; ny stil for glideren og knappen ved siden av (fargene fra eksisterende tokens, `forced-colors`-blokk som `.merkevalg`).
- `app/tekst/[id]/aktivering/page.tsx` -- låst visning (~130–140) uendret.
- `maaling/sjekk-tilgjengelighet.mjs` -- FR-6-blokken (~69–73, 421–531, 595–617), og 1062–1079, 1395–1408, 1900–1934, 2198: valgnavn, Tab/piltast-sjekker og klikk på `label` bygger på radioene; skriv om til glider + knapp.
- `maaling/demotest.mjs` -- 160, 209–224, 264, 521–526: klikk på «Ingenting ennå»-etiketten o.l.
- `maaling/sjekk-readme.mjs` -- 135, 146–157: klikker `label` «Mye».
- `_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/EXPERIENCE.md` (rad «Merking av overskrifter», ~95; flyt 283), `DESIGN.md` (merkene), `prd-lesevenn.md` FR-6 (~243–254).

## Tasks & Acceptance

**Execution:**
- [x] `app/komponenter/forkunnskapsglider.ts` (ny) + `.test.ts` -- rene funksjoner: tilstand `{ rort, trinn, uklar }` → sendt kode (eller tom) og `aria-valuetext`; overganger for glider-endring, «Litt» fra urørt og av/på-knapp -- matrisen uten DOM.
- [x] `app/komponenter/Forkunnskapsvalg.tsx` (ny, `"use client"`) -- glider + trinnmerker + knapp + skjult `input name={merkefelt(nummer)}` med koden; bruker funksjonene over.
- [x] `app/komponenter/Skjemaer.tsx` -- `AktiveringSkjema` bruker `Forkunnskapsvalg` per overskrift; oppdater kommentaren.
- [x] `app/globals.css` -- stil for glideren (spor, trinnmerker, dempet urørt håndtak, fokus, `forced-colors`) og knappen.
- [x] `maaling/sjekk-tilgjengelighet.mjs`, `maaling/demotest.mjs`, `maaling/sjekk-readme.mjs` -- skriv om sjekkene: navn og `aria-valuetext`, urørt sender ingenting, piltaster, «Litt» fra urørt, «Skjønner ikke» på/av, Tab-rekkefølge, 44 px, 320 px/200 %, axe i lys og mørk.
- [x] `EXPERIENCE.md`, `DESIGN.md`, `prd-lesevenn.md` FR-6 -- datert 23.11; stryk «virker uten skript» for merkene.

**Acceptance Criteria:**
- Given en overskrift eleven merket «Mye» før 23.11, when teksten åpnes låst, then «du merket: Mye» vises som før.
- Given skjermleser på glideren, when eleven trykker →, then den leser «Mye».

## Verification

**Commands:**
- `npx vitest run app/komponenter/forkunnskapsglider.test.ts tekst/forkunnskap.test.ts` -- grønt (ikke full vitest)
- `npx tsc --noEmit`, `npx eslint app` -- uten feil
- `npm run sjekk:tilgjengelighet`, `npm run sjekk:readme` -- alt bestått
- `npm run demotest` med `LESEVENN_TESTMODUS=les` -- bestått uten modellkall

## Implementation Notes

## Spec Change Log

## Review Triage Log
