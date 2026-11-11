---
title: 'FR-3: innlimt tekst hopper over gjennomsynet (fase 3b)'
type: 'feature'
created: '2026-11-12'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Fase 3b (tekstgjennomsynet) må i dag godkjennes for all tekst, også innlimt tekst. Utviklerens telefontest 9.11 viste at steget er et kjedelig hinder uten nytte for innlimt tekst, der det ikke finnes uttrekksfeil å rette. FR-3, AD-9 og PRD §9.5 steg 4 ble endret 11.11 (commit 71500d7).

**Approach:** For tekst med `vei = "liming"` låses teksten og Begrepssettet genereres i samme handling som lagrer forkunnskapssvaret, og eleven sendes rett til lesevisningen. PDF og bilde går gjennom fase 3b som før. Demotesten (steg 4) endres tilsvarende.

</frozen-after-approval>

## Implementation Notes

**Beslutninger (ikke synlige for utvikleren, tatt i planleggingen):**
- Låsing og generering trekkes ut av `laasOgGenerer` i en felles hjelpefunksjon i `app/handlinger.ts`, så aktiveringen og gjennomsynet låser på nøyaktig samme måte. Grensen på 400 tegn og sjekken for tom tekst blir i `laasOgGenerer` (innlimt tekst er alt sjekket ved innliming, FR-1).
- Feiler genereringen etter at innlimt tekst er låst, sendes eleven likevel til lesevisningen, som alt tåler et manglende Begrepssett og tilbyr å prøve igjen (AD-9 går bare framover; ingen blindvei, §5). Feiler selve låsingen, vises feilen på aktiveringssiden.
- Aktiveringsknappen viser «Finner fagordene…» mens den venter når teksten er innlimt, siden kallet nå tar et titalls sekunder (§5, ventetid). For PDF og bilde står «Lagrer…» som før.
- Innlimte tekster som allerede står i tilstanden `aktivert` (laget før endringen), kan fortsatt fullføres via gjennomsynet; siden endres ikke.

**Filer:** `app/handlinger.ts` (`lagreAktivering`, `laasOgGenerer`, ny felles hjelper), `app/komponenter/Skjemaer.tsx` (`AktiveringSkjema` får venteteksten som prop), `app/tekst/[id]/aktivering/page.tsx` (sender venteteksten ut fra `tekst.vei`), `maaling/demotest.mjs` (steg 4).

**Verifisering:** `npx tsc --noEmit`, `npm test` (aldri `npx vitest run`), `npm run demotest` (tre kjøringer, PRD §9.5).

**Under implementeringen (12.11):**
- `laasOgLagBegrepssett` gir `{ laast, svar }`, så aktiveringen vet om teksten ble låst uten et ekstra oppslag.
- Stegtellingen («Steg n av N») måtte også endres, ellers hoppet innlimt tekst fra «Steg 1 av 4» til «Steg 3 av 4». Ny `tekst/steg.ts` med test; brukt på de seks sidene i løypen. Ikke planlagt, men lite og uten valg utvikleren ville merket annerledes.
- Etter gjennomgangen: aktiveringssiden og `lagreAktivering` sender en tekst som alt er aktivert eller låst videre (gjennomsyn / lesing) i stedet for å vise skjemaet. Tilbakeknappen fra lesingen fører nå rett hit for innlimt tekst, og et nytt trykk på «Videre» ville krasjet i `lagreForkunnskapssvar`.
- Forsiden sier «Oppgaver — når teksten er klar til lesing» (var «etter gjennomsynet»).
- Demotest-steg 4 sjekker nå at nettleseren aldri var innom `/gjennomsyn`, at brødteksten kommer uendret fram, og «Steg 2 av 3».
- Demotesten i testmodus «fyll» lagret nye modellsvar (overskriftene endres i steg 2, så teksten er ny); de committes sammen med endringen.

**Filer:** `app/handlinger.ts`, `app/komponenter/Skjemaer.tsx`, `app/page.tsx`, `app/tekst/[id]/{overskrifter,aktivering,gjennomsyn,lesing,oppgaver,quiz}/page.tsx`, `tekst/steg.ts`, `tekst/steg.test.ts`, `maaling/demotest.mjs`.

## Review Triage Log

Blind Hunter (underagent, samme modell), 9 funn:
- **medium — rettet.** Blindvei når låsingen feiler for innlimt tekst: lesingen sender en aktivert tekst til aktiveringen, som viste skjemaet, og «Videre» kastet IkkeFunnet utenfor try. Bekreftet i `lagreForkunnskapssvar` (krever `innlest`).
- **medium — rettet (samme rotårsak).** Aktiveringssiden manglet viderekobling for `aktivert` og `laast`; tilbakeknappen fra lesingen lander nå der for innlimt tekst.
- **low — rettet.** Forsiden sa «Oppgaver — etter gjennomsynet» også for innlimt tekst; eleven ser det ofte.
- **low — rettet.** Kommentaren i gjennomsynet nevnte ikke tekster som står som aktivert fordi låsingen feilet.
- **low — rettet.** Utdatert kommentar øverst i aktiveringssiden.
- **medium — rettet.** Demotest-steg 4 sjekket `true`; ingenting viste at gjennomsynet ble hoppet over.
- **low — rettet.** Steg 13 i demotesten sa «som alt annet».
- **low — utsatt.** Ingen enhetstest av `lagreAktivering` for innlimt tekst; prosjektet tester handlingene gjennom demotesten. Se deferred-work.
- **low — rettet.** `Vei` duplisert fra `NyTekst["vei"]`; to stegkombinasjoner manglet test. `indexOf`-vakt ikke nødvendig: typen og spesialtilfellet dekker alle kombinasjoner.
- **low — utsatt.** PRD-en linje 112 og 899 sier fortsatt at all tekst går gjennom gjennomsynet; endringer i spesifikasjoner utsettes etter arbeidsflyten. Se deferred-work.

**Demotest, første kjøring etter gjennomgangen (12.11):** steg 4 besto i alle tre, men alle stoppet i steg 10. Steg 10 åpner aktiveringssiden for en låst tekst for å se overskriftene på arabisk (FR-26), og rettelsen etter gjennomgangen sendte låste tekster videre til lesingen. Rettet: en låst tekst får aktiveringssiden med overskriftene, men uten skjema, og med lenke til teksten. Aktiverte tekster sendes fortsatt til gjennomsynet.

**Verifisert 12.11:** `npx tsc --noEmit` ren; `npm test` 379 av 379; `npm run demotest` 3 av 3 kjøringer, 159 sjekker uten feil ([rapport](../../maaling/resultater/demotest-2026-11-11.md)).
