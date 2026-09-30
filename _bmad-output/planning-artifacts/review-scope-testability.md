---
title: Kritisk gjennomgang — omfang, målbarhet og gjennomførbarhet
status: review
created: 2026-09-25
gjelder: prd-lesevenn.md, addendum-lesevenn.md
---

# Kritisk gjennomgang: Lesevenn

Tre fronter, ingenting annet: (1) er måleapparatet gjennomførbart, (2) er de «testbare konsekvensene» faktisk testbare, (3) er 44 FR-er byggbare på ti uker. Premisser lagt til grunn: én student, alene, ti arbeidsuker fra 25. september til arbeidsfrist 5. desember, ved siden av andre emner, 70 % kode / 30 % rapport, API-budsjett 300–600 kr av egen lomme.

Konklusjonen først, siden den avgjør hvordan resten skal leses: **dokumentet er overforpliktet med omtrent 60–100 % på timer.** Ikke på ambisjon, ikke på penger — på timer. Måleprogrammet alene er 90–110 timer. Det er ikke en pyntefeil; det er den eneste feilen som betyr noe, fordi alle de andre svakhetene i dokumentet er billige å rette hvis det finnes timer til å rette dem.

---

## Del 1 — Er målearbeidet faktisk gjennomførbart?

### 1.1 Timeanslag, post for post

Anslagene er for én person som ikke har gjort dette før, og inkluderer å skrive resultatene ned i strukturert form (uten det finnes de ikke i repoet, jf. FR-40).

**FR-8 — Gullsett for Faguttrykk, ni Tekster à 1 000–4 000 tegn**

| Aktivitet | Timer |
|---|---|
| Finne, rense og legge inn ni tekster på ungdomstrinnsnivå, tre per fag | 3–4 |
| Manuell annotering, første gjennomgang (~40 min per tekst — grensetilfellene, ikke lesingen, er det som tar tid) | 6 |
| Re-annotering etter at den første målingen avslører at egne retningslinjer var inkonsistente (regn med at dette skjer) | 3 |
| Skåringsapparat: matching av uttrekk mot gullsett med norsk bøyning, flerordsuttrykk, overlappende spenn, rapport per fag | 5–8 |
| **Sum** | **17–21** |

Skåringsapparatet er den skjulte kostnaden. «mitose» mot «mitosen», «tektonisk plate» mot «tektoniske plater», «celledeling» mot «celledelingen» — naiv strengsammenligning gir kunstig lav gjenkalling, og du kommer til å bruke kvelder på normaliseringsregler. Det er ikke nevnt noe sted i PRD-en.

**FR-14 — 40 quizspørsmål**

| Aktivitet | Timer |
|---|---|
| Fem tekster (gjenbruk fra FR-8) | 0 |
| Manuell vurdering: 40 spørsmål × (forankring + besvarbarhet + fire alternativsjekker) ≈ 5 min/spørsmål | 3,5 |
| Registrering i strukturert form | 1 |
| **Sum første runde** | **4,5** |
| **Sum per ny promptversjon** | **3,5 (helmanuelt, ingen gjenbruk)** |

**FR-21 — 60 tilfeller for fagsamtalen**

| Aktivitet | Timer |
|---|---|
| Skrive 60 elevsvar i tre kalibrerte varianter, med forhåndssatt tilstand (~10 min per svar — å bestemme hva et «delvis» svar er på *dette* spørsmålet er reelt arbeid) | 10 |
| Testapparat: kjøre en 60-tilfellers matrise gjennom en **tilstandsbærende** dialog. Oppfølgingen avhenger av hele samtalehistorikken, så du må konstruere syntetisk historikk per tilfelle | 6–10 |
| Manuell relevansvurdering, 60 oppfølginger mot tilstandens regel, ~4 min | 4 |
| Kontrafaktisk avgjørelse for de parene som ryker på 0,6-terskelen | 1,5 |
| Tonegjennomgang av 60 svar (FR-23) | 1 |
| **Sum første runde** | **24–26** |
| **Sum per ny promptversjon** | **6–7** |

**FR-28 — oversettelse, ti Tekster per språk × tre språk**

| Aktivitet | Timer |
|---|---|
| Maskinsjekk av fagbegrepsbevaring (apparat) | 2–3 |
| Manuell lesing av 30 tilbakeoversettelser mot 30 originaler | 2,5 |
| Koordinering av eksterne stikkprøver, tre språk | 3–5 |
| **Sum egen tid** | **8–11** |
| **Ekstern avhengighet** | **1–3 uker kalendertid, ikke i din kontroll** |

**FR-31 — 20 minnevers:** 3–4 timer totalt. Den eneste målingen i dokumentet som er riktig dimensjonert.

**FR-40 — kjørbar måling med én kommando, resultatlagring per versjon, oppsummeringstabell:** 6–10 timer.

### 1.2 Totalen

| Post | Første runde | Per ny promptversjon (manuelt) |
|---|---|---|
| FR-8 | 17–21 | **0** (helautomatisk etter at gullsettet finnes) |
| FR-14 | 4,5 | 3,5 |
| FR-21 | 24–26 | 6–7 |
| FR-28 | 8–11 | 2,5 |
| FR-31 | 3–4 | 1,5 |
| FR-40 | 6–10 | 0 |
| **Sum** | **63–77** | **13,5–14,5** |

FR-39 krever «minst én dokumentert forbedring over minst to versjoner». Gjør du det seriøst på tvers av de fem kjøretidspromptene — altså to omkjøringer — blir totalen **90–106 timer.**

Sett det mot kapasiteten. Ti uker, ett 15-studiepoengsemne ved siden av andre emner, forelesninger og øvingstimer trukket fra: realistisk **12–16 timer i uka til dette prosjektet**, altså **120–160 timer i alt**. Måleprogrammet som spesifisert spiser **55–80 % av hele resten av semesteret**, og etterlater under 60 timer til å bygge 44 funksjonskrav, skrive refleksjonsrapporten, levere arbeidskravet og lage arkitektur- og UX-dokumentene. Det går ikke. Ikke «det blir stramt» — det går ikke.

### 1.3 Addendumet peker på feil flaskehals

