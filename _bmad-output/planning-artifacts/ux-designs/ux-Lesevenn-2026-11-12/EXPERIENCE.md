---
name: LeseBuddy
status: final
updated: 2026-11-18
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
- Samlinger (FR-49)
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
| **Arbeidsbord** (FR-48) | `/` med innlogging, ordmerket, menyen | Siste tekst og neste steg, de fem siste tekstene eller mappene som bunker (Tekster i en Mappe ligger under Mappen, runde 3, bolk 5, 23.11), og vei til ny tekst og Samlinger |
| **Samlinger** (FR-49; het «Samlingen» til 23.11) | Menyen, «Se alle N tekstene i Samlinger» | Alle tekstene, med søk, sortering og sletting. Gjenbruker dagens tekstliste fra startsiden (FR-36, FR-37) |
| **Ny tekst** | «+ Ny tekst», «Legg en ny tekst på bordet» | Innlesing (FR-1, FR-2, FR-44). Det som er startsiden i dag, flyttet til egen side |
| Tekstens løype | En bunke, et aktivitetskort, neste steg | Aktivering → (gjennomsyn for PDF og bilde) → Lesevisning → Quiz, Øvekort, Fagsamtale, Minnevers. Sidene finnes i dag under `/tekst/[id]/…` |
| Konto | Kontolenken i topplinjen | Uendret (sletting FR-37, innstillinger), og «Utseende»: lys eller mørk modus, og «Venstrehendt» for øvekortene (se State Patterns, Gjelder overalt) |

**Adressene** `/samling` og `/ny` er forslag (`[ANTAKELSE]`). Arkitekturen avgjør de endelige.

**Siden `/tekst/[id]/oppgaver` beholdes.** Den er målet når viften ikke kan brukes (uten JavaScript, og som reserve i kuttrekkefølgen nedenfor), og den viser de samme fem aktivitetene som en vanlig liste.

`[MERKNAD TIL ARKITEKTUR]` I dag sender `tilgang()` alle som ikke er innlogget til `/logg-inn`. Det gjør den ved å kaste. Landingssiden på `/` må derfor sjekke økten *uten* å kaste, og vise arbeidsbordet bare når eleven er innlogget. AD-8 gjelder fortsatt: tilgang til data sjekkes i datatilgangslaget.

`[MERKNAD TIL ARKITEKTUR]` «Sist aktiv» trengs for å velge hvilke fem bunker som ligger på bordet og hvilken som er hovedbunke (se State Patterns). Datamodellen har ingen slik tid i dag. Anbefalingen er et felt på Teksten som oppdateres ved hver aktivitet.

