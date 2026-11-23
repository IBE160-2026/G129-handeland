---
title: 'Runde 3, bolk 1: innloggingssperre med nedtelling'
type: 'feature'
created: '2026-11-23'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '5b4d73c41a6ee936db063e2df039af706739b38b'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/oppdrag-design-runde-3.md'
---

<frozen-after-approval reason="human-owned intent â€” do not modify unless human renegotiates">

## Intent

**Problem:** Innloggingen sperres etter 3 forsÃ¸k per 10 s (Better Auths standard), som er for strengt for en elev som skriver feil, og meldingen sier Â«Vent et minuttÂ» uansett hvor lenge sperren faktisk varer. Skjemaet kan sendes inn igjen mens sperren stÃ¥r.

**Approach:** Egen regel for `/sign-in/email`: 5 forsÃ¸k per 60 s. Ved 429 leser skjemaet `X-Retry-After`, sier det faktiske antallet sekunder og sperrer knappen med nedtelling til sperren er over. Regelen dekkes av en enhetstest og en ny mutasjonsregel (13 â†’ 14).

## Boundaries & Constraints

**Always:** Regelen stÃ¥r i `rateLimit.customRules` i `data/auth.ts` og bruker den hashede telleren som i dag. Registrering (`/sign-up/email`) beholder 3 per 10 s. Skjemaene gÃ¥r fortsatt via `authKlient` (kodefunn 11). Meldingen fÃ¸lger Â§5 (hva skjedde + hva eleven kan gjÃ¸re) og leses opp Ã©n gang (`role="alert"`). NÃ¥r sperren er over, fÃ¥r skjermlesere Ã©n hÃ¸flig melding om at eleven kan prÃ¸ve igjen.

**Never:** Ingen migrasjon, ingen ny miljÃ¸variabel, ingen endring i `hashetTeller`. Nedtellingen skal ikke leses opp hvert sekund. Ingen utrulling uten ja.

**Avgjort av agenten:** Registreringsskjemaet bruker samme nedtelling (samme kodevei, ellers stÃ¥r Â«Vent et minuttÂ» igjen der). Mangler eller er overskriften ugyldig, brukes 60 s.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Innenfor grensen | 5 feil passord fra samme IP innen 60 s | Fem svar uten 429 | N/A |
| Sperret | 6. forsÃ¸k innen 60 s | 429, `X-Retry-After` mellom 11 og 60 | Skjema: Â«Vent 47 sekunder, og prÃ¸v igjen.Â», knappen viser Â«Vent 47 sÂ» og er sperret |
| Ett sekund | `X-Retry-After: 1` | Â«Vent 1 sekund, og prÃ¸v igjen.Â» | N/A |
| Overskrift mangler/ugyldig | `null`, `"abc"`, `"0"`, `"-3"` | 60 sekunder | fallback |
| Nedtelling ferdig | teller nÃ¥r 0 | knappen er Â«Logg innÂ» igjen, feilmeldingen fjernes, statusmelding Â«Du kan prÃ¸ve igjen nÃ¥.Â» | N/A |

</frozen-after-approval>

## Code Map

- `data/auth.ts` -- `lagAuth` â†’ `rateLimit: { enabled, customStorage }`; legg til `customRules`. Better Auth 1.7.7 matcher stien uten `/api/auth` (`/sign-in/email`), se `node_modules/better-auth/dist/api/rate-limiter/index.mjs` `resolveRateLimitConfig`. `TELLER_LEVETID_MS` (10 min) er lengre enn 60 s, sÃ¥ ryddingen er trygg.
- `app/komponenter/KontoSkjemaer.tsx` -- `somFeil` (429-grenen, linje ~52), `InnloggingSkjema`, `RegistreringSkjema`. `authKlient.signIn.email(body, { onError(ctx) { ctx.response.headers.get("X-Retry-After") } })`; samme for `signUp.email`.
- `app/komponenter/Feilmelding.tsx` -- gjenbrukes uendret (`role="alert"`).
- `data/auth.test.ts` -- `describe("begrensning av innloggingsforsÃ¸k")`: tre tester antar 3 per 10 s (5â€“6 forsÃ¸k, Â«10 sÂ»-kommentar, flytter `lastRequest` 60 000 ms tilbake). MÃ¥ oppdateres.
- `data/sjekk-innlogging.mjs` -- `FEIL`-lista, 13 regler; legg til nr. 14.
- `_bmad-output/planning-artifacts/prd-lesevenn.md` -- FR-35 (linje ~743) og FR-41 (~792).
- `_bmad-output/planning-artifacts/gjennomgang-innlogging.md` -- avsnittet Â«Utvidet 19.11.2026Â»; nytt avsnitt for 23.11.

