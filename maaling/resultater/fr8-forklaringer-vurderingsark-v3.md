# Vurderingsark — forklaringene til fagordene (FR-8), prompt v3

Kravet: **null faglig gale forklaringer** i det som vises eleven. Dette er en gjennomgang av leveransen, ikke en statistisk terskel: forklaringene er det eleven pugger på øvekortene, og en gal forklaring pugges like godt som en riktig.

Arket viser de 39 fagordene appen leverer for de seks tekstene, etter selvkonsistens og kapping — det eleven ser. For hver forklaring:

- **Vurdering:** `riktig`, `gal` (motsier teksten eller faget) eller `misvisende` (riktig ord for ord, men gir eleven et galt bilde). En forenkling som fortsatt er riktig, er riktig.
- **Kommentar:** bare ved gal eller misvisende — hva som er galt, og hva teksten sier.

Kildeavsnittet står under forklaringen. Forklaringen skal stemme med det, men kan bruke vanlig fagkunnskap så lenge den ikke motsier teksten.

---

## Egenskaper hos ulike EM-bølger

Tekst: `testdata/gullsett/naturfag-em-bolger.txt`

### 1. elektromagnetisk stråling

> Stråling som består av svingende elektriske og magnetiske felt som brer seg som bølger, og som ikke trenger noe stoff for å bevege seg. Lys, radiobølger og røntgenstråling er alle eksempler.

<details><summary>Avsnitt 23</summary>

Røntgenstråling er elektromagnetisk stråling som er mer energirik enn UV-C og har bølgelengder kortere enn 10 nm.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 2. bølgelengde

> Avstanden mellom to bølgetopper i en bølge. Kort bølgelengde gir høy energi og lang bølgelengde gir lav energi.

<details><summary>Avsnitt 3</summary>

Inspirert av Maxwells teorier for elektromagnetiske bølger satte Heinrich Hertz i 1887 opp et forsøk der han lagde elektriske svingninger som produserte radiobølger. Det er bølger med lav frekvens og lang bølgelengde, fra 1 meter til mange km.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 3. ionosfæren

> Et lag av elektrisk ladde partikler i atmosfæren, omtrent 80 til 400 km over bakken. Det kan reflektere radiobølger tilbake mot jordoverflaten.

<details><summary>Avsnitt 5</summary>

På grunn av den lange bølgelengden er radiobølger svært godt egnet til å sende signaler over store avstander. Bølger med korte bølgelengder spres lett, mens radiobølger går uforstyrret rett fram. I tillegg kan radiobølger bli reflektert av ionosfæren, 80–400 km over bakken, tilbake mot jordoverflata og dermed nå enda lenger.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 4. frekvens

> Hvor mange svingninger en bølge gjør per sekund. Høy frekvens gir høy energi, og lav frekvens gir lav energi.

<details><summary>Avsnitt 7</summary>

Ved å øke svingefrekvensen i Hertz forsøk kunne man produsere elektromagnetiske bølger med høyere frekvens – mikrobølger. Denne gruppen av elektromagnetiske bølger har bølgelengder mellom 1 mm og 1 m. Du kjenner den nok best via mikrobølgeovnen.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 5. IR-stråling

> Infrarød stråling, elektromagnetisk stråling med litt mindre energi enn synlig lys. Den kjennes som varme på huden.

<details><summary>Avsnitt 10</summary>

IR-stråling er elektromagnetisk stråling som har litt mindre energi enn synlig lys. Den har bølgelengder i området 700 nm til 1 mm, og de korteste av disse kan vi føle med huden. Når vi føler strålevarmen fra en vedovn, er det IR-stråler som ligger ganske nærme den røde delen av spekteret.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 6. ultrafiolett stråling

> Elektromagnetisk stråling utenfor den fiolette enden av det synlige spekteret, med bølgelengder mellom 10 og 400 nm. Den kan gi solbrenthet.

<details><summary>Avsnitt 19</summary>

