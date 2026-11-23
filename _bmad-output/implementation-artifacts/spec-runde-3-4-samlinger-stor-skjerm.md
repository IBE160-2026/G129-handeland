---
title: 'Runde 3, bolk 4: Samlinger på stor skjerm, med dra og slipp'
type: 'feature'
created: '2026-11-23'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '278109f3c2b78533c7fac62a20dd1906d47a6759'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/oppdrag-design-runde-3.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** På PC står Samlinger i én smal kolonne (høyst 768 px), og eneste vei til å legge en tekst i en mappe er å åpne mappen og velge teksten i en nedtrekksliste.

**Approach:** Fra 760 px blir siden todelt: søk og tekstene i én kolonne, mappene i den andre. En tekst kan dras og slippes på en mappe, og hver tekstrad får en vanlig «Legg i mappe»-knapp som gjør det samme for tastatur, skjermleser og telefon.

## Boundaries & Constraints

**Always:**
- **Avgjort (Arve, 23.11):** dra og slipp på stor skjerm, MED en vanlig knapp «Legg i mappe». Domenebegrepet Mappe beholdes.
- **Avgjort (Arve, 23.11):** fra 760 px tar søket og tekstene omtrent 30 % til venstre, mappene omtrent 70 % til høyre. Mappene vises der som kort i et rutenett (navn og antall, hele kortet er slippmål), med «Ny mappe»-skjemaet under. Tekstradene i den smale kolonnen stables (tittel, tilstand, neste steg, så knappene).
- **Avgjort (Arve, 23.11):** kildekoden beholder mappene først. På stor skjerm går Tab gjennom mappene før tekstene; telefonen er uendret.
- Knappen og draget bruker samme serverhandling og samme regler som mappesiden: bare egne tekster og mapper, høyst 8 tekster per mappe, ligger teksten der fra før skjer ingenting. Avvisninger vises med Feilmelding (§5: hva, hvorfor, hva eleven kan gjøre).
- «Legg i mappe» virker uten JavaScript (vanlig skjema bak en `<details>`, som «Gi mappen nytt navn»). Mappene teksten alt ligger i, står i listen, men kan ikke velges («(alt med)»). Har eleven ingen mapper, vises ikke knappen.
- Et vellykket slipp eller valg kunngjøres i en `role="status"`-region (««{tekst}» ligger nå i «{mappe}».»), og antallet på mappen oppdateres. Slippmålet markeres synlig mens noe dras over det (ikke bare med farge).
- Under 760 px er rekkefølgen som nå: mappene øverst (PRD FR-50), så søket og tekstene, én kolonne. Ingen sidelengs rulling på 320 px eller med 200 % tekst.

**Never:** Ingen migrasjon, ingen nytt bibliotek for dra og slipp (HTML5-dra er nok), ingen dra og slipp på berøringsskjerm under 760 px, ingen endring i søk, sortering, sletting, neste steg eller mappesiden.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Dra til mappe | 1280 px, dra «EM-bølger» til «Naturfag» | status-melding, «Naturfag» viser én tekst mer | N/A |
| Allerede med | dra en tekst til en mappe den ligger i | ingenting endres, meldingen sier at den alt ligger der | N/A |
| Full mappe | mappen har 8 tekster | ingen endring | Feilmelding fra `MAPPE_AVVIST.forMangeTekster` |
| Knappen | Tab til «Legg i mappe», velg mappe, «Legg i mappen» | som dra til mappe | som over |
| Ingen mapper | eleven har 0 mapper | ingen «Legg i mappe», ingen dra-markering | N/A |
| Telefon | 375 px | én kolonne, mappene øverst, knappen finnes, raden er ikke dragbar | N/A |

</frozen-after-approval>

## Code Map

