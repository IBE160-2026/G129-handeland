# Adversarisk gjennomgang av PRD-en, runde 2

**Dokument:** `_bmad-output/planning-artifacts/prd-lesevenn.md` (oppdatert 25.11.2026, 1 271 linjer)
**Sjekket mot:** `prompts/REGISTER.md`, `prompts/gjeldende.json`, `maaling/resultater/`, `testdata/`, `app/`, `beslutningslogg-prd.md`, `ki-logg.md`
**Gjennomgått:** 25.11.2026
**Linse:** skeptisk. Hva gjør dokumentet mindre troverdig eller mindre brukbart for den som tester eller vurderer det? Stil og smak er ikke tatt med.

## Dom

Omskrivingen har gjort dokumentet ryddigere. Men statustabellen i §9.6 og flere kvalitetspåstander i §4 og §10 sier mer enn tallene i repoet bærer. Tre av fem primære suksesskriterier er ikke nådd, og dokumentet sier ikke hva det betyr for v1.

| Alvorlighet | Antall |
|---|---|
| Kritisk | 4 |
| Høy | 8 |
| Middels | 12 |
| Lav | 9 |

---

## Kritisk

### K1. FR-11-statusen «delvis» bygger på en måling som ikke er den FR-11 beskriver
- **Sted:** §9.6, rad FR-11 (l. 1062). Kravet er FR-11 (l. 369–372) og SM-8 (l. 1124–1127).
- **Sitat:** «Målt, **delvis** | Terskel 0,80 nådd på fokusert tekst (0,865), ikke på oversiktstekst (0,564), med selvkonsistens over fem kjøringer (8.10)»
- **Hva som er galt:** `maaling/resultater/2026-10-08-selvkonsistens.txt` viser at målingen ble gjort på to *eksempeltekster*, `straling-radioaktive-kilder.txt` og `em-egenskaper.txt`, med prompt **v2**. Kravet er noe annet på hvert punkt:
  - FR-11 krever de seks Tekstene i Gullsett Faguttrykk. Strålingsteksten er ikke med i Gullsettet i det hele tatt.
  - Gjeldende prompt er v4 (`gjeldende.json`), ikke v2.
  - Stabiliteten til råsvaret skal rapporteres ved siden av. Det gjøres ikke.
  - Resultatet skal rapporteres per teksttype og tekstkilde over seks Tekster.
  - Målingen ble gjort 8.10, samme dag som Gullsettet ble valgt.
- **Selvmotsigelse:** SM-8 sier rett ut at «Terskelen er 0,80 over hele Gullsettet, ikke per teksttype, og et brudd rapporteres som et brudd» (l. 1125). Å kalle det «delvis» fordi én teksttype nådde terskelen er akkurat den lesningen SM-8 forbyr.
- **Konsekvens:** Riktig status er «ikke målt etter kravet» (og ut fra tallene som finnes, trolig ikke bestått). Ellers kan en vurderer som åpner resultatfila, lese det som pynt.

### K2. Tabellen over Gullsett Faguttrykk beskriver et annet sett enn det som ligger i repoet, og har tre ulike ordtall
- **Sted:** FR-8, settabellen (l. 307–314) mot budsjettabellen (l. 322–329).
- **Sitat:** rad 3: «NDLA *Lyriske virkemidler*, forklarende del | læremiddel | fokusert | ~500 av 1 000». I budsjettabellen heter samme tekst «norsk-sprakligebilder | 1 255».
- **Hva som er galt:** `testdata/gullsett/norsk-sprakligebilder.meta.json` sier noe annet:
  - Teksten heter «Språklige bilder: metafor, allegori og allusjon».
  - Den er «satt sammen av 3 NDLA-artikler … en redaksjonell konstruksjon og ikke en publisert artikkel».
  - Den har **1 175 ord**.
- Ordtallene spriker for flere tekster:

| Tekst | Settabellen | Budsjettabellen | meta.json |
|---|---|---|---|
| samfunnsfag-prisvekst | ~1 100 | 673 | 648 |
| norsk-metafor | ~900 av 1 200 | 702 | 602 (701 før kutt) |
| teknologi-operativsystem | ~800 av 4 070 | 731 | 726 (4 018 før kutt) |

