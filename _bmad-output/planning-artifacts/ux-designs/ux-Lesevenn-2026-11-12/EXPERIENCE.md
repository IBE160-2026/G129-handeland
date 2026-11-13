---
name: LeseBuddy
status: final
updated: 2026-11-13
sources:
  - ../../prd-lesevenn.md
  - ../../product-brief-lesevenn.md
  - ../../arkitektur-lesevenn.md
  - ../../tilbakemelding-prd.md
  - ../../../../maaling/resultater/telefontest-2026-11-09.md
---

# LeseBuddy: hvordan appen virker

## Foundation

LeseBuddy er en responsiv nettapp: Next.js (App Router) med Tailwind CSS v4 og egne komponenter, uten komponentbibliotek. Telefon i portrettmodus er en reell flate (PRD §5), ikke en nedskalert PC-side. [DESIGN.md](DESIGN.md) beskriver hvordan appen ser ut, og dette dokumentet beskriver hvordan den virker. Tokens refereres som `{colors.primary}` og lignende.

Designfasen endrer **inngangen og rammen** rundt det som finnes:
- landingssiden (FR-47)
- arbeidsbordet (FR-48)
- samlingen (FR-49)
- tenkeindikatoren
- den nye visuelle identiteten

Kjerneløypen (Aktivering → Lesevisning → Quiz) og det som henger på den (Øvekort, Fagsamtale, Minnevers, morsmålsstøtte) er uendret i rekkefølge og regler. De får bare nytt utseende, tenkeindikatoren og innspillene fra telefontesten.

Navnet byttes bare utad, til «LeseBuddy». Det gjelder all tekst eleven kan se, også feilmeldinger som i dag sier «Lesevenn» (for eksempel ved feil invitasjonskode), sidetitler og metadata. I grensesnittet heter Faguttrykk «fagord». Domenebegrepene i reglene under er PRD-ens: Tekst, Faguttrykk, Kildeavsnitt, Øvekort og Fagsamtale.

## Information Architecture

| Flate | Nås fra | Formål |
|---|---|---|
| Landingsside (FR-47) | `/` uten innlogging | Forklare hva LeseBuddy er, for elev og lærer, og sende videre til innlogging eller registrering |
| Logg inn | Landingssiden, topplinjen | Uendret (FR-35) |
| Registrer deg | Landingssiden, «Har du fått en kode fra læreren?» | Uendret. Krever invitasjonskode |
| **Arbeidsbord** (FR-48) | `/` med innlogging, ordmerket, menyen | Siste tekst og neste steg, de fem siste tekstene som bunker, og vei til ny tekst og samlingen |
| **Samlingen** (FR-49) | Menyen, «Se alle N tekstene i samlingen» | Alle tekstene, med søk, sortering og sletting. Gjenbruker dagens tekstliste fra startsiden (FR-36, FR-37) |
| **Ny tekst** | «+ Ny tekst», «Legg en ny tekst på bordet» | Innlesing (FR-1, FR-2, FR-44). Det som er startsiden i dag, flyttet til egen side |
| Tekstens løype | En bunke, et aktivitetskort, neste steg | Aktivering → (gjennomsyn for PDF og bilde) → Lesevisning → Quiz, Øvekort, Fagsamtale, Minnevers. Sidene finnes i dag under `/tekst/[id]/…` |
| Konto | Kontolenken i topplinjen | Uendret (sletting FR-37, innstillinger) |

**Adressene** `/samling` og `/ny` er forslag (`[ANTAKELSE]`). Arkitekturen avgjør de endelige.

**Siden `/tekst/[id]/oppgaver` beholdes.** Den er målet når viften ikke kan brukes (uten JavaScript, og som reserve i kuttrekkefølgen nedenfor), og den viser de samme fem aktivitetene som en vanlig liste.

`[MERKNAD TIL ARKITEKTUR]` I dag sender `tilgang()` alle som ikke er innlogget til `/logg-inn`. Det gjør den ved å kaste. Landingssiden på `/` må derfor sjekke økten *uten* å kaste, og vise arbeidsbordet bare når eleven er innlogget. AD-8 gjelder fortsatt: tilgang til data sjekkes i datatilgangslaget.

