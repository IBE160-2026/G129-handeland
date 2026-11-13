# Valideringsrapport — LeseBuddy (Lesevenn)

- **DESIGN.md:** `DESIGN.md`
- **EXPERIENCE.md:** `EXPERIENCE.md`
- **Kjørt:** 2026-11-13T00:17:15.276Z

## Samlet vurdering

Paret er et stramt og godt kildeforankret kontrakt for de flatene som er tegnet: arbeidsbordet, viften, tenkeindikatoren og landingssiden. Tokenene er hele, og kontrastpåstandene stemmer når de regnes ut på nytt. Paret er likevel ikke klart for story-dev på hele omfanget. Hilsenen «Hei, Jonas» krever et navn som FR-35 forbyr å samle inn (kritisk). Samlingen (FR-49) og bruksgrensene i §6.4 mangler flyt, tilstander og komponenter. Tenkeindikatorens avslutning er beskrevet på to måter som utelukker hverandre, og regelen for «Sist brukt», som både utvalget av bunker og hovedbunken hviler på, står bare i memloggen. Samlingshullet går igjen i kategori 1, 3 og 4, og det er det samme hullet.

Fargene holder det de lover, og kontrakten tar tilgjengelighet på alvor: `aria-live`, `inert`, Esc, redusert bevegelse og at farge aldri skal stå alene. Det er likevel ikke klart til bygging. Det er seks høye funn, de fleste der kontrakten er tvetydig og mocken viser feil løsning:

- fokusmarkeringen
- viftekortene som er usynlige, men kan få fokus
- en lenke inne i bunke-knappen
- rulleeffekt A, der forklaringene bare finnes ved rulling
- faste pikselmål på arbeidsbordet
- tenkeindikatorens kunngjøringer og fokus

Ingen funn er kritiske, men de høye bør rettes i kontrakten før bygging. Ellers ender de rett i koden.

## Vurdering per kategori

- 1. Flow coverage — thin
- 2. Token completeness — adequate
- 3. Component coverage — adequate
- 4. State coverage — thin
- 5. Visual reference coverage — adequate
- 6. Bloat & overspecification — strong
- 7. Inheritance discipline — thin
- 8. Shape fit — strong

## Funn etter alvorlighet

### Kritisk (1)

**[Inheritance discipline]** «Hei, Jonas» krever elevens navn, og navnet finnes ikke. Det står i EXPERIENCE.md Voice and Tone (linje 62) og Flyt 2, steg 1 (linje 153), i DESIGN.md Typography (linje 206) og i arbeidsbord-1 sammen med avataren «J». FR-35 og §6.2 forbyr å samle inn navn, og data/skjema.ts fyller `name` med en tom streng («eleven blir aldri spurt om navn»). En utvikler som følger spinen, må enten bryte et personvernkrav eller finne på noe selv på hovedflaten.
Retting: Bruk en hilsen uten navn («Hei!» eller «Velkommen tilbake») og et kontoikon uten initial, og behold «Du holdt på med Celledeling i går.»

### Høy (14)

**[Flow coverage]** Samlingen (FR-49) har ingen Key Flow. Det er en ny flate med søk, sortering, åpning og sletting med bekreftelse (FR-37), men den finnes bare som én rad i IA-tabellen (EXPERIENCE.md, Information Architecture, raden «Samlingen»). IA sier at flaten «bygges etter tabellene i dette dokumentet» (linje 49), men ingen av tabellene sier noe om Samlingen.
Retting: Legg til Flyt 4. For eksempel: Jonas leter etter teksten fra september før prøven, søker på tittel, åpner den og sletter en gammel tekst. Klimaks og feilsti for søk uten treff skal være med.

**[Component coverage]** Samlingens komponenter har verken visuell spesifikasjon eller atferd. Det gjelder raden for hver tekst (hva den viser: tittel, dato, status?), søkefeltet, sorteringsvalget og slettehandlingen med bekreftelse som sier hva som forsvinner (FR-37). FR-49 krever alle fire.
Retting: Legg til rader i DESIGN.md › Components og EXPERIENCE.md › Component Patterns, eller si eksplisitt at Samlingen gjenbruker dagens liste på startsiden uendret, med en henvisning til komponenten i koden.

**[Component coverage]** Topplinjen og menyen er ikke spesifisert, og på telefon finnes ingen vei til Samlingen. EXPERIENCE viser til «menyen», «topplinjen» og «kontoikonet» (IA) og sier at «Menyen i topplinjen skjules» under 760 px (Responsive, linje 127). Ingenting kommer i stedet. FR-49 krever at Samlingen «nås fra menyen», og PRD §5 regner telefon som en reell flate. Lenken «Se alle N» vises bare når N > 5, og kontoen må også kunne nås.
Retting: Spesifiser topplinjen som komponent (innhold på PC og telefon) og hva som erstatter menyen på telefon, for eksempel en menyknapp eller en lenke til Samlingen på bordet alltid når N ≥ 1.

**[State coverage]** Bruksgrensene i PRD §6.4 har ingen tilstand: 5 nye Tekster per døgn, 5 Fagsamtaler per døgn og et tak på 30 kroner per døgn for hele appen. PRD-en krever at appen sier hvilken grense som er nådd og når den åpner igjen (neste døgn, norsk tid), og at lagret innhold fortsatt kan åpnes. Tre steder mangler regler: «+ Ny tekst» og «Legg en ny tekst på bordet» når tekstgrensen er nådd, Fagsamtale-kortet og «Neste: Fagsamtale» når samtalegrensen er nådd, og tenkeindikatoren når appens tak slår inn midt i løypen, for eksempel når quizen skal lages.
Retting: Legg til tre rader i State Patterns med ordlyd, og si om handlingen vises deaktivert eller vises og forklarer ved trykk.

**[State coverage]** Samlingen har ingen tilstander. Disse mangler: tom samling (menyen viser den også for en ny elev), søk uten treff, standard sortering, bekreftelse før sletting (FR-37: «navngir hva som forsvinner»), feil ved sletting og mange tekster (lasting eller paginering).
Retting: Legg til en blokk med rader for Samlingen.

