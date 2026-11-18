---
title: 'Design runde 2, bolk 10: unnskyldende Buddy i gjennomsynet og rosa pennestrøk under tekstnavnet'
type: 'feature'
created: '2026-11-18'
status: 'ready-for-dev'
route: 'dispatch'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Merknaden i gjennomsynet etter bildeinnlesing har ingen Buddy, og den rosa tusjen fra landingssiden («leser») brukes ikke i appen. Utvikleren vil ha mer av den rosa fargen, og at strøket ser håndtegnet ut.

**Approach:** Vedtatt av utvikleren 18.11 fra skissene i `_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/mockups/runde-11-buddy-og-pennestrok.html`.
- **Variant B for Buddy:** et nytt uttrykk, «unnskyldende». Buddy ser ned, pupillene flakker sakte fra side til side, og bekymrede bryn bak glassene er løftet inn mot midten. Det står i merknaden i gjennomsynet for tekster lest fra bilder.
- **Variant A for strøket:** en rosa tusj bak den nederste delen av ordet, med ujevne ender og litt bølge. Den erstatter den jevne stripa på «leser» på landingssiden, og legges under tekstnavnet i sidetitlene.

## Boundaries & Constraints

**Always:**
- Buddy er den samme tegningen som `BuddyMerke`. Det nye uttrykket er en ny tilstand eller variant av komponenten, ikke en egen tegning. Brynene tegnes over glasset og under rammen, i `--lb-primaer`. I mørk modus følger de reglene for mørk modus i `globals.css`.
- Med redusert bevegelse står pupillene nede og brynene stille. Buddy er `aria-hidden`. Merknaden bærer beskjeden i tekst, og teksten er den bolk 7 innførte.
- **Strøket:**
  - Det er en SVG med `preserveAspectRatio="none"` bak ordet. Ordet selv er en vanlig `<span>`, så skjermlesere leser bare teksten.
  - Fargen er `--lb-tusj` (lys og mørk), og kontrasten mellom teksten og strøket er minst den samme som i dag.
  - Det tegnes inn én gang når siden lastes (clip-path, cirka 0,55 s). Med redusert bevegelse står det bare der.
  - I kontrastmodus (`forced-colors`) blir det en vanlig understrek, slik `.ls-tusj` har i dag.
- **Sidetitlene som får strøket under tekstnavnet:** «Quiz: X», «Oppgaver: X», «Huskeregel: X» og titlene på øvekortene, fagsamtalen, lesevisningen, aktiveringen og gjennomsynet. Bare navnet får strøk, ikke «Quiz:».
- Lange navn som brytes over flere linjer, får strøk på hver linje, eller strøket følger hele ordet uten å klippe teksten. Det skal ikke bli sidelengs rulling fra 320 px med 200 % tekst.

**Never:**
- Ingen endring i teksten i merknaden eller i flyten.
- Strøket brukes ikke på lenker eller knapper. Det kan ellers forveksles med en lenkeunderstrek.

</frozen-after-approval>

## Code Map

- `app/komponenter/Merke.tsx` -- `BuddyMerke`: ny `tilstand` (for eksempel `"unnskyld"`) eller `variant` som tegner brynene og flytter pupillene ned. Geometrien for brynene og animasjonen står i skissen (`.bryn-v`, `.bryn-h`, `@keyframes flakk`, `bryn-v`, `bryn-h`).
- `app/globals.css:247-420` -- Buddy-reglene og mørk modus. Legg det nye uttrykket her, med regel for redusert bevegelse.
- `app/tekst/[id]/gjennomsyn/page.tsx` -- merknaden for `tekst.vei === "bilde"` (teksten fra bolk 7) får Buddy på 64 px til venstre, som i skissen.
- `app/globals.css:1451-1467` -- `.ls-tusj` får strøket fra variant A, og regelen for kontrastmodus (`:1998`) følger med. Lag en felles komponent eller klasse (for eksempel `Tusj` i `app/komponenter/`), som både landingssiden og sidetitlene bruker.
- Sidetitlene: `app/tekst/[id]/{aktivering,gjennomsyn,lesing,minnevers,oevekort,oppgaver,quiz}/page.tsx` og `samtale/[samtaleId]/page.tsx` (h1 med `{tekst.tittel}`).
- `maaling/sjekk-tilgjengelighet.mjs`:
  - gjennomsynet via bilde viser Buddy-merket i merknaden, og axe er grønn i lys og mørk modus
  - quizsiden har strøket bak navnet
  - h1-teksten er uendret for skjermleser
  - ingen sidelengs rulling på 320 px med 200 % tekst
- DESIGN.md (logo-mark, de nye uttrykkene, `components.highlighter`) og EXPERIENCE.md (gjennomsynet).

## Tasks & Acceptance

**Execution:**
- [ ] `Merke.tsx`, `globals.css` -- det unnskyldende uttrykket
- [ ] `gjennomsyn/page.tsx` -- Buddy i merknaden
- [ ] felles tusj-komponent eller -klasse, landingssiden og sidetitlene
- [ ] `maaling/sjekk-tilgjengelighet.mjs` -- sjekkene over
- [ ] DESIGN.md, EXPERIENCE.md

**Acceptance Criteria:**
- Given en tekst lest fra bilder, when gjennomsynet åpnes, then står Buddy med blikket ned og bekymrede bryn i merknaden, og med redusert bevegelse står Buddy stille.
- Given quizsiden for «Bedrift», when den åpnes, then har «Bedrift» i overskriften et rosa, ujevnt tusjstrøk bak den nederste delen, og overskriften leses som «Quiz: Bedrift».
- Given landingssiden, when den åpnes, then har «leser» det samme strøket som sidetitlene.

## Implementation Notes

## Spec Change Log

## Review Triage Log

## Verification

**Commands:** (fra PowerShell)
- `npx tsc --noEmit`, `npm test`, `npm run sjekk:tilgjengelighet`, `node maaling/demotest.mjs` -- alle grønne
