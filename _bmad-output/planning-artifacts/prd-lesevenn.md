---
title: Lesevenn
status: final
created: 2026-09-25
updated: 2026-09-28
---

# PRD: Lesevenn

En nettapp som fører eleven gjennom en lesestrategi-sekvens for fagtekst, med KI som motor og skriftlig fagsamtale som forståelsestest.

## 0. Om dette dokumentet

Dokumentet er skrevet for én leser: utvikleren som skal bygge Lesevenn alene i løpet av høstsemesteret 2026, i emnet IBE160 Programmering med KI ved Høgskolen i Molde. Det bygger på `product-brief-lesevenn.md` i samme mappe og gjentar ikke begrunnelsen som ligger der — briefen svarer på *hvorfor*, dette dokumentet svarer på *hva som skal virke, og hvordan man vet at det virker*.

Strukturen er: ordlisten i §3 fastsetter vokabularet, funksjonene i §4 er gruppert med globalt nummererte funksjonskrav (FR-1 til FR-45, der FR-32 til FR-34 er trukket tilbake og ikke gjenbrukes — se §4.9) nestet under seg, og tverrgående krav ligger samlet i §5 og §6. Antakelser er merket `[ANTAKELSE]` der de står og samlet i §12.

Emnets mappevurdering høsten 2026 har to deler: prosjektkode og funksjonalitet teller 70 prosent, og «dokumentasjon må vise hvordan KI ble brukt, og hvordan studentene har kvalitetssikret koden». Refleksjonsrapporten teller 30 prosent. Det er nesten en tredjedel av karakteren som ikke er kode, og formuleringen sier *koden* — ikke bare det KI-genererte innholdet appen produserer. Dokumentasjonsleveransen er derfor modellert som en funksjonsseksjon med egne krav (§4.11), på linje med resten, og milepælsplanen i §9 verner tid til den. Tekniske valg som er løsning og ikke krav, ligger i `addendum-lesevenn.md`.

En regel går igjen i hele dokumentet og er verdt å lese først: **ingen kvalitetspåstand teller i dette prosjektet med mindre den er målt mot et fast testsett.** En språkmodells egen selvtillit er ikke dokumentasjon. Derfor definerer §4.3, §4.4, §4.6 og §4.7 hvert sitt Gullsett med tallfestede terskler, og de samme gullsettene er råstoffet i §4.11. Det er samme arbeid brukt to ganger — én gang for å gjøre appen god, én gang for å vise at den er det.

## 1. Visjon

Lesevenn er et lesestøtteverktøy som nekter å gi eleven svaret først. Der et generisk KI-verktøy tar imot en tekst og returnerer et sammendrag — altså hopper rett til produktet av lesingen og gjør selve lesingen unødvendig — fører Lesevenn eleven gjennom rekkefølgen en leselærer ville brukt: aktiver forkunnskaper før du leser, få hjelp med de vanskelige begrepene *mens* du leser, og vis til slutt at du forsto ved å forklare med egne ord til noen som følger opp svaret ditt.

Den siste delen er kjernen. En flervalgsquiz kan bestås ved gjetting, og den avslører ikke *hvor* forståelsen svikter. Lesevenn sin skriftlige fagsamtale stiller et spørsmål, leser elevens svar med egne ord, og stiller et oppfølgingsspørsmål som er utledet av det eleven faktisk skrev — mot det uklare, mot misoppfatningen, eller dypere inn i stoffet når svaret holdt. Det er den muntlige høringen i tekstform, uten avhengighet av tale-til-tekst.

For elever med norsk som andrespråk gjør Lesevenn én ting til, og gjør den bevisst begrenset: morsmålet brukes som *inngang* til den norske fagteksten, ikke som omvei rundt den. Aktiveringssiden og den avsluttende oppsummeringen kan vises på elevens morsmål, og vanskelige fagbegreper og språklige bilder pekes ut spesifikt — men den norske teksten er alltid til stede, og det norske fagbegrepet står alltid sammen med oversettelsen. Målet er at eleven skal komme videre i norsk fagspråk, ikke slutte å møte det.

## 2. Målbruker

### 2.1 Jobber som skal gjøres

**Eleven (primær):**
- Komme gjennom en fagtekst med faktisk forståelse, ikke bare ha vært innom den.
- Forstå fagordene uten å måtte slå opp hvert enkelt et annet sted og miste tråden.
- Finne ut om forståelsen holder *før* prøven, ikke etter.
- Kunne forklare stoffet med egne ord — ferdigheten prøven faktisk måler.
- Slippe skammen i å ikke forstå: spørre igjen, så mange ganger man trenger, uten at noen ser på.
- For flerspråklige elever: få tak i hva teksten handler om uten å stoppe på det første ukjente ordet.

**Læreren (sekundær):**
- Kunne peke elever til et verktøy de klarer å bruke selvstendig, uten å lage individuelt tilpasset lesestøtte for hver tekst.

**Utvikleren (jobben som betaler for de andre):**
- Levere en app som virker, og en dokumentasjon som viser hvordan KI ble brukt i utviklingen og hvordan koden og det KI-genererte innholdet ble kvalitetssikret. Begge deler vurderes, med henholdsvis 70 og 30 prosents vekt.

### 2.2 Ikke-brukere i v1

- **Læreren som innlogget bruker.** Læreren er en talsperson i v1, ikke en bruker: det finnes ingen lærerpålogging, ingen klasseoversikt og ingen innsyn i elevens resultater. Bruker læreren Lesevenn, er det som elev.
- **Elever på ungdomstrinnet og yngre.** Tekstlengde, fagspråk og lesenivå er dimensjonert for **videregående, Vg1–Vg3, altså elever mellom 15 og 19 år**. Ingenting sperrer en tiendeklassing ute, men Gullsettene inneholder ingen ungdomsskoletekster, og prosjektet gjør derfor ingen kvalitetspåstand for det nivået. `[ANTAKELSE: det er videregåendetekster som brukes i testing og demo. Skulle målgruppen flyttes ned igjen, må Gullsettene annoteres på nytt — nivået sitter i annoteringen, ikke i koden.]`
- **Elever uten noe norsk i det hele tatt.** Morsmålsstøtten er en bro inn i den norske teksten, ikke en oversettelse av hele opplevelsen. Uten grunnleggende norsk gir kjerneløypen lite.
- **Skoler som institusjon.** Ingen Feide-innlogging, ingen databehandleravtale, ingen administrasjon. `[ANTAKELSE: bruk i v1 er utviklerens egen testing og frivillige testbrukere som samtykker — ikke drift i en reell klasse med reelle elevdata. Dette holder personvernkravene håndterbare innenfor semesteret.]`

### 2.3 Sentrale brukerreiser

> **UJ-1. Jonas kommer seg gjennom naturfagteksten han har utsatt i tre dager.**
> Jonas går Vg1 bygg- og anleggsteknikk og er 16 år. Han valgte yrkesfag fordi han lærer best med hendene, men naturfag er fellesfag og må bestås. Han leser tregt, og lærebokas kapittel om celledeling er fire sider med ord han ikke kjenner. Han er innlogget fra forrige gang. Han limer inn teksten fra den digitale læreboka, og får først bare overskriftene tilbake til kontroll — «Celledeling», «Mitose», «Når delingen går galt». De ser riktige ut, han trykker videre. Aktiveringssiden viser de samme overskriftene og ber han skrive kort hva han tror teksten handler om; brødteksten har han ennå ikke sett. Han skriver tre setninger, og de er halvveis feil, men det er poenget. Så får han hele den uttrukne teksten til gjennomsyn, retter en linje som havnet på feil sted, og godkjenner. Nå leser han teksten med fjorten fagbegreper markert; han holder pekeren over «mitose» og får forklaringen uten å forlate siden. Til slutt tar han quizen: seks av åtte riktig, og for de to feil får han se hvilket avsnitt svaret sto i.
> **Klimaks:** han lukker fanen og vet hva mitose er — ikke fordi appen fortalte ham det, men fordi han leste det og ble sjekket på det.
> **Etterpå:** teksten ligger lagret på kontoen med resultatet. Øvekortene med de fjorten begrepene er klare til repetisjon kvelden før prøven.
> **Kanttilfelle:** Jonas prøvde først å laste opp et PDF-utsnitt læreren hadde delt. Det var en skanning uten tekstlag, og Lesevenn sa det rett ut — at filen ser ut til å være et bilde av en tekst, at Lesevenn ikke kan lese bilder, og at han kan lime inn teksten i stedet. Han limte inn.

> **UJ-2. Oksana leser samfunnsfag på norsk, men kommer inn i teksten på ukrainsk.**
> Oksana går Vg2 studiespesialiserende og er 17 år. Hun kom til Norge i 2023, leser norsk godt nok til å følge undervisningen, men fagtekst om «maktfordelingsprinsippet» stopper henne før hun har begynt. Hun laster opp PDF-en, velger ukrainsk som morsmål, og får aktiveringssiden med overskriftene på både norsk og ukrainsk — kyrillisk og latinsk skrift side om side, med skriftsnitt som dekker begge. Hun skriver forkunnskapene sine på norsk, fordi det er norsk hun øver på. I lesevisningen er fagbegrepene markert, og for hvert av dem står den ukrainske forklaringen med det norske ordet i parentes rett etter. To språklige bilder er pekt ut spesielt — «statsmaktene er tredelt» er ikke tre stater — og tre ord fra akademisk allmennspråk hun hadde lest forbi uten å stoppe: «forutsetning», «henholdsvis», «på bakgrunn av». Etter quizen får hun en kort oppsummering på ukrainsk, med den norske ved siden av.
> **Klimaks:** hun har lest en norsk fagtekst, ikke en ukrainsk oversettelse av den, og hun kan de norske ordene hun trenger på prøven.
> **Etterpå:** kontoen husker at hun vil ha ukrainsk, så hun velger ikke på nytt neste gang.
> **Kanttilfelle:** sidemannen hennes velger arabisk. Han får samme flyt, med arabisk gjengitt høyre-til-venstre og norsk ved siden av — men med en synlig merknad om at oversettelsen ikke er kvalitetssikret, fordi ingen har kontrollert den (FR-24). Merknaden er ikke en unnskyldning; den er forskjellen mellom å vite og å tro.

> **UJ-3. Jonas blir tatt i å ha misforstått, og oppdager det selv.**
> Kvelden før prøven går Jonas inn i fagsamtalen i stedet for quizen. Lesevenn spør hva som skjer med kromosomene under mitose. Han svarer at «de blir delt i to så det blir halvparten så mange i hver celle». Det er en klassisk sammenblanding av mitose og meiose, og Lesevenn plukker den opp: i stedet for å si «feil», spør den om han kan se på avsnittet om kopiering før delingen, og hva som skjer med antallet der. Han leser om, svarer igjen, og treffer denne gangen. Neste spørsmål går videre til noe nytt, ikke tilbake til det samme.
> **Klimaks:** han fant feilen selv, med et spørsmål som pekte på den. Det er forskjellen fra en quiz som bare sier rødt.
> **Etterpå:** samtalen ligger lagret. Han ser i ettertid at det var én misoppfatning, og hvilken.

> **UJ-4. Maria har bare papirboka, og kommer i gang likevel.**
> Maria går Vg1 helse- og oppvekstfag. Læreboka i naturfag er på papir, og skolens digitale utgave lar henne ikke markere tekst. Fram til nå har det betydd at verktøy som Lesevenn har vært utenfor rekkevidde for henne. Hun legger boka flatt på pulten, tar to bilder med telefonen — én side per bilde — og laster dem opp. Lesevenn sier tydelig at teksten er lest ut av et bilde, at det ofte blir feil, og at hun bør lese ekstra nøye gjennom. Hun kontrollerer overskriftene i første steg, skriver forkunnskapene sine, og får så den uttrukne brødteksten til gjennomsyn. Tre linjer har havnet i feil rekkefølge der bildet bøyde seg mot bokryggen; hun flytter dem, sletter et sidetall som kom med, og godkjenner.
> **Klimaks:** hun leser en tekst hun selv fotograferte, med fagbegrepene markert — og hun oppdaget og rettet feilene selv, fordi appen ba henne om det framfor å late som uttrekket var perfekt.
> **Etterpå:** bildene er slettet. Det er teksten som ligger lagret, ikke fotografiene av boka.
> **Kanttilfelle:** hadde bildet vært for mørkt til å lese noe av, ville hun fått BF-1 — «det ble ikke funnet tekst i dette bildet» — med oppfordring om å prøve i bedre lys, eller lime inn teksten hvis hun har den et annet sted.

## 3. Ordliste

Termene under brukes ordrett i resten av dokumentet. Synonymer er en disiplinbrist, ikke en stilistisk variasjon.

- **Tekst** — én sammenhengende fagtekst eleven har lagt inn, enten limt inn eller hentet ut fra en PDF. Bærer tittel, brødtekst, overskrifter, Begrepssett og alle genererte elementer. Eies av én konto.
- **Råtekst** — tegnstrengen slik den forelå etter innliming eller PDF-uttrekk, før eleven eventuelt rettet den. Bevares ved siden av den redigerte teksten, fordi avviket mellom de to er dokumentasjon på hvor godt uttrekket virket.
- **Kjerneløype** — den faste sekvensen Aktivering → Lesevisning → Quiz. Tekstgjennomsynets fase 3b (FR-3) ligger mellom Aktivering og Lesevisning, men er et innlesingssteg og ikke et ledd i løypen. Fagsamtale, Øvekort, Minnevers og morsmålsstøtte henger på løypen, men er ikke ledd i den.
- **Aktivering** — første steg: overskriftene vises, og eleven skriver kort hva teksten sannsynligvis handler om, før brødteksten er tilgjengelig.
- **Lesevisning** — Teksten vist for lesing, med Faguttrykk markert inline og forklaring tilgjengelig uten at eleven forlater siden.
- **Faguttrykk** — et ord eller uttrykk hvis betydning er spesifikk for Tekstens fagområde, og som en elev på videregående rimeligvis ikke kjenner. Gjelder like fullt akademisk fagspråk («mitose», «tektonisk plate», «allegori») og praksisnær yrkesfagterminologi («bæreevne», «sveisefuge», «hygieneforskrift») — begge programområder er målgruppe, og et uttrykk er ikke mindre et Faguttrykk fordi det hører i et verksted framfor et laboratorium. Ikke allment akademisk språk («faktor», «prosess», «utvikling»), ikke egennavn med mindre de bærer argumentet, ikke tall eller datoer.
- **Begrepssett** — de Faguttrykkene Lesevenn har utvunnet fra én Tekst, hvert med en forklaring og en Viktighetsrangering. Ferdig kappet til tetthetsgrensene ved uttrekk. Én kilde, mange bruk: Lesevisningens markeringer, Øvekortene og Minneverset kommer alle fra Begrepssettet, aldri fra separate uttrekk.
- **Viktighetsrangering** — intern sorteringsnøkkel på hvert Faguttrykk, som uttrykker hvor sentralt det er for Tekstens argument. Bestemmer hva som faller ut når tetthetsgrensene kapper Begrepssettet. Vises ikke til eleven og er ikke en kvalitetspåstand.
- **Akademisk allmennspråk** — ord som ikke hører til noe enkelt fag, men til skriftlig fagspråk generelt («forutsetning», «tilsvarende», «henholdsvis»). Ikke Faguttrykk, og med vilje utenfor Begrepssettet — men utpekt for elever med valgt Morsmål (FR-27), fordi det er disse ordene en andrespråksleser stopper på uten at en morsmålsbruker merker det.
- **Quiz** — et generert sett spørsmål om én Tekst, med automatisk retting og henvisning tilbake til Kildeavsnittet.
- **Kildeavsnitt** — det avsnittet i Teksten som et generert element (Quiz-spørsmål, Samtalespørsmål, forklaring av et Faguttrykk) er forankret i. Hvert generert element har ett.
- **Øvekort** — ett kort per Faguttrykk i Begrepssettet: uttrykket på forsiden, forklaringen på baksiden.
- **Fagsamtale** — en skriftlig dialogrunde om én Tekst. Lesevenn stiller et Samtalespørsmål, eleven svarer med egne ord, svaret får en Svarvurdering, og neste Samtalespørsmål utledes av den.
- **Samtalespørsmål** — ett spørsmål i en Fagsamtale. Må kunne besvares fra Teksten alene.
- **Svarvurdering** — klassifiseringen av ett elevsvar i én av fem tilstander (Dekkende, Delvis, Misoppfatning, Uklart, Utenfor), med én setnings begrunnelse. Vises til eleven. Er aldri en karakter.
- **Morsmål** — språket eleven har valgt for morsmålsstøtte. Enten et Kvalitetssikret språk eller et Modellstøttet språk.
- **Kvalitetssikret språk** — et Morsmål utvikleren har målt oversettelseskvaliteten for mot Gullsettet i §4.7, og som derfor vises uten forbehold.
- **Modellstøttet språk** — et Morsmål språkmodellen håndterer, men som ikke er målt. Vises alltid med synlig merknad om at kvaliteten ikke er kontrollert.
- **Minnevers** — et kort rim eller vers som knytter sammen Faguttrykk fra Begrepssettet, til pugging. Alternativt en ferdig formulert Suno-prompt eleven kan bruke i et eksternt verktøy.
- **Mappe** — en samling av to eller flere Tekster med én felles Quiz eller Fagsamtale. *Utsatt til etter v1 (§4.9); termen står her fordi den er referert i videreføringen.*
- **Gullsett** — et testsett utvikleren har annotert manuelt, som KI-utdata måles mot. Hver måleterskel i dokumentet peker til et Gullsett.
- **KI-logg** — den løpende loggen over hvordan KI ble brukt under *utviklingen* av Lesevenn. Skilles fra Promptregisteret, som gjelder appens egne kjøretidsprompter.
- **Promptregister** — de versjonerte promptene appen selv sender til språkmodellen under kjøring, med måleresultat per versjon.

