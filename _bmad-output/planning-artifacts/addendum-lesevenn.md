---
title: Addendum — Lesevenn
status: final
created: 2026-09-25
updated: 2026-09-28
---

# Addendum: Lesevenn

Dette dokumentet holder det som hører til Lesevenn, men ikke i PRD-en: emnekonteksten som begrunner krav uten å være krav, tekniske valg som er løsning framfor kapabilitet, og vurderte alternativer med begrunnelsen for at de ble forkastet. Nedstrøms hører innholdet til i løsningsarkitektur og UX-spesifikasjon.

## 1. Emnekontekst — IBE160, høst 2026

Hentet 25. september 2026 fra emnesiden `himolde.no/studier/emner/log/2026/host/ibe160.html` og fra `himolde.no/studier/aktivitetsplaner-og-nokkeldatoer/`. Tatt med her fordi flere krav i PRD-en bare er forståelige i lys av det, men emnekrav er ikke produktkrav.

**Formalia.** 15 studiepoeng, høst 2026, Molde, norsk undervisningsspråk, Avdeling for logistikk. Emneansvarlig Bård Inge Austigard Pettersen. Ingen forkunnskapskrav. Inngår i Årsstudium i IT og Bachelor i IT og digitalisering.

**Vurderingsform — mappeinnlevering, to deler:**

| Del | Vekt | Krav |
|---|---|---|
| Prosjektkode og funksjonalitet | 70 % | «Studentene leverer en KI-generert applikasjon». «Dokumentasjon må vise hvordan KI ble brukt, og hvordan studentene har kvalitetssikret koden» |
| Refleksjonsrapport | 30 % | Utviklingsprosess, utfordringer og løsninger. «Kritisk vurdering av hvordan KI påvirket sluttresultatet». Etiske og teknologiske implikasjoner |

**Endring fra 2025 som er verdt å merke seg.** Høsten 2025 hadde emnet tre deler: kode 30 %, refleksjonsrapport 40 %, muntlig eksamen 30 %. For 2026 er den muntlige eksamenen borte, og vektene er 70/30. Materiale fra fjorårets gjennomføring — inkludert notater som går mellom studenter — oppgir fortsatt den gamle fordelingen. Det er ett av to steder der annenhåndskilder om dette emnet er påviselig utdaterte.

**Arbeidskrav.** «Godkjent proposal som beskriver applikasjonen gruppen skal lage i mappekravet.» Forutsetning for å få levere. Ligger som åpent punkt 3 i PRD §11.

**Læringsutbytter som former §4.11.** Kunnskapsmålene nevner utviklingssyklusen med «prompting, iterativ kodegjennomgang, testing og versjonskontroll», og vurdering av «etikk og juridiske problemstillinger knyttet til KI-generert kode, inkludert eierskap til programvare og risiko for bias i algoritmer». Ferdighetsmålene nevner kodeevaluering, feilsøking, og å «teste og validere KI-genererte løsninger». Dette er grunnen til at FR-41 krever versjonskontroll gjennom semesteret og linje-for-linje-gjennomgang av innlogging og lagring, og at FR-42 krever at skjevhet drøftes konkret for dette produktet framfor generelt.

**Arbeidsformer.** 2+2 forelesninger ukentlig på Teams med opptak i Canvas, 2+2 øvingstimer på nett med hjelpelærere, ukentlig arbeid i prosjektgrupper, individuelle veiledninger.

**Datoer.** Semesterstart 10. august 2026 (Molde: åpning 11. august). Semesterslutt 18. desember 2026, 19 undervisningsuker. Hovedperiode for vurdering: «fra ca. 20. november og til jul». Ny/utsatt vurdering uke 8 og uke 32.

