---
title: Rubrikkgjennomgang — arkitekturspine Lesevenn
type: review
target: arkitektur-lesevenn.md (status draft, oppdatert 2026-09-29)
mot: prd-lesevenn.md, .memlog-arkitektur.md, addendum-lesevenn.md
dato: 2026-09-29
kalibrering: solobygg, studentapplikasjon, ti uker, M0 30. oktober, utvikler ny i Next.js. Spinen vurderes som byggesubstrat, ikke som innlevering. Manglende bedriftsapparatur (SLA-er, flerteams utrulling, overvåkingsstabler) er ikke regnet som funn.
---

# Rubrikkgjennomgang — arkitekturspine Lesevenn

## Samlet dom: tynn

Spinen har et ryggradvalg som er riktig og godt begrunnet — det rene generatorlaget — og en beslutningshygiene som ligger over nivået for et studentprosjekt: hver AD har Binds/Prevents/Rule, antakelser er merket framfor pyntet, og teknologipåstandene er faktisk verifisert. Den er heller ikke for stor.

Men som *substrat* svikter den på de to skarpeste stedene, og det er de to stedene som bærer resten: generatorgrensesnittet slik det er formulert passer ikke de generatorene PRD-en faktisk krever, og avsnittsdelingen — grunnlaget under AD-2, §5 og hele FR-21 — er navngitt uten å være bestemt. Begge er billige å lukke nå og dyre å lukke i november. Dessuten er én hel dimensjon stille: filhåndtering og opplasting, som er der PRD-ens skarpeste juridiske invariant bor («bilder lagres ikke»).

Dommen er tynn, ikke brutt: ingen AD peker i gal retning, og rettelsene er tillegg, ikke omskrivinger.

| # | Dimensjon | Dom |
|---|---|---|
| 1 | Treffer den de reelle divergenspunktene | tynn |
| 2 | Er hver Rule håndhevbar, og hindrer den det den sier | tynn |
| 3 | Kan noe under Utsatt likevel la to enheter divergere | tynn |
| 4 | Er navngitt teknologi verifisert gjeldende | sterk |
| 5 | Dekker den PRD-kravene i `binds` | tynn |
| 6 | Er hver eid dimensjon bestemt, utsatt eller åpen | tynn |
| 7 | Er den for stor | sterk |

**Funn: 2 kritiske, 10 høye, 14 middels, 5 lave (31 i alt).**

---

## Svar på de to særskilte spørsmålene

**Er AD-2 tilstrekkelig til å hindre at inline-markering av faguttrykk og kildeavsnitt-henvisninger bygges uforenlig?**

Nei. AD-2 er *tilstrekkelig* til å hindre begrepsforvirring — den sier tydelig at de to er ulike ting — men *tynn* på det rubrikken faktisk spør om, som er om to enheter kan bygges uforenlig. Setningen

> «Tegnposisjoner for inline-markering av Faguttrykk er relative til sitt eget avsnitt og er en egen sak.»

navngir saken og lukker den ikke. Den sier ikke hvem som regner ut posisjonene (generatorlaget eller lesevisningen), om de lagres eller beregnes ved visning, om *alle* forekomster av et Faguttrykk markeres eller bare forekomsten i Kildeavsnittet, eller hvordan FR-27s eget sett (språklige bilder og akademisk allmennspråk) markeres i samme flate. Verre: FR-7s tetthetsgrense «høyst 3 markeringer per 100 sammenhengende ord» teller *markeringer*, altså forekomster — og kappingen skjer «ved uttrekk». Da må forekomstposisjoner være kjent i generatorlaget, ikke i lesevisningen, og det er en beslutning AD-2 skyver bort framfor å ta. Se K2, H6, M1, M3.

**Dekker AD-5/AD-6/AD-7 til sammen det FR-40 faktisk krever?**

Nei, ikke til sammen. De tre dekker to av FR-40s tre punkter. Gullsett som filer i repoet er dekket (konvensjonsraden `maaling/` pluss AD-7). Én kommando er dekket i navn (`npm run maal`). Det tredje punktet er ikke dekket:

> «Resultatene er lagret som data, og oppsummert i én tabell som viser hver terskel i dokumentet med målt verdi og bestått/ikke bestått.» (FR-40)

AD-5 deler terskelkontrollene i to kjøringer — `npm test` for de maskinsjekkbare, `npm run maal` for de statistiske og portene — og sier deretter at måleverktøyet skriver «oppsummeringstabellen FR-40 krever». Men halvparten av tersklene ligger da i den *andre* kjøringen, og ingenting sier hvordan testresultater kommer inn i tabellen. Dessuten er en stor del av tersklene manuelle vurderinger (FR-8s forklaringsriktighet, FR-14s manuelle gjennomgang, FR-21s manuelle relevans og treff mot forhåndsvalgt avsnitt, FR-23s blindlesing av tone, FR-28s eksterne vurdering) — AD-7 lagrer rå modellsvar, men ingen AD bestemmer hvor de *manuelle dommene* lagres som data, og uten dem kan tabellen ikke regenereres av én kommando. Se H1, H3, H4, M5.

---

## 1. Treffer den de reelle divergenspunktene for nivået under? — tynn

Truffet, og godt: modellgrensen (AD-1/AD-10), promptenes plassering og versjonering (AD-3/AD-4), tekstens livssyklus og hvem som får skrive (AD-9 pluss konvensjonsraden «All skriving til en Tekst går gjennom én modul som håndhever AD-9»), autorisasjonens plassering (AD-8), gyldighetsporten før lagring (AD-11) og domenevokabularet. Det er de riktige stedene å bruke et seed på.

Det som mangler er alt av samme slag: punkter der to selvstendig bygde deler må treffe hverandre presist, og der ingenting i spinen tvinger dem til det.

### K2 — kritisk: avsnittsdelingsregelen og generatorlagets inndatatype er ubestemt