## 4. Funksjoner

### 4.1 Innlesing av tekst

**Beskrivelse:** Eleven får teksten inn på tre veier: liming i et tekstfelt, opplasting av PDF med tekstlag, eller bilder av boksider (FR-44). Alle tre ender på samme sted — et redigerbart gjennomsyn av Råteksten, delt i to faser rundt Aktiveringen (FR-3) — og det er det viktigste designvalget i hele funksjonen. PDF-uttrekk feiler på mange måter, og noen av dem er umulige å oppdage automatisk: en tekst med to spalter kan trekkes ut i feil leserekkefølge og fortsatt se ut som gyldig norsk. Ved å vise uttrekket og la eleven rette det, gjøres hver parsefeil synlig og rettbar i stedet for at den forplanter seg stille inn i markeringer, quiz og fagsamtale. Realiserer UJ-1, UJ-2, UJ-4.

Den andre gjennomgående regelen: **ingen feiltilstand er en blindvei.** Hver feil sier på vanlig norsk hva som gikk galt, hvorfor, og minst én konkret ting eleven kan gjøre videre.

**Funksjonskrav:**

#### FR-1: Innliming av tekst

Eleven kan lime inn eller skrive tekst i et felt og starte Kjerneløypen fra den.

**Konsekvenser (testbare):**
- Tekst under 400 tegn avvises med begrunnelse: Kjerneløypen trenger nok tekst til å gi overskrifter, Begrepssett og Quiz. Antall tegn som mangler oppgis.
- Tekst over **8 000 tegn** avvises ikke stille. Eleven får valget mellom å bruke de første 8 000 tegnene, med kuttpunktet synlig markert, eller å dele teksten i flere Tekster. Grensen er satt til 8 000 og ikke høyere fordi Gullsettene i §4.3 og §4.4 består av tekster på 1 500–6 000 tegn: en øvre grense på 25 000 ville betydd at appen leverer i et lengderegime fire ganger utenfor det som faktisk er målt, og da gjelder ikke tersklene for det eleven møter. 8 000 ligger like over det lengste målte, som er så langt utenfor målingen det er forsvarlig å gå.
- Tekst blir aldri forkortet uten at eleven har sett og godtatt hvor kuttet går.
- Eleven kan gi Teksten en tittel; står feltet tomt, foreslås første overskrift eller første setning.

#### FR-2: Opplasting og uttrekk av PDF

Eleven kan laste opp en PDF-fil, og Lesevenn trekker ut brødteksten som Råtekst.

**Uttrekket skjer i nettleseren, ikke på serveren.** PDF-filen forlater aldri elevens maskin — bare den uttrukne teksten sendes videre. Det er en styrking av personvernet framfor en teknisk detalj: en opphavsrettsbeskyttet lærebokfil blir aldri overført noe sted, og §6.3 sin begrensning av eksponering blir sterkere enn den kunne blitt med opplasting. Det fjerner samtidig en reell hindring, siden en serverfunksjon hos leverandøren tar imot høyst 4,5 MB i en forespørsel, mens grensen under er 10 MB.

**Konsekvenser (testbare):**
- Filer over 10 MB eller 40 sider avvises før uttrekk, med faktisk størrelse og grensen oppgitt. Grensen handler nå om nettleserens minne og om at eleven ikke skal sitte og vente, ikke om overføring — den gjelder derfor i klienten.
- Uttrekket opphever bindestreksdeling over linjeskift **så langt en enkel regel rekker**: slå sammen når tegnet før bindestreken og tegnet etter linjeskiftet begge er små bokstaver, behold bindestreken når én av sidene starter med stor bokstav eller et siffer. Regelen gir «informa-» + «sjon» → «informasjon», og bevarer «KI-assistert», «e-post» og «20-åring».
- **Dette er en kjent og bevisst begrensning, ikke et løst problem.** Regelen treffer ikke sammensatte ord med reell bindestrek der begge sider er små bokstaver. Å avgjøre de tilfellene pålitelig krever en norsk ordliste som kan si om den sammenslåtte formen er et ord, og den avhengigheten er valgt bort i v1. Restfeilene fanges av gjennomsynet i FR-3 fase 3b, der eleven ser «informa- sjon» og retter den selv.
- Begrensningen er verdt å forstå fordi den møter verbatim-kravet i FR-7: et feilaktig sammenslått ord finnes ikke i teksten eleven leser, så det ville blitt forkastet som Faguttrykk. Feilen gir altså tapt dekning, ikke oppdiktede begreper — den mildeste av de to feilretningene.
- Linjer som gjentas på mer enn halvparten av sidene fjernes som topp-/bunntekst. Fjernede linjer er synlige for eleven i gjennomsynet, ikke slettet i det skjulte.
- Uttrekket fullføres eller feiler innen 20 sekunder for en fil innenfor grensene. Feiler det i nettleseren, får eleven melding med prøv-igjen-knapp, og filen er fortsatt valgt. Det finnes ikke noe serverkall å time ut her.

#### FR-3: Gjennomsyn og retting av Råtekst, i to faser

Gjennomsynet er delt i to, og de to fasene ligger på hver sin side av Aktiveringen.

| Fase | Når | Hva eleven ser | Hvorfor der |
|---|---|---|---|
| **3a — Overskriftskontroll** | Rett etter innlesing, før Aktivering | Bare de uttrukne overskriftene, redigerbare | Aktiveringen trenger riktige overskrifter, og bare dem |
| **3b — Tekstgjennomsyn** | Etter Aktivering, før Lesevisning | Hele den uttrukne teksten, redigerbar | Her rettes parsefeil, før Begrepssettet genereres |

**Hvorfor delt.** Et tidligere utkast la hele gjennomsynet før Aktiveringen. Det ødela Aktiveringen: FR-5 holder brødteksten skjult med vilje, fordi gjetningen skal skje før lesingen — men et gjennomsyn av hele teksten rett i forveien hadde alt vist eleven nettopp det FR-5 skjuler. Vernet var illusorisk. Ved å dele steget får Aktiveringen sin forutsetning tilbake, og parsefeil rettes fortsatt før noe genereres.

**Konsekvenser (testbare):**
- Ingen av fasene kan hoppes over, heller ikke for innlimt tekst. `[ANTAKELSE: friksjonen er verdt det — to korte bekreftelser veier mindre enn en hel løype bygget på feil leserekkefølge. Prøves på testbrukeren i SM-10.]`
- I fase 3a vises **bare** overskriftene. Brødteksten er ikke tilgjengelig, verken synlig eller i sidens kildekode — samme krav som i FR-5.
- Eleven kan i fase 3a rette, legge til, slette og omordne overskrifter. Fant uttrekket ingen overskrifter, opprettes de genererte etikettene fra FR-5 her, og eleven kan endre dem.
- I fase 3b kan eleven redigere brødteksten fritt: slette, omorganisere, skrive inn manglende tekst.
- Ved PDF-uttrekk vises en tellet oppsummering av hva som ble gjort: antall sider lest, antall linjer fjernet som topp-/bunntekst, antall bindestreksdelinger slått sammen.
- Råteksten lagres uendret ved siden av den redigerte teksten.
- **Teksten låses når eleven godkjenner fase 3b.** Etter godkjenning kan brødteksten ikke redigeres videre; vil eleven endre noe, lager hun en ny Tekst. Begrepssettet (FR-7) genereres først etter låsen, aldri før. Grunnen er at Kildeavsnitt (§3) peker inn i den godkjente teksten, og alt generert innhold — markeringer, quizspørsmål, samtalespørsmål, øvekort — henger på de henvisningene. En redigering etter generering ville flyttet dem stille, slik at forklaringen peker på et annet avsnitt enn det den forklarer. Låsen er derfor ikke en begrensning, men det som gjør forankringskravet i §5 sant over tid.
- Inneholder Råteksten tabeller eller formler, varsles eleven om at slikt innhold sjelden overlever uttrekk, med oppfordring om å se særlig etter det.

#### FR-4: Navngitte feiltilstander for PDF

Hver feiltilstand under har sin egen melding og sin egen anbefalte handling. Ingen av dem viser et teknisk feilspor, og ingen av dem viser en generisk «noe gikk galt».

**Konsekvenser (testbare):**

| # | Feiltilstand | Hvordan den oppdages | Hva eleven ser og kan gjøre |
|---|---|---|---|
| PF-1 | Skannet PDF uten tekstlag | Under 100 tegn uttrukket per side i snitt | «Filen ser ut til å være et bilde av en tekst.» → ta bilder av sidene i stedet (FR-44), eller lim inn teksten. Lesevenn leser ikke bilder inne i en PDF |
| PF-2 | Passordbeskyttet fil | Feil ved åpning | «Filen er låst med passord.» → åpne den i en PDF-leser, lagre uten passord, eller lim inn. |
| PF-3 | Ødelagt fil, eller ikke en PDF | Parsefeil eller feil filsignatur | «Filen kunne ikke åpnes som PDF.» → kontroller filen, eller lim inn. |
| PF-4 | Flerspaltet tekst i feil rekkefølge | Oppdages ikke automatisk | Fanges av FR-3. Gjennomsynet nevner eksplisitt at spaltetekst kan komme i feil rekkefølge, og at eleven bør lese gjennom rekkefølgen. |
| PF-5 | For lang fil | Sidetall eller tegntall over grensen | Faktisk størrelse og grensen oppgis → bruk begynnelsen, eller del filen i flere opplastinger. |
| PF-6 | Nesten ingen tekst uttrukket, men ikke en skanning | Under 400 tegn totalt | «Det ble funnet for lite tekst i filen til å lage en leseløype.» → lim inn, eller velg en annen fil. |
| PF-7 | Tidsavbrudd eller tjenerfeil under uttrekk | Unntak eller tidsavbrudd | Ett automatisk nytt forsøk, deretter melding med prøv-igjen-knapp. Eleven mister ikke filen. |

- Hver av PF-1 til PF-7 har en reproduserbar test med tilhørende testfil i repoet. Testen sjekker at riktig melding vises, og at den anbefalte handlingen faktisk er tilgjengelig i grensesnittet.
- **Skanning er ikke enten-eller, og PF-1 fanger bare den ene halvparten.** Mange skannere og kopimaskiner kjører tekstgjenkjenning automatisk og lagrer «søkbar PDF». En slik fil *har* et tekstlag, av varierende kvalitet, og passerer derfor PF-1-sjekken og går rett inn i løypen med mulig rotete tekst. Det er ingen egen feiltilstand, fordi det ikke kan skilles fra en dårlig satt PDF — og det trenger det ikke, siden gjennomsynet i FR-3 fase 3b er nettopp dit slike feil havner. Men det er verdt å vite at terskelen på 100 tegn per side skiller mellom «ingen tekst» og «noe tekst», ikke mellom «skannet» og «digital».

**Utenfor dette FR-et:**
- Tekstgjenkjenning av skannede PDF-er. Bilder håndteres i stedet av FR-44.
- Innlesing fra URL.


#### FR-44: Bildeinnlesing av boksider

Eleven kan laste opp ett eller flere bilder av en boksides tekst, og Lesevenn henter ut teksten som Råtekst.

**Hvorfor dette er i v1.** En stor del av målgruppen har papirbok, eller nettbok som sperrer for markering og kopiering. Uten en bildeinngang er ikke appen tungvint for dem — den er ubrukelig, og da løser den en smalere oppgave enn §1 påstår. `[ANTAKELSE: at en stor del av målgruppen mangler brukbar kopiering er opplyst av utvikleren, ikke tallfestet. Holder det ikke, er bildeinngangen mindre viktig enn Mapper var, og byttet i §4.9 var feil.]` Uttrekket gjøres med den samme multimodale språkmodellen appen alt bruker til alt annet: det er ett API-kall med en bildeblokk, ikke en ny integrasjon, og gjennomsynet i FR-3 fase 3b er allerede sikkerhetsnettet et usikkert uttrekk trenger.

**Konsekvenser (testbare):**
- Støttede formater er JPEG, PNG og HEIC. Høyst **fire bilder** per Tekst. Eleven kan velge et bilde av vilkårlig størrelse fra kameraet sitt; det er hva som *sendes* som er begrenset.
- **Bildet krympes i nettleseren før det sendes.** Skalering til høyst 2 000 piksler bredde og JPEG-kvalitet rundt 85 holder teksten på en boksides fullt lesbar for modellen, og bringer en typisk sides fra flere megabyte ned under én. Kravet finnes av tre grunner samtidig: leverandørens serverfunksjon tar imot høyst 4,5 MB i en forespørsel, et stort bilde koster mer i tokens uten å gi bedre uttrekk, og mindre data som forlater elevens maskin er bedre for §6.3.
- **Ett bilde per forespørsel**, ikke fire i én. Hver forespørsel holder seg under **4 MB** — en margin under leverandørens grense framfor å ligge på den. Eleven får samtidig framdrift per bilde framfor én lang venting uten tegn til liv.
- Flere bilder tolkes som sider i rekkefølge, og eleven kan endre rekkefølgen før uttrekket kjøres.
- Uttrukket tekst går inn i samme løype som alt annet: fase 3a for overskrifter, Aktivering, fase 3b for brødtekst (FR-3). Ingen snarvei forbi gjennomsynet.
- Bildene **lagres ikke** etter at uttrekket er godkjent i fase 3b. Det er Råteksten som bevares, ikke bildet. Begrunnelse i §6.2 og §6.3.
- Metadata i bildefilen (posisjon, enhet, tidspunkt) fjernes før bildet sendes videre.
- Eleven får se en påminnelse om å fotografere bare den siden hun trenger, før første opplasting.

