---
title: Avstemming — product brief mot PRD (Lesevenn)
status: draft
created: 2026-09-25
input: product-brief-lesevenn.md
target: prd-lesevenn.md (+ addendum-lesevenn.md)
---

# Avstemming: hva briefen har som PRD-en mistet eller vridde

Metode: briefen lest som kilde, PRD-en som derivat. Addendumet regnes som gyldig hjem for
innhold — der noe fra briefen er gjenfunnet i addendumet, er det notert som «plassert», ikke
som gap. Hvert funn er merket med alvorlighet og med om endringen ser bevisst ut eller ser ut
som drift.

Sammendrag av dekningsgrad: briefens **Med i v1**-liste er dekket punkt for punkt av FR-er
(ingen tapte funksjoner). Briefens **Eksplisitt utenfor v1** er ekskludert i sin helhet, men to
punkter er ekskludert på annet grunnlag. De reelle tapene ligger i det kvalitative laget og i
sporbarheten fra briefens suksess-kriterier og visjon.

---

## A. Kvalitativt innhold som FR-strukturen droppet

### A1. Den pedagogiske hjemmelen er borte som påstand og finnes ikke som krav — HØY, drift

Briefen bærer differensieringen på to ord:

> «en **anerkjent** lesestrategi for å bygge forforståelse før man går løs på selve teksten»
> «å forankre bruken av den i en **etablert** lesepedagogisk struktur»

Ordene «anerkjent», «etablert» og «lesepedagogisk» forekommer **ikke én gang** i PRD-en, og
ikke i addendumet. PRD §1 gjengir sekvensen som «rekkefølgen en leselærer ville brukt» — altså
som utviklerens eget skjønn, ikke som forankring i et fagfelt.

Konsekvens: PRD-en har 44 FR-er, fem Gullsett og ti suksessmål for om appen *virker*, og ingen
krav i det hele tatt om at den pedagogiske strukturen er *hjemlet* noe sted. Ingen FR, ingen
åpen sak, ingen antakelse krever at strategien navngis eller kildefestes. Det er alvorlig fordi
briefen selv sier at bidraget *ikke* ligger i KI-kapabiliteten — det ligger nettopp i
forankringen. Fjernes forankringen som verifiserbar påstand, står prosjektet igjen med det
briefen kaller «Enkelt»-forslaget pluss god utførelse.

Anbefalt hjem: et krav i §4.11 eller et åpent punkt i §11 om at aktiveringssteget, inline-
markeringen og dialogtesten hver knyttes til navngitt lesepedagogisk litteratur i
refleksjonsrapporten — der kildebruk faktisk vurderes.

### A2. Briefens ærlighetsregister om «Enkelt»-klassifiseringen er helt borte — HØY, drift

Briefen åpner konkurransekapitlet med en innrømmelse som ingen andre enn forfatteren ville
skrevet:

> «Det ærlige utgangspunktet: å generere sammendrag og quiz fra opplastede notater er ikke en
> ny idé — det er nettopp beskrevet som et **"Enkelt" forslag i emnets egen prosjektliste**.»

og lukker det med:

> «Hva dette ikke er: det finnes ingen proprietær modell eller hemmelig metode her —
> byggeklossene er offentlig tilgjengelige LLM-API-er. Fordelen ligger i den gjennomtenkte
> sammensetningen rundt en reell pedagogisk arbeidsflyt, og i utførelsen — ikke i teknologien i
> seg selv.»

Ingen av disse finnes i PRD-en eller addendumet. «Enkelt»-klassifiseringen er den *eneste*
førstehåndsopplysningen briefen har om hvordan emnet rangerer vanskelighetsgrad — og PRD §9.3
behandler samtidig vanskelighetsgrad som en usikker annenhåndsantakelse:

> «`[ANTAKELSE: at omfang og vanskelighetsgrad vektlegges, bygger på materiale fra emnets
> tidligere gjennomføring og er ikke publisert 2026-policy.]`» (antakelse 9)

Det er en vridning med praktisk konsekvens: briefen vet at grunnideen er ratet Enkelt av emnet
selv, PRD-en har glemt det, og PRD §9.3 setter derfor **Mapper først og Minnevers deretter** på
kuttlista — nøyaktig de to funksjonene som løfter prosjektet over Enkelt-nivået. Kuttrekkefølgen
er begrunnet i at funksjonene er additive for pedagogikken, men er ikke prøvd mot briefens eget
varsel om vurderingsrisiko.

