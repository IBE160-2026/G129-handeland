# Product Brief: Lesevenn

> **Status.** Opprettet 24.09.2026. Oppdatert 07.10.2026 etter tilbakemelding fra
> emneansvarlig (`tilbakemelding-product-brief.md`), slik at omfang og
> suksess-kriterier stemmer med `prd-lesevenn.md`. Endringene er listet nederst
> i dokumentet, så sporet brief → PRD → kode kan følges begge veier.

## Sammendrag

Lesevenn er en nettapp som hjelper elever på videregående med å forstå og huske fagtekst, gjennom en KI-generert lesestrategi-sekvens i stedet for en passiv oppsummering. Eleven limer inn en tekst, laster opp en PDF eller fotograferer en bokside. Appen viser først overskriftene og ber eleven aktivere forkunnskaper ved å tenke gjennom hva teksten sannsynligvis handler om. Deretter leser eleven teksten med sentrale faguttrykk fremhevet. Til slutt sjekkes forståelsen — ikke bare med en quiz, men med øvekort og en skriftlig fagsamtale der Lesevenn stiller oppfølgingsspørsmål til elevens egne forklaringer, omtrent som en lærer ville gjort i en muntlig høring. Elever som ønsker det kan få nøkkeldelene på morsmålet sitt.

Bakgrunnen er ikke abstrakt. PISA 2025-resultatene, offentliggjort 8. september 2026, viser at norske elevers leseferdigheter fortsetter å falle: 34 prosent av tiendeklassingene i skoleåret 2024–25 presterte på et nivå som definerer dem som lavtpresterende i lesing, og for guttene var andelen hele 41 prosent (Kunnskapsdepartementet, PISA 2025). Til dette kommer en gruppe elever som møter et ekstra hinder før de i det hele tatt kommer i gang: elever med norsk som andrespråk, som skal forstå fagstoffet *og* språket det er skrevet på samtidig.

Det som gjør dette realistisk å bygge alene i løpet av et semester, er at nesten hele funksjonssettet er kjernebruk av språkmodeller: å forstå en tekst, generere spørsmål, føre en oppfølgende dialog, oversette, og skrive et minneregle-vers er alt sammen oppgaver språkmodeller er genuint gode på. Det gjør Lesevenn til et renere KI-prosjekt enn et som krever en egen matematisk løsermotor ved siden av, og gir samtidig mye skjermflate til design og brukeropplevelse.

## Problemet/rasjonalet

Leseforståelse er selve grunnmuren for læring i alle fag, ikke bare i norsktimene — men stadig flere elever strever med den grunnmuren. Nedgangen i PISA-resultatene er ikke et engangsutslag: den har pågått over flere målinger, og andelen elever som presterer på laveste mestringsnivå har økt betydelig. For lærere i klasserommet er konsekvensen konkret: en stadig større andel elever klarer ikke å hente ut mening fra en lærebok-tekst på egen hånd, og trenger støtte læreren sjelden har tid til å gi individuelt til hver elev, for hver tekst.

For elever med norsk som andrespråk er problemet doblet. De skal ikke bare forstå faginnholdet, men også avkode et språk de fortsatt er i ferd med å lære — ofte fylt med fagbegreper og språklige bilder som er vanskelige selv for morsmålsbrukere. I dag finnes det få verktøy som møter dette systematisk: generiske "lim inn tekst, få et sammendrag"-verktøy hopper rett til svaret uten å bygge forståelse underveis, og de færreste tilbyr noen form for morsmålsstøtte i selve leseprosessen.

Resultatet er at elever som strever, ofte gir opp før de har lest ferdig, og at læreren har begrenset innsikt i *hvor* forståelsen svikter — var det ordforrådet, sammenhengen, eller selve resonnementet?

## Løsningen

Lesevenn tar imot en tekst (limt inn, lastet opp som PDF, eller fotografert som boksider) og fører eleven gjennom en fast lesestrategi-sekvens, i tillegg til noen frittstående støtteverktøy:

**Kjerneløypen.** En aktiveringsside viser tekstens overskrifter og ber eleven skrive kort om hva de forventer teksten handler om, basert på dem — en anerkjent lesestrategi for å bygge forforståelse før man går løs på selve teksten. Deretter vises teksten i en lesevisning der sentrale faguttrykk og nøkkelord er fremhevet inline. Til slutt genereres en quiz som sjekker om forståelsen faktisk satt seg.

