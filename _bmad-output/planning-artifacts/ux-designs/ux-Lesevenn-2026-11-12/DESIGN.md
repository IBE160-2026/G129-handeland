---
name: LeseBuddy
description: Visuell identitet for LeseBuddy (kodenavn Lesevenn), lesestøtte for videregående. Next.js med Tailwind CSS v4 og egne komponenter, uten komponentbibliotek. Lys og mørk modus.
status: draft
updated: 2026-11-13
sources:
  - ../../prd-lesevenn.md
  - ../../product-brief-lesevenn.md
  - ../../arkitektur-lesevenn.md
  - ../../../../maaling/resultater/telefontest-2026-11-09.md
colors:
  # Palett «Pop» med fiolett primærfarge. Kontrast er målt mot background og surface.
  background: '#FFF5F7'        # rosahvit
  surface: '#FFFFFF'
  border: '#F5DDE5'
  text: '#141A3A'              # 15,9:1 mot background
  text-muted: '#5A5670'        # 6,6:1
  primary: '#6427D6'           # 7,0:1 mot background; on-primary 7,5:1
  on-primary: '#FFFFFF'
  accent: '#FF4D9D'            # bare som flate, aldri som tekst (2,9:1)
  on-accent: '#141A3A'
  highlight: '#FFE0EE'         # fagordmarkering og forklaringspanel; text 13,8:1
  danger: '#B3261E'            # 6,1:1 mot background
  danger-surface: '#FDE7E9'    # text 14,4:1
  background-dark: '#0F1226'
  surface-dark: '#1A1E3A'
  border-dark: '#2C3158'
  text-dark: '#EEF0FF'         # 16,3:1
  text-muted-dark: '#A9AFD3'   # 8,6:1
  primary-dark: '#B79BFF'      # 8,1:1 mot background-dark; 7,1:1 mot surface-dark
  on-primary-dark: '#0F1226'
  accent-dark: '#FF7AB6'
  on-accent-dark: '#141A3A'
  highlight-dark: '#4A1F3A'    # text-dark 12,0:1
  danger-dark: '#FF8A80'       # 8,1:1
  danger-surface-dark: '#3D1A22'
typography:
  display:
    fontFamily: 'Gloock'
    fontSize: clamp(44px, 8.4vw, 108px)
    fontWeight: '400'
    lineHeight: '1.02'
    letterSpacing: -0.01em
  display-md:
    fontFamily: 'Gloock'
    fontSize: clamp(32px, 4.4vw, 48px)
    fontWeight: '400'
    lineHeight: '1.08'
  heading:
    fontFamily: 'Instrument Serif'
    fontSize: 44px
    fontWeight: '400'
    lineHeight: '1.05'
  heading-sm:
    fontFamily: 'Instrument Serif'
    fontSize: 28px
    fontWeight: '400'
    lineHeight: '1.1'
  body:
    fontFamily: 'Atkinson Hyperlegible'
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-lead:
    fontFamily: 'Atkinson Hyperlegible'
    fontSize: clamp(19px, 2vw, 24px)
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: 'Atkinson Hyperlegible'
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.5'
  label:
    fontFamily: 'Atkinson Hyperlegible'
    fontSize: 12px
    fontWeight: '700'
    letterSpacing: 0.09em
  wordmark-lese:
    fontFamily: 'Instrument Serif'
    fontWeight: '400'
  wordmark-uddy:
    fontFamily: 'Quicksand'
    fontWeight: '700'
rounded:
  sm: 6px
  md: 14px
  lg: 20px
  xl: 32px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 20px
  '6': 24px
  '8': 32px
  '10': 40px
  '12': 48px
  '18': 72px
  '24': 96px
  gutter-mobile: 16px
  gutter: 20px
  content-max: 1080px
  board-max: 1120px
  reading-measure: 70ch
  lead-measure: 62ch
