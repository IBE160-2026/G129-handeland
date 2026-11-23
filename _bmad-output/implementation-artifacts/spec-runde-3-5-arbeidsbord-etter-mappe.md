---
title: 'Runde 3, bolk 5: arbeidsbordet grupperer etter Mappe'
type: 'feature'
created: '2026-11-23'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '3f8de8cd42f05455ed2105e5b72f11541d488429'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/oppdrag-design-runde-3.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Arbeidsbordet viser hver Tekst som egen bunke, også Tekster eleven har samlet i en Mappe, så bordet sier ingenting om hvordan hun har ordnet tekstene sine.

**Approach:** En Mappe med Tekster blir én bunke på bordet, med mappefane. Tekster i en Mappe ligger ikke som egne bunker, men under hver Mappe de er i. Viften for en Mappe viser først Tekstene og den samlede øvingen; velges en Tekst, vises dens fem aktiviteter som i dag. Tekster uten Mappe er som før.

## Boundaries & Constraints

**Always:**
- **Avgjort (Arve, 23.11):** en Tekst som ligger i én eller flere Mapper, vises ikke alene på bordet; den vises under HVER Mappe den ligger i. Mappen åpnes først, så velges Teksten, og derfra er alt som før. Tekster uten Mappe vises som i dag. Domenebegrepet Mappe beholdes.
- **Avgjort (Arve, 23.11):** er Teksten eleven sist brukte i en Mappe, er Mappen hovedbunken («Sist brukt»), og lenken for neste steg gjelder den Teksten, med tittelen i lenken (f.eks. «EM-bølger: Neste: Ta quizen →»). `nesteSteg` brukes uendret på Teksten.
- **Avgjort (Arve, 23.11):** viften for en Mappe viser Tekstene i Mappen som kort (tittel og «N av 5 påbegynt»), og to kort for samlet øving: «Øvekort for hele mappen» (`/mappe/{id}/oevekort`) og «Quiz for hele mappen» (`/mappe/{id}/quiz`). Velges en Tekst, viser samme dialog dens fem aktivitetskort, med en knapp «Tilbake til mappen» som viser Mappens kort igjen. Samme dialogregler som i dag: inert bakgrunn, fokus holdes, Esc og «Legg sammen» lukker; på telefon er det arket.
- **Avgjort (Arve, 23.11):** mappebunken har en mappefane (flik øverst til venstre), merkelappen «Mappe» og «N tekster» i stedet for «lagt inn …». På telefon får stripen samme flik og «Mappe» foran tittelen. Forskjellen bæres av tekst, ikke bare form. Knappens navn er «Vis tekstene i mappen {tittel}».
- Bordets fem plasser deles av Mapper med minst én Tekst og Tekster uten Mappe, sortert etter sist aktiv (en Mappe er like aktiv som sin nyeste Tekst). Tomme Mapper ligger ikke på bordet. «Se alle N tekstene i Samlinger» vises når ikke alle Tekstene er synlige på bordet.
- Uten JavaScript er mappebunken en lenke til `/mappe/{id}`.

**Never:** Ingen migrasjon, ingen endring i `nesteSteg`, i Samlinger eller i mappesidene. Ingen nye modellkall.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Ingen mapper | 3 tekster, 0 mapper | bordet som før | N/A |
| Siste tekst i mappe | «EM-bølger» sist brukt, i «Naturfag» | hovedbunken er «Naturfag» med fane, «Mappe», lenken «EM-bølger: …»; «EM-bølger» er ikke egen bunke | N/A |
| Tekst i to mapper | tekst i «Naturfag» og «Prøve» | to mappebunker; teksten står i begge viftene | N/A |
| Tom mappe | mappe uten tekster | ikke på bordet | N/A |
| Åpne mappe | trykk på mappebunken | tekstkortene + «Øvekort for hele mappen» + «Quiz for hele mappen»; fokus på første kort | N/A |
| Velg tekst | trykk på et tekstkort | tekstens fem aktivitetskort og «Tilbake til mappen»; fokus på første aktivitetskort | N/A |
| Tilbake | «Tilbake til mappen» | mappens kort igjen, fokus på tekstkortet eleven kom fra | N/A |
| Mappeoppslag feiler | `listMapper`/`mapperPerTekst` kaster | bordet som før (bare tekster), feilen logges | logges |
| Uten JavaScript | skript av | mappebunken lenker til `/mappe/{id}` | N/A |

</frozen-after-approval>

## Code Map