### A3. Briefens diagnostiske trekant — ordforråd / sammenheng / resonnement — har ikke noe hjem — HØY, drift

Briefens problemkapittel ender i et spørsmål som er hele rasjonalet for en dialog framfor en quiz:

> «læreren har begrenset innsikt i *hvor* forståelsen svikter — var det **ordforrådet,
> sammenhengen, eller selve resonnementet**?»

Ordene «ordforråd» og «resonnement» finnes ikke i PRD-en. Svarvurderingens fem tilstander
(Dekkende, Delvis, Misoppfatning, Uklart, Utenfor) klassifiserer **kvaliteten på svaret**, ikke
**hvilket lag av forståelsen som sviktet**. Ingen av de fem kan besvare briefens spørsmål: en
«Misoppfatning» sier ikke om den skyldtes et ukjent fagord, en mistet tekstsammenheng eller en
feilslutning.

PRD §7 stenger i tillegg døren eksplisitt («ingen diagnose, ingen profil av hva eleven er svak
i»), noe som er en forsvarlig v1-avgrensning — briefen legger selv diagnostikk *på tvers av
økter* utenfor v1. Men briefen etterspurte ikke diagnostikk på tvers av økter her; den
etterspurte innsikt i hvor det svikter *i én tekst*. Den varianten er verken levert, avvist
eller notert som utsatt. Den forsvant.

Minimumsrettelse: enten et felt på Svarvurderingen som skiller ordforråd/sammenheng/resonnement,
eller en eksplisitt linje i §7 om at briefens spørsmål bevisst ikke besvares i v1, med begrunnelse.

### A4. «Elever gir opp før de har lest ferdig» — emosjonell kjerne uten metrikk — MIDDELS/HØY, drift

> «Resultatet er at elever som strever, ofte **gir opp før de har lest ferdig**»

Dette er briefens beskrivelse av selve feiltilstanden produktet finnes for å hindre. PRD-en har
gode enkeltspor av den: FR-6 («Steget skal ikke bli en sperre for den eleven som allerede synes
dette er vanskelig»), FR-29 (oversettelsesfeil stopper aldri løypen), §5 «Ingen blindveier».
Sporene er ekte og godt formulert.

Men **ingen suksessmetrikk måler frafall eller fullføring for en reell bruker.** SM-1 er
utviklerens egen demoløype. SM-10 er én frivillig som fullfører «uten instruksjon», og kravet er
at «friksjonspunktene skrives ned» — altså registrering, ikke terskel. Briefens sentrale
feiltilstand er dermed den ene ting prosjektet ikke kan påvise noe om.

Skjerpende: PRD-en **legger til** friksjon som briefen ikke ba om (FR-3, obligatorisk gjennomsyn
som ikke kan hoppes over, også for innlimt tekst) og eier risikoen ærlig i antakelse 2 og åpent
punkt 6 — men briefens motstående krav («uten friksjon», se D1) er ikke sitert noe sted i den
avveiningen.

### A5. Gjennomførbarhetsargumentet og «mye skjermflate» er delvis borte — MIDDELS, dels plassert

> «Det som gjør dette realistisk å bygge alene i løpet av et semester, er at nesten hele
> funksjonssettet er kjernebruk av språkmodeller ... et renere KI-prosjekt enn et som krever en
> egen matematisk løsermotor ved siden av — og gir samtidig **mye skjermflate til å vise fram
> gjennomtenkt design og brukeropplevelse, som er en del av det som vurderes i IBE160**.»

To ting mangler:

1. **Solo-gjennomførbarhetsargumentet** («ingen egen løsermotor») finnes ikke. Det betyr ikke
   mye alene, men det er argumentet som ville besvart PRD §11 punkt 2 — det blokkerende
   spørsmålet om solobygg mot gruppekrav på 4 ± 1. Briefen har halve svaret liggende; PRD-ens
   mest alvorlige åpne punkt har det ikke.
2. **Påstanden om at design og brukeropplevelse vurderes.** Ordet «brukeropplevelse» finnes ikke
   i PRD-en. PRD §0 gjengir vurderingen som 70 % kode/funksjonalitet + 30 % refleksjon og nevner
   ingen designdimensjon. Påstanden lever videre bare i addendum §3 («lesevisningen ... er den
   flaten mest av vurderingsverdien ligger i») — altså i dokumentet som *ikke* er krav.
   Resultatet: PRD §10 har ti suksessmål, og **ingen av dem måler kvaliteten på opplevelsen.**
   SM-9 måler at mobil virker; §5 stiller lesbarhets- og tilgjengelighetskrav. Ingenting måler
   det briefen mente skulle vises fram.

