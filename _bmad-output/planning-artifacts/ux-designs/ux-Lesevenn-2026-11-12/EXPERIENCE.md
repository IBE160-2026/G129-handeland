---
name: LeseBuddy
status: draft
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

Designfasen endrer **inngangen og rammen** rundt kjerneløypen:
- en offentlig landingsside
- et arbeidsbord etter innlogging
- en samling med alle tekstene
- tenkeindikatoren
- den nye visuelle identiteten

Kjerneløypen er uendret i rekkefølge og regler: innlesing, aktivering, lesing, quiz, øvekort, fagsamtale og minnevers. Den får bare nytt utseende, Buddy som venteindikator og innspillene fra telefontesten.

Navnet byttes bare utad, til «LeseBuddy». I kode og dokumenter heter appen fortsatt Lesevenn.

## Information Architecture

| Flate | Nås fra | Formål |
|---|---|---|
| Landingsside | `/` uten innlogging | Forklare hva LeseBuddy er, for elev og lærer, og sende videre til innlogging eller registrering |
| Logg inn | Landingssiden, topplinjen | Uendret (FR-35) |
| Registrer deg | Landingssiden, «Har du fått en kode fra læreren?» | Uendret. Krever invitasjonskode |
| **Arbeidsbord** | `/` med innlogging, menyen | Siste tekst og neste steg, de fem siste tekstene som bunker, og vei til ny tekst og samlingen |
| **Samlingen** | Menyen, «Se alle N tekstene i samlingen» | Alle tekstene, med søk og sortering (FR-36). Overtar listen som står på startsiden i dag |
| **Ny tekst** | «+ Ny tekst», «Legg en ny tekst på bordet» | Innlesing (FR-1, FR-2, FR-44). Det som er startsiden i dag, flyttet til egen side |
| Tekstens løype | En bunke eller et aktivitetskort | Aktivering → (gjennomsyn) → lesing → quiz / øvekort / fagsamtale / minnevers. Sidene finnes i dag under `/tekst/[id]/…` |
| Konto | Kontoikonet | Uendret (sletting FR-37, innstillinger) |

`[ANTAKELSE]` Adressene `/samling` og `/ny` er forslag. Arkitekturen avgjør endelige adresser.

`[MERKNAD TIL ARKITEKTUR]` I dag sender `tilgang()` alle som ikke er innlogget til `/logg-inn`. Det gjør den ved å kaste. Landingssiden på `/` må derfor sjekke økten *uten* å kaste, og vise arbeidsbordet bare når eleven er innlogget. AD-8 gjelder fortsatt: tilgang til data sjekkes i datatilgangslaget.

`[MERKNAD TIL ARKITEKTUR]` Siden `/tekst/[id]/oppgaver` finnes allerede. Viften på arbeidsbordet dekker samme behov. Avgjør om oppgavesiden blir værende (som en side som virker uten JavaScript, og som mål for lenker) eller fjernes.

Visuelle referanser: [mockups/landingsside-1.html](mockups/landingsside-1.html) og [mockups/arbeidsbord-1.html](mockups/arbeidsbord-1.html). Samlingen og Ny tekst har ingen mock. De bygges etter tabellene i dette dokumentet og i DESIGN.md. Ved uenighet gjelder dette dokumentet foran mockene.

## Voice and Tone

Microcopy. Merkevarestemmen står i DESIGN.md, under Brand & Style.

Buddy snakker i første person, kort og direkte, og til «du». Appen ellers forteller hva som skjer. Tonen er formativ (FR-23): Buddy hjelper og følger opp, men gir ikke karakterer eller overdreven ros.

| Gjør | Ikke gjør |
|---|---|
| «Buddy lager quizen din …» med «Det tar som regel 10–20 sekunder.» under | «Laster …» eller et spinnhjul uten tekst |
| «Quizen er klar. 8 spørsmål om Celledeling.» | «Suksess! 🎉» |
| «Se, jeg markerer fagordene!» (Buddy på landingssiden) | Buddy som forteller vitser eller kommenterer elevens svar |
| «Hei, Jonas» og «Du holdt på med Celledeling i går.» | «Velkommen tilbake til dashbordet ditt!» |
| «Har du fått en kode fra læreren? Da kan du registrere deg.» | «Registrering stengt.» uten forklaring |
| «Vurderingen feilet. Svaret ditt er lagret.» med knappen «Prøv igjen» | «Noe gikk galt.» (PRD §5: ingen blindveier) |
| Norske domenebegreper: Tekst, fagord, Fagsamtale, øvekort | «Dashboard», «flashcards», «items» |

## Component Patterns

Hvordan komponentene oppfører seg. Hvordan de ser ut, står i DESIGN.md, under Components.

