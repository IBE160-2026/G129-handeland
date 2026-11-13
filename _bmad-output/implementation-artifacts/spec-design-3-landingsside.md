---
title: 'Designfase bolk 3: landingssiden (FR-47)'
type: 'feature'
created: '2026-11-13'
status: 'done'
baseline_commit: '3330e9afd17ffe24bafd3ff8da1b3de5d6f8a5d1'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/DESIGN.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/EXPERIENCE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Den som ikke er innlogget og åpner `/`, sendes rett til innloggingen og får aldri vite hva LeseBuddy er. FR-47 krever en landingsside for elev og lærer.

**Godkjent:** Arve forhåndsgodkjente alle tre bolkene 13.11. Arbeidet går på grenen `designfase`.

**Approach:** `/` sjekker økten uten å kaste. Uten innlogging vises landingssiden, og med innlogging arbeidsbordet (bolk 2). Landingssiden er statisk HTML fra serveren med hero, «Slik hjelper Buddy deg» (før, mens og etter), en fagorddemo, morsmålsdelen og «For lærere», og med «Logg inn» og «Registrer deg». Rulleeffektene A, B og C legges oppå bare når JavaScript kjører og bevegelse er tillatt.

## Boundaries & Constraints

**Always:**
- Tekstene i EXPERIENCE.md, under Voice and Tone («Hovedteksten på landingssiden»), brukes ordrett. Hero i Gloock (`{typography.display}`), seksjoner i `{typography.display-md}`. Markeringstusjen brukes høyst én gang per skjerm.
- Den statiske versjonen er grunnlaget: alle steg synlige, alle fire Faguttrykk i eksempelteksten markert, og forklaringene i en `<dl>` under teksten. Effekt A har ingen `aria-live`, og den klistrede visningen slås av når flaten er høyere enn synsfeltet. Følge-Buddy og boblene er `aria-hidden` og vises bare fra 760 px og ved vanlig tekststørrelse.
- `prefers-reduced-motion` og manglende JavaScript gir den statiske versjonen.
- Én `h1`. Demoen har overskriften «Se hvordan Buddy markerer fagord».
- AD-8: øktsjekken lages i `data/konto.ts`, det eneste stedet en `Tilgang` lages, som en variant som gir `null` i stedet for å kaste. `tilgang()` er uendret.
- Siden sier at registrering krever en kode fra læreren: «Har du fått en kode fra læreren? Da kan du registrere deg.»

**Never:**
- Ingen KI-kall og ingen data på landingssiden. Eksempelteksten er hardkodet.
- Ingen endring av innlogging eller registrering (FR-35), utover lenker og tekst.
- Ingen lærerkoder. Hvordan en lærer får koder, er et åpent punkt.
- Ingen nye avhengigheter for rulleeffektene. Bruk IntersectionObserver og rAF.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Ikke innlogget | `/` uten økt | Landingssiden, ikke en omdirigering | N/A |
| Innlogget | `/` med økt | Arbeidsbordet | N/A |
| Uten JS eller redusert bevegelse | Statisk | Alt innhold synlig. Demoen har alle fire fagord markert og `<dl>` med forklaringene | N/A |
| Telefon | Under 760 px | Én kolonne, ingen Følge-Buddy, ingen vannrett rulling ved 320 px | N/A |
| Øktoppslag feiler | Feil i auth-kallet | Landingssiden vises, som for en utlogget | Feilen logges. Ingen 500 |

</frozen-after-approval>

## Code Map

- `data/konto.ts:31` `tilgang()` kaster via `redirect`. Legg til `valgfriTilgang(): Promise<Tilgang | null>` ved siden av, med samme `hentOekt()` og try rundt kallet.
- `app/page.tsx` -- (etter bolk 2) arbeidsbordet med `await tilgang()`. Gjør den til en gren: `valgfriTilgang()`, og `null` gir `<Landingsside />`. Ellers bygges arbeidsbordet som før, med Tilgang-objektet.
- `app/komponenter/Merke.tsx` og `Ordmerke.tsx` -- fra bolk 1. Brilleansiktet til heroen og Følge-Buddy.
- `app/globals.css` -- tokenene og `.merke`-klassene. Legg til landingsstiler der, eller i komponentene.
- `app/layout.tsx` -- Gloock er lastet som variabel i bolk 1.
- `app/logg-inn/page.tsx` og `app/registrer/page.tsx` -- målet for knappene.
- Topplinjen: «For lærere» er en lenke til `#laerere` som vises bare på landingssiden og fra 760 px.
- Visuell referanse: `ux-designs/ux-Lesevenn-2026-11-12/mockups/landingsside-1.html` (hero over hele bredden, effektene A, B og C, Følge-Buddy). Spinene vinner ved konflikt. Mocken bruker en `<template>`-feil for SVG. Bruk React-komponentene.

## Tasks & Acceptance

