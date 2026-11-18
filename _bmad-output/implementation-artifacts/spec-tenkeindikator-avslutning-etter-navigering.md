---
title: 'Tenkeindikatoren: avslutningen spilles også når svaret bytter side eller innhold'
type: 'bugfix'
created: '2026-11-17'
status: 'done'
baseline_commit: 'eb63c37bb76231578ef8c8ee328cda63ccdbb293'
route: 'dispatch'
review_loop_iteration: 1
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** EXPERIENCE.md sier at avslutningen (brillene blir til B) spilles når svaret kommer, men den spilles bare ved quizrettingen. Overalt ellers fjernes indikatoren når svaret kommer: handlingen sender eleven til en ny side (`redirect`), eller siden bytter ut innholdet der indikatoren sto (`revalidatePath`). Utviklerens telefontest 17.11 så avslutningen bare i quizen.

**Approach:** Når en indikator som venter forsvinner fordi svaret kom, gir den avslutningen videre til en vert i rotlayouten, som lever videre gjennom navigeringen. Verten spiller avslutningen. På telefon skjer det i tenkepillen, på samme sted som pillen sto.

## Boundaries & Constraints

**Always:**
- Bare flate- og knappeformen gir videre, og bare når stedet har en `ferdigStatus` (for eksempel «Fagordene er klare.»). Linjeformen (oversettelser i bakgrunnen) gir ikke videre.
- Det gis ikke videre ved feil. Blir komponenten stående, er det som i dag. Har siden eleven havner på `feil` eller `fagordfeil` i adressen, spilles ingen avslutning.
- React StrictMode i utvikling monterer komponenter to ganger. Det skal ikke gi en avslutning.
- Verten har én statusregion, `role="status"`, som finnes tom fra første tegning. Avslutningen varer like lenge (4,3 s + 1,2 s), pillen glir bort som i dag, og med redusert bevegelse vises B-en direkte. Pillen teller med i `--tenker-pille`/`har-tenkepille` (`meldPille`), så den dekker ikke innhold.
- Quizrettingen (`bareAvslutning`, `ferdigStatus` i `Quiz.tsx`) virker som før.
- **Beslutning 17.11 (utvikleren), PC:** fra 760 px spiller verten avslutningen i et lite fast kort nederst til høyre: 64 px merke og status, samme flate, kant og skygge som tenkepillen, 16 px fra kanten. Det vises bare under avslutningen, aldri mens Buddy tenker. Indikatoren i innholdet er som før. DESIGN.md endres tilsvarende («aldri en pille» gjelder ventingen, ikke avslutningen etter at siden er byttet).

**Never:**
- Ingen endring i serverhandlingene og ingen nye adresseparametre for å melde suksess.
- Navigeringen holdes aldri igjen for å vente på avslutningen.
- Fokus flyttes ikke av avslutningen.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Ny side, telefon | Innlimt tekst, «Videre» → lesevisningen | Pillen står igjen nederst, avslutningen spilles, status «Fagordene er klare.», pillen glir bort | N/A |
| Innholdet byttes | Quizen lages → quizen vises | Avslutningen spilles i verten, status «Quizen er klar.» | N/A |
| Knapp | Svar i fagsamtalen → ny runde vises | Avslutningen spilles i verten | N/A |
| Feil, komponenten står | Handlingen returnerer `feil` | Ingen avslutning, feilmeldingen vises som i dag | N/A |
| Feil via adressen | `?feil=vurdering` eller `?fagordfeil=…` | Ingen avslutning | N/A |
| StrictMode | Dobbel montering i utvikling | Ingen avslutning | N/A |
| Redusert bevegelse | `prefers-reduced-motion` | B-en vises direkte, pillen forsvinner uten bevegelse | N/A |

</frozen-after-approval>

## Code Map