AD-2 lover:

> «**Prevents:** at to enheter tolker «samme avsnitt» ulikt»
> «**Rule:** den låste Teksten deles i avsnitt én gang og lagres som numererte rader.»

«Deles i avsnitt» er ikke en regel. Er et avsnitt en blokk mellom tomme linjer, mellom enkle linjeskift, eller noe som også splitter på overskrifter? Er overskrifter egne avsnittsrader eller ikke? Det avgjør nummereringen, og nummereringen *er* hele referansesystemet.

Samtidig sier AD-10:

> «Inn: tekst og promptversjon. Ut: validert strukturert utdata med kildeavsnitt-referanser.»

Er inndata en tegnstreng, må generatorlaget nummerere avsnittene selv for å kunne oppgi `kildeavsnitt_id` — og da finnes nummereringen på to steder, i `tekst/` og i generatorlaget, uten at noe binder dem. Og siden måleharnessen (AD-5, AD-7) leser gullsettekster fra filer og ikke fra databasen, får den en tredje nummerering hvis den ikke importerer samme delefunksjon. Det er nøyaktig den driften AD-1 og AD-10 finnes for å hindre, oppstått gjennom et hull i AD-2.

Konsekvensen treffer prosjektets hardeste måling. FR-21s avsnittstest er «kjernen i hele kravet» og sammenligner `kildeavsnitt_id` mellom to tilfeller. Er nummereringen ustabil mellom uttrekk og måling, måler testen nummerering framfor pekeretning.

*Lukking:* én setning i AD-2 som fastsetter delereglen, og én i AD-10 som sier at inndata til en generator er den *nummererte avsnittslisten*, ikke en streng — pluss at delefunksjonen bor i `tekst/` og importeres av harnessen.

### H5 — høy: filhåndtering og opplasting er en stille dimensjon

PRD-en har en hard, juridisk begrunnet invariant om binærdata:

- «Bildene **lagres ikke** etter at uttrekket er godkjent i fase 3b» (FR-44)
- «Metadata i bildefilen (posisjon, enhet, tidspunkt) fjernes før bildet sendes videre» (FR-44)
- «Bilder beholdes ikke» (§6.3); «lagringsregelen er svaret på det» (§6.2)

Spinen nevner ikke opplasting, binærdata, midlertidig lagring eller metadatavasking noe sted — verken i ADene, konvensjonene, den strukturelle grunnformen eller mappetreet. Det finnes ingen plass for opplastingsveien, ingen regel om at bilder og PDF-er aldri når disk eller objektlager, og ingen plassering av grensekontrollene (10 MB / 40 sider / fire bilder / 8 MB per bilde). Dette er den klassiske formen for divergens: den ene enheten holder bildet i minnet gjennom forespørselen, den andre skriver det til et midlertidig lager «bare mens uttrekket kjører», og §6.3 er brutt uten at noen bestemte det.

Dette er ikke bedriftsapparatur. Det er et enkeltstående forbud som hører i et seed, på linje med AD-9.

### H6 — høy: markeringsposisjoner, og FR-27s andre markeringslag

Se svaret på det særskilte spørsmålet. I tillegg: FR-27 krever «et eget sett, atskilt fra Begrepssettet» med inntil åtte utpekte uttrykk per 1 000 ord per kategori, hvert med forklaring på morsmål og norsk. Det er et *andre* markeringslag i samme lesevisning, med samme posisjonsproblem, og det finnes verken i ADene eller i den strukturelle grunnformen. To markeringslag i samme løpende tekst, bygget uavhengig, er en garantert kollisjon — og «Fra krav til arkitektur» styrer Morsmål (FR-24..FR-29) med AD-1 og AD-11, ikke med AD-2, enda utpekingen forankres i avsnitt på samme måte.

### H8 — høy: kodeverket for de fem tilstandene og de fem målene er ikke fastsatt

FR-19 har fem navngitte tilstander (Dekkende, Delvis, Misoppfatning, Uklart, Utenfor), og FR-20 krever feltet `mål` som «én av de fem reglene i FR-19». Tre enheter må enes om nøyaktig samme strenger: generatorlagets skjema (AD-11), databasekolonnen (`data/`, AD-8) og gullsettfilene med «forventede tilstander» (FR-40, `maaling/`). FR-21s måltest sjekker at `mål` er *ulikt* mellom to tilfeller — den sammenligner altså verdier direkte, og FR-21s avsnittstest krever at `mål` skal være «motsigende avsnitt», en konkret streng.

Spinen har en konvensjonstabell som fastsetter domenenavn, id-form, datoform, feilform og filbaner, men ikke kodeverket. Dette er en femlinjers enum som hører i spinen og ingen andre steder.

### H9 — høy: translittereringsregelen er tapt mellom memloggen og spinen

Memloggen har beslutningen:

> «Aa-lyder translittereres i identifikatorer der verktoey krever ASCII.»

Spinen har den ikke. Samtidig *bruker* spinen translitterering uuttalt og inkonsekvent: konvensjonstabellen lister domenetermen som `Ovekort` (PRD-ens term er Øvekort), mappetreet sier `maaling/` og «raa svar», mermaid-diagrammene sier `Laast` og `Maaleharness`, mens AD-9 i prosa sier `Låst`. I en kodebase med norske domenenavn treffer dette tabellnavn, kolonnenavn, filnavn, JSON-felt og enumverdier i hver enkelt enhet. Uten en uttalt regel får man `ovekort`, `øvekort` og `oevekort` i samme prosjekt, og da er «PRD-ens ordliste *er* vokabularet» ikke lenger sant — kartleggingslaget konvensjonen skulle fjerne, oppstår likevel, bare med translitterering som akse i stedet for oversettelse.

*Lukking:* én konvensjonsrad: hvilke tegn translittereres til hva (ø→oe eller ø→o?), og hvor grensen går mellom prosa og visningstekst (norsk med diakritikk) og identifikatorer (ASCII).