`[MERKNAD TIL ARKITEKTUR]` «Sist aktiv» trengs for å velge hvilke fem bunker som ligger på bordet og hvilken som er hovedbunke (se State Patterns). Datamodellen har ingen slik tid i dag. Anbefalingen er et felt på Teksten som oppdateres ved hver aktivitet.

**Visuelle referanser:** Flyt 1 vises i [mockups/landingsside-1.html](mockups/landingsside-1.html), Flyt 2 og viften i [mockups/arbeidsbord-1.html](mockups/arbeidsbord-1.html). Samlingen og Ny tekst har ingen mock. De bygges etter dette dokumentet. Mockene er visuelle utkast. Oppførselen og tilgjengeligheten følger dette dokumentet, ikke koden i mockene, og dokumentet gjelder ved uenighet.

## Voice and Tone

Microcopy. Merkevarestemmen står i DESIGN.md, under Brand & Style.

Buddy snakker i første person, kort og direkte, og til «du». Appen ellers forteller hva som skjer. Tonen er formativ (FR-23): Buddy hjelper og følger opp, men gir ikke karakterer eller overdreven ros. Appen kjenner ikke elevens navn (FR-35), så den hilser uten navn.

| Gjør | Ikke gjør |
|---|---|
| «Buddy lager quizen din …» med «Det tar som regel 10–20 sekunder.» under | «Laster …» eller et spinnhjul uten tekst |
| «Quizen er klar. 8 spørsmål om Celledeling.» | «Suksess! 🎉» |
| «Se, jeg markerer fagordene!» (Buddy på landingssiden) | Buddy som forteller vitser eller kommenterer elevens svar |
| «Hei!» og «Du holdt på med Celledeling i går.» | «Hei, Jonas» (navnet finnes ikke) eller «Velkommen tilbake til dashbordet ditt!» |
| «Har du fått en kode fra læreren? Da kan du registrere deg.» | «Registrering stengt.» uten forklaring |
| «Vurderingen feilet. Svaret ditt er lagret.» med knappen «Prøv igjen» | «Noe gikk galt.» (PRD §5: ingen blindveier) |
| «Du har lagt inn 5 tekster i dag. Du kan legge inn flere i morgen.» | «Kvote overskredet.» |
| Norske ord i grensesnittet: tekst, fagord, quiz, øvekort, fagsamtale | «Dashboard», «flashcards», «items» |

**Hovedteksten på landingssiden:**
- **Overskrift:** «Forstå mer av det du *leser*.»
- **Ingress:** «LeseBuddy er lesestøtte for videregående. Du leser teksten selv, og Buddy hjelper deg med fagordene, spørsmålene og samtalen om det du har lest.»
- **Stegene:** «Før du leser», «Mens du leser», «Etter at du har lest».
- **Lærerdelen:** «Svaret kommer ikke først», «Alt peker tilbake til teksten», «Virker på mobilen», «Morsmål ved siden av norsk».
- **Morsmål (FR-24):** «Har du et annet morsmål? Buddy kan forklare på ukrainsk og 16 andre språk. Ukrainsk er kvalitetssikret, og de andre er merket som ikke kontrollert.»

## Component Patterns

Hvordan komponentene oppfører seg. Hvordan de ser ut, står i DESIGN.md, under Components.

