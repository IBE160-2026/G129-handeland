---
title: 'Vilkår og aldersgrense 15 år ved registrering'
type: 'feature'
created: '2026-11-19'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '9a33ec1520539b49351b66ec5c77d2d97694f9ac'
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
- [x] `_bmad-output/planning-artifacts/prd-lesevenn.md` -- FR-35 får aldersgrense og avkrysning som egenerklæring; ny FR-53 «Vilkår og personvern» i §4.10; §6.2 får behandlingsgrunnlaget (avtale) og begrensningen (egenerklæring, invitasjonskoden er porten) -- sporbarhet.
- [x] `_bmad-output/planning-artifacts/ki-logg.md` -- ny oppføring: avtale framfor samtykke, 15 år framfor 13, med Datatilsynets side som kilde; utviklerens vurdering markert som hans.
- [x] `data/skjema.ts` + migrasjon 0010 -- tabellen.
- [x] `data/vilkaar.ts` (klientsikker) -- versjon og headernavn.
- [x] `data/auth.ts` -- sjekk og lagring.
- [x] `app/vilkaar/page.tsx` -- siden.
- [x] `app/komponenter/KontoSkjemaer.tsx`, `app/registrer/page.tsx`, landingsside, konto -- skjema og lenker.
- [x] `data/auth.test.ts` -- matrisens rader mot ekte Better Auth og PGlite, inkludert rett mot ruten.
- [x] `data/sjekk-innlogging.mjs`, `gjennomgang-innlogging.md` -- ny regel i mutasjonstesten (vilkår), og at begrensningen fortsatt virker med hashet nøkkel.
- [x] `data/auth.ts` + `data/auth.test.ts` -- hashet nøkkel i `rate_limit`; test at sperren virker og at nøkkelen ikke inneholder IP-adressen; engangssletting av gamle rader (i migrasjon 0010 eller eget skript, dokumentert).
- [x] `data/innsyn.mjs` + test -- innsynsskriptet; `README.md` eller `gjennomgang-innlogging.md` sier hvordan det brukes.
- [x] `_bmad-output/planning-artifacts/kodefunn.md` -- nytt funn: kommentaren lovet at IP ikke lagres, men telleren lagret den i klartekst.
- [x] `maaling/demotest.mjs`, `maaling/sjekk-readme.mjs`, `maaling/sjekk-tilgjengelighet.mjs` -- avkrysning; siden sjekkes med axe.

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

## Implementation Notes

- Implementert av underagent (commits 0df9ec4, 50d0181, a9f3744); diff lest av hovedøkta mot baseline.
- Bekreftelsen skrives i `databaseHooks.account.create.before` inne i registreringstransaksjonen (`drizzleAdapter({ transaction: true })`); transaksjonen gjøres tilgjengelig for kroken via en Proxy rundt databasen og `AsyncLocalStorage`. `user.create.after` kjører etter commit og kunne ikke brukes. Drift bruker `neon-serverless` (WebSocket-pool), som støtter transaksjoner.
- Telleren: `rateLimit.customStorage` med HMAC-SHA256(`BETTER_AUTH_SECRET`) av nøkkelen, én atomisk `INSERT … ON CONFLICT`. Migrasjon 0010 sletter eksisterende `rate_limit`-rader én gang.
- Sideteksten er sjekket setning for setning mot `vilkaar-tekst-utkast.md`: ordrett.
- Verifisert av hovedøkta: tsc, lint 0 feil, `npm test` 726/726, `sjekk:innlogging` 12/12, tilgjengelighet 419/419, README 8/8, build. Demotest 1/1 kjørt av underagenten.

## Review Triage Log