**[State coverage]** Tenkeindikatorens avslutning er beskrevet på to måter som utelukker hverandre. Component Patterns sier at «avslutningen (B-en) spilles før innholdet vises, men den blokkerer aldri» (EXPERIENCE.md, linje 77). State Patterns sier at «Innholdet vises med en gang» (linje 96). Avslutningen tar 4,3 s og gjelder hvert kall til språkmodellen, så valget bestemmer hvordan alle ventetilstander bygges.
Retting: Bestem én regel, for eksempel at innholdet vises straks og avslutningen spilles ferdig i indikatorens plass, eller at avslutningen kortes ned til høyst X ms før innholdet vises. Skriv den samme regelen begge steder.

**[State coverage]** «Sist brukt» og «nyest aktivitet» er ikke definert i spinen. Memloggen (linje 77–78) sier at datamodellen ikke har noen sist brukt-tid, og at den utledes av quizforsøk, samtalerunde, minnevers og når teksten ble opprettet. Det betyr at øvekortmerking og bare å lese teksten ikke flytter bunken. Regelen bestemmer hvilke fem bunker som ligger på bordet og hvilken som blir hovedbunke (FR-48). Arkitekturen trenger den for spørringen, og eleven merker den direkte.
Retting: Skriv regelen i State Patterns, eller marker den som `[MERKNAD TIL ARKITEKTUR]` hvis øvekortmerking eller lesing skal telle.

**[Inheritance discipline]** Skriftene dekker trolig ikke morsmålene. UJ-2 krever «skriftsnitt som dekker begge» (kyrillisk og latinsk), og FR-25 krever arabisk fra høyre til venstre. Så vidt jeg vet dekker Atkinson Hyperlegible og Instrument Serif bare latinsk skrift, og spinen oppgir ingen reserveskrift. Den nye identiteten kan dermed ødelegge UJ-2 i stillhet.
Retting: Bekreft hvilke skrifttegn skriftene dekker, og legg en reservestabel for kyrillisk og arabisk inn i `typography` (for eksempel Noto Sans og Noto Naskh Arabic), med regelen om at den brukes på morsmålsinnhold.

**[Tilgjengelighet]** Fokusmarkeringen er selvmotsigende, og blir usynlig på primærknapper. EXPERIENCE.md sier «dagens gulv i `globals.css` beholdes» med `{colors.primary}`. Gulvet i `app/globals.css` er derimot `outline: 2px solid currentColor`. På en primærknapp er currentColor hvit (`on-primary`). Det gir en hvit ring på rosahvit bakgrunn, om lag 1,04:1. Viftekortene i `arbeidsbord-1.html` (linje 70) setter i tillegg `outline:none`, og fokus vises bare som en 1 px kant pluss skalering. I Windows kontrastmodus forsvinner også den kantfargen. (EXPERIENCE.md Accessibility Floor, `globals.css` linje 33–35, arbeidsbord-1.html linje 70, WCAG 2.4.7, 1.4.11, 2.4.13.)
Retting: Skriv én fokusregel i DESIGN.md: `outline: 3px solid {colors.primary}` med `outline-offset: 2px` på alle flater. På fylte primærknapper skal det i tillegg være en ytre ring i `background`, så ringen har minst 3:1 mot både knappen og flaten. Erstatt currentColor i gulvet. Forby `outline:none` uten en like sterk erstatning. Gi bevisst `outline-color: Highlight` under `forced-colors`.

**[Tilgjengelighet]** Viftekortene kan få fokus selv når viften er lukket, og mocken bruker ikke `inert`. Kortene er alltid i DOM-en med `opacity:0; pointer-events:none`. Tab går derfor gjennom fem usynlige lenker («Teksten», «Quiz» …) på hvert besøk, uten at det er sagt hvilken tekst de gjelder. Når viften er åpen, tones resten av bordet bare ned med `pointer-events:none`. Det er fortsatt tabbart, og har 1,3–1,7:1 kontrast. Kontrakten sier «disclosure» og «inert», men ikke at innholdet skal være skjult når viften er lukket. (arbeidsbord-1.html linje 63, 68, 160–166, EXPERIENCE.md Viften og Accessibility Floor, WCAG 2.4.3, 2.4.7, 1.4.3, 4.1.2.)
Retting: Skriv i kontrakten at viften har `hidden` (eller `display:none`) når den er lukket. Det animerte utgangspunktet legges på etter at `hidden` er fjernet. Resten av bordet får `inert`, ikke bare `pointer-events`. Lag en akseptansetest: Tab fra «+ Ny tekst» skal aldri treffe et usynlig element.

**[Tilgjengelighet]** Hovedbunken har en klikkbar lenke inne i en knapp, og bunkene har overskrifter inne i knapper. EXPERIENCE.md sier «Bunken er en knapp med `aria-expanded`» og «Trykk på neste steg går rett dit, og trykk ellers på bunken vifter den ut». Det kan bare bygges som nestet interaktivt innhold, og det er ugyldig. Skjermlesere og stemmestyring mister den indre lenken eller leser alt som én knapp. Mocken legger i tillegg `<h2>`/`<h3>` inne i `<button>`. Rollen til overskriftene forsvinner da, så tekstene kan ikke nås med overskriftsnavigasjon. Knappens navn blir hele kortet: «Sist brukt Celledeling Naturfag · lagt inn 11. nov. Neste: Fagsamtale høyrepil». (EXPERIENCE.md Bunke og Hovedbunke, arbeidsbord-1.html linje 140–155, WCAG 4.1.2, 1.3.1, 2.5.3.)
Retting: Gjør hver bunke til en `<li>` i en liste. Den har tittelen som overskrift, en egen knapp «Vis aktiviteter for Celledeling» (`aria-expanded`, `aria-controls`) og, på hovedbunken, en egen lenke «Neste: Fagsamtale». Den visuelle bunken kan fortsatt se ut som én flate, med en utvidet trykkflate på knappen (pseudo-element) og lenken lagt over. Skriv dette mønsteret inn i kontrakten.