- **Konsekvens:** Budsjettet `floor(12 × ord/1000)` og «maks |G|» avhenger av ordtallet. Med tallene i meta-filene blir tre budsjetter andre: metafor 7/9, ikke 8/10; samfunnsfag 7/9, ikke 8/10; språklige bilder 14/18, ikke 15/20. Den som etterprøver FR-8, vet ikke hvilken telling som gjelder. At den sammensatte teksten er en konstruksjon, men merket «læremiddel», står heller ikke i PRD-en.

### K3. Påstander om «det som vises eleven» kan ikke være sanne for innhold som lages mens appen kjører
- **Sted:**
  - FR-14 (l. 415): «Antall spørsmål som krever kunnskap utenfor Teksten: **null tolerert** i det som vises eleven. … hvert spørsmål som faktisk vises eleven er sett av utvikleren.»
  - FR-14 (l. 413): «Spørsmål som feiler, forkastes og genereres på nytt før leveranse.»
  - FR-8 (l. 335): «Antall gale forklaringer i det som vises eleven: **null**.»
  - FR-31 (l. 675) og SM-2 og SM-7 (l. 1115, 1123) sier det samme.
- **Hva som er galt:** FR-13 sier at «Quizen lages når eleven åpner den» (l. 401), fra elevens egen tekst. Utvikleren kan ikke ha sett disse spørsmålene, og det finnes ingen «leveranse» der de kan forkastes. Målingene dekker 24 spørsmål, 41 forklaringer og 10 vers i Gullsettene, ikke det eleven ser.
- **Konsekvens:** Som de står, er påstandene enten usanne i drift eller umulige å teste. De er dokumentets sterkeste kvalitetsløfter og nettopp det en vurderer vil prøve. De bør skrives om til «i Gullsettet: null», med en setning om restrisikoen og hva grensesnittet sier om den (FR-23, §6.1).

### K4. Testen PRD-en kaller «den avgjørende», feiler, og tabellen avfeier den
- **Sted:** §4.6 (l. 468): «Avsnittstesten er den avgjørende.» FR-21 (l. 529): «og kjernen i hele kravet … Alle seks par må bestå.» SM-3 (l. 1116, primært kriterium): «Avsnittstesten består på alle seks par, måltesten på minst 16 av 18». §9.6 FR-21 (l. 1072).
- **Sitat (§9.6):** «Måltest 15 av 18 (krav 16, ikke bestått) og avsnittstest 5 av 6 (krav 6, ikke bestått); ingen av de to er porter (AD-6).»
- **Hva som er galt:** Dokumentet bygger hele argumentet for Fagsamtalen («prosjektets sterkeste påstand», l. 464) på avsnittstesten, og gir den så lav vekt i statustabellen med henvisning til at den ikke er en port. Det kan godt være riktig at den ikke er en port, men da er §4.6 og SM-3 feil som de står. Begge deler kan ikke være sant.
- **Konsekvens:** SM-3 er ikke nådd, og det står ingen steder. PRD-en må velge: (a) skrive «SM-3 ikke nådd» og si hva bruddet i EM-bølger B betyr for påstanden i §4.6, eller (b) senke kravet med begrunnelse. «Delvis» er ingen av delene.

---

## Høy

### H1. §10 har ingen status, og ingen steder står det hva brudd betyr for v1
- **Sted:** §10 (l. 1110–1140) og §9.6.
- **Hva som er galt:**
  - **SM-2 er ikke nådd:** gjenkalling 0,361 mot krav 0,75, presisjon 0,413 mot krav 0,70.
  - **SM-3 er ikke nådd** (K4).
  - **SM-8 er ikke nådd eller ikke målt** (K1).
  - **SM-10** («én testbruker utenfor utvikleren») har ingen status noe sted, og §11 pkt. 6 venter på den.
