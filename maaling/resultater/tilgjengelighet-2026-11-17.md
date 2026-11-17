# Tilgjengelighetssjekk — 2026-11-17

Kjørt med `npm run sjekk:tilgjengelighet`: Chrome, PC (1280 px, lys og mørk modus) og telefon (375 px, berøring), axe-core WCAG 2.1 A/AA.

**259 av 259 sjekker bestått.**

| | Sjekk | Detalj |
|---|---|---|
| ✓ | axe: registrering |  |
| ✓ | FR-48: tomt arbeidsbord for ny elev |  |
| ✓ | axe: arbeidsbord (tomt) |  |
| ✓ | hopp-lenken er første fokus | fikk «Hopp til innholdet» |
| ✓ | axe: ny tekst |  |
| ✓ | fokusringen på primærknappen er 3 px heltrukken i primærfargen | «Begynn»: solid 3px rgb(100, 39, 214) |
| ✓ | axe: overskriftskontroll (3a) |  |
| ✓ | FR-3: brødteksten finnes ikke i kildekoden i fase 3a | prøve: «Inspirert av Maxwells teorier for elektromagnetiske» |
| ✓ | axe: aktivering |  |
| ✓ | FR-5: brødteksten finnes ikke i kildekoden i aktiveringen |  |
| ✓ | axe: aktivering (375 px) |  |
| ✓ | FR-6: hver overskrift er en radiogruppe med navn (fieldset med legend) og tre valg | 8 grupper: «Egenskaper hos ulike EM-bølger» (3), «Radiobølger» (3), «Mikrobølger» (3), «Infrarød stråling» (3), «Synlig lys» (3), «Ultrafiolett stråling» (3), «Røntgenstråling» (3), «Gammastråling» (3) |
| ✓ | FR-6: Tab når første radiogruppe | {"type":"radio","navn":"merke-1","verdi":"kjent","valgt":false,"hake":"none","ring":"solid","sidelengs":false} |
| ✓ | FR-6: piltasten velger neste merke i gruppen | {"type":"radio","navn":"merke-1","verdi":"litt","valgt":true,"hake":"\"✓\" / \"\"","ring":"solid","sidelengs":false} |
| ✓ | FR-6: valgt merke har hake (ikke farge alene) og synlig fokusring | hake "✓" / "", ring solid |
| ✓ | FR-6: Tab går videre til neste radiogruppe | {"type":"radio","navn":"merke-2","verdi":"kjent","valgt":false,"hake":"none","ring":"solid","sidelengs":false} |
| ✓ | FR-6: «Helt nytt» kan velges med piltastene | {"type":"radio","navn":"merke-2","verdi":"nytt","valgt":true,"hake":"\"✓\" / \"\"","ring":"solid","sidelengs":false} |
| ✓ | FR-6: aktiveringen ruller ikke sidelengs på 375 px |  |
| ✓ | axe: lesevisning |  |
| ✓ | FR-6: «Før du leste» viser spørsmålet, lenken til fagsamtalen og den helt nye overskriften | Før du leste Du lurte på: Hvorfor kan vi ikke se radiobølger? Fikk du svar? Sjekk om du kan forklare det med egne ord. Til fagsamtalen Helt nytt for deg før du leste: Radiobølger. Litt kjent: Egenskap |
| ✓ | FR-6: «Før du leste» står rett før «Ferdig med å lese?» |  |
| ✓ | FR-6: låst aktivering viser «du merket: Helt nytt» ved den helt nye overskriften | Radiobølger— du merket: Helt nytt |
| ✓ | FR-6: låst aktivering har verken radioknapper eller spørsmålsfelt |  |
| ✓ | FR-10: fokus åpner forklaringen |  |
| ✓ | FR-10: Escape lukker |  |
| ✓ | FR-10: fokus står på ordet etter Escape |  |
| ✓ | FR-10: rulleposisjonen står stille (fokus/Escape) | 300 → 300 |
| ✓ | FR-10: pekerhvil åpner forklaringen |  |
| ✓ | FR-10: forklaringen lukkes når pekeren går |  |
| ✓ | FR-10: trykk fester forklaringen |  |
| ✓ | FR-10: lukkeknappen lukker |  |
| ✓ | FR-10: trykk utenfor lukker |  |
| ✓ | axe: lesevisning med åpen forklaring |  |
| ✓ | FR-12: tekststørrelsen endres med en gang | 32px |
| ✓ | FR-12: tekststørrelsen huskes | 32px |
| ✓ | FR-12: linjelengden er om lag 70 tegn også med stor skrift | 32 tegn |
| ✓ | axe: oppgaver |  |
| ✓ | axe: øvekort |  |
| ✓ | axe: minnevers |  |
| ✓ | axe: konto |  |
| ✓ | FR-48: hovedbunken har neste steg som egen lenke, rett til steget | «Neste: Ta quizen →» → /tekst/0dca01ff-f900-49e9-8c9b-d90bbae652c0/quiz |
| ✓ | FR-48: hilsenen sier hvilken tekst eleven holdt på med |  |
| ✓ | axe: arbeidsbord |  |
| ✓ | viften finnes ikke i DOM-en når den er lukket |  |
| ✓ | 1280 px: viften legger kortene rundt bunken | data-oppsett=rundt |
| ✓ | 1280 px: kortene dekker ikke hverandre, bunken eller «Legg sammen» |  |
| ✓ | bare Minnevers er merket «Uferdig» i viften | Uferdig |
| ✓ | viften har fem kort i fast rekkefølge | Teksten, Quiz, Øvekort, Fagsamtale, Minnevers |
| ✓ | viften har tittelen på teksten som navn |  |
| ✓ | fokus flyttes til det første kortet |  |
| ✓ | Tab og Shift+Tab holder fokus i viften | 0 av 14 trykk gikk ut |
| ✓ | resten av siden er inert mens viften er åpen |  |
| ✓ | axe: arbeidsbord med åpen vifte |  |
| ✓ | Esc lukker viften |  |
| ✓ | fokus tilbake på bunkens knapp etter Esc |  |
| ✓ | «Legg sammen» lukker viften og gir fokus tilbake |  |
| ✓ | Tab fra «+ Ny tekst» treffer aldri et usynlig element |  |
| ✓ | axe: samling |  |
| ✓ | FR-49: tittelen i Samlingen lenker til neste steg | /tekst/0dca01ff-f900-49e9-8c9b-d90bbae652c0/quiz |
| ✓ | FR-49: søk uten treff sier det, med «Vis alle» |  |
| ✓ | menyen markerer Samlingen som aktiv |  |
| ✓ | innlogget (/samling): ingen «Logg inn» eller «For lærere» i topplinjen |  |
| ✓ | axe: registrering (mørk) |  |
| ✓ | axe: arbeidsbord (mørk) |  |
| ✓ | axe: samling (mørk) |  |
| ✓ | axe: ny tekst (mørk) |  |
| ✓ | mørk: overskriftskontroll (3a) omdirigert, sjekkes ikke her | /tekst/0dca01ff-f900-49e9-8c9b-d90bbae652c0/aktivering |
| ✓ | axe: aktivering (mørk) |  |
| ✓ | axe: lesevisning (mørk) |  |
| ✓ | axe: oppgaver (mørk) |  |
| ✓ | axe: øvekort (mørk) |  |
| ✓ | axe: minnevers (mørk) |  |
| ✓ | axe: konto (mørk) |  |
| ✓ | axe: arbeidsbord med åpen vifte (mørk) |  |
| ✓ | axe: lesevisning med åpen forklaring (mørk) |  |
| ✓ | temavalg (tema=moerk, systemet lyst): HTML-en fra serveren har data-tema | <html lang="nb" data-tema="moerk"> |
| ✓ | temavalg (tema=moerk, systemet lyst): fargene, color-scheme og dark:-klassene følger valget | {"tema":"moerk","skjema":"dark","bakgrunn":"rgb(15, 18, 38)","darkKlasse":"rgb(169, 175, 211)"} |
| ✓ | axe: konto (tema=moerk, systemet lyst) |  |
| ✓ | axe: arbeidsbord (tema=moerk, systemet lyst) |  |
| ✓ | axe: lesevisning (tema=moerk, systemet lyst) |  |
| ✓ | temavalg (tema=moerk, systemet lyst): landingssiden følger valget |  |
| ✓ | axe: landingsside (tema=moerk, systemet lyst) |  |
| ✓ | temavalg (tema=lys, systemet mørkt): HTML-en fra serveren har data-tema | <html lang="nb" data-tema="lys"> |
| ✓ | temavalg (tema=lys, systemet mørkt): fargene, color-scheme og dark:-klassene følger valget | {"tema":"lys","skjema":"light","bakgrunn":"rgb(255, 245, 247)","darkKlasse":"rgb(90, 86, 112)"} |
| ✓ | axe: konto (tema=lys, systemet mørkt) |  |
| ✓ | axe: arbeidsbord (tema=lys, systemet mørkt) |  |
| ✓ | axe: lesevisning (tema=lys, systemet mørkt) |  |
| ✓ | temavalg (tema=lys, systemet mørkt): landingssiden følger valget |  |
| ✓ | axe: landingsside (tema=lys, systemet mørkt) |  |
| ✓ | temavalg: tema=rosa ignoreres, og siden følger systemet | {"tema":null,"skjema":"light dark","bakgrunn":"rgb(15, 18, 38)","darkKlasse":"rgb(169, 175, 211)"} |
| ✓ | temavalg (med JavaScript): «Utseende» er en fieldset med legend og tre radioknapper, «Følg enheten» valgt |  |
| ✓ | temavalg (med JavaScript): etter «Lagre» er «Mørk» valgt og statusen sier «Lagret: Mørk.» | valgt moerk, adresse /konto |
| ✓ | temavalg (med JavaScript): ny innlasting av /konto viser «Mørk» valgt, uten gammel melding | valgt moerk, 0 meldinger |
| ✓ | temavalg (med JavaScript): «Mørk» + «Lagre» gir tema=moerk (SameSite=Lax, ett år) og mørk side | moerk, Lax, 365 dager, rgb(15, 18, 38) |
| ✓ | temavalg (med JavaScript): andre sider er også mørke |  |
| ✓ | temavalg (med JavaScript): «Følg enheten» sletter informasjonskapselen og følger systemet igjen | {"tema":null,"skjema":"light dark","bakgrunn":"rgb(255, 245, 247)","darkKlasse":"rgb(90, 86, 112)"} |
| ✓ | temavalg (uten JavaScript): «Utseende» er en fieldset med legend og tre radioknapper, «Følg enheten» valgt |  |
| ✓ | temavalg (uten JavaScript): etter «Lagre» er «Mørk» valgt og statusen sier «Lagret: Mørk.» | valgt moerk, adresse /konto?lagret=utseende&n=1794901288509 |
| ✓ | temavalg (uten JavaScript): ny innlasting av /konto viser «Mørk» valgt, uten gammel melding | valgt moerk, 0 meldinger |
| ✓ | temavalg (uten JavaScript): «Mørk» + «Lagre» gir tema=moerk (SameSite=Lax, ett år) og mørk side | moerk, Lax, 365 dager, rgb(15, 18, 38) |
| ✓ | temavalg (uten JavaScript): andre sider er også mørke |  |
| ✓ | temavalg (uten JavaScript): «Følg enheten» sletter informasjonskapselen og følger systemet igjen | {"tema":null,"skjema":"light dark","bakgrunn":"rgb(255, 245, 247)","darkKlasse":"rgb(90, 86, 112)"} |
| ✓ | innlogget (/ på telefon): ingen «Logg inn» eller «For lærere» i topplinjen |  |
| ✓ | mobil uten sidelengs rulling: arbeidsbord | 375 px innhold i 375 px vindu |
| ✓ | axe: arbeidsbord (telefon) |  |
| ✓ | mobil uten sidelengs rulling: samling | 375 px innhold i 375 px vindu |
| ✓ | axe: samling (telefon) |  |
| ✓ | mobil uten sidelengs rulling: ny tekst | 375 px innhold i 375 px vindu |
| ✓ | axe: ny tekst (telefon) |  |
| ✓ | mobil uten sidelengs rulling: aktivering | 375 px innhold i 375 px vindu |
| ✓ | axe: aktivering (telefon) |  |
| ✓ | mobil uten sidelengs rulling: lesevisning | 375 px innhold i 375 px vindu |
| ✓ | axe: lesevisning (telefon) |  |
| ✓ | mobil uten sidelengs rulling: oppgaver | 375 px innhold i 375 px vindu |
| ✓ | axe: oppgaver (telefon) |  |
| ✓ | mobil uten sidelengs rulling: øvekort | 375 px innhold i 375 px vindu |
| ✓ | axe: øvekort (telefon) |  |
| ✓ | mobil uten sidelengs rulling: minnevers | 375 px innhold i 375 px vindu |
| ✓ | axe: minnevers (telefon) |  |
| ✓ | mobil uten sidelengs rulling: konto | 375 px innhold i 375 px vindu |
| ✓ | axe: konto (telefon) |  |
| ✓ | FR-10 telefon: trykk åpner forklaringen |  |
| ✓ | FR-10 telefon: forklaringen er innenfor skjermen | 12–363 px |
| ✓ | FR-10 telefon: rulleposisjonen står stille |  |
| ✓ | FR-10 telefon: trykk utenfor lukker |  |
| ✓ | mobil uten sidelengs rulling: lesevisning etter forklaring | 375 px innhold i 375 px vindu |
| ✓ | bolk 6, 375 px: Buddy (brillene 36 px) hilser ved «Hei!» med neste steg i boblen, aria-hidden | {"synlig":true,"skjult":true,"brille":36,"boble":"Klar for quizen om EM-bølger?","innenfor":true} |
| ✓ | bolk 6, 375 px: viften er et ark nederst, med fem rader, og arket og «Legg sammen» er innenfor skjermen | {"oppsett":"ark","posisjon":"fixed","arkInne":true,"lukkInne":true,"andel":66,"ruller":false,"siden":false,"rader":5} |
| ✓ | bolk 6, 375 px: arket er høyst 90 % av skjermen, og siden under ruller ikke | 66 % |
| ✓ | bolk 6, arket: fokus på den første raden |  |
| ✓ | bolk 6, arket: Tab og Shift+Tab holder fokus i arket | 0 av 11 trykk gikk ut |
| ✓ | mobil uten sidelengs rulling: arbeidsbord med åpent ark | 375 px innhold i 375 px vindu |
| ✓ | axe: arbeidsbord med åpent ark (telefon) |  |
| ✓ | bolk 6, arket: Esc lukker, har-ark er borte, siden ruller igjen, og fokus er tilbake på bunkens knapp | {"dialog":0,"harArk":false,"overflow":"visible","fokus":true} |
| ✓ | bolk 6, arket: trykk på bakgrunnen lukker, har-ark er borte, siden ruller igjen, og fokus er tilbake på bunkens knapp | {"dialog":0,"harArk":false,"overflow":"visible","fokus":true} |
| ✓ | bolk 6, arket: «Legg sammen» lukker, har-ark er borte, siden ruller igjen, og fokus er tilbake på bunkens knapp | {"dialog":0,"harArk":false,"overflow":"visible","fokus":true} |
| ✓ | menyen på telefon viser Samlingen og Konto |  |
| ✓ | bolk 5, 375 px: tenkepillen vises mens quizen lages |  |
| ✓ | bolk 5, 375 px: pillen ligger fast nederst med mini-Buddy (brillene 28 px) og «Buddy lager quizen din …» | {"posisjon":"fixed","nederst":16,"mini":true,"merke":28} |
| ✓ | bolk 5: pillen har én statusregion (ikke en ekstra), med teksten, og merkene er skjult for skjermlesere |  |
| ✓ | bolk 5: --tenker-pille på <html> er lik høyden på pillen, og html har klassen har-tenkepille | 86px / 86px |
| ✓ | bolk 5, 375 px: rullet til bunns er pillen fortsatt synlig, og ingen knapp eller lenke ligger under den |  |
| ✓ | bolk 5, 375 px: pillen dekker ikke fokusert innhold |  |
| ✓ | axe: quiz som lages, med tenkepillen (telefon) |  |
| ✓ | bolk 5, 375 px, 200 % tekst: rullet til bunns er pillen fortsatt synlig, og ingen knapp eller lenke ligger under den |  |
| ✓ | bolk 5, 375 px, 200 % tekst: pillen dekker ikke fokusert innhold |  |
| ✓ | bolk 5, 1280 px: ingen pille, flaten med Buddy på 64 px | {"posisjon":"static","mini":false,"merke":64,"luft":"0px","klasse":false} |
| ✓ | bolk 5: handlingen som ble holdt igjen (quizen), fikk svar |  |
| ✓ | bolk 5: pillen forsvinner når quizen er laget |  |
| ✓ | bolk 5: quizsiden har «Lever»-knappen (Tenker i knapp-form) |  |
| ✓ | bolk 5, knapp: låst med aria-disabled, opasitet ≥ 0,9, brillene om lag 20 px, statusen som knappetekst og fokus på knappen | {"laast":true,"opasitet":1,"brille":20,"tekst":"Buddy retter quizen …","fokus":true} |
| ✓ | bolk 5, knapp: et nytt trykk mens Buddy tenker, sender ikke en gang til | 1 kall |
| ✓ | bolk 5: handlingen som ble holdt igjen (rettingen), fikk svar |  |
| ✓ | mobil uten sidelengs rulling: arbeidsbord 320 px | 320 px innhold i 320 px vindu |
| ✓ | ingen tekst klippes: arbeidsbord 320 px |  |
| ✓ | mobil uten sidelengs rulling: samling 320 px | 320 px innhold i 320 px vindu |
| ✓ | ingen tekst klippes: samling 320 px |  |
| ✓ | mobil uten sidelengs rulling: ny tekst 320 px | 320 px innhold i 320 px vindu |
| ✓ | ingen tekst klippes: ny tekst 320 px |  |
| ✓ | mobil uten sidelengs rulling: arbeidsbord 320 px, 200 % tekst | 320 px innhold i 320 px vindu |
| ✓ | ingen tekst klippes: arbeidsbord 320 px, 200 % tekst |  |
| ✓ | mobil uten sidelengs rulling: samling 320 px, 200 % tekst | 320 px innhold i 320 px vindu |
| ✓ | ingen tekst klippes: samling 320 px, 200 % tekst |  |
| ✓ | mobil uten sidelengs rulling: ny tekst 320 px, 200 % tekst | 320 px innhold i 320 px vindu |
| ✓ | ingen tekst klippes: ny tekst 320 px, 200 % tekst |  |
| ✓ | mobil uten sidelengs rulling: åpent ark 320 px, 200 % tekst | 320 px innhold i 320 px vindu |
| ✓ | ingen tekst klippes: åpent ark 320 px, 200 % tekst |  |
| ✓ | bolk 6, 320 px, 200 % tekst: arket ruller internt, er høyst 90 % av skjermen, og «Legg sammen» er innenfor skjermen | {"oppsett":"ark","posisjon":"fixed","arkInne":true,"lukkInne":true,"andel":90,"ruller":true,"siden":false,"rader":5} |
| ✓ | 1280 px, 200 % tekst: viften er et rutenett | data-oppsett=rutenett |
| ✓ | mobil uten sidelengs rulling: åpen vifte 1280 px, 200 % tekst | 1280 px innhold i 1280 px vindu |
| ✓ | ingen tekst klippes: åpen vifte 1280 px, 200 % tekst |  |
| ✓ | 375 px: ingen tittel i en liten bunke brytes midt i et ord («Novelleanalyse» på én linje) | Novelleanalyse, EM-bølger |
| ✓ | bolk 6, 375 px: de små bunkene er striper i full bredde med «N av 5», og knappen heter fortsatt «Vis aktiviteter for …» | {"full":true,"dato":false,"synlig":"0 av 5","skjult":true,"lest":"0 av 5 påbegynt","navn":"Vis aktiviteter for Novelleanalyse"} |
| ✓ | bolk 6, arket: en tekst som bare er lagt inn, har fire låste rader (ikke lenker) etter Teksten | [{"lenke":true,"laast":false,"pil":true},{"lenke":false,"laast":true,"pil":false},{"lenke":false,"laast":true,"pil":false},{"lenke":false,"laast":true,"pil":false},{"lenke":false,"laast":true,"pil":false}] |
| ✓ | bolk 6, arket: pilen vises på den åpne raden og ikke på de låste | pil - - - - |
| ✓ | axe: arbeidsbord med åpent ark, låst tekst (telefon) |  |
| ✓ | 320 px, 200 % tekst: ingen tittel i en liten bunke brytes midt i et ord («Novelleanalyse» på én linje) | Novelleanalyse, EM-bølger |
| ✓ | mobil uten sidelengs rulling: arbeidsbord med striper 320 px, 200 % tekst | 320 px innhold i 320 px vindu |
| ✓ | ingen tekst klippes: arbeidsbord med striper 320 px, 200 % tekst |  |
| ✓ | 1280 px: ingen hilsen-Buddy (Buddy står på bordet), og datoen og «påbegynt» er synlige på alle bunkene | {"hilsen":false,"bordBuddy":true,"dato":[true,true,true],"paabegynt":[true,true,true]} |
| ✓ | 1280 px: viften har kort uten pil (pilen hører til arket på telefon) |  |
| ✓ | FR-47: / uten innlogging gir 200 med landingssiden, ikke en omdirigering | status 200 |
| ✓ | FR-47: landingssiden har «Logg inn» og «Registrer deg» |  |
| ✓ | FR-47: siden sier at registrering krever en kode fra læreren |  |
| ✓ | landingssiden har én h1 |  |
| ✓ | demoen har overskriften «Se hvordan Buddy markerer fagord» |  |
| ✓ | topplinjen på landingssiden: «For lærere» og «Logg inn», ikke appmenyen |  |
| ✓ | skjermleser: ingen live-regioner på landingssiden, Følge-Buddy er aria-hidden |  |
| ✓ | rulleeffektene A og C er slått på med JavaScript og bevegelse |  |
| ✓ | effekt A: fagordene markeres ett for ett, og alle forklaringene står i DOM-en | 3 markert, 1 vist, 4 i listen |
| ✓ | 1280 px: ingen Følge-Buddy, fordi den ville dekket tekstkolonnen |  |
| ✓ | effekt C: alle stegene har dukket fram etter rullingen |  |
| ✓ | axe: landingsside |  |
| ✓ | redusert bevegelse slått på underveis: statisk versjon og ingen effekt-klasser | 3 steg, 4 fagord markert, 4 forklaringer, Følge-Buddy skjult |
| ✓ | 1920 px: Følge-Buddy vises når heroen er rullet forbi, med boblen, utenfor tekstkolonnen | Buddy/boble fra 1705 px, tekstkolonnen slutter ved 1480 px |
| ✓ | axe: landingsside (mørk) |  |
| ✓ | /logg-inn: ingen «Logg inn» eller «For lærere» i topplinjen |  |
| ✓ | redusert bevegelse (lys): den statiske versjonen | 3 steg, 4 fagord markert, 4 forklaringer, Følge-Buddy skjult |
| ✓ | axe: landingsside med redusert bevegelse (lys) |  |
| ✓ | redusert bevegelse (mørk): den statiske versjonen | 3 steg, 4 fagord markert, 4 forklaringer, Følge-Buddy skjult |
| ✓ | axe: landingsside med redusert bevegelse (mørk) |  |
| ✓ | uten JavaScript: alle steg, alle fire fagord markert og forklaringslisten synlige | 3 steg, 4 fagord markert, 4 forklaringer, Følge-Buddy skjult |
| ✓ | mobil uten sidelengs rulling: landingsside (lys) | 375 px innhold i 375 px vindu |
| ✓ | telefon (lys): ingen Følge-Buddy |  |
| ✓ | telefon (lys): «For lærere» er skjult i topplinjen, men lærerdelen står |  |
| ✓ | axe: landingsside (telefon, lys) |  |
| ✓ | mobil uten sidelengs rulling: landingsside (mørk) | 375 px innhold i 375 px vindu |
| ✓ | telefon (mørk): ingen Følge-Buddy |  |
| ✓ | telefon (mørk): «For lærere» er skjult i topplinjen, men lærerdelen står |  |
| ✓ | axe: landingsside (telefon, mørk) |  |
| ✓ | landingsside 375 px (bevegelse tillatt): ingen tomrom over 160 px mellom demoen og neste seksjon, og effekt A er av | 144 px, effekt A av |
| ✓ | landingsside 375 px: fire fagord er knapper (aria-expanded, aria-controls), panelet er aldri tomt, og <dl> er bare visuelt skjult | {"antall":4,"lukket":true,"panel":true,"panelTekst":"Trykk på et fagord i teksten, så forklarer Buddy det.","dlSkjult":true,"dt":4} |
| ✓ | landingsside 375 px: trykk på «mitose» viser forklaringen under teksten med Buddy (30 px), og fokus blir på ordet | {"valgt":"mitose","fokus":true,"panel":"mitoseCelledeling der én celle blir til to like celler med samme arvestoff. Avsnitt 1","under":true,"buddy":30,"live":0} |
| ✓ | landingsside 375 px: trykkdemoen har ingen aria-live |  |
| ✓ | landingsside 375 px: siden ruller ikke av trykket |  |
| ✓ | mobil uten sidelengs rulling: landingsside med trykkdemoen | 375 px innhold i 375 px vindu |
| ✓ | axe: landingsside med åpen forklaring i trykkdemoen (telefon) |  |
| ✓ | landingsside 375 px: trykk på et annet ord («kromosomene») flytter aria-expanded og bytter forklaringen | {"aapne":["kromosomene"],"panel":"kromosomEn pakke med arvestoff. Mennesket har 46 i hver kroppscelle. Avsnitt 1"} |
| ✓ | landingsside 375 px: nytt trykk på samme ord lukker forklaringen (aria-expanded=false, hinten tilbake) | {"aapne":[],"panel":"Trykk på et fagord i teksten, så forklarer Buddy det."} |
| ✓ | landingsside 375 px (redusert bevegelse): ingen tomrom over 160 px mellom demoen og neste seksjon, og effekt A er av | 144 px, effekt A av |
| ✓ | landingsside 375 px, redusert bevegelse: den statiske demoen (fire markert og listen), ingen knapper | 3 steg, 4 fagord markert, 4 forklaringer, Følge-Buddy skjult |
| ✓ | landingsside 375 px uten JavaScript: den statiske demoen med alle fire forklaringer | 3 steg, 4 fagord markert, 4 forklaringer, Følge-Buddy skjult |
| ✓ | mobil uten sidelengs rulling: landingsside 320 px, 200 % tekst | 320 px innhold i 320 px vindu |
| ✓ | ingen tekst klippes: landingsside 320 px, 200 % tekst |  |
| ✓ | 320 px, 200 % tekst: effekt A er av, og trykkdemoen viser forklaringen | {"a":false,"panel":"kromosomEn pakke med arvestoff. Mennesket har 46 i hver kroppscelle. Avsnitt 1"} |
| ✓ | mobil uten sidelengs rulling: landingsside 320 px, 200 % tekst, åpen forklaring | 320 px innhold i 320 px vindu |
| ✓ | ingen tekst klippes: landingsside 320 px, 200 % tekst, åpen forklaring |  |
| ✓ | mobil uten sidelengs rulling: landingsside 320 px, 200 % tekst, redusert bevegelse | 320 px innhold i 320 px vindu |
| ✓ | ingen tekst klippes: landingsside 320 px, 200 % tekst, redusert bevegelse |  |
| ✓ | 1920 px, 200 % tekst: ingen Følge-Buddy |  |
| ✓ | mobil uten sidelengs rulling: landingsside 1920 px, 200 % tekst | 1920 px innhold i 1920 px vindu |
| ✓ | rotasjon, landingsside 375 px: trykkdemoen med fire knapper, effekt A av | {"effektA":false,"knapper":4,"spenn":0,"paa":0,"klistret":false,"panel":"Trykk på et fagord i teksten, så forklarer Buddy det."} |
| ✓ | rotasjon, landingsside 1280 px: demosporet finnes |  |
| ✓ | rotasjon, landingsside 375 → 1280 px: effekt A markerer span.ls-fagord, og ingen knapper er igjen | {"effektA":true,"knapper":0,"spenn":4,"paa":3,"klistret":true,"panel":""} |
| ✓ | rotasjon, landingsside 1280 → 375 px: trykkdemoen er tilbake, uten rester av effekt A | {"effektA":false,"knapper":4,"spenn":0,"paa":0,"klistret":false,"panel":"Trykk på et fagord i teksten, så forklarer Buddy det."} |
| ✓ | rotasjon, landingsside 375 px igjen: et trykk på «mitose» viser forklaringen | mitoseCelledeling der én celle blir til  |
| ✓ | mobil uten sidelengs rulling: landingsside etter rotasjon | 375 px innhold i 375 px vindu |
| ✓ | rotasjon, arbeidsbord 375 px: arket er åpent | {"dialog":true,"oppsett":"ark","harArk":true,"overflow":"hidden","inert":11,"fokusIDialog":true} |
| ✓ | rotasjon, arbeidsbord 375 → 1280 px med arket åpent: viften står åpen som vifte, uten har-ark, og resten av siden er fortsatt inert | {"dialog":true,"oppsett":"rundt","harArk":false,"overflow":"visible","inert":11,"fokusIDialog":true} |
| ✓ | mobil uten sidelengs rulling: arbeidsbord med åpen vifte etter rotasjon | 1280 px innhold i 1280 px vindu |
| ✓ | rotasjon, arbeidsbord 1280 → 375 px: viften er et ark igjen | {"dialog":true,"oppsett":"ark","harArk":true,"overflow":"hidden","inert":11,"fokusIDialog":true} |
| ✓ | rotasjon, arbeidsbord: Esc etter rotasjonene lukker, og ingen inert- eller har-ark-rester står igjen | {"dialog":false,"oppsett":null,"harArk":false,"overflow":"visible","inert":0,"fokusIDialog":false} |
| ✓ | rotasjon: ingen skriptfeil i nettleseren |  |
| ✓ | gjennomsyn (pdf, lys): siden vises med redigeringsfeltet | /tekst/81efb611-c6f4-4343-b522-929ab35d84ac/gjennomsyn |
| ✓ | gjennomsyn (pdf, lys): innlesingsrapporten står over feltet |  |
| ✓ | axe: gjennomsyn via pdf (lys) |  |
| ✓ | gjennomsyn (pdf, mørk): siden vises med redigeringsfeltet | /tekst/81efb611-c6f4-4343-b522-929ab35d84ac/gjennomsyn |
| ✓ | gjennomsyn (pdf, mørk): innlesingsrapporten står over feltet |  |
| ✓ | axe: gjennomsyn via pdf (mørk) |  |
| ✓ | gjennomsyn (bilde, lys): siden vises med redigeringsfeltet | /tekst/ca87ccf8-3370-4b74-9811-bc5881e10c36/gjennomsyn |
| ✓ | axe: gjennomsyn via bilde (lys) |  |
| ✓ | gjennomsyn (bilde, mørk): siden vises med redigeringsfeltet | /tekst/ca87ccf8-3370-4b74-9811-bc5881e10c36/gjennomsyn |
| ✓ | axe: gjennomsyn via bilde (mørk) |  |
| ✓ | FR-6: gammel tekst viser «Før du leste, skrev du: …» | Før du leste Før du leste, skrev du: Noe om bølger og lys. |
| ✓ | gjennomsyn: prøvetekstene er ryddet bort | 3 av 3 |
| ✓ | PRD §6.4: 5 tekster i dag — /ny viser meldingen før innlesingen, med lenke til arbeidsbordet | Du har lagt inn 5 tekster i dag.Du kan legge inn flere i morgen.Til arbeidsbordet |
| ✓ | axe: ny tekst, grensen er nådd |  |
| ✓ | PRD §6.4: taket er nådd — ny quiz gir takmeldingen i stedet for tenkeindikatoren, og ingen quiz lages | 0 quiz(er) |
| ✓ | axe: quiz, dagstaket er nådd |  |

Det axe-core ikke kan se — om rekkefølgen gir mening, om teksten er forståelig — krever en person. Se også testen på ekte telefon i fremdriftsplanen.
