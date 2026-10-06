# Tilbakemelding på product brief

| | |
|---|---|
| **Gruppe** | G129 – G129-handeland |
| **Product brief** | `_bmad-output/planning-artifacts/product-brief-lesevenn.md` (commit `ff4a66f`). PRD, arkitektur og proposal i samme mappe er sett på som kontekst. |
| **Tilbakemelding fra** | Faglærer i IBE160 (utarbeidet med KI-støtte) |
| **Dato** | 2026-10-06 |

## Samlet vurdering

- **Godt utgangspunkt med justeringer.** Gruppen kan gå videre og innarbeide punktene under.

**Det som er bra:**

1. Briefen forankrer KI-bruken i en etablert lesepedagogisk struktur – aktivere forkunnskaper ut fra overskriftene, lese med fremhevede faguttrykk, og sjekke forståelse gjennom en skriftlig fagsamtale med oppfølgingsspørsmål – i stedet for en passiv oppsummering. Bakgrunnen med PISA 2025 og elever med norsk som andrespråk gjør problemet konkret og viktig.
2. Dere er ærlige om at «sammendrag og quiz fra opplastede notater» er et enkelt forslag i emnets liste, og at bidraget ligger i den pedagogiske sammensetningen og morsmålsstøtten. Planleggingen etter briefen er svært grundig: PRD-en har målbare krav med gullsett og terskler, en kuttrekkefølge, og arkitekturen holder alle språkmodellkall i et rent, testbart generatorlag.

**De viktigste endringene:**

1. Oppdater briefen så den stemmer med PRD-en. Briefen har mapper med samlet quiz og fagsamtale i v1, mens PRD-en har flyttet mapper til etter v1 (§4.9). Briefen sier også at bilde/OCR er utenfor v1, mens PRD-en har bildeinnlesing av boksider (FR-44 og FR-45). Bestem hva som gjelder, og oppdater briefen, så sensor kan følge en sporbar vei fra brief til PRD til kode.
2. Gjør suksesskriteriene i briefen testbare. «Identifiseres presist», «uten friksjon» og «faglig presis» kan ikke sjekkes. PRD-en har allerede tall og gullsett – løft de viktigste inn i briefen, for eksempel treffsikkerheten for faguttrykk mot gullsettet og andelen oppfølgingsspørsmål som er relevante.
3. Planlegg hvordan sensor kan kjøre appen. `.env.example` krever en Anthropic-nøkkel og en PostgreSQL-database, og briefens kjerne er nesten bare språkmodellkall. Lag en testmodus med lagrede svar for én eksempeltekst, og beskriv lokal database (for eksempel med Docker eller SQLite) i README, slik at sensor kan gå gjennom hele kjerneløypen uten deres nøkler.

## Vanskelighetsgrad og gjennomførbarhet

### Vurdert vanskelighetsgrad

- **Middels**

**Sammenlignbart med:** 7) Kurs-FAQ-chatbot (middels). Lesevenn bygger på 8) Foredragsnotater – sammendrag og quizgenerator (enkel), men den skriftlige fagsamtalen der KI vurderer elevens egne forklaringer, morsmålsstøtte og flere sammenhengende funksjoner med høye krav til kvaliteten i KI-svarene løfter prosjektet til middels.

**Begrunnelse:**

| Faktor | Nivå (lav / middels / høy) | Kommentar |
|---|---|---|
| Domenelogikk – hvor mange og hvor kompliserte regler og beregninger må stemme? | Middels | Lesestrategi-sekvensen, tetthetsgrenser for markering, regler for oppfølgingsspørsmål og svarvurdering i flere tilstander (definert i PRD-en). |
| Datamodell – antall entiteter og relasjoner mellom dem | Middels | Bruker, tekst, avsnitt, faguttrykk, quiz, øvekort, fagsamtale og resultater. Mapper øker kompleksiteten hvis de blir med. |
| Brukere, roller og innlogging | Middels | Enkel brukerkonto med lagring av tekster og resultater. Én rolle i v1. |
| KI-funksjonalitet i appen, f.eks. kall til språkmodell, prompts i koden og håndtering av usikre svar | Høy | Uttrekk av faguttrykk, quiz, fagsamtale med vurdering av elevsvar, oversettelse og minnevers – fem ulike KI-oppgaver der feil svar kan lære eleven noe galt. |
| Integrasjoner og eksterne tjenester, f.eks. API-er, betaling og e-post | Middels | Ett LLM-API, database og eventuelt Vercel. Suno er bare en prompt eleven kopierer, ikke en integrasjon. |
| Sanntid, samtidighet eller flere brukere som påvirker hverandre | Lav | Hver elev jobber for seg. |
| Filhåndtering, f.eks. opplasting, PDF-lesing og eksport | Middels | PDF-uttrekk i nettleseren med retting av råtekst. Bildeinnlesing i PRD-en øker nivået hvis den beholdes. |
| Sikkerhet og personvern | Middels | Brukerne er elever, delvis mindreårige, og elevsvar og morsmål kan være personopplysninger. Tekst sendes til en ekstern språkmodell. Bør nevnes kort i briefen. |