Addendum §3 og PRD §6.4 begrunner små gullsett med at målekjøringene koster penger. Regn på det. En full FR-21-runde er ca. 120 modellkall med ~4 000 inn / 600 ut. På en frontmodell til ~$3/M inn og $15/M ut blir det rundt **2,5 dollar per runde**. Hele måleprogrammet med tre promptversjoner per prompt lander på i størrelsesorden **20–60 kroner.** Det er 5–10 % av budsjettet.

Det som faktisk kommer til å brenne 300–600 kroner er **utviklingsløkka**: tusenvis av kastede kall mens du strammer prompter, på lange tekster. FR-1 tillater 25 000 tegn inn, altså ~9 000 tokens. 2 000 utviklingskall på det nivået er 18M inntokens ≈ 54 dollar ≈ **570 kroner — hele budsjettet, på feilsøking.** Konkrete mottrekk: tak på 2 000 tegn for alle utviklingskall, promptbufring på systemdelen, billigste modell overalt bortsett fra Svarvurderingen, og et hardt varsel ved 250 kroner. Gullsettene er ikke små av pengehensyn. De er små — eller burde være det — av **timehensyn**, og den setningen bør stå slik i dokumentet, fordi den er sann og fordi den styrer riktig beslutning.

### 1.4 Hvilke gullsett er for store, og hva er den minste versjonen som fortsatt bærer påstanden

Argumentet må være statistisk, ellers er kutt bare feighet.

**FR-8: ni tekster → seks tekster (to per fag).** Ni tekster à 1 000–4 000 tegn gir grovt 60–110 gullbegreper. Ved gjenkalling 0,75 og n = 80 er 95 %-intervallet omtrent **±0,10**. Med seks tekster (n ≈ 60) blir det ±0,11. Du betaler ett prosentpoeng presisjon for fem timer. Ta kuttet. Men da må også dette bort: **«presisjon, gjenkalling og F1 rapporteres per fag» med terskel per fag er ikke et meningsfullt krav ved n = 2–3 tekster per fag.** Intervallet på et fagnivå med 20 begreper er ±0,19. Behold rapporteringen per fag som *kvalitativ observasjon* — «uttrekket er synlig svakere i norsk, se tabell» — og fjern terskelen per fag. Det er en ærligere påstand og den koster ingenting.

**FR-14: 40 spørsmål → 24 (tre tekster × åtte).** Merk samtidig at terskelen «minst 90 prosent» ikke er målbar til den presisjonen ved n = 40 heller: 95 %-intervallet rundt p = 0,9 med n = 40 er ca. **[0,81, 0,99]**. Du kan skille «omtrent ni av ti» fra «omtrent sju av ti», ikke noe finere. Formulér terskelen som antall: **minst 21 av 24 passerer**, og skriv intervallet ved siden av. Sparer 1,5 t første runde og 1,5 t per omkjøring.

**FR-21: 60 tilfeller → 30, men med alle fem tilstandene.** Dette er det viktigste enkeltkuttet, og det gjør gullsettet *bedre*, ikke bare mindre. Dagens 60 tilfeller dekker **tre av fem tilstander**. «Uklart» og «Utenfor» har null gulltilfeller, samtidig som FR-21 lover 75 % klassifiseringstreff og en forvekslingsmatrise over fem tilstander. To rader i matrisen er tomme. Og de to tomme radene er de vanligste reelle inndataene: en sliten tiendeklassing skriver «vet ikke» eller tre vage ord. Erstatt med **tre tekster × to startspørsmål × fem svarvarianter = 30 tilfeller**, alle fem tilstander representert med seks tilfeller hver. Skrivetid faller fra 10 t til 5 t, manuell runde fra 6–7 t til 3,5 t, og dekningen blir fullstendig. Kontrafaktisk test begrenses til de tre pedagogisk distinkte variantene: 3 par × 6 startspørsmål = 18 par, ikke 60.

**FR-28: tre kvalitetssikrede språk → ett, og ti tekster → fire.** Se del 3 for begrunnelsen; her holder det å si at 30 tekster med oversatt aktiveringsside og oppsummering er 8–11 timer egen tid pluss en avhengighet av **tre** frivillige morsmålsbrukere. Antakelse 4 i §12 er den antakelsen i hele dokumentet som mest sannsynlig ryker, og den ryker sent.

**FR-31: 20 vers → 10.** Se del 2.7 — «null usanne påstander» er ikke etablerbart ved noen av de to tallene, så ta det billigste.

**Ny total: 35–45 timer første runde, ~7 timer per omkjøring.** Det er leverbart. 90–106 er det ikke.

---

## Del 2 — Er de «testbare konsekvensene» faktisk testbare?

Her er metrikker som ser målbare ut, men som ikke er det, eller der målemetoden ikke ville oppdage den feilen den påstår å oppdage. Hver med en skarpere erstatning.

### 2.1 FR-8 — selvannotert gullsett: tre problemer, ett billig grep som fikser det viktigste

**Problem A: du måler enighet med deg selv, ikke riktighet.** Presisjon 0,70 betyr «modellen er enig med annotatøren i 70 % av tilfellene». Definisjonen av Faguttrykk i §3 har reelt uklare grenser: er «celledeling» et Faguttrykk eller en sammensetning av vanlige ord? Kjenner en tiendeklassing «demokrati»? §3 sier egennavn teller «med mindre de bærer argumentet» — det er en skjønnsvurdering, ikke et kriterium. Uten et mål på annotatørstøy er 0,70 et tall uten gulv.

**Skarpere, og dette er den enkeltendringen med høyest verdi i hele gjennomgangen:** annotér **to av seks tekster to ganger, minst sju dager mellom**, og rapporter **intra-annotatørenighet (Cohens κ eller enkel Jaccard) på de to.** Koster én time. Hvis du er enig med deg selv til κ = 0,70, ligger modellens presisjon på 0,70 i støygulvet, og terskelen er meningsløs — det er en ubehagelig, verdifull og *publiserbar* innsikt, og den hører rett inn i refleksjonsrapporten som teller 30 %. Legg på: få én medstudent til å annotere én tekst (30 minutter) for et andre κ-punkt. Da har du et målt tak, og da betyr 0,70 noe.

