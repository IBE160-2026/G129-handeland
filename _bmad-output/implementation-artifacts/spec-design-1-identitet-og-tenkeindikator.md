---
title: 'Designfase bolk 1: identitet (LeseBuddy) og tenkeindikatoren'
type: 'feature'
created: '2026-11-13'
status: 'done'
baseline_commit: 'f680294be86e3a2cec6a45ccf97bf761cfd5066b'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/DESIGN.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/EXPERIENCE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Appen ser ut som en standard Next-mal (Geist, slate, «Lesevenn»), og ventingen på språkmodellen vises bare som «Leser inn…» på knappen. DESIGN.md og EXPERIENCE.md (final) har bestemt ny identitet, LeseBuddy med Pop-paletten, og en tenkeindikator.

**Godkjent:** Arve forhåndsgodkjente alle tre bolkene 13.11 («gjør mest mulig uten meg»). Arbeidet går på grenen `designfase`.

**Approach:** Innfør tokenene fra DESIGN.md i `globals.css` (lys og mørk via `prefers-color-scheme`), de tre skriftene og Quicksand for ordmerket, den nye fokusringen, B-merket som favicon, ordmerke 4d i topplinjen, og bytt navnet utad til LeseBuddy. Lag én felles tenkeindikator (Buddy-brillene med øyne som leser i løkke, og en statusregion) og bruk den overalt der appen venter på et KI-kall.

## Boundaries & Constraints

**Always:**
- Spinene vinner over mockene. Kontrastene er målt for tokenene, så bruk dem uendret.
- Statusregionen (`role="status"`/`aria-live="polite"`) finnes tom før ventingen starter. SVG-en er `aria-hidden`.
- Med `prefers-reduced-motion` står øynene stille, og avslutningen viser B-en direkte.
- Ordmerket er én lenke til `/` med det tilgjengelige navnet «LeseBuddy, forsiden», og delene er skjult.
- Kode, domenebegreper og filnavn beholder Lesevenn. Bare tekst eleven ser endres.

**Never:**
- Ingen arbeidsbord, samling, landingsside eller nye ruter (bolk 2 og 3).
- Ingen endring i logikk, datamodell, generatorer eller migreringer.
- Ingen automatisk nytt forsøk på serversiden («Prøver en gang til …»). Det hører til KI-feilkravene og er utsatt.
- Ingen Gloock inne i appen. Gloock lastes nå, men brukes først på landingssiden.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Venter på KI | Skjema sendt, eller `HentOversettelse` kjører | Brillene med øyne i løkke og statustekst i fet skrift, for eksempel «Buddy finner fagordene …» | N/A |
| Lang venting | Over 30 s | Statusen får tillegget «Dette tar lenger tid enn vanlig. Buddy jobber fortsatt.» | N/A |
| Ferdig, komponenten lever videre | Quizen er rettet | Avslutningen (4,3 s) spilles én gang i indikatorens plass. Statusen sier «Quizen er rettet.» | N/A |
| Feil | Handlingen gir `feil` | Indikatoren forsvinner, og den eksisterende feilmeldingen vises som før | Uendret |
| Redusert bevegelse | `prefers-reduced-motion: reduce` | Øynene står stille, og statusteksten bærer beskjeden | N/A |

</frozen-after-approval>

## Code Map

- `app/globals.css` -- 36 linjer, standard mal. Får tokenene, `@theme`, fokusring og merke-CSS.
- `app/layout.tsx` -- Geist via `next/font/google`, `bg-white text-slate-900`, `title: "Lesevenn"`.
- `app/favicon.ico` -- standard. Erstattes av `app/icon.svg`.
- `app/komponenter/Topplinje.tsx` -- tekstlenke «Lesevenn» + «Hjem» + «Konto». Beholder Hjem og Konto (menyen kommer i bolk 2).
- Venting på KI (alle får tenkeindikatoren):
  - `app/komponenter/Innlesing.tsx:34` `Send` (useFormStatus)
  - `app/komponenter/Samtale.tsx:24` `Send` (har allerede en `aria-live`-tekst)
  - `app/komponenter/Skjemaer.tsx` `Send` og `useTransition` rundt l.151–229 (fagord og etiketter)
  - `app/komponenter/Quiz.tsx:75` `lever()` med `venter`
  - `app/komponenter/Morsmaal.tsx:113` `HentOversettelse`
- Synlig «Lesevenn» som skal bli «LeseBuddy»:
  - `app/handlinger.ts:139,262,516`
  - `Innlesing.tsx:101,181`
  - `Innlesingsrapport.tsx:18`
  - `KontoSkjemaer.tsx:38,71,180`
  - `Overskriftskontroll.tsx:92,105`
  - `Skjemaer.tsx:121,136`
  - `logg-inn/page.tsx:15`
  - `registrer/page.tsx:20`
  - `aktivering/page.tsx:93,112`
  - `gjennomsyn/page.tsx:68`
  - `overskrifter/page.tsx:54`
  - Sjekk også `generatorer/kontrakt.ts` og `generatorer/morsmaal.ts`, men bare feilmeldinger som vises for eleven, ikke prompter.
