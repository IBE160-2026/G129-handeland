# Vurderingsark — minnevers (FR-31), prompt v6

Kravet: **ingen påstand i verset motsier Teksten.** Måltall: null usanne påstander i de ti versene.

For hvert vers:

1. **Usanne påstander:** les verset mot teksten, og tell påstandene som motsier den. En forenkling som fortsatt er riktig, er ikke usann. Hver linje viser avsnittet den bygger på, og avsnittene står under verset (klikk «Avsnittene verset bygger på»). Peker en linje på et avsnitt som ikke sier det linjen sier, er det også et funn.
2. **Huskeregel:** fungerer verset som en huskeregel — korte linjer, rim, rytme, noe som sitter? Ja eller nei. Ikke en del av FR-31, men av om funksjonen gjør det den lover.
3. **Kommentar:** én linje per funn — linje, sitat, hva teksten sier, og type (usann / utenfor teksten / misvisende). Brukes til å stramme prompten.

---

## 1. Egenskaper hos ulike EM-bølger — vers 1

Tekst: `testdata/gullsett/naturfag-em-bolger.txt` · fagord i verset: bølgelengde, røntgenstråling, energi

> Lang bølgelengde gir lav energi, _(avsnitt 13)_  
> kort bølgelengde gir mer, under ti nm. _(avsnitt 23)_  
> Røntgenstråling er mer energirik enn UV-C, _(avsnitt 23)_  
> UV-A har minst, så det er lett å se. _(avsnitt 21)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 13:** Infrarøde bølger skyldes molekylbevegelser. Siden molekylbevegelsene er raskere ved høyere temperaturer, vil molekylene sende ut mer og mer energirike IR-bølger ved økende temperatur. Av samme grunn vil bølgelengden til strålingen avta når temperaturen øker. (Husk at lav energi tilsvarer lang bølgelengde!)

**Avsnitt 21:** UV-A ligger nærmest synlig lys og har lavest energi av de tre, mens UV-C har høyest energi. Sollyset inneholder i utgangspunktet alle de tre typene, men heldigvis blir tilnærmet all UV-C stoppet av oksygen (O2) og ozonlaget i atmosfæren, så vi trenger ikke å bekymre oss for den. UV-A og UV-B derimot kan gjøre oss solbrente og i verste tilfelle forårsake hudkreft.

**Avsnitt 23:** Røntgenstråling er elektromagnetisk stråling som er mer energirik enn UV-C og har bølgelengder kortere enn 10 nm.

</details>

**Usanne påstander:** ____  **Huskeregel:** ☐ ja ☐ nei

**Kommentar:**

---

## 2. Egenskaper hos ulike EM-bølger — vers 2

Tekst: `testdata/gullsett/naturfag-em-bolger.txt` · fagord i verset: Radiobølger, frekvens, bølgelengde

> Lang bølgelengde gir stor avstand, _(avsnitt 5)_  
> ionosfæren sender dem tilbake til land. _(avsnitt 5)_  
> Radiobølger: lav frekvens, fra en meter, _(avsnitt 3)_  
> til mange km, så signalet når langt og leter. _(avsnitt 3)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 3:** Inspirert av Maxwells teorier for elektromagnetiske bølger satte Heinrich Hertz i 1887 opp et forsøk der han lagde elektriske svingninger som produserte radiobølger. Det er bølger med lav frekvens og lang bølgelengde, fra 1 meter til mange km.

**Avsnitt 5:** På grunn av den lange bølgelengden er radiobølger svært godt egnet til å sende signaler over store avstander. Bølger med korte bølgelengder spres lett, mens radiobølger går uforstyrret rett fram. I tillegg kan radiobølger bli reflektert av ionosfæren, 80–400 km over bakken, tilbake mot jordoverflata og dermed nå enda lenger.

</details>

**Usanne påstander:** ____  **Huskeregel:** ☐ ja ☐ nei

**Kommentar:**

---

## 3. Høy prisvekst gir ny renteøkning — vers 1

Tekst: `testdata/gullsett/samfunnsfag-prisvekst.txt` · fagord i verset: Prisvekst, styringsrenta, inflasjon

> Når prisveksten er høy, _(avsnitt 9)_  
> ventes å øke styringsrenta på ny. _(avsnitt 9)_  
> Inflasjonen tar tid å gå, _(avsnitt 5)_  
> fra 3,2 til 2 prosent, altså. _(avsnitt 6)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 5:** – Prisveksten er fortsatt klart over inflasjonsmålet. Høy lønnsvekst og økte priser internasjonalt gjør at det tar tid før inflasjonen kommer ned mot 2 prosent, sier Thomas von Brasch, forsker i Statistisk sentralbyrå.

