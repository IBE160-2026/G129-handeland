---
title: Kodefunn — feil og svakheter i KI-generert kode
status: løpende
created: 2026-10-07
updated: 2026-10-19
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

## Funn 6 — Et råd som aldri kan virke

**Hvor:** `generatorer/kontrakt.ts`, `catch`-blokken i `kjoerGenerator`.

**Hva:** alle feil fra modellkallet som ikke var tidsavbrudd falt til én felles
gren, med meldingen «Lesevenn fikk ikke behandlet teksten» og rådet «Prøv igjen
om litt. Står det ved, er det en feil hos oss.»

Det er riktig råd ved en forbigående feil. Det er feil råd ved en **utløpt eller
tilbaketrukket API-nøkkel**, som gir 401: der kan eleven prøve igjen så mye den
vil uten at noe endrer seg. §5 i PRD-en krever at hver feiltilstand tilbyr minst
én *konkret* ting eleven kan gjøre videre, og et råd som ikke kan virke oppfyller
ikke kravet — det er en blindvei med et skilt på, som er verre enn å si rett ut
at eleven ikke kan gjøre noe.

**Hvordan det ble funnet:** ved å svare på spørsmålet «hva skjer når
API-nøkkelen løper ut?». Svaret krevde at kallveien ble fulgt til ende, og da
var det tydelig at 401 havnet i den generelle grenen.

**Hvorfor det er verdt å ha med:** feilen er usynlig for alt vi måler.
Enhetstestene kaller ikke modellen, bygget kaller ikke modellen, og
helsesjekken går mot databasen. En utløpt nøkkel gir derfor **grønt på hele
linja mens appen ikke virker** — og den eneste tilbakemeldingen er en melding
som sender eleven i ring. Det er den klassen feil som koster mest i drift,
fordi ingenting varsler om den.

**Hva som ble gjort:** 401 og 403 skilt ut som `tilgang_avslaatt`, med et råd
som ikke lover at venting hjelper, og som sier at teksten er lagret. 429 skilt
ut som `for_mange_kall` — den ene feilen der «prøv igjen om litt» faktisk er
sant. Den manglende nøkkelen bruker nå samme kode som den utløpte, siden det er
samme problem for eleven. Test lagt inn som sjekker at rådet ikke inneholder
«prøv igjen».

---

## Funn 7 — Kappingen ofret 21 fagord for ingenting

**Hvor:** `generatorer/validering.ts`, funksjonen `kappEtterRangering`.

**Hva:** første ekte kjøring mot en NDLA-tekst om elektromagnetisk stråling.
Modellen fant 26 Faguttrykk, og **alle 26 passerte valideringen** — verbatim,
kildeavsnitt, ikke-sirkulær forklaring. Kappingen kuttet 21 av dem, ned til
gulvet på fem, og tetthetsmålet var *fortsatt* brutt.

De fem som overlevde var det verste mulige settet: `EM-bølger` og
`elektromagnetiske bølger` (samme begrep), pluss de tre mest gjentatte
ordene. Bort gikk `bølgelengde`, `ionosfæren`, `ozonlaget`,
`sølvklorid` og `prisme` — altså nøyaktig de ordene en elev som strever
trenger forklart.

**Årsaken** var at to av de tre takene teller MARKERINGER, mens den eneste
knappen i koden var å fjerne BEGREPER. Å fjerne `sølvklorid`, som står én
gang, fjerner én markering. Opphopningen kom fra de høyt rangerte ordene med
fire–fem markeringer hver, som var vernet av rangeringen. Algoritmen ødela
dekningen for å rette et problem de beholdte selv forårsaket — og den kuttet
forbi de ni begrepene antallstaket faktisk tillater.

**Hvordan det ble funnet:** ved å kjøre generatoren mot en reell fagtekst for
første gang. Ikke av noen test. Alle 94 testene var grønne, fordi de brukte
konstruerte sett der hvert begrep hadde én forekomst — altså presis det
tilfellet feilen ikke rammer.

**Hvorfor det er verdt å ha med:** dette er den dyreste feilen i loggen, og
den klassen er verdt å kjenne igjen. Koden gjorde det kravet sa, kravet var
internt konsistent, og testene bekreftet begge. Feilen lå i at ingen av oss
hadde regnet på hva reglene gjør mot en tekst der ord gjentas — og konstruerte
testdata gjentar sjelden noe.