**Øvekort.** Nøkkelordene og faguttrykkene fra teksten gjenbrukes til øvekort — ord på forsiden, forklaring på baksiden — for repetisjon i etterkant.

**Skriftlig fagsamtale.** I stedet for kun en multiple-choice-quiz kan eleven gå inn i en skriftlig dialog: Lesevenn stiller et spørsmål om teksten, eleven svarer med egne ord, og Lesevenn vurderer svaret og stiller et relevant oppfølgingsspørsmål — en tekstbasert versjon av den muntlige høringen en lærer ville gjort, uten avhengighet av tale-til-tekst eller lydopptak.

**Sang/rim for pugging.** For nøkkelbegreper genererer Lesevenn enten et kort, minneverdig vers/rim direkte, eller en ferdig formulert prompt eleven kan lime inn i et verktøy som Suno for å få en faktisk sang.

**Morsmålsstøtte.** For elever som ønsker det, kan aktiveringssiden og en kort avsluttende oppsummering vises på elevens morsmål, i tillegg til at vanskelige språklige bilder og fagbegreper i selve teksten pekes ut spesifikt.

**Innlesing som tåler virkeligheten.** Mye av stoffet elevene faktisk skal lese sitter i trykte bøker eller i nettbøker som ikke lar seg kopiere. Lesevenn tar derfor imot fotograferte boksider i tillegg til limt inn tekst og PDF. Alle tre veier ender i samme gjennomsynssteg, der eleven ser den uthentede teksten og kan rette den før den låses — fordi ingen av de tre veiene er feilfri, og en feil i råteksten ellers forplanter seg til alt som genereres etterpå.

En enkel brukerkonto lagrer elevens tidligere tekster og resultater, slik at eleven kan komme tilbake til tidligere arbeid.

Teknologivalgene med begrunnelse står i `arkitektur-lesevenn.md` og `addendum-lesevenn.md`, ikke her.

## Hvordan den skiller seg fra andre

Det ærlige utgangspunktet: å generere sammendrag og quiz fra opplastede notater er ikke en ny idé — det er nettopp beskrevet som et "Enkelt" forslag i emnets egen prosjektliste. Lesevenn sitt bidrag ligger ikke i å oppfinne en ny KI-kapabilitet, men i å forankre bruken av den i en etablert lesepedagogisk struktur: aktivere forkunnskaper før lesing, fremheve nøkkelbegreper underveis, og teste forståelse aktivt gjennom en dialog som følger opp svake svar — ikke bare en passiv multiple-choice-sjekk til slutt.

Morsmålsstøtten er den andre reelle differensieringen: de fleste generiske studieverktøy er bygget med implisitt norsk (eller engelsk) som forutsetning, og tilbyr ingen støtte til elever som fortsatt bygger seg opp i undervisningsspråket. Å legge morsmålsstøtte inn i selve lesestrategi-flyten, ikke som en generell oversetter-knapp, er en bevisst pedagogisk designbeslutning, ikke en teknisk nyvinning.

Hva dette ikke er: det finnes ingen proprietær modell eller hemmelig metode her — byggeklossene er offentlig tilgjengelige LLM-API-er. Fordelen ligger i den gjennomtenkte sammensetningen rundt en reell pedagogisk arbeidsflyt, og i utførelsen — ikke i teknologien i seg selv.

## Brukergruppe

**Primær bruker:** eleven på videregående skole, 15 til 19 år, som strever med å forstå fagtekst på egen hånd — enten fordi lesing generelt er krevende, eller fordi norsk er andrespråket deres. Både studiespesialiserende og yrkesfaglige programområder er med, og det er et bevisst valg: yrkesfaglige lærebøker har sitt eget fagspråk («bæreevne», «sveisefuge»), og et verktøy som bare gjenkjenner akademisk fagspråk ville virket dårligst der lesestøttebehovet er størst. Begge programområdene er derfor representert i gullsettene som måler kvaliteten.

Suksess for denne eleven er å komme gjennom en tekst med faktisk forståelse, ikke bare å ha "lest den", og å kunne vise den forståelsen gjennom en samtale, ikke bare et gjetteforsøk på en multiple-choice-oppgave.

