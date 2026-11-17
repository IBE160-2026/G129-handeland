---
title: 'FR-6: forkunnskap som merking av overskriftene og ett «lurer på»-spørsmål, vist igjen etter lesingen'
type: 'feature'
created: '2026-11-17'
status: 'done'
baseline_commit: '339ba8aedf24ae26c7c1170033b7bd134bca2a55'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/arkitektur-lesevenn.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Aktiveringen er et tomt felt («Hva tror du teksten handler om?») som utvikleren selv ikke blir inspirert av. Svaret vises aldri igjen, selv om FR-6 lover det, så eleven skriver ut i løse luften.

**Approach:** Vedtatt av utvikleren 17.11 (alternativ C + D med A som belønning). C: eleven merker hver overskrift «Kjenner det», «Litt» eller «Helt nytt» med ett trykk. D: ett valgfritt felt «Noe du lurer på før du leser?». A: i lesevisningen, over «Ferdig med å lese?», står en del «Før du leste» som viser spørsmålet («Du lurte på: … Fikk du svar?») og hvilke overskrifter som var helt nye. Det frie feltet om hva teksten handler om fjernes.

## Boundaries & Constraints

**Always:**
- FR-6 gjelder fortsatt: ingenting vurderes eller rettes. Steget er ikke en sperre. Sender eleven uten merking og uten spørsmål, kommer ÉN oppfordring, og et nytt trykk på «Videre» slipper henne videre.
- AD-9: brødteksten er fortsatt skjult i aktiveringen, verken synlig eller i kildekoden. Overgangene og låsingen for innlimt tekst (FR-3) er uendret.
- Serveren regner overskriftene ut fra `rad.redigertTekst` med `delIAvsnitt`/`overskrifter` (AD-12). Klienten sender bare merket per overskriftsnummer (`merke-<nummer>` = `kjent` | `litt` | `nytt`). Ukjente nummer og verdier forkastes (AD-11-ånd).
- Merkingen lagres som overskriftens tekst og merket, ikke som nummer. Gjennomsynet for PDF og bilde kan flytte avsnittene etter aktiveringen.
- Merkingen er vanlige radioknapper (`fieldset` med overskriften som `legend`), og den virker uten skript. Valgene ser ut som knapper.
- Tekster fra før endringen, som bare har `forkunnskapssvar`, viser «Før du leste, skrev du: …» i samme del. Har en tekst ingenting, vises ikke delen.
- Teksten låst, siden åpnet igjen: overskriftene vises med elevens merke, uten skjema (slik i dag).

**Never:**
- Ingen modellkall og ingen kostnad. Buddy svarer ikke på spørsmålet.
- «Fikk du svar?» lagres ikke. Det er en oppfordring med lenke til fagsamtalen (`/tekst/[id]/oppgaver`).
- Ingen markering av «helt nye» avsnitt inne i lesevisningen. Ingen endring av oppgavesiden eller arbeidsbordet.
- Den gamle kolonnen `forkunnskapssvar` slettes ikke.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Alt fylt ut | 3 overskrifter merket, spørsmål skrevet | Lagres, tilstand `aktivert` (liming: `laast`), videre som i dag | N/A |
| Bare merking | 2 av 3 merket, intet spørsmål | Lagres uten oppfordring. Umerkede overskrifter lagres ikke | N/A |
| Ingenting | Tomt skjema, første gang | Oppfordring: merk en overskrift eller skriv et spørsmål, eller trykk «Videre» igjen | Andre trykk lagrer tom forkunnskap |
| Ingen overskrifter | Teksten har ingen overskrifter | Bare spørsmålsfeltet vises | N/A |
| Forfalsket skjema | `merke-99` eller `merke-1=feil` | Forkastes stille | N/A |
| Langt spørsmål | Over 500 tegn | Kappes til 500 (`maxLength` i feltet og kapping på serveren) | N/A |
| Lesevisning, gammel tekst | Bare `forkunnskapssvar` | «Før du leste, skrev du: …» | N/A |

</frozen-after-approval>

## Code Map

