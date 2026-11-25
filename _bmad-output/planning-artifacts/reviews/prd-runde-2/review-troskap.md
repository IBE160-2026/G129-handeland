---
title: Troskapskontroll av PRD runde 2
created: 2026-11-25
gammel: scratchpad/prd2/gammel-prd.md (1152 linjer, commit 1ce6de3)
ny: _bmad-output/planning-artifacts/prd-lesevenn.md (1270 linjer)
logg: _bmad-output/planning-artifacts/beslutningslogg-prd.md
---

# Troskapskontroll: PRD runde 2

Kontrollen gikk gjennom den gamle PRD-en krav for krav (FR-1 til FR-53, §5–§12, SM-ene og demostegene i §9.5) mot den nye. FR-38–43, som nå er DK-1–DK-6 i §13, er bare sjekket for kryssreferanser. «G» betyr linjenummer i gammel PRD, «N» i ny PRD og «L» i beslutningsloggen.

**Samlet:** omskrivingen er stort sett tro mot originalen. Tall, terskler, meldingstekster og knappenavn står ordrett i alle FR-er jeg sjekket. §5, §6.1, §9.5 og SM-1 til SM-6 og SM-8 til SM-13 krever det samme som før. Funnene samler seg på tre steder: noen få omformuleringer som endrer omfanget (FR-28, FR-30), milepælene i §9 (nye plasseringer av FR-37, FR-46 og FR-53) og statustabellen i §9.6. Statustabellen har ett tall som er feil, én målestatus som er misvisende, og den oppfyller ikke DK-3, som den selv sier at den gjør.

| Type | Høy | Middels | Lav | Sum |
|---|---|---|---|---|
| 1. Endret krav | 0 | 2 | 7 | 9 |
| 2. Tapt krav | 0 | 2 | 4 | 6 |
| 3. Nytt krav | 0 | 2 | 2 | 4 |
| 4. Feil i statustabellen §9.6 | 1 | 2 | 5 | 8 |
| 5. Brutte kryssreferanser | 0 | 0 | 6 | 6 |
| **Sum** | **1** | **8** | **24** | **33** |

---

## 1. Endret krav

### E1 — FR-30: Suno-prompten er gjort betinget (middels)

- **G 646–648:** «Suno-prompten er ferdig til å limes inn i et eksternt verktøy og krever ingen redigering. … Eleven ser tydelig hvilket av de to hun får, og kan be om det andre. **Suno-prompten er satt på pause** … Generatoren kan fortsatt lage formen, men appen tilbyr den ikke.»
- **N 663–664:** «**Suno-prompten er satt på pause.** … Når Suno-prompten tilbys, er den ferdig til å limes inn … og eleven ser tydelig hvilket av de to hun får og kan be om det andre.»
- **Hva er endret:** i den gamle PRD-en var «eleven ser … og kan be om det andre» en ubetinget konsekvens, selv om den motsa pausen. Den nye teksten løser motsigelsen ved å gjøre konsekvensen betinget («Når … tilbys»). Det er sannsynligvis riktig, men det er en endring av kravet og står ikke som en beslutning i loggen (L 257–259 nevner bare datoen for pausen). I dag kan ingen test sjekke den betingede konsekvensen.
- **Forslag:** behold den nye formen, og før endringen i loggen som en avklaring av en motsigelse.

### E2 — FR-28: tilbakeoversettelse er slått sammen med «ikke uavhengig kontroll» (middels)

- **G 621–623:** tilbakeoversettelse er et eget mål med terskel («Antall avvik i disse tre kategoriene: **null**»). Regelen om «hint underveis» gjaldt bare *et annet oversettelsesverktøy*: «Et oversettelsesverktøy er ikke en uavhengig kontroll … Det kan brukes som et hint underveis, men det kan ikke kalles kvalitetssikring i rapporten.»
- **N 635–636:** målet med null avvik står (635), men på neste linje står det: «Tilbakeoversettelse og andre maskinoversettelsesverktøy er ikke uavhengig kontroll. De kan brukes som hint underveis, men kalles ikke kvalitetssikring i rapporten.»
- **Hva er endret:** «hint underveis» gjelder nå også tilbakeoversettelsen. Den er fortsatt et terskelmål i FR-28 og i SM-4 (N 1117). Gammel tekst sa at tilbakeoversettelse «ikke kan bære mer enn» tre ting (G 622), ikke at den bare er et hint. Leseren får nå to signaler som strider mot hverandre om hvilken status målingen har. L 246 sier at «regelen står igjen som konsekvens», men regelen har fått større omfang.
- **Forslag:** del linje 636 i to. Den ene setningen sier at et annet maskinoversettelsesverktøy bare er et hint. Den andre sier at tilbakeoversettelsen bare måler tapt nekting, tall og egennavn.