**Navngitte feiltilstander**, etter samme regel som FR-4 — ingen blindveier, hver feil sier hva som gikk galt og hva eleven kan gjøre:

| # | Feiltilstand | Hva eleven ser |
|---|---|---|
| BF-1 | Ingen lesbar tekst funnet i bildet | «Det ble ikke funnet tekst i dette bildet.» → ta et nytt bilde i bedre lys, eller lim inn teksten |
| BF-2 | For mange bilder, eller et bilde som ikke kommer under 4 MB selv etter krymping | Faktisk antall og størrelse oppgis → fjern bilder, eller ta bildet på nytt i lavere oppløsning |
| BF-3 | Filformat som ikke støttes | Formatet oppgis, sammen med hvilke som virker |
| BF-4 | Uttrekket ga svært lite tekst (under 400 tegn totalt) | Samme grense som FR-1 → gjennomsynet vises likevel, slik at eleven kan skrive inn resten selv |
| BF-5 | Tidsavbrudd eller tjenerfeil | Ett automatisk nytt forsøk, deretter melding med prøv-igjen-knapp. Bildene beholdes |

#### FR-45: Bildeinnlesing er ikke kvalitetssikret, og sier det

Bildeinngangen leveres uten kvalitetspåstand, og det er synlig i grensesnittet.

**Konsekvenser (testbare):**
- Ved bildeinnlesing vises en merknad om at teksten er lest ut av et bilde, at det ofte blir feil, og at eleven bør lese gjennom den ekstra nøye i gjennomsynet. `[ANTAKELSE: et multimodalt modellkall leser et mobilbilde av en boksides tekst godt nok til at gjennomsynet holder som sikkerhetsnett. Bevisst ikke målt i v1.]`
- Det finnes **ikke** et Gullsett med terskler for bildeuttrekk i v1, og prosjektet påstår ingen treffsikkerhet for det. Mekanismen er den samme som for Modellstøttet språk i FR-24: en funksjon kan tilbys uten å være målt, så lenge det står hvilken av de to den er.
- Rapporten oppgir dette eksplisitt som en umålt del av leveransen, med begrunnelsen: bildeuttrekk er et sjette måleområde i et prosjekt som alt er stramt på timer, og et sjette gullsett ville gått ut over kvaliteten på de fem som finnes.
- Avviket mellom Råtekst og redigert tekst (FR-3) lagres. Over tid er det den billigste indikasjonen på hvor godt bildeuttrekket faktisk virker — ikke en måling, men et spor verdt å se på i rapporten.

**Utenfor dette FR-et:**
- Innlesing fra URL.
- Tekstgjenkjenning av en hel innskannet bok som PDF. Grensen på fire bilder er bevisst: inngangen er til noen sider eleven jobber med, ikke til å digitalisere en bok.
### 4.2 Aktivering

**Beskrivelse:** Første steg i Kjerneløypen viser Tekstens overskrifter og ber eleven skrive kort hva teksten sannsynligvis handler om. Brødteksten er ikke tilgjengelig her — hele poenget er at gjetningen skjer før lesingen, og verdien forsvinner dersom eleven kan kikke. Aktiveringssvaret vurderes ikke og rettes ikke; det finnes ingen feil svar på et spørsmål om hva man tror. Realiserer UJ-1, UJ-2, UJ-4.

**Funksjonskrav:**

#### FR-5: Visning av overskrifter

Aktiveringssiden viser Tekstens overskrifter i dokumentrekkefølge, uten brødtekst.

**Konsekvenser (testbare):**
- Overskriftene er alt kontrollert og eventuelt rettet av eleven i fase 3a (FR-3), så Aktiveringen bygger på overskrifter eleven har godkjent.
- Har Teksten ingen gjenkjennelige overskrifter, genererer Lesevenn tre til seks korte avsnittsetiketter fra innholdet, og merker dem synlig som laget av Lesevenn og ikke hentet fra teksten.
- Brødteksten er ikke tilgjengelig fra aktiveringssiden, verken synlig eller i sidens kildekode.

#### FR-6: Elevens forkunnskapssvar

Eleven skriver fritt hva teksten sannsynligvis handler om, og går videre.

**Konsekvenser (testbare):**
- Svaret lagres på Teksten og er tilgjengelig for eleven senere i løypen, slik at gjetningen kan sammenlignes med det teksten faktisk sa.
- Svaret får ingen vurdering, ingen retting og ingen poengsum.
- Eleven kan gå videre med tomt svar etter én oppfordring om å prøve. Steget skal ikke bli en sperre for den eleven som allerede synes dette er vanskelig.

### 4.3 Begrepssett og lesevisning

**Beskrivelse:** Lesevenn utvinner Faguttrykk fra Teksten og markerer dem inline i Lesevisningen, med forklaring tilgjengelig uten at eleven forlater siden. Dette er funksjonen med størst risiko for stille kvalitetssvikt, og derfor den mest presist målte: «nøkkelorduttrekking er presis» er ikke et krav før det er tall. Seksjonen definerer både hva som *skal* markeres (§3, Faguttrykk) og hvor godt det må treffe (FR-8).

To feilmåter er like alvorlige og trekker i motsatt retning. Markerer Lesevenn for lite, står eleven fortsatt fast på ordene som stoppet henne. Markerer Lesevenn for mye, blir siden et gult teppe og markeringen mister all informasjonsverdi — og det er den lettere feilen å gjøre med en språkmodell som gjerne vil være hjelpsom. Derfor har FR-9 et hardt tetthetstak, og §10 har en motmetrikk som sier rett ut at flere markeringer ikke er bedre. Realiserer UJ-1, UJ-2, UJ-4.

**Funksjonskrav:**

#### FR-7: Uttrekk av Faguttrykk

Lesevenn utvinner et Begrepssett fra Teksten: Faguttrykk med forklaring og Kildeavsnitt.

**Konsekvenser (testbare):**
- Hvert Faguttrykk forekommer ordrett i Teksten. Ingen oppdiktede uttrykk. Måles maskinelt som delstrengsjekk: **100 prosent**, uten unntak — et Faguttrykk som ikke består sjekken, kastes før visning.
- Hvert Faguttrykk har en forklaring på maksimalt to setninger, skrevet for en elev på videregående.
- Ingen forklaring er sirkulær: forklaringen kan ikke bestå utelukkende av uttrykket selv med bøyninger eller ordklasseendring. Måles maskinelt: **100 prosent**.
- Hvert Faguttrykk har ett Kildeavsnitt, slik at eleven kan se hvor i teksten det står.
- Hvert Faguttrykk har en **viktighetsrangering** satt ved uttrekk, som uttrykker hvor sentralt uttrykket er for Tekstens argument.
- Begrepssettet kappes til tetthetsgrensene **ved uttrekk**, ikke ved visning: høyst **4 prosent** av Tekstens løpende ord, høyst **12 unike Faguttrykk per 1 000 ord**, og høyst **3 markeringer per 100 sammenhengende ord** — det siste fordi et snitt over hele teksten kan skjule at ett avsnitt er fullstendig nedlesset. For korte tekster gjelder at **inntil 5 Faguttrykk** kan beholdes selv om det bryter prosentgrensen, slik at en kort tekst ikke ender med ett markert ord.

- **Det finnes ingen nedre grense, og det er viktig.** Formuleringen er «inntil 5», ikke «minst 5». Et gulv ville tvunget Lesevenn til å finne fem Faguttrykk i en tekst som ikke har fem — og da ville modellen funnet dem opp. Det bryter verbatim-kravet over, ødelegger presisjonsmålingen i FR-8, og er akkurat feilen en hjelpsom språkmodell er tilbøyelig til å gjøre. Finner uttrekket tre Faguttrykk, er Begrepssettet tre. Finner det null, er det null.
- **Tomt eller tynt Begrepssett sies rett ut.** Finner uttrekket ingen eller nesten ingen Faguttrykk, viser Lesevenn det som et faktum — «det ble ikke funnet fagbegreper i denne teksten» — og lar eleven gå videre i Kjerneløypen uten markeringer. Øvekort tilbys da ikke, fordi det ikke finnes noe å lage kort av. Funksjonen degraderer ærlig framfor å produsere noe for å ha noe å vise.
- **Mykt varsel ved tekst som ikke ser ut som fagtekst.** Er Begrepssettet tomt eller nær tomt, og teksten i tillegg har trekk som peker bort fra fagtekst — svært korte setninger, replikkmarkører, listepreg — vises et ikke-blokkerende varsel om at teksten ikke ser ut som en fagtekst, med mulighet for å fortsette likevel. Varselet er en opplysning, ikke en sperre: en feilklassifisert fagtekst skal aldri låse eleven ute, og terskelen kan ikke finjusteres uten data Lesevenn ikke har.
- Tallene er strammet bevisst. En tidligere versjon av dette kravet hadde 8 prosent og 25 per 1 000 ord, og den grensen ville aldri slått inn: UJ-1 beskriver fjorten uttrykk i fire sider, altså langt under taket. Et tak som ikke binder er ikke et vern mot det gule teppet, bare en påstand om å ha ett. Se motmetrikk SM-C1.
- Lavest rangerte uttrykk faller ut først. Kappingen skjer én gang, her — det lagrede Begrepssettet er det ferdig kappede settet, slik at Lesevisningen (FR-9) og Øvekortene (FR-16) viser nøyaktig samme sett og avviksstesten i FR-16 holder.
- Viktighetsrangeringen er en intern sorteringsnøkkel, ikke en kvalitetspåstand. Den rapporteres ikke til eleven og brukes ikke som dokumentasjon på at uttrekket er godt — det ville vært SM-C4-brudd. Bare målingen i FR-8 sier noe om kvalitet.

#### FR-8: Måling av treffsikkerhet mot Gullsett

Uttrekkets kvalitet måles mot et manuelt annotert Gullsett, og tallene er en leveranse — ikke en intern sjekk.

**Konsekvenser (testbare):**
- Gullsettet er **seks Tekster** på **videregående nivå (Vg1–Vg3)**, hver på 1 500–6 000 tegn, fullt krysset mellom tre fellesfag og begge programområder:

| | Studiespesialiserende | Yrkesfag |
|---|---|---|
| **Naturfag** | 1 tekst | 1 tekst |
| **Samfunnsfag** | 1 tekst | 1 tekst |
| **Norsk** | 1 tekst | 1 tekst |

- Krysningen er grunnen til at det er nettopp seks tekster og ikke fem eller sju. Alle tre er fellesfag i begge programområder, men lærebøkene er ikke de samme: yrkesfaglige fagtekster har kortere setninger og mer praksisnær terminologi, studiespesialiserende har mer abstrakt og akademisk fagspråk. Et uttrekk som er kalibrert på bare den ene typen vil sannsynligvis treffe dårligere på den andre, og det er verdt å vite *før* det oppdages av en elev.
- Utvikleren annoterer manuelt hvilke uttrykk som *skulle* vært markert, før uttrekket kjøres.
- **Fordelingen per programområde rapporteres, men har ingen terskel.** Med én tekst per celle er tallet per celle en observasjon, ikke en måling. Det er nok til å se en systematisk forskjell om den er stor, og det er alt det påstås å være. Samme regel som for fag.
- **Gjenkalling ≥ 0,75** — minst tre av fire uttrykk i Gullsettet blir funnet.
- **Presisjon ≥ 0,70** — høyst tre av ti markerte uttrykk er støy.
- **Egen annoteringsstøy måles først.** To av de seks Tekstene annoteres to ganger, med minst sju dagers mellomrom, og samsvaret mellom de to egne annoteringene rapporteres (Cohens κ). Dette koster om lag én time og er den billigste enkeltmålingen i hele dokumentet: uten den vet ikke utvikleren om presisjon 0,70 ligger over eller under sin egen annoteringsusikkerhet, og da betyr tallet ingenting. Er κ lav, er det funnet — ikke noe å skjule.
- **Ingen terskel per fag.** Med seks tekster er det om lag 20 annoterte uttrykk per fag, og konfidensintervallet for gjenkalling er da rundt ±0,19 — for bredt til å skille et godt fag fra et dårlig. Fordelingen per fag *rapporteres* fortsatt, som beskrivelse og som råstoff til skjevhetsdrøftingen i FR-42, men den er ikke en bestått/ikke bestått-grense.
- **Forklaringenes riktighet:** utvikleren vurderer manuelt om forklaringen til hvert Faguttrykk i Gullsettet er faglig riktig og i samsvar med Kildeavsnittet. Antall gale forklaringer i det som vises eleven: **null**. Målingen bruker de samme seks Tekstene — annoteringen finnes alt, så dette er vurdering av utdata, ikke et nytt Gullsett. Begrunnelsen er at presisjon og gjenkalling bare måler *hvilke* uttrykk som ble funnet, ikke om det som står om dem er sant: forklaringene er nettopp det eleven pugger på Øvekortene (FR-16), og en gal forklaring pugges like godt som en riktig. Minneverset har en tilsvarende faktasjekk i FR-31, og forklaringene fortjener den mer.
- Presisjon, gjenkalling og F1 rapporteres per fag, ikke bare som snitt. Et uttrekk som er godt i naturfag og dårlig i norsk er et kjent og dokumentert funn, ikke et gjennomsnitt som skjuler det.
- Målingen kjøres på nytt for hver versjon i Promptregisteret (FR-39), og resultatene lagres per versjon.

#### FR-9: Markering i Lesevisningen

Faguttrykkene i Begrepssettet markeres inline i den løpende teksten.

**Konsekvenser (testbare):**
- **Alle** Faguttrykk i Begrepssettet markeres. Tetthetsgrensene i FR-7 — 4 prosent av løpende ord, 12 unike Faguttrykk per 1 000 ord, 3 markeringer per 100 sammenhengende ord — er allerede håndhevet ved uttrekk, så Lesevisningen kutter ingenting på egen hånd. Eleven møter dermed aldri et uttrykk på Øvekortene som ikke var markert i teksten hun leste.
- Markeringen er ikke avhengig av farge alene: farge kombineres med understreking eller annen ikke-fargebasert utheving, slik at den også virker for elever med fargesynssvekkelse.
- Teksten er lesbar som tekst: markeringen bryter ikke linjeflyt, ordmellomrom eller setningsrekkefølge.

#### FR-10: Forklaring uten å forlate siden

Eleven får forklaringen på et markert Faguttrykk uten navigasjon bort fra Lesevisningen.

**Konsekvenser (testbare):**
- Forklaringen vises på **tre** måter: ved trykk (berøring), ved pekerhvil, og ved tastaturfokus. Den lukkes med Escape, med trykk utenfor, og med lukkeknapp.
- Trykk er ikke en ettertanke. Pekerhvil finnes ikke på telefon, og §5 regner mobil som en reell flate — en forklaring som bare åpnes ved hvil er utilgjengelig for halve brukergruppen. Kravet testes på telefon, ikke bare i en smal nettleser på PC.
- Lesevisningens rulleposisjon endres ikke når en forklaring åpnes eller lukkes.

#### FR-11: Stabilitet mellom kjøringer

Samme Tekst gir i praksis samme Begrepssett.

