---
title: KI-logg — Lesevenn
status: løpende
created: 2026-09-25
updated: 2026-10-26
---

# KI-logg

Løpende logg over hvordan KI er brukt i utviklingen av Lesevenn, ført etter kravet i PRD §4.11, FR-38. Skilles fra Promptregisteret, som gjelder appens egne kjøretidsprompter. Promptene selv, ordrett og med tidspunkt, står i [`promptlogg.md`](promptlogg.md); denne loggen er vurderingen av dem.

**Hver oppføring skal ha:** hva jeg ba om, hvilket verktøy og hvilken modell, hva som kom tilbake, og hva jeg gjorde med det — godtatt, endret eller forkastet, med begrunnelse.

**Kravet i FR-38:** minst fem oppføringer der KI-forslaget ble forkastet eller vesentlig endret, med begrunnelsen. En logg som bare viser treff dokumenterer flaks, ikke kvalitetssikring.

---

## 2026-09-25 — Planlegging: product brief → PRD

**Verktøy:** Claude Code (Claude Opus 5), med planleggingsoppsettet `bmad-prd`.

**Hva jeg ba om:** å gjøre `product-brief-lesevenn.md` om til en PRD, med beskjed om å presse hardt på fem underspesifiserte områder: hva som gjør oppfølgingsspørsmålet i fagsamtalen «relevant» som testbart krav, hvilke morsmål v1 støtter og hva som er fallback, feilmåter ved PDF-parsing, hva «presis nøkkelorduttrekking» betyr konkret, og minimumsnivået for at v1 er ferdig.

**Hva som kom tilbake:** en PRD på 43 funksjonskrav, et addendum med teknologivalg og forkastede alternativer, og tre gjennomganger av dokumentet — en kvalitetsrubrikk, en avstemming mot briefen, og en adversarisk gjennomgang av omfang og målbarhet.

**Hva jeg gjorde:** Jeg godtok strukturen og de fem utdypingene. Den viktigste enkeltbeslutningen jeg godtok, var prinsippet om at ingen kvalitetspåstand teller uten måling mot et fast testsett — det ble bærende for hele §4.11.

**Vurdering:** Dette var et nyttig utgangspunkt, men det fulgte flere utfordringer som måtte rettes, som kan sees under. 

---

## 2026-09-25 — ENDRET: målgruppen var feil i hele dokumentet

**Hva som kom tilbake:** hele PRD-en var skrevet for ungdomstrinnet — definisjonen av Faguttrykk, nivået på forklaringene, testsettets tekster, tonekontrollen («ville truffet en fjortenåring dårlig»), og begge brukerreisene, der hovedpersonen gikk i 10. klasse.

**Hva jeg gjorde:** Jeg innså at KI antok at denne appen skulle brukes av ungdomsskole-elever, trolig pga. referanse til PISA, noe som satte et feil premiss for hele prosjektet. Målgruppen er videregående, Vg1–Vg3, altså 15–19 år, og jeg ba KI om å endre dokumenter med hensyn til dette. 

**Begrunnelse og hva det avslørte:** briefen sa aldri nivået direkte — den bygger på PISA-tall for 15-åringer på 10. trinn, og modellen leste det som at målgruppen var ungdomsskolen. Det er en ubegrunnet antakelse som ikke ble merket som antakelse noe sted, og som deretter forplantet seg til elleve steder i dokumentet, inkludert definisjonen som hele presisjonsmålingen i FR-8 hviler på. Dette er den mest lærerike feilen fra økten: utdataet var internt konsistent og virket gjennomarbeidet, og det er nettopp derfor feilen var vanskelig å se. Et dokument kan være sammenhengende og likevel bygget på noe som ikke stemmer.

**Konsekvens:** elleve rettelser i PRD-en, testsettets tekstlengde justert fra 1 000–4 000 til 1 500–6 000 tegn, og et nytt åpent spørsmål om hvorvidt tetthetstaket i FR-7 fortsatt er riktig kalibrert når tekstene er tettere på fagspråk.

---

## 2026-09-25 — ENDRET: testsettet dekket bare ett programområde

**Hva som kom tilbake:** etter nivåkorreksjonen var testsettet seks tekster fordelt på tre fellesfag, uten hensyn til programområde.

**Hva jeg gjorde:** Jeg presiserte at både studiespesialiserende og yrkesfag er en del av målgruppa.

