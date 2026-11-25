---
title: Beslutningslogg for PRD-en
created: 2026-11-25
---

# Beslutningslogg for PRD-en

Her står historikken, begrunnelsene og måleresultatene som ble tatt ut av kravene i `prd-lesevenn.md` i runde 2 (25.11.2026), etter Bårds tilbakemelding (`tilbakemelding-prd.md` §4.2). PRD-en sier hva som skal virke; denne filen sier hvorfor det ble slik, og hva som ble prøvd og forkastet på veien.

Teksten er nesten ordrett fra PRD-en slik den så ut før runde 2 (commit `1ce6de3`, 1151 linjer). Linjenumrene i loggen viser til den versjonen. Gjeldende status og måleresultater per krav står i PRD-en §9.6. FR-38 til FR-43 heter nå DK-1 til DK-6 (§13).

Loggen er delt etter hvor i PRD-en teksten sto, og innenfor hver del per krav, i datorekkefølge.

## Runde 2 (25.11.2026): endringer i hva kravene sier

Det meste i runde 2 er flytting. Disse punktene endret likevel hva PRD-en sier, etter gjennomgangene i `reviews/prd-runde-2/` (rubrikk, troskap, adversarisk). Valg merket «Arve» er tatt av utvikleren; resten er rettinger av faktafeil eller motsigelser.

- **FR-8, Gullsett Faguttrykk:** de to tabellene hadde ulike ordtall, og tekst 3 het «Lyriske virkemidler ~500 ord». Rettet til tallene i `testdata/gullsett/*.meta.json` (som målingen bruker), og tekst 3 er nå den sammensatte teksten «Språklige bilder: metafor, allegori og allusjon» (1 175 ord). Budsjettene ble 9, 7, 14, 7, 7 og 8, som i resultatfilene.
- **FR-8, FR-14, FR-31, SM-2, SM-7 (Arve):** «null i det som vises eleven» er skrevet om til «null i Gullsettet», med én setning om restrisikoen. Quizen og forklaringene lages fra elevens egen tekst, så det kan ikke utvikleren ha sett.
- **FR-8 og §11 pkt. 9 og 17 (Arve):** `[ÅPENT]`-merket om budsjettet er lukket. Taket i FR-7 og tersklene beholdes; annoteringen ligger innenfor budsjettet, og utviklerens samsvar med seg selv (0,62) er under tersklene.
- **§9.6 og §10 (Arve):** SM-2, SM-3 og SM-8 står som ikke nådd, med hva det betyr for eleven. Tersklene er ikke flyttet. SM-10 er ikke gjort ennå og er planlagt før levering.
- **FR-54 Bruksgrenser (Arve):** nytt krav som beskriver det som ble bygget 16.11 (grensene i §6.4). BF-6 og BF-7 er lagt til i FR-44, og bildeinnlesingen har dermed sju navngitte feiltilstander.
- **FR-28:** «ikke består begrepsankeret **og** den eksterne vurderingen» er rettet til **eller**; med «og» holdt det å bestå én av dem. Tilbakeoversettelsen og «andre maskinoversettelsesverktøy» er skilt i to setninger.
- **FR-30:** at eleven kan be om Suno-prompten, er gjort betinget («Når Suno-prompten tilbys …»), fordi den er satt på pause. Den gamle teksten motsa pausen.
- **FR-7:** «Kildeavsnittet er brødtekst, aldri en overskrift» er lagt til. Det er det koden og prompt v4 gjør (kodefunn 23).
- **FR-6:** «Åpnes Aktiveringen igjen etter at Teksten er låst, vises spørsmålet og overskriftene med elevens merke, uten skjema» er tatt inn igjen. Den sto før bare i et endringsnotat.
- **FR-48:** «Lukkes bunken, går fokus tilbake til bunkens knapp» er tatt inn igjen.
- **FR-44 og §6.2:** «Bildene lagres ikke etter at uttrekket er godkjent» er rettet til «lagres aldri (AD-16)», som er det koden gjør.
- **DK-5 og §12 pkt. 8:** Gullsett Faguttrykk har ingen yrkesfagtekst (programfagtekstene er Teknologiforståelse), så yrkesfaghypotesen er uprøvd i v1. Kravet til rapporten sier det nå.
- **§9.1–9.3:** FR-11, FR-37 og FR-46 er lagt i M0, FR-12 i M1, og FR-53 og FR-54 i slakken (Bård §4.5). FR-53 kan ikke kuttes, fordi behandlingsgrunnlaget i §6.2 henger på det. §9.2 krever fortsatt bare én dokumentert forbedring i Promptregisteret.
- **§9.6 (ny):** statustabellen er også terskeltabellen DK-3 krever. DK-2 og DK-3 står som delvis: forbedringen v2 → v3 ligger innenfor spredningen, og FR-2 (20 sekunder) og FR-11 er ikke målt slik kravene sier.

### Til refleksjonsrapporten

Den gamle PRD-en sa at disse punktene hører hjemme i rapporten. De står nå i loggen under kravene de kom fra:

- At tilgang til én person avgjør hva prosjektet kan påstå om oversettelsen (§4.7).
- Den kontrafaktiske testen i FR-21.
- Hvorfor FR-39 (DK-2) ble omformulert 8. oktober.
- At prosjektet er bygget av én person, som rammebetingelse (§11 pkt. 2).
- Talebasert fagsamtale som videreføring (§8.2).
- Avviket mellom Råtekst og redigert tekst for bilder som spor (FR-45).
- Tersklene i FR-8 mot annoteringsstøyen (0,62), og bruddene i SM-2, SM-3 og SM-8 (§9.6).

## Del 1: §0–§4.2 (om dokumentet, visjon, brukere, ordliste, FR-1–FR-6, FR-44, FR-45)
Teksten under er tatt ut av kravteksten i runde 2 (25.11.2026). Nesten ordrett, med hvor den kom fra.

### §0 Om dette dokumentet
- **Begrunnelse** (avsnitt 1) — «Dokumentet er skrevet for én leser: utvikleren som skal bygge Lesevenn alene i løpet av høstsemesteret 2026 …» Strammet til «skrevet for utvikleren som bygger Lesevenn alene høsten 2026». Innholdet er det samme.
- **Erstattet** (avsnitt 2, strukturbeskrivelsen) — «Strukturen er: ordlisten i §3 fastsetter vokabularet, funksjonene i §4 er gruppert med globalt nummererte funksjonskrav (FR-1 til FR-53, der FR-32 til FR-34 er trukket tilbake og ikke gjenbrukes — se §4.9) nestet under seg, og tverrgående krav ligger samlet i §5 og §6. Antakelser er merket `[ANTAKELSE]` der de står og samlet i §12.» Erstattet av ny strukturbeskrivelse med §13 (DK-1 til DK-6), FR-46 i §4.11 «Kjørbarhet», §9.6 og `beslutningslogg-prd.md`.
- **Begrunnelse** (avsnitt 3, mappevurderingen) — «Det er nesten en tredjedel av karakteren som ikke er kode, og formuleringen sier *koden* — ikke bare det KI-genererte innholdet appen produserer. Dokumentasjonsleveransen er derfor modellert som en funksjonsseksjon med egne krav (§4.11), på linje med resten, og milepælsplanen i §9 verner tid til den.» Henvisningen er endret fra §4.11 til §13.
- **Begrunnelse** (avsnitt 4, Gullsett-regelen) — «En regel går igjen i hele dokumentet og er verdt å lese først: …» og «Derfor definerer §4.3, §4.4, §4.6 og §4.7 hvert sitt Gullsett med tallfestede terskler, og de samme gullsettene er råstoffet i §4.11. Det er samme arbeid brukt to ganger — én gang for å gjøre appen god, én gang for å vise at den er det.» §4.8 (Gullsett Minnevers, FR-31) er lagt til i listen, og §4.11 er endret til §13.

### §1 Visjon
- Bare tankestreker skrevet om til komma eller punktum. Ingenting flyttet.

### §2.1 Jobber som skal gjøres
- **Erstattet** (Utvikleren) — «Levere en app som virker, og en dokumentasjon som viser hvordan KI ble brukt i utviklingen og hvordan koden og det KI-genererte innholdet ble kvalitetssikret. Begge deler vurderes, med henholdsvis 70 og 30 prosents vekt.» Rettet slik at vektingen stemmer med §0 (70 prosent kode, funksjonalitet og dokumentasjon; 30 prosent refleksjonsrapport). Se notater-A.md.
- «Kunne forklare stoffet med egne ord — ferdigheten prøven faktisk måler.» Tankestrek skrevet om.

### §2.3 Brukerreiser
- **UJ-1, Aktivering (utgått beskrivelse)** — «Aktiveringssiden viser de samme overskriftene og ber han skrive kort hva han tror teksten handler om; brødteksten har han ennå ikke sett. Han skriver tre setninger, og de er halvveis feil, men det er poenget.» Beskrev det frie feltet som FR-6 erstattet 17.11.2026. Skrevet om til merking med glideren og et spørsmål.
- **UJ-1, Kanttilfelle** — «… og Lesevenn sa det rett ut — at filen ser ut til å være et bilde av en tekst, at Lesevenn ikke kan lese bilder, og at han kan lime inn teksten i stedet.» «Ikke kan lese bilder» motsa FR-44. Rettet etter PF-1: Lesevenn leser ikke bilder inne i en PDF, og han kan ta bilder av sidene eller lime inn.
- **UJ-1** — «… og for de to feil får han se hvilket avsnitt svaret sto i.» Nå «Kildeavsnittet». «fjorten fagbegreper» er nå «fjorten Faguttrykk».
- **UJ-2** — «Hun skriver forkunnskapene sine på norsk, fordi det er norsk hun øver på.» Nå: merker hva hun kan fra før og skriver spørsmålet sitt på norsk (FR-6).
- **UJ-4** — «Hun kontrollerer overskriftene i første steg, skriver forkunnskapene sine, og får så …» Nå «merker hva hun kan fra før» (FR-6).
- UJ-1 til UJ-4: «fagbegreper/fagbegrepene» er byttet til «Faguttrykk», «quizen/fagsamtalen» til «Quizen/Fagsamtalen» (ordlistetermer).

### §3 Ordliste
- **19.11.2026** (Mappe) — «*Endret 19. november: før det var termen «to eller flere Tekster med én felles Quiz eller Fagsamtale», utsatt til etter v1. Samlet Fagsamtale er fortsatt ute.*» Gjeldende regel står i presens: «Har ingen samlet Fagsamtale (§8.2).»
- **Begrunnelse** (Faguttrykk) — «— begge programområder er målgruppe, og et uttrykk er ikke mindre et Faguttrykk fordi det hører i et verksted framfor et laboratorium.»
- **Utgått definisjon** (Aktivering) — «første steg: overskriftene vises, og eleven skriver kort hva teksten sannsynligvis handler om, før brødteksten er tilgjengelig.» Motsa FR-6 etter 17.11.2026. Ny definisjon følger FR-5 og FR-6.
- **Utvidet** (Tekst) — «enten limt inn eller hentet ut fra en PDF». Bilder av boksider (FR-44) manglet.
- **Utvidet** (Råtekst) — «etter innliming eller PDF-uttrekk … fordi avviket mellom de to er dokumentasjon på hvor godt uttrekket virket.» Bildeuttrekk lagt til; begrunnelsen strammet.
- **Utvidet** (Kvalitetssikret språk) — «mot Gullsettet i §4.7» er nå «mot Gullsett Oversettelse (FR-28)».
- **Utvidet** (Gullsett) — «et testsett utvikleren har annotert manuelt, som KI-utdata måles mot. Hver måleterskel i dokumentet peker til et Gullsett.» Faste navn lagt til.
- **Nye termer** — Avsnitt, Samlet øving, Samlet quiz, Arbeidsbord, Samlinger, Buddy. Ingenting flyttet ut.

### §4.1 Innlesing av tekst (beskrivelsen)
- **Begrunnelse** — «Det er det viktigste designvalget i hele funksjonen. PDF-uttrekk feiler på mange måter, og noen av dem er umulige å oppdage automatisk: en tekst med to spalter kan trekkes ut i feil leserekkefølge og fortsatt se ut som gyldig norsk. Ved å vise uttrekket og la eleven rette det, gjøres hver parsefeil synlig og rettbar i stedet for at den forplanter seg stille inn i markeringer, quiz og fagsamtale.» Siste setning er beholdt i strammet form.
- **Gjentakelse** — «Den andre gjennomgående regelen: …» Innledningen droppet; regelen («ingen feiltilstand er en blindvei») står.

### FR-1: Innliming av tekst
- **Begrunnelse** — «Grensen er satt til 8 000 og ikke høyere fordi Gullsettene i §4.3 og §4.4 består av tekster på 1 500–6 000 tegn: en øvre grense på 25 000 ville betydd at appen leverer i et lengderegime fire ganger utenfor det som faktisk er målt, og da gjelder ikke tersklene for det eleven møter. 8 000 ligger like over det lengste målte, som er så langt utenfor målingen det er forsvarlig å gå.» (Se notater-A.md: FR-8 sier 1 500–7 500 tegn.)

