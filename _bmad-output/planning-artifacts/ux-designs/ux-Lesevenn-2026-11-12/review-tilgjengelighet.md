# Tilgjengelighetsgjennomgang: LeseBuddy-designet (DESIGN.md, EXPERIENCE.md, mockene)

Gjennomgått 13.11.2026 mot WCAG 2.1 AA (forskriften) med WCAG 2.2 AA som mål. Kontrastene er regnet ut på nytt med WCAG-formelen for relativ luminans. Kildekoden i alle mockene er lest. Mockene er utkast, men utviklere kopierer mocker. Derfor er feil i mockene tatt med når kontrakten ikke sier tydelig nok hva som er riktig.

## Samlet vurdering

Fargene holder det de lover, og kontrakten tar tilgjengelighet på alvor: `aria-live`, `inert`, Esc, redusert bevegelse og at farge aldri skal stå alene. Det er likevel ikke klart til bygging. Det er seks høye funn, de fleste der kontrakten er tvetydig og mocken viser feil løsning:

- fokusmarkeringen
- viftekortene som er usynlige, men kan få fokus
- en lenke inne i bunke-knappen
- rulleeffekt A, der forklaringene bare finnes ved rulling
- faste pikselmål på arbeidsbordet
- tenkeindikatorens kunngjøringer og fokus

Ingen funn er kritiske, men de høye bør rettes i kontrakten før bygging. Ellers ender de rett i koden.

### Kontrollregning av kontrast

| Par | Lys | Mørk | Vurdering |
|---|---|---|---|
| text på background / surface | 15,87 / 16,95 | 16,34 / 14,37 | Stemmer |
| text på highlight | 13,85 | 11,98 | Stemmer |
| text-muted på background / surface | 6,55 / 7,00 | 8,60 / 7,56 | Stemmer (6,6 er avrundet) |
| text-muted på highlight | 5,72 | 6,30 | AA, men ikke 7:1 |
| primary på background / surface | 7,01 / 7,49 | 8,06 / 7,09 | Stemmer |
| primary på highlight (fagord, panel, ikonruter) | 6,12 | 5,91 | AA, men ikke «minst 7:1» |
| on-primary på primary | 7,49 | 8,06 | Stemmer |
| on-accent på accent (statuspille, «Sist brukt») | 5,49 | 7,03 | Stemmer |
| danger på background / danger-surface | 6,12 / 5,54 | 8,11 / 6,72 | Stemmer |
| **text-dark på accent-dark (markeringstusjen i mørk modus)** | (5,49) | **2,13** | **Feiler, se M1** |
| border på surface (tomme framdriftsstreker) | 1,28 | 1,31 | Feiler 1.4.11, se M4 |
| Nedtonet bord (18 %): text / text-muted / primary | 1,45 / 1,30 / 1,36 | 1,71 / 1,43 / 1,41 | Bare greit hvis bordet faktisk er `inert`, se H2 |
| Steg C før de dukker fram (15 %) | 1,24–1,36 | 1,31–1,49 | Se M7 |

## Funn

### Høy

**[høy]** Fokusmarkeringen er selvmotsigende, og blir usynlig på primærknapper. EXPERIENCE.md sier «dagens gulv i `globals.css` beholdes» med `{colors.primary}`. Gulvet i `app/globals.css` er derimot `outline: 2px solid currentColor`. På en primærknapp er currentColor hvit (`on-primary`). Det gir en hvit ring på rosahvit bakgrunn, om lag 1,04:1. Viftekortene i `arbeidsbord-1.html` (linje 70) setter i tillegg `outline:none`, og fokus vises bare som en 1 px kant pluss skalering. I Windows kontrastmodus forsvinner også den kantfargen. (EXPERIENCE.md Accessibility Floor, `globals.css` linje 33–35, arbeidsbord-1.html linje 70, WCAG 2.4.7, 1.4.11, 2.4.13.) *Retting:* Skriv én fokusregel i DESIGN.md: `outline: 3px solid {colors.primary}` med `outline-offset: 2px` på alle flater. På fylte primærknapper skal det i tillegg være en ytre ring i `background`, så ringen har minst 3:1 mot både knappen og flaten. Erstatt currentColor i gulvet. Forby `outline:none` uten en like sterk erstatning. Gi bevisst `outline-color: Highlight` under `forced-colors`.

