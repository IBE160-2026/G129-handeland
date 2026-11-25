---
title: Lesevenn
status: draft
created: 2026-09-25
updated: 2026-11-25
---

# PRD: Lesevenn

En nettapp som fører eleven gjennom en lesestrategi-sekvens for fagtekst, med KI som motor og skriftlig fagsamtale som forståelsestest.

## 0. Om dette dokumentet

Dokumentet er skrevet for utvikleren som bygger Lesevenn alene høsten 2026, i emnet IBE160 Programmering med KI ved Høgskolen i Molde. Det bygger på `product-brief-lesevenn.md` i samme mappe og gjentar ikke begrunnelsen der: briefen svarer på *hvorfor*, dette dokumentet svarer på *hva som skal virke, og hvordan man vet at det virker*.

Ordlisten i §3 fastsetter vokabularet. §4 grupperer funksjonskravene FR-1 til FR-54. Hvert FR har kravet, testbare konsekvenser og én setning om hvorfor. FR-32 til FR-34 er trukket tilbake (§4.9). FR-38 til FR-43 er flyttet til §13 som dokumentasjonskrav DK-1 til DK-6. Ingen av disse numrene gjenbrukes. FR-46 er et produktkrav og står i §4.11 «Kjørbarhet». Tverrgående krav står i §5 og §6. Antakelser er merket `[ANTAKELSE]` der de står og samlet i §12. Status og måleresultater per FR står i §9.6 «Status per 25. november». Historikk og begrunnelser står i `beslutningslogg-prd.md`, og tekniske valg som er løsning og ikke krav, i `addendum-lesevenn.md`.

Emnets mappevurdering høsten 2026 har to deler: prosjektkode og funksjonalitet teller 70 prosent, og «dokumentasjon må vise hvordan KI ble brukt, og hvordan studentene har kvalitetssikret koden». Refleksjonsrapporten teller 30 prosent. Dokumentasjonsleveransen har derfor egne krav (§13), og milepælsplanen i §9 verner tid til den.

Én regel gjelder hele dokumentet: **ingen kvalitetspåstand teller i dette prosjektet med mindre den er målt mot et fast testsett.** En språkmodells egen selvtillit er ikke dokumentasjon. Derfor har §4.3, §4.4, §4.6, §4.7 og §4.8 hvert sitt Gullsett med tallfestede terskler (§3), og de samme Gullsettene er råstoffet i dokumentasjonskravene i §13.

## 1. Visjon

Lesevenn er et lesestøtteverktøy som nekter å gi eleven svaret først. Der et generisk KI-verktøy tar imot en tekst og returnerer et sammendrag, og dermed hopper rett til produktet av lesingen og gjør selve lesingen unødvendig, fører Lesevenn eleven gjennom rekkefølgen en leselærer ville brukt: aktiver forkunnskaper før du leser, få hjelp med de vanskelige begrepene *mens* du leser, og vis til slutt at du forsto ved å forklare med egne ord til noen som følger opp svaret ditt.

Den siste delen er kjernen. En flervalgsquiz kan bestås ved gjetting, og den avslører ikke *hvor* forståelsen svikter. Lesevenn sin skriftlige fagsamtale stiller et spørsmål, leser elevens svar med egne ord, og stiller et oppfølgingsspørsmål som er utledet av det eleven faktisk skrev: mot det uklare, mot misoppfatningen, eller dypere inn i stoffet når svaret holdt. Det er den muntlige høringen i tekstform, uten avhengighet av tale-til-tekst.

For elever med norsk som andrespråk gjør Lesevenn én ting til, og gjør den bevisst begrenset: morsmålet brukes som *inngang* til den norske fagteksten, ikke som omvei rundt den. Aktiveringssiden og den avsluttende oppsummeringen kan vises på elevens morsmål, og vanskelige fagbegreper og språklige bilder pekes ut spesifikt. Men den norske teksten er alltid til stede, og det norske fagbegrepet står alltid sammen med oversettelsen. Målet er at eleven skal komme videre i norsk fagspråk, ikke slutte å møte det.

## 2. Målbruker

### 2.1 Jobber som skal gjøres

**Eleven (primær):**
- Komme gjennom en fagtekst med faktisk forståelse, ikke bare ha vært innom den.
- Forstå fagordene uten å måtte slå opp hvert enkelt et annet sted og miste tråden.
- Finne ut om forståelsen holder *før* prøven, ikke etter.
- Kunne forklare stoffet med egne ord, som er ferdigheten prøven faktisk måler.
- Slippe skammen i å ikke forstå: spørre igjen, så mange ganger man trenger, uten at noen ser på.
- For flerspråklige elever: få tak i hva teksten handler om uten å stoppe på det første ukjente ordet.

**Læreren (sekundær):**
- Kunne peke elever til et verktøy de klarer å bruke selvstendig, uten å lage individuelt tilpasset lesestøtte for hver tekst.

**Utvikleren (jobben som betaler for de andre):**
- Levere en app som virker, med dokumentasjon av hvordan KI ble brukt i utviklingen og hvordan koden og det KI-genererte innholdet ble kvalitetssikret (70 prosent), og en refleksjonsrapport (30 prosent), se §0.

### 2.2 Ikke-brukere i v1

- **Læreren som innlogget bruker.** Læreren er en talsperson i v1, ikke en bruker: det finnes ingen lærerpålogging, ingen klasseoversikt og ingen innsyn i elevens resultater. Bruker læreren Lesevenn, er det som elev.
- **Elever på ungdomstrinnet og yngre.** Tekstlengde, fagspråk og lesenivå er dimensjonert for **videregående, Vg1–Vg3, altså elever mellom 15 og 19 år**. Ingenting sperrer en tiendeklassing ute, men Gullsettene inneholder ingen ungdomsskoletekster, og prosjektet gjør derfor ingen kvalitetspåstand for det nivået. `[ANTAKELSE: det er videregåendetekster som brukes i testing og demo. Skulle målgruppen flyttes ned igjen, må Gullsettene annoteres på nytt — nivået sitter i annoteringen, ikke i koden.]`
- **Elever uten noe norsk i det hele tatt.** Morsmålsstøtten er en bro inn i den norske teksten, ikke en oversettelse av hele opplevelsen. Uten grunnleggende norsk gir Kjerneløypen lite.
- **Skoler som institusjon.** Ingen Feide-innlogging, ingen databehandleravtale, ingen administrasjon. `[ANTAKELSE: bruk i v1 er utviklerens egen testing og frivillige testbrukere som samtykker — ikke drift i en reell klasse med reelle elevdata. Dette holder personvernkravene håndterbare innenfor semesteret.]`

### 2.3 Sentrale brukerreiser

> **UJ-1. Jonas kommer seg gjennom naturfagteksten han har utsatt i tre dager.**
> Jonas går Vg1 bygg- og anleggsteknikk og er 16 år. Han valgte yrkesfag fordi han lærer best med hendene, men naturfag er fellesfag og må bestås. Han leser tregt, og lærebokas kapittel om celledeling er fire sider med ord han ikke kjenner. Han er innlogget fra forrige gang. Han limer inn teksten fra den digitale læreboka, og får først bare overskriftene tilbake til kontroll: «Celledeling», «Mitose», «Når delingen går galt». De ser riktige ut, og han trykker videre. Aktiveringssiden viser de samme overskriftene og spør hva han vet om dette fra før; brødteksten har han ennå ikke sett. «Celledeling» kjenner han litt, «Mitose» ingenting, og han skriver at han lurer på hva som kan gå galt. Han limte inn teksten selv, så det er ingen uttrekksfeil å rette, og han går rett til Lesevisningen (FR-3). Der er fjorten Faguttrykk markert; han holder pekeren over «mitose» og får forklaringen uten å forlate siden. Til slutt tar han Quizen: seks av åtte riktig, og for de to feil får han se Kildeavsnittet svaret sto i.
> **Klimaks:** han lukker fanen og vet hva mitose er, ikke fordi appen fortalte ham det, men fordi han leste det og ble sjekket på det.
> **Etterpå:** Teksten ligger lagret på kontoen med resultatet. Øvekortene med de fjorten Faguttrykkene er klare til repetisjon kvelden før prøven.
> **Kanttilfelle:** Jonas prøvde først å laste opp et PDF-utsnitt læreren hadde delt. Det var en skanning uten tekstlag, og Lesevenn sa det rett ut: filen ser ut til å være et bilde av en tekst, Lesevenn leser ikke bilder inne i en PDF, og han kan ta bilder av sidene eller lime inn teksten i stedet (PF-1). Han limte inn.

> **UJ-2. Oksana leser samfunnsfag på norsk, men kommer inn i teksten på ukrainsk.**
> Oksana går Vg2 studiespesialiserende og er 17 år. Hun kom til Norge i 2023, leser norsk godt nok til å følge undervisningen, men fagtekst om «maktfordelingsprinsippet» stopper henne før hun har begynt. Hun laster opp PDF-en, velger ukrainsk som Morsmål, og får aktiveringssiden med overskriftene på både norsk og ukrainsk, kyrillisk og latinsk skrift side om side, med skriftsnitt som dekker begge. Hun merker hva hun kan fra før og skriver spørsmålet sitt på norsk, fordi det er norsk hun øver på. I Lesevisningen er Faguttrykkene markert, og for hvert av dem står den ukrainske forklaringen med det norske ordet i parentes rett etter. To språklige bilder er pekt ut spesielt («statsmaktene er tredelt» er ikke tre stater), og tre ord fra Akademisk allmennspråk hun hadde lest forbi uten å stoppe: «forutsetning», «henholdsvis», «på bakgrunn av». Etter Quizen får hun en kort oppsummering på ukrainsk, med den norske ved siden av.
> **Klimaks:** hun har lest en norsk fagtekst, ikke en ukrainsk oversettelse av den, og hun kan de norske ordene hun trenger på prøven.
> **Etterpå:** kontoen husker at hun vil ha ukrainsk, så hun velger ikke på nytt neste gang.
> **Kanttilfelle:** sidemannen hennes velger arabisk. Han får samme flyt, med arabisk gjengitt høyre-til-venstre og norsk ved siden av, men med en synlig merknad om at oversettelsen ikke er kvalitetssikret, fordi ingen har kontrollert den (FR-24). Merknaden er ikke en unnskyldning; den er forskjellen mellom å vite og å tro.

> **UJ-3. Jonas blir tatt i å ha misforstått, og oppdager det selv.**
> Kvelden før prøven går Jonas inn i Fagsamtalen i stedet for Quizen. Lesevenn spør hva som skjer med kromosomene under mitose. Han svarer at «de blir delt i to så det blir halvparten så mange i hver celle». Det er en klassisk sammenblanding av mitose og meiose, og Lesevenn plukker den opp: i stedet for å si «feil», spør den om han kan se på avsnittet om kopiering før delingen, og hva som skjer med antallet der. Han leser om, svarer igjen, og treffer denne gangen. Neste spørsmål går videre til noe nytt, ikke tilbake til det samme.
> **Klimaks:** han fant feilen selv, med et spørsmål som pekte på den. Det er forskjellen fra en quiz som bare sier rødt.
> **Etterpå:** samtalen ligger lagret. Han ser i ettertid at det var én misoppfatning, og hvilken.

> **UJ-4. Maria har bare papirboka, og kommer i gang likevel.**
> Maria går Vg1 helse- og oppvekstfag. Læreboka i naturfag er på papir, og skolens digitale utgave lar henne ikke markere tekst. Fram til nå har det betydd at verktøy som Lesevenn har vært utenfor rekkevidde for henne. Hun legger boka flatt på pulten, tar to bilder med telefonen, én side per bilde, og laster dem opp. Lesevenn sier tydelig at teksten er lest ut av et bilde, at det ofte blir feil, og at hun bør lese ekstra nøye gjennom. Hun kontrollerer overskriftene i første steg, merker hva hun kan fra før, og får så den uttrukne brødteksten til gjennomsyn. Tre linjer har havnet i feil rekkefølge der bildet bøyde seg mot bokryggen; hun flytter dem, sletter et sidetall som kom med, og godkjenner.
> **Klimaks:** hun leser en tekst hun selv fotograferte, med Faguttrykkene markert, og hun oppdaget og rettet feilene selv, fordi appen ba henne om det framfor å late som uttrekket var perfekt.
> **Etterpå:** bildene er slettet. Det er Teksten som ligger lagret, ikke fotografiene av boka.
> **Kanttilfelle:** hadde bildet vært for mørkt til å lese noe av, ville hun fått BF-1, «det ble ikke funnet tekst i dette bildet», med oppfordring om å prøve i bedre lys, eller lime inn teksten hvis hun har den et annet sted.

## 3. Ordliste

Termene under brukes ordrett i resten av dokumentet. Synonymer er en disiplinbrist, ikke en stilistisk variasjon.

- **Tekst** — én sammenhengende fagtekst eleven har lagt inn: limt inn, eller hentet ut fra en PDF eller fra bilder av boksider. Bærer tittel, brødtekst, overskrifter, Begrepssett og alle genererte elementer. Eies av én konto.
- **Råtekst** — tegnstrengen slik den forelå etter innliming, PDF-uttrekk eller bildeuttrekk, før eleven eventuelt rettet den. Bevares ved siden av den redigerte teksten, fordi avviket mellom de to viser hvor godt uttrekket virket (FR-3, FR-45).
- **Avsnitt** — én nummerert blokk i Teksten, enten en overskrift eller brødtekst, i dokumentrekkefølge. Teksten deles i Avsnitt av én felles delingsregel (`tekst/avsnittsdeling.ts`, AD-12), som alle tre innlesingsveiene og målingene bruker. Den låste Teksten deles én gang og lagres som nummererte Avsnitt (AD-2). Brukes i FR-3 og FR-7.
- **Kjerneløype** — den faste sekvensen Aktivering → Lesevisning → Quiz. Tekstgjennomsynets fase 3b (FR-3, for PDF og bilde) ligger mellom Aktivering og Lesevisning, men er et innlesingssteg og ikke et ledd i løypen. Fagsamtale, Øvekort, Minnevers og morsmålsstøtte henger på løypen, men er ikke ledd i den.
- **Aktivering** — første steg i Kjerneløypen: overskriftene vises uten brødtekst, og eleven merker hvor godt hun kjenner hver av dem og kan skrive noe hun lurer på (FR-5, FR-6).
- **Lesevisning** — Teksten vist for lesing, med Faguttrykk markert inline og forklaring tilgjengelig uten at eleven forlater siden.
- **Faguttrykk** — et ord eller uttrykk hvis betydning er spesifikk for Tekstens fagområde, og som en elev på videregående rimeligvis ikke kjenner. Gjelder like fullt akademisk fagspråk («mitose», «tektonisk plate», «allegori») og praksisnær yrkesfagterminologi («bæreevne», «sveisefuge», «hygieneforskrift»). Ikke allment akademisk språk («faktor», «prosess», «utvikling»), ikke egennavn med mindre de bærer argumentet, ikke tall eller datoer.
- **Begrepssett** — de Faguttrykkene Lesevenn har utvunnet fra én Tekst, hvert med en forklaring og en Viktighetsrangering. Ferdig kappet til tetthetsgrensene ved uttrekk (FR-7). Én kilde, mange bruk: Lesevisningens markeringer, Øvekortene og Minneverset kommer alle fra Begrepssettet, aldri fra separate uttrekk.
- **Viktighetsrangering** — intern sorteringsnøkkel på hvert Faguttrykk, som uttrykker hvor sentralt det er for Tekstens argument. Bestemmer hva som faller ut når tetthetsgrensene kapper Begrepssettet. Vises ikke til eleven og er ikke en kvalitetspåstand.
- **Akademisk allmennspråk** — ord som ikke hører til noe enkelt fag, men til skriftlig fagspråk generelt («forutsetning», «tilsvarende», «henholdsvis»). Ikke Faguttrykk, og med vilje utenfor Begrepssettet, men utpekt for elever med valgt Morsmål (FR-27), fordi det er disse ordene en andrespråksleser stopper på uten at en morsmålsbruker merker det.
- **Quiz** — et generert sett spørsmål om én Tekst, med automatisk retting og henvisning tilbake til Kildeavsnittet.
- **Kildeavsnitt** — det Avsnittet i Teksten som et generert element (Quiz-spørsmål, Samtalespørsmål, forklaring av et Faguttrykk) er forankret i. Hvert generert element har ett, lagret som Avsnittets nummer (AD-2).
- **Øvekort** — ett kort per Faguttrykk i Begrepssettet: uttrykket på forsiden, forklaringen på baksiden.
- **Fagsamtale** — en skriftlig dialogrunde om én Tekst. Lesevenn stiller et Samtalespørsmål, eleven svarer med egne ord, svaret får en Svarvurdering, og neste Samtalespørsmål utledes av den.
- **Samtalespørsmål** — ett spørsmål i en Fagsamtale. Må kunne besvares fra Teksten alene.
- **Svarvurdering** — klassifiseringen av ett elevsvar i én av fem tilstander (Dekkende, Delvis, Misoppfatning, Uklart, Utenfor), med én setnings begrunnelse. Vises til eleven. Er aldri en karakter.
- **Morsmål** — språket eleven har valgt for morsmålsstøtte. Enten et Kvalitetssikret språk eller et Modellstøttet språk.
- **Kvalitetssikret språk** — et Morsmål utvikleren har målt oversettelseskvaliteten for mot Gullsett Oversettelse (FR-28), og som derfor vises uten forbehold.
- **Modellstøttet språk** — et Morsmål språkmodellen håndterer, men som ikke er målt. Vises alltid med synlig merknad om at kvaliteten ikke er kontrollert.
- **Minnevers** — et kort rim eller vers som knytter sammen Faguttrykk fra Begrepssettet, til pugging. Alternativt en ferdig formulert Suno-prompt eleven kan bruke i et eksternt verktøy.
- **Mappe** — elevens egen samling av Tekster, for eksempel til samme prøve (FR-50). Har Samlet øving og Samlet quiz, begge satt sammen av det Tekstene alt har lagret (§4.9). Har ingen samlet Fagsamtale (§8.2).
- **Samlet øving** — alle Øvekortene fra de låste Tekstene i en Mappe, øvd under ett (FR-51).
- **Samlet quiz** — en Quiz satt sammen av spørsmålene Tekstene i en Mappe allerede har. Ingen nye spørsmål lages (FR-52).
- **Arbeidsbord** — siden en innlogget elev kommer til. Viser de fem Tekstene eller Mappene med nyest aktivitet som bunker, med neste steg på den nyeste (FR-48).
- **Samlinger** — siden med alle elevens Tekster, med søk og sortering, og elevens Mapper (FR-49, FR-50).
- **Buddy** — figuren i grensesnittet. Utad heter appen LeseBuddy; i kode og planleggingsdokumenter heter den Lesevenn (§4.12).
- **Gullsett** — et testsett utvikleren har annotert manuelt, som KI-utdata måles mot. Hver måleterskel i dokumentet peker til et Gullsett. Settene har faste navn: **Gullsett Faguttrykk** (seks Tekster, FR-8, også brukt i FR-11), **Gullsett Quiz** (24 spørsmål, FR-14), **Gullsett Fagsamtale** (36 samtaletilfeller, FR-21), **Gullsett Oversettelse** (fire Tekster, FR-28) og **Gullsett Minnevers** (10 vers, FR-31).
- **KI-logg** — den løpende loggen over hvordan KI ble brukt under *utviklingen* av Lesevenn (§13). Skilles fra Promptregisteret, som gjelder appens egne kjøretidsprompter.
- **Promptregister** — de versjonerte promptene appen selv sender til språkmodellen under kjøring, med måleresultat per versjon (§13).