**[Tilgjengelighet]** I rulleeffekt A finnes forklaringene bare i JavaScript og bare når man ruller, i strid med FR-47. Forklaringene på de fire fagordene står i en JS-tabell og settes inn i `#forkl` når siden rulles. Det gjelder også med `prefers-reduced-motion`, for koden for A sjekker ikke `redusert`. Uten JS, med redusert bevegelse eller med skjermleserens lesemarkør (som ikke ruller siden pålitelig) står det bare «Rull videre». Det er en instruks som bygger på bevegelse. Når siden rulles, leser `aria-live` opp hver forklaring midt i det brukeren holder på med. Seksjonen er 240vh med en klistret flate. Ved stor tekst (Chrome på Android, eller 400 % zoom med `top: calc(50vh - 170px)` som blir negativ) havner forklaringspanelet under synsfeltet mens fagordene skifter. Brukeren ser da forklaringen først når den siste er aktiv. EXPERIENCE.md sier «Alt innholdet finnes også uten effektene», men ikke hvordan det skal se ut for A. (landingsside-1.html linje 58–69, 169, 235–268, FR-47, WCAG 1.3.1, 1.3.2, 1.4.10, 4.1.3, 2.3.3.)
Retting: Kontrakten må beskrive den statiske versjonen. Den skal være HTML fra serveren, med alle fire fagord markert og forklaringene som en liste (`<dl>`) under eksempelteksten. Effekten legges oppå når JS kjører og bevegelse er tillatt. Fjern `aria-live` fra demoen, og legg forklaringene i DOM-en i lesefølge. Slå av den klistrede visningen når flaten er høyere enn synsfeltet (eller under en gitt `min-height`-mediespørring).

**[Tilgjengelighet]** Arbeidsbordet er bygd med faste pikselmål og tåler ikke stor tekst, tekstavstand eller lange titler. På PC har bordet `height:620px; overflow:hidden`. Bunkene er faste 180 × 126 og 300 × 210, og viften er en ellipse med faste radier (295 × 228 px) og kort som er 168 px brede. Med nettleserens tekstforstørrelse på 200 % (1.4.4) eller tekstavstand etter 1.4.12 blir kortene høyere. Da dekker de bunken (stikk i strid med «så de aldri dekker bunken») og klippes av bordkanten. Ekte titler som «Kapittel 4: Fotosyntese og celleånding» blir tre til fire linjer i en bunke med fast høyde, og kontrakten sier ikke hva som skal skje med lange titler. På telefon er kortene plassert ±82 px fra midten med fast bredde 140 px. Ved 320 px bredde (400 % zoom) klippes ytterkortene om lag 12 px på hver side. Like over brytepunktet (om lag 761–800 px) når ytterkortene i ellipsen også ut over kanten av bordet. (arbeidsbord-1.html linje 35–37, 51–58, 68, 98, 198–202, DESIGN.md components.stack-*, activity-card, WCAG 1.4.4, 1.4.10, 1.4.12.)
Retting: Skriv i kontrakten at bord, bunker og kort har minimumshøyde, ikke fast høyde, og at plasseringen regnes ut fra de målte størrelsene på kortene. Er det ikke plass, faller oppsettet tilbake til et rutenett eller en liste (gjerne med `@container`). Titler brytes og vises i sin helhet, eller forkortes visuelt med full tittel i det tilgjengelige navnet og på kortet i viften. `overflow:hidden` på bordet er ikke lov. Test med 200 % tekst, med bokmerket for tekstavstand og ved 320 px.

**[Tilgjengelighet]** Tenkeindikatoren: kunngjøringen, fokus og feiltilstanden er ikke spesifisert godt nok:

- En `aria-live`-region som settes inn i DOM-en sammen med teksten, blir ofte ikke lest opp. Skjermleserbrukeren sitter da i 10–20 sekunder uten å vite at noe skjer.
- Kontrakten motsier seg selv. Component Patterns sier at avslutningen «spilles … før innholdet vises». State Patterns sier at «Innholdet vises med en gang».
- Det står ikke hvor fokus går når quizen kommer.
- Feilmeldingen har ingen rolle. Uten `role="alert"` eller fokusflytting hører skjermleseren ikke at kallet feilet.

(EXPERIENCE.md Tenkeindikator og State Patterns «Buddy tenker», «Svaret er klart», «KI-kallet feiler», runde-8-ordmerke.html linje 64, 90–92, WCAG 4.1.3, 2.4.3, 3.3.1.)
Retting: - Live-regionen skal ligge tom i DOM-en før ventingen starter, og teksten skrives inn etterpå.
- Bestem at innholdet vises med en gang, og at avslutningen spilles ved siden av.
- Når innholdet er klart, flyttes fokus til overskriften på det nye innholdet (`tabindex="-1"`).
- Feilmeldingen får `role="alert"`, og fokus flyttes til «Prøv igjen».
- Legg til en tilstand for lang venting: etter om lag 30 sekunder står det «Dette tar lenger tid enn vanlig» og «Avbryt».

### Middels (29)

**[Flow coverage]** Det finnes ingen flyt for en ny elev: landingssiden → «Registrer deg» med kode → første innlogging → tomt bord → første tekst. Tom-tilstanden og registreringen står bare i tabeller (State Patterns, «Ny elev, ingen tekster»), og Flyt 1 er en lærer som ikke er bruker (PRD §2.2).
Retting: Lag en kort flyt for eleven, eller utvid Flyt 3 til å starte fra et tomt bord.

**[Flow coverage]** Flyt 3 mangler feilsti (EXPERIENCE.md, linje 161–166). Det er her innlesingsfeilene og den nye dagsgrensen på 5 Tekster (§6.4) treffer.
Retting: Legg til minst én feilsti, for eksempel at grensen er nådd: «Du har lagt inn 5 tekster i dag. Du kan legge inn flere fra i morgen.»

**[Flow coverage]** Flyt 3, steg 2, beskriver FR-3 feil: «Innlimt tekst hopper over gjennomsynet av hele teksten …, så han går fra overskriftskontrollen rett til aktiveringen» (linje 164). Overgangen fra fase 3a til Aktivering gjelder for alle innlesingsveier. Det som hoppes over for innlimt tekst, er fase 3b mellom Aktivering og Lesevisning. En utvikler som leser setningen bokstavelig, kan plassere hoppet feil.
Retting: «Etter overskriftskontrollen skriver han forkunnskapene sine, og fordi teksten er limt inn, går han rett til lesingen (FR-3, fase 3b hoppes over).»

