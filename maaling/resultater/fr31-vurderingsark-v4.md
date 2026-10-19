# Vurderingsark — minnevers (FR-31), prompt v4

Kravet: **ingen påstand i verset motsier Teksten.** Måltall: null usanne påstander i de ti versene.

For hvert vers:

1. **Usanne påstander:** les verset mot teksten, og tell påstandene som motsier den. En forenkling som fortsatt er riktig, er ikke usann. Hver linje viser avsnittet den bygger på, og avsnittene står under verset (klikk «Avsnittene verset bygger på»). Peker en linje på et avsnitt som ikke sier det linjen sier, er det også et funn.
2. **Huskeregel:** fungerer verset som en huskeregel — korte linjer, rim, rytme, noe som sitter? Ja eller nei. Ikke en del av FR-31, men av om funksjonen gjør det den lover.
3. **Kommentar:** én linje per funn — linje, sitat, hva teksten sier, og type (usann / utenfor teksten / misvisende). Brukes til å stramme prompten.

---

## 1. Egenskaper hos ulike EM-bølger — vers 1

Tekst: `testdata/gullsett/naturfag-em-bolger.txt` · fagord i verset: Radiobølger, bølgelengde, energi

> Kort bølgelengde gir høy energi, _(avsnitt 13)_  
> røntgen og UV, det vet vi. _(avsnitt 23)_  
> Radiobølger går langt, uforstyrret fram, _(avsnitt 5)_  
> ionosfæren speiler dem, og de når lenger fram. _(avsnitt 5)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 5:** På grunn av den lange bølgelengden er radiobølger svært godt egnet til å sende signaler over store avstander. Bølger med korte bølgelengder spres lett, mens radiobølger går uforstyrret rett fram. I tillegg kan radiobølger bli reflektert av ionosfæren, 80–400 km over bakken, tilbake mot jordoverflata og dermed nå enda lenger.

**Avsnitt 13:** Infrarøde bølger skyldes molekylbevegelser. Siden molekylbevegelsene er raskere ved høyere temperaturer, vil molekylene sende ut mer og mer energirike IR-bølger ved økende temperatur. Av samme grunn vil bølgelengden til strålingen avta når temperaturen øker. (Husk at lav energi tilsvarer lang bølgelengde!)

**Avsnitt 23:** Røntgenstråling er elektromagnetisk stråling som er mer energirik enn UV-C og har bølgelengder kortere enn 10 nm.

</details>

**Usanne påstander: 0**  **Huskeregel:** X ja ☐ nei

**Kommentar: Ingen funn. L2 «det vet vi» er rimfyll; L1 viser til avsnitt 13 (IR), men regelen står i parentesen der.**

---

## 2. Egenskaper hos ulike EM-bølger — vers 2

Tekst: `testdata/gullsett/naturfag-em-bolger.txt` · fagord i verset: bølgelengde, Infrarød stråling, energi

> Molekylene svinger fortere, _(avsnitt 13)_  
> infrarød stråling blir kortere. _(avsnitt 13)_  
> Mer energi, kortere bølgelengde, _(avsnitt 13)_  
> mindre energi, lengre bølgelengde. _(avsnitt 13)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 13:** Infrarøde bølger skyldes molekylbevegelser. Siden molekylbevegelsene er raskere ved høyere temperaturer, vil molekylene sende ut mer og mer energirike IR-bølger ved økende temperatur. Av samme grunn vil bølgelengden til strålingen avta når temperaturen øker. (Husk at lav energi tilsvarer lang bølgelengde!)

</details>

**Usanne påstander: 0**  **Huskeregel:** ☐ ja X nei

**Kommentar: Huskeregel: L3–4 rimer på samme ord og gjentar samme regel snudd — pugging. L2 «stråling blir kortere» skulle vært bølgelengden (misvisende). Temperatur, som er årsaken, mangler.**

---

## 3. Høy prisvekst gir ny renteøkning — vers 1

Tekst: `testdata/gullsett/samfunnsfag-prisvekst.txt` · fagord i verset: Prisvekst, renteøkning, styringsrenta, inflasjon

> Når prisveksten er høy, _(avsnitt 9)_  
> kommer en renteøkning ny. _(avsnitt 9)_  
> Inflasjonen må først ned, _(avsnitt 6)_  
> så settes styringsrenta gradvis ned. _(avsnitt 10)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 6:** Ifølge prognosene vil inflasjonen, målt ved konsumprisindeksen, avta fra 3,2 prosent i år til rundt 2 prosent i 2029. Lønnsveksten anslås til 4,4 prosent i 2026, før den gradvis avtar mot 3 prosent i 2029. Den årlige reallønnsveksten blir dermed om lag 1 prosent i årene framover.

