---
title: 'FR-16: kildeavsnittet på øvekortet bak én knapp'
type: 'feature'
created: '2026-11-12'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Baksiden av øvekortet viser forklaringen og hele kildeavsnittet. Telefontesten 9.11 fant at kildeavsnittet gjør kortet tungt å lese; PRD FR-16 ble endret 11.11 (commit 71500d7): kildeavsnittet tilbys med én knapp.

**Approach:** Baksiden viser bare uttrykket og forklaringen. Under kortet, når det er snudd, står «Se hvor det står i teksten», som folder ut kildeavsnittet og lenken til avsnittet i teksten — samme mønster som i quizen.

</frozen-after-approval>

## Implementation Notes

**Beslutninger (tatt i planleggingen):**
- Kortet er selv en knapp (snur kortet). En knapp kan ikke inneholde en utfellbar knapp, så kilden legges under kortet, ikke på baksiden.
- `<details>`/`<summary>` som i `Kildeavsnitt` i `app/komponenter/Quiz.tsx`; nøkles på kortet, så den er lukket igjen på neste kort.
- Lenken «Se avsnittet i teksten» flyttes inn i den utfelte delen.

**Filer:** `app/komponenter/Oevekort.tsx`; demotest-steg 7 sjekker at kilden er lukket etter at kortet er snudd.

**Verifisering:** `npx tsc --noEmit`, `npm test`, `npm run demotest`.

**Under implementeringen og gjennomgangen (12.11):**
- `Kildeavsnitt` er flyttet fra `Quiz.tsx` til `app/komponenter/Kildeavsnitt.tsx` og brukes både i quizen og på øvekortet, så de ser og virker likt (lenken heter «Les avsnittet i teksten» begge steder).
- Nøkkelen på `<details>` er fjernet: den utfellbare delen forsvinner uansett når kortet snus tilbake eller eleven går til et annet kort.
- Første demotest stoppet i steg 7: med kortet snudd sto forklaringen på kortknappen, og `button:has-text("Kan")` traff også den. Velgerne bruker nå eksakt rollenavn.

## Review Triage Log

Blind Hunter (underagent, samme modell), 10 funn:
- **low — patch.** Kildeavsnittet var kopiert fra quizen, og lenken hadde to ulike tekster; ville glidd fra hverandre. Felles komponent.
- **low — patch (samme rotårsak).** «Se avsnittet» og «Les avsnittet» for samme lenke.
- **low — patch.** `key={gjeldende.id}` gjorde ingenting (`snudd` settes til false ved bytte), og kommentaren påsto det motsatte. Fjernet.
- **medium — patch.** Demotesten sjekket ikke at kildeavsnittet var borte fra baksiden. Lagt til.
- **low — patch.** Toppkommentaren sa «knapp» og «alt er knapper».
- **low — rejected.** Lenken fra øvekortet følges ikke i demotesten: samme komponent som i quizen, der lenken følges og sjekkes.
- **low — rejected.** Ikke testet at kilden er lukket på neste kort: den utfellbare delen fjernes fra siden når kortet byttes.
- **low — rejected.** Sjekken «folder seg ut» gir ingen detalj ved feil: kosmetisk.
- **low — rejected.** Skjermleser får ikke vite at kilden finnes: summary er neste fokuserbare element etter kortet, med synlig tekst.
- **low — rejected.** Knappene skyves ned på mobil når kilden er åpen: siden kan rulles; hører til designfasen.

**Verifisert 12.11:** `npx tsc --noEmit` ren; `npm test` 385 av 385; `npm run demotest` 3 av 3 ([rapport](../../maaling/resultater/demotest-2026-11-12.md)).
