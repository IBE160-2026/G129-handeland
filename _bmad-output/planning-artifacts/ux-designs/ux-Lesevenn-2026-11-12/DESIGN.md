---
name: LeseBuddy
description: Visuell identitet for LeseBuddy (kodenavn Lesevenn), lesestøtte for videregående. Next.js med Tailwind CSS v4 og egne komponenter, uten komponentbibliotek. Lys og mørk modus.
status: final
updated: 2026-11-24
sources:
  - ../../prd-lesevenn.md
  - ../../product-brief-lesevenn.md
  - ../../arkitektur-lesevenn.md
  - ../../tilbakemelding-prd.md
  - ../../../../maaling/resultater/telefontest-2026-11-09.md
colors:
  # Palett «Pop» med fiolett primærfarge. Kontrast er målt mot background og surface.
  # Hvert token har en -dark-utgave som brukes i mørk modus.
  background: '#FFF5F7'        # rosahvit
  surface: '#FFFFFF'
  border: '#F5DDE5'            # bare skillelinjer, aldri informasjon (1,3:1)
  text: '#141A3A'              # 15,9:1 mot background
  text-muted: '#5A5670'        # 6,6:1 mot background, 7,0:1 mot surface, 5,7:1 mot highlight
  primary: '#6427D6'           # 7,0:1 mot background, 6,1:1 mot highlight; on-primary 7,5:1
  on-primary: '#FFFFFF'
  accent: '#FF4D9D'            # bare som flate med on-accent oppå (5,5:1), aldri som tekst (2,9:1)
  on-accent: '#141A3A'
  highlighter: '#FF4D9D'       # markeringstusjen; text oppå 5,5:1
  highlight: '#FFE0EE'         # Faguttrykk og forklaringspanel; text 13,8:1
  lilla: '#EDE5FC'             # tekstkortene i mappeviften (runde 3, bolk 6, 24.11); text 13,9:1, text-muted 5,7:1, primary 6,1:1
  danger: '#B3261E'            # 6,1:1 mot background
  danger-surface: '#FDE7E9'    # text 14,4:1, danger 5,5:1
  background-dark: '#0F1226'
  surface-dark: '#1A1E3A'
  border-dark: '#2C3158'
  text-dark: '#EEF0FF'         # 16,3:1
  text-muted-dark: '#A9AFD3'   # 8,6:1 mot background-dark, 7,6:1 mot surface-dark, 6,3:1 mot highlight-dark
  primary-dark: '#B79BFF'      # 8,1:1 mot background-dark, 7,1:1 mot surface-dark, 5,9:1 mot highlight-dark
  on-primary-dark: '#0F1226'
  accent-dark: '#FF7AB6'       # on-accent-dark oppå 7,0:1
  on-accent-dark: '#141A3A'
  highlighter-dark: '#8A2457'  # markeringstusjen i mørk modus; text-dark oppå 7,5:1
  highlight-dark: '#4A1F3A'    # text-dark 12,0:1
  lilla-dark: '#2E2758'        # text-dark 12,0:1, text-muted-dark 6,3:1, primary-dark 5,9:1
  danger-dark: '#FF8A80'       # 8,1:1
  danger-surface-dark: '#3D1A22'
typography:
  # Størrelser i rem (16 px = 1 rem), så nettleserens skriftstørrelse virker.
  display:
    fontFamily: 'Gloock'
    fontSize: clamp(2.75rem, 8.4vw, 6.75rem)
    fontWeight: '400'
    lineHeight: '1.02'
    letterSpacing: -0.01em
  display-md:
    fontFamily: 'Gloock'
    fontSize: clamp(2rem, 4.4vw, 3rem)
    fontWeight: '400'
    lineHeight: '1.08'
  heading:
    fontFamily: 'Instrument Serif'
    fontSize: 2.75rem
    fontWeight: '400'
    lineHeight: '1.05'
  heading-sm:
    fontFamily: 'Instrument Serif'
    fontSize: 1.75rem
    fontWeight: '400'
    lineHeight: '1.1'
  body:
    fontFamily: 'Atkinson Hyperlegible'
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.6'
  body-lead:
    fontFamily: 'Atkinson Hyperlegible'
    fontSize: clamp(1.1875rem, 2vw, 1.5rem)
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: 'Atkinson Hyperlegible'
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.5'
  term:
    fontFamily: 'Atkinson Hyperlegible'
    fontSize: 1.375rem
    fontWeight: '700'
    lineHeight: '1.3'
  label:
    fontFamily: 'Atkinson Hyperlegible'
    fontSize: 0.875rem
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: 0.06em
  morsmaal:
    fontFamily: "'Noto Sans', 'Noto Sans Arabic', system-ui, sans-serif"
    fontSize: 1.125rem
    lineHeight: '1.6'
  morsmaal-rtl:
    fontFamily: "'Noto Sans Arabic', 'Noto Sans', system-ui, sans-serif"
    fontSize: 1.25rem
    lineHeight: '1.8'
  wordmark-lese:
    fontFamily: 'Instrument Serif'
    fontStyle: italic
    fontWeight: '400'
  wordmark-uddy:
    fontFamily: 'Quicksand'
    fontWeight: '700'
rounded:
  xs: 4px
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
  target-min: 44px
elevation:
  # Utvidelse av spesifikasjonen: skygger. Mørk modus bruker samme verdier med svart på 60 %.
  sheet: 0 10px 26px -14px rgba(0,0,0,.35)
  raised: 0 14px 30px -16px rgba(0,0,0,.35)
  floating: 0 22px 40px -18px rgba(0,0,0,.45)
motion:
  # Utvidelse av spesifikasjonen: bevegelse. Alt slås av ved prefers-reduced-motion.
  fan: 500ms cubic-bezier(.3,1.35,.5,1), 45 ms forsinkelse per kort
  fade: 300ms ease
  thinking-loop: 1.6s ease-in-out, i løkke mens det ventes
  thinking-finish: 4.05s, én gang; indikatoren står 0,8 s etter animasjonen, så den ferdige B-en står ca. 1,2 s (endret 18.11, var 4.3s + 1,2 s, ca. 1,6 s)