**Problem B: kontaminering fra versjon 2 og utover.** PRD-en sier riktig at annoteringen skjer *før* uttrekket kjøres. Det gjelder bare versjon 1. Fra v2 har du sett hva modellen finner, og enhver justering av gullsettet etterpå er kontaminert. **Fiks:** frys gullsettet i en navngitt commit med dato før første kjøring, og endre det aldri. Må det endres, loggfør endringen som en egen datert hendelse med begrunnelse og rapporter alle tidligere versjoner mot både gammelt og nytt gullsett. To setninger i FR-8, og det er forskjellen mellom en måling og en historie.

**Problem C: symmetrisk måling av asymmetrisk skade.** Å miste «mitose» etterlater eleven fast. Å markere «prosess» er kosmetisk rot. Dette er ikke samme feil, og én F1 skjuler forskjellen. **Fiks:** merk hvert gullbegrep som *blokkerende* (setningen er uforståelig uten det) eller *nyttig*. Krev **gjenkalling ≥ 0,90 på blokkerende** og **≥ 0,60 på nyttige**. Skarpere, billigere og mer sant enn en flat 0,75.

**Problem D — en manglende metrikk, verre enn en svak:** FR-8 måler bare *hvilke* uttrykk som velges. **Om forklaringen er faglig riktig, måles ingen steder.** En korrekt utpekt term med gal forklaring er det mest skadelige utdataet i hele §4.3, og det finnes ingen terskel for det. **Fiks:** legg til én binær vurdering per uttrukket begrep i samme gjennomgang — «forklaringen er faglig riktig gitt Teksten: ja/nei» — med terskel **≥ 0,95** og null toleranse for forklaringer som motsier Teksten. Koster ~2 timer på seks tekster. Den er viktigere enn presisjonstallet.

### 2.2 FR-7 — sirkularitetssjekken er en forfengelighetsmetrikk

«Forklaringen kan ikke bestå *utelukkende* av uttrykket selv med bøyninger eller ordklasseendring. Måles maskinelt: 100 prosent.» Den terskelen passerer du på dag én, og den fanger ingenting. «Mitose er en form for mitotisk celledeling» passerer. **Skarpere:** krev at forklaringen inneholder **minst tre innholdsord som ikke finnes i uttrykket og ikke i uttrykkets egen setning i Teksten**. Maskinsjekkbart, samme kostnad, oppdager faktisk det metrikken later som den oppdager. Alternativt: fjern den. En metrikk du alltid passerer er pynt, og §4.11 har allerede nok å svare for.

### 2.3 FR-9 — tetthetstaket er ikke et tak

8 % av løpende ord. En tekst på 620 ord (4 000 tegn) får da markere **~50 ordforekomster**. Og 25 unike Faguttrykk per 1 000 ord gir ~15 unike i samme tekst — men UJ-1 beskriver fjorten markerte begreper i *fire sider*. Taket ligger altså langt over det brukerreisen selv beskriver som normalt. **Det «harde tetthetstaket» som §4.3 utpeker som forsvaret mot det gule teppet, kommer aldri til å slå inn.** Det er fantasi å kalle det et vern.

**Tallene jeg ville brukt:** maks **4 % av løpende ordforekomster**, maks **12 unike per 1 000 ord**, og — det som mangler helt — et **gulv på minst 5 unike per 1 000 ord**, siden et uttrekk som markerer nesten ingenting også er en feil og i dag er umålt. Legg dessuten på en lokal grense: **maks 3 markeringer per 100 sammenhengende ord.** Et tekstnivå-tak hindrer ikke at alle femten markeringene klumper seg i ett avsnitt, og det klumpete avsnittet *er* det gule teppet.

**Og en ting som ikke kan implementeres som skrevet:** «Overstiges taket, beholdes de høyest rangerte uttrykkene.» Det finnes ingen rangering definert noe sted i PRD-en, og ingen rangeringskolonne i datamodellen i addendum §3. Enten definér rangeringen (modellens egen konfidens er utelukket av SM-C4 — bruk f.eks. frekvens i Teksten kombinert med om uttrykket finnes i en allmennordliste), eller si at kuttet er i dokumentrekkefølge.

### 2.4 FR-11 — Jaccard 0,80 måler API-innstillingene dine

Tre feil i én.

Først: det står ikke om 0,80 er **snitt eller minimum** over de ni tekstene. Et snitt på 0,80 med én tekst på 0,45 er en ødelagt opplevelse for den teksten. Krev **median ≥ 0,80 *og* minimum ≥ 0,65.**

Dernest: med temperatur 0 blir tallet nær 1,0, og du har målt konfigurasjonen din, ikke prompten.

Og viktigst: FR-11 er delvis selvopphevende. Samme FR sier at Begrepssettet lagres ved første kjøring og gjenbrukes. **Ustabilitet når derfor aldri en elev.** Begrunnelsen i FR-11 — «et øvekortsett eleven ikke kan stole på fra en dag til den neste» — er ikke gyldig, for bufringen gjør nettopp at hun kan stole på det. Ærlig formulering: dette er en **diagnostikk på promptrobusthet**, ikke et produktkrav, og det hører ikke i SM-8 som et suksesskriterium på linje med de andre. Rapportér tallet, dropp terskelen, bruk plassen i rapporten.

### 2.5 FR-14 — «verifiserbart gale» er underdefinert i begge retninger

«De øvrige alternativene er verifiserbart gale ut fra Teksten — ikke bare mindre gode.» Riktig krav, men uoperasjonelt. En distraktor om noe Teksten simpelthen ikke nevner er verken støttet eller motsagt. Streng lesning: nesten alle plausible distraktorer ryker, siden fagtekster sjelden eksplisitt benekter noe. Løs lesning: ingenting ryker. Du kommer til å vakle mellom de to, på 160 vurderinger, og da er tallet ikke reproduserbart — heller ikke for deg selv.

**Skarpere:** tre distraktorkategorier, og en regel over dem.
- (a) **motsagt** av Teksten
- (b) **ikke omtalt** i Teksten
- (c) **støttet** av Teksten