- Kildekode for merket: `ux-designs/ux-Lesevenn-2026-11-12/mockups/merke.js`, `merke.css` og `merke-tenker.css`. Porter SVG-banene og keyframes uendret.
- Stilen er hardkodet med Tailwind `slate-*` i 30 filer (om lag 480 forekomster), og knappene er `KNAPP`-konstanter.

## Tasks & Acceptance

**Execution:**
- [x] `app/globals.css` -- Tokenene fra DESIGN.md som CSS-variabler med mørke verdier under `@media (prefers-color-scheme: dark)`. Eksponer dem i `@theme` (`bg-flate`, `text-tekst`, `bg-primaer` og så videre). Overstyr `--color-slate-*` i `@theme` med en Pop-tonet nøytral skala (se Design Notes). Legg inn fokusringen fra `{components.focus-ring}`, inkludert `forced-colors`, merke-CSS med tenk- og slutt-keyframes, og `prefers-reduced-motion`.
- [x] `app/layout.tsx` -- `next/font/google`: Atkinson Hyperlegible (400 og 700), Instrument Serif (400, normal og kursiv), Gloock og Quicksand (700), som variabler. Body bruker tokenene `background` og `text`. Metadata får tittelen «LeseBuddy» og en oppdatert beskrivelse. Les `node_modules/next/dist/docs` om fonter og metadata-filer først.
- [x] `app/komponenter/Merke.tsx` (ny) -- `BuddyMerke` med `variant` («ansikt», «b», «briller»), `tilstand` («tenker», «slutt», «ferdig») og størrelse. Porter SVG-en fra `merke.js`. Alltid `aria-hidden`.
- [x] `app/komponenter/Ordmerke.tsx` (ny) -- 4d: «lese» i Instrument Serif kursiv, B-merket (0,9 em, 0,16 em luft før), «uddy» i Quicksand 700 i primærfargen. Lenke til `/` med `aria-label="LeseBuddy, forsiden"`.
- [x] `app/komponenter/Tenker.tsx` (ny) -- `Tenker({ aktiv, status, ferdigStatus? })`. Rendrer alltid statusregionen. Når den er aktiv, vises merket (64 px) i løkke og statusen i fet tekst, og etter 30 s kommer tillegget. Går den fra aktiv til ikke aktiv med `ferdigStatus`, spilles avslutningen én gang, og statusen settes til `ferdigStatus`.
- [x] `app/icon.svg` (ny) og slett `app/favicon.ico` -- B-en statisk (transformene fra `.ferdig`), i primærfarge med markeringsfarge i glassene, og `@media (prefers-color-scheme: dark)` inne i SVG-en.
- [x] `app/komponenter/Topplinje.tsx` -- Ordmerket erstatter tekstlenken. Bakgrunn og kant fra tokenene, minst 64 px høy, og lenkene er minst 44 px.
- [x] `Innlesing.tsx`, `Samtale.tsx`, `Skjemaer.tsx`, `Quiz.tsx`, `Morsmaal.tsx` -- Bytt ventetekstene med `Tenker`. Knappen beholder `disabled` og den korte teksten. Statusteksten følger EXPERIENCE.md Voice and Tone («Buddy finner fagordene …», «Buddy lager det første spørsmålet …», «Buddy leser svaret ditt …», «Buddy retter quizen …», «Buddy oversetter {hva} …»). Fjern dupliserte `aria-live`-avsnitt.
- [x] `KNAPP`-konstanter (KontoSkjemaer, Oevekort, Quiz, Samtale) og primærknapper i `Innlesing`/`Skjemaer` -- `{components.button-primary}`: `bg-primaer text-paa-primaer`, avrunding md, minst 44 px. Fjern lokale `focus:outline-*`, slik at fokusringen i `globals.css` gjelder.
- [x] Filene i Code Map med synlig «Lesevenn» -- bytt til «LeseBuddy».

**Acceptance Criteria:**
- Given lys og mørk systemmodus, when en hvilken som helst side åpnes, then bakgrunnen er `#FFF5F7` / `#0F1226`, brødteksten er Atkinson Hyperlegible, og primærknappene er fiolette (`#6427D6` / `#B79BFF`).
- Given tastaturnavigasjon, when en fylt knapp får fokus, then den viser en 3 px fiolett ring med en ytre ring i bakgrunnsfargen.
- Given en skjermleser, when ordmerket får fokus, then det leses som «LeseBuddy, forsiden», lenke.
- Given at `grep -rn "Lesevenn" app` filtreres til JSX-tekst og strenger som vises for eleven, then er det ingen treff.
- Given at fanen åpnes, then favicon er B-merket.

