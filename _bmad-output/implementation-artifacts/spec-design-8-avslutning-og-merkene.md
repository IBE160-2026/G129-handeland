---
title: 'Design runde 2, bolk 8: raskere avslutning og nye merker i forkunnskapssteget'
type: 'feature'
created: '2026-11-18'
status: 'done'
baseline_commit: '53dcb41b65b0d3608fc5e228cfad97b870d105cf'
route: 'dispatch'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:**
- Utvikleren synes avslutningen (brillene blir til B) henger for lenge, både etter at B-en er tegnet og i pausen etter at pupillene er borte.
- Merkene «Dette kan jeg», «Har hørt om» og «Helt nytt» fungerte ikke, og det mangler et svar for overskrifter eleven ikke skjønner.

**Approach:**
- B-en står 0,8 s i stedet for 1,2 s før indikatoren går. Pausen etter at pupillene er tonet ut, kortes fra 700 ms til 450 ms. Resten av avslutningen er uendret.
- Ett spørsmål over overskriftene, «Hva vet du om dette fra før?», med fire valg per overskrift: «Mye», «Litt», «Ingenting ennå» og «Skjønner ikke overskriften». Vedtatt av utvikleren 18.11.
- «Før du leste» får en egen linje for overskriftene eleven ikke skjønte: «Disse overskriftene skjønte du ikke: X. Gir de mening nå?»

## Boundaries & Constraints

**Always:**
- Kodene `kjent`, `litt` og `nytt` er de samme, så lagrede merker vises med de nye navnene: `kjent` = «Mye», `litt` = «Litt», `nytt` = «Ingenting ennå». Den nye koden er `uklar`. Det trengs ingen migrasjon, fordi kolonnen er jsonb og `lesMerking` validerer mot `MERKER`.
- Spørsmålet står én gang over alle overskriftene, ikke inne i hver gruppe. Hver `fieldset` har det som beskrivelse (`aria-describedby`), og gruppene er fortsatt navngitt av overskriften.
- De fire valgene får plass i bredden på 320 px. De kan brytes til to rader, men ingen knapp kuttes.
- Med redusert bevegelse er avslutningen uendret, og B-en vises direkte.
- Verten (`TenkerVert`) og flaten bruker samme nye lengde.

**Never:**
- Ingen annen endring i avslutningens tegning eller rekkefølge.
- Ingen endring i FR-6-reglene (ingen vurdering, én oppfordring ved tomt skjema).

</frozen-after-approval>

## Code Map

- `app/komponenter/Tenker.tsx:78` -- `AVSLUTNING_MS = 4300 + 1200` → den nye lengden: avslutningen + 0,8 s.
- `app/globals.css:300-400` -- `s-blunk`, `s-snu`, `s-flytt`, `s-stenger`, `s-stang` og `s-krymp` (`:470`) er prosent av 4,3 s. Skriv dem om så pausen etter pupillene er 450 ms og alt etter flyttes 250 ms fram. Lengden blir 4,05 s. Også `docs`-kopien `_bmad-output/.../mockups/merke-tenker.css` hvis den brukes som fasit.
- `tekst/forkunnskap.ts` -- `MERKER` får `uklar`, `MERKENAVN` får de nye navnene, og `foerDuLeste` får `uklare`.
- `app/komponenter/Skjemaer.tsx` (`AktiveringSkjema`) og `app/tekst/[id]/aktivering/page.tsx` -- spørsmålet over gruppene og instruksen. Gjennomgangen 17.11 ga instruksen `id="aktivering-hjelp"`, og det skal den beholde.
- `app/tekst/[id]/lesing/page.tsx` -- «Før du leste» med linjen for de uklare.
- `tekst/forkunnskap.test.ts`, `app/handlinger.test.ts`, `maaling/demotest.mjs`, `maaling/sjekk-*.mjs` -- de nye navnene, og den nye koden lagres og vises.
- PRD FR-6, EXPERIENCE.md og DESIGN.md (`motion.thinking-finish` og teksten om avslutningen) -- de nye verdiene og datoen.

## Tasks & Acceptance

**Execution:**
- [x] `app/globals.css`, `app/komponenter/Tenker.tsx` -- den nye lengden
- [x] `tekst/forkunnskap.ts`, skjemaet, aktiveringssiden, lesevisningen -- de nye merkene og `uklar`
- [x] testene og `maaling/*.mjs`
- [x] PRD, EXPERIENCE.md, DESIGN.md

**Acceptance Criteria:**
- Given en avslutning, when den spilles, then er indikatoren borte omtrent 4,85 s etter at den startet (4,05 s + 0,8 s), ikke 5,5 s.
- Given aktiveringen, when eleven merker én overskrift «Skjønner ikke overskriften» og leser, then viser «Før du leste» «Disse overskriftene skjønte du ikke: …».
- Given en tekst merket før 18.11 med `kjent`, when lesevisningen eller aktiveringen åpnes, then står merket som «Mye».