| Komponent | Brukes på | Regler for oppførsel |
|---|---|---|
| **Topplinje** | Alle sider | Ordmerket lenker til `/`. Menyen har «Arbeidsbord» og «Samlingen», og aktivt valg har `aria-current="page"`. Kontolenken heter «Konto». På telefon står «Samlingen» og «Konto» fortsatt synlig, mens «Arbeidsbord» nås via ordmerket. Ingen meny skjules uten erstatning. |
| **Ordmerke** | Topplinjen, landingssiden | `<a href="/">` med navnet «LeseBuddy, forsiden» for skjermlesere. Delene i merket er skjult for skjermlesere. |
| **Bunke** | Arbeidsbordet | Én bunke er én Tekst, og bunkene står i en liste (`<li>`). Tittelen er en overskrift. Bunken har én knapp, «Vis aktiviteter for {tittel}» (`aria-expanded`, `aria-controls`), som dekker hele bunken. Framdriften leses som tekst («3 av 5 påbegynt»), og strekene er skjult for skjermlesere. |
| **Hovedbunke** | Arbeidsbordet | Teksten som sist var aktiv. Viser «Sist brukt» og en egen lenke for neste steg, lagt over bunken, ikke inne i knappen. Lenken går rett til steget, og resten av bunken åpner viften. |
| **Viften** | Arbeidsbordet | En dialog (`role="dialog"`, `aria-modal="true"`) med tittelen på teksten som overskrift og etikett. Den finnes ikke i DOM-en, eller har `hidden`, når den er lukket. Akkurat fem kort, alltid i denne rekkefølgen: Teksten, Quiz, Øvekort, Fagsamtale, Minnevers. Bunken flytter seg til midten, og kortene legger seg rundt den, regnet ut fra de målte størrelsene, så de aldri dekker bunken. Er det ikke plass, legger kortene seg i et rutenett under bunken. Resten av bordet får `inert`. Fokus flyttes til det første kortet og holdes i dialogen. «Legg sammen» og Esc lukker, og fokus går tilbake til bunkens knapp. |
| **Aktivitetskort** | Viften | Et åpent kort er en lenke til aktiviteten, med status fra data (se State Patterns). Et låst kort er ikke en lenke, men et element med teksten «Låst. Åpnes når du har lest teksten.». Det står på sin faste plass og leses opp i rekkefølgen. |
| **Tenkeindikator** | Overalt hvor appen venter på språkmodellen i mer enn to sekunder (PRD §5) | En statusregion (`aria-live="polite"`) finnes tom i siden *før* ventingen starter, og statusteksten skrives inn i den. Øynene leser i en løkke til svaret kommer. Gir kallet feil, prøver appen én gang til automatisk (PRD §5), og statusen sier «Prøver en gang til …». Når svaret kommer, vises innholdet med en gang, avslutningen spilles i indikatorens plass, og fokus flyttes til overskriften på det nye innholdet. Etter 30 sekunder står det i tillegg «Dette tar lenger tid enn vanlig. Buddy jobber fortsatt.» Ved bildeinnlesing sier statusen hvilket steg den er på: «Leser bilde 2 av 4 …». |
| **Feilmelding** | Alle KI-kall og alle feil | `role="alert"`. Sier hva som ikke ble laget, at det eleven har skrevet er lagret, og har «Prøv igjen». Fokus flyttes til «Prøv igjen». Gjelder FR-7, FR-13, FR-19 og FR-20. |
| **Brilleknapp** | Lesevisningen | Flytende knapp oppe til høyre som følger med når eleven ruller. Den åpner leseinnstillingene (FR-12) som en dialog (`aria-haspopup="dialog"`, `aria-expanded`). Dette kommer fra telefontesten, der det var tungvint å rulle opp til innstillingene. Knappen heter «Leseinnstillinger», og teksten vises ved siden av på brede skjermer. Lesevisningen setter av plass (`scroll-padding`, `padding-inline-end`), så knappen aldri dekker tekst eller et Faguttrykk som har fokus. |
| **Faguttrykk og forklaring** | Lesevisningen | Uendret i oppførsel (FR-9, FR-10). Forklaringspanelet er større og har egen bakgrunn, slik telefontesten ba om, og skaleres med leseinnstillingene. |
| **Tekstrad** | Samlingen | Dagens liste fra startsiden (FR-36), flyttet. Hver rad viser tittelen, som er en lenke til neste steg (samme regel som hovedbunken), tilstanden i klartekst og datoen teksten ble lagt inn. Søkefeltet søker i titler, og sorteringen er «Nyeste først» eller «Eldste først» (standard: nyeste). Søk og sortering ligger i adressen og virker uten JavaScript, som i dag. Slett-knappen ber om bekreftelse og navngir teksten og alt som forsvinner (FR-37). |
| **Følge-Buddy** | Bare landingssiden, bredde 760 px og mer | Dukker opp nede i hjørnet når heroen er rullet forbi. Øynene leser i takt med rullingen. Snakkeboblene er korte ekko av seksjonsoverskriftene, de brytes over linjer, og de er bare pynt (`aria-hidden`). Vises ikke på telefon eller ved stor tekst. |
| **Rulleeffekter på landingssiden** | Landingssiden | **Den statiske versjonen er grunnlaget.** Den er HTML fra serveren, med alle steg synlige, alle fire Faguttrykk i eksempelteksten markert og forklaringene i en liste (`<dl>`) under teksten. Effektene legges oppå bare når JavaScript kjører og bevegelse er tillatt: **A** markerer fagordene ett for ett mens forklaringen ved siden av skifter, uten `aria-live`, og den klistrede visningen slås av når flaten er høyere enn synsfeltet. **B** er Følge-Buddy. **C** lar stegene dukke fram mens en linje tegnes nedover. Alle tre beholdes. |
| **Buddy på arbeidsbordet** | Arbeidsbordet, bredde 760 px og mer | Brilleansiktet med en boble som gjentar neste steg fra hovedbunken, for eksempel «Klar for en fagsamtale om Celledeling?». Den er pynt (`aria-hidden`), fordi neste steg allerede står på bunken. |