### E3 — FR-7: «reglene over» viser til en regel som ikke står over (lav)

- **G 279, 285:** «Settet leveres da selv om tetthetsmålet står som brutt», og «Så lenge hvert beholdt Faguttrykk skal ha minst én markering, kan taket ikke oppfylles.» Det siste var en premiss i en målebeskrivelse.
- **N 293:** «Kan et tak ikke oppfylles uten å bryte reglene over (gulvet, eller at hvert beholdt Faguttrykk har minst én markering), leveres settet …»
- **Hva er endret:** «hvert beholdt Faguttrykk har minst én markering» er nå formulert som en regel, men ingen konsekvens over linje 293 sier det (FR-9 sier at «alle» markeres, N 347). Selve hovedregelen (måletall, ingen sperre) er uendret.
- **Forslag:** legg til «hvert beholdt Faguttrykk markeres minst én gang» i kappingsrekkefølgen (N 290), eller vis til FR-9.

### E4 — §9.2: M1 krever nå hele DK-2, ikke bare én forbedring (lav)

- **G 1031:** «Promptregisteret viser minst én dokumentert forbedring over to versjoner (FR-39).»
- **N 996:** «Promptregisteret oppfyller DK-2 (FR-39), med minst én dokumentert forbedring.»
- **Hva er endret:** M1-kriteriet er styrket fra én forbedring til alle kriteriene i DK-2 (rad for hver versjon, hypotese, målinger per versjon). Endringen er logget som bevisst (L 426), og DK-2 kan endres fritt, men §9.2 hører ikke til §13.

### E5 — FR-44: en begrunnelse er løftet opp til kravsetningen (lav)

- **G 191** (i avsnittet «Hvorfor dette er i v1»): «Uttrekket gjøres med den samme multimodale språkmodellen appen alt bruker til alt annet …»
- **N 196** (i kravsetningen): «Uttrekket gjøres med den samme multimodale språkmodellen appen bruker til alt annet.»
- **Hva er endret:** setningen var en begrunnelse og er nå en føring. Bokstavelig lest stemmer den ikke: Fagsamtalen bruker `claude-sonnet-5-5`, bildeuttrekket `claude-haiku-5-5` (N 916, `prompts/gjeldende.json`). Foreslå «den samme modellen som standardoppgavene (§6.4)», eller flytt den tilbake til Hvorfor.

### E6 — FR-13: Hvorfor lover mer enn konsekvensen (lav)

- **G 407 / N 399:** spørsmålene dekker overskriftsdelene «når Teksten har fire eller færre deler».
- **N 404 (ny):** «**Hvorfor:** … og den skal dekke hele Teksten.»
- En tester kan lese Hvorfor som et ubetinget dekningskrav. Foreslå «dekke Tekstens hoveddeler».

### E7 — SM-7: krav om konfidensintervall er lagt til (lav)

- **G 1089:** «Minst 85 prosent … (samme terskel som FR-14) …»
- **N 1123:** «… rapportert med konfidensintervall (samme terskel og rapportering som FR-14) …»
- Kravet er strammere enn før, men FR-14 krevde det allerede (G 420, N 414). Endringen er logget (L 459). Det er greit, og står her bare for fullstendighetens skyld.

### E8 — §11 pkt. 11 og 14: modellfordelingen er omskrevet (lav)