- `app/komponenter/Tenker.tsx` -- `Tenker`: legg til overleveringen ved avmontering mens `aktiv`, med en ref til siste `aktiv`/`ferdigStatus`. Overleveringen utsettes og avbrytes hvis samme instans monteres igjen (StrictMode). Ny eksport, for eksempel `TenkerVert`, som abonnerer på en liten modulbutikk (`useSyncExternalStore`) og tegner avslutningen med den eksisterende flate- og pillemarkeringen og `meldPille`.
- `app/layout.tsx:52-68` -- monter verten én gang i `<body>`, utenfor `{children}`.
- Stedene som får `ferdigStatus` (tekst i stil med «… er klar»):
  - `app/komponenter/Skjemaer.tsx`: `Send` (sender `ferdigStatus` videre fra skjemaene: aktivering for liming, lås på nytt, gjennomsyn, oppsummering, minnevers og fagord på nytt), og quizen som lages (`Skjemaer.tsx:224`).
  - `app/komponenter/Samtale.tsx`: første spørsmål (`:69`), svar (`:98`), flatene `:44`/`:54`, `RevurderKnapp`, `:174`.
  - `app/komponenter/Innlesing.tsx:521`: bildeinnlesingen.
- `app/globals.css:447-540` -- gjenbruk `.tenker-flate` og pillen. Ingen nye farger.
- `maaling/sjekk-tilgjengelighet.mjs:919-1120` (bolk 5) -- ny sjekk på 375 px: etter «Videre» på en innlimt tekst viser lesevisningen pillen med «Fagordene er klare.» i statusregionen, og den er borte etter 6 s. Pluss axe med pillen.
- `_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/EXPERIENCE.md:89` og `DESIGN.md:370-375` -- beskriv overleveringen.

**Regler for når det gis videre (runde 2, etter gjennomgangen):**
- **Klienten vet svaret:** quizen som lages, fagord på nytt, `ProevIgjen`, `RevurderKnapp` og bildeinnlesingen (`Innlesing.tsx`, `Bilder`). Her settes `ferdigStatus` først når kallet eller lesingen har lyktes (`klar`), aldri mens det ventes. Et fanebytte midt i bildeinnlesingen gir altså ingen avslutning. Disse stedene sjekker ikke adressen, fordi de selv vet at det lyktes.
- **Retry-stedene bærer en gammel feil i adressen.** Det gjelder `FinnFagordPaaNytt` på `/lesing?fagordfeil=…` og `ProevIgjen`/`RevurderKnapp` på `/samtale/…?feil=…`. Ved suksess bytter de til samme sti uten feilparametrene, med `router.replace` i en overgang (`startTransition`, som `ProevIgjen`), i stedet for `router.refresh`. Da står ingen gammel feil igjen for senere svar.
- **Serverskjemaene (`Send` i `Skjemaer.tsx` og `Samtale.tsx`)** kan ikke vite svaret. De gir videre bare når alle tre vilkårene holder:
  1. Ingen feilparameter står i adressen etter byttet.
  2. Eleven har ikke selv forlatt siden mens det ventet. Mens `aktiv`, lytter `Tenker` på klikk på `a[href]` i dokumentet og på `popstate`. Skjer en av dem, avbrytes overleveringen.
  3. Skjemaet har ikke fått `feil` tilbake (`feilet`).
- **Navnene på feilparametrene** (`feil`, `fagordfeil`) eksporteres fra én modul, som både omdirigeringene i `app/handlinger.ts` og sjekken i `Tenker.tsx` bruker.
- **Aktivering av innlimt tekst og gjennomsynet** gir statusen «Teksten er klar.», ikke «Fagordene er klare.». Låsingen kan lykkes uten fagord.
- **PC-kortet** (`.tenker-vert` fra 760 px) teller ikke med i pilleregnskapet. `meldPille` kalles bare når `matchMedia(TELEFON)` (`app/komponenter/brytepunkt.ts`) stemmer, så siden blir ikke lengre på PC.
- **CSS:** `.tenker-vert` deler regler med pillen (felles selektor eller egendefinerte egenskaper), ikke kopierte verdier.

**Referanse:** forrige implementasjon (runde 1) ligger i `C:/Users/admin/AppData/Local/Temp/claude/830d294fc0eff3c5/cbc96016-9b61-4005-93f2-fedbd4a23ab6/scratchpad/tenker-runde1-referanse.patch`. Se KEEP i Spec Change Log.

## Tasks & Acceptance