- `data/skjema.ts` -- `tekst`: legg til `forkunnskapMerking: jsonb("forkunnskap_merking").$type<Overskriftsmerke[]>()` og `lurerPaa: text("lurer_paa")`. Behold `forkunnskapssvar` (merk den som gammel).
- `data/migrasjoner/` -- ny `0008_…sql` med `npx drizzle-kit generate` (bare `ADD COLUMN`, begge kan være null). Testene kjører migrasjonene i PGlite. Mot Neon kjøres den først ved utrulling, og det krever ja.
- `data/tilgang.ts:156-180` -- `lagreForkunnskapssvar(t, id, svar: string)` → tredje parameter `{ merking?: Overskriftsmerke[]; lurerPaa?: string }`. Behold navnet, where-klausulen og IkkeFunnet. Kall i testene (`data/*.test.ts`, `app/handlinger.test.ts:82,253`) sender i dag en streng og skal over til `{ lurerPaa: "…" }`.
- `app/handlinger.ts:194-250` -- `lagreAktivering`: les `merke-*` og `lurerPaa`, slå opp overskriftene fra `rad.redigertTekst`, og bruk tom-oppfordringen (`tomtEtterOppfordring`) på «ingen merking og intet spørsmål». Resten (låsing for liming, omdirigering) er uendret.
- `app/komponenter/Skjemaer.tsx:55-99` -- `AktiveringSkjema` får `titler` (nummer, innhold, «laget av LeseBuddy») og tegner radiogruppene og spørsmålsfeltet (`id="lurer-paa"`, `name="lurerPaa"`). `Send` og `Feilmelding` gjenbrukes.
- `app/tekst/[id]/aktivering/page.tsx` -- overskriftslisten flyttes inn i skjemaet når det vises. Morsmålslinjen (`Morsmaalstekst`) står fortsatt under hver overskrift. Låst: listen med elevens merke, uten skjema. Ny innledning: kort, til eleven, ikke lærerspråk.
- `app/tekst/[id]/lesing/page.tsx:349` -- ny del «Før du leste» rett før «Ferdig med å lese?», bygget av en ren funksjon (for eksempel `foerDuLeste(rad)` i `tekst/` eller `data/`) som kan enhetstestes.
- `app/globals.css` -- stil for valgene som knapper (`:checked` med `--lb-primaer`, synlig fokus). Bruk tokenene, ingen nye farger.
- `maaling/demotest.mjs:159,427`, `maaling/sjekk-readme.mjs:131`, `maaling/sjekk-tilgjengelighet.mjs:273` -- `fill("#svar", …)` → trykk på et merke og/eller fyll `#lurer-paa`.
- `_bmad-output/planning-artifacts/prd-lesevenn.md` (FR-6), `ux-designs/ux-Lesevenn-2026-11-12/EXPERIENCE.md`, `arkitektur-lesevenn.md` (AD-9-teksten om «forkunnskapssvar lagret») -- oppdater med dato 17.11 og grunnen (utviklerens test).

## Tasks & Acceptance

**Execution:**
- [x] `data/skjema.ts`, `data/migrasjoner/0008_*` -- nye kolonner og migrasjon -- lagringen
- [x] `data/tilgang.ts` + alle kall i testene -- ny parameter -- én lagringsvei
- [x] `app/handlinger.ts` -- les, valider og lagre skjemaet, tom-oppfordringen -- matrisen
- [x] `app/komponenter/Skjemaer.tsx`, `app/tekst/[id]/aktivering/page.tsx`, `app/globals.css` -- nytt skjema -- C og D
- [x] ren funksjon + `app/tekst/[id]/lesing/page.tsx` -- delen «Før du leste» -- A
- [x] tester: `app/handlinger.test.ts` (matrisen), enhetstest av den rene funksjonen (ny, gammel, tom)
- [x] `maaling/*.mjs` -- følg det nye skjemaet; legg i tilgjengelighetssjekken til at radiogruppene har navn og at «Før du leste» vises i lesevisningen
- [x] PRD FR-6, EXPERIENCE.md, arkitekturen -- dokumentene følger koden

**Acceptance Criteria:**
- Given en innlimt tekst med overskrifter, when eleven merker én som «Helt nytt», skriver «Hvorfor blir maten varm?» og trykker «Videre», then lesevisningen viser «Du lurte på: Hvorfor blir maten varm?», en lenke til fagsamtalen og den helt nye overskriften.
- Given aktiveringssiden på 375 px, when eleven bruker bare tastaturet, then hver radiogruppe nås med Tab og piltaster, og valgt merke er synlig uten farge alene.
- Given en tekst låst før 17.11, when lesevisningen åpnes, then den viser det gamle svaret under «Før du leste» eller ingen del hvis svaret er tomt.

## Implementation Notes

- Den rene modulen er `tekst/forkunnskap.ts`: kodeverket (`MERKER`, `MERKENAVN`), typen `Overskriftsmerke`, `lesMerking` (skjemaet mot overskriftene fra serveren), `lesLurerPaa` (trim og kapping til 500), `somListe` og `foerDuLeste`. `data/skjema.ts` og `data/tilgang.ts` importerer bare typen.
- Migrasjonen er `data/migrasjoner/0008_forkunnskap_merking.sql` (to `ADD COLUMN`, begge kan være null). Ikke kjørt mot Neon.
- `lagreForkunnskapssvar` lagrer `merking ?? []` og `lurerPaa` som null når den er tom. En tekst aktivert etter endringen har altså `forkunnskap_merking = []` heller enn null når ingenting er merket; `foerDuLeste` behandler begge som tomt.
- Oppfordringen ved tomt skjema: «Du har ikke merket noe ennå.» med «Merk en overskrift, eller skriv noe du lurer på … trykk «Videre» en gang til.». Uten overskrifter: «Du har ikke skrevet noe ennå.» med en tekst om spørsmålet.
- Valgene er `label.merkevalg` med radioknappen usynlig over hele valget (opacity 0, `inset: 0`). Valgt: fylt i `--lb-primaer` og hake (`::before`, `content: "✓" / ""`). Fokus: `:has(input:focus-visible)` med samme ring som resten av appen. Egen regel for tvungne farger.
- Låst eller «lås på nytt»: overskriftslisten viser «— du merket: …» per overskrift, slått opp på overskriftens tekst.
- «Fikk du svar?»-lenken heter «Til fagsamtalen» og går til `/tekst/[id]/oppgaver`, som spesifisert (oppgavesiden er ikke endret, så den har ikke noe anker for fagsamtalen).

