---
title: 'Runde 3, bolk 1: innloggingssperre med nedtelling'
type: 'feature'
created: '2026-11-23'
status: 'ready-for-dev'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/oppdrag-design-runde-3.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Innloggingen sperres etter 3 forsøk per 10 s (Better Auths standard), som er for strengt for en elev som skriver feil, og meldingen sier «Vent et minutt» uansett hvor lenge sperren faktisk varer. Skjemaet kan sendes inn igjen mens sperren står.

**Approach:** Egen regel for `/sign-in/email`: 5 forsøk per 60 s. Ved 429 leser skjemaet `X-Retry-After`, sier det faktiske antallet sekunder og sperrer knappen med nedtelling til sperren er over. Regelen dekkes av en enhetstest og en ny mutasjonsregel (13 → 14).

## Boundaries & Constraints

**Always:** Regelen står i `rateLimit.customRules` i `data/auth.ts` og bruker den hashede telleren som i dag. Registrering (`/sign-up/email`) beholder 3 per 10 s. Skjemaene går fortsatt via `authKlient` (kodefunn 11). Meldingen følger §5 (hva skjedde + hva eleven kan gjøre) og leses opp én gang (`role="alert"`). Når sperren er over, får skjermlesere én høflig melding om at eleven kan prøve igjen.

**Never:** Ingen migrasjon, ingen ny miljøvariabel, ingen endring i `hashetTeller`. Nedtellingen skal ikke leses opp hvert sekund. Ingen utrulling uten ja.

**Avgjort av agenten:** Registreringsskjemaet bruker samme nedtelling (samme kodevei, ellers står «Vent et minutt» igjen der). Mangler eller er overskriften ugyldig, brukes 60 s.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Innenfor grensen | 5 feil passord fra samme IP innen 60 s | Fem svar uten 429 | N/A |
| Sperret | 6. forsøk innen 60 s | 429, `X-Retry-After` mellom 11 og 60 | Skjema: «Vent 47 sekunder, og prøv igjen.», knappen viser «Vent 47 s» og er sperret |
| Ett sekund | `X-Retry-After: 1` | «Vent 1 sekund, og prøv igjen.» | N/A |
| Overskrift mangler/ugyldig | `null`, `"abc"`, `"0"`, `"-3"` | 60 sekunder | fallback |
| Nedtelling ferdig | teller når 0 | knappen er «Logg inn» igjen, feilmeldingen fjernes, statusmelding «Du kan prøve igjen nå.» | N/A |

</frozen-after-approval>

## Code Map

- `data/auth.ts` -- `lagAuth` → `rateLimit: { enabled, customStorage }`; legg til `customRules`. Better Auth 1.7.7 matcher stien uten `/api/auth` (`/sign-in/email`), se `node_modules/better-auth/dist/api/rate-limiter/index.mjs` `resolveRateLimitConfig`. `TELLER_LEVETID_MS` (10 min) er lengre enn 60 s, så ryddingen er trygg.
- `app/komponenter/KontoSkjemaer.tsx` -- `somFeil` (429-grenen, linje ~52), `InnloggingSkjema`, `RegistreringSkjema`. `authKlient.signIn.email(body, { onError(ctx) { ctx.response.headers.get("X-Retry-After") } })`; samme for `signUp.email`.
- `app/komponenter/Feilmelding.tsx` -- gjenbrukes uendret (`role="alert"`).
- `data/auth.test.ts` -- `describe("begrensning av innloggingsforsøk")`: tre tester antar 3 per 10 s (5–6 forsøk, «10 s»-kommentar, flytter `lastRequest` 60 000 ms tilbake). Må oppdateres.
- `data/sjekk-innlogging.mjs` -- `FEIL`-lista, 13 regler; legg til nr. 14.
- `_bmad-output/planning-artifacts/prd-lesevenn.md` -- FR-35 (linje ~743) og FR-41 (~792).
- `_bmad-output/planning-artifacts/gjennomgang-innlogging.md` -- avsnittet «Utvidet 19.11.2026»; nytt avsnitt for 23.11.

## Tasks & Acceptance

**Execution:**
- [ ] `data/auth.ts` -- `customRules: { "/sign-in/email": { window: 60, max: 5 } }` med kommentar om hvorfor (elev som skriver feil, standarden 3/10 s) -- selve sperren.
- [ ] `app/komponenter/sperretid.ts` (ny) -- rene funksjoner: `sekunderFraOverskrift(verdi: string | null): number` (heltall ≥ 1, ellers 60) og `ventetekst(sek)` («1 sekund»/«N sekunder») -- testbart uten DOM, som de andre `.test.ts` i mappa.
- [ ] `app/komponenter/sperretid.test.ts` (ny) -- matrisens kanttilfeller.
- [ ] `app/komponenter/KontoSkjemaer.tsx` -- `somFeil` tar sekunder for 429; en liten hook (`useSperre`) med `setInterval` som teller ned, sperrer knappen, fjerner feilen og setter en `aria-live="polite"`-status ved 0; brukt i begge skjemaene -- nedtellingen.
- [ ] `data/auth.test.ts` -- oppdater de tre testene til 5 per 60 s; ny test: de fem første slipper gjennom, det sjette gir 429 med `X-Retry-After` > 10 og ≤ 60; ny test: `/sign-up/email` sperres fortsatt etter 3 -- låser regelen og avgrensningen.
- [ ] `data/sjekk-innlogging.mjs` -- regel 14 «Innlogging tillater fem forsøk per minutt»: bytt `"/sign-in/email": { window: 60, max: 5 }` med en sti som ikke matcher.
- [ ] `prd-lesevenn.md`, `gjennomgang-innlogging.md` -- FR-35: grensen og meldingen; FR-41/gjennomgangen: 14 regler og resultatet av kjøringen.

**Acceptance Criteria:**
- Given regel 14 er brutt, when `npm run sjekk:innlogging` kjøres, then minst én test feiler, og rapporten sier 14 av 14.
- Given sperret innlogging, when eleven tabber til knappen, then den er `disabled` og viser gjenstående sekunder, og skjermleseren har lest meldingen én gang.

## Verification

**Commands:**
- `npx vitest run data/auth.test.ts app/komponenter/sperretid.test.ts` -- grønt (ikke full vitest: den overskriver vurderingsark)
- `npm run sjekk:innlogging` -- 14 av 14 oppdaget
- `npx tsc --noEmit` og `npx eslint app/komponenter data` -- uten feil
- `npm run sjekk:tilgjengelighet`, `npm run demotest`, `npm run sjekk:readme` -- som før

**Manual checks:**
- Lokalt med `next build && next start` (sperren er bare på i produksjonsmodus): seks feil passord → melding med sekunder, nedtelling på knappen, «Logg inn» igjen ved 0.

## Implementation Notes

## Spec Change Log

## Review Triage Log
