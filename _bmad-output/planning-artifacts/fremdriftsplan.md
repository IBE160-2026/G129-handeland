---
title: Fremdriftsplan — Lesevenn
status: arbeidsdokument
created: 2026-09-29
updated: 2026-09-29
---

# Fremdriftsplan

## Hva dette er, og hvor sikkert det er

Dette er et anslag, ikke en måling. Timetallene er mine estimater ut fra kravene i PRD-en, med påslag for at Next.js er nytt terreng. De kan være feil enkeltvis. Første versjon av dokumentet regnet dem som om alt skulle gjøres for hånd; delingen mellom hva som kan delegeres til KI og hva som ikke kan, står lenger ned og endrer bildet vesentlig.

**Kapasitet, bekreftet av Arve 29. september: 25 timer i uka.** Det er et høyt tall å holde i ni uker ved siden av andre emner, og planen bør ikke forutsette at hver uke blir full. Derfor er uke 48 holdt som reserve framfor å bli lovet bort.

## Kalenderen
**Bekreftet av Arve 29. september: 25 timer i uka, og uke 48 kan brukes til bygging.**

| Uke | Dato | Hva den er satt av til |
|---|---|---|
| 40 | 28. sep – 4. okt | Bygging |
| 41 | 5.–11. okt | Bygging |
| 42 | 12.–18. okt | Bygging |
| 43 | 19.–25. okt | Bygging |
| 44 | 26. okt – 1. nov | Bygging — **M0 mål 30. oktober** |
| 45 | 2.–8. nov | Bygging |
| 46 | 9.–15. nov | Bygging |
| 47 | 16.–22. nov | Bygging — **M1 mål 20. november** |
| 48 | 23.–29. nov | Reserve og stabilisering — **kodefrys fredag 27. november** |
| 49 | 30. nov – 4. des | Dokumentasjon og refleksjonsrapport |

Med 25 timer i uka:

- Bygging, uke 40–47: **200 timer**
- Uke 48, reserve: **25 timer**
- Uke 49, dokumentasjon: 25 timer

**Om uke 48.** Den er tilgjengelig for bygging, men planen sikter fortsatt mot at M1 står 20. november. Det er ikke en selvmotsigelse — det er slik reserve brukes. Timene er med i regnestykket, men de er ikke lovet bort til noe. Skrider M0 eller M1, absorberer uke 48 det. Skjer det ikke, går uka til polering, mobiltesting og et forsprang på dokumentasjonen.

Grunnen til å holde den slik: timeregnskapet er nå romslig, men *tidsplanrisikoen* er ikke borte. Nytt rammeverk, første gang med App Router, og en lesevisning som er den vanskeligste flaten i appen. Det er ikke timer som mangler, det er visshet om hvor de går.
## Timeregnskap

Midtpunkt i hvert anslag. Læringspåslaget for Next.js ligger inne.

| Arbeidspakke | Timer | Merknad |
|---|---:|---|
| **Grunnarbeid** | | |
| Next.js App Router, oppsett, utrullingskjede | 12 | Novisepåslag. Server components og server actions er reell begrepsbelastning |
| Database, ORM, første migrasjoner | 8 | |
| **Generatorlaget (AD-1)** | | |
| Grensesnitt, skjemaer for strukturert utdata, første generator | 12 | Den første koster mest — mønsteret settes her |
| Øvrige seks generatorer | 22 | 3–5 timer hver når mønsteret står |
| **Kjerneløypen** | | |
| Innliming og tofase-gjennomsyn | 10 | Mer grensesnitt enn det høres ut som |
| Aktivering | 4 | |
| Lesevisning med inline-markering | 15 | **Den vanskeligste flaten i appen.** Markering i løpende tekst med tastaturfokus, trykk, skjermleser og justerbar typografi |
| Quiz med retting og tilbakevisning | 10 | |
| Fagsamtale: grensesnitt, tilstandsvisning, re-vurdering | 12 | |
| **Konto** | | |
| Innlogging med etablert bibliotek, koblet selv | 15 | Inkluderer linje-for-linje-gjennomgangen FR-41 krever |
| Lagring, historikk, sletting | 8 | |
| **PDF og bilde** | | |
| PDF-uttrekk, orddeling, topp-/bunntekst | 10 | |
| Lage de sju testfilene | 5 | De finnes ikke — de må konstrueres |
| Sju feiltilstander med tester | 8 | |
| Bildeinnlesing med fem feiltilstander | 8 | |
| **Resten av funksjonene** | | |
| Øvekort | 6 | |
| Morsmålsstøtte, additiv visning, RTL | 12 | |
| Minnevers | 4 | |
| Tilgjengelighet og mobil | 10 | Ikke valgfritt i en lesestøtteapp |
| **Målearbeidet** | | |
| Gullsett FR-8: 6 tekster, annotering, κ-dobbeltannotering | 14 | |
| Måleharness som kode, én kommando (FR-40) | 10 | Dette er programvare, ikke et regneark |
| Gullsett FR-14: 24 quizspørsmål | 5 | |
| Gullsett FR-21: 36 samtaletilfeller | 18 | Svarene må skrives, og harnessen må kunne fake samtalehistorikk |
| Gullsett FR-28: oversettelse, 4 tekster | 7 | Inkludert koordinering med morsmålsbrukeren |
| Gullsett FR-31: 10 vers | 3 | |
| **Dokumentasjon underveis** | | |
| KI-logg og promptregister, gjennom semesteret | 9 | ~1 time i uka |
| **Sum** | **~245** | |