### A6. «Sang» ble «Minnevers» — tonetap, bevisst — LAV, bevisst

Briefen kaller funksjonen «**Sang/rim for pugging**» og målet «å få en faktisk sang». PRD-en
døper den «Minnevers» og ordet «sang» forekommer ikke. Funksjonaliteten er intakt (FR-30 beholder
Suno-prompten), og navnebyttet er konsistent med ordlistedisiplinen i §3. Men registeret —
briefen kaller dette «det morsomme» og bruker et elevord — er strøket i favør av et
dokumentbegrep. Verdt en linje i UX-spesifikasjonen: overfor eleven bør flaten trolig hete noe
nærmere «sang», ikke «Minnevers».

### A7. «Forstå **og huske**» — huske-halvdelen er svakt representert — LAV/MIDDELS, drift

Briefens første setning: «hjelper elever med å forstå **og huske** fagtekst». Huske-siden er
begrunnelsen for Øvekort, Minnevers og mapper. PRD-en dekker mekanikken (FR-17 lar en ny økt
starte der forrige sluttet), men har ingen krav eller metrikk som berører retensjon i det hele
tatt — ingen repetisjonsintervaller, ingen gjensjekk over tid. Forsvarlig for v1, men briefens
verb «huske» er uten mål.

---

## B. Briefens «Med i v1», punkt for punkt

| # | Brief-punkt | PRD-hjem | Status |
|---|---|---|---|
| 1 | Tekst- og PDF-innlesing | FR-1, FR-2 | Dekket, kraftig utvidet (FR-3, FR-4, sju feiltilstander) |
| 2 | Aktiveringsside med overskrifter og forkunnskaps-spørsmål | FR-5, FR-6 | Dekket |
| 3 | Lesevisning med fremhevede **nøkkelord** | FR-7, FR-9, FR-10 | **Delvis — se B-merknad 1** |
| 4 | Quiz generert fra teksten | FR-13, FR-14, FR-15 | Dekket, utvidet med forankringskrav |
| 5 | Øvekort basert på nøkkelord/faguttrykk | FR-16, FR-17 | **Delvis — samme innsnevring som #3** |
| 6 | Skriftlig fagsamtale med oppfølgingsspørsmål basert på elevens svar | FR-18–FR-23 | Dekket, kraftig utvidet og målsatt |
| 7 | Minnevers/rim eller ferdig Suno-prompt | FR-30, FR-31 | Dekket |
| 8 | Ett morsmål-støttepunkt: aktivering + oppsummering på morsmål, samt utpeking av språklige bilder/fagbegreper | FR-24–FR-29 | Dekket, **utvidet utover briefen — se D3** |
| 9 | Mappestruktur med samlet quiz/fagsamtale | FR-32–FR-34 | Dekket, men **satt først på kuttlista — se D2** |
| 10 | Enkel brukerkonto med lagring av tidligere tekster og resultater | FR-35–FR-37 | Dekket, utvidet med sletting |

**Ingen av briefens v1-punkter mangler et FR.** Dekningen på funksjonsnivå er komplett.

### B-merknad 1 — «nøkkelord» ble stille redusert til «Faguttrykk» — HØY, bevisst men uerklært

Briefen bruker konsekvent **to** kategorier, fem steder: «sentrale faguttrykk **og** nøkkelord er
fremhevet inline», «**Nøkkelordene og** faguttrykkene ... gjenbrukes til øvekort», «Lesevisning
med fremhevede **nøkkelord**», «Øvekort basert på **nøkkelord**/faguttrykk», og i
suksess-kriteriene «**Nøkkelord og** faguttrykk identifiseres presist».

PRD §3 definerer bare én kategori, og ekskluderer den andre eksplisitt:

> «**Faguttrykk** — ... Ikke allment akademisk språk («faktor», «prosess», «utvikling»), ikke
> egennavn med mindre de bærer argumentet, ikke tall eller datoer.»

Et *nøkkelord* i briefens forstand — et ord som bærer tekstens mening, som gjerne kan være
allment akademisk eller et egennavn — er dermed definert ut av produktet. PRD-en beholder
briefens vokabular bare i navnet på metrikken («SM-2: **Nøkkelorduttrekk** holder målet», og
«nøkkelorduttrekking er presis» i §4.3), som måler noe smalere enn navnet lover.