**Konsekvenser (testbare):**
- Samme Tekst sendt inn to ganger gir **minst 0,80 overlapp** (Jaccard) i uttrekkssettet, målt over Gullsettets seks Tekster.
- Begrunnelsen er ikke estetisk: Øvekortene og Minneverset kommer fra Begrepssettet, så et ustabilt uttrekk gir et øvekortsett eleven ikke kan stole på fra en dag til den neste.
- Begrepssettet lagres på Teksten ved første kjøring og gjenbrukes deretter. Det genereres ikke på nytt ved hver visning — både for stabilitet og for kostnad.

#### FR-12: Leseinnstillinger

Eleven kan tilpasse Lesevisningen til egen lesing.

**Konsekvenser (testbare):**
- Tekststørrelse og linjeavstand kan justeres, og valget huskes på kontoen.
- Linjelengden er begrenset til om lag 70 tegn uavhengig av skjermbredde. Lange linjer er et kjent hinder for elever som strever med lesing, og dette er en lesestøtteapp.

### 4.4 Quiz

**Beskrivelse:** Siste ledd i Kjerneløypen. Quizen er et sjekkpunkt, ikke en prøve: den retter automatisk og peker tilbake i teksten når svaret var feil, slik at eleven vet hvor hun skal lese om. Den viktigste kvalitetsregelen er forankring — hvert spørsmål må kunne besvares fra Teksten alene. En språkmodell som drar inn allmennkunnskap teksten ikke nevner, tester noe annet enn leseforståelse, og gjør eleven usikker på en tekst hun faktisk hadde forstått. Realiserer UJ-1.

**Funksjonskrav:**

#### FR-13: Generering av Quiz

Lesevenn genererer en Quiz fra Teksten.

**Konsekvenser (testbare):**
- Quizen har **åtte spørsmål**, hvorav minst fem er flervalg med fire alternativer, og minst ett krever et kort skriftlig svar.
- Spørsmålene dekker Tekstens hoveddeler: ingen av Tekstens overskriftsdeler er uten minst ett spørsmål, når Teksten har fire eller færre deler.
- Quizen lagres på Teksten og gjenbrukes ved senere visning, ikke regenerert.

#### FR-14: Forankring i Teksten

Hvert Quiz-spørsmål er forankret i et Kildeavsnitt og kan besvares fra Teksten alene.

**Konsekvenser (testbare):**
- Hvert spørsmål har ett Kildeavsnitt, lagret sammen med spørsmålet.
- For flervalgsspørsmål støttes **nøyaktig ett** alternativ av Teksten, og de øvrige er verifiserbart gale ut fra Teksten — ikke bare mindre gode.
- Måles på et Gullsett av **24 genererte spørsmål** (tre Tekster × åtte spørsmål), manuelt vurdert av utvikleren: **minst 85 prosent** passerer forankringskravet. Spørsmål som feiler, forkastes og genereres på nytt før leveranse.
- Terskelen er 85 og ikke 90 fordi tallet skal kunne forsvares. Ved n = 24 er konfidensintervallet rundt en observert andel på 0,9 omtrent [0,73, 0,98] — en måling som viser 90 prosent kan i realiteten være 75. En terskel på 85 med rapportert intervall er en ærligere påstand enn 90 uten. Intervallet rapporteres sammen med andelen, ikke bare andelen.
- Antall spørsmål som krever kunnskap utenfor Teksten: **null tolerert** i det som vises eleven. Dette er en gjennomgang av leveransen, ikke en statistisk terskel — hvert spørsmål som faktisk vises eleven er sett av utvikleren. Funn under målingen dokumenteres, de skjules ikke.

#### FR-15: Retting og tilbakemelding

Eleven får svarene rettet med henvisning tilbake i Teksten.

**Konsekvenser (testbare):**
- Feil svar viser Kildeavsnittet der det riktige svaret står, ikke bare hva som var riktig.
- Resultatet vises som antall riktige av totalt, ikke som karakter, prosentkarakter eller mestringsnivå.
- Eleven kan ta quizen om igjen. Tidligere forsøk beholdes, og eleven kan se utviklingen.

### 4.5 Øvekort

**Beskrivelse:** Repetisjonsdelen, bygget på Begrepssettet og ikke på et eget uttrekk. Det er et bevisst enkelt valg: én kilde gjør at kvalitetsmålingen i FR-8 også dekker Øvekortene, og at et uttrykk eleven møtte markert i teksten er det samme uttrykket hun øver på etterpå. Realiserer UJ-1.

**Funksjonskrav:**

#### FR-16: Øvekort fra Begrepssettet

Lesevenn lager ett Øvekort per Faguttrykk i Begrepssettet.

**Konsekvenser (testbare):**
- Øvekortsettet er identisk med Begrepssettet — ingen uttrykk lagt til, ingen fjernet. En avviksstest sjekker likhet mellom de to settene.
- Er Begrepssettet tomt (FR-7), tilbys ikke Øvekort, og grunnen oppgis. Det lages ikke kort av ingenting.
- Forsiden viser Faguttrykket, baksiden forklaringen og Kildeavsnittet.

#### FR-17: Gjennomgang av Øvekort

Eleven går gjennom Øvekortene og markerer hva som satt.

**Konsekvenser (testbare):**
- Eleven kan snu kortet, gå videre og gå tilbake, og merke et kort som «kan» eller «må øve mer».
- Kort merket «må øve mer» kan vises alene i en ny runde.
- Merkingen lagres på Teksten, slik at en ny økt starter der forrige sluttet.

### 4.6 Skriftlig fagsamtale

**Beskrivelse:** Prosjektets sterkeste påstand, og derfor den som må måles hardest. Fagsamtalen stiller et Samtalespørsmål, leser elevens svar, gir en Svarvurdering og stiller et oppfølgingsspørsmål utledet av vurderingen.

Kravet fra briefen — at oppfølgingsspørsmålet er «relevant» — er ikke testbart som det står, og seksjonen bryter det ned i fire ting som er det. Det **klassifiseres**: svaret havner i én av fem navngitte tilstander, og tilstanden bestemmer hva oppfølgingen skal gjøre (FR-19). Det er **erklært**: oppfølgingen leveres med hvilket avsnitt den peker på og hvilken av de fem reglene den følger, som strukturerte felt (FR-20). Det er **avsnittstestet**: en oppfølging til en misoppfatning må peke på et *annet* avsnitt enn en oppfølging til et dekkende svar — det avsnittet som motsier nettopp den misoppfatningen (FR-21). Og det er **portvoktet**: en promptversjon som leser en misoppfatning som dekkende, tas ikke i bruk (FR-21).

Avsnittstesten er den avgjørende. Den svarer på briefens tekniske suksesskriterium — at oppfølgingsspørsmålene «faktisk reagerer på innholdet i elevens svar, ikke forhåndsdefinerte spørsmål i fast rekkefølge» — og den er ikke til å bestå ved flaks, fordi den spør hvor systemet peker og ikke hvilke ord det bruker. Et tidligere utkast målte ordforskjell mellom oppfølgingene i stedet, og kunne ikke feile; hvorfor står nederst i FR-21, og det hører i refleksjonsrapporten. Realiserer UJ-3.

**Funksjonskrav:**

#### FR-18: Start av Fagsamtale

Eleven kan starte en Fagsamtale om en Tekst hun har lest.

**Konsekvenser (testbare):**
- Første Samtalespørsmål er åpent og krever forklaring med egne ord, ikke gjenfinning av ett ord.
- Første Samtalespørsmål er forankret i et Kildeavsnitt.
- Fagsamtale er tilgjengelig som alternativ til Quiz, ikke bare etter den.

#### FR-19: Svarvurdering i fem tilstander

Hvert elevsvar klassifiseres i én av fem tilstander, og tilstanden vises til eleven med én setnings begrunnelse.

**Konsekvenser (testbare):**

| Tilstand | Betyr | Hva oppfølgingsspørsmålet må gjøre |
|---|---|---|
| **Dekkende** | Svaret treffer det spørsmålet spurte om | Gå videre til et nytt aspekt av Teksten som ikke er dekket i samtalen ennå |
| **Delvis** | Riktig så langt det rekker, men noe sentralt mangler | Peke mot det som mangler, uten å oppgi det |
| **Misoppfatning** | Svaret inneholder en feil forståelse, ikke bare et hull | Rette oppmerksomheten mot Kildeavsnittet som motsier misoppfatningen, og spørre om det |
| **Uklart** | For kort, for vagt, eller umulig å vurdere | Be om utdyping av det *konkrete* uklare uttrykket eleven brukte |
| **Utenfor** | Utenfor tema, eller «vet ikke» | Dele det opprinnelige spørsmålet i et enklere delspørsmål |

- Tilstanden er synlig for eleven, ikke bare intern. Begrunnelsen er én setning på vanlig norsk.
- Ingen tilstand vises som poeng, prosent, karakter eller mestringsnivå.

#### FR-20: Regler for oppfølgingsspørsmål

Oppfølgingsspørsmålet følger tilstandens regel i FR-19 og oppfyller fire maskinsjekkbare krav.

**Konsekvenser (testbare):**
- **Strukturert utdata.** Hver oppfølging leveres med to felt ved siden av spørsmålsteksten: `kildeavsnitt_id` — avsnittet oppfølgingen er rettet mot — og `mål`, som er én av de fem reglene i FR-19. Feltene er ikke pynt: de er det som gjør relevans målbar i FR-21 uten å måtte lese mening ut av fritekst, og §5 krever Kildeavsnitt på alt generert innhold uansett, så kostnaden er nær null.
- **Sporbarhet:** oppfølgingen inneholder minst ett innholdsord **eleven selv innførte** — altså et ord som står i elevens svar, men ikke i Samtalespørsmålet eleven svarte på. Måles maskinelt: **100 prosent**. Presiseringen er nødvendig: et krav om et ord som «finnes i elevens svar» kan innfris av et system som bare gjentar sitt eget spørsmål tilbake, siden elevens svar normalt gjenbruker spørsmålets ord.
- **Forankring:** oppfølgingen kan besvares fra Teksten alene og har et gyldig `kildeavsnitt_id`. Ingen oppfølging krever kunnskap utenfor Teksten.
- **Ingen gjentakelse:** oppfølgingen er ikke nær-identisk med noe tidligere Samtalespørsmål i samme samtale. Måles som Jaccard-overlapp under 0,6 over **innholdsord**, etter at funksjonsord er fjernet med en fast norsk stoppordliste som ligger i repoet, og etter enkel normalisering (små bokstaver, fjernet tegnsetting). Uten den presiseringen er tallet ikke reproduserbart: to helt ulike norske spørsmål på åtte ord kan komme over 0,8 på funksjonsord alene.
- **Ett spørsmål:** oppfølgingen inneholder ett spørsmål, ikke tre i samme melding.

#### FR-21: Måling av relevans mot Gullsett

Relevansen måles mot et Gullsett, dels maskinelt og dels manuelt, med to blokkerende porter.

**Konsekvenser (testbare):**
- Gullsettet er **36 tilfeller**: tre Tekster × to startspørsmål × seks svarvarianter, skrevet av utvikleren for å etterligne reelle elevsvar. Variantene er dekkende, delvis, **to ulike misoppfatninger**, uklart og utenfor. Alle fem tilstandene i FR-19 er altså dekket — en tidligere versjon av dette kravet hadde bare tre varianter, slik at Uklart og Utenfor aldri ble prøvd, og forvekslingsmatrisen ikke kunne vise nettopp de forvekslingene kravet kaller akseptable. Misoppfatning er med to ganger fordi den bærer sikkerhetsporten under, og en port med null toleranse trenger nok tilfeller å være en port over.

**Målingene, i rekkefølge etter hvor mye de betyr:**

- **Sikkerhetsport — blokkerende.** Av de tolv misoppfatningstilfellene skal **null** klassifiseres som Dekkende. Én slik feil blokkerer promptversjonen fra å tas i bruk. Begrunnelsen er den samme som FR-43 navngir som prosjektets verste feilmåte: eleven får bekreftet en gal forståelse, og går fra Lesevenn tryggere på noe som er feil enn da hun kom. Alle andre forvekslinger er å foretrekke framfor denne.
- **Binær gjenkalling for «trenger oppfølging».** Alt som ikke er Dekkende slås sammen til én klasse. Gjenkalling for den klassen **≥ 0,90**, målt over de 30 ikke-dekkende tilfellene. Dette er det grovkornede spørsmålet som faktisk betyr noe for eleven: oppdager systemet at svaret ikke holdt?
- **Måltest — maskinell.** For atten par av svarvarianter på samme startspørsmål — (dekkende, delvis), (dekkende, misoppfatning) og (uklart, utenfor) — skal feltet `mål` fra FR-20 være **ulikt** og i samsvar med FR-19-reglene. Minst **16 av 18**.
- **Avsnittstest — maskinell, og kjernen i hele kravet.** For hvert par (dekkende, misoppfatning) skal oppfølgingens `kildeavsnitt_id` være **et annet avsnitt** i misoppfatningstilfellet enn i det dekkende, og `mål` skal være «motsigende avsnitt». Alle seks par må bestå. Et skriptet system kan ikke bestå denne: den krever at systemet finner fram til avsnittet som motsier nettopp den misoppfatningen eleven viste.
- **Treff mot forhåndsvalgt avsnitt — manuell.** For hvert misoppfatningstilfelle har utvikleren på forhånd skrevet ned hvilket avsnitt som motsier misoppfatningen. Oppfølgingens `kildeavsnitt_id` treffer det avsnittet i minst **70 prosent** av tilfellene.
- **Manuell relevansvurdering.** Hver av de 36 oppfølgingene vurderes mot regelen for sin tilstand i FR-19, som relevant eller ikke. **Minst 80 prosent relevante.**
- **Femveis forvekslingsmatrise — rapporteres, ingen terskel.** Med 36 tilfeller er konfidensintervallet rundt en femveis treffandel om lag ±0,15. Det er for bredt til å bære en bestått/ikke bestått-grense, og en terskel på «75 prosent treff» ville derfor gitt et tall som ser strengere ut enn det er. Matrisen er beskrivelse og råstoff til FR-42 og FR-43, ikke en port. Portene er sikkerhetsporten og den binære gjenkallingen over.
- Alle målingene kjøres per promptversjon (FR-39) og lagres.

**Hvorfor den opprinnelige kontrafaktiske testen ble forkastet.** Første utkast av dette kravet målte at to ulike elevsvar gir oppfølginger med ordoverlapp under 0,6. Den testen var verdiløs, og på en måte som er verdt å skrive om i refleksjonsrapporten: FR-20 *pålegger* oppfølgingen å gjengi et ord eleven brukte, så to ulike svar gir automatisk to ulike strenger. «Du skrev 'X' — kan du se på avsnitt 2?» ville bestått hver gang, med samme funksjonelle spørsmål hver gang. Et krav som ikke kan feile måler ingenting. Avsnittstesten over erstatter den fordi den spør om noe systemet ikke kan late som: *hvor* det peker, ikke *hvilke ord* det bruker.

#### FR-22: Lengde og avslutning

Fagsamtalen har en øvre grense og en definert slutt.

