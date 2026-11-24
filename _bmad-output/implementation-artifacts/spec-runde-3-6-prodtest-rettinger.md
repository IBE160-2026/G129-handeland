---
title: 'Runde 3, bolk 6: rettinger etter prodtesten av bolk 4 og 5'
type: 'bugfix'
created: '2026-11-24'
status: 'done'
baseline_commit: '002b6abbd3a1d37df967442a89d10678cdc54fa0'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/DESIGN.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/EXPERIENCE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Arve testet bolk 4 og 5 i prod 24.11 (main 002b6ab). Han fant tre feil:
- Punkt 6: et musedrag fra knappene på tekstraden flytter raden likevel.
- Punkt 7: slippes raden på søkefeltet, settes lenken inn i feltet.
- Punkt 15: etter at han valgte et tekstkort i mappeviften, så han ikke hvor fokus var.

Han ønsket også seks forbedringer:
- Tydeligere korttyper i mappeviften.
- Mer luft i Samlinger.
- Tydeligere at radene kan dras.
- En mer fremhevet melding etter slipp.
- En dempet toppmeny når viften er åpen.
- Et enklere skjema for ny mappe.

**Approach:** Én oppfølgingsbolk på grenen `prodtest-runde-3`. Den retter feilene og legger inn ønskene i Samlinger, i viften og i topplinjen. Det kommer ingen ny datamodell og ingen migrasjon.

**Avgjort av Arve 24.11:**
- **Kortfarger: to farger, bare i mappeviften.** Tekstkortene (`.kort-tekst`) får en lilla flate. «Øvekort for hele mappen» og «Quiz for hele mappen» (`.kort-samlet`) får en rosa flate. Tekstens fem aktivitetskort er uendret.
- **Dra-tegn: grep-ikon, hover og setning.** Hver dragbar rad får et grep-ikon (⠿, `aria-hidden`) til venstre og en markeringsflate ved hover. Over tekstene står «Dra en tekst til en mappe.». Alt dette vises bare når draget er på, altså fra 760 px og med minst én mappe.
- **Lengden beholdes.** Spesifikasjonen er på rundt 2000 tokens og deles ikke.

## Boundaries & Constraints

**Always:**
- «Legg i mappe» er fortsatt veien for tastatur, skjermleser og telefon.
- Forskjeller vises aldri bare med farge, men også med tekst og form.
- Begge temaene og kontrastmodus skal virke.
- Fargene kommer fra `--lb-*`-tokens.
- `prefers-reduced-motion` respekteres.
- Dokumentene oppdateres og dateres 24.11.

**Never:**
- Ingen bibliotek for dra og slipp.
- Ingen endring i reglene i `leggTilTekst` eller `tolkTittel`.
- Ingen endring i bordets gruppering fra bolk 5.
- Innholdet på mappesidene endres ikke.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Drag fra knappene | 1280 px, musedrag som starter på «Legg i mappe» (summary), valget, «Legg i mappen» eller «Slett» | Ingen rad dras. Ingen mappe endres. | N/A |
| Drag fra tittellenken | Raden dras fra lenken og slippes på søkefeltet eller mappenavnfeltet | Ingenting settes inn i feltet | N/A |
| Drag fra tittellenken til en mappe | Som over, men slippes på en mappe | Teksten legges i mappen som før | N/A |
| Velg tekst med mus | Klikk på et tekstkort i mappeviften | Første aktivitetskort har fokus med synlig ring. Det samme gjelder tekstkortet etter «Tilbake til mappen». | N/A |
| Langt mappenavn | Navnet på ny mappe får 81 tegn eller mer | Feltet tar imot teksten. Under feltet står det at navnet er for langt, og hvor mange tegn det har. Sendes skjemaet likevel, gir serveren `MAPPE_AVVIST.langTittel`. | Feilmelding |
| Viften åpen | Mappe eller tekst åpnet på bordet | Ordmerket og menyen i topplinjen er synlig dempet. De kan ikke nås, som før. | N/A |