**[Flow coverage]** Foundation lover «innspillene fra telefontesten» (linje 26), men bare to av dem er spesifisert: det større forklaringspanelet og brilleknappen. Disse mangler: større «ekstra stor» og mer avsnittsavstand ved «romslig» (FR-12), norsk som synlig standardvalg og språkbytte på samme side i morsmålsvalget, innrykk i ordforklaringene, færre stablede bokser ved start av Fagsamtale og piler og knapper på øvekortene (telefontest, «Til designfasen»).
Retting: Spesifiser dem kort, eller si eksplisitt at de ligger utenfor dette paret og hvor de ligger.

**[Token completeness]** Det finnes ingen tokens for skygge og dybde. Elevation & Depth beskriver «myk skygge», «kraftigere skygge», nedtoning til 18 % og uskarphet på 1,5 px (DESIGN.md, linje 225–228), men skyggeverdiene står bare i arbeidsbord-1.html (for eksempel `0 10px 26px -14px rgba(0,0,0,.35)` og `0 22px 40px -18px …`). Mørk modus har ingen egne verdier.
Retting: Legg til `elevation` eller `shadow` (for eksempel sheet, raised, floating) med mørk variant, og vis til dem fra Bunke, Aktivitetskort, Brilleknapp og Følge-Buddy.

**[Token completeness]** Det finnes ingen tokens for bevegelse. Bare tenkeindikatoren har tider, og de står i prosa (1,6 s og 4,3 s). Viftens varighet og easing (`.5s cubic-bezier(.3,1.35,.5,1)` i mocken), rulleeffektene og Følge-Buddy er ikke spesifisert.
Retting: Legg til en liten `motion`-gruppe og vis til den fra Interaction Primitives.

**[Token completeness]** Framdriftsstrekene på bunken: «Påbegynte er fiolette, resten har kantfarge» (DESIGN.md, linje 248). Kantfargen har 1,28:1 mot surface, så strekene for aktiviteter som ikke er påbegynt, er nesten usynlige, og framdriften vises med farge alene. Det bryter DESIGN.md sin egen regel («Vis status med tekst») og WCAG 1.4.11. Hva «påbegynt» betyr per aktivitet, er heller ikke definert.
Retting: Gi strekene minst 3:1 (for eksempel `text-muted`) og et tekstalternativ («2 av 5 aktiviteter påbegynt»), og definer «påbegynt» i State Patterns.

**[Component coverage]** DESIGN.md › Components oppgir ikke hvordan tilstandene ser ut, enda formatet krever det. Disse mangler: hover, fokus, trykket og deaktivert for knappene, åpen og lukket bunke, *låst* aktivitetskort (ikon, nedtoning, hvor forklaringen står) og fokus på et fagord. «Låst» er en atferd FR-48 sier skal kunne testes, men utseendet er ikke bestemt.
Retting: Gi hver interaktive komponent en kort linje om tilstandene.

**[State coverage]** Reglene for neste steg har hull (linje 92). Disse tilfellene er ikke dekket: Fagsamtale påbegynt, men ikke avsluttet (bør det bli «Fortsett: Fagsamtale, runde 3 av 6»?), Fagsamtale gjort uten quiz (FR-18 gjør den til et alternativ, men regelen gir da «Neste: Ta quizen»), hva «alt gjort» betyr (teller Minnevers og Øvekort med?), og samtalegrensen nådd. Teksten-kortets «tilstanden i klartekst» har heller ingen oversettelse fra `innlest`, `aktivert` og `laast` til ordlyd. Flyt 2 viser «Klar til lesing», men ingen regel sier det.
Retting: Gjør regelen til en tabell der hver kombinasjon gir én ordlyd, og legg til en tabell for tilstand → ordlyd.

**[State coverage]** Tomt Begrepssett er ikke dekket. FR-16 sier at Øvekort ikke tilbys når Begrepssettet er tomt, og at grunnen skal oppgis. Øvekort-kortet («9 av 14 kan du»), «N fagord» på Teksten-kortet og Minnevers har ingen tilstand for dette.
Retting: Legg til en rad, for eksempel «Fant ingen fagord i denne teksten, så det er ingen kort å øve på».

**[State coverage]** Arbeidsbordet har ingen tilstand for lasting eller for at dataene ikke kan hentes. PRD §5 krever at ingen feil er en blindvei. Hvis økten løper ut, viser `/` landingssiden uten forklaring.
Retting: Legg til rader for lasting (skjelettbunker eller tegnet på serveren), feil ved henting med «Prøv igjen», og utløpt økt.

**[Visual reference coverage]** Mockene motsier spinene på tre punkter. (a) Begge mockene har en «Mørk»-bryter i topplinjen, mens EXPERIENCE sier at mørk modus følger systeminnstillingen (linje 99). DESIGN nevner også «modusbryteren» (se 7). (b) arbeidsbord-1 har Buddy med snakkebobla «Klar for en fagsamtale om Celledeling?», mens spinen bare lar Buddy snakke på landingssiden og i tom-tilstanden. (c) Bunken viser «Naturfag · lagt inn 11. nov.», men datamodellen har ikke noe fag, og DESIGN sier bare «tittel, dato». Regelen om at spinen gjelder, dekker dette formelt, men (a) er også en konflikt inne i spinen.
Retting: Bestem om det skal være en bryter. Spesifiser enten Buddy på bordet eller fjern ham fra mocken, og bestem hvilken dato bunken viser (lagt inn eller sist brukt).

**[Inheritance discipline]** Kjerneløype er brukt i strid med PRD §3. Foundation sier at «Kjerneløypen er uendret …: innlesing, aktivering, lesing, quiz, øvekort, fagsamtale og minnevers» (EXPERIENCE.md, linje 26). PRD §3 definerer Kjerneløype som Aktivering → Lesevisning → Quiz, der Fagsamtale, Øvekort og Minnevers henger på løypen uten å være ledd i den, og innlesing er heller ikke et ledd. «Lesing» står for Lesevisning.
Retting: «Kjerneløypen (Aktivering → Lesevisning → Quiz) og det som henger på den (Øvekort, Fagsamtale, Minnevers) er uendret …»