| Komponent | Brukes på | Regler for oppførsel |
|---|---|---|
| **Bunke** | Arbeidsbordet | Én bunke er én Tekst. Bunken er en knapp med `aria-expanded`. Trykk eller Enter/Mellomrom vifter den ut. Trykk igjen, Esc eller «Legg sammen» legger den sammen. Bare én bunke kan være åpen om gangen. |
| **Hovedbunke** | Arbeidsbordet | Teksten med nyest aktivitet. Viser «Sist brukt» og *neste steg*, utledet av tilstanden (se State Patterns). Trykk på neste steg går rett dit, og trykk ellers på bunken vifter den ut. |
| **Viften** | Arbeidsbordet | Akkurat fem kort, alltid i denne rekkefølgen: Teksten, Quiz, Øvekort, Fagsamtale, Minnevers. Bunken flytter seg til midten, og kortene legger seg rundt den (ellipse på PC, forskjøvne par nedover på telefon) så de aldri dekker bunken. Resten av bordet gjøres inaktivt og tones ned. Fokus flyttes til det første kortet, og tilbake til bunken når viften lukkes. Hvert kort er en lenke til aktiviteten. |
| **Aktivitetskort** | Viften | Viser en statuslinje fra data (se State Patterns). Kort for aktiviteter som ikke er tilgjengelige ennå, vises, men er låst og sier hvorfor. |
| **Tenkeindikator** | Overalt hvor appen venter på språkmodellen i mer enn to sekunder (PRD §5) | Øynene leser i en løkke til svaret kommer, og statusteksten sier hva Buddy gjør. Når svaret er klart, spilles avslutningen (B-en) før innholdet vises, men den blokkerer aldri: eleven kan gå videre med en gang. Ved feil stopper øynene, og en feilmelding tar over (se State Patterns). |
| **Brilleknapp** | Lesevisningen | Flytende knapp oppe til høyre som følger med når eleven ruller. Den åpner leseinnstillingene (FR-12). Dette kommer fra telefontesten, der det var tungvint å rulle opp til innstillingene. Knappen er Buddys briller uten øyne og har teksten «Leseinnstillinger» for skjermlesere. |
| **Fagord og forklaring** | Lesevisningen | Uendret i oppførsel (FR-9, FR-10). Forklaringen blir større og får egen bakgrunn, slik telefontesten ba om. |
| **Følge-Buddy** | Bare landingssiden | Dukker opp nede i hjørnet når heroen er rullet forbi. Øynene leser i takt med rullingen, og ved enkelte seksjoner sier Buddy noe i en snakkeboble. Den er bare pynt (`aria-hidden`), og alt den sier, står også på siden. |
| **Rulleeffekter på landingssiden** | Landingssiden | Alle tre beholdes. **A:** fagord lyser opp ett for ett i en eksempeltekst som blir stående mens man ruller, med forklaring ved siden av. **B:** Følge-Buddy. **C:** stegene «Før / Mens / Etter» dukker fram mens en linje tegnes nedover. Alt innholdet finnes også uten effektene. |
| **Ordmerke** | Topplinjen, landingssiden | Lenke til `/`, som viser arbeidsbordet eller landingssiden. Merket er bilde med alt-teksten «LeseBuddy». |

## State Patterns