**Det som ikke er publisert.** Karakterskala står ikke på 2026-siden. Ingen innleveringsdato, ingen vurderingsrubrikk, ingen formatkrav er publisert på himolde.no. Timeplan-API-et er stengt for uthenting. Det finnes ingen nasjonal emnekatalog for enkeltemner — Samordna opptak og utdanning.no dekker studieprogram, ikke emnebeskrivelser, så himolde.no er den autoritative kilden.

**Annenhåndskilder, behandlet som hypotese.** En annen gruppes offentlige kurswiki i emnets GitHub-organisasjon for 2026 oppgir fra en forelesningslysark: innlevering som «GitHub-repo som zip + refleksjonsrapport, frist 5. desember», med ukeplan (uke 42 proposal, uke 43 product brief og PRD, uke 44–45 arkitektur og UX, uke 46–47 implementasjon, uke 48–49 refleksjonsrapport). Ukeplanen er bekreftet 25. september som **anbefalt framdrift, ikke egne innleveringer** — det er bare mappekravet 5. desember som leveres. Samme wiki gjengir også vektfordelingen 30/40/30, altså fjorårets, og 5. desember 2026 er en lørdag. Kilden er derfor påviselig ikke fullt oppdatert. Datoen 5. desember viste seg likevel å være riktig, bekreftet hos emneansvarlig 25. september — men den ble behandlet som antakelse fram til bekreftelsen, og det var riktig framgangsmåte: kilden hadde feil om vektfordelingen samtidig som den hadde rett om datoen. Samme wiki refererer dessuten en 100-poengs proposal-rubrikk og en `case-description-template.md` gjenfunnet fra fjorårets organisasjon, inkludert utsagnet «vanskeligheten vil uansett være en viktig del av sensuren» — grunnlaget for antakelse 9 i PRD §12. Alt dette er studenters tolkning av fjorårets materiale, ikke publisert policy for 2026.

**Premisset er avklart.** Emnebeskrivelsen sier gruppevis vurdering, grupper på 4 ± 1, men solobygg er godkjent av emneansvarlig 25. september 2026. Innleveringsfristen er samtidig bekreftet til 5. desember 2026 — altså den datoen annenhåndskilden oppgav, selv om den kilden var utdatert på vektfordelingen. En kilde kan ha rett om det ene og feil om det andre; det er grunnen til å kontrollere hvert punkt for seg framfor å forkaste kilden som helhet.

## 2. Kildesjekk av tallene i briefen

Briefens PISA-tall er kontrollert, siden de bærer hele problembeskrivelsen.

- **Publisering 8. september 2026:** bekreftet. OECD lanserte PISA 2025 Results (Volume I) den datoen; norsk nasjonal rapport samme dag via Udir og UiO.
- **34 prosent lavtpresterende i lesing:** bekreftet. UiO omtaler 34 prosent under minimumsnivået; Udir oppgir en økning fra 15 til 34 prosent under nivå 2 fra 2015 til 2025, og norsk lesegjennomsnitt 453 mot OECD 461.
- **41 prosent for gutter:** bekreftet (Utdanningsnytt, 8. september 2026).
- **Tilsvarende tall for jenter, 27 prosent:** bare delvis bekreftet. Bør ikke brukes uten egen kontroll mot Udir-rapporten.
- **Presisering av formulering:** PISA måler 15-åringer, som i Norge i hovedsak går i 10. trinn. Briefens «34 prosent av tiendeklassingene» er en rimelig dagligtale-gjengivelse, men «norske 15-åringer (10. trinn)» er det presise. Verdt å rette i refleksjonsrapporten, der kildebruk vurderes.
- **Hvorfor PISA-tallene treffer videregående bedre enn ungdomsskolen.** Målgruppen for Lesevenn er videregående (Vg1–Vg3), mens PISA måler 15-åringer på 10. trinn. Det svekker ikke problembeskrivelsen — det skjerper den. De 34 prosentene som leser under minimumsnivået, og de 41 prosentene av guttene, er nøyaktig det kullet som begynner på videregående året etter målingen. De møter da lengre tekster, tettere fagspråk og mindre lesestøtte enn de hadde på ungdomsskolen. Dette er en formulering verdt å bruke i refleksjonsrapporten, fordi den kobler kilden til målgruppen i stedet for å låne tall fra et nærliggende trinn.
- **En påstand om 24 poengs fall i lesing siden 2022** dukket opp i søk, men er ikke bekreftet og ser tvilsom ut gitt skåren på 453. Ikke bruk den.