- `data/arbeidsbord.ts` -- `Bunke`, `sorterEtterSistAktiv`, `velgBordet` (5 plasser, `antall`), `nesteSteg` (uendret), `kortstatus`. Legg en ren funksjon som setter sammen bordet av tekstbunker + mapper + medlemskap (Mappe-bunker med sine Tekster, sist aktiv = nyeste Tekst), med enhetstester i `data/arbeidsbord.test.ts` for matrisens rader.
- `data/mapper.ts` -- `listMapper` (titler, antall) og `mapperPerTekst` (fra bolk 4) gir det som trengs; ikke endre dem.
- `app/page.tsx` -- `ArbeidsbordSide`: henter `hentArbeidsbord` + `samtalegrenseNaadd`; `visning`, `boble`, hilsenen «Du holdt på med …». Hent mappene med egen `catch` (som `app/samling/page.tsx` etter bolk 4). Hilsenen og boblen nevner Teksten, ikke Mappen.
- `app/komponenter/Arbeidsbord.tsx` -- `Visningsbunke`/`Hovedbunke`, bunkelista, `useHarSkript`-fallback til lenke, viften (dialog, `inert`, fokus, `holdFokus`, `tilbake`-ref, oppsett `maal`/`rundt`/`rutenett`/`ark`, `vifteplass.ts`), `Aktivitetskort`. Mappebunken trenger et andre nivå i samme dialog; `plasserRundt` må tåle et annet antall kort (opptil 8 tekster + 2). Behold `.bunke`-strukturen så CSS og stripene virker.
- `app/globals.css` -- bunkene, stripene (`max-width: 759.98px`), viften og arket. Mappefanen legges her, i lys, mørk og tvungne farger.
- `maaling/sjekk-tilgjengelighet.mjs` -- bordsjekkene ~851–935 kjører før det finnes mapper; ~2795–2930 (vifte, ark, rotasjon) kjører etter at «Naturfag», «Prøve» og «Eksamen» har fått «EM-bølger» (bolk 4-blokken ~1040). De må tilpasses, og nye sjekker legges til.
- `maaling/demotest.mjs` steg 13b (~495) -- tekst A og bildeteksten legges i «Prøve»; legg til en bordsjekk der.
- Dokumenter: `EXPERIENCE.md` (Arbeidsbord, Bunke, Hovedbunke, Viften, Responsive), `DESIGN.md` (stack-main/stack-small), `prd-lesevenn.md` FR-48 og FR-50 («Arbeidsbordets fem bunker (FR-48) er uendret» må endres).

## Tasks & Acceptance

**Execution:**
- [x] `data/arbeidsbord.ts` + test -- sammensetting av bordet med Mapper (rene funksjoner), testet for matrisens rader og sorteringen.
- [x] `app/page.tsx` -- hente mapper og medlemskap (egen `catch`), bygge visningen for mappebunker og hovedbunken.
- [x] `app/komponenter/Arbeidsbord.tsx` -- mappebunken (fane, «Mappe», «N tekster», knappnavn, lenke uten skript), viftens to nivåer med «Tilbake til mappen» og fokus som i matrisen; tekstbunker uendret.
- [x] `app/globals.css` -- mappefanen på bunke og stripe, lys/mørk/tvungne farger.
- [x] `maaling/sjekk-tilgjengelighet.mjs` -- tilpass bordsjekkene etter mapper; nye: mappebunke med fane og «Mappe», teksten ikke egen bunke, åpne/velge/tilbake med tastaturet og fokus, ark på 375 px, 320 px og 200 % uten sidelengs rulling, axe lys og mørk.
- [x] `maaling/demotest.mjs` 13b -- bordet viser «Prøve» som mappebunke, og tekst A er ikke egen bunke.
- [x] `EXPERIENCE.md`, `DESIGN.md`, `prd-lesevenn.md` FR-48/FR-50 -- datert 23.11.

**Acceptance Criteria:**
- Given en elev med tekster i mapper, when hun bruker bordet med bare tastatur og skjermleser, then hun hører at bunken er en mappe, kan åpne den, velge en tekst, gå tilbake og lukke, og fokus havner alltid på et synlig element.
- Given en elev uten mapper, when bordet vises, then det er likt som før bolk 5 (eksisterende bordsjekker består uendret).

## Verification

**Commands:**
- `npx tsc --noEmit`, `npx eslint app data` -- uten feil
- `npm test` (fra PowerShell) -- alt bestått, og `git status` viser ingen endrede målefiler
- `npm run sjekk:tilgjengelighet` -- alt bestått
- `npm run demotest` med `LESEVENN_TESTMODUS=les` -- 3/3 uten modellkall
- `npm run sjekk:readme` -- etter commit

