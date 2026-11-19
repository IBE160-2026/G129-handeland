---
title: 'Vilkår og aldersgrense 15 år ved registrering'
type: 'feature'
created: '2026-11-19'
status: 'draft'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/_bmad-output/planning-artifacts/gjennomgang-innlogging.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Registreringen har ingen vilkår å godta og ingen aldersgrense, mens brukerne er 15–19 år og tekstene sendes til en leverandør i USA. Informasjonen står i en ingress på registreringssiden, ikke i en side eleven kan lese og godta.

**Approach:** En offentlig side «Vilkår og personvern» skrevet for en 15-åring, og to påkrevde avkrysninger ved registrering: «Jeg er 15 år eller eldre» og «Jeg har lest vilkårene og personvernerklæringen». Serveren avviser registrering uten dem, og lagrer bare at, når og hvilken versjon. Gjelder bare nye kontoer.

## Boundaries & Constraints

**Always:**
- Behandlingsgrunnlaget er **avtale** (GDPR art. 6(1)(b)), ikke samtykke. Siden og PRD-en sier det slik; avkrysningen er bekreftelse på at eleven har fått informasjonen.
- FR-35 holder: ingen fødselsdato eller alder lagres, bare bekreftelsen. Lagres: kontoId, vilkårsversjon, tidspunkt.
- Sjekken skjer på serveren i samme Better Auth-`before`-hook som invitasjonskoden (`/sign-up/email`), med verdiene i egne headere som `INVITASJONSKODE_HEADER`. Feil eller manglende versjon avvises med §5-melding. Lagringen skjer når kontoen lages; mislykkes den, finnes ikke kontoen (ingen konto uten bekreftelse).
- Én konstant for vilkårsversjonen (dato-streng), brukt av siden, skjemaet og serveren.
- Siden er offentlig (ingen innlogging), lenket fra registreringen, landingssiden og kontosiden. **Innholdet er fast:** teksten under streken i `vilkaar-tekst-utkast.md` (godkjent av Arve 19.11), gjengitt uten endringer i ordlyden. Merknadene nederst i fila er ikke en del av siden.
- Under 15: avkrysningen kan ikke hoppes over, og teksten ved den sier at LeseBuddy er for elever fra 15 år.
- Tastatur, skjermleser, mobil og begge temaer som resten av appen.

**Beslutninger (Arve, 19.11):**
- Gjelder bare nye kontoer.
- Kontakt og behandlingsansvarlig på siden: Arve Handeland, arvehand@gmail.com (Arves eget valg; siden er offentlig). Står ett sted i koden, så den kan byttes.
- **IP-adressen i innloggingstelleren hashes** før den lagres (Better Auth `rateLimit.customStorage`, HMAC med `BETTER_AUTH_SECRET`, så Vercel ikke trenger en ny miljøvariabel), så siden kan si at den ikke lagres i klartekst. Begrensningen av innloggingsforsøk skal virke som før. Eksisterende rader i `rate_limit` slettes én gang. Funnet føres i `kodefunn.md`, og kommentaren i `data/auth.ts` rettes.
- **Innsynsskript:** `node data/innsyn.mjs <e-post>` henter alt som er lagret for én konto (alle rader i tabellene som peker til kontoen eller tekstene dens) som én JSON-fil, uten passordhash og økttokener. Bare lesing; leser `.env.local` som `data/migrer-https.mjs`.
- Sletting etter skoleår bygges ikke; siden sier at det er planen.

**Never:**
- Ingen endring for eksisterende kontoer: ingen sperre eller ny godkjenning ved innlogging.
- Ikke samtykke som behandlingsgrunnlag, ikke forhåndsavkryssede bokser, ikke fødselsdatofelt.
- Kjøre migrasjonen mot Neon eller rulle ut uten Arves ja.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Godkjent | Riktig kode, begge krysset av | Konto lages; én rad med gjeldende versjon og tidspunkt | N/A |
| Mangler alder | Vilkår krysset, alder ikke | Ingen konto, ingen rad | Melding om aldersgrensen |
| Mangler vilkår | Alder krysset, vilkår ikke | Ingen konto | Melding med lenke til siden |
| Rett mot ruten | POST `/api/auth/sign-up/email` uten headerne | Avvist på serveren | FORBIDDEN, §5-tekst |
| Innloggingsteller | Mange feil innlogginger fra samme IP | Sperres som før; `rate_limit.key` inneholder ikke IP-adressen | N/A |
| Innsyn | `innsyn.mjs` med e-post til en konto med tekst, quizforsøk og mappe | JSON med alle radene, ingen passordhash | Ukjent e-post: tydelig melding, exit ≠ 0 |
| Gammel versjon | Header med annen versjon enn gjeldende | Avvist | «Vilkårene er endret — last siden på nytt» |
| Eksisterende konto | Konto fra før 19.11 logger inn | Som før | N/A |
| Kontosletting | Konto slettes | Bekreftelsesraden slettes (cascade) | N/A |

</frozen-after-approval>

## Code Map