components:
  button-primary:
    background: '{colors.primary}'
    foreground: '{colors.on-primary}'
    radius: '{rounded.md}'
    padding: 12px 20px
    fontWeight: '700'
  button-secondary:
    background: transparent
    foreground: '{colors.primary}'
    border: 2px solid {colors.primary}
    radius: '{rounded.md}'
  card:
    background: '{colors.surface}'
    border: 1px solid {colors.border}
    radius: '{rounded.lg}'
  board:
    background: '{colors.surface}'
    pattern: prikker 1px, 22px rutenett, text-muted på 22 % dekning
    radius: '{rounded.xl}'
  stack-main:
    width: 300px
    height: 210px
    border: 2px solid {colors.primary}
    radius: 18px
    title: '{typography.heading}'
  stack-small:
    width: 180px
    height: 126px
    radius: 18px
    title: '{typography.heading-sm}'
  activity-card:
    width: 168px
    minHeight: 118px
    background: '{colors.surface}'
    radius: 18px
    title: '{typography.heading-sm}'
  status-pill:
    background: '{colors.accent}'
    foreground: '{colors.on-accent}'
    radius: '{rounded.full}'
  fagord:
    background: '{colors.highlight}'
    underline: 2px {colors.primary}
    radius: 4px
    fontWeight: '700'
  explanation-panel:
    background: '{colors.highlight}'
    borderLeft: 5px solid {colors.primary}
    radius: 16px
    term: '{typography.heading-sm}'
  highlighter:
    background: '{colors.accent}'
    height: 0.34em
    rotate: -1.5deg
  logo-mark:
    stroke: '{colors.primary}'
    strokeWidth: 8.5 av 120
    lensFill: '{colors.highlight}'
    pupil: '{colors.text}'
  danger-message:
    background: '{colors.danger-surface}'
    foreground: '{colors.text}'
    accent: '{colors.danger}'
    radius: '{rounded.md}'
---

## Brand & Style

LeseBuddy er lesestøtte for elever på videregående. Eleven leser teksten selv, og Buddy hjelper med fagordene, spørsmålene og samtalen om det hun har lest. Uttrykket skal være **trendy, oversiktlig og lekent**, men verken trend eller lek får gå ut over fokus og lesbarhet. Lesevisningen er den viktigste flaten, og alt annet skal vike for den.

Referansene er hentet fra hva utvikleren ikke vil ha: de fleste skoleapper er platte og kjedelige, Duolingo er for barnslig, og Spotify og Discord er for mørke og seriøse. Nærmest kommer en pen Notion-side, det vil si lyse flater, god luft, typografi som bærer hierarkiet og noen få markerte farger.

**Navnet.** Utad heter appen *LeseBuddy*, og figuren kalles *Buddy*. Kode, repo, domenebegreper og planleggingsdokumenter beholder *Lesevenn*.

**Buddy** er en figur, ikke bare en logo: et par kraftige, firkantede briller med øyne bak glassene. Buddy leser, tenker og blunker. Når Buddy er ferdig, vipper brillene og blir til en B. Figuren er med når appen venter, når Buddy snakker, og på landingssiden, men aldri i selve teksten eleven leser.

**Ordmerket** (foreløpig valg) er «lese» i Instrument Serif kursiv i tekstfarge, deretter B-merket litt større enn bokstavene, og «uddy» i Quicksand 700 i `{colors.primary}`. Mellom «lese» og B-en er det 0,16 em luft, så «lese» leses som et forord og «Buddy» som ett fiolett ord. B-en og Quicksand har samme jevne strek og runde ender. Andre kandidater er fortsatt åpne: Instrument kursiv + Fredoka, og Instrument kursiv + Gloock.

## Colors

Paletten heter **Pop**. Den har rosahvit bakgrunn, fiolett primærfarge og rosa aksent, og en navy mørk modus.

- **Rosahvit bakgrunn (`#FFF5F7`) og hvite flater (`#FFFFFF`).** Varmere enn ren hvit, uten å bli rosa. Den kalde blåhvite bakgrunnen ble valgt bort.
- **Tekst (`#141A3A`)**, nesten svart blekkblå. Brødteksten holder minst 7:1 (AAA) mot alle flater i begge moduser.
- **Fiolett primærfarge (`#6427D6` / `#B79BFF`)** brukes til knapper, lenkestreker, merket, «uddy» i ordmerket, kanten på hovedbunken og fokusmarkering. Koboltblå ble valgt bort fordi utvikleren ikke likte fargen. Fiolett ligger nær rosa og beholder energien i Pop.
- **Rosa aksent (`#FF4D9D` / `#FF7AB6`)** brukes **bare som flate med mørk tekst oppå**: markeringstusjen under et nøkkelord, statuspiller og merkelappen «Sist brukt». Som tekstfarge er den uleselig i lys modus (2,9:1).
- **Markering (`#FFE0EE` / `#4A1F3A`)** brukes til fagord i teksten, forklaringspanelet og glassene i merket. Fargen betyr «her hjelper Buddy deg».
- **Feil (`#B3261E` / `#FF8A80`)** med en lys feilflate. Brukes bare til feilmeldinger, og alltid sammen med tekst som sier hva som skjedde, så fargen aldri bærer beskjeden alene.