- **G 1127** viste til §6.4 (G 950): Sonnet brukes til «Samtalestart, Svarvurderingen og oppfølgingsspørsmålene».
- **N 1154:** «`claude-sonnet-5-5` for Samtalestart og Svarvurderingen». Oppfølgingsspørsmålene er falt ut, mens §6.4 (N 916) fortsatt nevner dem. Det er bare en uoverensstemmelse, ingen kravendring.
- **G 1130 → N 1157:** spørsmålet om bildeuttrekket gjelder nå `claude-haiku-5-5`, ikke 4-5. Svaret stemmer med `prompts/gjeldende.json` («capabilities.image_input, sjekket 16.10.2026»). Greit, men ny tekst.

### E9 — Ordlisten, brukerreisene og §2.1 er rettet etter senere krav (lav)

- **§3 Aktivering, G 87 → N 88:** «eleven skriver kort hva teksten sannsynligvis handler om» er blitt «eleven merker hvor godt hun kjenner hver av dem og kan skrive noe hun lurer på».
- **UJ-1 G 58 → N 58, UJ-2 G 64 → N 64, UJ-4 G 75 → N 75:** fritt forkunnskapssvar er erstattet med merking. PF-1-kanttilfellet sier nå «ta bilder av sidene».
- **§2.1, G 46 → N 46:** «Begge deler vurderes, med henholdsvis 70 og 30 prosents vekt» er rettet til 70 prosent for kode og dokumentasjon og 30 prosent for refleksjonsrapporten.
- Alle tre er rettinger av motsigelser mot FR-6, FR-44 og §0, og alle er logget (L 27, 31–35, 41). Ingen av dem endrer hva et FR krever.

---

## 2. Tapt krav

### T1 — FR-48: fokus går tilbake til bunken når den lukkes (middels)

- **G 869:** «En bunke kan åpnes og lukkes med tastatur. Esc lukker, og **fokus går tilbake til bunken**.»
- **N 834:** «Bunkene kan åpnes og lukkes med tastatur. Esc lukker fra begge nivåene, og fokus står alltid på et synlig element: bunken, det første kortet, eller tekstkortet eleven kom fra.»
- **Hva er tapt:** den nye teksten sier at fokus er på ett av tre elementer, men ikke at Esc sender fokus tilbake til bunken. Regelen står i EXPERIENCE.md (Viften: «Esc lukker, og fokus går tilbake til bunkens knapp»), men den gjelder tastatur og tilgjengelighet, og etter OPPDRAG regel 7 skal den bli stående i PRD-en. Loggen nevner ikke at den er tatt ut.
- **Forslag:** legg til «Lukkes bunken, går fokus tilbake til bunkens knapp» i N 834.

### T2 — FR-8: utvalgsbegrensningen som «skal stå» (middels)

- **G 335:** «**En begrensning som skal stå:** teksttypen og tekstkilden er ikke helt uavhengige … Tekst 6 er den eneste med et tungt kutt, og at den er autentisk er en skjevhet verdt å nevne når tallene per kilde leses.»
- **N:** ingenting. Teksten står bare i L 133 (som «Begrunnelse») og i `annotering.md`.
- **Hvorfor dette er et krav:** «skal stå» og «verdt å nevne når tallene per kilde leses» er en regel for hvordan resultatene rapporteres. Den hører til kravet om rapportering per tekstkilde (N 336), og ingen DK fanger den opp.
- **Forslag:** én setning under N 336: «Rapporteringen per tekstkilde nevner at Tekst 6 er den eneste med et tungt kutt.»

### T3 — Andre «skal stå i rapporten»-instrukser finnes nå bare i loggen (lav)

Hver for seg er de svake regler, men til sammen er de en liste over det rapporten skulle si, og DK-5 og DK-6 nevner ingen av dem:

| Gammel | Tekst | Nå |
|---|---|---|
| G 557 (§4.7) | «At tilgang til én person avgjør hva prosjektet kan påstå, er verdt å si rett ut i rapporten» | L 218 |
| G 526 (FR-21) | den kontrafaktiske testen «verdt å skrive om i refleksjonsrapporten» | L 199 |
| G 776 (FR-39) | «Omformulert 8. oktober, og grunnen hører i rapporten» | L 305 |
| G 1118 (§11 pkt. 2) | solobygg «Verdt å nevne i refleksjonsrapporten som en rammebetingelse» | L 464 |
| G 988 (§8.2) | talebasert fagsamtale «Verdt å nevne i rapportens videreføringsdel» | L 404 |
| G 221 (FR-45) | avviket Råtekst/redigert tekst er «et spor verdt å se på i rapporten» | L 84 |

