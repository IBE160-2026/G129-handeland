---
title: 'Designfase bolk 6: mobilflatene C, D og E, og animasjonsbanene på mobil'
type: 'feature'
created: '2026-11-15'
status: 'done'
baseline_commit: 'e9f5472e02d248f1fd991f5b15e895024830058f'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/DESIGN.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/EXPERIENCE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Arbeidsbordet og landingssiden er tegnet for PC, og på telefonen blir de trange.
- De små bunkene står i to smale kolonner.
- Buddy er borte.
- Viften er et rutenett av kort.
- Fagorddemoen krever rulling som telefonen ikke har høyde til.

**Godkjent:** Arve 15.11 vil ha alle utkastene C, D og E fra runde 10 (`ux-designs/ux-Lesevenn-2026-11-12/.working/runde-10-mini-buddy-og-mobil.html`), med mini-Buddy M1 (dagens tegning, bare mindre). Han ba også om at animasjonsbanene på mobil sjekkes.

**Approach:** Alt gjelder under 760 px. Breddene over er uendret.
- **C:** Buddy (36 px, M1) hilser ved siden av «Hei!» med neste steg i en boble. De små bunkene blir striper i full bredde, med tittelen, framdriften og «N av 5».
- **D:** Viften blir et ark som glir opp fra bunnen, med de fem aktivitetene som rader.
- **E:** Fagorddemoen på landingssiden blir trykkbar. Eleven trykker på et fagord, og forklaringen vises under med Buddy på 30 px ved siden av. Effekt A er av på telefon.

Til slutt sjekkes alle animasjonsbanene på 375 px.

## Boundaries & Constraints

**Always:**
- **C:**
  - Stripene er fortsatt bunker i `<ul>`, med samme knapp og navn («Vis aktiviteter for {tittel}»). Uten JavaScript er de lenker til `/oppgaver`.
  - Buddy og boblen er `aria-hidden`, som Buddy på bordet i dag.
  - Titlene brytes bare mellom ord.
- **D:**
  - Arket er den samme dialogen: `role="dialog"`, `aria-modal`, `inert` på resten, fokus på første rad, og Esc eller «Legg sammen» lukker.
  - Radene er lenker eller låste elementer etter de samme reglene som kortene.
  - Arket glir opp med `{motion.fan}`, og ved redusert bevegelse står det bare der. Det dekker aldri «Legg sammen».
  - Arket er aldri høyere enn 90 % av skjermen. Er det høyere, ruller arket, ikke siden.
- **E:**
  - Den statiske versjonen (alle fire markert og `<dl>`) er fortsatt grunnlaget, uten JavaScript og ved redusert bevegelse.
  - Med JavaScript på telefon er fagordene knapper (`aria-expanded`, `aria-controls`) som viser forklaringen i et panel under teksten. `<dl>` skjules da visuelt, men forklaringen står i panelet.
  - Ingen `aria-live`. Det tomme feltet fra bolk 4 må ikke komme tilbake.
- **Animasjonsbanene:** Ingen bevegelse går utenfor skjermen eller lager sidelengs rulling. Ingenting klippes, verken stenger, B-en, boblen eller arket. Overgangene er av ved redusert bevegelse.

**Never:**
- Ingen sveip eller dragging (EXPERIENCE: ingen sveip). Arket lukkes med knapp, Esc eller trykk på bakgrunnen.
- Ingen endring i reglene for neste steg, statusene eller sist aktiv.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Bord på telefon | 375 px, 5 tekster | Buddy og boble, hovedbunken, og fire striper i full bredde | N/A |
| Åpne bunke | Trykk på en stripe | Arket glir opp med fem rader. Fokus på den første | N/A |
| Låst tekst | `innlest` | Fire låste rader med «Låst. Åpnes når du har lest teksten.» | N/A |
| 200 % tekst | 375 px | Arket ruller internt, og siden ruller ikke sidelengs | N/A |
| Demo på telefon | Trykk på «mitose» | Forklaringen vises under teksten med Buddy. Fokus blir på ordet | N/A |
| Uten JS | Telefon | Den statiske demoen med alle fire forklaringer | N/A |

</frozen-after-approval>

## Code Map

