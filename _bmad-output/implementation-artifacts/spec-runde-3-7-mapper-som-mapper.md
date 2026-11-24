---
title: 'Runde 3, bolk 7: mappene i Samlinger ser ut som mapper'
type: 'feature'
created: '2026-11-24'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '3ba0049fd6bdc16d7217c5df5916e1366f9703c0'
context:
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/DESIGN.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** På arbeidsbordet ser en Mappe ut som en mappe (fanen fra bolk 5), men i Samlinger er mappene vanlige kort (stor skjerm) eller listerader (telefon). Arve vil at mappene i Samlinger også skal se ut som mapper (24.11).

**Approach:** Gi mappekortene i Samlinger den samme mappefanen som mappebunken: en flik øverst til venstre i samme kant og flate som kortet. Bare utseendet endres. Innhold, lenker, antall, rekkefølge og dra og slipp er som før.

**Avgjort av Arve 24.11:**
- **Telefon:** også under 760 px blir mappene egne kort med fane (én kolonne, øverst som før), i stedet for listen med skillelinjer. Likt på alle skjermer, som mappestripen på arbeidsbordet.
- **Ingen merkelapp «Mappe»** i Samlinger: bare fanen. Alt under «Mappene dine» er mapper.

## Boundaries & Constraints

**Always:**
- Fanen er pynt (ikke i tilgjengelighetstreet). Navnet er fortsatt lenken, og antallet står som før.
- Mens en tekst dras, følger fanen kortets kant: stiplet i primærfargen på alle kort, heltrukket med ring på kortet teksten er over. Ringen omslutter både kort og fane.
- Fanen står med kant i kontrastmodus (`forced-colors`), som på arbeidsbordet.
- Fanen dekker aldri kortet over, overskriften eller meldingsboksen, heller ikke med 200 % tekst eller på 320 px.
- Samme mål og form som `.bunke-mappe > .bunke-forside::before` (gjenbruk, ikke en ny tegning).

**Never:**
- Ingen endring i markup-rekkefølge, lenker, `Slippmaal`-logikk eller serverkode.
- Ingen ny farge eller nytt token.
- Mappesiden (`/mappe/[id]`) og arbeidsbordet endres ikke.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Stor skjerm | ≥760 px, 1–20 mapper | Hvert kort har fane; ingen fane overlapper kortet over i rutenettet | N/A |
| Telefon | <760 px | Mappene er kort med fane i én kolonne, øverst på siden; ingen skillelinjer; ingen sidelengs rulling | N/A |
| Drag | Tekst dras over et kort | Fanen er stiplet på alle kort; kortet under får heltrukken kant og ring rundt kort og fane | N/A |
| Langt navn | 80 tegn, 200 % tekst | Navnet brytes inne i kortet; fanen står fast øverst til venstre | N/A |
| Kontrastmodus | `forced-colors: active` | Fane og kort har kant i CanvasText; slippmålet Highlight | N/A |
| Ingen mapper | 0 mapper | Ingen liste, som før | N/A |

</frozen-after-approval>

## Code Map

- `app/samling/page.tsx:204-241` -- `Mapper`: `<ul className="mappekort-liste … divide-y …">` med `Slippmaal className="mappekort …"`; lenke `{m.tittel}` og `.mappekort-antall`. Klassene på telefon (divide-y, border-y, py-2) må kanskje byttes hvis telefonen får kort.
- `app/komponenter/DraTilMappe.tsx:236-271` -- `Slippmaal` legger på `slippmaal-klar`/`slippmaal-over`. Ikke endre.
- `app/globals.css:1282-1293` -- `.bunke-mappe > .bunke-forside::before`: fanen (bottom: 100 %, left 1.25rem, 4.5 × 0.875rem, `border: inherit`, `border-bottom: 0`, radius 10px 10px 0 0, `background: inherit`). Gjenbruk målene.
- `app/globals.css:1161-1167` -- luft over mappestripen (0.875 rem fane + 0.5 rem margin): mønster for luft mellom kort.
- `app/globals.css:1861-1864` -- fanen i kontrastmodus.
- `app/globals.css:2679-2741` -- `.mappekort-liste` og `.mappekort` fra 760 px (kant slate-300/600, radius-lg, bakgrunn), `.slippmaal-klar` (stiplet), `.slippmaal-over` (ring via box-shadow), overgang 120 ms, kontrastmodus Highlight.
- `maaling/sjekk-tilgjengelighet.mjs:1177-1190, 1864` -- bruker `#mapper li.mappekort`, `.mappekort-antall` og `.mappekort-liste`; selektorene må bestå.
- `_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/DESIGN.md:454` -- beskrivelsen av mappekortene i Samlinger; oppdateres.