## 4. Funksjoner

### 4.1 Innlesing av tekst

**Beskrivelse:** Eleven får teksten inn på tre veier: liming i et tekstfelt (FR-1), opplasting av PDF med tekstlag (FR-2) eller bilder av boksider (FR-44). Alle tre ender i et gjennomsyn rundt Aktiveringen (FR-3): overskriftene kontrolleres alltid, og for PDF og bilde vises hele Råteksten redigerbar etterpå. Gjennomsynet gjør parsefeil synlige og rettbare, i stedet for at de forplanter seg stille inn i markeringer, Quiz og Fagsamtale. **Ingen feiltilstand er en blindvei:** hver feil sier på vanlig norsk hva som gikk galt, hvorfor, og minst én konkret ting eleven kan gjøre videre. Realiserer UJ-1, UJ-2, UJ-4.

**Funksjonskrav:**

#### FR-1: Innliming av tekst

Eleven kan lime inn eller skrive tekst i et felt og starte Kjerneløypen fra den.

**Konsekvenser (testbare):**
- Tekst under 400 tegn avvises med begrunnelse: Kjerneløypen trenger nok tekst til å gi overskrifter, Begrepssett og Quiz. Antall tegn som mangler oppgis.
- Tekst over **8 000 tegn** avvises ikke stille. Eleven får valget mellom å bruke de første 8 000 tegnene, med kuttpunktet synlig markert, eller å dele teksten i flere Tekster.
- Tekst blir aldri forkortet uten at eleven har sett og godtatt hvor kuttet går.
- Eleven kan gi Teksten en tittel; står feltet tomt, foreslås første overskrift eller første setning.

**Hvorfor:** 8 000 tegn ligger like over de lengste Tekstene i Gullsett Faguttrykk og Gullsett Quiz, så tersklene i §4.3 og §4.4 gjelder for det eleven møter.

#### FR-2: Opplasting og uttrekk av PDF

Eleven kan laste opp en PDF-fil, og Lesevenn trekker ut brødteksten som Råtekst. **Uttrekket skjer i nettleseren, ikke på serveren:** PDF-filen forlater aldri elevens maskin, og bare den uttrukne teksten sendes videre.

**Konsekvenser (testbare):**
- Filer over 10 MB eller 40 sider avvises før uttrekk, med faktisk størrelse og grensen oppgitt. Grensen gjelder i klienten.
- Uttrekket opphever bindestreksdeling over linjeskift etter en enkel regel: slå sammen når tegnet før bindestreken og tegnet etter linjeskiftet begge er små bokstaver, behold bindestreken når én av sidene starter med stor bokstav eller et siffer. Regelen gir «informa-» + «sjon» → «informasjon», og bevarer «KI-assistert», «e-post» og «20-åring».
- Regelen treffer ikke sammensatte ord med reell bindestrek der begge sider er små bokstaver. Det er en kjent og bevisst begrensning i v1, ikke et løst problem. Restfeilene fanges av gjennomsynet i FR-3 fase 3b.
- Linjer som gjentas på mer enn halvparten av sidene fjernes som topp-/bunntekst. Fjernede linjer er synlige for eleven i gjennomsynet, ikke slettet i det skjulte.
- Uttrekket fullføres eller feiler innen 20 sekunder for en fil innenfor grensene. Feiler det i nettleseren, får eleven melding med prøv-igjen-knapp, og filen er fortsatt valgt.

**Hvorfor:** En opphavsrettsbeskyttet lærebokfil blir aldri overført noe sted (§6.3), og leverandørens serverfunksjon tar uansett imot høyst 4,5 MB i en forespørsel.

#### FR-3: Gjennomsyn og retting av Råtekst, i to faser

Gjennomsynet er delt i to faser, på hver sin side av Aktiveringen.

| Fase | Når | Hva eleven ser | Hvorfor der |
|---|---|---|---|
| **3a — Overskriftskontroll** | Rett etter innlesing, før Aktivering | Bare de uttrukne overskriftene, redigerbare | Aktiveringen trenger riktige overskrifter, og bare dem |
| **3b — Tekstgjennomsyn** | Etter Aktivering, før Lesevisning | Hele den uttrukne teksten, redigerbar | Her rettes parsefeil, før Begrepssettet genereres |

**Konsekvenser (testbare):**
- Fase 3a kan ikke hoppes over.
- **Fase 3b hoppes over for innlimt tekst**: teksten låses slik eleven limte den inn, når Aktiveringen er ferdig. For PDF og bilde kan fase 3b ikke hoppes over (FR-4, FR-45).
- I fase 3a vises **bare** overskriftene. Brødteksten er ikke tilgjengelig, verken synlig eller i sidens kildekode, samme krav som i FR-5.
- Eleven kan i fase 3a rette, legge til, slette og omordne overskrifter. Fant uttrekket ingen overskrifter, opprettes de genererte etikettene fra FR-5 her, og eleven kan endre dem.
- I fase 3b kan eleven redigere brødteksten fritt: slette, omorganisere, skrive inn manglende tekst.
- Ved PDF-uttrekk vises en tellet oppsummering av hva som ble gjort: antall sider lest, antall linjer fjernet som topp-/bunntekst, antall bindestreksdelinger slått sammen.
- Råteksten lagres uendret ved siden av den redigerte teksten.
- **Teksten låses når eleven godkjenner fase 3b** (innlimt tekst: når Aktiveringen er ferdig). Etter låsen kan brødteksten ikke redigeres; vil eleven endre noe, lager hun en ny Tekst. Begrepssettet (FR-7) genereres først etter låsen, aldri før.
- Inneholder Råteksten tabeller eller formler, varsles eleven om at slikt innhold sjelden overlever uttrekk, med oppfordring om å se særlig etter det.

**Hvorfor:** Aktiveringen virker bare før eleven har sett brødteksten (FR-5), og Kildeavsnittene til alt generert innhold peker inn i den låste teksten (§5).

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
- En «søkbar PDF» fra en skanner har et tekstlag og passerer PF-1. Den har ingen egen feiltilstand; rotete tekst fra den fanges i FR-3 fase 3b. Terskelen på 100 tegn per side skiller mellom «ingen tekst» og «noe tekst», ikke mellom «skannet» og «digital».

**Utenfor dette FR-et:**
- Tekstgjenkjenning av skannede PDF-er. Bilder håndteres i stedet av FR-44.
- Innlesing fra URL.

**Hvorfor:** Ingen feiltilstand skal være en blindvei (§4.1).

#### FR-44: Bildeinnlesing av boksider

Eleven kan laste opp ett eller flere bilder av en boksides tekst, og Lesevenn henter ut teksten som Råtekst. Uttrekket gjøres med den samme multimodale språkmodellen som standardoppgavene bruker (§6.4).

**Konsekvenser (testbare):**
- Støttede formater er JPEG, PNG og HEIC. Høyst **fire bilder** per Tekst. Eleven kan velge et bilde av vilkårlig størrelse fra kameraet sitt; det er hva som *sendes* som er begrenset.
- **Bildet krympes i nettleseren før det sendes**, til høyst 2 000 piksler bredde og JPEG-kvalitet rundt 85.
- **Ett bilde per forespørsel**, ikke fire i én. Hver forespørsel holder seg under **4 MB**. Eleven får framdrift per bilde.
- Flere bilder tolkes som sider i rekkefølge, og eleven kan endre rekkefølgen før uttrekket kjøres.
- Uttrukket tekst går inn i samme løype som alt annet: fase 3a for overskrifter, Aktivering, fase 3b for brødtekst (FR-3). Ingen snarvei forbi gjennomsynet.
- Bildene **lagres aldri** (AD-16). De krympes i nettleseren og sendes bare til uttrekket. Det er Råteksten som bevares, ikke bildet (§6.2, §6.3).
- Metadata i bildefilen (posisjon, enhet, tidspunkt) fjernes før bildet sendes videre.
- Eleven får se en påminnelse om å fotografere bare den siden hun trenger, før første opplasting.
- **Navngitte feiltilstander**, etter samme regel som FR-4:

| # | Feiltilstand | Hva eleven ser |
|---|---|---|
| BF-1 | Ingen lesbar tekst funnet i bildet | «Det ble ikke funnet tekst i dette bildet.» → ta et nytt bilde i bedre lys, eller lim inn teksten |
| BF-2 | For mange bilder, eller et bilde som ikke kommer under 4 MB selv etter krymping | Faktisk antall og størrelse oppgis → fjern bilder, eller ta bildet på nytt i lavere oppløsning |
| BF-3 | Filformat som ikke støttes | Formatet oppgis, sammen med hvilke som virker |
| BF-4 | Uttrekket ga svært lite tekst (under 400 tegn totalt) | Samme grense som FR-1 → gjennomsynet vises likevel, slik at eleven kan skrive inn resten selv |
| BF-5 | Tidsavbrudd eller tjenerfeil | Ett automatisk nytt forsøk, deretter melding med prøv-igjen-knapp. Bildene beholdes |
| BF-6 | Dagstaket for appen er nådd (FR-54) | Bildet sendes ikke. Meldingen for dagstaket → lim inn teksten, som ikke koster noe KI-kall |
| BF-7 | Kontoen har lagt inn 5 Tekster i dag (FR-54) | Meldingen for Tekst-grensen. Ingen vei videre før i morgen |

**Hvorfor:** En stor del av målgruppen har papirbok, eller nettbok som sperrer for markering og kopiering, og uten bildeinngang er appen ubrukelig for dem. `[ANTAKELSE: at en stor del av målgruppen mangler brukbar kopiering er opplyst av utvikleren, ikke tallfestet. Holder det ikke, er bildeinngangen mindre viktig enn Mapper var, og byttet i §4.9 var feil.]`

#### FR-45: Bildeinnlesing er ikke kvalitetssikret, og sier det

Bildeinngangen leveres uten kvalitetspåstand, og det er synlig i grensesnittet.

**Konsekvenser (testbare):**
- Ved bildeinnlesing vises en merknad om at teksten er lest ut av et bilde, at det ofte blir feil, og at eleven bør lese gjennom den ekstra nøye i gjennomsynet. `[ANTAKELSE: et multimodalt modellkall leser et mobilbilde av en boksides tekst godt nok til at gjennomsynet holder som sikkerhetsnett. Bevisst ikke målt i v1.]`
- Det finnes **ikke** et Gullsett med terskler for bildeuttrekk i v1, og prosjektet påstår ingen treffsikkerhet for det.
- Rapporten oppgir bildeuttrekk eksplisitt som en umålt del av leveransen, med begrunnelsen: bildeuttrekk er et sjette måleområde i et prosjekt som alt er stramt på timer, og et sjette Gullsett ville gått ut over kvaliteten på de fem som finnes.
- Avviket mellom Råtekst og redigert tekst (FR-3) lagres.

**Utenfor dette FR-et:**
- Innlesing fra URL.
- Tekstgjenkjenning av en hel innskannet bok som PDF.

**Hvorfor:** En funksjon kan tilbys uten å være målt, så lenge det står hvilken av de to den er, samme mekanisme som Modellstøttet språk i FR-24.

### 4.2 Aktivering

**Beskrivelse:** Første steg i Kjerneløypen viser Tekstens overskrifter uten brødtekst. Eleven merker hvor godt hun kjenner hver av dem fra før, og kan skrive noe hun lurer på. Forkunnskapen vurderes ikke og rettes ikke. Realiserer UJ-1, UJ-2, UJ-4.

**Funksjonskrav:**

#### FR-5: Visning av overskrifter

Aktiveringssiden viser Tekstens overskrifter i dokumentrekkefølge, uten brødtekst.

**Konsekvenser (testbare):**
- Overskriftene er de eleven har kontrollert og eventuelt rettet i fase 3a (FR-3).
- Har Teksten ingen gjenkjennelige overskrifter, genererer Lesevenn tre til seks korte avsnittsetiketter fra innholdet, og merker dem synlig som laget av Lesevenn og ikke hentet fra teksten.
- Brødteksten er ikke tilgjengelig fra aktiveringssiden, verken synlig eller i sidens kildekode.

**Hvorfor:** Forkunnskapen skal hentes fram før lesingen, og verdien forsvinner dersom eleven kan kikke.

#### FR-6: Elevens forkunnskap

Over overskriftene står ett spørsmål, «Hva vet du om dette fra før?». Eleven svarer for hver overskrift med en glider i tre trinn, «Ingenting ennå» – «Litt» – «Mye», eller med knappen «Skjønner ikke overskriften» under den. Hun kan skrive ett valgfritt spørsmål («Noe du lurer på før du leser?»), og går videre.

**Konsekvenser (testbare):**
- Merkingen lagres på Teksten med overskriftens tekst og merket, og spørsmålet lagres (høyst 500 tegn).
- Kodene som lagres, er `kjent` = «Mye», `litt` = «Litt», `nytt` = «Ingenting ennå» og `uklar` = «Skjønner ikke overskriften». Eldre merker vises med de nye navnene uten migrasjon: «Dette kan jeg» leses som «Mye» og «Har hørt om» som «Litt».
- Lesevisningen har, rett før «Ferdig med å lese?», en del «Før du leste» som viser spørsmålet («Du lurte på: … Fikk du svar?», med lenke til Fagsamtalen), hvilke overskrifter som var helt nye, og hvilke hun ikke skjønte («Disse overskriftene skjønte du ikke: … Gir de mening nå?»). «Fikk du svar?» er en oppfordring og lagres ikke.
- Tekster fra før 17.11.2026 har et fritt svar. Det beholdes i databasen og vises under «Før du leste». Har en Tekst ingenting, vises ikke delen.
- Åpnes Aktiveringen igjen etter at Teksten er låst, vises spørsmålet og overskriftene med elevens merke, uten skjema.
- Ingenting får vurdering, retting eller poengsum, og Buddy svarer ikke på spørsmålet. Forkunnskapen sendes aldri til språkmodellen.
- Merkingen er en glider (`<input type="range">`) per overskrift med overskriften som navn, spørsmålet som beskrivelse og trinnets navn som `aria-valuetext`, og en av/på-knapp «Skjønner ikke overskriften» (`aria-pressed`) under. En urørt glider er ikke merket: den sier «Ikke merket ennå», og ingenting lagres for overskriften. Alle tre trinnene kan velges fra urørt med mus, berøring og tastatur. «Skjønner ikke» overstyrer glideren til den røres igjen.
- Merkingen virker med tastatur og på 320 px med 200 % tekst, men krever skript; uten skript lagres ingen merker, og eleven slipper videre etter oppfordringen.
- Eleven kan gå videre uten merking og uten spørsmål etter én oppfordring om å prøve.

**Hvorfor:** Merkingen krever ett trykk per overskrift, spørsmålet gir eleven en grunn til å lese, og «Før du leste» gir det hun gjorde en ende.

### 4.3 Begrepssett og lesevisning

**Beskrivelse:** Lesevenn utvinner Faguttrykk fra Teksten og markerer dem inline i Lesevisningen, med forklaring tilgjengelig uten at eleven forlater siden. Seksjonen definerer både hva som *skal* markeres (§3, Faguttrykk) og hvor godt det må treffe (FR-8).

To feilmåter er like alvorlige og trekker i motsatt retning. Markerer Lesevenn for lite, står eleven fortsatt fast på ordene som stoppet henne. Markerer Lesevenn for mye, mister markeringen sin informasjonsverdi, og det er den lettere feilen for en språkmodell. Derfor har FR-7 et hardt tetthetstak, og §10 har en motmetrikk (SM-C1) som sier at flere markeringer ikke er bedre. Realiserer UJ-1, UJ-2, UJ-4.

**Funksjonskrav:**

#### FR-7: Uttrekk av Faguttrykk

Lesevenn utvinner et Begrepssett fra Teksten: Faguttrykk med forklaring, Kildeavsnitt og viktighetsrangering. Begrepssettet kappes til tetthetsgrensene ved uttrekk, ikke ved visning, og lagres ferdig kappet.

**Konsekvenser (testbare):**
- Hvert Faguttrykk forekommer ordrett i Teksten. Ingen oppdiktede uttrykk. Måles maskinelt som delstrengsjekk: **100 prosent**, uten unntak. Et Faguttrykk som ikke består sjekken, kastes før visning.
- Hvert Faguttrykk har en forklaring på maksimalt to setninger, skrevet for en elev på videregående.
- Ingen forklaring er sirkulær: forklaringen kan ikke bestå utelukkende av uttrykket selv med bøyninger eller ordklasseendring. Måles maskinelt: **100 prosent**.
- Hvert Faguttrykk har ett Kildeavsnitt, slik at eleven kan se hvor i teksten det står. Kildeavsnittet er brødtekst, aldri en overskrift.
- Hvert Faguttrykk har en **viktighetsrangering** satt ved uttrekk, som uttrykker hvor sentralt uttrykket er for Tekstens argument. Prompten krever at rangeringen skiller Faguttrykkene fra hverandre, og at de viktigste ikke alle hentes fra samme del av Teksten. `[ÅPENT: om et krav i prompten er nok, eller om kappingen også må sikre spredning over Avsnittene. Avklares mot Gullsettet.]`
- Viktighetsrangeringen er en intern sorteringsnøkkel. Den vises ikke til eleven og brukes ikke som dokumentasjon på at uttrekket er godt (SM-C4). Bare målingen i FR-8 sier noe om kvalitet.
- **Tetthetsgrensene:** høyst **4 prosent** av Tekstens løpende ord, høyst **12 unike Faguttrykk per 1 000 ord**, og høyst **3 markeringer per 100 sammenhengende ord**.
- **Gulv:** **inntil 5 Faguttrykk** kan beholdes selv om det bryter grensene, slik at en kort tekst ikke ender med ett markert ord. Gulvet gjelder alle tre takene.
- **Ingen nedre grense.** Formuleringen er «inntil 5», ikke «minst 5». Finner uttrekket tre Faguttrykk, er Begrepssettet tre. Finner det null, er det null.
- **Kappingen bruker det billigste virkemidlet først**, i denne rekkefølgen: (1) kutt til det antallstaket tillater, `floor(12 × ord/1000)`, med gulvet som nedre skranke for korte Tekster, og lavest rangerte Faguttrykk faller ut først; (2) marker hvert Faguttrykk høyst én gang per Avsnitt; (3) marker hvert Faguttrykk bare første gang.
- **Et Faguttrykk fjernes aldri for å rette prosentgrensen eller vindustaket**, bare for antallstaket.
- Kappingen skjer én gang, her. Det lagrede Begrepssettet er det ferdig kappede settet, slik at Lesevisningen (FR-9) og Øvekortene (FR-16) viser nøyaktig samme sett og avvikstesten i FR-16 holder.
- **Tetthetstallene er måletall, ikke garantier om det eleven ser.** Kan et tak ikke oppfylles uten å bryte gulvet over eller regelen i FR-9 om at hvert beholdt Faguttrykk markeres, leveres settet, og tallet rapporteres med faktisk verdi, også når det er over taket. Ingen sperre skal bygges på at tallene er innenfor.
- **Tomt eller tynt Begrepssett sies rett ut.** Finner uttrekket ingen eller nesten ingen Faguttrykk, viser Lesevenn det som et faktum, «det ble ikke funnet fagbegreper i denne teksten», og lar eleven gå videre i Kjerneløypen uten markeringer. Øvekort tilbys da ikke (FR-16).
- **Mykt varsel ved tekst som ikke ser ut som fagtekst.** Er Begrepssettet tomt eller nær tomt, og teksten i tillegg har trekk som peker bort fra fagtekst (svært korte setninger, replikkmarkører, listepreg), vises et ikke-blokkerende varsel om at teksten ikke ser ut som en fagtekst, med mulighet for å fortsette likevel. En feilklassifisert fagtekst skal aldri låse eleven ute.
- **Når kallet feiler.** Gir uttrekket ugyldig eller manglende svar etter ett nytt forsøk, sier Lesevenn at fagordene ikke kunne lages nå, og tilbyr «Prøv igjen». Teksten og Aktiveringen er lagret, og eleven mister ingenting.

