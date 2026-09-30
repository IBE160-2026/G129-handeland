---
name: Teknologikontroll — arkitekturspine Lesevenn
type: review
subject: arkitektur-lesevenn.md
scope: seksjonen «Stack», AD-8, og merknaden om Next.js 16
method: verifisering mot nettkilder, ikke hukommelse
reviewed: '2026-09-29'
verdict: delvis bekreftet — ett reelt avvik i AD-8 sin begrunnelse, to uverifiserte «verifisert»-påstander
---

# Teknologikontroll — arkitekturspine Lesevenn

## Formål og metode

Spinen merker flere teknologivalg som «verifisert». Denne gjennomgangen kontrollerer
hver enkelt påstand mot primærkilder hentet på nett 29.09.2026 — leverandørdokumentasjon,
npm-registeret, GitHub-API og CVE-databaser. Der en påstand ikke kunne etterprøves,
står det at den ikke kunne etterprøves. Ingen hull er fylt med antakelser.

Kunnskapsgrensen til modellen som skrev spinen ligger før dagens dato. Det er
nettopp derfor kontrollen er verdt å gjøre: en påstand som var sann ved
treningstidspunktet kan ha råtnet, og en påstand som *ser* presis ut (et
CVE-nummer, et versjonsnummer) er ikke mer verifisert enn noen annen.

## Samlet dom

| # | Påstand | Dom |
| --- | --- | --- |
| 1 | Next.js 16.3.x er gjeldende stabile serie; App Router anbefalt | **Bekreftet** (med patch-forbehold) |
| 2 | Next.js 16 har døpt om middleware til proxy, Node-runtime | **Bekreftet** |
| 3 | CVE-2025-29927 som begrunnelse for AD-8 | **Delvis bekreftet** — sårbarheten er reell, men fikset før Next.js 16 |
| 4 | Better Auth: reelt, Auth.js-overtakelse, Vercel-oppkjøp juli 2026 | **Bekreftet** (én upresis formulering) |
| 5 | Drizzle ORM som anbefaling for Next.js + PostgreSQL | **Delvis bekreftet** — «standardvalg» kunne ikke verifiseres, og Next.js 16 har reell friksjon |
| 6 | unpdf finnes, vedlikeholdes, gir tekst per side | **Bekreftet** |

Spinen er i hovedsak solid. Den ene substansielle feilen er at **AD-8 sin begrunnelse
leser som en aktiv trussel mot Next.js 16, mens sårbarheten den bygger på ble lukket
i 15.2.3.** Regelen i AD-8 er fortsatt riktig — men den holder av andre og sterkere
grunner enn den som er skrevet ned, og de grunnene står ikke i spinen.

---

## 1. Next.js 16.3.x — gjeldende stabile serie?

**Dom: bekreftet, men patch-nivået i spinen er upresist og på vei til å bli utdatert.**

Funn:

- Nyeste major er **16**, lansert 22.10.2025. Det finnes **ingen 17.x** per 29.09.2026.
  Next.js 16 er merket som aktiv LTS-linje.
  Kilde: <https://endoflife.date/nextjs>
- Nyeste utgitte patch er **16.3.6**, sluppet 22.09.2026 som hastefiks for et
  kritisk oppstrømsproblem.
  Kilder: <https://nextjs.org/blog/nextjs-security-update-september-22-2026>,
  <https://endoflife.date/nextjs>
- Seneste *feature*-utgivelse er **16.3** (03.08.2026, «Instant Navigations»).
  Det finnes ingen 16.4.
  Kilde: <https://nextjs.org/blog>
- Dokumentasjonen selv stempler sine sider med `version: 16.3.6`, som bekrefter
  16.3.x som gjeldende dokumenterte serie.
  Kilde: <https://nextjs.org/docs/app/api-reference/file-conventions/proxy>

**FLAGG — tidskritisk:** Vercel har varslet en planlagt sikkerhetsutgivelse
**30.09.2026 — i morgen** — som slipper **16.3.7** og 15.5.27 og lukker ni
sårbarheter: én kritisk, to høye, fem middels, én lav. Advisories med berørte
versjoner publiseres samtidig.
Kilde: <https://nextjs.org/blog/upcoming-nextjs-security-release-september-2026>