## State Patterns

### Inngang og arbeidsbord

| Tilstand | Flate | Behandling |
|---|---|---|
| Ikke innlogget | `/` | Landingssiden. Arbeidsbordet vises aldri uten innlogging. |
| Økten har løpt ut | Arbeidsbordet, løypen | Innloggingssiden med «Du er logget ut. Logg inn igjen for å fortsette.», og eleven kommer tilbake dit hun var etter innlogging. |
| Ny elev, ingen tekster | Arbeidsbordet | Tomt bord med Buddy (brilleansiktet) i midten: «Her blir tekstene dine liggende. Legg den første på bordet.» og én primærknapp, «+ Ny tekst». |
| 1–5 tekster | Arbeidsbordet | Hovedbunke og de som finnes, uten tomme plasser. «Samlingen» i topplinjen fører til hele listen. |
| Flere enn 5 tekster | Arbeidsbordet | De fem som sist var aktive, ligger på bordet. «Se alle N tekstene i samlingen» vises på bordet. |
| Henting feiler | Arbeidsbordet | Bordet tegnes på serveren, så det finnes ingen egen lastetilstand. Feiler hentingen: «Vi fikk ikke hentet tekstene dine.» med «Prøv igjen». |
| Lang tittel | Bunke | Tittelen brytes. Over tre linjer avkortes den visuelt, men står i sin helhet i knappens navn og øverst i viften. |

### Sist aktiv

«Sist aktiv» er den nyeste av:
- Teksten ble lagt inn, aktivert eller låst
- et quizforsøk
- en samtalerunde
- et minnevers
- en merking av et øvekort

Å åpne lesevisningen og å merke øvekort teller bare hvis tidsfeltet arkitekturen anbefales å legge til, finnes (se merknaden i Information Architecture). Uten feltet brukes tidspunktene som finnes i dag.

### Neste steg

Neste steg på hovedbunken og i Samlingen velges etter den første regelen som passer:

| Hvis | Neste steg |
|---|---|
| Tilstand `innlest` | «Fortsett: Før du leser» → aktiveringen |
| Tilstand `aktivert` (PDF eller bilde) | «Fortsett: Se over teksten» → gjennomsynet |
| En fagsamtale er påbegynt og ikke avsluttet | «Fortsett: Fagsamtale, runde N av 6» |
| Ingen quizforsøk | «Neste: Ta quizen» |
| Quiz tatt, ingen fagsamtale, og dagens samtalegrense er ikke nådd | «Neste: Fagsamtale» |
| Begrepssettet har Faguttrykk | «Øv videre med kortene» |
| Ellers | «Les teksten igjen» |

Fagsamtalen kan tas før quizen (FR-18, UJ-3). Da hopper regelen over «Neste: Fagsamtale». Minnevers er aldri neste steg, fordi det er et tillegg.