### M2 — middels: Råtekst finnes ikke i modellen

FR-3 krever «Råteksten lagres uendret ved siden av den redigerte teksten», og FR-45 gjør avviket mellom de to til prosjektets billigste indikasjon på bildeuttrekkets kvalitet — noe rapporten skal se på. AD-9 beskriver to tilstander men bare én tekst, og `erDiagram` har `TEKST ||--|{ AVSNITT` uten spor av Råtekst. Addendumet har den (`råtekst` og `redigert_tekst` som to felt); spinen mistet den.

### M3 — middels: overskrifter har ingen plassering, og FR-5s kildekode-krav ingen regel

FR-3 fase 3a redigerer overskrifter *alene*, FR-5 viser dem alene, og begge krever at brødteksten ikke er tilgjengelig «verken synlig eller i sidens kildekode». For en utvikler som er ny i Next.js er det ikke et UI-krav, det er et datatilgangskrav: ruten må kunne hente *bare* overskriftene, ellers havner brødteksten i serverkomponentens nyttelast uten at noen la den der med vilje. AD-8 krever at hver datatilgangsfunksjon sjekker eierskap, men ingen AD krever at det finnes en overskrift-bare-lesning. Og overskrifter finnes ikke i den strukturelle grunnformen, enda FR-13 krever quizdekning per overskriftsdel.

### M6 — middels: ny vurdering av en samtalerunde

FR-22 gir eleven knappen «jeg tror du misforsto svaret mitt», som gir «runden vurdert på nytt». AD-4 sier at «hvert lagret generert element noterer promptversjonen som lagde det», og AD-9 gjør Teksten uforanderlig — men ingenting sier om en ny Svarvurdering erstatter den forrige eller legges ved siden av. Det er en beslutning med målekonsekvens (hvilken vurdering teller i FR-21 og i oppsummeringen FR-22 krever?) og med databasekonsekvens. `erDiagram` har `SAMTALERUNDE` men ingen `SVARVURDERING`, enda ordlisten gjør den til en egen term og spinens egen konvensjonsrad lister `Svarvurdering` som domenenavn.

### M9 — middels: mappetreet har ingen plass til det §4.11 krever i repoet

Mappetreet har `app/ generatorer/ prompts/ data/ tekst/ maaling/`. FR-38 krever KI-loggen i repoet med jevn commit-historikk, FR-4 krever «en reproduserbar test med tilhørende testfil i repoet» for sju feiltilstander, FR-41 krever automatiserte tester for FR-7, FR-20, FR-25 og FR-31, og §9.5 krever demoløypen «skrevet ned som en sjekkliste i repoet». Ingen av dem har en plass. For et prosjekt der en tredjedel av karakteren er dokumentasjon, er det verdt de to linjene.

### M13 — middels: grensen mellom `tekst/` og `generatorer/` for uttrekksveien

`tekst/` er beskrevet som «innlesing, avsnittsdeling, låsing (AD-9)». FR-2 legger konkrete, testbare transformasjoner der: bindestreksregelen, fjerning av topp-/bunntekst på mer enn halvparten av sidene, tellet oppsummering av hva som ble gjort, tidsavbrudd med ett automatisk nytt forsøk. FR-44 legger bildeuttrekk et sted som per AD-1 *må* være generatorlaget, mens resultatet hører i `tekst/`. Grensen mellom de to for bildeveien er dermed uavklart, og det er en grense to selvstendig bygde deler må dele.

---

## 2. Er hver AD sin Rule håndhevbar, og hindrer den den divergensen den oppgir under Prevents? — tynn

Fire Rules er faktisk håndhevbare, og det er verdt å si: AD-10 («generatorlaget importerer verken databaseklient eller rammeverkskode») kan sjekkes mekanisk med en importtest; AD-9 har et navngitt flaskehalspunkt; AD-3 er en filbane; AD-11 er en valideringsport med et sted å stå.

### K1 — kritisk: generatorgrensesnittet passer ikke generatorene PRD-en krever

AD-1 sier «Én modul per oppgave, alle bak samme grensesnitt», og AD-10 definerer grensesnittet:

> «En generator er en funksjon av `(tekst, promptversjon)` → validert strukturert utdata.»
> «Inn: tekst og promptversjon. Ut: validert strukturert utdata med kildeavsnitt-referanser.»

Minst fire av de påkrevde modellkallene passer ikke:

| Oppgave | Krav | Hvorfor den ikke passer |
|---|---|---|
| Bildeuttrekk | FR-44 | Inn er *bilder*, ikke tekst. Ut er Råtekst, som ikke kan ha kildeavsnitt — Teksten er ikke låst og har ingen avsnitt ennå |
| Svarvurdering og oppfølging | FR-19, FR-20 | Inn er tekst **pluss** elevsvar, gjeldende Samtalespørsmål og hele samtalehistorikken (FR-20: «ikke nær-identisk med noe tidligere Samtalespørsmål i samme samtale») |
| Oversettelse og tilbakeoversettelse | FR-26, FR-28 | Inn er valgt Morsmål pluss en ferdig oppsummering. Tilbakeoversettelsen er «et separat kall» der inndata er ukrainsk tekst og utdata ikke handler om Teksten |
| Minnevers | FR-30 | Inn er Begrepssettet («minst tre Faguttrykk fra Begrepssettet»), ikke bare tekst |

Dette er den alvorligste svakheten i spinen, fordi den rammer selve påstanden om at det finnes ett grensesnitt. Slik regelen står, må hver kaller finne opp sin egen signatur for fire av seks generatorer — og da er «alle bak samme grensesnitt» ikke lenger sant, og harnessen kan ikke kalle dem uniformt, som er det AD-1 finnes for. AD-11 arver feilen: «Utdata som bryter et verbatim-, kildeavsnitt- eller formkrav forkastes» ville forkastet *alt* bildeuttrekk og all tilbakeoversettelse.

