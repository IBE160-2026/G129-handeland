---
name: Adversarisk gjennomgang av arkitekturspinen
type: review
lens: adversarial
target: arkitektur-lesevenn.md
against: prd-lesevenn.md
created: '2026-09-29'
---

# Adversarisk gjennomgang — arkitektur-lesevenn.md

## Metode

Jeg har ikke lett etter det spinen sier feil. Jeg har lett etter par av enheter ett nivå ned — to funksjoner eller stories som skal bygges hver for seg — der **begge følger alle AD-ene til punkt og prikke, og resultatene likevel ikke kan settes sammen.** Hvert slikt par er en invariant som mangler.

Kriteriet for at et funn er med: jeg må kunne skrive ned begge enhetenes signatur og peke på hvilken AD hver av dem leser, og AD-en må faktisk tillate begge lesninger. Påståtte hull som en AD dekker ved nærlesning, er strøket uten omtale.

## Samlet dom

Spinen er stram på lagskillet og løs på dataformen. De AD-ene som handler om hvor kode bor (AD-1, AD-5, AD-8, AD-10) er håndhevbare. De som handler om hva en entitet *er* og hvem som eier den (AD-2, AD-3, AD-4, AD-6, AD-9) er formulert som beskrivelser av en tilstand ingen er pålagt å opprette.

Det gir en systematisk skjevhet: spinen forhindrer at promptene havner i to utgaver, men ikke at **avsnittslisten** havner i to utgaver — og avsnittslisten er den entiteten *alle* kvalitetspåstandene i PRD §4.3, §4.4 og §4.6 er målt mot. Fire av de sju funnene under har samme rot: AD-2 sier hva et Kildeavsnitt *refererer til*, og aldri hva et Avsnitt *er*, hvem som lager det, eller hvem som lager det på samme måte to ganger.

Konsekvensen er ikke en byggefeil. Det er at målingene i FR-8, FR-14 og FR-21 kan bestå mot en avsnittsdeling eleven aldri møter, og at spinens egen begrunnelse for hele paradigmet — «det som måles er det brukeren møter» — er sann for promptene og usann for forankringen.

Sju funn. Fire er blokkerende før M0, fordi de gjelder kode som skrives i M0 og som er dyr å rette etter at Gullsettet er annotert mot den.

---

## Funn 1 — Avsnittsdelingen har ingen normativ regel, og harnessen har ingen plikt til å bruke den

**Alvorlighet: blokkerende. Må tettes før første annotering i M0.**

### De to enhetene

**Enhet A — `tekst/avsnittsdeling.ts`, kalt fra låsemodulen.**
Story: «Når eleven godkjenner fase 3b, deles den godkjente brødteksten i avsnitt og lagres som numererte rader.» Bygger leser AD-2 og AD-9, implementerer deling på tom linje (`\n\s*\n`), som er den vanlige formen for avsnitt i innlimt tekst. Ni avsnitt for testtekst A.

**Enhet B — `maaling/kjor.ts`, harnessens innlesing av Gullsettet.**
Story: «Målekjøringen laster de seks Gullsett-tekstene fra `maaling/gullsett/` og kjører generatoren per promptversjon.» Bygger leser AD-7 og AD-10: harnessen skal ikke starte en database, generatoren tar inn tekst, og kildeavsnitt-referansene i utdataet skal kunne sjekkes mot avsnittsnumre. Bygger trenger derfor en avsnittsdeling, og lager sin egen — deling per linjeskift, fordi Gullsett-filene er markdown der hvert avsnitt står på én linje. Førtiåtte avsnitt for samme testtekst.

### Hvordan begge følger spinen

AD-2 sier at «den låste Teksten deles i avsnitt én gang og lagres som numererte rader». Enhet A gjør nøyaktig det. Enhet B lagrer ingenting i databasen og bryter derfor ingen «én gang»-regel — den er ikke en Tekst, den er en målekjøring, og AD-7 pålegger den å lagre rå svar som filer, ikke å bruke `tekst/`. AD-10 forbyr generatorlaget å importere databaseklient og rammeverkskode; den sier ingenting om hvilken modul som deler teksten før generatoren kalles, og den sier uttrykkelig at generatorens inndata er «tekst», ikke en avsnittsliste.

Katalogoversikten plasserer «avsnittsdeling» i `tekst/`. Det er en plassering, ikke en invariant: `maaling/` er en egen toppkatalog i samme oversikt, ingen AD pålegger den å importere fra `tekst/`, og AD-10s renhetskrav peker i motsatt retning — en bygger som leser «harnessen skal ikke trenge webappen eller databasen» vil unngå å importere fra en katalog beskrevet med «innlesing, avsnittsdeling, låsing (AD-9)», altså full av tilstandslogikk.

### Hvordan de kolliderer

Kollisjonen er ikke et unntak ved kjøring. Den er at **avsnittstesten i FR-21 får en annen følsomhet i måling enn i produksjon.**

