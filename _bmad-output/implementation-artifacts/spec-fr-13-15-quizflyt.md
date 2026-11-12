---
title: 'FR-13 og FR-15: quizen starter selv, kilden bak en knapp, kortsvar vurderes i resultatet'
type: 'feature'
created: '2026-11-12'
status: 'done'
baseline_commit: 'b210735623c8c497065430b7613cba11b734e519'
route: 'dispatch'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Telefontesten 9.11 fant tre ting i quizen: eleven må trykke «Lag quizen» før den finnes; kildeavsnittet står åpent under hvert feil svar og gjør resultatet uoversiktlig; og kortsvarene vurderes i et eget mellomsteg før resultatet. PRD FR-13 og FR-15 ble endret 11.11 (commit 71500d7).

**Approach:** Quizen lages automatisk når siden åpnes, med synlig ventetekst. Kildeavsnittet tilbys bak én knapp. Mellomsteget fjernes: eleven leverer, ser fasit og eksempelsvar samlet, og krysser av for kortsvarene i resultatet — da oppdateres antall riktige, også i det lagrede forsøket.

## Boundaries & Constraints

**Always:** Fasiten og eksempelsvarene sendes aldri til nettleseren før quizen er levert. Rettingen skjer på serveren mot fasiten i databasen (`rettQuiz`). Et kortsvar teller som ikke riktig til eleven har krysset av for at det var riktig; et tomt kortsvar kan aldri bli riktig. Resultatet er «antall riktige av totalt», aldri karakter eller prosent (FR-15). Eierskap sjekkes i datalaget (AD-8). Ventetid over to sekunder vises (§5).

**Never:** Ingen databasemigrasjon. Ingen endring i hvordan quizen genereres (prompt, modell). Flervalgssvar kan ikke endres etter levering.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Første åpning | Låst tekst uten quiz | Quizen lages uten trykk, «Lager quizen …» vises, så spørsmålene | Feil: melding med «Prøv igjen», ingen blindvei |
| Levering med kortsvar | Svar på alle | Resultat med fasit for flervalg og eksempelsvar for kortsvar; kortsvar teller ikke ennå | — |
| Kryss av «Ja» på kortsvar | Levert forsøk | Antall riktige øker med én, i resultatet og i «Tidligere forsøk» | Feil ved lagring: melding, avkrysningen settes tilbake |
| Kryss av «Nei» etter «Ja» | Levert forsøk | Antall riktige går ned igjen | Som over |
| Tomt kortsvar | Ikke besvart | Ingen avkrysning tilbys; teller som ikke riktig | Serveren avviser «riktig» for tomt svar |
| Feil svar | Flervalg feil, eller kortsvar | «Se hvor det står i teksten» er lukket til eleven trykker | — |
| Annen konto | forsøk-id fra en annen konto | Ingen endring | IkkeFunnet |

</frozen-after-approval>

## Code Map

- `app/tekst/[id]/quiz/page.tsx` -- viser `LagQuizSkjema` når `quiz === null`; byttes til en komponent som starter `lagQuiz` selv.
- `app/komponenter/Skjemaer.tsx:148` `LagQuizSkjema` -- erstattes av automatisk start; mønster å gjenbruke: `HentOversettelse` i `app/komponenter/Morsmaal.tsx` (kjører handlingen én gang i `useEffect`, viser status, `router.refresh()`, «Prøv igjen» ved feil).
- `app/komponenter/Quiz.tsx` -- fasene `svarer`/`vurderer`/`ferdig`; fasen `vurderer` og `visEksempelsvar` fjernes. `Kildeavsnitt` (linje 326) pakkes i `<details>`/`<summary>`.
- `app/handlinger.ts` `leverQuiz` -- må også returnere forsøkets id og eksempelsvarene (de finnes alt i `per[].riktigSvar`); `hentEksempelsvar` blir ubrukt og fjernes. Ny handling for å endre selvvurderingen.
- `data/quiz.ts` -- `rettQuiz` (gjenbrukes uendret), `lagreForsoek` (må returnere id), ny funksjon som oppdaterer `svar` og `antallRiktige` i ett forsøk med eierskapssjekk. `quizforsoek.svar` er JSON-tekst; ingen migrasjon.
- `data/quiz.test.ts` -- testene for retting, forsøk og eierskap utvides.
- `maaling/demotest.mjs` steg 6 -- trykker «Lag quizen», «Nei, ikke helt» og «Se resultatet»; må følge den nye flyten og åpne kildeknappen før «Les avsnittet i teksten».