### FR-2: Opplasting og uttrekk av PDF
- **Begrunnelse** — «Det er en styrking av personvernet framfor en teknisk detalj: en opphavsrettsbeskyttet lærebokfil blir aldri overført noe sted, og §6.3 sin begrensning av eksponering blir sterkere enn den kunne blitt med opplasting. Det fjerner samtidig en reell hindring, siden en serverfunksjon hos leverandøren tar imot høyst 4,5 MB i en forespørsel, mens grensen under er 10 MB.»
- **Begrunnelse** — «Grensen handler nå om nettleserens minne og om at eleven ikke skal sitte og vente, ikke om overføring — den gjelder derfor i klienten.» Regelen («Grensen gjelder i klienten») står.
- **Begrunnelse** — «Uttrekket opphever bindestreksdeling over linjeskift **så langt en enkel regel rekker**: …»
- **Begrunnelse** — «**Dette er en kjent og bevisst begrensning, ikke et løst problem.** … Å avgjøre de tilfellene pålitelig krever en norsk ordliste som kan si om den sammenslåtte formen er et ord, og den avhengigheten er valgt bort i v1. Restfeilene fanges av gjennomsynet i FR-3 fase 3b, der eleven ser «informa- sjon» og retter den selv.»
- **Begrunnelse** — «Begrensningen er verdt å forstå fordi den møter verbatim-kravet i FR-7: et feilaktig sammenslått ord finnes ikke i teksten eleven leser, så det ville blitt forkastet som Faguttrykk. Feilen gir altså tapt dekning, ikke oppdiktede begreper — den mildeste av de to feilretningene.»
- **Begrunnelse** — «Det finnes ikke noe serverkall å time ut her.»

### FR-3: Gjennomsyn og retting av Råtekst, i to faser
- **9.11.2026** — Utviklerens telefontest prøvde antakelsen om at friksjonen i et obligatorisk gjennomsyn var verdt det: for innlimt tekst finnes ingen uttrekksfeil å rette, eleven har selv valgt teksten, og steget ble opplevd som et kjedelig hinder de færreste ville lest gjennom. Antakelsen holdt for PDF og bilde, der gjennomsynet er sikkerhetsnettet, og ikke for innlimt tekst.
- **11.11.2026** — «*Endret 11.11.2026:* kravet sa at ingen av fasene kunne hoppes over, med antakelsen «friksjonen er verdt det … Prøves på testbrukeren». Utviklerens telefontest 9.11 prøvde den: … Ønsket om å rette *etter* låsingen kan ikke innfris: Kildeavsnittene peker på avsnittene slik de ble låst.» Gjeldende regel (fase 3b hoppes over for innlimt tekst) står i presens.
- **Begrunnelse** (Hvorfor delt) — «Et tidligere utkast la hele gjennomsynet før Aktiveringen. Det ødela Aktiveringen: FR-5 holder brødteksten skjult med vilje, fordi gjetningen skal skje før lesingen — men et gjennomsyn av hele teksten rett i forveien hadde alt vist eleven nettopp det FR-5 skjuler. Vernet var illusorisk. Ved å dele steget får Aktiveringen sin forutsetning tilbake, og parsefeil rettes fortsatt før noe genereres.»
- **Begrunnelse** — «For PDF og bilde kan fase 3b ikke hoppes over, fordi uttrekket der ofte gir feil (FR-4, FR-45).»
- **Begrunnelse** (låsen) — «Grunnen er at Kildeavsnitt (§3) peker inn i den godkjente teksten, og alt generert innhold — markeringer, quizspørsmål, samtalespørsmål, øvekort — henger på de henvisningene. En redigering etter generering ville flyttet dem stille, slik at forklaringen peker på et annet avsnitt enn det den forklarer. Låsen er derfor ikke en begrensning, men det som gjør forankringskravet i §5 sant over tid.»

### FR-4: Navngitte feiltilstander for PDF
- **Begrunnelse** — «**Skanning er ikke enten-eller, og PF-1 fanger bare den ene halvparten.** Mange skannere og kopimaskiner kjører tekstgjenkjenning automatisk og lagrer «søkbar PDF». En slik fil *har* et tekstlag, av varierende kvalitet, og passerer derfor PF-1-sjekken og går rett inn i løypen med mulig rotete tekst. Det er ingen egen feiltilstand, fordi det ikke kan skilles fra en dårlig satt PDF — og det trenger det ikke, siden gjennomsynet i FR-3 fase 3b er nettopp dit slike feil havner. Men det er verdt å vite at …» Konsekvensen og terskelforklaringen står.
- «**Hvorfor:**»-linjen er ny og henter grunnen fra §4.1 («ingen feiltilstand er en blindvei»).

### FR-44: Bildeinnlesing av boksider
- **Begrunnelse** (Hvorfor dette er i v1) — «Uten en bildeinngang er ikke appen tungvint for dem — den er ubrukelig, og da løser den en smalere oppgave enn §1 påstår.»
- **Begrunnelse** — «Uttrekket gjøres med den samme multimodale språkmodellen appen alt bruker til alt annet: det er ett API-kall med en bildeblokk, ikke en ny integrasjon, og gjennomsynet i FR-3 fase 3b er allerede sikkerhetsnettet et usikkert uttrekk trenger.» Første ledd står i kravet.
- **Begrunnelse** (krymping) — «Skalering til høyst 2 000 piksler bredde og JPEG-kvalitet rundt 85 holder teksten på en boksides fullt lesbar for modellen, og bringer en typisk sides fra flere megabyte ned under én. Kravet finnes av tre grunner samtidig: leverandørens serverfunksjon tar imot høyst 4,5 MB i en forespørsel, et stort bilde koster mer i tokens uten å gi bedre uttrekk, og mindre data som forlater elevens maskin er bedre for §6.3.»
- **Begrunnelse** (én per forespørsel) — «Hver forespørsel holder seg under **4 MB** — en margin under leverandørens grense framfor å ligge på den. Eleven får samtidig framdrift per bilde framfor én lang venting uten tegn til liv.»
- **Gjentakelse** — «Begrunnelse i §6.2 og §6.3.» Nå bare henvisning i parentes.
- **Gjentakelse** — «ingen blindveier, hver feil sier hva som gikk galt og hva eleven kan gjøre» (innledningen til BF-tabellen). Står i §4.1.

### FR-45: Bildeinnlesing er ikke kvalitetssikret, og sier det
- **Begrunnelse** — «Mekanismen er den samme som for Modellstøttet språk i FR-24: en funksjon kan tilbys uten å være målt, så lenge det står hvilken av de to den er.» Nå «Hvorfor»-linjen.
- **Begrunnelse** — «Over tid er det den billigste indikasjonen på hvor godt bildeuttrekket faktisk virker — ikke en måling, men et spor verdt å se på i rapporten.» (til konsekvensen om avviket mellom Råtekst og redigert tekst)
- **Begrunnelse** — «Grensen på fire bilder er bevisst: inngangen er til noen sider eleven jobber med, ikke til å digitalisere en bok.»

### §4.2 Aktivering (beskrivelsen)
- **17.11.2026** — «*(Endret 17.11.2026, se FR-6.)*»
- **Begrunnelse** — «Brødteksten er ikke tilgjengelig her — hele poenget er at forkunnskapen hentes fram før lesingen, og verdien forsvinner dersom eleven kan kikke.» Nå «Hvorfor» i FR-5.
- **Begrunnelse** — «det finnes ingen feil svar på hva man kjenner fra før.»

### FR-5: Visning av overskrifter
- **Gjentakelse** — «Overskriftene er alt kontrollert og eventuelt rettet av eleven i fase 3a (FR-3), så Aktiveringen bygger på overskrifter eleven har godkjent.» Strammet.

### FR-6: Elevens forkunnskap
- **17.11.2026** — «*Endret 17.11.2026:* kravet var et fritt felt, «Hva tror du teksten handler om?». Utviklerens egen test viste at feltet ikke satte i gang noe — det var tomt og uinspirerende — og at svaret aldri ble vist igjen, selv om kravet lovte det, så eleven skrev ut i løse luften. Merkingen krever ett trykk per overskrift, spørsmålet gir eleven en grunn til å lese, og «Før du leste» gir det hun gjorde en ende. Det frie svaret beholdes i databasen for eldre tekster.» Commit 2842272. Gjeldende regel (fritt svar beholdes og vises) står i presens.
- **18.11.2026** — «*Endret 18.11.2026:* merkene var «Dette kan jeg», «Har hørt om» og «Helt nytt». Utviklerens test viste at «Dette kan jeg» lovet for mye, at «Har hørt om» var vagt, og at det manglet et svar for overskrifter eleven ikke skjønner. Nå står ett spørsmål over overskriftene med fire svar, og «Før du leste» har en egen linje for overskriftene eleven ikke skjønte. Kodene som lagres, er de samme (`kjent` = «Mye», `litt` = «Litt», `nytt` = «Ingenting ennå»), så merker fra før vises med de nye navnene uten migrasjon. Det er et bevisst valg at gamle svar tolkes om: «Dette kan jeg» leses som «Mye» og «Har hørt om» som «Litt». Den nye koden er `uklar`.» Commit f4097d9 (merkene fra 17.11 i eb63c37). Kodene og tolkningen står i presens.
- **23.11.2026** — «(endret 23.11)» i selve kravsetningen.
- **23.11.2026** — «*Endret 23.11.2026:* tre av de fire merkene er en skala, men de så ut som fire like knapper. Nå er skalaen en glider med tre trinn, og «Skjønner ikke overskriften» en egen av/på-knapp under den. Kodene er de samme, så lagrede merker, «Før du leste» og den låste visningen er uendret, uten migrasjon. Kravet om at merkene virker uten skript er strøket; et tomt skjema uten skript gir oppfordringen og slipper eleven videre, som før.» Commit 5fef75e. Gjeldende regel (krever skript) står i presens.
- **Begrunnelse** — «Steget skal ikke bli en sperre for den eleven som allerede synes dette er vanskelig.» (til konsekvensen om å gå videre uten merking)
- **Gjentakelse** — «Tekster fra før endringen, som har et fritt svar, viser det under «Før du leste».» Nå med datoen 17.11.2026 i stedet for «endringen».

## Del 2: §4.3–§4.6 (FR-7–FR-23)
Kilde: `_bmad-output/planning-artifacts/prd-lesevenn.md`, linje 258–550 (versjonen per 25.11.2026). Teksten under er nesten ordrett. Der et punkt er delt mellom kravet og loggen, står bare den delen som ble tatt ut.

### §4.3 Begrepssett og lesevisning (beskrivelsen)
- **Begrunnelse** — «Dette er funksjonen med størst risiko for stille kvalitetssvikt, og derfor den mest presist målte: «nøkkelorduttrekking er presis» er ikke et krav før det er tall.» (Første halvdel er også brukt i Hvorfor i FR-8.)
- **Begrunnelse** — «Markerer Lesevenn for mye, blir siden et gult teppe og markeringen mister all informasjonsverdi — og det er den lettere feilen å gjøre med en språkmodell som gjerne vil være hjelpsom. Derfor har FR-9 et hardt tetthetstak, og §10 har en motmetrikk som sier rett ut at flere markeringer ikke er bedre.» (Kryssreferansen FR-9 er rettet til FR-7 i kravteksten, se notater-B.md.)