**Execution:**
- [x] `data/konto.ts` -- `valgfriTilgang()`.
- [x] `app/page.tsx` -- grenen mellom landingsside og arbeidsbord.
- [x] `app/komponenter/Landingsside.tsx` (ny, serverkomponent) -- den statiske siden med alle seksjoner, tekstene og CTA-ene.
- [x] `app/komponenter/LandingEffekter.tsx` (ny, klient) -- effekt A (fagordene markeres ett og ett mens forklaringen ved siden av skifter), B (Følge-Buddy nede i hjørnet etter heroen, øyne i takt med rullingen og bobler som ekko av seksjonsoverskriftene) og C (stegene dukker fram mens en linje tegnes). Alle tre slås av ved redusert bevegelse og på smal skjerm eller stor tekst der spinene sier det.
- [x] `app/komponenter/Topplinje.tsx` -- «For lærere» og «Logg inn» når det ikke finnes noen økt. Bruk `valgfriTilgang` i en serverdel, eller send en prop fra siden. Gjør det enkleste som ikke gjør 404-siden avhengig av databasen. Ellers skal det stå bare på landingssiden.
- [x] `metadata` for `/` -- tittel og beskrivelse som forklarer LeseBuddy.
- [x] `maaling/sjekk-tilgjengelighet.mjs` -- axe på `/` uten innlogging i lys og mørk modus, og med `reducedMotion`.

**Acceptance Criteria:**
- Given at eleven ikke er innlogget, when hun åpner `/`, then får hun 200 med landingssiden og lenkene «Logg inn» og «Registrer deg».
- Given at JavaScript er slått av, then er alle stegene, alle fire markerte fagordene og forklaringslisten synlige.
- Given en skjermleser, then hører den ingen bobletekster fra Følge-Buddy og ingen live-kunngjøringer fra effekt A.
- Given 320 px bredde og 200 % tekst, then ruller siden ikke sidelengs.

## Verification

**Commands:**
- `npx tsc --noEmit`, `npm test`, `npm run lint` og `npm run build` -- forventet: grønt
- `npm run sjekk:tilgjengelighet` -- forventet: bestått, inkludert landingssiden
- `npm run demotest` -- forventet: bestått. Innloggingen starter nå fra landingssiden. Oppdater stegene hvis de forventet en omdirigering.

**Manual checks:**
- Skjermbilder (playwright-core uten vindu) av `/` utlogget på 1280 og 375 px, i lys og mørk modus, med og uten `reducedMotion`, og med JavaScript slått av.

## Review Triage Log

| # | Kilde | Funn | Vurdering | Rute |
|---|---|---|---|---|
| 1 | blind, edge, vgap | Landingsmetadata gjelder også det innloggede arbeidsbordet | low, synlig i fanen | patch |
| 2 | blind | Faktafeil i demoteksten («46 i hver celle», mutasjon ved deling) | medium: feil fagstoff i en læringsapp | patch |
| 3 | blind | «For lærere» ender uten neste steg | medium: blindvei (§5) | patch (én setning om invitasjon, ingen lærerkoder) |
| 4 | blind, edge | Klistreflaten måles én gang med forklaringene skjult; lengde blafrer; høyde og tekststørrelse fanges ikke | medium | patch |
| 5 | blind | Regelen for redusert bevegelse taper på spesifisitet; fagordene nullstilles ikke | medium | patch |
| 6 | blind | Følge-Buddy dekker tekstkolonnen mellom 760 og 1300 px (2.4.11) | medium | patch |
| 7 | blind | Ingen @media print | low, direkte retting | patch |
| 8 | blind | valgfriTilgang svelger feil også for innloggede | false mot intensjonen: matrisen sier «landingssiden vises, feilen logges, ingen 500» | avvist |
| 9 | edge | /logg-inn gir 500 under samme driftsfeil | medium, eldre feil (innloggetEpost uten vakt) | defer |
| 10 | blind | valgfriTilgang dupliserer hentOekt | low, direkte retting | patch |
| 11 | blind | Ingen test for at unstable_rethrow slipper gjennom Next-kast | patch | patch |
| 12 | blind | Kontekstene i sjekkskriptet lukkes ikke | low, direkte retting | patch |
| 13 | blind, vgap | Ingen sjekk av at klistringen slås av når flaten er for høy | patch | patch |
| 14 | blind, edge | Kontrastmodus: linjen i effekt C og fagordene i effekt A | medium | patch |
| 15 | blind | Gloock med preload: false som heroskrift | low, direkte retting | patch |
| 16 | blind | eslint-ignore hører ikke til bolken | low: ufarlig og gjør lint grønn | avvist |
| 17 | vgap | Ingen sjekk av at landingsmenyen er skjult på appsider | patch | patch |
| 18 | vgap | Redusert bevegelse slått på mens siden er åpen er ikke sjekket | patch | patch |
| 19 | edge | MediaQueryList.addEventListener mangler i Safari < 14 | low, gammel nettleser | avvist |
| 20 | edge | C slås ikke av på smal skjerm eller ved stor tekst | false: spinene begrenser bare B (og A ved høyde) | avvist |