- §9.6 sier «ikke bestått», men ingen steder i dokumentet står det om v1 leveres med kravet som ikke nådd, om terskelen senkes (og hvorfor), eller om kravet er utsatt. For en vurderer er det nettopp dette som skiller ærlig rapportering fra en liste over brudd.
- **Forslag:** legg til en kolonne «Status» i §10, eller en kort blokk «Ikke nådd i v1» i §9.6, med én linje per brudd: hva det betyr for eleven, og hva rapporten sier om det.

### H2. Terskelen i FR-8 ligger over annotatørens samsvar med seg selv, og spørsmålene som skulle avgjøres av første måling står fortsatt åpne
- **Sted:** FR-8 (l. 331, 332–334) og §11 pkt. 9 og 17 (l. 1152, 1160). Tallene står i §9.6 (l. 1059).
- **Sitat:** «`[ÅPENT: om tallene holder må avgjøres av første måling. …]`» og «Egen annoteringsstøy: positivt samsvar 0,62, κ 0,61».
- **Hva som er galt:**
  - Målerapporten `2026-10-26-annoteringsstoey.md` sier selv at positivt samsvar «er F1 mellom rundene, og kan sammenlignes direkte med F1 mellom modellen og Gullsettet». Annotatøren er altså enig med seg selv omtrent på nivå 0,62.
  - Det gjør tersklene 0,75 og 0,70 nær uoppnåelige med dette Gullsettet uansett modell. Begrunnelsen for å måle støyen var nettopp å vite «om presisjon 0,70 ligger over eller under sin egen annoteringsusikkerhet» (beslutningsloggen, FR-8).
  - Konklusjonen er aldri trukket.
  - Den første målingen fantes 14.10, og den med v4 26.10. Likevel står «avgjøres av første måling» igjen tre steder.
- **Konsekvens:** Dokumentet ser ut til ikke å ha lest sine egne tall. Enten må ÅPENT-merkene lukkes (taket eller terskelen endres, eller beholdes med begrunnelse), eller så må det stå hvorfor de fortsatt er åpne to dager før kodefrys.

### H3. DK-3 står som «Oppfylt», men tabellen mangler mange terskler
- **Sted:** §9.6 DK-3 (l. 1105) mot DK-3 (l. 1221).
- **Sitat:** «Oppfylt | Fem Gullsett i repoet; denne tabellen er terskeltabellen». Kravet sier: «Én tabell viser hver terskel i dokumentet med målt verdi og bestått/ikke bestått. **Ingen terskel i §4 mangler i tabellen.**»
- **Disse tersklene mangler i §9.6:**
  - FR-7: delstrengsjekk 100 %, ikke-sirkulær 100 %, og tetthetstallene, som kravet selv sier skal «rapporteres med faktisk verdi».
  - FR-11: råsvarets stabilitet.
  - FR-14: «null tolerert» utenfor teksten. Tallet finnes i `fr14-dommer-v2.json`, men står ikke i tabellen.
  - FR-20: sporbarhet 100 %, Jaccard under 0,6, ett spørsmål.
  - FR-26: høyst fem setninger, og ingen påstand utenfor Teksten.
  - FR-27: høyst åtte per 1 000 ord.
  - FR-31: 100 % maskinelt.
  - FR-2: 20 sekunder.
- **Konsekvens:** Kravet er ikke oppfylt slik det er skrevet. Den som bruker tabellen til å teste, får ikke vite om de maskinsjekkbare kravene er målt.

### H4. DK-2 står som «Oppfylt», men tallet og forbedringen holder ikke
- **Sted:** §9.6 DK-2 (l. 1104) mot DK-2 (l. 1206–1209).
- **Sitat:** «23 promptversjoner i 10 oppgaver, alle i registeret. Dokumentert forbedring: Faguttrykk v2 → v3, presisjon 0,42 → 0,46»
- **Hva som er galt:**
  - `prompts/*/v*.md` gir **21** filer, ikke 23.
  - I REGISTER.md deler samtalestart og svarvurdering rader. DK-2 krever at «hver promptversjon i repoet har en rad i registeret».
  - DK-2 krever målinger «for hver versjon». Likevel er quiz v1, minnevers v2, oppsummering v1, utpeking v1 og etiketter v1 umålt, og faguttrykk v1 har ingen FR-8-måling.
  - Forbedringen er tynn. Spennene møtes (v2 høyest 0,454, v3 lavest 0,454). REGISTER sier selv «trolig litt bedre» og at gjenkallingen var uendret («ingen sikker forskjell»). Og gjeldende v4 har presisjon **0,413**, lavere enn v2 sin 0,42.
