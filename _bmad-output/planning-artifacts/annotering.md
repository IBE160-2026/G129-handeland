---
title: Annoteringsveiledning — gullsettet for faguttrykk
status: arbeidsdokument
created: 2026-10-07
updated: 2026-10-08
krav: FR-8, FR-40
---

# Annoteringsveiledning

Dette er oppskriften for å lage gullsettet FR-8 måler mot. Den er skrevet for
én leser: deg, om tre uker, når du har glemt hvorfor rekkefølgen er som den er.

Målene som skal nås: **gjenkalling ≥ 0,75** og **presisjon ≥ 0,70**, pluss
**null faglig gale forklaringer** i det eleven ser, pluss **egen
annoteringsstøy** rapportert som Cohens κ.

---

## 0. Den ene regelen som må holdes

**Annoter før du ser hva modellen fant.**

Dette er ikke en formalitet. Ser du modellens liste først, blir annoteringen
din anker-styrt: ord du ville oversett blir «jo, det er egentlig et
faguttrykk», og ord modellen bommet på blir lettere å avskrive. Resultatet er
et gullsett som ligner modellen, og da måler gjenkallingen ingenting.

Rekkefølgen er altså: **velg tekst → annoter → lagre → kjør modellen → mål.**
Aldri omvendt, og aldri «jeg tar en rask titt først».

Det er den samme regelen som SM-C4 i PRD-en, bare brukt på deg selv i stedet
for på modellen.

---

## 1. Velg seks tekster

PRD-en krever spredning over **fag** og **programområde**. Én tekst per celle;
det gir ingen terskel per celle, men det viser en systematisk forskjell om den
er stor.

FR-8 krever i tillegg at **tekstkilde** og **teksttype** varierer, og at hver tekst
merkes med sin. Et forslag til fordeling som treffer alle tre aksene:

| # | Fag | Programområde | Kilde | Type |
|---|---|---|---|---|
| 1 | Naturfag | Studiespesialiserende | Digitalt læremiddel | Fokusert |
| 2 | Naturfag | Yrkesfag | Mer autentisk | Oversikt |
| 3 | Samfunnsfag | Studiespesialiserende | Mer autentisk | Fokusert |
| 4 | Samfunnsfag | Yrkesfag | Digitalt læremiddel | Oversikt |
| 5 | Norsk | Studiespesialiserende | Digitalt læremiddel | Fokusert |
| 6 | Norsk | Yrkesfag | Mer autentisk | Oversikt |

Tre av hver kilde, tre av hver type, og begge kilder i hvert fag. Med bare seks
tekster lar ikke de tre aksene seg krysse fullt, så **kilde og type er noe du
merker og rapporterer**, ikke noe du kan isolere. Det er godt nok: poenget er at
en systematisk forskjell skal være synlig, ikke at den skal kunne tilskrives én
årsak med sikkerhet.

**Fordelingen tre og tre må bestemmes nå, ikke etter at tallene er kjent.** Det
er en direkte følge av beslutningen under SM-8: terskelen på 0,80 beholdes over
hele gullsettet, og et brudd rapporteres som et brudd. Da verner merkingen i to
retninger samtidig. Uten den er et snitt på 0,72 uleselig — det kan bety at
metoden er jevnt middelmådig, eller at den gir 0,87 på tre tekster og 0,57 på
tre andre, som er helt ulike funn. Og havner settet ved et uhell på seks
fokuserte tekster, kan snittet bestå *fordi* du valgte lette tekster. Begge
feilretninger lukkes av at fordelingen er låst på forhånd og merket i fila.

**Hvorfor teksttypen er med.** Det er målt, ikke antatt. Stabilitetsmålingen
8. oktober ga Jaccard 0,770 på en fokusert tekst og 0,466 på en oversiktstekst,
med samme prompt og samme modell. En oversiktstekst som dekker sju undertemaer
har mange flere grensetilfeller, og grensetilfellene er det som vakler. Velger du
seks fokuserte tekster, setter du terskelen på den lette halvparten.

**Og om NDLA:** det er ikke en lettversjon. Elevene bruker NDLA, så det er en av
tekstene de faktisk møter, og den hører derfor i settet på egne meritter.
Forskjellen er at NDLA-tekst er språkvasket og korrekturlest, altså jevnere i
form enn en lærebokside — så den dekker én reell tekstklasse, ikke begge.

Krav til hver tekst:

- **400–1 000 ord.** Kortere, og tetthetstakene bryter uansett hva som
  markeres. Lengre, og annoteringen tar for lang tid per tekst.
- **Blanke linjer mellom avsnittene.** Hardt krav — `delIAvsnitt` deler på
  dem, og uten dem blir hele teksten ett avsnitt.