**[høy]** Viftekortene kan få fokus selv når viften er lukket, og mocken bruker ikke `inert`. Kortene er alltid i DOM-en med `opacity:0; pointer-events:none`. Tab går derfor gjennom fem usynlige lenker («Teksten», «Quiz» …) på hvert besøk, uten at det er sagt hvilken tekst de gjelder. Når viften er åpen, tones resten av bordet bare ned med `pointer-events:none`. Det er fortsatt tabbart, og har 1,3–1,7:1 kontrast. Kontrakten sier «disclosure» og «inert», men ikke at innholdet skal være skjult når viften er lukket. (arbeidsbord-1.html linje 63, 68, 160–166, EXPERIENCE.md Viften og Accessibility Floor, WCAG 2.4.3, 2.4.7, 1.4.3, 4.1.2.) *Retting:* Skriv i kontrakten at viften har `hidden` (eller `display:none`) når den er lukket. Det animerte utgangspunktet legges på etter at `hidden` er fjernet. Resten av bordet får `inert`, ikke bare `pointer-events`. Lag en akseptansetest: Tab fra «+ Ny tekst» skal aldri treffe et usynlig element.

**[høy]** Hovedbunken har en klikkbar lenke inne i en knapp, og bunkene har overskrifter inne i knapper. EXPERIENCE.md sier «Bunken er en knapp med `aria-expanded`» og «Trykk på neste steg går rett dit, og trykk ellers på bunken vifter den ut». Det kan bare bygges som nestet interaktivt innhold, og det er ugyldig. Skjermlesere og stemmestyring mister den indre lenken eller leser alt som én knapp. Mocken legger i tillegg `<h2>`/`<h3>` inne i `<button>`. Rollen til overskriftene forsvinner da, så tekstene kan ikke nås med overskriftsnavigasjon. Knappens navn blir hele kortet: «Sist brukt Celledeling Naturfag · lagt inn 11. nov. Neste: Fagsamtale høyrepil». (EXPERIENCE.md Bunke og Hovedbunke, arbeidsbord-1.html linje 140–155, WCAG 4.1.2, 1.3.1, 2.5.3.) *Retting:* Gjør hver bunke til en `<li>` i en liste. Den har tittelen som overskrift, en egen knapp «Vis aktiviteter for Celledeling» (`aria-expanded`, `aria-controls`) og, på hovedbunken, en egen lenke «Neste: Fagsamtale». Den visuelle bunken kan fortsatt se ut som én flate, med en utvidet trykkflate på knappen (pseudo-element) og lenken lagt over. Skriv dette mønsteret inn i kontrakten.

**[høy]** I rulleeffekt A finnes forklaringene bare i JavaScript og bare når man ruller, i strid med FR-47. Forklaringene på de fire fagordene står i en JS-tabell og settes inn i `#forkl` når siden rulles. Det gjelder også med `prefers-reduced-motion`, for koden for A sjekker ikke `redusert`. Uten JS, med redusert bevegelse eller med skjermleserens lesemarkør (som ikke ruller siden pålitelig) står det bare «Rull videre». Det er en instruks som bygger på bevegelse. Når siden rulles, leser `aria-live` opp hver forklaring midt i det brukeren holder på med. Seksjonen er 240vh med en klistret flate. Ved stor tekst (Chrome på Android, eller 400 % zoom med `top: calc(50vh - 170px)` som blir negativ) havner forklaringspanelet under synsfeltet mens fagordene skifter. Brukeren ser da forklaringen først når den siste er aktiv. EXPERIENCE.md sier «Alt innholdet finnes også uten effektene», men ikke hvordan det skal se ut for A. (landingsside-1.html linje 58–69, 169, 235–268, FR-47, WCAG 1.3.1, 1.3.2, 1.4.10, 4.1.3, 2.3.3.) *Retting:* Kontrakten må beskrive den statiske versjonen. Den skal være HTML fra serveren, med alle fire fagord markert og forklaringene som en liste (`<dl>`) under eksempelteksten. Effekten legges oppå når JS kjører og bevegelse er tillatt. Fjern `aria-live` fra demoen, og legg forklaringene i DOM-en i lesefølge. Slå av den klistrede visningen når flaten er høyere enn synsfeltet (eller under en gitt `min-height`-mediespørring).

