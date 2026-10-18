# Vurderingsark — minnevers (FR-31), prompt v3

Kravet: **ingen påstand i verset motsier Teksten.** Måltall: null usanne påstander i de ti versene.

For hvert vers:

1. **Usanne påstander:** les verset mot teksten, og tell påstandene som motsier den. En forenkling som fortsatt er riktig, er ikke usann. Hver linje viser avsnittet den bygger på, og avsnittene står under verset (klikk «Avsnittene verset bygger på»). Peker en linje på et avsnitt som ikke sier det linjen sier, er det også et funn.
2. **Huskeregel:** fungerer verset som en huskeregel — korte linjer, rim, rytme, noe som sitter? Ja eller nei. Ikke en del av FR-31, men av om funksjonen gjør det den lover.
3. **Kommentar:** én linje per funn — linje, sitat, hva teksten sier, og type (usann / utenfor teksten / misvisende). Brukes til å stramme prompten.

---

## 1. Egenskaper hos ulike EM-bølger — vers

Tekst: `testdata/gullsett/naturfag-em-bolger.txt` · fagord i verset: Radiobølger, frekvens, mikrobølger

> Lav frekvens, lang bølge, lang, _(avsnitt 3)_  
> Radiobølger når langt, gang på gang, _(avsnitt 5)_  
> Mikrobølger gir vannet fart, _(avsnitt 8)_  
> og maten blir varm fra start. _(avsnitt 8)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 3:** Inspirert av Maxwells teorier for elektromagnetiske bølger satte Heinrich Hertz i 1887 opp et forsøk der han lagde elektriske svingninger som produserte radiobølger. Det er bølger med lav frekvens og lang bølgelengde, fra 1 meter til mange km.

**Avsnitt 5:** På grunn av den lange bølgelengden er radiobølger svært godt egnet til å sende signaler over store avstander. Bølger med korte bølgelengder spres lett, mens radiobølger går uforstyrret rett fram. I tillegg kan radiobølger bli reflektert av ionosfæren, 80–400 km over bakken, tilbake mot jordoverflata og dermed nå enda lenger.

**Avsnitt 8:** Grunnen til at mat varmes opp så raskt i en mikrobølgeovn, er at frekvensen til mikrobølgene passer godt sammen med frekvensen som både fett- og vannmolekyler naturlig vil svinge med. Dermed sørger mikrobølgeovnen for å «riste» på alle vannmolekylene i maten. Derfor blir maten varm fordi den inneholder vann, mens tallerkenen (som ikke inneholder vann) ikke blir det.

</details>

**Usanne påstander:** ____  **Huskeregel:** ☐ ja ☐ nei

**Kommentar:**

---

## 2. Egenskaper hos ulike EM-bølger — Suno-prompt

Tekst: `testdata/gullsett/naturfag-em-bolger.txt` · fagord i verset: Radiobølger, frekvens, bølgelengde

Stil: `upbeat pop, catchy chorus, clear female vocals, 110 bpm`

> Radiobølger sender signaler langt, _(avsnitt 5)_  
> lav frekvens, lang bølgelengde, gang på gang, _(avsnitt 3)_  
> høyt oppe kastes de tilbake ned, _(avsnitt 5)_  
> og når enda lenger, til et fjernt sted. _(avsnitt 5)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 3:** Inspirert av Maxwells teorier for elektromagnetiske bølger satte Heinrich Hertz i 1887 opp et forsøk der han lagde elektriske svingninger som produserte radiobølger. Det er bølger med lav frekvens og lang bølgelengde, fra 1 meter til mange km.

**Avsnitt 5:** På grunn av den lange bølgelengden er radiobølger svært godt egnet til å sende signaler over store avstander. Bølger med korte bølgelengder spres lett, mens radiobølger går uforstyrret rett fram. I tillegg kan radiobølger bli reflektert av ionosfæren, 80–400 km over bakken, tilbake mot jordoverflata og dermed nå enda lenger.

</details>

**Usanne påstander:** ____  **Huskeregel:** ☐ ja ☐ nei

**Kommentar:**

---

## 3. Høy prisvekst gir ny renteøkning — vers

Tekst: `testdata/gullsett/samfunnsfag-prisvekst.txt` · fagord i verset: Prisvekst, styringsrenta, sysselsettingsvekst, reallønnsvekst

> Prisvekst er en seig gjest, _(avsnitt 3)_  
> styringsrenta steg, det er ingen fest. _(avsnitt 8)_  
> Sysselsettingsvekst drar ledigheten ned, _(avsnitt 17)_  
> reallønnsvekst gir kjøpekraft med. _(avsnitt 20)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 3:** Konflikten i Midtøsten har bidratt til høyere energi- og råvarepriser. Sammen med fortsatt høy lønnsvekst holdes prisveksten oppe, og gir ny renteøkning i år.