**Visuelle referanser:** Flyt 1 vises i [mockups/landingsside-1.html](mockups/landingsside-1.html), Flyt 2 og viften i [mockups/arbeidsbord-1.html](mockups/arbeidsbord-1.html). Samlinger og Ny tekst har ingen mock. De bygges etter dette dokumentet. Mockene er visuelle utkast. Oppførselen og tilgjengeligheten følger dette dokumentet, ikke koden i mockene, og dokumentet gjelder ved uenighet.

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
| **Topplinje** | Alle sider | Ordmerket lenker til `/`. Menyen har «Arbeidsbord» og «Samlinger» (endret 23.11), og aktivt valg har `aria-current="page"`. Kontolenken heter «Konto». På telefon står «Samlinger» og «Konto» fortsatt synlig, mens «Arbeidsbord» nås via ordmerket. Ingen meny skjules uten erstatning. |
| **Ordmerke** | Topplinjen, landingssiden | `<a href="/">` med navnet «LeseBuddy, forsiden» for skjermlesere. Delene i merket er skjult for skjermlesere. |
| **Bunke** | Arbeidsbordet | Én bunke er én Tekst, og bunkene står i en liste (`<li>`). Tittelen er en overskrift. Bunken har én knapp, «Vis aktiviteter for {tittel}» (`aria-expanded`, `aria-controls`), som dekker hele bunken. Framdriften leses som tekst («3 av 5 påbegynt»), og strekene er skjult for skjermlesere. Smalere enn 760 px er de små bunkene **striper** i full bredde (bolk 6): tittelen, framdriften og «N av 5». De er fortsatt bunker i `<ul>`, med samme knapp og navn, og uten JavaScript er de lenker til `/tekst/[id]/oppgaver`. Titlene brytes bare mellom ord. **Mappebunke** (runde 3, bolk 5, avgjort 23.11): en Mappe med minst én Tekst er én bunke. En Tekst som ligger i én eller flere Mapper, er ikke egen bunke, men ligger under hver Mappe den er i; Tekster uten Mappe er som før, og tomme Mapper ligger ikke på bordet. Mappebunken har en mappefane (flik øverst til venstre), merkelappen «Mappe» og «N tekster» i stedet for «lagt inn …». Knappen heter «Vis tekstene i mappen {tittel}», og uten JavaScript er den en lenke til `/mappe/{id}`. På telefon får stripen samme flik og «Mappe» foran tittelen. Forskjellen bæres av tekst, ikke bare form. |
| **Hovedbunke** | Arbeidsbordet | Teksten som sist var aktiv. Viser «Sist brukt» og en egen lenke for neste steg, lagt over bunken, ikke inne i knappen. Lenken går rett til steget, og resten av bunken åpner viften. Ligger Teksten i en Mappe, er Mappen hovedbunken (runde 3, bolk 5, 23.11): lenken gjelder Teksten, med tittelen først («EM-bølger: Neste: Ta quizen →»), og hilsenen og Buddys boble nevner Teksten, ikke Mappen. En Mappe er like aktiv som sin nyeste Tekst; ligger Teksten i flere Mapper, er den nyeste Mappen hovedbunken. |
| **Viften** | Arbeidsbordet | En dialog (`role="dialog"`, `aria-modal="true"`) med tittelen på teksten som overskrift og etikett. Den finnes ikke i DOM-en, eller har `hidden`, når den er lukket. Akkurat fem kort, alltid i denne rekkefølgen: Teksten, Quiz, Øvekort, Fagsamtale, Minnevers. Bunken flytter seg til midten, og kortene legger seg rundt den, regnet ut fra de målte størrelsene, så de aldri dekker bunken. Er det ikke plass, legger kortene seg i et rutenett under bunken. Resten av bordet får `inert`. Fokus flyttes til det første kortet og holdes i dialogen. «Legg sammen» og Esc lukker, og fokus går tilbake til bunkens knapp. Smalere enn 760 px er viften et **ark** som glir opp fra bunnen (`{motion.fan}`, bolk 6), med de fem aktivitetene som rader i samme rekkefølge. Det er den samme dialogen med de samme reglene: fokus på første rad, fokusfelle, `inert` på resten. Radene er lenker eller låste elementer etter reglene for kortene. «Legg sammen» står øverst i arket, så arket dekker den aldri. Arket er høyst 90 % av skjermen; er innholdet høyere, ruller arket, ikke siden. Det lukkes med «Legg sammen», Esc eller trykk på bakgrunnen, aldri med sveip eller dragging. Ved redusert bevegelse står arket bare der. **For en Mappe** (runde 3, bolk 5, 23.11) viser den samme dialogen først Mappens kort: Tekstene (tittel og «N av 5 påbegynt») og to kort for samlet øving, «Øvekort for hele mappen» (`/mappe/{id}/oevekort`) og «Quiz for hele mappen» (`/mappe/{id}/quiz`). Fokus på det første kortet. Velges en Tekst, viser dialogen dens fem aktivitetskort som over, med knappen «Tilbake til mappen» øverst (til venstre for «Legg sammen»), og fokus på det første aktivitetskortet. «Tilbake til mappen» viser Mappens kort igjen, med fokus på tekstkortet eleven kom fra. Esc og «Legg sammen» lukker fra begge nivåene, og fokus går til mappebunkens knapp. Viften åpner alltid på Mappens kort. |
| **Aktivitetskort** | Viften | Et åpent kort er en lenke til aktiviteten, med status fra data (se State Patterns). Et låst kort er ikke en lenke, men et element med teksten «Låst. Åpnes når du har lest teksten.». Det står på sin faste plass og leses opp i rekkefølgen. |
| **Tenkeindikator** | Overalt hvor appen venter på språkmodellen i mer enn to sekunder (PRD §5) | En statusregion (`aria-live="polite"`) finnes tom i siden *før* ventingen starter, og statusteksten skrives inn i den. Øynene leser i en løkke til svaret kommer. Gir kallet feil, prøver appen én gang til automatisk (PRD §5). Forsøket skjer stille på serveren, og indikatoren fortsetter uten egen status, fordi en serverhandling ikke kan sende status underveis. Tillegget etter 30 sekunder dekker den lengre ventingen. Når svaret kommer, vises innholdet med en gang, avslutningen spilles i indikatorens plass, og fokus flyttes til overskriften på det nye innholdet. **Når svaret bytter side eller innhold** (17.11): sender handlingen eleven til en ny side, eller byttes innholdet der indikatoren sto, forsvinner indikatoren. Da gir den avslutningen videre til en vert i rotlayouten, som lever videre gjennom navigeringen og spiller den med stedets ferdigstatus: «Teksten er klar.» (aktiveringen av innlimt tekst, gjennomsynet og ny låsing; kunne fagordene ikke lages, havner eleven på lesevisningen med feilen og «Prøv igjen», og da spilles ingen avslutning), «Fagordene er klare.» (fagord på nytt), «Quizen er klar.», «Oppsummeringen er klar.», «Verset er klart.», «Bildene er lest.», «Det første spørsmålet er klart.», «Buddy har lest svaret ditt.» (svar og «Prøv igjen» på vurderingen), «Buddy har lest svaret ditt på nytt.» og «Neste spørsmål er klart.». Verten har én statusregion som finnes tom fra første tegning. Den flytter ikke fokus (fokus følger siden som før) og holder aldri igjen navigeringen. Det gjelder flaten og knappen, ikke linjen, og ikke rettingen av quizen (`bareAvslutning`), som spiller avslutningen på plassen og gir den aldri videre. Det gis ikke videre ved feil: blir indikatoren stående, går den bare tilbake. Steder som selv vet svaret (quizen som lages, fagord på nytt, «Prøv igjen» og ny vurdering i fagsamtalen, bildeinnlesingen) gir videre først når kallet har lyktes, og «Prøv igjen» fjerner samtidig den gamle feilen fra adressen (`feil`, `kode`, `fagordfeil`), så den ikke stopper senere svar. Et skjema som venter på serveren, kan ikke vite svaret og gir videre bare når skjemaet ikke fikk en feil tilbake og siden eleven havner på ikke har `feil` eller `fagordfeil` i adressen. **Forlat-vernet:** trykker eleven en lenke eller går tilbake mens Buddy tenker, er det ikke svaret som byttet siden, og ingen avslutning spilles. *Kjente begrensninger:* en serverhandling som kaster (i stedet for å svare med en feil) kan ikke skilles fra et svar, fordi appen ikke har `error.tsx`, så da kan avslutningen spilles likevel; og en navigering som verken er et lenketrykk eller «tilbake», fanges ikke av forlat-vernet. Etter 30 sekunder står det i tillegg «Dette tar lenger tid enn vanlig. Buddy jobber fortsatt.» Ved bildeinnlesing sier statusen hvilket steg den er på: «Leser bilde 2 av 4 …». **Tre former** (bolk 5), med mini-Buddy M1 (samme tegning, bare mindre og beskåret til brillene), og reglene over gjelder i alle: *Flate* (64 px) der innholdet kommer, for quizen som lages, fagordene, etikettene, første spørsmål i fagsamtalen og bildeinnlesingen. Smalere enn 760 px er flaten en **tenkepille** som ligger fast nederst på skjermen (mini-Buddy med brillene 28 px høye), fordi eleven ellers ruller bort fra den. Pillen ligger over innholdet, men siden får like mye luft nederst (`padding-bottom`, og `scroll-padding-bottom` for fokus), så den dekker aldri en knapp, en lenke eller fokusert innhold. Den er synlig mens Buddy tenker og under avslutningen, og glir så bort. Med redusert bevegelse forsvinner den uten bevegelse. En avslutning gitt videre til verten spilles i pillen, på samme sted som pillen sto. På 760 px og bredere er det aldri en pille mens Buddy tenker. Etter at siden er byttet, spiller verten avslutningen i et lite fast kort nederst til høyre (64 px og statusen), som bare vises under avslutningen (beslutning 17.11). *Knapp* (brillene 20 px høye) for korte ventinger, som svar og ny vurdering i fagsamtalen og rettingen av quizen: Buddy sitter i knappen som ble trykket, med statusen som knappetekst. Knappen er låst med `aria-disabled`, så fokus blir stående på den, men tones ikke ned. Gir kallet feil, går knappen tilbake, og feilmeldingen vises. *Linje* (brillene 22 px høye) foran én statuslinje, for oversettelser i bakgrunnen (FR-29-merknaden er uendret). Statusregionen er den samme i alle formene: den finnes tom før ventingen, det er bare én region per indikator, og pillen er ikke en ekstra region. |
| **Feilmelding** | Alle KI-kall og alle feil | `role="alert"`. Sier hva som ikke ble laget, at det eleven har skrevet er lagret, og har «Prøv igjen». Fokus flyttes til «Prøv igjen». Gjelder FR-7, FR-13, FR-19 og FR-20. |
| **Tusjstrøket** | Sidetitlene med tekstnavnet og «leser» på landingssiden (design runde 2, bolk 10, 18.11) | Hvert ord i navnet får et rosa strøk bak den nederste delen. Strøkene tegnes inn én gang når siden lastes, ord for ord, og siste ord venter høyst om lag et halvt sekund. Løse tegn som «–» får ikke strøk, og harde mellomrom holder ord sammen. Overskriften leses som før («Quiz: Bedrift»). Med redusert bevegelse står strøket bare der. I kontrastmodus er det en vanlig understrek. Aldri på lenker eller knapper. |
| **Øvekortene** | Øvekortsiden (FR-16, FR-17; design runde 2, bolk 9, 18.11; endret 23.11; stor skjerm runde 3, bolk 3, 23.11) | Knappene er lagt for én hånd. «Må øve mer» og «Har kontroll» (het «Kan» til 23.11; lagret verdi er fortsatt `kan`) står over hverandre, like brede, over kortet til høyre, der tommelen når dem. Pilknappene ← og → står ved siden av hverandre under kortet; de heter «Forrige kort» og «Neste kort» for skjermleseren, og på siste kort viser høyre knapp «Ferdig». «Tilbake til mappen» (og «Tilbake til oppgavene» fra én Tekst) står øverst i sidens header, over overskriften. Tastatur: ← og → bytter kort (← gjør ingenting på første, → avslutter runden på siste), og mellomrom snur kortet. Tastene fanges bare mens kortene vises, aldri i skjemafelt eller med Ctrl/Alt/Meta, og mellomrom på en knapp, lenke eller «Se hvor det står i teksten» gjør det det alltid gjør, så kortet snus én gang, ikke to. Med «Venstrehendt» (se State Patterns, Gjelder overalt) står merkeknappene til venstre. Rekkefølgen for tastatur og skjermleser er logisk, ikke visuell: kortet, «Må øve mer», «Har kontroll», eventuell feilmelding fra merkingen, «Se hvor det står i teksten» (når kortet er snudd), «Forrige kort», «Neste kort». Plasseringen over kortet er bare utseende; fokusringen hopper derfor fra kortet opp til merkeknappene og så ned til navigasjonen. Det er godtatt fordi merkingen hører til kortet eleven nettopp har lest. Feilmeldingen står over kortet sammen med knappene, så den havner ved knappen eleven trykket på. **Stor skjerm (fra 760 px, avgjort 23.11):** kortet er opptil omtrent 960 px bredt, og «Må øve mer» og «Har kontroll» står nederst inne i kortet, side om side: «Må øve mer» til venstre, «Har kontroll» til høyre, byttet om med «Venstrehendt». Kortet er en knapp og kan ikke inneholde knapper, så «inne i kortet» er en felles ramme rundt kortknappen, feilmeldingen og merkeknappene; et klikk på rammen utenfor knappene snur kortet. Feilmeldingen fra merkingen står i rammen rett over knappene. Med stor tekst brytes knappene til to rader i rammen. Tilbakelenken står nederst på siden, venstrejustert og lenger ut mot kanten enn kortet, og ruller med siden; øverst vises den ikke. Bare én av de to lenkene er synlig og i tilgjengelighetstreet om gangen. Rekkefølgen for tastatur og skjermleser er den samme, og tilbakelenken kommer etter pilene. Under 760 px er alt som over. Merkingen, rundene og kilden er uendret. |
| **Brilleknapp** | Lesevisningen | Flytende knapp oppe til høyre som følger med når eleven ruller. Den åpner leseinnstillingene (FR-12) som en dialog (`aria-haspopup="dialog"`, `aria-expanded`). Dette kommer fra telefontesten, der det var tungvint å rulle opp til innstillingene. Knappen heter «Leseinnstillinger», og teksten vises ved siden av på brede skjermer. Lesevisningen setter av plass (`scroll-padding`, `padding-inline-end`), så knappen aldri dekker tekst eller et Faguttrykk som har fokus. |
| **Faguttrykk og forklaring** | Lesevisningen | Uendret i oppførsel (FR-9, FR-10). Forklaringspanelet er større og har egen bakgrunn, slik telefontesten ba om, og skaleres med leseinnstillingene. |
| **Merking av overskrifter** | Aktiveringen (FR-6, endret 17.11.2026, merkene 18.11, glideren 23.11) | Over overskriftene står ett spørsmål, «Hva vet du om dette fra før?», én gang og ikke inne i hver gruppe. Hver overskrift er en `fieldset` med overskriften som `legend`. **Glideren (23.11):** per overskrift en glider (`<input type="range">`) med tre trinn, «Ingenting ennå» (venstre) – «Litt» – «Mye» (høyre), med trinnmerkene synlige under sporet, og under den, sentrert, av/på-knappen «Skjønner ikke overskriften» (`aria-pressed`). Glideren er navngitt av overskriften og beskrevet av spørsmålet (`aria-describedby`; instruksen står over og leses ikke på nytt for hver overskrift), og `aria-valuetext` er trinnets navn. *Urørt er ikke merket:* håndtaket står dempet (hult) i midten, glideren sier «Ikke merket ennå» (synlig og som `aria-valuetext`), og ingenting sendes. Overskriften teller først når eleven drar, klikker eller trykker på glideren eller bruker tastaturet: → fra urørt er «Mye», ← er «Ingenting ennå», og «Litt», der håndtaket allerede står, velges med klikk på håndtaket eller mellomrom/Enter. Med skjermleser på telefon flytter sveip opp/ned glideren ett trinn, og dobbelttrykk velger trinnet håndtaket står på («Litt» fra urørt). *«Skjønner ikke» overstyrer:* på sendes `uklar`, og glideren dempes og sier «Satt til side». Av igjen, eller rører eleven glideren, gjelder glideren (og knappen går av): urørt hvis den aldri ble rørt, ellers sin verdi. Tab går glideren, «Skjønner ikke overskriften», neste overskrift. Minst 44 px trykkflate, synlig fokus, lys og mørk modus, tvungne farger og 320 px med 200 % tekst (trinnmerkene brytes heller enn å skyve siden ut). Kodene er de samme som før (`nytt`, `litt`, `kjent`, `uklar`), så merker lagret før 23.11 vises som før. Glideren krever skript og er låst (`disabled`) til skriptet har lastet: uten skript sendes ingen merker, og et tomt skjema gir oppfordringen og slipper eleven videre, som før. *Før 23.11* var merkene fire radioknapper som så ut som sekundærknapper og virket uten skript; tre av dem var en skala, men så ikke slik ut. Morsmålslinjen står under overskriften. Under gruppene står ett valgfritt felt, «Noe du lurer på før du leser?» (høyst 500 tegn). Ingenting vurderes. Sender eleven uten merke og uten spørsmål, kommer ÉN oppfordring, og «Videre» en gang til slipper henne videre. Teksten låst og siden åpnet igjen: spørsmålet og overskriftene med elevens merke, uten skjema. «Før du leste» bruker de samme ordene: «Du visste mye om …», «Du visste litt om …», «Du visste ingenting om dette fra før: …» og «Denne/Disse overskriftene skjønte du ikke: … Gir den/de mening nå?». Endret fordi utviklerens test viste at det frie feltet «Hva tror du teksten handler om?» ikke satte i gang noe, og svaret ble aldri vist igjen. |
| **Før du leste** | Lesevisningen, rett før «Ferdig med å lese?» (FR-6) | Viser spørsmålet («Du lurte på: …»), så «Fikk du svar?» med en lenke som heter «Til fagsamtalen» og går til oppgavesiden (`/tekst/[id]/oppgaver`), der fagsamtalen startes, deretter overskriftene som var helt nye («Helt nytt for deg før du leste: …»), overskriftene eleven ikke skjønte («Disse overskriftene skjønte du ikke: … Gir de mening nå?», 18.11) og én linje for de kjente. «Fikk du svar?» lagres ikke, og Buddy svarer ikke på spørsmålet. Tekster fra før 17.11 viser «Før du leste, skrev du: …». Har teksten ingenting, vises ikke delen. Ingen markering av helt nye avsnitt inne i teksten. |
| **Tekstrad** | Samlinger | Dagens liste fra startsiden (FR-36), flyttet. Hver rad viser tittelen, som er en lenke til neste steg (samme regel som hovedbunken), tilstanden i klartekst og datoen teksten ble lagt inn. Søkefeltet søker i titler, og sorteringen er «Nyeste først» eller «Eldste først» (standard: nyeste). Søk og sortering ligger i adressen og virker uten JavaScript, som i dag. Slett-knappen ber om bekreftelse og navngir teksten og alt som forsvinner (FR-37). Har eleven mapper, har raden også «Legg i mappe» (lagt til 23.11): en utfellbar del med valg av mappe og knappen «Legg i mappen», som virker uten JavaScript. Mappene teksten alt ligger i, står som «(alt med)» og kan ikke velges. Fra 760 px står raden i en smal kolonne og stables: tittel, tilstand og dato, neste steg, så knappene («Legg i mappe» og «Slett»); raden kan da også dras til en mappe. |
| **Følge-Buddy** | Bare landingssiden, bredde 760 px og mer | Dukker opp nede i hjørnet når heroen er rullet forbi. Øynene leser i takt med rullingen. Snakkeboblene er korte ekko av seksjonsoverskriftene, de brytes over linjer, og de er bare pynt (`aria-hidden`). Vises ikke på telefon eller ved stor tekst. |
| **Rulleeffekter på landingssiden** | Landingssiden | **Den statiske versjonen er grunnlaget.** Den er HTML fra serveren, med alle steg synlige, alle fire Faguttrykk i eksempelteksten markert og forklaringene i en liste (`<dl>`) under teksten. Effektene legges oppå bare når JavaScript kjører og bevegelse er tillatt: **A** markerer fagordene ett for ett mens forklaringen ved siden av skifter, uten `aria-live`, og den klistrede visningen slås av når flaten er høyere enn synsfeltet. **B** er Følge-Buddy. **C** lar stegene dukke fram mens en linje tegnes nedover. Alle tre beholdes. **På telefon** (smalere enn 760 px, bolk 6) er effekt A av, og fagorddemoen er i stedet **trykkbar** når JavaScript kjører og bevegelse er tillatt: fagordene er knapper (`aria-expanded`, `aria-controls`) som viser forklaringen i et panel under teksten, med mini-Buddy (brillene 30 px høye) ved siden av. Fokus blir på ordet. `<dl>` skjules da bare visuelt, så skjermleseren har hele listen. Ingen `aria-live`, og panelet er aldri tomt: før eleven har trykket, står det «Trykk på et fagord i teksten, så forklarer Buddy det.». Uten JavaScript og ved redusert bevegelse er demoen den statiske versjonen. |
| **Buddy på arbeidsbordet** | Arbeidsbordet | Brilleansiktet med en boble som gjentar neste steg fra hovedbunken, for eksempel «Klar for en fagsamtale om Celledeling?». Den er pynt (`aria-hidden`), fordi neste steg allerede står på bunken. Fra 760 px står Buddy på bordet (64 px). Smalere enn 760 px hilser mini-Buddy (brillene 36 px høye) ved siden av «Hei!», med boblen ved siden av (bolk 6). Buddy står stille i begge, fordi ingenting annet enn tenking og viften animeres inne i appen. |