- **Konsekvens:** Forbedringen som oppgis, er rullet tilbake i prompten som er i drift, og forbeholdene i REGISTER er tatt ut i PRD-en. En vurderer som sammenligner de to, vil se at PRD-en er sterkere enn kilden.

### H5. Ukrainsk vises «uten forbehold» også der kvaliteten ikke er målt
- **Sted:** FR-24 (l. 576, 581), FR-27 (l. 618), FR-28 (l. 632–637), §9.6 FR-28 (l. 1079).
- **Sitat:** FR-24: «Valgt Morsmål påvirker bare Aktivering, avsluttende oppsummering og forklaring av Faguttrykk og språklige bilder.» FR-28: «vurderer de fire tekstenes **oversatte oppsummering** på fire punkter».
- **Hva som er galt:** Den eksterne vurderingen dekker bare oppsummeringen. Begrepsankeret sjekker bare at det norske ordet står i parentes. Disse delene er ikke vurdert av noe menneske:
  - forklaringene av Faguttrykk på ukrainsk
  - utpekingen i FR-27, som er «Umålt» i REGISTER
  - overskriftene i Aktiveringen
  
  Likevel vises alt dette som Kvalitetssikret språk. Målingen ble i tillegg gjort 16.10, på et Begrepssett fra faguttrykk v2/v3, ikke v4.
- **Logikkfeil i regelen (l. 637):** «Et språk som ikke består begrepsankeret **og** den eksterne vurderingen, vises som Modellstøttet språk.» Slik det står, holder det å bestå én av dem. Det skal være «eller». Tilbakeoversettelsen, som har krav om null avvik, er ikke med i regelen i det hele tatt.

### H6. Hypotesen om yrkesfag kan ikke prøves med Gullsettet, og kravet om kilder per fag brytes
- **Sted:** DK-5 (l. 1247), §12 pkt. 8 (l. 1173), FR-8 (l. 316).
- **Sitat:** DK-5: «Avsnittet sier hva det betyr for §1 om uttrekket virker dårligere på yrkesfaglige tekster.» §12 pkt. 8: «Krysningen i FR-8 avgjør.»
- **Hva som er galt:**
  - Gullsett Faguttrykk har ingen tekst fra et yrkesfag. Aksen ble endret til fellesfag mot programfag 8.10 (beslutningsloggen), og begge programfagtekstene er Teknologiforståelse. Krysningen kan derfor ikke avgjøre noe om yrkesfag. Teksten i DK-5 og §12 er ikke oppdatert etter at aksen ble endret.
  - Brukerreisen er likevel bygget på en yrkesfagelev (UJ-1, Jonas), og ordlisten bruker yrkesfagord som eksempler («bæreevne», «sveisefuge», §3).
  - FR-8 sier at «begge kilder skal forekomme i hvert fag» (l. 316). Naturfag har bare læremiddel, og samfunnsfag har bare autentisk tekst (tabellen l. 309–310). Beslutningsloggen sier at dette er gjort med vilje, men kravet står uendret.

### H7. Demotesten som tabellen viser til, kjører verken i prod, mot modellen eller på en telefon
- **Sted:** §9.6 innledningen (l. 1046), §9.5 steg 12 (l. 1033), FR-10 (l. 359), SM-9 (l. 1128).
- **Sitat:** «"I prod" betyr bygget, med automatiske tester, og rullet ut på lesevenn.vercel.app. Demotesten (§9.5) gikk 3 av 3 ganger 25.11»
- **Hva som er galt:** `demotest-2026-11-25.md` viser at testen kjørte på `localhost:3110`, i «Testmodus `les`: bare lagrede modellsvar, ingen modellkall», og med «telefon (390 px, berøring)» emulert i Chrome. FR-10 sier at «Kravet testes på telefon, ikke bare i en smal nettleser på PC». De ekte telefontestene har problemer:
  - `telefontest-2026-11-09.md` og `bildeinnlesing-telefon-2026-11-10.md` har tomme felt for telefon og dato («______»).
  - Begge er eldre enn designfasen og glideren i FR-6 (23.11).
