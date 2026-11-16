---
title: 'Bruksgrenser (PRD §6.4): 5 tekster og 5 fagsamtaler per konto per døgn, 30 kr per døgn for hele appen'
type: 'feature'
created: '2026-11-16'
status: 'draft'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/arkitektur-lesevenn.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/EXPERIENCE.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-ki-feil-nytt-forsoek.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** PRD §6.4 setter tre grenser: høyst 5 nye Tekster og høyst 5 nye Fagsamtaler per konto per døgn, og stopp i nye genereringer når samlet forbruk for døgnet passerer 30 kroner. Ingen av dem finnes i koden. Appen ligger åpent på nettet, og budsjettet er 300–600 kroner for hele semesteret.

**Godkjent:** Arve 16.11: «1, 2 nå» og «Ja til migrering». Det gir én ny tabell, `forbruk`, både lokalt og i Neon. Ingen eksisterende data endres.

**Approach:**
- Hvert API-kall registrerer tokenbruken sin, også når forsøket feilet.
- Kostnaden regnes ut med prisene: Haiku 5.5 $0,10 / $0,50 og Sonnet 5.5 $2 / $10 per million tokens (inn / ut). Kursen er 10,5 kr per dollar.
- Før et nytt KI-kall sjekkes døgnets sum mot 30 kr.
- Grensene per konto telles fra tabellene som finnes (`tekst.opprettet` og `fagsamtale.opprettet`).
- Døgnet er norsk tid (Europe/Oslo), fra midnatt til midnatt.
- Meldingene står i EXPERIENCE.md (State Patterns: Bruksgrenser). Handlingene vises ikke som deaktiverte, men forklarer grensen når eleven trykker.

## Boundaries & Constraints

**Always:**
- **AD-1 og AD-10:** Generatorlaget importerer ikke databasen. `kjoerGenerator` gir tokenbruken tilbake på `Resultat` og på `GeneratorFeil`, eventuelt via en `paaForbruk`-callback som kalleren sender inn. Kalleren registrerer bruken via `data/forbruk.ts`.
- **AD-8:** Grensene per konto sjekkes i datatilgangslaget med `Tilgang`. Taket gjelder hele appen og trenger ikke eierskap, men det skrives bare fra serveren.
- **Testmodus `les`:** registrerer null og stoppes aldri av taket, slik at demotestene virker.
- **Tokenbruk:** Tokens inn inkluderer bufrede tokens hvis de finnes. Tokens ut inkluderer tenking (`usage.output_tokens`).
- **Prisene** står ett sted (`data/priser.ts`), med kilden og datoen i en kommentar. En ukjent modell gir en tydelig feil i testene og regnes til Sonnet-pris i drift, så taket heller slår inn for tidlig enn for sent.
- **Lagret innhold** kan alltid åpnes. Grensene stopper bare nye genereringer.
- **Påbegynte samtaler** kan fortsettes selv om grensen på 5 nye fagsamtaler er nådd. Taket for appen stopper likevel nye kall i dem.

**Never:**
- Ingen deaktiverte knapper.
- Ingen grense på oversettelser og etiketter per konto. Bare taket for appen gjelder dem.
- Ikke registrere forbruk fra harnessen (`maaling/`) i produksjonstabellen. Harnessen kaller generatorene uten callback.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Sjette tekst i dag | 5 Tekster med `opprettet` i dag (Oslo) | /ny viser «Du har lagt inn 5 tekster i dag. Du kan legge inn flere i morgen.» og en lenke til arbeidsbordet, før innlesingen. Handlingen avviser også på serveren | N/A |
| Sjette fagsamtale | 5 Fagsamtaler startet i dag | «Dagens 5 samtaler er brukt. Du kan starte en ny i morgen.» Påbegynte samtaler kan fortsettes | N/A |
| Taket er nådd | Sum i dag ≥ 30 kr | Nye KI-kall gir «LeseBuddy har nådd dagens grense for nye oppgaver. Alt du har laget, kan du fortsatt åpne. Prøv igjen i morgen.» i stedet for tenkeindikatoren | N/A |
| Midnatt | 23:59 → 00:01 Oslo | Tellerne starter på null | N/A |
| Forsøket feilet | `ugyldig_utdata` to ganger | Begge kallene er registrert | N/A |
| Testmodus `les` | Lagret svar | Ingen registrering, ingen sperre | N/A |

</frozen-after-approval>

## Code Map