</frozen-after-approval>

## Code Map

- `app/komponenter/DraTilMappe.tsx`:
  - `DragbarTekst`: `onDragStart` sjekker `e.target.closest(".tekstrad-knapper")`. For knapper er `e.target` den dragbare `<li>`, så sjekken slår aldri til (punkt 6). Huskes ved `pointerdown`, og sjekkes i dragstart.
  - Lenken er selv dragbar, og nettleseren legger URL-en i `text/plain` og `text/uri-list` (punkt 7). Rettes med `clearData()` før `setData(TYPE, …)`.
  - `Slippmelding` har hinten og meldingen `role="status"` (`.slippmelding`).
- `app/samling/page.tsx`:
  - `DragbarTekst`-raden: tittellenken `LENKE`, `.tekstrad-knapper`.
  - `Mapper` (`#mapper`) og `NyMappeSkjema`.
- `app/komponenter/Mappeskjemaer.tsx`:
  - `NyMappeSkjema`, linje 52–77: hjelpeteksten `${id}-hjelp`, `maxLength`.
  - `NyttNavnSkjema` har også `maxLength` og får samme oppførsel.
  - `LeggIMappeSkjema`: status `<p role="status">` på linje 215. Den får samme fremheving som `.slippmelding`.
  - `lagtIMeldingen` er uendret.
- `data/mappegrenser.ts`: `MAPPEGRENSER.tittel` (80) og `MAPPE_AVVIST.langTittel`. Gjenbrukes, endres ikke.
- `app/komponenter/Arbeidsbord.tsx`:
  - `velgTekst`/`tilbakeTilMappen` og effekten som flytter fokus (`nyttFokus`, `FOERSTE_KORT`).
  - Fokus flyttes allerede. Etter et museklikk viser `:focus-visible` ingen ring, så eleven ser ikke fokus.
  - `.kort-tekst` og `.kort-samlet` er tekstkortene og de samlede kortene.
  - Effekten som setter `inert` på søsken, også `<header>`.
- `app/komponenter/Topplinje.tsx`: `<header>` → `nav` med `Ordmerke` og `.meny-app`.
- `app/globals.css`:
  - `.samling-oppsett`, rundt linje 2530, med `column-gap: 2rem`.
  - `.kort`, `a.kort:focus-visible`, `.kort-ikon` og `.kort-tekst .kort-navn`, rundt linje 1390–1450.
  - Arket, rundt linje 1675.
  - Tokens på linje 31–68.
- `maaling/sjekk-tilgjengelighet.mjs`:
  - Bolk 4-blokken: dra og slipp, med hydrering på `[data-dra]`.
  - Bolk 5-blokken, linje 1270–1420: `synligFokus` og valg med tastatur.

## Tasks & Acceptance

**Execution:**
- [x] `app/komponenter/DraTilMappe.tsx`:
  - Husk om `pointerdown` skjedde i `.tekstrad-knapper`, og avbryt dragstart da.
  - Kjør `clearData()` før `setData`, og sett `draggable={false}` på tittellenken mens draget er på.
  - Gi meldingen en fremhevet boks når den har innhold.
- [x] `app/samling/page.tsx` + `app/globals.css`:
  - Større `column-gap`, 3 rem fra 760 px og 4 rem fra 1024 px.
  - Dra-tegnet slik det er avgjort: grep-ikon, hover og setning.
  - Boksen for meldingen: ikon, fet skrift, kant og flate.
- [x] `app/komponenter/Mappeskjemaer.tsx`:
  - Fjern hjelpeteksten.
  - Plassholderen er «Eks. Samfunnsfag: demokrati».
  - Fjern `maxLength`.
  - En levende melding med `aria-invalid` når navnet er over 80 tegn.
  - Det samme i `NyttNavnSkjema`, men uten plassholder.
  - Statusmeldingen i «Legg i mappe» får samme boks.