**Hvorfor:** Et fjernet Faguttrykk er et fagord eleven ikke får forklart, mens en fjernet markering bare er samme ord uthevet én gang mindre. Derfor ofrer kappingen markeringer før Faguttrykk, og et gulv på «minst 5» ville tvunget modellen til å finne på uttrykk.

#### FR-8: Måling av treffsikkerhet mot Gullsett

Uttrekkets kvalitet måles mot Gullsett Faguttrykk, et manuelt annotert sett, og tallene er en leveranse, ikke en intern sjekk.

**Konsekvenser (testbare):**
- Gullsett Faguttrykk er **seks Tekster** på **videregående nivå (Vg1–Vg3)**, hver på **1 500–7 500 tegn**, fordelt over fag, **fagtype** (fellesfag eller programfag), tekstkilde og teksttype. Det konkrete settet står i tabellen under. Lisens, kreditering og hvert enkelt kutt er ført i `annotering.md`.

| # | Fag | Fagtype | Tekst | Kilde | Type | Ord |
|---|---|---|---|---|---|---|
| 1 | Naturfag | fellesfag | NDLA *Egenskaper hos ulike EM-bølger* (`naturfag-em-bolger`) | læremiddel | oversikt | 790 |
| 2 | Samfunnsfag | fellesfag | SSB *Høy prisvekst gir ny renteøkning* (`samfunnsfag-prisvekst`) | autentisk | fokusert | 648 |
| 3 | Norsk | fellesfag | *Språklige bilder: metafor, allegori og allusjon*, satt sammen av tre NDLA-artikler (`norsk-sprakligebilder`) | læremiddel | fokusert | 1 175 |
| 4 | Norsk | fellesfag | SNL *metafor*, artikkelen uten sidefot (`norsk-metafor`) | autentisk | oversikt | 602 av 701 |
| 5 | Teknologiforståelse | **programfag** | NDLA *Domeneoppbygning og toppdomene* (`teknologi-domeneoppbygning`) | læremiddel | fokusert | 634 |
| 6 | Teknologiforståelse | **programfag** | Wikipedia *Operativsystem*, innledning og første deler (`teknologi-operativsystem`) | autentisk | oversikt | 726 av 4 018 |

  Ordtallene er de i `testdata/gullsett/*.meta.json`, som målingen regner budsjettet fra. Tekst 3 er en redaksjonell konstruksjon, ikke en publisert artikkel; begrunnelsen står i `maaling/hent-gullsett.mjs`.

- **Hver Tekst merkes med tekstkilde**, og tallene rapporteres med merket. To kilder skal være representert: **digitalt læremiddel**, typisk NDLA, og **mer autentisk fagtekst** uten samme redaksjonelle bearbeiding. Fordelingen skal være om lag halv om halv, og begge kilder skal forekomme i hvert fag.
- **Hver Tekst merkes også med teksttype: fokusert eller oversikt.** Gullsett Faguttrykk skal inneholde begge typer.
- **Alle seks Tekstene skal kunne deles i et offentlig repo**, med kreditering og lisens oppgitt (FR-46).
- Utvikleren annoterer manuelt hvilke uttrykk som *skulle* vært markert, før uttrekket kjøres.
- **Annoteringen er ikke uttømmende.** Den skriver ned de Faguttrykkene eleven *mest* trenger forklart, og har høyst `|G| ≤ budsjett / 0,75` per Tekst, der budsjettet er antallstaket i FR-7 (`floor(12 × ord/1000)`, med gulv 5). Ellers er gjenkallingen strukturelt begrenset uansett hvor godt uttrekket er. Grensen per Tekst:

| Tekst | Ord | Budsjett | Maks `|G|` for at 0,75 er nåbar |
|---|---|---|---|
| norsk-sprakligebilder | 1 175 | 14 | 18 |
| naturfag-em-bolger | 790 | 9 | 12 |
| teknologi-operativsystem | 726 | 8 | 10 |
| samfunnsfag-prisvekst | 648 | 7 | 9 |
| teknologi-domeneoppbygning | 634 | 7 | 9 |
| norsk-metafor | 602 | 7 | 9 |

  **Avklart etter målingene (25.11):** taket i FR-7 og tersklene under beholdes. Annoteringen ligger innenfor budsjettet for alle seks Tekstene (5–12 mot maks 9–18), så taket er ikke det som begrenser gjenkallingen. Utviklerens samsvar med seg selv er 0,62 (positivt samsvar, FR-8), altså under tersklene på 0,75 og 0,70. Tersklene står som mål, men er neppe nåbare med dette Gullsettet uansett modell, og det er et funn til DK-6.
- **Gjenkalling ≥ 0,75**: minst tre av fire uttrykk i Gullsett Faguttrykk blir funnet. Gjenkalling er `|G ∩ M| / |G|`, der `G` er annoteringen og `M` er det Lesevenn faktisk leverer.
- **Presisjon ≥ 0,70**: høyst tre av ti markerte uttrykk er støy.
- **Egen annoteringsstøy måles først.** To av de seks Tekstene annoteres to ganger, med minst sju dagers mellomrom. Samsvaret mellom de to annoteringene rapporteres som positivt samsvar og Cohens κ over alle ordformer i teksten (annotering.md steg 5). Er κ lav, rapporteres det som et funn.
- **Forklaringenes riktighet:** utvikleren vurderer manuelt om forklaringen til hvert Faguttrykk i Gullsett Faguttrykk er faglig riktig og i samsvar med Kildeavsnittet. Antall gale forklaringer i Gullsett Faguttrykk: **null**. På andre Tekster kan det komme feil; derfor sier grensesnittet at Buddy er en språkmodell som kan ta feil (§6.1). Målingen bruker de samme seks Tekstene.
- Presisjon, gjenkalling og F1 rapporteres per fag, **per tekstkilde og per teksttype**, ikke bare som snitt. Fordelingen per fagtype rapporteres også. Tallene per tekstkilde leses med forbeholdet at Tekst 6 er den eneste med et tungt kutt, og at teksttype og tekstkilde ikke er helt uavhengige.
- **Ingen av inndelingene har egen terskel**, verken per fag, tekstkilde, teksttype eller fagtype. Med én eller to Tekster per celle er tallet en observasjon, ikke en måling. Fordelingen per fag er råstoff til skjevhetsdrøftingen i DK-5 (FR-42).
- Målingen kjøres på nytt for hver versjon i Promptregisteret (DK-2), og resultatene lagres per versjon.

**Hvorfor:** Uttrekket har størst risiko for stille kvalitetssvikt, og presisjon og gjenkalling måler bare *hvilke* uttrykk som ble funnet, mens forklaringene er det eleven pugger på Øvekortene.

#### FR-9: Markering i Lesevisningen

Faguttrykkene i Begrepssettet markeres inline i den løpende teksten.

**Konsekvenser (testbare):**
- **Alle** Faguttrykk i Begrepssettet markeres. Tetthetsgrensene i FR-7 er håndhevet ved uttrekk, så Lesevisningen kutter ingenting på egen hånd.
- Markeringen er ikke avhengig av farge alene: farge kombineres med understreking eller annen ikke-fargebasert utheving, slik at den også virker for elever med fargesynssvekkelse.
- Teksten er lesbar som tekst: markeringen bryter ikke linjeflyt, ordmellomrom eller setningsrekkefølge.

**Hvorfor:** Eleven skal aldri møte et uttrykk på Øvekortene som ikke var markert i teksten hun leste.

#### FR-10: Forklaring uten å forlate siden

Eleven får forklaringen på et markert Faguttrykk uten navigasjon bort fra Lesevisningen.

**Konsekvenser (testbare):**
- Forklaringen vises på **tre** måter: ved trykk (berøring), ved pekerhvil, og ved tastaturfokus. Den lukkes med Escape, med trykk utenfor, og med lukkeknapp.
- Kravet testes på telefon, ikke bare i en smal nettleser på PC.
- Lesevisningens rulleposisjon endres ikke når en forklaring åpnes eller lukkes.

**Hvorfor:** Pekerhvil finnes ikke på telefon, og §5 regner mobil som en reell flate.

#### FR-11: Stabilitet mellom kjøringer

Samme Tekst gir i praksis samme Begrepssett.

**Konsekvenser (testbare):**
- Samme Tekst sendt inn to ganger gir **minst 0,80 overlapp** (Jaccard) i det **ferdig kappede Begrepssettet**, altså det eleven faktisk ser, målt over de seks Tekstene i Gullsett Faguttrykk. Målingen gjelder det kappede settet, ikke modellens råsvar.
- **Råsvarets stabilitet rapporteres ved siden av, uten terskel.** Skiller de to tallene seg mye, ligger ustabiliteten i kappingen og ikke i uttrekket.
- **Jaccard rapporteres per teksttype og per tekstkilde, ikke bare som snitt over de seks.** Dette er et krav og ikke en anbefaling (samme grunn som i SM-8).
- Målingen trenger ikke annoteringene, bare Tekstene, og kan kjøres så snart de seks Tekstene er valgt.
- Begrepssettet lagres på Teksten ved første kjøring og gjenbrukes deretter. Det genereres ikke på nytt ved hver visning.

**Hvorfor:** Det lagrede settet er én trekning blant flere mulige, og det blir permanent, så et ustabilt uttrekk gjør kvaliteten eleven får (også på Øvekort og Minnevers) delvis til flaks.

#### FR-12: Leseinnstillinger

Eleven kan tilpasse Lesevisningen til egen lesing.

**Konsekvenser (testbare):**
- Tekststørrelse og linjeavstand kan justeres, og valget huskes på kontoen.
- Linjelengden er begrenset til om lag 70 tegn uavhengig av skjermbredde.

**Hvorfor:** Lange linjer er et kjent hinder for elever som strever med lesing, og dette er en lesestøtteapp.

### 4.4 Quiz

**Beskrivelse:** Siste ledd i Kjerneløypen. Quizen er et sjekkpunkt, ikke en prøve: den retter automatisk og peker tilbake i teksten når svaret var feil, slik at eleven vet hvor hun skal lese om. Den viktigste kvalitetsregelen er forankring: hvert spørsmål må kunne besvares fra Teksten alene. Realiserer UJ-1.

**Funksjonskrav:**

#### FR-13: Generering av Quiz

Lesevenn genererer en Quiz fra Teksten.

**Konsekvenser (testbare):**
- Quizen har **åtte spørsmål**, hvorav minst fem er flervalg med fire alternativer, og minst ett krever et kort skriftlig svar.
- Spørsmålene dekker Tekstens hoveddeler: ingen av Tekstens overskriftsdeler er uten minst ett spørsmål, når Teksten har fire eller færre deler.
- Quizen lagres på Teksten og gjenbrukes ved senere visning, ikke regenerert.
- Quizen lages når eleven åpner den, uten en egen bekreftelse. Ventetiden vises etter §5.
- **Når kallet feiler.** Gir genereringen ugyldig eller manglende svar etter ett nytt forsøk, sier Lesevenn at quizen ikke kunne lages nå, og tilbyr «Prøv igjen». Ingen Quiz lagres fra et mislykket kall.

**Hvorfor:** Quizen er sjekkpunktet som avslutter Kjerneløypen, og den skal dekke Tekstens hoveddeler.

#### FR-14: Forankring i Teksten

Hvert Quiz-spørsmål er forankret i et Kildeavsnitt og kan besvares fra Teksten alene.

**Konsekvenser (testbare):**
- Hvert spørsmål har ett Kildeavsnitt, lagret sammen med spørsmålet.
- For flervalgsspørsmål støttes **nøyaktig ett** alternativ av Teksten, og de øvrige er verifiserbart gale ut fra Teksten, ikke bare mindre gode.
- Måles på Gullsett Quiz, **24 genererte spørsmål** (tre Tekster × åtte spørsmål), manuelt vurdert av utvikleren: **minst 85 prosent** passerer forankringskravet. Spørsmål som feiler, forkastes og genereres på nytt før leveranse.
- Konfidensintervallet rapporteres sammen med andelen, ikke bare andelen.
- Antall spørsmål i Gullsett Quiz som krever kunnskap utenfor Teksten: **null tolerert**. Dette er en gjennomgang av hvert spørsmål i Gullsettet, ikke en statistisk terskel. Funn under målingen dokumenteres, de skjules ikke. På andre Tekster kan det komme feil; derfor sier grensesnittet at Buddy er en språkmodell som kan ta feil (§6.1).

**Hvorfor:** Et spørsmål som drar inn allmennkunnskap teksten ikke nevner, tester noe annet enn leseforståelse og gjør eleven usikker på en tekst hun hadde forstått.

#### FR-15: Retting og tilbakemelding

Eleven får svarene rettet med henvisning tilbake i Teksten.

**Konsekvenser (testbare):**
- Ved feil svar tilbys Kildeavsnittet der det riktige svaret står, med én knapp, ikke bare hva som var riktig.
- Kortsvar vurderes av eleven selv: eksempelsvaret vises sammen med fasiten for resten av quizen, og eleven kan krysse av for at svaret var riktig. Da regnes det med i antall riktige.
- Resultatet vises som antall riktige av totalt, ikke som karakter, prosentkarakter eller mestringsnivå.
- Eleven kan ta quizen om igjen. Tidligere forsøk beholdes, og eleven kan se utviklingen.

**Hvorfor:** Quizen skal vise eleven hvor hun skal lese om, ikke gi henne en karakter.

### 4.5 Øvekort

**Beskrivelse:** Repetisjonsdelen, bygget på Begrepssettet og ikke på et eget uttrekk. Én kilde gjør at kvalitetsmålingen i FR-8 også dekker Øvekortene, og at et uttrykk eleven møtte markert i teksten er det samme uttrykket hun øver på etterpå. Realiserer UJ-1.

**Funksjonskrav:**

#### FR-16: Øvekort fra Begrepssettet

Lesevenn lager ett Øvekort per Faguttrykk i Begrepssettet.

**Konsekvenser (testbare):**
- Øvekortsettet er identisk med Begrepssettet: ingen uttrykk lagt til, ingen fjernet. En avvikstest sjekker likhet mellom de to settene.
- Er Begrepssettet tomt (FR-7), tilbys ikke Øvekort, og grunnen oppgis. Det lages ikke kort av ingenting.
- Forsiden viser Faguttrykket, baksiden forklaringen, og Kildeavsnittet tilbys med én knapp.

**Hvorfor:** Én kilde for markering og øving gjør at målingen i FR-8 gjelder begge.

#### FR-17: Gjennomgang av Øvekort

Eleven går gjennom Øvekortene og markerer hva som satt.

**Konsekvenser (testbare):**
- Eleven kan snu kortet, gå videre og gå tilbake, og merke et kort som «Har kontroll» eller «Må øve mer». Den lagrede verdien for «Har kontroll» er `kan`.
- «Forrige» og «Neste» er pilknapper (← og →) med navnene «Forrige kort» og «Neste kort» for skjermleseren; på siste kort heter knappen «Ferdig».
- På øvekortsiden bytter piltastene kort og mellomrom snur kortet, men ikke i skjemafelt, ikke med Ctrl/Alt/Meta, og mellomrom på en knapp, lenke eller utfellbar del gjør det den alltid gjør.
- Fra 760 px har øvekortsiden et eget oppsett for stor skjerm. Der kommer tilbakelenken sist for tastatur og skjermleser (etter pilene), og rekkefølgen for kortet, merkeknappene og pilene er den samme som på smal skjerm. Oppsettet, også hvordan «Venstrehendt» bytter om merkeknappene, står i EXPERIENCE.md.
- Kort merket «Må øve mer» kan vises alene i en ny runde.
- Merkingen lagres på Teksten, slik at en ny økt starter der forrige sluttet.

**Hvorfor:** Eleven skal kunne øve på det som ikke satt, og fortsette der hun slapp.

### 4.6 Skriftlig fagsamtale

**Beskrivelse:** Prosjektets sterkeste påstand, og derfor den som må måles hardest. Fagsamtalen stiller et Samtalespørsmål, leser elevens svar, gir en Svarvurdering og stiller et oppfølgingsspørsmål utledet av vurderingen.

Kravet fra briefen, at oppfølgingsspørsmålet er «relevant», er ikke testbart som det står, og seksjonen bryter det ned i fire ting som er det. Det **klassifiseres**: svaret havner i én av fem navngitte tilstander, og tilstanden bestemmer hva oppfølgingen skal gjøre (FR-19). Det er **erklært**: oppfølgingen leveres med hvilket avsnitt den peker på og hvilken av de fem reglene den følger, som strukturerte felt (FR-20). Det er **avsnittstestet**: en oppfølging til en misoppfatning må peke på et *annet* avsnitt enn en oppfølging til et dekkende svar, nemlig det avsnittet som motsier nettopp den misoppfatningen (FR-21). Og det er **portvoktet**: en promptversjon som leser en misoppfatning som dekkende, tas ikke i bruk (FR-21).

Avsnittstesten er den avgjørende. Den svarer på briefens tekniske suksesskriterium, at oppfølgingsspørsmålene «faktisk reagerer på innholdet i elevens svar, ikke forhåndsdefinerte spørsmål i fast rekkefølge». Realiserer UJ-3.

**Funksjonskrav:**

#### FR-18: Start av Fagsamtale

Eleven kan starte en Fagsamtale om en Tekst hun har lest.

**Konsekvenser (testbare):**
- Første Samtalespørsmål er åpent og krever forklaring med egne ord, ikke gjenfinning av ett ord.
- Første Samtalespørsmål er forankret i et Kildeavsnitt.
- Fagsamtale er tilgjengelig som alternativ til Quiz, ikke bare etter den.

**Hvorfor:** Fagsamtalen skal få eleven til å forklare med egne ord, ikke til å finne igjen ett ord.

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
- **Når kallet feiler.** Gir vurderingen ugyldig eller manglende svar etter ett nytt forsøk, vises «Vurderingen feilet. Svaret ditt er lagret.» med knappen «Prøv igjen». Runden telles ikke mot grensen i FR-22.