## Tasks & Acceptance

**Execution:**
- [x] `data/quiz.ts` -- `lagreForsoek` returnerer id; ny `oppdaterSelvvurdering(t, tekstId, forsoekId, sporsmalId, riktig)` som leser forsøket, endrer svaret, retter på nytt med `rettQuiz` og lagrer `svar` og `antallRiktige` -- én retteregel for levering og etterpå.
- [x] `data/quiz.test.ts` -- test oppdateringen: øker og senker antall riktige, tomt kortsvar blir ikke riktig, flervalg kan ikke endres, annen konto får IkkeFunnet.
- [x] `app/handlinger.ts` -- `leverQuiz` returnerer `forsoekId`; ny handling `vurderKortsvar`; fjern `hentEksempelsvar`.
- [x] `app/komponenter/Quiz.tsx` -- to faner (`svarer`, `ferdig`); kortsvar i resultatet med eksempelsvar og «Var svaret ditt riktig?» som kaller `vurderKortsvar` og oppdaterer antallet; `Kildeavsnitt` bak knapp.
- [x] `app/tekst/[id]/quiz/page.tsx` og `app/komponenter/Skjemaer.tsx` -- automatisk start med ventetekst og «Prøv igjen»; fjern `LagQuizSkjema`.
- [x] `maaling/demotest.mjs` -- steg 6 etter ny flyt; sjekk at kildeavsnittet er lukket før trykk.

**Acceptance Criteria:**
- Given en elev som krysser av «Ja» på et kortsvar, when hen laster quizsiden på nytt, then «Tidligere forsøk» viser det nye antallet.
- Given en levert quiz, when resultatet vises, then ingen kildeavsnitt står åpne før eleven trykker.

## Implementation Notes

Implementert av underagent fra spesifikasjonen 12.11; diffen vurdert mot oppgavene etterpå. Alle seks oppgavene gjort. `npx tsc --noEmit` ren, `npm test` 384 av 384 (fem nye tester i `data/quiz.test.ts`), demotest 3 av 3 ([rapport](../../maaling/resultater/demotest-2026-11-12.md)).

- `leverQuiz` tar ikke lenger imot `selvvurdertRiktig`, så et kortsvar alltid teller som ikke riktig ved levering; feltet settes bare av `oppdaterSelvvurdering`.
- Ny feilklasse `UgyldigVurdering` (flervalg, eller «riktig» på tomt svar).
- Avkrysningen vises med én gang og settes tilbake ved feil; feltene låses mens det lagres.
- Kildeavsnittet bak `<details>` gjelder feil flervalg og alle kortsvar.

**Matrisen mot testene:** første åpning, levering, ja/nei, tomt kortsvar, lukket kildeavsnitt og annen konto er dekket av `data/quiz.test.ts` og demotest-steg 6, og begge kjørte. Feilhåndteringen i kolonnen «Error Handling» for automatisk start («Prøv igjen») og for avkrysning som ikke lagres (settes tilbake) er ikke dekket av en test: prosjektet har ingen komponenttester. Ført som utsatt arbeid.

**Kjent risiko (fra underagenten):** to avkrysninger på ulike kortsvar sendt samtidig leser og skriver hele forsøket uten lås, så den siste kan overskrive den første. Avkrysningene vises ikke på nytt etter omlasting (klienttilstand, som før); antallet i «Tidligere forsøk» er riktig.