**Execution:**
- [x] `app/komponenter/Tenker.tsx` -- butikk, overlevering, `TenkerVert`, forlat-vernet, PC uten pilleregnskap -- kjernen
- [x] `app/layout.tsx` -- monter verten -- lever gjennom navigeringen
- [x] `Skjemaer.tsx`, `Samtale.tsx`, `Innlesing.tsx`, `minnevers/page.tsx` -- `ferdigStatus` per sted etter reglene over, og retry-stedene bytter adressen -- statusen
- [x] felles modul for feilparametrene, brukt av `app/handlinger.ts` og `Tenker.tsx`
- [x] `app/komponenter/Tenker.test.ts` -- ren logikk: overleveringen, feil-adressen, StrictMode-avbrytelsen og forlat-vernet
- [x] `maaling/sjekk-tilgjengelighet.mjs`:
  - telefonsjekken (vent på `detached` med romslig grense, ikke fast 6 s)
  - et negativt tilfelle: en lenke trykket midt i ventingen gir ingen avslutning
  - PC: siden blir ikke lengre mens kortet vises
- [x] `maaling/demotest.mjs` -- en ekte sjekk av at verten viser «Quizen er klar.» og så forsvinner. Ingen `.catch(() => {})` som svelger feil.
- [x] EXPERIENCE.md, DESIGN.md:
  - alle statusene, ikke bare «… er klar»
  - verten flytter ikke fokus
  - `bareAvslutning` gis ikke videre
  - forlat-vernet
  - kjent begrensning: en serverhandling som kaster, kan ikke skilles fra et svar, fordi appen ikke har `error.tsx`

**Acceptance Criteria:**
- Given telefon (375 px), when eleven trykker «Videre» på en innlimt tekst og teksten låses, then avslutningen spilles i pillen på lesevisningen og statusregionen sier «Teksten er klar.».
- Given en venting som ender med feil (returnert `feil` eller en feilparameter etter byttet), when feilmeldingen vises, then spilles ingen avslutning noe sted.
- Given lesevisningen med `?fagordfeil=…`, when «Prøv igjen» lykkes, then adressen er uten `fagordfeil` og avslutningen spilles.
- Given en venting i et serverskjema, when eleven trykker en lenke i topplinjen før svaret kommer, then spilles ingen avslutning.

## Implementation Notes

- `ferdigStatus` har to roller: verdien i siste tegning mens det ventet styrer overleveringen; verdien i tegningen der `aktiv` blir `false` styrer avslutningen på plassen. Skjemaene (`Send` i `Skjemaer.tsx` og `Samtale.tsx`) setter den derfor alltid mens `pending`, og etterpå bare uten `svar.feil` (`feilet`).
- Der klienten selv vet at svaret kom (`LagQuizAutomatisk`, `FinnFagordPaaNytt`, `ProevIgjen`, `RevurderKnapp`), settes `ferdigStatus` først etter et vellykket kall (`klar`). Da gir verken en feil eller en elev som går fra siden mens Buddy tenker noen avslutning. `RevurderKnapp` holder nå knappen låst til siden er oppdatert (som `ProevIgjen`).
- `bareAvslutning` (quizrettingen) gir ikke videre, så `Quiz.tsx` er uendret.
- Overleveringen er `lagOverlevering` (ren logikk, testet) og `giAvslutningVidere` (`setTimeout` 0, sjekker `location.search`). StrictMode-avbrytelsen er dekket av enhetstesten; `sjekk:tilgjengelighet` kjører i `next dev` (StrictMode på) og viser overleveringen etter sidebyttet og ingen ekstra avslutning.
- Minneversene får «Verset er klart.» fra siden (`HandlingSkjema` fikk `ferdigStatus`).
- `maaling/demotest.mjs`: steg 12/6 venter nå til vertens «Quizen er klar.» er ferdig før luften nederst måles (ny, riktig oppførsel).
- Kjent begrensning: et skjema som venter på en serverhandling (`Send`) kan ikke skille et sidebytte fra svaret fra at eleven selv trykker en lenke midt i ventingen; da spilles avslutningen likevel. Og står `feil` igjen i adressen fra før (samtalesiden etter «Prøv igjen»), spilles ingen avslutning, etter regelen.

- Runde 2 (17.–18.11): reglene i Code Map er bygget. `app/feiladresse.ts` holder feilparametrene. Forlat-vernet lytter på klikk på `a[href]` og på `popstate` mens det ventes. Verten melder seg i pilleregnskapet bare under `TELEFON`. Pillen og kortet deler egendefinerte egenskaper (`--tenker-svev-*`). Byggeagenten stoppet i verifiseringen, og den ble fullført i hovedøkten. Sjekken for «Prøv igjen» med `?fagordfeil` brukte en tekst lagt rett inn som låst, uten avsnittsrader, og feilet på et manglende lagret svar. Nå bruker den teksten som ble låst gjennom den ekte flyten, og sletter fagordene dens.