components:
  focus-ring:
    outline: 3px solid {colors.primary}
    offset: 2px
    on-filled: ytre ring 2px {colors.background} mellom knapp og fokusring
    forced-colors: outline-color Highlight
  button-primary:
    background: '{colors.primary}'
    foreground: '{colors.on-primary}'
    radius: '{rounded.md}'
    padding: 12px 20px
    minHeight: '{spacing.target-min}'
    fontWeight: '700'
  button-secondary:
    background: transparent
    foreground: '{colors.primary}'
    border: 2px solid {colors.primary}
    radius: '{rounded.md}'
    minHeight: '{spacing.target-min}'
  top-bar:
    background: '{colors.background}'
    border: 1px solid {colors.border}
    minHeight: 64px
  board:
    background: '{colors.surface}'
    pattern: prikker 1 px i {colors.text-muted} på 22 % dekning, rutenett 22 px
    radius: '{rounded.xl}'
  stack-main:
    minWidth: 300px
    minHeight: 210px
    border: 2px solid {colors.primary}
    radius: '{rounded.lg}'
    title: '{typography.heading}'
    shadow: '{elevation.raised}'
  stack-small:
    minWidth: 180px
    minHeight: 126px
    radius: '{rounded.lg}'
    title: '{typography.heading-sm}'
    shadow: '{elevation.sheet}'
  progress:
    filled: '{colors.primary}'
    empty: 2px omriss i {colors.text-muted}
    label: '{typography.body-sm}'
  stack-strip:                  # de små bunkene smalere enn 760 px (bolk 6)
    width: 100%
    minHeight: '{spacing.target-min}'
    radius: '{rounded.lg}'
    title: 1.375rem Instrument Serif
    sheetUnder: ett ark rett under forsiden, ikke rotert
  stack-folder:                 # mappebunken (runde 3, bolk 5, 23.11), på stack-main, stack-small og stack-strip
    tab: flik øverst til venstre, 4.5rem × 0.875rem, samme kant og flate som forsiden, ingen kant nederst, radius 10px 10px 0 0
    label: «Mappe», {typography.body-sm} 0.875rem fet med versaler, 2px kant i {colors.primary}, tekst i {colors.text}
    meta: «N tekster» i stedet for datoen; ingen framdrift
    forcedColors: kant i CanvasText på fliken og merkelappen
  sheet:                        # viften smalere enn 760 px (bolk 6)
    background: '{colors.surface}'
    radius: 28px 28px 0 0
    maxHeight: 90vh (ruller innvendig)
    shadow: 0 -14px 40px -18px rgba(0,0,0,.45)
    backdrop: rgba(15,18,38,.45)
    row: ikon, navn i Instrument Serif 1.375rem, status i {typography.body-sm}, pil i {colors.primary}; minst 56 px høy
  activity-card:
    minWidth: 168px
    minHeight: 118px
    background: '{colors.surface}'
    radius: '{rounded.lg}'
    title: '{typography.heading-sm}'
    status: '{typography.body-sm}'
    shadow: '{elevation.floating}'
  status-pill:
    background: '{colors.accent}'
    foreground: '{colors.on-accent}'
    radius: '{rounded.full}'
  fagord:
    background: '{colors.highlight}'
    underline: text-decoration 2px {colors.primary}, offset 3px
    radius: '{rounded.xs}'
    fontWeight: '700'
  explanation-panel:
    background: '{colors.highlight}'
    borderInlineStart: 5px solid {colors.primary}
    radius: '{rounded.lg}'
    term: '{typography.term}'
  highlighter:
    fill: '{colors.highlighter}'  # i mørk modus {colors.highlighter-dark}
    shape: tusjstrøk (SVG, preserveAspectRatio none), ujevne ender og litt bølge  # bolk 10, variant A
    height: 0.48em                # bak den nederste delen av ordet, 0,02 em over bunnen
    overhang: 0.12em              # på hver side
    drawIn: clip-path 0.55s, én gang når siden lastes  # står bare der med redusert bevegelse
    forcedColors: understrek 0.08em
  logo-mark:
    stroke: '{colors.primary}'
    strokeWidth: 8.5 av 120
    lensFill: '{colors.highlight}'
    pupil: '{colors.text}'
    viewBox: -4 -4 128 128      # dekker hele avslutningen, så B-en aldri klippes
    miniViewBox: 0 35 120 51    # mini: beskåret til brillene, krymper til 0,48 under avslutningen
    miniSizes: 20px, 22px, 28px, 30px, 36px # mini-Buddy M1: høyden på brillene (knapp, linje, pille, fagorddemoen og hilsenen på telefon)
    expressions: tenker, slutt, ferdig, unnskyld  # unnskyld (bolk 10): ser ned, bekymrede bryn
    brow: "{colors.primary} (mørk modus: som pupillene), strek 4.5 av 120"  # bare i «unnskyld», tegnet over glasset og under rammen
  wordmark:
    lese: '{typography.wordmark-lese}'
    uddy: '{typography.wordmark-uddy}'
    uddyColor: '{colors.primary}'
    markHeight: 0.9em
    gapBeforeMark: 0.16em
  glasses-button:
    size: 48px
    background: '{colors.surface}'
    radius: '{rounded.full}'
    shadow: '{elevation.floating}'
  thinking-indicator:
    markSize: 64px              # formen «flate», 760 px og bredere
    status: '{typography.body}'
    statusWeight: '700'
    pill:                       # formen «flate» smalere enn 760 px
      markSize: 28px             # høyden på brillene
      background: '{colors.surface}'
      border: 2px solid {colors.primary}
      radius: 32px
      shadow: '{elevation.floating}'
      inset: 16px fra sidene, 16px + safe-area-inset-bottom fra bunnen
      maxHeight: 40vh (ruller innvendig; hjelpelinjen skjules når plassen er liten)
      stack: flere piller samtidig stables nedenfra med 8px mellomrom
    button:                     # formen «knapp»
      markSize: 20px             # høyden på brillene
      markStroke: knappens forgrunnsfarge (ramme og pupiller), glass uten fyll
      disabledOpacity: '1'
    line:                       # formen «linje»
      markSize: 22px             # høyden på brillene
  danger-message:
    background: '{colors.danger-surface}'
    foreground: '{colors.text}'
    borderInlineStart: 4px solid {colors.danger}
    radius: '{rounded.md}'
  status-message:               # meldingen etter «Legg i mappe» og etter et slipp (runde 3, bolk 6, 24.11)
    background: '{colors.highlight}'
    foreground: '{colors.text}'
    border: 2px solid {colors.primary}
    radius: '{rounded.md}'
    fontWeight: '700'
    icon: 1.75rem rund, {colors.primary} med {colors.on-primary}; ✓ lagt i
    muted: «…» venter og «i» uendret er dempet — vanlig vekt, kant i {colors.text-muted}, ikonet på {colors.surface} med {colors.text-muted} (5,7:1 / 6,3:1 mot markeringen, 7,0:1 mot flaten)
  folder-fan-cards:             # kortene i mappeviften (runde 3, bolk 6, avgjort av Arve 24.11)
    text: flate {colors.lilla}, stripe 6px {colors.primary} på startsiden
    combined: flate {colors.highlight}, kant 4px double {colors.primary}
    icon: ikonruten på {colors.surface}
    contrast: lilla og rosa er like lyse (1,00:1 i begge moduser), så stripen, den doble kanten og teksten bærer forskjellen, ikke fargen