## Review Triage Log

Tre lag (Blind Hunter, Edge Case Hunter, Verification Gap), underagenter med samme modell. Vurdert mot koden:

- **medium — patch.** Samtidige avkrysninger på ulike kortsvar (alle tre lag): `lagrer` holdt én id, så bare det ene spørsmålet var låst; to kall til `oppdaterSelvvurdering` kunne overskrive hverandre (les–endre–skriv uten lås), B ble låst opp når A var ferdig, og et eldre svar kunne vise feil antall. Samme rotårsak for tre funn.
- **high — patch.** `maaling/sjekk-readme.mjs` (FR-46) trykket «Lås og finn fagordene» for innlimt tekst og «Lag quizen»/«Se resultatet»; `maaling/sjekk-tilgjengelighet.mjs` gikk via gjennomsynet. Begge brutt av FR-3 (0176006) og denne endringen; ingen av dem kjøres av `npm test` eller demotesten, derfor ikke sett.
- **medium — patch.** Regelen «kortsvar teller ikke ved levering» var bare testet via en kopi (`levert()`), ikke det `leverQuiz` lagrer.
- **medium — patch.** Demotesten trykket aldri «Ja», så ingenting viste at antallet øker.
- **rejected (intensjon).** Selvvurderingen går tapt ved omlasting før avkrysning: intensjonen sier at et kortsvar ikke teller før eleven har krysset av.
- **low — rejected.** Gamle forsøk kan vurderes på nytt: egne data, sjeldent, og en grense ville lagt til regler.
- **false.** `lagQuiz.bind(null, id, {})`: `lagQuiz(tekstId, _forrige)` tar ikke FormData; typesjekken er ren.
- **low — rejected.** Quizen kan lages to ganger ved omlasting midt i genereringen: ett ekstra kall, og den unike indeksen (AD-15) beholder én quiz; en sperre på serveren ville vært ny kompleksitet.
- **false.** `tilgang()` utenfor `try` i `vurderKortsvar`: den sender til innlogging (`data/konto.ts`), samme mønster som de andre handlingene.
- **false.** Poengsummen annonseres ikke: den står i `role="status"` (Quiz.tsx).
- **low — rejected.** Feilmeldingen vises øverst, utenfor synsfeltet på mobil: sjelden, og flytting krever ny plassering per spørsmål.
- **low — rejected.** Unødvendig `.map` i `leverQuiz` og `router.refresh()` per avkrysning: ingen merkbar skade; `.map` erstattes av `tilElevsvar`.
- **low — rejected.** Ventingen i demotest-steg 6 bruker en fast pause: 3 av 3 kjøringer besto.
- **defer.** Gjennomsynet får ikke lenger axe-sjekk i `sjekk-tilgjengelighet.mjs`, siden innlimt tekst ikke kommer dit; må sjekkes via PDF.

## Design Notes

Selvvurderingen rettes på serveren med samme `rettQuiz` som leveringen, så det ikke finnes to regler for hva som er riktig. Nettleseren sender bare «spørsmål X: riktig ja/nei» for et forsøk, aldri et antall.

## Verification

**Commands:**
- `npx tsc --noEmit` -- ren
- `npm test` -- alle består (aldri `npx vitest run`: målingene skriver filer)
- `npm run demotest` -- 3 av 3 (PRD §9.5)

## Verifisering etter rettelsene (12.11)

`npx tsc --noEmit` ren; `npm test` 385 av 385; `npm run demotest` 3 av 3 ([rapport](../../maaling/resultater/demotest-2026-11-12.md)), blant annet «Ja» på et kortsvar øker antallet med én og gir merket «Riktig», og alle kildeavsnitt er lukket til eleven trykker. README-testen og tilgjengelighetssjekken kjøres etter C, før utrulling.
