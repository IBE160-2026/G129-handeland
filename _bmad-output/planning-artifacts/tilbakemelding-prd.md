# Tilbakemelding på PRD

| | |
|---|---|
| **Gruppe** | G129 – G129-handeland |
| **PRD vurdert** | `_bmad-output/planning-artifacts/prd-lesevenn.md` (status `final` i frontmatter, sist endret 2026-11-11, commit 71500d7). `addendum-lesevenn.md` er lest som kontekst. |
| **Dato** | 2026-11-12 |
| **Type** | Formativ tilbakemelding, ikke karakter |

## 1. Samlet inntrykk

Dette er en uvanlig sterk PRD med egen tese, ærlige avveininger og tallfestede, testbare krav, særlig rundt KI-delene. Risikoen er ikke substansen. Den er at dokumentet er blitt veldig langt (ca. 21 000 ord) og bærer med seg rester av tidligere versjoner, så noen steder sier det ulike ting. Det vil bremse epics, stories og testing hvis det ikke ryddes.

## 2. Dette fungerer godt

1. **Fagsamtalen kan faktisk testes (§4.6, FR-19 til FR-21).** Fem navngitte tilstander, strukturerte felt (`kildeavsnitt_id`, `mål`), en sikkerhetsport med «null misoppfatninger lest som Dekkende» og en avsnittstest. Dere forklarer også hvorfor ordforskjell-testen ble forkastet («Et krav som ikke kan feile måler ingenting»). Det er ekte kvalitetssikring av KI-funksjonalitet.
2. **Kjørbarhet, kostnad og personvern er tatt på alvor (FR-46, §6.2, §6.4).** Testmodus der lagrede svar valideres som ferske, lokal database, fordeling av modeller etter budsjett og en leverandørnøytral personvernseksjon. Dette følger opp forrige tilbakemelding.
3. **Scope er ærlig.** Tilbaketrukne FR-er er forklart (§4.9), bildeinnlesing er merket «umålt» (FR-45), og motmetrikkene SM-C1 til SM-C4 hindrer at målingene optimaliseres på feil måte.

## 3. Oversikt per dimensjon

| Dimensjon | Vurdering | Kort begrunnelse |
|---|---|---|
| Beslutningsklarhet | sterk | Valg står med begrunnelse og pris, f.eks. mapper byttet mot bildeinnlesing, ett kvalitetssikret språk, SM-8 beholdt ved brudd. |
| Substans | sterk | Ingen pynt-personas eller boilerplate-NFR-er. Tall og terskler har grunn. Fire personer driver faktiske valg. |
| Strategisk sammenheng | sterk | Tesen «nekter å gi svaret først» styrer rekkefølge, ikke-mål og metrikker. |
| Testbarhet | sterk | Nesten alle FR-er har målbare konsekvenser. De svakeste er FR-12, FR-17 og FR-35 til FR-37. |
| Scope og avgrensning | sterk | Ikke-mål, utenfor-v1 og «Utenfor dette FR-et» er eksplisitte. Se 4.5 om kobling til milepæler. |
| Brukbarhet for neste fase | god | Glossar og ID-er er stort sett konsekvente, men lengde, historikk i kravteksten og noen motsigelser gjør uttrekk tungt. |
| Formtilpasning | god | UJ-ene passer en elevapp. Dokumentasjonskrav (FR-38 til FR-43) er blandet inn blant produktkravene. |

## 4. Viktigste forbedringer

### 4.1 Motsigelser etter siste endringer
- **Alvorlighet:** høy
- **Hvor:** UJ-1; §8.1 «Obligatorisk gjennomsyn i to faser»; SM-10 og §11 pkt. 6; SM-7 mot FR-14; §6.4 mot FR-11; §6.4 «tak på mappestørrelse (FR-32)»
- **Problem og hvorfor det betyr noe:** Endringen 11.11 i FR-3 (fase 3b hoppes over for innlimt tekst) er ikke fulgt opp i UJ-1, der Jonas limer inn tekst og likevel «får hele den uttrukne teksten til gjennomsyn». SM-7 krever ≥ 90 % forankring, FR-14 sier 85 %. §6.4 sier `claude-haiku-4-5`, FR-11 og §11 pkt. 11 sier `claude-haiku-5-5`. FR-32 er tilbaketrukket. Frontmatter har `updated: 2026-10-08`. Testtilfeller og stories hentet herfra vil stride mot hverandre.
- **Forslag:** Gå gjennom hele dokumentet etter hver tidligere endring og rett én sannhet per tall. Eksempel: «SM-7: Minst 85 prosent av genererte spørsmål passerer forankringskravet (FR-14), rapportert med konfidensintervall.» Skriv om UJ-1 slik at Jonas går fra fase 3a og Aktivering rett til Lesevisning, og flytt gjennomsynet av hele teksten til UJ-4.

### 4.2 Dokumentet er også en endringslogg
- **Alvorlighet:** høy
- **Hvor:** FR-7, FR-8, FR-11, FR-39, §11 pkt. 11, f.eks. «Presisert 7. oktober, etter at implementasjonen avdekket tilfellet …»
- **Problem og hvorfor det betyr noe:** Begrunnelser, måleresultater og «tidligere versjon sa …» ligger inne i kravene. Den som skal lage stories eller tester må lete etter selve kravet. Pkt. 11 i §11 er nesten ulesbart. Verdifullt resonnement (godt materiale til refleksjonsrapporten) drukner kravene.
- **Forslag:** Behold per FR: kravet, konsekvensene og én setning «Hvorfor». Flytt historikk og måledata til addendum eller en beslutningslogg. Eksempel for FR-3: «Fase 3b hoppes over for innlimt tekst. For PDF og bilde kan den ikke hoppes over (FR-4, FR-45). Teksten låses når fase 3b er godkjent.» Resten flyttes.

