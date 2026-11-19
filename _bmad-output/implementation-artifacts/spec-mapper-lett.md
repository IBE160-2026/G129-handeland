---
title: 'Mapper lett: samle tekster, øve samlet og ta en samlet quiz'
type: 'feature'
created: '2026-11-19'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '20f04be08288e85a14560954de781ba8fb12a9b9'
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/DESIGN.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Elever leser flere tekster til samme prøve, men hver tekst er en øy: øvekort og quiz finnes bare per tekst. Mapper ble tatt ut av v1 27.9 (PRD §4.9); Arve valgte 19.11 å ta inn en lett variant (B) før kodefrys 27.11.

**Approach:** Eleven lager Mapper, legger egne Tekster i dem, og får to samlede aktiviteter som bare gjenbruker lagret innhold: alle Øvekortene fra tekstene i mappen, og en samlet Quiz satt sammen av spørsmål tekstene allerede har. Nye krav FR-50 og videre i PRD §4.9.

## Boundaries & Constraints

**Always:**
- Ingen nye modellkall og ingen ny kvalitetspåstand. Mappesidene leser bare lagrede Begrep og Quizspørsmål; spørsmål og kort beholder sitt Kildeavsnitt og sin Tekst.
- AD-8: hver datatilgangsfunksjon sjekker at både mappen og hver tekst eies av kontoen. Ny tabell `mappe` har `kontoId` med cascade; koblingstabellen `mappe_tekst` har cascade fra både mappe og tekst (FR-37: sletting av tekst/konto rydder).
- Øvekortmerking skrives til `begrep.merking` som før, så merking i mappen og i teksten er den samme.
- Samlet quiz rettes på serveren med `rettQuiz`; fasit når aldri nettleseren før levering. Forsøk lagres i egen tabell `mappeforsoek` (FR-15: tidligere forsøk vises). Selvvurdering av kortsvar virker som i tekstquizen.
- Tekster uten låst tilstand, uten Begrepssett eller uten Quiz vises i mappen med hva som mangler og lenke til teksten. Mappen lager aldri noe selv.
- Grenser: høyst 20 Mapper per konto, høyst 8 Tekster per Mappe, tittel 1–80 tegn. Overskrides de, sier appen hva og hvorfor (§5 ingen blindveier).
- Tastatur, skjermleser, mobil portrett og begge temaer som resten av appen. Utseende fra DESIGN.md.

**Beslutninger (Arve, 19.11):**
- *Quizlengde: eleven velger* ved start mellom Kort (2 per tekst), Middels (4 per tekst) og Alle (8 per tekst). For en gitt lengde er utvalget fast og jevnt fordelt over spørsmålsnumrene (f.eks. 4 → nr. 1, 3, 5, 7), så samme lengde gir samme spørsmål. Forsøket lagrer lengden, og «Tidligere forsøk» viser den.
- *Medlemskap:* en Tekst kan ligge i flere Mapper. Mappesiden viser tekstene; legg-til-valget viser hvilke tekster som alt er med.
- *Plassering:* egen del øverst i Samlingen og en lenke fra Arbeidsbordet. Arbeidsbordets fem bunker (FR-48) endres ikke.

**Never:**
- Samlet Fagsamtale, samlet minnevers eller ny generering på tvers av tekster.
- Gjenbruk av FR-32–FR-34.
- Kjøre migrasjonen mot Neon eller rulle ut uten Arves ja.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Samlet øving | Mappe med 3 låste tekster, 10+12+0 begreper | 22 kort; tekst 3 vist som «ingen fagord» | N/A |
| Samlet quiz | 2 tekster med quiz, 1 uten | Quiz av spørsmålene fra de to; den tredje vist som «quiz ikke laget ennå» med lenke | N/A |
| Ingen innhold | Mappe uten tekster med quiz | Ingen quizknapp; forklaring og lenker | N/A |
| Fremmed tekst | Legg til tekstId som eies av en annen konto | Avvises som IkkeFunnet | Melding + neste handling |
| Over grensen | 9. tekst i mappen / 21. mappe | Avvist | Melding som navngir grensen |
| Tekst slettet | Tekst i mappe slettes | Forsvinner fra mappen; gamle forsøk står med sitt antall | N/A |

</frozen-after-approval>

## Code Map

