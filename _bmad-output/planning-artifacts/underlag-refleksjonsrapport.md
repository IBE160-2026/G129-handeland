---
title: Underlag til refleksjonsrapporten — Lesevenn
status: arbeidsdokument
created: 2026-09-25
updated: 2026-09-28
---

# Underlag til refleksjonsrapporten

## Hva dette er, og hva det ikke er

Dette er **råstoff og peker­liste**, ikke et utkast til refleksjonsrapporten. Rapporten teller 30 prosent av karakteren og skal være din egen kritiske vurdering — og FR-38 krever dokumenterte tilfeller der du overprøvde et KI-forslag. En rapport skrevet av en språkmodell ville motsagt sitt eget innhold.

Det dette dokumentet gjør, er å samle det som ellers ligger spredt: planleggingsdokumentene er organisert etter *krav*, mens rapporten skal organiseres etter det emnet spør om. Under står koblingen mellom de to, pluss de funnene som alt er dokumenterte og klare til å siteres.

**Merk:** flere av punktene under er funn fra planleggingsfasen. De er ikke verdt noe i rapporten før du har skrevet dem om til dine egne ord og din egen vurdering.

## Hva emnet faktisk spør om

Mappevurderingen høsten 2026 har to deler:

| Del | Vekt | Hva den krever |
|---|---|---|
| Prosjektkode og funksjonalitet | 70 % | «Dokumentasjon må vise hvordan KI ble brukt, og hvordan studentene har kvalitetssikret koden» |
| Refleksjonsrapport | 30 % | Utviklingsprosess, utfordringer og løsninger. «Kritisk vurdering av hvordan KI påvirket sluttresultatet». Etiske og teknologiske implikasjoner |

Legg merke til ordlyden i den første: **koden**, ikke bare innholdet appen produserer. Det er to ulike kvalitetssikringsoppgaver, og §4.11 i PRD-en skiller dem.

Emnets læringsutbytter peker i tillegg på: prompting, iterativ kodegjennomgang, testing, versjonskontroll, og etikk og jus rundt KI-generert kode inkludert eierskap og skjevhet. Alle fem bør være gjenkjennelige i rapporten.

## Hvor råstoffet ligger

| Fil | Hva du finner der |
|---|---|
| `prd-lesevenn.md` §4.11 | FR-38 til FR-43 — kravene til dokumentasjonen, altså sjekklisten for hva rapporten må dekke |
| `prd-lesevenn.md` §10 | Suksesskriteriene og motmetrikkene, med tallene som skal måles |
| `prd-lesevenn.md` §11–12 | Åpne spørsmål og antakelsesregister — ærlige usikkerheter, allerede formulert |
| `addendum-lesevenn.md` §1 | Emnefakta med kilder, og hvilke annenhåndskilder som er utdaterte |
| `addendum-lesevenn.md` §2 | Kildesjekk av PISA-tallene, med hva som er bekreftet og hva som ikke er |
| `addendum-lesevenn.md` §4 | **Forkastede alternativer med begrunnelse** — den tetteste kilden til «hva vi vurderte og valgte bort» |
| `.memlog-lesevenn.md` | Kronologisk beslutningslogg for hele planleggingen, med begrunnelse per linje |
| `review-rubric.md` | Full kvalitetsgjennomgang av PRD-en, 18 funn etter alvorlighet |
| `review-scope-testability.md` | Adversarisk gjennomgang: timeanslag, statistiske innvendinger, hvilke terskler som ikke holdt |
| `reconcile-brief.md` | Hva PRD-en mistet eller endret fra briefen, merket bevisst vs. drift |

De tre siste er lange og detaljerte. De er ikke skrevet for rapporten, men de inneholder resonnementene bak endringene, og de er nyttige når du skal forklare *hvorfor* noe ble som det ble.

## Funn som er klare til å brukes

Dette er de stedene der planleggingen produserte noe konkret å reflektere over — ikke generelle betraktninger om KI, men ting som skjedde i dette prosjektet.

### Kvalitetssikring som faktisk fant feil