**Avsnitt 6:** Ifølge prognosene vil inflasjonen, målt ved konsumprisindeksen, avta fra 3,2 prosent i år til rundt 2 prosent i 2029. Lønnsveksten anslås til 4,4 prosent i 2026, før den gradvis avtar mot 3 prosent i 2029. Den årlige reallønnsveksten blir dermed om lag 1 prosent i årene framover.

**Avsnitt 9:** – Den høye prisveksten gjør at vi venter en ny renteheving fra Norges Bank i år. Det kan skje allerede på torsdag, sier Thomas von Brasch.

</details>

**Usanne påstander:** ____  **Huskeregel:** ☐ ja ☐ nei

**Kommentar:**

---

## 4. Høy prisvekst gir ny renteøkning — vers 2

Tekst: `testdata/gullsett/samfunnsfag-prisvekst.txt` · fagord i verset: Prisvekst, renteøkning, inflasjon

> Høy lønnsvekst holder prisveksten oppe, _(avsnitt 3)_  
> så venter vi ny renteøkning i år. _(avsnitt 9)_  
> Dyre energi- og råvarepriser _(avsnitt 3)_  
> Det tar tid før inflasjonen kommer ned. _(avsnitt 5)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 3:** Konflikten i Midtøsten har bidratt til høyere energi- og råvarepriser. Sammen med fortsatt høy lønnsvekst holdes prisveksten oppe, og gir ny renteøkning i år.

**Avsnitt 5:** – Prisveksten er fortsatt klart over inflasjonsmålet. Høy lønnsvekst og økte priser internasjonalt gjør at det tar tid før inflasjonen kommer ned mot 2 prosent, sier Thomas von Brasch, forsker i Statistisk sentralbyrå.

**Avsnitt 9:** – Den høye prisveksten gjør at vi venter en ny renteheving fra Norges Bank i år. Det kan skje allerede på torsdag, sier Thomas von Brasch.

</details>

**Usanne påstander:** ____  **Huskeregel:** ☐ ja ☐ nei

**Kommentar:**

---

## 5. metafor — vers 1

Tekst: `testdata/gullsett/norsk-metafor.txt` · fagord i verset: metafor, betydningsområder, simile

> Metafor, ikke simile: overført mening, _(avsnitt 6)_  
> to betydningsområder gir forening. _(avsnitt 3)_  
> Foten av fjellet og fjordarm er ord, _(avsnitt 9)_  
> kroppsord om døde ting på jord. _(avsnitt 9)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 3:** Vanligvis innebærer en metafor at ordet eller uttrykket forholder seg til to betydningsområder, og at det skapes en forbindelse mellom dem.

**Avsnitt 6:** Metaforen har mye til felles med similen , men i en metafor skjer sammenligningen uten ordene som eller lik . Med en simile blir en ting sammenliknet med noe annet, og med en metafor blir en ting satt i stedet for den tingen som skal beskrives. En simile er når vi sier at et menneske gjorde noe « som en løve», og en metafor er når vi sier at «han er en løve».

**Avsnitt 9:** Det er også vanlig å bruke kroppslige begreper for å snakke om døde eller ubesjelede ting, og slike metaforer går ofte inn i vanlig språkbruk i en slik grad at de ikke lenger føles som metaforer, for eksempel forbindelser som «foten av fjellet», «fjordarmen», «bordbeina» og «åsryggen».

</details>

**Usanne påstander:** ____  **Huskeregel:** ☐ ja ☐ nei

**Kommentar:**

---

## 6. Domeneoppbygning og toppdomene — vers 1

Tekst: `testdata/gullsett/teknologi-domeneoppbygning.txt` · fagord i verset: toppdomene, DNS-rotserverne, under-domene

> Punktum bakerst; DNS-rotserverne, sted, _(avsnitt 5)_  
> så toppdomene .no, Norid med. _(avsnitt 6)_  
> Om er et under-domene under .ndla i dag, _(avsnitt 8)_  
> og flere nivå kan gi flere lag. _(avsnitt 8)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 5:** Hvis vi starter bakerst, har vi et punktum (.). Dette punktumet blir som oftest fjernet av nettleseren. Det indikerer at innholdet ligger under DNS-rotserverne.

**Avsnitt 6:** Neste del er .no, som er det norske topp-domenet. Alle .no-adresser er regulert av Norid AS, som er en privat ,ikke-kommersiell bedrift som har fått ansvaret fra norske myndigheter. Norid AS sine DNS-servere har ansvaret for å kjenne til IP-adressene til alle DNS-servere som har .no-domener.

**Avsnitt 8:** om er et under-domene under .ndla-domenet. Dette styres av den samme DNS-serveren som selve domenet. Det er ikke nødvendig å bruke underdomener, men er spesielt praktisk for domener som skal betjene flere tjenester eller nettsider. Det er mulig å ha flere nivåer med under-domener hvis dette er ønsket.

</details>