- **Konsekvens:** At demotesten består, sier at flyten virker med lagrede svar. Den sier ikke at prod eller mobil virker. Tabellen bør si hva demotesten faktisk dekker, og vise til en datert test på en ekte telefon for FR-10, FR-12 og SM-9.

### H8. Hull: bruksgrensene er bygget, men ingen FR dekker dem
- **Sted:** §6.4 (l. 918) og §8.1 (l. 938). I koden: `data/grenser.ts` og `opplasting/bilde-feil.ts`.
- **Hva som er galt:**
  - Grensene på 5 Tekster og 5 Fagsamtaler per døgn og dagstaket på 30 kroner står bare som prosa i §6.4. De har ingen testbare konsekvenser og ingen rad i §9.6.
  - Koden har to bildefeil PRD-en ikke kjenner, BF-6 (dagstaket) og BF-7 (tekstgrensen). Kommentaren i `bilde-feil.ts` sier det selv: «BF-6 og BF-7 står ikke i PRD-ens liste».
  - §8.1 sier «fem for bilder».
  - §6.4 lover at appen sier «når den åpner igjen (neste døgn, norsk tid)». Meldingene i `GRENSE_FEIL` sier bare «i morgen».
- **Konsekvens:** En tester som treffer grensen, finner ikke kravet. Grensene bør bli en FR (eller ligge under FR-35 eller FR-44) med egne konsekvenser og en rad i §9.6.

---

## Middels

### M1. Tetthetstaket kalles «hardt», men to av de tre takene kan ikke feile
- **Sted:** §4.3 (l. 272) mot FR-7 (l. 291, 293).
- **Sitat:** «Derfor har FR-7 et hardt tetthetstak» mot «Et Faguttrykk fjernes aldri for å rette prosentgrensen eller vindustaket» og «Tetthetstallene er måletall, ikke garantier … Ingen sperre skal bygges på at tallene er innenfor.»
- **Hva som er galt:** Bare antallstaket binder. Grensen på 4 prosent og grensen på 3 per 100 ord kan ikke brytes på noen måte som får følger. Den faktiske verdien rapporteres heller ingen steder (se H3). Vernet mot «det gule teppet» (SM-C1) hviler altså på én av tre grenser.

### M2. F1 for v3 i statustabellen kan ikke spores til kildene den viser til
- **Sted:** §9.6 FR-8 (l. 1059).
- **Sitat:** «Beste: v3, F1 0,409.»
- **Hva som er galt:** Tallet står verken i REGISTER.md eller i `maaling/resultater/`. Det finnes bare i sesjonsloggen `.logs/arve/999-2026-10-29-…`. Det rettferdige tallet i REGISTER er v3 med kodefunn 23 rettet: F1 0,384. Tallet 0,409 er fra før feilen ble rettet, da overskrifter kunne bli kildeavsnitt.

### M3. Forklaringene kalles «bestått» uten at «misvisende» er avklart
- **Sted:** §9.6 FR-8 (l. 1059) mot FR-8 (l. 335).
- **Sitat:** «Forklaringene: 0 gale, 1 misvisende av 41 (11.11, bestått).» Kravet er at forklaringen er «faglig riktig og i samsvar med Kildeavsnittet».
- **Hva som er galt:** Om en misvisende forklaring er «faglig riktig», er ikke avklart. REGISTER viser i tillegg at 14 av 41 forklaringer bruker kunnskap utenfor teksten, altså ikke bare Kildeavsnittet. PRD-en bør si hvordan «misvisende» telles, og at kravet i praksis er tolket som «ikke i strid med Kildeavsnittet».