*Lukking:* gjør grensesnittet til `(inndata, promptversjon) → validert utdata`, der `inndata` er en oppgavespesifikk type bak et felles skall, og skill de generatorene som er underlagt §5s kildeavsnittkrav (uttrekk, quiz, samtale, oppsummering, vers) fra de to som ikke er (bildeuttrekk, tilbakeoversettelse). To setninger, og AD-1 blir sann.

### H2 — høy: AD-6 porter noe som ikke har et mekanismenavn

AD-6s Rule:

> «består ikke en promptversjon sikkerhetsporten, settes den ikke som gjeldende»

og AD-3s:

> «Generatoren bruker gjeldende versjon; harnessen kan laste hvilken som helst.»

Begge forutsetter at «gjeldende» er en ting man kan sette. Ingenting sier hva den tingen er: høyeste `vN` på disk? En `gjeldende.json` per oppgave? En miljøvariabel? Valget avgjør om porten er en port: er «gjeldende» høyeste versjonsnummer, blir en ny promptversjon gjeldende i samme øyeblikk filen opprettes, og porten er omgått ved et filnavn. Det er den enkleste feilen å gjøre i dette oppsettet, og AD-6 er nettopp det ADet som skal hindre den.

Beslektet: AD-6 plasserer ikke portens *resultat*. Skal en promptversjon kunne vises som bestått i FR-40-tabellen, må portstatus lagres per versjon, som data.

### H3 — høy: AD-4 stempler promptversjon, men ikke modellidentitet

AD-4s Rule: «hvert lagret generert element noterer promptversjonen som lagde det. Hver målekjøring rapporterer versjonen den kjørte.»

Addendumet §3 fastsetter samtidig at ulike oppgaver skal bruke ulike modeller («Bruk den sterkeste modellen prosjektet har råd til her, og spar penger andre steder»), og PRD §6.4 sier det samme. Da er promptversjon alene ikke nok til å identifisere hva som produserte et tall: bytter man modell for uttrekk, endres FR-8-tallene uten at noe register viser hvorfor. FR-39 krever «minst én prompt viser en dokumentert forbedring over minst to versjoner, med tallene som viser den» — en forbedring som i virkeligheten kom av et modellbytte, ville blitt dokumentert som promptarbeid. Det er ikke bare upresist; det er den formen for udokumentert påstand §4.11 og SM-C4 finnes for å hindre.

*Lukking:* legg modellidentitet (leverandør, modellnavn, eventuell versjon) i samme stempel som promptversjonen, både på lagrede elementer og i målekjøringens metadata.

### H4 — høy: AD-5 deler på gal akse for en del av kravene

AD-5s Rule: «maskinsjekkbare invarianter er tester og feiler bygget (`npm test`). Statistiske målinger og porter er et kommandolinjeverktøy».

Aksen er «maskinsjekkbar mot statistisk». Den plasserer flere krav feil, fordi den ikke spør om kontrollen *kaller en språkmodell*:

- FR-20s fire krav er maskinsjekkbare og har 100 prosent som terskel (sporbarhet, gyldig `kildeavsnitt_id`, Jaccard under 0,6, ett spørsmål). De kan bare kontrolleres på et generert utdata, altså etter et modellkall.
- FR-21s måltest og avsnittstest er eksplisitt «maskinell» og har harde terskler (minst 16 av 18, alle seks par). Samme sak.

Etter AD-5s bokstav hører disse i `npm test` og skal feile bygget. Da får prosjektet nøyaktig det PRD §9.5 advarer mot i sitt eget avsnitt om demoløypen: «en slik port ville feilet tilfeldig, og en port som feiler tilfeldig blir stille droppet etter tredje gang». I tillegg koster hver `npm test` penger, mot et API-budsjett på 300–600 kroner.

ADets Prevents er formulert bare i én retning — at «rapporteres, ingen terskel» ikke presses inn i et testrammeverk. Den motsatte feilen, at et modellkallende krav presses inn i bygget, er ikke dekket, og det er den feilen aksen faktisk inviterer til.

*Lukking:* la aksen være «kaller modellen eller ikke». `npm test` = deterministiske sjekker mot lagrede eller konstruerte data (AD-11s skjemavalidering, delstrengsjekken i FR-7 som funksjon, Jaccard-utregningen som funksjon, stoppordlisten). `npm run maal` = alt som gjør et kall, inkludert FR-20s og FR-21s maskinelle krav.

### H1 — høy: ingen eier FR-40s ene tabell

Se svaret på det særskilte spørsmålet. Kjernen: AD-5 sprer terskelkontrollene over to kjøringer og lover likevel at måleverktøyet skriver «oppsummeringstabellen FR-40 krever». Det er det ene stedet i spinen der en Rule lover et resultat uten å plassere mekanismen. For at tabellen skal kunne vise «hver terskel i dokumentet med målt verdi og bestått/ikke bestått» må tersklene selv finnes som data ett sted — det er om lag tjue terskler spredt over FR-7, FR-8, FR-11, FR-14, FR-20, FR-21, FR-23, FR-28 og FR-31 — og de manuelle dommene må lagres i samme form som de maskinelle.

*Lukking:* én konvensjonsrad: terskelregisteret er én fil under `maaling/`, resultater og manuelle dommer lagres per (oppgave, promptversjon, dato), og oppsummeringstabellen genereres fra registeret og resultatene framfor å skrives for hånd.

### M4 — middels: AD-11 mangler granularitet og gjenkjøringspolitikk

AD-11 sier at ugyldig utdata «forkastes framfor å lagres», og gir ett eksempel: «Et Faguttrykk som ikke forekommer ordrett i Teksten finnes ikke.» Men PRD-en krever tre ulike oppførsler:

- FR-7: enkeltuttrykk kastes, resten av settet beholdes («kastes før visning»), og et tomt Begrepssett er et gyldig utfall som skal sies rett ut.
- FR-14: «Spørsmål som feiler, forkastes og genereres på nytt før leveranse» — altså regenerering, ikke bare forkasting. Samtidig krever FR-13 nøyaktig åtte spørsmål.
- §5: «Ingen blindveier» — eleven må komme videre uansett.

Uten en regel for granularitet (element eller hele utdataet) og for om det gjøres nytt forsøk, løser quizmodulen og begrepsmodulen dette ulikt — og da er ikke §5 håndhevet «ett sted» slik feilform-konvensjonen påstår for feil.

### M8 — middels: AD-8 mangler flaskehalsen AD-9 har

AD-8s Rule: «hver datatilgangsfunksjon verifiserer at innlogget konto eier raden.» Det er en per-funksjon-disiplin uten tvangspunkt. Sammenlign med konvensjonsraden for tekst: «All skriving til en Tekst går gjennom én modul som håndhever AD-9.» Den formen er håndhevbar; AD-8s form er en huskeregel, og den ene funksjonen som glemmer den er nettopp det FR-41 krever linje-for-linje-gjennomgang av. Et tvangspunkt finnes billig: alle spørringer går gjennom en modul der konto-id er et påkrevd argument, eller ingen spørring utenfor `data/`.

Begrunnelsen i AD-8 er for øvrig den sterkeste enkeltbegrunnelsen i dokumentet, og CVE-referansen er korrekt (se dimensjon 4).

### M7 — middels: AD-2s Prevents om FR-21 er sterkere formulert enn regelen bærer

AD-2 hevder å hindre «at avsnittstesten i FR-21 blir en overlappsregel som selv kan diskuteres». Det holder for *formen* på testen — likhetssjekk framfor overlapp — men bare gitt at avsnittsnummereringen er stabil og felles. Uten K2 lukket er testen fortsatt diskutabel, bare på en annen akse: den kan feile fordi to enheter nummererte ulikt, og det ser ut som en modellfeil.

---

## 3. Kan noe under Utsatt likevel la to enheter divergere? — tynn

Fire av de sju utsettelsene er rene og godt begrunnet: hastighetsbegrensning, sikkerhetskopiering, i18n-rammeverk og Mapper. Særlig i18n-begrunnelsen er presis — «Morsmålsstøtten er innhold, ikke lokalisering — FR-25 krever at norsk alltid vises samtidig». Tre er ikke rene.

### H7 — høy: skyleverandør-utsettelsens begrunnelse er usann

> «Valg av konkret skyleverandør | Påvirker ikke hvordan noe bygges. Må avklares før første utrulling»

Den påvirker hvordan flere ting bygges, og på måter en utvikler som er ny i Next.js ikke vil forutse:

- FR-2 gir PDF-uttrekk 20 sekunder. Svarvurderingen er «den vanskeligste oppgaven i appen» og går til den sterkeste modellen prosjektet har råd til. På en gratis eller billig serverless-plan ligger funksjonstidsgrensen ofte under det et slikt kall trenger, og da må kallet flyttes ut av en server action til en annen kjøreform. Det er en arkitekturendring, ikke en utrullingsdetalj.
- unpdf/pdfjs og `proxy.ts` krever Node-runtime, ikke edge. Spinen nevner Node-runtime for proxy, men ikke at hele uttrekksveien har samme krav.
- §5 krever synlig status for kall over to sekunder og at «Kjerneløypens steg genereres når de trengs, ikke alle i ett langt oppstartskall». Hvordan det realiseres (strømming, polling, en server action som venter) er ikke fritt for driftsformen.

Utsettelsen er riktig som *leverandørvalg*. Det som ikke kan utsettes, er kjøretidsomslutningen: Node-runtime, øvre tidsgrense per forespørsel, og hvor et langt modellkall bor. Det er én rad i driftsomslutningen.

### H10 — høy: «feilsporing» er unntatt fra loggeutsettelsen uten en regel om hva som ikke skal logges

> «Overvåking og logging utover feilsporing | Én bruker, ett miljø. Kan ikke gjøre to enheter uforenlige»

Det som utsettes kan ikke skape divergens — men unntaket som *ikke* utsettes kan skape et brudd. Feilsporing er nettopp der man logger inndata for å finne feilen, og inndataen her er opphavsrettsbeskyttet lærebokstoff fra en mindreårig, som §6.2 krever ikke havner andre steder enn hos den avtalte leverandøren, og som §6.3 forbyr å samle: «Elevenes tekster slås aldri sammen til et delt datasett — verken for analyse, for å forbedre prompter, for testsett, eller noe annet. Dette er et forbud, ikke en implementasjonsdetalj.»

Spinen har ingen regel om hva en feil får bære med seg. Feilform-konvensjonen beskriver feilens *form* (kode, elevrettet melding, anbefalt handling) og sier ingenting om nyttelast. To enheter vil håndtere dette ulikt: generatorlaget logger prompten «for å kunne feilsøke», datalaget logger ikke. Det er en billig regel å skrive nå: ingen elevtekst, ingen promptnyttelast og ingen modellsvar i feilspor eller logger — bare identifikatorer og feilkode.

### M10 — middels: LLM-utsettelsen berører det grensesnittet K1 alt er svakt på

> «Leverandør og oppsett for LLM-API | ... må avklares før M0, siden det er leverandøren appen bygges mot»

Riktig plassert og riktig frist, med korrekt peker til PRD åpent spørsmål 11. Men utsettelsen har en kobling spinen ikke nevner: FR-44 krever multimodalt kall, og «strukturert utdata» realiseres ulikt hos ulike leverandører (skjemamodus, verktøykall, ren JSON-instruks). AD-11 demper dette ved å validere lokalt uansett, som er det riktige grepet — men AD-10 sier «validert strukturert utdata» uten å si at valideringen er prosjektets egen og ikke leverandørens. Én setning som gjør det eksplisitt, gjør utsettelsen ufarlig.