## 3. Teknologivalg

Ikke krav, men de valgene PRD-ens krav er dimensjonert for. Hører nedstrøms i løsningsarkitekturen.

**Rammeverk.** Briefen nevner Next.js eller Flask som alternativer. Vurderingen: Next.js gir én kodebase for grensesnitt og serverendepunkter, filbasert ruting som passer Kjerneløypens stegvise flyt, og et komponentøkosystem som gjør det lettere å få lesevisningen god — som er den flaten mest av vurderingsverdien ligger i. Flask er enklere å forstå i sin helhet og lettere å feilsøke alene, men krever separate valg for grensesnitt og gir mindre igjen per time på designflaten. Avgjørelsen hører i arkitekturdokumentet, men PRD-ens krav — inline-markering med tastaturfokus, justerbar typografi, høyre-til-venstre-gjengivelse side om side med norsk — er skrevet med et komponentbasert grensesnitt i tankene.

**Modellvalg per oppgave.** PRD §6.4 sier at ulike oppgaver kan bruke ulike modeller, uten å velge. Den tekniske begrunnelsen: oppgavene har ulik vanskelighet, og kostnaden per kall varierer mye mellom modellklasser.

| Oppgave | Vanskelighet | Merknad |
|---|---|---|
| Uttrekk av Faguttrykk | Middels | Kjøres én gang per Tekst og lagres. Kan bruke en rimeligere modell, men det er denne som måles hardest i FR-8 — mål begge før du velger |
| Quizgenerering | Middels | Forankringskravet i FR-14 er det som skiller modellene, ikke språket |
| Svarvurdering og oppfølgingsspørsmål | Høy | Den vanskeligste oppgaven i appen. Klassifisering i fem tilstander pluss et oppfølgingsspørsmål som skal reagere på innholdet. Bruk den sterkeste modellen prosjektet har råd til her, og spar penger andre steder |
| Oversettelse | Middels til høy | Vanskeligheten varierer sterkt med språket, og det er nettopp poenget i FR-42 om skjevhet |
| Minnevers | Lav | Men faktasjekken i FR-31 er ikke lav |

Et nyttig grep for både kvalitet og kostnad: strukturert utdata med skjema, slik at Kildeavsnitt og verbatim-krav (FR-7) kan valideres programmatisk framfor å tolkes ut av fritekst. Det gjør maskinsjekkene i PRD-en billige å implementere, og de er en forutsetning for målingene i §4.11.

**Datamodell, grov skisse.** `konto` → `tekst` (med `råtekst` og `redigert_tekst` som to felt, jf. FR-3) → `avsnitt` (numererte rader, jf. arkitekturspinens AD-2) → `begrep` (med `viktighetsrangering` og forekomstposisjoner relativt til sitt avsnitt), `quiz` med `quizspørsmål` og `quizforsøk`, `fagsamtale` med `samtalerunde` (med `kildeavsnitt_id` og `mål` per runde, jf. FR-20), `øvekortmerking` på `begrep`. Den autoritative datamodellen er ER-diagrammet i `arkitektur-lesevenn.md`; skissen her er bare en oversikt.

**Kildeavsnitt og uforanderlighet.** Kildeavsnitt er **en referanse til et numerert avsnitt**, ikke et tegnspenn. Den låste Teksten deles i avsnitt én gang, avsnittene lagres som rader, og alt generert innhold peker på et avsnittsnummer. Se arkitekturspinens AD-2 og AD-12 for den bindende formuleringen.

