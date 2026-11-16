---
title: 'KI-feil: ett nytt forsøk og feilmeldinger per funksjon (§5, FR-7, FR-13, FR-19, FR-20)'
type: 'feature'
created: '2026-11-16'
status: 'done'
baseline_commit: '01f9de6288571999c2c3c56f5efe6ba35ab23734'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/arkitektur-lesevenn.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/EXPERIENCE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** PRD §5 og FR-7, FR-13, FR-19 og FR-20 (lagt til 13.11) krever at et kall til språkmodellen som feiler, prøves én gang til. Feiler det igjen, skal appen si hva som ikke ble laget, at det eleven har skrevet er lagret, og tilby «Prøv igjen». Koden gjør i dag ingen nye forsøk ved ugyldig utdata, og meldingene er generelle.

**Godkjent:** Arve 16.11: «1, 2 nå» (bruksgrenser og KI-feil). Beslutning tatt uten ham: forsøket skjer på serveren og vises ikke som en egen status («Prøver en gang til …»). En serverhandling kan ikke sende status underveis, og tenkeindikatorens tillegg etter 30 sekunder dekker lange ventinger.

**Approach:**
- `kjoerGenerator` prøver én gang til når feilen er `ugyldig_utdata`, `tidsavbrudd` eller `modellfeil`. Den prøver ikke på nytt ved `tilgang_avslaatt`, `for_mange_kall`, `prompt_mangler`, `ukjent_oppgave` eller `lagret_svar_mangler`.
- Bruksstedene gir de meldingene PRD-en krever per funksjon:
  - **FR-7:** fagordene kunne ikke lages nå. Teksten og Aktiveringen er lagret.
  - **FR-13:** quizen kunne ikke lages nå. Ingen quiz lagres.
  - **FR-19:** «Vurderingen feilet. Svaret ditt er lagret.» Runden telles ikke.
  - **FR-20:** vurderingen beholdes, og eleven får «Prøv igjen» for neste spørsmål. Samtalen avsluttes ikke.

## Boundaries & Constraints

**Always:**
- AD-1 og AD-10: forsøket ligger i generatorlaget (`generatorer/kontrakt.ts`), som fortsatt ikke importerer database- eller rammeverkskode.
- Det nye forsøket kjører hele kallet på nytt, med validering. Det nye svaret valideres akkurat som det første (AD-11).
- I testmodus `les` gjøres det ikke noe nytt forsøk, fordi et lagret svar ikke blir annerledes av å hentes igjen.
- Hver melding har `role="alert"` (Feilmelding), og fokus går til «Prøv igjen», som EXPERIENCE.md sier.
- Selvkonsistens (manifestets `konsistens`): forsøket gjelder hvert enkelt kall, ikke hele serien.

**Never:**
- Ingen endring i prompter, modeller eller manifestet.
- Ikke mer enn ett nytt forsøk.
- Ingen bruksgrenser eller forbruksmåling. Det er neste bolk.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Første kall ugyldig, andre gyldig | `parsed_output` null, deretter gyldig | Resultatet fra det andre kallet. Eleven merker bare litt lengre ventetid | N/A |
| To ugyldige | Null to ganger | `GeneratorFeil("ugyldig_utdata")` | Melding per funksjon og «Prøv igjen» |
| Tidsavbrudd, så gyldig | Timeout, så svar | Resultatet | N/A |
| Tilgang avslått | 401 | Ingen nytt forsøk, og dagens melding | Uendret |
| 429 | RateLimit | Ingen nytt forsøk (SDK-en har egne forsøk) | Uendret |
| Svarvurdering feiler to ganger | FR-19 | «Vurderingen feilet. Svaret ditt er lagret.» og «Prøv igjen». Runden telles ikke mot FR-22 | Svaret ligger i databasen |
| Oppfølgingen feiler | FR-20 | Vurderingen er lagret og vises, «Prøv igjen» for neste spørsmål, og samtalen er åpen | N/A |

</frozen-after-approval>

## Code Map

- `generatorer/kontrakt.ts:265-465` `kjoerGenerator`. Selve API-kallet og oversettelsen til `GeneratorFeil` står i try/catch. Del ut det ene kallet i en funksjon, og kall den høyst to ganger. Klientens `maxRetries` (SDK-en) styrer forsøkene ved nettverksfeil og 429, og den lar vi være.
- `generatorer/kontrakt.test.ts` -- eksisterende tester. Legg til tester med en falsk klient (se hvordan testene mocker i dag; finnes det ingen mock, injiser klienten via en intern parameter eller `vi.mock("@anthropic-ai/sdk")`).
- `app/handlinger.ts` -- har tre steder med `GeneratorFeil`. Finn alle handlinger som kaller generatorer (faguttrykk, quiz, samtalestart, svarvurdering og oppfølging, etiketter, morsmål, minnevers og bilde), og se hvilken melding de gir i dag.
- `data/fagsamtale.ts` -- `lagreSvar`, `lagreNyVurdering` og rundetellingen (FR-22, `MAKS_RUNDER`). Sjekk at et svar der vurderingen feilet, ikke teller som en runde, og at «Prøv igjen» (`RevurderKnapp` i `Samtale.tsx`) vurderer det lagrede svaret.
- `app/komponenter/Feilmelding.tsx` -- felles visning (`role="alert"` og fokus?). Sjekk at fokus går til «Prøv igjen».