---

## Brand & Style

LeseBuddy er lesestøtte for elever på videregående. Eleven leser teksten selv, og Buddy hjelper med fagordene, spørsmålene og samtalen om det hun har lest. Uttrykket skal være **trendy, oversiktlig og lekent**, men verken trend eller lek får gå ut over fokus og lesbarhet. Lesevisningen er den viktigste flaten, og alt annet skal vike for den.

Hva LeseBuddy skal og ikke skal ligne, står i EXPERIENCE.md, under Inspiration & Anti-patterns. Kort sagt: mer som en pen Notion-side enn som en skoleapp, Duolingo eller Spotify.

**Navnet.** Utad heter appen *LeseBuddy*, og figuren kalles *Buddy*. Kode, repo, domenebegreper og planleggingsdokumenter beholder *Lesevenn*.

**Buddy** er en figur, ikke bare en logo: et par kraftige, firkantede briller med øyne bak glassene. Buddy leser, tenker og blunker. Når Buddy er ferdig, vipper brillene og blir til en B. Figuren er med når appen venter, på arbeidsbordet og på landingssiden, men aldri inne i teksten eleven leser.

**Ordmerket** (`{components.wordmark}`, foreløpig valg) er «lese» i Instrument Serif kursiv i tekstfarge, deretter B-merket litt større enn bokstavene, og «uddy» i Quicksand 700 i `{colors.primary}`. Mellom «lese» og B-en er det 0,16 em luft, så «lese» leses som et forord og «Buddy» som ett fiolett ord. B-en og Quicksand har samme jevne strek og runde ender. Andre kandidater er fortsatt åpne: Instrument kursiv + Fredoka, og Instrument kursiv + Gloock. Se [mockups/runde-9-ordmerke-4.html](mockups/runde-9-ordmerke-4.html), der 4d er den valgte.

## Colors

Paletten heter **Pop**. Den har rosahvit bakgrunn, fiolett primærfarge og rosa aksent, og en navy mørk modus. Hvert token har en `-dark`-utgave med samme rolle, og den brukes i mørk modus.

- **Rosahvit bakgrunn (`#FFF5F7`) og hvite flater (`#FFFFFF`).** Varmere enn ren hvit, uten å bli rosa.
- **Tekst (`#141A3A`)**, nesten svart blekkblå. Brødtekst i `{colors.text}` holder minst 7:1 mot alle flater i begge moduser.
- **Dempet tekst (`#5A5670`)** brukes til ingresser, meta og statuslinjer. Den holder minst 7:1 mot flatene og 5,7:1 mot markeringen.
- **Fiolett primærfarge (`#6427D6` / `#B79BFF`)** brukes til knapper, lenkestreker, fokusring, merket, «uddy» i ordmerket, kanten på hovedbunken og fylte framdriftsstreker. Mot markeringsflaten har den 6,1:1 (lys) og 5,9:1 (mørk), og det holder for understrek og fokus.
- **Rosa aksent (`#FF4D9D` / `#FF7AB6`)** brukes **bare som flate med mørk tekst oppå**, for eksempel statuspiller og merkelappen «Sist brukt» (5,5:1 og 7,0:1). Som tekstfarge er den uleselig i lys modus (2,9:1).
- **Markeringstusjen (`{colors.highlighter}` / `{colors.highlighter-dark}`)** er rosa i lys modus og mørk bringebær (`#8A2457`) i mørk modus. Lys tekst på den rosa aksenten ville bare gitt 2,1:1.
- **Markering (`#FFE0EE` / `#4A1F3A`)** brukes til Faguttrykk i teksten, forklaringspanelet og glassene i merket. Fargen betyr «her hjelper Buddy deg». Den er også flaten på de samlede kortene i mappeviften, meldingsboksen i Samlinger og en dragbar tekstrad ved hover (runde 3, bolk 6).
- **Lilla (`#EDE5FC` / `#2E2758`)** brukes bare som flate på tekstkortene i mappeviften (runde 3, bolk 6, 24.11). Tekst har 13,9:1 og 12,0:1, dempet tekst 5,7:1 og 6,3:1, og primærfargen 6,1:1 og 5,9:1.
- **Feil (`#B3261E` / `#FF8A80`)** med en lys feilflate. Brukes bare til feilmeldinger, og alltid sammen med tekst som sier hva som skjedde.
- **Kant (`#F5DDE5`)** brukes bare til skillelinjer. Den bærer aldri informasjon, fordi den bare har 1,3:1 mot flatene.