`[RETTET 29.09.2026: et tidligere utkast av dette addendumet sa at Kildeavsnitt lagres som tegnindeks inn i redigert_tekst. Det ble skrevet før arkitekturspinen fantes, og motsier AD-2. Feilen er verdt å nevne i refleksjonsrapporten: to dokumenter som begge står som bindende kilder rakk å si to ulike ting om den mest bærende mekanismen i systemet, og det ble bare oppdaget fordi en gjennomgang leste dem mot hverandre. Tegnposisjoner finnes fortsatt i systemet, men bare for inline-markering av faguttrykk, og de er relative til sitt eget avsnitt.]`

Låsen er like nødvendig med avsnittsnumre som med tegnindekser: FR-3 fryser avsnittslisten ved godkjenning, og en elev som vil endre brødteksten lager en ny Tekst. Uten låsen ville en senere redigering endret hvilket innhold avsnitt 4 har, og forankringskravet i PRD §5 ville vært sant ved generering og usant etterpå. Implementasjonsmerknad: lås ved å avvise skriving, ikke bare ved å skjule redigeringsknappen — se AD-15 om hvordan låsetilstanden håndheves i typesystemet framfor ved å huske den.
**Kostnadsstyring, og hva som egentlig er den bindende rammen.** Lagring framfor regenerering (FR-36) er det viktigste grepet mot kjøretidskostnad: uten det betaler prosjektet på nytt hver gang eleven åpner en tekst. Deretter: tak på tekstlengde (8 000 tegn), mappestørrelse og samtalelengde.

Men kroner er ikke den knappe ressursen i dette prosjektet — **timer er**. Målearbeidet i PRD §4 er en betydelig egen post: annotering av Gullsett, manuell vurdering av utdata, og kjøring på nytt per promptversjon. Det er grunnen til at gullsettene i PRD-en ble halvert etter en gjennomgang av omfanget, til 6 tekster, 24 quizspørsmål, 36 samtaletilfeller, 4 oversettelsestekster og 10 vers, og til at flere terskler ble flyttet fra bestått/ikke bestått til rapportert-med-konfidensintervall. En terskel som krever flere tilfeller enn utvikleren har timer til å annotere, er ikke en strengere terskel — den er en terskel som ikke blir målt.

Et beslektet poeng verdt å ta med i refleksjonsrapporten: ved de utvalgsstørrelsene en solostudent rekker, er konfidensintervallene brede nok til at «90 prosent» og «81 prosent» ikke kan skilles. Det gjør ikke målingen verdiløs, men det gjør den til en indikasjon framfor et bevis, og det er den ærlige måten å presentere den.

## 4. Vurderte alternativer som ble forkastet

**Ingen obligatorisk gjennomsyn av PDF-uttrekk, bare automatisk deteksjon av feil.** Forkastet fordi flerspaltet tekst i feil leserekkefølge (PF-4) ikke kan oppdages pålitelig. Automatikk ville fanget de lette tilfellene og sluppet gjennom det verste, og resultatet blir en løype som ser riktig ut og tester feil tekst. Ett obligatorisk steg dekker alle sju feiltilstandene, også de ukjente.

**Åpent fritekstfelt for morsmål.** Forkastet. Gir inntrykk av dekning prosjektet ikke kan stå for, og gjør «oversettelsen er faglig presis» umulig å måle. Den lukkede listen med to nivåer i FR-24 er mindre imponerende og mer sann.

**Én egen nøkkelorduttrekking for øvekort, atskilt fra lesevisningen.** Forkastet. To uttrekk gir to sett å måle, to prompter å vedlikeholde, og et øvekortsett som ikke matcher det eleven faktisk møtte i teksten. Ett Begrepssett (FR-16) gjør at kvalitetsmålingen i FR-8 dekker begge bruk.