## State Patterns

### Inngang og arbeidsbord

| Tilstand | Flate | Behandling |
|---|---|---|
| Ikke innlogget | `/` | Landingssiden. Arbeidsbordet vises aldri uten innlogging. |
| Økten har løpt ut | Arbeidsbordet, løypen | Innloggingssiden med «Du er logget ut. Logg inn igjen for å fortsette.», og eleven kommer tilbake dit hun var etter innlogging. |
| Ny elev, ingen tekster | Arbeidsbordet | Tomt bord med Buddy (brilleansiktet) i midten: «Her blir tekstene dine liggende. Legg den første på bordet.» og én primærknapp, «+ Ny tekst». |
| 1–5 plasser *(endret 23.11, runde 3, bolk 5)* | Arbeidsbordet | Bordet har fem plasser, og de deles av Mapper med minst én Tekst og Tekster uten Mappe, sortert etter sist aktiv (en Mappe er like aktiv som sin nyeste Tekst). Er det fem eller færre slike bunker, ligger alle på bordet med hovedbunken først, uten tomme plasser. En Tekst i en Mappe teller ikke som egen plass; den nås fra hver Mappe den ligger i. «Samlinger» i topplinjen fører til hele listen. |
| Flere enn 5 plasser *(endret 23.11, runde 3, bolk 5)* | Arbeidsbordet | De fem bunkene (Mapper eller Tekster) som sist var aktive, ligger på bordet. «Se alle N tekstene i Samlinger» (N er alle Tekstene) vises når ikke alle Tekstene kan nås fra bordet, enten som egen bunke eller i en mappebunke. Ligger alle Tekstene i Mappene på bordet, vises den ikke, selv om det er flere enn fem Tekster. |
| Henting feiler | Arbeidsbordet | Bordet tegnes på serveren, så det finnes ingen egen lastetilstand. Feiler hentingen: «Vi fikk ikke hentet tekstene dine.» med «Prøv igjen». Feiler bare mappeoppslaget, vises bordet som før, med bare Tekstene, og feilen logges (runde 3, bolk 5, 23.11). |
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