Unngå: aksent som tekst, kantfarge som bærer status, mer enn to kraftige farger på samme flate, fargeforløp og fargekoding uten tekst eller form i tillegg.

## Typography

Tre skrifter, med hver sin rolle:

- **Gloock** (`{typography.display}`, `{typography.display-md}`) er blikkfang: landingssidens hero og seksjonsoverskrifter. Den er tung og høylytt, og blir masete hvis den brukes overalt. Derfor brukes den ikke inne i appen.
- **Instrument Serif** (`{typography.heading}`, `{typography.heading-sm}`) brukes til sideoverskrifter inne i appen, som hilsenen på arbeidsbordet, tittelen på en tekst og kortene på arbeidsbordet. Den brukes i vanlig vekt, uten kunstig fortykning, og bare i overskrifter.
- **Atkinson Hyperlegible** (`{typography.body}`) brukes til all brødtekst, knapper, etiketter og status. Den er laget for lesbarhet.

Andre roller:

- **Ordet som forklares** i forklaringspanelet (`{typography.term}`) står i Atkinson fet og større. Det er ordet eleven skal lære, og det skal se ut som i teksten.
- **Morsmål:** Atkinson og Instrument Serif dekker bare latinsk skrift. Morsmålsinnhold bruker derfor `{typography.morsmaal}` (Noto Sans, med kyrillisk), og arabisk `{typography.morsmaal-rtl}` med større skrift og mer linjeavstand.
- **Ordmerket** har egne roller (`{typography.wordmark-lese}`, `{typography.wordmark-uddy}`). Quicksand brukes **bare** i ordmerket.

Alle størrelser er i rem, så nettleserens skriftstørrelse virker. Leseinnstillingene (FR-12) skalerer både teksten og forklaringspanelet. All tekst som bærer informasjon (status, meta, merkelapper) er minst 1 rem (`{typography.body-sm}`). Etiketter (`{typography.label}`) står med store bokstaver bare når de har ett eller to ord. Linjelengden er om lag 70 tegn i lesevisningen (`{spacing.reading-measure}`) og høyst 62 tegn i ingresser (`{spacing.lead-measure}`).

## Layout & Spacing

Avstandsskalaen bygger på 4 piksler. Innholdet er høyst `{spacing.content-max}` bredt (arbeidsbordet `{spacing.board-max}`). Sidemargen er `{spacing.gutter}` på brede skjermer og `{spacing.gutter-mobile}` på telefon, og siden ruller aldri sidelengs, heller ikke ved 320 px bredde.

- **Brytepunkt:** smalere enn 760 px gir telefonoppsettet, og 760 px og bredere gir oppsettet for brede skjermer.
- **Landingssiden:** heroen går over hele bredden. Seksjonene har `{spacing.18}` luft over og under. Stegene i «Slik hjelper Buddy deg» har `{spacing.24}` mellom seg.
- **Arbeidsbordet:** På brede skjermer er det ett bord med hovedbunken i midten og de fire andre bunkene i hjørnene. Bord, bunker og kort har *minimumsmål*, ikke faste mål, og bordet klipper aldri innholdet. Plasseringen av bunker og viftekort regnes ut fra de målte størrelsene. Er det ikke plass (stor tekst, smal skjerm), faller oppsettet tilbake til et rutenett. På telefon (smalere enn 760 px) er bordet en kolonne: hovedbunken øverst, de små bunkene som striper i full bredde (`{components.stack-strip}`), og «Legg en ny tekst på bordet» under. Sidemargene på telefonbordet er i px (`{spacing.gutter-mobile}`), ikke i rem, så titlene har plass også med 200 % tekst på 320 px. Viften er da et ark nedenfra (`{components.sheet}`).
- **Trykkflater** er minst `{spacing.target-min}` × `{spacing.target-min}`, også rene tekstlenker med egen funksjon.

## Elevation & Depth

Dybde brukes til å vise *hva som ligger oppå hva* på arbeidsbordet, ikke til pynt:

- Bunker har to ark under forsiden, litt rotert (−6° og 4°), med `{elevation.sheet}`. De skal se ut som papir på et bord.
- Hovedbunken har `{elevation.raised}`.
- Når en bunke er åpnet, ligger aktivitetskortene øverst med `{elevation.floating}`. Resten av bordet tones ned til 18 % og gjøres uskarpt (1,5 px). Det er bare greit fordi den nedtonede delen samtidig er inaktiv (se EXPERIENCE.md, Viften).
- Brilleknappen i lesevisningen og Følge-Buddy på landingssiden svever over innholdet med `{elevation.floating}`.
- Andre flater (kort, forklaringspanel) har bare en tynn kant eller en svak skygge.

## Shapes

Avrundingen er tydelig, men ikke boblete:

- `{rounded.xs}` på markeringen av Faguttrykk
- `{rounded.md}` på knapper og feilmeldinger
- `{rounded.lg}` på bunker, kort og paneler
- `{rounded.xl}` på arbeidsbordet
- `{rounded.full}` på piller og brilleknappen

De runde hjørnene speiler de avrundede glassene i merket.

Små rotasjoner (−7° til 6°) er en del av formspråket på arbeidsbordet. De brukes ikke andre steder. Markeringstusjen er ikke lenger rotert (bolk 10); det håndtegnede ligger i de ujevne endene og bølgen.

## Components

**Fokus (`{components.focus-ring}`)**
- Én regel for hele appen: `outline: 3px solid {colors.primary}` med 2 px avstand. Den erstatter dagens gulv i `globals.css`, som bruker `currentColor` og blir usynlig på fylte knapper.
- På fylte knapper ligger en ytre ring i `{colors.background}` mellom knappen og fokusringen.
- `outline: none` er ikke lov uten en like sterk erstatning. I kontrastmodus (`forced-colors`) brukes `Highlight`.
- Fokus som appen flytter etter et museklikk (når viften åpnes, ved nivåbyttet i mappeviften og tilbake til bunkens knapp når den lukkes), får samme ring og samme forstørrelse av kortet, selv om nettleseren ikke gir `:focus-visible` da (runde 3, bolk 6, 24.11). Ringen står til fokus forlater elementet.