## Spec Change Log

## Review Triage Log

Runde 1 (17.11): Blind Hunter (B), Edge Case Hunter (E) og Verification Gap (V).

| Funn | Vurdering | Bevis / rute |
|---|---|---|
| V1 Gjenåpnet aktivering med «du merket» sjekkes ikke | medium | Ingen sjekk ser etter merket eller at skjemaet er borte. Rettes |
| V2 «Før du leste, skrev du» for gamle tekster testes ikke på siden | medium | Bare enhetstest av `foerDuLeste`. Rettes |
| V3 Sidesjekkene kjøres ikke av `npm test` | low | Slik har prosjektet alltid vært (ingen CI). Avvist |
| B1 Diffen mangler journal og snapshot for 0008 | false | Utelatt med vilje av den som laget diffen; `_journal.json:65` har `0008_forkunnskap_merking`. Manglende linjeskift er kosmetisk. Avvist |
| B2 PRD: «Steget gjør ingen modellkall» | low | Usant for innlimt tekst (låsing og fagord skjer i samme handling). Direkte rettelse. Rettes |
| B3 Tom-oppfordringen nevner overskrifter når teksten ikke har noen | low | Ser ut som feil tekst. Direkte rettelse. Rettes |
| B4/E7/E10 Valgt og fokus avhenger bare av `:has()` | low | Eldre nettlesere ser ikke valget. `@supports`-reserve er en liten rettelse. Rettes |
| B5/E1/V4 Like overskriftstekster deler ett merke | low | Sjeldent, og rettelsen gir lagringen ny form. Avvist |
| B5/E2/E8 Overskrift endret i gjennomsynet → merket borte ved gjenbesøk | low | Bare PDF/bilde, og bare visningen i aktiveringen; «Før du leste» viser det eleven merket. Avvist |
| B6 Lenketeksten og målet sier ulike ting i PRD, EXPERIENCE og kode | low | EXPERIENCE.md avviker fra koden. Rettes i dokumentet |
| B7 500-grensen håndheves bare i handlingen | low | Én kaller. Avvist |
| B8 Lagrede merker valideres ikke ved lesing | low | Skrives bare via `lesMerking`. Avvist |
| B9 Ingen test for at nytt låseforsøk beholder svaret | false | `handlinger.test.ts` (nytt forsøk etter låsefeil) sjekker `lurerPaa` etter andre trykk. Avvist |
| B10 Skjermlesere hører ikke spørsmålet til gruppene | low | Instruksen står utenfor `fieldset`. `aria-describedby` er en liten rettelse. Rettes |
| B11 «Før du leste» har ikke morsmålslinje | low | Ny oversettelse er ikke en liten rettelse. Utsatt (deferred-work.md) |
| B12 Gjenbesøk uten overskrifter bruker skjemateksten | low | «ingenting å merke her» uten skjema. Direkte rettelse. Rettes |
| B13 Skjemaet kan endres mens det sendes | low | Slik virker alle skjemaene i appen. Avvist |
| E3 Side lastet før utrulling sender `svar` | low | Bare åpne faner i utrullingsøyeblikket. Avvist |
| E4 Ny merking etter låsefeil lagres ikke | low | Sjeldent, og svaret fra første trykk står. Avvist |
| E5 Kapping kan dele et surrogatpar | low | Krever emoji akkurat ved tegn 500. Avvist |
| E6 CRLF telles dobbelt ved kapping | low | Feltet godtar tekst som serveren kapper. Én linje. Rettes |

## Design Notes

Merkingen lagres slik: `[{ overskrift: "Mikrobølger", merke: "nytt" }]`. I lesevisningen vises merket «nytt» som «Helt nytt for deg før du leste: …», og «kjent»/«litt» oppsummeres i én linje. Teksten er rettet til eleven og skal holde seg kort.

## Verification

**Commands:** (fra PowerShell; `vitest` feiler i Git Bash)
- `npx tsc --noEmit` -- ingen feil
- `npm test` -- alle grønne
- `npm run sjekk:tilgjengelighet` -- alle bestått
- `npm run sjekk:readme` og demotesten (`node maaling/demotest.mjs`) -- grønne