Konsekvens for spinen: «16.3.x — verifisert gjeldende stabile per 29.09.2026» er
korrekt som serieangivelse, men et oppsett gjort i dag lander på 16.3.6, som er
sårbar for ni kjente hull. **Pinn 16.3.7 eller nyere, ikke 16.3.6**, og les
advisoryene når de kommer — én av dem er kritisk, og vi vet ennå ikke om den
berører proxy-laget.

### App Router for nye prosjekter?

**Bekreftet.** App Router er det anbefalte sporet. Pages Router er *ikke* formelt
deprekert og får fortsatt sikkerhetsfikser og feilrettinger, men Next.js' egen
dokumentasjon anbefaler migrering til App Router, og nye rammeverksfunksjoner
(Cache Components, `use cache`) kommer bare der.
Kilder: <https://nextjs.org/docs/pages>, <https://nextjs.org/blog/next-16>

---

## 2. Middleware omdøpt til proxy, på Node-runtime?

**Dom: bekreftet, i alle tre ledd.** Dette er den best dokumenterte påstanden i spinen.

Fra versjonshistorikken i den offisielle API-referansen, ordrett:

> `v16.0.0` — Middleware is deprecated and renamed to Proxy. Proxy defaults to the Node.js runtime

Og fra samme side, om runtime:

> Proxy defaults to using the Node.js runtime. The `runtime` config option is not
> available in Proxy files. Setting the `runtime` config option in Proxy will throw an error.

Kilde: <https://nextjs.org/docs/app/api-reference/file-conventions/proxy>

Detaljer som bekrefter spinens merknad om at gamle oppskrifter bruker gammelt navn:

- Filen heter `proxy.ts` (eller `.js`), plassert i prosjektroten eller i `src/`,
  på samme nivå som `app/`. Funksjonen må hete `proxy` eller være default-eksport.
- `middleware.ts` **finnes fortsatt** for Edge-runtime-tilfeller, men er deprekert
  og fjernes i en framtidig versjon. Spinen sier ikke dette, og det er greit —
  for et nytt prosjekt er `proxy.ts` riktig valg uansett.
- Begrunnelsen for navnebyttet er dokumentert: «middleware» ble forvekslet med
  Express-middleware, og Vercel vil aktivt *bort* fra mønsteret. Dokumentasjonen
  skriver at funksjonen «is recommended to be used as a last resort» og
  «We recommend users avoid relying on Middleware unless no other options exist».
- Kodemod finnes: `npx @next/codemod@canary middleware-to-proxy .`
  (merk: sekundærkilder oppgir varianten `@next/codemod@latest rename-middleware-to-proxy`
  — bruk formen fra den offisielle dokumentasjonen).

Kilder: <https://nextjs.org/docs/app/api-reference/file-conventions/proxy>,
<https://nextjs.org/docs/messages/middleware-to-proxy>, <https://nextjs.org/blog/next-16>

**Merk at dokumentasjonens egen holdning styrker AD-8:** at Vercel kaller proxy en
siste utvei og vil bort fra mønsteret, er et selvstendig argument for at
autorisasjon ikke skal bo der.

---

## 3. CVE-2025-29927 og AD-8 sin begrunnelse

**Dom: delvis bekreftet. Sårbarheten er reell og beskrivelsen er teknisk presis —
men begrunnelsen er datert, og spinen presenterer den som gjeldende risiko for
Next.js 16 uten å si at den er lukket.**

### Det spinen har rett i

Sårbarheten er ekte, alvorlig og beskrevet nøyaktig slik AD-8 sier:

- **Header:** `x-middleware-subrequest` — presis, riktig stavet, riktig rolle.
- **Virkning, ordrett fra rådgivningen:** «It is possible to bypass authorization
  checks within a Next.js application, if the authorization check occurs in middleware.»
  Det er akkurat det AD-8 hevder.