**Merket (`{components.logo-mark}`)** I mørk modus er glassene `{colors.text-dark}` og pupillene `{colors.highlight-dark}`, så Buddy har lyse øyne og mørke pupiller som i lys modus.
- **Brillene** er tegnet i en 120 × 120-flate med to avrundede firkantglass, hvert 39 × 32 med ytre hjørneradius 9. Neserommet ved broen er 10 bredt. Glassene har et neseinnhakk med radius 14 i det indre nedre hjørnet og radius 6 i det indre øvre. Rammen er 8,5 tykk. Broen er en bue over neserommet, og brillestengene går skrått opp fra de ytre øvre hjørnene.
- **Pupillene** har radius 5,5.
- **Fra briller til B:** Når brillene roteres −90° rundt midten av overkanten, blir overkanten ryggen i B-en og glassene buene. Ryggen tegnes med strek 10,5.
- **Tre varianter:**
  - *Brilleansiktet* (med øyne) er figuren.
  - *B-en* er app-ikon, favicon og del av ordmerket.
  - *Brillene uten øyne* er brilleknappen.
- **Mini-Buddy (M1, valgt 15.11):** brilleansiktet i små størrelser er den samme tegningen, bare mindre, men beskåret til brillene (flaten 0 35 120 51), så størrelsen er høyden på brillene og bredden om lag 2,35 × høyden: 20 px i en knapp, 22 px foran en linje og 28 px i tenkepillen. På telefon brukes den også med brillene 36 px høye i hilsenen på arbeidsbordet og 30 px høye ved forklaringen i fagorddemoen på landingssiden (bolk 6). Ramme, pupiller og stenger er med. Det finnes ingen egen tegning for små størrelser. Under avslutningen krymper mini-merket til 0,48 rundt midten av brillene i samme tidsvindu som rotasjonen, slik at den ferdige B-en får plass i høyden til brillene og aldri går utenfor pillen eller knappen. Utkastet med M1–M3 ligger i [.working/runde-10-mini-buddy-og-mobil.html](.working/runde-10-mini-buddy-og-mobil.html).
- **Uttrykk:** *tenker* (øynene leser fra side til side), *slutt* (avslutningen til B-en), *ferdig* (B-en) og *unnskyld* (design runde 2, bolk 10, variant B i [mockups/runde-11-buddy-og-pennestrok.html](mockups/runde-11-buddy-og-pennestrok.html)). I *unnskyld* ser Buddy ned: pupillene står nederst i glassene (7 px ned) og flakker sakte fra side til side (3,2 s), og bekymrede bryn bak glassene er løftet inn mot midten og beveger seg litt i takt med blikket (±4°). Brynene er en del av den samme tegningen (ingen egen tegning), tegnes over glasset og under rammen i `{colors.primary}` med strek 4,5, og følger mørk modus som rammen. Med redusert bevegelse står pupillene nede og brynene stille. Uttrykket brukes i merknaden i gjennomsynet for tekster lest fra bilder, med merket på 64 px til venstre for teksten.
- **Plass til avslutningen:** brilleansiktet tegnes i flaten −4 −4 128 128. Hele banen til avslutningen (rotasjonen −90° rundt (60, 40), flyttingen (−16, 20), stengene og ryggen) holder seg innenfor den, så ingen del av B-en eller stengene klippes. Mini-merket holder seg innenfor sin beskårne flate fordi det krymper (se over). SVG-en har i tillegg `overflow: visible`, og ingen flate rundt merket har `overflow: hidden`.
- **Kildekode:** [mockups/merke.js](mockups/merke.js) og [mockups/merke.css](mockups/merke.css).

**Ordmerke (`{components.wordmark}`).** Se Brand & Style. Hele merket er én lenke til `/`. For skjermlesere har den navnet «LeseBuddy, forsiden». Delene («lese», B-en og «uddy») er skjult for skjermlesere.

**Tenkeindikatoren (`{components.thinking-indicator}`)**
- **Tre former** (bolk 5). Merket er alltid brilleansiktet, og bare størrelsen skifter:
  - *Flate:* merket er 64 px, med statusteksten i fet `{typography.body}` ved siden av, i flaten der innholdet kommer. Smalere enn 760 px er flaten i stedet en **tenkepille** som ligger fast nederst på skjermen: mini-Buddy med brillene 28 px høye, statusen i fet skrift og hjelpelinjen i `{typography.body-sm}` og dempet tekst, på `{colors.surface}` med 2 px kant i `{colors.primary}`, radius 32 px og `{elevation.floating}`. Den står 16 px fra sidene og 16 px pluss `env(safe-area-inset-bottom)` fra bunnen. Med stor tekst blir den høyere og ser ut som et kort, så hjørnene ikke kutter teksten. Den er høyst 40 % av skjermhøyden og ruller innvendig, og hjelpelinjen skjules når plassen er liten. Vises flere piller samtidig, stables de nedenfra. Pillen glir inn (300 ms), og glir bort etter avslutningen.
  - *Knapp:* mini-Buddy med brillene 20 px høye inne i knappen som ble trykket, med statusteksten som knappetekst. Ramme og pupiller tegnes i knappens forgrunnsfarge (`currentColor`), og glassene har ikke fyll, så glass og ramme ikke flyter sammen i mørk modus. Knappen er låst mens Buddy tenker (`aria-disabled`, så fokus blir stående), men tones ikke ned (opasitet 1). Brukes ved korte ventinger, som et svar i fagsamtalen.
  - *Linje:* mini-Buddy med brillene 22 px høye foran én linje med status. Brukes for oversettelser som lages i bakgrunnen.