- [x] `app/komponenter/Arbeidsbord.tsx` + `app/globals.css`:
  - Fokus som flyttes ved nivåbytte, får en synlig ring også etter et museklikk.
  - Kortfargene slik det er avgjort: to farger, bare i mappeviften.
  - Når viften er åpen, dempes `header[inert]` (opasitet, `cursor: default`), og det virker også i kontrastmodus.
- [x] `maaling/sjekk-tilgjengelighet.mjs`:
  - Musedrag fra «Legg i mappe» og «Slett» endrer ikke antallet.
  - Drag fra tittellenken til søkefeltet etterlater feltet tomt.
  - Museklikk på et tekstkort gir fokus på første aktivitetskort med synlig ring, og det samme etter «Tilbake».
  - Topplinjen er dempet mens viften er åpen.
  - 81 tegn gir meldingen.
  - axe i lys og mørk modus.
- [x] `EXPERIENCE.md`, `DESIGN.md` og `deferred-work.md` (lukk det som er dekket): datert 24.11.

**Acceptance Criteria:**
- Gitt Samlinger på 1280 px, når Arve gjentar punkt 6 og 7 med ekte mus, endres ingenting.
- Gitt en elev uten mapper, når Samlinger vises, finnes ingen dra-tegn.
- Gitt skjermleser, når navnet blir for langt, leses meldingen én gang. Feltet er merket ugyldig.

## Verification

**Commands:**
- `npx tsc --noEmit` og `npx eslint app data`: ingen feil.
- `npm test`, kjørt fra PowerShell: alt bestått.
- `npm run sjekk:tilgjengelighet` og `npm run sjekk:readme`: alt bestått.
- `npm run demotest` med `LESEVENN_TESTMODUS=les`: bestått uten modellkall.

**Manual checks:**
- Arve prøver punkt 6, 7 og 15 på nytt i prod med ekte mus.

## Implementation Notes

- Implementert av underagent 24.11.
  - Punkt 6: `pointerdown` huskes i `DragbarTekst`.
  - Punkt 7: `Tekstlenke` med `draggable={false}`, og `clearData()` i dragstart.
  - Punkt 15: `data-fokus-flyttet` med `.vifte [data-fokus-flyttet]:focus`.
  - Nye deler: tokenet `--lb-lilla`, `Meldingsboks`, `Navnefelt` og `Drahint`.
  - Sjekker før gjennomgangen: tilgjengelighet 567/567, npm test 796/796, demotest 3/3, README 9/9.
- deferred-work.md er ikke endret, fordi bolken ikke dekker noen av de åpne punktene.

## Spec Change Log

## Review Triage Log