- `data/skjema.ts` -- legg til `mappe`, `mappe_tekst`, `mappeforsoek`; mønster som `quizforsoek` (svar som JSON-tekst, antall).
- `data/migrasjoner/` -- ny `0009_*` via `npx drizzle-kit generate`; ikke håndskrevet.
- `data/oevekort.ts` -- `Oevekort`-typen og `merkOevekort(t, tekstId, begrepId, …)` gjenbrukes; mappekort trenger `tekstId` per kort.
- `data/quiz.ts` -- `rettQuiz`, `tilElevsvar`, `LagretSporsmal`, `Elevsvar` gjenbrukes uendret; `hentQuiz` er mønster for eierskap via tekst.
- `data/tilgang.ts` -- `IkkeFunnet`, `Tilgang`; `slettTekst` skal fortsatt virke (cascade).
- `app/handlinger.ts` -- `leverQuiz` (l.469), `vurderKortsvar` (l.533), `merkKort` (l.645), `somFeil`, `ElevsvarSkjema` (`.max(20)` må økes for mappe). Nye handlinger for mappe: opprett, gi nytt navn, slett, legg til/fjern tekst, lever, vurder.
- `app/komponenter/Quiz.tsx` -- kaller `leverQuiz(tekstId…)`/`vurderKortsvar(tekstId…)` og `Kildeavsnitt tekstId`; generaliser så handlingene og tekstId per spørsmål kommer inn som props. Tekstquizen skal oppføre seg uendret.
- `app/komponenter/Oevekort.tsx` -- `merkKort(tekstId, …)`; generaliser til tekstId per kort; vis tekstens tittel på kortet i mappemodus.
- `app/komponenter/Kildeavsnitt.tsx` -- tar allerede `tekstId`; ingen endring.
- `app/samling/page.tsx` -- mappeinngangen; `filtrerTekster` i `data/tekstliste.ts`.
- `app/komponenter/Arbeidsbord.tsx` -- bare en lenke «Mappene dine» ved siden av Samlingslenken; bunkene røres ikke.
- `app/tekst/[id]/quiz/page.tsx`, `app/tekst/[id]/oevekort/page.tsx` -- mønster for nye sider `app/mappe/[id]/{page,quiz,oevekort}`. `await tilgang()` i hver side, før try.
- `data/quiz.test.ts` -- PGlite-mønster for nye datatester.
- `maaling/sjekk-tilgjengelighet.mjs` -- legg til mappesidene.

## Tasks & Acceptance

**Execution:**
- [x] `_bmad-output/planning-artifacts/prd-lesevenn.md` -- §4.9 skrives om: Mapper lett i v1 fra 19.11 med FR-50 (Mappe), FR-51 (samlet øving), FR-52 (samlet quiz); samlet Fagsamtale fortsatt ute; ordliste, §8.1/8.2, §9.3 og SM-11-merknaden oppdateres -- sporbarhet brief→PRD→kode.
- [x] `_bmad-output/planning-artifacts/ki-logg.md` -- ny oppføring: beslutningen snus for andre gang, variant B, hvorfor ingen ny måling trengs -- FR-38.
- [x] `data/skjema.ts` + migrasjon 0009 -- tre tabeller med cascade og unik (mappeId, tekstId).
- [x] `data/mapper.ts` -- CRUD, medlemskap, `hentMappekort`, `hentMappequiz`, `lagreMappeforsoek`, `listMappeforsoek`, `oppdaterMappeSelvvurdering`; alle med eierskapssjekk og grenser.
- [x] `data/mapper.test.ts` -- PGlite: eierskap (fremmed mappe/tekst), grenser, cascade ved tekst- og mappesletting, sammensetning av kort og quiz, retting og selvvurdering.
- [x] `app/handlinger.ts` -- mappehandlinger med zod og `revalidatePath`.
- [x] `app/komponenter/Quiz.tsx`, `Oevekort.tsx` -- generalisering; eksisterende tester grønne.
- [x] `app/mappe/[id]/page.tsx`, `quiz/page.tsx`, `oevekort/page.tsx` + mappedel i `app/samling/page.tsx` -- sidene.
- [x] `maaling/sjekk-tilgjengelighet.mjs` -- mappesidene med.

**Acceptance Criteria:**
- Given en elev med tre låste tekster, when hun lager mappen «Naturfag» og legger dem til, then mappesiden viser dem og tilbyr Øvekort og Quiz.
- Given et kort merket «kan» i mappen, when teksten åpnes alene, then kortet står som «kan» der også.
- Given en levert samlet quiz, when eleven åpner mappequizen igjen, then forsøket står under «Tidligere forsøk» med antall riktige av totalt.
- Given at ingen modellnøkkel er satt, when alle mappesider brukes, then ingen generator kalles.

