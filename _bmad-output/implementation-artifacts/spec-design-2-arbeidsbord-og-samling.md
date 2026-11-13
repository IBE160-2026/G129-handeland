---
title: 'Designfase bolk 2: arbeidsbordet (FR-48), Samlingen (FR-49) og Ny tekst'
type: 'feature'
created: '2026-11-13'
status: 'done'
baseline_commit: '9915f24c94515a48261be5de17697df31fc415da'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/DESIGN.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Lesevenn-2026-11-12/EXPERIENCE.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-design-1-identitet-og-tenkeindikator.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Etter innlogging lander eleven rett i innlimingen, med tekstlisten i en sidekolonne. Hun ser ikke hvor hun var, eller hva som er neste steg. EXPERIENCE.md (FR-48, FR-49) bestemmer et arbeidsbord med bunker, en vifte med fem aktiviteter, en egen samling og en egen side for ny tekst.

**Godkjent:** Arve forhåndsgodkjente alle tre bolkene 13.11. Arbeidet går på grenen `designfase`. Beslutninger tatt uten ham, etter dokumentene: «Sist aktiv» regnes ut fra eksisterende tidsstempler, uten nytt felt og uten migrering. Adressene er `/samling` og `/ny`, som foreslått i EXPERIENCE.md.

**Approach:** `/` med innlogging blir arbeidsbordet: hovedbunken (sist aktiv) med «Sist brukt» og neste steg, inntil fire bunker til, og «+ Ny tekst». Hver bunke åpner viften, en dialog med akkurat fem aktivitetskort med status fra data. `/samling` får dagens tekstliste (søk, sortering, sletting), og `/ny` får innlesingen. Topplinjen får menyen «Arbeidsbord», «Samlingen» og «Konto».

## Boundaries & Constraints

**Always:**
- Reglene i EXPERIENCE.md, under State Patterns (Inngang og arbeidsbord, Sist aktiv, Neste steg, Status på kortene i viften, Samlingen) og Component Patterns (Bunke, Hovedbunke, Viften, Aktivitetskort, Topplinje, Tekstrad), gjelder ordrett. Ingen navn på eleven («Hei!»).
- AD-8: én ny funksjon i datatilgangslaget henter bordet med `Tilgang` og eierskap i spørringen. Neste steg, status og sortering etter sist aktiv er rene funksjoner med enhetstester.
- `await tilgang()` står i hver ny side, før en eventuell try.
- Viften: `role="dialog"`, `aria-modal`, ikke i DOM-en når den er lukket, `inert` på resten, fokus på første kort, Esc eller «Legg sammen» lukker og gir fokus tilbake. `prefers-reduced-motion`: ingen flyging.
- Uten JavaScript fungerer bunken som en lenke til `/tekst/[id]/oppgaver`, som blir stående.
- Stor tekst, 320 px og 200 % zoom: ingen faste høyder, og ingen `overflow: hidden` på tekst.

**Never:**
- Ingen skjemaendring eller migrering.
- Ingen bruksgrenser ennå. «Dagens samtalegrense er nådd» regnes som ikke nådd.
- Ingen landingsside: uten innlogging sender `/` fortsatt til `/logg-inn` (bolk 3).
- Ingen endring i løypen under `/tekst/[id]/…`, bortsett fra lenker som pekte til `/` som tekstliste.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Ny elev | 0 tekster | Tomt bord med brilleansiktet: «Her blir tekstene dine liggende. Legg den første på bordet.» og «+ Ny tekst» | N/A |
| Fire tekster | 4 | Hovedbunke og tre små, uten tomme plasser | N/A |
| Mange tekster | 8 | De fem som sist var aktive, og «Se alle 8 tekstene i samlingen» | N/A |
| Ulåst tekst | `innlest` | Neste steg «Fortsett: Før du leser». I viften er Quiz, Øvekort, Fagsamtale og Minnevers låst med «Låst. Åpnes når du har lest teksten.» | N/A |
| Påbegynt samtale | Uavsluttet samtale med 3 runder | «Fortsett: Fagsamtale, runde 4 av 6» | N/A |
| Henting feiler | Databasefeil | «Vi fikk ikke hentet tekstene dine.» med «Prøv igjen» | `error.tsx` eller try rundt hentingen |
| Søk uten treff | `/samling?sok=mitose` | «Ingen titler inneholder «mitose».» med «Vis alle» | N/A |

</frozen-after-approval>

## Code Map