**Konsekvenser (testbare):**
- Samtalen avsluttes etter høyst **seks runder**, eller når eleven avslutter selv.
- Ved avslutning vises en kort oppsummering: hvilke deler av Teksten som ble berørt, hvilke Svarvurderinger som falt i tilstanden Misoppfatning, med lenke til Kildeavsnittet — **og hvilke svar som ble godtatt som Dekkende**, med samme lenke.
- At det godtatte listes opp er ikke en pyntelig detalj. Sikkerhetsporten i FR-21 gjør det den kan for å hindre at en misoppfatning leses som Dekkende, men den kan ikke gjøre det umulig. Ser eleven hva som ble godtatt, får hun en siste sjanse til å oppdage selv at noe glapp — og det er det eneste vernet som virker når modellen tar feil.
- Eleven kan trykke **«jeg tror du misforsto svaret mitt»** på en hvilken som helst Svarvurdering, og få runden vurdert på nytt. Knappen er også en ærlig innrømmelse i grensesnittet av at vurderingen kan være gal.
- Samtalen lagres på Teksten og kan leses om senere.
- Grensen på seks runder er ikke et mål å fylle: en samtale kan avsluttes etter tre runder dersom Teksten er dekket. Se motmetrikk SM-C3.

#### FR-23: Tone og status som formativ

Fagsamtalen gir tilbakemelding som hjelper, og aldri noe som ser ut som en karakter.

**Konsekvenser (testbare):**
- Ingen del av Fagsamtalen produserer en poengsum, prosentandel, karakter eller nivåplassering av eleven.
- Grensesnittet sier eksplisitt at vurderingen er gjort av en språkmodell, at den kan ta feil, og at den ikke er en vurdering av eleven.
- Ved tilstanden Misoppfatning brukes ikke ordet «feil» om eleven. Oppfølgingen peker på teksten, ikke på personen.
- En gjennomgang av samtlige 36 Gullsett-svar sjekker at ingen Svarvurdering er nedvurderende eller latterliggjørende. **Null tolerert.**
- Gjennomgangen gjøres mot en **nedskrevet liste** over hva som teller som nedvurderende — ordet «feil» om eleven, ironi, «egentlig», «som du burde visst», bagatellisering — og utvikleren leser de 36 vurderingene **uten** å se hvilken tilstand de hører til. Uten det er det forfatteren av prompten som vurderer om egen prompt har god tone, og den prøven består alltid. Minst én utenforstående leser i tillegg et utvalg på tolv og svarer på om noen av dem ville truffet en sekstenåring dårlig.

### 4.7 Morsmålsstøtte

**Beskrivelse:** Prosjektets andre differensiering, og bevisst begrenset. Morsmålet er **additivt, aldri erstattende**: norsk tekst er alltid til stede, og det norske Faguttrykket står alltid i parentes etter det oversatte. Det er først og fremst et pedagogisk valg — eleven skal komme videre i norsk fagspråk, ikke slutte å møte det — men det er samtidig sikkerhetsnettet mot dårlige oversettelser. Er oversettelsen svak, står originalen rett ved siden av.

Dekningen i v1 er delt i to nivåer, fordi «oversettelsen er faglig presis» bare er en påstand man kan stå for i et språk man har målt. **V1 har ett Kvalitetssikret språk: ukrainsk.** Alle øvrige språk språkmodellen håndterer, tilbys som Modellstøttet språk med synlig forbehold.

**Det Kvalitetssikrede språket i v1 er ukrainsk.** Valget er ikke tatt fordi ukrainsk er det viktigste språket i norsk skole, men fordi det er det språket prosjektet faktisk har en kontrollkilde til: en morsmålsbruker som kan gjøre den eksterne vurderingen i FR-28. Den vurderingen er den eneste delen av oversettelsesmålingen som er reelt uavhengig, og et kvalitetssikret nivå uten den ville vært en påstand uten dekning. At tilgang til én person avgjør hva prosjektet kan påstå, er verdt å si rett ut i rapporten — det er slik kvalitetssikring faktisk fungerer når man er alene.

Ukrainsk er samtidig en rimelig gruppe å prioritere: den er blant de største nyankomne elevgruppene i norsk skole, og elever som kom i ungdomsskolealder etter 2022 er nå på videregående — altså nøyaktig målgruppen i §2.

**Arabisk bygges og demonstreres uansett**, også om et annet språk blir det kvalitetssikrede. Grunnen er teknisk og ikke pedagogisk: arabisk tvinger fram høyre-til-venstre-gjengivelse side om side med norsk, som er et faktisk krav med en faktisk løsning (FR-25), og det er den mest demonstrerbare tekniske biten i hele §4.7. Det som faller bort uten kvalitetssikret nivå, er måleforpliktelsen — ikke funksjonaliteten.

En tidligere versjon av dette kravet hadde tre kvalitetssikrede språk. Det ble kuttet fordi det bandt prosjektet til å finne tre frivillige morsmålsbrukere før M1, altså gjorde den mest usikre antakelsen i dokumentet til en forutsetning for å bli ferdig. Realiserer UJ-2.

**Funksjonskrav:**

#### FR-24: Valg av Morsmål og to dekningsnivåer

Eleven velger Morsmål fra en lukket liste med to nivåer.

**Konsekvenser (testbare):**
- **Ukrainsk** vises først, som Kvalitetssikret språk, uten forbehold — forutsatt at det består målingen i FR-28. Nivået er bestemt av målingen, ikke av at språket er valgt ut.
- Modellstøttede språk vises i samme liste, tydelig atskilt, med merknad om at kvaliteten ikke er kontrollert. Listen er lukket på om lag 15 språk; det finnes ikke fritekstfelt for språk i v1.
- Er ingen språk kvalitetssikret, finnes ikke det øverste nivået i grensesnittet i det hele tatt. Appen viser ikke en tom «kvalitetssikret»-seksjon, og den forfremmer ikke et umålt språk for å ha noe å vise.
- Valget lagres på kontoen og gjelder til eleven endrer det.
- Valgt Morsmål påvirker bare Aktivering, avsluttende oppsummering og forklaring av Faguttrykk og språklige bilder. Resten av grensesnittet er på norsk.

#### FR-25: Additiv visning

Norsk forsvinner aldri når Morsmål er valgt.

**Konsekvenser (testbare):**
- Der morsmålstekst vises, vises norsk tekst samtidig og likeverdig — ikke bak et klikk, ikke nedtonet.
- Hvert oversatt Faguttrykk har det norske uttrykket i parentes rett etter.
- For språk som skrives høyre-til-venstre gjengis morsmålsteksten med korrekt retning, uten at den norske teksten ved siden av påvirkes. Testet med arabisk.
- Ingen visning erstatter norsk tekst med morsmålstekst, i noen tilstand. En gjennomgang av samtlige skjermbilder med Morsmål aktivert bekrefter det.

#### FR-26: Aktivering og oppsummering på Morsmål

Aktiveringssiden og den avsluttende oppsummeringen kan vises på Morsmål.

**Konsekvenser (testbare):**
- Overskriftene på aktiveringssiden vises på begge språk.
- Den avsluttende oppsummeringen er høyst fem setninger, vises på begge språk, og inneholder ingen påstand som ikke står i Teksten.
- Eleven kan skrive sitt eget svar på hvilket som helst språk. Svaret oversettes ikke og vurderes ikke.

#### FR-27: Utpeking av språklige bilder og akademisk allmennspråk

Lesevenn peker ut de uttrykkene som stopper en andrespråksleser spesielt, og som Begrepssettet med vilje ikke fanger.

**Konsekvenser (testbare):**
- Utpekingen er et eget sett, atskilt fra Begrepssettet, og dekker to kategorier:
  - **Språklige bilder:** metaforer, idiomer og faste uttrykk («statsmaktene er tredelt», «å legge lokk på en debatt») som villeder om de leses bokstavelig.
  - **Akademisk allmennspråk:** ord som ikke hører til noe fag, men til skriftlig fagspråk generelt («forutsetning», «tilsvarende», «på bakgrunn av», «henholdsvis»), og som en morsmålsbruker leser forbi uten å merke det.
- Hvert utpekt uttrykk har en forklaring — for språklige bilder av den *ikke-bokstavelige* betydningen — på Morsmål og norsk.
- Høyst åtte utpekte uttrykk per 1 000 ord per kategori, av samme grunn som tetthetstaket i FR-7.
- Begrunnelsen for at dette er et eget sett og ikke en utvidelse av Faguttrykk: definisjonen av Faguttrykk i §3 utelukker akademisk allmennspråk med vilje, fordi presisjonsmålet i FR-8 blir umulig å forsvare om kategorien er alt som er vanskelig. Men det er nettopp «forutsetning» andrespråkslesen stopper på, og uten dette settet ville Lesevenn markert fagordene til den eleven som trengte de andre ordene. Kategorien er derfor knyttet til Morsmål, der behovet er, ikke til Lesevisningen for alle.

**Utenfor dette FR-et:**
- Akademisk allmennspråk markeres ikke i Lesevisningen for elever uten valgt Morsmål. `[ANTAKELSE: en morsmålsbruker på videregående trenger sjelden «henholdsvis» forklart, og markeringen ville brukt opp tetthetsbudsjettet i FR-9 på ord som ikke stopper henne. Ikke verifisert — og om det viser seg galt, er det en billig utvidelse.]`

#### FR-28: Måling av oversettelseskvalitet

Kvaliteten i Kvalitetssikrede språk måles, og det er målingen som gir språket sitt nivå.

**Konsekvenser (testbare):**
- Gullsettet er **fire Tekster** på ukrainsk, med oversatt aktiveringsside og oppsummering.
- **Primærmål — begrepsanker, maskinelt.** Minst **0,95** av Faguttrykkene i den oversatte teksten har det norske uttrykket i parentes etter seg, i uendret form. Dette er den *eneste* delen av oversettelseskvaliteten som kan måles hardt og billig, og det er samtidig den delen som bærer den pedagogiske hensikten i §1: eleven skal komme ut med det norske fagordet. Den er derfor primærmålet, ikke et støttemål.
- **Ekstern vurdering — den eneste reelle kvalitetssikringen.** Én ukrainsk morsmålsbruker vurderer de fire tekstenes oversatte oppsummering på fire punkter: er terminologien riktig, er registeret rimelig for en elev på videregående, er noe uforståelig, og er noe direkte galt. Det er om lag 30 minutter av én persons tid, og det er det eneste stedet i denne seksjonen der noen utenfor systemet faktisk ser på utdataet. Består den ikke, er språket Modellstøttet.
- **Tilbakeoversettelse — bare for tre ting.** Den oversatte oppsummeringen oversettes tilbake til norsk i et separat kall, og sammenlignes med originalen **utelukkende** for tapt nekting («ikke», «aldri», «uten»), endrede tall, og endrede egennavn. Antall avvik i disse tre kategoriene: **null**.
- **Hvorfor tilbakeoversettelse ikke kan bære mer enn det.** Et tidligere utkast brukte tilbakeoversettelse som hovedmål på faglig presisjon. Det var et brudd på prosjektets egen motmetrikk SM-C4: en modell fra samme familie som gjorde oversettelsen, gjenskaper sin egen feiloversettelse på veien tilbake, og resultatet ser riktig ut. Metoden er derfor blind for nettopp feil terminologi — det FR-28 påstår å garantere — og for alt som handler om register og flyt. Tapt nekting er det ene den faktisk fanger, fordi en utelatt negasjon ikke kan gjenoppstå. At en modell vurderer sitt eget utdata er ikke kvalitetssikring, uansett hvor mange steg som legges imellom.
- **Et oversettelsesverktøy er ikke en uavhengig kontroll.** Et tidligere utkast tilbød «morsmålsbruker eller uavhengig oversettelsesverktøy» som likeverdige alternativer. De er ikke likeverdige: et annet maskinoversettelsesverktøy deler treningsdata og skjevheter med modellen det skal kontrollere. Det kan brukes som et hint underveis, men det kan ikke kalles kvalitetssikring i rapporten.
- Et språk som ikke består begrepsankeret **og** den eksterne vurderingen, vises som Modellstøttet språk. Nivået følger målingen, ikke ambisjonen.

#### FR-29: Feilhåndtering i oversettelse

Oversettelsesfeil stopper aldri Kjerneløypen.

**Konsekvenser (testbare):**
- Feiler eller tidsavbrytes et oversettelseskall, vises norsk tekst alene, med en ikke-blokkerende merknad og en prøv-igjen-knapp.
- Eleven kommer alltid videre i Kjerneløypen uten oversettelse. Morsmålsstøtte er aldri en forutsetning for å lese teksten.

### 4.8 Minnevers og Suno-prompt

**Beskrivelse:** Det minst kritiske og morsomste elementet, med én reell risiko: et rim som stemmer dårlig faglig er verre enn ingen huskeregel, fordi eleven pugger noe galt i en form som sitter godt. FR-31 er derfor et faktakrav, ikke en formalitet. Funksjonen ligger nederst i kuttrekkefølgen i §9 og skal bygges sist.

**Funksjonskrav:**

#### FR-30: Generering av Minnevers eller Suno-prompt

Eleven kan få et Minnevers for Faguttrykkene i en Tekst, eller en ferdig Suno-prompt.

**Konsekvenser (testbare):**
- Verset er på fire til åtte linjer og bruker minst tre Faguttrykk fra Begrepssettet.
- Suno-prompten er ferdig til å limes inn i et eksternt verktøy og krever ingen redigering. Lesevenn genererer ikke lyd og kaller ikke Suno.
- Eleven ser tydelig hvilket av de to hun får, og kan be om det andre.

#### FR-31: Faktasjekk av Minnevers

Verset skal ikke lyve for rimets skyld.

**Konsekvenser (testbare):**
- Hvert Faguttrykk i verset finnes i Begrepssettet. Måles maskinelt: **100 prosent**.
- Ingen påstand i verset motsier Teksten. Måles på et Gullsett av **10 genererte vers**, manuelt vurdert av utvikleren: antall usanne påstander i det som vises eleven er **null**. Funn under målingen dokumenteres og brukes til å stramme prompten.
- Grensesnittet oppfordrer eleven til å sjekke verset mot teksten før hun pugger det.

### 4.9 Mapper — utsatt til etter v1

**Status per 27. september: ute av v1.** Mapper var tidligere betinget mål i M2. Den ble tatt ut for å gi plass til bildeinnlesing (FR-44, FR-45), etter at det ble klart at en stor del av målgruppen har papirbok eller nettbok uten kopiering.

Byttet er verdt å begrunne, fordi det reverserer en tidligere beslutning i dette prosjektet. Mapper er **additiv**: uten den virker alt annet, og alle målbare kvalitetspåstander står. Bildeinnlesing er **eksistensiell**: uten den kan en stor del av målgruppen ikke bruke appen i det hele tatt. En funksjon som utvider nytten for dem som alt er i gang, taper mot en funksjon som avgjør om de kommer i gang. Da den forrige avveiningen ble gjort, var ikke tilgangsproblemet kjent.

**FR-32, FR-33 og FR-34 er trukket tilbake, og numrene gjenbrukes ikke.** Kravene er bevart i versjonshistorikken framfor å slettes, slik at de kan hentes fram om prosjektet videreføres. Innholdet er oppsummert i §8.2 og i `addendum-lesevenn.md` §5.

Ordlistens definisjon av **Mappe** er beholdt, siden begrepet er referert i FR-1 som en foreslått vei videre for tekst over lengdegrensen. Den veien er i v1 «del teksten i flere Tekster» uten en mappe å samle dem i.
### 4.10 Brukerkonto og lagring

**Beskrivelse:** Kontoen finnes fordi Mappen trenger noe å samle og fordi eleven skal kunne komme tilbake til Øvekortene før prøven. Den er ikke en plattform: ingen deling, ingen sosiale funksjoner, ingen profil. Minst mulig data, fordi en stor del av brukergruppen er mindreårige og innholdet ofte er opphavsrettslig beskyttet lærebokstoff.

