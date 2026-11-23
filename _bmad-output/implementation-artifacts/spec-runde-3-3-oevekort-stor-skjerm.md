---
title: 'Runde 3, bolk 3: Ã¸vekortene pÃ¥ stor skjerm'
type: 'feature'
created: '2026-11-23'
status: 'in-review'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '5f9881e7f592142d22680e820593f6a4ad01eebc'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/oppdrag-design-runde-3.md'
---

<frozen-after-approval reason="human-owned intent â€” do not modify unless human renegotiates">

## Intent

**Problem:** PÃ¥ PC og nettbrett er Ã¸vekortet like smalt som pÃ¥ telefon (siden er hÃ¸yst 672 px), merkeknappene stÃ¥r over kortet for Ã©n tommel, og Â«Tilbake til mappenÂ» stÃ¥r Ã¸verst der en mus ikke trenger den.

**Approach:** Fra 760 px (appens brytepunkt for stor skjerm): kortet og siden blir opptil omtrent 960 px brede, Â«MÃ¥ Ã¸ve merÂ» og Â«Har kontrollÂ» stÃ¥r inne i kortet, og tilbakelenken stÃ¥r nederst pÃ¥ siden til venstre, lenger ut mot kanten enn kortet. Under 760 px er alt som etter bolk 2b.

## Boundaries & Constraints

**Always:**
- **Avgjort (Arve, 23.11):** merkeknappene stÃ¥r nederst inne i kortet, side om side: Â«MÃ¥ Ã¸ve merÂ» til venstre, Â«Har kontrollÂ» til hÃ¸yre; med Â«VenstrehendtÂ» byttes de om. Tilbakelenken stÃ¥r nederst pÃ¥ siden (ruller med siden), venstrejustert og lenger ut enn kortet; pÃ¥ stor skjerm vises den ikke Ã¸verst. Bredden er opptil omtrent 960 px.
- Kortet er en knapp og kan ikke inneholde knapper. Â«Inne i kortetÂ» er en felles ramme (kant, bakgrunn, skygge) rundt kortknappen og merkegruppen; kortknappen mister sin egen ramme pÃ¥ stor skjerm. Klikk/trykk pÃ¥ flaten utenfor merkeknappene snur fortsatt kortet.
- DOM-rekkefÃ¸lgen og dermed Tab og skjermleser er uendret: kortet, Â«MÃ¥ Ã¸ve merÂ», Â«Har kontrollÂ», (feil), kilden, pilene. Feilmeldingen fra merkingen stÃ¥r inne i rammen, rett over knappene.
- Ã˜vekort fra Ã©n Tekst (Â«Tilbake til oppgaveneÂ») fÃ¥r samme behandling.
- Ã‰n tilbakelenke synlig og i tilgjengelighetstreet om gangen (den andre `display: none`), og den har fortsatt minst 44 px hÃ¸yde og samme mÃ¥l.
- Tastaturet fra 2b (â†/â†’, mellomrom) virker som fÃ¸r.

**Never:** Ingen endring under 760 px, i merkingen, rundene, kilden eller tastereglene. Ingen fast posisjonert (sticky/fixed) lenke.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| PC, hÃ¸yrehendt | 1280 px | kort ~960 px; knappene nederst i rammen, Â«MÃ¥ Ã¸ve merÂ» venstre; lenken nederst til venstre utenfor kortkanten; ingen lenke Ã¸verst | N/A |
| PC, venstrehendt | 1280 px, `data-hand="venstre"` | Â«Har kontrollÂ» venstre, Â«MÃ¥ Ã¸ve merÂ» hÃ¸yre | N/A |
| Grensen | 759 px / 760 px | 759: som 2b (over kortet, lenke Ã¸verst); 760: stort oppsett | N/A |
| Klikk i rammen | klikk pÃ¥ kortflaten over knappene | kortet snus | N/A |
| Merkefeil | merkingen feiler | feilmeldingen inne i rammen over knappene | som fÃ¸r |
| 200 % tekst pÃ¥ 760 px | stor tekst | knappene brytes til to rader i rammen heller enn Ã¥ flyte ut; ingen sidelengs rulling | N/A |

