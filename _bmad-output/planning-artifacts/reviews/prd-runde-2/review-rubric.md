# Kvalitetsvurdering av PRD — Lesevenn (runde 2)

Vurdert: `prd-lesevenn.md` (frontmatter `status: draft`, `updated: 2026-11-25`, 1270 linjer, ca. 19 200 ord). `addendum-lesevenn.md` og `beslutningslogg-prd.md` er lest som kontekst. Rubrikk: `bmad-prd/assets/prd-validation-checklist.md`. Linjenumrene viser til PRD-en per 25.11.2026.

Dommene er *sterk / tilstrekkelig / tynn / brutt* (rubrikkens strong / adequate / thin / broken). Alvorlighetsgradene er **kritisk / høy / medium / lav**.

## Samlet vurdering

Runde 2 har gjort det den skulle. Historikken er ute av kravene, og per FR står nå krav, konsekvenser og én «Hvorfor». Dokumentasjonskravene har egen seksjon (§13, DK-1 til DK-6) med sjekkbare kriterier, og statustabellen i §9.6 dekker alle FR-er og DK-er. Substansen, tesen og testbarheten er like sterk som før. Risikoen ligger i det statustabellen nå viser: SM-2, SM-8 og to av delmålene i SM-3 er målt og ikke nådd, uten at PRD-en sier hva det betyr. Flere åpne spørsmål og `[ÅPENT]`-merker venter fortsatt på målinger som alt finnes, og tabellen erklærer DK-3 oppfylt selv om kriteriet ikke er det. I tillegg finnes noen nye eller gjenværende motsigelser, blant annet to tabeller over Gullsett Faguttrykk med ulike ordtall og et «bygges sist» som strider mot M1.

## Beslutningsklarhet — tilstrekkelig

Valgene før målingene er fortsatt tydelige og priset: bildeinnlesing umålt med vilje (FR-45), ett Kvalitetssikret språk (§4.7), Mapper lett i slakken «det SM-C2 advarer mot, og det skal stå åpent» (§9.3, l. 1004), og ESTIMAT-merket kostnadsanslag (§6.4, l. 917). Dommen er senket fra sterk fordi §9.6 nå viser at flere terskler ikke er nådd, mens beslutningene målingene skulle utløse ikke er tatt i PRD-en. Flere steder er beslutningen eksplisitt utsatt til målingen, og målingen finnes nå.

### Funn
- **høy** Målingene er inne, men beslutningene de skulle utløse er ikke tatt (§9.6 l. 1059; §6.4 l. 920; §11 pkt. 9, 15, 16, 17; FR-8 l. 331). FR-8 er «Målt, **ikke bestått**», med gjenkalling 0,361 mot kravet 0,75 og presisjon 0,413 mot 0,70. Likevel står fortsatt: «Uttrekket måles mot Gullsett Faguttrykk (FR-8) før modellvalget låses» (§6.4). Addendum §3 sier «Viser målingen at Haiku ikke holder på uttrekket, er oppgraderingen én linje». §11 pkt. 17 og `[ÅPENT]` i FR-8 sier «Avgjøres av første måling», og den første målingen er fra 26.10. §11 pkt. 15 sier «Vurderes etter M1», men M1 var 20.11. §9.6 oppgir dessuten at gjeldende prompt er v4 (F1 0,380), mens den beste er v3 (F1 0,409), uten å si hvorfor den svakere versjonen gjelder. En leser kan ikke se om SM-2 fortsatt er målet, om Haiku er låst, eller om tetthetstaket skal heves. *Løsning:* Legg til én linje per brutt terskel i §9.6 eller §10: *beholdes og rapporteres som brudd / endres til X fordi Y / modell endres*. Lukk eller oppdater §11 pkt. 9, 15, 16 og 17 med dato og utfall, og si i én setning hvorfor v4 er gjeldende.
- **medium** FR-11 er merket «delvis» selv om SM-8 forbyr nettopp det (§9.6 l. 1062 mot SM-8 l. 1125). SM-8 sier: «Terskelen er 0,80 over hele Gullsettet, ikke per teksttype, og et brudd rapporteres som et brudd.» Statusen oppgir bare tall per teksttype (0,865 og 0,564) og kaller det «delvis». Målingen er også en annen enn den FR-11 definerer. FR-11 krever «Samme Tekst sendt inn to ganger … målt over de seks Tekstene» (l. 369), mens statusen gjelder «selvkonsistens over fem kjøringer (8.10)» på to tekster (jf. beslutningsloggen, FR-11). Det står heller ikke om selvkonsistens er det som kjører i prod. *Løsning:* Oppgi tallet over alle seks Tekster, merk det «ikke bestått» hvis det er under 0,80, og si hvilket oppsett prod bruker.
- **medium** Avsnittstesten er «kjernen i hele kravet», men det har ingen følger når den ikke består (FR-21 l. 529; §4.6 l. 468; §9.6 l. 1072). §4.6 kaller testen «den avgjørende», og FR-21 sier «Alle seks par må bestå». Statusen er 5 av 6, med «ingen av de to er porter (AD-6)». Et «må» uten følge når det brytes, er et ønske. *Løsning:* Si i FR-21 hva som skjer når avsnittstesten eller måltesten ikke består. For eksempel: promptversjonen tas i bruk, bruddet rapporteres i DK-6, og SM-3 regnes som ikke nådd.