Aldersgruppen har to konsekvenser utover språk og innhold. Designet må være lesbart for elever som strever med lesing — rolig typografi, god linjeavstand, ingen tettpakkede flater. Og brukerne er delvis mindreårige, så elevsvar, morsmål og opplastet tekst er personopplysninger som sendes til en ekstern språkmodell. Hva det innebærer, og hvilke leverandørvilkår som gjelder, er drøftet i `addendum-lesevenn.md` §6.

**Sekundær bruker:** læreren, som får et verktøy elevene kan bruke selvstendig for å bearbeide tekst, uten at læreren må lage individuelt tilpasset lesestøtte for hver elev og hver tekst for hånd.

## Suksess-kriterier

Kriteriene under er de målbare kravene fra `prd-lesevenn.md`. Hvert tall måles mot et **gullsett** — et testsett utvikleren har annotert manuelt, som ligger i repoet med en kjørbar måling. Én regel går igjen og er verdt å lese først: *en språkmodells egen vurdering av sitt eget utdata er aldri bevis.* Alle tallene under er derfor målt mot menneskeannotert materiale eller maskinelt, aldri av modellen selv.

**Faguttrykk blir funnet, og forklart riktig.** Gjenkalling ≥ 0,75 og presisjon ≥ 0,70 mot et gullsett på seks tekster fordelt på fag og programområde, og **null faglig gale forklaringer** i det eleven faktisk ser. I tillegg måles utviklerens egen annoteringsstøy (Cohens κ over to annoteringer av samme tekst med sju dagers mellomrom) — uten den vet vi ikke om 0,70 ligger over eller under vår egen usikkerhet.

**Uttrekket er stabilt.** Samme tekst sendt inn to ganger gir minst 0,80 overlapp (Jaccard) i hvilke uttrykk som markeres. En app som markerer ulike ord hver gang er ikke til å stole på, uansett hvor god enkeltkjøringen er.

**Quizen holder seg til teksten.** Åtte spørsmål per tekst, der minst 85 prosent er forankret i noe teksten faktisk sier, og **null** spørsmål krever kunnskap utenfra. Forankringen vurderes manuelt over 24 genererte spørsmål, og konfidensintervallet rapporteres sammen med andelen.

**Fagsamtalen reagerer faktisk på svaret.** Oppfølgingsspørsmålet inneholder minst ett innholdsord eleven selv innførte — altså et ord som står i elevens svar men ikke i spørsmålet eleven svarte på. Måles maskinelt, 100 prosent. To blokkerende porter i tillegg: **null** misoppfatninger lest som dekkende (systemet skal ikke bekrefte en gal forståelse), og binær gjenkalling ≥ 0,90 for «dette svaret trenger oppfølging». Manuell relevansvurdering ≥ 80 prosent.

**Oversettelsen bærer det norske fagordet videre.** Begrepsanker ≥ 0,95 maskinelt (det norske fagordet står igjen i oversettelsen, slik at eleven kan koble det til læreren og læreboka), null tapte negasjoner, og en ekstern gjennomgang av én morsmålsbruker. Gjelder ukrainsk i v1; arabisk demonstreres for høyre-til-venstre-visning uten kvalitetspåstand.

**Hele kjerneløypen går gjennom.** En elev kan føre én tekst fra innlesing til fullført fagsamtale uten å stå fast, og hver feiltilstand sier på vanlig norsk hva som gikk galt og minst én konkret ting å gjøre videre. Ingen «noe gikk galt».

**Sensor kan kjøre appen.** Repoet har en testmodus med lagrede modellsvar for én eksempeltekst og en lokal database som settes opp etter README, slik at hele kjerneløypen kan gås gjennom uten prosjektets API-nøkler eller betalte kontoer. Dette er også kostnadskontroll under utvikling: måling og demonstrasjon kjører på lagrede svar, ikke på nye kall.

**Dokumentasjonen viser kvalitetssikringen, ikke bare resultatet.** KI-logg med minst fem oppføringer der KI-forslaget ble forkastet eller vesentlig endret, med begrunnelsen. Promptregister med måletall per versjon og minst én dokumentert forbedring over to versjoner. En ærlig refleksjon over begrensningene ved å la en språkmodell vurdere en elevs egen forklaring, bygget på de faktiske tallene over.

## Omfang

**Med i v1.**