**Avsnitt 9:** – Den høye prisveksten gjør at vi venter en ny renteheving fra Norges Bank i år. Det kan skje allerede på torsdag, sier Thomas von Brasch.

**Avsnitt 10:** Styringsrenta ventes å bli satt gradvis ned fra midten av 2027, etter hvert som inflasjonen viser klare tegn til å avta. Ved utgangen av 2029 anslås styringsrenta til 3,5 prosent.

</details>

**Usanne påstander: 0**  **Huskeregel:** ☐ ja X nei

**Kommentar: Huskeregel: L1–2 halvrim, L3–4 rimer på samme ord (andre gang). L1–2 gjør prognosen («ventes») til en sikker regel (forbehold borte). L3 viser til avsnitt 6, men bygger på avsnitt 10. Innholdet er en nyttig oppsummering.**

---

## 4. Høy prisvekst gir ny renteøkning — vers 2

Tekst: `testdata/gullsett/samfunnsfag-prisvekst.txt` · fagord i verset: Prisvekst, styringsrenta, inflasjon

> Prisveksten er høy i år, _(avsnitt 6)_  
> da stiger styringsrenta, det går. _(avsnitt 9)_  
> Dyr energi holder prisene oppe, _(avsnitt 3)_  
> og inflasjonen er seig å stoppe. _(avsnitt 5)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 3:** Konflikten i Midtøsten har bidratt til høyere energi- og råvarepriser. Sammen med fortsatt høy lønnsvekst holdes prisveksten oppe, og gir ny renteøkning i år.

**Avsnitt 5:** – Prisveksten er fortsatt klart over inflasjonsmålet. Høy lønnsvekst og økte priser internasjonalt gjør at det tar tid før inflasjonen kommer ned mot 2 prosent, sier Thomas von Brasch, forsker i Statistisk sentralbyrå.

**Avsnitt 6:** Ifølge prognosene vil inflasjonen, målt ved konsumprisindeksen, avta fra 3,2 prosent i år til rundt 2 prosent i 2029. Lønnsveksten anslås til 4,4 prosent i 2026, før den gradvis avtar mot 3 prosent i 2029. Den årlige reallønnsveksten blir dermed om lag 1 prosent i årene framover.

**Avsnitt 9:** – Den høye prisveksten gjør at vi venter en ny renteheving fra Norges Bank i år. Det kan skje allerede på torsdag, sier Thomas von Brasch.

</details>

**Usanne påstander: 0**  **Huskeregel:** X ja ☐ nei

**Kommentar: L1 viser til avsnitt 6, men «høy» står i avsnitt 3/5/9 (henvisning). L2 mister forbeholdet («venter» blir «stiger»). L3 utelater lønnsvekst, som er halve årsaken (misvisende).**

---

## 5. metafor — vers 1

Tekst: `testdata/gullsett/norsk-metafor.txt` · fagord i verset: metafor, betydningsområder, simile

> Simile har et «som» eller «lik», _(avsnitt 6)_  
> metafor sier «er», og det er slik. _(avsnitt 6)_  
> Simile lar to betydningsområder stå, _(avsnitt 6)_  
> metafor skaper bånd, så ordet kan gå. _(avsnitt 3)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 3:** Vanligvis innebærer en metafor at ordet eller uttrykket forholder seg til to betydningsområder, og at det skapes en forbindelse mellom dem.

**Avsnitt 6:** Metaforen har mye til felles med similen , men i en metafor skjer sammenligningen uten ordene som eller lik . Med en simile blir en ting sammenliknet med noe annet, og med en metafor blir en ting satt i stedet for den tingen som skal beskrives. En simile er når vi sier at et menneske gjorde noe « som en løve», og en metafor er når vi sier at «han er en løve».

</details>

**Usanne påstander: 0**  **Huskeregel:** X ja ☐ nei

**Kommentar: L2 generaliserer «er» fra ett eksempel; avsnitt 2 har metaforer uten «er» (misvisende). L3 betydningsområder om simile er utenfor teksten. L4 «så ordet kan gå» er forvirrende fyll.**

---

## 6. metafor — vers 2

Tekst: `testdata/gullsett/norsk-metafor.txt` · fagord i verset: metafor, betydningsområder, simile