## Gapet — og hvorfor det første regnestykket var misvisende

Tabellen over er **totalt arbeid**, som om én person gjorde alt. Det er ikke det samme som timer med Arve foran skjermen, og det skillet manglet i første versjon av dette dokumentet.

### Fordeling mellom hva som kan delegeres og hva som ikke kan

| Kategori | Arbeidstimer | Herav Arves tid |
|---|---:|---:|
| **Kan i stor grad delegeres** — generatorlaget, skjemaer, PDF-uttrekksmekanikk, testfiler, feiltilstander med tester, måleharness, øvekort, minnevers, database og lagring | ~100 | 25–35 |
| **Må deles** — lesevisningen, kjerneløypens grensesnitt, morsmålsvisning, tilgjengelighet. Kan skrives av KI, men krever Arves øye: «virker dette for en elev som strever» kan ikke besvares av en modell | ~73 | 35–45 |
| **Irreduserbart Arves** — se under | ~83 | ~83 |
| **Sum** | ~245 | **145–165** |

### Den harde bunnen

Tre poster kan ikke delegeres, og de er store:

- **All annotering av gullsett: ~47 timer.** Gjør KI-en annoteringen *og* genererer det som måles, er målingen sirkulær. Det er nøyaktig SM-C4-bruddet som ble tatt ut av FR-28. Annotering utført av modellen gjør hvert tall i rapporten verdiløst.
- **Next.js-læring og gjennomgangen av innlogging: ~27 timer.** Bevisst valgt som egen læring, og FR-41 krever linje-for-linje-gjennomgang av nettopp den koden.
- **KI-logg og promptregister i egne ord: ~9 timer.** En KI-logg formulert av KI-en den logger er lite verdt.

### Hvor det lander

| | Timer |
|---|---:|
| Arves tid, anslått | 145–165 |
| Tilgjengelig, uke 40–47 ved 25 t/uke | 200 |
| Reserve i uke 48 | 25 |
| **Margin** | **+35 til +55 timer, pluss 25 i reserve** |

Omfanget går opp, med margin. To ting er verdt å holde fast på likevel. For det første er 25 timer i uka i ni uker et høyt tall ved siden av andre emner — regn med at noen uker blir kortere, og at marginen er der for nettopp det. For det andre er dette *timemargin*, ikke tidsplanmargin: risikoen ligger ikke i hvor mange timer som finnes, men i at Next.js er nytt og at lesevisningen er den vanskeligste flaten i appen. Marginen absorberer overraskelser, den gir ikke rom for nytt omfang — se motmetrikk SM-C2 i PRD-en.

### Tre forbehold

**KI-en jobber ikke ubevoktet over lange strekk.** Arbeid kan skje i bakgrunnen, men sløyfen stopper når noe må avgjøres eller en feil må ses på. Realistisk mønster er korte økter med avbrudd, ikke ubemannet bygging.

**Jo mer KI-en skriver, jo større blir gjennomgangsgjelden — og den er vurdert.** FR-41 krever dokumentasjon av minst tre feil funnet i KI-generert kode. Kode som verken er skrevet eller lest av studenten koster både karakterpoeng og læring.

**Men delegering er ikke å omgå oppgaven.** Emnet heter Programmering med KI, og arbeidsformen er beskrevet som å utvikle en applikasjon ved hjelp av KI. Prisen for delegering er dokumentasjonen, ikke legitimiteten.

