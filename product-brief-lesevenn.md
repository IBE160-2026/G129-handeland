# Product Brief: Lesevenn


## Sammendrag

Lesevenn er en nettapp som hjelper elever med å forstå og huske fagtekst, gjennom en KI-generert lesestrategi-sekvens i stedet for en passiv oppsummering. Eleven limer inn en tekst eller laster opp en PDF. Appen viser først overskriftene og ber eleven aktivere forkunnskaper ved å tenke gjennom hva teksten sannsynligvis handler om. Deretter leser eleven teksten med sentrale faguttrykk fremhevet. Til slutt sjekkes forståelsen — ikke bare med en quiz, men med øvekort og en skriftlig fagsamtale der Lesevenn stiller oppfølgingsspørsmål til elevens egne forklaringer, omtrent som en lærer ville gjort i en muntlig høring. Elever som ønsker det kan få nøkkeldelene på morsmålet sitt, og flere tekster (for eksempel et helt bokkapittel) kan samles i en mappe med en felles oppsummerende quiz.

Bakgrunnen er ikke abstrakt. PISA 2025-resultatene, offentliggjort 8. september 2026, viser at norske elevers leseferdigheter fortsetter å falle: 34 prosent av tiendeklassingene i skoleåret 2024–25 presterte på et nivå som definerer dem som lavtpresterende i lesing, og for guttene var andelen hele 41 prosent (Kunnskapsdepartementet, PISA 2025). Til dette kommer en gruppe elever som møter et ekstra hinder før de i det hele tatt kommer i gang: elever med norsk som andrespråk, som skal forstå fagstoffet *og* språket det er skrevet på samtidig.

Det som gjør dette realistisk å bygge alene i løpet av et semester, er at nesten hele funksjonssettet er kjernebruk av språkmodeller: å forstå en tekst, generere spørsmål, føre en oppfølgende dialog, oversette, og skrive et minneregle-vers er alt sammen oppgaver språkmodeller er genuint gode på. Det gjør Lesevenn til et renere KI-prosjekt enn et som krever en egen matematisk løsermotor ved siden av — og gir samtidig mye skjermflate til å vise fram gjennomtenkt design og brukeropplevelse, som er en del av det som vurderes i IBE160 Programmering med KI ved Høgskolen i Molde.

## Problemet/rasjonalet

Leseforståelse er selve grunnmuren for læring i alle fag, ikke bare i norsktimene — men stadig flere elever strever med den grunnmuren. Nedgangen i PISA-resultatene er ikke et engangsutslag: den har pågått over flere målinger, og andelen elever som presterer på laveste mestringsnivå har økt betydelig. For lærere i klasserommet er konsekvensen konkret: en stadig større andel elever klarer ikke å hente ut mening fra en lærebok-tekst på egen hånd, og trenger støtte læreren sjelden har tid til å gi individuelt til hver elev, for hver tekst.

For elever med norsk som andrespråk er problemet doblet. De skal ikke bare forstå faginnholdet, men også avkode et språk de fortsatt er i ferd med å lære — ofte fylt med fagbegreper og språklige bilder som er vanskelige selv for morsmålsbrukere. I dag finnes det få verktøy som møter dette systematisk: generiske "lim inn tekst, få et sammendrag"-verktøy hopper rett til svaret uten å bygge forståelse underveis, og de færreste tilbyr noen form for morsmålsstøtte i selve leseprosessen.

Resultatet er at elever som strever, ofte gir opp før de har lest ferdig, og at læreren har begrenset innsikt i *hvor* forståelsen svikter — var det ordforrådet, sammenhengen, eller selve resonnementet?

## Løsningen

Lesevenn tar imot en tekst (limt inn, eller lastet opp som PDF) og fører eleven gjennom en fast lesestrategi-sekvens, i tillegg til noen frittstående støtteverktøy:

**Kjerneløypen.** En aktiveringsside viser tekstens overskrifter og ber eleven skrive kort om hva de forventer teksten handler om, basert på dem — en anerkjent lesestrategi for å bygge forforståelse før man går løs på selve teksten. Deretter vises teksten i en lesevisning der sentrale faguttrykk og nøkkelord er fremhevet inline. Til slutt genereres en quiz som sjekker om forståelsen faktisk satt seg.

**Øvekort.** Nøkkelordene og faguttrykkene fra teksten gjenbrukes til øvekort — ord på forsiden, forklaring på baksiden — for repetisjon i etterkant.

**Skriftlig fagsamtale.** I stedet for kun en multiple-choice-quiz kan eleven gå inn i en skriftlig dialog: Lesevenn stiller et spørsmål om teksten, eleven svarer med egne ord, og Lesevenn vurderer svaret og stiller et relevant oppfølgingsspørsmål — en tekstbasert versjon av den muntlige høringen en lærer ville gjort, uten avhengighet av tale-til-tekst eller lydopptak.

**Sang/rim for pugging.** For nøkkelbegreper genererer Lesevenn enten et kort, minneverdig vers/rim direkte, eller en ferdig formulert prompt eleven kan lime inn i et verktøy som Suno for å få en faktisk sang.

**Morsmålsstøtte.** For elever som ønsker det, kan aktiveringssiden og en kort avsluttende oppsummering vises på elevens morsmål, i tillegg til at vanskelige språklige bilder og fagbegreper i selve teksten pekes ut spesifikt.

**Mapper.** Flere tekster (for eksempel alle delkapitlene i ett bokkapittel) kan samles i en mappe. Fra mappen kan eleven kjøre én samlet quiz eller fagsamtale som dekker alt innholdet i mappen under ett, ikke bare én tekst om gangen.

En enkel brukerkonto lagrer elevens tidligere tekster og resultater, slik at mappe-funksjonen har noe å samle, og eleven kan komme tilbake til tidligere arbeid.