### FR-7: Uttrekk av Faguttrykk
- **7.10.2026** — «**Gulvet gjelder alle tre takene, ikke bare prosentgrensen.** Presisert 7. oktober, etter at implementasjonen avdekket tilfellet: ett eneste Faguttrykk som forfatteren gjentar ofte bryter både prosentgrensen og vindustaket alene, uten at det er mer enn ett unikt uttrykk i settet. Kappingen kan ikke gjøre noe med det, fordi den kutter hele Faguttrykk nedenfra og stopper ved gulvet — med ett Faguttrykk er det ingenting å kutte. Settet leveres da selv om tetthetsmålet står som brutt. Alternativet ville vært å fjerne Tekstens viktigste begrep fordi forfatteren gjentar det, og det er åpenbart dårligere.» (Regelen «tetthetstallene er måletall, ikke garantier … ingen sperre skal bygges på at de er innenfor» står i kravet.)
- **7.10.2026** — «**Kappingen bruker det billigste virkemidlet først, og fjerner Faguttrykk bare for antallstaket.** Presisert 7. oktober etter første ekte kjøring.» Begrunnelsen for regelen: «fordi et fjernet Faguttrykk er et fagord eleven ikke får forklart, mens en fjernet markering er samme ord uthevet én gang mindre.» (Rekkefølgen (1)–(3) står i kravet; begrunnelsen er Hvorfor.)
- **7.10.2026 (første kjøring, dato antatt ut fra «Presisert 7. oktober etter første ekte kjøring»)** — «**Vindustaket kan være uoppnåelig, og rapporteres da som brutt.** Dette er målt, ikke antatt: på en NDLA-tekst om elektromagnetisk stråling ligger førsteforekomstene til de viktigste Faguttrykkene i Avsnitt 1, 2, 3 og 3 — fire innenfor de første hundre ordene, fordi åpningsavsnittet er der fagspråket introduseres. Så lenge hvert beholdt Faguttrykk skal ha minst én markering, kan taket ikke oppfylles. En tidligere utgave kuttet videre for å jage det, endte på fem Faguttrykk av 26, og brøt taket likevel — altså ofret 21 fagord for ingenting. Samme regel gjelder derfor som for gulvet: tetthetstallene rapporteres med faktisk verdi, også når de er over taket.»
- **7.10.2026 (første kjøring)** — «**Viktighetsrangeringen må ha nok oppløsning til å kappe etter.** Første kjøring gav 26 Faguttrykk fordelt på fire rangeringer, der ti delte rangering 2. Innenfor en så stor gruppe avgjøres kappingen av modellens utdatarekkefølge, som følger Teksten — og resultatet var at alle beholdte Faguttrykk kom fra første tredjedel, mens Avsnittene etter midten sto umarkerte. Prompten skal derfor kreve …» (kravet og `[ÅPENT]`-merket står i kravteksten). Promptregisteret: v2 (8.10) innførte «ulike rangeringer», og like rangeringer gikk fra 11 til 0.
- **13.11.2026** — Punktet «Når kallet feiler» var merket «*(Lagt til 13.11.2026 etter tilbakemelding på PRD.)*». Kravet står uendret i presens.
- **Tidligere versjon (udatert)** — «Tallene er strammet bevisst. En tidligere versjon av dette kravet hadde 8 prosent og 25 per 1 000 ord, og den grensen ville aldri slått inn: UJ-1 beskriver fjorten uttrykk i fire sider, altså langt under taket. Et tak som ikke binder er ikke et vern mot det gule teppet, bare en påstand om å ha ett. Se motmetrikk SM-C1.»
- **Begrunnelse** — «**Det finnes ingen nedre grense, og det er viktig.** … Et gulv ville tvunget Lesevenn til å finne fem Faguttrykk i en tekst som ikke har fem — og da ville modellen funnet dem opp. Det bryter verbatim-kravet over, ødelegger presisjonsmålingen i FR-8, og er akkurat feilen en hjelpsom språkmodell er tilbøyelig til å gjøre.»
- **Begrunnelse** — Tetthetstaket per 100 ord: «det siste fordi et snitt over hele teksten kan skjule at ett avsnitt er fullstendig nedlesset.»
- **Begrunnelse** — Tomt Begrepssett: «Øvekort tilbys da ikke, fordi det ikke finnes noe å lage kort av. Funksjonen degraderer ærlig framfor å produsere noe for å ha noe å vise.» (Siste setning flyttet; første del står i kravet.)
- **Begrunnelse** — Mykt varsel: «Varselet er en opplysning, ikke en sperre: en feilklassifisert fagtekst skal aldri låse eleven ute, og terskelen kan ikke finjusteres uten data Lesevenn ikke har.» (Ledd 1 og 2 står i kravet.)
- **Begrunnelse** — Viktighetsrangeringen: «Den rapporteres ikke til eleven og brukes ikke som dokumentasjon på at uttrekket er godt — det ville vært SM-C4-brudd.» (Står i kravet, omformulert.)
- **Gjentakelse droppet** — «Lavest rangerte uttrykk faller ut først» er slått sammen med kappingsrekkefølgen i kravet.

### FR-8: Måling av treffsikkerhet mot Gullsett
- **8.10.2026** — «**Taket er hevet fra 6 000 til 7 500 tegn — 8. oktober, og ikke for å få en tekst til å passe.** Grunnen er målbarhet. Den opprinnelige norsk-teksten ble 379 ord etter at oppgavedelen var kuttet, og tetthetsbudsjettet i FR-7 er `floor(12 × ord/1000)` med gulv 5 — altså fem Faguttrykk. Gjenkallingen beveget seg da i femdeler, og én bom gav 0,80. Ved å sette sammen tre NDLA-artikler om samme emne ble teksten 1 255 ord og budsjettet 15, som er en langt finere målestokk. Taket på 6 000 tegn var satt uten måling og kostet målekvalitet; det er den samme typen tall som terskelen i SM-8, bare at dette ikke er en kvalitetsterskel og justeringen gjør målingen **bedre** framfor å gjøre et brudd til en bestått prøve.»
- **8.10.2026** — «**Aksen er fellesfag mot programfag — omformulert 8. oktober.** Kravet krysset tidligere tre fellesfag mot studiespesialiserende og yrkesfag. Begrunnelsen var at «yrkesfaglige fagtekster har kortere setninger og mer praksisnær terminologi». Men det er egentlig en beskrivelse av **programfag**: naturfag for et yrkesfaglig programområde er fortsatt naturfag, skrevet mot fellesfagets læreplan, mens det praksisnære fagspråket bor i programfagene. Den gamle aksen siktet altså på programfag og kalte det programområde. Nå heter den det den måler.»
- **8.10.2026** — Overskriften over tabellen: «**Det konkrete Gullsettet, valgt og lisenssjekket 8. oktober:**». Under tabellen: «Tre læremiddel og tre autentiske; tre fokuserte og tre oversikter.»
- **8.10.2026** — «**De seks Tekstene varierer også i tekstkilde, og hver Tekst merkes med sin.** Lagt inn 8. oktober.» Beskrivelsen av kildene: «**Digitalt læremiddel**, typisk NDLA. Dette er ikke en lettversjon av virkeligheten — elevene bruker NDLA, så det er en av tekstene de faktisk møter. Tekstene er språkvasket og korrekturlest av fagfolk, og er derfor jevnere i form enn en lærebokside. **Mer autentisk fagtekst**, altså lærebokutdrag og tekster som ikke har vært gjennom samme redaksjonelle bearbeiding. Disse er ujevnere, og det er der uttrekket får motstand.» Og: «Med bare seks Tekster lar ikke kilde, fag og programområde seg krysse fullt — så kilden **merkes per Tekst og rapporteres sammen med tallene**, slik at en systematisk forskjell er synlig framfor skjult i et snitt.»
- **8.10.2026** — «**Teksttypen merkes også: fokusert eller oversikt.** Dette er lagt inn fordi det er målt, ikke antatt. Stabilitetsmålingen 8. oktober ga Jaccard 0,770 på en fokusert tekst om stråling fra radioaktive kilder og 0,466 på en oversiktstekst over sju undertemaer — med **samme prompt og samme modell**. Teksttypen betyr altså mer for stabiliteten enn faget gjør. En oversiktstekst har mange flere grensetilfeller, og grensetilfellene er det som vakler. Konsekvensen er todelt: Gullsettet skal inneholde begge typer, slik at terskelen ikke blir satt på den lette halvparten — og merkingen skal være der, slik at et brudd på FR-11 kan tilskrives teksttypen framfor å framstå som en generell svakhet.» (Tallene står i maalt-B.md.)
- **Før annoteringen (udatert, nå avklart)** — `[MERKNAD: dette strammer utvalget av «mer autentisk fagtekst». Et fotografert lærebokoppslag kan brukes til å måle, men ikke nødvendigvis legges i repoet. Alternativene er egenskrevet tekst i lærebokregister, eller åpent lisensiert materiale som ikke er NDLA. Må avklares før annoteringen starter.]` Flyttet fordi settet er valgt og lisenssjekket 8.10 (se notater-B.md). Begrunnelsen for delingskravet: «Det følger av FR-46 og av at målingen skal kunne kjøres om av andre.»
- **Begrunnelse (sammenhengen budsjett–gjenkalling)** — «**Og en sammenheng som må stå, fordi den kan gjøre terskelen uoppnåelig:** Gjenkalling er `|G ∩ M| / |G|`, der `G` er din annotering og `M` er det Lesevenn faktisk leverer. Men `M` kan aldri være større enn tetthetsbudsjettet i FR-7. Annoterer du flere Faguttrykk enn budsjettet tillater, er gjenkallingen **strukturelt begrenset** — uansett hvor godt uttrekket er.» Og: «Dette er ikke teoretisk: uttrekket fant 26 kandidater i `naturfag-em-bolger`. Annoteres 20 av dem, er maks gjenkalling 9/20 = 0,45, og FR-8 stryker før modellen har gjort noe galt.» «… og det er samme prioritering tetthetstaket gjør.»
- **Begrunnelse (doblingen av fag)** — «**Doblingen av norsk og teknologi er et designvalg, ikke en forglemmelse.** De to fagene har hver sin læremiddel/autentisk-par, så tekstkilden kan sammenlignes **med faget holdt konstant**. Naturfag og samfunnsfag har én tekst hver. Alternativet — én tekst per fag over seks fag — ville gjort kilde og fag uatskillelige.»
- **Begrunnelse (begrensning ved utvalget)** — «**En begrensning som skal stå:** teksttypen og tekstkilden er ikke helt uavhengige, og det er en egenskap ved sjangrene og ikke ved utvalget. En oversiktstekst på 700–1 000 ord er i praksis en **læremiddelsjanger** — NDLA skriver dem, mens oppslagsverk og offentlige kilder skriver enten korte oppslag eller svært lange gjennomganger. Å lage en autentisk oversiktstekst krever derfor beskjæring, og en hardt beskåret oversiktsartikkel blir *fokusert* av konstruksjon. Tekst 6 er den eneste med et tungt kutt, og at den er autentisk er en skjevhet verdt å nevne når tallene per kilde leses.» (Står også i `annotering.md`, linje 118.)
- **Begrunnelse (annoteringsstøy)** — «κ over bare de valgte ordene er ubrukelig, se kodefunn 12». «Dette koster om lag én time og er den billigste enkeltmålingen i hele dokumentet: uten den vet ikke utvikleren om presisjon 0,70 ligger over eller under sin egen annoteringsusikkerhet, og da betyr tallet ingenting. Er κ lav, er det funnet — ikke noe å skjule.»
- **Begrunnelse (ingen terskel per fag)** — «Med seks tekster er det om lag 20 annoterte uttrykk per fag, og konfidensintervallet for gjenkalling er da rundt ±0,19 — for bredt til å skille et godt fag fra et dårlig. Fordelingen per fag *rapporteres* fortsatt, som beskrivelse og som råstoff til skjevhetsdrøftingen i FR-42, men den er ikke en bestått/ikke bestått-grense.» Og for programområde: «Med én tekst per celle er tallet per celle en observasjon, ikke en måling. Det er nok til å se en systematisk forskjell om den er stor, og det er alt det påstås å være. Samme regel som for fag.» Og for inndelingene: «Et uttrekk som er godt i naturfag og dårlig i norsk er et kjent og dokumentert funn, ikke et gjennomsnitt som skjuler det — og det samme gjelder et uttrekk som er godt på digitalt læremiddel og dårlig på lærebokutdrag. Ingen av disse inndelingene har egen terskel; begrunnelsen er den samme som for fag, at én eller to Tekster per celle er en observasjon og ikke en måling.»
- **Begrunnelse (forklaringenes riktighet)** — «annoteringen finnes alt, så dette er vurdering av utdata, ikke et nytt Gullsett. Begrunnelsen er at presisjon og gjenkalling bare måler *hvilke* uttrykk som ble funnet, ikke om det som står om dem er sant: forklaringene er nettopp det eleven pugger på Øvekortene (FR-16), og en gal forklaring pugges like godt som en riktig. Minneverset har en tilsvarende faktasjekk i FR-31, og forklaringene fortjener den mer.»
- **Gjentakelse droppet** — «Tallene er en leveranse — ikke en intern sjekk» er beholdt; «Det konkrete settet står i tabellen under» er beholdt. Ingen andre gjentakelser droppet.

### FR-9: Markering i Lesevisningen
- **Gjentakelse droppet** — Tallene i tetthetsgrensene («4 prosent av løpende ord, 12 unike Faguttrykk per 1 000 ord, 3 markeringer per 100 sammenhengende ord») var gjentatt fra FR-7. Kravet viser nå bare til FR-7.
- **Begrunnelse** — «Eleven møter dermed aldri et uttrykk på Øvekortene som ikke var markert i teksten hun leste.» (Brukt som Hvorfor.)

### FR-10: Forklaring uten å forlate siden
- **Begrunnelse** — «Trykk er ikke en ettertanke. Pekerhvil finnes ikke på telefon, og §5 regner mobil som en reell flate — en forklaring som bare åpnes ved hvil er utilgjengelig for halve brukergruppen.»