## Tasks & Acceptance

**Execution:**
- [x] `app/globals.css` -- fane på `.mappekort` (`::before`, samme mål som mappebunken), luft over kortene så fanen ikke dekker noe, fanen med i ringen på `slippmaal-over` og i kontrastmodus -- utseendet
- [x] `app/samling/page.tsx` -- bare klasser: fjern listeklassene for telefon (`divide-y divide-kant border-y border-kant`, `py-2`) og la `.mappekort`-reglene i CSS gjelde på alle bredder -- kort med fane også på telefon
- [x] `maaling/sjekk-tilgjengelighet.mjs` -- sjekk at fanen finnes og ligger innenfor `#mapper` uten å overlappe kortet over, ved 1280 og 375 px (og 200 % tekst); at fanen er stiplet ved drag og at ringen omslutter den; at fanen har kant i kontrastmodus; ingen sidelengs rulling -- holder utseendet fast
- [x] `DESIGN.md` -- oppdater avsnittet om Samlinger på stor skjerm (linje 454), med dato 24.11 -- design og kode sier det samme

**Acceptance Criteria:**
- Given Samlinger med to mapper, when siden vises på 1280 px, then har hvert mappekort en fane øverst til venstre i samme kant og flate som kortet.
- Given en tekst som dras, when den holdes over et mappekort, then har kortet og fanen heltrukket kant, og ringen går rundt begge.
- Given skjermleser, when mappene leses, then er det samme navn, lenke og antall som før, og fanen leses ikke.

## Implementation Notes

- Fanen gjenbruker regelen for mappebunken: `.mappekort-liste > .mappekort::before` er lagt til i selektoren for `.bunke-mappe > .bunke-forside::before` (globals.css). Kant, flate, radius og `position: relative` gjelder alle bredder. Fra 760 px: rutenettet (`auto-fill`, minst 13 rem) og kortet (kolonne, minst 7 rem høyt). Under 760 px: én kolonne med lave striper som mappestripen på arbeidsbordet (rad med bryting, navnet vokser, antallet til høyre uten bryting, ingen minstehøyde).
- 1,5 rem luft over listen (`margin-top` på `.mappekort-liste`) og mellom radene (0,875 rem fane + 0,625 rem).
- Ringen på `slippmaal-over` er den samme skyggen på fanen, klippet nederst (`clip-path: inset(-3px -3px 0 -3px)`), så den ikke tegnes inn i kortet. I kontrastmodus får kort og fane `outline` og kant i Highlight, og fanen `z-index: 1`, så kortets ramme ikke går tvers over foten av fanen.
- Funnet av den nye sjekken på 320 px med 200 % tekst: fanen (4,5 rem + 1,25 rem fra kanten) stakk ut på høyre side av kortet. Rettet med `max-width: calc(100% - 2.5rem)` på fanen, og 16 px sidepolstring under 760 px i både kortet og mappedelen (`px-[16px] min-[760px]:px-5`; presedens: px-margene på telefonbordet), så korte navn ikke deles.

- Kontroll av tabellen (25.11): raden «Langt navn» manglet dekning, fordi testdataene bare har korte navn. Ny sjekk på 1280 px og på 320 px med 200 % tekst bytter ett mappenavn i siden med 80 tegn ekte ord og krever at navnet brytes over flere linjer inne i kortet, at fanen står fast og ikke dekker noe, og at siden ikke ruller sidelengs (testdataene er urørt).
- Sluttsjekk etter rettingene: tsc og eslint 0 feil (6 gamle advarsler), npm test 796/796, tilgjengelighet 587/587, demotest 3/3 (les).

## Spec Change Log

## Review Triage Log

Gjennomgang 1 (25.11): blind (B), kanttilfeller (E), verifiseringshull (V). 19 funn.