**Funksjonskrav:**

#### FR-35: Konto og innlogging

Eleven kan opprette konto og logge inn.

**Konsekvenser (testbare):**
- Registrering krever e-post og passord. Ingen navn, skole, klasse, alder eller fødselsdato samles inn.
- Passord lagres aldri i klartekst.
- Innhold er alltid privat for kontoen som eier det. Det finnes ingen delingsfunksjon i v1.

#### FR-36: Lagring og historikk

Eleven finner igjen tidligere arbeid.

**Konsekvenser (testbare):**
- Tekster, Begrepssett, Quizer med resultater, Øvekortmerking og Fagsamtaler lagres på kontoen.
- Tekstlisten kan sorteres på dato og søkes i på tittel.
- Genererte elementer regenereres ikke ved gjenbesøk. De hentes fra lagring — for stabilitet (FR-11) og kostnad (§6).

#### FR-37: Sletting

Eleven kan slette.

**Konsekvenser (testbare):**
- Eleven kan slette én Tekst, og alt generert innhold knyttet til den slettes med.
- Eleven kan slette kontoen sin, og all tilhørende data slettes.
- Sletting krever bekreftelse som navngir hva som forsvinner.

### 4.11 KI-bruk og kvalitetssikring

**Beskrivelse:** Dette er en leveranse, ikke en rapportvedlegg-øvelse. Emnets mappevurdering høsten 2026 er todelt: prosjektkode og funksjonalitet teller 70 prosent, og der står kravet om at «dokumentasjon må vise hvordan KI ble brukt, og hvordan studentene har kvalitetssikret koden». Refleksjonsrapporten teller 30 prosent, med kritisk vurdering av hvordan KI påvirket sluttresultatet og av etiske og teknologiske sider. Emnets læringsutbytter peker på de samme tingene: prompting, iterativ kodegjennomgang, testing, versjonskontroll, og vurdering av etikk og jus rundt KI-generert kode, inkludert eierskap og skjevhet.

To ting følger av det. For det første gjelder kvalitetssikringen **både koden og innholdet** — appens kildekode, som i stor grad er KI-generert, og det KI-genererte innholdet appen produserer i drift. Det er to ulike oppgaver med to ulike metoder, og seksjonen skiller dem. For det andre er råstoffet allerede beskrevet: Gullsettene i FR-8, FR-14, FR-21, FR-28 og FR-31 *er* kvalitetssikringen av innholdet. Denne seksjonen krever bare at de finnes i repoet med tall, ikke bare som påstand i en rapport.

**Funksjonskrav:**

#### FR-38: KI-logg for utviklingen

Utvikleren fører en løpende logg over hvordan KI ble brukt i utviklingen.

**Konsekvenser (testbare):**
- Loggen ligger i repoet, i versjonskontroll, og oppdateres gjennom semesteret — ikke skrevet fra hukommelsen i siste uke. Commit-historikken viser jevn oppdatering.
- Hver oppføring har: hva som ble bedt om, hvilket verktøy og hvilken modell, hva som kom tilbake, og hva utvikleren gjorde med det — godtatt, endret eller forkastet, med begrunnelse.
- Loggen inneholder minst fem oppføringer der KI-forslaget ble **forkastet eller vesentlig endret**, med begrunnelsen. En logg som bare viser treff dokumenterer ikke kvalitetssikring, den dokumenterer flaks.

#### FR-39: Promptregister for kjøretid

Appens egne prompter er versjonert, med måleresultat per versjon.

**Konsekvenser (testbare):**
- Hver kjøretidsprompt — uttrekk av Faguttrykk, quizgenerering, svarvurdering, oppfølgingsspørsmål, oversettelse, minnevers — ligger i repoet med versjonsnummer.
- For hver versjon er de relevante målingene fra FR-8, FR-14, FR-21, FR-28 og FR-31 lagret med tall og dato.
- Minst én prompt viser en dokumentert forbedring over minst to versjoner, med tallene som viser den. Det er dette som gjør prompting til et håndverk i rapporten og ikke en anekdote.

#### FR-40: Testsett og måleresultater i repoet

Gullsettene finnes som filer, ikke som beskrivelser.

**Konsekvenser (testbare):**
- Alle Gullsett fra §4 ligger i repoet: tekster, manuelle annoteringer og forventede tilstander.
- Målingene kan kjøres på nytt med én kommando, og kommandoen er dokumentert.
- Resultatene er lagret som data, og oppsummert i én tabell som viser hver terskel i dokumentet med målt verdi og bestått/ikke bestått. Tabellen er statusoversikten for hele kvalitetsarbeidet.

#### FR-41: Kvalitetssikring av koden

Den KI-genererte koden er gjennomgått, testet og sporbar.

**Konsekvenser (testbare):**
- Versjonskontroll brukes gjennom hele semesteret, med commit-meldinger som gjør det mulig å følge utviklingen. Ikke én stor innlevering på slutten.
- De sju PDF-feiltilstandene (FR-4), forankringskravet (FR-14) og de maskinsjekkbare kravene i FR-7, FR-20, FR-25 og FR-31 har automatiserte tester som kjører grønt.
- KI-generert kode i de delene som håndterer innlogging, lagring og sletting (§4.10) er gjennomgått linje for linje, og gjennomgangen er dokumentert. Dette er delene der en KI-generert snarvei gjør mest skade.
- Minst tre konkrete feil eller svakheter i KI-generert kode er dokumentert med hvordan de ble funnet — test, gjennomgang eller feilsøking i drift.

#### FR-42: Etikk og jus

Prosjektet gjør rede for de etiske og juridiske sidene det faktisk berører.

**Konsekvenser (testbare):**
- Eierskap og lisens til KI-generert kode er drøftet, med prosjektets eget standpunkt og lisensvalg.
- Skjevhet er drøftet konkret for dette produktet, ikke generelt, på tre akser:
  - **Mellom fag.** Faguttrykk kan trekkes ut skjevt mellom naturfag, samfunnsfag og norsk. Fordelingen per fag fra FR-8 er tallgrunnlaget.
  - **Mellom programområder.** Uttrekket kan treffe bedre på akademisk fagspråk enn på praksisnær yrkesfagterminologi, fordi den første typen er langt bedre representert i det en språkmodell er trent på. Krysningen i FR-8s Gullsett finnes nettopp for å kunne si noe om dette framfor å anta det. `[ANTAKELSE: at yrkesfaglige fagtekster treffes dårligere, er en hypotese — ikke et funn. Målingen avgjør, og et resultat som viser ingen forskjell er også et resultat.]`
  - **Mellom språk.** Oversettelseskvalitet er med stor sannsynlighet dårligere for språk med mindre treningsdata — som er nettopp de språkene elevene med størst behov snakker. Nivåskillet i FR-24 er prosjektets svar, og det svaret vurderes kritisk.
- Den andre aksen er verdt å ta alvorlig og ikke bare nevne: dersom uttrekket virker dårligere på yrkesfaglige tekster, virker verktøyet dårligst der lesestøttebehovet er størst. Det er den samme formen for skjevhet som den språklige, bare mindre synlig — og et verktøy som hjelper mest de elevene som trengte det minst, har ikke løst problemet i §1.
- **Datakjeden og opphavsretten er drøftet som et valg, ikke som en gitt ramme.** Dette er den fjerde aksen, og den er den mest konkrete:
  - Hvilken leverandør behandler elevenes tekster og bilder, hvor, og på hvilke vilkår — med dato for når vilkårene ble lest (§6.2).
  - Hvilke alternativer som ble vurdert: annen leverandør, europeisk behandlingssted, og en lokalt kjørt modell som fjerner tredjepartsoverføringen helt. Den siste ble valgt bort fordi Svarvurderingen er den vanskeligste oppgaven i appen og krever god norsk — det er en reell avveining mellom personvern og pedagogisk kvalitet, og den skal stå som det.
  - Hva designet gjør for å begrense eksponeringen: tegngrensen, bildegrensen, forbudet mot korpusbygging, at bilder ikke lagres (§6.3).
  - Hva det ikke løser: at ansvaret i praksis skyves til en mindreårig, og at rettstilstanden ikke er undersøkt i dette prosjektet.
- Bildeinngangen (FR-44) skjerper dette, og valget om å ta den inn likevel skal begrunnes: uten den kan en stor del av målgruppen ikke bruke appen, og et vern som består i at verktøyet er ubrukelig er ikke et vern.

#### FR-43: Refleksjon, forankring og de påstandene prosjektet gjør

Rapporten drøfter ærlig hva det betyr å la en språkmodell vurdere en elevs forklaring — og gjør opp status for de påstandene prosjektet bygger sin egen berettigelse på.

**Konsekvenser (testbare):**
- **Lesestrategien er navngitt og kildebelagt.** Prosjektets differensiering er at KI-bruken er forankret i en etablert lesepedagogisk struktur — aktivere forkunnskaper før lesing, støtte begrepsforståelse underveis, teste forståelse aktivt etterpå. Rapporten navngir den strukturen og oppgir minst én faglig kilde for den. Uten kilde er forankringen bare utviklerens egen mening om hva en leselærer ville gjort, og da faller det som skiller Lesevenn fra et generisk oppsummeringsverktøy tilbake på påstand.
- **Den sammenlignende påstanden gjøres opp.** Briefens kortsiktige mål er å vise at en lesestrategi-forankret flyt hjelper bedre enn et generisk «lim inn og få et sammendrag»-verktøy, og at en skriftlig fagsamtale er en mer troverdig forståelsestest enn en ren flervalgsquiz. Ingen måling i dette dokumentet gir belegg for noen av de to: SM-3 viser at samtalen reagerer på svaret, som er noe annet enn at den er en bedre test. Rapporten må derfor enten legge fram det belegget den har, eller si rett ut at påstanden er ubevist i v1 og hva som skulle til for å prøve den. Å gjenta den som om den var vist, er den ene tingen som ville undergrave hele §4.11.
- **Utgangspunktets enkelhet innrømmes.** Å generere sammendrag og quiz fra en opplastet tekst er en velkjent idé, og beskrevet som et enkelt forslag i emnets egen prosjektliste. Rapporten sier det, og bygger argumentet sitt på sammensetningen og kvalitetsarbeidet i stedet — det er en sterkere posisjon enn å late som byggeklossene er nye.
- Refleksjonen bruker de faktiske tallene fra FR-21 — inkludert forvekslingsmatrisen — og ikke generelle betraktninger om KI.
- Den alvorligste feilmåten navngis og drøftes: at en Misoppfatning leses som Dekkende, altså at eleven får bekreftet en feil forståelse. Det er den feilen som gjør skade, og den skal stå i rapporten selv om den er ubehagelig for produktet.
- Valget om at Svarvurderingen aldri er en karakter (FR-23) begrunnes som en konsekvens av nettopp disse grensene.

## 5. Tverrgående krav

- **Ingen KI-utdata uten kilde.** Alt generert innhold som påstår noe om Teksten — forklaringer, quizspørsmål, samtalespørsmål, oppsummeringer, vers — har et Kildeavsnitt. Kravet er arkitektonisk, ikke kosmetisk: klarer ikke en generator å oppgi Kildeavsnitt, er utdataen ikke gyldig.
- **Ingen blindveier.** Hver feiltilstand i hele appen sier hva som skjedde, på vanlig norsk, og tilbyr minst én konkret neste handling. Ingen tekniske feilspor, ingen «noe gikk galt», ingen stille feil.
- **Ingen stille forkorting.** Appen kutter aldri tekst, spørsmål eller innhold uten at eleven ser det og godtar det.
- **Ventetid er synlig og brutt opp.** Kall til språkmodell som tar over to sekunder viser en status som sier hva som gjøres. Kjerneløypens steg genereres når de trengs, ikke alle i ett langt oppstartskall — eleven skal komme til aktiveringssiden raskt.
- **Lesbarhet foran pynt.** Lesevisningen er den viktigste flaten. Justerbar tekststørrelse og linjeavstand, linjelengde om lag 70 tegn, tilstrekkelig kontrast, og ingen informasjon formidlet ved farge alene.
- **Tastatur og skjermleser.** Kjerneløypen kan fullføres med tastatur alene. Markerte Faguttrykk er fokuserbare, og forklaringen er tilgjengelig for skjermleser.
- **Mobil er en reell flate.** Kjerneløypen virker på telefon i portrettmodus. `[ANTAKELSE: elever leser og øver like ofte på telefon som på PC. Ikke verifisert — men en lesestøtteapp som krever PC treffer dårligere.]`
- **Lagring foran regenerering.** Genererte elementer lagres ved første generering og gjenbrukes. Både for stabilitet og for kostnad.

## 6. Rammer og vern

### 6.1 Pedagogisk og etisk

- Lesevenn gir aldri en karakter, et poengtall eller en nivåplassering av eleven. Vurderingen er formativ, og sies å være det.
- Det er alltid synlig når innhold er generert av en språkmodell, og at det kan være feil.
- Morsmålsstøtten er additiv og aldri erstattende (FR-25). Målet er tilgang til norsk fagspråk, ikke omvei rundt det.
- Appen produserer ikke innhold om Teksten som ikke står i Teksten (§5, første punkt).

### 6.2 Personvern og databehandling

- Datainnsamlingen holdes på et minimum: e-post, passord, elevens tekster og eget arbeid. Ingen navn, skole, klasse eller alder (FR-35).
- Før første innsending sier appen tydelig at teksten sendes til en ekstern språkmodell-leverandør for behandling. Eleven skal vite hvor teksten går.
- Ingen tredjeparts analyse- eller sporingsverktøy.
- Sletting virker og sletter faktisk (FR-37).
- Brukergruppen er **delt**: elever på Vg1 og Vg2 er i hovedsak mindreårige (15–17), mens mange på Vg3 er myndige (18–19). Datainnsamlingen holdes like kort uansett, fordi den må være forsvarlig for den yngste brukeren og ikke for gjennomsnittet.
- Aldersdelingen gjør én praktisk ting lettere: testbrukere kan rekrutteres blant myndige elever på Vg3, slik at samtykke fra foresatt ikke er nødvendig for å prøve appen. `[ANTAKELSE: testbrukere i v1 er myndige elever, eller mindreårige med samtykke fra foresatt. Reell klasseromsbruk krever databehandleravtale og ligger utenfor v1 (§2.2).]`

**Krav til leverandøren.** Dette er formulert leverandøruavhengig med vilje: kravet er en egenskap ved avtalen, ikke ved merkenavnet.

- **Inndata skal ikke brukes til å trene modeller.** Appen tar imot opphavsrettsbeskyttet lærebokstoff, og forskjellen mellom at en kopi passerer gjennom en databehandler og at innholdet havner i et treningssett er en forskjell i art, ikke i grad. Velg et oppsett der dette er avtalt, og dokumentér hvilket.
- **Behandlingsstedet skal være kjent og nedskrevet.** Hvilken leverandør, hvilken region, om data forlater EU/EØS.
- **Vilkårene skal være lest og datert.** Det er ikke nok å anta hva som gjelder; rapporten oppgir hvilke vilkår som ble lest og når. Vilkår endres, og en udatert påstand om dem er verdiløs.
- Merk at forbruker- og API-versjoner av samme tjeneste ofte har ulike vilkår på nettopp dette punktet. Sjekk vilkårene for det du faktisk bruker.

**Bilder (FR-44).** Bilder eleven laster opp lagres ikke etter at uttrekket er godkjent — det er Råteksten som bevares. Metadata fjernes før bildet sendes videre. Bildeinngangen er lagt inn fordi målgruppen krever den, men den øker eksponeringen, og lagringsregelen er svaret på det.

