# Tilgjengelighetssjekk — 2026-11-23

Kjørt med `npm run sjekk:tilgjengelighet`: Chrome, PC (1280 px, lys og mørk modus) og telefon (375 px, berøring), axe-core WCAG 2.1 A/AA.

**435 av 435 sjekker bestått.**

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
| ✓ | FR-6 (23.11): → gir «Mye» (aria-valuetext, det skjermleseren leser) og `kjent` | 0:range «Mye» ; {"merke-1":"kjent"} |
| ✓ | FR-6 (23.11): ← går et trinn tilbake, til «Litt» | 0:range «Litt»  |
| ✓ | FR-6 (23.11): Tab går glider → «Skjønner ikke overskriften» → neste glider → dens knapp | 0:button «Litt» false → 1:range «Ikke merket ennå»  → 1:button «Ikke merket ennå» false |
| ✓ | FR-6 (23.11): «Skjønner ikke overskriften» på: aria-pressed=true, glideren «Satt til side», `uklar` sendes | 1:button «Satt til side» true; {"merke-1":"litt","merke-2":"uklar"} |
| ✓ | FR-6 (23.11): av igjen over en urørt glider: «Ikke merket ennå», og ingenting sendes for overskriften | 1:button «Ikke merket ennå» false; {"merke-1":"litt"} |
| ✓ | FR-6 (23.11): ← etter «Skjønner ikke»: «Ingenting ennå» (`nytt`), og knappen går av | 1:range «Ingenting ennå» , knapp false; {"merke-1":"litt","merke-2":"nytt"} |
| ✓ | FR-6 (23.11): av igjen over en rørt glider: glideren har sin verdi («Ingenting ennå») | 1:button «Ingenting ennå» false |
| ✓ | FR-6 (23.11): knappen på igjen sender `uklar` | {"merke-1":"litt","merke-2":"uklar"} |
| ✓ | FR-6 (23.11): klikk på håndtaket i midten av en urørt glider velger «Litt» | Litt; {"merke-1":"litt","merke-2":"uklar","merke-6":"litt"} |
| ✓ | FR-6: aktiveringen ruller ikke sidelengs på 375 px |  |
| ✓ | overleveringen, 1280 px: avslutningen spilles i et fast kort nederst til høyre (16 px), Buddy 64 px, «Teksten er klar.» | {"posisjon":"fixed","hoeyre":16,"nederst":16,"mini":false,"merke":64,"tekst":"Teksten er klar.","side":{"luft":"0px","hoeyde":4230,"pille":false}} |
| ✓ | overleveringen, 1280 px: siden blir ikke lengre mens kortet vises (ingen luft nederst, ikke har-tenkepille) | {"luft":"0px","hoeyde":4230,"pille":false} / etter {"luft":"0px","hoeyde":4230,"pille":false} |
| ✓ | axe: lesevisning |  |
| ✓ | FR-6: «Før du leste» viser spørsmålet, lenken til fagsamtalen og overskriften eleven ikke skjønte (18.11) | Før du leste Du lurte på: Hvorfor kan vi ikke se radiobølger? Fikk du svar? Sjekk om du kan forklare det med egne ord. Til fagsamtalen Denne overskriften skjønte du ikke: Radiobølger. Gir den mening n |
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
| ✓ | FR-48: hovedbunken har neste steg som egen lenke, rett til steget | «Neste: Ta quizen →» → /tekst/203f9848-f762-481b-8ab9-8b2210e01ac3/quiz |
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
| ✓ | FR-49: tittelen i Samlinger lenker til neste steg | /tekst/203f9848-f762-481b-8ab9-8b2210e01ac3/quiz |
| ✓ | FR-49: søk uten treff sier det, med «Vis alle» |  |
| ✓ | menyen markerer Samlinger som aktiv |  |
| ✓ | overskriften på /samling er «Samlinger» |  |
| ✓ | innlogget (/samling): ingen «Logg inn» eller «For lærere» i topplinjen |  |
| ✓ | FR-50: Samlinger har «Mappene dine» øverst |  |
| ✓ | axe: mappe uten tekster |  |
| ✓ | FR-50: teksten ligger i mappen |  |
| ✓ | axe: mappe |  |
| ✓ | axe: mappe: øvekort |  |
| ✓ | axe: mappe: quiz, valg av lengde |  |
| ✓ | axe: mappe: quiz, kort |  |
| ✓ | FR-51: kildeavsnittet i mappen lenker til kortets egen tekst | /tekst/203f9848-f762-481b-8ab9-8b2210e01ac3/lesing#avsnitt-3 |
| ✓ | FR-51: et kort merket «Har kontroll» i mappen står som merket i teksten |  |
| ✓ | FR-50: arbeidsbordet lenker til «Mappene dine» |  |
| ✓ | axe: registrering (mørk) |  |
| ✓ | axe: arbeidsbord (mørk) |  |
| ✓ | axe: samling (mørk) |  |
| ✓ | axe: ny tekst (mørk) |  |
| ✓ | mørk: overskriftskontroll (3a) omdirigert, sjekkes ikke her | /tekst/203f9848-f762-481b-8ab9-8b2210e01ac3/aktivering |
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
| ✓ | axe: arbeidsbord med åpen vifte (mørk) |  |
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
| ✓ | temavalg (uten JavaScript): etter «Lagre» er «Mørk» valgt og statusen sier «Lagret: Mørk.» | valgt moerk, adresse /konto?lagret=utseende&n=1795444346409 |
| ✓ | temavalg (uten JavaScript): ny innlasting av /konto viser «Mørk» valgt, uten gammel melding | valgt moerk, 0 meldinger |
| ✓ | temavalg (uten JavaScript): «Mørk» + «Lagre» gir tema=moerk (SameSite=Lax, ett år) og mørk side | moerk, Lax, 365 dager, rgb(15, 18, 38) |
| ✓ | temavalg (uten JavaScript): andre sider er også mørke |  |
| ✓ | temavalg (uten JavaScript): «Følg enheten» sletter informasjonskapselen og følger systemet igjen | {"tema":null,"skjema":"light dark","bakgrunn":"rgb(255, 245, 247)","darkKlasse":"rgb(90, 86, 112)"} |
| ✓ | bolk 9 (høyrehendt, lys): HTML-en fra serveren har ikke data-hand="venstre" | <html lang="nb"> |
| ✓ | bolk 9, 375 px (høyrehendt, lys): «Må øve mer» over «Har kontroll» over kortet til høyre, like brede, og pilknappene ved siden av hverandre under | {"hand":null,"kort":{"v":16,"h":359,"t":413,"b":641,"w":343,"hoeyde":228},"maa":{"v":226,"h":359,"t":293,"b":341,"w":133,"hoeyde":48},"kan":{"v":226,"h":359,"t":353,"b":401,"w":133,"hoeyde":48},"forrige":{"v":16,"h":182,"t":665,"b":713,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":665,"b":713,"w":166,"hoeyde":48},"pressed":["false","false"]} |
| ✓ | bolk 9 (høyrehendt, lys): Tab etter kortet går «Må øve mer» → «Har kontroll» → «Forrige kort» → «Neste kort» | Må øve mer \| Har kontroll \| Forrige kort \| Neste kort |
| ✓ | bolk 9 (høyrehendt, lys): snudd kort, Tab går «Må øve mer» → «Har kontroll» → «Se hvor det står i teksten» → «Forrige kort» | Må øve mer \| Har kontroll \| Se hvor det står i teksten \| Forrige kort |
| ✓ | mobil uten sidelengs rulling: øvekort 375 px (høyrehendt, lys) | 375 px innhold i 375 px vindu |
| ✓ | axe: øvekort 375 px (høyrehendt, lys) |  |
| ✓ | bolk 9, 320 px (høyrehendt, lys): samme plassering | {"hand":null,"kort":{"v":16,"h":304,"t":485,"b":713,"w":288,"hoeyde":228},"maa":{"v":171,"h":304,"t":365,"b":413,"w":133,"hoeyde":48},"kan":{"v":171,"h":304,"t":425,"b":473,"w":133,"hoeyde":48},"forrige":{"v":16,"h":154,"t":737,"b":785,"w":138,"hoeyde":48},"neste":{"v":166,"h":304,"t":737,"b":785,"w":138,"hoeyde":48},"pressed":["false","false"]} |
| ✓ | mobil uten sidelengs rulling: øvekort 320 px (høyrehendt, lys) | 320 px innhold i 320 px vindu |
| ✓ | bolk 9, 320 px, 200 % tekst (høyrehendt, lys): samme plassering | {"hand":null,"kort":{"v":32,"h":288,"t":1319,"b":1771,"w":256,"hoeyde":452},"maa":{"v":32,"h":288,"t":991,"b":1131,"w":256,"hoeyde":140},"kan":{"v":32,"h":288,"t":1155,"b":1295,"w":256,"hoeyde":140},"forrige":{"v":32,"h":148,"t":1819,"b":1911,"w":116,"hoeyde":92},"neste":{"v":172,"h":288,"t":1819,"b":1911,"w":116,"hoeyde":92},"pressed":["false","false"]} |
| ✓ | mobil uten sidelengs rulling: øvekort 320 px, 200 % tekst (høyrehendt, lys) | 327 px innhold i 327 px vindu |
| ✓ | bolk 9 (høyrehendt, mørk): HTML-en fra serveren har ikke data-hand="venstre" | <html lang="nb"> |
| ✓ | bolk 9, 375 px (høyrehendt, mørk): «Må øve mer» over «Har kontroll» over kortet til høyre, like brede, og pilknappene ved siden av hverandre under | {"hand":null,"kort":{"v":16,"h":359,"t":413,"b":641,"w":343,"hoeyde":228},"maa":{"v":226,"h":359,"t":293,"b":341,"w":133,"hoeyde":48},"kan":{"v":226,"h":359,"t":353,"b":401,"w":133,"hoeyde":48},"forrige":{"v":16,"h":182,"t":665,"b":713,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":665,"b":713,"w":166,"hoeyde":48},"pressed":["false","false"]} |
| ✓ | bolk 9 (høyrehendt, mørk): Tab etter kortet går «Må øve mer» → «Har kontroll» → «Forrige kort» → «Neste kort» | Må øve mer \| Har kontroll \| Forrige kort \| Neste kort |
| ✓ | bolk 9 (høyrehendt, mørk): snudd kort, Tab går «Må øve mer» → «Har kontroll» → «Se hvor det står i teksten» → «Forrige kort» | Må øve mer \| Har kontroll \| Se hvor det står i teksten \| Forrige kort |
| ✓ | mobil uten sidelengs rulling: øvekort 375 px (høyrehendt, mørk) | 375 px innhold i 375 px vindu |
| ✓ | axe: øvekort 375 px (høyrehendt, mørk) |  |
| ✓ | bolk 9, 320 px (høyrehendt, mørk): samme plassering | {"hand":null,"kort":{"v":16,"h":304,"t":485,"b":713,"w":288,"hoeyde":228},"maa":{"v":171,"h":304,"t":365,"b":413,"w":133,"hoeyde":48},"kan":{"v":171,"h":304,"t":425,"b":473,"w":133,"hoeyde":48},"forrige":{"v":16,"h":154,"t":737,"b":785,"w":138,"hoeyde":48},"neste":{"v":166,"h":304,"t":737,"b":785,"w":138,"hoeyde":48},"pressed":["false","false"]} |
| ✓ | mobil uten sidelengs rulling: øvekort 320 px (høyrehendt, mørk) | 320 px innhold i 320 px vindu |
| ✓ | bolk 9, 320 px, 200 % tekst (høyrehendt, mørk): samme plassering | {"hand":null,"kort":{"v":32,"h":288,"t":1319,"b":1771,"w":256,"hoeyde":452},"maa":{"v":32,"h":288,"t":991,"b":1131,"w":256,"hoeyde":140},"kan":{"v":32,"h":288,"t":1155,"b":1295,"w":256,"hoeyde":140},"forrige":{"v":32,"h":148,"t":1819,"b":1911,"w":116,"hoeyde":92},"neste":{"v":172,"h":288,"t":1819,"b":1911,"w":116,"hoeyde":92},"pressed":["false","false"]} |
| ✓ | mobil uten sidelengs rulling: øvekort 320 px, 200 % tekst (høyrehendt, mørk) | 327 px innhold i 327 px vindu |
| ✓ | bolk 9 (venstrehendt, lys): HTML-en fra serveren har data-hand="venstre" | <html lang="nb" data-hand="venstre"> |
| ✓ | bolk 9, 375 px (venstrehendt, lys): «Må øve mer» over «Har kontroll» over kortet til venstre, like brede, og pilknappene ved siden av hverandre under | {"hand":"venstre","kort":{"v":16,"h":359,"t":413,"b":641,"w":343,"hoeyde":228},"maa":{"v":16,"h":149,"t":293,"b":341,"w":133,"hoeyde":48},"kan":{"v":16,"h":149,"t":353,"b":401,"w":133,"hoeyde":48},"forrige":{"v":16,"h":182,"t":665,"b":713,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":665,"b":713,"w":166,"hoeyde":48},"pressed":["false","false"]} |
| ✓ | bolk 9 (venstrehendt, lys): Tab etter kortet går «Må øve mer» → «Har kontroll» → «Forrige kort» → «Neste kort» | Må øve mer \| Har kontroll \| Forrige kort \| Neste kort |
| ✓ | bolk 9 (venstrehendt, lys): snudd kort, Tab går «Må øve mer» → «Har kontroll» → «Se hvor det står i teksten» → «Forrige kort» | Må øve mer \| Har kontroll \| Se hvor det står i teksten \| Forrige kort |
| ✓ | mobil uten sidelengs rulling: øvekort 375 px (venstrehendt, lys) | 375 px innhold i 375 px vindu |
| ✓ | axe: øvekort 375 px (venstrehendt, lys) |  |
| ✓ | bolk 9, 320 px (venstrehendt, lys): samme plassering | {"hand":"venstre","kort":{"v":16,"h":304,"t":485,"b":713,"w":288,"hoeyde":228},"maa":{"v":16,"h":149,"t":365,"b":413,"w":133,"hoeyde":48},"kan":{"v":16,"h":149,"t":425,"b":473,"w":133,"hoeyde":48},"forrige":{"v":16,"h":154,"t":737,"b":785,"w":138,"hoeyde":48},"neste":{"v":166,"h":304,"t":737,"b":785,"w":138,"hoeyde":48},"pressed":["false","false"]} |
| ✓ | mobil uten sidelengs rulling: øvekort 320 px (venstrehendt, lys) | 320 px innhold i 320 px vindu |
| ✓ | bolk 9, 320 px, 200 % tekst (venstrehendt, lys): samme plassering | {"hand":"venstre","kort":{"v":32,"h":288,"t":1319,"b":1771,"w":256,"hoeyde":452},"maa":{"v":32,"h":288,"t":991,"b":1131,"w":256,"hoeyde":140},"kan":{"v":32,"h":288,"t":1155,"b":1295,"w":256,"hoeyde":140},"forrige":{"v":32,"h":148,"t":1819,"b":1911,"w":116,"hoeyde":92},"neste":{"v":172,"h":288,"t":1819,"b":1911,"w":116,"hoeyde":92},"pressed":["false","false"]} |
| ✓ | mobil uten sidelengs rulling: øvekort 320 px, 200 % tekst (venstrehendt, lys) | 327 px innhold i 327 px vindu |
| ✓ | bolk 9 (venstrehendt, mørk): HTML-en fra serveren har data-hand="venstre" | <html lang="nb" data-hand="venstre"> |
| ✓ | bolk 9, 375 px (venstrehendt, mørk): «Må øve mer» over «Har kontroll» over kortet til venstre, like brede, og pilknappene ved siden av hverandre under | {"hand":"venstre","kort":{"v":16,"h":359,"t":413,"b":641,"w":343,"hoeyde":228},"maa":{"v":16,"h":149,"t":293,"b":341,"w":133,"hoeyde":48},"kan":{"v":16,"h":149,"t":353,"b":401,"w":133,"hoeyde":48},"forrige":{"v":16,"h":182,"t":665,"b":713,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":665,"b":713,"w":166,"hoeyde":48},"pressed":["false","false"]} |
| ✓ | bolk 9 (venstrehendt, mørk): Tab etter kortet går «Må øve mer» → «Har kontroll» → «Forrige kort» → «Neste kort» | Må øve mer \| Har kontroll \| Forrige kort \| Neste kort |
| ✓ | bolk 9 (venstrehendt, mørk): snudd kort, Tab går «Må øve mer» → «Har kontroll» → «Se hvor det står i teksten» → «Forrige kort» | Må øve mer \| Har kontroll \| Se hvor det står i teksten \| Forrige kort |
| ✓ | mobil uten sidelengs rulling: øvekort 375 px (venstrehendt, mørk) | 375 px innhold i 375 px vindu |
| ✓ | axe: øvekort 375 px (venstrehendt, mørk) |  |
| ✓ | bolk 9, 320 px (venstrehendt, mørk): samme plassering | {"hand":"venstre","kort":{"v":16,"h":304,"t":485,"b":713,"w":288,"hoeyde":228},"maa":{"v":16,"h":149,"t":365,"b":413,"w":133,"hoeyde":48},"kan":{"v":16,"h":149,"t":425,"b":473,"w":133,"hoeyde":48},"forrige":{"v":16,"h":154,"t":737,"b":785,"w":138,"hoeyde":48},"neste":{"v":166,"h":304,"t":737,"b":785,"w":138,"hoeyde":48},"pressed":["false","false"]} |
| ✓ | mobil uten sidelengs rulling: øvekort 320 px (venstrehendt, mørk) | 320 px innhold i 320 px vindu |
| ✓ | bolk 9, 320 px, 200 % tekst (venstrehendt, mørk): samme plassering | {"hand":"venstre","kort":{"v":32,"h":288,"t":1319,"b":1771,"w":256,"hoeyde":452},"maa":{"v":32,"h":288,"t":991,"b":1131,"w":256,"hoeyde":140},"kan":{"v":32,"h":288,"t":1155,"b":1295,"w":256,"hoeyde":140},"forrige":{"v":32,"h":148,"t":1819,"b":1911,"w":116,"hoeyde":92},"neste":{"v":172,"h":288,"t":1819,"b":1911,"w":116,"hoeyde":92},"pressed":["false","false"]} |
| ✓ | mobil uten sidelengs rulling: øvekort 320 px, 200 % tekst (venstrehendt, mørk) | 327 px innhold i 327 px vindu |
| ✓ | bolk 9: hand=hoeyre ignoreres, og merkeknappene står til høyre | {"hand":null,"kort":{"v":16,"h":359,"t":413,"b":641,"w":343,"hoeyde":228},"maa":{"v":226,"h":359,"t":293,"b":341,"w":133,"hoeyde":48},"kan":{"v":226,"h":359,"t":353,"b":401,"w":133,"hoeyde":48},"forrige":{"v":16,"h":182,"t":665,"b":713,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":665,"b":713,"w":166,"hoeyde":48},"pressed":["false","false"]} |
| ✓ | bolk 2b: pilknappene heter «Forrige kort» og «Neste kort» (eller «Ferdig» på siste) og er minst 44 × 44 px | {"bf":{"x":16,"y":664.59375,"width":165.5,"height":48},"bn":{"x":193.5,"y":664.59375,"width":165.5,"height":48}} |
| ✓ | bolk 2b: «Tilbake til mappen» står én gang øverst i headeren, over overskriften, minst 44 px høy, og lenker til mappen | {"bt":{"x":16,"y":105,"width":163.671875,"height":44},"href":"/mappe/ee375d3d-3012-4157-b8c8-0da6f4e4738f"} |
| ✓ | bolk 2b: «Tilbake til oppgavene» står én gang øverst i headeren, over overskriften, minst 44 px høy, og lenker til oppgavene | {"bt":{"x":16,"y":105,"width":185.40625,"height":44},"href":"/tekst/203f9848-f762-481b-8ab9-8b2210e01ac3/oppgaver"} |
| ✓ | bolk 2b: ← (ikke på første), → (forsiden opp), mellomrom (én gang, også på kortet), ikke i skjemafelt, ikke med Ctrl, og → på siste avslutter runden | {"start":1,"antall":8,"venstrePaaFoerste":1,"mellomromSnur":true,"mellomromSnurTilbake":true,"hoeyre":2,"forsidenOpp":true,"venstre":1,"ctrl":1,"paaKortet":true,"paaSummary":true,"iFeltet":true,"ferdig":true} |
| ✓ | venstrehendt (med JavaScript): «Venstrehendt» er en avkrysningsboks i en fieldset med legend, ikke valgt |  |
| ✓ | venstrehendt (med JavaScript): «Lagre»-knappene har ulike navn, og hjelpetekstene er koblet til valgene | {"knapper":["Lagre","Lagre utseendet","Lagre valget for øvekortene"],"hjelp":"«Må øve mer» og «Har kontroll» står til venstre over kortet, så de er lette å nå med venstre tommel. Valget gjelder denne enheten.","hjelpIFieldset":true,"tema":"Valget gjelder denne enheten. «Følg enheten» bruker lys eller mørk modus etter innstillingen på telefonen eller PC-en."} |
| ✓ | venstrehendt (med JavaScript): kryss + «Lagre» gir hand=venstre (SameSite=Lax, httpOnly, ett år), og boksen er krysset | venstre, Lax, 365 dager |
| ✓ | axe: konto med «Venstrehendt» valgt |  |
| ✓ | venstrehendt (med JavaScript): øvekortene har merkeknappene til venstre etter lagring | {"hand":"venstre","kort":{"v":16,"h":359,"t":413,"b":641,"w":343,"hoeyde":228},"maa":{"v":16,"h":149,"t":293,"b":341,"w":133,"hoeyde":48},"kan":{"v":16,"h":149,"t":353,"b":401,"w":133,"hoeyde":48},"forrige":{"v":16,"h":182,"t":665,"b":713,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":665,"b":713,"w":166,"hoeyde":48},"pressed":["false","false"]} |
| ✓ | venstrehendt (med JavaScript): uten kryss + «Lagre» slettes informasjonskapselen |  |
| ✓ | venstrehendt (uten JavaScript): «Venstrehendt» er en avkrysningsboks i en fieldset med legend, ikke valgt |  |
| ✓ | venstrehendt (uten JavaScript): «Lagre»-knappene har ulike navn, og hjelpetekstene er koblet til valgene | {"knapper":["Lagre","Lagre utseendet","Lagre valget for øvekortene"],"hjelp":"«Må øve mer» og «Har kontroll» står til venstre over kortet, så de er lette å nå med venstre tommel. Valget gjelder denne enheten.","hjelpIFieldset":true,"tema":"Valget gjelder denne enheten. «Følg enheten» bruker lys eller mørk modus etter innstillingen på telefonen eller PC-en."} |
| ✓ | venstrehendt (uten JavaScript): kryss + «Lagre» gir hand=venstre (SameSite=Lax, httpOnly, ett år), og boksen er krysset | venstre, Lax, 365 dager |
| ✓ | venstrehendt (uten JavaScript): øvekortene har merkeknappene til venstre etter lagring | {"hand":"venstre","kort":{"v":16,"h":359,"t":413,"b":641,"w":343,"hoeyde":228},"maa":{"v":16,"h":149,"t":293,"b":341,"w":133,"hoeyde":48},"kan":{"v":16,"h":149,"t":353,"b":401,"w":133,"hoeyde":48},"forrige":{"v":16,"h":182,"t":665,"b":713,"w":166,"hoeyde":48},"neste":{"v":194,"h":359,"t":665,"b":713,"w":166,"hoeyde":48},"pressed":["false","false"]} |
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
| ✓ | bolk 6, 375 px: viften er et ark nederst, med fem rader, og arket og «Legg sammen» er innenfor skjermen | {"oppsett":"ark","posisjon":"fixed","arkInne":true,"lukkInne":true,"andel":66,"ruller":false,"siden":false,"rader":5} |
| ✓ | bolk 6, 375 px: arket er høyst 90 % av skjermen, og siden under ruller ikke | 66 % |
| ✓ | bolk 6, arket: fokus på den første raden |  |
| ✓ | bolk 6, arket: Tab og Shift+Tab holder fokus i arket | 0 av 11 trykk gikk ut |
| ✓ | mobil uten sidelengs rulling: arbeidsbord med åpent ark | 375 px innhold i 375 px vindu |
| ✓ | axe: arbeidsbord med åpent ark (telefon) |  |
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
| ✓ | overleveringen: en omdirigering til ?fagordfeil gir ingen avslutning | /tekst/f80178fd-9bac-4c9a-bf3d-652b187d4f50/lesing?fagordfeil=lagret_svar_mangler, verten sett false |
| ✓ | overleveringen: verten har én statusregion, tom før noe venter | {"antall":1,"tekst":""} |
| ✓ | overleveringen: en venting som ender med feil, gir ingen avslutning noe sted | {"antall":1,"tekst":""} |
| ✓ | overleveringen, 375 px: «Videre» på en innlimt tekst gir avslutningen på lesevisningen | /tekst/2f5f62c5-3ce4-43ea-af8f-a02aa6451d08/lesing |
| ✓ | overleveringen, 375 px: pillen ligger fast nederst med mini-Buddy (28 px) som spiller avslutningen, og statusregionen sier «Teksten er klar.» | {"posisjon":"fixed","innenfor":true,"mini":true,"slutt":true,"merke":28,"regioner":1,"regionTekst":"Teksten er klar.","fokusIPillen":false,"variabel":"52px","hoeyde":52,"klasse":true} |
| ✓ | overleveringen: pillen teller med i --tenker-pille og har-tenkepille, og fokus er ikke flyttet til den | 52px / 52px |
| ✓ | axe: lesevisning med avslutningen i pillen (telefon) |  |
| ✓ | overleveringen: pillen står gjennom avslutningen (4,5–5,9 s), er så borte, og html har ikke lenger har-tenkepille | 5215 ms, {"antall":1,"tekst":""} |
| ✓ | overleveringen: «Prøv igjen» med ?fagordfeil lykkes, adressen er uten fagordfeil, og verten sier «Fagordene er klare.» | /tekst/2f5f62c5-3ce4-43ea-af8f-a02aa6451d08/lesing {"antall":1,"tekst":"Fagordene er klare."} |
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
| ✓ | rotasjon, arbeidsbord 375 px: arket er åpent | {"dialog":true,"oppsett":"ark","harArk":true,"overflow":"hidden","inert":12,"fokusIDialog":true} |
| ✓ | rotasjon, arbeidsbord 375 → 1280 px med arket åpent: viften står åpen som vifte, uten har-ark, og resten av siden er fortsatt inert | {"dialog":true,"oppsett":"rundt","harArk":false,"overflow":"visible","inert":12,"fokusIDialog":true} |
| ✓ | mobil uten sidelengs rulling: arbeidsbord med åpen vifte etter rotasjon | 1280 px innhold i 1280 px vindu |
| ✓ | rotasjon, arbeidsbord 1280 → 375 px: viften er et ark igjen | {"dialog":true,"oppsett":"ark","harArk":true,"overflow":"hidden","inert":12,"fokusIDialog":true} |
| ✓ | rotasjon, arbeidsbord: Esc etter rotasjonene lukker, og ingen inert- eller har-ark-rester står igjen | {"dialog":false,"oppsett":null,"harArk":false,"overflow":"visible","inert":0,"fokusIDialog":false} |
| ✓ | rotasjon: ingen skriptfeil i nettleseren |  |
| ✓ | gjennomsyn (pdf, lys): siden vises med redigeringsfeltet | /tekst/429f4980-9a1e-4c06-9814-308d701f49cc/gjennomsyn |
| ✓ | gjennomsyn (pdf, lys): innlesingsrapporten står over feltet |  |
| ✓ | axe: gjennomsyn via pdf (lys) |  |
| ✓ | gjennomsyn (pdf, mørk): siden vises med redigeringsfeltet | /tekst/429f4980-9a1e-4c06-9814-308d701f49cc/gjennomsyn |
| ✓ | gjennomsyn (pdf, mørk): innlesingsrapporten står over feltet |  |
| ✓ | axe: gjennomsyn via pdf (mørk) |  |
| ✓ | gjennomsyn (bilde, lys): siden vises med redigeringsfeltet | /tekst/da889f1a-c755-4279-9b99-6ab29c51ed03/gjennomsyn |
| ✓ | bolk 10, gjennomsyn (bilde, lys): Buddy (64 px, aria-hidden) ser ned med bekymrede bryn til venstre i merknaden, og teksten er uendret | {"merke":true,"tilVenstre":true,"bryn":true,"brynFarge":"rgb(100, 39, 214)","pupillFarge":"rgb(20, 26, 58)","rammeFarge":"rgb(100, 39, 214)","animasjon":"u-flakk","brynAnimasjon":"u-bryn-v,u-bryn-h","nede":7.00816,"tekst":"Når du laster opp bilder, hender det at Buddy leser feil. Les gjennom teksten under for å se at den er lik teksten du tok bilde av. Rett det som er feil før du går videre."} |
| ✓ | bolk 10, gjennomsyn (bilde, lys): med redusert bevegelse står pupillene nede og brynene stille | {"animasjon":"none","bryn":"none,none","nede":7} |
| ✓ | axe: gjennomsyn via bilde, redusert bevegelse (lys) |  |
| ✓ | axe: gjennomsyn via bilde (lys) |  |
| ✓ | gjennomsyn (bilde, mørk): siden vises med redigeringsfeltet | /tekst/da889f1a-c755-4279-9b99-6ab29c51ed03/gjennomsyn |
| ✓ | bolk 10, gjennomsyn (bilde, mørk): Buddy (64 px, aria-hidden) ser ned med bekymrede bryn til venstre i merknaden, og teksten er uendret | {"merke":true,"tilVenstre":true,"bryn":true,"brynFarge":"rgb(74, 31, 58)","pupillFarge":"rgb(74, 31, 58)","rammeFarge":"rgb(183, 155, 255)","animasjon":"u-flakk","brynAnimasjon":"u-bryn-v,u-bryn-h","nede":7.00816,"tekst":"Når du laster opp bilder, hender det at Buddy leser feil. Les gjennom teksten under for å se at den er lik teksten du tok bilde av. Rett det som er feil før du går videre."} |
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
