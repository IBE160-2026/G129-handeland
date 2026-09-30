---
title: Proposal — Lesevenn
status: til godkjenning
created: 2026-09-25
updated: 2026-09-28
---

# Proposal: Lesevenn

**Emne:** IBE160 Programmering med KI, høst 2026
**Gruppe:** G129-handeland
**Student:** Arve Handeland — individuell gjennomføring, godkjent av emneansvarlig 25. september 2026
**Innleveringsfrist mappekrav:** 5. desember 2026

---

## 1. Bakgrunn

Leseforståelse er grunnmuren for læring i alle fag, og stadig flere elever strever med den. PISA 2025, publisert 8. september 2026, viser at 34 prosent av norske 15-åringer leser under det nivået som regnes som et minimum for å klare videre utdanning og arbeid. For gutter er andelen 41 prosent. Andelen under nivå 2 i lesing har steget fra 15 til 34 prosent siden 2015 (Udir, UiO/ILS).

Det kullet som måles som 15-åringer på 10. trinn, begynner på videregående året etter. Der møter de lengre tekster, tettere fagspråk og mindre lesestøtte enn de hadde på ungdomsskolen. I tillegg kommer elever med norsk som andrespråk, som skal forstå faginnholdet og språket det er skrevet på samtidig.

Eksisterende KI-verktøy møter dette dårlig. Et generisk «lim inn tekst, få et sammendrag»-verktøy hopper rett til produktet av lesingen og gjør selve lesingen unødvendig. Det hjelper den eleven som alt kunne lese, og lærer ikke den som ikke kunne det noe.

## 2. Formål

Lesevenn er en nettapp som fører eleven gjennom en lesestrategi-sekvens for fagtekst, med språkmodell som motor. Appen gir ikke sammendrag. Den følger i stedet rekkefølgen en leselærer ville brukt: aktivere forkunnskaper før lesing, støtte begrepsforståelse underveis, og teste forståelsen etterpå gjennom en skriftlig fagsamtale der eleven forklarer med egne ord og får oppfølgingsspørsmål basert på svaret sitt.

To ting skiller prosjektet fra en ren «generer quiz fra notater»-applikasjon:

**Fagsamtalen.** En flervalgsquiz kan bestås ved gjetting og avslører ikke hvor forståelsen svikter. Fagsamtalen klassifiserer elevens svar i én av fem tilstander og stiller et oppfølgingsspørsmål som er utledet av den tilstanden — mot det uklare, mot misoppfatningen, eller videre i stoffet når svaret holdt.

**Morsmålsstøtte som inngang, ikke omvei.** Aktiveringssiden og en avsluttende oppsummering kan vises på elevens morsmål, men den norske teksten er alltid til stede, og det norske fagbegrepet står alltid i parentes etter det oversatte. Målet er at eleven kommer videre i norsk fagspråk, ikke slutter å møte det.

Prosjektet er valgt fordi nesten hele funksjonssettet er kjernebruk av språkmodeller — forstå en tekst, hente ut begreper, generere spørsmål, vurdere et fritekstsvar, føre en oppfølgende dialog, oversette. Det gir et rent KI-prosjekt uten behov for en separat beregningsmotor ved siden av, og mye skjermflate til brukeropplevelse.

## 3. Målgruppe

**Primærbruker:** elev på videregående (Vg1–Vg3, 15–19 år) som strever med å forstå fagtekst alene — enten fordi lesing generelt er krevende, eller fordi norsk er andrespråket. Begge programområder er målgruppe: studiespesialiserende og yrkesfag har ulikt fagspråk, og det er en uttalt del av testopplegget å måle om verktøyet fungerer like godt på begge.

**Sekundærbruker:** læreren, som får et verktøy elevene kan bruke selvstendig. Læreren er ikke innlogget bruker i v1 — det finnes ingen klasseoversikt og ingen innsyn i elevresultater.

## 4. Kjernefunksjonalitet

### Må med (MVP)

