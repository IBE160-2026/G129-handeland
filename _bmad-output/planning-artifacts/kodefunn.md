---
title: Kodefunn — feil og svakheter i KI-generert kode
status: løpende
created: 2026-10-07
updated: 2026-10-07
krav: FR-41
---

# Kodefunn

FR-41 krever at **minst tre konkrete feil eller svakheter i KI-generert kode er
dokumentert med hvordan de ble funnet** — test, gjennomgang eller feilsøking i
drift. Denne fila er stedet de føres.

Nesten all koden i prosjektet er KI-generert og deretter gjennomgått, så
«KI-generert kode» er ikke en avgrenset del av repoet. Det som er verdt å
dokumentere er derfor ikke at det finnes feil, men **hvilke klasser av feil som
faktisk oppstod, og hva som avdekket dem**. Mønsteret er mer interessant enn
tellingen: ingen av funnene under ble oppdaget ved å lese koden og synes den
virket rar. Alle kom fra å kjøre noe, eller fra å følge en kallvei til ende.

Rekkefølgen er kronologisk.

---

## Funn 1 — Død kode i overskriftsgjenkjenningen

**Hvor:** `tekst/avsnittsdeling.ts`, funksjonen `erOverskrift`.

**Hva:** betingelsen `innhold.includes(" ") === false && innhold.length === 0`
kunne aldri være sann. En streng med lengde null inneholder ikke mellomrom, så
den første delen er alltid sann når den andre er det — og en tom streng var
allerede forkastet lenger opp. Hele leddet var uten virkning.

**Hvordan det ble funnet:** gjennomgang av koden etter at den var skrevet, med
spørsmålet «hvilke inndata treffer hver gren?».

**Hvorfor det er verdt å ha med:** feilen gjorde ingen skade, og det er nettopp
derfor den er lærerik. Død kode ser ut som et vern, så den neste som leser
funksjonen tror en sjekk finnes som ikke gjør det. Ingen test ville noensinne
fanget den, fordi det ikke finnes inndata som oppfører seg annerledes med eller
uten leddet.

**Hva som ble gjort:** leddet fjernet.

---

## Funn 2 — Feilhåndtering som skjulte årsaken

**Hvor:** `app/api/helse/route.ts`.

**Hva:** rutens `catch`-blokk returnerte en generisk feilmelding og forkastet den
underliggende feilen. Da databasetilkoblingen faktisk sviktet, sa helsesjekken
bare at noe var galt — ikke hva.

**Hvordan det ble funnet:** under feilsøking av en tilkobling som ikke virket.
Diagnosen måtte hentes ved å kjøre spørringen utenom ruten, fordi ruten selv
hadde kastet informasjonen.

**Hvorfor det er verdt å ha med:** koden gjorde det den var bedt om — å ikke
lekke interne detaljer til en utenforstående (§5, og samme hensyn som
`IkkeFunnet` i `data/tilgang.ts`). Men den skilte ikke mellom *svaret til
klienten* og *loggen til utvikleren*. Det er en reell avveining, ikke en
slurvefeil, og den typen er vanskeligere å se fordi koden ser forsvarlig ut.

**Hva som ble gjort:** årsaken logges på serversiden; svaret til klienten lekker
fortsatt ingenting.

---

## Funn 3 — En plassholder ingen fylte ut, og en test som beskyttet ingenting

**Hvor:** `prompts/faguttrykk/v1.md` og `generatorer/kontrakt.test.ts`.

**Hva:** promptfila inneholdt `{{AVSNITT}}`, der tekstens avsnitt skulle settes
inn. Ingen kode gjorde den innsettingen: `kjoerGenerator` sender prompten som
systemmelding og avsnittene som egen brukermelding. Plassholderen ble altså
sendt til modellen som bokstavelig tekst.

Verre: det fantes en test som sjekket at prompten inneholdt `{{AVSNITT}}`, med
kommentaren «uten den havner teksten aldri i prompten». Testen var grønn hele
tiden, og den beskyttet ingenting — den sjekket at en plassholder fantes, ikke
at noen brukte den.

**Hvordan det ble funnet:** ved å følge kallveien fra promptfil til modellkall
mens den første ekte generatoren ble skrevet. Ikke av noen test, og ikke av
gjennomgangene.

**Hvorfor det er verdt å ha med:** dette er den mest ubehagelige klassen i
loggen — **en grønn test som ga falsk trygghet**. Den hadde en begrunnelse i
kommentaren som var feil, og en feil begrunnelse i en bestått test er verre enn
ingen test, fordi den ser ut som dekning.

**Hva som ble gjort:** plassholderen fjernet; prompten beskriver nå formatet den
faktisk får, med et eksempel på merkelappene. Testen sjekker at beskrivelsen er
der og at ingen ubrukte plassholdere står igjen.

---

## Funn 4 — Tetthetsmålingen målte noe annet enn kravet sa

**Hvor:** `generatorer/validering.ts`, funksjonen `maalTetthet`.

