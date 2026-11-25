---
title: 'Runde 3, bolk 8: øvekortenes piler synes på telefon, og glideren glir'
type: 'feature'
created: '2026-11-25'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'a79c4b8fc05beedc2b65690c340a28830f6e662e'
context:
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/EXPERIENCE.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/DESIGN.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Arves telefontest 25.11 fant to ting. (1) På øvekortsidene (`/tekst/[id]/oevekort` og `/mappe/[id]/oevekort`) havner pilknappene under skjermkanten på telefon når siden lastes, så eleven må rulle for å bla. (2) Forkunnskapsglideren hopper trinnvis når eleven drar fingeren (`<input type="range">` med `step={1}`), så draget føles hakkete.

**Approach:** (1) Under 760 px står tellingen («Kort N av M …» og «Har kontroll: … · Må øve: … · Ikke merket: …») til venstre for de stablede merkeknappene, der det i dag er tomt, og det er mindre luft øverst og over kortet og et litt lavere kort, så pilene synes uten rulling. (2) Mens eleven drar, glir håndtaket fritt og trinnet nærmest lyser opp; ved slipp smetter det inn på nærmeste trinn.

**Avgjort av Arve 25.11:**
- Tellingen ved merkeknappene (ikke ved overskriften), pluss strammere luft og lavere kort.
- Glideren glir fritt ved drag og smetter inn ved slipp. Tastatur og skjermleser er uendret.
- Begge i én bolk.

## Boundaries & Constraints

**Always:**
- Øvekort: fra 760 px er alt som før (runde 3, bolk 3). Med «Venstrehendt» står merkeknappene til venstre og tellingen til høyre for dem. Tellingen leses av skjermleseren før kortet, som i dag. Tab-rekkefølgen er uendret (kortet, «Må øve mer», «Har kontroll», (feil), (kilde), «Forrige kort», «Neste kort»). Tilbakelenken beholder minst 44 px trykkflate. Kortet rommer fortsatt «Fra «…»», uttrykket og hjelpelinjen uten å flyte over. Ingen sidelengs rulling på 320 px med 200 % tekst.
- Glider: trykk ytterst på sporet gir endetrinnet (som i dag, også i iOS Safari). Tastaturet (`vedTast`) går ett trinn om gangen. `aria-valuetext` er alltid navnet på et trinn (eller «Ikke merket ennå» / «Satt til side»), aldri et desimaltall. Det som sendes, er alltid et helt trinn, og urørt sender ingenting. Slipper eleven utenfor glideren eller draget avbrytes (`pointercancel`), smetter håndtaket inn på trinnet nærmest der det sto.
- Reglene som kan testes uten DOM, står som rene funksjoner i `forkunnskapsglider.ts`, med enhetstester.

**Never:**
- Ingen endring i lagring, koder (`MERKER`), «Før du leste» eller serverkode.
- Ingen endring på øvekortene fra 760 px, og ingen ny fast posisjonering (ingen `position: fixed` på pilene).
- Ingen egen glider-komponent i stedet for `<input type="range">`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Pilene synes | 390×664 og 375×553 (synlig høyde i Safari på iPhone 14 og SE), vanlig tekst, første kort, begge øvekortsidene | Bunnen av «Forrige kort»/«Neste kort» er innenfor synsfeltet uten rulling | N/A |
| Tellingen | under 760 px | «Kort N av M» og tellingen står til venstre for merkeknappene, toppen i flukt med første knapp; med «Venstrehendt» til høyre | N/A |
| Stor tekst | 320 px, 200 % tekst | Tellingen brytes i sin kolonne eller går over knappene; ingen sidelengs rulling, ingenting dekkes | N/A |
| Drag | eleven drar fra «Litt» mot høyre | Håndtaket følger fingeren uten hopp; «Mye» lyser opp når det er nærmest | N/A |
| Slipp | slipper mellom «Litt» og «Mye», nærmest «Mye» | Håndtaket smetter til «Mye», `aria-valuetext` «Mye», skjemaet sender `kjent` | N/A |
| Avbrutt drag | `pointercancel` midt i draget | Smetter inn på trinnet nærmest der håndtaket sto | N/A |
| Trykk ytterst | trykk helt til venstre på sporet | «Ingenting ennå», som før | N/A |
| Tastatur | → fra urørt, deretter ← | «Mye», så «Litt»; aldri desimaler | N/A |

