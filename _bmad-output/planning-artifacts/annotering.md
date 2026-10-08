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

FR-8 krever spredning over **fag**, **fagtype** (fellesfag eller programfag),
**tekstkilde** og **teksttype**. Én tekst per celle; det gir ingen terskel per
celle, men det viser en systematisk forskjell om den er stor.

**Settet er valgt og lisenssjekket 8. oktober 2026.** Alle seks er klarert for et
offentlig repo. Krediteringen under er en lisensplikt, ikke høflighet — den skal
følge tekstfila slik `testdata/eksempeltekst/LES-MEG.md` viser.

| # | Fag | Fagtype | Kilde | Type |
|---|---|---|---|---|
| 1 | Naturfag | fellesfag | læremiddel | oversikt |
| 2 | Samfunnsfag | fellesfag | autentisk | fokusert |
| 3 | Norsk | fellesfag | læremiddel | fokusert |
| 4 | Norsk | fellesfag | autentisk | oversikt |
| 5 | Teknologiforståelse | programfag | læremiddel | fokusert |
| 6 | Teknologiforståelse | programfag | autentisk | oversikt |

Med bare seks tekster lar ikke aksene seg krysse fullt, så **kilde og type er
noe du merker og rapporterer**, ikke noe du kan isolere. Det er godt nok:
poenget er at en systematisk forskjell skal være synlig, ikke at den skal kunne
tilskrives én årsak med sikkerhet.

**1. NDLA, *Egenskaper hos ulike EM-bølger*** (artikkel-id 22989), 779 ord.
CC BY-SA 4.0. Astrid Johansen (forfatter), Kristin Bøhle (medforfatter), Kari
Marlene Mulder (språk), Anne Lilleng (korrektur). **Ligger alt i repoet.**
Brukes hel.

**2. SSB, *Høy prisvekst gir ny renteøkning***, publisert 15.06.2026, ~1 100 ord,
6 overskrifter. **CC BY 4.0** — den frieste lisensen i settet, uten share-alike.
Krediteres «Statistisk sentralbyrå» med lenke til ssb.no. Brukes hel, eventuelt
med et lett kutt ned mot 1 000 ord.
<https://www.ssb.no/nasjonalregnskap-og-konjunkturer/konjunkturer/statistikk/konjunkturtendensene/artikler/hoy-prisvekst-gir-ny-renteokning>

**3. NDLA, *Lyriske virkemidler*** (artikkel-id 21846), ~500 av 1 000 ord.
CC BY-SA 4.0. Åsa Abusland, Marion Federl. **Kutt:** bare den forklarende delen
brukes, fra «Litt om språklige bilder» til og med «Konnotasjoner». Fra «Del 2»
går artikkelen over i oppgaver, og oppgavetekst er imperativer og spørsmål, ikke
fagprosa.

**4. SNL, *metafor***, sist oppdatert 22.02.2025, ~900 av 1 200 ord.
CC BY-SA, **«fri gjenbruk»** — sjekket for denne artikkelen spesifikt. Jan Grue
(Universitetet i Oslo). **Kutt:** lett beskjæring ned mot 900 ord.
**Merket oversikt** fordi den behandler ett begrep gjennom fem fagfelt —
litteraturvitenskap, språkvitenskap og kognitiv teori — og dermed bærer
terminologi fra flere felt. Det er den egenskapen som gir grensetilfeller, og
grensetilfellene er det som vakler.

**5. NDLA, *Domeneoppbygning og toppdomene*** (artikkel-id 24326), 661 ord,
3 overskrifter. CC BY-SA 4.0. Tron Bårdgård (opphav), Ida Marie Ellefsen
(språk). Brukes hel.

**6. Wikipedia, *Operativsystem***, ~800 av 4 070 ord. CC BY-SA 4.0, krediteres
artikkelen og dens historikk. **Kutt:** innledningen og de første delene, som en
selvstendig enhet. Dette er settets eneste tunge kutt — se begrensningen nederst
i dette steget.

### Fire tekster som ble vurdert og forkastet

Verdt å ha med, fordi begrunnelsene er de samme du vil møte igjen.

- **forskning.no** (to artikler) — uttrykkelig forbud mot gjenbruk. Se sitatet over.
- **NDLA *To søstre (utdrag)*** — teksten er Åsne Seierstads roman, ikke NDLAs
  eget stoff. Se advarselen om lisensfeltet under.
- **SSB *Endringer i industriomsetningen*** — 385 ord, altså under gulvet, og bare
  tre–fire reelle faguttrykk. Med så få gullsett-termer beveger gjenkallingen seg
  i fjerdedeler: én bom lander presis på terskelen 0,75, to bommer stryker.
  Målingen blir et utsagn om tilfeldigheter. URL-en roterer dessuten månedlig.
