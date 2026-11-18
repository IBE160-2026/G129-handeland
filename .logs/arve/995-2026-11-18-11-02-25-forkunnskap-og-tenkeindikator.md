# Forkunnskap, minnevers og tenkeindikator

## 2026-11-18 kl. 11:02 — Arve

### Oppgave
Arve syntes forkunnskapssteget (aktiveringen) ikke inspirerte til å skrive, og ville ha minneversene merket tydeligere som uferdige. Etter telefontesten 17.11 ba han også om at tenkeindikatorens avslutning (brillene blir til B) ble sett på. Den kom bare ett sted i quizen.

### Plan
- Minnevers: merket «Uferdig» i viften, på oppgavesiden og på minnevers-siden, gjort direkte.
- Forkunnskap: fire forslag (A–D). Arve valgte C + D med A som belønning: merk overskriftene, ett «lurer på»-spørsmål, og begge vist igjen etter lesingen. Bygget med bmad-build ([spec-fr-6-forkunnskap-merk-og-lurer-paa.md](../../_bmad-output/implementation-artifacts/spec-fr-6-forkunnskap-merk-og-lurer-paa.md)).
- Tenkeindikatoren: egen bolk med bmad-build ([spec-tenkeindikator-avslutning-etter-navigering.md](../../_bmad-output/implementation-artifacts/spec-tenkeindikator-avslutning-etter-navigering.md)). Arve valgte et lite kort nede til høyre på PC.
- Begge bolkene: byggeagent, tre uavhengige gjennomganger (blind, kanttilfeller, verifisering), triage og rettelser.

### Resultat
- **Minnevers** (main, 339ba8a): merket «Uferdig» (stiplet rød kant) i viften, også når det er låst, på oppgavesiden og på verssiden, med en boks før verset lages. Tilgjengelighetssjekken leser kortnavnet uten merket.
- **FR-6 forkunnskap** (grenen `forkunnskap`: 2842272, 0b95ed7, eb63c37):
  - Det frie feltet er borte. Hver overskrift merkes «Dette kan jeg», «Har hørt om» eller «Helt nytt» (navnene er Arves valg), og eleven kan skrive ett «Noe du lurer på før du leser?».
  - Lesevisningen viser «Før du leste»: «Du lurte på: … Fikk du svar?» med lenke til fagsamtalen, og de helt nye overskriftene. Eldre tekster viser det frie svaret.
  - Migrasjon 0008 legger til `forkunnskap_merking` og `lurer_paa`. Den er **ikke kjørt mot Neon**.
  - Gjennomgangen fant 25 funn: 9 ble rettet, 1 utsatt (morsmålslinje i «Før du leste»).
  - npm test 646, tilgjengelighet 259/259, demotest 3/3, README 8/8.
  - PRD FR-6, EXPERIENCE.md og arkitekturen (AD-9) er oppdatert.
- **Tenkeindikatoren** (grenen `tenkeindikator` fra `forkunnskap`: 102470d):
  - Avslutningen gis videre til `TenkerVert` i rotlayouten når svaret bytter side (redirect) eller innhold (revalidate). På telefon spilles den i tenkepillen, fra 760 px i et lite kort nede til høyre som ikke gjør siden lengre.
  - Ingen avslutning ved feil (returnert feil eller feil i adressen), og ingen når eleven selv går fra siden, verken med lenketrykk eller «tilbake».
  - Retry-stedene fjerner `?feil`/`?fagordfeil` fra adressen.
  - Runde 1 ble rullet tilbake etter bad_spec: falsk avslutning, og retry uten avslutning. Spesifikasjonen fikk regler og ble bygget på nytt.
  - I runde 2 fant en ny nettlesersjekk en ekte feil: React bytter siden synkront i Nexts popstate-lytter, før vernets lytter kjører. Den ble løst med en varig teller som leses i overleveringens tidsbryter.
  - npm test 660, tilgjengelighet 276/276, demotest 3/3 (også «Quizen er klar.» og «Bildene er lest.»).
- **Utrulling 18.11** (Arve valgte å teste i prod med tilbakerulling som reserve, fordi forhåndsversjonen på Vercel mangler innloggingsinnstillingene): migrasjon 0008 kjørt mot Neon (9 av 9), `main` spolt fram til `tenkeindikator` (750474a) og `vercel --prod`. Med fulgte nøyaktig 339ba8a, 2842272, eb63c37 og 102470d. Forsiden svarer 200, og /samling sender til /logg-inn.
- `vitest` feiler i Git Bash («reading 'config'»), men virker i PowerShell.

### Åpne punkter
- Arve tester på telefon i prod. Feiler noe: `vercel rollback` til forrige versjon (migrasjonen kan stå, den bare legger til kolonner).
- «Før du leste» viser overskriftene bare på norsk, ikke med morsmålslinje (deferred-work.md).
- Tenkeindikatoren: ikke prøvd med ekte skjermleser om «… er klar» leses opp ved sidebytte (deferred-work.md).
- Tenkeindikatoren: samtalesiden mangler nettlesersjekk av `feilet`-sperren, `RevurderKnapp` og `oppdaterUtenFeil` (deferred-work.md).
- Ingen `app/error.tsx`: en serverhandling som kaster mens indikatoren venter, kan gi «… er klar» over Nexts feilside (deferred-work.md).
- Demotesten lager nye lagrede oversettelsessvar hver kjøring (12 nye i dag). Nøklene ser ikke ut til å være faste, og hver kjøring koster noen modellkall. Finn ut hvorfor.