- *Tenker:* øynene leser fra side til side i en løkke (`{motion.thinking-loop}`).
- *Ferdig:* en avslutning (`{motion.thinking-finish}`). Buddy blunker, pupillene blir værende 0,8 sekunder og tones ut, det blir 450 ms ro, brillene vipper til en B mens stengene trekkes inn, og til slutt tegnes ryggen. B-en står 0,8 s før indikatoren går, så hele avslutningen tar omtrent 4,85 s. *Endret 18.11:* pausen var 700 ms og B-en sto 1,2 s (5,5 s i alt); utvikleren syntes avslutningen hang for lenge. Resten av tegningen og rekkefølgen er uendret, og med redusert bevegelse vises B-en direkte som før.
- Avslutningen spilles i indikatorens plass mens innholdet allerede vises under: i flaten, i pillen eller i knappen. Den får plass i alle størrelser.
- **Etter at siden er byttet** (17.11): har svaret sendt eleven til en ny side eller byttet innholdet der indikatoren sto, spilles avslutningen av en vert i rotlayouten. Smalere enn 760 px er det tenkepillen, på samme sted som pillen sto. Fra 760 px er det et lite fast kort nederst til høyre: merket på 64 px og statusen i fet skrift, på `{colors.surface}` med 2 px kant i `{colors.primary}`, radius 32 px og `{elevation.floating}`, 16 px fra kanten. Kortet vises bare under avslutningen og forsvinner uten å gli, som flaten. Det ligger over innholdet i hjørnet og teller ikke med i luften nederst (`--tenker-pille`), så siden blir ikke lengre av det; pillen på telefon teller med som før. Kortet og pillen deler kant, flate, radius, skygge og lag (egendefinerte egenskaper i globals.css). Regelen om at det aldri er en pille fra 760 px gjelder ventingen, ikke avslutningen etter at siden er byttet. Verten flytter ikke fokus. Når den spiller, og når den ikke gjør det (feil, forlat-vernet, rettingen av quizen), står i EXPERIENCE.md under Tenkeindikator.
- Kildekode: [mockups/merke-tenker.css](mockups/merke-tenker.css). Et eksempel å trykke på ligger øverst i [mockups/runde-8-ordmerke.html](mockups/runde-8-ordmerke.html). Ordmerkene lenger ned på den siden er valgt bort.

**Knapper og topplinje**
- **Primærknappen** (`{components.button-primary}`) er fylt med fiolett, og **sekundærknappen** (`{components.button-secondary}`) har fiolett kant. Teksten brytes aldri.
- *Hover:* knappen blir 6 % mørkere. *Fokus:* `{components.focus-ring}`. *Deaktivert:* knappen vises ikke deaktivert, men forklarer hvorfor den ikke virker (se EXPERIENCE.md, grensene).
- **Topplinjen** (`{components.top-bar}`) har ordmerket til venstre, så menyen («Arbeidsbord», «Samlinger»; endret 23.11) og kontolenken til høyre. Aktivt menyvalg vises med markeringsflate *og* understrek. Mens viften er åpen, er topplinjen dempet til 35 % opasitet med vanlig peker; i kontrastmodus står den i `GrayText` med full opasitet (runde 3, bolk 6, 24.11).

**Bunke** (`{components.stack-main}`, `{components.stack-small}`)
- *Forsiden* viser tittel, dato («lagt inn 11. nov.») og framdrift.
- *Framdrift* (`{components.progress}`): fem streker, én per aktivitet. Påbegynte er fylt fiolette, og resten har et omriss i dempet tekstfarge. Teksten «3 av 5 påbegynt» står under.
- *Hovedbunken* har fiolett kant, merkelappen «Sist brukt» (statuspille) og en lenke til neste steg.
- *Titler* brytes. Er tittelen lengre enn tre linjer, avkortes den visuelt med ellipse, men står i sin helhet i det tilgjengelige navnet og øverst i viften.
- *Hover:* bunken løftes 4 px. *Åpen:* bunken flyttes til midten og skaleres til 80 %.
- **Stripe** (`{components.stack-strip}`, smalere enn 760 px): de små bunkene er striper i full bredde. Tittelen har hele den første linjen og brytes bare mellom ord. Under står framdriften og «N av 5» (ordet «påbegynt» er skjult tekst for skjermlesere). Datoen vises ikke. Ett ark ligger rett under forsiden, uten rotasjon, så ingenting stikker ut til siden.
- **Mappebunke** (`{components.stack-folder}`, runde 3, bolk 5, 23.11): en Mappe med Tekster er én bunke med en mappefane, en flik øverst til venstre i samme kant og flate som forsiden (fiolett på hovedbunken). Forsiden viser merkelappen «Mappe», tittelen og «N tekster» i stedet for «lagt inn …», uten framdrift. Er den hovedbunken, har den «Sist brukt» og lenken til neste steg for Teksten som sist ble brukt, med tittelen først («EM-bølger: Neste: Ta quizen →»). På telefon får stripen den samme fliken og «Mappe» foran tittelen, og «N tekster» til høyre; er det ikke plass til begge på én linje, går tittelen ned på neste linje i stedet for å deles. Forskjellen bæres av teksten, ikke bare av formen; i kontrastmodus har fliken og merkelappen kant.

**Arket** (`{components.sheet}`, smalere enn 760 px)
- Viften er et ark som glir opp fra bunnen over en mørk bakgrunn: tittelen og «Legg sammen» øverst (knappen går til linjen under når teksten er stor), og de fem aktivitetene som rader med en tynn skillelinje. For en Mappe er radene Tekstene og de to samlede kortene; med en Tekst valgt står «Tilbake til mappen» og «Legg sammen» på en egen rad over tittelen (runde 3, bolk 5, 23.11). Åpne rader har en pil (›), og låste rader har låseikonet og teksten «Låst. Åpnes når du har lest teksten.» i full kontrast.
- Arket har ikke noe grep øverst, fordi det ikke kan dras (EXPERIENCE.md: ingen sveip).

**Hilsenen på telefon:** mini-Buddy med brillene 36 px høye ved siden av «Hei!», med neste steg i en boble på `{colors.surface}` med tynn kant og `{elevation.sheet}`. Fra 760 px står Buddy på bordet i stedet.