- `app/page.tsx` -- dagens startside: tekstliste med søk, sortering og `SlettTekstKnapp`, `nesteSteg()`, `TILSTANDSORD`, og `Innlesing`. Listen flyttes til `app/samling/page.tsx`, og innlesingen til `app/ny/page.tsx`. `/` blir arbeidsbordet.
- `data/tilgang.ts:57` `listTekster(t)` -- mønsteret for eierskap.
- `data/tekstliste.ts` -- `filtrerTekster` og `tolkSortering`. Gjenbrukes i Samlingen.
- `data/skjema.ts` -- tidspunkter for «sist aktiv»:
  - `tekst.opprettet`, `laastTidspunkt`, `overskrifterGodkjent`
  - `quizforsoek.gjennomfoert`
  - `samtalerunde.opprettet` og `fagsamtale.opprettet`
  - `minnevers.opprettet`
  - Øvekortmerking (`begrep.merking`) har ikke noe tidspunkt og teller ikke.
- Status per aktivitet:
  - Quiz: `quizforsoek` (antallRiktige og antallTotalt for det siste)
  - Øvekort: antall `begrep` med `merking = 'kan'` av alle i begrepssettet. Tomt sett gir FR-16-teksten.
  - Fagsamtale: `fagsamtale` med `avsluttet` og antall runder. `MAKS_RUNDER` fra `generatorer/fagsamtale` (bare typen og konstanten, slik siden gjør i dag).
  - Minnevers: finnes det en rad?
  - Fagord: antall `begrep`.
- `app/tekst/[id]/oppgaver/page.tsx` -- hvordan status hentes i dag (`listForsoek`, `listFagsamtaler`, `hentOevekort`). Lag én samlet spørring for bordet i stedet for N+1 der det går.
- Lenker til `/` som betydde tekstlisten:
  - `SlettTekstKnapp.tsx:56` → `/samling`
  - `page.tsx:95` «Vis alle» → `/samling`
  - `konto/page.tsx:23` «Til tekstene» → «Til arbeidsbordet»
  - `aktivering:140`, `lesing:357`, `overskrifter:69`: behold `/`, og endre teksten til «arbeidsbordet» der den sier «tekstene»
  - `handlinger.ts:784` `revalidatePath("/")` → også `/samling`
- `app/komponenter/Topplinje.tsx` -- (etter bolk 1) ordmerket. Legg til menyen med `aria-current` (`usePathname` i en liten klientkomponent).
- Komponentene fra bolk 1 som gjenbrukes: `Merke.tsx` (`BuddyMerke`, brilleansiktet) og tokenklassene i `globals.css`.
- Visuell referanse: `ux-designs/ux-Lesevenn-2026-11-12/mockups/arbeidsbord-1.html`. Spinene vinner ved konflikt.

## Tasks & Acceptance

**Execution:**
- [x] `data/arbeidsbord.ts` (ny) -- `hentArbeidsbord(t)`: alle Tekstene med `sistAktiv` og status per aktivitet. Pluss de rene funksjonene `nesteSteg(bunke)`, `kortstatus(bunke)` og `velgBordet(bunker)` (fem nyeste, med hovedbunken først).
- [x] `data/arbeidsbord.test.ts` (ny) -- tester for hver regel i Neste steg og hver rad i statustabellen, sist aktiv-sorteringen og matrisens 0, 4 og 8 tekster.
- [x] `app/page.tsx` -- arbeidsbordet (serverkomponent). Hilsen «Hei!» og «Du holdt på med {tittel} {relativ dag}.», bunkene i `<ul>`, «+ Ny tekst», og «Se alle N tekstene i samlingen» ved mer enn 5.
- [x] `app/komponenter/Arbeidsbord.tsx` (ny, klient) -- bunkene og viften med dialog, fokusfelle og `inert`. Kortene ligger rundt bunken på brede skjermer når det er plass, og ellers i et rutenett under. `{motion.fan}` når bevegelse er tillatt.
- [x] `app/samling/page.tsx` (ny) -- tekstlisten med Tekstrad-reglene: tittelen lenker til neste steg, tilstand i klartekst, dato, søk og sortering i adressen, og sletting.
- [x] `app/ny/page.tsx` (ny) -- `Innlesing` med overskriften «Ny tekst».
- [x] `app/komponenter/Topplinje.tsx` -- menyen og `aria-current`. På telefon er «Samlingen» og «Konto» synlige.
- [x] Lenkene i Code Map -- oppdateres.