**Begrunnelse:** Jeg tenkte at det er godt mulig at disse to retningene trolig har litt forskjellige tekster, hvor studiespess trolig har mer teoretiske, vil det kanskje være mye mer "spisset" fagterminologi på yrkesfag. 

**Konsekvens:** testsettet ble omstrukturert til en full krysning, tre fellesfag × to programområder = seks tekster, én per celle. Antallet seks er nå begrunnet i strukturen framfor å være et anslag. Definisjonen av Faguttrykk ble utvidet til å dekke yrkesfagterminologi. Viktigst: det ga FR-42 en tredje skjevhetsakse — akademisk fagspråk er bedre representert i modellens treningsdata enn yrkesfaglig terminologi, så verktøyet kan virke dårligst der lesestøttebehovet er størst.

---

## 2026-09-25 — FORKASTET RÅD: Mapper beholdt som betinget

**Hva som kom tilbake:** den adversariske gjennomgangen anbefalte å kutte Mapper-funksjonen umiddelbart, ikke beholde den som betinget, med argumentet at samlet fagsamtale (FR-34) krever forankring på tvers av flere tekster og dermed ugyldiggjør testsettet i FR-21, som gjelder én tekst.

**Hva jeg gjorde:** forkastet anbefalingen. Mapper beholdes som betinget M2-mål.

**Begrunnelse:** Mapper er ett av to funksjonelle suksesskriterier i briefen. Jeg vil ikke kutte det før jeg vet om tiden faktisk mangler, og et kutt tatt nå er et kutt jeg ikke kan angre.

**Konsekvens:** den underliggende innvendingen var reell, så den ble tatt inn som åpent spørsmål 8 med krav om svar *før* Mapper bygges, og SM-11 ble lagt til slik at et eventuelt kutt registreres som et kutt framfor å forsvinne sammen med metrikken.

---

## 2026-09-25 — FORKASTET RÅD: fagsamtalen lagt i M0 i full form

**Hva som kom tilbake:** anbefalingen var å holde M0 minimal og legge fagsamtalen i M1, fordi M0 alt var den milepælen som mest sannsynlig skrider ut, og fagsamtalen er den dyreste funksjonen i dokumentet.

**Hva jeg gjorde:** Jeg valgte bort anbefalingen og la fagsamtalen i M0 i full form.

**Begrunnelse:** For meg virker det som at mye av egenarten i denne appen er nettopp fagsamtalene, og at uten den så vil man både kunne få et litt enkelt prosjekt, men også et produkt som ligner på mye annet som finnes fra før. En minimumsversjon som ikke kan demonstrere prosjektets egen tese er ikke et minimum — det er et annet produkt.

**Konsekvens:** M0 flyttet fra 23. til 30. oktober, og *målingene* av fagsamtalen flyttet til M1. M0 bygger funksjonen, M1 beviser den. Dette var en byttehandel, ikke en gratis beslutning, og den er verdt å vurdere på nytt om M0 skrider ut.

---


## 2026-09-27 — FORKASTET RÅD: opprinnelig omfang for tekstinnlesing

**Verktøy:** Claude Code (Claude Opus 5), planleggingsøkt.

**Hva som kom tilbake:** PRD-en utelukket bildeinnlesing og tekstgjenkjenning fra v1, med begrunnelsen at det er «en egen kvalitetskjede med egne feilmåter». Begge inngangene som var med — innliming og PDF — forutsetter markerbar tekst.

**Hva jeg gjorde:** Jeg innså at det kunne være dumt å kutte innlesninger av bilder, siden det er mange elever som kun har fysiske bøker. Bildeinnlesing ble lagt inn i v1 (FR-44, FR-45), og Mapper tatt ut for å gi plass.

**Begrunnelse og hva det avslørte:** to ting kom fram. For det første var den tekniske begrunnelsen utdatert: appen bruker allerede en multimodal modell, så bildeuttrekk er det samme API-kallet med en bildeblokk — ikke en ny pipeline. Modellen hadde resonnert som om tekstgjenkjenning måtte være en separat OCR-motor. For det andre manglet PRD-en en antakelse den var helt avhengig av: at eleven i det hele tatt får teksten inn. Den sto ikke i antakelsesregisteret, og uten bildeinngang er appen ikke tungvint for papirbok-elever — den er ubrukelig.