Avsnittstesten krever at oppfølgingens `kildeavsnitt_id` er «et annet avsnitt» i misoppfatningstilfellet enn i det dekkende. Med 48 avsnitt er «et annet avsnitt» nesten gratis — to treff i en tekst delt per linje er ulike med høy sannsynlighet, og testen degenererer til nøyaktig den typen test PRD §4.6 selv erklærer verdiløs, den som ikke kan feile. Med 9 avsnitt betyr den noe. Harnessen måler den billige varianten, eleven møter den dyre. Porten består, og påstanden den bærer gjelder ikke det som er levert.

Samme mekanisme rammer FR-7s tetthetstak: «3 markeringer per 100 sammenhengende ord» og kappingen ved uttrekk regnes mot en tekst hvis avsnittsstruktur er ulik i de to veiene. Og den rammer FR-21s manuelle forhåndsannotering — utvikleren har skrevet ned hvilket avsnitt som motsier hver misoppfatning, mot harnessens nummerering. Den annoteringen er verdiløs i produksjon.

Legg til den tredje veien: FR-2 gir PDF-uttrekk der avsnittsgrenser er linjeskift uten tom linje, og FR-44 gir et multimodalt modellkall som formaterer som det vil. Samme kapittel limt inn gir ni avsnitt; lastet opp som PDF gir 200; fotografert gir det modellen fant for godt. Tre innlesingsveier, tre avsnittsdelinger av samme tekst, og alle tre passerer AD-2, AD-9 og AD-11.

### Ny AD

> **AD-12 — Avsnittsdeling er én funksjon med én normativ regel**
>
> - **Binds:** AD-2, AD-9, FR-2, FR-3, FR-7, FR-14, FR-21, FR-44
> - **Prevents:** at samme tekst får ulik avsnittsdeling avhengig av hvilken vei den kom inn, og at målingene i FR-8, FR-14 og FR-21 gjelder en annen avsnittsstruktur enn eleven møter
> - **Rule:** all avsnittsdeling i hele systemet skjer i én ren, deterministisk funksjon `tekst/avsnittsdeling.ts#delIAvsnitt(brødtekst: string): Avsnitt[]`. Funksjonen importerer verken databaseklient eller rammeverkskode, slik at `maaling/` kan kalle den direkte — og harnessen **skal** kalle den; ingen egen deling i målelaget. Regelen er: normaliser linjeskift, del på én eller flere tomme linjer, og slå deretter sammen en blokk under 120 tegn med blokken foran, unntatt overskriftsrader. Utdata er fortløpende numre fra 1.
> - **Håndheves av:** en test som kjører samme logiske tekst gjennom alle tre innlesingsveiene (innliming, PDF-uttrekk, bildeuttrekk med stubbet modellsvar) og krever identisk avsnittsliste, og en test som feiler dersom noen fil utenfor `tekst/avsnittsdeling.ts` deler tekst på linjeskift eller tom linje.

Terskelen på 120 tegn er et tall som skal endres når annoteringen i M0 sier hva som er riktig. Poenget er at det finnes *et* tall, sjekket inn og versjonert, og at ingen annen kode har lov til å ha sitt eget.

---

## Funn 2 — Generatorens avsnittsnumre er en skjult avhengighet AD-10 aktivt skjuler

**Alvorlighet: blokkerende. Rammer alt generert innhold.**

### De to enhetene

**Enhet A — `generatorer/begrepssett.ts`.**
Signatur, direkte fra AD-10: `hentBegrepssett(tekst: string, promptversjon: string): Promise<Begrepssett>`. Bygger følger «Inn: tekst og promptversjon» ordrett. For å levere kildeavsnitt-referanser nummererer prompten avsnittene i teksten den fikk, og modellen svarer med `kildeavsnitt: 4`. Generatoren validerer at tallet er innenfor antallet avsnitt den selv tellet (AD-11), og returnerer.

**Enhet B — `data/begrepssett.ts`, lagringssiden.**
Story: «Kalleren lagrer Begrepssettet med eierskapssjekk.» Bygger følger AD-10 («Kalleren lagrer»), AD-8 (eierskapssjekk i datatilgangsfunksjonen) og AD-2 (kildeavsnitt er en referanse til én numerert rad). Skriver `begrep.avsnitt_id = avsnitt[kildeavsnitt - 1].id`, med UUID etter navnekonvensjonen.

### Hvordan begge følger spinen

Enhet A har ingen databaseimport, ingen rammeverkskode, tar inn tekst og promptversjon, gir ut validert strukturert utdata med kildeavsnitt-referanser. Det er AD-10 uttømmende innfridd. Enhet B lagrer, sjekker eierskap, og behandler kildeavsnitt som en referanse til én rad og aldri som et tegnspenn. Det er AD-2 og AD-8 uttømmende innfridd.

### Hvordan de kolliderer