- `_bmad-output/implementation-artifacts/vilkaar-tekst-utkast.md` -- fast sidetekst.
- `data/auth.ts` -- `rateLimit` (l.109, `storage: "database"`) byttes til `customStorage` som hasher nøkkelen; tabellen `rate_limit` i `data/skjema.ts` brukes fortsatt. Kommentaren om IP i `databaseHooks.session` (l.127) rettes. `hooks.before` (l.137) sjekker invitasjonskoden på `/sign-up/email`; legg vilkårssjekken her. `databaseHooks.user.create` (l.116) eller `hooks.after` med ny økt/bruker er stedet for å lagre bekreftelsen; velg det som gir atomisk oppførsel og dokumenter valget.
- `data/invitasjon.ts` -- mønster for header-konstanter som klienten kan importere; legg vilkårsheaderne og versjonen i en tilsvarende klientsikker fil.
- `app/komponenter/KontoSkjemaer.tsx` `RegistreringSkjema` (l.150) -- to påkrevde avkrysninger, sendt som headere; `somFeil` (l.22) oversetter nye feilkoder.
- `app/registrer/page.tsx` -- ingressen kortes ned og lenker til den nye siden.
- `app/komponenter/Landingsside.tsx`, `app/konto/page.tsx` -- lenke til siden.
- `data/skjema.ts` -- ny tabell `vilkaarsbekreftelse` (kontoId PK→user cascade, versjon, bekreftet); migrasjon 0010 via `npx drizzle-kit generate`.
- `data/auth.test.ts`, `data/sjekk-innlogging.mjs`, `gjennomgang-innlogging.md` -- innloggingsgjennomgangen (FR-41) må dekke den nye sperren.
- `maaling/demotest.mjs`, `maaling/sjekk-readme.mjs`, `maaling/sjekk-tilgjengelighet.mjs` -- registrerer brukere; krysser av før «Opprett konto». Tilgjengelighetssjekken får siden og skjemaet med.
- `README.md` -- hvis den beskriver registreringen, nevn avkrysningene.

## Tasks & Acceptance

**Execution:**
- [ ] `_bmad-output/planning-artifacts/prd-lesevenn.md` -- FR-35 får aldersgrense og avkrysning som egenerklæring; ny FR-53 «Vilkår og personvern» i §4.10; §6.2 får behandlingsgrunnlaget (avtale) og begrensningen (egenerklæring, invitasjonskoden er porten) -- sporbarhet.
- [ ] `_bmad-output/planning-artifacts/ki-logg.md` -- ny oppføring: avtale framfor samtykke, 15 år framfor 13, med Datatilsynets side som kilde; utviklerens vurdering markert som hans.
- [ ] `data/skjema.ts` + migrasjon 0010 -- tabellen.
- [ ] `data/vilkaar.ts` (klientsikker) -- versjon og headernavn.
- [ ] `data/auth.ts` -- sjekk og lagring.
- [ ] `app/vilkaar/page.tsx` -- siden.
- [ ] `app/komponenter/KontoSkjemaer.tsx`, `app/registrer/page.tsx`, landingsside, konto -- skjema og lenker.
- [ ] `data/auth.test.ts` -- matrisens rader mot ekte Better Auth og PGlite, inkludert rett mot ruten.
- [ ] `data/sjekk-innlogging.mjs`, `gjennomgang-innlogging.md` -- ny regel i mutasjonstesten (vilkår), og at begrensningen fortsatt virker med hashet nøkkel.
- [ ] `data/auth.ts` + `data/auth.test.ts` -- hashet nøkkel i `rate_limit`; test at sperren virker og at nøkkelen ikke inneholder IP-adressen; engangssletting av gamle rader (i migrasjon 0010 eller eget skript, dokumentert).
- [ ] `data/innsyn.mjs` + test -- innsynsskriptet; `README.md` eller `gjennomgang-innlogging.md` sier hvordan det brukes.
- [ ] `_bmad-output/planning-artifacts/kodefunn.md` -- nytt funn: kommentaren lovet at IP ikke lagres, men telleren lagret den i klartekst.
- [ ] `maaling/demotest.mjs`, `maaling/sjekk-readme.mjs`, `maaling/sjekk-tilgjengelighet.mjs` -- avkrysning; siden sjekkes med axe.

**Acceptance Criteria:**
- Given en ny elev på /registrer, when hun ikke krysser av, then nettleseren hindrer innsending og serveren ville avvist den uansett.
- Given en utlogget besøkende, when hun åpner siden fra landingssiden, then den vises uten innlogging.
- Given siden, when en 15-åring leser den, then den sier på vanlig norsk hva som lagres, hvor teksten går, hvordan hun sletter, og hvem hun kontakter.

## Verification

**Commands:**
- `npx tsc --noEmit` -- ingen feil
- `npm run lint` -- 0 feil
- `npm test` -- alle grønne
- `npm run sjekk:innlogging` -- alle mutanter fanget
- `npm run sjekk:tilgjengelighet`, `npm run sjekk:readme`, `npm run demotest -- 1` -- grønne
- `npm run build` -- bygger