- **SNL *retorikk*** — «begrenset gjenbruk». Samme nettsted som `metafor`, som er
  fri. Lisensen må sjekkes per artikkel, ikke per kilde.

**Fordelingen tre og tre må bestemmes nå, ikke etter at tallene er kjent.** Det
er en direkte følge av beslutningen under SM-8: terskelen på 0,80 beholdes over
hele gullsettet, og et brudd rapporteres som et brudd. Da verner merkingen i to
retninger samtidig. Uten den er et snitt på 0,72 uleselig — det kan bety at
metoden er jevnt middelmådig, eller at den gir 0,87 på tre tekster og 0,57 på
tre andre, som er helt ulike funn. Og havner settet ved et uhell på seks
fokuserte tekster, kan snittet bestå *fordi* du valgte lette tekster. Begge
feilretninger lukkes av at fordelingen er låst på forhånd og merket i fila.

**En begrensning som skal stå.** Teksttype og tekstkilde er ikke helt uavhengige, og det er en egenskap ved sjangrene. En oversiktstekst på 700–1 000 ord er i praksis en læremiddelsjanger: NDLA skriver dem, mens oppslagsverk og offentlige kilder skriver enten korte oppslag eller svært lange gjennomganger. Å lage en autentisk oversiktstekst krever derfor beskjæring — og en hardt beskåret oversiktsartikkel blir fokusert av konstruksjon. Tekst 6 er settets eneste tunge kutt, og at den er autentisk er en skjevhet som skal nevnes når tallene per kilde leses.

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
- **Kan deles i et offentlig repo.** Kreditering og endringer føres som i `testdata/eksempeltekst/LES-MEG.md`. Dette strammer utvalget av «mer autentisk» tekst: et fotografert lærebokoppslag kan brukes til å måle, men ikke uten videre legges i repoet. **Avklar lisensen før du annoterer** — det er lettere enn å annotere noe du ikke kan levere.

### Lisensmodellene varierer, og de må sjekkes per kilde

Sjekket 8. oktober 2026. Dette er ikke én regel per nettsted — to av de fire under har lisens som varierer *innenfor* samme kilde.

| Kilde | Lisensmodell | Hvordan den sjekkes |
|---|---|---|
| **NDLA** | CC BY-SA 4.0 for NDLAs **eget** stoff. Hostede tredjepartsverk er noe annet — se advarselen under | Feltet `copyright.license` i `https://api.ndla.no/article-api/v2/articles/{id}`, **men det feltet er ikke nok alene**. Bildene har egne lisenser, ofte strengere. |
| **Wikipedia** | CC BY-SA 4.0 gjennomgående | Oppgitt i bunnteksten på hver side |
| **Store norske leksikon** | **Per artikkel.** Enten «fri gjenbruk» (CC BY-SA 3.0) eller «begrenset gjenbruk», der leseren må spørre forfatteren | Står på artikkelen selv. `snl.no/datamaskin` er fri; neste artikkel må sjekkes for seg |
| **forskning.no** | **Ikke tillatt.** Kan ikke brukes | Se sitatet under |

**forskning.no er utelukket, og det er verdt å ha sitatet:**

> «Det er ikke tillatt å kopiere og/eller gjenbruke artikler eller annet materiale uten avtale med forskning.no, utover det sitatretten gir anledning til.»
>
> — forskning.no, *Om forskning.no*, under overskriften «Gjenbruk», publisert 30.04.2022, <https://www.forskning.no/om-forskningno/om-forskningno/990992> — lest 08.10.2026

Dette er et uttrykkelig forbud, ikke et fravær av lisens, og det er en viktigere forskjell enn den ser ut: det første kan ikke tolkes bort. Sitatretten dekker korte sitater, ikke en hel tekst på 400–1 000 ord lagt i et repo.

**En avtale er i prinsippet mulig** — formuleringen er «uten avtale med forskning.no» — men det er en henvendelse med usikkert utfall og ukjent svartid, og M0 er 30. oktober. Regn ikke med den.

**Og det du var ute etter finnes andre steder.** Ønsket var tekst som er bearbeidet, men mindre stilisert enn NDLA. Wikipedia og SNL er nettopp det, med fri lisens — og de er oppslagsverk elever faktisk bruker, mens forskning.no er journalistikk *om* forskning.

### Advarsel: lisensfeltet i NDLAs API er ikke nok alene

Denne ble funnet 8. oktober, og den retter metoden rett over.

NDLA publiserer **utdrag fra andres opphavsrettsbeskyttede verk** til bruk i undervisning. For artikkelen *To søstre (utdrag)* (id 21978) rapporterer API-et:

```
license:       CC-BY-SA-4.0
creators:      Marthe Johanne Moe (writer)
rightsholders: (ingen)
origin:        (ingen)
```