Tallet `4` fra enhet A og raden `avsnitt[3]` i enhet B er samme avsnitt bare dersom generatoren tellet avsnitt med *nøyaktig* samme regel som `tekst/` gjorde ved låsing, på *nøyaktig* samme streng. Ingen AD sier at de skal. AD-10 sier tvert imot at inndata er en streng, og gjør dermed avsnittsnummereringen til noe generatoren må finne opp på nytt internt — en avhengighet mellom de to enhetene som ikke finnes i noen signatur, ikke i noen AD, og ikke i noen test.

Avviket er systematisk, ikke sporadisk. Overskrifter er det opplagte tilfellet: dersom `tekst/` teller overskrifter som egne avsnittsrader og generatorens prompt ikke gjør det, er hele Begrepssettet forskjøvet like mange plasser som det finnes overskrifter foran uttrykket. Hver forklaring peker på avsnittet før eller etter det den forklarer.

AD-11 fanger det ikke, og det er verdt å si presist hvorfor: AD-11 forkaster utdata som bryter «et verbatim-, kildeavsnitt- eller formkrav». Et kildeavsnittskrav kan maskinelt bare bety «tallet er innenfor antall avsnitt». En forskyvning på én gir et tall som er innenfor. Utdataet er skjemagyldig og innholdsmessig galt, som er den ene feilklassen AD-11 ikke kan se.

Dette er dessuten nøyaktig den feilen AD-9 finnes for å hindre — «at kildeavsnitt-henvisninger peker på tekst som har flyttet seg» — levert gjennom en annen dør. AD-9 vokter at teksten ikke flytter seg etter generering. Ingen vokter at generatoren og lagringen var enige om hvor den sto til å begynne med.

### Ny AD, som erstatter AD-10s inndatasetning

> **AD-13 — Generatorens inndata er avsnittslisten, ikke en tekstblokk**
>
> - **Binds:** AD-2, AD-10, AD-11, FR-7, FR-14, FR-20, §5
> - **Prevents:** at generatorlaget nummererer avsnitt på nytt internt, og at et skjemagyldig kildeavsnitt kan peke på et annet avsnitt enn det generatoren mente
> - **Rule:** generatorlagets inndatatype er `{ tittel: string, avsnitt: ReadonlyArray<{ nummer: number, tekst: string }> }` og promptversjon. Generatoren mottar ingen usammensatt brødtekst og inneholder ingen kode som deler tekst. Utdatatypen krever at hver kildeavsnitt-referanse er et `nummer` som forekommer i inndatalisten; skjemavalideringen i AD-11 sjekker medlemskap i det mottatte settet, ikke at tallet ligger i et intervall. Typen gjør en tekstblokk urepresenterbar som generatorinndata.
> - **Renheten er uberørt:** avsnittslisten er en ren verditype uten databaseavhengighet. Både webappen (fra lagrede rader) og harnessen (fra `delIAvsnitt` på en Gullsett-fil) kan produsere den.

Dette er den eneste endringen i gjennomgangen som krever at AD-10 skrives om, og den gjør AD-10 sterkere: «Inn: tekst» er den setningen som i praksis tvinger generatoren til å eie en entitet den ikke har lov til å eie.

---

## Funn 3 — «Gjeldende promptversjon» har ingen eier, og AD-6 har ingen håndhever

**Alvorlighet: blokkerende. AD-6 er dekorativ slik den står.**

### De to enhetene

**Enhet A — `generatorer/kontrakt.ts#gjeldendeVersjon(oppgave)`.**
Story: «Generatoren laster gjeldende promptversjon for oppgaven.» Bygger leser AD-3: prompter er filer `prompts/<oppgave>/vN.md`, gamle versjoner beholdes på disk, prompter lagres ikke i databasen. Den eneste lesningen som er forenlig med alle tre setningene er: gjeldende er den høyeste N som finnes i katalogen. Ingen ekstra tilstand, ingen database, alt i versjonskontroll.

**Enhet B — `maaling/port.ts`, utgivelsesporten.**
Story: «Målekjøringen beregner sikkerhetsporten og den binære gjenkallingen per promptversjon, og skriver bestått/ikke bestått til `maaling/resultater/<oppgave>-vN.json`.» Bygger leser AD-5 (porter er et kommandolinjeverktøy, ikke en byggtest), AD-6 (består ikke en versjon porten, settes den ikke som gjeldende) og AD-7 (rå svar lagres som filer). Verktøyet regner ut dommen og skriver den ned.

### Hvordan begge følger spinen

Enhet A bruker gjeldende versjon, som AD-3 krever av generatoren. Enhet B beregner porten som et kommandolinjeverktøy og skriver resultatene som data, som AD-5 krever, og lar bygget være upåvirket, som AD-6 krever.

### Hvordan de kolliderer

AD-6 sier at en versjon som ikke består porten «settes ikke som gjeldende». Setningen forutsetter en **handling** — noen setter noe. AD-3 har designet den handlingen bort: gjeldende er en egenskap ved filsystemet. Da er *det å sjekke inn `prompts/svarvurdering/v3.md`* selve forfremmelsen.