**Forslag:** gjør dem om til ett kriterium i DK-6 («Rapporten tar med punktene merket *rapport* i beslutningsloggen»), eller bekreft at de bare er tips.

### T4 — FR-6: «den låste visningen er uendret» (lav)

- **G 256** (i endringsnotatet 23.11): «… så lagrede merker, «Før du leste» og **den låste visningen** er uendret, uten migrasjon.»
- **N 258–260** dekker lagrede merker og «Før du leste», men ikke at Aktiveringen åpnet etter låsing viser spørsmålet og merkene uten skjema. Det står i EXPERIENCE.md («Teksten låst og siden åpnet igjen: …»), men verken som krav i PRD-en eller i loggen (L 99 siterer det uten å si at det er tatt ut).

### T5 — §11 pkt. 9: fristen «Avklares i M0» er tatt ut (lav)

- **G 1125:** «… Avklares i M0, siden annoteringen skjer der.»
- **N 1152:** fristen er borte og står bare i L 474. M0 er passert, men spørsmålet er fortsatt åpent, og det har nå ingen frist. Foreslå «Avklares før kodefrys» eller «utsatt etter v1».

### T6 — §6.4: «Opus 5 er oppgraderingsveien» (lav)

- **G 953:** «… Opus 5 er oppgraderingsveien om målingen krever det.»
- **N 919:** setningen er borte og står i L 392. Den er en plan og ikke et testbart krav, så det er greit at den er flyttet. Den står her fordi den sier hva som skjer om porten i FR-21 stryker.

---

## 3. Nytt krav (utenom §13 og §9.6)

### N1 — §9.3: FR-53 er plassert i slakken og «kan ikke kuttes» (middels)

- **G 1035–1045:** §9.3 nevner Mapper lett og designfasen. FR-53 (vilkår og aldersgrense) står ikke i noen milepæl.
- **N 1006:** «**Vilkår og aldersgrense** (FR-53) ligger også i slakken. Hvorfor: kravet må være på plass før frivillige testbrukere registrerer seg, og **det kan ikke kuttes**.»
- **Hva er nytt:** både plasseringen og regelen om at det ikke kan kuttes er nye. §9 er en kuttrekkefølge, så «kan ikke kuttes» er en ny regel i planen. Den står ikke i beslutningsloggen (§9.3, L 430–436). Innholdet er rimelig, siden behandlingsgrunnlaget i §6.2 henger på FR-53.
- **Forslag:** før det i loggen som en runde 2-endring, slik FR-37 og FR-46 er ført (L 418).

### N2 — §9.1: FR-37 (sletting) og FR-46 (testmodus) er lagt inn i M0 (middels)

- **G 1013:** «Konto og lagring, nok til at en Tekst kan hentes fram igjen (FR-35, FR-36).» FR-46 stod ikke i noen milepæl.
- **N 977–978:** «… og sletting (FR-35, FR-36, FR-37).» og «Testmodus med lagrede modellsvar og lokal database … (FR-46).»
- **Hva er nytt:** ferdig-definisjonen for M0 er utvidet. Det stemmer med det som faktisk ble bygget (L 418 viser til commits fra 7.10 og 14.–16.10), og loggen fører det som en bevisst endring etter Bård §4.5. Det er likevel en endring i hva milepælen krever, og den skal ikke regnes som ren omformulering.

### N3 — §3: Avsnitt er nå definert, og Kildeavsnitt er et avsnittsnummer (lav)

- **G 94:** «**Kildeavsnitt** — det avsnittet i Teksten som et generert element … er forankret i.» Avsnitt var ikke definert.
- **N 86:** «**Avsnitt** — én nummerert blokk i Teksten, **enten en overskrift eller brødtekst** … (`tekst/avsnittsdeling.ts`, AD-12) … Den låste Teksten deles én gang og lagres som nummererte Avsnitt (AD-2).» **N 95:** Kildeavsnitt «lagret som Avsnittets nummer (AD-2)».
- **Hva er nytt:** definisjonen er hentet fra arkitekturen og stemmer med koden. Men etter den kan en overskrift være Kildeavsnitt, mens prompt v4 og koden forkaster en overskrift som kilde for forklaringer (`prompts/REGISTER.md`, Faguttrykk v4; kodefunn 23). Den som skriver tester fra PRD-en alene, vil ikke vite om den regelen.
- **Forslag:** legg til i FR-7 (N 284): «Kildeavsnittet er brødtekst, ikke en overskrift.» Det er i så fall et nytt krav og må logges som det, men det beskriver hva koden allerede gjør.