- **Alvorlighet:** kritisk, **CVSS 9.1**, ingen autentisering nødvendig, rammer
  konfidensialitet og integritet.

Kilde: <https://github.com/advisories/GHSA-f82v-jwr5-mffw> (GHSA-f82v-jwr5-mffw)

### Det spinen ikke sier — og som endrer lesningen

Sårbarheten er **fikset, og fikset lenge før Next.js 16 fantes**:

| Berørt | Fikset i |
| --- | --- |
| 12.0.0 – <12.3.5 | 12.3.5 |
| 13.0.0 – <13.5.9 | 13.5.9 |
| 14.0.0 – <14.2.25 | 14.2.25 |
| 15.0.0 – <15.2.3 | 15.2.3 |

**Next.js 16.x står ikke på listen over berørte versjoner.** Siste sårbare serie
er 15.0.0–15.2.2. Et nytt prosjekt på 16.3.x er altså ikke eksponert for
CVE-2025-29927, og `x-middleware-subrequest` er ikke en levende angrepsvei her.

Kilde: <https://github.com/advisories/GHSA-f82v-jwr5-mffw>

### Hva dette betyr for AD-8

AD-8 sin **regel** er riktig og skal stå. AD-8 sin **begrunnelse** må skrives om.

Slik den står nå — «Begrunnelsen er konkret: CVE-2025-29927 viste at beskyttelse
som bare ligger i Next.js-middleware kan omgås ved å spoofe `x-middleware-subrequest`»
— er setningen sann i fortid, men den inviterer en leser til å tro at dette er
en åpen sårbarhet i stacken vi bygger på. Verre: den gjør AD-8 sårbar for å bli
*avvist*. Én utvikler som slår opp CVE-en, ser «fixed in 15.2.3», og konkluderer
at premisset for AD-8 er borte, har da fått en tilsynelatende god grunn til å
flytte autorisasjon inn i proxy-laget. Det ville være feil konklusjon fra et
korrekt observert faktum, og det er begrunnelsens feil, ikke utviklerens.

**Den sterkere begrunnelsen finnes, er dokumentert av Vercel selv, og er ikke
avhengig av noen CVE.** Next.js' egen sikkerhetsveiledning anbefaler nøyaktig det
AD-8 foreskriver, for nye prosjekter:

> For new projects, we recommend creating a dedicated **Data Access Layer (DAL)**. […]
> A Data Access Layer should: Only run on the server. Perform authorization checks.
> Return safe, minimal Data Transfer Objects (DTOs).

Og om eierskapssjekken spesifikt, som er kjernen i AD-8:

> Beyond authentication (is the user logged in?), remember to check **authorization**
> (does this user have permission to act on this specific resource?). This prevents
> Insecure Direct Object Reference (IDOR) vulnerabilities.

Kilde: <https://nextjs.org/docs/app/guides/data-security>

Enda mer direkte, fra proxy-referansen, om en strukturell hull-klasse som *ikke*
er en CVE men en permanent egenskap ved rammeverket:

> Server Functions are not separate routes in this chain. They are handled as POST
> requests to the route where they are used, so a Proxy matcher that excludes a path
> will also skip Proxy coverage. […] A matcher change or a refactor that moves a
> Server Function to a different route can silently remove Proxy coverage. **Always
> verify authentication and authorization inside each Server Function rather than
> relying on Proxy alone.**

Kilde: <https://nextjs.org/docs/app/api-reference/file-conventions/proxy>

Det er en bedre begrunnelse enn CVE-en, fordi den ikke kan patches bort. Den sier
at proxy-dekning kan forsvinne stille ved en matcher-endring eller en refaktorering
— en feilmodus som treffer et solobygg med server actions direkte, og som ingen
oppgradering fjerner. I tillegg bemerker Vercels revisjonsråd at `proxy.ts` og
`route.ts` «have a lot of power» og fortjener ekstra granskning.

**Anbefalt retting i AD-8** — behold regelen, bytt begrunnelsen:

> Begrunnelsen er strukturell, ikke en enkelt sårbarhet: en server action er ikke
> en egen rute, men en POST til ruten den brukes i, så en matcher-endring eller en
> flytting av en action kan fjerne proxy-dekningen uten at noe feiler synlig.
> Next.js' egen sikkerhetsveiledning anbefaler derfor et datatilgangslag som selv
> gjør autorisasjonssjekken, og at eierskap til den konkrete raden sjekkes for å
> unngå IDOR. CVE-2025-29927 (CVSS 9.1, spoofing av `x-middleware-subrequest`) er
> det historiske eksemplet på hva som skjer når sjekken bare bor i proxy-laget;
> den er fikset fra 15.2.3 og rammer ikke 16.x, men feilmodusen den illustrerer
> er permanent.

Da er AD-8 immun mot innvendingen «men det er ju fikset».

---

## 4. Better Auth

**Dom: bekreftet. Biblioteket er reelt, aktivt, og historikken spinen forutsetter
stemmer. Én formulering er upresis.**

| Spørsmål | Svar | Kilde |
| --- | --- | --- |
| Reelt bibliotek? | Ja | npm-registeret |
| Gjeldende versjon | **1.7.6** | <https://registry.npmjs.org/better-auth/latest> |
| Lisens | MIT | Vercel-kunngjøringen |
| Aktivitet | 4,7 mill. ukentlige nedlastinger, 850+ bidragsytere | Vercel-kunngjøringen |
| Vercel-oppkjøp juli 2026? | Ja — **7. juli 2026** | <https://vercel.com/blog/vercel-acquires-better-auth> |
| Overtok Auth.js? | Ja, men se presisering | <https://better-auth.com/blog/authjs-joins-better-auth> |
| Next.js 16? | Ja, offisiell guide dekker «Next.js 16+ (Proxy)» | <https://better-auth.com/docs/integrations/next> |
| PostgreSQL? | Ja — `pg` og `drizzle-orm` er valgfrie peer-avhengigheter | npm-metadata |

### Presisering: «absorberte Auth.js-miljøet»

Spinens formulering er nær, men ikke helt presis. Det som skjedde er at
**Better Auth-teamet overtok vedlikeholdet og forvaltningen av Auth.js**
(tidligere NextAuth.js) **22.09.2025** — altså nesten ti måneder *før*
Vercel-oppkjøpet, og som en separat hendelse. Auth.js er ikke smeltet inn i
Better Auth som kodebase; det er to prosjekter med felles vedlikeholder, der
Auth.js får sikkerhetsfikser og hastesaker, og nye prosjekter anbefales å starte
på Better Auth. Bakgrunnen var at hovedbidragsyteren til Auth.js trakk seg i
januar 2025 og v5 ble stående i beta.

Kilder: <https://better-auth.com/blog/authjs-joins-better-auth>,
<https://github.com/nextauthjs/next-auth/discussions/13252>

For spinens formål er dette uten praktisk konsekvens — «anbefalt for nye
Next.js-prosjekter i 2026» holder — men rekkefølgen er verdt å ha rett hvis
begrunnelsen skal gjengis: Auth.js-overtakelsen var ikke en følge av oppkjøpet.

### En nyanse spinen ikke nevner

Better Auth er nå **eid av Vercel**. Kunngjøringen er tydelig på at biblioteket
forblir MIT-lisensiert, rammeverk-agnostisk, beholder navnet og den åpne
bidragsmodellen, og at eksisterende apper ikke må migrere. Vercel signaliserer
samtidig at satsingen dreies mot identitet for KI-agenter («Agent Auth»).

Kilde: <https://vercel.com/blog/vercel-acquires-better-auth>

For Lesevenn — én bruker, ingen åpen registrering, MIT-lisens, selvhostet
PostgreSQL — er dette ikke en risiko som endrer valget. Det er verdt én setning i
spinen bare fordi «Utsatt» ennå ikke har valgt skyleverandør, og fordi
Vercel-eierskap i auth-laget er en svak dragning mot Vercel som driftsplattform
som bør være et bevisst valg framfor en drift.