Og én ting mer: jeg foreslo først å begrense gjentakelse som løsning. Målingen
viste at det **ikke** var nok — vindustaket var fortsatt tre ganger
overskredet. Først da jeg målte fordelingen framfor å resonnere om den, kom det
fram at det bindende taket er antallet begreper, og at vindustaket er
uoppnåelig når fagspråket introduseres samlet i åpningsavsnittet.

**Hva som ble gjort:** kappingen skrevet om til å bruke det billigste
virkemidlet først — kutt til antallstaket, så én markering per avsnitt, så én
per begrep — og Faguttrykk fjernes aldri for prosentgrensen eller vindustaket.
Resultatet gikk fra 5 til 9 beholdte begreper. FR-7 er oppdatert med
rekkefølgen og med begrunnelsen for at vindustaket kan rapporteres som brutt.

**Gjenstår:** rangeringen har for lav oppløsning. 26 begreper fordelt på fire
rangeringer, der ti deler rangering 2, betyr at kappingen i praksis avgjøres av
modellens utdatarekkefølge. Resultatet er at alle ni beholdte begreper kommer
fra første tredjedel av teksten. Ført som åpent punkt i FR-7.

---

## Funn 8 — En heuristikk som gjettet riktig på to modeller og galt som regel

**Hvor:** `generatorer/kontrakt.ts`, funksjonen som satte tenkekonfigurasjonen.

**Hva:** modusen ble gjettet fra modellnavnet:

```ts
if (modell.startsWith("claude-haiku")) {
  return { type: "enabled", budget_tokens: 4000 };
}
return { type: "adaptive" };
```

Det var riktig for `claude-haiku-4-5` og `claude-sonnet-5`, altså de to
modellene prosjektet hadde valgt. Men modellistens egne kapabiliteter viser at
regelen ikke holder:

| Modell | `thinking.types.enabled` | `thinking.types.adaptive` |
|---|---|---|
| `claude-haiku-4-5` | støttet | **ikke** støttet |
| `claude-haiku-5-5` | **ikke** støttet | støttet |

Samme familie, motsatt krav. Et bytte til Haiku 5.5 — ett ord i manifestet —
ville sendt `budget_tokens` til en modell som avviser det, og kallet ville
feilet med 400.

**Hvordan det ble funnet:** ved å verifisere at en ny API-nøkkel virket. Svaret
fra `GET /v1/models` inneholdt `claude-haiku-5-5`, utgitt samme dag, og
kapabilitetsfeltet gjorde det tydelig at navnet ikke bærer informasjonen koden
leste ut av det.

**Hvorfor det er verdt å ha med:** feilen er usynlig til den utløses, og den
utløses av å *endre én ting og forvente at resten virker* — altså den
situasjonen man er minst forberedt på å feilsøke. Den er også et eksempel på en
klasse som går igjen i denne loggen: kode som er korrekt for de tilfellene som
fantes da den ble skrevet, og som koder inn en antakelse ingen har skrevet ned.
Her var antakelsen «Haiku betyr budsjett».

Merk at ingen test kunne fanget den. Testene kaller ikke modellen (AD-5), og
mot den modellen manifestet faktisk pekte på var oppførselen riktig.

**Hva som ble gjort:** tenkemodusen er flyttet til manifestet, ved siden av
modellen, med gyldige verdier `budsjett`, `adaptiv` og `av`. Det følger AD-14:
en modell kan ikke forfremmes uten at det samtidig oppgis hvordan den skal
kalles. En test håndhever at feltet finnes og er gyldig for hver oppgave, så
den neste som bytter modell blir minnet på spørsmålet framfor å oppdage det i
drift. Hva en modell støtter, slås opp i `capabilities.thinking` fra
`GET /v1/models`.

---

## Funn 9 — Fem kjøringer, én fil: selvkonsistens som stemte over ett svar

**Hvor:** `generatorer/lagretsvar.ts`, funksjonen `noekkel`.

**Hva:** nøkkelen for et lagret modellsvar var oppgave + promptversjon +
tekst. Selvkonsistensen gjør fem parallelle kall med nøyaktig de tre
verdiene, så alle fem fikk samme nøkkel. I `skriv` overskrev de hverandre, og
bare det siste svaret ble liggende. I `les` leste alle fem den samme fila, og
flertallsavstemningen fikk fem kopier av ett svar: hvert uttrykk fikk 5/5, og
resultatet var ett enkelt kall som så ut som fem.