### N4 — §3: nye termer i ordlisten (lav)

- **N 105–110:** Samlet øving, Samlet quiz, Arbeidsbord, Samlinger og Buddy, og faste navn på Gullsettene. Ingen av dem står i G 82–106.
- Termene innfører ingen ny oppførsel. «Samlet øving — alle Øvekortene fra **de låste** Tekstene» (N 105) stemmer med FR-51 (G 689). Termene er logget (L 46).

---

## 4. Feil i statustabellen §9.6

Sjekket mot `prompts/REGISTER.md`, `prompts/gjeldende.json`, mappen `prompts/`, `maaling/resultater/`, `ki-logg.md`, `kodefunn.md` og `git log`.

**Disse stemmer:** demotest 3 av 3 (25.11, `demotest-2026-11-25.md`); tilgjengelighet 656 av 656 (`tilgjengelighet-2026-11-25.md`); FR-8 v4 G 0,361, P 0,413, F1 0,380 (snitt av tre kjøringer 26.10); forklaringer 0 gale og 1 misvisende av 41 (11.11); annoteringsstøy 0,620 og κ 0,611 (`2026-10-26-annoteringsstoey.md`); FR-14 24 av 24, KI [0,86–1,00] (8.11; vurderingsarket har tre tekster × åtte spørsmål, mens REGISTER sier «seks tekster», som er en feil i REGISTER og ikke i PRD-en); FR-21 0 av 12, 0,93, 15/18, 5/6, 12/12 og 89 % (`2026-11-06-fr21-svarvurdering-v2/rapport.md`, REGISTER); FR-23 0 av 36 og 0 av 12; FR-28 0,981, 0 avvik og 0 av 16; FR-31 0 av 10 og huskeregel 6 av 10 (v3); FR-35 mutasjonstest 14 av 14 (`2026-11-23-innlogging-mutasjoner.md`); DK-1 26 oppføringer (`ki-logg.md`, «Status mot FR-38»); DK-4 28 kodefunn; commits i september, oktober og november, både for loggfilen og for repoet; DK-2-forbedringen v2 → v3, presisjon 0,42 → 0,46; FR-30 merket «Uferdig» (`app/tekst/[id]/minnevers/page.tsx`).

### S1 — DK-3 er merket «Oppfylt», men tabellen er ikke terskeltabellen (høy)

- **N 1044:** «Den er også terskeltabellen DK-3 krever: hver målte terskel står med målt verdi og bestått eller ikke bestått.» **N 1105:** «DK-3 … Oppfylt … denne tabellen er terskeltabellen.»
- **N 1221 (DK-3):** «Én tabell viser hver terskel i dokumentet … **Ingen terskel i §4 mangler i tabellen.**»
- **Hva mangler:** FR-7 verbatim 100 % og ikke-sirkulær 100 % (N 281, 283); FR-20 sporbarhet 100 % og gjentakelse under 0,6 (N 509, 511); FR-31 Faguttrykk i Begrepssettet 100 % (N 674); FR-14 null spørsmål som krever kunnskap utenfor Teksten (N 415; REGISTER har tallet, men tabellen viser det ikke); FR-27 høyst åtte per 1 000 ord (N 619); FR-2 20 sekunder (N 143). For flere av disse står bare «I prod» uten noe målt tall.
- **Konsekvens:** DK-3 er ikke oppfylt etter sitt eget kriterium, og det er nettopp den påstanden en sensor kan sjekke på fem minutter. Enten må radene fylles ut (mange av dem er dekket av `npm test`), eller så må status settes til «Delvis».

### S2 — DK-2: «23 promptversjoner i 10 oppgaver» stemmer ikke (middels)