### M4. Parene i FR-21 er tvetydige, og samlede tall skjuler hvor feilene ligger
- **Sted:** FR-21 (l. 522, 528, 529) og SM-3 (l. 1116).
- **Tvetydige par:** Settet har tolv misoppfatninger, to per startspørsmål, men avsnittstesten har «seks par», og måltesten har 18. Kravet sier ikke hvilken misoppfatning som pares med det dekkende svaret. Rapporten bruker én, og hvis begge brukes, blir det 12 par.
- **Delvis-svarene:** Forvekslingsmatrisen i `rapport.md` viser at 2 av 6 Delvis-svar ble lest som Dekkende. En tredjedel av ufullstendige svar ble altså godtatt som fullstendige. Det skjules i den binære gjenkallingen på 0,93.
- **Sikkerhetsporten:** Sikkerhetsporten er 0 av 12. Med n = 12 er den øvre 95 %-grensen for feilraten rundt 25 % (tre-regelen). Overskriften i SM-3, «bekrefter ikke en gal forståelse», er sterkere enn dette tallet tillater.

### M5. Suno-prompten og «Uferdig»: FR-30 sier tre ting på en gang
- **Sted:** FR-30 (l. 663–667), §3 (l. 103), §8.1 (l. 943), §9.6 (l. 1081).
- **Sitat:** «**Suno-prompten er satt på pause.** Appen tilbyr den ikke» og rett etter: «Når Suno-prompten tilbys, … eleven ser tydelig hvilket av de to hun får og kan be om det andre.»
- **Hva som er galt:**
  - Kravet om å tilby den kan ikke testes når den er av.
  - §8.1 lister likevel «Minnevers eller Suno-prompt» som med i v1.
  - Statusen «I prod, merket «Uferdig»» er ikke definert i noe krav. Er FR-30 levert eller ikke?
  - I grensesnittet heter funksjonen «Huskeregel» (`app/tekst/[id]/oppgaver/page.tsx:138`, `minnevers/page.tsx:55`), mens Arbeidsbordet sier «Minnevers». §3 kaller synonymer «en disiplinbrist».
  - Hvorfor-linjen («Fire linjer er ikke en sang …», l. 667) gir bare mening for den som vet at den forklarer pausen. Som den står, ser den ut til å begrunne kravet om fire til åtte linjer.

### M6. Hvorfor-linjer og henvisninger som har mistet grunnlaget i omskrivingen
- **FR-44, ANTAKELSE (l. 217):** «Holder det ikke, er bildeinngangen mindre viktig enn Mapper var, og byttet i §4.9 var feil.» §4.9 beskriver ikke lenger noe bytte, og Mapper er nå med i v1. §12 pkt. 3 («prioriteres foran Mapper») er utdatert på samme måte.
- **SM-C2 (l. 1138):** «M2-funksjoner bygget på bekostning av M1-kvalitet». §9.3 (l. 1002) sier: «Det finnes ikke noe M2-nivå.»
- **§9.2 (l. 998):** Minnevers ligger i M1 fordi faktasjekken skulle gi «det konkrete «modellen løy for rimets skyld»-funnet». Målingen ga 0 usanne påstander (v3), så begrunnelsen viser til et funn som ikke kom.
- **SM-8, Hvorfor (l. 1127):** «en terskel som flyttes etter at tallet er kjent, beviser ingenting». Uten historikken står det ikke hvem som ville flytte den.
- **FR-6 (l. 258, 260):** «Eldre merker … «Dette kan jeg» leses som «Mye»» og «Tekster fra før 17.11.2026 har et fritt svar». Dette er migrasjonshistorikk inne i kravet, og leseren får ikke vite hva som ble endret.
- **FR-26 (l. 605):** «slik §6 krever». Låsen står i §7, ikke i §6.