Innsnevringen er godt begrunnet *implisitt* — «Faguttrykk» er målbart, «nøkkelord» er ikke — og
tetthetstaket i FR-9 forutsetter en smal definisjon. Men PRD-en sier ingen sted at den har
innsnevret briefen, og konsekvensen er reell: en elev som stopper på «tektonisk» får hjelp, en
elev med norsk som andrespråk som stopper på «faktor» eller «forutsetning» får ikke. Det er
nettopp den eleven §4.7 finnes for. FR-27 fanger metaforer og idiomer, men eksplisitt ikke
allment akademisk språk.

Anbefalt: enten døp SM-2 og §4.3 om til «Faguttrykksuttrekk» for å fjerne løftet briefen ga,
eller legg til et tredje, lite sett for allmennakademiske ord som rammer andrespråkslesere —
med eget, lavt tak.

---

## C. Briefens «Eksplisitt utenfor v1» mot PRD-ens ekskluderinger

| Brief-punkt | Briefens grunnlag | PRD-hjem | Vurdering |
|---|---|---|---|
| Innlesing fra URL og bilde/OCR | «start med tekst og PDF» | §8.2, §7, FR-4 «Utenfor dette FR-et», PF-1 sier det til eleven | Ekskludert, grunnlag utvidet (OCR = egen kvalitetskjede). Forbedring |
| Stemmebasert fagsamtale | ingen grunn gitt | §8.2 med `[MERKNAD]`, addendum §5 punkt 1 | Ekskludert, grunnlag tilført. Forbedring |
| CSV-eksport til Kahoot/Blooket | ingen grunn gitt | §8.2, §7 | Ekskludert. **Annet grunnlag** — se C1 |
| Personalisert diagnostikk på tvers av økter og fag | «krever reell brukshistorikk over tid for å bli troverdig» | §8.2, §7, addendum §5 punkt 5 | Ekskludert på **samme** grunnlag, skarpere formulert («Utsatt av troverdighetsgrunner, ikke av tidsgrunner»). Beste avstemmingen i paret |
| Full morsmålsstøtte i alle funksjoner | «kun aktivering + oppsummering i v1» — en omfangsgrense | §8.2, §7, §6.1, FR-25 | Ekskludert på **annet grunnlag** — se C2 |
| Eget lærerdashbord for hele klasser | ingen grunn gitt | §8.2, §2.2, §7, addendum §5 punkt 4 | Ekskludert, grunnlag tilført. Forbedring |

Briefens avsluttende forbehold — «Disse er **utsatt, ikke forkastet** — flere av dem er naturlige
neste steg dersom prosjektet videreføres» — har ingen motsvarighet i PRD §8.2. PRD §7 Ikke-mål
er formulert som varig doktrine: «Lesevenn **er ikke** en oversetter», «Lesevenn **vurderer
ikke** elever». Utsatt-karakteren er gjenfunnet i addendum §5 (prioritert videreføringsliste),
så innholdet er plassert — men tempus er endret fra «ennå ikke» til «ikke». LAV, men det er en
ubevisst innstramming.

### C1. Kahoot/Blooket ekskludert på et grunnlag briefen motsier — LAV, drift

PRD §8.2: CSV-eksport «gir ingen verdi for eleven alene». Briefens visjon sier det motsatte om
hvem den er for: eksportene hører sammen med lærerdashbordet, «**koblet mot ferdig formaterte
Kahoot/Blooket-eksporter for felles repetisjon**» — altså verdi for *klassen*, via læreren, ikke
for eleven alene. PRD-ens begrunnelse måler funksjonen mot feil bruker og gjør den derfor lettere
å avskrive enn den er. Utfallet er likt, resonnementet er ikke.

### C2. Morsmålsgrensen ble gjort om fra omfangsgrense til pedagogisk doktrine — HØY, bevisst og forsvarlig, men med konsekvenser

Briefen: «Full morsmålsstøtte i absolutt alle funksjoner (**kun aktivering + oppsummering i
v1**)» — plassert i utenfor-v1-lista som en kapasitetsgrense, sammen med det som skal komme
senere.

PRD-en gjør samme grense til et prinsipp, i fem lag:
- §8.2: «Quiz, fagsamtale og øvekort er på norsk i v1. **Bevisst: eleven skal øve på norsk fagspråk.**»
- §4.7: «Morsmålet er **additivt, aldri erstattende**»
- §6.1: «Målet er tilgang til norsk fagspråk, ikke omvei rundt det»
- §7: «Lesevenn er ikke en oversetter»
- FR-25 gjør det maskinsjekkbart, og addendum §4 forkaster erstattende visning eksplisitt