### Nyttig bekreftelse for AD-8

Better Auths egen Next.js-guide advarer uavhengig mot det AD-8 forbyr: at
cookie-baserte sjekker i proxy-laget **ikke** validerer sesjonen, og at sesjonen
alltid må valideres på serveren for beskyttede handlinger og sider. To uavhengige
leverandører sier altså det samme som AD-8.
Kilde: <https://better-auth.com/docs/integrations/next>

### Ikke verifisert

Kompatibilitet mot et konkret patch-nivå (16.3.6/16.3.7) er ikke bekreftet — guiden
sier «Next.js 16+». Ingen kjent inkompatibilitet funnet, men «16+» er ikke det
samme som testet mot 16.3.7.

---

## 5. Drizzle ORM

**Dom: delvis bekreftet. Biblioteket er reelt, aktivt og et rimelig valg — men
spinens ordvalg «standardvalg» kunne ikke verifiseres, og det finnes reell
friksjon mot Next.js 16 som spinen ikke nevner.**

### Bekreftet

- Gjeldende stabile versjon på npm er **0.45.3**, publisert omkring 22.09.2026 —
  altså aktivt vedlikeholdt.
  Kilder: <https://registry.npmjs.org/drizzle-orm/latest>, <https://www.npmjs.com/package/drizzle-orm>
- Kombinasjonen Next.js + Drizzle + PostgreSQL + Better Auth er veletablert og har
  offisiell adapterstøtte fra Better Auth.
  Kilde: <https://better-auth.com/docs/adapters/drizzle>

### FLAGG 1 — en majorversjon står i døra

Drizzle har en **v1-linje under arbeid** (`v1.0.0-beta`), med egen
migreringsdokumentasjon fra 0.45.x. Jeg fant **ingen stabil v1.0.0 og ingen
offisiell RC-kunngjøring** per 29.09.2026; 0.45.x er fortsatt den stabile linjen.
Kilder: <https://orm.drizzle.team/docs/latest-releases>, <https://orm.drizzle.team/roadmap>,
<https://orm.drizzle.team/docs/v0-v1-changes>

Konsekvens: spinens «pinnes ved installasjon» lander riktig på 0.45.x i dag. Men
det bør stå i spinen at en brytende majorversjon er ventet, slik at ingen senere
oppgraderer på refleks midt i et prosjekt med målekjøringer som skal være
sammenlignbare over tid.

### FLAGG 2 — Turbopack er default i Next.js 16, og de gamle Drizzle-oppskriftene brekker

Dette er det mest praktisk relevante funnet i punkt 5, og spinen sier ingenting om det.

Next.js 16 kjører **Turbopack som standard**. De utbredte oppskriftene for å få
`pg` og `drizzle-orm` til å fungere i Next.js bygger på `webpack`-externals-hooks og
`serverComponentsExternalPackages`. Kombinasjonen feiler nå bygget direkte med
«This build is using Turbopack, with a webpack config and no turbopack config».
Kilder: <https://github.com/vercel/next.js/discussions/85246>,
<https://github.com/Valorthon/Pocketlet/issues/90>

