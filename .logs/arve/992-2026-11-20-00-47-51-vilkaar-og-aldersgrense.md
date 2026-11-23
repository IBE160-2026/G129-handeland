# Vilkår og aldersgrense

## 2026-11-20 kl. 00:47 — Arve

### Oppgave
Avkrysning for «jeg har lest vilkårene» og aldersgrense ved registrering. Arve valgte 15 år, bare for nye kontoer, og seg selv som kontakt og behandlingsansvarlig.

### Plan
- Behandlingsgrunnlag avtale, ikke samtykke; avkrysning, ikke fødselsdato; sjekken på serveren som invitasjonskoden.
- Utkast til vilkårsteksten først, rettet og godkjent av Arve: [vilkaar-tekst-utkast.md](../../_bmad-output/implementation-artifacts/vilkaar-tekst-utkast.md).
- Under skrivingen ble det funnet at telleren for innloggingsforsøk lagret IP-adressen i klartekst; tatt med (hashing) sammen med et innsynsskript.
- bmad-build: [spec-vilkaar-og-aldersgrense.md](../../_bmad-output/implementation-artifacts/spec-vilkaar-og-aldersgrense.md), underagent, tre gjennomgangslag.

### Resultat
- Grenen `vilkaar`: 0df9ec4, 50d0181, a9f3744, 927813e, dcb6f99. Ikke rullet ut.
- `/vilkaar` (offentlig), to avkrysninger ved registrering, sjekk i Better Auth-hooken, bekreftelse lagret i samme transaksjon som kontoen (tabell `vilkaarsbekreftelse`, migrasjon 0010, ikke kjørt mot Neon). Versjon 2026-11-20.
- Telleren hasher nøkkelen med `BETTER_AUTH_SECRET`; 0010 sletter gamle `rate_limit`-rader. Kodefunn 28.
- `node data/innsyn.mjs <e-post> [--ut innsyn-….json]` henter alt for én konto.
- PRD FR-35, ny FR-53, §6.2; KI-logg 26.
- Gjennomgang: 21 funn, 9 rettet (bl.a. innsynsskriptet leste ikke e-posten uten --ut), ordlyd avgjort av Arve, 1 utsatt (deferred-work.md), resten avvist med begrunnelse.
- Verifisert: tester 729/729, innlogging 13/13, tilgjengelighet 420/420, README 8/8, demotest 3/3, build.

### Åpne punkter
- Rull ut grenen vilkaar: Neon-migrering 0010 FØR koden (ellers feiler registreringen), merge til main og vercel --prod (krever ja).
- Etter utrulling: gjør del 3-test C (feil passord på rad) i prod på nytt, siden telleren er byttet.
- Fyll ut «Hva jeg tenker om resultatet» i den nye delen av gjennomgang-innlogging.md.
- Les KI-logg nr. 26 (skrevet av agenten med dine ord fra vilkårsteksten).

## 2026-11-20 kl. 00:54 — Arve

### Oppgave
Rull ut vilkår og aldersgrense.

### Plan
- List endringer siden forrige utrulling, Neon-migrering 0010 før koden, spol main fram, vercel --prod, røyktest.

### Resultat
- Med fulgte: 0df9ec4, 927813e, dcb6f99 (kode) pluss spesifikasjon, dokumentasjon og logg. I prod før: Mapper (a15fada).
- Neon: 0010_vilkaar kjørt (11 av 11, «à jour»); `rate_limit` tømt av migrasjonen.
- main spolt fram til dddbfea og pushet; vercel --prod → lesevenn-7b0d6s290 (Ready, alias lesevenn.vercel.app).
- Røyktest: /, /vilkaar og /registrer svarer 200, /samling sender til /logg-inn. /vilkaar har «Sist endret 20. november 2026» og den nye IP-setningen; /registrer har avkrysningen for 15 år.
- Ikke testet i prod: en faktisk registrering (ville laget en ekte konto) og serversperren uten avkrysning.
- Reserve: `vercel rollback`. 0010 er bare et tillegg; gammel kode tåler tabellen.

### Åpne punkter
- Registrer en ny testkonto i prod (på telefon), og prøv feil passord flere ganger på rad (del 3-test C).

## Tillegg 2026-11-23: ny invitasjonskode

- Den gamle `LESEVENN_INVITASJONSKODE` lå som Sensitive i Vercel og kunne ikke leses tilbake, så Arve fant den ikke for registreringstesten.
- Byttet med en ny, kort kode (Production, Sensitive), og rullet ut main 3478cca på nytt (lesevenn-855fqf37h, Ready). Koden står ikke i repoet.
- Kontroll: forsiden 200, registrering med feil kode gir 403 «Invitasjonskoden er feil.».
- Lærdom: lagre koden i en passordbehandler når den lages.