Oppgraderingen fra grense til prinsipp er godt argumentert og gjør produktet skarpere — dette er
en reell forbedring av briefen, ikke drift. To forbehold:

1. Addendum §5 punkt 2 innrømmer at full morsmålsstøtte «krever en pedagogisk avklaring først ...
   skal eleven kunne svare på morsmål, og hva tester man da?» Altså: prinsippet er *ikke* avklart,
   men PRD-en fremstiller det som avklart. Prinsippet gjør en senere utvidelse — som briefen
   regner som «utsatt, ikke forkastet» — til et prinsippbrudd.
2. Briefen forankret grensen i kapasitet. PRD-en har ingen setning som sier at grensen *også* er
   en kapasitetsgrense. Den ærligste formuleringen er begge: prinsipp nå, kapasitet uansett.

---

## D. Påstander PRD-en motsier eller stille svekket

### D1. Briefens «uten friksjon» er ikke sitert, og PRD-en legger til friksjon — HØY, bevisst men uavstemt

Briefens funksjonelle suksess-kriterium, ordrett:

> «En elev kan lime inn eller laste opp en tekst og gå gjennom hele sekvensen ... **uten friksjon**.»

Ordet «friksjon» finnes fire steder i PRD-en, og alle fire handler om friksjon PRD-en *legger
til* eller er bekymret for: FR-3 «friksjonen er verdt det», SM-10 «friksjonspunktene skrives
ned», åpent punkt 6 «ekstra friksjon rett foran den eleven som strever mest», antakelse 2. Ingen
av dem gjengir briefens krav som et krav.

Dette er en ekte, bevisst og godt begrunnet motsetning — FR-3 finnes fordi flerspaltet PDF-tekst
i feil rekkefølge ellers forgifter hele løypen (addendum §4 gjør forkastelsen av alternativet
grundig). Men avveiningen er gjort **uten** å sette briefens krav på bordet, og resultatet er at
«uten friksjon» ikke har noen målbar motpart i §10. Anbefalt: skriv briefens krav inn i åpent
punkt 6, og gi SM-10 en terskel (f.eks. testbrukeren fullfører uten at utvikleren griper inn, og
gjennomsynssteget er ikke blant de nedskrevne friksjonspunktene).

### D2. Et brief-suksesskriterium står på PRD-ens kuttliste — HØY, drift

Briefen, i **Suksess-kriterier → Funksjonelt**:

> «**Flere tekster kan samles i en mappe og gi én samlet quiz eller fagsamtale for hele mappen.**»

Dette er ikke et v1-ønske i briefen; det er en betingelse for at prosjektet er lykkes.

PRD §9.3: «Kuttes i denne rekkefølgen dersom tiden ikke holder: **Mapper først**, deretter
Minnevers.» PRD §4.9: «Funksjonen er den første som kuttes ved tidsnød.» PRD §9.5 steg 10:
«*(Bortfaller om Mapper er kuttet.)*»

Og avgjørende: **ingen av de ti suksessmålene i §10 dekker Mapper.** SM-1 valideres av en
demoløype der mappesteget kan bortfalle. Det betyr at PRD-en kan rapportere full måloppnåelse på
samtlige ti metrikker i en tilstand der et av briefens to funksjonelle suksesskriterier er
ubesvart. Det er den skarpeste motsetningen i paret.

Det er ikke nødvendigvis feil å kutte Mapper — argumentet i §4.9 og §9.3 (funksjonen er additiv,
det pedagogiske argumentet i §1 står uten den) er holdbart. Feilen er at nedgraderingen fra
suksesskriterium til kuttkandidat skjer **uten å være nevnt**. Minimumsrettelse: en setning i
§9.3 som sier at kutt av Mapper innebærer at briefen ikke innfris fullt ut, og en eksplisitt
beslutning om at det aksepteres.

### D3. Morsmålsterskelen gikk fra «minst ett språk» til tre — MIDDELS, drift i skjerpende retning

Briefen, **Suksess-kriterier → Teknisk**:

> «Morsmåls-oversettelsen er faglig presis og forståelig for **minst ett støttet språk**.»

PRD SM-4: «Oversettelsen er faglig presis i **de tre språkene**» — ukrainsk, arabisk og polsk,
hver med et Gullsett på ti Tekster (FR-28), maskinell bevaringssjekk, tilbakeoversettelse *og*
ekstern stikkprøve fra morsmålsbruker eller uavhengig verktøy for minst tre tekster per språk.