**Et krav som ikke kunne feile.** FR-20 pålegger oppfølgingsspørsmålet i fagsamtalen å gjengi et ord eleven brukte. FR-21 målte samtidig at to ulike elevsvar gir oppfølginger med ordforskjell over en terskel. De to opphevet hverandre: siden ulike svar inneholder ulike ord, ville testen bestått automatisk — også for et system som stiller funksjonelt samme spørsmål hver gang. To krav som hver for seg ser fornuftige ut, ødela målingen til sammen. Erstattet av en test på *hvilket avsnitt* oppfølgingen peker på. Står i PRD §4.6, nederst i FR-21.

**En metode som brøt prosjektets egen regel.** FR-28 målte oversettelseskvalitet ved å oversette tilbake til norsk og sammenligne. Prosjektets motmetrikk SM-C4 sier at en modells vurdering av sitt eget utdata aldri er dokumentasjon — og tilbakeoversettelse med samme modellfamilie er nettopp det, med ett ekstra steg. Metoden er systematisk blind for feil terminologi, altså det den skulle garantere. Nedgradert til å gjelde bare tapt nekting, tall og egennavn, som er det den faktisk fanger.

**En terskel som tillot den verste feilen.** FR-21 krevde 75 prosent treff på femveis klassifisering av elevsvar. FR-43 navngir samtidig «en misoppfatning lest som dekkende» som prosjektets verste feilmåte — eleven får bekreftet en gal forståelse. Den gamle terskelen tillot den feilen i mengde. Erstattet av en blokkerende sikkerhetsport: null misoppfatninger lest som dekkende, ellers tas ikke promptversjonen i bruk.

**Et vern som ikke vernet.** Tetthetstaket for markerte fagbegreper var 8 prosent av løpende ord. Brukerreisen i samme dokument beskriver fjorten begreper over fire sider — altså langt under taket. Taket kunne aldri slå inn, så «vernet mot det gule teppet» var en påstand om å ha et vern. Strammet til 4 prosent, 12 per 1 000 ord, og maks 3 per 100 sammenhengende ord.

**En port som ville feilet tilfeldig.** Demoløypen hadde et steg som krevde at fagsamtalen klassifiserte et bestemt svar i en bestemt tilstand. Et modellkall er ikke deterministisk, så porten ville feilet av og til uten at noe var galt — og en port som feiler tilfeldig blir stille droppet. Flyttet: demoen sjekker at flyten og feltene finnes, kvaliteten måles på testsettet.

### Statistikk og ærlighet om egne tall

**Terskler som ikke tålte sin egen utvalgsstørrelse.** «Minst 90 prosent» målt på 40 tilfeller har et konfidensintervall som strekker seg ned mot 75. Tallet ser strengere ut enn det er. Flere terskler ble derfor senket eller gjort om til rapportering med intervall i stedet for bestått/ikke bestått. Per-fag-*terskler* falt helt, mens per-fag-*rapportering* ble beholdt.

**Måling av egen annoteringsstøy.** To av seks tekster annoteres to ganger, en uke fra hverandre, og samsvaret rapporteres. Uten det vet du ikke om presisjon 0,70 ligger over eller under din egen usikkerhet — og da betyr tallet ingenting. Koster om lag én time.

**Testsettene ble halvert.** Etter en gjennomgang av omfanget: 9 → 6 tekster, 40 → 24 spørsmål, 60 → 36 samtaletilfeller, 20 → 10 vers, og oversettelse fra 10 tekster i tre språk til 4 i ett. En terskel som krever flere tilfeller enn du har timer til å annotere, er ikke en strengere terskel — den blir ikke målt.

### Valg tatt under reelle begrensninger

**Hvorfor ukrainsk.** Ukrainsk er v1s kvalitetssikrede språk fordi det er språket prosjektet har en kontrollkilde til — ikke fordi det er det viktigste språket i norsk skole. Tilgang til én person avgjorde hva prosjektet kan påstå. Det er verdt å si rett ut; det er slik kvalitetssikring fungerer når man er alene.

**Fra tre språk til ett.** Tre kvalitetssikrede språk ville krevd tre frivillige morsmålsbrukere før M1 — altså gjort dokumentets mest usikre antakelse til en forutsetning for å bli ferdig. Arabisk bygges likevel, fordi høyre-til-venstre-gjengivelse er teknisk arbeid som står på egne bein. Det som falt bort var måleforpliktelsen, ikke funksjonaliteten.