Neste steg på hovedbunken og i Samlinger velges etter den første regelen som passer:

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
| Minnevers | Et vers finnes | «Ikke laget» eller «Laget». Kortet har alltid merket «Uferdig» ved navnet, også når det er låst (lagt til 16.11: versene holder ikke mål, se PRD FR-31). Oppgavesiden og minnevers-siden har samme merke, og minnevers-siden sier fra før eleven lager et vers. |

**Låst:** Før teksten er låst (`laast`), er Quiz, Øvekort, Fagsamtale og Minnevers låst, med teksten «Låst. Åpnes når du har lest teksten.». Sidene i koden krever det samme i dag.

### Tenkeindikatoren og KI-kall

| Tilstand | Behandling |
|---|---|
| Buddy tenker | Tenkeindikatoren med statustekst i statusregionen. Teksten sier hva som lages og omtrent hvor lenge det tar. Lange kall deles opp i steg (PRD §5). |
| Nytt forsøk | Skjer stille på serveren (`kjoerGenerator`), for ugyldig svar, tidsavbrudd og modellfeil. Indikatoren fortsetter med samme status, og eleven merker bare litt lengre ventetid. Etter 30 sekunder kommer det vanlige tillegget. Avgjort 16.11. |
| Svaret er klart | Innholdet vises med en gang, og avslutningen spilles i indikatorens plass, eller av verten i rotlayouten når siden eller innholdet er byttet. Statusen sier hva som er klart («Teksten er klar.», «Quizen er klar.», «Buddy har lest svaret ditt.», se Tenkeindikator). Fokus flyttes til overskriften på innholdet. |
| Lang venting (over 30 s) | Statusen får tillegget «Dette tar lenger tid enn vanlig. Buddy jobber fortsatt.» |
| KI-kallet feiler etter nytt forsøk | Øynene stopper, og feilmeldingen tar over (se Component Patterns). FR-19: runden telles ikke. FR-20: vurderingen beholdes når bare oppfølgingen feiler. |