## Substans — sterk

Ingen pyntepersonas. De fire UJ-ene driver hver sine krav: Jonas driver fase 3b-unntaket for innlimt tekst, Oksana driver additiv visning, Jonas i UJ-3 driver avsnittstesten og Maria driver bildeinnlesingen. NFR-ene har tall (8 000 tegn, 4 MB, 20 sekunder, 320 px / 200 %), og bruksgrensene i §6.4 er tallfestet. Visjonen er knyttet til dette produktet («nekter å gi eleven svaret først»). Ingen funn.

## Strategisk sammenheng — sterk

Tesen styrer fortsatt rekkefølge og ikke-mål: Fagsamtalen er i M0 (l. 982), sammendragsknapp er et ikke-mål (§7), og motmetrikkene SM-C1 til SM-C4 er bundet til hver sin primærmetrikk. To ting skurrer.

### Funn
- **medium** Skjevhetsaksen i DK-5 og §12 er en annen enn den FR-8 måler (DK-5 l. 1247; §12 pkt. 8 l. 1173 mot FR-8 l. 305, 336). FR-8 merker Gullsettet med *fagtype* («fellesfag eller programfag»). DK-5 krever likevel at avsnittet «Mellom programområder» sier «hva det betyr for §1 om uttrekket virker dårligere på yrkesfaglige tekster», og §12 pkt. 8 sammenligner yrkesfag med studiespesialiserende. Ifølge beslutningsloggen ble aksen omformulert til fellesfag mot programfag 8.10, men DK-5 og antakelsen er ikke fulgt opp. Avsnittet kan dermed ikke skrives fra dataene PRD-en krever. *Løsning:* Endre DK-5 og §12 pkt. 8 til «fellesfag mot programfag», eller si at yrkesfagspørsmålet er ubesvart i v1.
- **lav** Motmetrikken bruker et nivå som ikke finnes (SM-C2 l. 1138 mot §9.3 l. 1002). SM-C2 sier «M2-funksjoner bygget på bekostning av M1-kvalitet», mens §9.3 sier «Det finnes ikke noe M2-nivå». *Løsning:* «Funksjoner i slakken bygget på bekostning av M1-kvalitet».

## Testbarhet — tilstrekkelig

Nesten alle FR-er har målbare konsekvenser, og runde 1 la til «Når kallet feiler» i FR-7, FR-13, FR-19 og FR-20. DK-1 til DK-6 har nå sjekkbare kriterier («Minst **fem** oppføringer», «Minst **tre** konkrete feil»). Dommen trekkes ned av to tellbare motsigelser i grunnlaget for målingene, og av at statustabellen erklærer et kriterium oppfylt som ikke er det.