## Hva dette betyr for kontospørsmålet

Du spurte om du skal kutte innlogging fra M0. Regnskapet svarer noe annet enn spørsmålet:

**Konto er 23 timer av 245.** Å flytte den fra M0 til M1 flytter timer mellom uker, men fjerner ingen. Å ta den ut av v1 helt sparer 23 arbeidstimer, hvorav rundt 23 er dine, av en underdekning på 10–30. Det ville altså mer enn dekket gapet alene — men det er også den posten du eksplisitt har sagt at du vil lære fra.

Så beslutningen er ikke «konto i M0 eller M1». Den er **hva som skal ut av v1**.

Og her er argumentet for å beholde kontoen, som jeg mener veier tungt: du sa du vil bruke prosjektet til å lære, og at brukerhåndtering er noe du vil forstå. Det er et legitimt hensyn i et emne som vurderer læring. FR-41 belønner det dessuten direkte — den krever linje-for-linje-gjennomgang av nettopp innlogging og lagring, og den gjennomgangen blir ærligere når du selv koblet det sammen.

## Kuttkandidater, rangert etter timer spart mot verdi tapt

Dette er mitt syn, ikke en beslutning.

**1. PDF-innlesing — sparer ~23 timer.** *Besluttet 29. september: beholdes.* Var den beste kandidaten på timer, men marginen gjør kuttet unødvendig, og PDF dekker filer læreren deler ut — et reelt tilfelle innliming og bilde ikke treffer. Vurderingen under står som dokumentasjon av at kuttet ble vurdert og forkastet. Uttrekk, orddeling, topp-/bunntekst, sju konstruerte testfiler og sju feiltilstander med tester er til sammen den nest største posten i tabellen. Og etter at bildeinnlesing kom inn, dekker innliming digital tekst og bilde dekker papir. PDF dekker det som er igjen: ark læreren har delt ut som fil. Det er et reelt tilfelle, men det minste av de tre — og det dyreste per bruker det når.

**2. Minnevers — sparer 4 timer.** Billig å beholde, og eneste rene kilde til et «modellen løy for rimets skyld»-tall til FR-42. Jeg ville ikke kuttet den; den står her bare for fullstendighetens skyld.

**3. Morsmålsstøtte redusert til oppsummering alene — sparer ~5 timer.** Dropp utpekingen av språklige bilder og akademisk allmennspråk (FR-27), behold oversettelsen av aktivering og oppsummering. Svekker en differensiator, men ikke kjernen.

**4. Fagsamtalens gullsett fra 36 til 24 tilfeller — sparer ~6 timer.** Sikkerhetsporten trenger nok misoppfatningstilfeller å være en port over, så det er en grense for hvor lite det kan bli. 24 er sannsynligvis gulvet.

**5. Konto ut av v1 — sparer 23 timer, nesten alle dine.** *Besluttet 29. september: beholdes, som egen læring.* Fjerner historikk, lagrede øvekort og gjenbesøk. Dette er den ene posten som alene dekker underdekningen — og samtidig den du har sagt du vil lære fra. Det er den avveiningen du må ta stilling til, ikke et råd jeg kan gi deg.

**6. Tilgjengelighet redusert — sparer ~5 timer.** Jeg mener dette ikke er en reell kandidat. En lesestøtteapp for elever som strever med lesing, som ikke er tilgjengelig, har et troverdighetsproblem som veier mer enn fem timer.

**Det som ikke kan kuttes:** kjerneløypen, fagsamtalen, generatorlaget og målearbeidet. De tre første *er* produktet. Det fjerde er grunnlaget for 30 prosent av karakteren, og for enhver kvalitetspåstand du gjør i rapporten.

## Besluttet 29. september

| Spørsmål | Svar |
|---|---|
| Kapasitet | 25 timer i uka |
| Uke 48 | Tilgjengelig, men holdes som reserve. M1 sikter fortsatt mot 20. november |
| PDF-innlesing | Beholdes. Kuttet ble vurdert og forkastet fordi marginen gjør det unødvendig |
| Brukerkonto | Beholdes, i M0, som egen læring. FR-41 belønner det direkte |

**Omfanget står dermed som i PRD §8.1.** Marginen på 35–55 timer pluss reserveuka er til for overraskelser, ikke for nytt omfang. Mapper er fortsatt ute (PRD §4.9) — spørsmålet kan tas opp igjen om M1 faktisk står tidlig, men ikke før, og da må også målespørsmålet for samlet fagsamtale besvares først.