</frozen-after-approval>

## Code Map

- `app/komponenter/Oevekort.tsx` -- `.oevekort-flate` (kortknappen, `.oevekort-merk`, `.oevekort-feil`, kilden, `.oevekort-nav`). Kortknappens ramme stÃ¥r i `className` pÃ¥ knappen (`border-2 â€¦ shadow-sm`); den mÃ¥ kunne flyttes til en ramme rundt knapp + merkegruppe + feil. Kilden og pilene stÃ¥r utenfor rammen.
- `app/globals.css` (~2280â€“2325) -- `.oevekort-flate`, `.oevekort-merk` (`order: -1`, kolonne), `:root[data-hand="venstre"] .oevekort-merk`, `.oevekort-feil`, `.oevekort-nav`. Legg stort oppsett i `@media (min-width: 760px)` som resten av fila.
- `app/mappe/[id]/oevekort/page.tsx`, `app/tekst/[id]/oevekort/page.tsx` -- `main` er `max-w-2xl`; tilbakelenken stÃ¥r i `<header>` med `LENKE_TILBAKE` (`app/komponenter/knapper.ts`). Legg til lenken nederst; vis den ene eller den andre etter bredden.
- `maaling/sjekk-tilgjengelighet.mjs` -- bolk 9-blokken (~1269â€“1410) sjekker 375/320 px; bolk 2b-blokken (~1412â€“1450) sjekker at lenken stÃ¥r Ã©n gang Ã¸verst i headeren, pÃ¥ den bredden sjekken kjÃ¸rer i. MÃ¥ skilles pÃ¥ bredde.

## Tasks & Acceptance

**Execution:**
- [x] `app/komponenter/Oevekort.tsx` -- ramme rundt kortknapp + merkegruppe + feil (klasse, f.eks. `.oevekort-ramme`); kortknappens egen ramme bare under 760 px; oppdater kommentarene.
- [x] `app/globals.css` -- stort oppsett fra 760 px: rammen, knappene nederst side om side (byttet med `data-hand="venstre"`), feilen over dem, bredere kort; under 760 px uendret.
- [x] Begge Ã¸vekortsidene -- `max-w` til omtrent 960 px fra 760 px; tilbakelenken nederst til venstre, ut mot kanten (f.eks. negativ marg eller bredere bunnlinje), skjult under 760 px; lenken Ã¸verst skjult fra 760 px.
- [x] `maaling/sjekk-tilgjengelighet.mjs` -- nye sjekker pÃ¥ 1280 px (hÃ¸yre- og venstrehendt) og 760 px med 200 % tekst: knappene inne i rammen nederst og i riktig rekkefÃ¸lge, kortbredde ~960 px, Ã©n synlig tilbakelenke nederst til venstre og utenfor kortkanten med riktig `href`, klikk i rammen snur, ingen sidelengs rulling; 759 px som 2b; axe i lys og mÃ¸rk. Tilpass 2b-sjekken til bredden.
- [x] `EXPERIENCE.md`, `DESIGN.md` (raden/avsnittet om Ã¸vekortene), `prd-lesevenn.md` FR-17 -- datert 23.11.

**Acceptance Criteria:**
- Given 1280 px, when eleven tabber gjennom kortet, then rekkefÃ¸lgen er kortet, Â«MÃ¥ Ã¸ve merÂ», Â«Har kontrollÂ», pilene, og deretter tilbakelenken.
- Given telefon (375 px), when siden vises, then den er lik som etter bolk 2b.

## Verification

**Commands:**
- `npx tsc --noEmit`, `npx eslint app` -- uten feil
- `npm run sjekk:tilgjengelighet`, `npm run sjekk:readme` -- alt bestÃ¥tt
- `npm run demotest` med `LESEVENN_TESTMODUS=les` -- bestÃ¥tt uten modellkall

## Implementation Notes

## Spec Change Log

## Review Triage Log