**Avsnitt 8:** Norges Bank reduserte styringsrenta med 0,5 prosentpoeng i 2025. Etter uventet høy inflasjon i begynnelsen av 2026 varslet Norges Bank i mars at renta trolig ville bli satt opp. I mai ble styringsrenta økt til 4,25 prosent.

**Avsnitt 17:** I prognosene holder yrkesdeltakelsen seg på et høyt nivå, men fortsatt sysselsettingsvekst bidrar til å trekke AKU-ledigheten ned mot 4 prosent i 2029.

**Avsnitt 20:** – Vi venter at både privat og offentlig forbruk vil bidra klart til veksten framover. Husholdningenes forbruk løftes av fortsatt reallønnsvekst, mens handlingsrommet i finanspolitikken gir rom for høy offentlig etterspørsel, sier Thomas von Brasch.

</details>

**Usanne påstander:** ____  **Huskeregel:** ☐ ja ☐ nei

**Kommentar:**

---

## 4. Høy prisvekst gir ny renteøkning — Suno-prompt

Tekst: `testdata/gullsett/samfunnsfag-prisvekst.txt` · fagord i verset: Prisvekst, renteøkning, styringsrenta, inflasjon, sysselsettingsvekst, reallønnsvekst

Stil: `upbeat pop, catchy chorus, clear female vocals, 110 bpm`

> Styringsrenta steg i mai, _(avsnitt 8)_  
> ny renteøkning ventes i år, prisvekst blir ikke lei. _(avsnitt 9)_  
> Høy lønnsvekst og dyr energi gir inflasjon, _(avsnitt 3)_  
> og det tar tid før den synker ned mot to i tone. _(avsnitt 5)_  
> Sysselsettingsvekst trekker ledigheten ned, _(avsnitt 17)_  
> og reallønnsvekst gir kjøpekraft, litt mer å bruke med. _(avsnitt 6)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 3:** Konflikten i Midtøsten har bidratt til høyere energi- og råvarepriser. Sammen med fortsatt høy lønnsvekst holdes prisveksten oppe, og gir ny renteøkning i år.

**Avsnitt 5:** – Prisveksten er fortsatt klart over inflasjonsmålet. Høy lønnsvekst og økte priser internasjonalt gjør at det tar tid før inflasjonen kommer ned mot 2 prosent, sier Thomas von Brasch, forsker i Statistisk sentralbyrå.

**Avsnitt 6:** Ifølge prognosene vil inflasjonen, målt ved konsumprisindeksen, avta fra 3,2 prosent i år til rundt 2 prosent i 2029. Lønnsveksten anslås til 4,4 prosent i 2026, før den gradvis avtar mot 3 prosent i 2029. Den årlige reallønnsveksten blir dermed om lag 1 prosent i årene framover.

**Avsnitt 8:** Norges Bank reduserte styringsrenta med 0,5 prosentpoeng i 2025. Etter uventet høy inflasjon i begynnelsen av 2026 varslet Norges Bank i mars at renta trolig ville bli satt opp. I mai ble styringsrenta økt til 4,25 prosent.

**Avsnitt 9:** – Den høye prisveksten gjør at vi venter en ny renteheving fra Norges Bank i år. Det kan skje allerede på torsdag, sier Thomas von Brasch.

**Avsnitt 17:** I prognosene holder yrkesdeltakelsen seg på et høyt nivå, men fortsatt sysselsettingsvekst bidrar til å trekke AKU-ledigheten ned mot 4 prosent i 2029.

</details>

**Usanne påstander:** ____  **Huskeregel:** ☐ ja ☐ nei

**Kommentar:**

---

## 5. metafor — vers

Tekst: `testdata/gullsett/norsk-metafor.txt` · fagord i verset: metafor, betydningsområder, kognitiv, simile

> Metafor gir et ord en ny mening, _(avsnitt 2)_  
> to betydningsområder i forening. _(avsnitt 3)_  
> Simile sier «som» eller «lik», _(avsnitt 6)_  
> metaforen dropper dem: «han er en løve», slik. _(avsnitt 6)_  
> Kognitiv metafor ligger til grunn, _(avsnitt 14)_  
> den taler gjennom språkets munn. _(avsnitt 4)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 2:** En metafor er et ord eller et uttrykk som brukes i overført eller billedlig betydning. Et par eksempler er å si «å holde hjulene i gang» om å sørge for at en bedrift eller et samfunn fungerer som det skal, eller å omtale en sart og følsom person som «et persilleblad».

**Avsnitt 3:** Vanligvis innebærer en metafor at ordet eller uttrykket forholder seg til to betydningsområder, og at det skapes en forbindelse mellom dem.

**Avsnitt 4:** Innen kognitiv metaforteori skiller man mellom språklige metaforer, som «hjertet står i brann» om forelskelse, og kognitive metaforer, som strukturerer hvordan man tenker, og som kommer til uttrykk gjennom språklige metaforer.