**Friksjon lagt til med vilje.** Det obligatoriske gjennomsynssteget etter PDF-uttrekk (FR-3) gjør appen tregere å bruke. Begrunnelsen: flerspaltet tekst i feil leserekkefølge kan ikke oppdages automatisk, så automatikk ville fanget de lette feilene og sluppet gjennom den verste. Ett manuelt steg dekker alle sju feiltilstander, også de ukjente. Om friksjonen var verdt det, er fortsatt ubesvart — testbrukeren i SM-10 skal avgjøre.

### Etikk og skjevhet, konkret for dette produktet

**Tre akser for skjevhet** (PRD FR-42): mellom fag, mellom programområder, og mellom språk. Den midterste er minst åpenbar og kanskje viktigst — akademisk fagspråk er bedre representert i modellens treningsdata enn yrkesfaglig terminologi, så uttrekket kan virke dårligst der lesestøttebehovet er størst. Krysningen i FR-8s testsett finnes for å måle det framfor å anta det. **Merk at dette er en hypotese, ikke et funn** — og at «ingen forskjell» også er et resultat.

**Grensen for KI-vurdering av en elev.** Forvekslingsmatrisen fra FR-21 er tallgrunnlaget. Den alvorligste feilmåten skal navngis: at en misoppfatning leses som dekkende, altså at eleven går derfra tryggere på noe som er feil. Valget om at svarvurderingen aldri er en karakter (FR-23) er en konsekvens av nettopp den grensen, ikke en designpreferanse.

**Eierskap og opphavsrett.** To spor: lisens og eierskap til KI-generert kode, og opphavsretten til den læreboksteksten eleven limer inn. Prosjektets svar på det siste er at innhold er privat for kontoen og at det ikke finnes deling i v1.

### Kildebruk

**PISA-tallene er kontrollert.** Publiseringsdato 8. september 2026, 34 prosent under minimumsnivået i lesing, og 41 prosent for gutter er alle bekreftet mot Udir, UiO og Utdanningsnytt. Tallet 27 prosent for jenter er **bare delvis bekreftet** og bør ikke brukes uten egen kontroll. En påstand om 24 poengs fall siden 2022 dukket opp i søk men lot seg ikke bekrefte — ikke bruk den.

**En presisering verdt å gjøre.** PISA måler 15-åringer, som i Norge i hovedsak går 10. trinn. Briefens «34 prosent av tiendeklassingene» er dagligtale; «norske 15-åringer (10. trinn)» er det presise.

**Og en kobling som styrker argumentet.** Målgruppen er videregående, mens PISA måler 10. trinn. Det svekker ikke problembeskrivelsen — det kullet som måles begynner på videregående året etter, og møter der lengre tekster og mindre lesestøtte. Bedre å koble kilden til målgruppen enn å låne tall fra et nærliggende trinn.

**Annenhåndskilder om emnet er delvis utdaterte.** Materiale som sirkulerer mellom studenter oppgir vektfordelingen 30/40/30 fra 2025. For 2026 er den 70/30, og den muntlige eksamenen er fjernet. Verdt å nevne som et konkret eksempel på kildekritikk i praksis.

## Hva som ennå ikke finnes, og som bare du kan lage

Alt over er dokumentert. Dette er ikke:

- **KI-loggen (FR-38).** Løpende logg gjennom semesteret: hva du ba om, hva som kom tilbake, hva du godtok, endret eller forkastet, og hvorfor. Kravet er minst fem tilfeller der forslaget ble forkastet eller vesentlig endret. En logg som bare viser treff dokumenterer flaks, ikke kvalitetssikring. **Må føres underveis** — commit-historikken skal vise det.
- **Promptregisteret (FR-39).** Appens egne prompter, versjonert, med måletall per versjon. Minst én prompt skal vise dokumentert forbedring over to versjoner.
- **Alle faktiske måletall.** Testsettene er spesifisert, ikke annotert. Tallene finnes ikke før du har kjørt dem.
- **Kodegjennomgangen (FR-41).** Særlig innlogging, lagring og sletting, linje for linje, dokumentert. Minst tre konkrete feil i KI-generert kode, med hvordan de ble funnet.
- **Din egen vurdering.** Av hva KI faktisk gjorde med sluttresultatet — hva som gikk raskere, hva som ble dårligere, hva du ikke forsto godt nok i koden du fikk.