Følgen er at AD-6 aldri kan brytes ved en beslutning, bare ved en filoppretting — altså ved den normale arbeidsflyten for å iterere på en prompt. Utvikleren som skriver v3 for å prøve en forbedring i FR-39 («minst én dokumentert forbedring over to versjoner») har i samme handling satt v3 i produksjon, umålt, forbi en port som ikke har noe å gripe i. Ingen AD er brutt. AD-6 er bare ikke gjort.

Og verre, fordi det er nøyaktig den tilstanden AD-1 finnes for å utelukke: mens v3 ligger på disk kjører webappen v3, og harnessen kjører det den blir bedt om — typisk v2, fordi det er versjonen med resultater. Webappen og harnessen har **samtidig ulik oppfatning av hva gjeldende versjon er**, uten at promptene finnes i to utgaver. AD-1 vokter duplikatet og ikke divergensen.

AD-4 gjør tilstanden vanskeligere å oppdage, ikke lettere. Hvert lagret element stempler ærlig v3, målerapporten stempler ærlig v2, og ingen av tallene ser gale ut. Det er to konsistente sett bøker.

### Ny AD

> **AD-14 — Gjeldende promptversjon er erklært, ikke utledet**
>
> - **Binds:** AD-1, AD-3, AD-4, AD-6, FR-8, FR-21, FR-39
> - **Prevents:** at en umålt promptversjon tas i bruk ved å bli sjekket inn, og at webappen og harnessen samtidig har ulik oppfatning av hva som er gjeldende
> - **Rule:** `prompts/gjeldende.json` er et sjekket inn manifest som avbilder oppgave → versjonsnummer. Generatoren leser gjeldende versjon **bare** derfra og avviser å kjøre en versjon manifestet ikke navngir. Å legge en ny promptfil på disk endrer ingenting; forfremmelse er en endring i manifestet, og den endringen er en egen commit. Harnessen rapporterer alltid både versjonen den kjørte og versjonen manifestet peker på.
> - **Håndheves av:** en byggtest (`npm test`) som for hver oppføring i manifestet krever at `maaling/resultater/<oppgave>-vN.json` finnes, gjelder samme fil-hash som promptfilen, og har `bestått: true` for de portene som binder oppgaven — sikkerhetsporten og den binære gjenkallingen for svarvurdering (FR-21), tersklene i FR-8 for uttrekk. Mangler resultatet, eller er porten ikke bestått, feiler bygget.

Dette bryter ikke AD-5. Byggtesten kjører ingen måling og kaller ingen modell; den sjekker en relasjon mellom to filer i repoet, som er en maskinsjekkbar invariant og dermed nøyaktig det AD-5 plasserer i `npm test`. AD-6s livssyklusskille står: porten *beregnes* utenfor bygget. Det bygget håndhever, er at et manifest ikke får peke på en versjon uten bestått portresultat — en kodefakta, ikke en modellfakta.

---

## Funn 4 — AD-9 dekker skriving *til* en Tekst, ikke skriving *forankret i* en Tekst

**Alvorlighet: blokkerende. Invarianten «generert innhold bare mot en låst Tekst» har ingen håndhever.**

### De to enhetene

**Enhet A — `tekst/las.ts`.**
Story: «All skriving til en Tekst går gjennom én modul som håndhever AD-9.» Bygger eksponerer `rettOverskrifter`, `rettBrødtekst`, `godkjennFase3b` og ingenting annet, avviser skriving til `redigert_tekst` når tilstanden er Låst, og avviser enhver endring av avsnittsradene. Det er konsistenskonvensjonen og AD-9 oppfylt uten forbehold.

**Enhet B — `data/begrepssett.ts#lagreBegrepssett(kontoId, tekstId, begrepssett)`.**
Story: «Kalleren lagrer Begrepssettet, med eierskapssjekk i datatilgangslaget.» Bygger følger AD-8 (funksjonen verifiserer at innlogget konto eier raden), AD-10 («Kalleren lagrer») og AD-11 (validerer før lagring). Funksjonen importerer Drizzle-klienten direkte, som alt i `data/` gjør. Den skriver til BEGREPSSETT og BEGREP, aldri til TEKST.

### Hvordan begge følger spinen

Enhet B skriver ikke til en Tekst. Konsistenskonvensjonen lyder «All skriving til en Tekst går gjennom én modul», og en skriving til Begrepssettet er ikke det — etter ordlyden. Enhet B har ingen grunn til å importere `tekst/las.ts`, og en bygger som leser AD-8 vil helst ikke: autorisasjonen skal ligge i datatilgangsfunksjonen, ikke bak en annen modul.

### Hvordan de kolliderer