| Funksjon | Beskrivelse |
|---|---|
| Innlesing av tekst | Tre veier inn — innliming, PDF med tekstlag, og bilder av inntil fire boksider. Obligatorisk redigerbart gjennomsyn i to faser rundt aktiveringen. Bildeinngangen leveres umålt og tydelig merket |
| Aktivering | Tekstens overskrifter vises, eleven skriver kort hva teksten antas å handle om, før brødteksten er tilgjengelig |
| Lesevisning | Teksten med fagbegreper markert inline, forklaring tilgjengelig uten å forlate siden |
| Quiz | Generert fra teksten, automatisk rettet, med henvisning tilbake til avsnittet svaret står i |
| Skriftlig fagsamtale | Svarvurdering i fem tilstander, oppfølgingsspørsmål utledet av tilstanden, maks seks runder |
| Øvekort | Ett kort per fagbegrep, fra samme begrepssett som lesevisningen |
| Morsmålsstøtte | Ukrainsk som kvalitetssikret språk, øvrige som modellstøttede med synlig forbehold. Arabisk bygges for høyre-til-venstre-visning |
| Brukerkonto | Innlogging, lagring av tekster og resultater, sletting |
| Minnevers | Kort rim for pugging, eller en ferdig prompt til et eksternt musikkverktøy |

### Ønskelig om tiden holder

Ingen. Mapper sto tidligere her, men ble tatt ut 27. september for å gi plass til bildeinnlesing: en stor del av målgruppen har papirbok eller nettbok uten brukbar kopiering, og uten en bildeinngang kan de ikke bruke appen i det hele tatt. Mapper er additiv, bildeinnlesing er eksistensiell. Uken mellom M1 og kodefrys er satt av til stabilisering og slakk i stedet for til nye funksjoner.

### Utenfor omfanget

Innlesing fra URL, tekstgjenkjenning av hele innskannede bøker, talebasert fagsamtale, eksport til Kahoot eller Blooket, lærerdashbord, Feide-innlogging, mapper med samlet quiz, og diagnostikk på tvers av økter over tid. Alle er utsatt av omfangshensyn eller fordi de krever brukshistorikk som ikke finnes i v1.

## 5. Planlagt teknisk arkitektur

| Lag | Valg | Begrunnelse |
|---|---|---|
| Rammeverk | Next.js med TypeScript | Én kodebase for grensesnitt og serverendepunkter, filbasert ruting som passer den stegvise leseløypen, og et komponentøkosystem som gjør lesevisningen — prosjektets viktigste flate — raskere å få god |
| Database | PostgreSQL | Relasjonsmodellen passer datastrukturen: bruker → tekst → begreper, quiz, samtaler, øvekortmerking |
| KI-integrasjon | LLM-API med strukturert utdata (skjema) | Strukturert utdata er en forutsetning for kvalitetssikringen: kildeavsnitt og begrepsforekomst kan valideres programmatisk framfor å tolkes ut av fritekst |
| PDF-uttrekk | Bibliotek for tekstlagsuttrekk | Dekker digitalt produserte PDF-er. Skannede PDF-er uten tekstlag avvises med en forklaring framfor å gi tom tekst |
| Bildeuttrekk | Samme multimodale modell som resten av appen | Ett API-kall med en bildeblokk, ikke en separat tekstgjenkjenningsmotor. Uttrekket er ikke kvalitetssikret i v1, og gjennomsynssteget er sikkerhetsnettet |
| Drift | Skyhosting med automatisk utrulling fra Git | Holder oppsettet lett for én utvikler |

**To arkitektoniske prinsipper går gjennom hele løsningen:**

**Alt generert innhold har et kildeavsnitt.** Forklaringer, quizspørsmål, samtalespørsmål og oppsummeringer peker alle tilbake til et bestemt avsnitt i teksten. Kravet er ikke kosmetisk: klarer ikke en generator å oppgi kildeavsnitt, er utdataet ikke gyldig. Det er dette som gjør at appen ikke kan påstå noe om teksten som ikke står der.

**Lagring framfor regenerering.** Genererte elementer lagres ved første generering og gjenbrukes. Det gir stabilitet — øvekortene er de samme neste uke — og holder API-kostnaden nede.

Detaljerte valg hører i løsningsarkitekturen; tabellen over er utgangspunktet.

## 6. Datakrav

**Lagres:** e-post og passord (hashet), elevens tekster i både rå og redigert form, utvunne begreper, quizer med resultater, fagsamtaler, øvekortmerking og språkvalg.

**Lagres ikke:** navn, skole, klasse, alder eller fødselsdato. Ingen tredjeparts sporing eller analyse.

**Behandling utenfor appen:** teksten eleven legger inn sendes til en ekstern språkmodell-leverandør. Appen opplyser om dette før første innsending.