## Spec Change Log

**Runde 1 → 2 (17.11, review_loop_iteration 1).**
- **Hva utløste endringen:** tre gjennomganger fant to rotårsaker.
  - (a) Serverskjemaene og bildeinnlesingen satte `ferdigStatus` hele tiden mens det ventet. Da kom en falsk avslutning når eleven forlot siden, byttet fane midt i bildeinnlesingen, eller handlingen kastet. Det bryter akseptkriteriet om feil.
  - (b) Adressesjekken leste en gammel `?feil=`/`?fagordfeil=` etter `router.refresh`, så vellykkede «Prøv igjen» ga ingen avslutning.
- **Hva er endret:**
  - Code Map har fått «Regler for når det gis videre».
  - Tasks og akseptkriteriene er utvidet.
  - Statusen for aktivering og gjennomsyn er nå «Teksten er klar.».
- **Hva endringen unngår:** falsk «… er klar» etter at eleven gikk fra siden, og retry-steder som aldri spiller avslutningen.
- **KEEP fra runde 1** (referansepatchen):
  - Butikken på modulnivå med `useSyncExternalStore`, `lagOverlevering` som ren og testet logikk, og `giAvslutningVidere` med `setTimeout` 0 og StrictMode-avbrytelse.
  - `TenkerVert` med én statusregion som er tom fra første tegning, gjenbruk av flate- og pillemarkeringen og utgangen, og montering i `layout.tsx`.
  - `klar`-mønsteret i `LagQuizAutomatisk`, `FinnFagordPaaNytt`, `ProevIgjen` og `RevurderKnapp` (knappen låst til siden er oppdatert).
  - «Verset er klart.» på minnevers-siden.
  - Sjekkene på 375 px og 1280 px i `sjekk-tilgjengelighet.mjs`.
  - Dokumentteksten i EXPERIENCE.md og DESIGN.md, utvidet etter Tasks.

## Review Triage Log

Runde 1 (17.11): Blind Hunter (B), Edge Case Hunter (E) og Verification Gap (V).

| Funn | Vurdering | Bevis / rute |
|---|---|---|
| B2/E1/E2/E3/E-krav: falsk avslutning (eleven går, fanebytte i bildeinnlesingen, handlingen kaster) | medium | `Send` og `Bilder` satte `ferdigStatus` mens det ventet. bad_spec, regler i Code Map |
| B1/E4/E5/E-krav: gammel feil i adressen stopper retry-avslutningen | medium | `feilIAdressen` leser adressen uendret etter `refresh`. bad_spec |
| E6 `FinnFagordPaaNytt` uten overgang rundt `refresh` | low | Kan kutte avslutningen. Tatt med i retry-regelen (bad_spec) |
| E8 «Fagordene er klare.» når ingen fagord ble funnet | low | Låsingen kan lykkes uten fagord. bad_spec (status endret) |
| B3 PC-kortet teller som pille, og siden blir lengre | low | `meldPille` uten breddesjekk. bad_spec |
| B4 Kopierte CSS-verdier | low | Pillen og kortet kan gli fra hverandre. bad_spec |
| B5 Feilparametrene står to steder | low | Ny parameter gir stille feil. bad_spec |
| V1/B7/E10 Demotesten svelger tidsavbrudd, og «Quizen er klar.» sjekkes ikke | medium | `.catch(() => {})` og `detached` holder med en gang. bad_spec (Tasks) |
| B7/E9 6 s-grensen i telefonsjekken | low | Ca. 200 ms margin. bad_spec (Tasks) |
| B8 Dokumentene: statusene, fokus og `bareAvslutning` | low | EXPERIENCE sier bare «… er klar». bad_spec (Tasks) |
| B6 React-koblingen er ikke enhetstestet | low | Dekket av nettlesersjekkene i `next dev`. Avvist |
| B9 Skjermleseren kan miste den høflige meldingen ved sidebytte | maybe-false | Krever test med ekte skjermleser. Utsatt (deferred-work.md, medium, ikke bekreftet) |
| E7 `klar` blir stående om quizen fortsatt mangler etter refresh | low | Krever en refresh uten quiz etter vellykket `lagQuiz`, som ikke er vist. Avvist |
| V2 `feilet`-sperren i samtalens `Send` er ikke testet | gap | Utsatt etter lagets forslag (samtalesiden har ingen nettlesersjekk) |
| V3 `RevurderKnapp`: opplåsing ved feil er ikke testet | gap | Utsatt etter lagets forslag |