- `generatorer/kontrakt.ts` `kjoerGenerator` -- (etter KI-feil-bolken) har ett nytt forsøk. `svar.usage` finnes på hvert API-svar. Legg bruken på `Resultat` (`forbruk: { oppgave, modell, inn, ut }[]`, ett element per kall) og på `GeneratorFeil` (samme felt).
- Generatorene (`faguttrykk`, `quiz`, `fagsamtale`, `morsmaal`, `minnevers`, `etiketter` og `bildeuttrekk`) -- send forbruket videre i sine egne resultattyper, eller gi `kjoerGenerator` en callback. Velg den løsningen som gir minst endring.
- `app/handlinger.ts` -- kallene står ved l. 307, 346, 375, 628, 698, 737, 832, 874, 884, 906 og 987. Bildeinnlesingen går kanskje via `app/api/bilde/route.ts`. Hvert sted gjør tre ting: sjekker taket før kallet, registrerer forbruket etter kallet (også i catch) og gir grensemeldingen.
- `data/skjema.ts` -- ny tabell `forbruk`. `data/migrasjoner/0007_forbruk.sql` lages med `drizzle-kit generate`, eller håndskrives i samme stil som 0006, med oppdatert journal i `meta/`.
- `data/tilgang.ts:122` `opprettTekst` og `data/fagsamtale.ts:76` `opprettFagsamtale` -- grensen per konto sjekkes her eller i handlingen før.
- `app/ny/page.tsx` -- vis grensemeldingen før innlesingen når grensen er nådd.
- Fagsamtale-kortet og neste steg (`data/arbeidsbord.ts` og `kortstatus`) -- EXPERIENCE.md: «Dagens 5 samtaler er brukt …» som status når grensen er nådd. `nesteSteg` hopper over «Neste: Fagsamtale» når grensen er nådd (regelen sier «og dagens samtalegrense er ikke nådd»).
- `package.json` -- `db:migrer` (lokalt) og `db:migrer:https -- --kjoer` (Neon). **Neon kjøres av hovedøkten etter gjennomgangen, ikke av deg.**

## Tasks & Acceptance

**Execution:**
- [ ] `data/priser.ts` (ny) og test -- prisene per modell, `kostnadMikrodollar(modell, inn, ut)` og `tilKroner`.
- [ ] `data/skjema.ts` og `data/migrasjoner/0007_forbruk.sql` -- tabellen med `id`, `opprettet` (timestamptz, default now, indeksert), `oppgave`, `modell`, `tokens_inn`, `tokens_ut` og `mikrodollar`. Kjør den lokalt med `npm run db:migrer`.
- [ ] `data/forbruk.ts` (ny) og test (PGlite som de andre datatestene) -- `registrerForbruk(liste)`, `dagensKroner()`, `taketNaadd()` og `startPaaDoegnet(naa)` for Oslo-midnatt. Grensene per konto: `teksterIDag(t)` og `samtalerIDag(t)`.
- [ ] `generatorer/kontrakt.ts` og generatorene -- forbruket ut på resultat og feil, med tester.
- [ ] `app/handlinger.ts` -- taket før kallet og registrering etter, på alle bruksstedene. Grensene per konto ved ny Tekst og ny Fagsamtale.
- [ ] `app/ny/page.tsx`, `data/arbeidsbord.ts` og Fagsamtale-flatene -- meldingene og statusen fra EXPERIENCE.md.
- [ ] `maaling/sjekk-tilgjengelighet.mjs` -- seed 5 Tekster for kontoen og sjekk at /ny viser meldingen. Seed forbruk over 30 kr og sjekk at en ny quiz gir takmeldingen. Rydd opp etterpå.

**Acceptance Criteria:**
- Given 5 Tekster i dag, when eleven åpner /ny, then ser hun meldingen før hun har limt inn noe, og en direkte POST til handlingen avvises også.
- Given at døgnets forbruk er 30 kr eller mer, when eleven ber om en ny quiz, then kalles ikke modellen, og takmeldingen vises.
- Given en fullført quizlaging, then finnes én rad i `forbruk` per API-kall, med tokens og kostnad.

## Verification

**Commands:**
- `npx tsc --noEmit`, `npm test`, `npm run lint` og `npm run build` -- forventet: grønt
- `npm run db:migrer` -- forventet: 0007 kjørt lokalt
- `npm run sjekk:tilgjengelighet` og `npm run demotest -- 1` -- forventet: bestått