**Hvordan det ble funnet:** ved å lese `lagretsvar.ts` før den første
fullstendige målingen, for å vite om `npm run maal` kunne regne om metafor-
teksten uten nye kall. Mappa hadde én fil for en tekst som var kjørt fem
ganger. Ingen test feilet: hjelperen i testfila la ett svar på disk og stolte
på nettopp kollisjonen for at alle fem kjøringene skulle finne det.

**Rettelse:** `noekkel` tar et valgfritt kjøringsnummer, og selvkonsistensen
sender 0–4. Enkeltkall beholder den gamle nøkkelen. En regresjonstest legger
ulike svar per kjøring, med ett uttrykk i én kjøring færre enn flertallskravet,
og krever at det faller ut.

## Funn 10 — `npm run maal` var verken gratis eller gjentakbar

**Hvor:** `maaling/maal-faguttrykk.test.ts`, de første linjene.

**Hva:** fila lastet `.env.local` og satte deretter testmodus til `les` *hvis
den ikke var satt*. Men `.env.local` setter `LESEVENN_TESTMODUS=av`, som er
riktig for appen. Standarden slo dermed aldri inn, og hver «omregning fra
lagrede svar» var ferske modellkall: nye tall hver gang, og penger hver gang.
Løftet i AD-7 — tall som kan regnes om gratis og gi det samme — holdt ikke.

**Hvordan det ble funnet:** etter rettelsen av funn 9 skulle en omregning gi
nøyaktig de samme tallene som den ferske kjøringen. Den ga andre tall, og to
omregninger på rad ga ulike tall igjen, og de brukte over et minutt. En
omregning som er deterministisk kan ikke gjøre det.

**Rettelse:** testmodus leses fra kommandolinjen *før* `.env.local` lastes, og
settes til `les` med mindre kjøringen eksplisitt ba om noe annet (som
`maal:ferskt` gjør med `skriv`). Verifisert: to omregninger på rad gir
identiske tall, lik den ferske kjøringen, på under ett sekund.

**Mønsteret, igjen:** begge funnene er kode med grønne tester og en kommentar
som beskrev riktig oppførsel. Begge ble funnet ved å kreve at to ting som
*skal* være like faktisk er like — ikke ved å lese koden og vurdere den.

---

## Funn 11 — Innloggingsskjemaet ville gått forbi sperren mot passordgjetting

**Hvor:** planen for innloggingen, før koden ble skrevet. Skjemaene skulle
være server actions som kalte `auth.api.signInEmail` og `auth.api.signUpEmail`
— det mønsteret Better Auths egen Next.js-guide viser, med `nextCookies()` for
å sette cookien.

**Hva:** Better Auths begrensning av innloggingsforsøk ligger i HTTP-ruterne
under `/api/auth/*`. Et kall til `auth.api.*` fra serveren går rett til
endepunktet og forbi den. Målt mot en database i minnet med begrensningen slått
på: åtte feil passord på rad via `auth.api.signInEmail` ga åtte vanlige avslag
(401) og ingen sperre. Samme forsøk mot HTTP-ruten ble stoppet med 429 innen seks forsøk.

Med det første mønsteret ville innloggingsskjemaet altså vært en ubegrenset
vei til å gjette passord, mens HTTP-ruten — som ingen bruker — var beskyttet.

**Hvordan det ble funnet:** den første testen av begrensningen gikk mot
HTTP-ruten og besto. Før skjemaene ble skrevet, ble det spurt om testen gikk
gjennom den samme veien som skjemaene skulle bruke. Den gjorde ikke det, og en
ny test mot `auth.api` viste hullet. Dokumentasjonen sier ikke noe om det.

**Rettelse:** skjemaene bruker Better Auths klient i nettleseren
(`app/komponenter/authKlient.ts`), som går via HTTP-rutene. Eleven og en
angriper går da gjennom samme dør, med samme sperre. Invitasjonskoden sjekkes i
en krok i Better Auth og ikke i skjemaet, av samme grunn: ellers ville en POST
rett mot `/api/auth/sign-up/email` gått forbi den. Begge veier er testet i
`data/auth.test.ts`.

**Mønsteret:** en test som består, men som går en annen vei enn koden den
skal beskytte. Det er samme klasse som funn 3: grønt, og likevel uten dekning.

---