**Hvorfor:** Tilstanden bestemmer hva oppfølgingen skal gjøre, og gjør relevansen målbar i FR-21.

#### FR-20: Regler for oppfølgingsspørsmål

Oppfølgingsspørsmålet følger tilstandens regel i FR-19 og oppfyller fire maskinsjekkbare krav.

**Konsekvenser (testbare):**
- **Strukturert utdata.** Hver oppfølging leveres med to felt ved siden av spørsmålsteksten: `kildeavsnitt_id`, avsnittet oppfølgingen er rettet mot, og `mål`, som er én av de fem reglene i FR-19.
- **Sporbarhet:** oppfølgingen inneholder minst ett innholdsord **eleven selv innførte**, altså et ord som står i elevens svar, men ikke i Samtalespørsmålet eleven svarte på. Måles maskinelt: **100 prosent**.
- **Forankring:** oppfølgingen kan besvares fra Teksten alene og har et gyldig `kildeavsnitt_id`. Ingen oppfølging krever kunnskap utenfor Teksten.
- **Ingen gjentakelse:** oppfølgingen er ikke nær-identisk med noe tidligere Samtalespørsmål i samme samtale. Måles som Jaccard-overlapp under 0,6 over **innholdsord**, etter at funksjonsord er fjernet med en fast norsk stoppordliste som ligger i repoet, og etter enkel normalisering (små bokstaver, fjernet tegnsetting).
- **Ett spørsmål:** oppfølgingen inneholder ett spørsmål, ikke tre i samme melding.
- **Når kallet feiler.** Feiler genereringen av oppfølgingen etter ett nytt forsøk, beholdes vurderingen av svaret, og eleven får «Prøv igjen» for neste spørsmål. Samtalen avsluttes ikke av feilen.

**Hvorfor:** Feltene `kildeavsnitt_id` og `mål` gjør relevansen målbar i FR-21 uten å lese mening ut av fritekst.

#### FR-21: Måling av relevans mot Gullsett

Relevansen måles mot Gullsett Fagsamtale, dels maskinelt og dels manuelt, med to blokkerende porter.

**Konsekvenser (testbare):**
- Gullsett Fagsamtale er **36 tilfeller**: tre Tekster × to startspørsmål × seks svarvarianter, skrevet av utvikleren for å etterligne reelle elevsvar. Variantene er dekkende, delvis, **to ulike misoppfatninger**, uklart og utenfor, så alle fem tilstandene i FR-19 er dekket.

**Målingene, i rekkefølge etter hvor mye de betyr:**

- **Sikkerhetsport, blokkerende.** Av de tolv misoppfatningstilfellene skal **null** klassifiseres som Dekkende. Én slik feil blokkerer promptversjonen fra å tas i bruk.
- **Binær gjenkalling for «trenger oppfølging», blokkerende.** Alt som ikke er Dekkende slås sammen til én klasse. Gjenkalling for den klassen **≥ 0,90**, målt over de 30 ikke-dekkende tilfellene.
- **Måltest, maskinell.** For atten par av svarvarianter på samme startspørsmål, (dekkende, delvis), (dekkende, misoppfatning) og (uklart, utenfor), skal feltet `mål` fra FR-20 være **ulikt** og i samsvar med FR-19-reglene. Minst **16 av 18**.
- **Avsnittstest, maskinell, og kjernen i hele kravet.** For hvert par (dekkende, misoppfatning) skal oppfølgingens `kildeavsnitt_id` være **et annet avsnitt** i misoppfatningstilfellet enn i det dekkende, og `mål` skal være «motsigende avsnitt». Alle seks par må bestå.
- **Treff mot forhåndsvalgt avsnitt, manuell.** For hvert misoppfatningstilfelle har utvikleren på forhånd skrevet ned hvilket avsnitt som motsier misoppfatningen. Oppfølgingens `kildeavsnitt_id` treffer det avsnittet i minst **70 prosent** av tilfellene.
- **Manuell relevansvurdering.** Hver av de 36 oppfølgingene vurderes mot regelen for sin tilstand i FR-19, som relevant eller ikke. **Minst 80 prosent relevante.**
- **Femveis forvekslingsmatrise, rapporteres, ingen terskel.** Matrisen er beskrivelse og råstoff til DK-5 og DK-6, ikke en port.
- Alle målingene kjøres per promptversjon (DK-2) og lagres.

**Hvorfor:** Den verste feilen er at eleven får bekreftet en gal forståelse (DK-6), og avsnittstesten måler *hvor* systemet peker, som et skriptet system ikke kan late som.

#### FR-22: Lengde og avslutning

Fagsamtalen har en øvre grense og en definert slutt.

**Konsekvenser (testbare):**
- Samtalen avsluttes etter høyst **seks runder**, eller når eleven avslutter selv. Grensen er ikke et mål å fylle: en samtale kan avsluttes etter tre runder dersom Teksten er dekket (SM-C3).
- Ved avslutning vises en kort oppsummering: hvilke deler av Teksten som ble berørt, hvilke Svarvurderinger som falt i tilstanden Misoppfatning, med lenke til Kildeavsnittet, **og hvilke svar som ble godtatt som Dekkende**, med samme lenke.
- Eleven kan trykke **«jeg tror du misforsto svaret mitt»** på en hvilken som helst Svarvurdering, og få runden vurdert på nytt.
- Samtalen lagres på Teksten og kan leses om senere.

**Hvorfor:** Sikkerhetsporten i FR-21 kan ikke gjøre det umulig at en misoppfatning leses som Dekkende. Ser eleven hva som ble godtatt, får hun en siste sjanse til å oppdage det selv.

#### FR-23: Tone og status som formativ

Fagsamtalen gir tilbakemelding som hjelper, og aldri noe som ser ut som en karakter.

**Konsekvenser (testbare):**
- Ingen del av Fagsamtalen produserer en poengsum, prosentandel, karakter eller nivåplassering av eleven.
- Grensesnittet sier eksplisitt at vurderingen er gjort av en språkmodell, at den kan ta feil, og at den ikke er en vurdering av eleven.
- Ved tilstanden Misoppfatning brukes ikke ordet «feil» om eleven. Oppfølgingen peker på teksten, ikke på personen.
- En gjennomgang av samtlige 36 Svarvurderinger i Gullsett Fagsamtale sjekker at ingen er nedvurderende eller latterliggjørende. **Null tolerert.**
- Gjennomgangen gjøres mot en **nedskrevet liste** over hva som teller som nedvurderende (ordet «feil» om eleven, ironi, «egentlig», «som du burde visst», bagatellisering), og utvikleren leser de 36 vurderingene **uten** å se hvilken tilstand de hører til.
- Minst én utenforstående leser i tillegg et utvalg på tolv og svarer på om noen av dem ville truffet en sekstenåring dårlig.

**Hvorfor:** Uten listen og den blinde lesingen er det forfatteren av prompten som vurderer egen prompts tone, og den prøven består alltid.

### 4.7 Morsmålsstøtte

**Beskrivelse:** Prosjektets andre differensiering, og bevisst begrenset. Morsmålet er **additivt, aldri erstattende**: norsk tekst er alltid til stede, og det norske Faguttrykket står alltid i parentes etter det oversatte. Eleven skal komme videre i norsk fagspråk, og står originalen ved siden av, er den samtidig sikkerhetsnettet mot svake oversettelser.

Dekningen i v1 har to nivåer. **V1 har ett Kvalitetssikret språk: ukrainsk**, fordi prosjektet har en morsmålsbruker som kan gjøre den eksterne vurderingen i FR-28. Alle øvrige språk tilbys som Modellstøttet språk med synlig forbehold. **Arabisk bygges og demonstreres uansett nivå**, fordi det tvinger fram høyre-til-venstre-visning side om side med norsk (FR-25). Realiserer UJ-2.

**Funksjonskrav:**

#### FR-24: Valg av Morsmål og to dekningsnivåer

Eleven velger Morsmål fra en lukket liste med to nivåer.

**Konsekvenser (testbare):**
- **Ukrainsk** vises først, som Kvalitetssikret språk, uten forbehold, forutsatt at det består målingen i FR-28. Nivået er bestemt av målingen, ikke av at språket er valgt ut.
- Modellstøttede språk vises i samme liste, tydelig atskilt, med merknad om at kvaliteten ikke er kontrollert. Det finnes ikke fritekstfelt for språk i v1.
- Listen har 16 Modellstøttede språk i tillegg til ukrainsk: polsk, litauisk, arabisk, somali, urdu, tigrinja, tagalog, dari, russisk, persisk, thai, vietnamesisk, tyrkisk, rumensk, albansk og kurdisk (sorani). Fem av dem skrives høyre-til-venstre: arabisk, urdu, dari, persisk og sorani.
- Er ingen språk kvalitetssikret, finnes ikke det øverste nivået i grensesnittet i det hele tatt. Appen viser ikke en tom «kvalitetssikret»-seksjon, og den forfremmer ikke et umålt språk for å ha noe å vise.
- Valget lagres på kontoen og gjelder til eleven endrer det.
- Valgt Morsmål påvirker bare Aktivering, avsluttende oppsummering og forklaring av Faguttrykk og språklige bilder. Resten av grensesnittet er på norsk.

**Hvorfor:** «Oversettelsen er faglig presis» er bare en påstand man kan stå for i et språk man har målt.

#### FR-25: Additiv visning

Norsk forsvinner aldri når Morsmål er valgt.

**Konsekvenser (testbare):**
- Der morsmålstekst vises, vises norsk tekst samtidig og likeverdig, ikke bak et klikk og ikke nedtonet.
- Hvert oversatt Faguttrykk har det norske uttrykket i parentes rett etter.
- For språk som skrives høyre-til-venstre gjengis morsmålsteksten med korrekt retning, uten at den norske teksten ved siden av påvirkes. Testet med arabisk.
- Ingen visning erstatter norsk tekst med morsmålstekst, i noen tilstand. En gjennomgang av samtlige skjermbilder med Morsmål aktivert bekrefter det.

**Hvorfor:** Eleven skal komme ut med det norske fagordet, ikke slutte å møte det.

#### FR-26: Aktivering og oppsummering på Morsmål

Aktiveringssiden og den avsluttende oppsummeringen kan vises på Morsmål.

**Konsekvenser (testbare):**
- Overskriftene på aktiveringssiden vises på begge språk.
- Den avsluttende oppsummeringen er høyst fem setninger, vises på begge språk, og inneholder ingen påstand som ikke står i Teksten.
- Oppsummeringen står nederst i Lesevisningen, etter teksten, og lages når eleven ber om den, ikke for hver Tekst på forhånd.
- Oppsummeringen låses opp først når eleven har levert en Quiz eller svart i en Fagsamtale, slik §7 krever. Låsen håndheves på serveren, ikke bare ved at knappen skjules.
- Eleven kan skrive sitt eget svar på hvilket som helst språk. Svaret oversettes ikke og vurderes ikke.

**Hvorfor:** Lesevenn er ikke et sammendragsverktøy, så oppsummeringen kommer etter at eleven har lest og blitt sjekket (§7).

#### FR-27: Utpeking av språklige bilder og akademisk allmennspråk

Lesevenn peker ut de uttrykkene som stopper en andrespråksleser spesielt, og som Begrepssettet med vilje ikke fanger.

**Konsekvenser (testbare):**
- Utpekingen er et eget sett, atskilt fra Begrepssettet, og dekker to kategorier:
  - **Språklige bilder:** metaforer, idiomer og faste uttrykk («statsmaktene er tredelt», «å legge lokk på en debatt») som villeder om de leses bokstavelig.
  - **Akademisk allmennspråk:** ord som ikke hører til noe fag, men til skriftlig fagspråk generelt («forutsetning», «tilsvarende», «på bakgrunn av», «henholdsvis»).
- Hvert utpekt uttrykk har en forklaring på Morsmål og norsk. For språklige bilder forklares den *ikke-bokstavelige* betydningen.
- Høyst åtte utpekte uttrykk per 1 000 ord per kategori, av samme grunn som tetthetstaket i FR-7.
- Kategorien er knyttet til Morsmål, ikke til Lesevisningen for alle.

**Utenfor dette FR-et:**
- Akademisk allmennspråk markeres ikke i Lesevisningen for elever uten valgt Morsmål. `[ANTAKELSE: en morsmålsbruker på videregående trenger sjelden «henholdsvis» forklart, og markeringen ville brukt opp tetthetsbudsjettet i FR-7 på ord som ikke stopper henne. Ikke verifisert — og om det viser seg galt, er det en billig utvidelse.]`

**Hvorfor:** Faguttrykk utelukker akademisk allmennspråk med vilje (§3, FR-8), men det er nettopp ord som «forutsetning» andrespråksleseren stopper på.

#### FR-28: Måling av oversettelseskvalitet

Kvaliteten i Kvalitetssikrede språk måles, og det er målingen som gir språket sitt nivå.

**Konsekvenser (testbare):**
- **Gullsett Oversettelse** er **fire Tekster** på ukrainsk, med oversatt aktiveringsside og oppsummering. Tekstene hentes fra Gullsett Faguttrykk (FR-8), slik at Begrepssettet deres er kjent når begrepsankeret måles.
- **Primærmål: begrepsanker, maskinelt.** Minst **0,95** av Faguttrykkene i den oversatte teksten har det norske uttrykket i parentes etter seg, i uendret form.
- **Ekstern vurdering.** Én ukrainsk morsmålsbruker vurderer de fire tekstenes oversatte oppsummering på fire punkter: er terminologien riktig, er registeret rimelig for en elev på videregående, er noe uforståelig, og er noe direkte galt. **Bestått betyr høyst én anmerkning i alt** av de 16 svarene (fire punkter på fire tekster). Et svar er en anmerkning når terminologi eller register ikke godkjennes, eller når noe er uforståelig eller direkte galt. Finner vurderingen feil, kan prompten rettes og målingen gjøres på nytt. Består den ikke, er språket Modellstøttet.
- **Tilbakeoversettelse, bare for tre ting.** Den oversatte oppsummeringen oversettes tilbake til norsk i et separat kall, og sammenlignes med originalen **utelukkende** for tapt nekting («ikke», «aldri», «uten»), endrede tall og endrede egennavn. Antall avvik i disse tre kategoriene: **null**.
- Tilbakeoversettelsen måler bare de tre kategoriene over (tapt nekting, tall og egennavn). Den sier ingenting om fagterminologi eller flyt.
- Et annet maskinoversettelsesverktøy er ikke uavhengig kontroll. Det kan brukes som hint underveis, men kalles ikke kvalitetssikring i rapporten.
- Et språk som ikke består begrepsankeret **eller** den eksterne vurderingen, vises som Modellstøttet språk.

**Hvorfor:** Den eksterne vurderingen er det eneste stedet noen utenfor systemet ser på utdataet, og at en modell vurderer sitt eget utdata er ikke kvalitetssikring.

#### FR-29: Feilhåndtering i oversettelse

Oversettelsesfeil stopper aldri Kjerneløypen.

**Konsekvenser (testbare):**
- Feiler eller tidsavbrytes et oversettelseskall, vises norsk tekst alene, med en ikke-blokkerende merknad og en prøv-igjen-knapp.
- Eleven kommer alltid videre i Kjerneløypen uten oversettelse. Morsmålsstøtte er aldri en forutsetning for å lese teksten.

**Hvorfor:** Norsk tekst er alltid til stede (FR-25), så en oversettelse som mangler, skal ikke stenge noe.

### 4.8 Minnevers og Suno-prompt

**Beskrivelse:** Det minst kritiske elementet, med én reell risiko: et rim som stemmer dårlig faglig, er verre enn ingen huskeregel. FR-31 er derfor et faktakrav, ikke en formalitet. Funksjonen ligger nederst i kuttrekkefølgen i §9 og skal bygges sist.

**Funksjonskrav:**

#### FR-30: Generering av Minnevers eller Suno-prompt

Eleven kan få et Minnevers for Faguttrykkene i en Tekst, eller en ferdig Suno-prompt.

**Konsekvenser (testbare):**
- Verset er på fire til åtte linjer og bruker minst tre Faguttrykk fra Begrepssettet.
- **Suno-prompten er satt på pause.** Appen tilbyr den ikke, men generatoren kan fortsatt lage formen.
- Når Suno-prompten tilbys, er den ferdig til å limes inn i et eksternt verktøy og krever ingen redigering, og eleven ser tydelig hvilket av de to hun får og kan be om det andre. Kommer den tilbake, er det som en hel sangtekst der refrenget er huskeregelen.
- Lesevenn genererer ikke lyd og kaller ikke Suno.

**Hvorfor:** Fire linjer er ikke en sang, og en sangtekst med vers og refreng ville gitt flere påstander å faktasjekke i FR-31.

#### FR-31: Faktasjekk av Minnevers

Verset skal ikke lyve for rimets skyld.

**Konsekvenser (testbare):**
- Hvert Faguttrykk i verset finnes i Begrepssettet. Måles maskinelt: **100 prosent**.
- Ingen påstand i verset motsier Teksten. Måles på **Gullsett Minnevers**, **10 genererte vers** manuelt vurdert av utvikleren: antall usanne påstander er **null**. På andre Tekster kan det komme feil; derfor sier grensesnittet at Buddy er en språkmodell som kan ta feil (§6.1). Funn under målingen dokumenteres og brukes til å stramme prompten.
- Grensesnittet oppfordrer eleven til å sjekke verset mot teksten før hun pugger det.

**Hvorfor:** Eleven som pugger et galt vers, lærer noe galt i en form som sitter godt.

### 4.9 Mapper lett

**Beskrivelse:** Mapper er i v1 i en lett variant, FR-50 til FR-52. Eleven lager Mapper, legger egne Tekster i dem, og får to samlede aktiviteter som bare gjenbruker lagret innhold: alle Øvekortene fra Tekstene i Mappen, og en samlet Quiz satt sammen av spørsmålene Tekstene allerede har. Det gir ingen nye modellkall og ingen ny kvalitetspåstand: hvert kort og hvert spørsmål er det samme som i sin egen Tekst, med sitt Kildeavsnitt, og er dekket av målingene i FR-8 og FR-14.

**Utenfor v1:** samlet Fagsamtale, samlet Minnevers og all ny generering på tvers av Tekster (§8.2). FR-32, FR-33 og FR-34 beskrev den fulle varianten med samlet Fagsamtale, er trukket tilbake, og numrene gjenbrukes ikke.

**Funksjonskrav:**

#### FR-50: Mappe

Eleven kan samle egne Tekster i Mapper.

