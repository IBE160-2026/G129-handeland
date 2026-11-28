# Refleksjonsrapport - Programmering med KI

<!--
ARBEIDSUTKAST 28.11.2026.
Fakta og beskrivelser er fylt ut av Claude Code ut fra repoet. Alt merket ✍️ er din egen refleksjon og står tomt med vilje.
Linjene som starter med «> 📎 Underlag:» peker på råstoff i repoet. Slett dem før levering.
Les gjennom faktadelene også: de er skrevet i din stemme, men det er du som står for dem.
-->

## 1. Gruppeinformasjon

**Gruppenavn:** G129

**Gruppemedlemmer:**
- Arve Esteban Handeland - [Student-ID]

**Dato:** [DD.MM.ÅÅÅÅ]

---

## 2. Utviklingsprosessen

### 2.1 Oversikt over prosjektet

Jeg har laget **Lesevenn**, som utad heter **LeseBuddy**. Det er en nettapp for leseforståelse for elever på videregående skole. Eleven limer inn en fagtekst, laster den opp som PDF eller fotograferer den fra boka. Deretter følger appen en fast lesestrategi i tre steg:

1. **Før lesing:** eleven ser bare overskriftene, merker hva hun kan fra før («Mye», «Litt», «Ingenting ennå», «Skjønner ikke») og skriver ett «lurer på»-spørsmål.
2. **Under lesing:** fagord i teksten er markert, og hvert av dem har en forklaring som eleven kan åpne.
3. **Etter lesing:** eleven sjekker forståelsen med quiz, øvekort og en skriftlig fagsamtale, der en språkmodell vurderer svaret hennes og stiller oppfølgingsspørsmål. Alt generert innhold viser til avsnittet i teksten det bygger på.

Appen har også morsmålsstøtte (ukrainsk er kvalitetssikret, arabisk med høyre-til-venstre-visning er modellstøttet), mapper som samler flere tekster til samme prøve, og et arbeidsbord og en landingsside.

**Hovedmålet** var å gi elever som strever med lange fagtekster, en lesevane og ikke en snarvei. PRD-en begrunner behovet med PISA 2025, der 34 prosent av norske 15-åringer lå under minimumsnivået i lesing. Et like viktig mål for meg var å *vise* at innholdet modellen lager holder mål. Prinsippet som bærer prosjektet er at ingen kvalitetspåstand teller uten måling mot et fast testsett (et *gullsett*) som jeg har laget selv.

Appen er i drift på Vercel. Koden ble frosset med git-taggen `kodefrys`.

> 📎 Underlag: [prd-lesevenn.md](prd-lesevenn.md) §1–§2, [proposal-lesevenn.md](proposal-lesevenn.md), [README](../../README.md).

### 2.2 Arbeidsmetodikk

**Oppgavefordeling.** Jeg har jobbet alene, så det var ingen fordeling mellom gruppemedlemmer. I praksis gikk fordelingen mellom meg og KI-agenten. Jeg bestemte hva som skulle lages, skrev fasitene i gullsettene, testet appen på telefon og PC og godkjente hver utrulling. Agenten skrev det meste av koden, testene og planleggingsdokumentene, og den kjørte målingene. Fremdriftsplanen regnet med 25 timer i uka og to milepæler: M0 30. oktober (kjernen bygget og målt) og M1 20. november (alt i v1 bevist).

**Verktøy for samarbeid og versjonskontroll.**
- **Git og GitHub** (`IBE160-2026/G129-handeland`). Ca. 325 commits fra 9. september til kodefrysen, de fleste i oktober og november. Større endringer ble bygget på egne grener (for eksempel `designfase`, `mapper`, `vilkaar`, `design-runde-3`) og merget til `main` etter gjennomgang og min godkjenning.
- **Sesjonslogger** i `.logs/arve/` og en liste over åpne punkter i `.logs/arve/issues.md`, etter oppsettet foreleser la inn i repoet 26. oktober.
- **Tilbakemelding fra foreleser** på product brief og PRD ([tilbakemelding-product-brief.md](tilbakemelding-product-brief.md), [tilbakemelding-prd.md](tilbakemelding-prd.md)).
- ✍️ [Hvordan fungerte dette for deg?]