**[høy]** Arbeidsbordet er bygd med faste pikselmål og tåler ikke stor tekst, tekstavstand eller lange titler. På PC har bordet `height:620px; overflow:hidden`. Bunkene er faste 180 × 126 og 300 × 210, og viften er en ellipse med faste radier (295 × 228 px) og kort som er 168 px brede. Med nettleserens tekstforstørrelse på 200 % (1.4.4) eller tekstavstand etter 1.4.12 blir kortene høyere. Da dekker de bunken (stikk i strid med «så de aldri dekker bunken») og klippes av bordkanten. Ekte titler som «Kapittel 4: Fotosyntese og celleånding» blir tre til fire linjer i en bunke med fast høyde, og kontrakten sier ikke hva som skal skje med lange titler. På telefon er kortene plassert ±82 px fra midten med fast bredde 140 px. Ved 320 px bredde (400 % zoom) klippes ytterkortene om lag 12 px på hver side. Like over brytepunktet (om lag 761–800 px) når ytterkortene i ellipsen også ut over kanten av bordet. (arbeidsbord-1.html linje 35–37, 51–58, 68, 98, 198–202, DESIGN.md components.stack-*, activity-card, WCAG 1.4.4, 1.4.10, 1.4.12.) *Retting:* Skriv i kontrakten at bord, bunker og kort har minimumshøyde, ikke fast høyde, og at plasseringen regnes ut fra de målte størrelsene på kortene. Er det ikke plass, faller oppsettet tilbake til et rutenett eller en liste (gjerne med `@container`). Titler brytes og vises i sin helhet, eller forkortes visuelt med full tittel i det tilgjengelige navnet og på kortet i viften. `overflow:hidden` på bordet er ikke lov. Test med 200 % tekst, med bokmerket for tekstavstand og ved 320 px.

**[høy]** Tenkeindikatoren: kunngjøringen, fokus og feiltilstanden er ikke spesifisert godt nok:

- En `aria-live`-region som settes inn i DOM-en sammen med teksten, blir ofte ikke lest opp. Skjermleserbrukeren sitter da i 10–20 sekunder uten å vite at noe skjer.
- Kontrakten motsier seg selv. Component Patterns sier at avslutningen «spilles … før innholdet vises». State Patterns sier at «Innholdet vises med en gang».
- Det står ikke hvor fokus går når quizen kommer.
- Feilmeldingen har ingen rolle. Uten `role="alert"` eller fokusflytting hører skjermleseren ikke at kallet feilet.

(EXPERIENCE.md Tenkeindikator og State Patterns «Buddy tenker», «Svaret er klart», «KI-kallet feiler», runde-8-ordmerke.html linje 64, 90–92, WCAG 4.1.3, 2.4.3, 3.3.1.) *Retting:*

- Live-regionen skal ligge tom i DOM-en før ventingen starter, og teksten skrives inn etterpå.
- Bestem at innholdet vises med en gang, og at avslutningen spilles ved siden av.
- Når innholdet er klart, flyttes fokus til overskriften på det nye innholdet (`tabindex="-1"`).
- Feilmeldingen får `role="alert"`, og fokus flyttes til «Prøv igjen».
- Legg til en tilstand for lang venting: etter om lag 30 sekunder står det «Dette tar lenger tid enn vanlig» og «Avbryt».

### Middels

**[middels]** Markeringstusjen feiler i mørk modus. I lys modus har teksten 5,49:1 mot den rosa streken. I mørk modus står lys tekst (`text-dark`) på `accent-dark`, med 2,13:1. Det er under 3:1 for stor tekst, og streken dekker nedre tredjedel av hver bokstav i heroens «leser». DESIGN.md sier at aksenten bare skal brukes «som flate med mørk tekst oppå», men tusjen er nettopp aksent under lys tekst. (DESIGN.md components.highlighter, landingsside-1.html linje 35, WCAG 1.4.3.) *Retting:* Gi tusjen en egen mørk token med minst 3:1 mot `text-dark` (for eksempel en mørk rosa i området `#7A1F4D`), eller gi ordet `on-accent` i mørk modus. Legg paret inn i kontrasttabellen i DESIGN.md.