**Aktivitetskort (`{components.activity-card}`)**
- Har et ikon i en markeringsfarget rute, navnet på aktiviteten i Instrument Serif og en statuslinje i `{typography.body-sm}`. Ikonet er bare dekor.
- **Statuspillen** (`{components.status-pill}`) brukes til tall, for eksempel «6 av 8».
- *Låst kort:* et låseikon og teksten «Låst. Åpnes når du har lest teksten.» i full kontrast. Kortet nedtones ikke.
- *Fokus og hover:* fokusringen, og kortet retter seg opp (rotasjon 0) og forstørres 6 %.
- *Mappeviften* (`{components.folder-fan-cards}`, runde 3, bolk 6, avgjort av Arve 24.11): to farger, bare her. Tekstkortene har lilla flate og en stripe i `{colors.primary}` på startsiden; «Øvekort for hele mappen» og «Quiz for hele mappen» har rosa flate (`{colors.highlight}`) og dobbel kant i `{colors.primary}`. Ikonruten står på `{colors.surface}`. De to flatene er like lyse (1,00:1 i lys og mørk modus), så det er stripen og den doble kanten, sammen med navnene og statusene, som bærer forskjellen, ikke fargen. Navnene og statusene skiller dem også, og stripen og den doble kanten står i kontrastmodus. På arket har radene samme flate og form, og hover gir en ring i primærfargen i stedet for ny flate. Tekstens fem aktivitetskort er uendret.

**Faguttrykk og forklaringspanel** (`{components.fagord}`, `{components.explanation-panel}`)
- *Faguttrykket i teksten* får markeringsflate, fiolett understrek (`text-decoration`, ikke skygge, så den overlever kontrastmodus) og fet skrift. *Fokus:* fokusringen rundt ordet.
- *Fagorddemoen på telefon* (landingssiden, bolk 6): fagordene er knapper med samme utseende. Ordet som er vist, er fylt med `{colors.primary}` og tekst i `{colors.on-primary}`. Forklaringen står i et forklaringspanel under teksten, med mini-Buddy (brillene 30 px høye) ved siden av. Med stor tekst legger panelet seg under Buddy.
- *Forklaringspanelet* har markeringsflate, fiolett kant på startsiden (`border-inline-start`, så den følger høyre-til-venstre) og ordet i `{typography.term}`. Telefontesten ba om en større forklaringsboks med egen bakgrunn, og panelet følger det.

**Brilleknappen (`{components.glasses-button}`)**
- En rund knapp på 48 px med brillene uten øyne, oppe til høyre i lesevisningen.
- På brede skjermer står teksten «Leseinnstillinger» ved siden av, fordi telefontesten viste at navnet alene ikke var intuitivt.

**Markeringstusj (`{components.highlighter}`):** en rosa tusj bak den nederste delen av ordet, med ujevne ender og litt bølge, som en ekte tusj (design runde 2, bolk 10, variant A i [mockups/runde-11-buddy-og-pennestrok.html](mockups/runde-11-buddy-og-pennestrok.html); den erstatter den jevne, roterte stripa). Den brukes høyst én gang per skjerm: på «leser» i heroen på landingssiden, på tekstnavnet i sidetitlene inne i appen (quizen, oppgavene, huskeregelen, øvekortene, fagsamtalen, lesevisningen, aktiveringen og gjennomsynet), på mappenavnet i mappesidene, og på «Samlinger» i overskriften på /samling (lagt til 20.11, navnet endret 23.11). Bare navnet får strøk, ikke «Quiz:». Den brukes aldri på lenker eller knapper, der den kan forveksles med en lenkeunderstrek.
- *Tegning:* en SVG med `preserveAspectRatio="none"` bak ordet, 0,48 em høy og 0,12 em bredere enn ordet på hver side, fylt med `{colors.highlighter}` / `{colors.highlighter-dark}`. Ordet er en vanlig `<span>`, og SVG-en er skjult for skjermlesere, så overskriften leses som før. Kontrasten mellom teksten og strøket er den samme som med stripa (5,5:1 og 7,5:1).
- *Lange navn:* hvert ord har sitt eget strøk, så et navn som brytes over flere linjer har strøk på hver linje. Et ord som er for langt for linjen, brytes i stedet for å gi sidelengs rulling (fra 320 px med 200 % tekst).
- *Bevegelse:* strøket tegnes inn én gang når siden lastes (clip-path fra venstre, 0,55 s, ord for ord). Med redusert bevegelse står det bare der.
- *Kontrastmodus* (`forced-colors`): en vanlig understrek (0,08 em), og SVG-en skjules.
- Kildekode: `app/komponenter/Tusj.tsx` og `.tusj` i `globals.css`.

**Øvekortene (design runde 2, bolk 9; endret 23.11):** kortet står i full bredde. Over det, mot høyre kant, står «Må øve mer» over «Har kontroll» som button-secondary (fylt button-primary når merkingen er valgt), like brede og med 12 px mellomrom. Med `data-hand="venstre"` står de mot venstre kant. Under kortet står pilknappene ← og → (pilen i 24 px, `aria-label` «Forrige kort» / «Neste kort»; på siste kort «Ferdig» i tekst) som to like brede button-secondary i full bredde, 12 px mellomrom. «Tilbake til mappen» / «Tilbake til oppgavene» står øverst i sidens header som en fet, understreket lenke med ← foran, minst 44 px høy. Alle har minst 44 × 44 px trykkflate. Plasseringen er CSS (`.oevekort-flate` i `globals.css`) og ser lik ut i lys og mørk modus og fra 320 px.

**Øvekortene på stor skjerm (runde 3, bolk 3; 23.11):** fra 760 px er siden opptil 1024 px bred med 32 px marg, så kortet blir opptil 960 px. Kortknappen, feilmeldingen og merkeknappene står i én ramme (`.oevekort-ramme`: 2 px kant i slate-300, slate-600 i mørk modus, `rounded.lg`, flate hvit / slate-900, liten skygge), og kortknappen har ingen egen kant. «Må øve mer» og «Har kontroll» står nederst i rammen, side om side mot hver sin kant med 24 px marg, like brede (12 rem, krymper ved behov); med `data-hand="venstre"` byttes de om. Med stor tekst brytes de til to rader. Feilmeldingen står mellom kortflaten og knappene. Tilbakelenken står nederst på siden, 24 px til venstre for kortkanten, med samme stil og minst 44 px høyde; lenken øverst i headeren er skjult fra 760 px. Under 760 px er rammen `display: contents`, og oppsettet er som over.