Krav per flervalgsspørsmål: **nøyaktig én (c), minst to (a), høyst én (b).** Nå er det en regel en annen person kunne anvendt likt, og *da* betyr 90 %-terskelen noe.

### 2.6 FR-19/FR-21 — 75 % klassifiseringstreff er ikke trygt nok, og tallet er dessuten ikke målbart til den presisjonen

Spørsmålet var om 75 % er godt nok for at produktet er trygt å bruke. **Nei.** Regnestykket:

Fem klasser. 75 % samlet treff sier ingenting om den *ene* cellen som gjør skade: **Misoppfatning lest som Dekkende.** Med 60 tilfeller og 20 misoppfatningstilfeller gir 25 % feilrate ~5 feilklassifiserte misoppfatninger. Går bare to av dem til Dekkende, sier appen til en elev med gal forståelse «det treffer, vi går videre» i **10 % av tilfellene der hun tar feil.** Det er ikke en formativ veileder. Det er en bekreftelsesmaskin. FR-43 navngir denne feilmåten som den alvorligste, mens FR-21 sin terskel tillater den i mengde. Det er en intern selvmotsigelse mellom to krav som står tjue linjer fra hverandre.

Og presisjonen holder ikke: ved n = 60 har «75 %» et 95 %-intervall på omtrent **±11 prosentpoeng**. Å bruke det som en bestått/ikke bestått-port er tallmessig uærlig.

**Skarpere: del terskelen i tre, og gate bare på det som betyr noe.**

1. **Port 1 (sikkerhet): Misoppfatning → Dekkende = 0 av minst 10 misoppfatningstilfeller.** Ikke forhandlingsbar. Én forekomst blokkerer utrulling av den promptversjonen.
2. **Port 2 (beslutningen produktet faktisk tar): slå sammen til binært** — {Delvis, Misoppfatning, Uklart, Utenfor} = «trenger oppfølging» mot {Dekkende} = «kan gå videre». Krev **gjenkalling på «trenger oppfølging» ≥ 0,90.** Dette er målbart ved n = 30 og det er den ene avgjørelsen appen gjør.
3. **Femveisskillet rapporteres som forvekslingsmatrise, uten port.** En Delvis/Uklart-forveksling gir et oppfølgingsspørsmål med litt gal form. Det er til å leve med.

Punktestimatet rapporteres med Wilson-intervall, ikke som et nakent tall.

**Og en produktkonsekvens, siden nøyaktigheten forblir usikker uansett hvor godt prompten blir:** to billige grep gjør en umålbar modellfeil til en brukerrettbar feil.
- Når tilstanden er Dekkende, skal avslutningsoppsummeringen i FR-22 **liste hvilke påstander eleven fikk godkjent**, slik at en feilklassifisering i det minste er synlig i etterkant.
- Gi eleven en **«jeg tror du misforsto svaret mitt»-knapp** som kjører vurderingen på nytt. Én linje i grensesnittet, og det er det eneste reelle svaret et 75 %-tall har på trygghetsspørsmålet.

### 2.7 FR-21 kontrafaktisk test — ordoverlapp under 0,6 fanger ikke en skriptet dialog. Den *garanterer* bestått.

Dette er den skarpeste enkeltfeilen i dokumentet, fordi to metrikker konspirerer.

**FR-20 krever sporbarhet: oppfølgingen må inneholde minst ett innholdsord fra elevens svar. FR-21 måler differensiering som ordoverlapp under 0,6 mellom oppfølgingene på to ulike svar.** Men når prompten er tvunget til å sitere elevens ord, vil to ulike elevsvar automatisk gi to ulike oppfølgingsstrenger — selv om spørsmålet er funksjonelt identisk. «Du skrev «halvparten så mange» — kan du se på avsnitt 2?» mot «Du skrev «kromosomene kopieres» — kan du se på avsnitt 2?» har lav overlapp og er samme spørsmål. **FR-20 gjør FR-21 nesten automatisk bestått.** Terskelen på 90 % vil bli innfridd av en modell som ikke reagerer på innhold i det hele tatt, bare på ordforråd.

Tre feil til i samme metrikk:

- **Ordoverlapp på korte norske spørsmål domineres av funksjonsord.** «Hva skjer med kromosomene under mitose?» mot «Hva skjer med cellekjernen under mitose?» deler fem av seks tokens = 0,83 og blir flagget som gjentakelse, enda de peker på genuint ulike ting. Uten stoppordfjerning og lemmatisering er 0,6 på åtte tokens ren støy — og **ingen steder i PRD-en står det hvordan tokenisering eller stoppord skal håndteres.** Metrikken er ikke reproduserbar som skrevet.
- **Samme tall brukes til to motsatte formål.** FR-20 bruker overlapp < 0,6 til å bety «ikke en gjentakelse». FR-21 bruker overlapp < 0,6 til å bety «differensiert». Riktig verdi for de to er ikke den samme, og å gjenbruke tallet tyder på at det er valgt av estetikk.
- Manuell reserveregel «peker på ulike ting» er udefinert og gjør porten avhengig av den samme utvikleren som skrev prompten.

**Skarpere: mål mål, ikke strenger.** La modellens strukturerte utdata inneholde to felter den likevel må produsere: `kildeavsnitt_id` og `mål`, der `mål` er en av de fem reglene i FR-19 (`nytt_aspekt`, `manglende_element`, `motsigende_avsnitt`, `presisering_av_uttrykk`, `delspørsmål`). Skriv i gullsettet, på forhånd, hvilket avsnitt og hvilket mål oppfølgingen *burde* ha.

Da blir testen:
- **For misoppfatningsvarianten må `kildeavsnitt_id` være forskjellig fra det dekkende-varianten fikk på samme startspørsmål, og `mål` må være `motsigende_avsnitt`. Terskel ≥ 90 %.**
- **`kildeavsnitt_id` treffer utviklerens forhåndsskrevne målavsnitt i ≥ 70 % av tilfellene.**