**Bruk av KI i prosessen.** KI ble brukt i alle faser, fra product brief til produksjonsutrulling. Hvert steg er sporbart på tre måter:
- [promptlogg.md](promptlogg.md): alle promptene mine, ordrett og med tidspunkt. Den genereres automatisk fra øktene av en hook.
- [ki-logg.md](ki-logg.md): min vurdering av hva jeg ba om, hva som kom tilbake og hva jeg gjorde med det. Den har 26 oppføringer der et KI-forslag ble forkastet, vesentlig endret eller kontrollert uavhengig.
- [kodefunn.md](kodefunn.md): 28 feil og svakheter i KI-generert kode, med hvordan hver ble funnet og rettet.

### 2.3 Teknologi og verktøy

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript og Tailwind CSS 4.
- **Backend:** serverhandlinger i Next.js. Anthropic SDK for modellkallene, Zod for å validere at modellsvarene har riktig form, pdfjs-dist for PDF-uttrekk og Better Auth for innlogging (invitasjonskode, aldersgrense 15 år, innloggingssperre).
- **Database:** PostgreSQL med Drizzle ORM. Neon i drift (Frankfurt), Docker lokalt, og PGlite som alternativ uten Docker.
- **Språkmodeller i appen:** Claude Haiku 5.5 til fagord, quiz, oversettelse, minnevers og bildeuttrekk. Claude Sonnet 5.5 til fagsamtalen og svarvurderingen, som er den vanskeligste oppgaven. Promptene er versjonert, og bare versjonene i `prompts/gjeldende.json` tas i bruk.
- **KI-verktøy i utviklingen:** Claude Code i VS Code, med Claude Opus 5 og senere Claude Opus 5.5. Underagenter ble brukt til implementering og uavhengig kodegjennomgang.
- **Andre verktøy:** VS Code; BMAD Method (planleggingsskillene for brief, PRD, arkitektur og UX, og fra 12. november BMAD v6.12.4 med `bmad-build` i repoet); Vercel for drift; Vitest for enhetstester; Playwright og axe-core for demotest, README-test og tilgjengelighetssjekk; Docker.

### 2.4 Utviklingsfaser

**Fase 1: Planlegging (september)**
- Repoet ble opprettet 9. september. Product brief ble skrevet og fikk tilbakemelding fra foreleser.
- 25. september ble briefen gjort om til en PRD (`bmad-prd`) med addendum og tre gjennomganger: kvalitetsrubrikk, avstemming mot briefen og en adversarisk gjennomgang av omfang og målbarhet. Testsettene ble halvert etter den siste, og flere terskler ble endret.
- 27.–28. september ble bildeinnlesing tatt inn og Mapper tatt ut. Etikken rundt datakjeden ble skrevet ut (personvern, opphavsrett, hvor data behandles).
- 29.–30. september kom arkitektur ([arkitektur-lesevenn.md](arkitektur-lesevenn.md), AD-1 og utover), fremdriftsplan og proposal.
- **KI-bruk:** Claude Code skrev utkastene. Jeg styrte med spørsmål og innvendinger og godtok, endret eller forkastet. KI-logg oppføring 1–9 er fra denne fasen: blant annet feil målgruppe i hele dokumentet, et testsett som bare dekket ett programområde, og et krav om kjørbarhet som PRD-en manglet og som foreleser fant.
- Promptene fra fasen står i [promptlogg.md](promptlogg.md).