**Samlinger på stor skjerm (runde 3, bolk 4; 23.11; endret 24.11):** fra 760 px er siden opptil 72 rem (1152 px) bred og todelt i et rutenett 3 : 7 med 3 rem mellomrom, 4 rem fra 1024 px (32 px til 24.11) (`.samling-oppsett` i `globals.css`): søket og tekstene til venstre, mappene til høyre, i flukt øverst. Mappene er kort i et rutenett (minst 13 rem brede, 16 px mellomrom) inne i mappedelen: 2 px kant i slate-300 (slate-600 i mørk modus), `rounded.lg`, flaten i bakgrunnsfargen, navnet som lenke øverst og antallet under. «Ny mappe»-skjemaet står under kortene. Tekstradene i den smale kolonnen stables: tittel, tilstand og dato, neste steg, så knappene («Legg i mappe» og «Slett»). En rad som kan dras, har `cursor: grab`, og raden som dras, får 60 % opasitet. Mens en tekst dras, får alle kortene stiplet kant i primærfargen; kortet den er over, får heltrukken 2 px kant og en 3 px ring (box-shadow) i primærfargen, markeringsflaten og teksten «Slipp for å legge i mappen» i fet skrift (ikke understreket, for understrek betyr lenke), så markeringen ikke hviler på farge alene. Overgangen er 120 ms og faller bort ved redusert bevegelse; i kontrastmodus får kortet en ramme i Highlight. Under 760 px er mappene en liste med skillelinjer som før, øverst på siden.

**Dra-tegn og melding i Samlinger (runde 3, bolk 6, avgjort av Arve 24.11):** bare når draget er på (fra 760 px og med minst én mappe). Hver dragbar rad har grep-ikonet ⠿ i `{colors.text-muted}` til venstre for tittelen (skjult for skjermlesere), 1,75 rem luft på startsiden, og markeringsflaten ved hover (120 ms, ingen overgang ved redusert bevegelse). Over tekstene står «⠿ Dra en tekst til en mappe.» i dempet tekst. Meldingen etter et slipp og etter «Legg i mappe» står i `{components.status-message}`: ikon, fet skrift, 2 px kant i primærfargen og markeringsflaten. Mens det skjer («…») og når ingenting ble endret («i»), er boksen dempet: vanlig vekt og kant og ikon i dempet tekstfarge, så bare «lagt i» (✓) ser ut som et ferdig resultat. Setningen over tekstene er skjult for skjermlesere, fordi draget bare gjelder mus. Statusregionen er tom og uten boks til meldingen kommer. Navnefeltet for en mappe har plassholderen «Eks. Samfunnsfag: demokrati» i dempet tekst; er navnet for langt, får feltet 2 px kant i `{colors.danger}`, og under står meldingen i fet `{colors.danger}`.

**Forkunnskapsglideren (FR-6, runde 3, bolk 2a, 23.11):** per overskrift i aktiveringen en glider med tre trinn, «Ingenting ennå» – «Litt» – «Mye». Glideren er 44 px høy (trykkflaten), sporet 8 px i `{colors.text-muted}` og håndtaket 28 px. Valgt: håndtaket er fylt i `{colors.primary}` med en ring i flatefargen, og trinnmerket under er fet og understreket, så valget ses uten farge alene. Urørt eller satt til side: håndtaket er hult med kant i dempet tekstfarge, og statusen over («Ikke merket ennå» / «Satt til side») står i dempet tekst. Trinnmerkene står under sporet, venstre, midten og høyre, og brytes på 320 px med 200 % tekst. Under, sentrert, står «Skjønner ikke overskriften» som button-secondary, fylt button-primary med hake når den er på. Fokus er den vanlige ringen. I tvungne farger er sporet `CanvasText`, håndtaket `Highlight` (hult `Canvas` når det er dempet), og knappen på `Highlight`. Stilen står i `globals.css` (`.forkunnskap`). Til 23.11 var merkene fire radioknapper som sekundærknapper (`.merkevalg`).

**Feilmelding (`{components.danger-message}`):** lys feilflate med feilfarget kant på startsiden, en tekst som sier hva som skjedde og hva eleven kan gjøre, og knappen «Prøv igjen».

**Visuelle referanser:** Landingssiden er [mockups/landingsside-1.html](mockups/landingsside-1.html), og arbeidsbordet er [mockups/arbeidsbord-1.html](mockups/arbeidsbord-1.html). Mockene er visuelle utkast, og ved uenighet gjelder dokumentene (se EXPERIENCE.md, Information Architecture).

## Do's and Don'ts

| Gjør | Ikke gjør |
|---|---|
| Bruk aksenten som flate med mørk tekst | Bruk rosa som tekstfarge |
| Gloock på landingssiden, Instrument Serif i overskrifter inne i appen | Gloock i appen, Instrument i brødtekst, eller fortykket Instrument |
| La Buddy være figuren som venter, tenker og snakker | Sett Buddy inn i selve teksten eleven leser |
| Gi hver farge en rolle, og sjekk kontrasten for rollen | Velg farge etter smak uten å måle kontrasten |
| Hold brødteksten på 7:1 eller bedre i begge moduser | Senk kontrasten for å få et «mykere» uttrykk |
| Ha ett tydelig blikkfang per skjerm (tusj eller hero) | Stable flere effekter, tusjer og piller på samme flate |
| Vis status med tekst og form, og bruk farge i tillegg | La farge eller kantfarge alene fortelle om noe er ferdig, låst eller feil |
| Bruk minimumsmål og la innholdet bestemme størrelsen | Bruk faste høyder eller `overflow: hidden` på flater med tekst |
| Bruk `{components.focus-ring}` overalt | Fjern fokusmarkeringen eller bruk `currentColor` på fylte knapper |