**Poengsum eller mestringsnivå i fagsamtalen.** Forkastet på to grunnlag. Pedagogisk: en formativ samtale som ender i et tall blir en prøve, og eleven svarer strategisk framfor ærlig. Faglig: klassifiseringstreffet i FR-21 er satt til 75 prosent, og et tall bygget på den treffsikkerheten ville framstå som mer presist enn det er. Grensen drøftes i FR-43.

**Erstatte norsk tekst med morsmål når morsmål er valgt.** Forkastet. Det gjør appen til en oversetter, fjerner møtet med norsk fagspråk som er hele hensikten, og fjerner samtidig sikkerhetsnettet mot dårlige oversettelser. Additiv visning (FR-25) koster skjermplass og er verdt den.

**Suno-integrasjon framfor en prompt til utklippstavlen.** Forkastet for v1. Legger til et eksternt API, en ventetid, en feilkjede og en kostnad, for prosjektets minst kritiske funksjon — som dessuten ligger nederst i kuttrekkefølgen.

**Ordforskjell som mål på at fagsamtalen reagerer på svaret.** Forkastet, og dette er den mest lærerike forkastingen i prosjektet. Første utkast av FR-21 målte at to ulike elevsvar gir oppfølgingsspørsmål med ordoverlapp under 0,6. Problemet er at FR-20 samtidig *pålegger* oppfølgingen å gjengi et ord eleven brukte — så to ulike svar gir garantert to ulike strenger, og testen består selv om spørsmålet funksjonelt er identisk hver gang («Du skrev 'X' — kan du se på avsnitt 2?»). To krav som hver for seg ser fornuftige ut, opphevet til sammen målingen. I tillegg var metrikken ikke reproduserbar: på norske spørsmål av åtte ord dominerer funksjonsord overlappet, og ingen tokenisering eller stoppordliste var spesifisert. Erstattet av avsnittstesten, som spør *hvor* systemet peker framfor hvilke ord det bruker. Hører i refleksjonsrapporten under kritisk vurdering av egen metode.

**Tilbakeoversettelse som hovedmål på oversettelseskvalitet.** Forkastet fordi det bryter prosjektets egen motmetrikk SM-C4. En modell fra samme familie gjenskaper sin egen feiloversettelse på veien tilbake til norsk, så metoden er systematisk blind for feil terminologi — det den skulle garantere — og for register og flyt. «Null motsigelser» på korte oppsummeringer ville bestått fra første dag. Beholdt i FR-28, men bare for tapt nekting, endrede tall og endrede egennavn, som er de tre feilklassene den faktisk fanger. Et annet maskinoversettelsesverktøy ble vurdert som uavhengig kontroll og forkastet av samme grunn: delte treningsdata gir delte skjevheter. Den eneste reelle kontrollen er et menneske som kan språket.

**Tre kvalitetssikrede morsmål i v1.** Forkastet fordi nivået krever én ekstern morsmålsbruker per språk, og tre slike avhengigheter før M1 ville gjort dokumentets mest usikre antakelse til en forutsetning for å bli ferdig. Ett kvalitetssikret språk, resten som Modellstøttet, gir samme demonstrasjonsflate med én avhengighet. Arabisk beholdes bygget uansett, fordi høyre-til-venstre-gjengivelsen er teknisk arbeid som står på egne bein.


**OCR som «egen kvalitetskjede».** Forkastet som begrunnelse 27. september, og verdt å notere fordi den var teknisk utdatert. PRD §8.2 utelukket bildeinnlesing med at tekstgjenkjenning er en egen kvalitetskjede med egne feilmåter. Det er riktig for tradisjonell OCR av Tesseract-typen, men appen snakker allerede med en multimodal språkmodell — «les denne siden og gi meg teksten» er det samme API-kallet med en bildeblokk i stedet for tekst. Ingen ny pipeline, ingen ny leverandør, ingen ny integrasjon. Da den reelle kostnaden viste seg å være liten, og det samtidig ble klart at en stor del av målgruppen har papirbok, falt begrunnelsen. Omfangsbegrunnelsen sto — derfor ble Mapper byttet ut mot bildeinnlesing framfor at bildeinnlesing ble lagt på toppen.