**Hva vanskelighetsgraden betyr for dere:**

- _Middels:_ Et godt balansert valg. Pass på at kjerneflyten blir ferdig og stabil før dere legger til mer: lim inn tekst → aktivering → lesevisning med faguttrykk → quiz. Fagsamtalen er det som skiller Lesevenn ut og bør komme rett etter, mens minnevers og morsmål kan komme senere i kuttrekkefølgen, slik PRD-en allerede legger opp til.

### Gjennomførbarhet med BMAD og Claude Code

Dere skal planlegge med BMAD (product brief → PRD → arkitektur → epics og stories) og implementere med Claude Code. Vurderingen under tar hensyn til at det må være tid til hele denne flyten, og til testing, retting og README til slutt.

| Spørsmål | Vurdering (OK / risiko / stor risiko) | Kommentar |
|---|---|---|
| **Tid og omfang** – kan v1 realistisk bli ferdig og stabil i løpet av semesteret, med tid til flere iterasjoner? | Risiko | Briefens v1 har sju funksjonsområder pluss konto, for en gruppe på én person. PRD-ens kutt (mapper ut) og kuttrekkefølge gjør det mer realistisk – følg den, og vurder å kutte bildeinnlesing også. |
| **BMAD-flyten** – er briefen konkret nok til at PRD, arkitektur og stories kan lages uten store hull, og blir det overkommelig mange stories? | OK | Briefen var konkret nok til en svært detaljert PRD og arkitektur. Pass på at stories ikke blir for mange – PRD-en har over 40 funksjonelle krav. |
| **Egnet for Claude Code** – bruker løsningen en vanlig, godt dokumentert teknologistakk som Claude Code håndterer godt, eller krever den nisjeteknologi, spesialmaskinvare eller mye manuell konfigurasjon? | OK | Next.js, TypeScript, PostgreSQL og et LLM-API med strukturert utdata er godt dokumentert, og prosjektet er allerede satt opp. |
| **Kontroll på KI-ens arbeid** – kan gruppen selv avgjøre om koden gjør det riktige? Krever domenet kunnskap gruppen ikke har, f.eks. avanserte beregninger eller fagregler, så er det vanskelig å kvalitetssikre. | Risiko | Gullsettene i PRD-en er et svært godt opplegg. Morsmålsoversettelsen er vanskeligere å kontrollere uten en som kan språket – dere har allerede kuttet til ett språk av den grunn, noe som er klokt. |
| **Testbarhet** – finnes det tydelige regler og forventede resultater som tester kan skrives mot? | OK | Generatorlaget kan testes isolert, og gullsett med terskler gir konkrete mål. Briefens egne kriterier bør oppdateres til å vise dette. |
| **Kjørbar for sensor** – kan appen kjøres lokalt etter README, uten gruppens nøkler, betalte kontoer eller egen infrastruktur? | Risiko | Krever i dag Anthropic-nøkkel og PostgreSQL, og `.env.example` peker mot Vercel. Uten testmodus og lokal database kan ikke sensor gå gjennom kjerneløypen. |
| **Avhengigheter og kostnader** – krever løsningen betalte API-er, f.eks. språkmodeller, og finnes det en plan for kostnad, testmodus eller mock-data? | Risiko | LLM-leverandør er valgt, men briefen sier ingenting om kostnad eller testmodus. Mange kall per tekst (uttrekk, quiz, samtale, oversettelse) kan gi merkbare kostnader under testing. |

**Konklusjon om gjennomførbarhet:**

- **Gjennomførbart med justert omfang.** Se forslagene under.

**Forslag til justering av omfang eller vanskelighetsgrad:**

1. Følg PRD-ens kutt og flytt mapper ut av v1 i briefen. Vurder også å flytte bildeinnlesing (FR-44/45) ut igjen, siden briefen opprinnelig holdt OCR utenfor og det er en ekstra kilde til feil.
2. Bygg i rekkefølgen kjerneløype (aktivering, lesevisning, quiz) → fagsamtale → øvekort → konto → morsmål → minnevers, og ha en fungerende, testet versjon etter hvert steg. Da har dere alltid noe stabilt å vise.

## Hvorfor product brief er viktig for mappen

Product brief er utgangspunktet for PRD, arkitektur, stories og til slutt koden. Del 1 av mappen vurderes blant annet på om sensor kan følge en sporbar vei fra plan til ferdig app. Den vurderes også på om appen gjør det dere har beskrevet, om den er testet, om den er godt designet, og om den kan kjøres etter README. Et uklart, for stort eller for lite brief gjør alt dette vanskeligere senere. Det er mye enklere å rette nå enn sent i semesteret.

## 1. Gjennomgang av briefens deler