**[Inheritance discipline]** Noen markører er utdaterte. `[MERKNAD TIL PRD]` i «KI-kallet feiler» (linje 97) og «PRD-oppfølging» i Åpne punkter (linje 172) ber om noe PRD-en allerede har fått 13.11: UJ-1 følger FR-3, og KI-feil er krav i §5, FR-7, FR-13, FR-19 og FR-20. Spinen mangler samtidig PRD-regelene om ett automatisk nytt forsøk før feilmeldingen, at runden ikke telles (FR-19), og at vurderingen beholdes når oppfølgingen feiler (FR-20).
Retting: Fjern markørene, vis til FR-ene, og skriv at tenkeindikatoren går videre under det nye forsøket.

**[Inheritance discipline]** Mørk modus er uavklart. DESIGN.md Shapes sier at `{rounded.full}` brukes på «modusbryteren» (linje 232). EXPERIENCE sier at modusen «Følger systeminnstillingen» (linje 99), og begge mockene har en bryter. Memloggen fjerner bare palettbryteren (linje 80). En utvikler vet ikke om det skal bygges en bryter.
Retting: Bestem én løsning. Hvis det blir en bryter, trengs komponenten, plasseringen og hvor valget lagres.

**[Inheritance discipline]** «"For lærere" skjules på landingssiden» under 760 px (EXPERIENCE.md, linje 127) kan leses som at hele lærerdelen skjules. FR-47 krever «en egen del for lærere».
Retting: «Lenken "For lærere" i topplinjen skjules, men seksjonen står.»

**[Inheritance discipline]** Kuttrekkefølgen i PRD §9.3 finnes ikke i spinen. Rekkefølgen er: rulleeffektene, så viften (bunkene blir lenker), så arbeidsbordet (Samlingen blir startsiden). Spinen sier ikke hva en bunke lenker til uten viften. Spørsmålet henger sammen med merknaden om `/tekst/[id]/oppgaver` (linje 47).
Retting: Skriv én linje om reserveløsningen per kuttsteg, for eksempel at bunken lenker til oppgavesiden.

**[Tilgjengelighet]** Markeringstusjen feiler i mørk modus. I lys modus har teksten 5,49:1 mot den rosa streken. I mørk modus står lys tekst (`text-dark`) på `accent-dark`, med 2,13:1. Det er under 3:1 for stor tekst, og streken dekker nedre tredjedel av hver bokstav i heroens «leser». DESIGN.md sier at aksenten bare skal brukes «som flate med mørk tekst oppå», men tusjen er nettopp aksent under lys tekst. (DESIGN.md components.highlighter, landingsside-1.html linje 35, WCAG 1.4.3.)
Retting: Gi tusjen en egen mørk token med minst 3:1 mot `text-dark` (for eksempel en mørk rosa i området `#7A1F4D`), eller gi ordet `on-accent` i mørk modus. Legg paret inn i kontrasttabellen i DESIGN.md.

**[Tilgjengelighet]** Det tilgjengelige navnet på ordmerket blir «lese uddy». Lenken består av `<span>lese</span>`, en SVG med `aria-hidden` og `<span>uddy</span>`. Skjermleseren sier «lese uddy, lenke» (eller «leseuddy»). Stemmestyringsbrukere som sier «klikk LeseBuddy», treffer ikke. EXPERIENCE.md sier «Merket er bilde med alt-teksten LeseBuddy». Det åpner for at noen legger `alt` på SVG-en og beholder spennene, og da blir navnet «lese LeseBuddy uddy». Lenken går i tillegg til `href="#"` i mockene. (EXPERIENCE.md Ordmerke, landingsside-1.html linje 120, arbeidsbord-1.html linje 113, WCAG 1.1.1, 2.4.4, 2.5.3.)
Retting: Spesifiser `<a href="/" aria-label="LeseBuddy, forsiden">`, eller skjult tekst «LeseBuddy», med `aria-hidden="true"` på alle tre delene av merket. Ta det inn som en testbar setning i kontrakten.

**[Tilgjengelighet]** Løkker som varer mer enn fem sekunder har ingen pausemekanisme. Øynene i tenkeindikatoren går i en uendelig løkke på 1,6 sekunder, og kallene varer 10–20 sekunder eller mer. Landingsmerket i `merke.css` (`.spill`) er en sekvens på 6,6 sekunder. Begge starter av seg selv og vises ved siden av annet innhold. `prefers-reduced-motion` er bra, men regnes ikke som en mekanisme for å pause etter 2.2.2. Den gjelder bare dem som har slått på innstillingen i systemet. (DESIGN.md Tenkeindikatoren, EXPERIENCE.md Redusert bevegelse, merke-tenker.css linje 70, merke.css linje 13 og 22–27, WCAG 2.2.2, 2.3.3.)
Retting: La øynene lese i høyst om lag fem sekunder og så stå stille. Statusteksten bærer resten. Spill heroens sekvens én gang og hold den under fem sekunder, eller gi den en pauseknapp. Skriv det inn i Accessibility Floor.

**[Tilgjengelighet]** Framdriftsstrekene er ikke tilgjengelige:

- `aria-label` på en `<span>` uten rolle blir ignorert.
- De små bunkene har ingen tekst i det hele tatt.
- Tomme streker har `border`-farge med 1,28:1 mot flaten. «3 av 5» kan da ikke telles visuelt, og bare fargen skiller fylt fra tom.

(DESIGN.md Bunke, arbeidsbord-1.html linje 46–47, 147 og 152–155, WCAG 1.1.1, 1.3.1, 1.4.1, 1.4.11.)
Retting: Legg til teksten «3 av 5 påbegynt», synlig eller skjult. Gi tomme streker en kant med minst 3:1, eller en annen form (omriss mot fylt). Strekene får `aria-hidden`.