## Tasks & Acceptance

**Execution:**
- [x] `generatorer/kontrakt.ts` -- ett nytt forsøk for `ugyldig_utdata`, `tidsavbrudd` og `modellfeil`, og ikke i testmodus `les`.
- [x] `generatorer/kontrakt.test.ts` -- tester for hver rad i matrisen som gjelder generatorlaget.
- [x] `app/handlinger.ts` (og bruksstedene) -- meldingene for FR-7, FR-13, FR-19 og FR-20. Bruk PRD-ordlyden der den finnes. Ellers følger meldingen mønsteret «X kunne ikke lages nå. [Det du har skrevet er lagret.]» med «Prøv igjen».
- [x] `data/fagsamtale.ts` og tester -- en runde der vurderingen feilet, telles ikke mot FR-22. En feil i oppfølgingen beholder vurderingen.
- [x] `app/komponenter/Feilmelding.tsx` -- `role="alert"` og fokus på «Prøv igjen» når den vises, hvis det mangler.
- [x] `EXPERIENCE.md` (Component Patterns: Tenkeindikator, og State Patterns: Nytt forsøk) -- forsøket skjer stille på serveren. Ta ut «Prøver en gang til …».

**Acceptance Criteria:**
- Given at modellen gir ugyldig svar én gang, when eleven lager en quiz, then får hun quizen uten feilmelding.
- Given at svarvurderingen feiler to ganger, then ser eleven «Vurderingen feilet. Svaret ditt er lagret.» og «Prøv igjen», og rundetelleren har ikke gått opp.

## Verification

**Commands:**
- `npx tsc --noEmit`, `npm test`, `npm run lint` og `npm run build` -- forventet: grønt
- `npm run sjekk:tilgjengelighet` -- forventet: bestått

## Review Triage Log

| # | Kilde | Funn | Vurdering | Rute |
|---|---|---|---|---|
| 1 | blind, edge, vgap | Forsøkene ganges (SDK 2 × kontrakt 2 × vurderSvar 2); 400 prøves på nytt | high: kostnad og ventetid | patch |
| 2 | blind, edge, vgap | svarISamtale kaster feil som ikke kan prøves på nytt; eleven får «Prøv igjen» ved 401 og 429 | high: bryter §5 | patch |
| 3 | blind, edge, vgap | laasOgGenerer mister fagordfeilen ved redirect | medium | patch |
| 4 | edge | FR-7-boksen mangler role=alert | medium: spec-krav | patch |
| 5 | blind | Feilmelding tar fokus ved hver innlasting | medium | patch |
| 6 | blind | FinnFagordPaaNytt viser teksten to ganger og mister fokus | medium | patch |
| 7 | blind | Nettfeil i klienten vises som KI-feil | low, direkte retting | patch |
| 8 | blind, edge | revurderRunde lagrer ny vurdering selv om oppfølgingen feilet | medium | patch |
| 9 | blind, edge | Samtidige forsøk gir «Noe gikk galt» | medium | patch |
| 10 | edge | Tom begrunnelse gir permanent feil | medium | patch |
| 11 | edge | Dobbeltklikk-vindu i ProevIgjen | low, direkte retting | patch |
| 12 | blind, edge | lagreSvar uten transaksjon | low | patch |
| 13 | edge | «N svar» teller vurderte runder | low, direkte retting | patch |
| 14 | blind | Arbeidsbordet viser en runde som ikke finnes i FR-20-tilstanden | medium | patch |
| 15 | blind | settKlientForTest er uten vakt | low, direkte retting | patch |
| 16 | blind | Første feil logges ikke | low, direkte retting | patch |
| 17 | blind | Død anbefaltHandling-tekst | low | avvist |
| 18 | vgap | nyttForsok, kiFeil, Feilmelding og handlingene er ikke testet | patch | patch |
| 19 | vgap | Regelene for hva samtalesiden viser er ikke testet | medium, ikke verifisert: krever omskriving til en ren funksjon | defer |
| 20 | edge | En vurdering som pågår, vises som feilet ved ny innlasting | medium: håndteres av #9 (samtidighet), men visningen gjenstår | defer |