Dette er hardt, billig og ikke spillbart. En skriptet dialog stryker umiddelbart, fordi et skript ikke kan variere hvilket avsnitt det peker på ut fra hva eleven skrev. Og det koster nesten ingenting å implementere: §5 krever allerede Kildeavsnitt på alt generert innhold, så feltet finnes.

### 2.8 FR-20 sporbarhet — 100 % på et system som ikke svarer

«Oppfølgingen inneholder minst ett innholdsord fra elevens svar.» «Innholdsord» er udefinert, og uten stoppordliste er dette trivielt oppfylt: eleven svarer på et spørsmål om mitose, så ordet «mitose» står i begge. Metrikken vil vise 100 % på et fullstendig ikke-responsivt system.

**Skarpere:** det delte innholdsordet må være et eleven **innførte, og som spørsmålet ikke inneholdt** — altså overlapp med (svarets tokens − spørsmålets tokens − stoppord) ≥ 1. Samme arbeid, og en skriptet oppfølging faller til nær 0.

### 2.9 FR-20 «ett spørsmål» — tegnet, ikke spørsmålet

Maskinsjekk på antall spørsmålstegn fanger ikke «Kan du forklare hva som skjer med antallet, og hvorfor det er viktig?» — to spørsmål, ett tegn. **Fiks, billigst mulig:** modellen leverer oppfølgingen som ett strukturert felt med **maks 25 ord**, og sjekken er ordtelling pluss antall spørsmålstegn = 1. Lengdetaket gjør det meste av jobben.

### 2.10 FR-28 tilbakeoversettelse — ugyldig metode, og et selvmål mot SM-C4

Spørsmålet var om tilbakeoversettelse er en gyldig metode for å oppdage motsigelser. **Nei, ikke for de feilene dette produktet står og faller på.**

- **Blindhet for feil innenfor samme modellfamilie.** Modellen som oversatte no→ar feil, oversetter sin egen arabiske tekst tilbake til norsk på en måte som gjenskaper *den opprinnelige meningen*, fordi feilen ligger i modellens representasjon, ikke i strengen. Tilbakeoversettelse fanger pålitelig utelatt innhold og grov hallusinasjon, og bommer systematisk på det som betyr noe her: **gal terminologi.** Oversetter modellen «maktfordelingsprinsippet» med et ord som betyr maktdeling *mellom stater*, kommer det tilbake som «maktfordeling» og ser plettfritt ut.
- **Den kan ikke oppdage flyt eller register.** En oversettelse som er grammatisk nonsens for en morsmålsleser kan tilbakeoversettes helt rent.
- **Terskelen er dekorasjon.** «Antall tilfeller der tilbakeoversettelsen motsier en påstand i originalen: null», på 30 oppsummeringer à høyst fem setninger — det tallet treffer du på første kjøring, og da har det ikke målt noe.
- **Og det verste: dette er SM-C4 i forkledning.** Motmetrikken SM-C4 sier at språkmodellens egen vurdering av eget utdata aldri skal brukes som dokumentasjon på kvalitet, og kaller det den enkleste og mest forlokkende måten å gjøre kvalitetssikringen verdiløs på. Tilbakeoversettelse *er* modellen som retter seg selv, med ett ekstra steg imellom. FR-28 begår den feilen dokumentet navngir tjue sider tidligere.

**Erstatt med tre ting, alle billige:**

1. **Terminologiankeret (maskin, behold det):** det norske uttrykket i parentes etter hvert oversatte Faguttrykk, ≥ 0,95. Dette er allerede maskinsjekkbart og det er det faktiske sikkerhetsnettet — behold det og gjør det til hovedmetrikken i stedet for en bimetrikk.
2. **Bevaring av tall, egennavn og negasjon (maskin):** hvert siffer, hver dato, hvert egennavn og hver negasjon («ikke», «ingen», «aldri») i den norske oppsummeringen må ha en motpart i oversettelsen. Terskel: 100 % av tallene til stede, likt antall negasjoner. Utelatt negasjon er den ene feilklassen som *snur* en faktapåstand, og den ene tilbakeoversettelse faktisk fanger — så bruk tilbakeoversettelse bare til dette, og bare til dette.
3. **Morsmålsvurdering på fire punkter for fire tekster i **ett** språk:** dekning (sier det det samme), terminologi (er fagbegrepene riktige), lesbarhet for en 15-åring, og «ville du gitt dette til en elev». 4 punkter × 4 tekster = 16 vurderinger, 30 minutter av én persons tid. **Det er det eneste her som utgjør bevis.** Får du det ikke for et språk, er språket Modellstøttet. Regelen står allerede i FR-28 siste punkt — bruk den på to av de tre språkene fra første dag i stedet for å håpe.

**Én ting til, som må ut av FR-28:** stikkprøve ved «et uavhengig oversettelsesverktøy» er ikke uavhengig. Google Translate og din LLM deler treningsdatabias og har samme svakhet på ukrainsk pedagogisk terminologi. Hvis det skal stå i dokumentet, må det merkes «ikke kvalitetssikring, bare et fornuftssjekk». Å bruke en *annen leverandørs* modell er marginalt bedre og fortsatt ikke bevis for faglig presisjon.

### 2.11 FR-31 og alle «null tolerert»-tersklene — trekantregelen

«Ingen påstand i verset motsier Teksten. Måles på 20 vers: antall usanne påstander er null.» Du kan ikke etablere «null» for en generativ funksjon ved å sjekke 20 utfall. Du etablerer en **øvre grense**. Eksakt binomisk 95 %-grense ved 0 funn:

| n | Øvre 95 %-grense for feilrate |
|---|---|
| 10 | **26 %** |
| 20 | **14 %** |
| 40 | **7,2 %** |
| 60 | **4,9 %** |

«Null tolerert i det som vises eleven» er helt greit som **utrullingsregel** — forkast hvert vers med en usann påstand. Det er ikke et måleresultat. Skriv det slik i stedet, for det er både sant og poenggivende i en rapport der kildebruk og metode vurderes:

> «0 av 10 målte vers inneholdt en usann påstand. Øvre 95 %-grense for feilraten er 26 %. Det er derfor oppfordringen i FR-31 finnes, og derfor verset alltid vises sammen med Begrepssettet det er bygget fra.»