**Avsnitt 6:** Metaforen har mye til felles med similen , men i en metafor skjer sammenligningen uten ordene som eller lik . Med en simile blir en ting sammenliknet med noe annet, og med en metafor blir en ting satt i stedet for den tingen som skal beskrives. En simile er når vi sier at et menneske gjorde noe « som en løve», og en metafor er når vi sier at «han er en løve».

**Avsnitt 14:** Metaforer kan uttrykkes gjennom språk , men de dreier seg også om forholdet mellom ideer og forestillinger . En kognitiv eller tankemessig metafor kan ligge til grunn for et kunstverk, som når forfatteren Jorge Luis Borges (1899–1986) skriver at universet er et bibliotek, eller for en oppfatning, som når en bedriftsleder sier at de ansatte er en familie.

</details>

**Usanne påstander:** ____  **Huskeregel:** ☐ ja ☐ nei

**Kommentar:**

---

## 6. metafor — Suno-prompt

Tekst: `testdata/gullsett/norsk-metafor.txt` · fagord i verset: metafor, betydningsområder, simile

Stil: `upbeat folk-pop, playful storytelling, clear vocals, light acoustic guitar, 100 bpm`

> Simile sier 'som', det er klart, _(avsnitt 6)_  
> metafor hopper over 'som' og sier 'er' fra start. _(avsnitt 6)_  
> To betydningsområder, én tråd, _(avsnitt 3)_  
> og minnet får en knagg, et godt råd. _(avsnitt 3)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 3:** Vanligvis innebærer en metafor at ordet eller uttrykket forholder seg til to betydningsområder, og at det skapes en forbindelse mellom dem.

**Avsnitt 6:** Metaforen har mye til felles med similen , men i en metafor skjer sammenligningen uten ordene som eller lik . Med en simile blir en ting sammenliknet med noe annet, og med en metafor blir en ting satt i stedet for den tingen som skal beskrives. En simile er når vi sier at et menneske gjorde noe « som en løve», og en metafor er når vi sier at «han er en løve».

</details>

**Usanne påstander:** ____  **Huskeregel:** ☐ ja ☐ nei

**Kommentar:**

---

## 7. Domeneoppbygning og toppdomene — vers

Tekst: `testdata/gullsett/teknologi-domeneoppbygning.txt` · fagord i verset: toppdomene, DNS-rotserverne, IP-adressene, under-domene

> Bakerst et punktum, DNS-rotserverne her, _(avsnitt 5)_  
> der innholdet ligger, som du ser. _(avsnitt 5)_  
> Neste er .no, det norske toppdomene, _(avsnitt 6)_  
> der Norid kjenner IP-adressene. _(avsnitt 6)_  
> Om er et under-domene, ganske fint, _(avsnitt 8)_  
> under .ndla, som et godt hint. _(avsnitt 8)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 5:** Hvis vi starter bakerst, har vi et punktum (.). Dette punktumet blir som oftest fjernet av nettleseren. Det indikerer at innholdet ligger under DNS-rotserverne.

**Avsnitt 6:** Neste del er .no, som er det norske topp-domenet. Alle .no-adresser er regulert av Norid AS, som er en privat ,ikke-kommersiell bedrift som har fått ansvaret fra norske myndigheter. Norid AS sine DNS-servere har ansvaret for å kjenne til IP-adressene til alle DNS-servere som har .no-domener.

**Avsnitt 8:** om er et under-domene under .ndla-domenet. Dette styres av den samme DNS-serveren som selve domenet. Det er ikke nødvendig å bruke underdomener, men er spesielt praktisk for domener som skal betjene flere tjenester eller nettsider. Det er mulig å ha flere nivåer med under-domener hvis dette er ønsket.

</details>

**Usanne påstander:** ____  **Huskeregel:** ☐ ja ☐ nei

**Kommentar:**

---

## 8. Domeneoppbygning og toppdomene — Suno-prompt

Tekst: `testdata/gullsett/teknologi-domeneoppbygning.txt` · fagord i verset: toppdomene, IP-adressene, under-domene

Stil: `upbeat pop, catchy chorus, clear vocals, 110 bpm`

> Start bakerst, der punktet står, _(avsnitt 5)_  
> rotserverne peker, IP-adressene går. _(avsnitt 7)_  
> Toppdomene .no er norsk og rent, _(avsnitt 6)_  
> under-domene .ndla, tydelig kjent. _(avsnitt 8)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 5:** Hvis vi starter bakerst, har vi et punktum (.). Dette punktumet blir som oftest fjernet av nettleseren. Det indikerer at innholdet ligger under DNS-rotserverne.