</frozen-after-approval>

## Code Map

- `app/komponenter/Oevekort.tsx:183-200` -- tellingen (`div.flex … text-sm`) står FØR `.oevekort-flate`; flyttes inn i flaten (først) eller plasseres med CSS så den kan stå ved merkeknappene under 760 px. DOM-rekkefølgen før kortet beholdes.
- `app/komponenter/Oevekort.tsx:204-232` -- `.oevekort-flate` > `.oevekort-ramme` > kortknappen (`mt-3 block min-h-56 …`, indre `min-h-44`); merkegruppen `.oevekort-merk` og `.oevekort-feil` står etter kortet i DOM, og `order: -1` løfter dem over kortet.
- `app/komponenter/Oevekort.tsx:298-310` -- `.oevekort-nav` med pilknappene.
- `app/globals.css:2518-2557` -- `.oevekort-flate` (flex-kolonne), `.oevekort-ramme { display: contents }` under 760 px, `.oevekort-merk` (order −1, `align-self: flex-end`, kolonne, gap 0.75rem, mt 0.75rem), venstrehendt (`:root[data-hand="venstre"]`), `.oevekort-feil`, `.oevekort-nav` (mt 1.5rem). Reglene fra 760 px følger etter (~2558–2620); de skal ikke endres i virkning.
- `app/tekst/[id]/oevekort/page.tsx:29-46` og `app/mappe/[id]/oevekort/page.tsx:33-55` -- `main … py-10`, header med tilbakelenken (`LENKE_TILBAKE`, `min-h-11`), «Øvekort» (`mt-4`), `h1` (`mt-1`), og `div.mt-8` rundt `<Oevekort>`. Luften kan strammes under 760 px.
- `app/komponenter/knapper.ts:35` -- `LENKE_TILBAKE` (`min-h-11`), ikke endre.
- `app/komponenter/Forkunnskapsvalg.tsx:75-115` -- glideren: `step={1}`, `value={t.trinn}`, `onChange` → `velgTrinn`, `onPointerUp` → `trinnFraPeker` (iOS-trykk på sporet), `onClick` → `velgGjeldende`, `onKeyDown` → `vedTast`. `valgt` styrer `data-valgt` på trinnetikettene.
- `app/komponenter/forkunnskapsglider.ts` -- rene regler (`somTrinn`, `trinnFraPeker`, `velgTrinn`, `verditekst`, `vedTast`). Nye regler for draget (posisjon under drag, nærmeste trinn, smett inn) hører hjemme her.
- `app/komponenter/forkunnskapsglider.test.ts` -- enhetstestene (describe «glideren», «tastaturet» …).
- `app/globals.css:247-410` -- `.forkunnskap-glider` (spor, håndtak, dempet, fokus, kontrastmodus).
- `maaling/sjekk-tilgjengelighet.mjs:2380-2460` -- øvekortsjekkene på 375 og 320 px (Tab-rekkefølge, ingen siderulling, axe); `:476-720` -- forkunnskapssjekkene (urørt, tastatur, «Skjønner ikke», klikk på sporet). `maaling/demotest.mjs:163` og `maaling/sjekk-readme.mjs:137` bruker `input[type=range]:not([disabled])`.

## Tasks & Acceptance