**Personvern og opphavsrett:** brukergruppen er i hovedsak mindreårige, og teksten eleven limer inn er ofte opphavsrettslig beskyttet lærebokstoff. Innhold er derfor privat for kontoen som eier det, det finnes ingen delingsfunksjon i v1, og sletting av konto sletter alt tilhørende innhold. Testbrukere er myndige elever eller deltar med samtykke. Reell klasseromsbruk med elevdata ligger utenfor v1 og ville krevd databehandleravtale.

**Krav til leverandøren.** Kravet er formulert leverandøruavhengig, fordi det er en egenskap ved avtalen og ikke ved merkenavnet: inndata skal ikke brukes til å trene modeller, behandlingsstedet skal være kjent og nedskrevet, og vilkårene skal være lest og datert i rapporten. Appen tar imot opphavsrettsbeskyttet lærebokstoff, og forskjellen mellom at en kopi passerer gjennom en databehandler og at innholdet havner i et treningssett er en forskjell i art, ikke i grad.

**Bilder lagres ikke.** Bilder eleven laster opp beholdes ikke etter at uttrekket er godkjent — det er den uttrukne teksten som bevares. Metadata fjernes før bildet sendes videre.

**Ingen korpusbygging.** Elevenes tekster slås aldri sammen til et delt datasett, verken for analyse, for å forbedre prompter eller for testsett. Testsettene består av tekster utvikleren selv har skaffet og annotert.

## 7. Brukerhistorier

1. Som elev kan jeg lime inn eller laste opp en fagtekst og se hva appen faktisk leste, slik at jeg kan rette opp i feil før jeg jobber med den.
2. Som elev kan jeg se tekstens overskrifter og skrive hva jeg tror den handler om, før jeg får se brødteksten.
3. Som elev kan jeg lese teksten med fagbegrepene markert og få forklaringen uten å forlate siden.
4. Som elev kan jeg ta en quiz og for hvert feil svar se hvilket avsnitt det riktige svaret sto i.
5. Som elev kan jeg forklare stoffet med egne ord i en skriftlig fagsamtale og få et oppfølgingsspørsmål som reagerer på det jeg faktisk skrev.
6. Som elev med et annet morsmål kan jeg få aktiveringssiden og oppsummeringen på morsmålet mitt, med norsk ved siden av og det norske fagordet i parentes.
7. Som elev kan jeg repetere fagbegrepene med øvekort og merke hva jeg må øve mer på.
8. Som elev kan jeg finne igjen tidligere tekster og resultater, og slette det jeg ikke vil beholde.

## 8. Tekniske og praktiske rammer

- **Én utvikler, om lag ti arbeidsuker** fra 25. september til kodefrys 27. november.
- **API-budsjett i størrelsesorden 300–600 kroner**, av egen lomme. Styrer flere designvalg: lagring framfor regenerering, tak på tekstlengde (8 000 tegn), tak på antall bilder og tak på samtalelengde.
- **Tidsbruk er den bindende ressursen, ikke kroner.** Kvalitetssikringen krever manuell annotering av testsett, og de timene står i planen.
- **Ingen tekstgjenkjenning av hele bøker, ingen Feide, ingen institusjonell drift.** Bildeinngangen tar inntil fire sider.

## 9. Bruk og kvalitetssikring av KI

Prosjektet bruker KI på to nivåer, og dokumenterer begge.

**I utviklingen.** En løpende KI-logg i repoet registrerer hva som ble bedt om, hvilket verktøy og hvilken modell, hva som kom tilbake, og hva som ble godtatt, endret eller forkastet — med begrunnelse. Loggen er startet, og har per 25. september fem oppføringer der KI-forslaget ble forkastet eller vesentlig endret. Koden kvalitetssikres gjennom versjonskontroll fra start, automatiserte tester for de maskinsjekkbare kravene, og linje-for-linje-gjennomgang av innlogging, lagring og sletting.

**I appen under kjøring.** Her gjelder prosjektets bærende regel: **ingen kvalitetspåstand teller uten måling mot et fast testsett.** En språkmodells egen vurdering av eget utdata regnes ikke som dokumentasjon. Fem områder har derfor hvert sitt manuelt annoterte testsett med tallfestede terskler:

| Område | Testsett | Hovedmål |
|---|---|---|
| Uttrekk av fagbegreper | 6 tekster, 3 fellesfag × 2 programområder | Presisjon ≥ 0,70, gjenkalling ≥ 0,75, null faglig gale forklaringer |
| Quizgenerering | 24 spørsmål | ≥ 85 % forankret i teksten, null spørsmål som krever kunnskap utenfra |
| Fagsamtale | 36 tilfeller, alle fem svartilstander | Null misoppfatninger lest som dekkende (blokkerende), binær gjenkalling ≥ 0,90 |
| Oversettelse | 4 tekster på ukrainsk | Begrepsanker ≥ 0,95, ekstern vurdering av morsmålsbruker |
| Minnevers | 10 vers | Null usanne påstander i det som vises eleven |

Testsettene er små med vilje. En terskel som krever flere tilfeller enn én student har timer til å annotere, blir ikke målt — og et tall uten måling bak er verdiløst i en rapport. Der utvalget er for lite til å bære en bestått/ikke bestått-grense, rapporteres resultatet med konfidensintervall i stedet, og det sies at det er en indikasjon og ikke et bevis.

## 10. Gjennomførbarhet og milepæler

Omfanget er delt i tre nivåer, der hvert nivå er en tilstand prosjektet kan leveres i. Det er en kuttrekkefølge, ikke en ønskeliste.

| Milepæl | Dato | Innhold |
|---|---|---|
| **M0** | 30. oktober | Innliming med gjennomsyn, hele kjerneløypen, fagsamtale i full form, konto og lagring, første måling av begrepsuttrekket |
| **M1** | 20. november | PDF med sju navngitte feiltilstander og tester, øvekort, morsmålsstøtte med måling, minnevers, tilgjengelighet, alle testsett målt |
| **Stabilisering** | 20.–27. november | Slakk, feilretting og mobiltesting. Ingen nye funksjoner — Mapper er ute av v1, og uken er buffer framfor tomrom |
| **Kodefrys** | 27. november | Satt som git-tag. Ingen ny funksjonalitet etter dette |
| **Dokumentasjon** | 28. nov – 5. des | Refleksjonsrapport og ferdigstilling av dokumentasjonen |

Åtte dager er satt av til dokumentasjon alene, fordi refleksjonsrapporten teller 30 prosent og kodedokumentasjonen inngår i de resterende 70. Vinduet skal brukes til å skrive, ikke til å rekonstruere: målingene og KI-loggen føres underveis.

**Ferdig-test.** Et nivå regnes som ferdig når en nedskrevet demoløype på fjorten steg kjører gjennom på tom database, tre ganger etter hverandre, uten inngrep. Løypen dekker konto, innlesing, hele kjerneløypen, fagsamtale, morsmål med høyre-til-venstre-visning, en PDF-feiltilstand, og mobilvisning.

## 11. Suksesskriterier

1. Demoløypen går gjennom tre ganger på rad på tom database.
2. Begrepsuttrekket holder presisjons- og gjenkallingsmålene, og ingen faglig gale forklaringer vises eleven.
3. Fagsamtalen består sikkerhetsporten: null misoppfatninger klassifisert som dekkende.
4. Oversettelsen til ukrainsk består begrepsankeret og er vurdert av en morsmålsbruker.
5. Alle sju PDF-feiltilstander og alle fem bildefeiltilstander har en reproduserbar test som viser melding og tilgjengelig neste handling — ingen feil ender i en blindvei.
6. En elev med papirbok kommer gjennom hele løypen via bildeinngangen. Ikke en kvalitetspåstand om uttrekket, men et krav om at veien finnes og virker ende til ende.
7. Dokumentasjonen er komplett: KI-logg, promptregister med måletall per versjon, testsett i repoet med kjørbar måling, dokumentert kodegjennomgang, drøfting av eierskap og skjevhet, og en refleksjon som bruker de faktiske tallene.

## 12. Grunnlagsdokumenter

Detaljerte krav finnes i repoet under `_bmad-output/planning-artifacts/`:

- `product-brief-lesevenn.md` — produktbrief
- `prd-lesevenn.md` — kravspesifikasjon, 43 funksjonskrav med testbare konsekvenser
- `addendum-lesevenn.md` — emnekontekst, teknologivurderinger, forkastede alternativer
- `ki-logg.md` — løpende logg over KI-bruk i utviklingen
- `underlag-refleksjonsrapport.md` — råstoff til refleksjonsrapporten