## Funn 12 — En metode for κ som aldri kunne gi et positivt tall

**Hvor:** `annotering.md` steg 5, veiledningen for å måle egen annoteringsstøy, skrevet med KI-assistanse tidlig i oktober.

**Hva:** veiledningen sa at sakssettet for Cohens κ skulle være unionen av ordene fra de to annoteringsrundene, og at κ da «overvurderer samsvaret noe». I unionen finnes det per definisjon ingen ord begge rundene sa nei til. Med d = 0 og n = a+b+c blir telleren i κ

    a·n − (a+b)(a+c) − b·c = −2·b·c

som aldri er positiv. κ over unionen er altså ≤ 0 uansett hvor enige rundene er: 8 ord felles og 1 ulikt hver vei gir −0,11. Påstanden om at metoden «overvurderer» var omvendt — tallet var meningsløst.

**Hvordan det ble funnet:** ved å regne ut formelen for hånd før verktøyet ble skrevet, 16. oktober — før noen runde 2 var annotert. Hadde verktøyet blitt skrevet etter veiledningen, ville første måling gitt et negativt tall som så ut som «du er uenig med deg selv».

**Rettelse:** verktøyet (`maaling/samsvar.ts`, `npm run gullsett:samsvar`) rapporterer **positivt samsvar**, 2a / (2a+b+c), som er F1 mellom rundene og direkte sammenlignbart med modellens F1 mot Gullsettet, og **κ med alle ordformer i teksten som saker**. Beviset for at unionsmetoden ikke virker er en test i `maaling/samsvar.test.ts`. Veiledningen og PRD-en er rettet.

**Mønsteret:** en metode som så rimelig ut i tekst, med en oppgitt «begrensning» som lot den virke gjennomtenkt. Begrensningen var gal i retning, ikke bare i størrelse. Det ble fanget av matematikk, ikke av lesing.

---

## Funn 13 — En nektingssjekk som slo alarm på riktig oversettelse

**Hvor:** `morsmaal/kontroll.ts`, sammenligningen av originalen med tilbakeoversettelsen i FR-28, 16. oktober.

**Hva:** sjekken talte hvert nektingsord for seg — «ikke», «ingen», «aldri» — og meldte avvik når ett av dem forekom sjeldnere etter tilbakeoversettelsen. «Prognosene tyder **ikke** på noen oppgang» kom tilbake som «prognosene viser **ingen** tegn til oppgang»: samme nekting, et annet ord, og sjekken meldte «tapt nekting».

**Hvordan det ble funnet:** den første ekte målingen på fire tekster ga ett avvik. Setningen ble lest før tallet ble godtatt.

**Rettelse:** nektingsordene telles samlet. En test med akkurat dette setningsparet står i `morsmaal/kontroll.test.ts`.

**Mønsteret:** en sjekk som aldri hadde vært sett feile. Alle testene var skrevet med eksempler der riktig svar var åpenbart, og ingen med en riktig oversettelse som brukte et annet ord.

---

## Funn 14 — Et tokentak som kuttet svaret midt i

**Hvor:** `generatorer/kontrakt.ts`, standardverdien `maksTokens = 8000`, og lavere tak satt i enkeltgeneratorer.

**Hva:** taket gjelder tenking og svar til sammen. Med adaptiv tenking bestemmer modellen selv hvor mye den tenker, og 8 000 holdt ikke: sju av ti minnevers (17.10) og én av tre quizer (18.10) ble avbrutt før svaret var ferdig, og det halve svaret var ikke gyldig JSON. Eleven ville fått «Lesevenn fikk et svar den ikke kunne bruke» uten at noen kunne si hvorfor.

**Hvordan det ble funnet:** måleharnessene for FR-31 og FR-14 kjørte mange ekte kall på rad. Ett og ett kall i appen hadde ikke vist det, fordi feilen bare inntraff noen ganger.

**Rettelse:** ett felles tak på 16 000 i kontrakten, og de lavere takene i enkeltgeneratorene fjernet, så feilen ikke kan komme tilbake én generator om gangen (AD-19).

**Mønsteret:** en standardverdi som var riktig da den ble satt — før adaptiv tenking — og ble gal da modellen ble byttet. Samme klasse som funn 8.

---

## Funn 15 — «constructor» ble godtatt som et leseinnstillingstrinn

**Hvor:** `tekst/leseinnstillinger.ts`, tolkingen av innsendte verdier, 17. oktober.