**Fase 2: Utvikling (oktober – november)**
- **Kjerneløypen og M0 (oktober):** innlesing (innliming, PDF), overskriftskontroll, aktivering, lesevisning med fagord, quiz, øvekort, fagsamtale og morsmål. Parallelt annoterte jeg gullsettene og målte promptene mot dem: fagord (FR-8), quiz (FR-14), minnevers (FR-31) og oversettelse (FR-28, kontrollert av en morsmålsbruker). M0 ble ferdigstilt 29.–30. oktober.
- **M1 (november):** et samtalegullsett med 36 elevsvar som jeg skrev selv, og som består sikkerhetsporten (0 misoppfatninger lest som dekkende). Videre bildeinnlesing, telefontest i prod og flytendringer etter den.
- **Designfase og slakk (12.–25. november):** design og opplevelse ble spesifisert med `bmad-ux` (DESIGN.md og EXPERIENCE.md, navnet LeseBuddy) og bygget i bolker med `bmad-build`. Hver bolk fikk egen spesifikasjon, implementering og gjennomgang av en til tre agenter som ikke hadde skrevet koden. Deretter Mapper i en lett variant (FR-50–52), vilkår og aldersgrense (FR-53), bruksgrenser (FR-54) og tre runder med prodtest på telefon og PC, med rettelser.
- **Kodefrys:** kontrollrunden før taggen ga 806 av 806 enhetstester, demotest 3 av 3, tilgjengelighet 656 av 656 og README-test 9 av 9.
- **KI-bruk:** Claude Code skrev koden, testene og måleskriptene og rullet ut når jeg sa ja. KI-logg oppføring 10–26 og alle 28 kodefunn er fra denne fasen. Spesifikasjonene fra hver bolk ligger i `_bmad-output/implementation-artifacts/`, og sesjonsloggene i `.logs/arve/`.
- Promptene fra fasen står i [promptlogg.md](promptlogg.md).

---

## 3. Utfordringer og løsninger

### 3.1 Tekniske utfordringer

**Utfordring 1: Målingene overskrev mine utfylte vurderingsark**
- Problem: 9. november kjørte agenten hele testpakken (`npx vitest run`) i stedet for `npm test`. Da ble også måleskriptene kjørt, og de skrev nye, tomme versjoner av vurderingsarkene for quiz, minnevers og forklaringer over arkene jeg allerede hadde fylt ut.
- Løsning: arkene var committet og ble hentet tilbake fra git. To dager etter ble målingene endret, så de aldri skriver over et ark som finnes (`maaling/skriv-ark.ts`), og `npm test` holder målingene utenfor.
- KI sin rolle: agenten gjorde feilen, oppdaget den selv i `git status`, sa fra og rettet den. ✍️ [Hjalp eller hindret det deg?]

> 📎 Underlag: [ki-logg.md](ki-logg.md) 2026-11-09, kodefunn 25.

**Utfordring 2: Koden lovet at IP-adressen ikke ble lagret, men den ble lagret**
- Problem: en kommentar i koden og en grønn test sa at IP-adressen ikke ble lagret. Innloggingsbiblioteket (Better Auth) lagret likevel adressen i klartekst i tabellen `rate_limit`, fordi telleren for innloggingsforsøk bruker IP-adressen som nøkkel. Testen sjekket bare øktene.
- Løsning: funnet 19. november da vilkårsteksten skulle si nøyaktig hva som lagres. Telleren lagrer nå en HMAC-SHA256-hash av nøkkelen, og de gamle radene ble slettet i migrasjon 0010. Nye tester sjekker at nøkkelen ikke inneholder adressen.
- KI sin rolle: den KI-skrevne koden og testen inneholdt feilen. Funnet kom av at et personvernkrav måtte sjekkes mot hele databasen, ikke bare mot det kommentaren pekte på. ✍️ [Din vurdering]

> 📎 Underlag: [kodefunn.md](kodefunn.md) funn 28 (samme mønster som funn 3 og 4).

**Utfordring 3: Måling av en ikke-deterministisk modell**
- Problem: et modellkall gir ikke samme svar to ganger. En test som krever et bestemt svar, feiler tilfeldig, og fagorduttrekket varierte fra kjøring til kjøring (Jaccard 0,734 med ett kall).
- Løsning: testene som sjekker flyten (demotesten), ble skilt fra målingene av kvalitet (gullsettene). Lagrede modellsvar i `testdata/modellsvar/` gjør at appen og testene kan kjøres uten API-nøkkel. Fagorduttrekket kjøres fem ganger, og et uttrykk beholdes når minst tre av kjøringene fant det (Jaccard 0,865).
- KI sin rolle: ✍️ [Din vurdering]