| # | Kilde | Funn | Verdikt | Begrunnelse | Rute |
|---|-------|------|---------|-------------|------|
| 1 | blind, edge, verif | `innsyn.mjs <e-post>` uten `--ut` gir bruksmelding og exit 2 | high | Bekreftet ved kjøring av to lag; `utIndeks+1 === 0` utelukker args[0] | patch |
| 2 | blind, edge, verif | Ingen test kjører skriptet med e-post | medium | Bekreftet; derfor slapp #1 gjennom | patch |
| 3 | blind | `--ut kopi.json` i dokumentasjonen dekkes ikke av .gitignore; fila har elevens tekster | medium | Bekreftet mot .gitignore (`innsyn-*.json`) | patch |
| 4 | blind | /vilkaar: «kan ikke gjøres tilbake til adressen» lover mer enn HMAC holder for den som har hemmeligheten | medium | Riktig; samme mønster som kodefunn 28 | ordlyd avgjort av Arve 20.11, rettet |
| 5 | blind | Rettighetslisten mangler dataportabilitet og begrensning; «få rettet» sier ikke hvordan | low | Riktig for avtale som grunnlag | ordlyd avgjort av Arve 20.11, rettet |
| 6 | blind | Liten «legg» i Kort fortalt | low | Skrivefeil i godkjent tekst | avgjort av Arve, rettet |
| 7 | blind, edge, verif | Telleren tolker `lastRequest === naa` som «tillatt»; sperret forsøk i samme millisekund slipper gjennom | low | Krever to forsøk på samme nøkkel i samme ms; ett ekstra forsøk i verste fall | avvist |
| 8 | verif | Tilbakestilling etter tidsvinduet er ikke testet | medium | Bekreftet; uten den kunne en elev bli sperret ute for godt uten at noe feilet | patch |
| 9 | blind | Testen for hashet nøkkel har død sjekk og avhenger av rekkefølge | low | Direkte retting | patch |
| 10 | edge | Traverseringen i innsyn stopper stille etter 20 runder | low | Dagens dybde er ≤5; én linje gjør at den aldri later som den er komplett | patch |
| 11 | edge | Sammensatte fremmednøkler gir kryssprodukt | false | Ingen sammensatte fremmednøkler i skjemaet | avvist |
| 12 | blind | Migrasjonsmetadata mangler i diffen | false | `_journal.json` har 0010 og snapshot er i git; meta var ekskludert fra diffen av hovedøkta | avvist |
| 13 | blind | ki-logg sier «22 funn per 26. oktober» | low | Bekreftet l.545; direkte retting | patch |
| 14 | blind | Lenken fra /konto er ikke sjekket | low | Direkte tillegg i a11y-skriptet | patch |
| 15 | blind | Innsyn over Neon uten felles øyeblikksbilde | low | Manuelt, sjeldent, én konto | avvist |
| 16 | blind | «Hva jeg tenker om resultatet» tom | low | Er Arves egen vurdering med vilje | avvist (meldt Arve) |
| 17 | blind | VILKAAR_ENDRET har ingen knapp for å laste siden på nytt | low | Nås bare ved versjonsbytte | avvist |
| 18 | blind | account.create.before dekker bare /sign-up/email | low | Ingen andre kontoveier finnes | avvist |
| 19 | blind | Manglende BETTER_AUTH_SECRET feiler ved hver innlogging | false | Better Auth krever hemmeligheten uansett i drift | avvist |
| 20 | blind | UTELATTE_KOLONNER filtrerer på kolonnenavn i alle tabeller | low | Bare framtidige kolonner; ingen i dag | avvist |
| 21 | verif | Klientteksten for FR-53-feilkodene er ikke testet | medium (umålt) | Nås ved versjonsbytte; ingen komponenttestoppsett for skjemaet | defer |
- Etter gjennomgangen (21 funn, 9 rettet i 927813e + ordlyd): Arve avgjorde 20.11 ny IP-setning, to nye rettigheter (utlevering, begrensning), hvordan retting skjer, og stor L. Versjonen er derfor 2026-11-20. Verifisert: `npm test` 729/729, `sjekk:innlogging` 13/13, tilgjengelighet 420/420, README 8/8, demotest 3/3, build; innsyn mot ukjent e-post gir exit 1.