### FR-11: Stabilitet mellom kjøringer
- **8.10.2026** — «**Presisert 8. oktober: målingen gjelder det kappede settet, ikke modellens råsvar.** Den første formuleringen sa «uttrekkssettet», og det er tvetydig: råsvaret fra modellen og det kappede settet er ulike sett og gir ulike tall. En uavklart definisjon gjør kravet ikke-etterprøvbart, uansett hvilket av de to man velger. Valget falt på det kappede settet fordi kravets egen begrunnelse handler om Øvekortene, og Øvekortene lages av det kappede settet. Et stabilt råsvar som kappes ulikt fra gang til gang ville innfridd kravet uten å løse problemet kravet finnes for.»
- **8.10.2026** — «**Hva ustabiliteten faktisk gjør mot eleven — rettet 8. oktober.** Kravet sa tidligere at «et ustabilt uttrekk gir et øvekortsett eleven ikke kan stole på fra en dag til den neste». Det er feil, og det motsier kravets eget neste punkt: Begrepssettet lagres ved første kjøring og gjenbrukes. For én elev med én Tekst flimrer altså ingenting — hun ser ett sett, og det settet er stabilt for alltid. Skaden er en annen, og verre å oppdage: **settet eleven får er én tilfeldig trekning blant flere mulige, og noen av trekningene er dårligere enn andre.** Med Jaccard 0,44 får to elever som leser samme Tekst vesentlig ulik hjelp, uten at noen av dem kan se det. Kvaliteten den enkelte opplever blir delvis flaks, og en dårlig trekning blir permanent fordi den lagres. Det er derfor stabilitet er et kvalitetskrav og ikke en kosmetisk bekymring — og det er derfor selvkonsistens er det riktige grepet: den gjør ikke visningen stabil (lagringen gjør alt det), den gjør det ene lagrede settet mindre tilfeldig.»
- **8.10.2026** — `[MÅLT 8. oktober, prompt v2, claude-haiku-5-5 adaptiv, 15 kjøringer per Tekst med disjunkte aggregater. Enkeltkjøring: 0,734 på fokusert tekst, 0,441 på oversiktstekst. Med selvkonsistens over fem kjøringer og flertallskrav: 0,865 og 0,564. Tre kjøringer med minst to: 0,801 og 0,526. Konklusjonen er at terskelen er oppnåelig med selvkonsistens på fokusert tekst, og ikke oppnåelig på oversiktstekst med noen av de målte oppsettene. Terskelen beholdes likevel — begrunnelsen står under SM-8 i §10.]` (Tallene står i maalt-B.md.)
- **Begrunnelse** — Råsvaret: «Den er diagnostisk: skiller de to tallene seg mye, ligger ustabiliteten i kappingen og ikke i uttrekket, og det er to helt ulike ting å rette.» (Første del står i kravet.)
- **Begrunnelse** — «Øvekortene og Minneverset kommer fra Begrepssettet, så en dårlig trekning forplanter seg til alt eleven øver på etterpå.» (Slått sammen inn i Hvorfor.)
- **Begrunnelse** — «**Målingen trenger ikke annoteringene, bare Tekstene.** Stabilitet er en sammenligning av appen med seg selv … Det er verdt å vite, fordi det gjør FR-11 til en av de første målingene som kan kjøres, og fordi et resultat her kan påvirke både modellvalget og hvilke Tekster som velges.»
- **Begrunnelse** — Per teksttype og tekstkilde: «et snitt over seks Tekster kan ikke skille «jevnt middelmådig» fra «god på halvparten og svak på resten», og de to krever helt ulike tiltak.»
- **Begrunnelse** — Lagring: «både for stabilitet og for kostnad.»

### FR-12: Leseinnstillinger
- **Begrunnelse** — «Lange linjer er et kjent hinder for elever som strever med lesing, og dette er en lesestøtteapp.» (Brukt som Hvorfor, ordrett.)

### §4.4 Quiz (beskrivelsen)
- **Begrunnelse** — «En språkmodell som drar inn allmennkunnskap teksten ikke nevner, tester noe annet enn leseforståelse, og gjør eleven usikker på en tekst hun faktisk hadde forstått.» (Brukt som Hvorfor i FR-14.)

### FR-13: Generering av Quiz
- **11.11.2026** — «Quizen lages når eleven åpner den, uten en egen bekreftelse.» var merket «*(Lagt til 11.11.2026 etter telefontesten.)*».
- **13.11.2026** — Punktet «Når kallet feiler» var merket «*(Lagt til 13.11.2026.)*».

### FR-14: Forankring i Teksten
- **Begrunnelse** — «Terskelen er 85 og ikke 90 fordi tallet skal kunne forsvares. Ved n = 24 er konfidensintervallet rundt en observert andel på 0,9 omtrent [0,73, 0,98] — en måling som viser 90 prosent kan i realiteten være 75. En terskel på 85 med rapportert intervall er en ærligere påstand enn 90 uten.» (Kravet om å rapportere intervallet står.)

### FR-15: Retting og tilbakemelding
- **11.11.2026** — Kildeavsnittet ved feil svar: «*(Endret 11.11.2026: var «viser». Telefontesten fant at avsnittene som sto åpne ved hvert feil svar, gjorde resultatet uoversiktlig; kilden er fortsatt ett trykk unna.)*»
- **11.11.2026** — Kortsvar som eleven vurderer selv: «*(Lagt til 11.11.2026.)*»

### §4.5 Øvekort (beskrivelsen)
- **Gjentakelse droppet** — «Det er et bevisst enkelt valg:» (innholdet står igjen).

### FR-16: Øvekort fra Begrepssettet
- **11.11.2026** — Kildeavsnittet med én knapp: «*(Endret 11.11.2026, som i FR-15.)*»

### FR-17: Gjennomgang av Øvekort
- **23.11.2026** — «*(Endret 23.11.2026: knappen het «Kan», som lovet for mye. Den lagrede verdien er fortsatt `kan`.)*» (Den lagrede verdien står i kravet i presens.)
- **23.11.2026** — Pilknappene og tastaturet: «*(Lagt til 23.11.2026.)*»
- **23.11.2026** — Oppsettet på stor skjerm, flyttet etter regel 7 (står i EXPERIENCE.md, komponenten Øvekortene, «Stor skjerm (fra 760 px, avgjort 23.11)», og DESIGN.md «Øvekortene på stor skjerm»): «På stor skjerm (fra 760 px) er kortet bredere (opptil omtrent 960 px), og «Må øve mer» og «Har kontroll» står nederst inne i kortet, side om side («Venstrehendt» bytter dem om). Tilbakelenken står da nederst på siden, til venstre, i stedet for øverst, så den kommer sist for tastatur og skjermleser (etter pilene) i stedet for først. Rekkefølgen for kortet, merkeknappene og pilene er uendret. *(Lagt til 23.11.2026.)*» (Brytepunktet og tastaturrekkefølgen står i kravet.)

### §4.6 Skriftlig fagsamtale (beskrivelsen)
- **Tidligere utkast (udatert)** — «Et tidligere utkast målte ordforskjell mellom oppfølgingene i stedet, og kunne ikke feile; hvorfor står nederst i FR-21, og det hører i refleksjonsrapporten.»
- **Begrunnelse** — Avsnittstesten «er ikke til å bestå ved flaks, fordi den spør hvor systemet peker og ikke hvilke ord det bruker.» (Brukt i Hvorfor i FR-21.)

### FR-19: Svarvurdering i fem tilstander
- **13.11.2026** — Punktet «Når kallet feiler» var merket «*(Lagt til 13.11.2026.)*».

### FR-20: Regler for oppfølgingsspørsmål
- **13.11.2026** — Punktet «Når kallet feiler» var merket «*(Lagt til 13.11.2026.)*».
- **Begrunnelse** — Strukturert utdata: «Feltene er ikke pynt: de er det som gjør relevans målbar i FR-21 uten å måtte lese mening ut av fritekst, og §5 krever Kildeavsnitt på alt generert innhold uansett, så kostnaden er nær null.»
- **Begrunnelse** — Sporbarhet: «Presiseringen er nødvendig: et krav om et ord som «finnes i elevens svar» kan innfris av et system som bare gjentar sitt eget spørsmål tilbake, siden elevens svar normalt gjenbruker spørsmålets ord.»
- **Begrunnelse** — Ingen gjentakelse: «Uten den presiseringen er tallet ikke reproduserbart: to helt ulike norske spørsmål på åtte ord kan komme over 0,8 på funksjonsord alene.»

### FR-21: Måling av relevans mot Gullsett
- **Tidligere versjon (udatert)** — «en tidligere versjon av dette kravet hadde bare tre varianter, slik at Uklart og Utenfor aldri ble prøvd, og forvekslingsmatrisen ikke kunne vise nettopp de forvekslingene kravet kaller akseptable. Misoppfatning er med to ganger fordi den bærer sikkerhetsporten under, og en port med null toleranse trenger nok tilfeller å være en port over.»
- **Første utkast (udatert)** — «**Hvorfor den opprinnelige kontrafaktiske testen ble forkastet.** Første utkast av dette kravet målte at to ulike elevsvar gir oppfølginger med ordoverlapp under 0,6. Den testen var verdiløs, og på en måte som er verdt å skrive om i refleksjonsrapporten: FR-20 *pålegger* oppfølgingen å gjengi et ord eleven brukte, så to ulike svar gir automatisk to ulike strenger. «Du skrev 'X' — kan du se på avsnitt 2?» ville bestått hver gang, med samme funksjonelle spørsmål hver gang. Et krav som ikke kan feile måler ingenting. Avsnittstesten over erstatter den fordi den spør om noe systemet ikke kan late som: *hvor* det peker, ikke *hvilke ord* det bruker.»
- **Begrunnelse** — Sikkerhetsporten: «Begrunnelsen er den samme som FR-43 navngir som prosjektets verste feilmåte: eleven får bekreftet en gal forståelse, og går fra Lesevenn tryggere på noe som er feil enn da hun kom. Alle andre forvekslinger er å foretrekke framfor denne.»
- **Begrunnelse** — Binær gjenkalling: «Dette er det grovkornede spørsmålet som faktisk betyr noe for eleven: oppdager systemet at svaret ikke holdt?»
- **Begrunnelse** — Avsnittstesten: «Et skriptet system kan ikke bestå denne: den krever at systemet finner fram til avsnittet som motsier nettopp den misoppfatningen eleven viste.»
- **Begrunnelse** — Forvekslingsmatrisen: «Med 36 tilfeller er konfidensintervallet rundt en femveis treffandel om lag ±0,15. Det er for bredt til å bære en bestått/ikke bestått-grense, og en terskel på «75 prosent treff» ville derfor gitt et tall som ser strengere ut enn det er. … Portene er sikkerhetsporten og den binære gjenkallingen over.» (At den binære gjenkallingen er en port, står nå i punktet selv: «blokkerende».)

### FR-22: Lengde og avslutning
- **Begrunnelse** — «At det godtatte listes opp er ikke en pyntelig detalj. Sikkerhetsporten i FR-21 gjør det den kan for å hindre at en misoppfatning leses som Dekkende, men den kan ikke gjøre det umulig. Ser eleven hva som ble godtatt, får hun en siste sjanse til å oppdage selv at noe glapp — og det er det eneste vernet som virker når modellen tar feil.» (Forkortet til Hvorfor.)
- **Begrunnelse** — «Knappen er også en ærlig innrømmelse i grensesnittet av at vurderingen kan være gal.»

### FR-23: Tone og status som formativ
- **Begrunnelse** — «Uten det er det forfatteren av prompten som vurderer om egen prompt har god tone, og den prøven består alltid.» (Brukt som Hvorfor.)

## Del 3: §4.7–§4.12 og §13 (FR-24–FR-53, DK-1–DK-6)
Innhold flyttet ut av kravteksten i runde 2, nesten ordrett, med hvor det kom fra. Rene gjentakelser er droppet og notert som det.

### §4.7 Morsmålsstøtte (beskrivelsen)
- **Begrunnelse** — «Det er først og fremst et pedagogisk valg — eleven skal komme videre i norsk fagspråk, ikke slutte å møte det — men det er samtidig sikkerhetsnettet mot dårlige oversettelser. Er oversettelsen svak, står originalen rett ved siden av.» (Komprimert til to setninger i beskrivelsen.)
- **Begrunnelse** — «Dekningen i v1 er delt i to nivåer, fordi «oversettelsen er faglig presis» bare er en påstand man kan stå for i et språk man har målt.» (Står nå som Hvorfor i FR-24.)
- **Begrunnelse** — «Valget er ikke tatt fordi ukrainsk er det viktigste språket i norsk skole, men fordi det er det språket prosjektet faktisk har en kontrollkilde til: en morsmålsbruker som kan gjøre den eksterne vurderingen i FR-28. Den vurderingen er den eneste delen av oversettelsesmålingen som er reelt uavhengig, og et kvalitetssikret nivå uten den ville vært en påstand uten dekning. At tilgang til én person avgjør hva prosjektet kan påstå, er verdt å si rett ut i rapporten — det er slik kvalitetssikring faktisk fungerer når man er alene.»
- **Begrunnelse** — «Ukrainsk er samtidig en rimelig gruppe å prioritere: den er blant de største nyankomne elevgruppene i norsk skole, og elever som kom i ungdomsskolealder etter 2022 er nå på videregående — altså nøyaktig målgruppen i §2.»
- **Begrunnelse** — «Arabisk bygges og demonstreres uansett, også om et annet språk blir det kvalitetssikrede. Grunnen er teknisk og ikke pedagogisk: arabisk tvinger fram høyre-til-venstre-gjengivelse side om side med norsk, som er et faktisk krav med en faktisk løsning (FR-25), og det er den mest demonstrerbare tekniske biten i hele §4.7. Det som faller bort uten kvalitetssikret nivå, er måleforpliktelsen — ikke funksjonaliteten.»
- **Historikk (udatert, før 25.9.2026)** — «En tidligere versjon av dette kravet hadde tre kvalitetssikrede språk. Det ble kuttet fordi det bandt prosjektet til å finne tre frivillige morsmålsbrukere før M1, altså gjorde den mest usikre antakelsen i dokumentet til en forutsetning for å bli ferdig.»
- **Gjentakelse droppet** — «**Det Kvalitetssikrede språket i v1 er ukrainsk.**» sto to ganger i beskrivelsen; én gang er nok.