**Execution:**
- [x] `app/komponenter/Oevekort.tsx` + `app/globals.css` -- under 760 px: tellingen til venstre for merkeknappene (høyre med «Venstrehendt»), lavere kort (minstehøyden ned fra 14 rem, om lag 10 rem, men innholdet får plass), mindre luft mellom delene; fra 760 px uendret -- pilene synes uten rulling
- [x] `app/tekst/[id]/oevekort/page.tsx` + `app/mappe/[id]/oevekort/page.tsx` -- under 760 px mindre luft øverst (`py-10`) og over øvekortene (`mt-8`); tilbakelenken beholder `min-h-11` -- samme mål
- [x] `app/komponenter/forkunnskapsglider.ts` + `forkunnskapsglider.test.ts` -- rene funksjoner for draget (posisjon under drag, nærmeste trinn, smett inn ved slipp/avbrudd) og enhetstester for matrisens glider-rader -- reglene testes uten DOM
- [x] `app/komponenter/Forkunnskapsvalg.tsx` -- mens primærpekeren drar: fri posisjon (ikke `step={1}`), trinnetiketten nærmest lyser opp, `aria-valuetext` er trinnets navn; ved `pointerup`/`pointercancel` smett inn på nærmeste trinn; trykk på sporet, klikk og tastatur som før -- glideren glir
- [x] `maaling/sjekk-tilgjengelighet.mjs` -- sjekk at bunnen av pilene er innenfor synsfeltet på 390×664 og 375×553 på begge øvekortsidene, at tellingen står ved merkeknappene (og byttet med «Venstrehendt»), at stor skjerm er uendret; og et ekte pekerdrag på glideren (mus i Chromium) som stopper mellom to trinn: håndtaket står mellom trinnene under draget, etiketten nærmest lyser, og etter slipp står det på nærmeste trinn med riktig `aria-valuetext` og sendt kode -- holder begge fast
- [x] `EXPERIENCE.md` (Øvekortene, forkunnskapen) og `DESIGN.md` -- beskriv det nye oppsettet på telefon og draget, datert 25.11 -- design og kode sier det samme

**Acceptance Criteria:**
- Given en elev på iPhone, when øvekortsiden åpnes, then ser eleven kortet, merkeknappene og pilene uten å rulle.
- Given en skjermleser, when øvekortsiden leses, then er rekkefølgen og navnene som før.
- Given glideren, when eleven drar og slipper, then glir håndtaket uten hopp og står etterpå på et trinn.

## Implementation Notes

- Øvekort under 760 px: tellingen står i `.oevekort-flate` ved merkeknappene (DOM før kortet), luften er strammet, kortet er minst 8,5 rem, og h1 er 1,75 rem (etter gjennomgangen: en tittel over to linjer skjøv ellers pilene under kanten). Pilenes bunn på 375×553 er 504–539 px, også med tittel over to linjer og i runden «bare de du vil øve mer på». Fra 760 px uendret.
- Glideren: `step="any"` mens primærpekeren drar, tilstanden på nærmeste trinn hele tiden, og smett inn ved `pointerup`/`pointercancel` (lyttere på `window`). Uten flytting gjelder `trinnFraPeker` (iOS-trykket), bare når pekeren slippes på glideren. Piltaster ignoreres under draget. Reglene er rene funksjoner (`dragPosisjon`, `naermesteTrinn`, `underDrag`, `smettInn`) med enhetstester.
- Sluttsjekken fant at testtittelen fikk plass på én linje på 390 px; byttet til «Elektromagnetiske bølger og stråling fra sola», så den brytes på begge bredder.
- Sluttsjekk: tsc og eslint 0 feil (8 gamle advarsler), npm test 806/806, tilgjengelighet 656/656, demotest 3/3 (les), README 9/9. Ikke prøvd med ekte finger på iPhone: Arve prøver draget etter utrulling.

## Spec Change Log

## Review Triage Log

Gjennomgang 1 (25.11): blind (B), kanttilfeller (E), verifiseringshull (V). 21 funn.