Samme regnestykke gjelder FR-14 («null uforankrede spørsmål vises eleven») og FR-23 («null nedvurderende» på 60 svar → øvre grense 4,9 %). Tre tersklene i dokumentet er skrevet som absolutter og er i virkeligheten øvre grenser mellom 5 og 26 %. Å si det selv, med tallene, er sterkere enn å bli tatt på det.

### 2.12 FR-23 tonesjekk — garantert bestått

Utvikleren som skrev prompten er den *minst* egnede til å merke at hans egen formulering er nedlatende mot en slitende 15-åring. En gjennomgang av 60 svar utført av prompt-forfatteren, med «null tolerert», er en metrikk med garantert utfall. **Fiks som koster ti minutter:** la testbrukeren fra SM-10 lese ti Svarvurderinger og markere de som ville gjort *dem* flau. Det er den eneste varianten av testen med noen oppdagelsesevne.

### 2.13 FR-5 — riktig krav, gal testmetode hvis den ikke presiseres

«Brødteksten er ikke tilgjengelig fra aktiveringssiden, verken synlig eller i sidens kildekode.» Med et komponentbasert rammeverk (addendum §3 peker mot Next.js) havner teksten typisk i serialisert tilstand — `__NEXT_DATA__` eller RSC-nyttelasten — selv når den ikke rendres. Testes dette i nettleserens DOM-inspektør, passerer det feilaktig. **Presisér:** testen henter aktiveringssidens HTTP-respons over nettverket og søker etter en 40-tegns delstreng av brødteksten. Én setning, og kravet blir faktisk håndhevet.

### 2.14 FR-13 — dekningskravet dekker ikke det vanlige tilfellet

«Ingen av Tekstens overskriftsdeler er uten minst ett spørsmål, **når Teksten har fire eller færre deler**.» Et kapittel på fire sider har typisk fem til åtte deler, altså nettopp det vanlige tilfellet, og der finnes **ingen dekningskrav i det hele tatt**. Åtte spørsmål kan alle komme fra del 1. **Fiks:** minst 60 % av delene er representert, uavhengig av antall deler. Maskinsjekkbart, siden hvert spørsmål har Kildeavsnitt som tegnindeks og overskriftene har kjente posisjoner.

### 2.15 FR-8 måler et regime du ikke leverer

Gullsettets tekster er 1 000–4 000 tegn. FR-1 tillater **25 000 tegn** inn. Du måler uttrekkspresisjon, quizdekning og tetthetstak på tekster som er seks ganger kortere enn det appen tar imot. Ved 25 000 tegn (~4 000 ord) tillater FR-9 hundre unike Faguttrykk, og både presisjon og dekning oppfører seg annerledes. **Fiks, gratis:** senk taket i FR-1 til **8 000 tegn for v1** og si hvorfor — «vi måler ikke lengre tekster, derfor tar vi ikke imot dem, og eleven henvises til Mappe-deling som dokumentet allerede tilbyr». Alternativet er å legge to lange tekster i gullsettet, som koster timer du ikke har.

### 2.16 Mindre, men reelle

- **FR-2 topp-/bunntekst:** «linjer som gjentas på mer enn halvparten av sidene» misfyrer på en to-siders PDF, der en linje på 2 av 2 sider er en reell overskrift. Krev minst fire sider før heuristikken slår inn.
- **FR-2 bindestreksdeling:** «informa-\nsjon» mot «KI-\nassistert» er ikke avgjørbart uten oppslag. Som skrevet er kravet ikke implementerbart pålitelig. Enten ta inn en norsk ordliste (Norsk ordbank er fritt tilgjengelig), eller si eksplisitt at oppheving er «beste forsøk» og at FR-3 er sikkerhetsnettet. Ikke la det stå som om det er løst.
- **§5 «kall som tar over to sekunder viser en status»** er ikke testbart som formulert. **«Statusindikator vises innen 300 ms etter at kallet starter, uansett varighet»** er trivielt testbart og bedre UX.
- **FR-25 «en gjennomgang av samtlige skjermbilder bekrefter det»** — «samtlige skjermbilder» er ikke opplistet noe sted, og en ubegrenset manuell gjennomgang er ikke en test. FR-24 sier morsmål bare berører tre flater pluss begrepsforklaringer og språklige bilder: **list de seks flatene og skriv seks øyeblikksbildetester** som slår fast at en kjent norsk delstreng finnes i utdataet. To timer, og kravet blir håndhevbart.
- **FR-10 har ingen mobilhistorie.** «Pekerhvil» finnes ikke på telefon, og §5 sier mobil er en reell flate. Det er en direkte motsetning mellom FR-10 og §5. Spesifisér trykk-for-forklaring på berøringsflater, ellers er Lesevisningen — dokumentets viktigste flate — udefinert på halvparten av enhetene.
- **Kildeavsnitt som tegnindeks (addendum §3) brytes hvis Teksten redigeres etter generering.** Ingenting i PRD-en sier at Teksten er uforanderlig etter godkjenning i FR-3, og FR-36 sier bare at genererte elementer ikke regenereres. Én setning fikser en hel feilklasse: **Teksten er uforanderlig etter godkjenning; en endring oppretter en ny Tekst.**
- **FR-38/FR-41s «minst fem forkastede KI-forslag» og «minst tre konkrete feil»** er ikke målinger i noen forstand — de er oppfyllbare ved å skrive fem avsnitt. Det er greit som dokumentasjonskrav, men de skal ikke stå i SM-6 som om de var måleresultater ved siden av SM-2 og SM-3. Og merk insentivet: kravet belønner *å dokumentere* forkastelser, ikke å forkaste godt.

---

## Del 3 — Kan det bygges på ti uker?

### 3.1 Regnestykket

| Post | Timer |
|---|---|
| 44 funksjonskrav, ved snitt 2,5 t (optimistisk — flere er 10–30 t) | 110+ |
| Måleprogrammet som spesifisert | 90–106 |
| Refleksjonsrapport, 30 % av karakteren | 20–25 |
| Arbeidskrav / proposal (finnes ikke ennå, §11 punkt 3) | 5 |
| Arkitektur- og UX-dokumenter (addendumets ukeplan, uke 44–45) | 10 |
| **Behov** | **235–255** |
| **Kapasitet: 12–16 t/uke × 10 uker** | **120–160** |