- **N 1104:** «23 promptversjoner i 10 oppgaver, alle i registeret.»
- **Repoet:** `prompts/` har **21** versjonsfiler i 10 oppgaver: faguttrykk 4, minnevers 6, quiz 2, samtalestart 2, svarvurdering 2, og bildeuttrekk, etiketter, oppsummering, oversettelse og utpeking én hver. `gjeldende.json` har 10 oppgaver, så det tallet stemmer.
- **Forslag:** rett tallet til 21.

### S3 — FR-11: «Målt, delvis» er misvisende (middels)

- **N 1062:** «Målt, **delvis** | Terskel 0,80 nådd på fokusert tekst (0,865), ikke på oversiktstekst (0,564), med selvkonsistens over fem kjøringer (8.10)».
- **Kravet (N 369):** Jaccard ≥ 0,80 i det **ferdig kappede** Begrepssettet, «målt over de seks Tekstene i Gullsett Faguttrykk».
- **Kilden** (`maaling/resultater/2026-10-08-selvkonsistens.txt`): målingen er gjort med **prompt v2** (gjeldende er v4) på **to** tekster. Den fokuserte teksten, `straling-radioaktive-kilder.txt`, er **ikke** en av de seks i Gullsett Faguttrykk (`testdata/gullsett/`). Bare `em-egenskaper` tilsvarer tekst 1. Tallene stemmer med fila, men det kravet beskriver, er ikke målt.
- **Forslag:** sett status til «Ikke målt etter kravet (forhåndsmåling 8.10 på to tekster, prompt v2)». Ellers ser det ut som om terskelen er halvveis nådd.

### S4 — DK-2: «alle i registeret» er tvilsomt (lav)

- `REGISTER.md` fører samtalestart og svarvurdering i én felles tabell med to rader (v1, v2) for fire versjonsfiler. DK-2 (N 1206–1207) krever at hver versjon har en rad, og lister «oppfølgingsspørsmål» som egen kjøretidsprompt, men den finnes ikke som egen fil. Den er trolig en del av svarvurderingen. Enten må registeret deles, eller så må DK-2 si at oppfølgingen genereres av svarvurderingsprompten.

### S5 — FR-8: «Beste: v3, F1 0,409» står ikke i kildene (lav)

- Tallet kan regnes ut: snittet av makro-F1 over de tre v3-kjøringene 14.10 er (0,420 + 0,405 + 0,402) / 3 = 0,409. Men det står ikke i REGISTER, og REGISTER sammenligner på samme grunnlag v3 (med kodefunn 23 rettet) F1 0,384 mot v4 0,380 / 0,354. «Beste» sammenligner altså en v3-kjøring der kodefunn 23 ikke var rettet. Foreslå å oppgi grunnlaget («snitt av tre kjøringer 14.10, før kodefunn 23») eller bruke 0,384.

### S6 — «Prøvd i prod 25.11» har en annen kilde enn tabellen sier (lav)

- **N 1083, 1095:** «Registrering og sperren prøvd i prod 25.11», «Registrering med vilkår prøvd i prod 25.11».
- **N 1044** sier at tallene kommer fra `prompts/REGISTER.md` og `maaling/resultater/`. Den eneste kilden jeg fant, er `.logs/arve/issues.md` (lukket 25.11: «telefonsjekklistens punkt 1 og 2 OK på iPhone»). Legg kilden til i innledningen, eller lag en målefil.

### S7 — Milepæler som ikke står i §9.1–9.3 (lav)

| Rad i §9.6 | Står i §9.1–9.3? |
|---|---|
| FR-11 «M0» (N 1062) | Nei. §9.1 (N 975) lister FR-5, 6, 7, 9, 10, 13, 14, 15, ikke FR-11 |
| FR-3 «M1 (3b)» (N 1054) | Bare indirekte, gjennom FR-2 og FR-44 i §9.2 |
| DK-3 «M1» (N 1105) | Nei. §9.2 nevner Gullsettene, men ikke FR-40/DK-3 |
| FR-37, FR-46 «M0»; FR-53 «Slakk» | Ja, men bare i den nye §9.1 og §9.3 (se N1, N2) |

De øvrige radene stemmer med §9.1–9.3.