## Praktisk

**Denne samtalen er ikke et varig dokument.** Alt som er verdt å beholde fra planleggingen skal ligge i filene i denne mappen. Er det noe fra dialogen du vil ha med, skriv det inn et sted her.

**Skriv underveis, ikke til slutt.** PRD §9.4 setter kodefrys 27. november og reserverer 28. november til 5. desember til dokumentasjon. Vinduet er til å *skrive* i, ikke til å rekonstruere i. Målingene og KI-loggen skal alt finnes når det åpner.

**Bruk tallene, ikke inntrykkene.** Rapportens troverdighet ligger i at den bruker de faktiske måleresultatene — inkludert de som ikke ble som håpet. Et dokumentert avvik er verdt mer enn en udokumentert suksess.

---

## Tillegg 25. september: fire designbeslutninger etter gjennomgang

Fire spørsmål fra PRD §11 ble besvart samme dag, og to av dem avdekket reelle feil i kravspesifikasjonen. Begge er gode eksempler på at et dokument kan være internt konsistent og likevel inneholde en selvmotsigelse.

**Aktiveringen var undergravd av sitt eget forarbeid.** FR-5 holder brødteksten skjult med vilje, fordi elevens gjetning skal skje før lesingen. Men FR-3 hadde nettopp vist eleven hele teksten, til kontroll av PDF-uttrekket. Vernet var dermed illusorisk — eleven hadde alt sett det FR-5 skjulte. Løst ved å dele gjennomsynet i to faser rundt Aktiveringen: overskriftskontroll før, tekstgjennomsyn etter. Feilen kom av at de to kravene ble skrevet i hver sin seksjon uten at rekkefølgen ble prøvd som en helhet.

**Et gulv som ville tvunget fram oppdiktede begreper.** FR-7 hadde et gulv på fem Faguttrykk, lagt inn for at korte tekster ikke skulle ende med ett markert ord. På en tekst uten fagbegreper ville gulvet tvunget modellen til å finne opp fem — i strid med verbatim-kravet i samme FR, og ødeleggende for presisjonsmålingen i FR-8. Endret til «inntil fem». Poenget for rapporten: en velmenende formulering i et krav kan presse modellen mot nettopp den oppførselen resten av dokumentet forbyr.

**En funksjon leveres bevisst uten kvalitetspåstand.** Samlet Fagsamtale for en Mappe (FR-34) måles ikke, fordi testsettet i FR-21 er bygget på enkelttekster og ikke sier noe om forankring på tvers. Å utvide det ville kostet annoteringstimer som er trimmet bort andre steder. Funksjonen finnes, påstanden gjør ikke, og det oppgis. Dette er regelen fra §0 anvendt på seg selv: en umålt funksjon er ikke en ødelagt funksjon, men en funksjon med en ufortjent påstand på seg er verre enn ingen påstand.

**En kjent teknisk begrensning dokumentert framfor skjult.** Oppheving av bindestreksdeling i PDF-uttrekk (FR-2) løses med en enkel regel om store og små bokstaver, ikke med en norsk ordliste. Regelen bommer på sammensatte ord med reell bindestrek der begge sider er små bokstaver. Restfeilene fanges av gjennomsynet, og feilretningen er den mildeste mulige: et feilaktig sammenslått ord finnes ikke i teksten og forkastes derfor som Faguttrykk, så konsekvensen er tapt dekning framfor oppdiktede begreper. Verdt å bruke som eksempel på å velge bort en avhengighet med åpne øyne.

**Om friksjonen i gjennomsynssteget.** Spørsmålet var om det obligatoriske steget tåler en reell elev. Standpunktet er at det gjør det: å måtte se over teksten før man leser den er i seg selv en anerkjent lesestrategi, og en av grunnene til at elever strever er nettopp at de mangler slike vaner. Forventningen er at steget går fra å oppleves som et hinder til å bli en normal del av å begynne på en tekst. Dette er en antakelse om tilvenning som ett møte med én testbruker (SM-10) ikke kan bekrefte eller avkrefte — og det bør sies i rapporten framfor å presentere testbrukerens førsteinntrykk som en konklusjon.