## Tasks & Acceptance

**Execution:**
- [x] `data/auth.ts` -- `customRules: { "/sign-in/email": { window: 60, max: 5 } }` med kommentar om hvorfor (elev som skriver feil, standarden 3/10 s) -- selve sperren.
- [x] `app/komponenter/sperretid.ts` (ny) -- rene funksjoner: `sekunderFraOverskrift(verdi: string | null): number` (heltall â‰¥ 1, ellers 60) og `ventetekst(sek)` (Â«1 sekundÂ»/Â«N sekunderÂ») -- testbart uten DOM, som de andre `.test.ts` i mappa.
- [x] `app/komponenter/sperretid.test.ts` (ny) -- matrisens kanttilfeller.
- [x] `app/komponenter/KontoSkjemaer.tsx` -- `somFeil` tar sekunder for 429; en liten hook (`useSperre`) med `setInterval` som teller ned, sperrer knappen, fjerner feilen og setter en `aria-live="polite"`-status ved 0; brukt i begge skjemaene -- nedtellingen.
- [x] `data/auth.test.ts` -- oppdater de tre testene til 5 per 60 s; ny test: de fem fÃ¸rste slipper gjennom, det sjette gir 429 med `X-Retry-After` > 10 og â‰¤ 60; ny test: `/sign-up/email` sperres fortsatt etter 3 -- lÃ¥ser regelen og avgrensningen.
- [x] `data/sjekk-innlogging.mjs` -- regel 14 Â«Innlogging tillater fem forsÃ¸k per minuttÂ»: bytt `"/sign-in/email": { window: 60, max: 5 }` med en sti som ikke matcher.
- [x] `prd-lesevenn.md`, `gjennomgang-innlogging.md` -- FR-35: grensen og meldingen; FR-41/gjennomgangen: 14 regler og resultatet av kjÃ¸ringen.

**Acceptance Criteria:**
- Given regel 14 er brutt, when `npm run sjekk:innlogging` kjÃ¸res, then minst Ã©n test feiler, og rapporten sier 14 av 14.
- Given sperret innlogging, when eleven tabber til knappen, then den er `aria-disabled` (nÃ¥s med Tab, sender ikke) og viser gjenstÃ¥ende sekunder, og skjermleseren har lest meldingen Ã©n gang.

## Verification

**Commands:**
- `npx vitest run data/auth.test.ts app/komponenter/sperretid.test.ts` -- grÃ¸nt (ikke full vitest: den overskriver vurderingsark)
- `npm run sjekk:innlogging` -- 14 av 14 oppdaget
- `npx tsc --noEmit` og `npx eslint app/komponenter data` -- uten feil
- `npm run sjekk:tilgjengelighet`, `npm run demotest`, `npm run sjekk:readme` -- som fÃ¸r

**Manual checks:**
- Lokalt med `next build && next start` (sperren er bare pÃ¥ i produksjonsmodus): seks feil passord â†’ melding med sekunder, nedtelling pÃ¥ knappen, Â«Logg innÂ» igjen ved 0.

## Implementation Notes

