---
title: 'Runde 3, bolk 2b: øvekortene (piler, tastatur, «Har kontroll») og «Samlinger»'
type: 'feature'
created: '2026-11-23'
status: 'in-review'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '7043a31cc3a6a927ba7c6c5a3b64f32be13eb8c3'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/oppdrag-design-runde-3.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Etter telefontesten 23.11: «Forrige»/«Neste» tar plass, «Tilbake til mappen» ligger langt nede, «Kan» lover for mye, øvekortene kan ikke tas med tastaturet alene uten å tabbe rundt, og «Samlingen» skal hete «Samlinger».

**Approach:** Pilknapper med tilgjengelig navn, tilbakelenken øverst i sidens header, «Kan» → «Har kontroll» i all tekst eleven ser (lagret kode `kan` uendret), tastatursnarveier på øvekortene, og «Samlinger» som navn på siden og i menyen.

## Boundaries & Constraints

**Always:**
- Domenebegrepet Mappe beholdes overalt («Mappene dine», «Tilbake til mappen», knapper, quiz).
- «Samlinger» erstatter «Samlingen» i overskriften (med tusjen), menylenken og løpende tekst eleven ser. I løpende tekst brukes det som navn: «i Samlinger», «Tilbake til Samlinger».
- Venstrehendt-valget (`data-hand="venstre"`) virker som før. DOM-rekkefølgen for Tab er uendret: kortet, «Må øve mer», «Har kontroll», (feil), kilden, forrige, neste.
- Tastaturet: ←/→ bytter kort og mellomrom snur, med en lytter som bare finnes mens øvekortene vises. Ignoreres når fokus er i `input`, `textarea`, `select` eller `contenteditable`, og ved Ctrl/Alt/Meta. Mellomrom snur bare når fokus IKKE står på en knapp, lenke eller `summary` (der gjør mellomrom det det alltid gjør). Pilene virker ikke på et kort som ikke har noe forrige (første) og avslutter runden på siste, som knappene.

**Never:** Ingen endring i lagringen av merkingen, rundene eller kilden. Ingen ny global snarvei utenfor øvekortene. Mappe byttes ikke ut med Samling noe sted.

**Avgjort (Arve, 23.11):** Menylenken endres også. **Avgjort av agenten:** siste kort viser fortsatt teksten «Ferdig» (en pil sier ikke at runden slutter). Øvekort fra én Tekst får samme behandling: «Tilbake til oppgavene» øverst i headeren.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Pil høyre | fokus på kortet eller ingenting, ikke siste kort | neste kort, forsiden opp | N/A |
| Pil venstre på første | kort 1 | ingenting skjer | N/A |
| Pil høyre på siste | siste kort | runden er ferdig, som «Ferdig» | N/A |
| Mellomrom, fokus på body | kort vises | kortet snus én gang | N/A |
| Mellomrom på «Har kontroll» | fokus på knappen | bare knappen virker (merker), kortet snus ikke | N/A |
| Mellomrom på kortet | fokus på kortknappen | snus én gang, ikke to | N/A |
| Taster i skjemafelt | fokus i et `input` på siden | ingenting fanges | N/A |
| Ctrl+→ | modifikator | nettleserens egen | N/A |

</frozen-after-approval>

## Code Map