### M1 — middels: addendumet, som spinen navngir som kilde, sier noe annet om Kildeavsnitt

Addendumet §3, under «Kildeavsnitt og uforanderlighet»:

> «Kildeavsnitt lagres som tegnindeks inn i `redigert_tekst`, ikke som kopiert tekst»

Spinens AD-2 sier det motsatte: «Kildeavsnitt er en referanse til ett slikt avsnitt, aldri et tegnspenn.» AD-2 er den nyere og bedre beslutningen, og memloggen dokumenterer hvorfor. Men spinen sier ikke at den overstyrer addendumet, og begge dokumentene ligger i samme mappe og er listet som kilde i spinens egen frontmatter. En utvikler — eller en KI-assistent som blir pekt på mappen — vil finne begge og kan bygge etter den gale. Én linje i AD-2: «Dette erstatter tegnindeksmodellen i addendum §3.»

---

## 4. Er navngitt teknologi verifisert gjeldende framfor påstått fra hukommelsen? — sterk

Dette er dimensjonen spinen er best på, og den er sterk av en grunn som er verdt å bruke i refleksjonsrapporten: den skiller mellom hva som er sjekket og hva som ikke er det, og nekter å fylle hullet med et tall.

> `[ANTAKELSE: eksakte patch-versjoner for Drizzle, Better Auth og unpdf er ikke verifisert — bare at biblioteket er gjeldende anbefaling. De pinnes ved installasjon og skrives inn her da. Et oppgitt versjonsnummer jeg ikke har sjekket ville vært verre enn å si at det pinnes senere.]`

Jeg har kontrollert hver navngitte påstand mot nettet i dag, uavhengig av memloggen:

| Påstand i spinen | Kontroll |
|---|---|
| Next.js 16.3.x gjeldende stabile per 29.09.2026, App Router for nye prosjekter | Stemmer. Siste publiserte stabile er 16.3.6, aktiv LTS |
| «Next.js 16 har døpt om middleware til proxy» (`proxy.ts`, Node-runtime) | Stemmer, inkludert Node-runtime og at `middleware.ts` er beholdt for edge men avviklet. Det finnes en codemod for omdøpingen |
| Drizzle som standardvalg for greenfield Next.js + PostgreSQL i 2026 | Stemmer som gjengs anbefaling; Prisma 7 er fortsatt et reelt alternativ, som memloggen også sier |
| Better Auth anbefalt for nye Next.js-prosjekter i 2026; Vercel kjøpte det juli 2026 | Stemmer. Oppkjøpet ble annonsert 7. juli 2026, MIT-lisens og rammeverksuavhengighet beholdt, ingen migrering påkrevd |
| unpdf over pdfjs-dist gir tekst per side, «som PF-1 trenger» | Stemmer. `mergePages` styrer om sidene slås sammen, så tekst per side er tilgjengelig — nøyaktig det PF-1s terskel på under 100 tegn per side krever |
| CVE-2025-29927: middleware-beskyttelse kan omgås ved å spoofe `x-middleware-subrequest` | Stemmer, og begrunnelsen AD-8 bygger på holder |

Begrunnelsesarbeidet bak valgene er også konsistent med at det ble gjort framfor gjenfortalt: memloggen oppgir hvorfor Drizzle framfor Prisma 7 (ingen generate-steg, SQL-nærhet som læringsargument), hvorfor Better Auth framfor Auth.js v5 (eierskap til brukerdata i egen database), og hvorfor unpdf framfor pdf.js-extract (koordinater trengs ikke fordi flerspaltet tekst bevisst ikke oppdages automatisk). Alle tre begrunnelsene er teknisk holdbare.

### L1 — lav: patch-kadensen er verdt én linje

Next.js har en sikkerhetsutgivelse planlagt 30. september 2026 (16.3.7) som dekker ni sårbarheter, én kritisk, oppå en kritisk utgivelse 22. september. Med `16.3.x` i stacktabellen er spinen formelt riktig, men for et prosjekt som skal argumentere for kvalitetssikring i en rapport, er det verdt å si i konvensjonene at patchversjoner følges oppover gjennom semesteret framfor å fryses ved installasjon. Det er også et gratis FR-41-funn å dokumentere.

### L4 — lav: gullsettekster og rå modellsvar i et repo som leveres

AD-7 legger rå modellsvar i repoet, og konvensjonene legger gullsettene der. Det er riktig etter FR-40, og §6.3 er ikke brutt, siden tekstene er utviklerens egne og ikke brukernes. Men gullsettene er utdrag av lærebøker, og repoet leveres. Én linje om at repoet er privat, eller om hvor lange utdrag som ligger der, koster ingenting og hører i den §6.3-drøftingen FR-42 krever uansett.

---

## 5. Dekker den kravene i PRD-en som spinen hevder å binde? — tynn

Frontmatteren hevder `binds: [FR-1..FR-31, FR-35..FR-45]`, altså alle 42 aktive krav. Det er en sterk påstand, og den holder ikke helt. Mange hull er små; noen er ikke det.

### M5 — middels: AD-5s binds mangler prosjektets hovedmåling

AD-5 binder «FR-7, FR-14, FR-20, FR-21, FR-28, FR-31, FR-40». FR-8 står ikke der. FR-8 er hovedmålingen (gjenkalling ≥ 0,75, presisjon ≥ 0,70, Cohens κ på egen annoteringsstøy, null gale forklaringer), den er den *eneste* målingen som ligger i M0, og den er en statistisk måling som per AD-5s egen logikk hører i `npm run maal`. FR-11s stabilitetsmåling (Jaccard ≥ 0,80 over seks tekster, to kjøringer) er bundet av AD-11, men AD-11 handler om validering før lagring, ikke om måling — så FR-11s *måling* er også uten hjem.