### Funn
- **høy** Gullsett Faguttrykk er beskrevet med to tabeller som ikke stemmer med hverandre (FR-8 l. 309–314 mot l. 324–329). Den første tabellen gir norsk tekst 3 som «NDLA *Lyriske virkemidler*, forklarende del, ~500 av 1 000» ord og samfunnsfag som «~1 100». Den andre gir `norsk-sprakligebilder` 1 255 ord og `samfunnsfag-prisvekst` 673. Alle seks ordtall er ulike (779/794, 900/702, 661/634, 800/731). Ifølge beslutningsloggen (FR-8, 8.10) er norskteksten satt sammen av tre NDLA-artikler, så selv identiteten til tekst 3 er uklar. Budsjettet og grensen `|G|` regnes fra ordtallet, så den som skal kjøre eller etterprøve målingen, vet ikke hvilket tall som gjelder. Det er samme slags feil som tilbakemeldingen §4.1 påpekte («én sannhet per tall»). *Løsning:* Slå sammen til én tabell med fil-slug, tittel, kilde, type og ordtall slik `avsnittsdeling.ts` teller dem. Oppgi eventuelt originallengden i en egen kolonne.
- **høy** DK-3 er merket «Oppfylt», men kriteriet er ikke oppfylt i PRD-en (§9.6 l. 1044 og 1105 mot DK-3 l. 1221). DK-3 krever: «Én tabell viser hver terskel i dokumentet med målt verdi og bestått/ikke bestått. Ingen terskel i §4 mangler i tabellen.» §9.6 sier at den er den tabellen, men kolonnen «Målt mot terskel» er tom for terskler som FR-7 (to krav på 100 prosent), FR-20 (sporbarhet 100 prosent, Jaccard < 0,6), FR-27 (≤ 8 per 1 000 ord), FR-31 første punkt (100 prosent), FR-14 («null tolerert») og FR-2 (20 sekunder). Siden dokumentasjonen veier tungt i vurderingen, er en uriktig selverklæring her verre enn et åpent hull. *Løsning:* Legg til de manglende tersklene med verdi og bestått/ikke bestått, eller sett DK-3 til «Delvis» og vis til `maaling/resultater/` for resten.
- **medium** FR-8 krever en fordeling Gullsettet ikke har (FR-8 l. 316 mot tabellen l. 309–310). Kravet sier at «begge kilder skal forekomme i hvert fag», men naturfag og samfunnsfag har én Tekst hver. Ifølge beslutningsloggen er det et bevisst valg («Naturfag og samfunnsfag har én tekst hver»). Begrunnelsen ble flyttet ut, og kravet ble stående uten den. *Løsning:* «Begge kilder skal forekomme i norsk og teknologiforståelse, slik at kilden kan sammenlignes med faget holdt konstant.»
- **medium** Hva «ferdig» betyr for FR-30 er uklart (FR-30 l. 663–664; §8.1 l. 943; ordlisten l. 103; §9.6 l. 1081; §11 pkt. 15). Suno-prompten er «satt på pause», men FR-30 har betingede krav («Når Suno-prompten tilbys … Kommer den tilbake …»). §8.1 lover fortsatt «Minnevers eller Suno-prompt», og statusen er «I prod, merket «Uferdig»» uten at det står hva som er uferdig. *Løsning:* Flytt Suno-prompten til §8.2, stryk de betingede punktene, og si hva merket «Uferdig» skal fortelle eleven. Det kan være et eget punkt i FR-30.
- **lav** FR-12 har ingen grenser (l. 382). «Tekststørrelse og linjeavstand kan justeres» kan ikke testes for et intervall. *Løsning:* For eksempel «minst tre trinn for hver, fra 100 til 200 prosent».
- **lav** Noen modellkall mangler feilkrav (§5 l. 860). Listen «FR-7, FR-13, FR-19 og FR-20» dekker ikke start av Fagsamtale (FR-18, som er et eget Sonnet-kall), oppsummeringen (FR-26) eller Minnevers (FR-30). FR-29 dekker bare oversettelse. *Løsning:* Legg et «Når kallet feiler»-punkt til FR-18 og FR-30, eller si i §5 at regelen gjelder alle generatorkall.