### M7. FR-46 stemmer ikke med testmodusen og README-testen
- **Sted:** FR-46 (l. 799–801), §9.6 (l. 1088).
- **Sitat:** «**Nøyaktig én dekket tekst er nok** … Testmodus dekker eksempelteksten som ligger i repoet.»
- **Hva som er galt:**
  - Repoet har to eksempeltekster (`testdata/eksempeltekst/`) og 100 lagrede svar for faguttrykk. Demotesten kjører testtekst A, to bilder og arabisk i testmodus.
  - `readme-2026-11-25.md` fulgte veien «Uten Docker» (PGlite), mens FR-46 krever `docker compose` med Postgres. Docker-veien er ikke den som er prøvd, og PGlite-veien har ingen FR.
  - «På en maskin uten .env.local» var i praksis en ny klone på utviklerens egen maskin, med andre porter.

### M8. FR-44 er svakere enn invarianten om bilder
- **Sted:** FR-44 (l. 204), §6.2 (l. 892), UJ-4 (l. 77).
- **Sitat:** «Bildene **lagres ikke** etter at uttrekket er godkjent i fase 3b.»
- **Hva som er galt:** Formuleringen antyder at bildene lagres *fram til* godkjenning. AD-16 sier at binærdata aldri lagres, og bildet krympes i klienten og sendes ett om gangen. Testeren vet ikke hva hun skal sjekke: at ingenting lagres, eller at noe slettes ved godkjenning. Kravet bør si det samme som invarianten.

### M9. PF-7 passer ikke med uttrekk i nettleseren og har ingen testfil
- **Sted:** FR-4 (l. 183, 185), FR-2 (l. 136), §9.6 FR-4 (l. 1055).
- **Sitat:** PF-7: «Tidsavbrudd eller tjenerfeil under uttrekk». FR-4: «Hver av PF-1 til PF-7 har en reproduserbar test med tilhørende testfil i repoet.»
- **Hva som er galt:** Uttrekket skjer i nettleseren (FR-2), så en tjenerfeil kan ikke inntreffe under det. `testdata/pdf/` har filer for PF-1 til PF-6, men ingen for PF-7. PF-4 «oppdages ikke automatisk», så en test kan bare sjekke at merknaden finnes. «Alle sju feiltilstandene har test» bør si hva testen av PF-4 og PF-7 faktisk sjekker.

### M10. FR-53 og §6.3 lover noe vilkårssiden ikke sier
- **FR-53 (l. 781):** «Eleven kan få en kopi av alt som er lagret om kontoen (`node data/innsyn.mjs <e-post>` …)». Dette er et skript utvikleren kjører mot databasen, ikke noe eleven kan gjøre selv. Vilkårssiden sier «få en kopi», men ikke hvordan. Kravet bør skrives som en rutine: eleven ber om det, og utvikleren kjører skriptet innen en frist.
- **§6.3 (l. 905):** «Vilkårene sier at innlegging er til eget studiebruk.» `app/vilkaar/page.tsx` sier «Legg bare inn tekster du har lov til å bruke». Det er en annen påstand. §6.3 og DK-5 bygger drøftingen på den første.

### M11. Modellvalget og FR-8 henger ikke sammen
- **Sted:** §6.4 (l. 916, 920) og §11 pkt. 11 (l. 1154).
- **Hva som er galt:**
  - §6.4 sier at Sonnet brukes til «Samtalestart, Svarvurderingen og oppfølgingsspørsmålene». §11 sier «Samtalestart og Svarvurderingen».
  - §6.4 sier: «Uttrekket måles mot Gullsett Faguttrykk (FR-8) før modellvalget låses.» FR-8 ga 0,36 med Haiku. Ingen steder står det om en annen modell ble prøvd for uttrekket, eller hvorfor valget ble låst etter et klart brudd.

### M12. Åpne spørsmål der fristen er passert, to dager før kodefrys
- **Sted:** §11 pkt. 6, 9, 11, 12, 13, 15, 16, 17.
- **Hva som er galt:**
  - Pkt. 9, 16 og 17 skulle avgjøres «mot Gullsettet» eller «av første måling», og målingen finnes.
  - Pkt. 6 venter på SM-10, som ikke har status.
  - Pkt. 12 er «blokkerende for å skrive §6.3 ferdig».
  - Pkt. 11 skal «kontrolleres på nytt nærmere innlevering».
  
  PRD-en sier ikke hvilke av dem som lukkes i dokumentasjonsvinduet (§9.4), og hvilke som leveres som kjente hull.