**Runde 2 (18.11)**: Blind Hunter (B), Edge Case Hunter (E) og Verification Gap (V).

| Funn | Vurdering | Bevis / rute |
|---|---|---|
| V2 Forlat-vernet på «tilbake» er ikke kjørt | medium | Den nye nettlesersjekken avslørte en ekte feil: React bytter siden synkront i Nexts popstate-lytter, før vernets lytter kjører. patch: varig teller (`lyttEtterTilbake`), lest i tidsbryteren |
| V1 «Bildene er lest.» sjekkes ikke | medium | Ingen sjekk. patch: demotest steg 13 |
| V3 Omdirigering til feiladresse bare testet med stubbet `sok` | medium | patch: nettlesersjekk med `?fagordfeil` (tekst uten lagret svar) |
| B6 Verten på telefon glir inn på nytt etter sidebyttet | low | `tenker-pille-inn` på `.tenker-vert`. patch: `animation: none` på telefon |
| E1/E2 Anker, tomt «#», `mailto:` i forlat-vernet | low | Popstate fra anker og «#» satte `forlatt`. patch: sti-sammenligning og protokollsjekk, enhetstester |
| B12 `oppdaterUtenFeil` kopiert | low | To kopier. patch: `app/komponenter/oppdaterUtenFeil.ts` |
| B1 Testen for `adresseUtenFeil` sjekker ikke `kode` | low | patch: sammenligner med `"/x"` |
| B13 EXPERIENCE: låsing uten fagord | low | patch: dokumentet sier at det ikke blir noen avslutning |
| B2 Adressesjekken stopper serverskjemaer på en side med gammel feil | low | Gjelder bare oppsummeringen på `?fagordfeil`, og det er sjeldent. Avvist |
| B3 Avslutning på plassen ved omdirigering til samme side med `?feil` | low | Siden skjuler skjemaet ved feil (`v.svarSkjema`). Avvist |
| B4 Ingen `error.tsx` | low | Kjent begrensning, dokumentert. Utsatt |
| B5 PC-kortet kan dekke et hjørne i 5,5 s | low | Fokus flyttes ikke dit, og det er utviklerens valg (A). Avvist |
| B7/E5 Bredden sjekkes én gang per avslutning | low | Rotasjon i løpet av 5,5 s. Avvist |
| B8 Adressen leses etter `setTimeout(0)` | false | Den nye sjekken med `?fagordfeil` viser at adressen er skrevet. Avvist |
| B9 `forlatt` nullstilles ikke når navigeringen avbrytes | low | Krever en lenke som avbryter. Avvist |
| B10/B11 Livsløpet til verten er ikke enhetstestet, og faste ventetider | low | Dekket av nettlesersjekkene. Avvist |
| B14 Raden i EXPERIENCE er lang | low | Stil. Avvist |
| E3 `target` `_top`/`_SELF` | low | Appen bruker dem ikke. Avvist |
| E4 Omdirigering til innlogging eller tidligere steg | low | Utløpt økt midt i ventingen er sjeldent. Avvist |
| E6 `kode` fjernes mens en annen runde har feil | low | To feilede runder samtidig. Avvist |
| E7 Demotesten feiler om quizen alt finnes | false | Demotesten lager nye tekster hver kjøring. Avvist |
| E8 `.catch` i sjekk-tilgjengelighet | low | Kravet gjaldt demotesten. Avvist |
| V4/V5 Samtalesiden (`oppdaterUtenFeil`, `feilet`) | gap | Utsatt (som V2/V3 i runde 1) |

## Verification

**Commands:** (fra PowerShell; `vitest` feiler i Git Bash)
- `npx tsc --noEmit` -- ingen feil
- `npm test` -- alle grønne
- `npm run sjekk:tilgjengelighet` -- alle bestått
- `node maaling/demotest.mjs` -- 3 av 3