AD-6 har en tilsvarende, mindre lakune: den binder FR-21, FR-23 og FR-39, men utgivelsesporter med null toleranse finnes også i FR-8 («Antall gale forklaringer i det som vises eleven: null»), i FR-31 («antall usanne påstander ... null») og i FR-28 («Består den ikke, er språket Modellstøttet» — en port på et *språknivå*, ikke bare på en promptversjon). Portfamilien er bredere enn AD-6 sier, og AD-6 er det ADet som skal holde portene utenfor bygget.

### M11 — middels: seks entiteter for krav i `binds` mangler i den strukturelle grunnformen

`erDiagram` dekker Konto, Tekst, Avsnitt, Begrepssett, Begrep, Quiz, Quizspørsmål, Quizforsøk, Fagsamtale, Samtalerunde. Den mangler: FR-27s utpekte sett (eget sett, egen tetthetsgrense, forklaring på to språk), FR-30/FR-31s Minnevers, FR-19s Svarvurdering, FR-6s forkunnskapssvar, FR-12s leseinnstillinger på kontoen, og FR-45s avvik mellom Råtekst og redigert tekst. AD-9 sier eksplisitt at «Begrepssett, Quiz, Fagsamtale og Minnevers oppstår først i tilstanden `Laast`» — Minnevers er altså anerkjent i ADene og glemt i modellen.

Dette er *ikke* et krav om en full skjemaspesifikasjon; se dimensjon 7. Poenget er at et delvis diagram merket «Strukturell grunnform» blir lest som modellen, og da mangler seks ting.

### M12 — middels: FR-38, FR-42 og FR-43 er bundet bare gjennom en tabellrad

Ingen AD nevner FR-38, FR-42 eller FR-43. Kartet «Fra krav til arkitektur» har raden «Dokumentasjon og måling (FR-38..FR-43) | `maaling/`, `prompts/` | AD-3, AD-4, AD-5, AD-7», som dekker FR-39 og FR-40 godt og FR-41 gjennom AD-8. For FR-42 og FR-43 er det forsvarlig — de er rapportarbeid, ikke byggesubstrat, og det er riktig kalibrering å ikke arkitektere dem. For FR-38 er det ikke helt: KI-loggen har et krav om plassering i repoet og om jevn commit-historikk, og den har ingen plass i mappetreet (se M9).

### M14 — middels: konfigurasjon for to inngangspunkter

AD-10 gjør harnessen og webappen til «to likeverdige kallere», men bare den ene er en Next.js-app. Next.js leser `.env` av seg selv; en ren Node/tsx-CLI gjør det ikke. Driftsomslutningens «Hemmeligheter som miljøvariabler» er derfor to ulike mekanismer i praksis, og harnessen er den som trenger API-nøkkelen mest — den kjører alle målingene og er der kostnaden i §6.4 faktisk oppstår. Én linje om hvordan harnessen leser konfigurasjon, er billig.

### L2 — lav: §5s ventetidskrav har ingen plassering

«Kall til språkmodell som tar over to sekunder viser en status som sier hva som gjøres» og «Kjerneløypens steg genereres når de trengs» er tverrgående krav innenfor `binds`. De er nær kodeeide, men sekvenseringskravet (ikke alt i ett oppstartskall) er en invariant på tvers av ruter, og det henger sammen med H7.

### Dekket bedre enn frontmatteren lover

Verdt å si for balansen: FR-16s «Øvekortsettet er identisk med Begrepssettet» er løst på modellnivå framfor ved en test — «Øvekortsettet er ingen egen tabell, fordi FR-16 krever at det *er* Begrepssettet» — som er den sterkeste formen for håndheving som finnes. FR-36s «lagring framfor regenerering» er dekket av AD-4 og AD-9 til sammen, og AD-4s Prevents forutser presis den forvirringen FR-36 skaper for målingene. Og FR-7s verbatim-krav er gjort til en eksistensregel framfor en valideringsregel: «Et Faguttrykk som ikke forekommer ordrett i Teksten finnes ikke.»

---

## 6. Er hver dimensjon dette nivået eier bestemt, utsatt eller et åpent spørsmål? — tynn

Bestemt: paradigme og lagdeling, modulgrenser, promptforvaltning, kvalitetssikringens todeling, autorisasjonsplassering, tekstens livssyklus, valideringsport, domenevokabular, identifikatorer, tid, feilform, filbaner, stack, mappestruktur. Utsatt med begrunnelse: sju poster. Åpne spørsmål: ingen egen liste — spinen peker til PRD §11 for LLM-leverandøren og ellers ikke.

To dimensjoner er stille, og én er til stede men tynn.

### Stille: filhåndtering og opplasting

Se H5. Dette er den alvorligste stillheten, fordi dimensjonen bærer en invariant PRD-en selv kaller «et forbud, ikke en implementasjonsdetalj».

### Stille: asynkroni, ventetid og hvor et langt kall bor

Se H7 og L2. §5 setter krav (status over to sekunder, steg genereres når de trengs), FR-2 setter en grense på 20 sekunder, og addendumet plasserer den dyreste modellen på Svarvurderingen. Ingen AD, ingen konvensjon, ingen utsettelse. For en utvikler som er ny i Next.js er dette den dimensjonen som oftest tvinger en omskriving sent.

### Tynn: driftsomslutningen

Til stede, og det er riktig at den er kort. Hele avsnittet er fem setninger:

> «To miljøer: lokal utvikling og én driftet produksjon. **Ingen staging** — solobygg, og et tredje miljø koster mer enn det gir. Migrasjoner kjøres ved utrulling. Hemmeligheter som miljøvariabler, aldri i repoet. Utrulling fra Git.»

Beslutningene som er tatt er de riktige for et solobygg, og «ingen staging» med begrunnelse er eksemplarisk kalibrering — nøyaktig den formen for utelatelse som *ikke* skal straffes. Det som mangler er ikke apparatur, men tre linjer som faktisk styrer bygging:

1. **Kjøretid og tidsgrense per forespørsel** (H7). Node-runtime kreves av `proxy.ts` og av unpdf; tidsgrensen avgjør hvor Svarvurderingens kall bor.
2. **Hva som ikke får logges** (H10).
3. **L3 — lav: migrasjonsdisiplin.** «Migrasjoner kjøres ved utrulling» sier når, ikke at anvendte migrasjoner aldri redigeres. For en nybegynner med drizzle-kit er det verdt én setning, særlig siden produksjonsdata er erklært verdiløs (§2.2) og fristen til å ta snarveien derfor er lav.

Det mangler også et valg av databaseleverandør, som er utsatt implisitt under «skyleverandør» uten å være navngitt. Det er greit — men da hører PostgreSQL-hosting eksplisitt i samme rad.

### L5 — lav: ingen liste over åpne spørsmål

Spinen har «Utsatt» men ingen «Åpent». Skillet er reelt: en utsettelse er noe man har bestemt å ikke bestemme; et åpent spørsmål er noe man ikke har bestemt om man skal bestemme. Avsnittsdelingsregelen (K2), granularitet i AD-11 (M4) og markeringsposisjonene (H6) hører i en slik liste dersom de ikke besluttes nå — og et seed som skiller de to er lettere å vedlikeholde enn ett som blander dem.

---

## 7. Er den for stor? — sterk

Nei, og det er verdt å si tydelig, siden feilen i den retningen er den dyreste. 211 linjer, elleve ADer, ett paradigmeavsnitt, fire tabeller, tre diagrammer og et mappetre. Ingenting i dokumentet er en implementasjonsplan, ingen AD beskriver en funksjon framfor en invariant, og ingen tabell forsøker å være et skjema. Utsatt-listen gjør aktivt arbeid: den fjerner sju diskusjoner fra byggevinduet med én linje hver.

Den er tvert imot underspesifisert på fire punkter (K1, K2, H5, H8), og rettelsene er tillegg på til sammen under tjue linjer. Det er en langt bedre tilstand å være i enn det motsatte.

Tre poster kan med rimelighet diskuteres:

- **`erDiagram` «Strukturell grunnform»** er den eneste posten som virkelig er på grensen mot «koden eier det når den finnes». Den forsvarer seg fordi den bærer AD-2 i datamodellform — «De tre `forankrer`-relasjonene er AD-2 i datamodellform» — og fordi øvekortmerknaden er substrat og ikke pynt. Men se M11: et ufullstendig diagram med et fullstendighetsklingende navn er verre enn begge alternativene. Enten merk det som «bare de relasjonene som bærer AD-2», eller ta inn de manglende entitetene som bokser uten attributter.
- **«Fra krav til arkitektur»-tabellen** legger lite til ADene og gjentar kartet koden ville gitt selv. Den er billig og nyttig som navigasjon for en utvikler som er ny i rammeverket, så den får stå — men skal noe vike for plass til K1/K2/H5, er det denne.
- **Merknaden om proxy-omdøpingen** er ikke arkitektur, men den er det mest treffsikre en spine kan gjøre for en utvikler som er ny i Next.js og som kommer til å finne oppskrifter skrevet for versjon 15. Den hører her.

---

## Prioritert retteliste

Rekkefølgen følger hva som koster mest å utsette, ikke alvorlighetsgrad alene.

1. **K1** — omformuler generatorgrensesnittet i AD-1/AD-10 slik at bildeuttrekk, svarvurdering, oversettelse og minnevers passer, og skill de generatorene §5s kildeavsnittkrav gjelder for fra de to det ikke gjelder for. *Blokkerer M0: fagsamtalen bygges i M0.*
2. **K2** — fastsett avsnittsdelingsregelen, og at generatorens inndata er den nummererte avsnittslisten. *Blokkerer M0: hele Kjerneløypen henger på den.*
3. **H8 + H9** — skriv kodeverket for de fem tilstandene og de fem målene, og translittereringsregelen, inn i konvensjonstabellen. *Billigst nå, dyrest etter at tre moduler har valgt hver sin staving.*
4. **H5** — én AD eller én konvensjonsrad om binærdata: bilder og PDF-er lagres aldri, metadata vaskes før sending, grensekontrollene bor på ett sted. *Juridisk invariant, ikke en detalj.*
5. **H2 + H3** — navngi «gjeldende promptversjon» som en mekanisme, og legg modellidentitet i AD-4s stempel.
6. **H4 + H1** — flytt AD-5s akse til «kaller modellen eller ikke», og plasser terskelregisteret og de manuelle dommene som data under `maaling/`.
7. **H7 + H10 + M14** — tre linjer i driftsomslutningen: kjøretid og tidsgrense, hva som ikke får logges, hvordan harnessen leser konfigurasjon.
8. **H6, M1, M2, M3, M11** — markeringsposisjoner, supersession-linjen mot addendumet, Råtekst, overskrifter, de manglende entitetene.
9. Resten av middels- og lavfunnene etter eget skjønn. Ingen av dem blokkerer M0.

---

## Hva som ikke er regnet som funn

For ordens skyld, siden kalibreringen er en del av dommen: fraværet av utrullingsstrategi utover «utrulling fra Git», av overvåkingsstabel, av lastprofil og ytelsesbudsjett, av flermiljøpromotering, av rollemodell utover eleven selv, av API-versjonering, av komponentbibliotek- og stilvalg, av cachingstrategi og av sikkerhetskopiering er **ikke** regnet som mangler. Fem av dem er dessuten eksplisitt utsatt med begrunnelse i spinen selv, og de begrunnelsene holder. Det samme gjelder fraværet av tilgjengelighets- og typografidetaljer: de er krav i PRD §5 og hører i en UX-spesifikasjon, ikke i et byggesubstrat.