**Overforpliktet med 60–100 %.**

### 3.2 Hvilken milepæl sprekker: M0, 23. oktober

Ikke M1, selv om M1 er der det blir synlig. **M0 er den som ryker, og den ryker om fire uker.**

1. **M0 inneholder de to vanskeligst målte funksjonene *pluss* hele grunnmuren.** FR-7/FR-8 (uttrekk med gullsett), FR-13/FR-14 (quiz med gullsett), *og* konto, innlogging, lagring, *og* hele kjerneløypens grensesnitt. Autentisering og persistens fra null, gjort ordentlig — passordhashing (FR-35), kaskadesletting (FR-37), utrulling — er 20–30 timer alene for noen som ikke har gjort det før. Og det er nettopp den delen FR-41 krever gjennomgått **linje for linje**.
2. **M0 krever at FR-8- og FR-14-gullsettene er annotert og målt minst én gang.** Etter anslagene i del 1 er det 21–26 timer, i samme fire uker. Fire uker à 12–16 timer er 48–64 timer i alt. Målingen alene er halvparten.
3. **M0-planen er ikke avstemt mot emnets egen ukeplan.** Addendum §1 gjengir at uke 42 (12.–18. oktober) er proposal, uke 43 product brief og PRD, uke 44–45 arkitektur og UX, uke 46–47 implementasjon. PRD §9 legger M0 til 23. oktober og bygger kjerneløypen i uke 40–43. **De to planene beskriver ulike aktiviteter i samme uker, og motsetningen er ikke nevnt noe sted.** Kilden er annenhånds og delvis utdatert, ja — men hvis emnet faktisk krever arkitektur- og UX-dokumenter i uke 44–45, kolliderer de rett inn i M1-vinduet, og proposal-uken spiser M0. Dette er den mest undervurderte risikoen i §9, og den koster én e-post å avklare.
4. **M0 har null slakk, samtidig som §11 lister tre punkter som *blokkerer*:** ubekreftet frist, uavklart solo-mot-gruppe, og et arbeidskrav som ikke er skrevet. Spiser ett av dem en uke, er M0 borte.

**M1 (20. november) er skadelidende, ikke årsaken.** M1 inneholder PDF med sju feiltilstander og sju tester, Øvekort, full fagsamtale med 60-tilfellers gullsett målt og terskler innfridd, morsmål i tre språk med FR-28 gjennomført, pluss tilgjengelighetskravene i §5. Det er 80–100 timer på fire uker. Det skjer ikke.

### 3.3 De tre FR-ene som koster langt mer enn linjen sin

**1. FR-21 — gullsett og måling for fagsamtalen.** 24–26 timer første gang, 6–7 per omkjøring. Det er 60 håndskrevne elevsvar, et testapparat som må konstruere **syntetisk samtalehistorikk** fordi oppfølgingen er tilstandsbærende, tre separate metrikker og en manuell vurdering som ikke kan automatiseres bort. Det er den største enkeltposten i hele PRD-en, den står som én kulepunktliste, og den ligger i M1 — den trangeste milepælen.

**2. FR-2 + FR-3 + FR-4 — PDF med sju navngitte feiltilstander, hver med test og testfil.** 25–35 timer, budsjettert som ett av seks M1-punkter. Realiteten: du må **fabrikkere** sju PDF-er som hver utløser nøyaktig én feilmåte — en passordbeskyttet, en ødelagt med gal filsignatur, en skannet uten tekstlag, en på 41 sider, en tospaltet, en nesten tom. Så sju integrasjonstester som slår fast både den brukersynlige meldingen *og* at den anbefalte handlingen er nåbar i grensesnittet. Pluss bindestrekslogikk som krever ordliste (2.16), pluss topp-/bunntekstdeteksjon, pluss 20-sekunders tidsavbrudd med ett automatisk nytt forsøk uten at filen mistes. Sju feiltilstander er ikke sju linjer.

**3. FR-24–FR-27 — tre språk, høyre-til-venstre, additiv visning, pluss språklige bilder.** RTL gjort riktig er 10–20 timer for noen som ikke har gjort det før, og det vanskelige tilfellet er **nettopp det FR-25 krever**: et norsk uttrykk i parentes, venstre-til-høyre, inne i en arabisk setning som går høyre-til-venstre. Bidi-isolering, feil punktumplassering, parenteser som snur. Og utvikleren kan ikke visuelt verifisere at resultatet er riktig. Oppå det er **FR-27 en andre, umålt uttrekksoppgave** — med eget tetthetstak, egen prompt, og **null gullsett**. Addendum §4 forkastet eksplisitt et andre uttrekk for Øvekort med begrunnelsen «to uttrekk gir to sett å måle, to prompter å vedlikeholde». FR-27 innfører presis det, uten målingen. Det er en intern inkonsistens mellom addendumet og PRD-en.

### 3.4 Hva jeg faktisk ville kuttet, og om PRD-ens kuttrekkefølge er riktig

**PRD-ens kuttrekkefølge — Mapper først, deretter Minnevers — er halvveis riktig, og feil på den andre halvparten.**

Mapper først: **ja.** Men ikke «hvis tiden ikke holder» — **nå.** Begrunnelsen er sterkere enn PRD-ens egen: Mapper er ikke additivt billig. FR-34 (samlet fagsamtale) tvinger samtaleprompten til å håndtere forankring på tvers av flere tekster, og det **ugyldiggjør 60-tilfellers gullsettet som er målt på enkelttekster** — eller krever et andre gullsett. §11 punkt 8 stiller nettopp dette spørsmålet og svarer ikke på det. Mapper er en andre måleforpliktelse forkledd som en samlefunksjon. Fjern FR-32, FR-33 og FR-34 fra §8.1 i dag og gjenvinn 15–20 timer *og* planleggingsoppmerksomheten.