### Ny tekst og gjennomsynet

Endret etter telefontesten 18.11 (design runde 2, bolk 7).

| Tilstand | Behandling |
|---|---|
| Fanene | Tre like brede faner på én rad: «Lim inn», «PDF» og «Bilder» (`role="tablist"`, `tab`, `aria-selected`). De står på én rad fra 320 px, også med 200 % tekst. Fanene kan krympe, og et navn kan deles inne i fanen, men fanene brytes aldri til to rader. |
| Bilder, ingenting eller ett bilde valgt | Boksen «**Før** du tar bildene» (FR-44): høyst 4 bilder (`BILDEGRENSER.maksBilder`), én side per bilde rett ovenfra i godt lys, og at bildene ikke lagres. «Før» er fet, i farge og understreket (ikke farge alene). Boksen har tydelig ramme og amber flate, som merknaden om minneverset, og samme stil i mørk modus. |
| Bilder, to eller flere valgt | «Før»-boksen er borte. Rett over listen med pilene står i samme stil: «**Etter** at du har valgt bildene: Sjekk at sidene står i riktig rekkefølge. Bruk pilene for å flytte dem.» Under står kort: «Høyst 4 bilder. Bildene lagres ikke, bare teksten.» Byttet leses opp av en statusregion som finnes fra før. Fjernes bildene ned til ett, kommer «Før»-boksen tilbake. |
| Gjennomsynet, tekst lest fra bilder | Merknaden (FR-45): «Når du laster opp bilder, hender det at Buddy leser feil. Les gjennom teksten under for å se at den er lik teksten du tok bilde av. Rett det som er feil før du går videre.» Til venstre for teksten står Buddy på 64 px med uttrykket *unnskyld* (bolk 10, DESIGN.md logo-mark): blikket ned, pupillene flakker sakte, og bekymrede bryn er løftet inn mot midten. Med redusert bevegelse står Buddy stille. Buddy er skjult for skjermlesere; teksten bærer beskjeden. Gjennomsynet for PDF er uendret, og innlimt tekst har ikke gjennomsyn (FR-3). |