Inspirert av Herschels oppdagelse av IR gjorde Johann W. Ritter forsøk på den andre siden av det synlige spekteret. I 1801 påviste han at sølvklorid (som seinere ble brukt i fotopapir) mørknet raskere utenfor det fiolette området enn inni. Altså måtte det være stråling der! Denne strålingen kalles ultrafiolett stråling, siden den ligger utenfor det fiolette området.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 7. røntgenstråling

> Elektromagnetisk stråling med mye energi og bølgelengder kortere enn 10 nm. Den kan gå gjennom stoff som lys ikke kommer gjennom.

<details><summary>Avsnitt 23</summary>

Røntgenstråling er elektromagnetisk stråling som er mer energirik enn UV-C og har bølgelengder kortere enn 10 nm.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

---

## metafor

Tekst: `testdata/gullsett/norsk-metafor.txt`

### 8. metafor

> Et ord eller uttrykk som brukes i overført eller billedlig betydning, slik at det står for noe annet enn det bokstavelig betyr. Eksempel: «han er en løve» om en modig person.

<details><summary>Avsnitt 2</summary>

En metafor er et ord eller et uttrykk som brukes i overført eller billedlig betydning. Et par eksempler er å si «å holde hjulene i gang» om å sørge for at en bedrift eller et samfunn fungerer som det skal, eller å omtale en sart og følsom person som «et persilleblad».

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 9. simile

> En sammenligning der noe settes opp mot noe annet ved hjelp av ord som «som» eller «lik». Eksempelet «gjorde noe som en løve» er en simile, fordi sammenligningen sies eksplisitt.

<details><summary>Avsnitt 6</summary>

Metaforen har mye til felles med similen , men i en metafor skjer sammenligningen uten ordene som eller lik . Med en simile blir en ting sammenliknet med noe annet, og med en metafor blir en ting satt i stedet for den tingen som skal beskrives. En simile er når vi sier at et menneske gjorde noe « som en løve», og en metafor er når vi sier at «han er en løve».

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 10. domenene

> De to forestillingsområdene en metafor knytter sammen. Det ene er området metaforen henter mening fra, og det andre er området den overfører mening til.

<details><summary>Avsnitt 17</summary>

Det finnes flere moderne teorier om metaforens funksjon innen både språkvitenskap og filosofien . Den amerikanske lingvisten George Lakoff (født 1941) er en av de mest kjente forskerne innen metaforteori . Han legger blant annet vekt på vekselvirkningen mellom de to forestillingsområdene eller «domenene»: det metaforen henter mening fra, og det den overfører mening til.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 11. kognitive metaforer

> Metaforer som former måten vi tenker på, og som kommer til uttrykk gjennom språklige metaforer. Språket er bare synlig del av dem.

<details><summary>Avsnitt 4</summary>

Innen kognitiv metaforteori skiller man mellom språklige metaforer, som «hjertet står i brann» om forelskelse, og kognitive metaforer, som strukturerer hvordan man tenker, og som kommer til uttrykk gjennom språklige metaforer.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 12. personifikasjon

> Å gi døde ting eller abstrakte begreper menneskelige egenskaper, slik at de fremstår som levende. I diktet fra nasjonalsangen blir for eksempel frihet beskrevet som «blåøyd».

<details><summary>Avsnitt 12</summary>

Siden metaforer ofte appellerer til fantasien og skaper sterke bilder, er de særlig vanlig i poetisk personifikasjon og besjeling . Metaforen kan være et substantiv , adjektiv eller verb , slik de forekommer i Norges nasjonalsang : «den saganatt som senker drømme på vår jord», «blåøyd frihet» og «Tordenskiold langs kysten lynte».

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

---

## Språklige bilder: metafor, allegori og allusjon

Tekst: `testdata/gullsett/norsk-sprakligebilder.txt`

### 13. metafor

> Et språklig bilde der noe beskrives ved å gi det egenskaper fra noe annet, uten at det sies at det er likt. Eksempelet er «en uslepen diamant» om et fotballtalent.