> En metafor tar et ord fra et felt, _(avsnitt 3)_  
> og bruker det om noe annet helt. _(avsnitt 2)_  
> Ikke som i simile, ingen lik, _(avsnitt 6)_  
> to betydningsområder blir ett, slik. _(avsnitt 3)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 2:** En metafor er et ord eller et uttrykk som brukes i overført eller billedlig betydning. Et par eksempler er å si «å holde hjulene i gang» om å sørge for at en bedrift eller et samfunn fungerer som det skal, eller å omtale en sart og følsom person som «et persilleblad».

**Avsnitt 3:** Vanligvis innebærer en metafor at ordet eller uttrykket forholder seg til to betydningsområder, og at det skapes en forbindelse mellom dem.

**Avsnitt 6:** Metaforen har mye til felles med similen , men i en metafor skjer sammenligningen uten ordene som eller lik . Med en simile blir en ting sammenliknet med noe annet, og med en metafor blir en ting satt i stedet for den tingen som skal beskrives. En simile er når vi sier at et menneske gjorde noe « som en løve», og en metafor er når vi sier at «han er en løve».

</details>

**Usanne påstander: 0**  **Huskeregel:** ☐ ja X nei

**Kommentar: L1 dropper «vanligvis» (forbehold borte). L3 tungt formulert. L4 «blir ett»: teksten sier forbindelse mellom to — bildet er misvisende, nettopp fordi teksten bruker liknende språk. L4 forutsetter at man allerede har forstått det.**

---

## 7. Domeneoppbygning og toppdomene — vers 1

Tekst: `testdata/gullsett/teknologi-domeneoppbygning.txt` · fagord i verset: toppdomene, DNS-rotserverne, under-domene

> Les adressen bakfra, fra enden og ned: _(avsnitt 5)_  
> toppdomene, domene, under-domene med. _(avsnitt 8)_  
> Punktet er roten, DNS-rotserverne står først, _(avsnitt 5)_  
> under-domenet kommer sist, som det siste ledd. _(avsnitt 8)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 5:** Hvis vi starter bakerst, har vi et punktum (.). Dette punktumet blir som oftest fjernet av nettleseren. Det indikerer at innholdet ligger under DNS-rotserverne.

**Avsnitt 8:** om er et under-domene under .ndla-domenet. Dette styres av den samme DNS-serveren som selve domenet. Det er ikke nødvendig å bruke underdomener, men er spesielt praktisk for domener som skal betjene flere tjenester eller nettsider. Det er mulig å ha flere nivåer med under-domener hvis dette er ønsket.

</details>

**Usanne påstander: 0**  **Huskeregel:** ☐ ja X nei

**Kommentar: L1 «bakfra … og ned» blander retninger (forvirrende). L2 viser til avsnitt 8, som ikke sier noe om rekkefølgen (henvisning). L3 «punktet er roten, rotserverne står først»: teksten sier punktumet indikerer at innholdet ligger under rotserverne (misvisende). L4 gjentar seg selv; rimet først/ledd bærer ikke.**

---

## 8. Domeneoppbygning og toppdomene — vers 2

Tekst: `testdata/gullsett/teknologi-domeneoppbygning.txt` · fagord i verset: toppdomene, DNS-rotserverne, under-domene

> Start bakerst: punktet peker opp, _(avsnitt 5)_  
> til DNS-rotserverne på topp. _(avsnitt 5)_  
> Så kommer .no, toppdomenet, _(avsnitt 6)_  
> så .ndla, og om, under-domenet. _(avsnitt 8)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 5:** Hvis vi starter bakerst, har vi et punktum (.). Dette punktumet blir som oftest fjernet av nettleseren. Det indikerer at innholdet ligger under DNS-rotserverne.

**Avsnitt 6:** Neste del er .no, som er det norske topp-domenet. Alle .no-adresser er regulert av Norid AS, som er en privat ,ikke-kommersiell bedrift som har fått ansvaret fra norske myndigheter. Norid AS sine DNS-servere har ansvaret for å kjenne til IP-adressene til alle DNS-servere som har .no-domener.

**Avsnitt 8:** om er et under-domene under .ndla-domenet. Dette styres av den samme DNS-serveren som selve domenet. Det er ikke nødvendig å bruke underdomener, men er spesielt praktisk for domener som skal betjene flere tjenester eller nettsider. Det er mulig å ha flere nivåer med under-domener hvis dette er ønsket.