Minnevers som kutt nummer to: **nei, det er feil.** Minnevers er 3–4 timer bygg og 3–4 timer måling. Det er den *billigste* funksjonen i hele dokumentet, det gir et demoøyeblikk, og det gir FR-42 og FR-43 et rent, konkret eksempel på «modellen løy for rimets skyld, og her er tallet». Å kutte det sparer nesten ingenting og koster et dokumenterbart funn i den delen som teller 30 %. **Minnevers bør trekkes *fram* i M1, ikke stå nederst i kuttbunken** — nettopp fordi det er billig og fordi det produserer en målehistorie.

**Kuttlisten jeg ville brukt, i rekkefølge:**

1. **Morsmål fra tre kvalitetssikrede språk til ett** (FR-24, FR-28). Behold polsk eller ukrainsk — polsk er lettest å finne en kontrollkilde til i Norge. **Flytt arabisk til Modellstøttet.** Innvendingen kommer med en gang: «arabisk tvinger fram høyre-til-venstre som et faktisk teknisk krav» (§4.7). Den holder ikke som argument mot kuttet — RTL blir fortsatt bygget og demonstrert via *modellstøttet* arabisk. Du mister ikke det tekniske kravet, bare **måleforpliktelsen** og avhengigheten av to av tre frivillige. Sparer 15–20 timer og fjerner antakelse 4, som er den mest sannsynlige til å ryke sent. **Dette er et større og billigere kutt enn begge PRD-ens egne, og det bør være det første.**
2. **Mapper, FR-32–34.** Nå, ikke som beredskap. 15–20 timer.
3. **FR-27, språklige bilder.** Et umålt andre uttrekk med eget tetthetstak, for det smaleste behovet. 8–12 timer.
4. **Behold Minnevers.** Se over.
5. **FR-1-taket fra 25 000 til 8 000 tegn.** Gratis, og fjerner et regime du ikke måler.
6. **FR-11 fra terskel til diagnostikk.** Temperatur 0, rapporter Jaccard, ingen port. Sparer en diskusjon du ikke kan vinne.

Resultat: **44 FR-er → ~33. Måletimer 90–106 → 35–45.** Behovet faller fra 235–255 til rundt 150–170 timer, mot 120–160 tilgjengelig. Fortsatt stramt. Men det er et prosjekt som kan lande med kodefrysen intakt, og det er ikke det dokumentet beskriver i dag.

### 3.5 Milepælsplanen jeg ville lagt i stedet

- **Nå–2. oktober:** arbeidskravet (proposal), og avklaring av §11 punkt 1 og 2. Er ikke solo godkjent, er resten av dokumentet irrelevant — PRD-en sier det selv, og handler ikke på det. Dette er dag én-arbeid, ikke et åpent punkt på side 20.
- **M0 flyttet fra 23. til 30. oktober, og redusert:** kjerneløype, bare innliming, konto og lagring, FR-8-gullsett på **seks** tekster målt én gang. Quiz-gullsettet flyttes ut.
- **M0.5, 13. november:** quiz, FR-14 målt på 24 spørsmål, Øvekort, Minnevers.
- **M1, 27. november:** fagsamtale med 30-tilfellers gullsett (alle fem tilstander), **ett** kvalitetssikret språk, PDF med fire av sju feiltilstander maskintestet (PF-1, PF-2, PF-3, PF-5 — de som ikke krever eksotiske fabrikkerte filer) og de tre siste dokumentert som manuelle kontroller med begrunnelse for hvorfor.
- **Kodefrys 27. november, ikke 30.** Tre dager er ikke nok buffer til en leveranse som teller 30 % pluss kodedokumentasjonen som ligger inne i de 70. Åtte dager er. Og frysen skal være en **git-tagg**, ikke en intensjon — §9.4 argumenterer riktig for vinduet og gjør det så tre dager langt.
- **28. november–5. desember:** rapport og dokumentasjon.

### 3.6 To ting i §9.5 som vil svikte stille

**Demotesten er selv en skjult kostnad, og den har et ikke-deterministisk steg i en bestått/ikke bestått-port.** Elleve manuelle steg × tre gjennomkjøringer × per milepæl er 1,5–2 timer hver gang. Og steg 7 krever at fagsamtalen gir tilstanden **Misoppfatning** på et bevisst feil svar — altså er utfallet av din utrullingsport avhengig av et modellkall med 75 % nøyaktighet. **Porten din kommer til å feile tilfeldig.** Det er den typen kriterium en solostudent stille slutter å håndheve i midten av november. **Fiks:** hent misoppfatningssvaret fra FR-21-gullsettet og godta kjøringen hvis tilstanden er i {Misoppfatning, Delvis}, eller gjør steg 7 til en test mot en innspilt fikstur i stedet for et live kall.

**Og: «uten inngrep fra utvikleren» er uforenlig med elleve manuelle steg.** Enten automatisér demoløypen (Playwright, 8–12 timer — sannsynligvis verdt det, siden den kjøres ved hver milepæl og er SM-1), eller senk kravet til én gjennomkjøring per milepæl og vær ærlig om at den er manuell. Tre ganger på rad, manuelt, ved hver milepæl, er ikke noe som kommer til å skje.

---

## Det korte svaret

Dokumentet er intellektuelt sterkt og operasjonelt urealistisk, og de to tingene henger sammen: hver god idé om måling er skrevet som om timene var gratis. De tre mest presserende rettelsene er (1) halvér måleprogrammet langs linjene i del 1.4 — det er der prosjektet reddes eller tapes, (2) bytt ut ordoverlapp og tilbakeoversettelse med Kildeavsnitt-baserte tester og én morsmålsvurdering i ett språk, siden de nåværende metodene ikke kan oppdage feilene de er satt til å oppdage og i FR-28 sitt tilfelle begår den feilen SM-C4 advarer mot, og (3) splitt 75 %-terskelen i en sikkerhetsport (Misoppfatning → Dekkende = 0) og en binær oppfølgingsport (gjenkalling ≥ 0,90), fordi 75 % over fem klasser tillater at appen bekrefter en gal forståelse i ti prosent av tilfellene der eleven tar feil — og det er det produktet er bygget for å ikke gjøre.