Det er tre ganger briefens minstekrav, pluss et eksternt avhengighetsledd som PRD-en selv
identifiserer som usikkert: åpent punkt 4 og antakelse 4 («Finnes en morsmålsbruker eller et
akseptabelt uavhengig verktøy for ukrainsk, arabisk og polsk? Uten kontroll må språket flyttes
til Modellstøttet»), og FR-28 har utveien innebygd. Nivåmekanikken er elegant og ærlig.

Men: dette er den eneste terskelen i PRD-en som er hevet *over* briefen, i et prosjekt med ti
arbeidsuker, én utvikler og åpent punkt 2 som kan velte hele premisset. Briefen ga eksplisitt
tillatelse til å nøye seg med ett. Anbefalt: behold tre som ambisjon, men skriv inn at **ett**
kvalitetssikret språk er nedre grense for måloppnåelse mot briefen, slik at nedskalering er en
planlagt bevegelse og ikke et brudd.

### D4. «Forståelig» forsvant fra oversettelseskravet — MIDDELS, drift

Briefen krever at oversettelsen er «faglig presis **og forståelig**». FR-28 måler tre ting:
bevaring av fagbegrep (maskinelt), motsigelser ved tilbakeoversettelse (null), og ekstern
stikkprøve. **Ingen** av de tre måler om en elev på ungdomstrinnet forstår teksten. En
oversettelse kan bevare 100 % av fagbegrepene, tåle tilbakeoversettelse og likevel være skrevet
i et register en 15-åring ikke kommer gjennom. Sammenlign med FR-7, som *har* dette kravet for
norsk («en forklaring på maksimalt to setninger, skrevet for ungdomstrinnet») — kravet finnes,
det er bare ikke videreført til morsmålssiden. Enkel rettelse: legg lesenivå til stikkprøvens
mandat i FR-28.

### D5. Læreren gikk fra sekundær bruker til ikke-bruker — LAV/MIDDELS, bevisst

Briefen: «**Sekundær bruker:** læreren, som får et verktøy elevene kan bruke selvstendig.»
PRD §2.2: «Læreren er en **talsperson** i v1, **ikke en bruker**.»

Substansielt er dette samme sted — briefen ga læreren ingen funksjoner. Reklassifiseringen er
ærligere. Men to ting følger: PRD §2.1 reduserer lærerens «jobb som skal gjøres» til ett
kulepunkt, og ingen metrikk i §10 berører om en lærer faktisk ville anbefalt verktøyet. Sammen
med A3 (den diagnostiske trekanten) betyr det at briefens *andre* problembeskrivelse — lærerens
manglende innsikt — er uadressert i v1 uten at noe dokument sier det.

### D6. Fagsamtalen er «kjernen», men ligger utenfor Kjerneløypen og utenfor M0 — HØY, strukturell drift

Briefens hele differensieringsargument hviler på fagsamtalen: «ikke bare med en quiz, men ...»,
og visjonen: «at en skriftlig fagsamtale er en **mer troverdig forståelsestest** enn en ren
multiple-choice-quiz».

PRD-en er enig i teksten — §1: «Den siste delen er **kjernen**»; §4.6: «Prosjektets **sterkeste
påstand**» — men uenig i strukturen:

- §3 definerer **Kjerneløype** som Aktivering → Lesevisning → Quiz, og sier eksplisitt:
  «Fagsamtale, Øvekort, Minnevers og morsmålsstøtte henger på løypen, men **er ikke ledd i den**.»
- §9.1 M0 («må virke ... Uten dette finnes det ikke et produkt å vurdere») inneholder **ikke**
  Fagsamtale. Den kommer først i M1.

Konsekvensen er ikke hypotetisk: leveres M0, er det som finnes et verktøy som tar imot en tekst,
markerer ord og lager en quiz — altså presis den generiske «lim inn og få en oppsummering/quiz»-
kategorien briefen definerer seg *mot*, og som emnet ifølge briefen selv rangerer som «Enkelt».
PRD-en navngir ikke den risikoen noe sted.

Merk at PRD-ens ordliste også vender briefen i status, ikke i funksjon: FR-18 bevarer briefens
likestilling godt («Fagsamtale er tilgjengelig som alternativ til Quiz, ikke bare etter den»),
men §3 degraderer den til noe som «henger på» løypen.

Anbefalt: flytt minst en minimal Fagsamtale (FR-18, FR-19 uten full Gullsett-måling) inn i M0,
eller skriv inn i §9.1 at en M0-leveranse ikke innfrir briefens differensieringspåstand.

---