**Avsnitt 6:** Neste del er .no, som er det norske topp-domenet. Alle .no-adresser er regulert av Norid AS, som er en privat ,ikke-kommersiell bedrift som har fått ansvaret fra norske myndigheter. Norid AS sine DNS-servere har ansvaret for å kjenne til IP-adressene til alle DNS-servere som har .no-domener.

**Avsnitt 7:** .ndla er selve domenet. NDLA har gitt en DNS-server ansvar for dette domenet. Fordi vi har mange tjenester som bruker domener (Nettsider, e-post, server-programmer osv.) kan et domene kobles til mange forskjellige IP-adresser, avhengig av typen oppslag som gjøres.

**Avsnitt 8:** om er et under-domene under .ndla-domenet. Dette styres av den samme DNS-serveren som selve domenet. Det er ikke nødvendig å bruke underdomener, men er spesielt praktisk for domener som skal betjene flere tjenester eller nettsider. Det er mulig å ha flere nivåer med under-domener hvis dette er ønsket.

</details>

**Usanne påstander:** ____  **Huskeregel:** ☐ ja ☐ nei

**Kommentar:**

---

## 9. Operativsystem — vers

Tekst: `testdata/gullsett/teknologi-operativsystem.txt` · fagord i verset: operativsystem, minne, prosessorer

> Operativsystemet fordeler ressurs, _(avsnitt 2)_  
> skriver, minne, prosessorer – alt i kurs. _(avsnitt 2)_  
> Først i minnet, ved start, _(avsnitt 4)_  
> det styrer hverdagen for alt som lastes inn, smart. _(avsnitt 4)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 2:** Et operativsystem (OS) er den grunnleggende programvaren på en datamaskin, og det som tildeler de forskjellige ressursene i datamaskinen til andre programmer. Én type ressurs er eksterne enheter, som en skriver.  Operativsystemet passer for eksempel på at to programmer ikke samtidig sender informasjon til samme skriver, men at de legges i en venteliste før utskrivning. En annen type ressurs er interne enheter som minne og prosessorer. Dette er svært grunnleggende komponenter som operativsystemet også holder styr på.

**Avsnitt 4:** Operativsystemet er et program som alle andre i datamaskinen. Det er skrevet i et programmeringsspråk og følger vanlige regler for programmer. Forskjellen er at det er det første som lastes inn i minnet når maskinen startes, og det styrer «hverdagen» for alle programmer som lastes inn senere.

</details>

**Usanne påstander:** ____  **Huskeregel:** ☐ ja ☐ nei

**Kommentar:**

---

## 10. Operativsystem — Suno-prompt

Tekst: `testdata/gullsett/teknologi-operativsystem.txt` · fagord i verset: operativsystem, minne, maskinvare

Stil: `upbeat pop, catchy chorus, clear vocals, 110 bpm`

> Operativsystemet, slik er dets natur, _(avsnitt 2)_  
> det deler minne ut, hver til sin tur. _(avsnitt 2)_  
> Maskinvare er vrien, det er klart, _(avsnitt 3)_  
> og operativsystemet tar sin part. _(avsnitt 3)_  

<details><summary>Avsnittene verset bygger på</summary>

**Avsnitt 2:** Et operativsystem (OS) er den grunnleggende programvaren på en datamaskin, og det som tildeler de forskjellige ressursene i datamaskinen til andre programmer. Én type ressurs er eksterne enheter, som en skriver.  Operativsystemet passer for eksempel på at to programmer ikke samtidig sender informasjon til samme skriver, men at de legges i en venteliste før utskrivning. En annen type ressurs er interne enheter som minne og prosessorer. Dette er svært grunnleggende komponenter som operativsystemet også holder styr på.

**Avsnitt 3:** Man kan betrakte programvare som å være én av to typer: applikasjonsprogramvare eller systemprogramvare. Applikasjonsprogramvare er slikt som tekstbehandlere, regneark og andre programmer som brukeren har direkte kontakt med. Av systemprogramvare er operativsystemet den viktigste. Det holder styr på systemressursene og gjør programmererens jobb enklere. Tilleggsenheter som er koblet til datamaskinen er ofte kompliserte å bruke. En harddisk, for eksempel, trenger detaljerte instruksjoner om å starte motoren sin, stoppe den, flytte på lesehodene og mye annet. Operativsystemet bruker harddisken ved å kommunisere på en standard måte med et driverprogram laget spesielt for enheten. Et annet program som ønsker å skrive noe til harddisken gir bare beskjed til operativsystemet om for eksempel «å skrive teksten 'kongle' til filen "kongle.txt" på katalogen c:\». Operativsystemet, i samarbeid med driverprogrammet, tar seg så av resten av oppgaven.

</details>

**Usanne påstander:** ____  **Huskeregel:** ☐ ja ☐ nei

**Kommentar:**

---

**Sum usanne påstander:** ____ av mål 0  ·  **Fungerer som huskeregel:** ____ av 10