---

## Tillegg 28. september: bildeinngang, og etikken rundt datakjeden

**Den dyreste feilen i planleggingen var en antakelse ingen hadde skrevet ned.** PRD-en hadde to innlesingsveier — innliming og PDF — og begge forutsetter markerbar tekst. Antakelsen om at eleven i det hele tatt får teksten inn sto ikke noe sted, og den var ikke triviell: en stor del av målgruppen har papirbok, eller nettbok som sperrer for kopiering. For dem var v1 ikke tungvint, den var ubrukelig. Feilen ble avdekket av et spørsmål om noe helt annet — om innskannede bøker er lesbare. Det er verdt å skrive om, fordi det ikke var KI-en som tok feil om noe den visste: den visste ikke, og ingen hadde spurt.

**En teknisk begrunnelse som var utdatert.** PRD-en utelukket bildeinnlesing med at tekstgjenkjenning er «en egen kvalitetskjede med egne feilmåter». Det er riktig for tradisjonell OCR, men appen bruker allerede en multimodal modell — bildeuttrekk er samme API-kall med en bildeblokk. Modellen hadde resonnert om OCR som en separat motor og dermed overdrevet kostnaden av å ta det inn. Eksempel på at et KI-forslag kan være internt godt begrunnet og likevel bygge på et foreldet premiss om teknologien.

**En beslutning som ble omgjort, og hvorfor det var riktig begge ganger.** Mapper ble 25. september beholdt mot anbefaling, og tatt ut 27. september. Den første avgjørelsen var ikke feil da den ble tatt — den bygget på det som var kjent. Det som endret seg var at tilgangsproblemet kom fram. Avveiningen som avgjorde: Mapper er additiv, bildeinnlesing er eksistensiell. En funksjon som utvider nytten for dem som alt er i gang taper mot en funksjon som avgjør om de kommer i gang.

**En funksjon leveres med vilje uten kvalitetspåstand, for andre gang.** Bildeuttrekket måles ikke i v1 (FR-45). Et sjette gullsett ville gått ut over kvaliteten på de fem som finnes. Mekanismen er den samme som for Modellstøttet språk: en funksjon kan tilbys uten å være målt, så lenge det står hvilken av de to den er. At prosjektet bruker samme løsning to steder er et tegn på at regelen fra §0 faktisk er bærende og ikke bare en formulering.

**Etikken rundt datakjeden, formulert som et krav framfor et leverandørvalg.** Appen sender opphavsrettsbeskyttet lærebokstoff til en kommersiell tredjepart, og bildeinngangen skjerper det. Kravet i §6.2 er derfor leverandøruavhengig: inndata skal ikke brukes til trening, behandlingsstedet skal være kjent, vilkårene skal være lest og datert. Begrunnelsen er at skillet som betyr noe er avtalen og ikke merkenavnet — forbruker- og API-versjoner av samme tjeneste har ofte ulike vilkår på nettopp dette punktet.

Hva designet faktisk begrenser: tegngrensen på 8 000, grensen på fire bilder, forbudet mot korpusbygging, at bilder ikke lagres. Hva det ikke løser: at ansvaret i praksis skyves til en mindreårig gjennom vilkår ingen leser, og at et informasjonsskjermbilde ikke er det samme som gyldig samtykke. Begge hører i rapporten.

En avveining verdt å navngi: en lokalt kjørt modell ville fjernet tredjepartsoverføringen helt. Den ble valgt bort fordi Svarvurderingen er den vanskeligste oppgaven i appen og krever god norsk. Det er personvern mot pedagogisk kvalitet, og det er ikke et valg som har et opplagt riktig svar.

**En grense for hva KI-en kunne bidra med.** Modellen kunne strukturere problemstillingen, men avviste å slå fast hva åndsverkloven eller avtaleverket for skoleverket tillater, og la det inn som et åpent spørsmål som må besvares med en lest kilde. Den avviste også å spekulere om en navngitt person i en sak den ikke kjente. Verdt å nevne i drøftingen av hvor KI var nyttig og hvor den ikke var det.