## Scope og avgrensning — tilstrekkelig

Ikke-mål (§7), «Utenfor v1» (§8.2), «Utenfor dette FR-et» og bevisst umålte deler (FR-45, SM-11 og SM-12, «Ikke en kvalitetspåstand») er eksplisitte. Antallet åpne punkter er høyt (seks åpne spørsmål, 16 antakelser og 2 `[ÅPENT]`), men akseptabelt for et studentprosjekt to dager før kodefrys, særlig fordi de fleste er ærlige. To hull trekker ned.

### Funn
- **medium** Ukrainsk vises uten forbehold også i deler som ikke er målt (FR-24 l. 576, 581 mot FR-28 l. 632–634). Et Kvalitetssikret språk vises «uten forbehold» i «Aktivering, avsluttende oppsummering og forklaring av Faguttrykk og språklige bilder». FR-28 måler aktiveringssiden og oppsummeringen, og den eksterne vurderingen gjelder «oversatte oppsummering». Forklaringene av Faguttrykk og språklige bilder på ukrainsk (FR-27) er ikke målt, men vises som kvalitetssikret. Det bryter prinsippet PRD-en selv setter i FR-45: «En funksjon kan tilbys uten å være målt, så lenge det står hvilken av de to den er.» *Løsning:* Utvid FR-28 til å omfatte et utvalg forklaringer, eller la forklaringene bære Modellstøttet-merknaden også for ukrainsk.
- **medium** Krav utenfor FR-serien har verken milepæl eller status (§6.4 l. 918; §5 l. 860; §6.2 l. 880 mot §9.6). Bruksgrensene («høyst **5 nye Tekster** og … **5 Fagsamtaler** per døgn», «**30 kroner**») ble lagt til i runde 1 som et krav, men har ingen ID og står ikke i §9.6. Det samme gjelder varselet «Før første innsending». Planleggingen kan ikke se om de er bygget. Til sammenligning: 30 kr per døgn tømmer semesterrammen på 300–600 kr på 10–20 døgn. *Løsning:* Gi bruksgrensene en FR-ID, eller legg en rad for «Tverrgående krav» inn i §9.6 med status. Si også i én setning hvordan døgntaket forholder seg til semesterrammen.

## Brukbarhet for neste fase — tilstrekkelig

Ordlisten er nå komplett for det tilbakemeldingen etterlyste: «Avsnitt» er definert (l. 86), og Gullsettene har faste navn (l. 110). ID-ene er unike, UJ-ene har navngitte hovedpersoner, og §0 forklarer nummerhullene. Kravene kan stort sett hentes ut uten å lete. Det som trekker ned, er gjenværende motsigelser og at det varierer om gamle nummer står i parentes.

### Funn
- **medium** Minnevers skal både bygges sist og ligge i M1 (§4.8 l. 653 mot §9.2 l. 998). §4.8 sier «Funksjonen ligger nederst i kuttrekkefølgen i §9 og skal bygges sist.» §9.2 sier «**Minnevers ligger i M1, ikke sist.**» En story eller epic som hentes fra §4.8, får feil prioritet. *Løsning:* Stryk den siste setningen i §4.8-beskrivelsen, eller vis til §9.2.
- **lav** Gamle FR-nummer står i parentes etter DK-ID-ene noen steder, men ikke andre. Det gjelder «DK-5 (FR-42)» (l. 337, 998, 1173), «DK-1 (FR-38)» (l. 980), «DK-2 (FR-39)» (l. 996), «DK-6 (FR-43)» (l. 998) og «DK-1 til DK-6 (FR-38 til FR-43)» (SM-6 l. 1119), men ikke l. 338, 532 og 535. *Løsning:* La det gamle nummeret stå bare i DK-overskriftene og i §0, §9.6 og §13.
- **lav** SM-9 og demoløypen sier ulike ting om hva som testes på telefon (SM-9 l. 1128 mot §9.5 steg 12 l. 1033). SM-9 sier «steg 1–7», mens demoløypen sier «Gjenta steg 2–8 på telefon», altså med Fagsamtalen. *Løsning:* Velg ett av de to.