---

## Lav

### L1. Kildene er uenige om Gullsett Quiz
§9.6 sier at tallene kommer fra REGISTER.md. FR-14 (l. 413) sier «tre Tekster × åtte spørsmål», og det stemmer med `fr14-quiz-v2.json` (EM-bølger, språklige bilder, domene). REGISTER sier «24 spørsmål fra **seks** tekster».

### L2. Bevis som ikke ligger der tabellen sier
§9.6 FR-35 og FR-53 (l. 1083, 1095) sier: «Registrering og sperren prøvd i prod 25.11». Beviset finnes bare i `.logs/arve/991-…` og `issues.md`, ikke i REGISTER eller `maaling/resultater/`, som §9.6 oppgir som kilder.

### L3. DK-1 blåser opp tellingen
DK-1 (l. 1103): «26 oppføringer forkastet, endret eller med metodefunn (krav 5)». «Metodefunn» er ikke en kategori i DK-1, som teller forkastet eller vesentlig endret. Etter overskriftene i `ki-logg.md` er det strengt regnet rundt 16. Kravet er nådd uansett, men tallet sier mer enn kravet spør om.

### L4. «samling» med liten forbokstav
§9.3 (l. 1008) sier «la til landingsside, arbeidsbord og samling (FR-47 til FR-49)», mens siden heter Samlinger. Kodekommentarer bruker fortsatt «Samlingen» (`app/samling/page.tsx`, `data/arbeidsbord.ts`), men eleven ser det ikke.

### L5. UJ-1 strekker grensene uten at det vises
UJ-1 (l. 58): «fire sider», og «fjorten Faguttrykk markert». Fjorten Faguttrykk krever minst 1 167 ord under antallstaket, og fire lærebokssider er mer enn 8 000 tegn. Brukerreisen viser ikke kuttvalget FR-1 krever.

### L6. Feil henvisninger
- FR-27, ANTAKELSE (l. 623): «tetthetsbudsjettet i FR-9». Budsjettet står i FR-7.
- §7 (l. 930) siterer «invarianten i §4.7 om at «det norske fagbegrepet står alltid sammen med oversettelsen»». Den ordlyden står i §1.

### L7. Krav uten toleranse
- FR-12: «om lag 70 tegn» har ingen toleranse og kan ikke feile.
- FR-13: dekningskravet gjelder bare «når Teksten har fire eller færre deler», så det kan ikke feile for lengre tekster.

### L8. Tilgjengelighetssjekken sier lite om kravene
«656 av 656» (l. 1046) teller sjekker, ikke krav. Tallet er ikke koblet til kravene i §5, og vurdereren kan ikke se hva det dekker.

### L9. Funksjoner i appen uten FR
- Kontosiden har «Utseende» (lys eller mørk modus) og «Venstrehendt». Venstrehendt nevnes bare via EXPERIENCE.md i FR-17.
- Oppgavesiden `/tekst/[id]/oppgaver` er navet for aktivitetene, men ingen FR nevner den.
- Varselet «Teksten sendes til Anthropic …» (`Innlesing.tsx:59`) oppfyller §6.2, men har ingen FR og ingen status.
- SM-6 sier «kodegjennomgang av innlogging og lagring». DK-4 sier «innlogging, lagring og sletting».

---

## De fem som bør rettes først

1. **K1:** sett FR-11 til «ikke målt etter kravet», eller mål det på nytt på de seks Gullsett-tekstene med v4.
2. **K2:** rett tabellen over Gullsett Faguttrykk og ordtallene mot `testdata/gullsett/*.meta.json`, og regn budsjettene på nytt.
3. **K3:** skriv om alle påstander om «i det som vises eleven» til påstander om Gullsettet, med restrisikoen nevnt.
4. **K4 og H1:** gi §10 en status, og si per brudd hva det betyr for v1. Dette gjelder SM-2, SM-3, SM-8 og SM-10.
5. **H3 og H4:** ikke kall DK-2 og DK-3 «Oppfylt» før tabellen har alle tersklene og tallene i registeret stemmer.