> 📎 Underlag: [prd-lesevenn.md](prd-lesevenn.md) §9.5 («Hva demoløypen ikke tester»), `prompts/gjeldende.json` (`_om_konsistens`), [generatorer/lagretsvar.ts](../../generatorer/lagretsvar.ts).

### 3.2 Samarbeidsutfordringer

Prosjektet er gjennomført av én person. De som har bidratt utenfra:
- foreleser, med tilbakemelding på brief og PRD og oppsett for sesjonslogg;
- en morsmålsbruker som kvalitetssikret de ukrainske oversettelsene (FR-28);
- en utenforstående leser som vurderte tonen i fagsamtalen;
- en testbruker (SM-10).

✍️ [Utfordringer med å jobbe alene, og med å koordinere de utenforstående]

### 3.3 KI-spesifikke utfordringer

Dokumenterte eksempler (se [ki-logg.md](ki-logg.md) og [kodefunn.md](kodefunn.md)):
- **Feil i utdata som besto alle kontroller:** quizen hadde en gal fasit (renter som terminbeløp, oppføring 12), og minnevers som rimet og var faktariktige, løste likevel ikke oppgaven (oppføring 14).
- **Svakt kildegrunnlag:** agenten konkluderte riktig om Anthropics vilkår og om forskning.no, men på for tynt grunnlag. Det kom fram fordi jeg spurte etter kilden (oppføring 7 og underlaget 8.10).
- **Feil i prosessen:** vurderingsark overskrevet (oppføring 21) og utrulling uten å si hva som fulgte med (oppføring 22).
- **Feil i KI-skrevet kode:** 28 kodefunn, blant annet en endring i flyten som brøt to sjekkskript ingen kjørte (funn 27) og IP-adressen over (funn 28).
- **Det modellen ikke vet:** bildeinnlesing manglet fordi ingen hadde nevnt at mange elever har papirbok (oppføring 5).

Slik ble det håndtert: gullsett med fasit som jeg skrev selv, uavhengige gjennomganger av koden, testing i prod på telefon, og faste rutiner etter feilene (`npm test` i stedet for full vitest, liste over endringer før hver utrulling).

✍️ [Din vurdering av disse]

---

## 4. Kritisk vurdering av KI sin påvirkning

### 4.1 Fordeler med KI-assistanse

**Effektivitet og produktivitet:**
- ✍️

**Læring og forståelse:**
- ✍️

**Kvalitet på koden:**
- ✍️

> 📎 Underlag: fremdriftsplanen (timeanslag og delingen mellom hva som kan delegeres og ikke), testtallene ved kodefrysen, gjennomgangene i bmad-build (KI-logg 2026-11-12).

### 4.2 Begrensninger og ulemper

**Kvalitet og pålitelighet:**
- ✍️

**Avhengighet og forståelse:**
- ✍️

**Kreativitet og problemløsning:**
- ✍️

> 📎 Underlag: KI-logg oppføring 12, 14, 15 (minnevers v4–v6 forkastet), 16, 17 og 23 (din vurdering endret etter KI-argument); kodefunn 27 og 28.

### 4.3 Sammenligning: Med og uten KI
✍️

### 4.4 Samlet vurdering
✍️

> 📎 Underlag: avsnittet «Et mønster verdt å skrive om» under «Status mot FR-38» i [ki-logg.md](ki-logg.md).

---

## 5. Etiske implikasjoner

### 5.1 Ansvar og eierskap
✍️

> 📎 Underlag: [underlag-refleksjonsrapport.md](underlag-refleksjonsrapport.md) («Eierskap og opphavsrett», forskning.no forkastet på vilkårene), [addendum-lesevenn.md](addendum-lesevenn.md) §6.