| # | Lag | Funn | Verdikt | Begrunnelse | Rute |
|---|---|---|---|---|---|
| 1 | verif | Fargene og formene på arket på 375 px sjekkes ikke | medium | Gap verifisert av laget. Sjekken av kortfargene kjører bare på 1280 px. | patch (sjekk på 375 px) |
| 2 | verif, blind | «Gi mappen nytt navn» med `Navnefelt` sjekkes ikke | medium | Ingen sjekk besøker skjemaet for nytt navn | patch (sjekk på /mappe/{id}) |
| 3 | blind, edge, verif | Et navn serveren avviser, slettes. Etter remount er fokus borte, og ingen sjekk leser feltet etterpå. | medium | Når handlingen er ferdig, nullstiller React feltet, og `key` lager det på nytt. Teksten eleven skulle korte ned, og fokus forsvinner. | patch (kontrollert felt i stedet for key/onReset, og sjekk etter avvisning) |
| 4 | verif | Ikonet «i» for «uendret» sjekkes ikke | low | Bare «✓» blir sjekket | patch (én linje) |
| 5 | blind, verif | I kontrastmodus har topplinjen fortsatt opasitet 0,35 i tillegg til GrayText. Sjekken krever opasitet ≤ 0,5 og sjekker ikke GrayText. | medium | `opacity` gjelder også i forced-colors, så kontrasten i elevens eget tema blir om lag en tredjedel | patch (`opacity: 1` i forced-colors, og sjekk av GrayText) |
| 6 | verif | Sjekkene av punkt 6 og 7 viser ikke at draget faktisk startet | medium | Sjekkene består også hvis `draFra` aldri starter et HTML5-drag | patch (positiv kontroll med samme `draFra`) |
| 7 | blind, edge | Fokus flyttet etter museklikk har ring, men ikke `scale(1.06)` som `:focus-visible` har | low | Samme fokus ser ulikt ut | patch (samme selektorgruppe) |
| 8 | blind | Merket brukes bare ved nivåbytte, ikke når viften åpnes med musa (første kort) eller lukkes (bunkeknappen). DESIGN.md beskriver det generelt. | low | Fokus flyttes av koden også der, uten ring etter museklikk | patch (felles hjelper i alle tre flyttene, og selektoren også for `.bunke-knapp`) |
| 9 | blind | Grensen sies ikke før den er brutt | false | Arve ba uttrykkelig om at det ikke skal stå noe om grensen | avvist |
| 10 | blind | «Dra en tekst til en mappe.» leses opp for skjermlesere, men er en instruks bare for mus | low | `Slippmelding` nevner alternativet, det gjør ikke Drahint | patch (`aria-hidden`) |
| 11 | blind | Tekstlisten hopper ved hydrering (Drahint, grep-ikonet og padding) | low | Det er én linje og litt innrykk ved lasting. En retting måtte vise en dra-instruks uten JS eller endre oppsettet uten JS. | avvist (kosmetisk, notert) |
| 12 | blind | De to kortflatene er like lyse (1,00:1). Det står ikke i DESIGN.md. | low | Stripen og den doble kanten bærer forskjellen, og det bør stå | patch (én setning i DESIGN.md) |
| 13 | blind | `data-slag` brukes ikke i CSS. «Venter» ser ferdig ut, og «→» leses som «gå videre». | low | Tre slag har samme utseende | patch (dempet stil for venter og uendret, og «…» som venteikon) |
| 14 | blind | Komponenttokenene i DESIGN.md er prosa | low | Ingenting leser dem maskinelt, så ingen kaller divergerer | avvist |
| 15 | blind | Raden «Smalere enn 760 px» i EXPERIENCE.md nevner ikke farger på arket | low | Dokumentene er ikke samkjørt | patch |
| 16 | blind | Faste `waitForTimeout` i de nye sjekkene | low | Samme mønster som resten av skriptet, og de har ikke vært ustabile | avvist |
| 17 | blind | Punkt 7-sjekken legger inn en tekst med rå SQL | low | Skriptet og demotesten bruker allerede SQL mot testkontoen | avvist |
| 18 | blind | Tomt `<p class="navnelengde mt-1">` gir luft under hvert navnefelt | low | Margen står selv når avsnittet er tomt | patch (margen bare når det ikke er tomt) |
| 19 | edge | En verdi satt før hydrering gir ingen advarsel før neste tast | low | Løses av at feltet blir kontrollert (#3) | patch (i #3) |
| 20 | edge | Uten draget (ingen mapper eller under 760 px) kan lenken dras inn i søkefeltet | low | Vanlig nettleseroppførsel for lenker, og ikke feilen Arve fant (der var draget på) | avvist |
| 21 | edge | Blir vinduet uskarpt, fjernes merket, og ringen er borte når eleven kommer tilbake | low | Sjeldent, og fokus står fortsatt riktig | avvist |
| 22 | edge | Feiler `focus()`, blir merket liggende | low | Elementet er synlig og ikke inert når effekten kjører. Teoretisk. | avvist |

**Sluttsjekk etter gjennomgangen (24.11):** 22 funn er vurdert. 13 er rettet, 9 er avvist, og ingenting er utsatt. Resultater:
- `tsc` og eslint: ingen feil.
- npm test: 796/796.
- Tilgjengelighet: 574/574.
- Demotest: 3/3, i lesemodus.