- `app/komponenter/Arbeidsbord.tsx` -- bunkene, viften (`maal`, `rundt` og `rutenett`) og `vifteplass.ts`. På telefon blir oppsettet `ark` i stedet for `rutenett`.
- `app/globals.css` -- `@container bord`-reglene og `.bunke`, `.vifte*`, `.ls-*`. Buddy på bordet er skjult under 760 px i dag.
- `app/page.tsx` -- hilsenen «Hei!» og hovedbunken.
- `app/komponenter/Landingsside.tsx` og `LandingEffekter.tsx` -- demoen og effekt A.
- `app/komponenter/Fagord.tsx` -- mønsteret for knapp og forklaring i lesevisningen. Gjenbruk oppførselen, ikke nødvendigvis komponenten.
- `app/komponenter/Merke.tsx` -- `BuddyMerke` med `mini` fra bolk 5. Størrelsene (30 og 36 px) er høyden på brillene, slik bolk 5 definerte dem. Effekt A på telefon ble i bolk 4 gjort om til ordene som tennes uten klistring, og den erstattes nå av trykkdemoen.
- `maaling/sjekk-tilgjengelighet.mjs` -- telefonsjekkene for bordet og viften. `data-oppsett === "rutenett"` blir `"ark"`.

## Tasks & Acceptance

**Execution:**
- [x] `app/page.tsx`, `Arbeidsbord.tsx` og `globals.css` -- C: Buddy og boble ved hilsenen, og stripene under 760 px.
- [x] `Arbeidsbord.tsx` og `globals.css` -- D: oppsettet `ark` med rader og animasjon.
- [x] `Landingsside.tsx`, `LandingEffekter.tsx` og `globals.css` -- E: trykkdemoen på telefon.
- [x] `DESIGN.md` og `EXPERIENCE.md` (Responsive & Platform og Component Patterns: Viften, Bunke og Rulleeffekter) -- oppdater med C, D og E.
- [x] `maaling/sjekk-tilgjengelighet.mjs` -- telefon:
  - arket: fokusfelle, Esc og axe, og at arket ikke er høyere enn skjermen
  - stripene: ingen ord delt, med `ingenDelteOrd` ved 375 px og ved 320 px med 200 % tekst. Sistnevnte ble tatt ut i bolk 4 og skal tilbake her
  - demoen: trykk viser forklaringen, axe, og uten JS
- [x] Animasjonsbanene -- et skript (scratchpad) som tar filmstriper på 375 px av: tenkeindikatoren (løkken og avslutningen), viften eller arket som åpnes, effekt C på landingssiden, Buddy-hilsenen og B-en i ordmerket. Se på hver frame og rett det som klippes eller går utenfor.

**Acceptance Criteria:**
- Given 375 px, when eleven åpner en bunke, then glir arket opp, og ingen del av det eller av «Legg sammen» er utenfor skjermen.
- Given filmstripene på 375 px, then er ingen animert del klippet eller utenfor skjermen i noen frame.

## Verification

**Commands:**
- `npx tsc --noEmit`, `npm test`, `npm run lint` og `npm run build` -- forventet: grønt
- `npm run sjekk:tilgjengelighet` -- forventet: bestått

**Manual checks:**
- Filmstripene og skjermbilder av bordet, arket og landingsdemoen på 375 px, i lys og mørk modus.

## Review Triage Log

| # | Kilde | Funn | Vurdering | Rute |
|---|---|---|---|---|
| 1 | blind, edge | Trykk inne i arket lukker det | medium: bryter mot spesifikasjonen (bare bakgrunnen) | patch |
| 2 | blind | Kommentaren om gutter-mobile siterer feil token | low, direkte retting | patch |
| 3 | blind, vgap | Ingen sjekk av at siden ruller igjen etter at arket er lukket | patch | patch |
| 4 | blind | Fokus tilbake er bare testet for Esc | patch | patch |
| 5 | blind | Bakgrunnstrykket bruker en hardkodet koordinat | low, direkte retting | patch |
| 6 | blind | Trykkdemoen er testet med bare ett trykk; valgt blir stående | patch | patch |
| 7 | blind | 320 px og 200 % er ikke sjekket for klipping og sidelengs rulling | patch | patch |
| 8 | blind | Håndlaget sr-only i bunke-paabegynt og et bredt clipPath-unntak | low, direkte retting | patch |
| 9 | blind | Brytepunktet står hardkodet i flere JS-filer | low | patch (delt modul) |
| 10 | blind, vgap | Kappløp og DOM-bytte når bredden krysser 760 px | medium, ikke verifisert: bare ved rotasjon over brytepunktet | defer |
| 11 | blind | Dobbel CSS-regel og død klasse | low, direkte retting | patch |
| 12 | blind | Filmstripene ligger ikke i repoet | low: manuell kontroll etter spesifikasjonen, skriptene ligger i scratchpad | avvist |
| 13 | blind, vgap | Pilen og elementene som bare er for telefon, er ikke sjekket på 1280 px | patch | patch |
| 14 | edge | Tegnsetting stikker ut ved 200 % tekst | medium | patch |
| 15 | edge | overflow:hidden på html stopper ikke rulling i eldre iOS | medium | patch |
| 16 | edge | Ingen Buddy mellom 760 og 874 px | medium | patch |
| 17 | edge | Arket animeres på nytt etter rotasjon | low | avvist (hører til #10) |
