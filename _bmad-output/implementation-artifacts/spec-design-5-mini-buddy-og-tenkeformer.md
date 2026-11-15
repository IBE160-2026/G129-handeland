---
title: 'Designfase bolk 5: mini-Buddy (M1), tenkepille (A) og Buddy i knappen (B)'
type: 'feature'
created: '2026-11-15'
status: 'draft'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/DESIGN.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/EXPERIENCE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Tenkeindikatoren er en blokk på 64 px i flaten der innholdet kommer. På telefonen ruller eleven ofte bort fra den og ser ikke at Buddy jobber. Korte ventinger, som et svar i fagsamtalen, tar dessuten unødvendig mye plass.

**Godkjent:** Arve 15.11 valgte mini-Buddy **M1** (dagens tegning, bare mindre, med stenger), og vil ha både **A** (tenkepille nederst) og **B** (Buddy i knappen). Utkastet ligger i `ux-designs/ux-Lesevenn-2026-11-12/.working/runde-10-mini-buddy-og-mobil.html`.

**Approach:** `Tenker` får tre former:
- `flate`: som i dag, 64 px. Under 760 px vises den i stedet som en pille som ligger fast nederst på skjermen, med Buddy på 28 px og statusen.
- `knapp`: Buddy på 22 px inne i knappen som ble trykket, med statusteksten som knappetekst. Den brukes ved korte ventinger.
- `linje`: Buddy på 24 px foran én linje med status, for oversettelser i bakgrunnen.

Statusregionen og reglene fra EXPERIENCE.md gjelder for alle tre formene.

## Boundaries & Constraints

**Always:**
- M1 er den samme tegningen som `BuddyMerke`, bare i mindre størrelse. Det er ingen ny tegning.
- **Avslutningen** (blunk, B-en og ryggen) må få plass i alle størrelser og former. Ingen del av B-en eller stengene klippes, verken i pillen, i knappen eller på 64 px. Det sjekkes med en filmstripe av avslutningen på 375 px (se Verification).
- **Pillen:**
  - Den ligger over innholdet, men dekker aldri fokusert innhold. Siden får `padding-bottom` så lenge pillen vises.
  - Den respekterer `env(safe-area-inset-bottom)`.
  - Den er synlig både mens Buddy tenker og under avslutningen, og glir så bort. Med redusert bevegelse forsvinner den uten bevegelse.
- **Knappen:** Den er `disabled` mens Buddy tenker, men leselig, uten opacity under 0,9. Buddy i knappen bruker knappens forgrunnsfarge til rammen.
- Statusregionen (`role="status"`) finnes tom før ventingen, uansett form. Bare én region kunngjør, og pillen er ikke en ekstra region.

**Never:**
- Ingen endring i hvilke kall som venter, i nye forsøk eller i bruksgrenser.
- Ingen pille på 760 px og bredere. Der vises flaten som i dag.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Quizen lages på telefon | 375 px, `flate` | Pille nederst med Buddy på 28 px som leser og «Buddy lager quizen din …» | N/A |
| Svar i fagsamtalen | `knapp` | Knappen viser Buddy på 22 px og «Buddy leser svaret ditt …» | Feil: knappen går tilbake og Feilmelding vises |
| Oversettelse | `linje` | Buddy på 24 px og «Buddy oversetter forklaringene …» | Uendret FR-29-merknad |
| Ferdig i pillen | Quiz rettet | Avslutningen spilles i pillen, uten klipping, og pillen glir bort | N/A |
| PC | 1280 px, `flate` | Som i dag, 64 px i flaten | N/A |

</frozen-after-approval>

## Code Map

- `app/komponenter/Tenker.tsx` -- dagens API: `aktiv`, `status`, `hjelp`, `ferdigStatus` og `bareAvslutning`. Legg til `form`.
- `app/komponenter/Merke.tsx` -- `BuddyMerke` (variantene «ansikt», «b» og «briller», og størrelsen). Sjekk at viewBox for «ansikt» dekker hele banen til avslutningen: rotasjonen −90° rundt (60, 40) og flyttingen (−16, 20). Ellers klippes B-en. Bruk eventuelt `overflow: visible` på SVG-en.
- `app/globals.css` -- `.merke`-keyframes (tenk og slutt). Pillens stil og overgang.
- Bruksstedene:
  - `Skjemaer.tsx`: fagord og etiketter er `flate`, og `LagQuizAutomatisk` er `flate`.
  - `Samtale.tsx`: `Send` og `RevurderKnapp` er `knapp`. Første spørsmål er `flate`.
  - `Quiz.tsx`: rettingen er `knapp` ved knappen og `flate` (bare avslutningen) øverst.
  - `Morsmaal.tsx` `HentOversettelse` er `linje`.
  - `Innlesing.tsx`: bildeinnlesingen er `flate`.
- `app/komponenter/Tenker.test.ts` -- utvid med formene.

## Tasks & Acceptance

**Execution:**
- [ ] `app/komponenter/Merke.tsx` og `globals.css` -- avslutningen skal få plass i alle størrelser, slik at viewBox eller overflow dekker hele banen.
- [ ] `app/komponenter/Tenker.tsx` -- formene `flate` (med pille under 760 px), `knapp` og `linje`.
- [ ] Bruksstedene i Code Map -- velg form som angitt.
- [ ] `app/komponenter/Tenker.test.ts` -- tester for statusregionen og `aria-hidden` i hver form.
- [ ] `DESIGN.md` (Components: thinking-indicator og logo-mark) og `EXPERIENCE.md` (Component Patterns: Tenkeindikator) -- beskriv mini-Buddy M1 (størrelsene 22, 24 og 28 px) og de tre formene.
- [ ] `maaling/sjekk-tilgjengelighet.mjs` -- på 375 px: pillen vises ved quizlaging, dekker ikke fokusert innhold, og axe er grønn mens den vises.

**Acceptance Criteria:**
- Given 375 px og en quiz som lages, when eleven ruller til bunns, then er pillen fortsatt synlig, og ingen knapp eller lenke ligger skjult under den.
- Given at avslutningen spilles i pillen, then er hele B-en (ryggen og buene) synlig i hver frame.

## Verification

**Commands:**
- `npx tsc --noEmit`, `npm test`, `npm run lint` og `npm run build` -- forventet: grønt
- `npm run sjekk:tilgjengelighet` -- forventet: bestått

**Manual checks:**
- Filmstripe (playwright, ett bilde hvert 300 ms over 4,5 s) av avslutningen på 375 px i pillen, i knappen og på 64 px. Ingen del av merket skal være klippet i noen frame. Legg bildene i scratchpad og se på dem.