| Del av brief | Status | Kommentar |
|---|---|---|
| Executive Summary – er det klart hva appen er, og hvilket problem den løser? | OK | Tydelig hva Lesevenn gjør og hvorfor, med en konkret beskrivelse av lesestrategi-sekvensen. Siste avsnitt om hva som vurderes i emnet kan kortes ned. |
| The Problem – er problemet konkret, med reelle situasjoner og brukere? | OK | Godt forankret i PISA-tall og situasjonen for andrespråkselever, med et godt poeng om at læreren ikke ser hvor forståelsen svikter. |
| The Solution – beskriver løsningen brukeropplevelsen, ikke bare teknologi? | OK | Beskriver hver funksjon fra elevens side. Teknologiavsnittet til slutt hører hjemme i arkitekturen, der det også står. |
| What Makes This Different – er vurderingen ærlig og realistisk? | OK | Svært ærlig om at byggeklossene er offentlige API-er, og at fordelen ligger i den pedagogiske sammensetningen. |
| Who This Serves – er primærbrukerne tydelige, og vet vi hva de trenger? | Juster | Primærbrukeren er tydelig, men aldersgruppen står ikke i briefen (prosjektreglene i `AGENTS.md` nevner videregående). Skriv det inn, siden det påvirker språk, design og personvern. |
| Success Criteria – kan kriteriene faktisk sjekkes eller testes? | Endre | Kriteriene er vage («presist», «uten friksjon», «faglig presis»). PRD-en har målbare krav – oppdater briefen med de viktigste. |
| Scope – er det klart hva som er med i første versjon, og hva som ikke er det? | Endre | Tydelig inndeling, men ute av takt med PRD-en (mapper og bildeinnlesing). Oppdater, så briefen og PRD-en sier det samme. |
| Vision – henger visjonen sammen med resten uten å blåse opp omfanget? | OK | Tale, lærerdashbord og diagnostikk er tydelig plassert etter v1. |

## 2. Utgangspunkt for del 1 av mappen

Punktene følger kriteriene i sensorveiledningen for del 1. Vektene i parentes viser hvor mye hvert kriterium teller i del 1.

| Kriterium i del 1 | Hva briefen bør legge til rette for | Status | Kommentar |
|---|---|---|---|
| **1. Prosess og KI-styring** (30 %) | Brief som er presis nok til at PRD og stories kan bygges direkte på den, slik at krav kan spores fra brief til kode. | Juster | Sterk prosess med PRD, arkitektur, gjennomganger og KI-logg. Men briefen er ikke oppdatert etter beslutningene i PRD-en – rett det, så sporbarheten blir tydelig. |
| **2. Funksjonalitet og omfang** (20 %) | Realistisk omfang for gruppen og semesteret: en tydelig kjerneflyt som kan bli ferdig og stabil, og nok innhold til å vise reell funksjonalitet. | Juster | Rikelig funksjonalitet. Omfanget er stort for én person, men kuttrekkefølgen i PRD-en gjør det håndterbart. |
| **3. Kvalitetssikring og testing** (15 %) | Suksesskriterier og funksjoner som er konkrete nok til å bli testtilfeller. | Juster | PRD-ens gullsett og terskler er svært gode. Briefens kriterier må oppdateres til å vise dem. |
| **4. Design og brukeropplevelse** (10 %) | Tydelige brukere og brukssituasjoner som designet kan bygges rundt, gjerne med de viktigste skjermbildene eller flytene skissert. | OK | Tydelig bruker og en sekvens som gir naturlige skjermbilder. Avklar aldersgruppe, og ta hensyn til elever som strever med lesing (lesbarhet, leseinnstillinger). |
| **5. Kodekvalitet og arkitektur** (10 %) | Teknologivalg som er begrunnet og ikke mer komplekse enn appen trenger. | OK | Begrunnede valg og et rent generatorlag som kan testes uten webapp og database. |
| **6. README og kjørbarhet** (10 %) | Løsning som andre kan kjøre lokalt uten betalte kontoer, og uten tilgang til gruppens egne tjenester og nøkler. | Juster | Avhengig av LLM-nøkkel og PostgreSQL. Planlegg testmodus og enkel lokal database, og beskriv dem i README. |
| **7. Ryddighet i repoet** (5 %) | En plan for hvor hemmeligheter, testdata og dokumentasjon skal ligge. | OK | `.env.example` finnes og `.env.local` er gitignorert. Sørg for at tekstene i gullsettene kan deles i et offentlig repo, og rydd opp i hjelpefiler som `reconcile-brief.md` når de er brukt. |

## 3. Neste steg for gruppen

1. Oppdater briefen så Scope stemmer med PRD-en (mapper ut, avklar bildeinnlesing), og skriv inn aldersgruppen (videregående) for primærbrukeren.
2. Erstatt de vage suksesskriteriene i briefen med de viktigste målbare kravene fra PRD-en.
3. Beskriv i arkitekturen og README hvordan sensor kan kjøre appen lokalt med testmodus for språkmodellen og en lokal database, før dere bygger videre.

Oppdater product brief i repoet når dere har gjort endringene, slik at historikken viser hvordan planen utviklet seg. Det er en del av prosessen sensor ser etter.
