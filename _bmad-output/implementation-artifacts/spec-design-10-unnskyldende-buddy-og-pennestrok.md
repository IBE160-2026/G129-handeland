---
title: 'Design runde 2, bolk 10: unnskyldende Buddy i gjennomsynet og rosa pennestrøk under tekstnavnet'
type: 'feature'
created: '2026-11-18'
status: 'done'
baseline_commit: '0753e833038ab4484580ebed4325491eb16fb875'
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
- [x] `Merke.tsx`, `globals.css` -- det unnskyldende uttrykket
- [x] `gjennomsyn/page.tsx` -- Buddy i merknaden
- [x] felles tusj-komponent eller -klasse, landingssiden og sidetitlene
- [x] `maaling/sjekk-tilgjengelighet.mjs` -- sjekkene over
- [x] DESIGN.md, EXPERIENCE.md

**Acceptance Criteria:**
- Given en tekst lest fra bilder, when gjennomsynet åpnes, then står Buddy med blikket ned og bekymrede bryn i merknaden, og med redusert bevegelse står Buddy stille.
- Given quizsiden for «Bedrift», when den åpnes, then har «Bedrift» i overskriften et rosa, ujevnt tusjstrøk bak den nederste delen, og overskriften leses som «Quiz: Bedrift».
- Given landingssiden, when den åpnes, then har «leser» det samme strøket som sidetitlene.

## Implementation Notes

- Byggeagenten stoppet i verifiseringen (18.11). Hovedøkten fullførte. Den nye sjekken av quizen på 320 px med 200 % tekst fant sidelengs rulling som ikke kom av strøket: `fieldset` er som standard min-content bred, og svaralternativene i quizen er flex-barn uten `min-w-0`. Rettet med en felles regel for `fieldset`/`legend` i globals.css og `min-w-0 [overflow-wrap:anywhere]` på alternativene i Quiz.tsx.

## Spec Change Log



## Review Triage Log

Runde 1 (18.–19.11): Blind Hunter (B), Edge Case Hunter (E) og Verification Gap (V).

| Funn | Vurdering | Bevis / rute |
|---|---|---|
| B1 DESIGN.md-frontmatteren er ugyldig YAML | medium | js-yaml stoppet på `brow`. patch, validert |
| B2 Brynene er svake i mørk modus (ca. 2:1 mot lyse glass) | medium | patch: som pupillene i mørk modus, sjekket per modus |
| E3/B5 Løse tegn («–») får eget strøk | low | patch: bare ord med bokstaver eller tall, enhetstest |
| E4/B5 Hardt mellomrom deles | low | patch: deler bare på vanlige mellomrom, enhetstest |
| E5/B6 Forsinkelsen per ord har ikke noe tak | low | patch: høyst 4 × 0,12 s, enhetstest |
| E1/E2 Tab-sjekken: feil vurdering av ett kort | low | patch: «Forrige» låst og «Ferdig» |
| E8/B9 Kommentaren for øvekortene er utdatert | low | patch |
| V1/B9 Snudd kort: Tab-rekkefølgen er ikke sjekket | medium | patch: nettlesersjekk |
| V2/B11 Konto: navnene og beskrivelsene er ikke sjekket; utseende uten beskrivelse | low | patch: `aria-describedby` på utseende, og sjekk |
| V3/B7 Tusjen med redusert bevegelse og kontrastmodus er ikke sjekket | medium | patch: nettlesersjekk |
| V4 Langt ord i et quizsvar er ikke sjekket | low | patch: nettlesersjekk |
| V5/B10 Brynenes animasjon er ikke sjekket | low | patch |
| B13 EXPERIENCE beskriver ikke tusjen | low | patch: egen rad |
| E6/E7 Sjekkene kan krasje på null | low | Gir en feil i kjøringen i stedet for en rød sjekk; begge synes. Avvist |
| B3 Skjermlesernavnet er bare sjekket i Chrome | low | Tas med i telefontesten (VoiceOver). Utsatt |
| B4 Bare quizsiden og landingssiden er sjekket for tusjen | low | Samme komponent på alle titler. Avvist |
| B8 Merknaden i gjennomsynet på 320 px med 200 % tekst | low | Smal tekstkolonne ved siden av Buddy. Utsatt |
| B12 Regelen for fieldset/legend gjelder hele appen | low | Bevisst; begrunnelsen står i globals.css. Avvist |

## Verification

**Commands:** (fra PowerShell)
- `npx tsc --noEmit`, `npm test`, `npm run sjekk:tilgjengelighet`, `node maaling/demotest.mjs` -- alle grønne