**Konsekvens:** FR-44 og FR-45 lagt inn med fem navngitte feiltilstander, umålt og tydelig merket. FR-32 til FR-34 (Mapper) trukket tilbake, numrene gjenbrukes ikke. M2 erstattet av en stabiliseringsuke. Ny brukerreise UJ-4 for en elev med papirbok, som erstattet mappereisen. To nye antakelser i registeret.

---

## 2026-09-27 — ENDRET: etikk rundt datahåndtering var for tynt dekket

**Hva som kom tilbake:** PRD-ens opphavsrettsdel besto av to kulepunkter, og personverndelen sa at appen opplyser om at teksten sendes til en ekstern leverandør — men stilte ingen krav til hva leverandøren gjør med den.

**Hva jeg gjorde:** tok opp problemstillingen selv, og ba om at det ble skrevet ordentlig ut.

**Begrunnelse:** appen tar imot opphavsrettsbeskyttet lærebokstoff og sender det til en kommersiell tredjepart. Dette måtte undersøkes, for å ikke legge alt ansvar over på elevene, men passe på at opphavsrett og personvern blir ivaretatt.

**Konsekvens:** §6.2 fikk et leverandøruavhengig krav — inndata skal ikke brukes til trening, behandlingsstedet skal være kjent, vilkårene skal være lest og datert. §6.3 ble utvidet med hva designet faktisk gjør (tegngrense, bildegrense, forbud mot korpusbygging, bilder lagres ikke) og hva det ikke løser (ansvarsforskyvning, grensene for samtykke fra mindreårige). FR-42 fikk en fjerde skjevhetsakse om datakjeden. To nye åpne spørsmål: hvilken leverandør som oppfyller kravet, og hva avtaleverket for skoleverket faktisk tillater.

**Merknad om KI-ens rolle her:** modellen kjente ikke saken jeg refererte til, og ville ikke spekulere om en navngitt person. Den avviste også å slå fast innholdet i åndsverkloven eller Kopinor-avtalen, og la det inn som et åpent spørsmål jeg må undersøke med en lest kilde. Det er en grense verdt å merke seg: den kunne strukturere problemstillingen, men ikke avgjøre rettsspørsmålet.

---


## 2026-09-30 — ENDRET: leverandørgrense tvang om to krav

**Verktøy:** Claude Code (Claude Opus 5), arkitekturfasen.

**Hva jeg ba om:** avklaring på om Vercels gratisplan holder, eller om jeg må kjøpe Pro til 20 dollar i måneden.

**Hva som kom tilbake:** gratisplanen holder med god margin — 300 sekunders kjøretid er samme standardgrense som Pro. Men samme dokumentasjon avdekket at maks størrelse på en forespørsel er 4,5 MB, mens PRD-en tillot 10 MB PDF og 8 MB per bilde.

**Hva jeg gjorde:** godtok å endre begge kravene.

**Begrunnelse:** feilen ville oppstått i drift og ikke lokalt, sannsynligvis først i november, med en feilmelding som ikke sier hva som er galt. Den vanlige løsningen — laste opp direkte til objektlager — var stengt av prosjektets eget forbud mot å lagre binærdata (AD-16).

**Konsekvens:** PDF-er parses nå i nettleseren og sendes aldri til serveren; bilder krympes i klienten. FR-2, FR-44 og AD-16 endret. Sidegevinst: personvernposisjonen ble sterkere enn den var, siden PDF-filen aldri forlater elevens maskin — verdt å bruke i drøftingen av §6.3.

**Merknad om KI-ens rolle:** modellen hadde i forrige økt oppgitt tidsgrensen som usikker og bedt meg sjekke selv. Det var riktig — søketreffene den fant først anga 10 til 60 sekunder, mens dokumentasjonen sier 300. En modell som sier «dette klarte jeg ikke å pinne» er mer nyttig enn en som gjetter.

---

## 2026-09-30 — GODTATT MED FORBEHOLD: leverandør av språkmodell

**Verktøy:** Claude Code (Claude Opus 5), arkitekturfasen.

**Hva jeg ba om:** anbefaling av LLM-leverandør og skyleverandør.

**Hva som kom tilbake:** for skyleverandør en tydelig anbefaling om Vercel med begrunnelse. For LLM-leverandør **erklærte modellen en interessekonflikt**: den er laget av Anthropic og kunne derfor ikke gi et upartisk råd om hvilken modell som er best til norsk. I stedet ga den kriteriene — strukturert utdata, multimodalitet, modellnivåer, datavilkår — og påpekte at jeg kan avgjøre spørsmålet empirisk: gullsettet i FR-8 er seks annoterte tekster, og AD-1, AD-3 og AD-7 gjør at samme prompt kan kjøres mot to leverandører og sammenlignes i én målekjøring.