<details><summary>Avsnitt 4</summary>

Et språklig bilde er et uttrykk som blir brukt i overført betydning, og som skal beskrive noen eller noe. For eksempel kan en sportsjournalist skrive om et lovende fotballtalent at han er "en uslepen diamant". Bildet får oss til å tenke på noe verdifullt, men uferdig, og det er nettopp disse egenskapene ved den unge spilleren journalisten vil framheve.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 14. allegori

> En tekst som kan forstås konkret, men også som et bilde på noe annet og større, ofte med en moral.

<details><summary>Avsnitt 35</summary>

En allegori er en tekst du kan tolke som et bilde på noe annet. Allegoriske tekster forteller en konkret historie der du kan tolke hele tekster som et bilde på noe annet og større. Noen ganger blir allegorien brukt for å få fram en moral.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 15. allusjon

> Et språklig virkemiddel der man låner fra eller refererer til en kjent tekst, et kunstverk, en hendelse eller en person, slik at teksten får et ekstra lag med mening.

<details><summary>Avsnitt 52</summary>

En allusjon er et språklig virkemiddel der vi låner fra eller refererer til en annen tekst, film, sang eller et kunstverk. Det kan også være en referanse til en historisk hendelse eller en kjent person.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 16. personifikasjon

> Et språklig bilde der noe livløst får menneskelige egenskaper, for eksempel «Stillheten truet meg».

<details><summary>Avsnitt 13</summary>

Personifikasjon

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 17. besjeling

> Et språklig bilde der noe livløst får liv eller handler som om det er levende, for eksempel «Kaffetrakteren sukket tungt».

<details><summary>Avsnitt 9</summary>

Besjeling

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 18. konnotasjon

> En felles assosiasjon som knyttes til et ord, i tillegg til den vanlige betydningen, og som kan skape stemning i et dikt.

<details><summary>Avsnitt 24</summary>

En konnotasjon er en felles assosiasjon som vi knytter til et ord. Ordvalget til dikteren er derfor med på å skape ei stemning i diktet. For eksempel vil fargen svart få mange til å tenke på noe dystert. Fargen hvitt, derimot, konnoterer gjerne uskyld.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 19. fabel

> En kort fortelling med dyr i hovedrollene som slutter med en moral, og som ofte kan leses allegorisk.

<details><summary>Avsnitt 33</summary>

Allegori Allegori er når en hel tekst kan forstås som et bilde på noe annet. Teksten kan leses konkret, men også som et bilde på noe annet og større. Fabel Fabel er en kort fortelling med en moral. Fabelen kan ofte leses allegorisk.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

---

## Høy prisvekst gir ny renteøkning

Tekst: `testdata/gullsett/samfunnsfag-prisvekst.txt`

### 20. styringsrenta

> Renta som Norges Bank bestemmer for bankene. Når den settes opp, blir det dyrere å låne penger, og når den settes ned, blir det billigere.

<details><summary>Avsnitt 8</summary>

Norges Bank reduserte styringsrenta med 0,5 prosentpoeng i 2025. Etter uventet høy inflasjon i begynnelsen av 2026 varslet Norges Bank i mars at renta trolig ville bli satt opp. I mai ble styringsrenta økt til 4,25 prosent.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 21. boliginvesteringene

> Det samlede beløpet som brukes på å bygge nye boliger og på større oppgraderinger av eksisterende boliger.

<details><summary>Avsnitt 12</summary>

Boliginvesteringene holdt seg på et lavt nivå gjennom 2025, etter å ha falt rundt 25 prosent gjennom 2023 og 2024. I 1. kvartal i år falt investeringene litt. De siste tallene for nyboligsalg og igangsetting tyder ikke på noen snarlig oppgang i boligbyggingen.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 22. inflasjonsmålet

> Det målet sentralbanken har satt for hvor mye prisene skal stige per år, her 2 prosent. Når prisveksten er over målet, sier man at inflasjonen er for høy.