## E. Briefens suksess-kriterier → PRD-metrikk: sporbarhetstabell

| Brief-kriterium (ordrett kjerne) | PRD-metrikk | Sporbarhet |
|---|---|---|
| **Funksjonelt:** «gå gjennom hele sekvensen — aktivering, lesing med fremhevede nøkkelord, quiz, øvekort og fagsamtale — uten friksjon» | SM-1 (demoløype ×3, tom database), §9.5 steg 1–7 | Sekvensen: **god**. «Uten friksjon»: **ikke sporbar** — se D1. Ingen terskel for brukeropplevd friksjon |
| **Funksjonelt:** «Flere tekster kan samles i en mappe og gi én samlet quiz eller fagsamtale» | Ingen | **Ikke sporbar** — se D2. Kun §9.5 steg 10, som kan bortfalle |
| **Teknisk:** «Nøkkelord og faguttrykk identifiseres presist på tvers av ulike fagtekster» | SM-2 (gjenkalling ≥ 0,75, presisjon ≥ 0,70, rapportert **per fag**) + SM-C1 som motmetrikk | **Utmerket** på «på tvers av ulike fagtekster» — per fag-rapporteringen er en direkte og skarpere oppfyllelse. «Nøkkelord» derimot innsnevret, se B-merknad 1 |
| **Teknisk:** «Fagsamtalen stiller oppfølgingsspørsmål som faktisk reagerer på innholdet i elevens svar, ikke forhåndsdefinerte spørsmål i fast rekkefølge» | SM-3 (kontrafaktisk ≥ 90 %, relevans ≥ 80 %, klassifisering ≥ 75 % med forvekslingsmatrise), FR-21 | **Beste sporbarheten i hele paret.** PRD §4.6 siterer briefen ordrett og bygger den kontrafaktiske testen nettopp for å gjøre kriteriet umulig å bestå ved flaks |
| **Teknisk:** «Morsmåls-oversettelsen er faglig presis og forståelig for minst ett støttet språk» | SM-4 (tre språk) | Sporbar, men **terskelen er hevet** (D3), og «forståelig» er **ikke målt** (D4) |
| **Læringsmessig:** «dokumenterer tydelig hvordan KI er brukt i utviklingen» | SM-6, FR-38 (KI-logg, ≥ 5 forkastede forslag) | **Utmerket** |
| **Læringsmessig:** «hvordan KI-generert innhold (spørsmål, vurderinger, oversettelser) er kvalitetssikret» | SM-6, FR-39, FR-40, samt Gullsettene i FR-8/14/21/28/31 | **Utmerket**, og korrekt utvidet til også å dekke *koden* — PRD §0 og §4.11 dokumenterer hvorfor (2026-ordlyden sier «kvalitetssikret koden»). Reell forbedring av briefen |
| **Læringsmessig:** «en ærlig refleksjon om begrensningene ved å la en språkmodell vurdere en elevs muntlige/skriftlige forklaring» | FR-43, SM-6 | **Utmerket** — FR-43 navngir til og med den verste feilmåten (Misoppfatning lest som Dekkende) |
| **Visjon (kort sikt):** «vise at en lesestrategi-forankret KI-flyt faktisk hjelper elever ... bedre enn et generisk "lim inn og få et sammendrag"-verktøy, og at en skriftlig fagsamtale er en mer troverdig forståelsestest enn en ren multiple-choice-quiz» | Ingen | **Ikke sporbar — se E1** |

### E1. Briefens komparative visjonspåstand har ingen metrikk og ingen hjemmel — HØY, drift

Briefens korte-sikt-mål er formulert som et *bevisbyrdekrav*: «målet er å **vise at** ... bedre
enn ...» og «... **mer troverdig forståelsestest** enn en ren multiple-choice-quiz». Det er to
sammenligninger.

PRD-en gjentar begge som overbevisninger — §1: «Der et generisk KI-verktøy ... hopper rett til
produktet av lesingen»; «En flervalgsquiz kan bestås ved gjetting» — men **ingen FR og ingen
metrikk produserer noe belegg for sammenligningen**. SM-3 måler at fagsamtalen reagerer på
svaret; det er ikke det samme som at den er en mer troverdig forståelsestest enn quizen. Ingen
sammenligning, ingen baseline, ingen kvalitativ argumentasjon er pålagt — ikke engang i
refleksjonsrapporten (FR-43 drøfter *begrensningene* ved KI-vurdering, ikke overlegenheten over
quizen).