Innlesing av tekst: limt inn, PDF, eller fotograferte boksider, alle tre gjennom samme gjennomsynssteg der eleven retter råteksten før den låses. Aktiveringsside med overskrifter og forkunnskaps-spørsmål. Lesevisning med fremhevede faguttrykk. Quiz generert fra teksten. Øvekort basert på faguttrykkene. Skriftlig fagsamtale med oppfølgingsspørsmål basert på elevens svar. Generering av minnevers/rim, eller en ferdig Suno-prompt, for pugging. Ett morsmål-støttepunkt: aktiveringssiden og en kort avsluttende oppsummering på elevens morsmål, samt utpeking av vanskelige språklige bilder og fagbegreper. Enkel brukerkonto med lagring av tidligere tekster og resultater. Testmodus med lagrede modellsvar og lokal database, slik at appen kan kjøres uten prosjektets nøkler.

Funksjonene bygges i denne rekkefølgen, med en fungerende og testet versjon etter hvert steg: kjerneløypen (innlesing → aktivering → lesevisning → quiz) → fagsamtale → øvekort → konto → morsmål → minnevers. Kuttrekkefølgen i `prd-lesevenn.md` §9 sier hva som ryker først om tiden ikke holder; den går fra bunnen av den listen.

**Eksplisitt utenfor v1.**

**Mapper** — å samle flere tekster og kjøre én samlet quiz eller fagsamtale for hele mappen. Dette var i v1 i den første versjonen av briefen, og ble flyttet ut under PRD-arbeidet (`prd-lesevenn.md` §4.9): funksjonen krever en egen datamodell, en egen generatorvei og egen kvalitetsmåling, uten å styrke den pedagogiske kjernen som skiller prosjektet ut. Det er den tyngste enkeltkuttet i planen og den viktigste grunnen til at resten er realistisk.

Innlesing fra URL. Stemmebasert (tale) versjon av fagsamtalen. CSV-eksport av spørsmål til Kahoot/Blooket. Personalisert diagnostikk på tvers av økter og fag ("hva bør jeg generelt jobbe med") — dette krever reell brukshistorikk over tid for å bli troverdig. Full morsmålsstøtte i absolutt alle funksjoner (kun aktivering + oppsummering i v1). Et eget lærerdashboard for hele klasser.

Disse er utsatt, ikke forkastet — flere av dem er naturlige neste steg dersom prosjektet videreføres.

**Merknad om bildeinnlesing.** Fotografering av boksider sto opprinnelig utenfor v1 og ble tatt inn under PRD-arbeidet, fordi en stor del av stoffet elevene skal lese ikke er tilgjengelig som kopierbar tekst — et verktøy som bare tar imot limt inn tekst treffer dårligst de elevene det er laget for. Funksjonen er bevisst **ikke kvalitetsmålt mot et gullsett** i v1, og er merket som umålt i PRD-en (FR-44, FR-45). Den ligger øverst i kuttrekkefølgen, altså først ut om tiden blir knapp.

## Visjon

På kort sikt er målet å vise at en lesestrategi-forankret KI-flyt faktisk hjelper elever — særlig flerspråklige elever — til å forstå og huske fagtekst bedre enn et generisk "lim inn og få et sammendrag"-verktøy, og at en skriftlig fagsamtale er en mer troverdig forståelsestest enn en ren multiple-choice-quiz.

På lengre sikt kan Lesevenn utvides med mapper som samler et helt bokkapittel under én felles forståelsessjekk, URL-innlesing, en tale-basert fagsamtale for elever som uttrykker seg bedre muntlig enn skriftlig, et lærerdashboard som viser hvor en hel klasse strever mest (koblet mot ferdig formaterte Kahoot/Blooket-eksporter for felles repetisjon), og etter hvert en ekte personalisert diagnostikk bygget på faktisk brukshistorikk over tid — ikke bare for én tekst, men på tvers av alt eleven har jobbet med.

## Endringer etter første versjon

| Dato | Endring | Grunn |
|---|---|---|
| 25.09.2026 | Mapper flyttet ut av v1 | PRD-arbeidet viste at funksjonen krever egen datamodell, generatorvei og kvalitetsmåling uten å styrke den pedagogiske kjernen (`prd-lesevenn.md` §4.9) |
| 02.10.2026 | Bildeinnlesing tatt inn i v1, merket umålt | Mye av stoffet elevene skal lese finnes ikke som kopierbar tekst (FR-44, FR-45) |
| 07.10.2026 | Aldersgruppe skrevet inn; vage suksess-kriterier erstattet med PRD-ens måltall; testmodus og lokal database tatt inn i omfanget | Tilbakemelding fra emneansvarlig 06.10.2026 |