<details><summary>Avsnitt 5</summary>

– Prisveksten er fortsatt klart over inflasjonsmålet. Høy lønnsvekst og økte priser internasjonalt gjør at det tar tid før inflasjonen kommer ned mot 2 prosent, sier Thomas von Brasch, forsker i Statistisk sentralbyrå.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 23. konsumprisindeksen

> En indeks som måler hvor mye prisene på en fast kurv med varer og tjenester som husholdningene kjøper, har steget. Inflasjonen måles ofte ved hjelp av den.

<details><summary>Avsnitt 6</summary>

Ifølge prognosene vil inflasjonen, målt ved konsumprisindeksen, avta fra 3,2 prosent i år til rundt 2 prosent i 2029. Lønnsveksten anslås til 4,4 prosent i 2026, før den gradvis avtar mot 3 prosent i 2029. Den årlige reallønnsveksten blir dermed om lag 1 prosent i årene framover.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 24. fastlandsøkonomien

> Den delen av norsk økonomi som ikke omfatter petroleumsvirksomheten og utenriks sjøfart. Den brukes ofte for å se på utviklingen i resten av økonomien.

<details><summary>Avsnitt 21</summary>

Ifølge prognosene vil fastlandsøkonomien utvikle seg nær normalt framover, med vekst på drøyt 1,5 prosent.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 25. reallønnsvekst

> Veksten i lønningene etter at man har trukket fra prisveksten. Den viser hvor mye kjøpekraften til lønnstakerne øker.

<details><summary>Avsnitt 6</summary>

Ifølge prognosene vil inflasjonen, målt ved konsumprisindeksen, avta fra 3,2 prosent i år til rundt 2 prosent i 2029. Lønnsveksten anslås til 4,4 prosent i 2026, før den gradvis avtar mot 3 prosent i 2029. Den årlige reallønnsveksten blir dermed om lag 1 prosent i årene framover.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 26. BNP-veksten

> Hvor mye den samlede verdien av varer og tjenester som produseres i et land øker fra ett år til det neste.

<details><summary>Avsnitt 26</summary>

BNP-veksten hos Norges handelspartnere har i gjennomsnitt ligget på om lag 2 prosent årlig siden 2005. Veksten anslås til 1,5 prosent i 2026, før den tar seg opp mot 2 prosent i 2029.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

---

## Domeneoppbygning og toppdomene

Tekst: `testdata/gullsett/teknologi-domeneoppbygning.txt`

### 27. topp-domenet

> Den siste delen av en domeneadresse, etter det siste punktumet, for eksempel .no. Det sier noe om hvilken type eller hvilket land adressen tilhører.

<details><summary>Avsnitt 6</summary>

Neste del er .no, som er det norske topp-domenet. Alle .no-adresser er regulert av Norid AS, som er en privat ,ikke-kommersiell bedrift som har fått ansvaret fra norske myndigheter. Norid AS sine DNS-servere har ansvaret for å kjenne til IP-adressene til alle DNS-servere som har .no-domener.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 28. under-domene

> Et domene som ligger under et annet domene, for eksempel om i om.ndla.no. Det styres av samme DNS-server som hoveddomenet og brukes ofte til å skille ulike tjenester eller nettsider.

<details><summary>Avsnitt 8</summary>

om er et under-domene under .ndla-domenet. Dette styres av den samme DNS-serveren som selve domenet. Det er ikke nødvendig å bruke underdomener, men er spesielt praktisk for domener som skal betjene flere tjenester eller nettsider. Det er mulig å ha flere nivåer med under-domener hvis dette er ønsket.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 29. Merkenavn-toppdomener

> Nye generiske topp-domener som eies og styres av en bedrift, for eksempel .google, og som ofte bare bedriften selv kan bruke.

<details><summary>Avsnitt 22</summary>

Merkenavn-toppdomener som .google eller .android, som eies og styres av en bedrift og ofte kun er tillatt brukt av den bedriften.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 30. DNS-rotserverne