**Hva jeg gjorde:** godtok framgangsmåten, ikke et leverandørnavn. Starter på Anthropic for M0, og sammenligner mot minst én annen leverandør før M1 med gullsettet som grunnlag.

**Begrunnelse:** norsk er et lite språk med rundt fem millioner brukere, og modellkvaliteten varierer mer for norsk enn for engelsk. Ukrainsk til FR-28 likeså. Ingen offentlig benchmark svarer på dette for mitt bruk, men mitt eget testsett gjør det. Å måle framfor å velge på magefølelse er dessuten et sterkere argument i refleksjonsrapporten, og det er ett av få steder der arkitekturvalgene faktisk gjorde noe mulig.

**Konsekvens:** åpent spørsmål 11 i PRD §11 er delvis besvart — leverandør for M0 er valgt, men kravene i §6.2 om treningsbruk, behandlingssted og daterte vilkår må fortsatt dokumenteres. Sammenligningen før M1 er en egen oppgave i planen.

**Merknad verdt å ta med i refleksjonsrapporten:** at modellen selv flagget interessekonflikten framfor å anbefale sin egen leverandør, er en observasjon om hvor KI var til å stole på og hvor jeg måtte ta over. Den motsatte oppførselen — en umerket anbefaling av eget produkt — ville vært vanskelig å oppdage.

---

## 2026-10-02 — FANGET KI-FEIL: en bekreftelse som hvilte på feil grunnlag

**Verktøy:** Claude Code (Claude Opus 5), arbeid med §6.2-dokumentasjonen.

**Hva jeg ba om:** jeg hadde selv lest forbrukervilkårene og API-dokumentasjonen om datalagring, og ba om en vurdering av om jeg hadde forstått dem riktig. Jeg trodde at mitt private Pro-abonnement gjorde at dataene mine kunne brukes til trening.

**Hva som kom tilbake:** modellen rettet lesningen min — forbrukervilkårene sier selv at de ikke dekker API-nøkler, og at Commercial Terms gjør det. To separate avtaleforhold med samme selskap, avgrenset etter aktivitet og ikke etter konto. Den flagget også et åpent punkt jeg ikke hadde sett: «Covered Models» krever 30 dagers lagring, så unntaket kan gjelde modellen jeg velger.

**Hva jeg gjorde:** spurte om det virkelig var så tydelig at all data faller inn under Commercial Terms i det øyeblikket man bruker et API.

**Hva det avdekket:** modellen hadde **karakterisert Commercial Terms ut fra hva forbrukervilkårene sier om dem**, uten å ha lest Commercial Terms selv. Konklusjonen var sannsynligvis riktig, men grunnlaget var et dokument som uttalte seg om et annet dokument. Den skilte heller ikke klart nok mellom to ulike spørsmål: hvilket avtaledokument som gjelder, og hvordan data faktisk behandles. Det andre besvares av lagringsdokumentasjonen, ikke av vilkårenes virkeområde.

**Hvorfor dette er den mest lærerike oppføringen så langt:** det er samme feilmønster som CVE-begrunnelsen i AD-8 — en påstand som er riktig, men som hviler på et grunnlag som ikke bærer den. Den typen feil er vanskeligere å oppdage enn en gal påstand, fordi den framstår like sikker. Og den ble bare funnet fordi jeg stilte et oppfølgingsspørsmål framfor å ta bekreftelsen til etterretning.

Modellen hadde dessuten selv erklært at den ikke burde være kilde på Anthropics vilkår, siden den er laget av Anthropic. Den gikk likevel ett skritt lenger enn grunnlaget tillot da jeg spurte direkte. Verdt å merke seg: en erklært interessekonflikt fjerner ikke risikoen for at svaret blir for sikkert.

**Gjenstår å undersøke selv:**

1. Commercial Terms sin egen virkeområde-klausul — ikke bare hva forbrukervilkårene sier om den
2. Om modellen jeg bruker er en «Covered Model» med 30 dagers lagring
3. Hva treningsinnstillingen på mitt eget Pro-abonnement står på — den styrer utviklingssamtalene, ikke appen, men det hører i det ærlige bildet av hvordan prosjektet ble til