AD-9 inneholder invarianten «generert innhold kan bare opprettes mot en låst Tekst». Ingen av de to enhetene håndhever den. Enhet A ser aldri kallet. Enhet B har ingen pålagt grunn til å lese tilstanden på Teksten før den skriver. Invarianten er sann så lenge kallstedene i `app/` husker på den — altså i akkurat den formen AD-8 uttrykkelig forkaster for autorisasjon: en sjekk som ligger på veien inn og ikke i laget som skriver.

To konkrete sammenstøt følger:

**Generering mot en ulåst Tekst.** En server action for «forhåndsvis Begrepssettet» i fase 3b — ikke urimelig, og ingenting i PRD forbyr en bygger å foreslå den — kaller generatoren på `redigert_tekst` og lagrer. Avsnittsradene finnes ennå ikke, fordi AD-2 lager dem ved låsing. Kildeavsnitt-referansene peker inn i ingenting, eller inn i en avsnittsliste som opprettes etterpå og er annerledes. AD-9 er ikke brutt av noen modul; den er bare ikke anvendt.

**To Begrepssett på én Tekst.** ER-diagrammet viser `TEKST ||--o| BEGREPSSETT`, altså høyst ett. Det er en tegning. FR-11 sier «lagres på Teksten ved første kjøring og gjenbrukes deretter», som er en oppførsel, ikke en skranke. To enheter implementerer «generer hvis mangler»: server action for Lesevisningen, og kallstedet for Øvekort eller Minnevers, som begge trenger Begrepssettet (FR-16, FR-30) og begge må kunne åpnes direkte. Begge gjør les-så-skriv. To faner, to rader, to ulike Begrepssett på samme låste Tekst — og da er FR-16s avviksstest mellom Øvekortsett og Begrepssett en test på hvilken rad spørringen tilfeldigvis fant. Kostnadsvernet i §6.4 er samtidig borte.

### Ny AD

> **AD-15 — Låsen er en typegrense og en skranke, ikke en konvensjon**
>
> - **Binds:** AD-2, AD-8, AD-9, AD-11, FR-3, FR-7, FR-11, FR-16, §6.4
> - **Prevents:** at generert innhold opprettes mot en ulåst Tekst, og at det finnes to Begrepssett, to Quizer eller to avsnittslister for samme Tekst
> - **Rule:** hver datatilgangsfunksjon som skriver en entitet forankret i en Tekst — Begrepssett, Begrep, Quiz, Quizspørsmål, Fagsamtale, Samtalerunde, Minnevers, utpekingssettet i FR-27 — tar en `LåstTekst`-verdi som argument, ikke en `tekstId`. `LåstTekst` konstrueres bare av `tekst/las.ts`, ved å lese tilstanden, og bærer avsnittslisten med seg. Ingen annen modul kan konstruere den. En ulåst Tekst er dermed urepresenterbar på skrivestien for generert innhold, uten at autorisasjonen flytter ut av `data/` — eierskapssjekken i AD-8 blir stående der den er.
> - **Rule, i databasen:** unik indeks på `tekst_id` for BEGREPSSETT og QUIZ, og unik `(tekst_id, nummer)` for AVSNITT. Kardinaliteten i ER-diagrammet er en skranke i migrasjonen, ikke en tegning.
> - **Konsistenskonvensjonen endres** fra «All skriving til en Tekst» til «All skriving til en Tekst eller til noe som er forankret i den».

---

## Funn 5 — «Markering» er udefinert: tetthetstaket regnes på ett sett og vises fra et annet

**Alvorlighet: høy. Leverer det gule teppet FR-7 er skrevet for å hindre.**

### De to enhetene

**Enhet A — kappingen i `generatorer/begrepssett.ts`.**
Story: «Begrepssettet kappes til tetthetsgrensene ved uttrekk.» Bygger implementerer FR-7s tre grenser. For «høyst 3 markeringer per 100 sammenhengende ord» teller den ett Faguttrykk som én markering, fordi det er settet den har — Begrepssettet er en liste over unike uttrykk med forklaring og kildeavsnitt, én rad per uttrykk. 2,8 per 100 ord. Bestått.

**Enhet B — `app/lesevisning/Markering.tsx`.**
Story: «Alle Faguttrykk i Begrepssettet markeres inline i den løpende teksten.» Bygger leser FR-9: **alle** Faguttrykk markeres, og Lesevisningen kutter ingenting på egen hånd fordi grensene alt er håndhevet ved uttrekk. Bygger søker hvert uttrykk i hvert avsnitt og markerer hvert treff — å markere bare første forekomst ville vært å kutte på egen hånd, som FR-9 forbyr, og ville gitt et umarkert «mitose» tre linjer under et markert.

### Hvordan begge følger spinen

AD-2 avslutter med at «tegnposisjoner for inline-markering av Faguttrykk er relative til sitt eget avsnitt og er en egen sak». Det er den setningen som gjør begge lesningene lovlige: spinen erklærer uttrykkelig at forekomstene ikke er dens sak, og gir dem dermed ingen eier. AD-11 garanterer at uttrykket forekommer ordrett, så enhet B *kan* finne forekomstene ved søk, og har ingen grunn til å begrense seg til én.