- **Knappen er `aria-disabled`, ikke `disabled`, under sperren.** Akseptkriteriet krever at eleven kan tabbe til knappen og hÃ¸re at den er sperret; en `disabled` knapp hoppes over av Tab og mister fokus hvis den hadde det. `aria-disabled="true"` leses som Â«utilgjengeligÂ»/Â«dimmetÂ», og `send()` nekter Ã¥ sende mens sperren stÃ¥r (ogsÃ¥ ved Enter i et felt). Mens forespÃ¸rselen gÃ¥r (`venter`) er knappen fortsatt `disabled` som fÃ¸r.
- Nedtellingen regnes fra et sluttidspunkt (`Date.now() + sek*1000`), ikke ved Ã¥ telle intervaller, sÃ¥ en strupet bakgrunnsfane viser riktig tall.
- Statusregionen (`role="status"`, `aria-live="polite"`) stÃ¥r tom fra montering og fylles bare ved 0; knappeteksten er ingen levende region, sÃ¥ sekundene leses ikke opp.
- `somFeil(feil, sekunder = 60)`: Logg ut og Slett konto bruker standarden, sÃ¥ en eventuell 429 der sier Â«Vent 60 sekunderÂ».
- Sekunder hentes i `onError(ctx)`: andre argument for `signIn.email`, inne i `fetchOptions` for `signUp.email` (der `fetchOptions` alt fantes).
- **Matriserevisjon (hovedÃ¸kten):** meldingen, knappeteksten, nedtellingen og Â«Du kan prÃ¸ve igjen nÃ¥.Â» er trukket ut som rene funksjoner i `sperretid.ts` (`sperremelding`, `knappetekstUnderSperre`, `nedtelling`, `SPERRE_OVER`) og testet, siden repoet ikke har DOM-testverktÃ¸y. 36 av 36 grÃ¸nne.

## Spec Change Log

## Review Triage Log

| # | Lag | Funn | Verdikt | Begrunnelse | Rute |
|---|---|---|---|---|---|
| 1 | blind | `Sperrestatus` har `empty:hidden` (display:none) — regionen er ute av tilgjengelighetstreet når den fylles, så «Du kan prøve igjen nå.» kan bli stum | medium | `KontoSkjemaer.tsx` `<p role="status" … empty:hidden>`; kommentaren lover det motsatte | patch |
| 2 | blind | Feilmeldingen står med «Vent 47 sekunder» mens knappen teller ned | low | Slik matrisen (frossen) beskriver det: meldingen leses én gang, knappen viser gjenstående tid. Retting krever endret intensjon | avvist (godkjent atferd) |
| 3 | blind | Felles skole-IP (NAT): en klasse deler telleren | medium | Ekte, men nøkkelen per IP fantes før denne endringen; endringen gjør sperren mildere | defer |
| 4 | blind, edge | «5 per 60 s» er glidende: telleren nullstilles først 60 s etter SISTE tillatte forsøk | medium | `hashetTeller`: `utloept = lastRequest <= naa - window`, og `lastRequest` flyttes ved hvert tillatt forsøk. PRD/gjennomgang/kommentar sier «per minutt» | patch (ordlyd) |
| 5 | blind, edge | Registreringstestens siste påstand består uten overskrift (`Number(null)` = 0) og sjekker ikke 429 | low | `auth.test.ts`, siste `expect` i registreringstesten | patch |
| 6 | blind | Registreringstesten sjekker ikke at de tre første er 403 | low | Kommentaren påstår 403, testen sjekker bare «ikke 429» | patch |
| 7 | blind, verif | Klientkoblingen (overskriftsnavn, sendesperre, nullstilling) har ingen automatisk test | medium | Forhåndsverifisert av verification-gap; ingen DOM-verktøy. Minste retting: overskriftslesingen og sendesperren som rene funksjoner i `sperretid.ts`, testet; resten manuell sjekk | patch |
| 8 | blind, edge | `sekunderFraOverskrift` har ingen øvre grense | low | `"999999"` gir sperre i dager; rettingen er én `Math.min` | patch |
| 9 | blind | Sperren glemmes ved omlasting | low | Serveren sperrer fortsatt; neste forsøk gir ny 429 med riktig tid. Retting (sessionStorage) gir kompleksitet | avvist |
| 10 | blind | Gjennomgangen nevner ikke de endrede testene og `sperretid.test.ts` | low | FR-41-dokumentasjon; ren tekstretting | patch |
| 11 | blind | PRD-tilleggene mangler kildehenvisning med sti | low | Ren tekstretting | patch |
| 12 | verif (annet) | Logg ut / Slett konto sier nå «Vent 60 sekunder» uten tall fra serveren | low | `somFeil(error)` med standard 60; tidligere «et minutt». Retting: uten kjent tid, behold «Vent et minutt» | patch |
| 13 | edge | Klokka stilles bakover under sperren | low | Sjeldent; retting gir ny kompleksitet | avvist |
| 14 | edge | `/api/auth//sign-in/email` går forbi eksakt treff i `customRules` | maybe-false | `normalizePathname` slår ikke sammen doble skråstreker; uavklart om ruteren godtar stien. Gjelder også standardregelen fra før | defer (medium, uverifisert) |