### 4.3 KI-feil og kostnad i drift mangler som krav
- **Alvorlighet:** medium
- **Hvor:** §5 «Ingen blindveier»; FR-13, FR-19; §6.4
- **Problem og hvorfor det betyr noe:** Feiltilstander er spesifisert for PDF, bilde og oversettelse (FR-29). For uttrekk, quiz, svarvurdering og oppfølging står bare det generelle prinsippet. Det sier ikke hva eleven ser ved tidsavbrudd eller ugyldig svar, eller om elevens svar går tapt. Budsjettet er 300–600 kr, men ingen krav begrenser antall generasjoner per konto.
- **Forslag:** Legg til konsekvenser, f.eks. i FR-19: «Gir modellkallet ugyldig eller manglende svar etter ett nytt forsøk, vises «Vurderingen feilet, svaret ditt er lagret» med knappen «Prøv igjen»; runden telles ikke.» Og i §6.4: «Én konto kan lage høyst N Tekster per døgn; over grensen vises dato for når det åpner igjen.»

### 4.4 Dokumentasjonskrav og produktkrav i samme nummerserie
- **Alvorlighet:** medium
- **Hvor:** §4.11 (FR-38 til FR-43)
- **Problem og hvorfor det betyr noe:** Disse beskriver leveranser (logg, rapport, refleksjon), ikke appens oppførsel. De gir «43 FR-er» og blir rare stories. Flere («drøftet», «gjennomgått») er ikke testbare på samme måte som resten.
- **Forslag:** Gi dem egen seksjon og egen nummerering (f.eks. DK-1 til DK-6) med sjekkbare kriterier: «KI-loggen har ≥ 5 oppføringer med status forkastet/endret», og behold FR-46 som produktkrav.

### 4.5 Kuttrekkefølgen dekker ikke alle FR-er og viser ikke status
- **Alvorlighet:** medium
- **Hvor:** §9.1–9.3; FR-12, FR-37
- **Problem og hvorfor det betyr noe:** Ca. 37 produkt-FR-er, fem gullsett, bilde og mobil for én person gir høy risiko, og kodefrys er 27. november. M0 og M1 nevner ikke FR-12 (alle med tall), FR-37 (sletting) og FR-46 med FR-nummer. PRD-en sier ikke hva som er levert per i dag, så epics kan bli planlagt for ting som allerede finnes.
- **Forslag:** Legg til en tabell: FR | milepæl (M0/M1/kan kuttes) | status per 12. november.

## 5. Mekaniske funn

- **ID-er:** FR-44 og FR-45 ligger i §4.1 mellom FR-4 og §4.2, FR-46 i §4.11 etter FR-43. Tilbaketrukne FR-32 til FR-34 er forklart. SM-1 til SM-12, SM-C1 til SM-C4 og UJ-1 til UJ-4 er sammenhengende.
- **Glossar:** «Avsnitt» (FR-3, FR-7) står ikke i ordlisten, bare «Kildeavsnitt». «Gullsett» brukes i mange betydninger (6 tekster, 24 spørsmål, 36 tilfeller), og bør heller kalles Gullsett Faguttrykk, Quiz osv.
- **Antakelser:** `[ÅPENT]` i FR-7 og FR-8 står ikke i §11. Antakelsesregisteret (§12) har #5 («obligatorisk gjennomsyn») som er endret av FR-3, og tilbaketrukne punkter står fortsatt nummerert.
- **Åpne spørsmål besvart i FR-ene:** §11 pkt. 7 (ikke-fagtekst) er løst i FR-7 (mykt varsel), pkt. 10 (orddeling) i FR-2. Marker dem avklart.
- Ingen sensitive opplysninger funnet i PRD-en.

## 6. Før dere går videre

**Må avklares før UX, arkitektur og epics:**
1. Rett motsigelsene i 4.1 og bestem hvilket modellnavn og hvilke terskler som gjelder.
2. Avgjør hva som skjer med gjennomsyn i UJ-1 etter endringen 11.11, siden UX avhenger av det.
3. Skriv feilkrav for KI-kall (4.3).

**Kan vente:** opprydding i historikk (4.2), egen DK-seksjon (4.4), rettsstilstanden i §11 pkt. 12 og ny Covered Models-sjekk nærmere innlevering.

**Oppfølging av briefen-tilbakemeldingen: ja.** Testmodus og lokal database (FR-46), aldersgruppe (§2.2), målbare kriterier (SM-2 til SM-8), mapper ut (§4.9) og personvern er tatt inn. Bildeinnlesing er beholdt med begrunnelse (FR-44), og er et bevisst valg.

## 7. Refleksjonsspørsmål

1. Flere ganger endret dere krav fordi en måling eller test viste at forrige formulering ikke holdt (FR-8, FR-3). Hvordan sørget dere for at endringen ble rettet *alle* steder, og hva ville dere gjort for å finne de stedene dere ikke rettet?
2. PRD-en er mer detaljert enn de fleste. Hvilke deler har KI skrevet, og hvordan avgjorde dere hva som var kravet og hva som bare var begrunnelse?

_Vurdert mot kvalitetsrubrikken i bmad-prd. Dette er veiledning, ikke sensur._
