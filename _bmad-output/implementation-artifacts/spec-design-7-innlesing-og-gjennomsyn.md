---
title: 'Design runde 2, bolk 7: innlesingsfanene, bilderekkefølgen og oppfordringen i gjennomsynet'
type: 'feature'
created: '2026-11-18'
status: 'in-review'
baseline_commit: '1ba24cb13f65853a7ed4a3571d2fdcbdb1d5a080'
route: 'dispatch'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Utviklerens telefontest 18.11 fant tre problemer:
- På telefon bryter fanen «Ta bilder» ned på en egen linje under «Lim inn tekst» og «Last opp PDF».
- Når flere bilder lastes opp samtidig, sier ingenting at eleven må sjekke rekkefølgen, og boksen «Før du tar bildene» er lett å overse.
- Gjennomsynet etter bildeinnlesing ber ikke tydelig nok om å lese gjennom.

**Approach:**
- Tre like brede faner på én rad: «Lim inn», «PDF» og «Bilder».
- Bildeboksen blir tydeligere, og innholdet følger steget. Før noe er valgt, står «**Før** du tar bildene». Når to eller flere bilder er valgt, står i stedet «**Etter** at du har lastet opp bildene» med oppfordringen om rekkefølgen, rett over listen.
- Gjennomsynet får utviklerens tekst: «Når du laster opp bilder, hender det at Buddy leser feil. Les gjennom teksten under for å se at den er lik teksten du tok bilde av. Rett det som er feil før du går videre.»

## Boundaries & Constraints

**Always:**
- Fanene står på én rad fra 320 px, også med 200 % tekst (de kan krympe, men brytes ikke til to rader). Fanene er like brede, og `role="tablist"`/`tab`/`aria-selected` er som før.
- Boksen før opplasting har innholdet fra FR-44 (høyst N bilder, én side per bilde, bildene lagres ikke). «Før» er uthevet (fet, og i farge eller understreket, ikke farge alene). Boksen har en tydeligere ramme og flate, som merknaden om minneverset (amber). Det er samme stil i mørk modus.
- Med to eller flere bilder står det: «**Etter** at du har lastet opp bildene: Sjekk at sidene står i riktig rekkefølge. Bruk pilene for å flytte dem.» Med ett bilde står «Før»-boksen som før.
- Gjennomsynet viser bare den nye teksten for bilde-veien (FR-45). PDF og liming er uendret.

**Never:**
- Ingen endring i selve innlesingen, rekkefølgelogikken eller grensene.
- Ingen ny Buddy-tegning her. Det skyldbetyngede uttrykket er en egen bolk etter skissene.

</frozen-after-approval>

## Code Map

- `app/komponenter/Innlesing.tsx:141-160` -- fanene: `flex-wrap` og `px-4` gir brytningen. Bruk tre like kolonner uten brytning og nye navn.
- `app/komponenter/Innlesing.tsx:475-484` -- boksen «Før du tar bildene», og listen `:505-525` med pilene. Boksen velges ut fra `bilder.length`.
- `app/tekst/[id]/gjennomsyn/page.tsx:77-84` -- merknaden for `tekst.vei === "bilde"`.
- `maaling/demotest.mjs:417,439` og eventuelle andre steder som klikker `[role=tab]:has-text("Last opp PDF")`/`"Ta bilder"` -- følg de nye navnene. Søk også i `maaling/sjekk-*.mjs`.
- `maaling/sjekk-tilgjengelighet.mjs` -- ny sjekk på 320 og 375 px: alle tre fanene har samme `offsetTop`, også med 200 % tekst.
- `_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/EXPERIENCE.md` -- innlesingen og gjennomsynet.

## Tasks & Acceptance

**Execution:**
- [x] `app/komponenter/Innlesing.tsx` -- fanene, de to boksene
- [x] `app/tekst/[id]/gjennomsyn/page.tsx` -- den nye teksten
- [x] `maaling/*.mjs` -- nye fanenavn og fanesjekken
- [x] EXPERIENCE.md

**Acceptance Criteria:**
- Given 320 px med 200 % tekst, when siden «Legg inn tekst» åpnes, then står «Lim inn», «PDF» og «Bilder» på én rad.
- Given bildefanen, when eleven velger tre bilder, then står «Etter at du har lastet opp bildene» med oppfordringen om rekkefølgen rett over listen, og «Før du tar bildene» er borte.
- Given en tekst lest fra bilder, when gjennomsynet åpnes, then viser merknaden utviklerens tekst og oppfordringen om å rette.

## Implementation Notes

- Fanene er et rutenett med tre like kolonner (`grid-cols-3`, `min-w-0`, `hyphens-auto break-words`). Med 200 % tekst på 320 px er hver fane 85 px, og et navn deles heller inne i fanen enn at fanen flyttes ned. Sjekken måler også at navnet ikke flyter ut av fanen.
- Boksene i bildefanen deler stilen `MERKNAD` (amber, `border-2`) og `Uthevet` (fet, amber-800/300, understreket). «Etter»-boksen står som søsken rett før `<ol>`.
- Merknaden etter at bildene er lest (i Innlesing, før lagring) er ikke gjennomsynet og er uendret.

## Spec Change Log

## Review Triage Log

## Verification

**Commands:** (fra PowerShell)
- `npx tsc --noEmit`, `npm test`, `npm run sjekk:tilgjengelighet`, `node maaling/demotest.mjs` -- alle grønne