### Status på kortene i viften

| Kort | Påbegynt når | Status |
|---|---|---|
| Teksten | Tilstanden er `aktivert` eller `laast` | `innlest`: «Ikke begynt». `aktivert`: «Venter på gjennomsyn». `laast`: «Klar til lesing · N fagord» |
| Quiz | Minst ett forsøk | «Ikke tatt», eller «Sist: 6 av 8 riktig» (bare fullførte forsøk lagres) |
| Øvekort | Minst ett kort merket | «Ikke øvd», eller «9 av 14 kan du». Tomt Begrepssett (FR-16): «Fant ingen fagord i teksten, så det er ingen kort å øve på.» |
| Fagsamtale | En samtale finnes | «Ikke startet», «Runde 3 av 6» eller «Fullført». Når grensen er nådd: «Dagens 5 samtaler er brukt. Du kan starte en ny i morgen.» |
| Minnevers | Et vers finnes | «Ikke laget» eller «Laget» |

**Låst:** Før teksten er låst (`laast`), er Quiz, Øvekort, Fagsamtale og Minnevers låst, med teksten «Låst. Åpnes når du har lest teksten.». Sidene i koden krever det samme i dag.

### Tenkeindikatoren og KI-kall

| Tilstand | Behandling |
|---|---|
| Buddy tenker | Tenkeindikatoren med statustekst i statusregionen. Teksten sier hva som lages og omtrent hvor lenge det tar. Lange kall deles opp i steg (PRD §5). |
| Nytt forsøk | Indikatoren fortsetter, og statusen sier «Prøver en gang til …». |
| Svaret er klart | Innholdet vises med en gang, og avslutningen spilles i indikatorens plass. Statusen sier «… er klar». Fokus flyttes til overskriften på innholdet. |
| Lang venting (over 30 s) | Statusen får tillegget «Dette tar lenger tid enn vanlig. Buddy jobber fortsatt.» |
| KI-kallet feiler etter nytt forsøk | Øynene stopper, og feilmeldingen tar over (se Component Patterns). FR-19: runden telles ikke. FR-20: vurderingen beholdes når bare oppfølgingen feiler. |

### Bruksgrenser

Grensene står i PRD §6.4. Handlingene vises ikke som deaktiverte. Når eleven trykker, forklarer appen hva som er nådd:

| Grense | Hvor | Melding |
|---|---|---|
| 5 nye tekster per døgn | Ny tekst, før innlesingen vises | «Du har lagt inn 5 tekster i dag. Du kan legge inn flere i morgen.» Lenke til arbeidsbordet. |
| 5 nye fagsamtaler per døgn | Fagsamtale-kortet og neste steg | Som statusen for Fagsamtale i tabellen over. Påbegynte samtaler kan fortsettes. |
| Dagstaket for hele appen (30 kr) | Der et nytt KI-kall skulle startet | I stedet for tenkeindikatoren: «LeseBuddy har nådd dagens grense for nye oppgaver. Alt du har laget, kan du fortsatt åpne. Prøv igjen i morgen.» |

### Samlingen

| Tilstand | Behandling |
|---|---|
| Ingen tekster | «Du har ingen tekster ennå.» med «+ Ny tekst». |
| Søk uten treff | «Ingen titler inneholder «{søk}».» med «Vis alle». |
| Mange tekster | Alle står på én side i v1, med nyeste først (`[ANTAKELSE]`: en elev har ikke hundrevis av tekster). |
| Slette | Bekreftelse som navngir teksten og sier at quiz, øvekort, fagsamtale og vers forsvinner med den (FR-37). |
| Sletting feiler | «Teksten ble ikke slettet. Prøv igjen.» Teksten står fortsatt i listen. |

### Gjelder overalt

| Tilstand | Behandling |
|---|---|
| Redusert bevegelse | Øynene står stille mens Buddy tenker, og statusteksten bærer beskjeden. Avslutningen viser B-en direkte. Landingssiden vises i den statiske versjonen. Viften åpner seg uten å fly. Myk rulling og overganger er slått av. |
| Mørk modus | Følger systeminnstillingen. Det finnes ingen egen bryter i v1. Bryterne i mockene er bare til gjennomsyn. |