Men innholdet er 2 587 ord av **Åsne Seierstads** roman. NDLA kan ikke lisensiere en annens roman under CC BY-SA — man kan ikke gi bort rettigheter man ikke har. Enten er metadataene ufullstendige, eller NDLA har en avtale som lar *dem* publisere utdraget uten at retten følger med til neste bruker. Uansett hvilket: **merkelappen kan ikke brukes som grunnlag for å legge teksten i repoet.**

Tre signaler på at lisensfeltet ikke kan stoles på:

- **Tittelen inneholder «utdrag»** eller på annen måte sier at dette er hentet fra et verk.
- **Prosaen er åpenbart en navngitt forfatters**, mens `creators` lister en NDLA-redaktør som `writer`.
- **`rightsholders` er tom** på noe som åpenbart har en rettighetshaver.

Regelen blir derfor: lisensfeltet gjelder NDLAs **egne forklarende tekster**. Er teksten et skjønnlitterært eller journalistisk verk gjengitt hos NDLA, må rettighetene avklares med rettighetshaveren — og for dette prosjektet betyr det i praksis: velg en annen tekst.

### Og en observasjon om NDLA i norskfaget

Av fire kandidater til norsk-cellen hadde **tre null ord brødtekst**: innholdet ligger i innbygde videoer og interaktive elementer. `De retoriske appellformene`, `Hva er modernisme?` og `Språklige virkemidler` er alle tomme for API-et, selv om sidene ser innholdsrike ut i nettleseren. Lesevenn trenger tekst, så slike sider er ubrukelige uansett lisens — og det er verdt å sjekke ordtellingen før du leser en side og tror du har funnet noe.

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

### Fire regler som følger av koden

Disse er ikke noe du skal vurdere. De følger av hvordan appen faktisk
oppfører seg, og annoterer du mot en annen regel, måler du noe appen ikke
gjør. *(Rettet 9. oktober: dette sto tidligere som «fire avgjørelser du må
ta», men overskriften lovet et valg som brødteksten tok for deg. De er
regler.)*

**Bøyning — skriv formen som står i teksten.** Står det «mitosen», skriv
«mitosen». Grunnen er at `erVerbatim` krever ordrett treff, så et uttrykk i
grunnform blir forkastet før eleven ser det.

**Flerordsuttrykk — ta det mest spesifikke.** Står både «energi» og «indre
energi», annoter «indre energi». `fjernOverlapp` lar lengste treff vinne, så
det er det settet appen kan levere.

**Sammensetninger — bare ord som står alene.** «mitose» inni «mitosefasen»
markeres ikke, fordi `finnForekomster` krever ordgrenser.

**Gjentakelser — én oppføring per begrep.** Du annoterer begreper, ikke
markeringer. Står ordet fem steder, er det fortsatt én oppføring.

### Tre avgjørelser som faktisk er dine

Her finnes det ikke et riktig svar som følger av koden. Du må velge, og
valget har målbare følger.

**1. Hva gjør du ved tvil — ta med, eller utelate?**

Dette er den viktigste, og den har en felle. Prompten (v2) sier til modellen:
«Er du i tvil om et ord oppfyller begge kravene, ta det ikke med.» Velger du
den motsatte regelen for deg selv, bygger du inn en **systematisk uenighet**:
modellen utelater grensetilfellene, du tar dem med, og gjenkallingen faller
for hvert eneste av dem — uten at modellen har gjort noe galt.

Velger du samme regel som prompten, måler du om modellen *anvender* regelen
like godt som deg. Velger du motsatt, måler du at dere har ulike regler, som
du alt vet. **Anbefaling: samme regel som prompten.** Men det er ditt valg, og
det skal skrives ned.

**2. Hvilke begreper velger du når det er for mange?**

Taket er 9 til 14 per tekst. Finner du tjue kandidater, må elleve ut, og
hvilke er en faglig vurdering ingen regel kan ta for deg. Spørsmålet som
hjelper: *hvilke ord stopper en elev som strever, og hvilke leser hun forbi?*

Skriv ned prinsippet du bruker, slik at tekst seks får samme behandling som
tekst én.

**3. Hvor streng er sammenligningsregelen?**

Er modellens «mitosen» et treff mot ditt «mitose»? Behandles i steg 4 — men
avgjørelsen hører hit, fordi den skal tas **før** du ser et tall.

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

- [ ] Seks tekster valgt, med fag, fagtype, kilde og teksttype fordelt
- [ ] Hver tekst merket med kilde (digitalt læremiddel / autentisk) og type (fokusert / oversikt)
- [ ] Alle seks kan deles i et offentlig repo, med kreditering og lisens ført
- [ ] Alle seks annotert **før** noen modellkjøring ble sett
- [ ] De tre avgjørelsene i steg 2 tatt og skrevet ned: tvilsregelen, prioriteringsprinsippet, og hvor streng sammenligningen er
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