- **To til fire overskrifter**, korte, uten punktum eller kolon til slutt.
- **Kan deles i et offentlig repo.** NDLA er CC BY-SA 4.0. Kreditering og endringer føres som i `testdata/eksempeltekst/LES-MEG.md`. Dette strammer utvalget av «mer autentisk» tekst: et fotografert lærebokoppslag kan brukes til å måle, men ikke uten videre legges i repoet. Alternativene er egenskrevet tekst i lærebokregister, eller åpent lisensiert materiale som ikke er NDLA. **Avklar dette før du begynner** — det er lettere enn å annotere noe du ikke kan levere.

**Samfunnsfag er den vanskeligste cellen**, og det er verdt å vite på
forhånd. Fagspråket der ligger nær det prompten eksplisitt forkaster som
allment akademisk — «faktor», «prosess», «utvikling», «forutsetning». Forvent
lavere presisjon der, og la det stå som et funn framfor å justere prompten til
den ser bra ut på én tekst.

---

## 2. Annoter

For hver tekst: les den som om du var faglæreren, og skriv ned de ordene du
mener Lesevenn **bør** markere.

### Hva som er et faguttrykk

Definisjonen er den samme som prompten bruker, og den må være det — ellers
måler du modellen mot en annen oppgave enn den fikk:

> Et ord eller uttrykk hvis betydning er spesifikk for tekstens fagområde, og
> som en elev på videregående rimeligvis ikke kjenner.

Ja: «ionosfæren», «sølvklorid», «bæreevne», «sveisefuge», «allegori».

Nei:

- Allment akademisk språk: «faktor», «prosess», «utvikling», «forutsetning»
- Egennavn, med mindre navnet selv bærer argumentet
- Tall og datoer
- Ord eleven åpenbart kan: «energi», «lys», «vann»

### Fire avgjørelser du må ta nå, ikke senere

Disse dukker opp i hver tekst, og hvis du avgjør dem underveis blir
annoteringen inkonsekvent — og da måler κ din egen vakling framfor noe reelt.

**Bøyning.** Prompten krever formen som står i teksten. Skriv derfor ned
formen slik den faktisk forekommer: står det «mitosen», skriv «mitosen».

**Flerordsuttrykk.** Står både «energi» og «indre energi» i teksten, og begge
er faguttrykk? Regel: **ta det mest spesifikke** du mener trenger forklaring.
Koden gjør det samme — `fjernOverlapp` lar lengste treff vinne.

**Sammensetninger.** «mitose» inni «mitosefasen» markeres ikke av koden, fordi
`finnForekomster` krever ordgrenser. Annoter derfor bare ord som står alene.

**Gjentakelser.** Du annoterer **begreper**, ikke markeringer. Står ordet fem
steder, er det fortsatt én oppføring i gullsettet.

### Tidsbruk

Regn **20–30 minutter per tekst**, altså to til tre timer for alle seks. Det
er en reell post i timeregnskapet, og den kan ikke delegeres — det er hele
poenget med at den er din.

---

## 3. Lagre annoteringen

Én fil per tekst, i `testdata/gullsett/`, i et format en måling kan lese:

```json
{
  "tekst": "em-egenskaper.txt",
  "fag": "naturfag",
  "programomraade": "studiespesialiserende",
  "kilde": "digitalt-laeremiddel",
  "type": "oversikt",
  "annotert": "2026-10-12",
  "runde": 1,
  "faguttrykk": [
    "ionosfæren",
    "spektralfargene",
    "sølvklorid",
    "ozonlaget"
  ]
}
```

`runde` er nødvendig for κ-målingen i steg 5. `annotert` er datoen, og den må
være ekte — sju dagers avstand mellom runde 1 og 2 er et krav, ikke en
anbefaling.

`kilde` er `digitalt-laeremiddel` eller `autentisk`, og `type` er `fokusert`
eller `oversikt`. Begge kreves av FR-8, fordi tallene skal rapporteres per
kilde og per type — ikke bare per fag. Uten feltene kan ikke målingen gruppere,
og da forsvinner den forskjellen vi alt vet er der.

---

## 4. Mål gjenkalling og presisjon

### Fest sammenligningsregelen FØRST

Dette er stedet det er lettest å jukse uten å mene det. Når modellen svarer
«mitosen» og gullsettet sier «mitose» — er det et treff?

**Bestem regelen før du ser tallene, og skriv den ned.** Forslag, som speiler
koden:

- Sammenligning er ufølsom for **store og små bokstaver**.
- Sammenligning er **følsom for bøyning**. «mitosen» ≠ «mitose».
- Flerordsuttrykk må matche **helt**. «indre energi» ≠ «energi».

Begrunnelsen for den strenge bøyningsregelen: koden krever verbatim, så en
modell som svarer grunnformen når teksten har bøyningen får uttrykket forkastet
uansett. Å være mild i målingen ville dermed målt noe appen ikke gjør.