## Formtilpasning — sterk

En elevapp med betydelig UX bør ha UJ-er med navngitte hovedpersoner, og det har den. Formen er bedre enn i forrige runde: dokumentasjonsleveransen har fått sin egen form (DK med sjekkbare kriterier), og FR-46 står igjen som produktkrav.

### Funn
- **lav** Noen FR-er bærer UX- og implementasjonsdetaljer og datamigrering (FR-6 l. 258–263; FR-17 l. 453–456; FR-48 l. 833). Eksempler er `<input type="range">`, `aria-valuetext`, «Fra 760 px har øvekortsiden et eget oppsett», «Den lagrede verdien for «Har kontroll» er `kan`», «Eldre merker vises med de nye navnene uten migrasjon» og «Tekster fra før 17.11.2026». §4.12 sier at utseende og oppførsel står i EXPERIENCE.md. PRD-en er fortsatt ca. 19 200 ord, mot ca. 21 000 da tilbakemeldingen ble gitt, og slike detaljer er en del av grunnen. *Løsning:* Behold det testbare («alle tre trinn kan velges med mus, berøring og tastatur»). Flytt widget-valg, piksler og lagrede koder til EXPERIENCE.md eller arkitekturen, og migreringen til beslutningsloggen.

## Mekaniske notater

- **ID-kontinuitet.** FR-1 til FR-53 er unike. FR-32 til FR-34 er trukket tilbake, og FR-38 til FR-43 er flyttet til DK-1 til DK-6, begge deler forklart i §0, §4.9, §4.11 og §13. Rekkefølgen følger funksjonsgrupperingen (FR-44 og FR-45 i §4.1, FR-50 til FR-52 før FR-35), og det er greit. DK-1 til DK-6, SM-1 til SM-13, SM-C1 til SM-C4 og UJ-1 til UJ-4 er sammenhengende.
- **Brutte kryssreferanser.** Antakelsen i FR-27 (l. 623) viser til «tetthetsbudsjettet i FR-9», men budsjettet står i FR-7 (FR-9 har bare en henvisning dit). `[ÅPENT]` i FR-7 (l. 285) sier «Avklares mot Gullsettet» uten navn. Det skal være Gullsett Faguttrykk. I addendum §3 (l. 66) står fortsatt «FR-42 om skjevhet» (nå DK-5).
- **Antakelsesregisteret, begge veier.** Tre innebygde `[ANTAKELSE]` mangler i §12: DK-1 l. 1195 («jevn oppdatering»), DK-4 l. 1230 («gjennom hele semesteret») og DK-4 l. 1233 («hvor mange tester i appen»). Omvendt har §12 pkt. 5 (FR-3, fase 3b er verdt friksjonen) og pkt. 6 (§4.7, kontrollkilde) ikke noe innebygd merke. Pkt. 6 er bekreftet og bør merkes trukket tilbake, som pkt. 12 og 13. `[ESTIMAT …]` (l. 917) er et merke som ikke finnes i konvensjonen i §0.
- **Ordlisten.** Den er konsekvent i kravteksten. «Gullsettet» uten navn står i FR-7 l. 285 og SM-8 l. 1125 (der det er klart av sammenhengen).
- **Frontmatter.** `updated: 2026-11-25` og `status: draft` stemmer med at dette er et utkast i runde 2.
- **Utenfor PRD-en, men lest av agenter.** `AGENTS.md` i repoet sier at PRD-en har «43 funksjonskrav». Det stemmer ikke lenger (FR-1 til FR-53 med 9 numre ute, pluss DK-1 til DK-6). Notert, ikke vurdert.