**Mapper i v1.** Forkastet 27. september etter først å ha vært beholdt mot anbefaling. Mapper er additiv: uten den virker alt annet, og alle målbare kvalitetspåstander står. Bildeinnlesing er eksistensiell: uten den kan en stor del av målgruppen ikke bruke appen i det hele tatt. En funksjon som utvider nytten for dem som alt er i gang taper mot en funksjon som avgjør om de kommer i gang. Byttet er dokumentert i PRD §4.9, og det er verdt å merke seg at den forrige avveiningen ikke var feil da den ble gjort — tilgangsproblemet var ikke kjent.

**Å måle bildeuttrekket.** Forkastet for v1. Et sjette gullsett med terskler ville gått ut over kvaliteten på de fem som finnes, i et prosjekt som alt er stramt på timer. I stedet leveres inngangen umålt og tydelig merket, etter samme mekanisme som Modellstøttet språk i FR-24. Avviket mellom Råtekst og redigert tekst lagres, og er den billigste indikasjonen på hvor godt uttrekket virker — et spor, ikke en måling.

**Å bytte modelleverandør på magefølelse.** Forkastet. Diskusjonen om datahåndtering endte i et leverandøruavhengig krav i PRD §6.2 — inndata skal ikke brukes til trening, behandlingsstedet skal være kjent, vilkårene skal være lest og datert — framfor i et bestemt leverandørvalg. Begrunnelsen: skillet som betyr noe er avtalen, ikke merkenavnet, og forbruker- og API-versjoner av samme tjeneste har ofte ulike vilkår på nettopp dette punktet. En lokalt kjørt modell ble også vurdert, og er det eneste alternativet som fjerner tredjepartsoverføringen helt; den ble valgt bort fordi Svarvurderingen er den vanskeligste oppgaven i appen og krever god norsk. Det er en reell avveining mellom personvern og pedagogisk kvalitet, og den hører i refleksjonsrapporten som det.
**Å skrive dokumentasjonen til slutt.** Forkastet eksplisitt i PRD §9.4, og verdt å si hvorfor her: målingene i §4.11 må kjøres underveis for å styre promptarbeidet. En måling som først gjøres i desember har ikke forbedret noe — den har bare beskrevet. Da mister prosjektet både kvaliteten og den delen av dokumentasjonen som viser iterasjon.

## 5. Videreføring utover v1

Rekkefølgen er valgt etter forholdet mellom pedagogisk verdi og innsats, og hører i rapportens videreføringsdel.

1. **Talebasert fagsamtale.** Den pedagogisk mest interessante utvidelsen. Noen elever forklarer klart muntlig og stopper skriftlig, og det er nettopp de elevene Lesevenn er bygget for. Krever lydopptak, transkribering og en ny feilkjede — men svarvurderingen og oppfølgingslogikken kan gjenbrukes uendret, siden transkribert tale går inn samme vei som skrevet svar.
2. **Full morsmålsstøtte i quiz og øvekort.** Krever en pedagogisk avklaring først, ikke bare teknisk arbeid: skal eleven kunne svare på morsmål, og hva tester man da?
3. **URL- og bildeinnlesing med OCR.** Egen kvalitetskjede med egne feilmåter. Feiltilstandstabellen i FR-4 er mønsteret å utvide.
4. **Lærerdashbord.** Krever klasser, roller, personvernvurdering og databehandleravtale. Nærmere et eget prosjekt enn en utvidelse.
5. **Diagnostikk over tid.** Krever reell brukshistorikk før den er annet enn gjetning, og er derfor sist — ikke fordi den er vanskeligst, men fordi den ikke kan bli troverdig før det finnes data.