Dette er den eneste av briefens tre nivåer av suksesskriterier som ikke har noen motpart, og det
er nivået som bærer produktets grunn til å finnes. Kombinert med A1 (den pedagogiske hjemmelen er
borte) betyr det at PRD-en kan innfri alle ti suksessmål og fortsatt ikke ha vist det briefen
satte som kortsiktig mål.

Realistisk rettelse innenfor semesteret: krev i §4.11 eller FR-43 en kort, eksplisitt
argumentasjon som stiller de to forståelsestestene mot hverandre med prosjektets egne tall —
f.eks. andelen Misoppfatninger fagsamtalen fanget i Gullsettet mot hva en flervalgsquiz på samme
tekst ville skilt mellom. Det er ikke en effektstudie, men det er belegg framfor påstand.

---

## F. Det PRD-en gjorde bedre enn briefen (for balanse)

Avstemmingen skal ikke etterlate inntrykk av ensidig tap. PRD-en forbedrer briefen på minst
seks punkter, alle godt begrunnet:

1. **Kvalitetssikring av koden, ikke bare innholdet.** Briefen krever bare at KI-generert
   *innhold* er kvalitetssikret. PRD §0 og §4.11 leser 2026-ordlyden nøyaktig («kvalitetssikret
   **koden**») og legger til FR-41. Det er en korrekt lesing briefen bommet på.
2. **«Ingen kvalitetspåstand teller uten måling mot et fast testsett»** (§0) og motmetrikken
   SM-C4 — begge fraværende i briefen, og begge er det som gjør resten av dokumentet troverdig.
3. **FR-3 og de sju navngitte PDF-feiltilstandene.** Briefen sa bare «PDF-innlesing».
4. **Motmetrikkene SM-C1 til SM-C4.** Briefen har ingen. SM-C1 (flere markeringer er ikke bedre)
   er en reell pedagogisk innsikt briefen ikke hadde.
5. **Nivåskillet Kvalitetssikret/Modellstøttet språk.** Briefen hadde ingen mekanisme for å være
   ærlig om ujevn oversettelseskvalitet; FR-24 og FR-28 kobler nivået til målingen, ikke til
   ambisjonen.
6. **«Slippe skammen i å ikke forstå»** (§2.1) — den mest treffende setningen i hele paret, og
   den står bare i PRD-en. Den er et *tillegg* til briefens emosjonelle kjerne, ikke et tap.

---

## G. Prioritert rettelsesliste

1. **D2** — Mapper er et brief-suksesskriterium på kuttlista, uten noen suksessmetrikk. Enten løft
   inn i §10, eller erklær i §9.3 at kutt betyr delvis måloppnåelse mot briefen.
2. **E1** — Briefens komparative visjonspåstand («mer troverdig enn en quiz») har ingen metrikk.
   Legg kravet om belegg på FR-43.
3. **D6** — Fagsamtalen er «kjernen» men står utenfor både Kjerneløypen og M0. En M0-leveranse er
   det generiske verktøyet briefen definerer seg mot. Flytt minimal Fagsamtale til M0, eller
   navngi risikoen.
4. **A1 + A2** — Den pedagogiske hjemmelen («anerkjent», «etablert lesepedagogisk struktur») og
   «Enkelt»-innrømmelsen er begge borte. Førstnevnte trenger et krav; sistnevnte bør erstatte
   antakelse 9 som grunnlag for kuttrekkefølgen.
5. **B-merknad 1** — «nøkkelord» ble stille redusert til «Faguttrykk», med allment akademisk
   språk definert ut. Rammer nettopp andrespråkslesere. Døp om metrikken eller legg til et smalt
   tredje sett.
6. **A3** — Briefens ordforråd/sammenheng/resonnement-spørsmål har ikke noe hjem. Legg det på
   Svarvurderingen, eller avvis det eksplisitt i §7.
7. **D3 + D4** — Morsmålsterskelen er hevet fra ett til tre språk med et eksternt
   avhengighetsledd; «forståelig» er umålt. Skriv inn ett språk som nedre grense; legg lesenivå
   til stikkprøven.
8. **A4 + D1** — Briefens «uten friksjon» og «gir opp før de har lest ferdig» har ingen målbar
   motpart. Gi SM-10 en terskel.
9. **A5** — «Brukeropplevelse er en del av det som vurderes» lever bare i addendumet. Ingen av de
   ti suksessmålene måler kvaliteten på opplevelsen.
10. **C1** — Kahoot/Blooket avskrives med «ingen verdi for eleven alene»; briefen plasserte verdien
    hos klassen via læreren. Rett begrunnelsen.