### FR-24: Valg av Morsmål og to dekningsnivåer
- **16.10.2026** — «**Listen, bestemt 16. oktober 2026:** polsk, litauisk, arabisk, somali, urdu, tigrinja, tagalog, dari, russisk, persisk, thai, vietnamesisk, tyrkisk, rumensk, albansk og kurdisk (sorani) — 16 modellstøttede, i tillegg til ukrainsk.» (Listen står i kravet, datoen er flyttet hit.)
- **16.10.2026** — Tidligere formulering, før listen ble bestemt: «Listen er lukket på om lag 15 språk; det finnes ikke fritekstfelt for språk i v1.» «Om lag 15» er erstattet av den faktiske listen på 16 (se notater-C.md).
- **19.10.2026** — «**Bestått 19. oktober 2026:** begrepsanker 0,981, tilbakeoversettelse 0 avvik, ekstern vurdering 0 anmerkninger av 16 (`maaling/resultater/fr28-dommer-uk.json`).» (Også i maalt-C.md.)
- **Begrunnelse** — «Grunnlaget er SSBs tabell over innvandrere og norskfødte med innvandrerforeldre etter landbakgrunn per 1. januar 2026 (<https://www.ssb.no/innvbef>): de største gruppene er gjort om til hovedspråk, og nordiske, tyske og engelsktalende grupper er holdt utenfor fordi de i liten grad trenger fagstøtte på morsmål. Sorani er tatt med fordi kurdisktalende fordeler seg over Irak, Syria, Iran og Tyrkia og derfor ikke synes som én gruppe i tabellen.»
- **Merknad flyttet til DK-5** — «`[MERK til FR-42: modellens kvalitet er trolig dårligst for nettopp de språkene med minst treningsdata — somali, tigrinja, dari — som er blant gruppene med størst behov. Det er skjevhetsaksen «mellom språk», og den skal drøftes, ikke skjules.]`» (Innholdet står nå som kriterium under «Mellom språk» i DK-5.)

### FR-25: Additiv visning
- Ingenting flyttet. Hvorfor-setningen er hentet fra beskrivelsen i §4.7.

### FR-26: Aktivering og oppsummering på Morsmål
- **16.10.2026** — Plasseringen av oppsummeringen ble bestemt: «**Den står nederst i Lesevisningen, etter teksten** (bestemt 16. oktober 2026), og lages når eleven ber om den — ikke for hver Tekst på forhånd.»
- **17.10.2026** — Låsen ble bestemt: «**Den låses opp først når eleven har levert en Quiz eller svart i en Fagsamtale** (bestemt 17. oktober 2026), slik §6 krever; låsen håndheves på serveren, ikke bare ved at knappen skjules.»

### FR-27: Utpeking av språklige bilder og akademisk allmennspråk
- **Begrunnelse** — Fra definisjonen av akademisk allmennspråk: «… og som en morsmålsbruker leser forbi uten å merke det.»
- **Begrunnelse** — «Begrunnelsen for at dette er et eget sett og ikke en utvidelse av Faguttrykk: definisjonen av Faguttrykk i §3 utelukker akademisk allmennspråk med vilje, fordi presisjonsmålet i FR-8 blir umulig å forsvare om kategorien er alt som er vanskelig. Men det er nettopp «forutsetning» andrespråkslesen stopper på, og uten dette settet ville Lesevenn markert fagordene til den eleven som trengte de andre ordene. Kategorien er derfor knyttet til Morsmål, der behovet er, ikke til Lesevisningen for alle.» (Siste setning står igjen som konsekvens, kjernen som Hvorfor.)

### FR-28: Måling av oversettelseskvalitet
- **16.10.2026** — «Tekstene hentes fra Gullsettet i FR-8 (bestemt 16. oktober 2026), fordi de alt er lisensklarert og annotert, og fordi Begrepssettet deres da er kjent når begrepsankeret måles.»
- **16.10.2026** — Bestått-grensen for den eksterne vurderingen ble satt «(bestemt 16. oktober 2026, før vurderingen er gjort)».
- **Historikk (udatert)** — «**Hvorfor tilbakeoversettelse ikke kan bære mer enn det.** Et tidligere utkast brukte tilbakeoversettelse som hovedmål på faglig presisjon. Det var et brudd på prosjektets egen motmetrikk SM-C4: en modell fra samme familie som gjorde oversettelsen, gjenskaper sin egen feiloversettelse på veien tilbake, og resultatet ser riktig ut. Metoden er derfor blind for nettopp feil terminologi — det FR-28 påstår å garantere — og for alt som handler om register og flyt. Tapt nekting er det ene den faktisk fanger, fordi en utelatt negasjon ikke kan gjenoppstå. At en modell vurderer sitt eget utdata er ikke kvalitetssikring, uansett hvor mange steg som legges imellom.»
- **Historikk (udatert)** — «**Et oversettelsesverktøy er ikke en uavhengig kontroll.** Et tidligere utkast tilbød «morsmålsbruker eller uavhengig oversettelsesverktøy» som likeverdige alternativer. De er ikke likeverdige: et annet maskinoversettelsesverktøy deler treningsdata og skjevheter med modellen det skal kontrollere. Det kan brukes som et hint underveis, men det kan ikke kalles kvalitetssikring i rapporten.» (Regelen står igjen som konsekvens.)
- **Begrunnelse** — Om begrepsankeret: «Dette er den *eneste* delen av oversettelseskvaliteten som kan måles hardt og billig, og det er samtidig den delen som bærer den pedagogiske hensikten i §1: eleven skal komme ut med det norske fagordet. Den er derfor primærmålet, ikke et støttemål.»
- **Begrunnelse** — Om den eksterne vurderingen: «Ekstern vurdering — den eneste reelle kvalitetssikringen.» og «Det er om lag 30 minutter av én persons tid, og det er det eneste stedet i denne seksjonen der noen utenfor systemet faktisk ser på utdataet.»
- **Begrunnelse** — «Nivået følger målingen, ikke ambisjonen.»

### FR-29: Feilhåndtering i oversettelse
- Ingenting flyttet.

### §4.8 Minnevers og Suno-prompt (beskrivelsen)
- **Begrunnelse** — «Det minst kritiske og morsomste elementet, med én reell risiko: et rim som stemmer dårlig faglig er verre enn ingen huskeregel, fordi eleven pugger noe galt i en form som sitter godt.» («og morsomste» og bisetningen er tatt ut av beskrivelsen; bisetningen står som Hvorfor i FR-31.)

### FR-30: Generering av Minnevers eller Suno-prompt
- **19.10.2026** — «**Suno-prompten er satt på pause** (bestemt 19. oktober 2026, etter vurderingen av minnevers v3).»
- **Begrunnelse** — «Tiden brukes heller på at versene blir gode: ett tema i dybden framfor mange i bredden.»

### FR-31: Faktasjekk av Minnevers
- Ingenting flyttet. «et Gullsett av 10 genererte vers» heter nå Gullsett Minnevers.

### §4.9 Mapper lett (beskrivelsen)
- **25.9.2026** — Mapper var betinget mål i M2.
- **27.9.2026** — Mapper «ble tatt ut 27. september for å gi plass til bildeinnlesing (FR-44, FR-45), etter at det ble klart at en stor del av målgruppen har papirbok eller nettbok uten kopiering. Begrunnelsen da var at Mapper er **additiv** — uten den virker alt annet — mens bildeinnlesing er **eksistensiell**. Den avveiningen står: bildeinnlesingen ble bygget først.»
- **19.11.2026** — «**Status per 19. november: Mapper er i v1 i en lett variant (variant B), FR-50 til FR-52.**» og «19. november, med M1 levert og en uke slakk før kodefrys 27. november, valgte utvikleren å ta inn en lett variant. Den er lett fordi den ikke gjør det som gjorde den opprinnelige varianten dyr: den har ingen samlet Fagsamtale, ingen generering på tvers av Tekster, og dermed ingen ny forankringsregel og ikke noe nytt Gullsett (innvendingen fra 25. september, åpent spørsmål 8).»
- **Historikk** — Overskriften på avsnittet: «**Historikken, fordi beslutningen er snudd to ganger.**»
- **Historikk** — «**FR-32, FR-33 og FR-34 er fortsatt trukket tilbake, og numrene gjenbrukes ikke.** De beskrev den fulle varianten med samlet Fagsamtale. Den lette varianten har egne numre.» (Kortet ned til én setning i beskrivelsen.)

### FR-50: Mappe
- **23.11.2026** — «*(Endret 23.11.2026: fra 760 px står Mappene til høyre i Samlinger, se FR-49; under 760 px står de øverst som før. Samme dag: Arbeidsbordet viser en Mappe med Tekster som én bunke, og Tekstene i den ligger under Mappen i stedet for alene, se FR-48. Før stod det her at Arbeidsbordets fem bunker var uendret.)*» (Gjeldende regel står i FR-48 og FR-49; plasseringen står i EXPERIENCE.md.)
- **23.11.2026** — Før endringen sto det: «Mappene står i en egen del øverst i Samlinger (FR-49)». «Øverst» er layout og står i EXPERIENCE.md (smalere enn 760 px: «Samlinger er én kolonne med mappene øverst»).
- **23.11.2026** — «*(Tatt inn 23.11.2026.)*» foran konsekvensen om «Legg i mappe» og draget.

### FR-51: Samlet øving
- Ingenting flyttet.

### FR-52: Samlet quiz
- Ingenting flyttet.

### FR-35: Konto og innlogging
- **19.11.2026** — «*(Lagt til 19. november.)*» foran aldersgrensen på 15 år.
- **23.11.2026** — «*(Lagt til 23. november, `_bmad-output/implementation-artifacts/spec-runde-3-1-innloggingssperre.md`.)*» foran innloggingssperren. Spesifikasjonen ligger i den fila.
- **Før 23.11.2026** — Innloggingen fulgte Better Auths standard, 3 forsøk per 10 sekunder, som var for strengt for en elev som skriver feil (kilde: `gjennomgang-innlogging.md`, «Utvidet 23.11.2026»; ikke ordrett fra PRD-en).

### FR-36: Lagring og historikk
- **Begrunnelse** — «— for stabilitet (FR-11) og kostnad (§6)» er flyttet fra konsekvensen til Hvorfor-linjen.

### FR-37: Sletting
- Ingenting flyttet.

### FR-53: Vilkår og personvern
- **19.11.2026** — «*(Lagt til 19. november.)*» foran kravsetningen. Datoen i konsekvensen «Kontoer fra før 19. november …» står, fordi den er en del av regelen.

### §4.11 KI-bruk og kvalitetssikring (beskrivelsen, nå §4.11 Kjørbarhet og §13)
- **Begrunnelse** — «Dette er en leveranse, ikke en rapportvedlegg-øvelse. Emnets mappevurdering høsten 2026 er todelt: prosjektkode og funksjonalitet teller 70 prosent, og der står kravet om at «dokumentasjon må vise hvordan KI ble brukt, og hvordan studentene har kvalitetssikret koden». Refleksjonsrapporten teller 30 prosent, med kritisk vurdering av hvordan KI påvirket sluttresultatet og av etiske og teknologiske sider. Emnets læringsutbytter peker på de samme tingene: prompting, iterativ kodegjennomgang, testing, versjonskontroll, og vurdering av etikk og jus rundt KI-generert kode, inkludert eierskap og skjevhet.» (Kjernen står i innledningen til §13.)
- **Begrunnelse** — «To ting følger av det. For det første gjelder kvalitetssikringen **både koden og innholdet** — appens kildekode, som i stor grad er KI-generert, og det KI-genererte innholdet appen produserer i drift. Det er to ulike oppgaver med to ulike metoder, og seksjonen skiller dem. For det andre er råstoffet allerede beskrevet: Gullsettene i FR-8, FR-14, FR-21, FR-28 og FR-31 *er* kvalitetssikringen av innholdet. Denne seksjonen krever bare at de finnes i repoet med tall, ikke bare som påstand i en rapport.» (Komprimert til andre avsnitt i §13.)
- **25.11.2026** — FR-38 til FR-43 flyttet til §13 som DK-1 til DK-6 etter tilbakemeldingen 12.11 (§4.4). §4.11 heter nå «Kjørbarhet» og har bare FR-46.

### DK-1 (tidligere FR-38): KI-logg for utviklingen
- **Begrunnelse** — «Loggen ligger i repoet, i versjonskontroll, og oppdateres gjennom semesteret — ikke skrevet fra hukommelsen i siste uke.» («ikke skrevet fra hukommelsen i siste uke» er begrunnelsen for kriteriet om jevn oppdatering.)

### DK-2 (tidligere FR-39): Promptregister for kjøretid
- **8.10.2026** — «**Omformulert 8. oktober, og grunnen hører i rapporten.** Kravet sa tidligere bare «minst én prompt viser en dokumentert forbedring over minst to versjoner». Det belønner utelukkende det som lyktes, og skaper dermed et stille insentiv til å rapportere forsøket som virket og la de andre ligge. Det er stikk motsatt av hva §4.11 finnes for, og det er samme feilmåte som SM-C4: å la dokumentasjonen bli en samling treff framfor en beskrivelse av arbeidet.»
- **8.10.2026** — «Anledningen var konkret. Prompt v2 for uttrekk av Faguttrykk ble skrevet 8. oktober for å rette en målt ustabilitet, med fem navngitte endringer og en klar hypotese. Den **forbedret ikke** hovedmålet: Jaccard gikk fra 0,466 til 0,458 på den ene Teksten og fra 0,770 til 0,682 på den andre. Diagnosen etterpå var mer verdifull enn en suksess ville vært — regelen «ved tvil, utelat» krympet settet uten å gjøre beslutningene mer deterministiske, og Jaccard straffer samme vakling hardere i et lite sett. Som kravet opprinnelig sto, telte ikke det arbeidet.» (Tallene også i maalt-C.md.)
- **Begrunnelse** — «Det er dette som gjør prompting til et håndverk i rapporten og ikke en anekdote: at forsøkene er etterprøvbare, ikke at de alle lyktes.» (Står som Hvorfor.)

### DK-3 (tidligere FR-40): Testsett og måleresultater i repoet
- Ingenting flyttet. Kriteriet «Ingen terskel i §4 mangler i tabellen» er en presisering av «viser hver terskel i dokumentet».

### DK-4 (tidligere FR-41): Kvalitetssikring av koden
- **15.10.2026** — «*Endret 15.10.2026 fra «gjennomgått linje for linje».* Utvikleren er nybegynner i programmering, og en lesing linje for linje viste seg i praksis ikke å gi en reell vurdering: det er vanskelig å se om kode gjør det kommentaren sier uten å kunne lese den flytende. Metodene over krever ikke det, og de er etterprøvbare — mutasjonstesten kan kjøres om av sensor. Begrensningen: de dekker reglene noen har tenkt på å teste, ikke feil ingen har forestilt seg.»
- **23.11.2026** — «*(Oppdatert 23. november.)* Mutasjonstesten har 14 regler; den 14. er at innloggingen slipper gjennom fem forsøk på rad før sperren (FR-35, `_bmad-output/implementation-artifacts/spec-runde-3-1-innloggingssperre.md`). Kjørt 23.11.2026: 14 av 14 brudd oppdaget (`maaling/resultater/2026-11-23-innlogging-mutasjoner.md`, `_bmad-output/planning-artifacts/gjennomgang-innlogging.md`).» (Regelen står som kriterium, resultatet i maalt-C.md.)
- **Begrunnelse** — «Dette er delene der en KI-generert snarvei gjør mest skade.» (Står som Hvorfor.)

### DK-5 (tidligere FR-42): Etikk og jus
- **Begrunnelse** — Om aksen mellom programområder: «Uttrekket kan treffe bedre på akademisk fagspråk enn på praksisnær yrkesfagterminologi, fordi den første typen er langt bedre representert i det en språkmodell er trent på. Krysningen i FR-8s Gullsett finnes nettopp for å kunne si noe om dette framfor å anta det.»
- **Begrunnelse** — Om aksen mellom fag: «Faguttrykk kan trekkes ut skjevt mellom naturfag, samfunnsfag og norsk.»
- **Begrunnelse** — Om aksen mellom språk: «Oversettelseskvalitet er med stor sannsynlighet dårligere for språk med mindre treningsdata — som er nettopp de språkene elevene med størst behov snakker. Nivåskillet i FR-24 er prosjektets svar, og det svaret vurderes kritisk.»
- **Begrunnelse** — «Den andre aksen er verdt å ta alvorlig og ikke bare nevne: dersom uttrekket virker dårligere på yrkesfaglige tekster, virker verktøyet dårligst der lesestøttebehovet er størst. Det er den samme formen for skjevhet som den språklige, bare mindre synlig — og et verktøy som hjelper mest de elevene som trengte det minst, har ikke løst problemet i §1.»
- **Begrunnelse** — «**Datakjeden og opphavsretten er drøftet som et valg, ikke som en gitt ramme.** Dette er den fjerde aksen, og den er den mest konkrete.»
- **Begrunnelse** — Om lokal modell: «Den siste ble valgt bort fordi Svarvurderingen er den vanskeligste oppgaven i appen og krever god norsk — det er en reell avveining mellom personvern og pedagogisk kvalitet, og den skal stå som det.»
- **Begrunnelse** — Om bildeinngangen: «Bildeinngangen (FR-44) skjerper dette, og valget om å ta den inn likevel skal begrunnes: uten den kan en stor del av målgruppen ikke bruke appen, og et vern som består i at verktøyet er ubrukelig er ikke et vern.»

### DK-6 (tidligere FR-43): Refleksjon, forankring og de påstandene prosjektet gjør
- **Begrunnelse** — «Prosjektets differensiering er at KI-bruken er forankret i en etablert lesepedagogisk struktur … Uten kilde er forankringen bare utviklerens egen mening om hva en leselærer ville gjort, og da faller det som skiller Lesevenn fra et generisk oppsummeringsverktøy tilbake på påstand.»
- **Begrunnelse** — «Ingen måling i dette dokumentet gir belegg for noen av de to: SM-3 viser at samtalen reagerer på svaret, som er noe annet enn at den er en bedre test. … Å gjenta den som om den var vist, er den ene tingen som ville undergrave hele §4.11.» (Siste setning står som Hvorfor, med «hele §4.11» omskrevet til «hele dokumentasjonen av kvalitetsarbeidet».)
- **Begrunnelse** — «… det er en sterkere posisjon enn å late som byggeklossene er nye.»
- **Begrunnelse** — Om feilmåten: «Det er den feilen som gjør skade, og den skal stå i rapporten selv om den er ubehagelig for produktet.»
- **Begrunnelse** — «Briefens kortsiktige mål er å vise …» (Innholdet står i kriteriet om de to sammenlignende påstandene.)

### FR-46: Appen kan kjøres av noen andre, uten prosjektets nøkler
- **7.10.2026** — «Lagt inn 7. oktober etter tilbakemelding fra emneansvarlig. Kravet manglet, og det er et hull som fortjener å navngis: Lesevenn er nesten utelukkende språkmodellkall mot en betalt API-nøkkel, oppå en database som ligger i en skytjeneste utvikleren eier. Uten dette kravet kan appen bare kjøres av utvikleren selv — og en app ingen andre kan kjøre, kan ingen andre vurdere. Det er ikke bare et vurderingsproblem: det er også den eneste praktiske kostnadskontrollen under utvikling, siden hver demonstrasjon ellers er et nytt sett betalte kall.» (Kjernen står som kravsetning og Hvorfor.)
- **Begrunnelse** — Om `.env.example`: «… slik at den som følger README havner i den billige veien uten å velge den aktivt.»
- **Begrunnelse** — Om valideringen: «Dette er kravets kjerne og ikke en detalj: en testmodus som hopper over valideringen demonstrerer en kodevei som ikke finnes i drift, og beviser dermed ingenting om appen.»
- **Begrunnelse** — Om databaseversjonen: «Samme hovedversjon er med vilje: enum-typene og de unike indeksene i AD-15 er nettopp det som kan oppføre seg ulikt mellom versjoner.»
- **Begrunnelse** — Om én dekket tekst: «Et oppslag som «nesten traff» og viste svaret til en annen tekst, ville vært verre enn en tydelig feil.»
- **Begrunnelse** — Om README: «Et README som bare er skrevet, er ikke et README som virker.»
- **Begrunnelse** — Om standard i drift: «Det motsatte valget — å falle til lagrede svar — ville gitt en app i drift som stille viser andres svar til eleven.»

### §4.12 Inngang, arbeidsbord og samling (beskrivelsen)
- **13.11.2026** — «Lagt til 13.11.2026 i designfasen.»

### FR-47: Landingsside
- Ingenting flyttet.

### FR-48: Arbeidsbord
- **Før 23.11.2026** — «Arbeidsbordet viser de fem Tekstene med nyest aktivitet som bunker. Den nyeste er størst og viser neste steg, utledet av Tekstens tilstand og hva eleven har gjort.» og «Har eleven flere enn fem, vises en lenke til Samlinger med antallet.» (Slått sammen med regelen fra 23.11: Mapper og Tekster deler de fem plassene, og lenken vises når ikke alle Tekstene kan nås fra bordet.)
- **23.11.2026** — «*(Tatt inn 23.11.2026, runde 3, bolk 5.)*» foran konsekvensen om Mapper på bordet, og «*(Tatt inn 23.11.2026.)*» foran konsekvensen om å åpne en mappebunke.
- **23.11.2026** — Layoutdetalj: mappebunken har «mappefane». Står i EXPERIENCE.md (linje 85) og DESIGN.md (`stack-folder`).

### FR-49: Samlinger
- **23.11.2026** — «*(Endret 23.11.2026: siden het «Samlingen». Den heter nå «Samlinger» i overskriften, menyen og teksten eleven ser. Domenebegrepet Mappe er uendret.)*»
- **23.11.2026** — «*(Tatt inn 23.11.2026.)* Fra 760 px er Samlinger todelt: søket og Tekstene i en smal kolonne til venstre (om lag 30 %), Mappene som kort i et rutenett til høyre (om lag 70 %). … Under 760 px er siden én kolonne med Mappene øverst (FR-50) …» Oppsettet står i EXPERIENCE.md (linje 241 og 242). Tab-rekkefølgen og kravet om ingen sidelengs rulling står igjen i FR-49.

## Del 4: §5–§12 (tverrgående krav, rammer, milepæler, suksesskriterier, åpne spørsmål, antakelser)
Linjenumrene viser til `prd-lesevenn.md` før runde 2 (1151 linjer).

### §5 Tverrgående krav
- **Begrunnelse** (l. 891, omformulert) — «eleven skal komme til aktiveringssiden raskt» er gjort til «slik at eleven kommer raskt til aktiveringssiden». Ingenting flyttet ut; §5 var alt stram.
- **Begrunnelse** (l. 896) — «Både for stabilitet og for kostnad.» står igjen som «for stabilitet og for kostnad».

### §6.2 Personvern og databehandling
- **19.11.2026** (l. 910) — «*(Lagt til 19. november.)*» sto etter overskriften for behandlingsgrunnlaget.
- **Begrunnelse** (l. 911) — «13 år er grensen for samtykke til informasjonssamfunnstjenester (art. 8, personopplysningsloven § 5); den gjelder ikke direkte når grunnlaget er avtale.» Står igjen i kortere form.
- **Begrunnelse** (l. 912) — «Eleven skal vite hvor teksten går.» Ren gjentakelse av setningen før; droppet.
- **Begrunnelse** (l. 915) — «Policyen er ett skoleår — tekster lagt inn ved skolestart skal være tilgjengelige ved eksamen på slutten av året, og det setter gulvet. Lengre enn det, for eksempel hele skolegangen, er vanskelig å begrunne som et reelt behov.»
- **Begrunnelse** (l. 916) — «Begrunnelsen for policyen står i `addendum-lesevenn.md` §6, slik at spørsmålet «leverandøren lagrer i X, hva gjør du?» har et svar selv om v1 ikke håndhever det.» Henvisningen står igjen; leddsetningen etter «§6» er flyttet hit.
- **Begrunnelse** (l. 917) — «Brukergruppen er **delt**: elever på Vg1 og Vg2 er i hovedsak mindreårige (15–17), mens mange på Vg3 er myndige (18–19). Datainnsamlingen holdes like kort uansett, fordi den må være forsvarlig for den yngste brukeren og ikke for gjennomsnittet.» Slått sammen med første punkt.
- **Begrunnelse** (l. 918) — «Aldersdelingen gjør én praktisk ting lettere: testbrukere kan rekrutteres blant myndige elever på Vg3 …» Første ledd er tatt bort; resten står.
- **Begrunnelse** (l. 920) — «Dette er formulert leverandøruavhengig med vilje: kravet er en egenskap ved avtalen, ikke ved merkenavnet.»
- **Begrunnelse** (l. 922) — «Appen tar imot opphavsrettsbeskyttet lærebokstoff, og forskjellen mellom at en kopi passerer gjennom en databehandler og at innholdet havner i et treningssett er en forskjell i art, ikke i grad.»
- **Begrunnelse** (l. 924) — «Det er ikke nok å anta hva som gjelder; … Vilkår endres, og en udatert påstand om dem er verdiløs.»
- **Begrunnelse** (l. 925) — «Merk at forbruker- og API-versjoner av samme tjeneste ofte har ulike vilkår på nettopp dette punktet.» Slått sammen med punktet om vilkår.
- **Begrunnelse** (l. 927) — «Bildeinngangen er lagt inn fordi målgruppen krever den, men den øker eksponeringen, og lagringsregelen er svaret på det.»

### §6.3 Opphavsrett
- **Begrunnelse** (l. 931) — «… og den fortjener mer enn en henvisning til vilkårene.»
- **Begrunnelse** (l. 935) — «Tekstgrensen på 8 000 tegn (FR-1) gjør at det som behandles er et utdrag, ikke et kapittel og slett ikke en bok. Grensen ble satt av målehensyn, men den virker like godt her.»
- **Begrunnelse** (l. 936) — «Grensen på fire bilder per Tekst (FR-44) er satt av samme grunn.» og «Skannede PDF-er av hele bøker er eksplisitt ikke støttet (PF-1).»
- **Begrunnelse** (l. 944) — «Vilkår som sier «til eget studiebruk» flytter ansvaret til en sekstenåring som ikke leser dem. Det er verdt å ha med, men det er ikke der vernet ligger — vernet ligger i grensene over.»
- **Begrunnelse** (l. 945) — «Dette er en ærlig begrensning framfor noe å pynte på.»
- **Begrunnelse** (l. 946) — «Åpent spørsmål 12 i §11.» er gjort om til «(§11 pkt. 12)».

### §6.4 Kostnad
- **13.11.2026** (l. 951) — Fullt estimat: «`[ESTIMAT 13.11.2026, ikke målt: én Tekst gjennom hele løypen med en Fagsamtale på fire runder koster om lag 1,60 kroner (Haiku om lag 34 000 tokens inn og 17 000 ut, inkludert fem uttrekk og tenking. Sonnet om lag 33 000 inn og 7 000 ut). Fagsamtalen står for om lag 92 prosent. Uten Fagsamtale er det om lag 0,15 kroner, og med seks runder, bilde og morsmål om lag 2,40. Rammen over holder da til om lag 200–400 Tekster. Kurs 10,5 kroner per dollar.]`» I kravteksten står estimatet igjen i kort form (uten tokentall og kurs), fordi addendum §3 viser til PRD §6.4 for det gjeldende estimatet.
- **13.11.2026** (l. 952) — «*(Lagt til 13.11.2026 etter tilbakemelding på PRD.)*» sto etter bruksgrensene.
- **Begrunnelse** (l. 949) — «Rammen styrer flere valg som ellers ville sett vilkårlige ut: …»
- **Begrunnelse** (l. 951) — «Blandingen legger de dyre tokenene der kvaliteten avgjør noe, og de billige der volumet er.» (står igjen i kortere form)
- **Begrunnelse** (l. 952) — «Grensen på Fagsamtaler finnes fordi det er der kostnaden ligger. Taket for hele appen finnes fordi en grense per konto ikke beskytter budsjettet når mange bruker appen samtidig.» (står igjen som én Hvorfor-setning)
- **Begrunnelse** (l. 953) — «Null misoppfatninger lest som dekkende er ikke et mål man forhandler om, og det er den oppgaven som krever mest av modellen. Sonnet framfor Opus fordi den er halv pris og fortsatt langt sterkere enn Haiku; Opus 5 er oppgraderingsveien om målingen krever det.»
- **Begrunnelse** (l. 954) — «Treffer Haiku tersklene, er valget dokumentert framfor antatt — og det er en sterkere setning i rapporten enn en begrunnelse basert på hva som er vanlig.»
- **Begrunnelse** (l. 955) — «Målekjøringene mot Gullsettene koster også penger, og de kjøres per promptversjon. Det er en budsjettpost, ikke en gratis bieffekt — og et argument for å holde gullsettene så små som de er.»

### §7 Ikke-mål
- **8.10.2026** (l. 963) — «`[RETTET 8. oktober: punktet sa tidligere «Lesevenn leser ikke bilder. Ingen OCR, ingen bildeinnlesing, ingen URL-innlesing». Det var en rest fra før 2. oktober, da bildeinnlesing ble tatt inn i v1 som FR-44 og FR-45. Ikke-målet motsa altså kravet i samme dokument. Feilen er samme klasse som den emneansvarlig påpekte mellom briefen og PRD-en, bare internt i PRD-en.]`»
- **Begrunnelse** (l. 960) — «Diagnostikk på tvers av økter krever reell brukshistorikk for å være troverdig, og den historikken finnes ikke i v1.» (står igjen i kortere form)
- **Begrunnelse** (l. 964) — «… og utelatelsen er et valg og ikke en forglemmelse — tidligere sa dokumentet ingenting om språk i det hele tatt. Begrunnelsen er at engelsk kilde endrer oppgaven på tre punkter: faguttrykkene blir engelske mens forklaringen skal være norsk, `erSirkulaer` bruker en norsk fyllordliste, og morsmålsstøttens bærende invariant om at «det norske fagbegrepet står alltid sammen med oversettelsen» (§4.7) gjelder ikke når kilden ikke er norsk — eleven ville fått tre språk i samme visning. Engelsk er et fellesfag på linje med de tre i Gullsettet, så dette er en reell avgrensning av noe nyttig, ikke en uinteressant utelatelse.»

### §8 Omfang v1
- **27.9.2026** (l. 987) — «Mapper var betinget mål i M2, tatt ut 27. september for å gi plass til bildeinnlesing, …»
- **19.11.2026** (l. 979) — «Mapper lett (FR-50 til FR-52, tatt inn 19. november)». (l. 987) «… og tatt inn igjen 19. november i en lett variant som bare gjenbruker lagret innhold (FR-50 til FR-52). Det som krever nye modellkall på tvers av Tekster, og dermed ny forankringsregel og nytt Gullsett, er fortsatt ute.»
- **Begrunnelse** (l. 988) — «`[MERKNAD: pedagogisk er dette det mest interessante neste steget — noen elever forklarer mye bedre muntlig enn skriftlig. Verdt å nevne i rapportens videreføringsdel.]`» (talebasert fagsamtale)
- **Begrunnelse** (l. 989) — «Funksjonen hører sammen med lærerdashbordet, ikke før det. Krever i tillegg kjennskap til to eksterne formater.» (CSV-eksport)
- **Begrunnelse** (l. 990) — «… og tre slike avhengigheter før M1 ville gjort den mest usikre antakelsen i dokumentet til en forutsetning for å bli ferdig. Utsatt av risikohensyn, ikke fordi oversettelse til flere språk er vanskelig — de er tilgjengelige som Modellstøttede fra dag én.»
- **Begrunnelse** (l. 991) — «Utsatt av troverdighetsgrunner, ikke av tidsgrunner.» (diagnostikk)
- **Begrunnelse** (l. 992) — «Bevisst: eleven skal øve på norsk fagspråk.» (står igjen som «fordi …»)
- **Begrunnelse** (l. 980) — «Dokumentasjonsleveransen i §4.11» er endret til «§13 (DK-1 til DK-6)», fordi FR-38 til FR-43 flyttes dit i runde 2.

### §9 Ferdig-definisjon og milepæler (innledning)
- **25.9.2026** (l. 998) — «Semesteret startet 10. august 2026 og slutter 18. desember. Hovedperioden for vurdering i høstsemesteret går fra om lag 20. november til jul. **Innleveringsfristen er 5. desember 2026**, bekreftet hos emneansvarlig 25. september. Planen under er lagt mot den datoen. Merk at 5. desember er en lørdag — …»
- **25.9.2026** (l. 1000) — «Fra i dag, 25. september, er det om lag ti arbeidsuker. Planen under er ikke en ønskeliste, men en kuttrekkefølge …»
- **25.9.2026** (l. 1002) — «**En ting planen må ta høyde for, og som en ren funksjonsliste skjuler.** Emnets ukeplan plasserer arkitektur og UX-spesifikasjon i uke 44–45, altså inne i byggevinduet under — men **det er anbefalt framdrift, ikke egne innleveringer**, bekreftet 25. september. M1-vinduet er dermed intakt, og arkitekturdokumentet kan skrives i det omfanget det er nyttig for byggingen framfor for en vurdering.»
- **Begrunnelse** (l. 1004) — «Det som likevel er en reell post, er at målearbeidet i §4 er et arbeid i seg selv, ikke en bieffekt av å bygge: … og tersklene er satt der de kan forsvares ved den størrelsen, ikke der de ser strengest ut.»

### §9.1 M0
- **Runde 2 (25.11.2026)** — FR-37 og FR-46 lagt inn med nummer (Bård §4.5). FR-37 står sammen med konto og lagring (bygget 14.–16.10, commits «Innlogging med Better Auth … (FR-35, FR-37)» og «Slett-knapp for tekster i sidekolonnen (FR-37)»). FR-46 står i M0 fordi testmodus er kostnadskontroll under utvikling (bygget 7.10, commit «Legg til testmodus og lokal database (FR-46, AD-18)»).
- **Datoflytting, udatert** (l. 1017) — «Datoen er samtidig flyttet fra 23. til 30. oktober, fordi M0 nå også inneholder innlogging og lagring fra ingenting — den delen FR-41 krever gjennomgått og dokumentert.»
- **Begrunnelse** (l. 1008) — «M0 inneholder Fagsamtalen i full form, og det er et bevisst valg med en kostnad.»
- **Begrunnelse** (l. 1014) — «Dette skjer i M0 og ikke senere: målingen styrer promptarbeidet, og en måling som først kommer i desember har ikke styrt noe — den har bare beskrevet.»
- **Begrunnelse** (l. 1017) — «**Hva som ble flyttet ut for å gjøre plass.** Fagsamtalen hører i M0 fordi M0 uten den er nøyaktig det generiske «lim inn tekst, få en quiz»-verktøyet §1 definerer Lesevenn i motsetning til — et M0 som ikke kan demonstrere prosjektets egen tese er ikke et minimum, det er et annet produkt. Men funksjonen er den dyreste i dokumentet, så **målingene** av den flyttes til M1: Gullsettet på 36 tilfeller, sikkerhetsporten og avsnittstesten i FR-21 kjøres der. Det samme gjelder Quiz-gullsettet i FR-14. M0 bygger altså Fagsamtalen; M1 beviser den.»

### §9.2 M1
- **Runde 2 (25.11.2026)** — FR-12 lagt inn med nummer i punktet om leseinnstillinger (Bård §4.5). FR-39 heter nå DK-2; FR-42 og FR-43 heter DK-5 og DK-6.
- **Runde 2 (25.11.2026)** (l. 1031) — Punktet sa «Promptregisteret viser minst én dokumentert forbedring over to versjoner (FR-39).» Det er den gamle formuleringen av FR-39 fra før 8.10. Nå: «Promptregisteret oppfyller DK-2 (FR-39), med minst én dokumentert forbedring.»
- **Begrunnelse** (l. 1023) — «Testfilene må lages, ikke finnes — det er en egen post.»
- **Begrunnelse** (l. 1033) — «**Minnevers er flyttet fram, ikke bakover.** Det sto tidligere sist på kuttlisten sammen med Mapper. Det var galt: funksjonen er om lag tre til fire timers arbeid, den billigste i hele dokumentet, og faktasjekken i FR-31 er den reneste kilden prosjektet har til et konkret «modellen løy for rimets skyld»-tall — altså nettopp den typen funn FR-42 og FR-43 trenger for å være annet enn generelle betraktninger. Å kutte den for å spare fire timer og samtidig miste et dokumentert funn er en dårlig byttehandel.»

### §9.3 Stabilisering og slakk
- **27.9.2026** (l. 1037) — «Det finnes **ikke** noe M2-nivå lenger. Mapper var det eneste betingede målet, og det ble tatt ut av v1 27. september (§4.9). Uken mellom M1 og kodefrys er derfor ikke en funksjonsuke — den er slakk, og det er et bevisst valg framfor et tomrom.»
- **16.10.2026** (l. 1041) — «**Designfase (bestemt 16. oktober).** En samlet designrunde — felles farger, avstander, typografi og knapper, og mobil — legges hit, senest i denne uka.»
- **12.–13.11.2026** (l. 1041) — «**Designfasen ble gjort 12.–13. november** og la til tre nye funksjoner: landingsside, arbeidsbord og samling (FR-47 til FR-49). Det er nye funksjoner i slakken, altså nettopp det SM-C2 advarer mot, og det skal stå åpent.»
- **19.11.2026** (l. 1039) — «**Mapper lett (bestemt 19. november).** Utvikleren tok likevel inn en lett variant av Mapper i slakken (FR-50 til FR-52). Som designfasen er det en ny funksjon i slakken, det SM-C2 advarer mot, og det skal stå åpent.»
- **Begrunnelse** (l. 1043) — «Uken brukes ellers til det som alltid gjenstår og alltid undervurderes: … Skrider M1 ut, er dette bufferen som absorberer det — og da er det bedre at bufferen finnes i planen enn at den oppstår ved at noe annet ryker.»
- **Begrunnelse** (l. 1041) — «Kuttrekkefølge … (Samlingen blir startsiden).» Står igjen med «Samlinger», sidens navn etter FR-49 (23.11).

### §9.4 Kodefrys og dokumentasjonsvindu
- **Begrunnelse** (l. 1050) — «Grunnen er at refleksjonsrapporten teller 30 prosent og kodedokumentasjonen inngår i de resterende 70. Det er ikke en oppgave som lar seg klemme inn i kvelden før, og den vanligste måten for en solostudent å tape karakter på er å bruke hele fristen på kode og levere dokumentasjonen halvferdig. Åtte dager reservert til dokumentasjon er billig forsikring — og den er billigere fordi tallene alt finnes: Gullsettene er målt underveis, KI-loggen er ført underveis. Vinduet brukes til å skrive, ikke til å rekonstruere.»

### §9.5 Demotest
- **11.11.2026** (l. 1060) — Steg 4 hadde «(FR-3, endret 11.11)». Nå bare «(FR-3)».
- **19.11.2026** (l. 1069) — Steg 13b begynte med «*(Lagt til 19. november, FR-50 til FR-52.)*». FR-numrene står nå i steget.
- **23.11.2026** (l. 1069) — Midt i steg 13b: «*(Lagt til 23.11, FR-48.)*» før kontrollen av Arbeidsbordet. FR-48 står nå i steget.
- **Runde 2** (l. 1069) — «Lag en Mappe fra Samlingen» er endret til «fra Samlinger», sidens navn etter FR-49 (23.11).
- **Begrunnelse** (l. 1072) — «**Hva demoløypen bevisst ikke tester.** … Et tidligere utkast gjorde det — steg 7 krevde at en bevisst misoppfatning fikk tilstanden Misoppfatning — og det var en feil: et kall til en språkmodell er ikke deterministisk, så en slik port ville feilet tilfeldig, og en port som feiler tilfeldig blir stille droppet etter tredje gang. Demoløypen tester at flyten holder og at feltene finnes. *Kvaliteten* på klassifiseringen hører i Gullsettet i FR-21, der den måles over 36 tilfeller i stedet for ett, og der et avvik betyr noe.»

### §10 Suksesskriterier
- **8.10.2026** (l. 1094) — «Terskelen på 0,80 ble satt uten måling. Målingen 8. oktober viste at den er oppnåelig på én teksttype og ikke på en annen: med selvkonsistens over fem kjøringer ga en fokusert tekst 0,865, mens en oversiktstekst ga 0,629 med samme teknikk, prompt og modell.» (tallene står i maalt-D.md)
- **19.11.2026** (l. 1105) — SM-13: «*(Lagt til 19. november.)*» og «… og innfrir briefens mappekriterium i den lette formen.»
- **19.11.2026** (l. 1106) — Merknad om briefens mappekriterium: «Fra 19. november er det innfridd i den lette varianten (FR-50 til FR-52): Tekstene samles i en Mappe, og den felles Quizen settes sammen av spørsmålene Tekstene alt har. Det er ikke en kvalitetspåstand utover FR-14: spørsmålene er de samme, og målingen deres gjelder uendret.» Siste setning er en gjentakelse av SM-13 og er droppet.
- **Begrunnelse** (l. 1090, 1092) — Mellomoverskriften «**Om SM-8, og hvorfor tallet er verdiløst uten merkingen**» og henvisningen «— se avgjørelsen under» er tatt bort; avgjørelsen står nå som underpunkter i SM-8.
- **Begrunnelse** (l. 1096) — «Tre veier var mulige: beholde 0,80 over alle seks og rapportere et eventuelt brudd, sette egen terskel per teksttype, eller senke terskelen til noe oppnåelig på tvers. **Valget er den første.** Å justere en terskel fordi målingen viser at den ble satt i blinde er legitimt, men det kan ikke skilles utenfra fra å justere den for å gjøre et brudd til en bestått prøve — og en terskel som flyttes etter at tallet er kjent, beviser ingenting uansett hvor god begrunnelsen er.»
- **Begrunnelse** (l. 1098) — «**Men da hviler alt på merkingen i FR-8, og det er ikke en formalitet.** Et enkelt snitt over seks Tekster er uleselig: 0,72 kan bety at teknikken er jevnt middelmådig, eller at den gir 0,87 på tre Tekster og 0,57 på tre andre. Det er to helt ulike funn med helt ulike konsekvenser — det første sier at metoden ikke holder, det andre at metoden holder og at teksttypen er variabelen. Uten merking per tekstkilde og teksttype er SM-8 derfor bare et tall som enten består eller ikke, og prosjektet lærer ingenting av det.»
- **Begrunnelse** (l. 1100) — «Merkingen verner i tillegg mot det motsatte: havner Gullsettet ved et uhell på seks fokuserte Tekster, kan snittet bestå — og da ville en bestått SM-8 skyldes tekstutvalget framfor kvaliteten. Begge feilretninger lukkes av samme krav. **Derfor er fordelingen tre og tre, bestemt før annoteringen starter og ikke etter at tallene er kjent.**»
- **Begrunnelse** (l. 1102) — SM-10: «… siden det er friksjon Lesevenn legger til med vilje.»
- **Begrunnelse** (l. 1103) — SM-11: «**Merk at dette ikke er en kvalitetspåstand:** metrikken sier at veien finnes og virker ende til ende, ikke at uttrekket er treffsikkert. Det siste er umålt i v1, og det står i FR-45.» (står igjen i kortere form)
- **Begrunnelse** (l. 1104) — SM-12: «de er lagret på forhånd, og sier derfor ingenting om hvordan appen svarer på en ny tekst.»
- **Begrunnelse** (l. 1089) — SM-7: «(samme terskel som FR-14)» er utvidet til «rapportert med konfidensintervall (samme terskel og rapportering som FR-14)», etter Bårds forslag i §4.1. FR-14 krever alt intervallet.
- **Begrunnelse** (l. 1113) — SM-C4: «Motvekt til hele §4.11 — dette er den enkleste og mest forlokkende måten å gjøre kvalitetssikringen verdiløs på.» Nå «(§13)», fordi DK-1 til DK-6 er flyttet til §13.

### §11 Åpne spørsmål
- **25.9.2026** (pkt. 1, l. 1117) — «Milepælsplanen i §9 var alt lagt mot den datoen og trenger ingen endring. Gjenstår én praktisk detalj: 5. desember er en **lørdag**, så finn klokkeslettet i Canvas og planlegg å levere fredag 4. desember. Går noe galt med innleveringen på en lørdag, er det ingen å spørre.»
- **25.9.2026** (pkt. 2, l. 1118) — «… selv om emnebeskrivelsen angir grupper på 4 ± 1. Premisset for hele dokumentet står dermed. Verdt å nevne i refleksjonsrapporten som en rammebetingelse: omfanget i §8 er dimensjonert for én person på ti uker, ikke for en gruppe på fire, og det forklarer flere av kuttene i §9.»
- **25.9.2026** (pkt. 3, l. 1119) — «Emnet hadde ingen påkrevd struktur, så den følger malen gjenfunnet fra fjorårets gjennomføring (addendum §1). Retten til å levere mappekravet er dermed sikret.»
- **25.9.2026** (pkt. 4, l. 1120) — «Gjenstår bare å avtale tidspunkt i M1-vinduet rundt 20. november — ikke tidligere, siden funksjonen ikke finnes før da.» Avløst av «Vurderingen er gjennomført (FR-24)».
- **25.9.2026** (pkt. 5, l. 1121) — «M1-vinduet er intakt, og Mapper har dermed en reell sjanse framfor å være nærmest utelukket.»
- **27.9.2026** (pkt. 8, l. 1124) — «**Bortfalt 27. september:** Mapper er ute av v1, så spørsmålet er ikke lenger aktuelt. Det samme resonnementet — en funksjon kan leveres umålt så lenge det oppgis — er nå brukt på bildeinnlesing i stedet (FR-45).»
- **30.9.2026** (pkt. 11, l. 1127) — «*(Delvis avklart 30. september: Anthropic er valgt for M0, med sammenligning mot minst én annen leverandør før M1, målt på gullsettet i FR-8. Gjenstår kravene under.)* Inndata skal ikke brukes til trening, behandlingsstedet skal være kjent. Les vilkårene for det du faktisk bruker — forbruker- og API-versjoner av samme tjeneste har ofte ulike vilkår her — og skriv ned hvilke vilkår og hvilken dato. Avklares før M0, siden det er leverandøren appen bygges mot.»
- **Før 2.10.2026** (pkt. 11, l. 1127) — «Opprinnelig formulering: Leverandør er avklart (Anthropic for M0), og vilkårene er dokumentert i addendum §6 — Commercial Terms sier «Anthropic may not train models on Customer Content from Services». Men spinen pinner ingen modell, og lagringsdokumentasjonen gjør unntak for «Covered Models» med 30 dagers oppbevaring. Hvilke modeller som er dekket er ikke belagt med kilde. **Må avklares før generatorkoden skrives**, siden konklusjonen om elevenes data henger på det.»
- **2.10.2026** (pkt. 11, l. 1127) — «*(Forrige avklaring, 2. oktober:)* `claude-haiku-4-5` som standard og `claude-sonnet-5` for svarvurdering. **Begge er utenfor Covered Models**, så 30-dagerslagringen gjelder ikke og konklusjonen i addendum §6 står. Fordelingen per oppgave i addendum §3. Gjenstår: måle uttrekket mot FR-8 før valget låses.»
- **2.10.2026** (pkt. 14, l. 1130) — «~~**Er `claude-haiku-4-5` multimodal?**~~ **Avklart 2. oktober:** ja, Haiku 4.5 tar bilder som inndata. Verifisert av Arve. Bildeuttrekket i FR-44 blir derfor på den billige modellen, og flyttingen til Sonnet er ikke nødvendig.» Spørsmålet er nå formulert om modellen for bildeuttrekket, siden den er `claude-haiku-5-5` (`prompts/gjeldende.json`).
- **8.10.2026** (pkt. 11, l. 1127) — «~~**Hvilken modell, og er den en «Covered Model»?**~~ **Avklart på nytt 8. oktober:** modellen er byttet til `claude-haiku-5-5` etter at stabilitetsmålingen viste at den er dobbelt så stabil, en femtedel så dyr i utdatatokens og åtte ganger raskere enn `claude-haiku-4-5`. Sjekken er gjort om mot to primærkilder, med ordrette sitater, URL og lesedato i addendum §6: Covered Models er Claude Fable 5.1, Mythos 5.1, Fable 5 og Mythos 5, og **Claude Haiku står ikke på listen i noen versjon**. 30-dagerslagringen gjelder altså ikke, og konklusjonen i §6 står. **Ett forbehold er ført i §6 og er ikke lukket:** …» (målingen står i maalt-D.md)
- **8.10.2026** (pkt. 9, l. 1125) — «Videregåendetekster er tettere på fagspråk, så taket kan nå binde for hardt og kutte uttrykk eleven faktisk trengte. Annoteringen av Gullsettet i FR-8 gir svaret: … Avklares i M0, siden annoteringen skjer der.» Første og siste setning er tatt ut; vilkåret for å heve taket står.
- **11.11.2026** (pkt. 6, l. 1122) — «Det er begrunnet i kvalitet, men det er også ekstra friksjon rett foran den eleven som strever mest. Prøv på testbrukeren i SM-10. **Delvis avklart 11.11:** utviklerens telefontest viste at steget ikke var verdt friksjonen for innlimt tekst, og fase 3b hoppes nå over der (FR-3). For PDF og bilde står spørsmålet åpent til SM-10.» Spørsmålet het «Tåler det obligatoriske gjennomsynssteget (FR-3) en reell elev?».
- **19.11.2026** (pkt. 8, l. 1124) — «*Fortsatt bortfalt 19. november:* Mapper lett (FR-50 til FR-52) har ingen samlet Fagsamtale, …»
- **26.10.2026** (pkt. 15, l. 1131) — «Ført opp 26. oktober etter seks promptversjoner: modellen får ikke til sant, rimet og fagordrikt på én gang, og v3 står med FR-31 bestått, men svak som huskeregel. … Det flytter den delen modellen er dårlig på til eleven, og utnytter genereringseffekten (det man lager selv, huskes bedre — slå opp en primærkilde før det siteres). … Vurderes etter M1, ikke før.»
- **Udatert** (pkt. 7, l. 1123) — Restteksten fra før avklaringen: «En oppskrift, en chatlogg, et dikt. Trolig et mykt varsel med mulighet for å fortsette — men oppførselen er ikke spesifisert, og bør avklares eller bevisst utsettes.»
- **Udatert** (pkt. 10, l. 1126) — Restteksten fra før avklaringen: «FR-2 krever at «informa-\nsjon» slås sammen mens «KI-assistert» beholdes. Uten en ordliste er den grensen vanskelig å treffe pålitelig. Avklar om en enkel ordliste skal inn, eller om kravet skal senkes til å gjelde de vanlige tilfellene og resten fanges av gjennomsynet i FR-3.»
- **Udatert** (pkt. 13, l. 1129) — «Verdt å se på mot slutten selv om det ikke er en måling.»
- **Runde 2 (25.11.2026)** — Pkt. 16 og 17 er nye, hentet fra `[ÅPENT]` i FR-7 (l. 286) og FR-8 (l. 316) (Bård §5). Pkt. 7 og 10 er merket avklart med henvisning (Bård §5). Pkt. 4 har fått henvisning til at vurderingen er gjennomført (FR-24, bestått 19.10).

### §12 Antakelsesregister
- **25.9.2026** (#12, l. 1148) — «**§9** — ~~Innleveringsfrist i første halvdel av desember.~~ *(Avklart 25. september: fristen er 5. desember 2026, bekreftet hos emneansvarlig. Ikke lenger en antakelse.)*»
- **25.9.2026** (#13, l. 1149) — «**§9** — ~~Emnets ukeplan legger beslag på uke 44–45 med egne leveranser.~~ *(Avklart 25. september: ukeplanen er anbefalt framdrift, ikke innleveringer. Ikke lenger en antakelse.)*»
- **25.9.2026** (#6, l. 1142) — «*(Avklart 25. september: ukrainsk morsmålsbruker funnet.)*» står nå som «Bekreftet 25. september: …».
- **27.9.2026 og 19.11.2026** (#3, l. 1139) — «Dette er grunnlaget for at bildeinnlesing (FR-44) ble prioritert foran Mapper 27. september; Mapper kom inn i en lett variant 19. november (§4.9), etter at bildeinnlesingen var bygget. Opplyst av utvikleren 27. september; ikke tallfestet.»
- **11.11.2026** (#5, l. 1141) — «*Endret 11.11:* for innlimt tekst holdt antakelsen ikke, og steget er fjernet der. For PDF og bilde bør den fortsatt prøves på testbruker.»
- **Runde 2 (25.11.2026)** — #16 er ny: `[ANTAKELSE]` om forbruksberegningen i §6.4 (l. 952) manglet i registeret.
- **Begrunnelse** (#11, l. 1147) — «Merk at målearbeidet, ikke kjøretidsbruken, er den posten som skalerer med antall promptversjoner.» (står igjen uten «Merk at»)