**Konsekvenser (testbare):**
- Eleven kan lage en Mappe med en tittel på 1–80 tegn, gi den nytt navn og slette den. Sletting av en Mappe sletter ikke Tekstene i den.
- Eleven kan legge egne Tekster i en Mappe og ta dem ut igjen. En Tekst kan ligge i flere Mapper, men bare én gang i hver. Valget for å legge til viser hvilke Tekster som alt er med.
- Høyst **20 Mapper per konto** og høyst **8 Tekster per Mappe**. Når en grense er nådd, sier appen hvilken grense det er og hvorfor, og hva eleven kan gjøre (§5).
- En Tekst som eies av en annen konto, kan ikke legges i Mappen, og en annen kontos Mappe finnes ikke (AD-8). Sletting av en Tekst eller kontoen rydder Mappene (FR-37).
- Mappene står i en egen del av Samlinger (FR-49), og Arbeidsbordet har en lenke dit. Arbeidsbordet viser en Mappe med Tekster som én bunke (FR-48).
- En Tekst kan legges i en Mappe rett fra Samlinger med «Legg i mappe» på hver tekstrad. Det virker uten JavaScript og med tastatur og skjermleser, og Mappene Teksten alt ligger i, står som «(alt med)» og kan ikke velges. På stor skjerm kan eleven også dra Teksten til Mappen.
- Begge veiene følger de samme reglene som over, og resultatet kunngjøres i en statusregion. Har eleven ingen Mapper, vises verken knappen eller draget.
- Tekster som ikke er låst, mangler Begrepssett eller mangler Quiz, vises i Mappen med hva som mangler og en lenke til Teksten. Mappen lager aldri noe selv.

**Hvorfor:** Eleven kan øve på flere Tekster samlet uten at noe nytt genereres.

#### FR-51: Samlet øving

Eleven kan øve på alle Øvekortene fra Tekstene i en Mappe samlet.

**Konsekvenser (testbare):**
- Kortene er Øvekortene til de låste Tekstene i Mappen (FR-16), Tekst for Tekst, med Teksten de er fra synlig på kortet og Kildeavsnittet på baksiden.
- Merkingen «Har kontroll» / «Må øve mer» er den samme som i Teksten (FR-17): et kort merket i Mappen står merket når Teksten åpnes alene.
- En Tekst uten Faguttrykk gir ingen kort, og grunnen oppgis.

**Hvorfor:** Kortene er de samme som i hver Tekst, så målingene i FR-8 dekker dem uten ny måling.

#### FR-52: Samlet quiz

Eleven kan ta en samlet Quiz med spørsmålene Tekstene i Mappen allerede har.

**Konsekvenser (testbare):**
- Spørsmålene er Quizspørsmålene til de låste Tekstene med Quiz (FR-13, FR-14), uendret og med sitt Kildeavsnitt. Ingen spørsmål lages for Mappen.
- Eleven velger lengden ved start: **Kort** (2 per Tekst), **Middels** (4 per Tekst) eller **Alle** (8 per Tekst). For en gitt lengde er utvalget fast og jevnt fordelt over spørsmålsnumrene, så samme lengde gir samme spørsmål.
- Rettingen er som i FR-15, på serveren, og fasiten når ikke nettleseren før levering. Kortsvar vurderes av eleven selv i resultatet.
- Forsøkene lagres med lengden, og vises under «Tidligere forsøk» med antall riktige av totalt og lengden. Et forsøk beholder antallet sitt også om en av Tekstene slettes etterpå.
- Har ingen av Tekstene Quiz, vises ingen quiz, men en forklaring og lenker til Tekstene.

**Hvorfor:** Spørsmålene er de samme som i hver Tekst, så målingene i FR-14 dekker dem uten ny måling.

### 4.10 Brukerkonto og lagring

**Beskrivelse:** Kontoen finnes fordi tekstene skal samles på Arbeidsbordet og i Samlinger (FR-48, FR-49), og fordi eleven skal kunne komme tilbake til Øvekortene før prøven. Den er ikke en plattform: ingen deling, ingen sosiale funksjoner, ingen profil. Minst mulig data, fordi en stor del av brukergruppen er mindreårige og innholdet ofte er opphavsrettslig beskyttet lærebokstoff.

**Funksjonskrav:**

#### FR-35: Konto og innlogging

Eleven kan opprette konto og logge inn.

**Konsekvenser (testbare):**
- Registrering krever e-post og passord. Ingen navn, skole, klasse, alder eller fødselsdato samles inn.
- Aldersgrensen er **15 år**. Registrering krever at eleven krysser av for «Jeg er 15 år eller eldre», en egenerklæring og ikke en kontroll, og serveren avviser registreringen uten den. Bare bekreftelsen lagres (konto, vilkårsversjon, tidspunkt), aldri alderen. Se FR-53.
- Passord lagres aldri i klartekst.
- Innloggingen slipper gjennom **fem forsøk på rad** fra samme adresse, med under et minutt mellom hvert. Det sjette sperres til det har gått **et minutt siden det siste som slapp gjennom** (telleren er glidende).
- Registreringen beholder Better Auths standard, 3 forsøk per 10 sekunder.
- Ved sperre sier skjemaet hvor lenge den varer, i faktiske sekunder fra serveren («Vent 47 sekunder, og prøv igjen.»), og knappen viser «Vent N s» og sender ikke før tiden er ute.
- Sperremeldingen leses opp én gang, ikke hvert sekund. Når sperren er over, får skjermlesere beskjed om at eleven kan prøve igjen.
- Innhold er alltid privat for kontoen som eier det. Det finnes ingen delingsfunksjon i v1.

**Hvorfor:** Kontoen skal samle minst mulig om en brukergruppe der mange er mindreårige.

#### FR-36: Lagring og historikk

Eleven finner igjen tidligere arbeid.

**Konsekvenser (testbare):**
- Tekster, Begrepssett, Quizer med resultater, Øvekortmerking og Fagsamtaler lagres på kontoen.
- Samlinger (FR-49) kan sorteres på dato og søkes i på tittel.
- Genererte elementer regenereres ikke ved gjenbesøk. De hentes fra lagring.

**Hvorfor:** Lagring gir stabilitet (FR-11) og holder kostnaden nede (§6.4).

#### FR-37: Sletting

Eleven kan slette.

**Konsekvenser (testbare):**
- Eleven kan slette én Tekst, og alt generert innhold knyttet til den slettes med.
- Eleven kan slette kontoen sin, og all tilhørende data slettes.
- Sletting krever bekreftelse som navngir hva som forsvinner.

**Hvorfor:** Sletting skal virke og faktisk slette (§6.2).

#### FR-53: Vilkår og personvern

Eleven kan lese hva hun sier ja til, og bekrefter det når kontoen lages.

**Konsekvenser (testbare):**
- En offentlig side, «Vilkår og personvern» (`/vilkaar`), skrevet for en 15-åring, sier hva som lagres, hvor tekstene går (leverandør og behandlingssted), hvordan eleven sletter, hvem som er behandlingsansvarlig og hvem hun kontakter. Siden vises uten innlogging og er lenket fra registreringen, landingssiden og kontosiden.
- Registreringen har to påkrevde avkrysninger, aldri forhåndsavkrysset: «Jeg er 15 år eller eldre» og «Jeg har lest vilkårene og personvernerklæringen». Nettleseren hindrer innsending uten dem, og serveren avviser registreringen uansett vei inn, også en forespørsel rett mot ruten.
- Bekreftelsen lagres med konto, vilkårsversjon og tidspunkt, i samme transaksjon som kontoen: det finnes ingen ny konto uten bekreftelse. En registrering med en eldre vilkårsversjon avvises med beskjed om å laste siden på nytt.
- Gjelder bare nye kontoer. Kontoer fra før 19. november logger inn som før, uten ny godkjenning.
- Eleven kan få en kopi av alt som er lagret om kontoen (`node data/innsyn.mjs <e-post>`, uten passordhash og økttokener).
- Telleren for innloggingsforsøk lagrer ikke IP-adressen i klartekst, bare som hash.

**Hvorfor:** Behandlingsgrunnlaget er avtale (§6.2), så eleven må kunne se hva avtalen er før kontoen lages.

#### FR-54: Bruksgrenser

Appen begrenser hvor mye én konto og appen samlet kan lage per døgn, slik §6.4 bestemmer.

**Konsekvenser (testbare):**
- Én konto kan legge inn høyst **5 nye Tekster** og starte høyst **5 Fagsamtaler** per døgn, norsk tid, telt fra når Teksten og Fagsamtalen ble opprettet.
- Når samlet forbruk for hele appen passerer **30 kroner** i døgnet, starter ingen nye KI-kall før neste døgn.
- Over en grense sier appen hvilken grense som er nådd, og at den åpner igjen i morgen:
  - Tekster: «Du har lagt inn 5 tekster i dag.» og «Du kan legge inn flere i morgen.»
  - Fagsamtaler: «Dagens 5 samtaler er brukt.» og «Du kan starte en ny i morgen.»
  - Dagstaket: «LeseBuddy har nådd dagens grense for nye oppgaver.» og «Alt du har laget, kan du fortsatt åpne. Prøv igjen i morgen.»
- Når en grense er nådd, tilbys ingen «Prøv igjen»-knapp, fordi den ikke kan virke før neste døgn.
- Lagret innhold kan fortsatt åpnes. For bilder gjelder BF-6 og BF-7 (FR-44).

**Hvorfor:** Fagsamtalen er der kostnaden ligger, og en grense per konto beskytter ikke budsjettet når mange bruker appen samtidig.

### 4.11 Kjørbarhet

**Beskrivelse:** Dokumentasjonskravene (KI-logg, Promptregister, testsett, kvalitetssikring av koden, etikk og jus, refleksjon) står i §13 som DK-1 til DK-6 (tidligere FR-38 til FR-43, numrene gjenbrukes ikke).

**Funksjonskrav:**

#### FR-46: Appen kan kjøres av noen andre, uten prosjektets nøkler

Noen andre enn utvikleren kan kjøre Kjerneløypen uten prosjektets API-nøkkel og uten databasen i skytjenesten.

**Konsekvenser (testbare):**
- **Kjerneløypen kan fullføres uten API-nøkkel.** Generatorlaget har en testmodus som leser modellsvaret fra fil i stedet for å kalle modellen. Modusen settes med én miljøvariabel, og `.env.example` har den slått på som standard.
- **Lagrede svar går gjennom samme validering som ferske.** Skjemavalideringen i AD-11 kjøres på det leste svaret.
- **Databasen kan kjøres lokalt.** `docker compose` starter en Postgres på samme hovedversjon som driftsdatabasen, og migrasjonene kjøres mot den med ett skript.
- **Nøyaktig én dekket tekst er nok, og begrensningen vises.** Testmodus dekker eksempelteksten som ligger i repoet. En annen tekst gir en feilmelding som sier at testmodus bare dekker eksempelteksten, og hva man kan gjøre i stedet.
- **README er testet av å bli fulgt.** Stegene i README kjøres på en maskin uten `.env.local` og uten prosjektets nøkler, og det dokumenteres at Kjerneløypen gikk gjennom.
- **Testmodus er ikke standard i drift.** En uleselig eller glemt verdi i miljøvariabelen faller til «av», altså til et ekte kall.

**Hvorfor:** En app ingen andre kan kjøre, kan ingen andre vurdere, og testmodus er samtidig den eneste praktiske kostnadskontrollen under utvikling.

### 4.12 Inngang, Arbeidsbord og Samlinger

**Beskrivelse:** Utseende og oppførsel står i `ux-designs/ux-Lesevenn-2026-11-12/DESIGN.md` og `EXPERIENCE.md`. Kravene her sier hva som skal finnes og kunne testes. Utad heter appen LeseBuddy. I kode og planleggingsdokumenter heter den fortsatt Lesevenn.

**Funksjonskrav:**

#### FR-47: Landingsside

Den som ikke er innlogget, møter en side som forklarer hva appen er.

**Konsekvenser (testbare):**
- `/` uten innlogging viser landingssiden, ikke innloggingssiden. En innlogget elev på `/` får Arbeidsbordet (FR-48).
- Siden sier at appen er lesestøtte og hjelp til leseforståelse for videregående, viser hvordan den hjelper før, mens og etter lesingen, og har en egen del for lærere.
- Siden har «Logg inn» og «Registrer deg», og sier at registrering krever en kode fra læreren (invitasjonskoden, §6.2).
- Alt innhold er tilgjengelig uten rulleeffektene. Med `prefers-reduced-motion` vises alt statisk.

**Hvorfor:** Den som kommer til appen første gang, skal forstå hva den er før hun blir bedt om å logge inn.

#### FR-48: Arbeidsbord

En innlogget elev kommer til et arbeidsbord, ikke rett til innlesing.

**Konsekvenser (testbare):**
- Arbeidsbordet viser høyst fem bunker, sortert etter nyest aktivitet. En bunke er en Tekst som ikke ligger i noen Mappe, eller en Mappe med minst én Tekst (FR-50). En Mappe er like aktiv som sin nyeste Tekst, og tomme Mapper ligger ikke på bordet.
- En Tekst som ligger i én eller flere Mapper, er ikke egen bunke, men ligger under hver Mappe den er i.
- Den nyeste bunken er størst og viser neste steg, utledet av Tekstens tilstand og hva eleven har gjort. Er Teksten med nyest aktivitet i en Mappe, er Mappen den største bunken, og neste steg gjelder Teksten, med tittelen i lenken.
- En tekstbunke kan åpnes og viser nøyaktig fem aktiviteter i fast rekkefølge: Teksten, Quiz, Øvekort, Fagsamtale og Minnevers, hver med status fra lagrede data. Aktiviteter som krever en låst Tekst, vises låst med en forklaring.
- En mappebunke har merkelappen «Mappe», «N tekster» og knappen «Vis tekstene i mappen {tittel}» (uten JavaScript en lenke til Mappen). Den åpnes til Tekstene i Mappen og to kort for samlet øving (FR-51, FR-52). Velges en Tekst, vises dens fem aktiviteter som over, med «Tilbake til mappen».
- Bunkene kan åpnes og lukkes med tastatur. Esc lukker fra begge nivåene, og fokus står alltid på et synlig element: bunken, det første kortet, eller tekstkortet eleven kom fra. Lukkes bunken, går fokus tilbake til bunkens knapp.
- Har eleven ingen Tekster, viser bordet én handling: legg inn en ny tekst. Kan ikke alle Tekstene nås fra bordet, vises en lenke til Samlinger med antallet.
- Innlesing av en ny Tekst (FR-1, FR-2, FR-44) nås med én handling.
- Feiler oppslaget av Mappene, vises bordet med bare Tekstene.

**Hvorfor:** Eleven skal komme tilbake til det hun holder på med, ikke begynne på nytt hver gang.

#### FR-49: Samlinger

Alle Tekstene er samlet på ett sted.

**Konsekvenser (testbare):**
- Siden heter «Samlinger» i overskriften, menyen og teksten eleven ser.
- Samlinger viser alle elevens Tekster, kan sorteres på dato og søkes i på tittel (FR-36), og nås fra menyen og fra Arbeidsbordet.
- Hver Tekst kan åpnes og slettes herfra (FR-37).
- Mappene (FR-50) står i en egen del av Samlinger. Oppsettet står i EXPERIENCE.md. Mappene står før Tekstene i kildekoden, så Tab går gjennom dem først.
- Siden har ingen sidelengs rulling på 320 px eller med 200 % tekst.

**Hvorfor:** Arbeidsbordet viser bare fem bunker, så resten av Tekstene må kunne finnes et annet sted.

## 5. Tverrgående krav

- **Ingen KI-utdata uten kilde.** Alt generert innhold som påstår noe om Teksten (forklaringer, quizspørsmål, samtalespørsmål, oppsummeringer, vers) har et Kildeavsnitt. Klarer ikke en generator å oppgi Kildeavsnitt, er utdataen ikke gyldig. Kravet er arkitektonisk, ikke kosmetisk.
- **Ingen blindveier.** Hver feiltilstand i hele appen sier hva som skjedde, på vanlig norsk, og tilbyr minst én konkret neste handling. Ingen tekniske feilspor, ingen «noe gikk galt», ingen stille feil.
- **Ingen stille forkorting.** Appen kutter aldri tekst, spørsmål eller innhold uten at eleven ser det og godtar det.
- **Ventetid er synlig og brutt opp.** Kall til språkmodell som tar over to sekunder viser en status som sier hva som gjøres. Kjerneløypens steg genereres når de trengs, ikke alle i ett langt oppstartskall, slik at eleven kommer raskt til aktiveringssiden. Ventingen vises med Buddys tenkeindikator og en statustekst (EXPERIENCE.md).
- **KI-feil er ikke blindveier.** Feiler et kall til språkmodellen etter ett nytt forsøk (tidsavbrudd, ugyldig eller manglende svar), sier appen hva som ikke ble laget, at det eleven har skrevet er lagret, og tilbyr «Prøv igjen». Konsekvensene per funksjon står i FR-7, FR-13, FR-19 og FR-20.
- **Lesbarhet foran pynt.** Lesevisningen er den viktigste flaten. Justerbar tekststørrelse og linjeavstand, linjelengde om lag 70 tegn, tilstrekkelig kontrast, og ingen informasjon formidlet ved farge alene.
- **Tastatur og skjermleser.** Kjerneløypen kan fullføres med tastatur alene. Markerte Faguttrykk er fokuserbare, og forklaringen er tilgjengelig for skjermleser.
- **Mobil er en reell flate.** Kjerneløypen virker på telefon i portrettmodus. `[ANTAKELSE: elever leser og øver like ofte på telefon som på PC. Ikke verifisert — men en lesestøtteapp som krever PC treffer dårligere.]`
- **Lagring foran regenerering.** Genererte elementer lagres ved første generering og gjenbrukes, for stabilitet og for kostnad.

## 6. Rammer og vern

### 6.1 Pedagogisk og etisk

- Lesevenn gir aldri en karakter, et poengtall eller en nivåplassering av eleven. Vurderingen er formativ, og sies å være det.
- Det er alltid synlig når innhold er generert av en språkmodell, og at det kan være feil.
- Morsmålsstøtten er additiv og aldri erstattende (FR-25). Målet er tilgang til norsk fagspråk, ikke omvei rundt det.
- Appen produserer ikke innhold om Teksten som ikke står i Teksten (§5, første punkt).

### 6.2 Personvern og databehandling

- Datainnsamlingen holdes på et minimum: e-post, passord, elevens tekster og eget arbeid. Ingen navn, skole, klasse eller alder (FR-35). Den er like kort for alle brukere, fordi brukergruppen er delt (Vg1 og Vg2 i hovedsak 15–17 år, mange på Vg3 18–19) og innsamlingen må være forsvarlig for den yngste.
- **Behandlingsgrunnlag: avtale** (personvernforordningen art. 6 nr. 1 bokstav b), ikke samtykke. Eleven inngår en avtale om å bruke tjenesten når kontoen lages, og opplysningene er det som trengs for at den skal virke. Avkrysningen ved registrering (FR-53) bekrefter at eleven har fått informasjonen, og er ikke et samtykke. Annen bruk, som å bruke tekster til å forbedre appen, krever et eget, frivillig samtykke.
- **Aldersgrense 15 år, som egenerklæring.** Hvorfor 15: tekstene sendes til en leverandør utenfor EU/EØS (13-årsgrensen i art. 8 og personopplysningsloven § 5 gjelder samtykke, ikke avtale). **Begrensningen:** egenerklæringen kontrolleres ikke, og LeseBuddy kan ikke vite elevens alder uten å samle den inn, noe FR-35 utelukker. Den reelle porten er invitasjonskoden: bare den som er invitert, kan registrere seg.
- Før første innsending sier appen tydelig at teksten sendes til en ekstern språkmodell-leverandør for behandling.
- Ingen tredjeparts analyse- eller sporingsverktøy.
- Sletting virker og sletter faktisk (FR-37).
- **Oppbevaringstid for elevens tekster: ett skoleår, dokumentert som intensjon og ikke implementert i v1.** v1 har ingen automatisk sletting; eleven sletter selv (FR-37). Implementeres policyen, må det samtidig komme tydelig fram at data slettes ved skoleslutt, slik at den som vil beholde noe får sjansen. Automatisk sletting med varsel er ny funksjonalitet, og marginen skal ikke fylles med nye funksjoner (SM-C2). Begrunnelsen for policyen står i `addendum-lesevenn.md` §6.
- Testbrukere kan rekrutteres blant myndige elever på Vg3, slik at samtykke fra foresatt ikke er nødvendig for å prøve appen. `[ANTAKELSE: testbrukere i v1 er myndige elever, eller mindreårige med samtykke fra foresatt. Reell klasseromsbruk krever databehandleravtale og ligger utenfor v1 (§2.2).]`