| # | Funn | Dom | Rute | Grunnlag |
|---|------|-----|------|----------|
| B1 | Specen er ikke i diffen, og notatene og triageloggen er tomme | false | — | Specen holdes med vilje utenfor diffen for de blinde lagene; notatene og loggen fylles i steg 3–4, og `in-review` er riktig status nå. Rettingen ville uansett vært å endre specen. |
| B2+E1 | Draget kan henge om verken `pointerup` eller `pointercancel` kommer (alt-tab, kontekstmeny midt i draget) | low | reject | Krever at eleven holder museknappen og bytter vindu eller åpner kontekstmenyen; på telefon avslutter `pointercancel` draget. Tilstanden er hele tiden et gyldig trinn, og neste `pointerdown` rydder. Rettingen legger til pekerfangst og flere lyttere. |
| B3+E2 | En piltast mens pekeren fortsatt holdes, overskrives av slippet | low | patch | Sjelden, men rettingen er én linje: `onKeyDown` gjør ingenting mens `dragRef` er satt. |
| B4 | Kommentaren sier at et trykk regnes fra pekeren, men i Chromium flytter et trykk på sporet håndtaket med en gang (da gjelder nettleserens verdi) | low | patch | Oppførselen er riktig (nettleserverdien er trinnet nærmest); bare kommentaren er unøyaktig. |
| B5 | En avbrutt rullebevegelse over en urørt glider lagrer et merke | false | — | Før bolken merket `onChange` glideren som rørt ved første `change` (a79c4b8, linje 89–92), så ingenting er nytt; og matrisen krever at et avbrutt drag smetter inn. Uten `change` (pos null) endres ingenting. |
| B6 | En ugyldig verdi flytter håndtaket til midten | false | — | Nettleseren renser verdien i `<input type="range">` (alltid et tall mellom min og maks), så `dragPosisjon` får aldri tom eller ugyldig verdi derfra. |
| B7 | Eksakte midtpunkter (0,5 og 1,5) avrundes oppover uten at det står noe sted | low | reject | Et fritt drag lander praktisk talt aldri på eksakt 0,5; utfallet er uansett et gyldig trinn. |
| B8 | Testene dekker ikke telefonen: berøringsdrag, WebKit, `pointercancel` i nettleseren og koblingen av hendelsene | medium | patch (med V1, V2) | `pointercancel` og trykkveien uten flytting rettes med V1 og V2. WebKit står allerede i deferred-work.md (bolk 2a). |
| B9 | Drag-sjekken arver tilstand fra sjekkene før | low | reject | Den krever `foer.tekst === "Litt"` og feiler høyt hvis rekkefølgen endres; ingen stille feil. |
| B10+E4 | Pilsjekken på 375×553 dekker bare beste tilfelle: kort tittel, modusen «alle», ingen feilmelding | medium | patch | Marginen er 12–16 px, og en h1 over to linjer (vanlig, f.eks. «Elektromagnetiske bølger og stråling») legger til om lag 32 px, så pilene havner under kanten. Tabellen sier «første kort, begge øvekortsidene», ikke «kort tittel». |
| B11 | Venstrehendt-regelen fra 760 px (`align-self: stretch`) er overflødig nå | low | patch | Direkte sletting; grunnregelen i samme mediespørring gir det samme. |
| B12 | Kommentaren i Oevekort.tsx viser til en `.oevekort-telling`-regel fra 760 px som ikke finnes | low | patch | Oppsettet fra 760 px ligger i Tailwind-klassene i TSX; kommentaren må si det. |
| B13 | EXPERIENCE.md beskriver ikke at et trykk sluppet utenfor uten drag ikke endrer noe | low | patch | Står bare i JSDoc for `smettInn`; design og kode skal si det samme. |
| V1 | Trykkveien uten flytting (iOS Safari) kjøres aldri i komponenten | medium | patch | Forhåndsverifisert: enhetstestene kaller `smettInn` direkte, klikket i midten reddes av `onClick`, og drag-sjekkene har alltid `pos`. Bytter man `ev.target` med `ev.currentTarget`, feiler ingenting. |
| V2 | Avslutning med `pointercancel` kjøres aldri i nettleseren | medium | patch | Forhåndsverifisert: fjernes lytteren, består alt, men håndtaket blir stående mellom trinnene med `step="any"`. |
| V3 | Plasseringen av feilmeldingen på telefon sjekkes bare fra 760 px | medium | patch | Forhåndsverifisert: den globale `order: -1` er fjernet, og plasseringen under 760 px hviler nå på `order` 3/4 i rammen; ingen telefonsjekk setter inn en feil. |
| E3 | Når tellingen brytes over knappene (320 px, 200 %), ligger den kant i kant med «Må øve mer» | low | patch | Direkte retting: litt `row-gap` i flaten under 760 px. |
| E5 | Et brudd på 759,98–760 px der verken telefon- eller PC-reglene gjelder | low | reject | `max-width: 759.98px` er mønsteret i hele globals.css (5 steder), og et vindu med brøkdel-bredde i det intervallet er praktisk talt umulig i bruk. |

## Verification

**Commands:**
- `npx tsc --noEmit` og `npx eslint app maaling` -- expected: 0 feil
- `npm test` (fra PowerShell, aldri full `npx vitest run`) -- expected: alle grønne
- `node maaling/sjekk-tilgjengelighet.mjs` -- expected: alle grønne, med de nye sjekkene
- `LESEVENN_TESTMODUS=les node maaling/demotest.mjs` -- expected: 3/3
- `node maaling/sjekk-readme.mjs` -- expected: alle grønne (bruker glideren)