| # | Funn | Dom | Rute | Grunnlag |
|---|------|-----|------|----------|
| B1+E1 | CanvasText-regelen for `.mappekort` i kontrastmodus taper mot den senere `border`-regelen | low | patch | Lik spesifisitet (0,2,0), og grunnregelen (globals.css ~2640) står etter blokken på ~1866; kanten er CanvasText bare fordi nettleseren tvinger fargen. Flyttes til kontrastblokken nederst. |
| B2+V1 | Plasseringssjekkene i `fanene()` regner fanens topp/bunn ut fra kortet og måler den aldri | medium | patch | `bunn = r.top + borderTop`, så `oeverstTilVenstre` blir `borderTop <= 3`; uten `position: relative` på kortet ville alle sjekkene fortsatt bestått. |
| B3 | Ingen sjekk viser at den smale fanen slår inn | false | — | `form` sammenligner med `min(4,5 rem, inni − 2,5 rem)`; uten `max-width` blir bredden 4,5 rem og sjekken feiler når det smale tilfellet inntreffer, noe implementeringen så på 320 px med 200 % (fanen stakk ut før rettingen). |
| B4 | 760 px (grensen der rutenettet og draget starter) er ikke med i løkka | low | patch | Løkka har 1280, 375 og 320; ved 760 bytter polstring og oppsett. Én bredde til i løkka. |
| B5+V2 | Kort- og fanekant i mørk modus sjekkes ikke, og regelen gjelder nå også telefon | low | patch | `@variant dark` ble flyttet ut av 760-blokken; ingen sjekk leser kanten i mørk modus. Mørk modus er vanlig i bruk, og sjekken er én lesing i den eksisterende mørke blokken. |
| B6 | Korte mappenavn brytes midt i ordet på 320 px med 200 % tekst | medium | patch | Kortet er om lag 140 px innvendig (seksjonens `p-5` er 40 px hver vei), så «Eksamen» blir «Eksam/en», verre enn den gamle listen. Seksjonen får 16 px sidepolstring under 760 px, som kortet. |
| B7 | Kortene er minst 7 rem høye også på telefon, så 20 mapper skyver tekstene langt ned | medium | patch | Avvik fra det fryste valget («som mappestripen på arbeidsbordet»): stripen er lav med navnet til venstre og antallet til høyre. Under 760 px: ingen minstehøyde, navn og antall på én rad som stripen. |
| B8 | Luften over listen (`mt-6`) står i page.tsx, mens CSS-kommentaren bygger på den | low | patch | Fjernes `mt-6`, dekker fanen meldingen eller ingressen. Flyttes til `.mappekort-liste` i CSS. |
| B9 | DESIGN.md sier px der CSS bruker rem, og `collections:` nevner ikke smal fane, polstring og ring | low | patch | Løftet om 200 % holder fordi verdiene er rem; dokumentet må si det samme. |
| B10+E3 | Kontrastmodus nullstilles ikke hvis sjekken kaster | low | reject | Kaster den, stopper hele kjøringen uansett (E3), så resten kjører ikke i kontrastmodus; sjelden og bare i testverktøyet. |
| B11 | `z-index: 1` på fanen i kontrastmodus sjekkes ikke | low | reject | Gjelder en strek under én piksel, bare synlig i skjermbildet; en påstand til gir lite. |
| B12a | `waitForTimeout(400)` venter fast på en overgang på 120 ms | low | reject | 400 ms er mer enn tre ganger overgangen; ingen ustabilitet sett i fire kjøringer. |
| B12b+E4 | `merkelapp`-sjekken slår ut på en mappe som heter «Mappe …» | low | patch | Regexen `/^\s*Mappe\b/` på `li.textContent` avhenger av navnene i testdataene; sjekk bare `.bunke-mappemerke`. Direkte retting. |
| E2 | Med `isMobile` kan nettleseren zoome ut, så `scrollWidth > innerWidth` ikke fanger sidelengs rulling | maybe-false | defer | Samme mønster brukes i hele fila (linje 255, 560, 593, 1242, 1263, 1551, 1580), så det er ikke laget i denne bolken. Avgjøres ved å sammenligne `scrollWidth` med bredden fra oppsettet i en kontekst med `isMobile: true` og innhold som stikker ut. |

## Verification

**Commands:**
- `npx tsc --noEmit` og `npx eslint app` -- expected: 0 feil
- `npm test` (fra PowerShell) -- expected: alle grønne (796)
- `node maaling/sjekk-tilgjengelighet.mjs` -- expected: alle grønne, med de nye sjekkene
- `node maaling/demotest.mjs` (LESEVENN_TESTMODUS=les) -- expected: 3/3