> Det øverste nivået i systemet som oversetter domenenavn til IP-adresser. Punktumet bakerst i adressen viser at oppslaget går til disse serverne.

<details><summary>Avsnitt 5</summary>

Hvis vi starter bakerst, har vi et punktum (.). Dette punktumet blir som oftest fjernet av nettleseren. Det indikerer at innholdet ligger under DNS-rotserverne.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 31. Nasjonale topp-domener (ccTLD)

> Topp-domener som er knyttet til et bestemt land, for eksempel .no for Norge. Hvert land styrer sitt eget nasjonale topp-domene.

<details><summary>Avsnitt 12</summary>

Nasjonale topp-domener (ccTLD).

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 32. Generiske topp-domener (gTLD)

> Topp-domener som ikke er knyttet til et land, for eksempel .com eller .org. De styres av organisasjoner som har fått ansvar for dem.

<details><summary>Avsnitt 15</summary>

Generiske topp-domener (gTLD).

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 33. Sponsede topp-domener

> Generiske topp-domener som er laget for en bestemt bransje eller interessegruppe, for eksempel .aero for flyindustrien.

<details><summary>Avsnitt 20</summary>

Sponsede topp-domener som for eksempel .aero for fly-industrien.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

---

## Operativsystem

Tekst: `testdata/gullsett/teknologi-operativsystem.txt`

### 34. operativsystem

> Den grunnleggende programvaren på en datamaskin. Den fordeler datamaskinens ressurser, som skriver, minne og prosessor, mellom de programmene som kjører.

<details><summary>Avsnitt 2</summary>

Et operativsystem (OS) er den grunnleggende programvaren på en datamaskin, og det som tildeler de forskjellige ressursene i datamaskinen til andre programmer. Én type ressurs er eksterne enheter, som en skriver.  Operativsystemet passer for eksempel på at to programmer ikke samtidig sender informasjon til samme skriver, men at de legges i en venteliste før utskrivning. En annen type ressurs er interne enheter som minne og prosessorer. Dette er svært grunnleggende komponenter som operativsystemet også holder styr på.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 35. systemprogramvare

> Programvare som holder styr på datamaskinens egne ressurser og gjør det lettere for programmerere å lage andre programmer. Operativsystemet er den viktigste typen.

<details><summary>Avsnitt 3</summary>

Man kan betrakte programvare som å være én av to typer: applikasjonsprogramvare eller systemprogramvare. Applikasjonsprogramvare er slikt som tekstbehandlere, regneark og andre programmer som brukeren har direkte kontakt med. Av systemprogramvare er operativsystemet den viktigste. Det holder styr på systemressursene og gjør programmererens jobb enklere. Tilleggsenheter som er koblet til datamaskinen er ofte kompliserte å bruke. En harddisk, for eksempel, trenger detaljerte instruksjoner om å starte motoren sin, stoppe den, flytte på lesehodene og mye annet. Operativsystemet bruker harddisken ved å kommunisere på en standard måte med et driverprogram laget spesielt for enheten. Et annet program som ønsker å skrive noe til harddisken gir bare beskjed til operativsystemet om for eksempel «å skrive teksten 'kongle' til filen "kongle.txt" på katalogen c:\». Operativsystemet, i samarbeid med driverprogrammet, tar seg så av resten av oppgaven.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 36. applikasjonsprogramvare

> Programmer som brukeren har direkte kontakt med, for eksempel tekstbehandlere og regneark. Den andre hovedtypen programvare er systemprogramvare.

<details><summary>Avsnitt 3</summary>