</details>

**Usanne påstander: 0**  **Huskeregel:** ☐ ja X nei

**Kommentar: L1 «peker opp» er et bilde teksten ikke har (forvirrende). Oppramsing av ett eksempel (om.ndla.no) uten prinsippet. L3–4 rimer på samme ord (tredje gang). L4 tvetydig om hva som er under-domenet.**

---

## 9. Operativsystem — vers 1

Tekst: `testdata/gullsett/teknologi-operativsystem.txt` · fagord i verset: operativsystem, minne, prosessorer

> Operativsystemet fordeler _(avsnitt 2)_  
> skriver, minne og prosessorer deler. _(avsnitt 2)_  
> Det lastes først i minnet ved start, _(avsnitt 4)_  
> og styrer alle programmer, enkelt og smart. _(avsnitt 4)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 2:** Et operativsystem (OS) er den grunnleggende programvaren på en datamaskin, og det som tildeler de forskjellige ressursene i datamaskinen til andre programmer. Én type ressurs er eksterne enheter, som en skriver.  Operativsystemet passer for eksempel på at to programmer ikke samtidig sender informasjon til samme skriver, men at de legges i en venteliste før utskrivning. En annen type ressurs er interne enheter som minne og prosessorer. Dette er svært grunnleggende komponenter som operativsystemet også holder styr på.

**Avsnitt 4:** Operativsystemet er et program som alle andre i datamaskinen. Det er skrevet i et programmeringsspråk og følger vanlige regler for programmer. Forskjellen er at det er det første som lastes inn i minnet når maskinen startes, og det styrer «hverdagen» for alle programmer som lastes inn senere.

</details>

**Usanne påstander: 0**  **Huskeregel:** X ja ☐ nei

**Kommentar: Beste verset. L2 omvendt ordstilling: «prosessorer deler» leses som at prosessorene deler; mangler «til programmene». L4 «enkelt og smart» er fyll.**

---

## 10. Operativsystem — vers 2

Tekst: `testdata/gullsett/teknologi-operativsystem.txt` · fagord i verset: operativsystem, driverprogrammet, maskinvare

> Operativsystemet deler ut tid, _(avsnitt 2)_  
> så ingen to programmer havner i strid. _(avsnitt 2)_  
> Et program ber om å skrive til en fil, _(avsnitt 3)_  
> og driverprogrammet tar maskinvaren, i stil. _(avsnitt 3)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 2:** Et operativsystem (OS) er den grunnleggende programvaren på en datamaskin, og det som tildeler de forskjellige ressursene i datamaskinen til andre programmer. Én type ressurs er eksterne enheter, som en skriver.  Operativsystemet passer for eksempel på at to programmer ikke samtidig sender informasjon til samme skriver, men at de legges i en venteliste før utskrivning. En annen type ressurs er interne enheter som minne og prosessorer. Dette er svært grunnleggende komponenter som operativsystemet også holder styr på.

**Avsnitt 3:** Man kan betrakte programvare som å være én av to typer: applikasjonsprogramvare eller systemprogramvare. Applikasjonsprogramvare er slikt som tekstbehandlere, regneark og andre programmer som brukeren har direkte kontakt med. Av systemprogramvare er operativsystemet den viktigste. Det holder styr på systemressursene og gjør programmererens jobb enklere. Tilleggsenheter som er koblet til datamaskinen er ofte kompliserte å bruke. En harddisk, for eksempel, trenger detaljerte instruksjoner om å starte motoren sin, stoppe den, flytte på lesehodene og mye annet. Operativsystemet bruker harddisken ved å kommunisere på en standard måte med et driverprogram laget spesielt for enheten. Et annet program som ønsker å skrive noe til harddisken gir bare beskjed til operativsystemet om for eksempel «å skrive teksten 'kongle' til filen "kongle.txt" på katalogen c:\». Operativsystemet, i samarbeid med driverprogrammet, tar seg så av resten av oppgaven.

</details>

**Usanne påstander: 0**  **Huskeregel:** X ja ☐ nei

**Kommentar: L1 «deler ut tid»: teksten sier ressurser, ikke tid (utenfor teksten — modellens egen fagkunnskap). L3–4 operativsystemet er tatt ut av kjeden; teksten sier program → OS → driver i samarbeid (misvisende). L4 «i stil» er fyll.**

---

**Sum usanne påstander:** 0 av mål 0  ·  **Fungerer som huskeregel:** 5 av 10