**[Tilgjengelighet]** Mønsteret for viften er uklart. Disclosure, `inert`, fokus som flyttes og Esc er til sammen en dialog uten dialogrolle. Gruppeetiketten er fast («Aktiviteter for teksten»). Mocken setter `aria-label` på en `div` uten rolle, og den blir ignorert. Bare hovedbunken har `aria-controls`. Fokus flyttes etter 250 ms med `preventScroll:true`, så det første kortet kan havne utenfor synsfeltet. På telefon blir en liten bunke flyttet ut av den vannrette rulleraden (`overflow-x:auto`) og klippet bort, så eleven ser ikke hvilken bunke som er åpen. Det er heller ikke sagt om den åpne bunken selv er `inert`. (EXPERIENCE.md Viften og Accessibility Floor, arbeidsbord-1.html linje 91, 160, 212–218, WCAG 4.1.2, 2.4.3, 2.4.11.)
Retting: Velg ett mønster. Enten en ekte disclosure (ingen `inert`, ingen fokusflytting, viften rett etter knappen i DOM-en), eller en ikke-modal `role="dialog"` med `aria-labelledby` som peker på tittelen på teksten. Alle bunker skal ha `aria-controls`. Fokus flyttes uten `preventScroll`, og den åpne bunken skal ikke være `inert`. Skriv inn hva skjermleseren skal si: «Celledeling, aktiviteter, gruppe. Teksten, Klar til lesing, 14 fagord, lenke, 1 av 5.»

**[Tilgjengelighet]** Det står ikke hvordan låste aktivitetskort skal bygges. Kortene er lenker, og «låst» er ikke en tilstand en lenke kan ha. En utvikler kan velge `pointer-events:none` (tabbart, men dødt), `<button disabled>` (hoppes over av Tab, og grunnen blir ikke lest opp) eller nedtoning med opasitet. Med opasitet faller teksten «Åpnes når du har lest teksten» under 4,5:1. Den teksten er informasjon og er ikke unntatt kontrastkravet. (EXPERIENCE.md Låste aktiviteter, WCAG 4.1.2, 1.4.3, 1.4.1.)
Retting: Et låst kort er et `<li>`/`<div>` uten lenke, med låseikon (`aria-hidden`) og synlig tekst «Låst. Åpnes når du har lest teksten.» i full kontrast. Det står i samme rekkefølge som de andre kortene. Ikke bruk opasitet på teksten.

**[Tilgjengelighet]** Steg C og aktivitetskortene er usynlige til JavaScript slår dem på. `.ett` starter på `opacity:.15` (1,24–1,49:1), og `.akt` på `opacity:0`. Uten JS, ved et skriptfeil eller ved utskrift er stegene nesten usynlige og aktivitetene borte. Det er tekst svaksynte kan komme til å lese før den har «dukket fram». (landingsside-1.html linje 50 og 72, FR-47, WCAG 1.4.3.)
Retting: Det synlige er utgangspunktet i CSS. Skjulingen settes bare på under en klasse som JS legger på (`.js-effekter .ett`) og bare under `prefers-reduced-motion: no-preference`.

**[Tilgjengelighet]** Følge-Buddy og brilleknappen svever over innholdet uten plass satt av. Følge-Buddy (84 × 84 eller 60 × 60, nede til høyre) og snakkeboblen (`white-space:nowrap`, `right:92px`) dekker brødtekst. Boblen klippes ved 320 px og ved stor tekst, og den kan ikke lukkes. Snakkeboblene står heller ikke på siden, i motsetning til det kontrakten sier («Tre steg. Jeg tar dem med deg.»). Brilleknappen oppe til høyre i lesevisningen kan dekke tekst og fagord. Fagordene kan få fokus, så et fokusert fagord kan bli skjult (2.4.11). Det står ikke hvor stor knappen er, eller om den åpner en dialog. (EXPERIENCE.md Følge-Buddy og Brilleknapp, landingsside-1.html linje 90–96, WCAG 1.4.10, 2.4.11, 4.1.2.)
Retting: Sett av plass til de svevende elementene (`padding-inline-end`/`padding-bottom` eller `scroll-padding`), eller legg brilleknappen i en klistret verktøylinje. Skjul Følge-Buddy ved smal bredde eller stor tekst. La boblen brytes. Gi brilleknappen `aria-haspopup="dialog"`/`aria-expanded`, og vis gjerne teksten «Leseinnstillinger» på brede skjermer. Telefontesten sa at navnet ikke var intuitivt.

**[Tilgjengelighet]** Typografien er ikke god nok for dysleksi og andrespråkslesere på viktige steder:

- Fagordet i forklaringspanelet står i Instrument Serif. Det er den kondenserte displayskriften med hårfine streker og lav x-høyde, og den finnes bare i vekt 400. Det er nettopp ordet eleven skal lære, og det ser annerledes ut enn i teksten (Atkinson fet).
- Viktig status står i 13–14 px (statuslinjer, meta, «Sist brukt», «6 av 8»).
- Etikettene er 12 px versaler med sperring.
- Alle tokens er i `px`, så nettleserens standard skriftstørrelse virker ikke. Det står heller ikke om FR-12 skalerer forklaringspanelet.

(DESIGN.md typography og Fagord og forklaringspanel, arbeidsbord-1.html linje 44, 55, 73 og 75, WCAG 1.4.4, 1.4.8 som veiledning.)
Retting: - Vis fagordet i panelet i Atkinson Hyperlegible fet, gjerne større. Instrument kan brukes til overskriften over.
- Ha minst 16 px på all status og meta som bærer informasjon.
- Bruk versaler bare på merkelapper med ett eller to ord.
- Skriv tokens i `rem`.
- Si i DESIGN.md at FR-12 skalerer både teksten og forklaringspanelet.

**[Tilgjengelighet]** Morsmål og høyre-til-venstre er ikke dekket i det nye designet:

- Atkinson Hyperlegible og Instrument Serif har verken kyrillisk eller arabisk. Ukrainsk og arabisk faller da tilbake til en tilfeldig systemskrift.
- Arabisk trenger vanligvis større skrift og mer linjeavstand.
- Kontrakten nevner ikke `lang` og `dir` på morsmålsdeler, eller hvordan det norske uttrykket i parentes (FR-25) skal holdes isolert i arabisk tekst. Uten `<bdi>` kan parentes og latinsk tekst havne feil.