**Hva:** gyldige trinn ble sjekket med `s in TEKSTSTORRELSER`. `in` ser også på egenskaper alle JavaScript-objekter arver, så `"constructor" in {}` er sant. En innsendt verdi som «constructor» ville blitt lagret som trinn, og visningen ville krasjet da den slo opp et trinn som ikke finnes.

**Hvordan det ble funnet:** av en enhetstest skrevet for å sjekke at ukjente verdier gir standarden. Testen ble med vilje skrevet med en verdi som ligner en innebygd egenskap.

**Rettelse:** `Object.hasOwn`. Testen står i `tekst/leseinnstillinger.test.ts`.

**Mønsteret:** en språkfelle som ser riktig ut ved lesing. Den ble funnet fordi testen spurte «hva er den rareste verdien noen kan sende inn?», ikke «virker det med de vanlige?».

---

## Funn 16 — Øvekortet skjulte fagordet for skjermleseren

**Hvor:** `app/komponenter/Oevekort.tsx`, knappen som snur kortet.

**Hva:** knappen hadde `aria-label="Snu kortet og se forklaringen"`. En slik etikett erstatter innholdet for skjermleseren. En blind elev hørte dermed aldri fagordet på forsiden eller forklaringen på baksiden — bare instruksen om å snu.

**Hvordan det ble funnet:** av axe-core (regelen `label-content-name-mismatch`) i tilgjengelighetssjekken som kjører appen i Chrome (`npm run sjekk:tilgjengelighet`, 17.10). For alle som ser, så knappen helt riktig ut.

**Rettelse:** etiketten er fjernet; kortets innhold er knappens navn, og `aria-pressed` sier om kortet er snudd.

**Mønsteret:** en tilgjengelighetsattributt lagt til i god tro, som gjorde det verre. Ingen visuell gjennomgang kan finne denne klassen feil.

---

## Funn 17 — En lukkeknapp som ikke lukket, og en boble utenfor skjermen

**Hvor:** `app/komponenter/Fagord.tsx`, forklaringsboblen i FR-10, 17. oktober.

**Hva:** to feil i samme komponent. (1) Lukkeknappen lukket boblen og flyttet fokus tilbake til ordet — og fokus på ordet åpnet boblen igjen med en gang. (2) På en 375 px bred telefon stakk boblen 63 px ut av skjermen for et ord langt til høyre i linjen; koden som skulle forskyve den, virket ikke i praksis.

**Hvordan det ble funnet:** tilgjengelighetssjekken i Chrome, som trykker på lukkeknappen og måler boblens plassering med berøring på en smal skjerm. 38 av 42 sjekker besto første gang; disse var to av de fire som feilet.

**Rettelse:** fokuset som settes tilbake etter lukking, åpner ikke boblen. På telefon ligger boblen fast nederst på skjermen i stedet for ved ordet.

**Mønsteret:** samspillsfeil mellom to riktige regler (fokus åpner, lukking gir fokus tilbake). Hver regel for seg var riktig; feilen fantes bare når de møttes i en nettleser.

---

## Funn 18 — Seks krav var aldri bygget, og alle testene var grønne

**Hvor:** PRD-en mot appen, 17. oktober: FR-3 fase 3a (overskriftskontrollen), FR-5 (etiketter når teksten mangler overskrifter), FR-6 (videre med tomt svar etter én oppfordring), FR-1 (minstelengde ved innliming og tittelforslag), FR-7 (mykt varsel om ikke-fagtekst) og FR-36 (søk og sortering i tekstlisten).

**Hva:** funksjonene manglet helt, eller gjorde noe annet enn kravet. FR-6 var det motsatte: tomt svar ble stoppet for godt, mens kravet sier at eleven skal slippe videre.

**Hvordan det ble funnet:** en systematisk gjennomgang av alle FR-er mot koden, utløst av at fase 3a manglet da demotesten skulle skrives. Ingen test kunne funnet det: tester sjekker det som er bygget.

**Rettelse:** alle seks bygget, testet og satt i drift samme dag (migrasjon 0005 og 0006).

**Mønsteret:** utelatelse. KI-assistert bygging går fort fra krav til krav, og det som ikke blir bedt om i øyeblikket, blir ikke laget. Den eneste kontrollen som fanger det, er å lese kravene mot appen.

---

## Funn 19 — Minneversene besto alle sjekker og var ikke vers