### Bruksgrenser

Grensene står i PRD §6.4. Handlingene vises ikke som deaktiverte. Når eleven trykker, forklarer appen hva som er nådd:

| Grense | Hvor | Melding |
|---|---|---|
| 5 nye tekster per døgn | Ny tekst, før innlesingen vises | «Du har lagt inn 5 tekster i dag. Du kan legge inn flere i morgen.» Lenke til arbeidsbordet. |
| 5 nye fagsamtaler per døgn | Fagsamtale-kortet og neste steg | Som statusen for Fagsamtale i tabellen over. Påbegynte samtaler kan fortsettes. |
| Dagstaket for hele appen (30 kr) | Der et nytt KI-kall skulle startet | I stedet for tenkeindikatoren: «LeseBuddy har nådd dagens grense for nye oppgaver. Alt du har laget, kan du fortsatt åpne. Prøv igjen i morgen.» |

### Samlinger

| Tilstand | Behandling |
|---|---|
| Ingen tekster | «Du har ingen tekster ennå.» med «+ Ny tekst». |
| Søk uten treff | «Ingen titler inneholder «{søk}».» med «Vis alle». |
| Mange tekster | Alle står på én side i v1, med nyeste først (`[ANTAKELSE]`: en elev har ikke hundrevis av tekster). |
| Slette | Bekreftelse som navngir teksten og sier at quiz, øvekort, fagsamtale og vers forsvinner med den (FR-37). |
| Sletting feiler | «Teksten ble ikke slettet. Prøv igjen.» Teksten står fortsatt i listen. |
| Legge i mappe (23.11) | Med «Legg i mappe» eller, fra 760 px, ved å dra teksten til mappekortet. Mens teksten dras, får alle kortene stiplet kant, og kortet den er over får heltrukken 2 px kant og en 3 px ring (box-shadow) i primærfargen, markeringsflaten og teksten «Slipp for å legge i mappen» i fet skrift (ikke bare farge). Etterpå sier en statusregion «‹tekst› ligger nå i ‹mappe›.», og antallet på kortet øker. Samme regler som på mappesiden. |
| Teksten ligger alt i mappen | Ingenting endres. Meldingen sier «‹tekst› ligger alt i ‹mappe›. Ingenting er endret.» I «Legg i mappe» kan slike mapper ikke velges. |
| Mappen er full (8 tekster) | Ingenting endres. Feilmelding: mappen har 8 tekster, hvorfor grensen finnes, og at eleven kan ta ut en tekst eller lage en ny mappe (§5). |
| Ingen mapper | Verken «Legg i mappe» eller dra og slipp. «Ny mappe»-skjemaet står i mappedelen. |