| Tilstand | Flate | Behandling |
|---|---|---|
| Ikke innlogget | `/` | Landingssiden. Arbeidsbordet vises aldri uten innlogging. |
| Ny elev, ingen tekster | Arbeidsbordet | Tomt bord med Buddy (brilleansiktet) i midten: «Her blir tekstene dine liggende. Legg den første på bordet.» og én primærknapp, «+ Ny tekst». Ingen lenke til samlingen. |
| 1–4 tekster | Arbeidsbordet | Hovedbunke og de som finnes. Ingen tomme plasser. |
| 5 eller flere tekster | Arbeidsbordet | De fem med nyest aktivitet ligger på bordet. «Se alle N tekstene i samlingen» vises når N > 5. |
| Neste steg på hovedbunken | Arbeidsbordet | Utledes av tilstanden: `innlest` gir «Fortsett: Før du leser». `aktivert` (PDF eller bilde) gir «Fortsett: Se over teksten». `laast` uten quizforsøk gir «Neste: Ta quizen». Med quiz, men uten fagsamtale, gir det «Neste: Fagsamtale». Med alt gjort gir det «Øv videre med kortene». |
| Status på kortene | Viften | **Teksten:** tilstanden i klartekst og antall fagord. **Quiz:** «Ikke tatt» eller «Sist: 6 av 8 riktig» (bare fullførte forsøk lagres). **Øvekort:** «Ikke øvd» eller «9 av 14 kan du». **Fagsamtale:** «Ikke startet», «Runde 3 av 6» eller «Fullført». **Minnevers:** «Ikke laget» eller «Laget». |
| Låste aktiviteter | Viften | Før teksten er klar til lesing, er Quiz, Øvekort, Fagsamtale og Minnevers låst, med linjen «Åpnes når du har lest teksten». Kortene står likevel på sin faste plass. |
| Buddy tenker | Alle kall til språkmodellen > 2 s | Tenkeindikatoren med statustekst i en `aria-live`-region. Teksten sier hva som lages og omtrent hvor lenge det tar. Lange kall deles opp i steg (PRD §5). |
| Svaret er klart | Samme | Avslutningen spilles. Statusteksten skifter til «… er klar». Innholdet vises med en gang. Avslutningen blokkerer ikke. |
| KI-kallet feiler | Samme | Øynene stopper, og en feilmelding (`{components.danger-message}`) sier hva som skjedde, at det eleven har skrevet er lagret, og har knappen «Prøv igjen». `[MERKNAD TIL PRD]` Bård Pettersens tilbakemelding (punkt 4.3) etterlyser dette som krav i FR-13 og FR-19. Teksten her er et forslag til ordlyd. |
| Redusert bevegelse | Overalt | Øynene står stille mens Buddy tenker, og statusteksten bærer beskjeden. Avslutningen viser B-en direkte. Rulleeffektene er av: alle steg er synlige, alle fagord er markert, og Følge-Buddy beveger seg ikke. Viften åpner seg uten å fly. |
| Mørk modus | Overalt | Følger systeminnstillingen. Alle tokens har en mørk utgave, se DESIGN.md. |

## Interaction Primitives

- **Trykk og klikk** er hovedinngangen. Ingen funksjon krever å holde pekeren over noe, eller sveip (PRD FR-10: telefon har ikke pekerhvil).
- **Tastatur:** Tab følger leserekkefølgen. Enter eller Mellomrom åpner en bunke. Esc lukker den som er åpen øverst (viften, forklaringen, leseinnstillingene) og sender fokus tilbake dit det kom fra.
- **Rulling** driver effektene på landingssiden og ingenting annet. Inne i appen skjer det aldri noe bare fordi eleven ruller.
- **Bevegelse har et formål:** Buddy beveger seg når appen tenker eller er ferdig, og viften beveger seg for å vise hvor kortene kommer fra. Ingenting annet animeres.
- **Ingen blindveier** (PRD §5): hver feil sier hva som skjedde og gir minst én neste handling.

## Accessibility Floor

Kontrasten i fargene står i DESIGN.md, der brødteksten holder minst 7:1 i begge moduser. Her står det som gjelder oppførsel.

- WCAG 2.2 AA i hele appen. Lesevisningen følger i tillegg PRD §5: justerbar tekst og linjeavstand, om lag 70 tegn per linje, og aldri farge alene.
- Kjerneløypen kan fullføres med tastatur alene. Viften er en disclosure (`aria-expanded`, `aria-controls`). Resten av bordet får `inert` mens viften er åpen.
- Tenkeindikatoren: SVG-en har `aria-hidden`, og statusteksten står i `aria-live="polite"`. Skjermleseren hører «Buddy lager quizen din» og «Quizen er klar», ikke animasjonen.
- `prefers-reduced-motion` respekteres overalt. Ingen informasjon finnes bare i en animasjon eller en rulleeffekt.
- Trykkflater er minst 44 × 44 px. Knappetekst brytes ikke.
- Fokus er alltid synlig (dagens gulv i `globals.css` beholdes) med `{colors.primary}`, som har minst 7:1 mot flatene.
- Følge-Buddy og dekor er `aria-hidden`, og alt de sier, står også i innholdet.
- Morsmål: høyre-til-venstre-språk vises med riktig retning (FR-25). Telefontesten fant at arabisk og polsk ikke åpnet seg ved trykk, og det er en feil som rettes i bygget, ikke et designvalg.

## Responsive & Platform

| Bredde | Oppførsel |
|---|---|
| ≥ 761 px | Arbeidsbordet er ett bord med bunkene spredt utover, og viften er en ellipse. Landingssiden har fagorddemoen i to kolonner. |
| ≤ 760 px | Bordet blir en kolonne. Hovedbunken ligger øverst, de små bunkene i en vannrett rullerad og «Legg en ny tekst på bordet» under. Viften legger kortene i forskjøvne par nedover under bunken. Menyen i topplinjen skjules, og «For lærere» skjules på landingssiden. Følge-Buddy blir mindre. |

## Inspiration & Anti-patterns