**[middels]** Det tilgjengelige navnet på ordmerket blir «lese uddy». Lenken består av `<span>lese</span>`, en SVG med `aria-hidden` og `<span>uddy</span>`. Skjermleseren sier «lese uddy, lenke» (eller «leseuddy»). Stemmestyringsbrukere som sier «klikk LeseBuddy», treffer ikke. EXPERIENCE.md sier «Merket er bilde med alt-teksten LeseBuddy». Det åpner for at noen legger `alt` på SVG-en og beholder spennene, og da blir navnet «lese LeseBuddy uddy». Lenken går i tillegg til `href="#"` i mockene. (EXPERIENCE.md Ordmerke, landingsside-1.html linje 120, arbeidsbord-1.html linje 113, WCAG 1.1.1, 2.4.4, 2.5.3.) *Retting:* Spesifiser `<a href="/" aria-label="LeseBuddy, forsiden">`, eller skjult tekst «LeseBuddy», med `aria-hidden="true"` på alle tre delene av merket. Ta det inn som en testbar setning i kontrakten.

**[middels]** Løkker som varer mer enn fem sekunder har ingen pausemekanisme. Øynene i tenkeindikatoren går i en uendelig løkke på 1,6 sekunder, og kallene varer 10–20 sekunder eller mer. Landingsmerket i `merke.css` (`.spill`) er en sekvens på 6,6 sekunder. Begge starter av seg selv og vises ved siden av annet innhold. `prefers-reduced-motion` er bra, men regnes ikke som en mekanisme for å pause etter 2.2.2. Den gjelder bare dem som har slått på innstillingen i systemet. (DESIGN.md Tenkeindikatoren, EXPERIENCE.md Redusert bevegelse, merke-tenker.css linje 70, merke.css linje 13 og 22–27, WCAG 2.2.2, 2.3.3.) *Retting:* La øynene lese i høyst om lag fem sekunder og så stå stille. Statusteksten bærer resten. Spill heroens sekvens én gang og hold den under fem sekunder, eller gi den en pauseknapp. Skriv det inn i Accessibility Floor.

**[middels]** Framdriftsstrekene er ikke tilgjengelige:

- `aria-label` på en `<span>` uten rolle blir ignorert.
- De små bunkene har ingen tekst i det hele tatt.
- Tomme streker har `border`-farge med 1,28:1 mot flaten. «3 av 5» kan da ikke telles visuelt, og bare fargen skiller fylt fra tom.

(DESIGN.md Bunke, arbeidsbord-1.html linje 46–47, 147 og 152–155, WCAG 1.1.1, 1.3.1, 1.4.1, 1.4.11.) *Retting:* Legg til teksten «3 av 5 påbegynt», synlig eller skjult. Gi tomme streker en kant med minst 3:1, eller en annen form (omriss mot fylt). Strekene får `aria-hidden`.

**[middels]** Mønsteret for viften er uklart. Disclosure, `inert`, fokus som flyttes og Esc er til sammen en dialog uten dialogrolle. Gruppeetiketten er fast («Aktiviteter for teksten»). Mocken setter `aria-label` på en `div` uten rolle, og den blir ignorert. Bare hovedbunken har `aria-controls`. Fokus flyttes etter 250 ms med `preventScroll:true`, så det første kortet kan havne utenfor synsfeltet. På telefon blir en liten bunke flyttet ut av den vannrette rulleraden (`overflow-x:auto`) og klippet bort, så eleven ser ikke hvilken bunke som er åpen. Det er heller ikke sagt om den åpne bunken selv er `inert`. (EXPERIENCE.md Viften og Accessibility Floor, arbeidsbord-1.html linje 91, 160, 212–218, WCAG 4.1.2, 2.4.3, 2.4.11.) *Retting:* Velg ett mønster. Enten en ekte disclosure (ingen `inert`, ingen fokusflytting, viften rett etter knappen i DOM-en), eller en ikke-modal `role="dialog"` med `aria-labelledby` som peker på tittelen på teksten. Alle bunker skal ha `aria-controls`. Fokus flyttes uten `preventScroll`, og den åpne bunken skal ikke være `inert`. Skriv inn hva skjermleseren skal si: «Celledeling, aktiviteter, gruppe. Teksten, Klar til lesing, 14 fagord, lenke, 1 av 5.»