Hvis du senere mener regelen var for streng, **endre den, mål om alt, og
oppgi begge tallene**. Det er ærlig. Å justere regelen for én sak du er uenig i
er det ikke.

### Regnestykket

For hver tekst, med G = gullsettet og M = det modellen leverte (etter kapping):

```
gjenkalling = |G ∩ M| / |G|      "fant den det jeg mente den skulle finne?"
presisjon   = |G ∩ M| / |M|      "av det den fant, hvor mye var reelt?"
```

**En viktig detalj:** mål mot settet **etter** kapping, altså det eleven
faktisk ser. Måler du mot råsvaret fra modellen, måler du en app som ikke
finnes. Og med dagens budsjett — `floor(12 × ord/1000)` — kan kappingen alene
senke gjenkallingen betydelig på en tett tekst. Det er en reell egenskap ved
appen, og den skal med i tallet.

Rapporter **per fag** og **samlet**. Ingen terskel per fag: med seks tekster er
konfidensintervallet rundt ±0,19, altså for bredt til å skille et godt fag fra
et dårlig.

---

## 5. Mål din egen støy — Cohens κ

Dette er den billigste enkeltmålingen i hele prosjektet, og uten den betyr
presisjonstallet ingenting: du vet ikke om 0,70 ligger over eller under din
egen usikkerhet.

**Framgangsmåte.** Velg to av de seks tekstene. Annoter dem på nytt, minst sju
dager etter første runde, **uten å se på runde 1**. Lagre som `runde: 2`.

### Hva som er problemet, og hvordan det løses

Cohens κ krever et fast sett *saker* som begge runder har gitt en *kategori*.
«Hvilke ord plukket du fra en tekst» har ikke et slikt sett — det finnes ingen
naturlig liste over alle kandidatord.

Den praktiske løsningen, som må oppgis i rapporten:

> Sakssettet er **unionen** av ordene fra runde 1 og runde 2. Hvert ord får
> kategorien «ja» eller «nei» i hver runde. κ regnes over dette settet.

Vit hva det betyr: regelen ser bare ord minst én runde valgte. Ord begge
rundene overså finnes ikke i settet, så κ overvurderer samsvaret noe. **Oppgi
det.** En κ med en oppgitt begrensning er bedre enn en κ som later som den er
noe annet.

```
κ = (p_observert − p_tilfeldig) / (1 − p_tilfeldig)
```

Tolkning: over 0,8 er sterkt, 0,6–0,8 er brukbart, under 0,6 betyr at din egen
annotering vakler mer enn forskjellen du prøver å måle. **Er κ lav, er det
funnet** — ikke noe å skjule. Det er da du går tilbake til de fire
avgjørelsene i steg 2 og skriver dem skarpere.

---

## 6. Sjekkliste før du kaller M0 ferdig

- [ ] Seks tekster valgt, med fag, programområde, kilde og teksttype fordelt
- [ ] Hver tekst merket med kilde (digitalt læremiddel / autentisk) og type (fokusert / oversikt)
- [ ] Alle seks kan deles i et offentlig repo, med kreditering og lisens ført
- [ ] Alle seks annotert **før** noen modellkjøring ble sett
- [ ] Sammenligningsregelen skrevet ned **før** første måling
- [ ] Gjenkalling og presisjon målt mot settet **etter kapping**, rapportert per fag, per kilde, per type og samlet
- [ ] To tekster annotert to ganger, minst sju dager mellom
- [ ] κ regnet, med sakssett-begrensningen oppgitt
- [ ] Forklaringene gjennomgått for faglige feil — terskelen er **null**, og
      dette er en gjennomgang av leveransen, ikke en statistisk terskel
- [ ] Tallene lagret som data i repoet, ikke bare i en tabell i rapporten

---

## Det som er lett å gjøre galt

**Å annotere etter å ha kikket.** Dekket i steg 0. Det er den feilen som gjør
alt arbeidet verdiløst, og den er usynlig i resultatet.

**Å justere prompten mellom annotering og måling.** Da vet du ikke hvilken
versjon tallet gjelder for. Promptversjonen stemples på resultatet (AD-4) av
en grunn — mål, skriv ned versjonen, *så* endre prompten og mål om.

**Å måle én gang og være ferdig.** FR-39 krever minst én dokumentert
promptforbedring over to versjoner, med tallene som viser den. Første måling er
utgangspunktet, ikke konklusjonen.

**Å skjule et dårlig tall.** Gjenkalling på 0,6 er et resultat. En rapport som
forklarer hvorfor den ble 0,6 og hva som ble forsøkt, er bedre enn en som viser
0,8 uten å si at terskelen ble flyttet.