**Hvor:** `prompts/minnevers/v1.md` og kontrollen i `generatorer/minnevers.ts`.

**Hva:** v1 ga rimfrie oppsummeringer med linjer på opptil 25 stavelser. Kontrollen sjekket linjetall og fagord, og alle ti versene besto. Prompten hadde lagt så mye vekt på «bare det teksten sier» at modellen ramset opp fakta.

**Hvordan det ble funnet:** utvikleren spurte «hva tenker du at et minnevers er?» før vurderingsarket ble fylt ut.

**Rettelse:** v2 med korte linjer, parrim og ett poeng per linje, og en stavelsessjekk i koden (høyst 14). v3 la til kildeavsnitt per linje (§5). Vurderingsarket har fått punktet «fungerer som huskeregel».

**Mønsteret:** testene målte det som var lett å måle, ikke det funksjonen lover. Samme klasse som funn 4, men i generert innhold i stedet for i kode.

---

## Funn 20 — En utrulling som «testet» uten å kunne stoppe

**Hvor:** kommandoen KI-assistenten brukte for å teste, committe og rulle ut, 18. oktober.

**Hva:** kommandoen var `npm test | grep -E "Tests|FAIL" && git commit … && vercel --prod`. `grep` lykkes når det finner linjen, også når linjen sier at testene feilet. Sju datatestfiler feilet, og endringen ble likevel committet og rullet ut. Årsaken til feilene var et tidsavbrudd i testoppsettet, ikke i koden, så ingenting galt havnet i drift — men det var flaks.

**Hvordan det ble funnet:** ved å lese utskriften etter utrullingen.

**Rettelse:** testoppsettet tåler nå at mange datatester starter samtidig (`vitest.config.ts`). Etterpå sjekkes testenes utgangskode før noe committes.

**Mønsteret:** en kontroll som ikke kan feile, er ingen kontroll. Det er nøyaktig det PRD-en advarer mot i FR-21 om fagsamtaletesten — her i verktøyet rundt koden.

---

## Funn 21 — README lovet mer enn testmodus dekket

**Hvor:** `README.md`, «Komme i gang».

**Hva:** README sa at hele kjerneløypen, «og fagsamtale», kunne gås gjennom uten API-nøkkel. Fagsamtalen kaller modellen med det eleven skriver, og testmodus `les` kan bare dekke svar som er lagret på forhånd. En sensor som fulgte README, ville fått en feilmelding i fagsamtalen.

**Hvordan det ble funnet:** da `npm run sjekk:readme` ble laget (18.10) — et skript som kloner repoet til en tom mappe og følger README. For å vite hva skriptet skulle sjekke, ble PRD-ens definisjon av kjerneløypen slått opp: aktivering, lesevisning og quiz. Fagsamtalen er ikke med.

**Rettelse:** README sier hva testmodus dekker og hva som krever nøkkel. Skriptet bekrefter kjerneløypen, 8 av 8.

**Mønsteret:** dokumentasjon skrevet ut fra intensjon, ikke prøvd. FR-46 krever med vilje at README «er testet av å bli fulgt».

---

## Funn 22 — Samme fagord fikk to oversettelser i samme tekst

**Hvor:** `generatorer/morsmaal.ts` og `app/handlinger.ts` — overskriftene, forklaringene og oppsummeringen oversettes i hvert sitt kall.

**Hva:** i teksten om språklige bilder ble «personifikasjon» oversatt som *уособлення* i overskriften og som *персоніфікація* i oppsummeringen. Begge er ukrainske ord for det samme, men en elev som ser to ulike ord, kan tro at det er to begreper. Ingen av kallene vet hva de andre valgte.

**Hvordan det ble funnet:** av den ukrainske morsmålsbrukeren i den eksterne vurderingen i FR-28 (19.10). Hun rettet overskriften til *персоніфікація* og merket det som et uvanlig ordvalg, ikke en feil. At det var to ulike valg, kom fram da rettelsene hennes ble sammenlignet med de lagrede oversettelsene.

**Rettelse:** ikke rettet ennå. FR-28 er bestått med null anmerkninger, så det er en forbedring, ikke et brudd. Den naturlige rettelsen er å sende oversettelsene fra tidligere kall med som en ordliste i senere kall for samme tekst og språk.