**Usanne påstander:** ____  **Huskeregel:** ☐ ja ☐ nei

**Kommentar:**

---

## 7. Domeneoppbygning og toppdomene — vers 2

Tekst: `testdata/gullsett/teknologi-domeneoppbygning.txt` · fagord i verset: toppdomene, DNS-rotserverne, under-domene

> Les adressen bakfra, fra punktet og ned, _(avsnitt 5)_  
> og så under-domenet under .ndla med. _(avsnitt 8)_  
> Det norske toppdomenet .no, Norid rår, _(avsnitt 6)_  
> punktet peker mot DNS-rotserverne, som står. _(avsnitt 5)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 5:** Hvis vi starter bakerst, har vi et punktum (.). Dette punktumet blir som oftest fjernet av nettleseren. Det indikerer at innholdet ligger under DNS-rotserverne.

**Avsnitt 6:** Neste del er .no, som er det norske topp-domenet. Alle .no-adresser er regulert av Norid AS, som er en privat ,ikke-kommersiell bedrift som har fått ansvaret fra norske myndigheter. Norid AS sine DNS-servere har ansvaret for å kjenne til IP-adressene til alle DNS-servere som har .no-domener.

**Avsnitt 8:** om er et under-domene under .ndla-domenet. Dette styres av den samme DNS-serveren som selve domenet. Det er ikke nødvendig å bruke underdomener, men er spesielt praktisk for domener som skal betjene flere tjenester eller nettsider. Det er mulig å ha flere nivåer med under-domener hvis dette er ønsket.

</details>

**Usanne påstander:** ____  **Huskeregel:** ☐ ja ☐ nei

**Kommentar:**

---

## 8. Operativsystem — vers 1

Tekst: `testdata/gullsett/teknologi-operativsystem.txt` · fagord i verset: operativsystem, applikasjonsprogrammer, maskinvare

> Operativsystemet deler tid _(avsnitt 2)_  
> mellom programmene uten strid. _(avsnitt 2)_  
> Applikasjonsprogrammer ber om tilgang hver dag, _(avsnitt 10)_  
> og maskinvaren styres av et lag. _(avsnitt 10)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 2:** Et operativsystem (OS) er den grunnleggende programvaren på en datamaskin, og det som tildeler de forskjellige ressursene i datamaskinen til andre programmer. Én type ressurs er eksterne enheter, som en skriver.  Operativsystemet passer for eksempel på at to programmer ikke samtidig sender informasjon til samme skriver, men at de legges i en venteliste før utskrivning. En annen type ressurs er interne enheter som minne og prosessorer. Dette er svært grunnleggende komponenter som operativsystemet også holder styr på.

**Avsnitt 10:** Et moderne datasystem består av komponenter som prosessorer, hovedminne, klokker, inn- og utenheter, lagringsenheter med mer.  Operativsystemet holder styr på komponentene og gir applikasjonsprogrammer tilgang til dem.  På denne måten behøver ikke hver programmerer kjenne til detaljene ved å bruke de ofte komplekse enhetene, eller hvordan et program skal dele disse med andre programmer.  Operativsystemet kan sees på som et lag som skiller applikasjonsprogramvaren fra den ofte mer komplekse maskinvaren.

</details>

**Usanne påstander:** ____  **Huskeregel:** ☐ ja ☐ nei

**Kommentar:**

---

## 9. Operativsystem — vers 2

Tekst: `testdata/gullsett/teknologi-operativsystem.txt` · fagord i verset: operativsystem, minne, prosessorer

> Operativsystemet tildeler minne _(avsnitt 2)_  
> og prosessorer, som programmer kan finne _(avsnitt 2)_  
> Skriveren får en venteliste _(avsnitt 2)_  
> så to ikke skriver samtidig, i samme frist _(avsnitt 2)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 2:** Et operativsystem (OS) er den grunnleggende programvaren på en datamaskin, og det som tildeler de forskjellige ressursene i datamaskinen til andre programmer. Én type ressurs er eksterne enheter, som en skriver.  Operativsystemet passer for eksempel på at to programmer ikke samtidig sender informasjon til samme skriver, men at de legges i en venteliste før utskrivning. En annen type ressurs er interne enheter som minne og prosessorer. Dette er svært grunnleggende komponenter som operativsystemet også holder styr på.

</details>

**Usanne påstander:** ____  **Huskeregel:** ☐ ja ☐ nei

**Kommentar:**

---

## Avvist av kontrollen (1 av 10)

Disse versene ville eleven aldri sett; generatoren ga opp etter andre forsøk. De vurderes ikke, men teller som funn om prompten.

- **metafor — vers 2:** 2 Faguttrykk fra Begrepssettet i verset, skal være minst 3

---

**Sum usanne påstander:** ____ av mål 0  ·  **Fungerer som huskeregel:** ____ av 9