Alle tre skal inn i addendumets seksjon om leverandørvilkår, med URL og dato.

## 2026-10-02 — FUNN I VERKTØYET: innstillingen jeg ikke fant

**Verktøy:** Claude Code og claude.ai, egne kontoinnstillinger.

**Hva jeg forsøkte:** å slå av trening på mine egne samtaler, og å korte ned oppbevaringstiden på Claude Code-sesjonstranskripsjoner. Forbrukervilkårene sier at trening skjer «unless you opt out of training through your account settings», og lagringsdokumentasjonen sier seks år «by default» med henvisning til en innstilling under organisasjonsinnstillinger.

**Hva som skjedde:** jeg fant ingen av dem, til tross for grundig leting. Ordlyden i lagringsdokumentasjonen peker mot organisasjonskontoer, og jeg har en individuell Pro-konto.

**Hva jeg gjorde med det:** skrev det inn i refleksjonen som et funn framfor å la det stå som et hull i teksten. Spørsmålet jeg endte med er: er det ikke litt uetisk å framstille noe som et valg, men gjøre det lite tilgjengelig?

**Hvorfor dette hører i KI-loggen og ikke bare i rapporten:** det er en observasjon om verktøyet prosjektet er bygget med, gjort under arbeidet, og den er etterprøvbar — en annen kan forsøke det samme. Den sier dessuten noe om grensen for hvor mye kontroll man faktisk har over KI-assistert utvikling, som er noe annet enn hvor mye kontroll vilkårene beskriver.

**Gjenstår:** å undersøke om innstillingene finnes for individuelle kontoer i en annen form, eller bare for organisasjoner.

## 2026-10-07 — FANGET AV MENNESKE: PRD-en manglet et krav som teller 10 prosent

**Verktøy:** Claude Code (Claude Opus 5), hele planleggingsfasen — brief, PRD og arkitekturspine.

**Hva jeg ba om:** en PRD med testbare krav og realistisk omfang, og senere en arkitekturspine rettet mot bygging.

**Hva som kom tilbake:** 42 funksjonskrav med gullsett og tallfestede terskler, kuttrekkefølge, motmetrikker, og 17 bindende invarianter. Emneansvarlig kalte planleggingen «svært grundig» i tilbakemeldingen sin.

**Hva som avdekket feilen:** tilbakemelding fra emneansvarlig 6. oktober. Sensorveiledningen for del 1 har «README og kjørbarhet» som eget kriterium med 10 prosent vekt, formulert som at løsningen skal kunne kjøres lokalt uten gruppens nøkler eller betalte kontoer. PRD-en hadde **ingen** funksjonskrav for det. Appen kunne i praksis bare kjøres av meg: hvert eneste steg i kjerneløypen er et kall til et betalt API, oppå en database som ligger i en skytjeneste på min konto.

**Hvorfor dette er den mest lærerike oppføringen i loggen så langt:** feilen er ikke en gal påstand, men et **fravær**. Alle kvalitetsmekanismene i PRD-en — gullsettene, tersklene, motmetrikkene, regelen om at en modells egen vurdering ikke er bevis — måler om det som *står der* holder. Ingen av dem spør om noe mangler. En utelatelse gir ingen advarsel: det finnes ingen setning å være uenig i.

Verdt å merke seg at tre gjennomganger av PRD-en og tre av arkitekturspinen heller ikke fanget det. Gjennomgangene vurderte dokumentet mot seg selv og mot rubrikken de fikk oppgitt — ikke mot sensorveiledningen, som jeg ikke hadde gitt dem. Modellen kan holde et dokument internt konsistent, men den kjenner bare de kravene jeg har nevnt. Det er samme mønster som oppføring 5, bare med et vurderingskriterium i stedet for et tilgangsproblem.

**Hva jeg gjorde:** la inn FR-46 (kjørbarhet uten prosjektets nøkler) og AD-18 (testmodus som et bytte inne i generatorlaget, over skjemavalideringen), og bygde begge: lagrede modellsvar med tre moduser, og driverbytte i `data/db.ts` slik at en lokal Postgres i Docker er samme kodebase som drift. Briefen ble samtidig oppdatert med aldersgruppe, PRD-ens måltall i stedet for de vage kriteriene, og mapper flyttet ut av v1.