### Gjelder overalt

| Tilstand | Behandling |
|---|---|
| Redusert bevegelse | Øynene står stille mens Buddy tenker, og statusteksten bærer beskjeden. Avslutningen viser B-en direkte, og tenkepillen kommer og går uten å gli. Landingssiden vises i den statiske versjonen, også fagorddemoen på telefon. Viften åpner seg uten å fly, og arket på telefon står bare der. Myk rulling og overganger er slått av. |
| Mørk modus | Eleven velger under «Utseende» på kontosiden: «Følg enheten» (standard), «Lys» eller «Mørk». «Følg enheten» følger systeminnstillingen (`prefers-color-scheme`). «Lys» og «Mørk» overstyrer systemet, både fargene og `color-scheme`, så skjemafelt og rullefelt også bytter. Valget settes på serveren, så siden har riktig modus fra første tegning. Det er et vanlig skjema med radioknapper og «Lagre», og virker uten JavaScript. Valget lagres i en informasjonskapsel på enheten (ikke på kontoen), så det gjelder bare der det ble gjort. Det finnes ingen bryter i topplinjen eller på landingssiden. Bryterne i mockene er bare til gjennomsyn. |
| Venstrehendt | Eleven krysser av for «Venstrehendt» under «Øvekortene» på kontosiden og trykker «Lagre». Da står «Må øve mer» og «Har kontroll» til venstre over øvekortet i stedet for til høyre; på stor skjerm, der de står nederst i kortet, byttes de om (23.11). Ingen andre sider speiles. Valget lagres som temaet: i en informasjonskapsel på enheten (ikke på kontoen), satt på serveren, så siden er riktig fra første tegning, og som `data-hand="venstre"` på `<html>`, så andre sider kan bruke det senere. Det er et vanlig skjema og virker uten JavaScript. Både temaet og «Venstrehendt» slettes når eleven logger ut eller sletter kontoen, så neste elev på en delt PC ikke arver dem. |

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
| 760 px og bredere | Arbeidsbordet er ett bord med bunkene spredt utover, og viften legger kortene rundt bunken. Landingssiden har fagorddemoen i to kolonner, og Følge-Buddy og Buddy på bordet vises. Samlinger er todelt (23.11): søket og tekstene til venstre (om lag 30 %), mappene som kort i et rutenett til høyre (om lag 70 %) med «Ny mappe» under. Mappene står først i kildekoden, så Tab går gjennom dem før tekstene. En tekstrad kan dras til et mappekort når eleven har mapper. |
| Smalere enn 760 px | Bordet blir en kolonne (bolk 6, utkast C–E). Mini-Buddy (36 px) hilser ved siden av «Hei!» med neste steg i en boble. Hovedbunken ligger øverst, de små bunkene som striper i full bredde (tittelen, framdriften og «N av 5»; en mappestripe har flik, «Mappe» foran tittelen og «N tekster», runde 3, bolk 5, 23.11), og «Legg en ny tekst på bordet» under. Viften er et ark som glir opp fra bunnen, med aktivitetene som rader (for en Mappe: Tekstene og de to samlede kortene, så Tekstens aktiviteter med «Tilbake til mappen»). Topplinjen viser ordmerket, «Samlinger» og «Konto». Lenken «For lærere» i topplinjen skjules, men lærerdelen på landingssiden står. På landingssiden er fagorddemoen trykkbar, og effekt A er av. Følge-Buddy og Buddy på bordet vises ikke. Ingen bevegelse går utenfor skjermen eller gir sidelengs rulling (sjekket med filmstriper på 375 px). Samlinger er én kolonne med mappene øverst, så søket og tekstene (uendret 23.11); «Legg i mappe» står på hver rad, og ingen rad kan dras. |