## Implementation Notes

- Rene funksjoner: `settSammenBordet` (bordet med mapper, `synlige` for «Se alle») og `sistBrukteTekst` i `data/arbeidsbord.ts`. Like aktive mapper: nyeste mappe (opprettet) først, så id. Medlemskap i ukjent mappe hoppes over.
- `app/page.tsx` henter `listMapper` + `mapperPerTekst` sammen med én `catch` (feiler en av dem, vises bordet som før og feilen logges).
- `plasserRundt` fordeler nå N ≤ 10 kort jevnt fra toppen; fem kort ligger der de lå.
- Viften: `valgtTekst` er andre nivå i samme dialog; `nyttFokus`-ref styrer fokus ved nivåbytte (første aktivitetskort / tekstkortet eleven kom fra). Knappene øverst ligger i `.vifte-topp` (display: contents uten «Tilbake til mappen», så tekstbunker er uendret).
- Mappebunken har ingen framdriftsstreker; «N tekster» står der datoen sto. De samlede kortene har statusene «Fagordene fra alle tekstene» og «Spørsmål fra alle tekstene» (ikke fastsatt i spesifikasjonen).
- Sjekkene etter bolk 4-blokken åpner «EM-bølger» via mappen «Naturfag». 544/544 i sjekk:tilgjengelighet, demotest 3/3 i `les`.

- Etter gjennomgangen (24.11, natt, med Arves fullmakt): 5 rettinger, ingen utsatt (se triageloggen). Sluttsjekk: tsc og eslint uten feil, npm test 796/796, tilgjengelighet 544/544, demotest 3/3 (les).

## Spec Change Log

## Review Triage Log

| # | Lag | Funn | Verdikt | Begrunnelse | Rute |
|---|---|---|---|---|---|
| 1 | verif | Ingen tegnet test skiller «Se alle N» etter `synlige` fra den gamle regelen | medium | Bare tellingen i datalaget er testet | patch (to tilfeller i `app/hentefeil.test.ts`) |
| 2 | edge, blind | Mappefanen stikker inn i stripen over på telefon (~2–4 px) | low | 0,875rem fane i 1rem mellomrom | patch (luft over mappestripen) |
| 3 | blind | «Tilbake til mappen» sier ikke hvilken mappe | low | Tekst i flere mapper mister sammenhengen | patch (skjult mappetittel i knappnavnet) |
| 4 | blind | Tilstandsradene «1–5 tekster» / «Flere enn 5» i EXPERIENCE.md stemmer ikke med plasser og `synlige` | low | Dokumentet styrer | patch |
| 5 | blind | Demotestens SQL for løse «EM-bølger» teller på tvers av kontoer | low | Kan gi ustabil sjekk | patch (begrens til testkontoen) |
| 6 | edge, blind | Revalidering mens mappeviften er åpen: gammel plassering, fokus til body | low | Bordet revalideres bare ved navigering/handling på siden; krever endring i annen fane + oppdatering mens viften er åpen; rettingen gir nye vakter | avvist |
| 7 | blind | De samlede kortene har faste statustekster, også når mappen ikke har fagord/quiz | low | Mappesidene har egne tomtilstander; spesifikasjonen ber ikke om status | avvist |
| 8 | blind | Tekstkortene viser ikke hva som mangler (FR-50) | false | FR-50-kravet gjelder mappesiden; spesifikasjonen sier «tittel og N av 5 påbegynt» | avvist |
| 9 | blind | 10 kort i viften er ikke prøvd i nettleser | low | Faller tilbake til rutenett, som er testet | avvist |
| 10 | blind | Én tekst i flere mapper tar flere plasser | false | Avgjort av Arve: «under HVER Mappe» | avvist |
| 11 | blind | Ekstra spørring på hvert bordbesøk | low | To små spørringer; ikke målbart | avvist |
| 12 | blind | Lange titler på tekstkortene avkortes ikke | low | Viften faller til rutenett | avvist |
| 13 | blind | Små tekst- og kodeting (dobbelt kolon, valgfri `slag`, tokens, overflødig assert) | low | Kosmetisk | avvist |
| 14 | edge | «Eksisterende bordsjekker består uendret» stemmer ikke, noen er skrevet om | false | AC gjelder elev uten mapper; de sjekkene er urørt, de omskrevne kjører etter at mapper finnes | avvist |