## Interaction Primitives

- **Trykk og klikk** er hovedinngangen. Ingen funksjon krever å holde pekeren over noe, sveip eller vannrett rulling (FR-10: telefon har ikke pekerhvil).
- **Tastatur:** Tab følger leserekkefølgen. Enter eller Mellomrom åpner en bunke. Esc lukker det som ligger øverst (viften, forklaringen, leseinnstillingene) og sender fokus tilbake dit det kom fra.
- **Rulling** driver effektene på landingssiden og ingenting annet. Inne i appen skjer det aldri noe bare fordi eleven ruller.
- **Bevegelse har et formål:** Buddy beveger seg når appen tenker eller er ferdig, og viften beveger seg for å vise hvor kortene kommer fra (`{motion.fan}`). Inne i appen animeres ingenting annet.
- **Ingen blindveier** (PRD §5): hver feil sier hva som skjedde og gir minst én neste handling.

## Accessibility Floor

Kontrastene i fargene står i DESIGN.md. Her står det som gjelder oppførsel og bygging.

- **WCAG 2.2 AA i hele appen.** Lesevisningen følger i tillegg PRD §5: justerbar tekst og linjeavstand, om lag 70 tegn per linje, og aldri farge alene.
- **Kjerneløypen kan fullføres med tastatur alene.**
  - Viften er en dialog med `inert` på resten av bordet, og er skjult når den er lukket.
  - **Akseptansetest:** Tab fra «+ Ny tekst» treffer aldri et usynlig element.
- **Fokus:** `{components.focus-ring}` overalt. Det erstatter dagens gulv i `globals.css`, som bruker `currentColor`. Fokus skjules aldri bak topplinjen (`scroll-padding-top`) eller bak brilleknappen.
- **Statusmeldinger:** Tenkeindikatoren er skjult for skjermlesere (`aria-hidden` på SVG-en), og statusteksten står i en statusregion som finnes før ventingen starter. Feil har `role="alert"`. Skjermleseren hører «Buddy lager quizen din» og «Quizen er klar», ikke animasjonen.
- **Bevegelse:**
  - `prefers-reduced-motion` respekteres overalt. Ingen informasjon finnes bare i en animasjon eller en rulleeffekt, og landingssiden virker uten JavaScript.
  - Tenkeindikatorens løkke varer så lenge appen laster, og er da en nødvendig ventevisning, fordi eleven ellers kan tro at siden har hengt seg (unntaket i WCAG 2.2.2). Ellers spilles ingen animasjon i mer enn fem sekunder.
- **Stor tekst og zoom:** Alle flater tåler 200 % tekst, tekstavstand etter 1.4.12 og 320 px bredde uten tap av innhold. Ingen faste høyder og ingen `overflow: hidden` på flater med tekst. Testes slik før en flate regnes som ferdig.
- **Kontrastmodus (`forced-colors`):** Faguttrykkets understrek, framdriftsstrekene, aktivt menyvalg og fokus har egne regler, slik at de ikke forsvinner.
- **Trykkflater** er minst 44 × 44 px, også tekstlenker med egen funksjon. Knappetekst brytes ikke.
- **Dekor er skjult for skjermlesere:** ikonruter, piler, «✕», Følge-Buddy og bobler. Alt de sier, står også i innholdet.
- **Overskrifter:** Hver flate har én `h1`, og seksjonene har `h2`. Fagorddemoen på landingssiden har overskriften «Se hvordan Buddy markerer fagord», og viften har tittelen på teksten som overskrift.
- **Morsmål:** Morsmålsinnhold har `lang` (`uk`, `ar` og så videre). Arabisk har i tillegg `dir="rtl"` og egen skrift (`{typography.morsmaal-rtl}`). Det norske uttrykket inni (FR-25) står i `<bdi lang="nb">`. Paneler som kan vise innhold fra høyre til venstre, bruker logiske CSS-egenskaper (`border-inline-start`, `padding-inline`).