- `app/samling/page.tsx` -- serverside. `main` er `max-w-3xl`; `Mapper` (seksjon `#mapper`, liste med lenke + antall, `NyMappeSkjema`) står før søkeskjemaet og `<ul>` med tekstrader (`SlettTekstKnapp` til høyre). Henter `hentArbeidsbord`, `samtalegrenseNaadd`, `listMapper` i `Promise.all`; mappefeil gir tom liste.
- `app/komponenter/Mappeskjemaer.tsx` -- `Send`, `NyttNavnSkjema` (mønster for `<details>`-skjema), `LeggTilTekstSkjema` (mønster for «(alt med)»-valg og `key`-nullstilling). Legg «Legg i mappe»-skjemaet her.
- `app/handlinger.ts:744` -- `leggTilIMappe(mappeId, _, data)` med `mappefeil`, `oppdaterMappesider` (revaliderer `/samling`). Ny handling som leser både `mappeId` og `tekstId` fra `FormData`, og svarer med mappetittelen ved suksess, til knappen og draget.
- `data/mapper.ts:73` -- `listMapper` (antall per mappe). `leggTilTekst:133` gjør alle reglene; ikke endre den. Trenger medlemskap per tekst: ny funksjon (f.eks. `mapperPerTekst(t): Map<tekstId, mappeId[]>`), med test i `data/mapper.test.ts`.
- `app/globals.css` -- stort oppsett i `@media (min-width: 760px)` som resten av fila. Ny klientkomponent for dra og slipp (dragstart på tekstraden, dragover/drop på mapperaden), helst én fil.
- `maaling/sjekk-tilgjengelighet.mjs:948–1017` -- FR-49/FR-50-blokken på 1280 px (lager «Naturfag» fra `#mapper`, legger «EM-bølger» i den på mappesiden). `:2456–2459` -- 320 px og 200 % for `/samling`. Mørk-løkka `:1030`.
- Dokumenter: `EXPERIENCE.md` (§Samlinger, Tekstrad, Responsive), `DESIGN.md` om Samlinger finnes, `prd-lesevenn.md` FR-49 (`:872`) og FR-50 (`:671`).

## Tasks & Acceptance

**Execution:**
- [x] `data/mapper.ts`, `data/mapper.test.ts` -- medlemskap per tekst for elevens mapper, bare egen konto; test at en annen kontos mapper ikke kommer med.
- [x] `app/handlinger.ts` (+ `app/handlinger.test.ts`) -- handling for «legg i mappe» fra Samlinger, med samme validering og feiltekster som `leggTilIMappe`.
- [x] `app/komponenter/Mappeskjemaer.tsx` -- «Legg i mappe»-skjema bak `<details>`: velg mappe (alt med = deaktivert), send, status-melding.
- [x] Ny klientkomponent for dra og slipp + `app/samling/page.tsx` -- todelt oppsett fra 760 px (bredere `main`), dragbare tekstrader og mapperader som slippmål bare fra 760 px og bare når det finnes mapper; status-region.
- [x] `app/globals.css` -- kolonnene, markeringen av slippmålet (kant/skygge + tekst, ikke bare farge), `prefers-reduced-motion` respektert.
- [x] `maaling/sjekk-tilgjengelighet.mjs` -- 1280 px: to kolonner med riktig fordeling, dra «EM-bølger» til mappen øker antallet, knappen gjør det samme, «(alt med)» deaktivert, status-melding; 759 px: én kolonne, mappene øverst, ingen `draggable`; 320 px og 200 %: ingen sidelengs rulling; axe lys og mørk.
- [x] `EXPERIENCE.md`, `DESIGN.md`, `prd-lesevenn.md` FR-49/FR-50 -- datert 23.11.

**Acceptance Criteria:**
- Given 1280 px og én mappe, when eleven drar en tekst til mappen, then teksten står i mappen på `/mappe/{id}` og antallet på Samlinger har økt.
- Given skjermleser, when eleven bruker «Legg i mappe», then valget, sendingen og meldingen kan nås og leses uten mus.

## Verification

**Commands:**
- `npx tsc --noEmit`, `npx eslint app data` -- uten feil
- `npx vitest run data/mapper app/handlinger` -- bestått (aldri hele vitest, se minnet)
- `npm run sjekk:tilgjengelighet`, `npm run sjekk:readme` -- alt bestått
- `npm run demotest` med `LESEVENN_TESTMODUS=les` -- bestått uten modellkall

## Implementation Notes

- Ny handling `leggTekstIMappe(_, FormData{mappeId, tekstId})` gir `Mappesvar = Handlingssvar & { lagtI?: { mappeId, mappetittel, altMed } }`. «Alt med» avgjøres med `mapperPerTekst` før `leggTilTekst` (som er uendret og fortsatt gjør alle reglene). Feil fra datalaget går gjennom `mappefeil`; bare teksten for ugyldige ids er egen («Velg en mappe å legge teksten i.»), fordi `leggTilIMappe`s tekst ber om å velge en tekst.
- Dra og slipp i `app/komponenter/DraTilMappe.tsx` (kontekst + `DragbarTekst`, `Slippmaal`, `Slippmelding`). `draggable` settes bare i nettleseren (useSyncExternalStore, `false` på serveren), fra 760 px og med minst én mappe. `start`/`slutt` kjøres i `setTimeout(0)` så DOM-en ikke endres under `dragstart`.
- Vitest må kjøres fra PowerShell (eller med `C:` med stor bokstav i stien): fra Git Bash (`/c/...`) feiler alle testfiler med «Vitest failed to find the runner», også uendrede.