Unngå: aksent som tekst, mer enn to kraftige farger på samme flate, fargeforløp og fargekoding uten tekst eller ikon i tillegg.

## Typography

Tre skrifter, med hver sin rolle:

- **Gloock** (`{typography.display}`, `{typography.display-md}`) er blikkfang: landingssidens hero og seksjonsoverskrifter. Den er tung og høylytt, og blir masete hvis den brukes overalt. Derfor brukes den ikke inne i appen.
- **Instrument Serif** (`{typography.heading}`, `{typography.heading-sm}`) brukes til sideoverskrifter inne i appen, som «Hei, Jonas», tittelen på en tekst, kortene på arbeidsbordet og ordet i en fagordforklaring. Den brukes i vanlig vekt, uten kunstig fortykning.
- **Atkinson Hyperlegible** (`{typography.body}`) brukes til all brødtekst, knapper og etiketter. Den er laget for lesbarhet, og leseinnstillingene (FR-12) skalerer den i lesevisningen.

Ordmerket har egne roller (`{typography.wordmark-lese}`, `{typography.wordmark-uddy}`). Quicksand brukes **bare** i ordmerket.

Linjelengden er om lag 70 tegn i lesevisningen (`{spacing.reading-measure}`) og høyst 62 tegn i ingresser (`{spacing.lead-measure}`). Etiketter (`{typography.label}`) står med store bokstaver og sperret skrift, og bare til korte merkelapper.

## Layout & Spacing

Avstandsskalaen bygger på 4 piksler. Innholdet er høyst `{spacing.content-max}` bredt (arbeidsbordet `{spacing.board-max}`). Sidemargen er `{spacing.gutter}` på PC og `{spacing.gutter-mobile}` på telefon, og siden ruller aldri sidelengs.

- **Landingssiden:** heroen går over hele bredden. Seksjonene har `{spacing.18}` luft over og under. Stegene i «Slik hjelper Buddy deg» har `{spacing.24}` mellom seg.
- **Arbeidsbordet:** ett stort bord på PC, med hovedbunken i midten og de fire andre bunkene i hjørnene. Under 760 px blir bordet en kolonne: hovedbunken øverst, de små bunkene i en vannrett rullerad og «Legg en ny tekst på bordet» under.
- **Brytepunkt:** 760 px. Under det gjelder telefonoppsettet.

## Elevation & Depth

Dybde brukes til å vise *hva som ligger oppå hva* på arbeidsbordet, ikke til pynt:

- Bunker har to ark under forsiden, litt rotert (−6° og 4°), med myk skygge. De skal se ut som papir på et bord.
- Når en bunke er åpnet, ligger aktivitetskortene øverst med kraftigere skygge. Resten av bordet tones ned til 18 % og gjøres uskarpt (1,5 px).
- Følge-Buddy på landingssiden og brilleknappen i lesevisningen svever over innholdet med samme skygge.
- Andre flater (kort, forklaringspanel) har bare en tynn kant eller en svak skygge.

## Shapes

Avrundingen er tydelig, men ikke boblete: `{rounded.md}` på knapper, `{rounded.lg}` på kort og paneler, `{rounded.xl}` på arbeidsbordet og `{rounded.full}` på piller og modusbryteren. De runde hjørnene speiler de avrundede glassene i merket.

Små rotasjoner (−7° til 6°) er en del av formspråket på arbeidsbordet og i markeringstusjen. De brukes ikke andre steder.

## Components