### S8 — FR-21: «ingen av de to er porter (AD-6)» viser til feil kilde (lav)

- **N 1072:** «Måltest … og avsnittstest … ikke bestått; ingen av de to er porter (AD-6).»
- AD-6 i `arkitektur-lesevenn.md` (l. 84–88) sier bare at sikkerhetsporten er en utgivelsesport. At måltesten og avsnittstesten ikke er porter, følger av FR-21 («to blokkerende porter», N 519) og ble avgjort 10.11 (REGISTER, avsnittet «AD-6»). Vis til FR-21 i stedet. SM-3 (N 1116) regner avsnittstesten på alle seks par som et suksesskriterium, så «delvis» er riktig status.

---

## 5. Brutte kryssreferanser

| # | Sted (N) | Tekst | Problem | Arvet? |
|---|---|---|---|---|
| K1 | 605 (FR-26) | «slik §6 krever» | Kravet om at oppsummeringen kommer etter lesing, står i §7 (N 925), ikke i §6. Hvorfor-linjen (N 608) viser riktig til §7. | Ja (G 595) |
| K2 | 819 (FR-47) | «registrering krever en kode fra læreren (FR-35)» | FR-35 (N 739–746) nevner ikke invitasjonskoden. Den står bare i §6.2 (N 879). | Ja (G 859) |
| K3 | 623 (FR-27, `[ANTAKELSE]`) | «tetthetsbudsjettet i FR-9» | Budsjettet står i FR-7. Rettet i §4.3 (L 108), men ikke her, fordi teksten står inne i et merke (regel 6). Kan rettes utenfor merket. | Ja (G 611) |
| K4 | 759 (FR-36) | «holder kostnaden nede (§6)» | Bør være §6.4. | Ja (G 728) |
| K5 | 1140 (SM-C4) mot L 460 | PRD: «(§13)»; loggen: «Nå «(§4.11, §13)»» | Loggen beskriver en annen tekst enn den som står i PRD-en. | Nei |
| K6 | 786, 806 | «### 4.11 Kjørbarhet», «### 4.12 Inngang, Arbeidsbord og Samlinger» | OPPDRAG regel 5 sier at overskriftene beholdes. §4.11 måtte endres fordi DK-ene ble flyttet, og det står i §0 (N 16). §4.12 er bare endret for å bruke ordlistetermene. Eksterne dokumenter som viser til «§4.11 KI-bruk og kvalitetssikring» (f.eks. `ki-logg.md`, `kodefunn.md` «Status mot FR-41»), peker nå feil. | Nei |

Disse kryssreferansene er sjekket og stemmer: alle FR-38–43 i ny tekst har DK-nummer ved siden av (N 16, 337, 532, 788, 980, 996, 998, 1097, 1119, 1173, 1185–1258); FR-21 → DK-5/DK-6; FR-8 → DK-2 og DK-5; §9.2 → DK-5 (FR-42) og DK-6 (FR-43); §12 #8 → §13 DK-5; §11 pkt. 16/17 ↔ `[ÅPENT]` i FR-7/FR-8.

---

## Kontrollert uten funn

Disse delene krever det samme som før, med samme tall og samme ordlyd i meldinger og knapper: FR-1, FR-2, FR-3 (inkludert at fase 3b hoppes over for innlimt tekst og låsen), FR-4 (PF-1–7 ordrett), FR-5, FR-6 (glider, koder, «Før du leste», skript), FR-9, FR-10, FR-12, FR-14, FR-15, FR-16, FR-17 (oppsettet er flyttet og står i EXPERIENCE.md l. 92 og 207, sjekket), FR-18–FR-23, FR-24 (listen med 16 språk), FR-25, FR-26, FR-27, FR-29, FR-31, FR-35 (sperre 5/1 min, «Vent 47 sekunder …»), FR-36, FR-37, FR-45, FR-46, FR-47, FR-49 (oppsettet står i EXPERIENCE.md l. 241–242), FR-50–FR-53, §5, §6.1–§6.4 (bruksgrenser 5/5/30 kr), §7, §8, §9.4, §9.5 (alle 15 steg), SM-1–SM-6 og SM-8–SM-13, SM-C1–SM-C4, §12.