## Verification

**Commands:**
- `npx tsc --noEmit` -- expected: ingen feil
- `npm run lint` -- expected: ingen feil
- `npm test` -- expected: alle grønne, flere enn 441
- `npm run sjekk:tilgjengelighet` -- expected: alle grønne, mappesidene med
- `npm run build` -- expected: bygger

## Implementation Notes

- Implementert av underagent 19.11; diff lest mot `baseline_commit` av hovedøkta.
- Grenser og rene regler i `data/mappegrenser.ts` (uten databaseimport), fordi klientskjemaene bruker dem; `data/mapper.ts` re-eksporterer.
- Selvvurdering i mappequizen justerer antallet med det ene spørsmålets gamle og nye retting (begge `rettQuiz`), ikke full ny retting: et forsøk skal kunne vurderes selv om en annen Tekst er slettet etter levering.
- Lagt til av hovedøkta: `app/komponenter/Mappemangler.test.ts` dekker matrisens visningsrader (quiz ikke laget, ingen quizknapp, tomt Begrepssett).
- Migrasjon 0009 generert med drizzle-kit mot tom lokal adresse; ikke kjørt mot Neon.
- Verifisert etter gjennomgangen: tsc, lint (0 feil), `npm test` 708/708, tilgjengelighet 410/410, `npm run build`. Sju funn rettet (se triagelogg); hentefeil.test.ts fikk listMapper byttet ut og en test for at Samlingen tåler at mappeoppslaget feiler.

## Review Triage Log

| # | Kilde | Funn | Verdikt | Begrunnelse | Rute |
|---|-------|------|---------|-------------|------|
| 1 | blind, edge | KI-logg: statusoverskrift «per 11. november» og «Tjuefire» etter rad 25 | low | Bekreftet l.489/491; direkte retting | patch |
| 2 | blind | KI-logg nr. 25 sier ikke hva utvikleren kontrollerte | low | Oppføringen er utviklerens egen vurdering; kan ikke skrives for ham | avvist (meldt Arve) |
| 3 | blind | addendum l.114 og §5 sier fortsatt Mapper ute av v1 | low | Bekreftet; sporbarhet PRD↔addendum brytes | patch |
| 4 | blind | Ingen SM eller demosteg for FR-50–52 | low | Ikke i intensjonen; ny metrikk er mer enn retting | avvist (meldt Arve) |
| 5 | blind | §9.3 mangler kuttrekkefølge for Mapper | low | Sjelden relevant; «kuttes den, virker alt annet» står | avvist |
| 6 | blind, edge | leverMappequiz retter et annet sett enn eleven så når mappen endres mellom visning og levering | medium | Nås ved å legge til/fjerne tekst i annen fane; usette spørsmål teller i totalt | patch |
| 7 | blind, edge, verif | oppdaterMappeSelvvurdering uten lås | low | Quiz.tsx l.112 stopper samtidige avkrysninger (`lagrer !== null`); bare to faner, samme mønster som tekstquizen | avvist |
| 8 | blind, edge | Samlingen viser Hentefeil for alle tekster om listMapper feiler | medium | Bekreftet i Promise.all; treffer f.eks. drift før 0009 er kjørt | patch |
| 9 | blind | Ukontrollert select beholder et valg som blir disabled etter legg-til | medium | Disabled option sendes ikke med skjemaet, så neste «Legg til» gir feilmelding | patch |
| 10 | blind, verif | Ingen test kaller leverMappequiz | medium | Bekreftet: bare håndbygget løype i mapper.test.ts og tom levering i a11y | patch |
| 11 | blind | «Alle» hardkodet til 8 | false | FR-13: Quiz har åtte spørsmål; beslutningen sier «Alle (8 per tekst)» | avvist |
| 12 | blind | Personvern-delen nevner ikke de nye tabellene | low | Samme datatype som quizforsoek; cascade dekket | avvist |
| 13 | edge | Gyldig lengde, men tom hentMappequiz når medQuiz>0 | false | kildeavsnitt_id er NOT NULL med cascade; innerJoin kan ikke miste rader | avvist |
| 14 | edge | Telling på lengdeknappen kan avvike fra viste spørsmål | false | Samme grunn som 13 | avvist |
| 15 | verif | Ingen sjekk av at mappekort merkes og lenker til egen Tekst i UI | medium | Bekreftet: a11y kjører bare axe på mappeøvekortene | patch |