- **Merket (`{components.logo-mark}`)** er tegnet i en 120 × 120-flate:
  - **Brillene:** to avrundede firkantglass, hvert 39 × 32 med ytre hjørneradius 9. Neserommet ved broen er 10 bredt. Glassene har et neseinnhakk med radius 14 i det indre nedre hjørnet og radius 6 i det indre øvre. Rammen er 8,5 tykk. Broen er en bue over neserommet, og brillestengene går skrått opp fra de ytre øvre hjørnene.
  - **Pupillene** har radius 5,5 og sitter i glassene.
  - **Fra briller til B:** Når brillene roteres −90° rundt midten av overkanten, blir overkanten ryggen i B-en og glassene buene. Ryggen tegnes med strek 10,5, og neseinnhakket blir innhakket der buene møtes.
  - **Tre varianter:** *Brilleansiktet* (med øyne) er figuren. *B-en* er app-ikon, favicon og del av ordmerket. *Brillene uten øyne* er knappen for leseinnstillinger.
- **Tenkeindikatoren** er merket med en statustekst ved siden av:
  - *Tenker:* øynene leser fra side til side i en løkke på 1,6 sekunder.
  - *Ferdig:* en avslutning på 4,3 sekunder. Buddy blunker, pupillene blir værende 0,8 sekunder og tones ut, det blir 700 ms ro, brillene vipper til en B mens stengene trekkes inn, og til slutt tegnes ryggen.
- **Knapper:** Primærknappen (`{components.button-primary}`) er fylt med fiolett, og sekundærknappen (`{components.button-secondary}`) har fiolett kant. Teksten brytes aldri over to linjer.
- **Bunke** (`{components.stack-main}`, `{components.stack-small}`):
  - *Forsiden* viser tittel, dato og fem framdriftsstreker, én per aktivitet. Påbegynte er fiolette, resten har kantfarge.
  - *Hovedbunken* har fiolett kant, merkelappen «Sist brukt» og en linje for neste steg.
- **Aktivitetskort (`{components.activity-card}`):** ikon i en markeringsfarget rute, navnet på aktiviteten i Instrument Serif og en statuslinje. Statuspillen (`{components.status-pill}`) brukes til tall, for eksempel «6 / 8».
- **Fagord og forklaringspanel** (`{components.fagord}`, `{components.explanation-panel}`):
  - *Fagordet* får markeringsflate, fiolett understrek og fet skrift.
  - *Forklaringspanelet* har markeringsflate, fiolett venstrekant og ordet i Instrument Serif. Telefontesten ba om en større forklaringsboks med egen bakgrunn, og panelet følger det.
- **Markeringstusj (`{components.highlighter}`):** en rosa strek bak nøkkelordet i en overskrift, litt rotert. Den brukes høyst én gang per skjerm.
- **Feilmelding (`{components.danger-message}`):** lys feilflate med en kant i feilfarge, og en tekst som sier hva som skjedde og hva eleven kan gjøre.

Visuelle referanser: [mockups/landingsside-1.html](mockups/landingsside-1.html), [mockups/arbeidsbord-1.html](mockups/arbeidsbord-1.html), [mockups/runde-8-ordmerke.html](mockups/runde-8-ordmerke.html) (tenkeindikatoren) og [mockups/runde-9-ordmerke-4.html](mockups/runde-9-ordmerke-4.html) (ordmerket). Felles tokens og merket ligger i [mockups/merke.css](mockups/merke.css) og [mockups/merke.js](mockups/merke.js). Ved uenighet gjelder dette dokumentet foran mockene.

## Do's and Don'ts

| Gjør | Ikke gjør |
|---|---|
| Bruk aksenten som flate med mørk tekst | Bruk rosa som tekstfarge |
| Gloock på landingssiden, Instrument Serif inne i appen | Gloock i appen, eller fortykket Instrument |
| La Buddy være figuren som venter, tenker og snakker | Sett Buddy inn i selve teksten eleven leser |
| Gi hver farge en rolle, og sjekk kontrasten for rollen | Velg farge etter smak uten å måle kontrasten |
| Hold brødteksten på 7:1 eller bedre i begge moduser | Senk kontrasten for å få et «mykere» uttrykk |
| Ha ett tydelig blikkfang per skjerm (tusj eller hero) | Stable flere effekter, tusjer og piller på samme flate |
| Vis status med tekst, og bruk farge i tillegg | La farge alene fortelle om noe er ferdig eller feil |
