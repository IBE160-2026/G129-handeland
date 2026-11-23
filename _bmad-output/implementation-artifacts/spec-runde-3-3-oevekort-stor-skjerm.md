---
title: 'Runde 3, bolk 3: øvekortene på stor skjerm'
type: 'feature'
created: '2026-11-23'
status: 'ready-for-dev'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/oppdrag-design-runde-3.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** På PC og nettbrett er øvekortet like smalt som på telefon (siden er høyst 672 px), merkeknappene står over kortet for én tommel, og «Tilbake til mappen» står øverst der en mus ikke trenger den.

**Approach:** Fra 760 px (appens brytepunkt for stor skjerm): kortet og siden blir opptil omtrent 960 px brede, «Må øve mer» og «Har kontroll» står inne i kortet, og tilbakelenken står nederst på siden til venstre, lenger ut mot kanten enn kortet. Under 760 px er alt som etter bolk 2b.

## Boundaries & Constraints

**Always:**
- **Avgjort (Arve, 23.11):** merkeknappene står nederst inne i kortet, side om side: «Må øve mer» til venstre, «Har kontroll» til høyre; med «Venstrehendt» byttes de om. Tilbakelenken står nederst på siden (ruller med siden), venstrejustert og lenger ut enn kortet; på stor skjerm vises den ikke øverst. Bredden er opptil omtrent 960 px.
- Kortet er en knapp og kan ikke inneholde knapper. «Inne i kortet» er en felles ramme (kant, bakgrunn, skygge) rundt kortknappen og merkegruppen; kortknappen mister sin egen ramme på stor skjerm. Klikk/trykk på flaten utenfor merkeknappene snur fortsatt kortet.
- DOM-rekkefølgen og dermed Tab og skjermleser er uendret: kortet, «Må øve mer», «Har kontroll», (feil), kilden, pilene. Feilmeldingen fra merkingen står inne i rammen, rett over knappene.
- Øvekort fra én Tekst («Tilbake til oppgavene») får samme behandling.
- Én tilbakelenke synlig og i tilgjengelighetstreet om gangen (den andre `display: none`), og den har fortsatt minst 44 px høyde og samme mål.
- Tastaturet fra 2b (←/→, mellomrom) virker som før.

**Never:** Ingen endring under 760 px, i merkingen, rundene, kilden eller tastereglene. Ingen fast posisjonert (sticky/fixed) lenke.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| PC, høyrehendt | 1280 px | kort ~960 px; knappene nederst i rammen, «Må øve mer» venstre; lenken nederst til venstre utenfor kortkanten; ingen lenke øverst | N/A |
| PC, venstrehendt | 1280 px, `data-hand="venstre"` | «Har kontroll» venstre, «Må øve mer» høyre | N/A |
| Grensen | 759 px / 760 px | 759: som 2b (over kortet, lenke øverst); 760: stort oppsett | N/A |
| Klikk i rammen | klikk på kortflaten over knappene | kortet snus | N/A |
| Merkefeil | merkingen feiler | feilmeldingen inne i rammen over knappene | som før |
| 200 % tekst på 760 px | stor tekst | knappene brytes til to rader i rammen heller enn å flyte ut; ingen sidelengs rulling | N/A |

</frozen-after-approval>

## Code Map

- `app/komponenter/Oevekort.tsx` -- `.oevekort-flate` (kortknappen, `.oevekort-merk`, `.oevekort-feil`, kilden, `.oevekort-nav`). Kortknappens ramme står i `className` på knappen (`border-2 … shadow-sm`); den må kunne flyttes til en ramme rundt knapp + merkegruppe + feil. Kilden og pilene står utenfor rammen.
- `app/globals.css` (~2280–2325) -- `.oevekort-flate`, `.oevekort-merk` (`order: -1`, kolonne), `:root[data-hand="venstre"] .oevekort-merk`, `.oevekort-feil`, `.oevekort-nav`. Legg stort oppsett i `@media (min-width: 760px)` som resten av fila.
- `app/mappe/[id]/oevekort/page.tsx`, `app/tekst/[id]/oevekort/page.tsx` -- `main` er `max-w-2xl`; tilbakelenken står i `<header>` med `LENKE_TILBAKE` (`app/komponenter/knapper.ts`). Legg til lenken nederst; vis den ene eller den andre etter bredden.
- `maaling/sjekk-tilgjengelighet.mjs` -- bolk 9-blokken (~1269–1410) sjekker 375/320 px; bolk 2b-blokken (~1412–1450) sjekker at lenken står én gang øverst i headeren, på den bredden sjekken kjører i. Må skilles på bredde.

## Tasks & Acceptance

**Execution:**
- [ ] `app/komponenter/Oevekort.tsx` -- ramme rundt kortknapp + merkegruppe + feil (klasse, f.eks. `.oevekort-ramme`); kortknappens egen ramme bare under 760 px; oppdater kommentarene.
- [ ] `app/globals.css` -- stort oppsett fra 760 px: rammen, knappene nederst side om side (byttet med `data-hand="venstre"`), feilen over dem, bredere kort; under 760 px uendret.
- [ ] Begge øvekortsidene -- `max-w` til omtrent 960 px fra 760 px; tilbakelenken nederst til venstre, ut mot kanten (f.eks. negativ marg eller bredere bunnlinje), skjult under 760 px; lenken øverst skjult fra 760 px.
- [ ] `maaling/sjekk-tilgjengelighet.mjs` -- nye sjekker på 1280 px (høyre- og venstrehendt) og 760 px med 200 % tekst: knappene inne i rammen nederst og i riktig rekkefølge, kortbredde ~960 px, én synlig tilbakelenke nederst til venstre og utenfor kortkanten med riktig `href`, klikk i rammen snur, ingen sidelengs rulling; 759 px som 2b; axe i lys og mørk. Tilpass 2b-sjekken til bredden.
- [ ] `EXPERIENCE.md`, `DESIGN.md` (raden/avsnittet om øvekortene), `prd-lesevenn.md` FR-17 -- datert 23.11.

**Acceptance Criteria:**
- Given 1280 px, when eleven tabber gjennom kortet, then rekkefølgen er kortet, «Må øve mer», «Har kontroll», pilene, og deretter tilbakelenken.
- Given telefon (375 px), when siden vises, then den er lik som etter bolk 2b.

## Verification

**Commands:**
- `npx tsc --noEmit`, `npx eslint app` -- uten feil
- `npm run sjekk:tilgjengelighet`, `npm run sjekk:readme` -- alt bestått
- `npm run demotest` med `LESEVENN_TESTMODUS=les` -- bestått uten modellkall

## Implementation Notes

## Spec Change Log

## Review Triage Log