## Design Notes

- **Slate-overstyringen** er et bevisst grep, slik at hele appen får Pop-tone uten å endre 480 klasser én etter én. Skalaen tones mot tekstfargen: `slate-900` = `#141A3A`, `slate-950` = `#0F1226`, `slate-100` = `#EEF0FF`, `slate-600` = `#5A5670` (dempet), `slate-400` = `#A9AFD3` (dempet mørk), `slate-300` = `#F5DDE5`-nær, og mellomtrinn interpolert. Ved hver erstatning må kontrasten for den samme rollen holde seg på eller over dagens nivå. Bunker og kort som kommer senere, bruker de semantiske tokenene direkte.
- **Avslutningen** spilles bare der komponenten lever videre etter svaret (Quiz, Samtale-svar). Ved `redirect` eller `router.refresh` forsvinner indikatoren, og den nye siden vises. Det er greit i v1.
- **Tokenene i `@theme inline`** peker på `var(--…)`, slik at mørk modus bare bytter variabler.

## Verification

**Commands:**
- `npx tsc --noEmit` -- forventet: ingen feil
- `npm test` -- forventet: alle tester består (385 eller flere)
- `npm run lint` -- forventet: ingen nye feil
- `npm run build` -- forventet: bygget går gjennom (fonter og icon.svg)
- `npm run sjekk:tilgjengelighet` og `npm run sjekk:readme` -- forventet: bestått

**Manual checks:**
- Skjermbilde i lys og mørk modus med Chrome uten vindu (playwright-core) av `/logg-inn` og en tekstside. Kontroller merket og tenkeindikatoren ved å sette `aktiv` i en testside eller lagret svar.

## Review Triage Log

| # | Kilde | Funn | Vurdering | Rute |
|---|---|---|---|---|
| 1 | blind | «Lesevenn» i feilmeldinger i generatorer/ (etiketter, fagsamtale ×2, minnevers, quiz) | medium: grep bekreftet 5 treff, og meldingene vises via Feilmelding | patch |
| 2 | edge, blind | `ferdigStatus` i SvarSkjema spilles aldri, fordi skjemaet avmonteres | low: siden viser SvarSkjema bare for aktiv runde | patch (fjernes) |
| 3 | edge, blind | Quiz-avslutningen spilles utenfor skjermen (scrollTo top) | medium: Tenker står ved knappen nederst | patch |
| 4 | edge | `montert` skjuler indikatoren ved SSR og første tegning | medium: LagQuizAutomatisk viser tom flate til hydrering | patch |
| 5 | edge | font-medium faller til 400 (Atkinson 400/700) | low, direkte retting | patch |
| 6 | edge | B-viewBox klipper streken | low, direkte retting | patch |
| 7 | edge, blind | Ingen PNG- eller ICO-reserve for favicon | low: moderne nettlesere støtter SVG; reserve gir ny flate | defer |
| 8 | edge | Ordmerket bruker skjult tekst, ikke aria-label | false: navnet er det samme, og avviket er bevisst (axe label-content-name-mismatch) | avvist |
| 9 | vgap | Tenker er ikke testet | patch (renderToStaticMarkup-test) | patch |
| 10 | vgap | Den globale fokusringen er ikke verifisert | patch (sjekk i sjekk-tilgjengelighet) | patch |
| 11 | vgap | Mørk modus er ikke kontrastsjekket; slate-500 3,23:1 mot mørk bakgrunn | high: regnet ut, 14 steder uten dark-overstyring | patch |
| 12 | blind | Tenker ved innlesing uten KI-kall; PDF bruker betinget aria-live | medium: avviker fra mønsteret i Skjemaer og fra regionregelen | patch |
| 13 | blind | Feltkanter om lag 1,6:1 (WCAG 1.4.11) | medium: var 1,5:1 før (eldre feil), men bolken stiler feltene om | patch |
| 14 | blind | `.fylt`-ringen bruker bakgrunnsfargen også på andre flater | low, kosmetisk, og følger DESIGN.md | avvist |
| 15 | blind | Knappesystemet halvveis: fare-tokens ubrukt, små knapper under 44 px | medium, men eldre feil utenfor primærknappene | defer |
| 16 | blind | Overskrifter bruker ikke Instrument Serif | medium: DESIGN.md krever det, og fonten var lastet uten å brukes | patch |
| 17 | blind | Ingen tester for Tenker eller Ordmerke | samme som 9 | patch |
| 18 | blind | Aliaser KNAPP = KNAPP_PRIMAER | low, kosmetisk | avvist |
| 19 | blind | Ulike tekster om ventetid | low, tallene er ikke målt | avvist |
| 20 | blind | `.merke .stang` definert to ganger; font-mono faller til standard | low, kosmetisk | avvist |