**Hva:** FR-7 setter et tak på «høyst **12 unike Faguttrykk** per 1 000 ord».
Koden telte unike *posisjoner* i teksten:

```ts
const unike = new Set(
  forekomster.map((f) => `${f.avsnittNummer}:${f.start}:${f.slutt}`),
).size;
```

Tre Faguttrykk som hvert står fem steder ble dermed regnet som 15 unike
uttrykk. Det er en helt annen side enn femten uttrykk som står ett sted hver:
det første er en tekst med tre gjennomgangsbegreper, det andre er det gule
teppet taket finnes for å hindre.

Funksjonen **kunne heller ikke** gjøre det riktig, og det er den egentlige
feilen: typen `Forekomst` bar ikke hvilket uttrykk markeringen hørte til, bare
hvor den var. Informasjonen målingen trengte fantes ikke i inndataene.

**Hvordan det ble funnet:** ved å skrive en test som skulle bestå og ikke gjorde
det — ett begrep i en lang tekst, som burde ligget godt innenfor alle tre
takene. Da tallet ikke stemte, ble det målt framfor regnet i hodet, med en
midlertidig test som skrev ut de faktiske verdiene.

**Hvorfor det er verdt å ha med:** koden var internt konsistent, hadde tester
som bestod, og var kommentert med en begrunnelse som pekte på AD-13. Den var
bare uenig med kravet den skulle håndheve. Interessant nok hadde databasen rett
hele tiden: tabellen `forekomst` har en `begrep_id`-kolonne, så den lagrede
formen visste hvilket begrep en markering tilhørte. Det var bare
arbeidstypen i minnet som manglet det.

**Hva som ble gjort:** `uttrykk` lagt inn i `Forekomst`-typen, og målingen
teller nå unike uttrykk. Typen er dessuten nødvendig for lesevisningen, som må
vite hvilken forklaring en markering hører til.

---

## Funn 5 — Et tak som ikke er en garanti, og som nesten ble lest som en

**Hvor:** samspillet mellom `maalTetthet` og `kappEtterRangering` i
`generatorer/validering.ts`.

**Hva:** ett eneste Faguttrykk som forfatteren gjentar ofte bryter
tetthetstakene alene. Kappingen kan ikke rette det, fordi den kutter *hele*
Faguttrykk nedenfra og stopper ved gulvet på fem — med ett Faguttrykk er det
ingenting å kutte. Settet leveres altså med `innenfor: false`.

Det er riktig oppførsel. Alternativet ville vært å fjerne tekstens viktigste
begrep fordi forfatteren gjentar det. Men det betyr at `innenfor` **ikke er et
løfte om det eleven ser**, og en sperre bygget på det feltet ville fjernet
markeringene i enhver tekst med et gjennomgangsbegrep.

**Hvordan det ble funnet:** samme målekjøring som funn 4. Her var det ikke koden
som var feil, men påstanden i testen jeg nettopp hadde skrevet — to ganger på
rad, fordi jeg regnet tettheten i hodet i stedet for å måle den.

**Hvorfor det er verdt å ha med:** det er et funn om *kravet*, ikke om koden, og
det kom ut av å implementere kravet. FR-7 nevnte gulvet bare i forbindelse med
prosentgrensen, mens koden lar det overstyre alle tre takene. Divergensen er nå
skrevet inn i FR-7, med begrunnelsen — nettopp den sporbarheten brief → PRD →
kode som emneansvarlig etterlyste i tilbakemeldingen 6. oktober.

**Hva som ble gjort:** presisering lagt inn i FR-7, og en test som holder
oppførselen fast med begrunnelsen i kommentaren.

---

## Status mot FR-41

| Krav | Status |
|---|---|
| Minst tre konkrete feil eller svakheter dokumentert, med hvordan de ble funnet | **Innfridd** — fem funn over |
| Versjonskontroll gjennom semesteret, med sporbare commit-meldinger | Pågår |
| Automatiserte tester for de maskinsjekkbare kravene | Delvis — FR-7 dekket, FR-4, FR-14, FR-20, FR-25 og FR-31 gjenstår |
| Innlogging, lagring og sletting gjennomgått linje for linje og dokumentert | Ikke startet — §4.10 er ikke bygget ennå |

**Et mønster til refleksjonsrapporten.** Ingen av de fem funnene ble oppdaget av
å lese koden og synes den virket feil. Funn 1 kom av å spørre hvilke inndata som
treffer hver gren, funn 2 av å feilsøke noe annet, og funn 3, 4 og 5 av å ta
koden i bruk — å skrive den første ekte generatoren og følge kallveien til ende.
Funn 3 og 4 er dessuten samme klasse: kode som var internt konsistent, hadde
grønne tester, og var kommentert med en begrunnelse som pekte på riktig
arkitekturbeslutning — men som gjorde noe annet enn kravet sa. Det er feilformen
KI-assistert utvikling produserer mest av, og den er langt vanskeligere å se enn
kode som ikke virker.