### 5.2 Transparens
✍️

> 📎 Underlag: promptlogg, KI-logg, kodefunn og at appen sier at vurderingen kan være gal (FR-23, svarvurderingen er aldri en karakter).

### 5.3 Påvirkning på læring og kompetanse
✍️

### 5.4 Arbeidsmarkedet
✍️

### 5.5 Datasikkerhet og personvern

**Hvilke data som ble delt (fakta):**
- **Med Claude Code under utviklingen:** kildekoden, planleggingsdokumentene, gullsettene og samtalene. Forbrukervilkårene tillater trening som standard, og transkripsjoner lagres i seks år.
- **Fra appen til Anthropics API:** elevens tekst, svarene i fagsamtalen og bilder av boksider. Det skjer under Commercial Terms, som ikke tillater trening på innholdet. Behandlingsstedet er ikke låst til EU, og standardkontraktene i databehandleravtalen er overføringsgrunnlaget.
- **I appens egen database (Neon, Frankfurt):** konto, tekster og svar. Bilder lagres ikke, og IP-adressen lagres bare som hash.
- **Tiltak i appen:** invitasjonskode, aldersgrense 15 år, avtale som behandlingsgrunnlag (ikke samtykke), sletting av konto, innsyn med `data/innsyn.mjs`, tegngrense på 8 000 og inntil fire bilder.

✍️ [Risikoer, og hvordan man bør tenke om sikkerhet]

> 📎 Underlag: [underlag-refleksjonsrapport.md](underlag-refleksjonsrapport.md), «Etisk refleksjon: datadeling». Den er allerede skrevet av deg 2. oktober («jeg er mye mer blottstilt enn mine brukere»). [gjennomgang-innlogging.md](gjennomgang-innlogging.md).

---

## 6. Teknologiske implikasjoner

### 6.1 Kodekvalitet og vedlikehold
✍️

### 6.2 Standarder og beste praksis
✍️

> 📎 Underlag: `prompts/gjeldende.json` (`_om_tenkning`: to modeller i samme familie krevde motsatt innstilling for tenkemodus, så en regel basert på modellnavnet ville gitt feil 400), kodefunn 3, 4 og 28 (kommentar og grønn test som lovet mer enn koden holdt).

### 6.3 Fremtidig utvikling
✍️

---

## 7. Konklusjon og læring

### 7.1 Viktigste lærdommer
1. ✍️
2. ✍️
3. ✍️

### 7.2 Hva ville dere gjort annerledes?
- Tekniske valg: ✍️
- Bruk av KI: ✍️
- Samarbeid og organisering: ✍️

### 7.3 Anbefalinger
- Råd om effektiv bruk av KI: ✍️
- Fallgruver å unngå: ✍️
- Beste praksis dere oppdaget: ✍️

### 7.4 Personlig refleksjon (individuelt)

**Arve Esteban Handeland:**
✍️

---

## 8. Vedlegg

- GitHub-repo: <https://github.com/IBE160-2026/G129-handeland> (kodefrys: taggen `kodefrys`)
- Appen i drift: [URL]
- KI-logg: [ki-logg.md](ki-logg.md)
- Promptlogg: [promptlogg.md](promptlogg.md)
- Kodefunn: [kodefunn.md](kodefunn.md)
- Promptregister med måletall per versjon: [prompts/REGISTER.md](../../prompts/REGISTER.md)
- PRD, arkitektur og fremdriftsplan: [prd-lesevenn.md](prd-lesevenn.md), [arkitektur-lesevenn.md](arkitektur-lesevenn.md), [fremdriftsplan.md](fremdriftsplan.md)
- Demotest ved kodefrys: [maaling/resultater/demotest-2026-11-28.md](../../maaling/resultater/demotest-2026-11-28.md)
- Skjermbilder: [legg inn]

---

**Ordantall:** [Ca. antall ord]

**Forventet lengde:** 3000-5000 ord (avhengig av gruppestørrelse og prosjektets kompleksitet)