## Implementation Notes

- Nøkkelbildene er regnet om i millisekunder: alt til og med at pupillene er tonet ut (1204 ms) står på samme tid som før, og alt etter er flyttet 250 ms fram, så lengden er 4050 ms. Nye prosenter: blunk 2,65/5,31/20,17/29,73 %, rotasjonen og stengene starter 40,54 %, ferdig 70,27 % (stengene 66,02 %), ryggen 68,15–90,44 %, mini-krympingen 40,54–53,28 %. Den gamle pausen var i praksis 688 ms (beskrevet som 700); den nye er 438 ms (beskrevet som 450). Samme regel er brukt i `mockups/merke-tenker.css`. `.working/`-kopien er ikke rørt.
- `AVSLUTNING_MS = 4050 + 800` brukes av både flaten og `TenkerVert`.
- Spørsmålet er en `<p id="merke-spoersmaal">` øverst i `AktiveringSkjema`. Hver `fieldset` har `aria-describedby="merke-spoersmaal aktivering-hjelp"`, altså spørsmålet først og så instruksen. Instruksen har fortsatt `id="aktivering-hjelp"`, men spørsmålet er tatt ut av den, så det ikke står to ganger: «Se på overskriftene før du leser, og svar for hver av dem. Ingenting her blir vurdert.»
- «Før du leste»-linjen står i flertall slik spesifikasjonen sier, også når bare én overskrift er uklar. Den står etter linjen om de helt nye overskriftene. Teksten «Helt nytt for deg før du leste» og oppsummeringslinjen for `kjent`/`litt` er ikke endret.
- `sjekk-tilgjengelighet`: tre valg er blitt fire, og den har nye sjekker for navnene, for spørsmålet (én gang, og i hver gruppes beskrivelse) og for 320 px (ingen knapp utenfor gruppen eller kuttet). Gruppe 2 merkes nå «Skjønner ikke overskriften» med piltasten, og «Før du leste» og den låste aktiveringen sjekkes for det. Pillen må stå i 4,5–5,9 s (målt 5522 ms); før var kravet minst 5 s.

## Spec Change Log

## Review Triage Log

Runde 1 (18.11): Blind Hunter (B), Edge Case Hunter (E) og Verification Gap (V).

| Funn | Vurdering | Bevis / rute |
|---|---|---|
| B1/E6/V2 «Før du leste» bruker de gamle ordene (akseptkriteriet «Mye» i lesevisningen) | medium | `foerDuLeste` og lesevisningen. patch: «Du visste mye/litt om», «Du visste ingenting om dette fra før» |
| E2 Flertall ved én uklar overskrift | low | patch: entall ved én |
| E1 Dobbelt tegn når overskriften slutter med «?» | low | patch: `iSetning` |
| B4 B-en står ca. 1,2 s, ikke 0,8 s (animasjonen har en stille hale) | low | Utviklerens ønske var 0,4 s raskere, og det er oppfylt (ca. 1,6 → 1,2 s). patch: tallene i DESIGN.md og Tenker.tsx |
| B8 Instruksen leses for hver gruppe | low | patch: beskrivelsen er bare spørsmålet |
| B3 Låst aktivering mangler spørsmålet | low | patch: spørsmålet over listen |
| E5 Ukjent lagret kode gir «du merket: » | low | patch: vakt |
| E3 Valgene kan flyte ut med stor tekst | low | patch: `max-width`/`overflow-wrap` |
| V1/B7 «To rader» stemmer ikke (tre rader målt) | low | patch: «flere rader» i PRD og EXPERIENCE |
| B9/B2 PRD-begrunnelsen er tynn, og omtolkingen av gamle svar er ikke sagt | low | patch: PRD |
| B12 Ingen test med blandede merker | low | patch: enhetstest |
| B5 Varigheten står mange steder | low | Ikke en direkte rettelse. Avvist |
| B6/E4 Trange marginer i tidstesten | low | Målt 5,5 s mot grensen 5,9 s; den gamle ville gitt ca. 6,2 s. Avvist |
| B10 «Skjønner ikke» fører ikke videre | low | Hensikten var linjen i «Før du leste». Avvist (kan tas opp med utvikleren) |
| B11 Kodenavnene (`heltNye`) passer ikke med visningen | low | Kodene er bevart for lagrede data. Avvist |
| V3 Resultatfilen er fra en annen grense | false | Kjørt på nytt 18.11, 306/306 |

## Verification

**Commands:** (fra PowerShell)
- `npx tsc --noEmit`, `npm test`, `npm run sjekk:tilgjengelighet`, `node maaling/demotest.mjs` -- alle grønne
