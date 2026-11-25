# Tilgjengelighetssjekk — 2026-11-25

Kjørt med `npm run sjekk:tilgjengelighet`: Chrome, PC (1280 px, lys og mørk modus) og telefon (375 px, berøring), axe-core WCAG 2.1 A/AA.

**656 av 656 sjekker bestått.**

| | Sjekk | Detalj |
|---|---|---|
| ✓ | axe: registrering |  |
| ✓ | FR-53: avkrysningene for alder og vilkår er påkrevde og ikke forhåndsavkrysset |  |
| ✓ | FR-53: uten avkrysning sendes ikke skjemaet | http://localhost:3107/registrer |
| ✓ | FR-53: registreringen lenker til «Vilkår og personvern» |  |
| ✓ | FR-53: avkrysningen virker med tastaturet |  |
| ✓ | FR-48: tomt arbeidsbord for ny elev |  |
| ✓ | axe: arbeidsbord (tomt) |  |
| ✓ | FR-53: kontosiden lenker til «Vilkår og personvern» |  |
| ✓ | hopp-lenken er første fokus | fikk «Hopp til innholdet» |
| ✓ | axe: ny tekst |  |
| ✓ | fokusringen på primærknappen er 3 px heltrukken i primærfargen | «Begynn»: solid 3px rgb(100, 39, 214) |
| ✓ | axe: overskriftskontroll (3a) |  |
| ✓ | FR-3: brødteksten finnes ikke i kildekoden i fase 3a | prøve: «Inspirert av Maxwells teorier for elektromagnetiske» |
| ✓ | axe: aktivering |  |
| ✓ | FR-5: brødteksten finnes ikke i kildekoden i aktiveringen |  |
| ✓ | axe: aktivering (375 px) |  |
| ✓ | FR-6 (23.11): hver overskrift har én glider navngitt av overskriften (legend), uten eget feltnavn | 8 overskrifter: «Egenskaper hos ulike EM-bølger» (1), «Radiobølger» (1), «Mikrobølger» (1), «Infrarød stråling» (1), «Synlig lys» (1), «Ultrafiolett stråling» (1), «Røntgenstråling» (1), «Gammastråling» (1) |
| ✓ | FR-6 (23.11): trinnmerkene «Ingenting ennå / Litt / Mye» står under glideren, og knappen heter «Skjønner ikke overskriften» (aria-pressed=false) | Ingenting ennå / Litt / Mye; «Skjønner ikke overskriften» false |
| ✓ | FR-6 (23.11): urørt sier glideren «Ikke merket ennå», synlig og som aria-valuetext, og skjemaet sender ingen merker | Ikke merket ennå / Ikke merket ennå; {} |
| ✓ | FR-6 (18.11): «Hva vet du om dette fra før?» står én gang over overskriftene og beskriver hver glider | Hva vet du om dette fra før? |
| ✓ | FR-6 (23.11): glideren og knappen har minst 44 px trykkflate | 44/44, 44/44, 44/44, 44/44, 44/44, 44/44, 44/44, 44/44 |
| ✓ | axe: aktivering (375 px, mørk modus) |  |
| ✓ | FR-6 (23.11): på 320 px står glideren, trinnmerkene og knappen innenfor overskriften, og siden ruller ikke sidelengs |  |
| ✓ | axe: aktivering (320 px) |  |
| ✓ | FR-6 (23.11): på 320 px med 200 % tekst kuttes ingenting, og siden ruller ikke sidelengs |  |
| ✓ | FR-6: Tab når første glider, med synlig fokusring | {"type":"range","tag":"INPUT","tekst":"","trykket":"","navn":"merke-1-navn","overskrift":0,"verditekst":"Ikke merket ennå","status":"Ikke merket ennå","ring":"solid","synlig":true,"sidelengs":false} |
| ✓ | FR-6 (23.11): mellomrom på en urørt glider velger «Litt» (`litt`) | 0:range «Litt» ; {"merke-1":"litt"} |
| ✓ | FR-6 (23.11): valgt trinn ses uten farge alene: «Litt» under sporet er fet og understreket, de andre ikke | [{"tekst":"Ingenting ennå","valgt":false,"vekt":400,"strek":"none"},{"tekst":"Litt","valgt":true,"vekt":700,"strek":"underline"},{"tekst":"Mye","valgt":false,"vekt":400,"strek":"none"}] |
| ✓ | FR-6 (23.11): → gir «Mye» (aria-valuetext, det skjermleseren leser) og `kjent` | 0:range «Mye» ; {"merke-1":"kjent"} |
| ✓ | FR-6 (23.11): ← går et trinn tilbake, til «Litt» | 0:range «Litt»  |
| ✓ | FR-6 (23.11): Tab går glider → «Skjønner ikke overskriften» → neste glider → dens knapp | 0:button «Litt» false → 1:range «Ikke merket ennå»  → 1:button «Ikke merket ennå» false |
| ✓ | FR-6 (23.11): «Skjønner ikke overskriften» på har hake (ikke farge alene) | "✓" / "" |
| ✓ | FR-6 (23.11): «Skjønner ikke overskriften» på: aria-pressed=true, glideren «Satt til side», `uklar` sendes | 1:button «Satt til side» true; {"merke-1":"litt","merke-2":"uklar"} |
| ✓ | FR-6 (23.11): av igjen over en urørt glider: «Ikke merket ennå», og ingenting sendes for overskriften | 1:button «Ikke merket ennå» false; {"merke-1":"litt"} |
| ✓ | FR-6 (23.11): ← etter «Skjønner ikke»: «Ingenting ennå» (`nytt`), og knappen går av | 1:range «Ingenting ennå» , knapp false; {"merke-1":"litt","merke-2":"nytt"} |
| ✓ | FR-6 (23.11): av igjen over en rørt glider: glideren har sin verdi («Ingenting ennå») | 1:button «Ingenting ennå» false |
| ✓ | FR-6 (23.11): knappen på igjen sender `uklar` | {"merke-1":"litt","merke-2":"uklar"} |
| ✓ | FR-6 (23.11): klikk på håndtaket i midten av en urørt glider velger «Litt» | Litt; {"merke-1":"litt","merke-2":"uklar","merke-6":"litt"} |
| ✓ | bolk 8: under et musedrag fra «Litt» glir håndtaket fritt (verdien følger pekeren, mellom trinnene, uten hopp) | →1.00 «Litt» lyser «Litt» step 1 \| 1.15→1.15 «Litt» lyser «Litt» step any \| 1.3→1.30 «Litt» lyser «Litt» step any \| 1.42→1.42 «Litt» lyser «Litt» step any \| 1.58→1.58 «Mye» lyser «Mye» step any \| 1.7→1.70 «Mye» lyser «Mye» step any |
| ✓ | bolk 8: under draget lyser trinnet nærmest, og aria-valuetext er trinnets navn («Litt», så «Mye»), aldri et desimaltall | 1.15→1.15 «Litt» lyser «Litt» step any \| 1.3→1.30 «Litt» lyser «Litt» step any \| 1.42→1.42 «Litt» lyser «Litt» step any \| 1.58→1.58 «Mye» lyser «Mye» step any \| 1.7→1.70 «Mye» lyser «Mye» step any |
| ✓ | bolk 8: slipp nærmest «Mye»: håndtaket smetter inn på «Mye» (verdi 2, step 1), og skjemaet sender `kjent` | →2.00 «Mye» lyser «Mye» step 1; kjent |
| ✓ | bolk 8: slipp utenfor glideren: håndtaket smetter inn på trinnet nærmest der det sto («Ingenting ennå», `nytt`) | →0.30 «Ingenting ennå» lyser «Ingenting ennå» step any → →0.00 «Ingenting ennå» lyser «Ingenting ennå» step 1; nytt |
| ✓ | bolk 8: trykk uten drag ytterst til høyre på en urørt glider (iOS Safari): «Mye» og `kjent` | {"verdi":"1","tekst":"Ikke merket ennå","step":"1"} → {"verdi":"2","tekst":"Mye","step":"1"}; {"merke-1":"kjent","merke-2":"nytt"} |
| ✓ | bolk 8: trykk uten drag ytterst til venstre på en urørt glider (iOS Safari): «Ingenting ennå» og `nytt` | {"verdi":"1","tekst":"Ikke merket ennå","step":"1"} → {"verdi":"0","tekst":"Ingenting ennå","step":"1"}; {"merke-1":"kjent","merke-2":"nytt"} |
| ✓ | bolk 8: et drag avbrutt med pointercancel smetter inn på trinnet nærmest («Litt», verdi 1, step 1) | {"verdi":"1.29993327402135","tekst":"Litt","step":"any"} → {"verdi":"1","tekst":"Litt","step":"1"} → slipp {"verdi":"1","tekst":"Litt","step":"1"} |
| ✓ | FR-6: aktiveringen ruller ikke sidelengs på 375 px |  |
| ✓ | overleveringen, 1280 px: avslutningen spilles i et fast kort nederst til høyre (16 px), Buddy 64 px, «Teksten er klar.» | {"posisjon":"fixed","hoeyre":16,"nederst":16,"mini":false,"merke":64,"tekst":"Teksten er klar.","side":{"luft":"0px","hoeyde":4266,"pille":false}} |
| ✓ | overleveringen, 1280 px: siden blir ikke lengre mens kortet vises (ingen luft nederst, ikke har-tenkepille) | {"luft":"0px","hoeyde":4266,"pille":false} / etter {"luft":"0px","hoeyde":4266,"pille":false} |
| ✓ | axe: lesevisning |  |
| ✓ | FR-6: «Før du leste» viser spørsmålet, lenken til fagsamtalen og overskriften eleven ikke skjønte (18.11) | Før du leste Du lurte på: Hvorfor kan vi ikke se radiobølger? Fikk du svar? Sjekk om du kan forklare det med egne ord. Til fagsamtalen Du visste ingenting om dette fra før: Egenskaper hos ulike EM-bøl |
| ✓ | FR-6: «Før du leste» står rett før «Ferdig med å lese?» |  |
| ✓ | FR-6: låst aktivering viser «du merket: Skjønner ikke overskriften» ved overskriften eleven ikke skjønte | Radiobølger— du merket: Skjønner ikke overskriften |
| ✓ | FR-6: låst aktivering har verken glidere, «Skjønner ikke»-knapper eller spørsmålsfelt |  |
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
| ✓ | FR-48: hovedbunken har neste steg som egen lenke, rett til steget | «Neste: Ta quizen →» → /tekst/aaabc9a3-d7db-45d1-a32c-75f872009fc7/quiz |
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
| ✓ | FR-49: tittelen i Samlinger lenker til neste steg | /tekst/aaabc9a3-d7db-45d1-a32c-75f872009fc7/quiz |
| ✓ | FR-49: søk uten treff sier det, med «Vis alle» |  |
| ✓ | menyen markerer Samlinger som aktiv |  |
| ✓ | overskriften på /samling er «Samlinger» |  |
| ✓ | innlogget (/samling): ingen «Logg inn» eller «For lærere» i topplinjen |  |
| ✓ | FR-50: Samlinger har «Mappene dine» øverst |  |
| ✓ | bolk 4 (23.11): uten mapper har Samlinger ingen «Legg i mappe» og ingen dragbar tekstrad | data-dra=av |
| ✓ | bolk 6 (24.11): uten mapper finnes ingen dra-tegn (grep-ikon eller «Dra en tekst til en mappe.») | {"grep":0,"setning":0} |
| ✓ | bolk 6: «Ny mappe» har plassholderen «Eks. Samfunnsfag: demokrati», ingen hjelpetekst og ingen maxlength | {"plassholder":"Eks. Samfunnsfag: demokrati","maxLength":null,"hjelp":0} |
| ✓ | bolk 6: 81 tegn og mer: feltet tar imot teksten, er aria-invalid, og meldingen sier at navnet er for langt og hvor mange tegn det har | {"verdi":83,"ugyldig":"true","beskrivelse":"Navnet er for langt. Det har 83 tegn, og en mappe kan hete høyst 80.","opplest":["Navnet er for langt."]} |
| ✓ | bolk 6: statusregionen får «Navnet er for langt.» én gang, ikke for hvert tegn | ["Navnet er for langt."] |
| ✓ | axe: samling, for langt mappenavn |  |
| ✓ | bolk 6: sendes et for langt navn likevel, avviser serveren det (MAPPE_AVVIST.langTittel), og ingen mappe lages | http://localhost:3107/samling |
| ✓ | bolk 6: etter avvisningen står det lange navnet fortsatt i feltet, med aria-invalid og samme lengdemelding | {"verdi":83,"ugyldig":"true","melding":"Navnet er for langt. Det har 83 tegn, og en mappe kan hete høyst 80."} |
| ✓ | axe: mappe uten tekster |  |
| ✓ | bolk 6: «Gi mappen nytt navn» starter med mappenavnet, og 81 tegn gir aria-invalid, lengdemeldingen og «Navnet er for langt.» i statusregionen | {"start":"Naturfag","ugyldig":"true","beskrivelse":"Navnet er for langt. Det har 81 tegn, og en mappe kan hete høyst 80.","status":"Navnet er for langt."} |
| ✓ | FR-50: teksten ligger i mappen |  |
| ✓ | axe: mappe |  |
| ✓ | axe: mappe: øvekort |  |
| ✓ | axe: mappe: quiz, valg av lengde |  |
| ✓ | axe: mappe: quiz, kort |  |
| ✓ | FR-51: kildeavsnittet i mappen lenker til kortets egen tekst | /tekst/aaabc9a3-d7db-45d1-a32c-75f872009fc7/lesing#avsnitt-3 |
| ✓ | FR-51: et kort merket «Har kontroll» i mappen står som merket i teksten |  |
| ✓ | FR-50: arbeidsbordet lenker til «Mappene dine» |  |
| ✓ | bolk 4 (23.11), 1280 px: to kolonner, tekstene ~30 % til venstre og mappene ~70 % til høyre, i flukt øverst | {"andel":0.29999704071969696,"mapperTilHoeyre":true,"sammeTopp":true,"rutenett":true,"mapperFoerst":true,"sidelengs":false} |
| ✓ | bolk 4, 1280 px: mappene er kort i et rutenett, og står først i kildekoden (Tab går gjennom dem før tekstene) |  |
| ✓ | runde 3, bolk 7 (24.11), 1280 px: hvert mappekort har en fane øverst til venstre i samme kant og flate som kortet (pynt, tomt innhold), innenfor «Mappene dine», uten å dekke kort, overskrift eller melding; ingen merkelapp «Mappe» | {"kort":3,"pynt":true,"form":true,"kantOgFlate":true,"oeverstTilVenstre":true,"iMapper":true,"dekkerKort":false,"dekkerOverListen":false,"kolonner":3,"rader":1,"skillelinjer":false,"merkelapp":false,"minHoeyde":7,"enRad":false,"innhold":["lenke,mappekort-antall"],"sidelengs":false} |
| ✓ | bolk 4, 1280 px: tekstraden er stablet, knappene under tittel, tilstand og neste steg |  |
| ✓ | bolk 4, 1280 px: tekstraden er dragbar når eleven har mapper |  |
| ✓ | bolk 4: «Prøve» og «Eksamen» starter tomme |  |
| ✓ | bolk 6 (24.11), 1280 px: hver dragbar rad har grep-ikonet (⠿, aria-hidden) til venstre, og «Dra en tekst til en mappe.» står over tekstene | {"rader":1,"grep":true,"setning":"⠿ Dra en tekst til en mappe.","overTekstene":true,"gap":4,"lenke":"false"} |
| ✓ | bolk 6, 1280 px: 4 rem mellom kolonnene | 4 rem |
| ✓ | bolk 6: tittellenken er ikke dragbar selv mens draget er på (draggable=false) | false |
| ✓ | bolk 6: en dragbar rad får markeringsflaten ved hover | rgba(0, 0, 0, 0) → rgb(255, 224, 238) |
| ✓ | bolk 6 (punkt 6): et musedrag fra «Legg i mappe», «Legg i mappen» og «Slett» til en mappe endrer ingenting | {"drag":[{"avbrutt":true,"typer":[]},{"avbrutt":true,"typer":[]},{"avbrutt":true,"typer":[]}],"antall":"0 tekster","melding":"","bekreftelse":0,"dras":0} |
| ✓ | bolk 6 (punkt 7): tittellenken dratt til søkefeltet og mappenavnfeltet setter ingenting inn i feltene | {"drag":[{"avbrutt":false,"typer":["application/x-lesebuddy-tekst"]},{"avbrutt":false,"typer":["application/x-lesebuddy-tekst"]}],"sok":"","mappenavn":"","antall":"0 tekster"} |
| ✓ | bolk 4: slippmålet markeres mens teksten dras over det (heltrukken kant, skygge og «Slipp for å legge i mappen») | {"klasse":true,"skygge":true,"kant":"solid","tekst":true} |
| ✓ | runde 3, bolk 7, drag: fanen er stiplet i primærfargen på alle kortene; på kortet teksten er over er den heltrukken, og ringen (3 px) går rundt både kort og fane | {"primaer":"rgb(100, 39, 214)","kortene":[{"over":false,"kort":"dashed","fane":"dashed","farge":true,"ring":"none","kortring":"none","klipp":"inset(-3px -3px 0px)"},{"over":true,"kort":"solid","fane":"solid","farge":true,"ring":"rgb(100, 39, 214) 0px 0px 0px 3px","kortring":"rgb(100, 39, 214) 0px 0px 0px 3px","klipp":"inset(-3px -3px 0px)"},{"over":false,"kort":"dashed","fane":"dashed","farge":true,"ring":"none","kortring":"none","klipp":"inset(-3px -3px 0px)"}]} |
| ✓ | bolk 4: dra «EM-bølger» til «Prøve» gir status-melding, og antallet øker til 1 | 1 tekst |
| ✓ | bolk 6: meldingen etter slippet står i en fremhevet boks (role=status, ikon, fet skrift, kant og flate) | {"rolle":"status","kant":"solid 2","flate":true,"fet":true,"ikon":"✓","slag":"lagt"} |
| ✓ | bolk 4: dra til en mappe teksten alt ligger i, endrer ingenting og sier det |  |
| ✓ | bolk 6: «alt med»-meldingen har ikonet «i» og dempet stil (data-slag=uendret, vanlig vekt) | {"rolle":"status","kant":"solid 2","flate":true,"fet":false,"ikon":"i","slag":"uendret"} |
| ✓ | bolk 4: «Legg i mappe» har tekstens tittel i navnet for skjermlesere | Legg i mappe «EM-bølger» |
| ✓ | bolk 4: mappene teksten alt ligger i, står som «(alt med)» og kan ikke velges | [{"tekst":"Eksamen","av":false},{"tekst":"Prøve (alt med)","av":true},{"tekst":"Naturfag (alt med)","av":true}] |
| ✓ | bolk 4: «Legg i mappe» med bare tastaturet: valget, knappen og meldingen nås, og «Eksamen» får 1 tekst | {"valgFokus":true,"knappFokus":true,"knappLagt":true,"antall":"1 tekst"} |
| ✓ | bolk 6: meldingen fra «Legg i mappe» står i den samme fremhevede boksen | {"rolle":"status","kant":"solid 2","flate":true,"fet":true,"ikon":"✓","slag":"lagt"} |
| ✓ | axe: samling med mapper og åpen «Legg i mappe» |  |
| ✓ | bolk 4: teksten som ble dratt til «Prøve», står på /mappe/{id} |  |
| ✓ | bolk 4, 759 px: én kolonne med mappene øverst, «Legg i mappe» finnes, og ingen rad er dragbar | {"dra":"av","mapperOver":true,"sidelengs":false,"dragbare":0,"knapper":1} |
| ✓ | bolk 4, 375 px: én kolonne med mappene øverst, «Legg i mappe» finnes, og ingen rad er dragbar | {"dra":"av","mapperOver":true,"sidelengs":false,"dragbare":0,"knapper":1} |
| ✓ | bolk 4, 760 px med 200 % tekst: fortsatt to kolonner, og siden ruller ikke sidelengs | {"dra":"på","tekstbredde":180,"toKolonner":true,"sidelengs":false,"gap":3} |
| ✓ | bolk 6, 760 px: 3 rem mellom kolonnene | 3 rem |
| ✓ | ingen tekst klippes: samling 760 px, 200 % tekst |  |
| ✓ | runde 3, bolk 7, 1280 px med 200 % tekst: hvert mappekort har fanen, minst 7 rem høyt, og ingen fane dekker kortet over, overskriften eller meldingen; ingen sidelengs rulling | {"kort":3,"pynt":true,"form":true,"kantOgFlate":true,"oeverstTilVenstre":true,"iMapper":true,"dekkerKort":false,"dekkerOverListen":false,"kolonner":1,"rader":3,"skillelinjer":false,"merkelapp":false,"minHoeyde":7,"enRad":false,"innhold":["lenke,mappekort-antall"],"sidelengs":false} |
| ✓ | runde 3, bolk 7, 1280 px med 200 % tekst, navn på 80 tegn: navnet brytes over flere linjer inne i kortet, fanen står fast og dekker ingenting, og siden ruller ikke sidelengs | {"brytes":{"flereLinjer":true,"inni":true},"sidelengs":false,"dekkerKort":false,"oeverstTilVenstre":true} |
| ✓ | runde 3, bolk 7, 760 px: hvert mappekort har fanen, minst 7 rem høyt, og ingen fane dekker kortet over, overskriften eller meldingen; ingen sidelengs rulling | {"kort":3,"pynt":true,"form":true,"kantOgFlate":true,"oeverstTilVenstre":true,"iMapper":true,"dekkerKort":false,"dekkerOverListen":false,"kolonner":2,"rader":2,"skillelinjer":false,"merkelapp":false,"minHoeyde":7,"enRad":false,"innhold":["lenke,mappekort-antall"],"sidelengs":false} |
| ✓ | runde 3, bolk 7, 760 px med 200 % tekst: hvert mappekort har fanen, minst 7 rem høyt, og ingen fane dekker kortet over, overskriften eller meldingen; ingen sidelengs rulling | {"kort":3,"pynt":true,"form":true,"kantOgFlate":true,"oeverstTilVenstre":true,"iMapper":true,"dekkerKort":false,"dekkerOverListen":false,"kolonner":1,"rader":3,"skillelinjer":false,"merkelapp":false,"minHoeyde":7,"enRad":false,"innhold":["lenke,mappekort-antall"],"sidelengs":false} |
| ✓ | runde 3, bolk 7, 375 px: hvert mappekort har fanen, i én kolonne uten skillelinjer, og ingen fane dekker kortet over, overskriften eller meldingen; ingen sidelengs rulling | {"kort":3,"pynt":true,"form":true,"kantOgFlate":true,"oeverstTilVenstre":true,"iMapper":true,"dekkerKort":false,"dekkerOverListen":false,"kolonner":1,"rader":3,"skillelinjer":false,"merkelapp":false,"minHoeyde":0,"enRad":true,"innhold":["lenke,mappekort-antall"],"sidelengs":false} |
| ✓ | runde 3, bolk 7, 375 px: mappen er en lav stripe som på arbeidsbordet, uten minstehøyde, med navnet til venstre og antallet til høyre på samme linje | {"minHoeyde":0,"enRad":true} |
| ✓ | runde 3, bolk 7, 375 px med 200 % tekst: hvert mappekort har fanen, i én kolonne uten skillelinjer, og ingen fane dekker kortet over, overskriften eller meldingen; ingen sidelengs rulling | {"kort":3,"pynt":true,"form":true,"kantOgFlate":true,"oeverstTilVenstre":true,"iMapper":true,"dekkerKort":false,"dekkerOverListen":false,"kolonner":1,"rader":3,"skillelinjer":false,"merkelapp":false,"minHoeyde":0,"enRad":false,"innhold":["lenke,mappekort-antall"],"sidelengs":false} |
| ✓ | runde 3, bolk 7, 320 px med 200 % tekst: hvert mappekort har fanen, i én kolonne uten skillelinjer, og ingen fane dekker kortet over, overskriften eller meldingen; ingen sidelengs rulling | {"kort":3,"pynt":true,"form":true,"kantOgFlate":true,"oeverstTilVenstre":true,"iMapper":true,"dekkerKort":false,"dekkerOverListen":false,"kolonner":1,"rader":3,"skillelinjer":false,"merkelapp":false,"minHoeyde":0,"enRad":false,"innhold":["lenke,mappekort-antall"],"sidelengs":false} |
| ✓ | runde 3, bolk 7, 320 px med 200 % tekst, navn på 80 tegn: navnet brytes over flere linjer inne i kortet, fanen står fast og dekker ingenting, og siden ruller ikke sidelengs | {"brytes":{"flereLinjer":true,"inni":true},"sidelengs":false,"dekkerKort":false,"oeverstTilVenstre":true} |
| ✓ | runde 3, bolk 7, kontrastmodus: fanen og kortet har heltrukken kant i CanvasText, og slippmålet en ramme i Highlight rundt både kort og fane | {"tekst":"rgb(0, 0, 0)","lys":"rgb(55, 0, 110)","hvile":[{"kort":{"stil":"solid","bredde":2,"farge":"rgb(0, 0, 0)"},"fane":{"stil":"solid","bredde":2,"farge":"rgb(0, 0, 0)"}},{"kort":{"stil":"solid","bredde":2,"farge":"rgb(0, 0, 0)"},"fane":{"stil":"solid","bredde":2,"farge":"rgb(0, 0, 0)"}},{"kort":{"stil":"solid","bredde":2,"farge":"rgb(0, 0, 0)"},"fane":{"stil":"solid","bredde":2,"farge":"rgb(0, 0, 0)"}}],"slipp":{"kort":"solid 3 true","fane":"solid 3 true","kant":true}} |
| ✓ | bolk 5 (23.11): «EM-bølger» ligger i tre mapper og er ikke egen bunke; bordet har tre mappebunker | mappe:Eksamen, mappe:Prøve, mappe:Naturfag |
| ✓ | bolk 5: mappebunken har fane, «Mappe» og «1 tekst» i stedet for «lagt inn …», og knappen heter «Vis tekstene i mappen …» | {"mappe":true,"hoved":true,"tittel":"Eksamen","merke":"Mappe","tekster":"1 tekst","dato":false,"fane":true,"navn":"Vis tekstene i mappen Eksamen"} |
| ✓ | bolk 5: hovedbunken («Sist brukt») er en mappe, og neste steg gjelder teksten, med tittelen i lenken | Eksamen: «EM-bølger: Neste: Ta quizen →» → /tekst/aaabc9a3-d7db-45d1-a32c-75f872009fc7/quiz |
| ✓ | bolk 5: hilsenen nevner teksten, ikke mappen |  |
| ✓ | axe: arbeidsbord med mappebunker |  |
| ✓ | bolk 5: Enter på mappebunken åpner viften med tekstkortene, «Øvekort for hele mappen» og «Quiz for hele mappen», og fokus på det første kortet | {"navn":"Naturfag","merke":"Mappe","kort":["EM-bølger\|1 av 5 påbegynt","Øvekort for hele mappen\|Fagordene fra alle tekstene","Quiz for hele mappen\|Spørsmål fra alle tekstene"],"lenker":["/mappe/d01a934c-6181-493e-937d-9748c7c7f46f/oevekort","/mappe/d01a934c-6181-493e-937d-9748c7c7f46f/quiz"],"fokus":true,"tilbake":0,"oppsett":"rundt"} |
| ✓ | bolk 5, 1280 px: mappens kort dekker ikke hverandre, bunken eller «Legg sammen» | rundt:  |
| ✓ | bolk 5: Tab og Shift+Tab holder fokus i mappens vifte | 0 av 9 trykk gikk ut |
| ✓ | axe: arbeidsbord med åpen mappe |  |
| ✓ | bolk 5: Enter på tekstkortet viser tekstens fem aktivitetskort og «Tilbake til mappen» (med mappens navn for skjermlesere) i samme dialog, med fokus på det første aktivitetskortet | {"navn":"EM-bølger","kort":["Teksten","Quiz","Øvekort","Fagsamtale","Minnevers"],"tilbake":"Tilbake til mappen «Naturfag»","fokus":true,"oppsett":"rundt"} |
| ✓ | bolk 5, 1280 px: kortene ligger rundt bunken og dekker ikke hverandre, bunken, «Tilbake til mappen» eller «Legg sammen» | rundt:  |
| ✓ | bolk 5: Tab holder fokus i dialogen også når en tekst er valgt | 0 av 9 trykk gikk ut |
| ✓ | axe: arbeidsbord, tekst valgt i mappe |  |
| ✓ | bolk 5: «Tilbake til mappen» (nådd med Shift+Tab) viser mappens kort igjen, med fokus på tekstkortet eleven kom fra | {"paaTilbake":true,"navn":"Naturfag","kort":3,"fokus":true} |
| ✓ | bolk 5: Esc lukker mappens vifte og gir fokus tilbake til mappebunken |  |
| ✓ | bolk 5: Esc og «Legg sammen» lukker også med en tekst valgt, og fokus går til mappebunken |  |
| ✓ | bolk 5: viften åpner alltid på mappens kort |  |
| ✓ | bolk 6 (24.11): i mappeviften har tekstkortet lilla flate og stripe, og de samlede kortene rosa flate og dobbel kant | {"lilla":"rgb(237, 229, 252)","rosa":"rgb(255, 224, 238)","mappekortene":[{"slag":"tekst","flate":"rgb(237, 229, 252)","start":"solid 6","kant":"solid"},{"slag":"samlet","flate":"rgb(255, 224, 238)","start":"double 4","kant":"double"},{"slag":"samlet","flate":"rgb(255, 224, 238)","start":"double 4","kant":"double"}]} |
| ✓ | bolk 6: mens viften er åpen, er ordmerket og menyen dempet (opasitet, vanlig peker) og inert | {"inert":true,"opasitet":0.35,"peker":"default","farge":"rgb(20, 26, 58)","graa":"rgb(109, 109, 109)"} |
| ✓ | bolk 6, kontrastmodus: topplinjen er inert og dempet med GrayText i menyen, uten nedsatt opasitet | {"inert":true,"opasitet":1,"peker":"default","farge":"rgb(96, 0, 0)","graa":"rgb(96, 0, 0)"} |
| ✓ | bolk 6 (punkt 15): åpnet med musen har det første kortet i viften fokus med synlig fokusring | {"kort":"EM-bølger","tekstkort":true,"bunke":null,"ring":"solid 3"} |
| ✓ | bolk 6 (punkt 15): museklikk på tekstkortet gir fokus på det første aktivitetskortet, med synlig fokusring | {"kort":"Teksten","tekstkort":false,"bunke":null,"ring":"solid 3"} |
| ✓ | bolk 6: tekstens fem aktivitetskort har uendret flate | ["rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)","rgb(255, 255, 255)"] |
| ✓ | bolk 6 (punkt 15): museklikk på «Tilbake til mappen» gir fokus på tekstkortet, med synlig fokusring | {"kort":"EM-bølger","tekstkort":true,"bunke":null,"ring":"solid 3"} |
| ✓ | bolk 6 (punkt 15): lukket med «Legg sammen» og musen går fokus til mappebunken, med synlig fokusring | {"kort":null,"tekstkort":false,"bunke":"Vis tekstene i mappen Naturfag","ring":"solid 3"} |
| ✓ | bolk 6: når viften er lukket, er topplinjen ikke dempet eller inert | {"inert":false,"opasitet":1,"peker":"pointer","farge":"rgb(20, 26, 58)","graa":"rgb(109, 109, 109)"} |
| ✓ | bolk 5, tvungne farger: mappefanen og «Mappe» har synlig kant | {"fane":true,"merke":true} |
| ✓ | bolk 5, uten JavaScript: mappebunken er en lenke til /mappe/{id} | /mappe/d01a934c-6181-493e-937d-9748c7c7f46f |
| ✓ | axe: registrering (mørk) |  |
| ✓ | axe: arbeidsbord (mørk) |  |
| ✓ | axe: samling (mørk) |  |
| ✓ | axe: ny tekst (mørk) |  |
| ✓ | mørk: overskriftskontroll (3a) omdirigert, sjekkes ikke her | /tekst/aaabc9a3-d7db-45d1-a32c-75f872009fc7/aktivering |
| ✓ | axe: aktivering (mørk) |  |
| ✓ | axe: lesevisning (mørk) |  |
| ✓ | axe: oppgaver (mørk) |  |
| ✓ | axe: øvekort (mørk) |  |
| ✓ | axe: minnevers (mørk) |  |
| ✓ | axe: mappe (mørk) |  |
| ✓ | axe: mappe: øvekort (mørk) |  |
| ✓ | axe: mappe: quiz (mørk) |  |
| ✓ | axe: konto (mørk) |  |
| ✓ | axe: vilkår og personvern (mørk) |  |
| ✓ | axe: arbeidsbord med åpen mappe (mørk) |  |
| ✓ | axe: arbeidsbord med åpen vifte, tekst valgt i mappe (mørk) |  |
| ✓ | bolk 6, mørk modus: meldingsboksen etter et slipp og meldingen om for langt navn vises |  |
| ✓ | axe: samling med dra-tegn, meldingsboks og for langt mappenavn (mørk) |  |
| ✓ | runde 3, bolk 7, mørk modus: mappekortet og fanen har kant i slate-600 på 1280 og 375 px | {"375":{"slate600":"rgb(90, 86, 112)","kort":3,"alle":true},"1280":{"slate600":"rgb(90, 86, 112)","kort":3,"alle":true}} |
| ✓ | axe: lesevisning med åpen forklaring (mørk) |  |
| ✓ | bolk 7 (lys): «Før» er fet og understreket i boksen før opplasting | {"tekst":"Før","vekt":700,"strek":"underline"} |
| ✓ | axe: ny tekst, bildefanen før opplasting (lys) |  |
| ✓ | bolk 7 (lys): med ett bilde står «Før du tar bildene» som før |  |
| ✓ | bolk 7 (lys): med to bilder står «Etter» rett over listen, og «Før» er borte | etter true, før 0, 2 bilder |
| ✓ | bolk 7 (lys): med tre bilder står «Etter at du har valgt bildene» rett over listen, og «Før» er borte | etter 1, før 0 |
| ✓ | bolk 7 (lys): «Etter» er fet og understreket | {"tekst":"Etter","vekt":700,"strek":"underline"} |
| ✓ | bolk 7 (lys): «Etter»-boksen har grensen og «lagres ikke», og byttet leses opp (statusregion) | Etter at du har valgt bildene: Sjekk at sidene står i riktig rekkefølge. Bruk pilene for å flytte dem.Høyst 4 bilder. Bildene lagres ikke, bare teksten. / status 1 |
| ✓ | axe: ny tekst, bildefanen med tre bilder (lys) |  |
| ✓ | bolk 7 (lys): fjernes bildene ned til ett, står «Før du tar bildene» igjen | før true, 1 bilder |
| ✓ | bolk 7 (mørk): «Før» er fet og understreket i boksen før opplasting | {"tekst":"Før","vekt":700,"strek":"underline"} |
| ✓ | axe: ny tekst, bildefanen før opplasting (mørk) |  |
| ✓ | bolk 7 (mørk): med ett bilde står «Før du tar bildene» som før |  |
| ✓ | bolk 7 (mørk): med to bilder står «Etter» rett over listen, og «Før» er borte | etter true, før 0, 2 bilder |
| ✓ | bolk 7 (mørk): med tre bilder står «Etter at du har valgt bildene» rett over listen, og «Før» er borte | etter 1, før 0 |
| ✓ | bolk 7 (mørk): «Etter» er fet og understreket | {"tekst":"Etter","vekt":700,"strek":"underline"} |
| ✓ | bolk 7 (mørk): «Etter»-boksen har grensen og «lagres ikke», og byttet leses opp (statusregion) | Etter at du har valgt bildene: Sjekk at sidene står i riktig rekkefølge. Bruk pilene for å flytte dem.Høyst 4 bilder. Bildene lagres ikke, bare teksten. / status 1 |
| ✓ | axe: ny tekst, bildefanen med tre bilder (mørk) |  |
| ✓ | bolk 7 (mørk): fjernes bildene ned til ett, står «Før du tar bildene» igjen | før true, 1 bilder |
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
| ✓ | temavalg (uten JavaScript): etter «Lagre» er «Mørk» valgt og statusen sier «Lagret: Mørk.» | valgt moerk, adresse /konto?lagret=utseende&n=1795567533006 |
| ✓ | temavalg (uten JavaScript): ny innlasting av /konto viser «Mørk» valgt, uten gammel melding | valgt moerk, 0 meldinger |
| ✓ | temavalg (uten JavaScript): «Mørk» + «Lagre» gir tema=moerk (SameSite=Lax, ett år) og mørk side | moerk, Lax, 365 dager, rgb(15, 18, 38) |
| ✓ | temavalg (uten JavaScript): andre sider er også mørke |  |
| ✓ | temavalg (uten JavaScript): «Følg enheten» sletter informasjonskapselen og følger systemet igjen | {"tema":null,"skjema":"light dark","bakgrunn":"rgb(255, 245, 247)","darkKlasse":"rgb(90, 86, 112)"} |
| ✓ | bolk 9 (høyrehendt, lys): HTML-en fra serveren har ikke data-hand="venstre" | <html lang="nb"> |
| ✓ | bolk 9, 375 px (høyrehendt, lys): «Må øve mer» over «Har kontroll» over kortet til høyre, like brede, og pilknappene ved siden av hverandre under | {"hand":null,"kort":{"v":16,"h":359,"t":308,"b":444,"w":343,"hoeyde":136},"maa":{"v":226,"h":359,"t":188,"b":236,"w":133,"hoeyde":48},"kan":{"v":226,"h":359,"t":248,"b":296,"w":133,"hoeyde":48},"forrige":{"v":16,"h":182,"t":456,"b":504,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":456,"b":504,"w":166,"hoeyde":48},"telling":{"v":16,"h":214,"t":188,"b":252,"w":198,"hoeyde":64},"tellingFoerKortet":true,"pressed":["false","false"]} |
| ✓ | bolk 8, 375 px (høyrehendt, lys): «Kort N av M» og tellingen står til venstre for merkeknappene, i flukt med «Må øve mer», og før kortet i DOM-en | {"telling":{"v":16,"h":214,"t":188,"b":252,"w":198,"hoeyde":64},"maa":{"v":226,"h":359,"t":188,"b":236,"w":133,"hoeyde":48},"kort":{"v":16,"h":359,"t":308,"b":444,"w":343,"hoeyde":136},"foer":true} |
| ✓ | bolk 8, 375 px (høyrehendt, lys): feilmeldingen fra merkingen står mellom «Har kontroll» og kortet | {"feilTopp":308,"feilBunn":332,"knappBunn":296,"kortTopp":344,"iBredden":true,"ok":true} |
| ✓ | bolk 3, 375 px (høyrehendt, lys): trykk mellom merkeknappene snur ikke kortet | false → false |
| ✓ | bolk 9 (høyrehendt, lys): Tab etter kortet går «Må øve mer» → «Har kontroll» → «Forrige kort» → «Neste kort» | Må øve mer \| Har kontroll \| Forrige kort \| Neste kort |
| ✓ | bolk 9 (høyrehendt, lys): snudd kort, Tab går «Må øve mer» → «Har kontroll» → «Se hvor det står i teksten» → «Forrige kort» | Må øve mer \| Har kontroll \| Se hvor det står i teksten \| Forrige kort |
| ✓ | mobil uten sidelengs rulling: øvekort 375 px (høyrehendt, lys) | 375 px innhold i 375 px vindu |
| ✓ | axe: øvekort 375 px (høyrehendt, lys) |  |
| ✓ | bolk 9, 320 px (høyrehendt, lys): samme plassering | {"hand":null,"kort":{"v":16,"h":304,"t":352,"b":488,"w":288,"hoeyde":136},"maa":{"v":171,"h":304,"t":232,"b":280,"w":133,"hoeyde":48},"kan":{"v":171,"h":304,"t":292,"b":340,"w":133,"hoeyde":48},"forrige":{"v":16,"h":154,"t":500,"b":548,"w":138,"hoeyde":48},"neste":{"v":166,"h":304,"t":500,"b":548,"w":138,"hoeyde":48},"telling":{"v":16,"h":159,"t":232,"b":296,"w":143,"hoeyde":64},"tellingFoerKortet":true,"pressed":["false","false"]} |
| ✓ | bolk 8, 320 px (høyrehendt, lys): tellingen står ved siden av merkeknappene og dekker ingen knapp | {"telling":{"v":16,"h":159,"t":232,"b":296,"w":143,"hoeyde":64},"maa":{"v":171,"h":304,"t":232,"b":280,"w":133,"hoeyde":48},"kan":{"v":171,"h":304,"t":292,"b":340,"w":133,"hoeyde":48},"kort":{"v":16,"h":304,"t":352,"b":488,"w":288,"hoeyde":136}} |
| ✓ | bolk 8, 320 px (høyrehendt, lys): feilmeldingen fra merkingen står mellom «Har kontroll» og kortet | {"feilTopp":352,"feilBunn":376,"knappBunn":340,"kortTopp":388,"iBredden":true,"ok":true} |
| ✓ | mobil uten sidelengs rulling: øvekort 320 px (høyrehendt, lys) | 320 px innhold i 320 px vindu |
| ✓ | bolk 9, 320 px, 200 % tekst (høyrehendt, lys): samme plassering | {"hand":null,"kort":{"v":32,"h":288,"t":1079,"b":1351,"w":256,"hoeyde":272},"maa":{"v":32,"h":288,"t":751,"b":891,"w":256,"hoeyde":140},"kan":{"v":32,"h":288,"t":915,"b":1055,"w":256,"hoeyde":140},"forrige":{"v":32,"h":148,"t":1375,"b":1467,"w":116,"hoeyde":92},"neste":{"v":172,"h":288,"t":1375,"b":1467,"w":116,"hoeyde":92},"telling":{"v":32,"h":288,"t":567,"b":735,"w":256,"hoeyde":168},"tellingFoerKortet":true,"pressed":["false","false"]} |
| ✓ | bolk 8, 320 px, 200 % tekst (høyrehendt, lys): tellingen står ved siden av eller over merkeknappene og dekker ingen knapp | {"telling":{"v":32,"h":288,"t":567,"b":735,"w":256,"hoeyde":168},"maa":{"v":32,"h":288,"t":751,"b":891,"w":256,"hoeyde":140},"kan":{"v":32,"h":288,"t":915,"b":1055,"w":256,"hoeyde":140},"kort":{"v":32,"h":288,"t":1079,"b":1351,"w":256,"hoeyde":272}} |
| ✓ | bolk 8, 320 px, 200 % tekst (høyrehendt, lys): feilmeldingen fra merkingen står mellom «Har kontroll» og kortet | {"feilTopp":1079,"feilBunn":1127,"knappBunn":1055,"kortTopp":1151,"iBredden":true,"ok":true} |
| ✓ | mobil uten sidelengs rulling: øvekort 320 px, 200 % tekst (høyrehendt, lys) | 327 px innhold i 327 px vindu |
| ✓ | bolk 9 (høyrehendt, mørk): HTML-en fra serveren har ikke data-hand="venstre" | <html lang="nb"> |
| ✓ | bolk 9, 375 px (høyrehendt, mørk): «Må øve mer» over «Har kontroll» over kortet til høyre, like brede, og pilknappene ved siden av hverandre under | {"hand":null,"kort":{"v":16,"h":359,"t":308,"b":444,"w":343,"hoeyde":136},"maa":{"v":226,"h":359,"t":188,"b":236,"w":133,"hoeyde":48},"kan":{"v":226,"h":359,"t":248,"b":296,"w":133,"hoeyde":48},"forrige":{"v":16,"h":182,"t":456,"b":504,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":456,"b":504,"w":166,"hoeyde":48},"telling":{"v":16,"h":214,"t":188,"b":252,"w":198,"hoeyde":64},"tellingFoerKortet":true,"pressed":["false","false"]} |
| ✓ | bolk 8, 375 px (høyrehendt, mørk): «Kort N av M» og tellingen står til venstre for merkeknappene, i flukt med «Må øve mer», og før kortet i DOM-en | {"telling":{"v":16,"h":214,"t":188,"b":252,"w":198,"hoeyde":64},"maa":{"v":226,"h":359,"t":188,"b":236,"w":133,"hoeyde":48},"kort":{"v":16,"h":359,"t":308,"b":444,"w":343,"hoeyde":136},"foer":true} |
| ✓ | bolk 8, 375 px (høyrehendt, mørk): feilmeldingen fra merkingen står mellom «Har kontroll» og kortet | {"feilTopp":308,"feilBunn":332,"knappBunn":296,"kortTopp":344,"iBredden":true,"ok":true} |
| ✓ | bolk 3, 375 px (høyrehendt, mørk): trykk mellom merkeknappene snur ikke kortet | false → false |
| ✓ | bolk 9 (høyrehendt, mørk): Tab etter kortet går «Må øve mer» → «Har kontroll» → «Forrige kort» → «Neste kort» | Må øve mer \| Har kontroll \| Forrige kort \| Neste kort |
| ✓ | bolk 9 (høyrehendt, mørk): snudd kort, Tab går «Må øve mer» → «Har kontroll» → «Se hvor det står i teksten» → «Forrige kort» | Må øve mer \| Har kontroll \| Se hvor det står i teksten \| Forrige kort |
| ✓ | mobil uten sidelengs rulling: øvekort 375 px (høyrehendt, mørk) | 375 px innhold i 375 px vindu |
| ✓ | axe: øvekort 375 px (høyrehendt, mørk) |  |
| ✓ | bolk 9, 320 px (høyrehendt, mørk): samme plassering | {"hand":null,"kort":{"v":16,"h":304,"t":352,"b":488,"w":288,"hoeyde":136},"maa":{"v":171,"h":304,"t":232,"b":280,"w":133,"hoeyde":48},"kan":{"v":171,"h":304,"t":292,"b":340,"w":133,"hoeyde":48},"forrige":{"v":16,"h":154,"t":500,"b":548,"w":138,"hoeyde":48},"neste":{"v":166,"h":304,"t":500,"b":548,"w":138,"hoeyde":48},"telling":{"v":16,"h":159,"t":232,"b":296,"w":143,"hoeyde":64},"tellingFoerKortet":true,"pressed":["false","false"]} |
| ✓ | bolk 8, 320 px (høyrehendt, mørk): tellingen står ved siden av merkeknappene og dekker ingen knapp | {"telling":{"v":16,"h":159,"t":232,"b":296,"w":143,"hoeyde":64},"maa":{"v":171,"h":304,"t":232,"b":280,"w":133,"hoeyde":48},"kan":{"v":171,"h":304,"t":292,"b":340,"w":133,"hoeyde":48},"kort":{"v":16,"h":304,"t":352,"b":488,"w":288,"hoeyde":136}} |
| ✓ | bolk 8, 320 px (høyrehendt, mørk): feilmeldingen fra merkingen står mellom «Har kontroll» og kortet | {"feilTopp":352,"feilBunn":376,"knappBunn":340,"kortTopp":388,"iBredden":true,"ok":true} |
| ✓ | mobil uten sidelengs rulling: øvekort 320 px (høyrehendt, mørk) | 320 px innhold i 320 px vindu |
| ✓ | bolk 9, 320 px, 200 % tekst (høyrehendt, mørk): samme plassering | {"hand":null,"kort":{"v":32,"h":288,"t":1079,"b":1351,"w":256,"hoeyde":272},"maa":{"v":32,"h":288,"t":751,"b":891,"w":256,"hoeyde":140},"kan":{"v":32,"h":288,"t":915,"b":1055,"w":256,"hoeyde":140},"forrige":{"v":32,"h":148,"t":1375,"b":1467,"w":116,"hoeyde":92},"neste":{"v":172,"h":288,"t":1375,"b":1467,"w":116,"hoeyde":92},"telling":{"v":32,"h":288,"t":567,"b":735,"w":256,"hoeyde":168},"tellingFoerKortet":true,"pressed":["false","false"]} |
| ✓ | bolk 8, 320 px, 200 % tekst (høyrehendt, mørk): tellingen står ved siden av eller over merkeknappene og dekker ingen knapp | {"telling":{"v":32,"h":288,"t":567,"b":735,"w":256,"hoeyde":168},"maa":{"v":32,"h":288,"t":751,"b":891,"w":256,"hoeyde":140},"kan":{"v":32,"h":288,"t":915,"b":1055,"w":256,"hoeyde":140},"kort":{"v":32,"h":288,"t":1079,"b":1351,"w":256,"hoeyde":272}} |
| ✓ | bolk 8, 320 px, 200 % tekst (høyrehendt, mørk): feilmeldingen fra merkingen står mellom «Har kontroll» og kortet | {"feilTopp":1079,"feilBunn":1127,"knappBunn":1055,"kortTopp":1151,"iBredden":true,"ok":true} |
| ✓ | mobil uten sidelengs rulling: øvekort 320 px, 200 % tekst (høyrehendt, mørk) | 327 px innhold i 327 px vindu |
| ✓ | bolk 9 (venstrehendt, lys): HTML-en fra serveren har data-hand="venstre" | <html lang="nb" data-hand="venstre"> |
| ✓ | bolk 9, 375 px (venstrehendt, lys): «Må øve mer» over «Har kontroll» over kortet til venstre, like brede, og pilknappene ved siden av hverandre under | {"hand":"venstre","kort":{"v":16,"h":359,"t":308,"b":444,"w":343,"hoeyde":136},"maa":{"v":16,"h":149,"t":188,"b":236,"w":133,"hoeyde":48},"kan":{"v":16,"h":149,"t":248,"b":296,"w":133,"hoeyde":48},"forrige":{"v":16,"h":182,"t":456,"b":504,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":456,"b":504,"w":166,"hoeyde":48},"telling":{"v":161,"h":359,"t":188,"b":252,"w":198,"hoeyde":64},"tellingFoerKortet":true,"pressed":["false","false"]} |
| ✓ | bolk 8, 375 px (venstrehendt, lys): «Kort N av M» og tellingen står til høyre for merkeknappene, i flukt med «Må øve mer», og før kortet i DOM-en | {"telling":{"v":161,"h":359,"t":188,"b":252,"w":198,"hoeyde":64},"maa":{"v":16,"h":149,"t":188,"b":236,"w":133,"hoeyde":48},"kort":{"v":16,"h":359,"t":308,"b":444,"w":343,"hoeyde":136},"foer":true} |
| ✓ | bolk 8, 375 px (venstrehendt, lys): feilmeldingen fra merkingen står mellom «Har kontroll» og kortet | {"feilTopp":308,"feilBunn":332,"knappBunn":296,"kortTopp":344,"iBredden":true,"ok":true} |
| ✓ | bolk 3, 375 px (venstrehendt, lys): trykk mellom merkeknappene snur ikke kortet | false → false |
| ✓ | bolk 9 (venstrehendt, lys): Tab etter kortet går «Må øve mer» → «Har kontroll» → «Forrige kort» → «Neste kort» | Må øve mer \| Har kontroll \| Forrige kort \| Neste kort |
| ✓ | bolk 9 (venstrehendt, lys): snudd kort, Tab går «Må øve mer» → «Har kontroll» → «Se hvor det står i teksten» → «Forrige kort» | Må øve mer \| Har kontroll \| Se hvor det står i teksten \| Forrige kort |
| ✓ | mobil uten sidelengs rulling: øvekort 375 px (venstrehendt, lys) | 375 px innhold i 375 px vindu |
| ✓ | axe: øvekort 375 px (venstrehendt, lys) |  |
| ✓ | bolk 9, 320 px (venstrehendt, lys): samme plassering | {"hand":"venstre","kort":{"v":16,"h":304,"t":352,"b":488,"w":288,"hoeyde":136},"maa":{"v":16,"h":149,"t":232,"b":280,"w":133,"hoeyde":48},"kan":{"v":16,"h":149,"t":292,"b":340,"w":133,"hoeyde":48},"forrige":{"v":16,"h":154,"t":500,"b":548,"w":138,"hoeyde":48},"neste":{"v":166,"h":304,"t":500,"b":548,"w":138,"hoeyde":48},"telling":{"v":161,"h":304,"t":232,"b":296,"w":143,"hoeyde":64},"tellingFoerKortet":true,"pressed":["false","false"]} |
| ✓ | bolk 8, 320 px (venstrehendt, lys): tellingen står ved siden av merkeknappene og dekker ingen knapp | {"telling":{"v":161,"h":304,"t":232,"b":296,"w":143,"hoeyde":64},"maa":{"v":16,"h":149,"t":232,"b":280,"w":133,"hoeyde":48},"kan":{"v":16,"h":149,"t":292,"b":340,"w":133,"hoeyde":48},"kort":{"v":16,"h":304,"t":352,"b":488,"w":288,"hoeyde":136}} |
| ✓ | bolk 8, 320 px (venstrehendt, lys): feilmeldingen fra merkingen står mellom «Har kontroll» og kortet | {"feilTopp":352,"feilBunn":376,"knappBunn":340,"kortTopp":388,"iBredden":true,"ok":true} |
| ✓ | mobil uten sidelengs rulling: øvekort 320 px (venstrehendt, lys) | 320 px innhold i 320 px vindu |
| ✓ | bolk 9, 320 px, 200 % tekst (venstrehendt, lys): samme plassering | {"hand":"venstre","kort":{"v":32,"h":288,"t":1079,"b":1351,"w":256,"hoeyde":272},"maa":{"v":32,"h":288,"t":751,"b":891,"w":256,"hoeyde":140},"kan":{"v":32,"h":288,"t":915,"b":1055,"w":256,"hoeyde":140},"forrige":{"v":32,"h":148,"t":1375,"b":1467,"w":116,"hoeyde":92},"neste":{"v":172,"h":288,"t":1375,"b":1467,"w":116,"hoeyde":92},"telling":{"v":32,"h":288,"t":567,"b":735,"w":256,"hoeyde":168},"tellingFoerKortet":true,"pressed":["false","false"]} |
| ✓ | bolk 8, 320 px, 200 % tekst (venstrehendt, lys): tellingen står ved siden av eller over merkeknappene og dekker ingen knapp | {"telling":{"v":32,"h":288,"t":567,"b":735,"w":256,"hoeyde":168},"maa":{"v":32,"h":288,"t":751,"b":891,"w":256,"hoeyde":140},"kan":{"v":32,"h":288,"t":915,"b":1055,"w":256,"hoeyde":140},"kort":{"v":32,"h":288,"t":1079,"b":1351,"w":256,"hoeyde":272}} |
| ✓ | bolk 8, 320 px, 200 % tekst (venstrehendt, lys): feilmeldingen fra merkingen står mellom «Har kontroll» og kortet | {"feilTopp":1079,"feilBunn":1127,"knappBunn":1055,"kortTopp":1151,"iBredden":true,"ok":true} |
| ✓ | mobil uten sidelengs rulling: øvekort 320 px, 200 % tekst (venstrehendt, lys) | 327 px innhold i 327 px vindu |
| ✓ | bolk 9 (venstrehendt, mørk): HTML-en fra serveren har data-hand="venstre" | <html lang="nb" data-hand="venstre"> |
| ✓ | bolk 9, 375 px (venstrehendt, mørk): «Må øve mer» over «Har kontroll» over kortet til venstre, like brede, og pilknappene ved siden av hverandre under | {"hand":"venstre","kort":{"v":16,"h":359,"t":308,"b":444,"w":343,"hoeyde":136},"maa":{"v":16,"h":149,"t":188,"b":236,"w":133,"hoeyde":48},"kan":{"v":16,"h":149,"t":248,"b":296,"w":133,"hoeyde":48},"forrige":{"v":16,"h":182,"t":456,"b":504,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":456,"b":504,"w":166,"hoeyde":48},"telling":{"v":161,"h":359,"t":188,"b":252,"w":198,"hoeyde":64},"tellingFoerKortet":true,"pressed":["false","false"]} |
| ✓ | bolk 8, 375 px (venstrehendt, mørk): «Kort N av M» og tellingen står til høyre for merkeknappene, i flukt med «Må øve mer», og før kortet i DOM-en | {"telling":{"v":161,"h":359,"t":188,"b":252,"w":198,"hoeyde":64},"maa":{"v":16,"h":149,"t":188,"b":236,"w":133,"hoeyde":48},"kort":{"v":16,"h":359,"t":308,"b":444,"w":343,"hoeyde":136},"foer":true} |
| ✓ | bolk 8, 375 px (venstrehendt, mørk): feilmeldingen fra merkingen står mellom «Har kontroll» og kortet | {"feilTopp":308,"feilBunn":332,"knappBunn":296,"kortTopp":344,"iBredden":true,"ok":true} |
| ✓ | bolk 3, 375 px (venstrehendt, mørk): trykk mellom merkeknappene snur ikke kortet | false → false |
| ✓ | bolk 9 (venstrehendt, mørk): Tab etter kortet går «Må øve mer» → «Har kontroll» → «Forrige kort» → «Neste kort» | Må øve mer \| Har kontroll \| Forrige kort \| Neste kort |
| ✓ | bolk 9 (venstrehendt, mørk): snudd kort, Tab går «Må øve mer» → «Har kontroll» → «Se hvor det står i teksten» → «Forrige kort» | Må øve mer \| Har kontroll \| Se hvor det står i teksten \| Forrige kort |
| ✓ | mobil uten sidelengs rulling: øvekort 375 px (venstrehendt, mørk) | 375 px innhold i 375 px vindu |
| ✓ | axe: øvekort 375 px (venstrehendt, mørk) |  |
| ✓ | bolk 9, 320 px (venstrehendt, mørk): samme plassering | {"hand":"venstre","kort":{"v":16,"h":304,"t":352,"b":488,"w":288,"hoeyde":136},"maa":{"v":16,"h":149,"t":232,"b":280,"w":133,"hoeyde":48},"kan":{"v":16,"h":149,"t":292,"b":340,"w":133,"hoeyde":48},"forrige":{"v":16,"h":154,"t":500,"b":548,"w":138,"hoeyde":48},"neste":{"v":166,"h":304,"t":500,"b":548,"w":138,"hoeyde":48},"telling":{"v":161,"h":304,"t":232,"b":296,"w":143,"hoeyde":64},"tellingFoerKortet":true,"pressed":["false","false"]} |
| ✓ | bolk 8, 320 px (venstrehendt, mørk): tellingen står ved siden av merkeknappene og dekker ingen knapp | {"telling":{"v":161,"h":304,"t":232,"b":296,"w":143,"hoeyde":64},"maa":{"v":16,"h":149,"t":232,"b":280,"w":133,"hoeyde":48},"kan":{"v":16,"h":149,"t":292,"b":340,"w":133,"hoeyde":48},"kort":{"v":16,"h":304,"t":352,"b":488,"w":288,"hoeyde":136}} |
| ✓ | bolk 8, 320 px (venstrehendt, mørk): feilmeldingen fra merkingen står mellom «Har kontroll» og kortet | {"feilTopp":352,"feilBunn":376,"knappBunn":340,"kortTopp":388,"iBredden":true,"ok":true} |
| ✓ | mobil uten sidelengs rulling: øvekort 320 px (venstrehendt, mørk) | 320 px innhold i 320 px vindu |
| ✓ | bolk 9, 320 px, 200 % tekst (venstrehendt, mørk): samme plassering | {"hand":"venstre","kort":{"v":32,"h":288,"t":1079,"b":1351,"w":256,"hoeyde":272},"maa":{"v":32,"h":288,"t":751,"b":891,"w":256,"hoeyde":140},"kan":{"v":32,"h":288,"t":915,"b":1055,"w":256,"hoeyde":140},"forrige":{"v":32,"h":148,"t":1375,"b":1467,"w":116,"hoeyde":92},"neste":{"v":172,"h":288,"t":1375,"b":1467,"w":116,"hoeyde":92},"telling":{"v":32,"h":288,"t":567,"b":735,"w":256,"hoeyde":168},"tellingFoerKortet":true,"pressed":["false","false"]} |
| ✓ | bolk 8, 320 px, 200 % tekst (venstrehendt, mørk): tellingen står ved siden av eller over merkeknappene og dekker ingen knapp | {"telling":{"v":32,"h":288,"t":567,"b":735,"w":256,"hoeyde":168},"maa":{"v":32,"h":288,"t":751,"b":891,"w":256,"hoeyde":140},"kan":{"v":32,"h":288,"t":915,"b":1055,"w":256,"hoeyde":140},"kort":{"v":32,"h":288,"t":1079,"b":1351,"w":256,"hoeyde":272}} |
| ✓ | bolk 8, 320 px, 200 % tekst (venstrehendt, mørk): feilmeldingen fra merkingen står mellom «Har kontroll» og kortet | {"feilTopp":1079,"feilBunn":1127,"knappBunn":1055,"kortTopp":1151,"iBredden":true,"ok":true} |
| ✓ | mobil uten sidelengs rulling: øvekort 320 px, 200 % tekst (venstrehendt, mørk) | 327 px innhold i 327 px vindu |
| ✓ | bolk 8, 390 × 664, teksten: bunnen av «Forrige kort» og «Neste kort» er innenfor synsfeltet uten rulling, på første kort | {"rullet":0,"hoeyde":664,"lenke":44,"kortnr":"Kort 1 av 8","forrige":{"v":16,"h":189,"t":456,"b":504,"w":173,"hoeyde":48},"neste":{"v":201,"h":374,"t":456,"b":504,"w":173,"hoeyde":48},"kort":{"v":16,"h":374,"t":308,"b":444,"w":358,"hoeyde":136}} |
| ✓ | bolk 8, 390 × 664, teksten: oppsettet er som før (knappene over kortet, pilene under), tellingen ved merkeknappene, og tilbakelenken minst 44 px høy | {"telling":{"v":16,"h":229,"t":188,"b":252,"w":213,"hoeyde":64},"maa":{"v":241,"h":374,"t":188,"b":236,"w":133,"hoeyde":48},"kort":{"v":16,"h":374,"t":308,"b":444,"w":358,"hoeyde":136},"lenke":44} |
| ✓ | bolk 8, 390 × 664, teksten: med en tittel over to linjer («Elektromagnetiske bølger og stråling fra sola») synes pilene fortsatt uten rulling | {"linjer":2,"ok":true,"forrige":{"v":16,"h":189,"t":487,"b":535,"w":173,"hoeyde":48},"neste":{"v":201,"h":374,"t":487,"b":535,"w":173,"hoeyde":48},"kort":{"v":16,"h":374,"t":339,"b":475,"w":358,"hoeyde":136}} |
| ✓ | bolk 8, 390 × 664, teksten: i runden «bare de du vil øve mer på», med tittelen over to linjer, synes pilene uten rulling | {"runde":"Kort 1 av 1 — bare de du vil øve mer på","linjer":2,"ok":true,"forrige":{"v":16,"h":189,"t":487,"b":535,"w":173,"hoeyde":48},"neste":{"v":201,"h":374,"t":487,"b":535,"w":173,"hoeyde":48},"kort":{"v":16,"h":374,"t":339,"b":475,"w":358,"hoeyde":136}} |
| ✓ | bolk 8, 390 × 664, mappen: bunnen av «Forrige kort» og «Neste kort» er innenfor synsfeltet uten rulling, på første kort | {"rullet":0,"hoeyde":664,"lenke":44,"kortnr":"Kort 1 av 8","forrige":{"v":16,"h":189,"t":460,"b":508,"w":173,"hoeyde":48},"neste":{"v":201,"h":374,"t":460,"b":508,"w":173,"hoeyde":48},"kort":{"v":16,"h":374,"t":312,"b":448,"w":358,"hoeyde":136}} |
| ✓ | bolk 8, 390 × 664, mappen: oppsettet er som før (knappene over kortet, pilene under), tellingen ved merkeknappene, og tilbakelenken minst 44 px høy | {"telling":{"v":16,"h":229,"t":192,"b":256,"w":213,"hoeyde":64},"maa":{"v":241,"h":374,"t":192,"b":240,"w":133,"hoeyde":48},"kort":{"v":16,"h":374,"t":312,"b":448,"w":358,"hoeyde":136},"lenke":44} |
| ✓ | bolk 8, 390 × 664, mappen: med en tittel over to linjer («Elektromagnetiske bølger og stråling fra sola») synes pilene fortsatt uten rulling | {"linjer":2,"ok":true,"forrige":{"v":16,"h":189,"t":491,"b":539,"w":173,"hoeyde":48},"neste":{"v":201,"h":374,"t":491,"b":539,"w":173,"hoeyde":48},"kort":{"v":16,"h":374,"t":343,"b":479,"w":358,"hoeyde":136}} |
| ✓ | bolk 8, 390 × 664, mappen: i runden «bare de du vil øve mer på», med tittelen over to linjer, synes pilene uten rulling | {"runde":"Kort 1 av 1 — bare de du vil øve mer på","linjer":2,"ok":true,"forrige":{"v":16,"h":189,"t":491,"b":539,"w":173,"hoeyde":48},"neste":{"v":201,"h":374,"t":491,"b":539,"w":173,"hoeyde":48},"kort":{"v":16,"h":374,"t":343,"b":479,"w":358,"hoeyde":136}} |
| ✓ | bolk 8, 375 × 553, teksten: bunnen av «Forrige kort» og «Neste kort» er innenfor synsfeltet uten rulling, på første kort | {"rullet":0,"hoeyde":553,"lenke":44,"kortnr":"Kort 1 av 8","forrige":{"v":16,"h":182,"t":456,"b":504,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":456,"b":504,"w":166,"hoeyde":48},"kort":{"v":16,"h":359,"t":308,"b":444,"w":343,"hoeyde":136}} |
| ✓ | bolk 8, 375 × 553, teksten: oppsettet er som før (knappene over kortet, pilene under), tellingen ved merkeknappene, og tilbakelenken minst 44 px høy | {"telling":{"v":16,"h":214,"t":188,"b":252,"w":198,"hoeyde":64},"maa":{"v":226,"h":359,"t":188,"b":236,"w":133,"hoeyde":48},"kort":{"v":16,"h":359,"t":308,"b":444,"w":343,"hoeyde":136},"lenke":44} |
| ✓ | bolk 8, 375 × 553, teksten: med en tittel over to linjer («Elektromagnetiske bølger og stråling fra sola») synes pilene fortsatt uten rulling | {"linjer":2,"ok":true,"forrige":{"v":16,"h":182,"t":487,"b":535,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":487,"b":535,"w":166,"hoeyde":48},"kort":{"v":16,"h":359,"t":339,"b":475,"w":343,"hoeyde":136}} |
| ✓ | bolk 8, 375 × 553, teksten: i runden «bare de du vil øve mer på», med tittelen over to linjer, synes pilene uten rulling | {"runde":"Kort 1 av 1 — bare de du vil øve mer på","linjer":2,"ok":true,"forrige":{"v":16,"h":182,"t":487,"b":535,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":487,"b":535,"w":166,"hoeyde":48},"kort":{"v":16,"h":359,"t":339,"b":475,"w":343,"hoeyde":136}} |
| ✓ | bolk 8, 375 × 553, mappen: bunnen av «Forrige kort» og «Neste kort» er innenfor synsfeltet uten rulling, på første kort | {"rullet":0,"hoeyde":553,"lenke":44,"kortnr":"Kort 1 av 8","forrige":{"v":16,"h":182,"t":460,"b":508,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":460,"b":508,"w":166,"hoeyde":48},"kort":{"v":16,"h":359,"t":312,"b":448,"w":343,"hoeyde":136}} |
| ✓ | bolk 8, 375 × 553, mappen: oppsettet er som før (knappene over kortet, pilene under), tellingen ved merkeknappene, og tilbakelenken minst 44 px høy | {"telling":{"v":16,"h":214,"t":192,"b":256,"w":198,"hoeyde":64},"maa":{"v":226,"h":359,"t":192,"b":240,"w":133,"hoeyde":48},"kort":{"v":16,"h":359,"t":312,"b":448,"w":343,"hoeyde":136},"lenke":44} |
| ✓ | bolk 8, 375 × 553, mappen: med en tittel over to linjer («Elektromagnetiske bølger og stråling fra sola») synes pilene fortsatt uten rulling | {"linjer":2,"ok":true,"forrige":{"v":16,"h":182,"t":491,"b":539,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":491,"b":539,"w":166,"hoeyde":48},"kort":{"v":16,"h":359,"t":343,"b":479,"w":343,"hoeyde":136}} |
| ✓ | bolk 8, 375 × 553, mappen: i runden «bare de du vil øve mer på», med tittelen over to linjer, synes pilene uten rulling | {"runde":"Kort 1 av 1 — bare de du vil øve mer på","linjer":2,"ok":true,"forrige":{"v":16,"h":182,"t":491,"b":539,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":491,"b":539,"w":166,"hoeyde":48},"kort":{"v":16,"h":359,"t":343,"b":479,"w":343,"hoeyde":136}} |
| ✓ | bolk 8, 375 × 553, venstrehendt, teksten: bunnen av «Forrige kort» og «Neste kort» er innenfor synsfeltet uten rulling, på første kort | {"rullet":0,"hoeyde":553,"lenke":44,"kortnr":"Kort 1 av 8","forrige":{"v":16,"h":182,"t":456,"b":504,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":456,"b":504,"w":166,"hoeyde":48},"kort":{"v":16,"h":359,"t":308,"b":444,"w":343,"hoeyde":136}} |
| ✓ | bolk 8, 375 × 553, venstrehendt, teksten: oppsettet er som før (knappene over kortet, pilene under), tellingen ved merkeknappene, og tilbakelenken minst 44 px høy | {"telling":{"v":161,"h":359,"t":188,"b":252,"w":198,"hoeyde":64},"maa":{"v":16,"h":149,"t":188,"b":236,"w":133,"hoeyde":48},"kort":{"v":16,"h":359,"t":308,"b":444,"w":343,"hoeyde":136},"lenke":44} |
| ✓ | bolk 8, 375 × 553, venstrehendt, teksten: med en tittel over to linjer («Elektromagnetiske bølger og stråling fra sola») synes pilene fortsatt uten rulling | {"linjer":2,"ok":true,"forrige":{"v":16,"h":182,"t":487,"b":535,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":487,"b":535,"w":166,"hoeyde":48},"kort":{"v":16,"h":359,"t":339,"b":475,"w":343,"hoeyde":136}} |
| ✓ | bolk 8, 375 × 553, venstrehendt, teksten: i runden «bare de du vil øve mer på», med tittelen over to linjer, synes pilene uten rulling | {"runde":"Kort 1 av 1 — bare de du vil øve mer på","linjer":2,"ok":true,"forrige":{"v":16,"h":182,"t":487,"b":535,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":487,"b":535,"w":166,"hoeyde":48},"kort":{"v":16,"h":359,"t":339,"b":475,"w":343,"hoeyde":136}} |
| ✓ | bolk 8, 375 × 553, venstrehendt, mappen: bunnen av «Forrige kort» og «Neste kort» er innenfor synsfeltet uten rulling, på første kort | {"rullet":0,"hoeyde":553,"lenke":44,"kortnr":"Kort 1 av 8","forrige":{"v":16,"h":182,"t":460,"b":508,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":460,"b":508,"w":166,"hoeyde":48},"kort":{"v":16,"h":359,"t":312,"b":448,"w":343,"hoeyde":136}} |
| ✓ | bolk 8, 375 × 553, venstrehendt, mappen: oppsettet er som før (knappene over kortet, pilene under), tellingen ved merkeknappene, og tilbakelenken minst 44 px høy | {"telling":{"v":161,"h":359,"t":192,"b":256,"w":198,"hoeyde":64},"maa":{"v":16,"h":149,"t":192,"b":240,"w":133,"hoeyde":48},"kort":{"v":16,"h":359,"t":312,"b":448,"w":343,"hoeyde":136},"lenke":44} |
| ✓ | bolk 8, 375 × 553, venstrehendt, mappen: med en tittel over to linjer («Elektromagnetiske bølger og stråling fra sola») synes pilene fortsatt uten rulling | {"linjer":2,"ok":true,"forrige":{"v":16,"h":182,"t":491,"b":539,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":491,"b":539,"w":166,"hoeyde":48},"kort":{"v":16,"h":359,"t":343,"b":479,"w":343,"hoeyde":136}} |
| ✓ | bolk 8, 375 × 553, venstrehendt, mappen: i runden «bare de du vil øve mer på», med tittelen over to linjer, synes pilene uten rulling | {"runde":"Kort 1 av 1 — bare de du vil øve mer på","linjer":2,"ok":true,"forrige":{"v":16,"h":182,"t":491,"b":539,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":491,"b":539,"w":166,"hoeyde":48},"kort":{"v":16,"h":359,"t":343,"b":479,"w":343,"hoeyde":136}} |
| ✓ | bolk 9: hand=hoeyre ignoreres, og merkeknappene står til høyre | {"hand":null,"kort":{"v":16,"h":359,"t":308,"b":444,"w":343,"hoeyde":136},"maa":{"v":226,"h":359,"t":188,"b":236,"w":133,"hoeyde":48},"kan":{"v":226,"h":359,"t":248,"b":296,"w":133,"hoeyde":48},"forrige":{"v":16,"h":182,"t":456,"b":504,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":456,"b":504,"w":166,"hoeyde":48},"telling":{"v":16,"h":214,"t":188,"b":252,"w":198,"hoeyde":64},"tellingFoerKortet":true,"pressed":["false","false"]} |
| ✓ | bolk 2b: pilknappene heter «Forrige kort» og «Neste kort» (eller «Ferdig» på siste) og er minst 44 × 44 px | {"bf":{"x":16,"y":455.796875,"width":165.5,"height":48},"bn":{"x":193.5,"y":455.796875,"width":165.5,"height":48}} |
| ✓ | bolk 2b, 375 px: «Tilbake til mappen» står én gang øverst i headeren, over overskriften, minst 44 px høy, og lenker til mappen | {"bt":{"x":16,"y":73,"width":163.671875,"height":44},"href":"/mappe/d01a934c-6181-493e-937d-9748c7c7f46f"} |
| ✓ | bolk 2b, 375 px: «Tilbake til oppgavene» står én gang øverst i headeren, over overskriften, minst 44 px høy, og lenker til oppgavene | {"bt":{"x":16,"y":73,"width":185.40625,"height":44},"href":"/tekst/aaabc9a3-d7db-45d1-a32c-75f872009fc7/oppgaver"} |
| ✓ | bolk 2b, 759 px: «Tilbake til mappen» står én gang øverst i headeren, over overskriften, minst 44 px høy, og lenker til mappen | {"bt":{"x":59.5,"y":73,"width":163.671875,"height":44},"href":"/mappe/d01a934c-6181-493e-937d-9748c7c7f46f"} |
| ✓ | bolk 2b, 759 px: «Tilbake til oppgavene» står én gang øverst i headeren, over overskriften, minst 44 px høy, og lenker til oppgavene | {"bt":{"x":59.5,"y":73,"width":185.40625,"height":44},"href":"/tekst/aaabc9a3-d7db-45d1-a32c-75f872009fc7/oppgaver"} |
| ✓ | bolk 2b: ← (ikke på første), → (forsiden opp), mellomrom (én gang, også på kortet), ikke i skjemafelt, ikke med Ctrl, og → på siste avslutter runden | {"start":1,"antall":8,"venstrePaaFoerste":1,"mellomromSnur":true,"mellomromSnurTilbake":true,"hoeyre":2,"forsidenOpp":true,"venstre":1,"ctrl":1,"paaKortet":true,"paaSummary":true,"iFeltet":true,"ferdig":true} |
| ✓ | bolk 3, 1280 px, høyrehendt, lys, teksten: knappene nederst i rammen («Må øve mer» til venstre), kortet om lag 960 px, og «Tilbake til oppgavene» én gang, nederst til venstre utenfor kortkanten, ikke øverst | {"hand":null,"ramme":{"v":160,"h":1120,"t":233,"b":533,"w":960,"hoeyde":300},"rammeVisning":"flex","kortKant":"0px","kort":{"v":162,"h":1118,"t":235,"b":459,"w":956,"hoeyde":224},"maa":{"v":186,"h":378,"t":459,"b":507,"w":192,"hoeyde":48},"kan":{"v":902,"h":1094,"t":459,"b":507,"w":192,"hoeyde":48},"nav":{"v":160,"h":1120,"t":557,"b":605,"w":960,"hoeyde":48},"telling":{"v":160,"h":1120,"t":201,"b":221,"w":960,"hoeyde":20},"synlige":1,"iHeader":0,"lenke":{"v":136,"h":321,"t":645,"b":689,"w":185,"hoeyde":44},"href":"/tekst/aaabc9a3-d7db-45d1-a32c-75f872009fc7/oppgaver"} |
| ✓ | bolk 8, 1280 px, høyrehendt, lys, teksten: tellingen står over kortet som før, i hele kortets bredde | {"telling":{"v":160,"h":1120,"t":201,"b":221,"w":960,"hoeyde":20},"ramme":{"v":160,"h":1120,"t":233,"b":533,"w":960,"hoeyde":300}} |
| ✓ | mobil uten sidelengs rulling: øvekort 1280 px, høyrehendt, lys, teksten | 1280 px innhold i 1280 px vindu |
| ✓ | bolk 3, 1280 px, høyrehendt, lys, teksten: klikk i rammen utenfor merkegruppen snur kortet (fokus på kortet), klikk på kortflaten snur det tilbake, og klikk mellom merkeknappene snur ikke | {"foer":false,"etterRamme":true,"fokusPaaKortet":true,"etterKort":false,"etterMellomrom":false} |
| ✓ | bolk 3, 1280 px, høyrehendt, lys, teksten: feilmeldingen fra merkingen står i rammen, over knappene, og et klikk på den snur ikke kortet | {"iRammen":true,"underKortet":true,"overKnappene":true,"klikkSnurIkke":true} |
| ✓ | bolk 3, 1280 px, høyrehendt, lys, teksten: Tab etter kortet går «Må øve mer» → «Har kontroll» → «Forrige kort» → «Neste kort» → «Tilbake til oppgavene» | Må øve mer \| Har kontroll \| Forrige kort \| Neste kort \| Tilbake til oppgavene |
| ✓ | axe: øvekort 1280 px, høyrehendt, lys |  |
| ✓ | bolk 3, 1280 px, høyrehendt, lys, mappen: knappene nederst i rammen («Må øve mer» til venstre), kortet om lag 960 px, og «Tilbake til mappen» én gang, nederst til venstre utenfor kortkanten, ikke øverst | {"hand":null,"ramme":{"v":160,"h":1120,"t":237,"b":537,"w":960,"hoeyde":300},"rammeVisning":"flex","kortKant":"0px","kort":{"v":162,"h":1118,"t":239,"b":463,"w":956,"hoeyde":224},"maa":{"v":186,"h":378,"t":463,"b":511,"w":192,"hoeyde":48},"kan":{"v":902,"h":1094,"t":463,"b":511,"w":192,"hoeyde":48},"nav":{"v":160,"h":1120,"t":561,"b":609,"w":960,"hoeyde":48},"telling":{"v":160,"h":1120,"t":205,"b":225,"w":960,"hoeyde":20},"synlige":1,"iHeader":0,"lenke":{"v":136,"h":300,"t":649,"b":693,"w":164,"hoeyde":44},"href":"/mappe/d01a934c-6181-493e-937d-9748c7c7f46f"} |
| ✓ | bolk 8, 1280 px, høyrehendt, lys, mappen: tellingen står over kortet som før, i hele kortets bredde | {"telling":{"v":160,"h":1120,"t":205,"b":225,"w":960,"hoeyde":20},"ramme":{"v":160,"h":1120,"t":237,"b":537,"w":960,"hoeyde":300}} |
| ✓ | mobil uten sidelengs rulling: øvekort 1280 px, høyrehendt, lys, mappen | 1280 px innhold i 1280 px vindu |
| ✓ | axe: øvekort fra mappen 1280 px, høyrehendt, lys |  |
| ✓ | bolk 3, 1280 px, høyrehendt, mørk, teksten: knappene nederst i rammen («Må øve mer» til venstre), kortet om lag 960 px, og «Tilbake til oppgavene» én gang, nederst til venstre utenfor kortkanten, ikke øverst | {"hand":null,"ramme":{"v":160,"h":1120,"t":233,"b":533,"w":960,"hoeyde":300},"rammeVisning":"flex","kortKant":"0px","kort":{"v":162,"h":1118,"t":235,"b":459,"w":956,"hoeyde":224},"maa":{"v":186,"h":378,"t":459,"b":507,"w":192,"hoeyde":48},"kan":{"v":902,"h":1094,"t":459,"b":507,"w":192,"hoeyde":48},"nav":{"v":160,"h":1120,"t":557,"b":605,"w":960,"hoeyde":48},"telling":{"v":160,"h":1120,"t":201,"b":221,"w":960,"hoeyde":20},"synlige":1,"iHeader":0,"lenke":{"v":136,"h":321,"t":645,"b":689,"w":185,"hoeyde":44},"href":"/tekst/aaabc9a3-d7db-45d1-a32c-75f872009fc7/oppgaver"} |
| ✓ | bolk 8, 1280 px, høyrehendt, mørk, teksten: tellingen står over kortet som før, i hele kortets bredde | {"telling":{"v":160,"h":1120,"t":201,"b":221,"w":960,"hoeyde":20},"ramme":{"v":160,"h":1120,"t":233,"b":533,"w":960,"hoeyde":300}} |
| ✓ | mobil uten sidelengs rulling: øvekort 1280 px, høyrehendt, mørk, teksten | 1280 px innhold i 1280 px vindu |
| ✓ | bolk 3, 1280 px, høyrehendt, mørk, teksten: klikk i rammen utenfor merkegruppen snur kortet (fokus på kortet), klikk på kortflaten snur det tilbake, og klikk mellom merkeknappene snur ikke | {"foer":false,"etterRamme":true,"fokusPaaKortet":true,"etterKort":false,"etterMellomrom":false} |
| ✓ | bolk 3, 1280 px, høyrehendt, mørk, teksten: feilmeldingen fra merkingen står i rammen, over knappene, og et klikk på den snur ikke kortet | {"iRammen":true,"underKortet":true,"overKnappene":true,"klikkSnurIkke":true} |
| ✓ | bolk 3, 1280 px, høyrehendt, mørk, teksten: Tab etter kortet går «Må øve mer» → «Har kontroll» → «Forrige kort» → «Neste kort» → «Tilbake til oppgavene» | Må øve mer \| Har kontroll \| Forrige kort \| Neste kort \| Tilbake til oppgavene |
| ✓ | axe: øvekort 1280 px, høyrehendt, mørk |  |
| ✓ | bolk 3, 1280 px, høyrehendt, mørk, mappen: knappene nederst i rammen («Må øve mer» til venstre), kortet om lag 960 px, og «Tilbake til mappen» én gang, nederst til venstre utenfor kortkanten, ikke øverst | {"hand":null,"ramme":{"v":160,"h":1120,"t":237,"b":537,"w":960,"hoeyde":300},"rammeVisning":"flex","kortKant":"0px","kort":{"v":162,"h":1118,"t":239,"b":463,"w":956,"hoeyde":224},"maa":{"v":186,"h":378,"t":463,"b":511,"w":192,"hoeyde":48},"kan":{"v":902,"h":1094,"t":463,"b":511,"w":192,"hoeyde":48},"nav":{"v":160,"h":1120,"t":561,"b":609,"w":960,"hoeyde":48},"telling":{"v":160,"h":1120,"t":205,"b":225,"w":960,"hoeyde":20},"synlige":1,"iHeader":0,"lenke":{"v":136,"h":300,"t":649,"b":693,"w":164,"hoeyde":44},"href":"/mappe/d01a934c-6181-493e-937d-9748c7c7f46f"} |
| ✓ | bolk 8, 1280 px, høyrehendt, mørk, mappen: tellingen står over kortet som før, i hele kortets bredde | {"telling":{"v":160,"h":1120,"t":205,"b":225,"w":960,"hoeyde":20},"ramme":{"v":160,"h":1120,"t":237,"b":537,"w":960,"hoeyde":300}} |
| ✓ | mobil uten sidelengs rulling: øvekort 1280 px, høyrehendt, mørk, mappen | 1280 px innhold i 1280 px vindu |
| ✓ | axe: øvekort fra mappen 1280 px, høyrehendt, mørk |  |
| ✓ | bolk 3, 1280 px, venstrehendt, lys, teksten: knappene nederst i rammen («Har kontroll» til venstre), kortet om lag 960 px, og «Tilbake til oppgavene» én gang, nederst til venstre utenfor kortkanten, ikke øverst | {"hand":"venstre","ramme":{"v":160,"h":1120,"t":233,"b":533,"w":960,"hoeyde":300},"rammeVisning":"flex","kortKant":"0px","kort":{"v":162,"h":1118,"t":235,"b":459,"w":956,"hoeyde":224},"maa":{"v":902,"h":1094,"t":459,"b":507,"w":192,"hoeyde":48},"kan":{"v":186,"h":378,"t":459,"b":507,"w":192,"hoeyde":48},"nav":{"v":160,"h":1120,"t":557,"b":605,"w":960,"hoeyde":48},"telling":{"v":160,"h":1120,"t":201,"b":221,"w":960,"hoeyde":20},"synlige":1,"iHeader":0,"lenke":{"v":136,"h":321,"t":645,"b":689,"w":185,"hoeyde":44},"href":"/tekst/aaabc9a3-d7db-45d1-a32c-75f872009fc7/oppgaver"} |
| ✓ | bolk 8, 1280 px, venstrehendt, lys, teksten: tellingen står over kortet som før, i hele kortets bredde | {"telling":{"v":160,"h":1120,"t":201,"b":221,"w":960,"hoeyde":20},"ramme":{"v":160,"h":1120,"t":233,"b":533,"w":960,"hoeyde":300}} |
| ✓ | mobil uten sidelengs rulling: øvekort 1280 px, venstrehendt, lys, teksten | 1280 px innhold i 1280 px vindu |
| ✓ | bolk 3, 1280 px, venstrehendt, lys, teksten: klikk i rammen utenfor merkegruppen snur kortet (fokus på kortet), klikk på kortflaten snur det tilbake, og klikk mellom merkeknappene snur ikke | {"foer":false,"etterRamme":true,"fokusPaaKortet":true,"etterKort":false,"etterMellomrom":false} |
| ✓ | bolk 3, 1280 px, venstrehendt, lys, teksten: feilmeldingen fra merkingen står i rammen, over knappene, og et klikk på den snur ikke kortet | {"iRammen":true,"underKortet":true,"overKnappene":true,"klikkSnurIkke":true} |
| ✓ | bolk 3, 1280 px, venstrehendt, lys, teksten: Tab etter kortet går «Må øve mer» → «Har kontroll» → «Forrige kort» → «Neste kort» → «Tilbake til oppgavene» | Må øve mer \| Har kontroll \| Forrige kort \| Neste kort \| Tilbake til oppgavene |
| ✓ | axe: øvekort 1280 px, venstrehendt, lys |  |
| ✓ | bolk 3, 1280 px, venstrehendt, lys, mappen: knappene nederst i rammen («Har kontroll» til venstre), kortet om lag 960 px, og «Tilbake til mappen» én gang, nederst til venstre utenfor kortkanten, ikke øverst | {"hand":"venstre","ramme":{"v":160,"h":1120,"t":237,"b":537,"w":960,"hoeyde":300},"rammeVisning":"flex","kortKant":"0px","kort":{"v":162,"h":1118,"t":239,"b":463,"w":956,"hoeyde":224},"maa":{"v":902,"h":1094,"t":463,"b":511,"w":192,"hoeyde":48},"kan":{"v":186,"h":378,"t":463,"b":511,"w":192,"hoeyde":48},"nav":{"v":160,"h":1120,"t":561,"b":609,"w":960,"hoeyde":48},"telling":{"v":160,"h":1120,"t":205,"b":225,"w":960,"hoeyde":20},"synlige":1,"iHeader":0,"lenke":{"v":136,"h":300,"t":649,"b":693,"w":164,"hoeyde":44},"href":"/mappe/d01a934c-6181-493e-937d-9748c7c7f46f"} |
| ✓ | bolk 8, 1280 px, venstrehendt, lys, mappen: tellingen står over kortet som før, i hele kortets bredde | {"telling":{"v":160,"h":1120,"t":205,"b":225,"w":960,"hoeyde":20},"ramme":{"v":160,"h":1120,"t":237,"b":537,"w":960,"hoeyde":300}} |
| ✓ | mobil uten sidelengs rulling: øvekort 1280 px, venstrehendt, lys, mappen | 1280 px innhold i 1280 px vindu |
| ✓ | axe: øvekort fra mappen 1280 px, venstrehendt, lys |  |
| ✓ | bolk 3, 1280 px, venstrehendt, mørk, teksten: knappene nederst i rammen («Har kontroll» til venstre), kortet om lag 960 px, og «Tilbake til oppgavene» én gang, nederst til venstre utenfor kortkanten, ikke øverst | {"hand":"venstre","ramme":{"v":160,"h":1120,"t":233,"b":533,"w":960,"hoeyde":300},"rammeVisning":"flex","kortKant":"0px","kort":{"v":162,"h":1118,"t":235,"b":459,"w":956,"hoeyde":224},"maa":{"v":902,"h":1094,"t":459,"b":507,"w":192,"hoeyde":48},"kan":{"v":186,"h":378,"t":459,"b":507,"w":192,"hoeyde":48},"nav":{"v":160,"h":1120,"t":557,"b":605,"w":960,"hoeyde":48},"telling":{"v":160,"h":1120,"t":201,"b":221,"w":960,"hoeyde":20},"synlige":1,"iHeader":0,"lenke":{"v":136,"h":321,"t":645,"b":689,"w":185,"hoeyde":44},"href":"/tekst/aaabc9a3-d7db-45d1-a32c-75f872009fc7/oppgaver"} |
| ✓ | bolk 8, 1280 px, venstrehendt, mørk, teksten: tellingen står over kortet som før, i hele kortets bredde | {"telling":{"v":160,"h":1120,"t":201,"b":221,"w":960,"hoeyde":20},"ramme":{"v":160,"h":1120,"t":233,"b":533,"w":960,"hoeyde":300}} |
| ✓ | mobil uten sidelengs rulling: øvekort 1280 px, venstrehendt, mørk, teksten | 1280 px innhold i 1280 px vindu |
| ✓ | bolk 3, 1280 px, venstrehendt, mørk, teksten: klikk i rammen utenfor merkegruppen snur kortet (fokus på kortet), klikk på kortflaten snur det tilbake, og klikk mellom merkeknappene snur ikke | {"foer":false,"etterRamme":true,"fokusPaaKortet":true,"etterKort":false,"etterMellomrom":false} |
| ✓ | bolk 3, 1280 px, venstrehendt, mørk, teksten: feilmeldingen fra merkingen står i rammen, over knappene, og et klikk på den snur ikke kortet | {"iRammen":true,"underKortet":true,"overKnappene":true,"klikkSnurIkke":true} |
| ✓ | bolk 3, 1280 px, venstrehendt, mørk, teksten: Tab etter kortet går «Må øve mer» → «Har kontroll» → «Forrige kort» → «Neste kort» → «Tilbake til oppgavene» | Må øve mer \| Har kontroll \| Forrige kort \| Neste kort \| Tilbake til oppgavene |
| ✓ | axe: øvekort 1280 px, venstrehendt, mørk |  |
| ✓ | bolk 3, 1280 px, venstrehendt, mørk, mappen: knappene nederst i rammen («Har kontroll» til venstre), kortet om lag 960 px, og «Tilbake til mappen» én gang, nederst til venstre utenfor kortkanten, ikke øverst | {"hand":"venstre","ramme":{"v":160,"h":1120,"t":237,"b":537,"w":960,"hoeyde":300},"rammeVisning":"flex","kortKant":"0px","kort":{"v":162,"h":1118,"t":239,"b":463,"w":956,"hoeyde":224},"maa":{"v":902,"h":1094,"t":463,"b":511,"w":192,"hoeyde":48},"kan":{"v":186,"h":378,"t":463,"b":511,"w":192,"hoeyde":48},"nav":{"v":160,"h":1120,"t":561,"b":609,"w":960,"hoeyde":48},"telling":{"v":160,"h":1120,"t":205,"b":225,"w":960,"hoeyde":20},"synlige":1,"iHeader":0,"lenke":{"v":136,"h":300,"t":649,"b":693,"w":164,"hoeyde":44},"href":"/mappe/d01a934c-6181-493e-937d-9748c7c7f46f"} |
| ✓ | bolk 8, 1280 px, venstrehendt, mørk, mappen: tellingen står over kortet som før, i hele kortets bredde | {"telling":{"v":160,"h":1120,"t":205,"b":225,"w":960,"hoeyde":20},"ramme":{"v":160,"h":1120,"t":237,"b":537,"w":960,"hoeyde":300}} |
| ✓ | mobil uten sidelengs rulling: øvekort 1280 px, venstrehendt, mørk, mappen | 1280 px innhold i 1280 px vindu |
| ✓ | axe: øvekort fra mappen 1280 px, venstrehendt, mørk |  |
| ✓ | bolk 3, 760 px, høyrehendt, lys, teksten: knappene nederst i rammen («Må øve mer» til venstre), og «Tilbake til oppgavene» én gang, nederst til venstre utenfor kortkanten, ikke øverst | {"hand":null,"ramme":{"v":32,"h":728,"t":233,"b":533,"w":696,"hoeyde":300},"rammeVisning":"flex","kortKant":"0px","kort":{"v":34,"h":726,"t":235,"b":459,"w":692,"hoeyde":224},"maa":{"v":58,"h":250,"t":459,"b":507,"w":192,"hoeyde":48},"kan":{"v":510,"h":702,"t":459,"b":507,"w":192,"hoeyde":48},"nav":{"v":32,"h":728,"t":557,"b":605,"w":696,"hoeyde":48},"telling":{"v":32,"h":728,"t":201,"b":221,"w":696,"hoeyde":20},"synlige":1,"iHeader":0,"lenke":{"v":8,"h":193,"t":645,"b":689,"w":185,"hoeyde":44},"href":"/tekst/aaabc9a3-d7db-45d1-a32c-75f872009fc7/oppgaver"} |
| ✓ | bolk 8, 760 px, høyrehendt, lys, teksten: tellingen står over kortet som før, i hele kortets bredde | {"telling":{"v":32,"h":728,"t":201,"b":221,"w":696,"hoeyde":20},"ramme":{"v":32,"h":728,"t":233,"b":533,"w":696,"hoeyde":300}} |
| ✓ | mobil uten sidelengs rulling: øvekort 760 px, høyrehendt, lys, teksten | 760 px innhold i 760 px vindu |
| ✓ | bolk 3, 760 px, høyrehendt, lys, teksten: klikk i rammen utenfor merkegruppen snur kortet (fokus på kortet), klikk på kortflaten snur det tilbake, og klikk mellom merkeknappene snur ikke | {"foer":false,"etterRamme":true,"fokusPaaKortet":true,"etterKort":false,"etterMellomrom":false} |
| ✓ | bolk 3, 760 px, høyrehendt, lys, teksten: feilmeldingen fra merkingen står i rammen, over knappene, og et klikk på den snur ikke kortet | {"iRammen":true,"underKortet":true,"overKnappene":true,"klikkSnurIkke":true} |
| ✓ | bolk 3, 760 px, høyrehendt, lys, mappen: knappene nederst i rammen («Må øve mer» til venstre), og «Tilbake til mappen» én gang, nederst til venstre utenfor kortkanten, ikke øverst | {"hand":null,"ramme":{"v":32,"h":728,"t":237,"b":537,"w":696,"hoeyde":300},"rammeVisning":"flex","kortKant":"0px","kort":{"v":34,"h":726,"t":239,"b":463,"w":692,"hoeyde":224},"maa":{"v":58,"h":250,"t":463,"b":511,"w":192,"hoeyde":48},"kan":{"v":510,"h":702,"t":463,"b":511,"w":192,"hoeyde":48},"nav":{"v":32,"h":728,"t":561,"b":609,"w":696,"hoeyde":48},"telling":{"v":32,"h":728,"t":205,"b":225,"w":696,"hoeyde":20},"synlige":1,"iHeader":0,"lenke":{"v":8,"h":172,"t":649,"b":693,"w":164,"hoeyde":44},"href":"/mappe/d01a934c-6181-493e-937d-9748c7c7f46f"} |
| ✓ | bolk 8, 760 px, høyrehendt, lys, mappen: tellingen står over kortet som før, i hele kortets bredde | {"telling":{"v":32,"h":728,"t":205,"b":225,"w":696,"hoeyde":20},"ramme":{"v":32,"h":728,"t":237,"b":537,"w":696,"hoeyde":300}} |
| ✓ | mobil uten sidelengs rulling: øvekort 760 px, høyrehendt, lys, mappen | 760 px innhold i 760 px vindu |
| ✓ | bolk 3, 760 px, 200 % tekst, høyrehendt, lys, teksten: knappene nederst i rammen («Må øve mer» til venstre), og «Tilbake til oppgavene» én gang, nederst til venstre utenfor kortkanten, ikke øverst | {"hand":null,"ramme":{"v":64,"h":696,"t":608,"b":1316,"w":632,"hoeyde":708},"rammeVisning":"flex","kortKant":"0px","kort":{"v":66,"h":694,"t":610,"b":1058,"w":628,"hoeyde":448},"maa":{"v":114,"h":498,"t":1058,"b":1150,"w":384,"hoeyde":92},"kan":{"v":114,"h":498,"t":1174,"b":1266,"w":384,"hoeyde":92},"nav":{"v":64,"h":696,"t":1364,"b":1456,"w":632,"hoeyde":92},"telling":{"v":64,"h":696,"t":488,"b":584,"w":632,"hoeyde":96},"synlige":1,"iHeader":0,"lenke":{"v":16,"h":387,"t":1536,"b":1624,"w":371,"hoeyde":88},"href":"/tekst/aaabc9a3-d7db-45d1-a32c-75f872009fc7/oppgaver"} |
| ✓ | bolk 8, 760 px, 200 % tekst, høyrehendt, lys, teksten: tellingen står over kortet som før, i hele kortets bredde | {"telling":{"v":64,"h":696,"t":488,"b":584,"w":632,"hoeyde":96},"ramme":{"v":64,"h":696,"t":608,"b":1316,"w":632,"hoeyde":708}} |
| ✓ | mobil uten sidelengs rulling: øvekort 760 px, 200 % tekst, høyrehendt, lys, teksten | 760 px innhold i 760 px vindu |
| ✓ | bolk 3, 760 px, 200 % tekst, høyrehendt, lys, mappen: knappene nederst i rammen («Må øve mer» til venstre), og «Tilbake til mappen» én gang, nederst til venstre utenfor kortkanten, ikke øverst | {"hand":null,"ramme":{"v":64,"h":696,"t":616,"b":1324,"w":632,"hoeyde":708},"rammeVisning":"flex","kortKant":"0px","kort":{"v":66,"h":694,"t":618,"b":1066,"w":628,"hoeyde":448},"maa":{"v":114,"h":498,"t":1066,"b":1158,"w":384,"hoeyde":92},"kan":{"v":114,"h":498,"t":1182,"b":1274,"w":384,"hoeyde":92},"nav":{"v":64,"h":696,"t":1372,"b":1464,"w":632,"hoeyde":92},"telling":{"v":64,"h":696,"t":496,"b":592,"w":632,"hoeyde":96},"synlige":1,"iHeader":0,"lenke":{"v":16,"h":343,"t":1544,"b":1632,"w":327,"hoeyde":88},"href":"/mappe/d01a934c-6181-493e-937d-9748c7c7f46f"} |
| ✓ | bolk 8, 760 px, 200 % tekst, høyrehendt, lys, mappen: tellingen står over kortet som før, i hele kortets bredde | {"telling":{"v":64,"h":696,"t":496,"b":592,"w":632,"hoeyde":96},"ramme":{"v":64,"h":696,"t":616,"b":1324,"w":632,"hoeyde":708}} |
| ✓ | mobil uten sidelengs rulling: øvekort 760 px, 200 % tekst, høyrehendt, lys, mappen | 760 px innhold i 760 px vindu |
| ✓ | bolk 3, 760 px, 200 % tekst, venstrehendt, lys, teksten: knappene nederst i rammen («Har kontroll» til venstre), og «Tilbake til oppgavene» én gang, nederst til venstre utenfor kortkanten, ikke øverst | {"hand":"venstre","ramme":{"v":64,"h":696,"t":608,"b":1316,"w":632,"hoeyde":708},"rammeVisning":"flex","kortKant":"0px","kort":{"v":66,"h":694,"t":610,"b":1058,"w":628,"hoeyde":448},"maa":{"v":262,"h":646,"t":1058,"b":1150,"w":384,"hoeyde":92},"kan":{"v":262,"h":646,"t":1174,"b":1266,"w":384,"hoeyde":92},"nav":{"v":64,"h":696,"t":1364,"b":1456,"w":632,"hoeyde":92},"telling":{"v":64,"h":696,"t":488,"b":584,"w":632,"hoeyde":96},"synlige":1,"iHeader":0,"lenke":{"v":16,"h":387,"t":1536,"b":1624,"w":371,"hoeyde":88},"href":"/tekst/aaabc9a3-d7db-45d1-a32c-75f872009fc7/oppgaver"} |
| ✓ | bolk 8, 760 px, 200 % tekst, venstrehendt, lys, teksten: tellingen står over kortet som før, i hele kortets bredde | {"telling":{"v":64,"h":696,"t":488,"b":584,"w":632,"hoeyde":96},"ramme":{"v":64,"h":696,"t":608,"b":1316,"w":632,"hoeyde":708}} |
| ✓ | mobil uten sidelengs rulling: øvekort 760 px, 200 % tekst, venstrehendt, lys, teksten | 760 px innhold i 760 px vindu |
| ✓ | bolk 3, 760 px, 200 % tekst, venstrehendt, lys, mappen: knappene nederst i rammen («Har kontroll» til venstre), og «Tilbake til mappen» én gang, nederst til venstre utenfor kortkanten, ikke øverst | {"hand":"venstre","ramme":{"v":64,"h":696,"t":616,"b":1324,"w":632,"hoeyde":708},"rammeVisning":"flex","kortKant":"0px","kort":{"v":66,"h":694,"t":618,"b":1066,"w":628,"hoeyde":448},"maa":{"v":262,"h":646,"t":1066,"b":1158,"w":384,"hoeyde":92},"kan":{"v":262,"h":646,"t":1182,"b":1274,"w":384,"hoeyde":92},"nav":{"v":64,"h":696,"t":1372,"b":1464,"w":632,"hoeyde":92},"telling":{"v":64,"h":696,"t":496,"b":592,"w":632,"hoeyde":96},"synlige":1,"iHeader":0,"lenke":{"v":16,"h":343,"t":1544,"b":1632,"w":327,"hoeyde":88},"href":"/mappe/d01a934c-6181-493e-937d-9748c7c7f46f"} |
| ✓ | bolk 8, 760 px, 200 % tekst, venstrehendt, lys, mappen: tellingen står over kortet som før, i hele kortets bredde | {"telling":{"v":64,"h":696,"t":496,"b":592,"w":632,"hoeyde":96},"ramme":{"v":64,"h":696,"t":616,"b":1324,"w":632,"hoeyde":708}} |
| ✓ | mobil uten sidelengs rulling: øvekort 760 px, 200 % tekst, venstrehendt, lys, mappen | 760 px innhold i 760 px vindu |
| ✓ | venstrehendt (med JavaScript): «Venstrehendt» er en avkrysningsboks i en fieldset med legend, ikke valgt |  |
| ✓ | venstrehendt (med JavaScript): «Lagre»-knappene har ulike navn, og hjelpetekstene er koblet til valgene | {"knapper":["Lagre","Lagre utseendet","Lagre valget for øvekortene"],"hjelp":"«Må øve mer» og «Har kontroll» står til venstre over kortet, så de er lette å nå med venstre tommel. På stor skjerm, der de står nederst i kortet, bytter de plass. Valget gjelder denne enheten.","hjelpIFieldset":true,"tema":"Valget gjelder denne enheten. «Følg enheten» bruker lys eller mørk modus etter innstillingen på telefonen eller PC-en."} |
| ✓ | venstrehendt (med JavaScript): kryss + «Lagre» gir hand=venstre (SameSite=Lax, httpOnly, ett år), og boksen er krysset | venstre, Lax, 365 dager |
| ✓ | axe: konto med «Venstrehendt» valgt |  |
| ✓ | venstrehendt (med JavaScript): øvekortene har merkeknappene til venstre etter lagring | {"hand":"venstre","kort":{"v":16,"h":359,"t":308,"b":444,"w":343,"hoeyde":136},"maa":{"v":16,"h":149,"t":188,"b":236,"w":133,"hoeyde":48},"kan":{"v":16,"h":149,"t":248,"b":296,"w":133,"hoeyde":48},"forrige":{"v":16,"h":182,"t":456,"b":504,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":456,"b":504,"w":166,"hoeyde":48},"telling":{"v":161,"h":359,"t":188,"b":252,"w":198,"hoeyde":64},"tellingFoerKortet":true,"pressed":["false","false"]} |
| ✓ | venstrehendt (med JavaScript): uten kryss + «Lagre» slettes informasjonskapselen |  |
| ✓ | venstrehendt (uten JavaScript): «Venstrehendt» er en avkrysningsboks i en fieldset med legend, ikke valgt |  |
| ✓ | venstrehendt (uten JavaScript): «Lagre»-knappene har ulike navn, og hjelpetekstene er koblet til valgene | {"knapper":["Lagre","Lagre utseendet","Lagre valget for øvekortene"],"hjelp":"«Må øve mer» og «Har kontroll» står til venstre over kortet, så de er lette å nå med venstre tommel. På stor skjerm, der de står nederst i kortet, bytter de plass. Valget gjelder denne enheten.","hjelpIFieldset":true,"tema":"Valget gjelder denne enheten. «Følg enheten» bruker lys eller mørk modus etter innstillingen på telefonen eller PC-en."} |
| ✓ | venstrehendt (uten JavaScript): kryss + «Lagre» gir hand=venstre (SameSite=Lax, httpOnly, ett år), og boksen er krysset | venstre, Lax, 365 dager |
| ✓ | venstrehendt (uten JavaScript): øvekortene har merkeknappene til venstre etter lagring | {"hand":"venstre","kort":{"v":16,"h":359,"t":308,"b":444,"w":343,"hoeyde":136},"maa":{"v":16,"h":149,"t":188,"b":236,"w":133,"hoeyde":48},"kan":{"v":16,"h":149,"t":248,"b":296,"w":133,"hoeyde":48},"forrige":{"v":16,"h":182,"t":456,"b":504,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":456,"b":504,"w":166,"hoeyde":48},"telling":{"v":161,"h":359,"t":188,"b":252,"w":198,"hoeyde":64},"tellingFoerKortet":true,"pressed":["false","false"]} |
| ✓ | venstrehendt (uten JavaScript): uten kryss + «Lagre» slettes informasjonskapselen |  |
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
| ✓ | mobil uten sidelengs rulling: mappe | 375 px innhold i 375 px vindu |
| ✓ | axe: mappe (telefon) |  |
| ✓ | mobil uten sidelengs rulling: mappe: øvekort | 375 px innhold i 375 px vindu |
| ✓ | axe: mappe: øvekort (telefon) |  |
| ✓ | mobil uten sidelengs rulling: mappe: quiz | 375 px innhold i 375 px vindu |
| ✓ | axe: mappe: quiz (telefon) |  |
| ✓ | mobil uten sidelengs rulling: konto | 375 px innhold i 375 px vindu |
| ✓ | axe: konto (telefon) |  |
| ✓ | FR-10 telefon: trykk åpner forklaringen |  |
| ✓ | FR-10 telefon: forklaringen er innenfor skjermen | 12–363 px |
| ✓ | FR-10 telefon: rulleposisjonen står stille |  |
| ✓ | FR-10 telefon: trykk utenfor lukker |  |
| ✓ | mobil uten sidelengs rulling: lesevisning etter forklaring | 375 px innhold i 375 px vindu |
| ✓ | bolk 6, 375 px: Buddy (brillene 36 px) hilser ved «Hei!» med neste steg i boblen, aria-hidden | {"synlig":true,"skjult":true,"brille":36,"boble":"Klar for quizen om EM-bølger?","innenfor":true} |
| ✓ | bolk 5, 375 px: mappen er en stripe i full bredde med flik, «Mappe» foran tittelen og «1 tekst» | {"full":true,"fane":true,"foran":true,"merke":"Mappe","tekster":"1 tekst"} |
| ✓ | bolk 5, 375 px: mappens ark har tekstkortet og de to samlede kortene som rader, med fokus på tekstkortet | {"oppsett":"ark","posisjon":"fixed","arkInne":true,"lukkInne":true,"tilbakeInne":true,"andel":52,"ruller":false,"siden":false,"rader":3} |
| ✓ | bolk 6 (24.11), 375 px: på arket har tekstraden lilla flate og stripe, og de samlede radene rosa flate og dobbel kant | {"lilla":"rgb(237, 229, 252)","rosa":"rgb(255, 224, 238)","rader":[{"slag":"tekst","flate":"rgb(237, 229, 252)","start":"solid 6","kant":"none"},{"slag":"samlet","flate":"rgb(255, 224, 238)","start":"double 4","kant":"double"},{"slag":"samlet","flate":"rgb(255, 224, 238)","start":"double 4","kant":"double"}]} |
| ✓ | mobil uten sidelengs rulling: arbeidsbord med åpent mappeark | 375 px innhold i 375 px vindu |
| ✓ | axe: arbeidsbord med åpent mappeark (telefon) |  |
| ✓ | bolk 5, 375 px: «Tilbake til mappen» står i arket, innenfor skjermen | {"oppsett":"ark","posisjon":"fixed","arkInne":true,"lukkInne":true,"tilbakeInne":true,"andel":82,"ruller":false,"siden":false,"rader":5} |
| ✓ | bolk 6, 375 px: viften er et ark nederst, med fem rader, og arket og «Legg sammen» er innenfor skjermen | {"oppsett":"ark","posisjon":"fixed","arkInne":true,"lukkInne":true,"tilbakeInne":true,"andel":82,"ruller":false,"siden":false,"rader":5} |
| ✓ | bolk 6, 375 px: arket er høyst 90 % av skjermen, og siden under ruller ikke | 82 % |
| ✓ | bolk 6, arket: fokus på den første raden |  |
| ✓ | bolk 6, arket: Tab og Shift+Tab holder fokus i arket | 0 av 11 trykk gikk ut |
| ✓ | mobil uten sidelengs rulling: arbeidsbord med åpent ark | 375 px innhold i 375 px vindu |
| ✓ | axe: arbeidsbord med åpent ark (telefon) |  |
| ✓ | bolk 5, arket: «Tilbake til mappen» gir mappens tre rader og fokus på tekstkortet | {"rader":3,"fokus":true,"oppsett":"ark"} |
| ✓ | bolk 6, arket: Esc lukker, har-ark er borte, siden ruller igjen, og fokus er tilbake på bunkens knapp | {"dialog":0,"harArk":false,"overflow":"visible","fokus":true} |
| ✓ | bolk 6, arket: trykk på bakgrunnen lukker, har-ark er borte, siden ruller igjen, og fokus er tilbake på bunkens knapp | {"dialog":0,"harArk":false,"overflow":"visible","fokus":true} |
| ✓ | bolk 6, arket: «Legg sammen» lukker, har-ark er borte, siden ruller igjen, og fokus er tilbake på bunkens knapp | {"dialog":0,"harArk":false,"overflow":"visible","fokus":true} |
| ✓ | menyen på telefon viser Samlinger og Konto |  |
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
| ✓ | FR-52: mappequizen «Kort» har 2 spørsmål og «Lever» | 2 spørsmål |
| ✓ | axe: mappe: quiz, levert |  |
| ✓ | FR-52: forsøket står under «Tidligere forsøk» med lengden og antallet |  |
| ✓ | overleveringen: en lenke i topplinjen trykket mens Buddy tenker, gir ingen avslutning | svar true, verten sett false, /samling |
| ✓ | overleveringen: «tilbake» trykket mens Buddy tenker, gir ingen avslutning | svar true, verten sett false (), /samling |
| ✓ | overleveringen: en omdirigering til ?fagordfeil gir ingen avslutning | /tekst/5df9fca8-74a5-4048-8d72-6239544ff290/lesing?fagordfeil=lagret_svar_mangler, verten sett false |
| ✓ | overleveringen: verten har én statusregion, tom før noe venter | {"antall":1,"tekst":""} |
| ✓ | overleveringen: en venting som ender med feil, gir ingen avslutning noe sted | {"antall":1,"tekst":""} |
| ✓ | overleveringen, 375 px: «Videre» på en innlimt tekst gir avslutningen på lesevisningen | /tekst/e8a5e591-a602-4658-a1cf-17bdab0acae7/lesing |
| ✓ | overleveringen, 375 px: pillen ligger fast nederst med mini-Buddy (28 px) som spiller avslutningen, og statusregionen sier «Teksten er klar.» | {"posisjon":"fixed","innenfor":true,"mini":true,"slutt":true,"merke":28,"regioner":1,"regionTekst":"Teksten er klar.","fokusIPillen":false,"variabel":"52px","hoeyde":52,"klasse":true} |
| ✓ | overleveringen: pillen teller med i --tenker-pille og har-tenkepille, og fokus er ikke flyttet til den | 52px / 52px |
| ✓ | axe: lesevisning med avslutningen i pillen (telefon) |  |
| ✓ | overleveringen: pillen står gjennom avslutningen (4,5–5,9 s), er så borte, og html har ikke lenger har-tenkepille | 5540 ms, {"antall":1,"tekst":""} |
| ✓ | overleveringen: «Prøv igjen» med ?fagordfeil lykkes, adressen er uten fagordfeil, og verten sier «Fagordene er klare.» | /tekst/e8a5e591-a602-4658-a1cf-17bdab0acae7/lesing {"antall":1,"tekst":"Fagordene er klare."} |
| ✓ | overleveringen: prøveteksten er ryddet bort |  |
| ✓ | overleveringen: prøveteksten er ryddet bort |  |
| ✓ | overleveringen: prøveteksten er ryddet bort |  |
| ✓ | overleveringen: prøveteksten er ryddet bort |  |
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
| ✓ | bolk 10, quiz 1280 px: «EM-bølger» har tusjstrøket bak den nederste delen, «Quiz:» har det ikke | [{"ord":"EM-bølger","ok":true,"hoeyde":0.48}] |
| ✓ | bolk 10, quiz 1280 px: overskriften leses som «Quiz: EM-bølger» (Chromes tilgjengelighetstre) | ["Quiz: EM-bølger"] |
| ✓ | axe: quiz med tusjstrøket (1280 px) |  |
| ✓ | bolk 10, quiz 1280 px, mørk: «EM-bølger» har tusjstrøket bak den nederste delen, «Quiz:» har det ikke | [{"ord":"EM-bølger","ok":true,"hoeyde":0.48}] |
| ✓ | bolk 10, quiz 1280 px, mørk: overskriften leses som «Quiz: EM-bølger» (Chromes tilgjengelighetstre) | ["Quiz: EM-bølger"] |
| ✓ | axe: quiz med tusjstrøket (1280 px, mørk) |  |
| ✓ | bolk 10, quiz 320 px: «EM-bølger» har tusjstrøket bak den nederste delen, «Quiz:» har det ikke | [{"ord":"EM-bølger","ok":true,"hoeyde":0.48}] |
| ✓ | bolk 10, quiz 320 px: overskriften leses som «Quiz: EM-bølger» (Chromes tilgjengelighetstre) | ["Quiz: EM-bølger"] |
| ✓ | bolk 10, quiz 320 px: overskriften og strøket står innenfor vinduet |  |
| ✓ | mobil uten sidelengs rulling: quiz 320 px | 320 px innhold i 320 px vindu |
| ✓ | ingen tekst klippes: quiz 320 px |  |
| ✓ | bolk 10, quiz 320 px, 200 % tekst: «EM-bølger» har tusjstrøket bak den nederste delen, «Quiz:» har det ikke | [{"ord":"EM-bølger","ok":true,"hoeyde":0.48}] |
| ✓ | bolk 10, quiz 320 px, 200 % tekst: overskriften leses som «Quiz: EM-bølger» (Chromes tilgjengelighetstre) | ["Quiz: EM-bølger"] |
| ✓ | bolk 10, quiz 320 px, 200 % tekst: overskriften og strøket står innenfor vinduet |  |
| ✓ | mobil uten sidelengs rulling: quiz 320 px, 200 % tekst | 320 px innhold i 320 px vindu |
| ✓ | ingen tekst klippes: quiz 320 px, 200 % tekst |  |
| ✓ | bolk 10: med redusert bevegelse tegnes tusjen ikke inn | {"animasjon":"none","vises":"block","strek":"none"} |
| ✓ | bolk 10: i kontrastmodus er tusjen en vanlig understrek | {"animasjon":"tusj-tegn","vises":"none","strek":"underline"} |
| ✓ | bolk 10, 320 px, 200 % tekst: fant et svaralternativ å prøve et langt ord i |  |
| ✓ | mobil uten sidelengs rulling: quiz med langt ord i et svar 320 px, 200 % tekst | 320 px innhold i 320 px vindu |
| ✓ | bolk 10, 320 px, 200 % tekst: et langt navn brytes over flere linjer med strøk på hvert ord, innenfor vinduet | {"linjer":4,"strok":5} |
| ✓ | mobil uten sidelengs rulling: quiz med langt navn 320 px, 200 % tekst | 320 px innhold i 320 px vindu |
| ✓ | ingen tekst klippes: quiz med langt navn 320 px, 200 % tekst |  |
| ✓ | bolk 7, 320 px: «Lim inn», «PDF» og «Bilder» står på én rad, er like brede og navnet får plass i fanen | [{"navn":"Lim inn","topp":349,"bredde":96,"valgt":"true","flyter":false},{"navn":"PDF","topp":349,"bredde":96,"valgt":"false","flyter":false},{"navn":"Bilder","topp":349,"bredde":96,"valgt":"false","flyter":false}] |
| ✓ | bolk 7, 320 px, 200 % tekst: «Lim inn», «PDF» og «Bilder» står på én rad, er like brede og navnet får plass i fanen | [{"navn":"Lim inn","topp":1032,"bredde":85,"valgt":"true","flyter":false},{"navn":"PDF","topp":1032,"bredde":85,"valgt":"false","flyter":false},{"navn":"Bilder","topp":1032,"bredde":85,"valgt":"false","flyter":false}] |
| ✓ | mobil uten sidelengs rulling: ny tekst 320 px, 200 % tekst, fanene | 320 px innhold i 320 px vindu |
| ✓ | ingen tekst klippes: ny tekst 320 px, 200 % tekst, fanene |  |
| ✓ | bolk 7, 375 px: «Lim inn», «PDF» og «Bilder» står på én rad, er like brede og navnet får plass i fanen | [{"navn":"Lim inn","topp":281,"bredde":114,"valgt":"true","flyter":false},{"navn":"PDF","topp":281,"bredde":114,"valgt":"false","flyter":false},{"navn":"Bilder","topp":281,"bredde":114,"valgt":"false","flyter":false}] |
| ✓ | bolk 7, 375 px, 200 % tekst: «Lim inn», «PDF» og «Bilder» står på én rad, er like brede og navnet får plass i fanen | [{"navn":"Lim inn","topp":936,"bredde":104,"valgt":"true","flyter":false},{"navn":"PDF","topp":936,"bredde":104,"valgt":"false","flyter":false},{"navn":"Bilder","topp":936,"bredde":104,"valgt":"false","flyter":false}] |
| ✓ | mobil uten sidelengs rulling: ny tekst 375 px, 200 % tekst, fanene | 375 px innhold i 375 px vindu |
| ✓ | ingen tekst klippes: ny tekst 375 px, 200 % tekst, fanene |  |
| ✓ | mobil uten sidelengs rulling: åpent mappeark 320 px, 200 % tekst | 320 px innhold i 320 px vindu |
| ✓ | ingen tekst klippes: åpent mappeark 320 px, 200 % tekst |  |
| ✓ | bolk 5, 320 px, 200 % tekst: mappens ark er høyst 90 % av skjermen, og «Legg sammen» er innenfor skjermen | {"oppsett":"ark","posisjon":"fixed","arkInne":true,"lukkInne":true,"tilbakeInne":true,"andel":90,"ruller":true,"siden":false,"rader":3} |
| ✓ | mobil uten sidelengs rulling: åpent ark 320 px, 200 % tekst | 320 px innhold i 320 px vindu |
| ✓ | ingen tekst klippes: åpent ark 320 px, 200 % tekst |  |
| ✓ | bolk 6, 320 px, 200 % tekst: arket ruller internt, er høyst 90 % av skjermen, og «Legg sammen» er innenfor skjermen | {"oppsett":"ark","posisjon":"fixed","arkInne":true,"lukkInne":true,"tilbakeInne":true,"andel":90,"ruller":true,"siden":false,"rader":5} |
| ✓ | bolk 5, 320 px, 200 % tekst: «Tilbake til mappen» er innenfor arket og skjermen | {"oppsett":"ark","posisjon":"fixed","arkInne":true,"lukkInne":true,"tilbakeInne":true,"andel":90,"ruller":true,"siden":false,"rader":5} |
| ✓ | mobil uten sidelengs rulling: åpen mappe 1280 px, 200 % tekst | 1280 px innhold i 1280 px vindu |
| ✓ | ingen tekst klippes: åpen mappe 1280 px, 200 % tekst |  |
| ✓ | 1280 px, 200 % tekst: viften er et rutenett | data-oppsett=rutenett |
| ✓ | mobil uten sidelengs rulling: åpen vifte 1280 px, 200 % tekst | 1280 px innhold i 1280 px vindu |
| ✓ | ingen tekst klippes: åpen vifte 1280 px, 200 % tekst |  |
| ✓ | 375 px: ingen tittel i en liten bunke brytes midt i et ord («Novelleanalyse» på én linje) | Novelleanalyse, Eksamen, Prøve, Naturfag |
| ✓ | bolk 6, 375 px: de små bunkene er striper i full bredde med «N av 5», og knappen heter fortsatt «Vis aktiviteter for …» | {"full":true,"dato":false,"synlig":"0 av 5","skjult":true,"lest":"0 av 5 påbegynt","navn":"Vis aktiviteter for Novelleanalyse"} |
| ✓ | bolk 5: løse tekster og mapper deler de fem plassene, sortert etter sist aktiv, og «EM-bølger» er ikke egen bunke | tekst:Diktanalyse, tekst:Novelleanalyse, mappe:Eksamen, mappe:Prøve, mappe:Naturfag |
| ✓ | bolk 6, arket: en tekst som bare er lagt inn, har fire låste rader (ikke lenker) etter Teksten | [{"lenke":true,"laast":false,"pil":true},{"lenke":false,"laast":true,"pil":false},{"lenke":false,"laast":true,"pil":false},{"lenke":false,"laast":true,"pil":false},{"lenke":false,"laast":true,"pil":false}] |
| ✓ | bolk 6, arket: pilen vises på den åpne raden og ikke på de låste | pil - - - - |
| ✓ | axe: arbeidsbord med åpent ark, låst tekst (telefon) |  |
| ✓ | 320 px, 200 % tekst: ingen tittel i en liten bunke brytes midt i et ord («Novelleanalyse» på én linje) | Novelleanalyse, Eksamen, Prøve, Naturfag |
| ✓ | mobil uten sidelengs rulling: arbeidsbord med striper 320 px, 200 % tekst | 320 px innhold i 320 px vindu |
| ✓ | ingen tekst klippes: arbeidsbord med striper 320 px, 200 % tekst |  |
| ✓ | 1280 px: ingen hilsen-Buddy (Buddy står på bordet), og datoen og «påbegynt» er synlige på alle bunkene | {"hilsen":false,"bordBuddy":true,"dato":[true,true],"paabegynt":[true,true]} |
| ✓ | 1280 px: viften har kort uten pil (pilen hører til arket på telefon) |  |
| ✓ | FR-47: / uten innlogging gir 200 med landingssiden, ikke en omdirigering | status 200 |
| ✓ | FR-47: landingssiden har «Logg inn» og «Registrer deg» |  |
| ✓ | FR-47: siden sier at registrering krever en kode fra læreren |  |
| ✓ | landingssiden har én h1 |  |
| ✓ | FR-53: «Vilkår og personvern» vises uten innlogging, fra landingssiden | http://localhost:3107/vilkaar |
| ✓ | FR-53: siden sier hva som lagres, hvor teksten går, hvordan man sletter og hvem man kontakter |  |
| ✓ | axe: vilkår og personvern |  |
| ✓ | mobil uten sidelengs rulling: vilkår og personvern | 375 px innhold i 375 px vindu |
| ✓ | demoen har overskriften «Se hvordan Buddy markerer fagord» |  |
| ✓ | topplinjen på landingssiden: «For lærere» og «Logg inn», ikke appmenyen |  |
| ✓ | skjermleser: ingen live-regioner på landingssiden, Følge-Buddy er aria-hidden |  |
| ✓ | rulleeffektene A og C er slått på med JavaScript og bevegelse |  |
| ✓ | effekt A: fagordene markeres ett for ett, og alle forklaringene står i DOM-en | 3 markert, 1 vist, 4 i listen |
| ✓ | 1280 px: ingen Følge-Buddy, fordi den ville dekket tekstkolonnen |  |
| ✓ | effekt C: alle stegene har dukket fram etter rullingen |  |
| ✓ | axe: landingsside |  |
| ✓ | bolk 10, landingssiden: «leser» har det samme tusjstrøket som sidetitlene, og overskriften leses som før | {"tusj":[{"ord":"leser","ok":true,"hoeyde":0.48,"sammeBane":true}],"navn":["Forstå mer av det du leser."]} |
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
| ✓ | rotasjon, arbeidsbord 375 px: arket er åpent | {"dialog":true,"oppsett":"ark","harArk":true,"overflow":"hidden","inert":12,"fokusIDialog":true,"tekstIMappe":true} |
| ✓ | rotasjon, arbeidsbord 375 → 1280 px med arket åpent: viften står åpen som vifte, uten har-ark, og resten av siden er fortsatt inert | {"dialog":true,"oppsett":"rundt","harArk":false,"overflow":"visible","inert":12,"fokusIDialog":true,"tekstIMappe":true} |
| ✓ | mobil uten sidelengs rulling: arbeidsbord med åpen vifte etter rotasjon | 1280 px innhold i 1280 px vindu |
| ✓ | rotasjon, arbeidsbord 1280 → 375 px: viften er et ark igjen | {"dialog":true,"oppsett":"ark","harArk":true,"overflow":"hidden","inert":12,"fokusIDialog":true,"tekstIMappe":true} |
| ✓ | rotasjon, arbeidsbord: Esc etter rotasjonene lukker, og ingen inert- eller har-ark-rester står igjen | {"dialog":false,"oppsett":null,"harArk":false,"overflow":"visible","inert":0,"fokusIDialog":false,"tekstIMappe":false} |
| ✓ | rotasjon: ingen skriptfeil i nettleseren |  |
| ✓ | gjennomsyn (pdf, lys): siden vises med redigeringsfeltet | /tekst/5f921a85-6b54-48df-ba5a-77da2c5b3e47/gjennomsyn |
| ✓ | gjennomsyn (pdf, lys): innlesingsrapporten står over feltet |  |
| ✓ | axe: gjennomsyn via pdf (lys) |  |
| ✓ | gjennomsyn (pdf, mørk): siden vises med redigeringsfeltet | /tekst/5f921a85-6b54-48df-ba5a-77da2c5b3e47/gjennomsyn |
| ✓ | gjennomsyn (pdf, mørk): innlesingsrapporten står over feltet |  |
| ✓ | axe: gjennomsyn via pdf (mørk) |  |
| ✓ | gjennomsyn (bilde, lys): siden vises med redigeringsfeltet | /tekst/d449dbdb-9aef-4ebf-bf05-be46246f8180/gjennomsyn |
| ✓ | bolk 10, gjennomsyn (bilde, lys): Buddy (64 px, aria-hidden) ser ned med bekymrede bryn til venstre i merknaden, og teksten er uendret | {"merke":true,"tilVenstre":true,"bryn":true,"brynFarge":"rgb(100, 39, 214)","pupillFarge":"rgb(20, 26, 58)","rammeFarge":"rgb(100, 39, 214)","animasjon":"u-flakk","brynAnimasjon":"u-bryn-v,u-bryn-h","nede":7.00596,"tekst":"Når du laster opp bilder, hender det at Buddy leser feil. Les gjennom teksten under for å se at den er lik teksten du tok bilde av. Rett det som er feil før du går videre."} |
| ✓ | bolk 10, gjennomsyn (bilde, lys): med redusert bevegelse står pupillene nede og brynene stille | {"animasjon":"none","bryn":"none,none","nede":7} |
| ✓ | axe: gjennomsyn via bilde, redusert bevegelse (lys) |  |
| ✓ | axe: gjennomsyn via bilde (lys) |  |
| ✓ | gjennomsyn (bilde, mørk): siden vises med redigeringsfeltet | /tekst/d449dbdb-9aef-4ebf-bf05-be46246f8180/gjennomsyn |
| ✓ | bolk 10, gjennomsyn (bilde, mørk): Buddy (64 px, aria-hidden) ser ned med bekymrede bryn til venstre i merknaden, og teksten er uendret | {"merke":true,"tilVenstre":true,"bryn":true,"brynFarge":"rgb(74, 31, 58)","pupillFarge":"rgb(74, 31, 58)","rammeFarge":"rgb(183, 155, 255)","animasjon":"u-flakk","brynAnimasjon":"u-bryn-v,u-bryn-h","nede":7.00412,"tekst":"Når du laster opp bilder, hender det at Buddy leser feil. Les gjennom teksten under for å se at den er lik teksten du tok bilde av. Rett det som er feil før du går videre."} |
| ✓ | bolk 10, gjennomsyn (bilde, mørk): med redusert bevegelse står pupillene nede og brynene stille | {"animasjon":"none","bryn":"none,none","nede":7} |
| ✓ | axe: gjennomsyn via bilde, redusert bevegelse (mørk) |  |
| ✓ | axe: gjennomsyn via bilde (mørk) |  |
| ✓ | FR-6: gammel tekst viser «Før du leste, skrev du: …» | Før du leste Før du leste, skrev du: Noe om bølger og lys. |
| ✓ | gjennomsyn: prøvetekstene er ryddet bort | 3 av 3 |
| ✓ | PRD §6.4: 5 tekster i dag — /ny viser meldingen før innlesingen, med lenke til arbeidsbordet | Du har lagt inn 5 tekster i dag.Du kan legge inn flere i morgen.Til arbeidsbordet |
| ✓ | axe: ny tekst, grensen er nådd |  |
| ✓ | PRD §6.4: taket er nådd — ny quiz gir takmeldingen i stedet for tenkeindikatoren, og ingen quiz lages | 0 quiz(er) |
| ✓ | axe: quiz, dagstaket er nådd |  |

Det axe-core ikke kan se — om rekkefølgen gir mening, om teksten er forståelig — krever en person. Se også testen på ekte telefon i fremdriftsplanen.