(EXPERIENCE.md Accessibility Floor (morsmål), DESIGN.md Typography, FR-25, WCAG 3.1.2, 1.3.2.)
Retting: - Legg inn en skriftstabel per skriftsystem, for eksempel Noto Sans Arabic og Noto Sans med kyrillisk, med egne størrelses- og linjeavstandstokens for arabisk.
- Krev `lang="uk"`/`lang="ar" dir="rtl"` på morsmålsblokker og `<bdi lang="nb">` rundt det norske uttrykket.
- Bruk logiske CSS-egenskaper (`border-inline-start`, `padding-inline`) i paneler som kan vise RTL-innhold.

**[Tilgjengelighet]** Menyen skjules på telefon, så Samlingen blir utilgjengelig. Under 760 px skjules menyen. «Se alle N tekstene» vises bare når N > 5. En elev med 1–5 tekster på telefon har da ingen vei til Samlingen, og dermed ikke til søk og sletting (FR-37, FR-49 «nås fra menyen»). Den vannrette rulleraden med små bunker krever i praksis sveip, mot regelen kontrakten setter selv («Ingen funksjon krever … sveip»). (EXPERIENCE.md Responsive & Platform og State Patterns, arbeidsbord-1.html linje 86 og 91, WCAG 2.4.5, FR-49.)
Retting: Erstatt den skjulte menyen med en meny som kan åpnes («Meny»-knapp), eller en fast lenke til Samlingen under bordet. Gjør de små bunkene til en liste som brytes på telefon, eller gi rulleraden synlige knapper for forrige og neste.

**[Tilgjengelighet]** I Windows kontrastmodus (`forced-colors`) forsvinner markeringer som bare er laget med bakgrunn og skygge:

- Fagordmarkeringen er bakgrunn pluss `box-shadow` som understrek, og begge fjernes, så bare fet skrift er igjen.
- Framdriftsstrekene og statuspillene forsvinner.
- Aktivt menyvalg vises bare med bakgrunn.
- Fokus på viftekortene er bare `border-color`.

(DESIGN.md components.fagord, landingsside-1.html linje 64, arbeidsbord-1.html linje 22, 46–47 og 70, WCAG 1.4.1, 1.4.11, 2.4.7.)
Retting: Lag fagordets understrek med `text-decoration` (`underline 2px`, `text-underline-offset`), ikke skygge. Legg til `@media (forced-colors: active)`-regler for strekene (kant), aktivt menyvalg (understrek) og fokus (`outline`). Ta kontrastmodus med i testplanen.

### Lav (22)

**[Flow coverage]** Flytene viser ikke til UJ-ID-ene eller FR-47 til FR-49. Flyt 2 låner Jonas fra «PRD §2.3» uten å si UJ-1, og Flyt 3 ligger tett på UJ-1.
Retting: Skriv «(UJ-1, FR-48)» og lignende i flytoverskriftene.

**[Token completeness]** Noen kontraster som bærer innhold, er ikke oppgitt: on-accent mot accent (5,5:1 lys og 7,0:1 mørk, som gjelder statuspillen og «Sist brukt») og primary mot highlight (6,1:1 og 5,9:1, som gjelder understreken og fokus på fagord). Accessibility Floor sier at fokusfargen har «minst 7:1 mot flatene» (EXPERIENCE.md, linje 118), men mot highlight er den 6,1:1. Det holder for fokus (3:1), men påstanden er feil.
Retting: Oppgi parene, og rett setningen til «minst 3:1 mot alle flater, 7:1 mot background og surface».

**[Token completeness]** `wordmark-lese` mangler `fontStyle: italic`, selv om prosaen sier kursiv. Størrelsen på B-en (0,9 em i memloggen) og mellomrommet på 0,16 em er ikke tokens. Komponentene har radier utenfor skalaen (18 px, 16 px og 4 px), mens Shapes sier at kort bruker `{rounded.lg}`. Komponenttokenene viser bare til lyse tokens, og regelen om at `-dark`-utgaven brukes i mørk modus, står ingen steder.
Retting: Legg til feltene, og ta enten 18 px inn i skalaen eller bruk `rounded.lg`. Skriv regelen for mørk modus i én setning under Colors.

**[Component coverage]** Brilleknappen, Følge-Buddy, snakkebobla og tenkeindikatoren mangler mål og plassering. For brilleknappen gjelder det trykkflate (44 × 44?), avstand fra kanten og forholdet til topplinjen på telefon. For tenkeindikatoren gjelder det om den står i flaten eller over innholdet, hvor stor den er, og hvilken typografi statusteksten har.
Retting: Én linje hver i DESIGN.md › Components.

**[State coverage]** Lange titler er ikke dekket. `stack-main` er 300 × 210 px med `{typography.heading}` på 44 px, så «Industriell revolusjon» brytes over flere linjer.
Retting: Sett en grense på linjer, avkort med ellipse og ha hele tittelen i den tilgjengelige navnelappen.

**[State coverage]** Bildeinnlesing viser framdrift per bilde (FR-44), og det er den lengste ventetiden i appen. «Lange kall deles opp i steg» (linje 95) sier ikke hvordan tenkeindikatoren viser «bilde 2 av 4».
Retting: Legg til én linje med ordlyd for flere steg.

**[Visual reference coverage]** merke-tenker.css har ingen lenke, enda den er selve implementasjonen av tenkeindikatoren (løkken og avslutningen).
Retting: Lenk den fra DESIGN.md › Components › Tenkeindikatoren.

**[Visual reference coverage]** Henvisningene er uspesifikke. I DESIGN.md står alle samlet i ett avsnitt etter Components, ikke ved seksjonene. runde-8-ordmerke.html er merket «(tenkeindikatoren)», men består mest av seks ordmerkeforslag som er valgt bort. runde-9 viser sju varianter, men sier ikke at 4d med B-en på 0,9 em er valgt. Ingen Key Flow lenker til en mock.
Retting: Lenk der det hører hjemme (Flyt 1 → landingsside-1, Flyt 2 og Component Patterns → arbeidsbord-1), og si hva hver fil viser.

**[Visual reference coverage]** I landingsside-1 står «Buddy kan vise forklaringene på ukrainsk, og flere språk er på vei», men PRD-en har modellstøttede språk i v1, med merknad (FR-24). Siden spinen ikke har ordlyden for landingssiden, er mocken eneste kilde til teksten.
Retting: Rett ordlyden i mocken, eller ta med hovedteksten til FR-47 i spinen.