**[middels]** Det står ikke hvordan låste aktivitetskort skal bygges. Kortene er lenker, og «låst» er ikke en tilstand en lenke kan ha. En utvikler kan velge `pointer-events:none` (tabbart, men dødt), `<button disabled>` (hoppes over av Tab, og grunnen blir ikke lest opp) eller nedtoning med opasitet. Med opasitet faller teksten «Åpnes når du har lest teksten» under 4,5:1. Den teksten er informasjon og er ikke unntatt kontrastkravet. (EXPERIENCE.md Låste aktiviteter, WCAG 4.1.2, 1.4.3, 1.4.1.) *Retting:* Et låst kort er et `<li>`/`<div>` uten lenke, med låseikon (`aria-hidden`) og synlig tekst «Låst. Åpnes når du har lest teksten.» i full kontrast. Det står i samme rekkefølge som de andre kortene. Ikke bruk opasitet på teksten.

**[middels]** Steg C og aktivitetskortene er usynlige til JavaScript slår dem på. `.ett` starter på `opacity:.15` (1,24–1,49:1), og `.akt` på `opacity:0`. Uten JS, ved et skriptfeil eller ved utskrift er stegene nesten usynlige og aktivitetene borte. Det er tekst svaksynte kan komme til å lese før den har «dukket fram». (landingsside-1.html linje 50 og 72, FR-47, WCAG 1.4.3.) *Retting:* Det synlige er utgangspunktet i CSS. Skjulingen settes bare på under en klasse som JS legger på (`.js-effekter .ett`) og bare under `prefers-reduced-motion: no-preference`.

**[middels]** Følge-Buddy og brilleknappen svever over innholdet uten plass satt av. Følge-Buddy (84 × 84 eller 60 × 60, nede til høyre) og snakkeboblen (`white-space:nowrap`, `right:92px`) dekker brødtekst. Boblen klippes ved 320 px og ved stor tekst, og den kan ikke lukkes. Snakkeboblene står heller ikke på siden, i motsetning til det kontrakten sier («Tre steg. Jeg tar dem med deg.»). Brilleknappen oppe til høyre i lesevisningen kan dekke tekst og fagord. Fagordene kan få fokus, så et fokusert fagord kan bli skjult (2.4.11). Det står ikke hvor stor knappen er, eller om den åpner en dialog. (EXPERIENCE.md Følge-Buddy og Brilleknapp, landingsside-1.html linje 90–96, WCAG 1.4.10, 2.4.11, 4.1.2.) *Retting:* Sett av plass til de svevende elementene (`padding-inline-end`/`padding-bottom` eller `scroll-padding`), eller legg brilleknappen i en klistret verktøylinje. Skjul Følge-Buddy ved smal bredde eller stor tekst. La boblen brytes. Gi brilleknappen `aria-haspopup="dialog"`/`aria-expanded`, og vis gjerne teksten «Leseinnstillinger» på brede skjermer. Telefontesten sa at navnet ikke var intuitivt.

**[middels]** Typografien er ikke god nok for dysleksi og andrespråkslesere på viktige steder:

- Fagordet i forklaringspanelet står i Instrument Serif. Det er den kondenserte displayskriften med hårfine streker og lav x-høyde, og den finnes bare i vekt 400. Det er nettopp ordet eleven skal lære, og det ser annerledes ut enn i teksten (Atkinson fet).
- Viktig status står i 13–14 px (statuslinjer, meta, «Sist brukt», «6 av 8»).
- Etikettene er 12 px versaler med sperring.
- Alle tokens er i `px`, så nettleserens standard skriftstørrelse virker ikke. Det står heller ikke om FR-12 skalerer forklaringspanelet.

(DESIGN.md typography og Fagord og forklaringspanel, arbeidsbord-1.html linje 44, 55, 73 og 75, WCAG 1.4.4, 1.4.8 som veiledning.) *Retting:*