**Acceptance Criteria:**
- Given en innlogget elev med tekster, when hun åpner `/`, then hovedbunken er den som sist var aktiv, og lenken for neste steg går rett til steget.
- Given at viften er åpen, when eleven trykker Tab gjentatte ganger, then fokus blir i dialogen, og Esc lukker og setter fokus tilbake på bunkens knapp.
- Given 320 px bredde eller 200 % tekst, then siden ruller ikke sidelengs, og ingen tekst klippes.
- Given at eleven tabber fra «+ Ny tekst», then treffer fokus aldri et usynlig element.

## Verification

**Commands:**
- `npx tsc --noEmit` -- forventet: ingen feil
- `npm test` -- forventet: alt består, inkludert `data/arbeidsbord.test.ts`
- `npm run lint` og `npm run build` -- forventet: ingen nye feil
- `npm run sjekk:tilgjengelighet` og `npm run sjekk:readme` -- forventet: bestått. Oppdater sjekkene hvis de peker på den gamle startsiden.
- `npm run demotest` hvis det finnes -- forventet: bestått. Oppdater stegene som gikk via startsiden.

**Manual checks:**
- Skjermbilder (playwright-core uten vindu) av `/`, en åpen vifte, `/samling` og `/ny`, i lys og mørk modus, på 1280 og 375 px.

## Review Triage Log

| # | Kilde | Funn | Vurdering | Rute |
|---|---|---|---|---|
| 1 | edge | `apen` peker på en tekst som er borte, og siden blir stående inert | medium | patch |
| 2 | edge, blind | Viften måles ikke på nytt ved font-swap eller ny tekststørrelse; resize er ikke strupet | medium | patch |
| 3 | edge, blind | Neste steg ser ikke på overskrifterGodkjent (PDF i fase 3a) | low: lenken når steget via omdirigering, og EXPERIENCE-regelen er fulgt ordrett | avvist |
| 4 | edge | Tidspunktet for avsluttet samtale brukes ikke i sist aktiv | low: siste runde gir samme tid | avvist |
| 5 | edge, vgap | Ingen sjekk av rundt eller rutenett på PC ved 100 og 200 % tekst | patch | patch |
| 6 | edge, blind | Slettefeilen blir en blindvei når teksten alt er borte | medium | patch |
| 7 | edge | «Neste: Fagsamtale» går til /oppgaver | low: bevisst, fordi en samtale startes med et skjema der | avvist |
| 8 | edge | Bunketitler avkortes ved 200 % | false: EXPERIENCE «Lang tittel» krever avkorting, og navnet står i sin helhet | avvist |
| 9 | vgap, blind | Valget mellom flere samtaler er ikke testet | patch | patch |
| 10 | vgap, blind | Quiz, runde og vers som kilde til sist aktiv er ikke testet | patch | patch |
| 11 | vgap | Sletting: landing på /samling og at raden forsvinner, er ikke sjekket | patch | patch |
| 12 | vgap | Hentefeil har ingen test | medium, ikke verifisert: krever ny testinfrastruktur | defer |
| 13 | blind | Bruddpunktene spriker (52rem container mot 760 px i JS og meny) | medium | patch |
| 14 | blind | Bekreftelsesboksen bruker faste red-*-farger | low, direkte retting | patch |
| 15 | blind | Bekreftelsen nevner ikke oversettelser og oppsummering | low: teksten følger EXPERIENCE.md | avvist |
| 16 | blind | catch svelger feilen uten logging | low, direkte retting | patch |
| 17 | blind | «Legg sammen» sist i DOM, men øverst på skjermen (2.4.3) | medium | patch |
| 18 | blind | hentArbeidsbord henter alle forsøk og samtaler | low: få rader per elev | avvist |
| 19 | blind | vifteplass-testene sjekker ikke luft og grenser | patch | patch |
| 20 | blind | plasserRundt lar aksene vokse sammen | low | avvist |
| 21 | blind | Hover retter opp kortet; vifte-senter arver bunke-hover | low: oppretting er spesifisert i DESIGN.md | avvist |
| 22 | blind | Trykk mellom kortene lukker ikke viften | low | avvist |
| 23 | blind | Esc ignorerer isComposing og defaultPrevented | low: ingen tekstfelt i viften | avvist |
| 24 | blind | aria-controls er ugyldig når viften er lukket | low, direkte retting | patch |
| 25 | vgap | Tilbake-lenker i aktivering og overskrifter går til / | low: / er nå arbeidsbordet, og det er riktig mål | avvist |