**Konsekvens for refleksjonsrapporten:** dette er det konkrete eksempelet på hva KI-assistert planlegging ikke oppdager. Det er ikke at modellen tar feil — den var presis på alt den ble gitt grunnlag for. Det er at *grunnlaget* var mitt ansvar, og at en grundig plan bygget på et ufullstendig grunnlag ser like overbevisende ut som en fullstendig.

---

## 2026-10-14 — ENDRET: mitt prioriteringsprinsipp inn i prompten for fagord

**Verktøy:** Claude Code (Claude Opus 5.5). Appens uttrekk: claude-haiku-5-5.

**Hva jeg ba om:** etter at runde 1 av gullsettet var annotert, limte jeg inn notatet jeg skrev før annoteringen, om tvil («ikke ta med») og prioritering («begreper som går igjen mange ganger og er viktige», «sentrale fagbegreper som ikke blir forklart»). Senere: «Okei, vi må forfremme v3 da, men burde vi gjøre noe annet: revurdere kravene eller finspisse enda mer og lage en v4?»

**Hva som kom tilbake:** påpekningen at prioriteringsprinsippet mitt ikke sto i prompten, altså at modellen og jeg ble målt mot ulike regler. Prompt v3 med prinsippet ble laget og målt over tre kjøringer: presisjon 0,42 → 0,46, gjenkalling 0,36 → 0,38 (ingen sikker forskjell). FR-8 er ikke nådd.

**Hva jeg gjorde:**  Jeg la til nye mål for hvilke begrep som skulle velges. 

**Begrunnelse:** Jeg måtte prøve å finne en måte å systematisere hvilke valg jeg skulle ta dersom jeg fikk for mange begrep i en tekst. Dette hadde ikke blitt sagt mens testen ble utformet, og det måtte da lages en ny versjon, slik at vi gjorde målingene på samme grunnlag. 

**Spor:** [promptlogg 14.10](promptlogg.md) · REGISTER, Faguttrykk v3 · commit `4e881df`, `0920b8f`

---

## 2026-10-16 — KI fanget en feil selv ved iterasjon: metoden for κ kunne aldri gi et positivt tall

**Verktøy:** Claude Code (Claude Opus 5.5).

**Hva jeg ba om:** verktøyet for å måle egen annoteringsstøy (steg 5 i annoteringsveiledningen), som skulle bygges etter veiledningen fra tidlig i oktober — også den skrevet med KI.

**Hva som kom tilbake:** da formelen ble regnet ut før verktøyet ble skrevet, viste det seg at metoden i veiledningen (κ over unionen av ordene fra to runder) alltid gir κ ≤ 0. Veiledningen hadde i tillegg en «begrensning» som pekte feil vei («overvurderer samsvaret noe»). Rettet til positivt samsvar som hovedtall og κ over alle ordformer, med en test som beviser feilen.

**Hva jeg gjorde:** Jeg godtok endringen som KI-en pekte på som en feil.

**Begrunnelse:** Dette var nødvendig for at det skulle være vits å gjennomføre testen. 

**Spor:** [kodefunn 12](kodefunn.md) · annotering.md §5 · commit `86c8b5d`, `ac04678`

---

## 2026-10-16 — ENDRET: quizen etter at jeg fant en feil fasit

**Verktøy:** Claude Code (Claude Opus 5.5). Appens quiz: claude-haiku-5-5.

**Hva jeg ba om:** jeg testet quiz v1 og meldte blant annet: «spm: Hva er renter ifølge teksten?, svaralternativet her misforstår teksten, og sier implisitt at rentene er det samme som terminbeløp. Det ligner på det som står i teksten, men det er jo en vesensforskjell.»

**Hva som kom tilbake:** prompt v2 med krav om at det riktige alternativet skal bety det samme som teksten, og at to spørsmål ikke spør om det samme. Demoquizen ble laget på nytt. Umålt; observasjonen etterpå var flere faktaspørsmål, som følges opp i M1.

**Hva jeg gjorde:** Jeg testet en quiz som ble laget etter at en tekst ble lagt inn. Jeg observerte at det var feil i quizen, hvor den hadde blandet begreper, og definer renter som terminbeløp. Dette var kritisk, siden slikt kan bidra til misoppfatninger hos en elev som ikke har oversikten. 

**Begrunnelse:** Hvis quizen skal kunne brukes, må den tolke teksten riktig. 