- Vis fagordet i panelet i Atkinson Hyperlegible fet, gjerne større. Instrument kan brukes til overskriften over.
- Ha minst 16 px på all status og meta som bærer informasjon.
- Bruk versaler bare på merkelapper med ett eller to ord.
- Skriv tokens i `rem`.
- Si i DESIGN.md at FR-12 skalerer både teksten og forklaringspanelet.

**[middels]** Morsmål og høyre-til-venstre er ikke dekket i det nye designet:

- Atkinson Hyperlegible og Instrument Serif har verken kyrillisk eller arabisk. Ukrainsk og arabisk faller da tilbake til en tilfeldig systemskrift.
- Arabisk trenger vanligvis større skrift og mer linjeavstand.
- Kontrakten nevner ikke `lang` og `dir` på morsmålsdeler, eller hvordan det norske uttrykket i parentes (FR-25) skal holdes isolert i arabisk tekst. Uten `<bdi>` kan parentes og latinsk tekst havne feil.

(EXPERIENCE.md Accessibility Floor (morsmål), DESIGN.md Typography, FR-25, WCAG 3.1.2, 1.3.2.) *Retting:*

- Legg inn en skriftstabel per skriftsystem, for eksempel Noto Sans Arabic og Noto Sans med kyrillisk, med egne størrelses- og linjeavstandstokens for arabisk.
- Krev `lang="uk"`/`lang="ar" dir="rtl"` på morsmålsblokker og `<bdi lang="nb">` rundt det norske uttrykket.
- Bruk logiske CSS-egenskaper (`border-inline-start`, `padding-inline`) i paneler som kan vise RTL-innhold.

**[middels]** Menyen skjules på telefon, så Samlingen blir utilgjengelig. Under 760 px skjules menyen. «Se alle N tekstene» vises bare når N > 5. En elev med 1–5 tekster på telefon har da ingen vei til Samlingen, og dermed ikke til søk og sletting (FR-37, FR-49 «nås fra menyen»). Den vannrette rulleraden med små bunker krever i praksis sveip, mot regelen kontrakten setter selv («Ingen funksjon krever … sveip»). (EXPERIENCE.md Responsive & Platform og State Patterns, arbeidsbord-1.html linje 86 og 91, WCAG 2.4.5, FR-49.) *Retting:* Erstatt den skjulte menyen med en meny som kan åpnes («Meny»-knapp), eller en fast lenke til Samlingen under bordet. Gjør de små bunkene til en liste som brytes på telefon, eller gi rulleraden synlige knapper for forrige og neste.

**[middels]** I Windows kontrastmodus (`forced-colors`) forsvinner markeringer som bare er laget med bakgrunn og skygge:

- Fagordmarkeringen er bakgrunn pluss `box-shadow` som understrek, og begge fjernes, så bare fet skrift er igjen.
- Framdriftsstrekene og statuspillene forsvinner.
- Aktivt menyvalg vises bare med bakgrunn.
- Fokus på viftekortene er bare `border-color`.

(DESIGN.md components.fagord, landingsside-1.html linje 64, arbeidsbord-1.html linje 22, 46–47 og 70, WCAG 1.4.1, 1.4.11, 2.4.7.) *Retting:* Lag fagordets understrek med `text-decoration` (`underline 2px`, `text-underline-offset`), ikke skygge. Legg til `@media (forced-colors: active)`-regler for strekene (kant), aktivt menyvalg (understrek) og fokus (`outline`). Ta kontrastmodus med i testplanen.

### Lav

**[lav]** Den klistrede topplinjen har fast høyde (64 px) og ingen `scroll-padding-top`. Ved Shift+Tab og ankerlenker («For lærere») kan fokus havne bak linjen, og ved stor tekst flyter innholdet ut av den faste høyden. (landingsside-1.html linje 13, 20–21, WCAG 2.4.11, 1.4.4.) *Retting:* Bruk `min-height` i stedet for `height`, og sett `scroll-padding-top` lik høyden på topplinjen.

**[lav]** Redusert bevegelse er ikke dekket helt i mockene. `scroll-behavior:smooth`, overgangene på `.fo`, `.prikk`, `.forkl` og `.folger`, og hover-løftet på bunkene slås ikke av. (landingsside-1.html linje 13, 52, 63, 65 og 90, arbeidsbord-1.html linje 48, WCAG 2.3.3.) *Retting:* Ha én global regel under `prefers-reduced-motion: reduce` som setter `scroll-behavior:auto` og fjerner `transition`/`transform` på dekor.