## Responsive & Platform

| Bredde | Oppførsel |
|---|---|
| 760 px og bredere | Arbeidsbordet er ett bord med bunkene spredt utover, og viften legger kortene rundt bunken. Landingssiden har fagorddemoen i to kolonner, og Følge-Buddy og Buddy på bordet vises. |
| Smalere enn 760 px | Bordet blir en kolonne. Hovedbunken ligger øverst, de små bunkene i et rutenett med to kolonner (ingen vannrett rulling), og «Legg en ny tekst på bordet» under. Viften legger kortene i to kolonner under bunken. Topplinjen viser ordmerket, «Samlingen» og «Konto». Lenken «For lærere» i topplinjen skjules, men lærerdelen på landingssiden står. Følge-Buddy og Buddy på bordet vises ikke. |

## Kuttrekkefølge

Fra PRD §9.3, med reserveløsning for hvert steg:

1. **Uten rulleeffekter:** landingssiden vises i sin statiske versjon (se Component Patterns).
2. **Uten vifte:** hver bunke er en lenke til `/tekst/[id]/oppgaver`.
3. **Uten arbeidsbord:** Samlingen er startsiden for innloggede.

## Inspiration & Anti-patterns

- **Hentet fra en pen Notion-side:** lyse flater, mye luft, typografi som hierarki og få sterke farger.
- **Hentet fra skrivebordet:** tekstene ligger som bunker du kan ta opp og spre utover, ikke i et vanlig rutenett.
- **Valgt bort, Duolingo:** for barnslig. Buddy er en figur, men leken og lavmælt, og aldri maskot på hver flate.
- **Valgt bort, Spotify og Discord:** for mørke og seriøse. Mørk modus er et valg, ikke grunntonen.
- **Valgt bort, platte skoleapper:** de fleste utdanningsapper oppleves som kjedelige. LeseBuddy skal ha signatur.

## Key Flows

### Flyt 1: Tor finner LeseBuddy (FR-47; lærer, naturfag på yrkesfag, en ettermiddag etter skolen)

1. Tor får lenken fra en kollega og åpner den på PC-en.
2. Han møter «Forstå mer av det du *leser*.» over hele bredden og leser ingressen.
3. Han ruller. «Slik hjelper Buddy deg» dukker fram steg for steg: før, mens og etter lesingen.
4. Eksempelteksten om celledeling blir stående mens han ruller, og fagordene lyser opp ett for ett med forklaring.
5. **Klimaks:** Under «For lærere» står «Svaret kommer ikke først». Tor kjenner igjen akkurat det han er redd for med KI-verktøy, at elevene hopper over lesingen, og ser at dette er bygd for det motsatte. Han bestemmer seg for å la klassen prøve.

**Feil:** Tor trykker «Registrer deg», men har ingen kode. Siden sier at registrering krever en kode fra læreren. Hvordan en lærer får koder, er ikke bestemt (se Åpne punkter).

Navnet Tor er et skriveverktøy for denne reisen og vises ingen steder i appen.

### Flyt 2: Jonas fortsetter (UJ-1, FR-48; på telefonen i friminuttet)

1. Jonas åpner LeseBuddy. Han er innlogget fra før, og kommer rett til arbeidsbordet: «Hei! Du holdt på med Celledeling i går.»
2. Øverst ligger Celledeling-bunken med «Sist brukt» og lenken «Neste: Ta quizen». Under ligger de fire andre tekstene hans i to kolonner.
3. Han trykker på bunken. Viften åpner seg: Teksten («Klar til lesing · 14 fagord»), Quiz («Ikke tatt»), Øvekort («9 av 14 kan du»), Fagsamtale («Ikke startet») og Minnevers («Ikke laget»).
4. Han trykker på Quiz. Buddy dukker opp med øynene som leser: «Buddy lager quizen din … Det tar som regel 10–20 sekunder.»
5. **Klimaks:** Quizen dukker opp med en gang svaret kommer, mens Buddy blunker og brillene vipper til en B. Jonas har ikke lett etter noe eller limt inn noe på nytt. Bordet husket hvor han var, og neste steg var ett trykk unna.