**Spor:** [promptlogg 16.10 kl. 10:39](promptlogg.md) · REGISTER, Quiz v2 · commit `d027947`, `81162ec`

---

## 2026-10-16 — ENDRET: fagsamtalen etter min egen testing

**Verktøy:** Claude Code (Claude Opus 5.5). Appens fagsamtale: claude-sonnet-5-5.

**Hva jeg ba om:** jeg testet fagsamtale v1 med seks tilfeller og meldte blant annet at et riktig svar ble vurdert som delvis, og at trøsten «Det går fint å ikke vite, for avsnitt 7 beskriver …» knyttet trøsten til teksten. Avsluttet med: «Nå vil jeg at du skal ta kontroll og evaluere og bruke disse resultatene til å bygge videre.»

**Hva som kom tilbake:** årsaken til det første funnet var at startspørsmålet egentlig var to spørsmål («… og hvorfor»). Prompt v2: ett spørsmål om én ting, ingen avsnittsnumre i vurderingen, «dekkende» krever poenget men ikke tekstens ordlyd, trøsten står for seg selv. Samme tilfeller på nytt: delvis ble dekkende. Dobbeltspørsmål i 1 av 3 startspørsmål, så koden fikk tre forsøk.

**Hva jeg gjorde:** Jeg testet fagsamtale-verktøyet, og kom med tilbakemeldinger som jeg ønsket at KI skulle utbedre på bakgrunn av. Når jeg hadde gjort dette testet jeg ut å la KIen ta seg av all utrulling av denne delen, uten å måtte spørre om ulike godkjennelser. Dette var noe som var interessant å teste ut, da det la mer ansvar på KI, men innenfor et område som jeg allerede hadde formet. 

**Begrunnelse:** Det er noe som jeg opplever er i tråd med det som blir undervist, og da var det artig å teste ut det. 

**Spor:** [promptlogg 16.10 kl. 15:47](promptlogg.md) · REGISTER, Fagsamtale v2 · commit `9d74c1e`, `61d8ea3`

---

## 2026-10-17 — FANGET AV MENNESKE: «hva tenker du at et minnevers er?»

**Verktøy:** Claude Code (Claude Opus 5.5). Appens minnevers: claude-haiku-5-5.

**Hva jeg ba om:** under vurderingen av minnevers v1: «Og hva tenker du at et minnevers er?»

**Hva som kom tilbake:** v1 hadde bestått alle maskinelle kontroller (10 av 10), men versene var rimfrie oppsummeringer med linjer på opptil 25 stavelser. Prompt v2 med korte linjer, parrim og rytme, en kodegrense på 14 stavelser, og et nytt punkt på vurderingsarket: «fungerer som huskeregel».

**Hva jeg gjorde:** Jeg vurderte det som at minneversene ikke var til så mye hjelp, fordi de var lange og "kjedelige", det var ingenting i dem som hjalp meg å huske ting. 

**Begrunnelse:** Vi prøvde å gjøre minnevers om til noe som er lettere å huske, og satte derfor regler til lengde og rim.

**Spor:** [promptlogg 17.10 kl. 08:45](promptlogg.md) · REGISTER, Minnevers v2 · commit `e7476ca`

---

## 2026-10-19 til 26 — FORKASTET: minnevers v4–v6, og arbeidet stoppet på v3

**Verktøy:** Claude Code (Claude Opus 5.5). Appens minnevers: claude-haiku-5-5, og én runde med claude-sonnet-5-5.

**Hva jeg ba om:** vurderte v3 og v4 vers for vers (v3: 0 usanne, huskeregel 6/10; v4: 0 usanne, 5/10). Deretter «prøv v5», «Kan vi prøve en gang med sonnet før vi gir oss?», «er det noen annen inngang til å løse dette?», og til slutt egne eksempelvers.

**Hva som kom tilbake:** v5 med flere regler (7/10 gjennom kontrollen, rim og fyll verre), Sonnet (1/10, tom for tokens), v6 med eksempel og kodekontroll mot rim på samme ord (9/10, vurderingen avbrutt etter vers 1). Da jeg skrev et eget vers, påpekte Claude at det jeg likte (lange linjer, fyllord med humor), var det jeg hadde trukket ned hos modellen. Fire alternativer ble lagt fram; anbefalingen var å beholde v3 og vurdere elevskrevne vers senere.