- **Hentet fra en pen Notion-side:** lyse flater, mye luft, typografi som hierarki og få sterke farger.
- **Hentet fra skrivebordet:** tekstene ligger som bunker du kan ta opp og spre utover, ikke i et vanlig rutenett.
- **Valgt bort, Duolingo:** for barnslig. Buddy er en figur, men leken og lavmælt, og aldri maskot på hver flate.
- **Valgt bort, Spotify og Discord:** for mørke og seriøse. Mørk modus er et valg, ikke grunntonen.
- **Valgt bort, platte skoleapper:** de fleste utdanningsapper oppleves som kjedelige. LeseBuddy skal ha signatur.

## Key Flows

### Flyt 1: Tor finner LeseBuddy (lærer, naturfag på yrkesfag, en ettermiddag etter skolen)

1. Tor får lenken fra en kollega og åpner den på PC-en.
2. Han møter «Forstå mer av det du *leser*.» over hele bredden og leser ingressen: eleven leser selv, og Buddy hjelper med fagordene, spørsmålene og samtalen.
3. Han ruller. «Slik hjelper Buddy deg» dukker fram steg for steg: før, mens og etter lesingen.
4. Eksempelteksten om celledeling blir stående mens han ruller, og fagordene lyser opp ett for ett med forklaring.
5. **Klimaks:** Under «For lærere» står «Svaret kommer ikke først». Tor kjenner igjen akkurat det han er redd for med KI-verktøy, at elevene hopper over lesingen, og ser at dette er bygd for det motsatte. Han bestemmer seg for å la klassen prøve.

Feil: Tor trykker «Registrer deg», men har ingen kode. Siden sier at registrering krever en kode fra læreren. `[ÅPENT SPØRSMÅL]` Hvordan en lærer får koder, er ikke bestemt. PRD-en har ingen lærerpålogging (§2.2).

`[ANTAKELSE]` Navnet Tor og rollen er et forslag. Utvikleren omtalte læreren som «han».

### Flyt 2: Jonas fortsetter (elev Vg1 bygg og anlegg, PRD §2.3, på telefonen i friminuttet)

1. Jonas åpner LeseBuddy. Han er innlogget fra før, og kommer rett til arbeidsbordet: «Hei, Jonas. Du holdt på med Celledeling i går.»
2. Øverst ligger Celledeling-bunken med «Sist brukt» og «Neste: Ta quizen». Under ligger de fire andre tekstene hans i en rad han kan rulle sidelengs.
3. Han trykker på bunken. Den vifter seg ut: Teksten («Klar til lesing · 14 fagord»), Quiz («Ikke tatt»), Øvekort («9 av 14 kan du»), Fagsamtale («Ikke startet») og Minnevers («Ikke laget»).
4. Han trykker på Quiz. Buddy dukker opp med øynene som leser: «Buddy lager quizen din … Det tar som regel 10–20 sekunder.»
5. **Klimaks:** Buddy blunker, brillene vipper til en B, og «Quizen er klar» står der. Jonas har ikke lett etter noe eller limt inn noe på nytt. Bordet husket hvor han var, og neste steg var ett trykk unna.

Feil: Kallet til språkmodellen feiler. Øynene stopper, og meldingen sier «Buddy fikk ikke laget quizen nå. Prøv igjen om litt.» med knappen «Prøv igjen». Arbeidsbordet og statusene er uendret.

### Flyt 3: Jonas legger en ny tekst på bordet

1. Fra arbeidsbordet trykker Jonas «+ Ny tekst».
2. Han limer inn kapittelet om fotosyntese. Innlimt tekst hopper over gjennomsynet av hele teksten (FR-3, endret 11.11), så han går fra overskriftskontrollen rett til aktiveringen.
3. Han skriver hva han tror teksten handler om, og leser med fagordene markert. Brilleknappen følger med nedover, så han kan gjøre teksten større uten å rulle opp.
4. **Klimaks:** Neste gang han åpner appen, ligger Fotosyntese øverst på bordet som «Sist brukt», og Celledeling har flyttet seg ut til siden.

## Åpne punkter

- **Ordmerket:** 4d er valgt foreløpig. 4e og 4g er fortsatt alternativer.
- **Lærerkoder:** Hvordan en lærer får invitasjonskoder, er utenfor designfasen og notert i `.logs/arve/issues.md`.
- **PRD-oppfølging** etter Bård Pettersens tilbakemelding: UJ-1 må følge FR-3 slik den er nå, og KI-feil må bli krav. Notert i `.logs/arve/issues.md`.

Avgjort 13.11: alle tre rulleeffektene (A, B, C) beholdes, og palettbryteren i appen utgår.