## Kuttrekkefølge

Fra PRD §9.3, med reserveløsning for hvert steg:

1. **Uten rulleeffekter:** landingssiden vises i sin statiske versjon (se Component Patterns).
2. **Uten vifte:** hver bunke er en lenke til `/tekst/[id]/oppgaver`.
3. **Uten arbeidsbord:** Samlinger er startsiden for innloggede.

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
2. Øverst ligger Celledeling-bunken med «Sist brukt» og lenken «Neste: Ta quizen». Under ligger de fire andre tekstene hans som striper, og Buddy ved «Hei!» spør «Klar for quizen om Celledeling?».
3. Han trykker på bunken. Viften glir opp som et ark fra bunnen av skjermen: Teksten («Klar til lesing · 14 fagord»), Quiz («Ikke tatt»), Øvekort («9 av 14 kan du»), Fagsamtale («Ikke startet») og Minnevers («Ikke laget»).
4. Han trykker på Quiz. Buddy dukker opp med øynene som leser: «Buddy lager quizen din … Det tar som regel 10–20 sekunder.»
5. **Klimaks:** Quizen dukker opp med en gang svaret kommer, mens Buddy blunker og brillene vipper til en B. Jonas har ikke lett etter noe eller limt inn noe på nytt. Bordet husket hvor han var, og neste steg var ett trykk unna.

**Feil:** Kallet til språkmodellen feiler to ganger. Øynene stopper, og meldingen sier «Buddy fikk ikke laget quizen nå.» med «Prøv igjen», som får fokus. Arbeidsbordet og statusene er uendret.

### Flyt 3: Jonas legger en ny tekst på bordet (UJ-1, FR-48)

1. Fra arbeidsbordet trykker Jonas «+ Ny tekst».
2. Han limer inn kapittelet om fotosyntese og kontrollerer overskriftene.
3. Han svarer på «Hva vet du om dette fra før?» for hver overskrift med glideren «Ingenting ennå» – «Litt» – «Mye», eller trykker «Skjønner ikke overskriften» (23.11), og skriver det han lurer på. Fordi teksten er limt inn, går han rett til lesingen etterpå: fase 3b (gjennomsynet av hele teksten) hoppes over (FR-3).
4. Han leser med fagordene markert. Brilleknappen følger med nedover, så han kan gjøre teksten større uten å rulle opp.
5. **Klimaks:** Neste gang han åpner appen, ligger Fotosyntese øverst på bordet som «Sist brukt», og Celledeling har flyttet seg ut til siden.

**Feil:** Jonas har allerede lagt inn fem tekster i dag. Ny tekst sier «Du har lagt inn 5 tekster i dag. Du kan legge inn flere i morgen.» før han har limt inn noe, så han mister ikke arbeid.

### Flyt 4: Jonas finner en gammel tekst før prøven (FR-49; på PC kvelden før)

1. Jonas trykker «Samlinger» i topplinjen.
2. Han skriver «celle» i søkefeltet. Listen viser Celledeling og Cellemembranen.
3. Han ser at Cellemembranen er en tekst han aldri brukte, og trykker «Slett». Bekreftelsen sier «Slette Cellemembranen? Teksten, quizen, øvekortene og fagsamtalen forsvinner.» Han bekrefter.
4. Han åpner Celledeling. Tittelen går rett til neste steg, «Øv videre med kortene».
5. **Klimaks:** På få sekunder har han funnet teksten fra september, ryddet bort den han ikke trengte, og står i øvekortene han skal bruke i kveld.

**Feil:** Han søker på «mitose», som ikke står i noen tittel. Samlinger sier «Ingen titler inneholder «mitose».» med «Vis alle».

### Flyt 5: Maria kommer i gang (UJ-4, FR-47, FR-48; ny elev med papirbok)

1. Maria har fått en kode av læreren. Hun åpner LeseBuddy på telefonen, møter landingssiden og trykker «Registrer deg».
2. Etter registreringen kommer hun til et tomt arbeidsbord: «Her blir tekstene dine liggende. Legg den første på bordet.»
3. Hun trykker «+ Ny tekst», velger «Bilder», tar to bilder av boka, sjekker rekkefølgen når «Etter at du har valgt bildene» ber om det, og følger statusen «Leser bilde 1 av 2 …», så «Leser bilde 2 av 2 …».
4. Hun kontrollerer overskriftene, merker hvor godt hun kjenner dem og retter uttrekket i gjennomsynet, slik UJ-4 beskriver.
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