### 6.3 Opphavsrett

Eleven legger inn innhold hun ikke eier. Det er den mest åpenbare etiske spenningen i produktet, og den fortjener mer enn en henvisning til vilkårene.

**Hva designet gjør for å begrense eksponeringen:**

- **Tekstgrensen på 8 000 tegn** (FR-1) gjør at det som behandles er et utdrag, ikke et kapittel og slett ikke en bok. Grensen ble satt av målehensyn, men den virker like godt her.
- **Grensen på fire bilder** per Tekst (FR-44) er satt av samme grunn. Inngangen er til noen sider eleven arbeider med, ikke til å digitalisere en bok. Skannede PDF-er av hele bøker er eksplisitt ikke støttet (PF-1).
- **Ingen korpusbygging.** Elevenes tekster slås aldri sammen til et delt datasett — verken for analyse, for å forbedre prompter, for testsett, eller noe annet. Testsettene i §4 består av tekster utvikleren selv har skaffet og annotert, aldri av brukernes innhold. Dette er et forbud, ikke en implementasjonsdetalj.
- **Ingen deling.** Innhold er privat for kontoen som eier det, og det finnes ingen delingsfunksjon i v1 (FR-35).
- **Bilder beholdes ikke** (FR-44).
- Vilkårene sier at innlegging er til eget studiebruk.

**Det designet ikke løser, og som skal stå i rapporten:**

- **Å legge ansvaret på eleven er ikke et svar.** Vilkår som sier «til eget studiebruk» flytter ansvaret til en sekstenåring som ikke leser dem. Det er verdt å ha med, men det er ikke der vernet ligger — vernet ligger i grensene over.
- **Grensene for informert samtykke.** Et informasjonsskjermbilde gir en mindreårig kunnskap om at teksten sendes ut, men det er ikke det samme som et gyldig samtykke i streng forstand. Dette er en ærlig begrensning framfor noe å pynte på.
- **Rettstilstanden er ikke avklart i dette dokumentet.** Hva avtaleverket for skoleverket tillater av digital gjengivelse, og om det i det hele tatt er relevant når det er eleven selv og ikke skolen som laster opp, er ikke undersøkt her. Åpent spørsmål 12 i §11. Skal det inn i rapporten, må det stå med en kilde som er lest, ikke en antakelse.
### 6.4 Kostnad

- `[ANTAKELSE: API-budsjett for hele semesteret er i størrelsesorden 300–600 kroner, av egen lomme.]` Rammen styrer flere valg som ellers ville sett vilkårlige ut: lagring framfor regenerering, tak på tekstlengde (FR-1), tak på mappestørrelse (FR-32), og tak på samtalelengde (FR-22).
- Ulike oppgaver kan bruke ulike modeller. Uttrekk og oversettelse tåler en billigere modell enn Svarvurderingen, som er den vanskeligste oppgaven i appen. Valgene og begrunnelsen ligger i `addendum-lesevenn.md`.
- Målekjøringene mot Gullsettene koster også penger, og de kjøres per promptversjon. Det er en budsjettpost, ikke en gratis bieffekt — og et argument for å holde gullsettene så små som de er.

## 7. Ikke-mål

- **Lesevenn er ikke et sammendragsverktøy.** Det finnes ingen «oppsummer teksten for meg»-knapp. Den avsluttende oppsummeringen i FR-26 kommer etter at eleven har lest og blitt sjekket, og den er ikke tilgjengelig før.
- **Lesevenn vurderer ikke elever.** Ingen karakter, ingen diagnose, ingen profil av hva eleven er svak i. Diagnostikk på tvers av økter krever reell brukshistorikk for å være troverdig, og den historikken finnes ikke i v1.
- **Lesevenn er ikke et lærerverktøy i v1.** Ingen klasseoversikt, ingen innsyn, ingen eksport til Kahoot eller Blooket.
- **Lesevenn er ikke en oversetter.** Morsmålsstøtten er tre definerte punkter i leseløypen, ikke en generell oversettelsesknapp.
- **Lesevenn leser ikke bilder.** Ingen OCR, ingen bildeinnlesing, ingen URL-innlesing.
- **Lesevenn er ikke en plattform.** Ingen deling, ingen samarbeid, ingen sosiale funksjoner, ingen offentlige profiler.
- **Lesevenn er ikke et skolesystem.** Ingen Feide, ingen administrasjon, ingen roller utover eleven selv.

## 8. Omfang v1

### 8.1 Med i v1

- Innlesing av tekst på tre veier: liming, PDF med tekstlag, og bilder av boksider (umålt, tydelig merket). Obligatorisk gjennomsyn i to faser, sju navngitte PDF-feiltilstander og fem for bilder.
- Kjerneløypen: Aktivering med overskrifter og forkunnskapssvar → Lesevisning med markerte Faguttrykk og forklaring inline → Quiz med forankring og tilbakevisning i teksten.
- Øvekort fra samme Begrepssett som Lesevisningen.
- Skriftlig fagsamtale med Svarvurdering i fem tilstander og oppfølgingsspørsmål som oppfyller FR-20, målt etter FR-21.
- Morsmålsstøtte: ukrainsk som Kvalitetssikret språk, øvrige som Modellstøttede med synlig forbehold, additiv visning med norsk fagord i parentes, arabisk høyre-til-venstre bygget og demonstrert uansett nivå, utpeking av språklige bilder og akademisk allmennspråk.
- Minnevers eller Suno-prompt, med faktasjekk.
- Brukerkonto med lagring, historikk og sletting.
- Dokumentasjonsleveransen i §4.11: KI-logg, Promptregister, Gullsett med tall i repoet, kodekvalitetssikring, etikk og jus, refleksjon.

### 8.2 Utenfor v1

- **Innlesing fra URL.** Tekst, PDF og bilde dekker de veiene målgruppen faktisk har.
- **Tekstgjenkjenning av hele innskannede bøker.** Bildeinngangen tar inntil fire sider (FR-44). Å digitalisere en bok er en annen oppgave, med en annen opphavsrettslig karakter.
- **Mapper med samlet Quiz og Fagsamtale.** Var betinget mål i M2, tatt ut 27. september for å gi plass til bildeinnlesing. Mapper er additiv — uten den virker alt annet — mens bildeinnlesing avgjør om en stor del av målgruppen kommer i gang i det hele tatt. FR-32 til FR-34 er trukket tilbake og numrene gjenbrukes ikke (§4.9).
- **Talebasert fagsamtale.** Skriftlig først; tale legger til lydopptak, transkribering og en helt ny feilkjede. `[MERKNAD: pedagogisk er dette det mest interessante neste steget — noen elever forklarer mye bedre muntlig enn skriftlig. Verdt å nevne i rapportens videreføringsdel.]`
- **CSV-eksport til Kahoot eller Blooket.** Verdien ligger hos klassen, via læreren — og læreren er ikke bruker i v1 (§2.2). Funksjonen hører sammen med lærerdashbordet, ikke før det. Krever i tillegg kjennskap til to eksterne formater.
- **Flere Kvalitetssikrede språk enn ukrainsk.** Nivået krever en ekstern morsmålsbruker per språk (FR-28), og tre slike avhengigheter før M1 ville gjort den mest usikre antakelsen i dokumentet til en forutsetning for å bli ferdig. Utsatt av risikohensyn, ikke fordi oversettelse til flere språk er vanskelig — de er tilgjengelige som Modellstøttede fra dag én.
- **Diagnostikk på tvers av økter og fag.** Krever brukshistorikk over tid for å være annet enn gjetning. Utsatt av troverdighetsgrunner, ikke av tidsgrunner.
- **Full morsmålsstøtte i alle funksjoner.** Quiz, fagsamtale og øvekort er på norsk i v1. Bevisst: eleven skal øve på norsk fagspråk.
- **Lærerdashbord.** Krever klasser, roller, personvernvurdering og databehandleravtale — et eget prosjekt.
- **Feide-innlogging og institusjonell drift.**

## 9. Ferdig-definisjon og milepæler

Semesteret startet 10. august 2026 og slutter 18. desember. Hovedperioden for vurdering i høstsemesteret går fra om lag 20. november til jul. **Innleveringsfristen er 5. desember 2026**, bekreftet hos emneansvarlig 25. september. Planen under er lagt mot den datoen. Merk at 5. desember er en lørdag — lever fredag 4. desember, slik at en teknisk floke ved innlevering treffer en dag det finnes folk å spørre.

Fra i dag, 25. september, er det om lag ti arbeidsuker. Planen under er ikke en ønskeliste, men en kuttrekkefølge: hvert nivå er en tilstand der prosjektet kan leveres.

**En ting planen må ta høyde for, og som en ren funksjonsliste skjuler.** Emnets ukeplan plasserer arkitektur og UX-spesifikasjon i uke 44–45, altså inne i byggevinduet under — men **det er anbefalt framdrift, ikke egne innleveringer**, bekreftet 25. september. M1-vinduet er dermed intakt, og arkitekturdokumentet kan skrives i det omfanget det er nyttig for byggingen framfor for en vurdering.

Det som likevel er en reell post, er at målearbeidet i §4 er et arbeid i seg selv, ikke en bieffekt av å bygge: annotering av Gullsett, kjøring per promptversjon og manuell vurdering er timer som må stå i planen. Gullsettene er derfor med vilje små — seks tekster, 24 spørsmål, 36 samtaletilfeller, fire oversettelsestekster, ti vers — og tersklene er satt der de kan forsvares ved den størrelsen, ikke der de ser strengest ut.

### 9.1 M0 — må virke (mål: 30. oktober)

Uten dette finnes det ikke et produkt å vurdere. M0 inneholder Fagsamtalen i full form, og det er et bevisst valg med en kostnad.

- Liming av tekst, med gjennomsyn og retting (FR-1, FR-3).
- Kjerneløypen ende til ende: Aktivering → Lesevisning med markeringer → Quiz (FR-5, FR-6, FR-7, FR-9, FR-10, FR-13, FR-14, FR-15).
- **Fagsamtale i full form** (FR-18 til FR-23): fem tilstander, strukturert utdata med `kildeavsnitt_id` og `mål`, flere runder, oppsummering.
- Konto og lagring, nok til at en Tekst kan hentes fram igjen (FR-35, FR-36).
- Gullsettet for Faguttrykk er annotert og målt minst én gang, inkludert egen annoteringsstøy (FR-8). Dette skjer i M0 og ikke senere: målingen styrer promptarbeidet, og en måling som først kommer i desember har ikke styrt noe — den har bare beskrevet.
- KI-loggen er i gang og har oppføringer fra hele perioden (FR-38).

**Hva som ble flyttet ut for å gjøre plass.** Fagsamtalen hører i M0 fordi M0 uten den er nøyaktig det generiske «lim inn tekst, få en quiz»-verktøyet §1 definerer Lesevenn i motsetning til — et M0 som ikke kan demonstrere prosjektets egen tese er ikke et minimum, det er et annet produkt. Men funksjonen er den dyreste i dokumentet, så **målingene** av den flyttes til M1: Gullsettet på 36 tilfeller, sikkerhetsporten og avsnittstesten i FR-21 kjøres der. Det samme gjelder Quiz-gullsettet i FR-14. M0 bygger altså Fagsamtalen; M1 beviser den. Datoen er samtidig flyttet fra 23. til 30. oktober, fordi M0 nå også inneholder innlogging og lagring fra ingenting — den delen FR-41 krever gjennomgått linje for linje.

### 9.2 M1 — v1 slik den er lovet (mål: 20. november)

Dette er prosjektet i briefens forstand, og det nivået som svarer til påstandene i §1.

- PDF-innlesing med alle sju navngitte feiltilstander og tester for hver (FR-2, FR-4). Testfilene må lages, ikke finnes — det er en egen post.
- **Bildeinnlesing av boksider med fem navngitte feiltilstander (FR-44, FR-45).** Umålt og tydelig merket. Ligger i M1 og ikke som betinget mål, fordi en stor del av målgruppen ikke kan bruke appen uten den.
- Øvekort (FR-16, FR-17).
- Fagsamtalens målinger: Gullsettet på 36 tilfeller, sikkerhetsporten, den binære gjenkallingen, måltesten og avsnittstesten (FR-21).
- Quiz-gullsettet på 24 spørsmål (FR-14).
- Morsmålsstøtte: **ukrainsk** som Kvalitetssikret språk, med målingene i FR-28 gjennomført, inkludert den eksterne vurderingen. Arabisk bygget og demonstrert med høyre-til-venstre-visning uavhengig av nivå (FR-24 til FR-29).
- Minnevers med faktasjekk (FR-30, FR-31).
- Leseinnstillinger og tilgjengelighetskravene i §5, testet på telefon.
- Promptregisteret viser minst én dokumentert forbedring over to versjoner (FR-39).

**Minnevers er flyttet fram, ikke bakover.** Det sto tidligere sist på kuttlisten sammen med Mapper. Det var galt: funksjonen er om lag tre til fire timers arbeid, den billigste i hele dokumentet, og faktasjekken i FR-31 er den reneste kilden prosjektet har til et konkret «modellen løy for rimets skyld»-tall — altså nettopp den typen funn FR-42 og FR-43 trenger for å være annet enn generelle betraktninger. Å kutte den for å spare fire timer og samtidig miste et dokumentert funn er en dårlig byttehandel.

### 9.3 Stabilisering og slakk (20.–27. november)

Det finnes **ikke** noe M2-nivå lenger. Mapper var det eneste betingede målet, og det er ute av v1 (§4.9). Uken mellom M1 og kodefrys er derfor ikke en funksjonsuke — den er slakk, og det er et bevisst valg framfor et tomrom.

Uken brukes til det som alltid gjenstår og alltid undervurderes: feilretting funnet under målekjøringene, å få demoløypen til å gå tre ganger på rad uten inngrep, mobiltesting, og de siste tilgjengelighetskravene i §5. Skrider M1 ut, er dette bufferen som absorberer det — og da er det bedre at bufferen finnes i planen enn at den oppstår ved at noe annet ryker.

`[ANTAKELSE: at omfang og vanskelighetsgrad vektlegges i vurderingen, bygger på materiale fra emnets tidligere gjennomføring og er ikke publisert policy for 2026. Det taler for ikke å kutte mer enn nødvendig, men ikke for å fylle slakken med nye funksjoner — se SM-C2.]`
### 9.4 Kodefrys og dokumentasjonsvindu (28. november – 5. desember)

**Kodefrys 27. november, satt som en git-tag** slik at frysepunktet er et faktum i repoet og ikke en intensjon. Etter den datoen skrives ingen ny funksjonalitet — bare dokumentasjon, refleksjonsrapport og feilretting som gjør en demo mulig.

Grunnen er at refleksjonsrapporten teller 30 prosent og kodedokumentasjonen inngår i de resterende 70. Det er ikke en oppgave som lar seg klemme inn i kvelden før, og den vanligste måten for en solostudent å tape karakter på er å bruke hele fristen på kode og levere dokumentasjonen halvferdig. Åtte dager reservert til dokumentasjon er billig forsikring — og den er billigere fordi tallene alt finnes: Gullsettene er målt underveis, KI-loggen er ført underveis. Vinduet brukes til å skrive, ikke til å rekonstruere.

### 9.5 Demotest — den faktiske ferdig-testen

Et nivå er ferdig når demoløypen kjører gjennom på en tom database, tre ganger etter hverandre, uten inngrep fra utvikleren:

1. Opprett konto, logg inn.
2. Lim inn testtekst A. Kontroller at bare overskriftene vises i fase 3a, rett én overskrift, godkjenn.
3. Aktivering: kontroller at brødteksten ikke er tilgjengelig, skriv forkunnskaper, gå videre.
4. Tekstgjennomsyn fase 3b: rett én linje i brødteksten, godkjenn. Kontroller at teksten deretter er låst for redigering.
5. Lesevisning: åpne tre forklaringer, én med tastatur alene.
6. Quiz: svar, se resultat, følg én tilbakevisning til Kildeavsnittet.
7. Øvekort: gå gjennom, merk to kort.
8. Fagsamtale: tre runder gjennomføres. For hver runde kontrolleres at det kommer en Svarvurdering med begrunnelse, og en oppfølging med gyldig `kildeavsnitt_id` og `mål`. Avslutningsoppsummeringen lister både det som ble godtatt som Dekkende og det som falt som Misoppfatning.
9. Trykk «jeg tror du misforsto svaret mitt» på én Svarvurdering, og kontroller at runden vurderes på nytt.
10. Velg arabisk som Morsmål. Kontroller at aktivering og oppsummering vises på begge språk, med korrekt leseretning, og at norsk fagord står i parentes etter det oversatte.
11. Last opp testfil PF-1 (skannet PDF). Kontroller meldingen og den anbefalte handlingen.
12. Gjenta steg 2–8 på telefon i portrettmodus, med forklaring åpnet ved trykk.
13. Last opp to bilder av en boksides tekst. Kontroller at merknaden om at bildeuttrekk ikke er kvalitetssikret vises, at rekkefølgen kan endres, og at uttrekket havner i fase 3a og deretter 3b som alt annet.
14. Slett testtekst A. Logg ut.

**Hva demoløypen bevisst ikke tester.** Den sjekker ikke at Fagsamtalen klassifiserer et bestemt svar i en bestemt tilstand. Et tidligere utkast gjorde det — steg 7 krevde at en bevisst misoppfatning fikk tilstanden Misoppfatning — og det var en feil: et kall til en språkmodell er ikke deterministisk, så en slik port ville feilet tilfeldig, og en port som feiler tilfeldig blir stille droppet etter tredje gang. Demoløypen tester at flyten holder og at feltene finnes. *Kvaliteten* på klassifiseringen hører i Gullsettet i FR-21, der den måles over 36 tilfeller i stedet for ett, og der et avvik betyr noe.

Demoløypen er skrevet ned som en sjekkliste i repoet, og kjøres ved hver milepæl — ikke bare før innlevering.

## 10. Suksesskriterier

**Primære**

- **SM-1: Demoløypen går gjennom.** Sjekklisten i §9.5 fullføres tre ganger på rad på tom database, uten inngrep. Validerer hele §4.
- **SM-2: Nøkkelorduttrekk holder målet.** Gjenkalling ≥ 0,75 og presisjon ≥ 0,70 mot Gullsettet, rapportert per fag, **og null faglig gale forklaringer** i det som vises eleven. Validerer FR-7, FR-8, FR-9.
- **SM-3: Fagsamtalen reagerer faktisk på svaret, og bekrefter ikke en gal forståelse.** To blokkerende porter: null misoppfatninger lest som Dekkende, og binær gjenkalling for «trenger oppfølging» ≥ 0,90. Avsnittstesten består på alle seks par, måltesten på minst 16 av 18, manuell relevans ≥ 80 prosent. Femveis forvekslingsmatrise rapporteres uten terskel. Validerer FR-19, FR-20, FR-21.
- **SM-4: Oversettelsen bærer det norske fagordet videre, og er sett av et menneske.** Begrepsanker ≥ 0,95 maskinelt, ekstern vurdering av én morsmålsbruker gjennomført og dokumentert, null tapte negasjoner eller endrede tall og egennavn. Gjelder ukrainsk; arabisk RTL-visning demonstreres uavhengig av nivå. Validerer FR-24 til FR-28.
- **SM-5: Ingen blindveier.** Alle sju PDF-feiltilstandene har en reproduserbar test som viser melding og tilgjengelig neste handling. Validerer FR-4.
- **SM-6: Dokumentasjonsleveransen er komplett.** KI-logg med minst fem forkastede eller endrede KI-forslag, Promptregister med måletall per versjon, Gullsett i repoet med kjørbar måling, dokumentert kodegjennomgang av innlogging og lagring, drøfting av eierskap og skjevhet, refleksjon som bruker de faktiske tallene, lesestrategien navngitt med minst én faglig kilde, og den sammenlignende påstanden fra briefen enten belagt eller uttrykkelig erklært ubevist. Validerer FR-38 til FR-43.

**Sekundære**

- **SM-7: Quizen er forankret.** Minst 90 prosent av genererte spørsmål passerer forankringskravet, null uforankrede spørsmål vises eleven. Validerer FR-14.
- **SM-8: Begrepssettet er stabilt.** Overlapp ≥ 0,80 mellom to kjøringer av samme Tekst. Validerer FR-11.
- **SM-9: Kjerneløypen virker på telefon.** Demoløypens steg 1–7 fullføres på telefon i portrettmodus. Validerer §5.
- **SM-10: Én testbruker utenfor utvikleren kommer gjennom løypen uten hjelp.** Én elev eller annen frivillig fullfører Kjerneløypen uten instruksjon, og friksjonspunktene skrives ned — særlig om det obligatoriske gjennomsynssteget (FR-3) er der de stopper, siden det er friksjon Lesevenn legger til med vilje. `[ANTAKELSE: én testbruker er oppnåelig innen fristen. Én er nok til å finne det som er åpenbart galt, og langt bedre enn ingen.]`
- **SM-11: En elev med papirbok kommer gjennom løypen.** Bildeinnlesing av inntil fire sider gir en Råtekst som eleven kan rette i gjennomsynet og fullføre Kjerneløypen fra. Demonstreres i demoløypens steg 13. Validerer FR-44, FR-45. **Merk at dette ikke er en kvalitetspåstand:** metrikken sier at veien finnes og virker ende til ende, ikke at uttrekket er treffsikkert. Det siste er umålt i v1, og det står i FR-45.
- **Merknad om briefens mappekriterium.** Briefen listet «flere tekster samlet i en mappe med én felles quiz» som et funksjonelt suksesskriterium. Det er ikke innfridd i v1, fordi Mapper er tatt ut (§4.9). Det skal stå i rapporten som et bevisst bytte med begrunnelse, ikke forsvinne fordi metrikken ble fjernet sammen med funksjonen.

**Motmetrikker — skal ikke optimaliseres**

- **SM-C1: Antall markerte Faguttrykk.** Flere markeringer er ikke bedre. Et gult teppe er verdiløst for den eleven appen er bygget for. Motvekt til SM-2: gjenkalling kan alltid kjøpes ved å markere mer, og presisjonskravet og tetthetstaket finnes for å hindre nettopp det.
- **SM-C2: Antall leverte funksjoner.** M2-funksjoner bygget på bekostning av M1-kvalitet er et tap, ikke en gevinst. Motvekt til fristpanikk.
- **SM-C3: Antall runder i en fagsamtale.** En lang samtale er ikke en bedre samtale. Motvekt til SM-3: seks runder er et tak, ikke et mål.
- **SM-C4: Språkmodellens egen vurdering av eget utdata.** Skal aldri brukes som dokumentasjon på kvalitet, verken i appen eller i rapporten. Bare måling mot Gullsett teller. Motvekt til hele §4.11 — dette er den enkleste og mest forlokkende måten å gjøre kvalitetssikringen verdiløs på.

## 11. Åpne spørsmål

1. ~~**Innleveringsfristen er ikke bekreftet.**~~ **Avklart 25. september:** fristen er **5. desember 2026**, bekreftet hos emneansvarlig. Milepælsplanen i §9 var alt lagt mot den datoen og trenger ingen endring. Gjenstår én praktisk detalj: 5. desember er en **lørdag**, så finn klokkeslettet i Canvas og planlegg å levere fredag 4. desember. Går noe galt med innleveringen på en lørdag, er det ingen å spørre.
2. ~~**Emnet er beskrevet med gruppevurdering, grupper på 4 ± 1.**~~ **Avklart 25. september:** solobygg er godkjent av emneansvarlig, selv om emnebeskrivelsen angir grupper på 4 ± 1. Premisset for hele dokumentet står dermed. Verdt å nevne i refleksjonsrapporten som en rammebetingelse: omfanget i §8 er dimensjonert for én person på ti uker, ikke for en gruppe på fire, og det forklarer flere av kuttene i §9.
3. ~~**Arbeidskravet — godkjent proposal.**~~ **Avklart 25. september: proposalen er levert og godkjent.** Dokumentet ligger som `proposal-lesevenn.md`. Emnet hadde ingen påkrevd struktur, så den følger malen gjenfunnet fra fjorårets gjennomføring (addendum §1). Retten til å levere mappekravet er dermed sikret.
4. ~~**Hvem kan gjøre den eksterne vurderingen i FR-28?**~~ **Avklart 25. september:** en ukrainsk morsmålsbruker er funnet, og ukrainsk er derfor v1s Kvalitetssikrede språk (FR-24). Gjenstår bare å avtale tidspunkt i M1-vinduet rundt 20. november — ikke tidligere, siden funksjonen ikke finnes før da.
5. ~~**Stemmer emnets ukeplan med milepælsplanen i §9?**~~ **Avklart 25. september:** uke 44–45 i ukeplanen er anbefalt framdrift, ikke egne innleveringer. M1-vinduet er intakt, og Mapper har dermed en reell sjanse framfor å være nærmest utelukket.
6. **Tåler det obligatoriske gjennomsynssteget (FR-3) en reell elev?** Det er begrunnet i kvalitet, men det er også ekstra friksjon rett foran den eleven som strever mest. Prøv på testbrukeren i SM-10.
7. **Hva skjer når eleven limer inn noe som ikke er en fagtekst?** En oppskrift, en chatlogg, et dikt. Trolig et mykt varsel med mulighet for å fortsette — men oppførselen er ikke spesifisert, og bør avklares eller bevisst utsettes.
8. ~~**Skal samlet Fagsamtale (FR-34) måles?**~~ **Bortfalt 27. september:** Mapper er ute av v1, så spørsmålet er ikke lenger aktuelt. Det samme resonnementet — en funksjon kan leveres umålt så lenge det oppgis — er nå brukt på bildeinnlesing i stedet (FR-45).
9. **Er tetthetstaket i FR-7 riktig kalibrert for videregående?** Tallene — 4 prosent av løpende ord, 12 unike Faguttrykk per 1 000 ord — ble satt da målgruppen var ungdomstrinnet. Videregåendetekster er tettere på fagspråk, så taket kan nå binde for hardt og kutte uttrykk eleven faktisk trengte. Annoteringen av Gullsettet i FR-8 gir svaret: er det jevnlig flere enn 12 uttrykk per 1 000 ord i den manuelle annoteringen, skal taket heves — men da med tallet fra annoteringen, ikke med et anslag. Avklares i M0, siden annoteringen skjer der.
10. **Er de-orddeling av PDF mulig uten en norsk ordliste?** FR-2 krever at «informa-\nsjon» slås sammen mens «KI-assistert» beholdes. Uten en ordliste er den grensen vanskelig å treffe pålitelig. Avklar om en enkel ordliste skal inn, eller om kravet skal senkes til å gjelde de vanlige tilfellene og resten fanges av gjennomsynet i FR-3.
11. **Hvilket oppsett hos leverandøren oppfyller kravene i §6.2?** *(Delvis avklart 30. september: Anthropic er valgt for M0, med sammenligning mot minst én annen leverandør før M1, målt på gullsettet i FR-8. Gjenstår kravene under.)* Inndata skal ikke brukes til trening, behandlingsstedet skal være kjent. Les vilkårene for det du faktisk bruker — forbruker- og API-versjoner av samme tjeneste har ofte ulike vilkår her — og skriv ned hvilke vilkår og hvilken dato. Avklares før M0, siden det er leverandøren appen bygges mot.
12. **Hva tillater avtaleverket for skoleverket av digital gjengivelse, og gjelder det når eleven selv laster opp?** Berører både innliming og bildeinnlesing. Ikke undersøkt i dette prosjektet. Må stå i rapporten med en lest kilde, ikke som antakelse. Ikke blokkerende for bygging, men blokkerende for å kunne skrive §6.3 ferdig.
13. **Hvor godt virker bildeuttrekket i praksis?** Ikke målt i v1 (FR-45). Avviket mellom Råtekst og redigert tekst lagres, og er den billigste indikasjonen. Verdt å se på mot slutten selv om det ikke er en måling.

## 12. Antakelsesregister

Hver oppføring er merket `[ANTAKELSE]` der den står, og skal bekreftes eller avkreftes.

1. **§2.2** — Bruk i v1 er utviklerens testing og frivillige testbrukere som samtykker, ikke drift i en reell klasse med reelle elevdata.
2. **§2.2** — Det er videregåendetekster (Vg1–Vg3) som brukes i testing, demo og Gullsett. Flyttes målgruppen, må Gullsettene annoteres på nytt — nivået sitter i annoteringen, ikke i koden.
3. **§2.3, §4.1** — En stor del av målgruppen har papirbok eller nettbok uten brukbar kopiering. Dette er grunnlaget for at bildeinnlesing (FR-44) er i v1 og Mapper ikke er. Opplyst av utvikleren 27. september; ikke tallfestet.
4. **§4.1, FR-45** — Et multimodalt modellkall gir godt nok tekstuttrekk fra et mobilbilde av en boksides tekst til at gjennomsynet i FR-3 fase 3b holder som sikkerhetsnett. Ikke målt, og bevisst ikke målt.
5. **§4.1, FR-3** — Det obligatoriske gjennomsynssteget er verdt friksjonen. Bør prøves på testbruker.
6. **§4.7** — Kontrollkilden for ukrainsk er tilgjengelig i M1-vinduet. *(Avklart 25. september: ukrainsk morsmålsbruker funnet.)*
7. **§4.7, FR-27** — En morsmålsbruker på videregående trenger sjelden akademisk allmennspråk forklart, så kategorien markeres bare for elever med valgt Morsmål.
8. **§4.11, FR-42** — At yrkesfaglige fagtekster treffes dårligere av uttrekket enn studiespesialiserende, er en hypotese og ikke et funn. Krysningen i FR-8 avgjør, og ingen forskjell er også et resultat.
9. **§5** — Elever bruker Lesevenn på telefon like ofte som på PC, og mobil er derfor en reell flate i v1.
10. **§6.2** — Testbrukere er myndige elever på Vg3, eller mindreårige med samtykke fra foresatt.
11. **§6.4** — API-budsjettet for semesteret er i størrelsesorden 300–600 kroner. Merk at målearbeidet, ikke kjøretidsbruken, er den posten som skalerer med antall promptversjoner.
12. **§9** — ~~Innleveringsfrist i første halvdel av desember.~~ *(Avklart 25. september: fristen er 5. desember 2026, bekreftet hos emneansvarlig. Ikke lenger en antakelse.)*
13. **§9** — ~~Emnets ukeplan legger beslag på uke 44–45 med egne leveranser.~~ *(Avklart 25. september: ukeplanen er anbefalt framdrift, ikke innleveringer. Ikke lenger en antakelse.)*
14. **§9.3** — Omfang og vanskelighetsgrad vektlegges i vurderingen. Bygger på materiale fra tidligere gjennomføring, ikke publisert 2026-policy.
15. **§10, SM-10** — Minst én testbruker utenfor utvikleren er oppnåelig innen fristen.