- Etter gjennomgangen: 9 rettinger (se triageloggen), 2 utsatt til deferred-work.md. Sluttsjekk: tsc og eslint uten feil, vitest app/hentefeil + data/mapper + app/handlinger 82/82, tilgjengelighet 511/511, demotest 3/3 (les). Hele `npm test` ble stoppet av tillatelsessystemet og er ikke kjørt; README-testen kjøres etter commit.

## Spec Change Log

## Review Triage Log

| # | Lag | Funn | Verdikt | Begrunnelse | Rute |
|---|---|---|---|---|---|
| 1 | verif | `app/hentefeil.test.ts` mocker ikke `mapperPerTekst`; en eksisterende test feiler (`npm test` rødt) | high | Bekreftet av laget (1 feilet, 4 bestått) | patch (mock + test «mapperPerTekst kaster») |
| 2 | blind, edge | Feiler bare `mapperPerTekst`, forsvinner alle mappene og slippmålene | medium | Én `catch` rundt begge oppslagene | patch (egen `catch` per oppslag) |
| 3 | blind, edge | Hele raden er dragbar; et lite musedrag på `summary`/`select`/knappene starter et radtrekk | medium | `draggable` på `<li>` gjelder etterkommerne | patch (avbryt dragstart fra `.tekstrad-knapper`) |
| 4 | edge | Slippes raden på søkefeltet eller mappenavnfeltet, settes tittelen inn der | low | `text/plain` tas imot av redigerbare felt | patch (egen MIME-type) |
| 5 | edge | `dragleave` på kort A etter `dragenter` på B fjerner Bs markering et øyeblikk | low | Lukket `d.over` er gammel | patch (funksjonell setter) |
| 6 | blind, verif | De negative `[draggable]`-sjekkene venter bare 1 s og består uten hydrering | medium | Serverens HTML har aldri `draggable` | patch (vent på hydrering) |
| 7 | blind | 760 px med 200 % tekst er ikke sjekket i det todelte oppsettet | medium | Tekstkolonnen er ~200 px der | patch (sjekk uten sidelengs rulling) |
| 8 | blind | Testen sjekker ikke at `/samling` ikke revalideres når teksten alt var med | low | Én linje | patch |
| 9 | blind | Hinten «Slipp for å legge i mappen» er understreket og ligner en lenke; DESIGN/EXPERIENCE beskriver markeringen ulikt | low | Understrek betyr lenke i appen | patch (fjern understrek, samkjør ordene) |
| 10 | blind, verif | Feilveien i draget (full mappe, nettfeil) er ikke testet i nettleseren | medium | Regelen er testet i handlingen, ikke i UI | defer |
| 11 | blind | «Virker uten JavaScript» er ikke testet | maybe-false | Krever en kontekst med `javaScriptEnabled: false` | defer |
| 12 | blind | En tekst som alt ligger i en full mappe, gir «mappen er full» | false | `leggTilTekst` sjekker «finnes» før antallet (`data/mapper.ts:150–153`) | avvist |
| 13 | blind | Fulle mapper merkes ikke før eleven prøver | low | Matrisen sier Feilmelding ved full mappe; nytt merke er ny design | avvist |
| 14 | blind | Tekstkolonnen mangler egen overskrift og hopp-lenke | low | Overskriftsstrukturen er som før bolk 4; Tab-rekkefølgen avgjort av Arve | avvist |
| 15 | blind | Draget er på også på iPad (≥ 760 px, berøring) | low | Intensjonen er «stor skjerm»; iPadOS støtter HTML5-dra | avvist |
| 16 | blind | Hinten kan få kortet til å blafre | low | Kortet vokser nedover og `dragover` setter markeringen igjen | avvist |
| 17 | blind, edge | Ugyldig tekst-id gir «Velg en mappe …» | low | Tekst-id er et skjult felt; skjer ikke i bruk | avvist |
| 18 | blind | Axe for dra-tilstandene i mørk modus og tvungne farger mangler | low | Mørk-løkka dekker /samling; tilstanden varer bare under draget | avvist |
| 19 | edge | `altMed` fra et øyeblikksbilde før transaksjonen kan bli feil ved samtidig fjerning eller dobbelt innsending | low | Krever to samtidige handlinger på samme tekst | avvist |
| 20 | edge | Mappen mangler i `listMapper`-bildet etter vellykket innsetting | false | Mappe-id-en kommer fra siden, så mappen fantes; slettes den, feiler `leggTilTekst` først | avvist |
| 21 | edge | Svar på et eldre slipp kan komme etter et nyere | low | Krever to slipp innen ett svar | avvist |
| 22 | edge | Svært kort drag før `setTimeout(start)` gir et ignorert slipp | low | `dragover` kommer etter neste tikk | avvist |
| 23 | edge | Samme feil to ganger i «Legg i mappe» leses ikke opp på nytt | low | Samme mønster som de andre mappeskjemaene fra før | avvist |