- `app/komponenter/Oevekort.tsx` -- `gaaTil`, `setSnudd`, `.oevekort-nav` (linje ~212–220: «← Forrige»/«Neste →»), merkeknappen «Kan» (~191), telleren «Kan: …» (~140), «Du kan {kan} av …» (~112). `merk("kan")` beholdes.
- `app/mappe/[id]/oevekort/page.tsx` -- header (`<p>Øvekort fra mappen</p>`, `<h1>`), «Tilbake til mappen» nederst (~54) → øverst.
- `app/tekst/[id]/oevekort/page.tsx` -- «Tilbake til oppgavene» nederst (~55) → øverst.
- `app/globals.css` -- `.oevekort-nav` (~2203): to like brede knapper; behold rutenettet.
- «Samlingen» som eleven ser: `app/komponenter/Meny.tsx:19`, `app/samling/page.tsx:62,182`, `app/mappe/[id]/page.tsx:181,207`, `app/komponenter/Mappeskjemaer.tsx:190`, `app/handlinger.ts:694`, `app/vilkaar/page.tsx:228`. Kommentarer og logglinjer kan stå.
- `maaling/sjekk-tilgjengelighet.mjs` -- avhenger av tekstene: «Samlingen» (816, 1488–1489, 1784, 2393), `/^← Forrige$/`, `/^(Neste →|Ferdig)$/` (1142–1143, 1196–1224), «Kan» i Tab-rekka (1211, 1224), `Kan: 1 ·|Du kan 1 av` (851, 856).
- `maaling/demotest.mjs` -- `name: "Kan"` (313, 513), `"Neste →"` (314).
- `_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/EXPERIENCE.md` (83, 92, 202, 237, 291) og `DESIGN.md` (388, 419, 426).

## Tasks & Acceptance

**Execution:**
- [x] `app/komponenter/oevekorttaster.ts` (ny) + `oevekorttaster.test.ts` -- ren funksjon `tastehandling({ key, ctrl, alt, meta, maal })` → `"forrige" | "neste" | "snu" | null`, der `maal` beskriver fokuselementet (tag, rolle, contenteditable) -- matrisen kan testes uten DOM.
- [x] `app/komponenter/Oevekort.tsx` -- pilknapper (`←`/`→` synlig, `aria-label` «Forrige kort»/«Neste kort», siste: «Ferdig»); «Har kontroll» i knapp, teller («Har kontroll: N · Må øve: …») og sluttmelding («Du har kontroll på N av M fagord.»); `useEffect` med `keydown` på `document` som bruker `tastehandling` og `preventDefault` på det den håndterer; oppdater toppkommentaren.
- [x] `app/mappe/[id]/oevekort/page.tsx`, `app/tekst/[id]/oevekort/page.tsx` -- tilbakelenken øverst, over overskriften, som del av headeren; fjern den nederst.
- [x] «Samlingen»-filene i Code Map -- «Samlinger».
- [x] `maaling/sjekk-tilgjengelighet.mjs`, `maaling/demotest.mjs` -- nye navn og etiketter; legg til sjekk: pilknappene har tilgjengelig navn og er minst 44 × 44 px, og ←/→/mellomrom virker på øvekortsiden.
- [x] `EXPERIENCE.md`, `DESIGN.md`, `prd-lesevenn.md` (FR-16/17 der knappene nevnes, FR-49 navnet) -- datert 23.11.

**Acceptance Criteria:**
- Given øvekortsiden med `data-hand="venstre"`, when den vises på 375 px, then merkeknappene står til venstre og pilknappene under kortet som før.
- Given skjermleser, when fokus går til pilknappen, then den leses «Neste kort, knapp».

## Verification

**Commands:**
- `npx vitest run app/komponenter/oevekorttaster.test.ts` -- grønt (ikke full vitest)
- `npx tsc --noEmit`, `npx eslint app` -- uten feil
- `npm run sjekk:tilgjengelighet`, `npm run sjekk:readme` -- alt bestått
- `npm run demotest` -- bestått; kjøres med `LESEVENN_TESTMODUS=les` så den ikke gjør betalte modellkall; feiler den på `lagret_svar_mangler`, rapporter det i stedet for å slå modellen på

## Implementation Notes
- Utenfor Code Map, samme regel: «Kan»/«samlingen» også i `data/arbeidsbord.ts` (status «Har kontroll på N av M»), `app/tekst/[id]/oppgaver/page.tsx`, `app/konto/page.tsx`, `data/mappegrenser.ts`, `app/komponenter/Arbeidsbord.tsx`. «Øv på de N du ikke kan ennå» → «… du vil øve mer på».
- `maaling/demotest.mjs`: modusen var hardkodet til `fyll`; nå `process.env.LESEVENN_TESTMODUS ?? "fyll"`, så `=les` virker.
- Sjekker: vitest 50/50, tilgjengelighet 424/424, demotest 3/3 (les), README 8/8.

## Spec Change Log

## Review Triage Log