### Hvordan de kolliderer

Tetthetstaket i FR-7 er formulert i «markeringer», ikke i unike uttrykk — og FR-7 sier uttrykkelig hvorfor: «3 markeringer per 100 sammenhengende ord — det siste fordi et snitt over hele teksten kan skjule at ett avsnitt er fullstendig nedlesset». Grensen finnes for å beskytte mot *lokal tetthet*, som er en egenskap ved forekomstene og ikke ved settet.

Enhet A håndhever den på det lagrede settet: 2,8 per 100 ord, bestått, kappingen skjedd én gang som FR-7 krever. Enhet B rendrer den på forekomstene: et fagtungt avsnitt der «mitose», «kromosom» og «celledeling» hver står fire ganger, får 12 markeringer på 80 ord. Siden eleven ser er over fire ganger taket. Begge enheter har fulgt spinen, ingen har kuttet noe på egen hånd, og SM-C1 — motmetrikken som sier rett ut at flere markeringer ikke er bedre — er brutt av en grense som er beregnet på det ene settet og virker på det andre.

Følgeskaden treffer FR-8: presisjon måles på uttrekkssettet, altså på 14 rader, mens den tettheten eleven opplever kommer fra 50 forekomster. Tallet i rapporten beskriver ikke flaten.

### Ny AD

> **AD-16 — Forekomstsettet er en lagret del av Begrepssettet, og tetthet regnes på det**
>
> - **Binds:** AD-2, AD-11, FR-7, FR-8, FR-9, FR-16, SM-C1
> - **Prevents:** at tetthetstaket håndheves på unike uttrykk og rendres på forekomster, slik at siden blir tettere markert enn taket tillater
> - **Rule:** «markering» betyr én forekomst i Lesevisningen. Forekomstene finnes av én deterministisk funksjon `tekst/forekomster.ts#finnForekomster(avsnitt, uttrykk)` og lagres som rader med avsnittsnummer og tegnposisjon relativ til avsnittet. Kappingen i FR-7 regner *begge* tetthetsmålene mot dette settet, og Lesevisningen rendrer utelukkende fra det — den søker ikke i teksten selv. Faller et uttrykk ut i kappingen, faller alle dets forekomster ut. Øvekortsettet (FR-16) er fortsatt de unike uttrykkene, og avviksstesten i FR-16 sammenligner uttrykksnivået.
> - **Håndheves av:** en test som regner lokal tetthet på det lagrede forekomstsettet for Gullsettets seks Tekster og feiler over 3 per 100 sammenhengende ord, og en test som feiler dersom visningskoden inneholder et tekstsøk etter et Faguttrykk.

Dette overholder AD-2: Kildeavsnitt er fortsatt et avsnittsnummer og aldri et tegnspenn. Tegnposisjonene er forekomstenes, ikke Kildeavsnittets — AD-2s «egen sak» får en eier framfor å bli avvist.

---

## Funn 6 — Kappingen av Begrepssettet har to legitime eiere, og valget avgjør hva målingen betyr

**Alvorlighet: høy.**

### De to enhetene

**Enhet A — `generatorer/begrepssett.ts` kapper, og returnerer bare det kappede settet.**
Bygger leser AD-11: utdata som bryter «et verbatim-, kildeavsnitt- eller **formkrav**» forkastes framfor å lagres. Tetthetsgrensene er formkrav. AD-11 sier at valideringen skjer «før lagring», altså før kalleren får noe å lagre. FR-7 sier at kappingen skjer «ved uttrekk». Generatoren har hele teksten og kan telle løpende ord. Kappingen hører der.

**Enhet B — kallstedet kapper, generatoren returnerer alt den fant.**
Bygger leser AD-10: «Kalleren lagrer». Kappingen er det siste steget før lagring, og tetthetsgrensene er en egenskap ved forholdet mellom settet og den lagrede avsnittslisten, ikke ved modellsvaret. Dessuten, og det er det tunge argumentet: FR-8 måler gjenkalling mot Gullsettet. En generator som kapper til 4 prosent før den returnerer, gjør gjenkalling til en måling av kappingen framfor av uttrekket, og utvikleren kan ikke lenger se om et uttrykk manglet fordi modellen ikke fant det eller fordi taket tok det. Harnessen må se det ukappede settet.

### Hvordan begge følger spinen

Spinen tildeler ikke kappingen. AD-11 legger validering før lagring uten å si hvem som kapper; AD-10 legger lagring hos kalleren uten å si hva kalleren får. Begge lesninger er hele.

### Hvordan de kolliderer

To utfall, begge dårlige. Kapper begge, kappes settet to ganger — den andre kappingen regner prosent mot samme ordtelling og fjerner ingenting, men den regner *unike per 1 000 ord* mot et alt redusert sett og kan fjerne mer; utfallet er stille tapt dekning som ser ut som dårlig gjenkalling. Kapper ingen, er FR-7s harde tak aldri håndhevet, og FR-9s begrunnelse — «grensene er allerede håndhevet ved uttrekk, så Lesevisningen kutter ingenting på egen hånd» — er en påstand om noe som ikke skjedde.