**[lav]** Dekorative tegn leses opp. Ikonrutene «T», «?», «◫», «“» og «♪», pilen «→» og «✕» i «Legg sammen ✕» blir lest som «spørsmålstegn», «høyrepil», «multiplikasjonstegn» og lignende. (landingsside-1.html linje 180–184, arbeidsbord-1.html linje 146, 161–167, WCAG 1.1.1.) *Retting:* Gi ikoner og piler `aria-hidden="true"`, og skriv i DESIGN.md at ikonruter alltid er dekor.

**[lav]** Overskriftsstrukturen har hull. Landingssidens demoseksjon har ingen `h2`, og regionen heter «Celledeling» etter eksempelteksten. Viften har ingen overskrift. Etikettene «Rulleeffekt A/C» er mockpynt som ikke må komme med i produktet. (landingsside-1.html linje 146, 158–163, WCAG 1.3.1, 2.4.6.) *Retting:* Gi demoen en `h2` («Se hvordan Buddy markerer fagord»), og gi viften en overskrift eller en etikett som nevner tittelen på teksten.

**[lav]** Flere trykkflater er under kontraktens eget gulv på 44 px:

- modusbryteren: om lag 36 px
- konto: 38 px
- menylenker: om lag 41,5 px
- «Legg sammen»: om lag 43,5 px
- lenken «Se alle 12 tekstene»: om lag 22,5 px høy

De består 2.5.8 AA takket være avstand, men ikke EXPERIENCE.md. (arbeidsbord-1.html linje 21, 26–27, 60 og 76, WCAG 2.5.8.) *Retting:* Gi `min-height: 44px` og `min-width: 44px` til alle kontroller, også rene tekstlenker med egen funksjon.

**[lav]** To påstander om kontrast er for sterke. DESIGN.md sier at brødteksten holder minst 7:1 «mot alle flater», men `text-muted` brukes som brødtekst i ingresser og steg, og har 6,55:1 på bakgrunnen og 5,72:1 på markeringen. EXPERIENCE.md sier at fokusfargen har «minst 7:1 mot flatene», men den har 6,12:1 og 5,91:1 mot markeringen. AA holder, men tallene bør stemme, så ingen bygger videre på dem. (DESIGN.md Colors, EXPERIENCE.md Accessibility Floor, WCAG 1.4.3.) *Retting:* Rett påstandene, eller la `text` brukes til all brødtekst og `text-muted` bare til meta.

**[lav]** Modus og konto er uavklart i mockene. Modusknappen har teksten «Mørk» uten `aria-pressed`, mens EXPERIENCE.md sier at modusen følger systemet. Kontoikonet er en `<span title="Konto">` uten rolle. (arbeidsbord-1.html linje 119–120, landingsside-1.html linje 124, WCAG 4.1.2.) *Retting:* Bestem om det skal være en egen bryter. Hvis ja, bruk `aria-pressed` og et fast navn («Mørk modus»). Kontoen skal være en lenke med tilgjengelig navn «Konto».

## Det som er godt løst

- Paletten er målt, og tallene stemmer. Aksenten brukes aldri som tekst, og feil vises alltid med tekst i tillegg til farge.
- Kontrakten krever `aria-live` for venting, `inert`, Esc med fokus tilbake, at ingenting krever pekerhvil, og WCAG 2.2 AA. Det er riktige grep, de trenger bare mer presisjon.
- Redusert bevegelse er tenkt gjennom for alle effektene i EXPERIENCE.md, og `merke.css`/`merke-tenker.css` viser B-en statisk i stedet for animasjonen.
- Atkinson Hyperlegible i brødteksten, om lag 70 tegn per linje og fagord markert med farge, understrek og fet skrift er gode valg for målgruppen.
- Følge-Buddy er `aria-hidden` med `pointer-events:none`, og brilleknappen har et navn for skjermlesere. Begge kommer fra reelle funn i telefontesten.
- Esc lukker viften, og fokus går tilbake til bunken i mocken. `aria-expanded` er brukt, og `lang="nb"` står på alle sider.