## Oppfølging av tilbakemeldingen

| Punkt i `tilbakemelding-prd.md` | Løst? | Belegg |
|---|---|---|
| §4.1 Motsigelser etter siste endringer (runde 1) | delvis | Alle seks navngitte er rettet: UJ-1 går fra Aktivering rett til Lesevisning (l. 58), SM-7 sier 85 % (l. 1123), §6.4 og §11 pkt. 11 sier `claude-haiku-5-5`, FR-32 er ute av §6.4, og frontmatter og §8.1 er rettet. Men forslaget om «én sannhet per tall» er ikke gjennomført helt: de to Gullsett-tabellene i FR-8, §4.8 mot §9.2, DK-5 mot FR-8 og SM-C2 «M2». |
| §4.2 Dokumentet er også en endringslogg | ja | FR-7, FR-8, FR-11 og DK-2 har nå krav, konsekvenser og én «Hvorfor», og historikken ligger i `beslutningslogg-prd.md` (490 linjer, sporet per FR). Små rester: datomigrering i FR-6 (l. 258, 260) og datoene i SM-13-merknaden (l. 1133). |
| §4.3 KI-feil og kostnad i drift (runde 1) | ja | «Når kallet feiler» står i FR-7 (l. 296), FR-13 (l. 402), FR-19 (l. 499, med «Svaret ditt er lagret») og FR-20 (l. 513). §5 har «KI-feil er ikke blindveier», og §6.4 har bruksgrenser per konto og døgn. FR-18 og FR-30 mangler fortsatt feilkrav. |
| §4.4 Dokumentasjonskrav i egen nummerserie | ja | §13 har DK-1 til DK-6 med «Sjekkbare kriterier», for eksempel «Minst **fem** oppføringer har status forkastet eller vesentlig endret» (DK-1). FR-46 står igjen som produktkrav i §4.11. |
| §4.5 Kuttrekkefølge og status | ja | §9.6 har tabellen «Krav \| Milepæl \| Status \| Målt mot terskel» for alle FR-er, også FR-12, FR-37 og FR-46, og for alle DK-er. Bruksgrensene i §6.4 og andre tverrgående krav er ikke med. |
| §5 ID-er | ja | §0 (l. 16) forklarer de tilbaketrukne og flyttede numrene. FR-46 står alene i §4.11, og plasseringen av FR-44 og FR-45 følger grupperingen. |
| §5 Ordlisten: «Avsnitt» og Gullsett-navn | ja | «Avsnitt» er definert i §3 (l. 86), og de fem Gullsettene har faste navn (l. 110). Én navnløs «Gullsettet» står igjen i FR-7 l. 285. |
| §5 Antakelser: `[ÅPENT]`, pkt. 5, tilbaketrukne punkter | delvis | `[ÅPENT]` i FR-7 og FR-8 står nå i §11 pkt. 16 og 17, og §12 pkt. 5 er oppdatert etter FR-3. Men pkt. 12 og 13 står fortsatt nummerert som «Trukket tilbake», og registeret går ikke opp begge veier (se Mekaniske notater). |
| §5 Åpne spørsmål besvart i FR-ene | ja | §11 pkt. 7 («Avklart … spesifisert i FR-7») og pkt. 10 («Avklart: FR-2 …») er strøket og merket avklart. |
| §5 Ingen sensitive opplysninger | ja | Fortsatt ingen funnet. Personene i UJ-ene er oppdiktet, og invitasjonskoden er bare nevnt som navn på en miljøvariabel. |

**Sum:** 8 ja, 2 delvis, 0 nei. Tilbakemeldingen §6 sa at to ting kunne vente, rettstilstanden (§11 pkt. 12) og en ny Covered Models-sjekk (§11 pkt. 11). Begge er fortsatt åpne og bør tas før innlevering 4. desember.