Den viktigste kollisjonen er likevel målemessig. Den ene rekkefølgen gir en gjenkalling som er tak-begrenset og gjelder det eleven ser; den andre gir en gjenkalling som gjelder modellen og ikke produktet. Spinens eget paradigmeargument — at det som måles skal være det brukeren møter — velger ikke mellom dem, og de to byggerne vil velge hver sin.

AD-11 gjør det verre med ett ord. «Utdata som bryter et formkrav **forkastes** framfor å lagres» er en riktig regel for et verbatim-brudd, der ett element skal bort. Anvendt på et tetthetsbrudd, som er en egenskap ved settet, sier den at hele Begrepssettet skal forkastes — mens FR-7 sier at «lavest rangerte uttrykk faller ut først». To ulike operasjoner under ett ord.

### Strammere AD-11, pluss én tildeling

> **AD-11, strammet — element forkastes, sett trimmes**
>
> - **Rule, tillegg:** AD-11 skiller to operasjoner. **Elementkrav** — verbatim, sirkularitet, gyldig kildeavsnitt, formkrav på det enkelte elementet — fører til at *elementet* forkastes. **Settkrav** — tetthetsgrensene i FR-7, antall spørsmål i FR-13, taket i FR-27 — fører til at *settet trimmes* etter viktighetsrangering, aldri til at settet forkastes. Ingen settkravsbrudd kan gjøre et Begrepssett tomt når det finnes elementer som består elementkravene.

> **AD-17 — Kappingen eies av generatorlaget og leveres synlig**
>
> - **Binds:** AD-10, AD-11, FR-7, FR-8, FR-9, FR-16
> - **Prevents:** at Begrepssettet kappes to ganger eller ingen, og at FR-8s gjenkalling måles på et annet sett enn det eleven møter
> - **Rule:** kappingen er en ren funksjon i generatorlaget. Generatoren returnerer `{ kandidater, kappet }` — hele kandidatsettet etter elementvalidering, og det kappede settet. Kalleren lagrer **bare** `kappet`, og har ingen kappelogikk. Harnessen rapporterer gjenkalling og presisjon for `kappet` som den bindende målingen, fordi det er det eleven møter, og for `kandidater` som beskrivelse — slik at tapt dekning kan tilskrives modellen eller taket, som er nettopp det åpne spørsmål 9 i PRD §11 skal avgjøres av.

---

## Funn 7 — AD-9 har to tilstander der prosessen har tre, og FR-5s vern kan bli tomt uten at noen AD brytes

**Alvorlighet: middels-høy. Rammer demoløypens steg 3, som er en primær suksessmetrikk.**

### De to enhetene

**Enhet A — `app/aktivering/page.tsx`.**
Story FR-5: «Aktiveringssiden viser overskriftene i dokumentrekkefølge, uten brødtekst — brødteksten er ikke tilgjengelig, verken synlig eller i sidens kildekode.» Bygger leser AD-9: Teksten er Utkast her. Den henter overskriftene, og bare dem, fra `data/`.

**Enhet B — `app/gjennomsyn/page.tsx`, fase 3b.**
Story FR-3: «I fase 3b kan eleven redigere brødteksten fritt.» Bygger leser AD-9 og tilstandsdiagrammet, som har én selvløkke: `Utkast --> Utkast : retting i fase 3a og 3b`. Fase 3a og 3b er samme tilstand med samme frihetsgrader. Bygger lager derfor én gjennomsynsside der eleven kan rette både overskrifter og brødtekst, og en tilbakelenke til fase 3a. Alt er lovlig i Utkast.

### Hvordan begge følger spinen

AD-9 kjenner to tilstander. Diagrammet sier at retting i 3a og 3b er samme overgang. Ingenting i AD-9 gjør overskriftene uforanderlige etter Aktiveringen, og ingenting gjør Aktiveringen til et punkt man ikke kan gå tilbake fra.

### Hvordan de kolliderer

FR-3s begrunnelse for todelingen er at «et gjennomsyn av hele teksten rett i forveien hadde alt vist eleven nettopp det FR-5 skjuler. Vernet var illusorisk.» Enhet B gjeninnfører illusjonen fra motsatt side: eleven som går tilbake fra 3b til 3a og videre til Aktivering, har sett brødteksten før hun skriver forkunnskapene sine. Forkunnskapssvaret i FR-6 er da et sammendrag, ikke en gjetning, og hele det pedagogiske argumentet i PRD §1 om at aktivering skjer før lesing er borte. Ingen AD er brutt. AD-9 har ingen tilstand for «Aktivering er passert».