**Krav til leverandøren.** Kravene er egenskaper ved avtalen, ikke ved merkenavnet.

- **Inndata skal ikke brukes til å trene modeller.** Velg et oppsett der dette er avtalt, og dokumentér hvilket. Hvorfor: appen tar imot opphavsrettsbeskyttet lærebokstoff, og at innholdet havner i et treningssett er noe annet enn at en kopi passerer gjennom en databehandler.
- **Behandlingsstedet skal være kjent og nedskrevet:** hvilken leverandør, hvilken region, og om data forlater EU/EØS.
- **Vilkårene skal være lest og datert.** Rapporten oppgir hvilke vilkår som ble lest og når. Forbruker- og API-versjoner av samme tjeneste har ofte ulike vilkår på dette punktet; sjekk vilkårene for det som faktisk brukes.

**Bilder (FR-44).** Bilder eleven laster opp, lagres aldri (AD-16); det er Råteksten som bevares. Metadata fjernes før bildet sendes videre. Hvorfor: bildeinngangen øker eksponeringen, og lagringsregelen er svaret på det.

### 6.3 Opphavsrett

Eleven legger inn innhold hun ikke eier. Det er den mest åpenbare etiske spenningen i produktet.

**Hva designet gjør for å begrense eksponeringen:**

- **Tekstgrensen på 8 000 tegn** (FR-1): det som behandles, er et utdrag, ikke et kapittel.
- **Grensen på fire bilder** per Tekst (FR-44): inngangen er til noen sider eleven arbeider med, ikke til å digitalisere en bok. Skannede PDF-er av hele bøker er ikke støttet (PF-1).
- **Ingen korpusbygging.** Elevenes tekster slås aldri sammen til et delt datasett, verken for analyse, for å forbedre prompter, for testsett eller noe annet. Gullsettene i §4 består av tekster utvikleren selv har skaffet og annotert, aldri av brukernes innhold. Dette er et forbud, ikke en implementasjonsdetalj.
- **Ingen deling.** Innhold er privat for kontoen som eier det, og det finnes ingen delingsfunksjon i v1 (FR-35).
- **Bilder beholdes ikke** (FR-44).
- Vilkårene sier at innlegging er til eget studiebruk.

**Det designet ikke løser, og som skal stå i rapporten:**

- **Å legge ansvaret på eleven er ikke et svar.** Vilkår om «til eget studiebruk» flytter ansvaret til en sekstenåring som ikke leser dem. Vernet ligger i grensene over.
- **Grensene for informert samtykke.** Et informasjonsskjermbilde gir en mindreårig kunnskap om at teksten sendes ut, men er ikke et gyldig samtykke i streng forstand.
- **Rettstilstanden er ikke avklart i dette dokumentet.** Hva avtaleverket for skoleverket tillater av digital gjengivelse, og om det gjelder når eleven selv laster opp, er ikke undersøkt (§11 pkt. 12). Skal det inn i rapporten, må det stå med en kilde som er lest, ikke en antakelse.

### 6.4 Kostnad

- `[ANTAKELSE: API-budsjett for hele semesteret er i størrelsesorden 300–600 kroner, av egen lomme.]` Rammen styrer lagring framfor regenerering, taket på tekstlengde (FR-1), taket på samtalelengde (FR-22) og bruksgrensene under.
- Ulike oppgaver bruker ulike modeller: `claude-haiku-5-5` som standard, og `claude-sonnet-5-5` for Samtalestart, Svarvurderingen og oppfølgingsspørsmålene. Kilden er `prompts/gjeldende.json` (AD-14). Fordelingen per oppgave med begrunnelse står i `addendum-lesevenn.md` §3.
- **Fordelingen er en budsjettbeslutning, ikke en kvalitetspreferanse:** de dyre tokenene brukes der kvaliteten avgjør noe, og de billige der volumet er. `[ESTIMAT 13.11.2026, ikke målt: én Tekst gjennom hele løypen med en Fagsamtale på fire runder koster om lag 1,60 kroner, og Fagsamtalen står for om lag 92 prosent. Uten Fagsamtale om lag 0,15 kroner, med seks runder, bilde og morsmål om lag 2,40. Rammen over holder da til om lag 200–400 Tekster.]`
- **Bruksgrenser (FR-54).** Én konto kan legge inn høyst **5 nye Tekster** og starte høyst **5 Fagsamtaler** per døgn. I tillegg stopper appen nye genereringer når samlet forbruk for døgnet passerer **30 kroner**. Over en grense sier appen hvilken grense som er nådd og når den åpner igjen (neste døgn, norsk tid). Lagret innhold kan fortsatt åpnes. Hvorfor: Fagsamtalen er der kostnaden ligger, og en grense per konto beskytter ikke budsjettet når mange bruker appen samtidig. `[ANTAKELSE: forbruket beregnes fra tokenbruken modellen oppgir i hvert svar, og prisene i addendum §3.]`
- **Svarvurderingen får den dyrere modellen** fordi FR-21 har en blokkerende port: null misoppfatninger lest som Dekkende.
- **Uttrekket måles mot Gullsett Faguttrykk (FR-8) før modellvalget låses.**
- Målekjøringene mot Gullsettene kjøres per promptversjon og er en budsjettpost, ikke en gratis bieffekt.

## 7. Ikke-mål

- **Lesevenn er ikke et sammendragsverktøy.** Det finnes ingen «oppsummer teksten for meg»-knapp. Den avsluttende oppsummeringen i FR-26 kommer etter at eleven har lest og blitt sjekket, og er ikke tilgjengelig før.
- **Lesevenn vurderer ikke elever.** Ingen karakter, ingen diagnose, ingen profil av hva eleven er svak i. Diagnostikk på tvers av økter krever brukshistorikk som ikke finnes i v1.
- **Lesevenn er ikke et lærerverktøy i v1.** Ingen klasseoversikt, ingen innsyn, ingen eksport til Kahoot eller Blooket.
- **Lesevenn er ikke en oversetter.** Morsmålsstøtten er tre definerte punkter i leseløypen, ikke en generell oversettelsesknapp.
- **Lesevenn leser ikke tekst fra URL.** Innlesing skjer ved liming, PDF med tekstlag, eller bilder av boksider (FR-44).
- **Lesevenn tar ikke imot tekst på andre språk enn norsk i v1.** Engelsk er det nærliggende tilfellet, og utelatelsen er et valg. Hvorfor: engelsk kilde gir engelske Faguttrykk med norsk forklaring, `erSirkulaer` bruker en norsk fyllordliste, og invarianten i §1 om at «det norske fagbegrepet står alltid sammen med oversettelsen» gjelder ikke. Naturlig utvidelse etter v1.
- **Lesevenn er ikke en plattform.** Ingen deling, ingen samarbeid, ingen sosiale funksjoner, ingen offentlige profiler.
- **Lesevenn er ikke et skolesystem.** Ingen Feide, ingen administrasjon, ingen roller utover eleven selv.

## 8. Omfang v1

### 8.1 Med i v1

- Innlesing av tekst på tre veier: liming, PDF med tekstlag, og bilder av boksider (umålt, tydelig merket). Gjennomsyn i to faser: overskriftene alltid, hele teksten for PDF og bilde (FR-3). Sju navngitte PDF-feiltilstander og fem for bilder.
- Kjerneløypen: Aktivering med overskrifter og forkunnskapssvar → Lesevisning med markerte Faguttrykk og forklaring inline → Quiz med forankring og tilbakevisning i teksten.
- Øvekort fra samme Begrepssett som Lesevisningen.
- Skriftlig fagsamtale med Svarvurdering i fem tilstander og oppfølgingsspørsmål som oppfyller FR-20, målt etter FR-21.
- Morsmålsstøtte: ukrainsk som Kvalitetssikret språk, øvrige som Modellstøttede med synlig forbehold, additiv visning med norsk fagord i parentes, arabisk høyre-til-venstre bygget og demonstrert uansett nivå, utpeking av språklige bilder og akademisk allmennspråk.
- Minnevers eller Suno-prompt, med faktasjekk.
- Brukerkonto med lagring, historikk og sletting.
- Mapper lett (FR-50 til FR-52): egne samlinger av Tekster med samlet øving på Øvekortene og en samlet Quiz av spørsmålene Tekstene alt har.
- Dokumentasjonsleveransen i §13 (DK-1 til DK-6): KI-logg, Promptregister, Gullsett med tall i repoet, kodekvalitetssikring, etikk og jus, refleksjon.
- Kjørbarhet for andre (FR-46): testmodus med lagrede modellsvar for eksempelteksten, og lokal database i Docker, slik at hele Kjerneløypen kan gås gjennom uten prosjektets API-nøkkel.

### 8.2 Utenfor v1

- **Innlesing fra URL.** Tekst, PDF og bilde dekker de veiene målgruppen faktisk har.
- **Tekstgjenkjenning av hele innskannede bøker.** Bildeinngangen tar inntil fire sider (FR-44). Å digitalisere en bok er en annen oppgave, med en annen opphavsrettslig karakter.
- **Samlet Fagsamtale, samlet Minnevers og ny generering på tvers av Tekster i en Mappe.** Mapper lett (FR-50 til FR-52) gjenbruker bare lagret innhold. Det som krever nye modellkall på tvers av Tekster, og dermed ny forankringsregel og nytt Gullsett, er ute. FR-32 til FR-34 er trukket tilbake og numrene gjenbrukes ikke (§4.9).
- **Talebasert fagsamtale.** Skriftlig først; tale legger til lydopptak, transkribering og en helt ny feilkjede.
- **CSV-eksport til Kahoot eller Blooket.** Verdien ligger hos klassen, via læreren, og læreren er ikke bruker i v1 (§2.2).
- **Flere Kvalitetssikrede språk enn ukrainsk.** Nivået krever en ekstern morsmålsbruker per språk (FR-28). Utsatt av risikohensyn; øvrige språk er tilgjengelige som Modellstøttede.
- **Diagnostikk på tvers av økter og fag.** Krever brukshistorikk over tid for å være annet enn gjetning.
- **Full morsmålsstøtte i alle funksjoner.** Quiz, fagsamtale og øvekort er på norsk i v1, fordi eleven skal øve på norsk fagspråk.
- **Lærerdashbord.** Krever klasser, roller, personvernvurdering og databehandleravtale; et eget prosjekt.
- **Feide-innlogging og institusjonell drift.**

## 9. Ferdig-definisjon og milepæler

Semesteret går fra 10. august til 18. desember 2026. **Innleveringsfristen er 5. desember 2026**, en lørdag. Lever fredag 4. desember, slik at en teknisk floke ved innlevering treffer en dag det finnes folk å spørre.

Planen er en kuttrekkefølge, ikke en ønskeliste: hvert nivå er en tilstand der prosjektet kan leveres.

Målearbeidet i §4 er en egen post i planen, ikke en bieffekt av å bygge: annotering, kjøring per promptversjon og manuell vurdering tar timer. Gullsettene er derfor små: Gullsett Faguttrykk (seks Tekster), Gullsett Quiz (24 spørsmål), Gullsett Fagsamtale (36 tilfeller), Gullsett Oversettelse (fire Tekster) og Gullsett Minnevers (ti vers). Tersklene er satt der de kan forsvares ved den størrelsen.

### 9.1 M0 — må virke (mål: 30. oktober)

Uten dette finnes det ikke et produkt å vurdere.

- Liming av tekst, med kontroll av overskriftene (FR-1, FR-3 fase 3a).
- Kjerneløypen ende til ende: Aktivering → Lesevisning med markeringer → Quiz (FR-5, FR-6, FR-7, FR-9, FR-10, FR-13, FR-14, FR-15).
- **Fagsamtale i full form** (FR-18 til FR-23): fem tilstander, strukturert utdata med `kildeavsnitt_id` og `mål`, flere runder, oppsummering.
- Konto og lagring, nok til at en Tekst kan hentes fram igjen, og sletting (FR-35, FR-36, FR-37).
- Testmodus med lagrede modellsvar og lokal database, slik at Kjerneløypen kan kjøres uten prosjektets nøkler (FR-46).
- Gullsett Faguttrykk er annotert og målt minst én gang, inkludert egen annoteringsstøy (FR-8), og stabiliteten er målt (FR-11). Hvorfor i M0: målingen skal styre promptarbeidet, og en måling som først kommer i desember har ikke styrt noe.
- KI-loggen er i gang og har oppføringer fra hele perioden, etter DK-1 (FR-38).

**M0 bygger Fagsamtalen; M1 måler den.** Gullsett Fagsamtale, sikkerhetsporten og avsnittstesten (FR-21) og Gullsett Quiz (FR-14) kjøres i M1. Hvorfor: uten Fagsamtalen er M0 det generiske «lim inn tekst, få en quiz»-verktøyet §1 definerer Lesevenn i motsetning til, men funksjonen er den dyreste i dokumentet, så målingene venter til M1.

### 9.2 M1 — v1 slik den er lovet (mål: 20. november)

Dette er prosjektet i briefens forstand, og det nivået som svarer til påstandene i §1.

- PDF-innlesing med alle sju navngitte feiltilstander og tester for hver (FR-2, FR-4). Testfilene må lages; det er en egen post.
- **Bildeinnlesing av boksider med sju navngitte feiltilstander (FR-44, FR-45).** Umålt og tydelig merket. Ligger i M1 og ikke som betinget mål, fordi en stor del av målgruppen ikke kan bruke appen uten den.
- Øvekort (FR-16, FR-17).
- Fagsamtalens målinger: Gullsett Fagsamtale, sikkerhetsporten, den binære gjenkallingen, måltesten og avsnittstesten (FR-21).
- Gullsett Quiz (FR-14).
- Morsmålsstøtte: **ukrainsk** som Kvalitetssikret språk, med målingene i FR-28 gjennomført, inkludert den eksterne vurderingen. Arabisk bygget og demonstrert med høyre-til-venstre-visning uavhengig av nivå (FR-24 til FR-29).
- Minnevers med faktasjekk (FR-30, FR-31).
- Leseinnstillinger (FR-12) og tilgjengelighetskravene i §5, testet på telefon.
- Promptregisteret viser minst én dokumentert forbedring over to versjoner (DK-2, tidligere FR-39).

**Minnevers ligger i M1, ikke sist.** Hvorfor: funksjonen er den billigste i dokumentet (om lag tre til fire timer), og faktasjekken i FR-31 gir det konkrete «modellen løy for rimets skyld»-funnet som DK-5 (FR-42) og DK-6 (FR-43) trenger.

### 9.3 Stabilisering og slakk (20.–27. november)

Det finnes ikke noe M2-nivå. Uken mellom M1 og kodefrys er slakk, ikke en funksjonsuke. Den brukes til feilretting funnet under målekjøringene, til å få demoløypen til å gå tre ganger på rad uten inngrep, til mobiltesting og til de siste tilgjengelighetskravene i §5. Skrider M1 ut, er dette bufferen som absorberer det.

**Mapper lett** (FR-50 til FR-52) ligger i slakken. Det er en ny funksjon i slakken, det SM-C2 advarer mot, og det skal stå åpent. Den holdes lett: ingen nye modellkall, ingen ny kvalitetspåstand og ingen ny måling, bare nye sider og tabeller over det som alt er lagret. Kuttes den, virker alt annet som før.

**Vilkår og aldersgrense** (FR-53) og **bruksgrensene** (FR-54) ligger også i slakken. Hvorfor: kravet må være på plass før frivillige testbrukere registrerer seg, og det kan ikke kuttes.

**Designfasen** (felles farger, avstander, typografi og knapper, og mobil) ligger i slakken og la til Landingsside, Arbeidsbord og Samlinger (FR-47 til FR-49). Den tar av bufferen, og krymper først om M1 skrider. Også det er nye funksjoner i slakken, og det skal stå åpent. Hvorfor: inngangen avgjør om en lærer eller elev forstår appen i det hele tatt. Kuttrekkefølge om tiden ikke strekker til: først rulleeffektene på landingssiden, så viften på arbeidsbordet (bunkene blir lenker), og til slutt arbeidsbordet selv (Samlinger blir startsiden). Brukervennlighetsfeil rettes fortløpende og venter ikke hit; §5 er funksjonskrav, ikke pynt.

`[ANTAKELSE: at omfang og vanskelighetsgrad vektlegges i vurderingen, bygger på materiale fra emnets tidligere gjennomføring og er ikke publisert policy for 2026. Det taler for ikke å kutte mer enn nødvendig, men ikke for å fylle slakken med nye funksjoner — se SM-C2.]`

### 9.4 Kodefrys og dokumentasjonsvindu (28. november – 5. desember)

**Kodefrys 27. november, satt som en git-tag**, slik at frysepunktet er et faktum i repoet og ikke en intensjon. Etter den datoen skrives ingen ny funksjonalitet, bare dokumentasjon, refleksjonsrapport og feilretting som gjør en demo mulig.

Hvorfor: refleksjonsrapporten teller 30 prosent og kodedokumentasjonen inngår i de resterende 70, og det arbeidet lar seg ikke klemme inn i kvelden før. Vinduet brukes til å skrive, ikke til å rekonstruere, fordi Gullsettene er målt og KI-loggen ført underveis.

### 9.5 Demotest — den faktiske ferdig-testen

Et nivå er ferdig når demoløypen kjører gjennom på en tom database, tre ganger etter hverandre, uten inngrep fra utvikleren:

1. Opprett konto, logg inn.
2. Lim inn testtekst A. Kontroller at bare overskriftene vises i fase 3a, rett én overskrift, godkjenn.
3. Aktivering: kontroller at brødteksten ikke er tilgjengelig, skriv forkunnskaper, gå videre.
4. Kontroller at fase 3b hoppes over for den innlimte teksten, og at teksten er låst for redigering når Lesevisningen vises (FR-3). Fase 3b for PDF og bilde prøves i steg 13.
5. Lesevisning: åpne tre forklaringer, én med tastatur alene.
6. Quiz: svar, se resultat, følg én tilbakevisning til Kildeavsnittet.
7. Øvekort: gå gjennom, merk to kort.
8. Fagsamtale: tre runder gjennomføres. For hver runde kontrolleres at det kommer en Svarvurdering med begrunnelse, og en oppfølging med gyldig `kildeavsnitt_id` og `mål`. Avslutningsoppsummeringen lister både det som ble godtatt som Dekkende og det som falt som Misoppfatning.
9. Trykk «jeg tror du misforsto svaret mitt» på én Svarvurdering, og kontroller at runden vurderes på nytt.
10. Velg arabisk som Morsmål. Kontroller at aktivering og oppsummering vises på begge språk, med korrekt leseretning, og at norsk fagord står i parentes etter det oversatte.
11. Last opp testfil PF-1 (skannet PDF). Kontroller meldingen og den anbefalte handlingen.
12. Gjenta steg 2–8 på telefon i portrettmodus, med forklaring åpnet ved trykk.
13. Last opp to bilder av en boksides tekst. Kontroller at merknaden om at bildeuttrekk ikke er kvalitetssikret vises, at rekkefølgen kan endres, og at uttrekket havner i fase 3a og deretter 3b som alt annet.
13b. Lag en Mappe fra Samlinger, og legg i den testtekst A og teksten fra bildene (FR-50 til FR-52). Kontroller at bildeteksten står med hva den mangler og en lenke til Teksten, uten at Mappen lager noe. Kontroller at Arbeidsbordet viser Mappen som én mappebunke, at testtekst A og bildeteksten ikke er egne bunker, og at testtekst A står i Mappens vifte med sine fem aktiviteter (FR-48). Øv på Øvekortene fra Mappen: kortet viser hvilken Tekst det er fra, og et kort merket i Mappen står merket i testtekst A. Ta den samlede Quizen med lengden Middels, lever, og kontroller at forsøket står under «Tidligere forsøk» med lengden. Steget koster ingen modellkall.
14. Slett testtekst A. Kontroller at den er borte fra Mappen, og at det samlede forsøket står med sitt antall. Logg ut.

**Hva demoløypen ikke tester.** Den sjekker ikke at Fagsamtalen klassifiserer et bestemt svar i en bestemt tilstand. Den tester at flyten holder og at feltene finnes; kvaliteten på klassifiseringen måles i Gullsett Fagsamtale (FR-21). Hvorfor: et kall til en språkmodell er ikke deterministisk, så en slik port ville feilet tilfeldig.

Demoløypen er skrevet ned som en sjekkliste i repoet, og kjøres ved hver milepæl, ikke bare før innlevering.

### 9.6 Status per 25. november

Tabellen viser hvor hvert krav står to dager før kodefrysen. Den er også terskeltabellen DK-3 krever: hver målte terskel står med målt verdi og bestått eller ikke bestått. Tallene kommer fra `prompts/REGISTER.md` og `maaling/resultater/`; prøvene i prod 25.11 står i `.logs/arve/issues.md` og logg 991. Historikken bak dem står i `beslutningslogg-prd.md`.

«I prod» betyr bygget, med automatiske tester, og rullet ut på lesevenn.vercel.app. Demotesten (§9.5) gikk 3 av 3 ganger 25.11, kjørt lokalt i testmodus (lagrede modellsvar, telefonen emulert i Chrome), og tilgjengelighetssjekken (§5) besto alle 656 sjekkene. Ekte iPhone ble prøvd i prod 23.–25.11 etter en egen sjekkliste (`.logs/arve/991-…`).

**Produktkrav**

| Krav | Milepæl | Status | Målt mot terskel |
|---|---|---|---|
| FR-1 Innliming | M0 | I prod | |
| FR-2 PDF-uttrekk | M1 | I prod | |
| FR-3 Gjennomsyn i to faser | M0 (3a), M1 (3b) | I prod | |
| FR-4 Feiltilstander for PDF | M1 | I prod | Alle sju feiltilstandene har test |
| FR-5 Overskrifter | M0 | I prod | |
| FR-6 Forkunnskap | M0 | I prod | |
| FR-7 Uttrekk av Faguttrykk | M0 | I prod | |
| FR-8 Treffsikkerhet mot Gullsett Faguttrykk | M0 | Målt, **ikke bestått** | Gjeldende prompt (v4): gjenkalling 0,361, presisjon 0,413, F1 0,380 (26.10). v3: F1 0,409 (snitt av tre kjøringer 14.10, før kodefunn 23 ble rettet; 0,384 etter). Forklaringene: 0 gale, 1 misvisende av 41 (11.11, bestått). Egen annoteringsstøy: positivt samsvar 0,62, κ 0,61 (26.10). Kravet om begge tekstkilder i hvert fag er ikke oppfylt: naturfag har bare læremiddel, samfunnsfag bare autentisk tekst |
| FR-9 Markering | M0 | I prod | |
| FR-10 Forklaring | M0 | I prod | |
| FR-11 Stabilitet | M0 | **Ikke målt etter kravet** | Forhåndsmåling 8.10 med prompt v2 på to Tekster, der bare den ene er i Gullsett Faguttrykk: 0,865 på fokusert tekst og 0,564 på oversiktstekst, med selvkonsistens over fem kjøringer (terskel 0,80) |
| FR-12 Leseinnstillinger | M1 | I prod | |
| FR-13 Quiz | M0 | I prod | |
| FR-14 Forankring | M0 (bygget), M1 (målt) | Målt, bestått | Gullsett Quiz: 24 av 24, 95 % KI [0,86–1,00] (8.11) |
| FR-15 Retting | M0 | I prod | |
| FR-16 Øvekort | M1 | I prod | |
| FR-17 Gjennomgang av Øvekort | M1 | I prod | |
| FR-18 Start av Fagsamtale | M0 | I prod | |
| FR-19 Svarvurdering | M0 | I prod | |
| FR-20 Oppfølgingsspørsmål | M0 | I prod | |
| FR-21 Relevans mot Gullsett Fagsamtale | M1 | Målt, **delvis** | Sikkerhetsport 0 av 12 (bestått), binær gjenkalling 0,93 (bestått), forhåndsvalgt avsnitt 12 av 12 (bestått), relevans 89 % (bestått). Måltest 15 av 18 (krav 16, ikke bestått) og avsnittstest 5 av 6 (krav 6, ikke bestått); ingen av de to er porter (FR-21; avgjort 10.11). Alt 6.11 |
| FR-22 Lengde og avslutning | M0 | I prod | |
| FR-23 Tone | M0 | Målt, bestått | 0 av 36 nedvurderende (blind), 0 av 12 hos én utenforstående leser (6.11 og 9.11) |
| FR-24 Morsmål | M1 | I prod | |
| FR-25 Additiv visning | M1 | I prod | |
| FR-26 Aktivering og oppsummering på Morsmål | M1 | I prod | |
| FR-27 Språklige bilder | M1 | I prod | |
| FR-28 Oversettelseskvalitet | M1 | Målt, bestått (ukrainsk) | Begrepsanker 0,981 (krav 0,95), tilbakeoversettelse 0 avvik, ekstern vurdering 0 av 16 (19.10) |
| FR-29 Feil i oversettelse | M1 | I prod | |
| FR-30 Minnevers | M1 | I prod, merket «Uferdig» | Suno-prompten er satt på pause |
| FR-31 Faktasjekk av Minnevers | M1 | Målt, bestått | Gullsett Minnevers: 0 usanne påstander av 10 (v3, 19.10). Huskeregel 6 av 10 (ingen terskel) |
| FR-35 Konto og innlogging | M0 | I prod | Mutasjonstest 14 av 14 (23.11). Registrering og sperren prøvd i prod 25.11 |
| FR-36 Lagring og historikk | M0 | I prod | |
| FR-37 Sletting | M0 | I prod | |
| FR-44 Bildeinnlesing | M1 | I prod | |
| FR-45 Bildeinnlesing er ikke kvalitetssikret | M1 | I prod, **umålt med vilje** | |
| FR-46 Kjørbarhet uten nøkler | M0 | I prod | Demotest og tilgjengelighetssjekk kjører i testmodus |
| FR-47 Landingsside | Slakk (designfasen) | I prod | |
| FR-48 Arbeidsbord | Slakk (designfasen) | I prod | |
| FR-49 Samlinger | Slakk (designfasen) | I prod | |
| FR-50 Mappe | Slakk (Mapper lett) | I prod | |
| FR-51 Samlet øving | Slakk (Mapper lett) | I prod | |
| FR-52 Samlet quiz | Slakk (Mapper lett) | I prod | |
| FR-53 Vilkår og personvern | Slakk | I prod | Registrering med vilkår prøvd i prod 25.11 |
| FR-54 Bruksgrenser | Slakk | I prod | |

FR-32 til FR-34 er trukket tilbake (§4.9). FR-38 til FR-43 er DK-1 til DK-6 (§13).

**Terskler som håndheves av koden**

Disse tersklene er ikke stikkprøver, men regler som sjekkes på hvert element før lagring (AD-11). Et element som bryter dem, forkastes. Det betyr at terskelen holder i det eleven ser, og testene viser at sjekken virker.

| Krav | Terskel | Hvordan | Test |
|---|---|---|---|
| FR-7 | Faguttrykk ordrett i Teksten: 100 % | Delstrengsjekk, brudd forkastes | `validering.test.ts`, `faguttrykk.test.ts` |
| FR-7 | Ingen sirkulær forklaring: 100 % | Maskinell sjekk, brudd forkastes | `validering.test.ts`, `faguttrykk.test.ts` |
| FR-14 | Null spørsmål som krever kunnskap utenfor Teksten | Målt mot Gullsett Quiz: 0 av 24 (8.11) | `maal-quiz.test.ts` |
| FR-20 | Gyldig `kildeavsnitt_id` og `mål`: 100 % | Skjemavalidering, brudd gir nytt forsøk | `fagsamtale.test.ts` |
| FR-20 | Ingen gjentakelse: Jaccard over innholdsord under 0,6 | Maskinell sjekk | `fagsamtale.test.ts`, `innholdsord.test.ts` |
| FR-27 | Høyst åtte utpekte uttrykk per 1 000 ord per kategori | Kappes ved lagring | `morsmaal.test.ts` |
| FR-31 | Hvert Faguttrykk i verset finnes i Begrepssettet: 100 % | Maskinell sjekk | `minnevers.test.ts` |
| FR-2 | Uttrekket fullføres eller feiler innen 20 sekunder | **Ikke målt** | |

**Dokumentasjonskrav**

| Krav | Milepæl | Status | Målt mot kriteriet |
|---|---|---|---|
| DK-1 KI-logg | M0 og løpende | Oppfylt | 16 oppføringer med status forkastet eller endret i overskriften (krav 5), og ti til med metodefunn. Endringer i loggen i september, oktober og november |
| DK-2 Promptregister | M1 | **Delvis** | 21 promptversjoner i 10 oppgaver i `prompts/`, alle oppgavene med rader i registeret. Forbedringen Faguttrykk v2 → v3 (presisjon 0,42 → 0,46) ligger innenfor spredningen mellom kjøringene, og gjeldende v4 har presisjon 0,413. Noen eldre versjoner er ikke målt |
| DK-3 Testsett og resultater | M0–M1 (Gullsettene) | **Delvis** | Fem Gullsett i repoet, og denne tabellen er terskeltabellen. Mangler: FR-2 (20 sekunder) er ikke målt, og FR-11 er ikke målt slik kravet sier |
| DK-4 Kvalitetssikring av koden | M0 og løpende | Oppfylt | Mutasjonstest 14 av 14 (23.11), tre tester i appen, 28 kodefunn (krav 3). Commits hver måned |
| DK-5 Etikk og jus | Dokumentasjonsvinduet (§9.4) | Gjenstår | Skrives i refleksjonsrapporten |
| DK-6 Refleksjon og påstander | Dokumentasjonsvinduet (§9.4) | Gjenstår | Skrives i refleksjonsrapporten |

**Suksesskriterier (§10)**

| Kriterium | Status | Grunnlag |
|---|---|---|
| SM-1 Demoløypen | Nådd | 3 av 3 på tom database, 25.11, lokalt i testmodus |
| SM-2 Nøkkelorduttrekk | **Ikke nådd** | Gjenkalling 0,361 og presisjon 0,413 (krav 0,75 og 0,70). Forklaringene: 0 gale av 41 |
| SM-3 Fagsamtalen | **Ikke nådd** | Begge portene holder (0 av 12, 0,93), relevans 89 %. Avsnittstest 5 av 6 og måltest 15 av 18 |
| SM-4 Oversettelsen | Nådd | Ukrainsk, se FR-28 |
| SM-5 Ingen blindveier | Nådd | PF-1 til PF-7 har test i `pdf.test.ts`; PF-7 uten egen testfil, fordi den simuleres |
| SM-6 Dokumentasjonen | Delvis | DK-5 og DK-6 skrives i refleksjonsrapporten |
| SM-7 Quizen | Nådd | 24 av 24 |
| SM-8 Stabilitet | **Ikke målt etter kravet** | Se FR-11 |
| SM-9 Telefon | Nådd | Demoløypen med emulert telefon; ekte iPhone i prod 23.–25.11 |
| SM-10 Testbruker | **Ikke gjort ennå** | Planlagt før levering 4.12 |
| SM-11 Papirbok | Nådd | Demoløypens steg 13 |
| SM-12 Noen andre kan kjøre appen | Nådd | README-testen 9 av 9, 25.11 |
| SM-13 Mapper | Nådd | Demoløypens steg 13b og 14 |

**Ikke nådd i v1**

Tersklene står. Bruddene leveres som kjente hull og drøftes i refleksjonsrapporten (DK-6), med tallene over.

- **SM-2 (FR-8):** uttrekket finner om lag en tredjedel av fagordene i Gullsett Faguttrykk, og noen markerte ord er støy. For eleven betyr det at noen viktige fagord ikke er markert. Forklaringene som vises, var riktige i Gullsettet. Terskelen ligger over utviklerens samsvar med seg selv (0,62), se FR-8.
- **SM-3 (FR-21):** Fagsamtalen bekreftet ingen gal forståelse i Gullsettet, og det var det viktigste. Men oppfølgingen pekte på feil avsnitt i ett av seks par og bommet på målet i tre av 18 tilfeller. Påstanden i §4.6 om at oppfølgingen peker på riktig sted, holder derfor ikke uten unntak.
- **SM-8 (FR-11):** stabiliteten er bare forhåndsmålt, på to Tekster med en eldre prompt. To elever med samme oversiktstekst kan få noe ulikt Begrepssett. Samme elev ser alltid det samme, fordi Begrepssettet lagres (FR-36).

## 10. Suksesskriterier

**Primære**

- **SM-1: Demoløypen går gjennom.** Sjekklisten i §9.5 fullføres tre ganger på rad på tom database, uten inngrep. Validerer hele §4.
- **SM-2: Nøkkelorduttrekk holder målet.** Gjenkalling ≥ 0,75 og presisjon ≥ 0,70 mot Gullsett Faguttrykk, rapportert per fag, **og null faglig gale forklaringer** i Gullsett Faguttrykk. Validerer FR-7, FR-8, FR-9.
- **SM-3: Fagsamtalen reagerer faktisk på svaret, og bekrefter ikke en gal forståelse.** To blokkerende porter: null misoppfatninger lest som Dekkende, og binær gjenkalling for «trenger oppfølging» ≥ 0,90. Avsnittstesten består på alle seks par, måltesten på minst 16 av 18, manuell relevans ≥ 80 prosent. Femveis forvekslingsmatrise rapporteres uten terskel. Validerer FR-19, FR-20, FR-21.
- **SM-4: Oversettelsen bærer det norske fagordet videre, og er sett av et menneske.** Begrepsanker ≥ 0,95 maskinelt, ekstern vurdering av én morsmålsbruker gjennomført og dokumentert, null tapte negasjoner eller endrede tall og egennavn. Gjelder ukrainsk; arabisk RTL-visning demonstreres uavhengig av nivå. Validerer FR-24 til FR-28.
- **SM-5: Ingen blindveier.** Alle sju PDF-feiltilstandene har en reproduserbar test som viser melding og tilgjengelig neste handling. Validerer FR-4.
- **SM-6: Dokumentasjonsleveransen er komplett.** KI-logg med minst fem forkastede eller endrede KI-forslag, Promptregister med måletall per versjon, Gullsett i repoet med kjørbar måling, dokumentert kodegjennomgang av innlogging og lagring, drøfting av eierskap og skjevhet, refleksjon som bruker de faktiske tallene, lesestrategien navngitt med minst én faglig kilde, og den sammenlignende påstanden fra briefen enten belagt eller uttrykkelig erklært ubevist. Validerer DK-1 til DK-6 (FR-38 til FR-43).

**Sekundære**

- **SM-7: Quizen er forankret.** Minst 85 prosent av spørsmålene i Gullsett Quiz passerer forankringskravet, rapportert med konfidensintervall (samme terskel og rapportering som FR-14), og null spørsmål i Gullsett Quiz krever kunnskap utenfor Teksten. Validerer FR-14.
- **SM-8: Begrepssettet er stabilt.** Overlapp ≥ 0,80 (Jaccard) mellom to kjøringer av samme Tekst, i det ferdig kappede Begrepssettet, målt over alle seks Tekstene i Gullsett Faguttrykk. Validerer FR-11.
  - Terskelen er 0,80 over hele Gullsettet, ikke per teksttype, og et brudd rapporteres som et brudd.
  - Tallet rapporteres per tekstkilde og teksttype (FR-8). Gullsettet har tre fokuserte Tekster og tre oversikter, bestemt før annoteringen.
  - Hvorfor: en terskel som flyttes etter at tallet er kjent, beviser ingenting, og uten merkingen kan et snitt ikke skille «jevnt middelmådig» fra «god på halvparten og svak på resten».
- **SM-9: Kjerneløypen virker på telefon.** Demoløypens steg 1–7 fullføres på telefon i portrettmodus. Validerer §5.
- **SM-10: Én testbruker utenfor utvikleren kommer gjennom løypen uten hjelp.** Én elev eller annen frivillig fullfører Kjerneløypen uten instruksjon, og friksjonspunktene skrives ned, særlig om gjennomsynet av hele teksten for PDF og bilde (FR-3 fase 3b) er der de stopper. `[ANTAKELSE: én testbruker er oppnåelig innen fristen. Én er nok til å finne det som er åpenbart galt, og langt bedre enn ingen.]`
- **SM-11: En elev med papirbok kommer gjennom løypen.** Bildeinnlesing av inntil fire sider gir en Råtekst som eleven kan rette i gjennomsynet og fullføre Kjerneløypen fra. Demonstreres i demoløypens steg 13. Validerer FR-44, FR-45. **Ikke en kvalitetspåstand:** metrikken sier at veien virker ende til ende, ikke at uttrekket er treffsikkert; det er umålt i v1 (FR-45).
- **SM-12: Noen andre kan kjøre appen.** Kjerneløypen fullføres fra et rent utsjekk av repoet, etter stegene i README, uten prosjektets API-nøkkel og uten tilgang til driftsdatabasen. Validerer FR-46. **Ikke en kvalitetspåstand om modellsvarene:** de er lagret på forhånd. Metrikken sier at kodeveien finnes, er validert og kan vises fram av noen som ikke er utvikleren.
- **SM-13: Eleven kan samle Tekster i en Mappe og øve på dem samlet.** Eleven lager en Mappe, legger Tekster i den, øver på Øvekortene samlet og tar en samlet Quiz med valgt lengde, og forsøket lagres. Demonstreres i demoløypens steg 13b og 14. Validerer FR-50, FR-51, FR-52. **Ikke en kvalitetspåstand:** kortene og spørsmålene er de samme som i hver Tekst, og målingene i FR-8 og FR-14 gjelder uendret. Samlet Fagsamtale er ute (§4.9).
- **Merknad om briefens mappekriterium.** Briefens «flere tekster samlet i en mappe med én felles quiz» er innfridd i den lette varianten (FR-50 til FR-52); den felles Fagsamtalen er ikke innfridd. Rapporten viser begge byttene, uttaket 27. september og den lette varianten 19. november, med begrunnelse, ikke bare sluttilstanden.