Vurdering av rekkevidde: de mest akutte Turbopack-feilene jeg fant er
**libSQL/SQLite-spesifikke** — for eksempel at Turbopack prøver å parse
`node_modules/@libsql/hrana-client/LICENSE` som JavaScript
(<https://github.com/vercel/next.js/issues/82881>). Lesevenn bruker PostgreSQL og
rammes ikke av dem. Men konfigurasjonskonflikten over er ikke driverspesifikk, og
den treffer enhver Next.js 16-oppskrift kopiert fra Next.js 14/15-æraen — samme
klasse fotfelle som spinens egen merknad om `middleware.ts` mot `proxy.ts`.

**Anbefaling:** utvid merknaden ved oppsett til å dekke dette. Den nåværende
merknaden advarer bare om proxy-navnet; den bør også si at Next.js 16-oppsett
bruker Turbopack-konfigurasjon, ikke `webpack`-hooks, og ikke
`serverComponentsExternalPackages`.

### Kunne ikke verifiseres

Påstanden «verifisert som standardvalg for greenfield Next.js + PostgreSQL i 2026»
**kunne ikke verifiseres**. Jeg fant ingen autoritativ kilde som utpeker Drizzle som
standardvalget. Det er et utbredt, aktivt og godt støttet valg, men Prisma og andre
finnes fortsatt, og «standardvalg» er en vurdering, ikke et etterprøvbart faktum.
Spinen bør nedgradere ordet fra «verifisert» til det det er: et begrunnet valg.
Det samme gjelder Better Auth-raden, som bruker samme konstruksjon
(«verifisert som anbefalt») — der er *anbefalingsstatusen* riktignok lettere å
underbygge, siden Auth.js' egne vedlikeholdere anbefaler Better Auth for nye
prosjekter.

---

## 6. unpdf

**Dom: bekreftet, i alle ledd, inkludert forutsetningen om tekst per side.**

| Spørsmål | Svar | Kilde |
| --- | --- | --- |
| Finnes? | Ja — `unpdf`, «PDF extraction and rendering across all JavaScript runtimes» | <https://registry.npmjs.org/unpdf/latest> |
| Gjeldende versjon | **1.8.1** | npm-registeret |
| Lisens | MIT | npm-metadata |
| Vedlikeholdt? | Ja — siste push 14.08.2026, 1 åpent issue, ikke arkivert, 1238 stjerner | <https://api.github.com/repos/unjs/unpdf> |
| Vedlikeholder | Johann Schopplich, under unjs-paraplyen | <https://github.com/unjs/unpdf> |
| Over pdfjs? | Ja — leveres med en serverless-bygging av Mozillas PDF.js, `pdfjs-dist ~6.1.200` | README + npm-metadata |

### Tekst per side — PF-1-forutsetningen holder

Spinen forutsetter at unpdf «gir tekst per side». Det gjør det, og det er
standardoppførselen. `extractText` returnerer:

```ts
Promise<{
  totalPages: number
  text: string | string[]
}>
```

Fra README, ordrett:

> If `mergePages` is set to `true`, the text of all pages will be merged into a
> single string with line breaks preserved and at most one blank line in a row.
> Otherwise, an array of strings for each page will be returned.

Kilde: <https://github.com/unjs/unpdf#readme>

Med `mergePages` utelatt eller `false` er `text` et `string[]` med én streng per
side. `totalPages` kommer gratis. Det er presis den formen PF-1 og
avsnittsdelingen i AD-9 trenger, og det er verdt å merke i spinen at
**`mergePages` må ikke settes til `true`** — da forsvinner sidegrensene, og PF-1
mister forutsetningen sin uten at noe feiler.

---

## Oppsummerte anbefalte rettinger i spinen

| Hvor | Retting | Hvorfor |
| --- | --- | --- |
| **AD-8** | Bytt begrunnelse fra CVE-2025-29927 alene til den strukturelle server-action-begrunnelsen, med CVE-en som historisk eksempel og med «fikset fra 15.2.3, rammer ikke 16.x» eksplisitt | Slik den står kan AD-8 avvises av en utvikler som oppdager at CVE-en er lukket |
| **Stack, Next.js-rad** | Pinn **16.3.7 eller nyere**, ikke 16.3.6 | Sikkerhetsutgivelse 30.09.2026 lukker ni hull, ett kritisk |
| **Stack, Drizzle-rad** | Erstatt «verifisert som standardvalg» med «begrunnet valg»; legg til at v1 er under arbeid og at 0.45.x er gjeldende stabile | «Standardvalg» kunne ikke verifiseres; en brytende major er ventet |
| **Stack, Better Auth-rad** | Behold. Eventuelt: presiser at Auth.js-overtakelsen (09.2025) er separat fra Vercel-oppkjøpet (07.07.2026), og at biblioteket nå er Vercel-eid men MIT | Rekkefølgen er feil implisitt; Vercel-eierskapet er en svak plattformdragning |
| **Stack, unpdf-rad** | Legg til at `mergePages` ikke skal settes til `true` | Forutsetningen om tekst per side er en API-innstilling, ikke en egenskap |
| **Merknad ved oppsett** | Utvid fra proxy-navnet til også å dekke at Next.js 16 kjører Turbopack som standard, og at `webpack`-externals og `serverComponentsExternalPackages` fra eldre Drizzle-oppskrifter brekker bygget | Samme klasse fotfelle som proxy-navnet, og mer sannsynlig å treffe først |
| **`[ANTAKELSE]`-blokken** | Den kan strammes: versjonene *er* nå kjent (Better Auth 1.7.6, Drizzle 0.45.3, unpdf 1.8.1) | Blokkens forsiktighet var riktig, men grunnen til den er nå borte |

## Hva jeg ikke fant

Listet fordi fraværet er informasjon:

- **Innholdet i sikkerhetsutgivelsen 30.09.2026.** Advisories var ikke publisert
  ved kontrolltidspunktet. Vi vet at én av ni er kritisk, men ikke om noen berører
  proxy-laget eller autorisasjon. Bør sjekkes 30.09 eller 01.10.
- **Nøyaktige npm-publiseringsdatoer** for `drizzle-orm@0.45.3` og `unpdf@1.8.1`.
  `time`-feltet i registeret ble ikke lest ut; Drizzle-datoen («7 dager siden»,
  altså ca. 22.09.2026) stammer fra en søkeoppsummering, ikke fra registeret selv.
- **Offisiell Drizzle v1-RC-kunngjøring.** En tredjepartsside refererte til «0.45.x
  → v1 RC4», men jeg fant ingen bekreftelse fra Drizzle-teamet. Behandle
  RC-statusen som uavklart; beta er bekreftet.
- **Noen autoritativ kilde som utpeker Drizzle som «standardvalget»** for
  greenfield Next.js + PostgreSQL. Ingen funnet.
- **Better Auth testet mot et konkret 16.3.x-patchnivå.** Guiden sier «16+».
- **Kjente Drizzle-problemer spesifikt mot PostgreSQL-driveren i Next.js 16.**
  Turbopack-sakene jeg fant er libSQL/SQLite-spesifikke, eller generelle
  webpack-mot-Turbopack-konfliktsaker. Ingen PostgreSQL-spesifikk blokkerer funnet
  — men fravær av funn er ikke bevis på fravær av problem.

## Kilder

- <https://endoflife.date/nextjs>
- <https://nextjs.org/blog>
- <https://nextjs.org/blog/next-16>
- <https://nextjs.org/blog/upcoming-nextjs-security-release-september-2026>
- <https://nextjs.org/blog/nextjs-security-update-september-22-2026>
- <https://nextjs.org/docs/app/api-reference/file-conventions/proxy>
- <https://nextjs.org/docs/messages/middleware-to-proxy>
- <https://nextjs.org/docs/app/guides/data-security>
- <https://nextjs.org/docs/pages>
- <https://github.com/advisories/GHSA-f82v-jwr5-mffw>
- <https://vercel.com/blog/vercel-acquires-better-auth>
- <https://better-auth.com/blog/authjs-joins-better-auth>
- <https://github.com/nextauthjs/next-auth/discussions/13252>
- <https://better-auth.com/docs/integrations/next>
- <https://better-auth.com/docs/adapters/drizzle>
- <https://registry.npmjs.org/better-auth/latest>
- <https://registry.npmjs.org/drizzle-orm/latest>
- <https://www.npmjs.com/package/drizzle-orm>
- <https://orm.drizzle.team/docs/latest-releases>
- <https://orm.drizzle.team/roadmap>
- <https://orm.drizzle.team/docs/v0-v1-changes>
- <https://github.com/vercel/next.js/discussions/85246>
- <https://github.com/vercel/next.js/issues/82881>
- <https://github.com/Valorthon/Pocketlet/issues/90>
- <https://registry.npmjs.org/unpdf/latest>
- <https://github.com/unjs/unpdf>
- <https://api.github.com/repos/unjs/unpdf>