Den andre halvparten: kan overskriftene endres etter Aktivering, bygger Aktiveringen ikke lenger på overskrifter eleven har godkjent, som FR-5 uttrykkelig krever, og forkunnskapssvaret svarer på en annen overskriftsliste enn den som til slutt låses og som FR-13s dekningskrav måles mot.

Og FR-5s harde krav — ikke tilgjengelig «i sidens kildekode» — er hos enhet A en egenskap ved én komponents spørring. Det er den samme feilformen AD-8 avviser for autorisasjon: et vern som ligger på veien inn og ikke i laget som leverer dataene. En annen bygger som legger en felles `hentTekst(tekstId)` i `data/` og bruker den på alle sider, har brutt FR-5 uten å ha rørt aktiveringssiden.

### Ny AD

> **AD-18 — Tre tilstander før låsen, og brødteksten er utilgjengelig i den første**
>
> - **Binds:** AD-2, AD-9, FR-3, FR-5, FR-6, FR-13
> - **Prevents:** at eleven ser brødteksten før Aktiveringen, at overskriftene endres etter at forkunnskapssvaret er skrevet, og at FR-5s kildekodekrav hviler på hvilken spørring én side tilfeldigvis bruker
> - **Rule:** en Tekst har tilstandene `UtkastOverskrifter` → `Aktivert` → `UtkastBrødtekst` → `Låst`. Overgangene er enveis; det finnes ingen vei tilbake fra `Aktivert`. I `UtkastOverskrifter` finnes **ingen** datatilgangsfunksjon som returnerer brødtekst eller råtekst for en Tekst — kravet er en egenskap ved `data/`, håndhevet som AD-8 håndhever eierskap, og testet ved at et kall avvises, ikke bare ved at en side ikke viser noe. Overskriftene er uforanderlige fra og med `Aktivert`. Låsen setter `Låst` og oppretter avsnittsradene i samme transaksjon.
> - **Følge for AD-2:** overskrifter lagres som avsnittsrader med en typediskriminator, slik at FR-13s dekningskrav og FR-15s tilbakevisning kan relatere et Kildeavsnitt til en overskriftsdel. Fase 3a-visningen er en filtrert spørring mot samme tabell, ikke et eget felt.

---

## En defekt av annen art: spinen og dens egen kilde er uenige om hva et Kildeavsnitt er

Dette er ikke et par av enheter, men det vil produsere ett.

Spinen navngir `addendum-lesevenn.md` i `sources`. Addendumet, under «Kildeavsnitt og uforanderlighet», sier: «Kildeavsnitt lagres som **tegnindeks** inn i `redigert_tekst`, ikke som kopiert tekst». AD-2 sier: «Kildeavsnitt er en referanse til ett slikt avsnitt, **aldri et tegnspenn**.»

De er direkte motsatte, og begge dokumentene er bindende lesning for byggeren. Det er tilstrekkelig til at én story blir bygget mot tegnindekser og en annen mot avsnittsnumre, og de to er ikke oversettbare til hverandre uten den avsnittsdelingsregelen funn 1 slår fast at ikke finnes. Addendumets datamodellskisse har heller ingen `avsnitt`-tabell — den går `tekst` → `begrep` direkte, uten det leddet ER-diagrammet i spinen gjør bærende.

**Handling:** addendumets avsnitt om Kildeavsnitt rettes til å vise til AD-2, eller strykes med en merknad om at det er overstyrt. Et arkitekturdokument som navngir en kilde som motsier det, har to arkitekturer.

---

## Rangering

| # | Funn | Alvorlighet | Frist |
|---|---|---|---|
| 1 | Avsnittsdeling uten normativ regel; harnessen deler selv | Blokkerende | Før annotering i M0 |
| 2 | Generatorens avsnittsnumre er en skjult avhengighet (AD-10 «Inn: tekst») | Blokkerende | Før første generator |
| 3 | «Gjeldende versjon» utledet fra filsystemet; AD-6 uten håndhever | Blokkerende | Før andre promptversjon |
| 4 | AD-9 dekker ikke skriving til Tekstens barn; 0..1-kardinalitet er en tegning | Blokkerende | Før første lagrede Begrepssett |
| 5 | «Markering» udefinert; tetthet regnes på sett, rendres på forekomster | Høy | M0, sammen med Lesevisningen |
| 6 | Kappingen har to eiere; AD-11 blander element og sett | Høy | Før FR-8 måles |
| 7 | Utkast er én tilstand der prosessen har tre; FR-5s vern er en sidebetingelse | Middels-høy | Før demoløypen kjøres |
| — | Spinen mot addendumet om Kildeavsnitt-representasjon | Redaksjonell, men produserer funn 2 | Straks |

Sju nye eller endrede AD-er: AD-12, AD-13 (med omskriving av AD-10s inndatasetning), AD-14, AD-15, AD-16, AD-17, AD-18, samt én stramming av AD-11. Fire av dem handler om samme manglende entitet: **Avsnittet som noe systemet eier, framfor noe hver bygger regner ut på nytt.** Skrives bare én AD, er det AD-12.