**Hva jeg gjorde:**  Jeg tok initiativ til å lage nye versjoner, og teste med andre modeller. Etter testing valgte jeg å avslutte utbedringen.

**Begrunnelse:** Jeg så at resultatet ikke var som ønsket på minneversene. De led stadig av å ikke være catchy nok, samtidig som det stadig var noen "halvsannheter" eller for "forenklede" versjoner som slapp gjennom. Dette ble ikke bedre ved videre versjoner, og det ble etter hver for tidsslukende. 

**Spor:** [promptlogg 19.–26.10](promptlogg.md) · REGISTER, Minnevers v4–v6 og avgjørelsen 26.10 · PRD §11 spørsmål 15 · commit `864818e`, `2edf5fd`, `8dccc9e`, `397a387`

---

## Status mot FR-38, per 26. oktober

Femten oppføringer der KI-forslaget ble forkastet, vesentlig endret, ikke godtatt uten uavhengig kontroll, eller der et funn om verktøyet eller om metoden kom ut av arbeidet:

| # | Oppføring | Type |
|---|---|---|
| 1 | Målgruppen var ungdomstrinnet i hele dokumentet | Ubegrunnet antakelse i utdataet, korrigert |
| 2 | Testsettet dekket bare ett programområde | Ufullstendig dekning, utvidet |
| 3 | Mapper beholdt som betinget | Anbefaling forkastet *(senere omgjort, se 5)* |
| 4 | Fagsamtalen lagt i M0 i full form | Anbefaling forkastet |
| 5 | Omfanget for tekstinnlesing | Teknisk begrunnelse utdatert, og en manglende antakelse avdekket |
| 6 | Etikk rundt datahåndtering | For tynt dekket, utvidet på eget initiativ |
| 7 | Vilkårstolkning | Bekreftelse som hvilte på feil grunnlag, fanget ved oppfølgingsspørsmål |
| 8 | Innstillinger som ikke lot seg finne | Funn om verktøyet, gjort av en oppgave som ikke lyktes |
| 9 | PRD-en manglet kravet om kjørbarhet | Utelatelse i utdataet, fanget av emneansvarlig og ikke av seks gjennomganger |
| 10 | Prioriteringsprinsippet inn i prompten for fagord | Prompt endret, så modell og annotatør måles mot samme regel |
| 11 | κ-metoden kunne aldri gi et positivt tall | Feil i KI-skrevet metode, fanget av KI i et senere steg |
| 12 | Feil fasit i quizen (renter som terminbeløp) | Feil i utdata, fanget ved egen testing |
| 13 | Fagsamtalen etter egen testing | Endret etter testing; endringer og utrulling bevisst overlatt til KI |
| 14 | «Hva tenker du at et minnevers er?» | Besto alle kontroller, men løste ikke oppgaven; fanget av menneske |
| 15 | Minnevers v4–v6, og arbeidet stoppet på v3 | Forsøk forkastet, og en avgjørelse om å stoppe |

Minimumskravet på fem ble innfridd alt i planleggingsfasen (1–9). Implementasjonsfasen (10–15) har gitt en annen type oppføringer: færre forkastede råd, flere feil i KI-utdata som bare viste seg når jeg testet selv (12, 14), og én avgjørelse om å stoppe et arbeid som ikke ble bedre (15). Feil og svakheter i KI-generert kode føres for seg i [`kodefunn.md`](kodefunn.md), som har 22 funn per 26. oktober; FR-41 krever minst tre.

**Et mønster verdt å skrive om i refleksjonsrapporten.** Oppføring 3 og 5 hører sammen: først forkastet jeg et råd om å kutte Mapper, og to dager senere kuttet jeg den likevel. Den forrige avgjørelsen var ikke feil da den ble tatt — den bygget på det jeg visste. Det som endret seg var at et tilgangsproblem kom fram som ingen av oss hadde vurdert. Det illustrerer noe om hvordan KI-assistert planlegging faktisk virker: modellen kan holde et dokument internt konsistent, men den vet bare det jeg har fortalt den, og de dyreste feilene ligger i det ingen har nevnt.

---

## Mal for nye oppføringer

```
## ÅÅÅÅ-MM-DD — [GODTATT / ENDRET / FORKASTET]: kort tittel

**Verktøy:** 

**Hva jeg ba om:** 

**Hva som kom tilbake:** 

**Hva jeg gjorde:** 

**Begrunnelse:** 

**Konsekvens:** 
```

---