**[Bloat & overspecification]** Accessibility Floor inneholder en feilrapport, at arabisk og polsk ikke åpnet seg (EXPERIENCE.md, linje 120), og Åpne punkter avsluttes med en loggsetning («Avgjort 13.11 …», linje 174). Ingen av delene er kontrakt.
Retting: Flytt dem til `.logs/arve/issues.md` og memloggen.

**[Bloat & overspecification]** Referansene i Brand & Style (DESIGN.md, linje 180) og Inspiration & Anti-patterns (EXPERIENCE.md, linje 131–135) gjentar hverandre. Det er ufarlig, men én av dem kan vise til den andre.

**[Inheritance discipline]** «fagord» brukes som domenebegrep: «Fagord og forklaring», «antall fagord», og Voice and Tone (linje 65) regner «fagord» som et «norsk domenebegrep». PRD §3 bruker Faguttrykk og kaller synonymer en disiplinbrist. Med små bokstaver står også «øvekort».
Retting: Si én gang at «fagord» er ordet i grensesnittet for Faguttrykk, og bruk Faguttrykk, Øvekort og Tekst i reglene.

**[Inheritance discipline]** Spinene viser ikke til FR-47, FR-48 og FR-49, selv om PRD §4.12 viser til spinene. Raden for Samlingen viser til FR-36, mens FR-49 nå eier kravet.
Retting: Legg inn FR-henvisningene i IA og i flytoverskriftene.

**[Inheritance discipline]** Brytepunktet er oppgitt ulikt. DESIGN sier «Under 760 px» (linje 218–219), og EXPERIENCE sier «≤ 760 px» og «≥ 761 px» (linje 126–127). Ved nøyaktig 760 px er oppsettet uavklart.
Retting: Velg én formulering.

**[Shape fit]** «Åpne punkter» inneholder utdaterte punkter (PRD-oppfølgingen, se 7) og en loggsetning.
Retting: Rydd seksjonen, så den bare inneholder det som faktisk er åpent: valg av ordmerke og hvordan lærere får koder.

**[Tilgjengelighet]** Den klistrede topplinjen har fast høyde (64 px) og ingen `scroll-padding-top`. Ved Shift+Tab og ankerlenker («For lærere») kan fokus havne bak linjen, og ved stor tekst flyter innholdet ut av den faste høyden. (landingsside-1.html linje 13, 20–21, WCAG 2.4.11, 1.4.4.)
Retting: Bruk `min-height` i stedet for `height`, og sett `scroll-padding-top` lik høyden på topplinjen.

**[Tilgjengelighet]** Redusert bevegelse er ikke dekket helt i mockene. `scroll-behavior:smooth`, overgangene på `.fo`, `.prikk`, `.forkl` og `.folger`, og hover-løftet på bunkene slås ikke av. (landingsside-1.html linje 13, 52, 63, 65 og 90, arbeidsbord-1.html linje 48, WCAG 2.3.3.)
Retting: Ha én global regel under `prefers-reduced-motion: reduce` som setter `scroll-behavior:auto` og fjerner `transition`/`transform` på dekor.

**[Tilgjengelighet]** Dekorative tegn leses opp. Ikonrutene «T», «?», «◫», «“» og «♪», pilen «→» og «✕» i «Legg sammen ✕» blir lest som «spørsmålstegn», «høyrepil», «multiplikasjonstegn» og lignende. (landingsside-1.html linje 180–184, arbeidsbord-1.html linje 146, 161–167, WCAG 1.1.1.)
Retting: Gi ikoner og piler `aria-hidden="true"`, og skriv i DESIGN.md at ikonruter alltid er dekor.

**[Tilgjengelighet]** Overskriftsstrukturen har hull. Landingssidens demoseksjon har ingen `h2`, og regionen heter «Celledeling» etter eksempelteksten. Viften har ingen overskrift. Etikettene «Rulleeffekt A/C» er mockpynt som ikke må komme med i produktet. (landingsside-1.html linje 146, 158–163, WCAG 1.3.1, 2.4.6.)
Retting: Gi demoen en `h2` («Se hvordan Buddy markerer fagord»), og gi viften en overskrift eller en etikett som nevner tittelen på teksten.

**[Tilgjengelighet]** Flere trykkflater er under kontraktens eget gulv på 44 px:

- modusbryteren: om lag 36 px
- konto: 38 px
- menylenker: om lag 41,5 px
- «Legg sammen»: om lag 43,5 px
- lenken «Se alle 12 tekstene»: om lag 22,5 px høy

De består 2.5.8 AA takket være avstand, men ikke EXPERIENCE.md. (arbeidsbord-1.html linje 21, 26–27, 60 og 76, WCAG 2.5.8.)
Retting: Gi `min-height: 44px` og `min-width: 44px` til alle kontroller, også rene tekstlenker med egen funksjon.

**[Tilgjengelighet]** To påstander om kontrast er for sterke. DESIGN.md sier at brødteksten holder minst 7:1 «mot alle flater», men `text-muted` brukes som brødtekst i ingresser og steg, og har 6,55:1 på bakgrunnen og 5,72:1 på markeringen. EXPERIENCE.md sier at fokusfargen har «minst 7:1 mot flatene», men den har 6,12:1 og 5,91:1 mot markeringen. AA holder, men tallene bør stemme, så ingen bygger videre på dem. (DESIGN.md Colors, EXPERIENCE.md Accessibility Floor, WCAG 1.4.3.)
Retting: Rett påstandene, eller la `text` brukes til all brødtekst og `text-muted` bare til meta.

**[Tilgjengelighet]** Modus og konto er uavklart i mockene. Modusknappen har teksten «Mørk» uten `aria-pressed`, mens EXPERIENCE.md sier at modusen følger systemet. Kontoikonet er en `<span title="Konto">` uten rolle. (arbeidsbord-1.html linje 119–120, landingsside-1.html linje 124, WCAG 4.1.2.)
Retting: Bestem om det skal være en egen bryter. Hvis ja, bruk `aria-pressed` og et fast navn («Mørk modus»). Kontoen skal være en lenke med tilgjengelig navn «Konto».

## Gjennomgangsfiler

- `review-rubric.md`
- `review-tilgjengelighet.md`