**Motmetrikker — skal ikke optimaliseres**

- **SM-C1: Antall markerte Faguttrykk.** Flere markeringer er ikke bedre; et gult teppe er verdiløst for den eleven appen er bygget for. Motvekt til SM-2: gjenkalling kan alltid kjøpes ved å markere mer, og presisjonskravet og tetthetstaket finnes for å hindre det.
- **SM-C2: Antall leverte funksjoner.** Nye funksjoner bygget i slakken på bekostning av M1-kvalitet er et tap, ikke en gevinst. Motvekt til fristpanikk.
- **SM-C3: Antall runder i en fagsamtale.** En lang samtale er ikke en bedre samtale. Motvekt til SM-3: seks runder er et tak, ikke et mål.
- **SM-C4: Språkmodellens egen vurdering av eget utdata.** Skal aldri brukes som dokumentasjon på kvalitet, verken i appen eller i rapporten. Bare måling mot Gullsett teller. Motvekt til hele kvalitetssikringen (§13): dette er den enkleste og mest forlokkende måten å gjøre den verdiløs på.

## 11. Åpne spørsmål

1. ~~**Innleveringsfristen er ikke bekreftet.**~~ **Avklart 25. september:** fristen er **5. desember 2026**, bekreftet hos emneansvarlig. Det er en lørdag; lever fredag 4. desember (§9).
2. ~~**Emnet er beskrevet med gruppevurdering, grupper på 4 ± 1.**~~ **Avklart 25. september:** solobygg er godkjent av emneansvarlig.
3. ~~**Arbeidskravet — godkjent proposal.**~~ **Avklart 25. september:** proposalen er levert og godkjent (`proposal-lesevenn.md`).
4. ~~**Hvem kan gjøre den eksterne vurderingen i FR-28?**~~ **Avklart 25. september:** en ukrainsk morsmålsbruker er funnet, og ukrainsk er v1s Kvalitetssikrede språk. Vurderingen er gjennomført (FR-24).
5. ~~**Stemmer emnets ukeplan med milepælsplanen i §9?**~~ **Avklart 25. september:** uke 44–45 i ukeplanen er anbefalt framdrift, ikke egne innleveringer.
6. **Tåler gjennomsynet av hele teksten (FR-3 fase 3b) en reell elev?** **Avklart for innlimt tekst:** fase 3b hoppes over der (FR-3). **Åpent for PDF og bilde:** prøves på testbrukeren i SM-10.
7. ~~**Hva skjer når eleven limer inn noe som ikke er en fagtekst?**~~ **Avklart:** et mykt, ikke-blokkerende varsel med mulighet for å fortsette, spesifisert i FR-7.
8. ~~**Skal samlet Fagsamtale (FR-34) måles?**~~ **Bortfalt:** Mapper lett (FR-50 til FR-52) har ingen samlet Fagsamtale, og den samlede Quizen bruker spørsmål som alt er målt (FR-14).
9. **Avklart 25.11, se FR-8.** **Er tetthetstaket i FR-7 riktig kalibrert for videregående?** Tallene (4 prosent av løpende ord, 12 unike Faguttrykk per 1 000 ord) ble satt for ungdomstrinnet. Har den manuelle annoteringen av Gullsett Faguttrykk (FR-8) jevnlig flere enn 12 uttrykk per 1 000 ord, skal taket heves, med tallet fra annoteringen og ikke et anslag. Henger sammen med pkt. 17.
10. ~~**Er de-orddeling av PDF mulig uten en norsk ordliste?**~~ **Avklart:** FR-2 slår sammen de vanlige tilfellene med en enkel regel uten ordliste, og restfeilene fanges i gjennomsynet (FR-3 fase 3b).
11. **Hvilken modell bruker appen, og er den en «Covered Model» med 30 dagers lagring?** **Avklart:** `claude-haiku-5-5` som standard og `claude-sonnet-5-5` for Samtalestart, Svarvurderingen og oppfølgingsspørsmålene (§6.4). Sjekken 8. oktober mot to primærkilder viser at Covered Models er Claude Fable 5.1, Mythos 5.1, Fable 5 og Mythos 5. Ingen av de to modellene står på listen, så 30-dagerslagringen gjelder ikke (addendum §6, med sitater og lesedato). **Åpent:** listen er sist oppdatert 1. september, før modellen ble utgitt 7. oktober. Den kontrolleres på nytt nærmere innlevering.
12. **Hva tillater avtaleverket for skoleverket av digital gjengivelse, og gjelder det når eleven selv laster opp?** Berører både innliming og bildeinnlesing. Ikke undersøkt. Må stå i rapporten med en lest kilde, ikke som antakelse. Ikke blokkerende for bygging, men blokkerende for å skrive §6.3 ferdig.
13. **Hvor godt virker bildeuttrekket i praksis?** Ikke målt i v1 (FR-45). Avviket mellom Råtekst og redigert tekst lagres, og er den billigste indikasjonen.
14. ~~**Er modellen for bildeuttrekket multimodal?**~~ **Avklart:** ja. Bildeuttrekket (FR-44) går på den billige modellen, `claude-haiku-5-5` (`prompts/gjeldende.json`), og trenger ikke Sonnet.
15. **Bør eleven skrive minneverset selv (FR-30)?** Modellen får ikke til sant, rimet og fagordrikt på én gang. Alternativet er at Lesevenn gir fire faktasetninger med Kildeavsnitt, fagordene og rimforslag, og at eleven skriver verset. Krever endring i FR-30 og en ny skjerm. Vurderes etter M1.
16. **Holder et krav i prompten for å spre de viktigste Faguttrykkene over Teksten, eller må kappingen også sikre spredning over Avsnittene?** Avklares mot Gullsett Faguttrykk. Se `[ÅPENT]` i FR-7.
17. **Avklart 25.11, se FR-8: nei, taket beholdes.** **Er tetthetsbudsjettet i FR-7 for stramt for det tekstene inneholder?** Avgjøres av første måling mot Gullsett Faguttrykk: er avstanden mellom det en Tekst inneholder og det budsjettet tillater systematisk stor, skal taket endres, men ikke før målingen finnes. Se `[ÅPENT]` i FR-8 og pkt. 9.

## 12. Antakelsesregister

Hver oppføring er merket `[ANTAKELSE]` der den står, og skal bekreftes eller avkreftes.

1. **§2.2** — Bruk i v1 er utviklerens testing og frivillige testbrukere som samtykker, ikke drift i en reell klasse med reelle elevdata.
2. **§2.2** — Det er videregåendetekster (Vg1–Vg3) som brukes i testing, demo og Gullsett. Flyttes målgruppen, må Gullsettene annoteres på nytt; nivået sitter i annoteringen, ikke i koden.
3. **§2.3, §4.1** — En stor del av målgruppen har papirbok eller nettbok uten brukbar kopiering. Det er grunnlaget for at bildeinnlesing (FR-44) prioriteres foran Mapper. Opplyst av utvikleren, ikke tallfestet.
4. **§4.1, FR-45** — Et multimodalt modellkall gir godt nok tekstuttrekk fra et mobilbilde av en boksides tekst til at gjennomsynet i FR-3 fase 3b holder som sikkerhetsnett. Ikke målt, og bevisst ikke målt.
5. **§4.1, FR-3** — Gjennomsynet av hele teksten (fase 3b) er verdt friksjonen for PDF og bilde. For innlimt tekst hoppes fase 3b over (FR-3). Prøves på testbrukeren i SM-10.
6. **§4.7** — Kontrollkilden for ukrainsk er tilgjengelig i M1-vinduet. Bekreftet 25. september: ukrainsk morsmålsbruker funnet.
7. **§4.7, FR-27** — En morsmålsbruker på videregående trenger sjelden akademisk allmennspråk forklart, så kategorien markeres bare for elever med valgt Morsmål.
8. **§13, DK-5 (FR-42)** — At yrkesfaglige fagtekster treffes dårligere av uttrekket enn studiespesialiserende, er en hypotese og ikke et funn. Gullsett Faguttrykk har ingen yrkesfagtekst, så hypotesen er uprøvd i v1; krysningen i FR-8 sammenligner fellesfag og programfag.
9. **§5** — Elever bruker Lesevenn på telefon like ofte som på PC, og mobil er derfor en reell flate i v1.
10. **§6.2** — Testbrukere er myndige elever på Vg3, eller mindreårige med samtykke fra foresatt.
11. **§6.4** — API-budsjettet for semesteret er i størrelsesorden 300–600 kroner. Målearbeidet, ikke kjøretidsbruken, er posten som skalerer med antall promptversjoner.
12. Trukket tilbake 25. september: fristen er bekreftet som 5. desember 2026. Se beslutningsloggen.
13. Trukket tilbake 25. september: ukeplanen for uke 44–45 er anbefalt framdrift, ikke innleveringer. Se beslutningsloggen.
14. **§9.3** — Omfang og vanskelighetsgrad vektlegges i vurderingen. Bygger på materiale fra tidligere gjennomføring, ikke publisert 2026-policy.
15. **§10, SM-10** — Minst én testbruker utenfor utvikleren er oppnåelig innen fristen.
16. **§6.4** — Forbruket for døgnet beregnes fra tokenbruken modellen oppgir i hvert svar, og prisene i addendum §3.

## 13. Dokumentasjonskrav

Kravene her beskriver leveranser, ikke hvordan appen oppfører seg, og har derfor egen seksjon og egen nummerering. Mappevurderingen krever at «dokumentasjon må vise hvordan KI ble brukt, og hvordan studentene har kvalitetssikret koden», og refleksjonsrapporten teller 30 prosent. DK-1 til DK-6 het tidligere FR-38 til FR-43, og de numrene gjenbrukes ikke.

Kvalitetssikringen gjelder både koden og innholdet. Appens kildekode er i stor grad KI-generert (DK-4). Innholdet appen lager i drift, kvalitetssikres av Gullsettene i §4 (Gullsett Faguttrykk, Gullsett Quiz, Gullsett Fagsamtale, Gullsett Oversettelse og Gullsett Minnevers), og DK-3 krever at de finnes i repoet med tall.

#### DK-1 (tidligere FR-38): KI-logg for utviklingen

Utvikleren fører en løpende logg over hvordan KI ble brukt i utviklingen.

**Sjekkbare kriterier:**
- Loggen er en fil i repoet, under versjonskontroll.
- Loggen er oppdatert gjennom semesteret: git-historikken har endringer i loggfilen i hver kalendermåned fra september til november 2026. `[ANTAKELSE: «jevn oppdatering» tolket som minst én commit per måned.]`
- Hver oppføring har fire felt: hva som ble bedt om, hvilket verktøy og hvilken modell, hva som kom tilbake, og hva utvikleren gjorde med det (godtatt, endret eller forkastet), med begrunnelse.
- Minst **fem** oppføringer har status forkastet eller vesentlig endret, hver med begrunnelse.

**Hvorfor:** En logg som bare viser treff, dokumenterer ikke kvalitetssikring, den dokumenterer flaks.

#### DK-2 (tidligere FR-39): Promptregister for kjøretid

Appens egne prompter er versjonert, med måleresultat per versjon.

**Sjekkbare kriterier:**
- Hver kjøretidsprompt (uttrekk av Faguttrykk, quizgenerering, svarvurdering, oppfølgingsspørsmål, oversettelse, minnevers) ligger i repoet med versjonsnummer.
- Hver promptversjon i repoet har en rad i registeret. Raden sier hva som ble endret, hvilken hypotese endringen hvilte på, og hva målingen viste, også når endringen ikke virket.
- For hver versjon står de relevante målingene fra FR-8, FR-14, FR-21, FR-28 og FR-31 med tall og dato.
- Minst **ett** forsøk viser en dokumentert forbedring, med tallene som viser den.

**Hvorfor:** Prompting blir et håndverk i rapporten og ikke en anekdote når forsøkene er etterprøvbare, ikke når de alle lyktes.

#### DK-3 (tidligere FR-40): Testsett og måleresultater i repoet

Gullsettene finnes som filer, ikke som beskrivelser.

**Sjekkbare kriterier:**
- Hvert Gullsett fra §4 ligger i repoet: tekster, manuelle annoteringer og forventede tilstander.
- Målingene kan kjøres på nytt med én kommando, og kommandoen er dokumentert.
- Resultatene er lagret som data.
- Én tabell viser hver terskel i dokumentet med målt verdi og bestått/ikke bestått. Ingen terskel i §4 mangler i tabellen. Tabellen er statusoversikten for hele kvalitetsarbeidet.

**Hvorfor:** Gullsettene er kvalitetssikringen av innholdet, og den må finnes i repoet med tall, ikke bare som påstand i en rapport.

#### DK-4 (tidligere FR-41): Kvalitetssikring av koden

Den KI-genererte koden er gjennomgått, testet og sporbar.

**Sjekkbare kriterier:**
- Versjonskontroll brukes gjennom hele semesteret, med commit-meldinger som gjør det mulig å følge utviklingen, ikke én stor innlevering på slutten. Git-historikken har commits i hver kalendermåned fra september til november 2026. `[ANTAKELSE: «gjennom hele semesteret» tolket som minst én commit per måned.]`
- De sju PDF-feiltilstandene (FR-4), forankringskravet (FR-14) og de maskinsjekkbare kravene i FR-7, FR-20, FR-25 og FR-31 har automatiserte tester, og testene kjører grønt.
- KI-generert kode i delene som håndterer innlogging, lagring og sletting (§4.10), er gjennomgått med forklaring, og gjennomgangen er dokumentert.
- Den samme koden er verifisert ved testing i appen, med minst én test for hver av innlogging, lagring og sletting. `[ANTAKELSE: kravet sier ikke hvor mange tester i appen.]`
- Den samme koden er dekket av automatiske tester som er vist å oppdage feil når koden ødelegges med vilje (mutasjonstesting, `npm run sjekk:innlogging`). Mutasjonstesten har 14 regler, blant dem at innloggingen slipper gjennom fem forsøk på rad før sperren (FR-35), og testene oppdager hvert brudd.
- Minst **tre** konkrete feil eller svakheter i KI-generert kode er dokumentert, hver med hvordan den ble funnet: test, gjennomgang eller feilsøking i drift.

**Hvorfor:** Innlogging, lagring og sletting er delene der en KI-generert snarvei gjør mest skade.

#### DK-5 (tidligere FR-42): Etikk og jus

Prosjektet gjør rede for de etiske og juridiske sidene det faktisk berører.

**Sjekkbare kriterier:**
- Rapporten oppgir prosjektets standpunkt til eierskap til KI-generert kode og prosjektets lisensvalg.
- Rapporten drøfter skjevhet for dette produktet på tre akser, hver i eget avsnitt:
  - **Mellom fag:** fordelingen per fag fra FR-8 er oppgitt med tall.
  - **Mellom programområder:** Gullsett Faguttrykk har ingen yrkesfagtekst; programfagtekstene er fra Teknologiforståelse. Rapporten oppgir resultatet av krysningen fellesfag mot programfag, også om det viser ingen forskjell, og sier rett ut at det ikke er prøvd om uttrekket virker dårligere på yrkesfaglige tekster, og hva det betyr for §1. `[ANTAKELSE: at yrkesfaglige fagtekster treffes dårligere, er en hypotese — ikke et funn.]`
  - **Mellom språk:** nivåskillet i FR-24 vurderes kritisk, og avsnittet tar opp at kvaliteten trolig er dårligst for Modellstøttede språk med lite treningsdata, som somali, tigrinja og dari.
- Rapporten drøfter datakjeden og opphavsretten som et valg, ikke som en gitt ramme, og avsnittet oppgir:
  - hvilken leverandør som behandler elevenes tekster og bilder, hvor, og på hvilke vilkår, med dato for når vilkårene ble lest (§6.2);
  - hvilke alternativer som ble vurdert: annen leverandør, europeisk behandlingssted (finnes ikke som valg via Anthropic direkte; ifølge tredjepartskilder via AWS Bedrock eller Google Vertex AI, se addendum §6) og en lokalt kjørt modell, og hvorfor den lokale modellen ble valgt bort;
  - hva designet gjør for å begrense eksponeringen: tegngrensen, bildegrensen, forbudet mot korpusbygging, og at bilder ikke lagres (§6.3);
  - hva det ikke løser: at ansvaret i praksis skyves til en mindreårig, og at rettstilstanden ikke er undersøkt i dette prosjektet.
- Rapporten begrunner valget om å ta inn bildeinngangen (FR-44) til tross for at den skjerper datakjeden.

**Hvorfor:** Skjevhet og datakjede skal drøftes konkret for dette produktet, fordi et verktøy som virker dårligst der behovet er størst, ikke har løst problemet i §1.

#### DK-6 (tidligere FR-43): Refleksjon, forankring og de påstandene prosjektet gjør

Rapporten drøfter ærlig hva det betyr å la en språkmodell vurdere en elevs forklaring, og gjør opp status for de påstandene prosjektet bygger sin egen berettigelse på.

**Sjekkbare kriterier:**
- Rapporten navngir lesestrategien Lesevenn er forankret i (aktivere forkunnskaper før lesing, støtte begrepsforståelse underveis, teste forståelse aktivt etterpå), og oppgir minst **én** faglig kilde for den.
- Rapporten gjør opp de to sammenlignende påstandene fra briefen: at en lesestrategi-forankret flyt hjelper bedre enn et generisk «lim inn og få et sammendrag»-verktøy, og at en skriftlig fagsamtale er en mer troverdig forståelsestest enn en ren flervalgsquiz. For hver av dem legger rapporten enten fram belegget, eller sier rett ut at påstanden er ubevist i v1 og hva som skulle til for å prøve den.
- Rapporten sier at det å generere sammendrag og quiz fra en opplastet tekst er en velkjent idé, også beskrevet som et enkelt forslag i emnets prosjektliste, og bygger argumentet på sammensetningen og kvalitetsarbeidet.
- Refleksjonen bruker de faktiske tallene fra FR-21, inkludert forvekslingsmatrisen.
- Rapporten navngir og drøfter den alvorligste feilmåten: at en Misoppfatning leses som Dekkende, altså at eleven får bekreftet en feil forståelse.
- Rapporten begrunner valget om at Svarvurderingen aldri er en karakter (FR-23) som en konsekvens av disse grensene.

**Hvorfor:** Å gjenta en ubevist påstand som om den var vist, er den ene tingen som ville undergrave hele dokumentasjonen av kvalitetsarbeidet.