**Feil:** Kallet til språkmodellen feiler to ganger. Øynene stopper, og meldingen sier «Buddy fikk ikke laget quizen nå.» med «Prøv igjen», som får fokus. Arbeidsbordet og statusene er uendret.

### Flyt 3: Jonas legger en ny tekst på bordet (UJ-1, FR-48)

1. Fra arbeidsbordet trykker Jonas «+ Ny tekst».
2. Han limer inn kapittelet om fotosyntese og kontrollerer overskriftene.
3. Han skriver hva han tror teksten handler om. Fordi teksten er limt inn, går han rett til lesingen etterpå: fase 3b (gjennomsynet av hele teksten) hoppes over (FR-3).
4. Han leser med fagordene markert. Brilleknappen følger med nedover, så han kan gjøre teksten større uten å rulle opp.
5. **Klimaks:** Neste gang han åpner appen, ligger Fotosyntese øverst på bordet som «Sist brukt», og Celledeling har flyttet seg ut til siden.

**Feil:** Jonas har allerede lagt inn fem tekster i dag. Ny tekst sier «Du har lagt inn 5 tekster i dag. Du kan legge inn flere i morgen.» før han har limt inn noe, så han mister ikke arbeid.

### Flyt 4: Jonas finner en gammel tekst før prøven (FR-49; på PC kvelden før)

1. Jonas trykker «Samlingen» i topplinjen.
2. Han skriver «celle» i søkefeltet. Listen viser Celledeling og Cellemembranen.
3. Han ser at Cellemembranen er en tekst han aldri brukte, og trykker «Slett». Bekreftelsen sier «Slette Cellemembranen? Teksten, quizen, øvekortene og fagsamtalen forsvinner.» Han bekrefter.
4. Han åpner Celledeling. Tittelen går rett til neste steg, «Øv videre med kortene».
5. **Klimaks:** På få sekunder har han funnet teksten fra september, ryddet bort den han ikke trengte, og står i øvekortene han skal bruke i kveld.

**Feil:** Han søker på «mitose», som ikke står i noen tittel. Samlingen sier «Ingen titler inneholder «mitose».» med «Vis alle».

### Flyt 5: Maria kommer i gang (UJ-4, FR-47, FR-48; ny elev med papirbok)

1. Maria har fått en kode av læreren. Hun åpner LeseBuddy på telefonen, møter landingssiden og trykker «Registrer deg».
2. Etter registreringen kommer hun til et tomt arbeidsbord: «Her blir tekstene dine liggende. Legg den første på bordet.»
3. Hun trykker «+ Ny tekst», tar to bilder av boka og følger statusen «Leser bilde 1 av 2 …», så «Leser bilde 2 av 2 …».
4. Hun kontrollerer overskriftene, skriver forkunnskapene sine og retter uttrekket i gjennomsynet, slik UJ-4 beskriver.
5. **Klimaks:** Når hun kommer tilbake til arbeidsbordet, ligger den første bunken hennes der, med neste steg klart.

**Feil:** Koden er feil. Registreringen sier «Invitasjonskoden er feil.» og ber henne sjekke koden hun fikk (som i dag, FR-35).

## Telefontesten

- **Spesifisert her og i DESIGN.md:** større forklaringspanel med egen bakgrunn, brilleknappen for leseinnstillinger og et tydeligere navn på den.
- **Bygges etter notatet i `maaling/resultater/telefontest-2026-11-09.md`**, fordi de ikke er nye designbeslutninger:
  - «ekstra stor» tekst og mer avsnittsavstand ved «romslig» (FR-12)
  - norsk flagg og språkbytte på samme side i morsmålsvalget
  - innrykk i ordforklaringene
  - færre stablede bokser ved start av Fagsamtale

## Åpne punkter

- **Ordmerket:** 4d er valgt foreløpig. 4e og 4g er fortsatt alternativer.
- **Lærerkoder:** Hvordan en lærer får invitasjonskoder, er utenfor designfasen og notert i `.logs/arve/issues.md`.