Under panseret: en lett nettapp (f.eks. Next.js eller Flask), et LLM-API for tekstanalyse, spørsmålsgenerering, dialogvurdering og oversettelse, og en enkel database for brukere, tekster og mapper.

## Hvordan den skiller seg fra andre

Det ærlige utgangspunktet: å generere sammendrag og quiz fra opplastede notater er ikke en ny idé — det er nettopp beskrevet som et "Enkelt" forslag i emnets egen prosjektliste. Lesevenn sitt bidrag ligger ikke i å oppfinne en ny KI-kapabilitet, men i å forankre bruken av den i en etablert lesepedagogisk struktur: aktivere forkunnskaper før lesing, fremheve nøkkelbegreper underveis, og teste forståelse aktivt gjennom en dialog som følger opp svake svar — ikke bare en passiv multiple-choice-sjekk til slutt.

Morsmålsstøtten er den andre reelle differensieringen: de fleste generiske studieverktøy er bygget med implisitt norsk (eller engelsk) som forutsetning, og tilbyr ingen støtte til elever som fortsatt bygger seg opp i undervisningsspråket. Å legge morsmålsstøtte inn i selve lesestrategi-flyten, ikke som en generell oversetter-knapp, er en bevisst pedagogisk designbeslutning, ikke en teknisk nyvinning.

Hva dette ikke er: det finnes ingen proprietær modell eller hemmelig metode her — byggeklossene er offentlig tilgjengelige LLM-API-er. Fordelen ligger i den gjennomtenkte sammensetningen rundt en reell pedagogisk arbeidsflyt, og i utførelsen — ikke i teknologien i seg selv.

## Brukergruppe

**Primær bruker:** eleven som strever med å forstå fagtekst på egen hånd — enten fordi lesing generelt er krevende, eller fordi norsk er andrespråket deres. Suksess for denne eleven er å komme gjennom en tekst med faktisk forståelse, ikke bare å ha "lest den", og å kunne vise den forståelsen gjennom en samtale, ikke bare et gjetteforsøk på en multiple-choice-oppgave.

**Sekundær bruker:** læreren, som får et verktøy elevene kan bruke selvstendig for å bearbeide tekst, uten at læreren må lage individuelt tilpasset lesestøtte for hver elev og hver tekst for hånd.

## Suksess-kriterier

**Funksjonelt.** En elev kan lime inn eller laste opp en tekst og gå gjennom hele sekvensen — aktivering, lesing med fremhevede nøkkelord, quiz, øvekort og fagsamtale — uten friksjon. Flere tekster kan samles i en mappe og gi én samlet quiz eller fagsamtale for hele mappen.

**Teknisk.** Nøkkelord og faguttrykk identifiseres presist på tvers av ulike fagtekster. Fagsamtalen stiller oppfølgingsspørsmål som faktisk reagerer på innholdet i elevens svar, ikke forhåndsdefinerte spørsmål i fast rekkefølge. Morsmåls-oversettelsen er faglig presis og forståelig for minst ett støttet språk.

**Læringsmessig.** Prosjektet dokumenterer tydelig hvordan KI er brukt i utviklingen og hvordan KI-generert innhold (spørsmål, vurderinger, oversettelser) er kvalitetssikret, samt en ærlig refleksjon om begrensningene ved å la en språkmodell vurdere en elevs muntlige/skriftlige forklaring — i tråd med mappekravet i IBE160.

## Omfang

**Med i v1.**

Tekst- og PDF-innlesing. Aktiveringsside med overskrifter og forkunnskaps-spørsmål. Lesevisning med fremhevede nøkkelord. Quiz generert fra teksten. Øvekort basert på nøkkelord/faguttrykk. Skriftlig fagsamtale med oppfølgingsspørsmål basert på elevens svar. Generering av minnevers/rim, eller en ferdig Suno-prompt, for pugging. Ett morsmål-støttepunkt: aktiveringssiden og en kort avsluttende oppsummering på elevens morsmål, samt utpeking av vanskelige språklige bilder/fagbegreper i teksten. Mappestruktur der flere tekster kan samles, med en samlet quiz/fagsamtale for hele mappen. Enkel brukerkonto med lagring av tidligere tekster og resultater.

**Eksplisitt utenfor v1.**

Innlesing fra URL og bilde/OCR (start med tekst og PDF). Stemmebasert (tale) versjon av fagsamtalen. CSV-eksport av spørsmål til Kahoot/Blooket. Personalisert diagnostikk på tvers av økter og fag ("hva bør jeg generelt jobbe med") — dette krever reell brukshistorikk over tid for å bli troverdig. Full morsmålsstøtte i absolutt alle funksjoner (kun aktivering + oppsummering i v1). Et eget lærerdashboard for hele klasser.

Disse er utsatt, ikke forkastet — flere av dem er naturlige neste steg dersom prosjektet videreføres.

## Visjon

På kort sikt er målet å vise at en lesestrategi-forankret KI-flyt faktisk hjelper elever — særlig flerspråklige elever — til å forstå og huske fagtekst bedre enn et generisk "lim inn og få et sammendrag"-verktøy, og at en skriftlig fagsamtale er en mer troverdig forståelsestest enn en ren multiple-choice-quiz.

På lengre sikt kan Lesevenn utvides med bilde- og URL-innlesing, en tale-basert fagsamtale for elever som uttrykker seg bedre muntlig enn skriftlig, et lærerdashboard som viser hvor en hel klasse strever mest (koblet mot ferdig formaterte Kahoot/Blooket-eksporter for felles repetisjon), og etter hvert en ekte personalisert diagnostikk bygget på faktisk brukshistorikk over tid — ikke bare for én tekst, men på tvers av alt eleven har jobbet med.