Man kan betrakte programvare som å være én av to typer: applikasjonsprogramvare eller systemprogramvare. Applikasjonsprogramvare er slikt som tekstbehandlere, regneark og andre programmer som brukeren har direkte kontakt med. Av systemprogramvare er operativsystemet den viktigste. Det holder styr på systemressursene og gjør programmererens jobb enklere. Tilleggsenheter som er koblet til datamaskinen er ofte kompliserte å bruke. En harddisk, for eksempel, trenger detaljerte instruksjoner om å starte motoren sin, stoppe den, flytte på lesehodene og mye annet. Operativsystemet bruker harddisken ved å kommunisere på en standard måte med et driverprogram laget spesielt for enheten. Et annet program som ønsker å skrive noe til harddisken gir bare beskjed til operativsystemet om for eksempel «å skrive teksten 'kongle' til filen "kongle.txt" på katalogen c:\». Operativsystemet, i samarbeid med driverprogrammet, tar seg så av resten av oppgaven.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 37. driverprogram

> Et program som er laget spesielt for én enhet, for eksempel en harddisk, og som vet hvordan enheten styres. Operativsystemet kommuniserer med enheten gjennom driverprogrammet.

<details><summary>Avsnitt 3</summary>

Man kan betrakte programvare som å være én av to typer: applikasjonsprogramvare eller systemprogramvare. Applikasjonsprogramvare er slikt som tekstbehandlere, regneark og andre programmer som brukeren har direkte kontakt med. Av systemprogramvare er operativsystemet den viktigste. Det holder styr på systemressursene og gjør programmererens jobb enklere. Tilleggsenheter som er koblet til datamaskinen er ofte kompliserte å bruke. En harddisk, for eksempel, trenger detaljerte instruksjoner om å starte motoren sin, stoppe den, flytte på lesehodene og mye annet. Operativsystemet bruker harddisken ved å kommunisere på en standard måte med et driverprogram laget spesielt for enheten. Et annet program som ønsker å skrive noe til harddisken gir bare beskjed til operativsystemet om for eksempel «å skrive teksten 'kongle' til filen "kongle.txt" på katalogen c:\». Operativsystemet, i samarbeid med driverprogrammet, tar seg så av resten av oppgaven.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 38. sanntidsoperativsystemer

> Operativsystemer som garanterer at systemet svarer innen en bestemt tid. De brukes for eksempel i styringssystemer i biler.

<details><summary>Avsnitt 13</summary>

Operativsystemer kan grupperes på flere måter.  En av dem er etter bruksområde.  Stormaskiner har operativsystemer som er tilpasset deres bruk, minimaskiner sitt og tjenere har sine operativsystemer.  Felles for alle disse er at de ikke har interaksjon med brukeren som fokus.  På skrivebord og i private hjem finner vi det som tidligere kaltes mikrodatamaskiner, senere kalt hjemmedatamaskin og så PC.  Disse har egne operativsystemer, og fra sent på 1980-tallet ble Microsoft sine operativsystemer markedsledende der.  Håndholdte enheter som PDAer og mobiltelefoner har operativsystemer som er spesielt tilpasset maskinvaren.  En annen kategori OSer er sanntidsoperativsystemer.  Disse siste tilbyr tjenester hvor de garanterer responstid.  Eksempler er datamaskinen som kontrollerer tenning og drivstofftilførsel i en moderne bil.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

### 39. plattform

> Et felles grunnlag som programmer kan bygges på og kjøres på. Et operativsystem på flere maskintyper gir utviklere én plattform å forholde seg til.

<details><summary>Avsnitt 11</summary>

Forskjellige datamaskiner bruker forskjellige typer maskinvare. En applikasjon skrevet til en type datamaskin vil da ikke nødvendigvis kjøre på en annen. Imidlertid kan et operativsystem finnes til flere typer maskiner, noe som gjør at operativsystemet fungerer som en felles plattform utvikleren av en applikasjon kan benytte seg av, uten å tenke på de forskjellige typene maskinvare brukeren kan tenkes å ha.

</details>

**Vurdering:** ☐ riktig ☐ gal ☐ misvisende

**Kommentar:**

---

**Sum:** ____ riktig · ____ gal · ____ misvisende av 39  ·  **Krav:** 0 gale