**Mønsteret:** to riktige svar som til sammen er misvisende. Hvert kall består enhver kontroll av sitt eget utdata; inkonsistensen finnes bare på tvers. Ingen maskinell sjekk i prosjektet ser på tvers av kall — det gjorde en leser.

---

## Funn 23 — Forklaringer kunne vise til en overskrift som kilde

**Hvor:** `generatorer/validering.ts`, `harGyldigKildeavsnitt`. Den sjekker bare at avsnittsnummeret finnes, ikke at det er brødtekst.

**Hva:** i teksten om språklige bilder viser forklaringene til «personifikasjon» og «besjeling» til avsnitt 13 og 9, som er overskriftene «Personifikasjon» og «Besjeling». Eleven som følger kilden, finner bare ett ord. §5 sier «ingen KI-utdata uten kilde», og minneversgeneratoren avviser overskrifter som kilde (fra v3); fagordene, som er det eleven møter først, gjorde det ikke.

**Hvordan det ble funnet:** under utviklerens gjennomgang av forklaringene (FR-8) 26.10. Utvikleren ba om å få se hele kildeavsnittet for hver forklaring, og da ble det synlig at to av dem var overskrifter. Den samme visningen viste at flere forklaringer henter innhold fra et annet avsnitt enn det de viser til (EM-bølger nr. 6, metafor nr. 8), som ingen sjekk fanger.

**Rettelse:** 26.10 i `harGyldigKildeavsnitt`, med test. Målt på de lagrede v3-svarene falt *personifikasjon* og *besjeling* ut, og gjenkallingen for v3 gikk fra 0,396 til 0,348: modellen pekte på overskriften for to ord som er i Gullsettet. Prompt v4 sier derfor at kildeavsnittet skal være brødtekst. Kodefiksen alene er altså ikke nok; regelen må stå både i koden og i prompten.

**Mønsteret:** samme regel håndhevet ett sted og ikke et annet. Regelen ble lagt inn i den generatoren der problemet først ble sett, ikke i det felles valideringslaget.

---

## Status mot FR-41

| Krav | Status |
|---|---|
| Minst tre konkrete feil eller svakheter dokumentert, med hvordan de ble funnet | **Innfridd** — 23 funn over |
| Versjonskontroll gjennom semesteret, med sporbare commit-meldinger | Pågår |
| Automatiserte tester for de maskinsjekkbare kravene | FR-4, FR-7, FR-20, FR-25 (begrepsanker) og FR-31 (maskinell del) dekket i `npm test`. FR-10, FR-12 og §5 i nettleseren (`npm run sjekk:tilgjengelighet`). Hele demoløypen i §9.5 i `npm run demotest`, 3 av 3. FR-14 og FR-21 er manuelle målinger (M1) |
| Innlogging, lagring og sletting gjennomgått og dokumentert (metoden endret 15.10, se FR-41) | Mutasjonstest: 7 av 7 brudd oppdaget (`npm run sjekk:innlogging`, rapport i `maaling/resultater/`). Utviklerens egne tester i appen (A–C) er gjort og dokumentert i `gjennomgang-innlogging.md` |

**Et mønster til refleksjonsrapporten.** Ingen av de første åtte funnene ble oppdaget av
å lese koden og synes den virket feil. Funn 1 kom av å spørre hvilke inndata som
treffer hver gren, funn 2 av å feilsøke noe annet, og funn 3, 4, 5 og 6 av å ta
koden i bruk — å skrive den første ekte generatoren og følge kallveien til ende.
Funn 3 og 4 er dessuten samme klasse: kode som var internt konsistent, hadde
grønne tester, og var kommentert med en begrunnelse som pekte på riktig
arkitekturbeslutning — men som gjorde noe annet enn kravet sa. Det er feilformen
KI-assistert utvikling produserer mest av, og den er langt vanskeligere å se enn
kode som ikke virker.

**Et andre mønster, fra funn 13–21.** Funnene fra 16.–18. oktober kom nesten alle
fra å **kjøre noe i stor skala eller i en ekte nettleser**: målinger med mange
ekte kall (13, 14), en nettleser som trykker og måler (16, 17), en ren klone som
følger README (21). To kom fra spørsmål og gjennomlesning, ikke fra kjøring:
utviklerens spørsmål om hva et minnevers er (19), og gjennomgangen av kravene mot
appen (18). Det siste er det viktigste: tester finner feil i det som er bygget,
men bare et menneske som leser kravene, finner det som mangler.
