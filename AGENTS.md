<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Lesevenn — prosjektregler

Leseforstaaelsesapp for videregaaende. Planleggingsdokumentene ligger i `_bmad-output/planning-artifacts/`.

**Les foerst, foer du skriver kode:**

- `arkitektur-lesevenn.md` — 18 invarianter (AD-1 til AD-18). Disse er bindende. Bryter du en, si det framfor aa gjoere det stille.
- `prd-lesevenn.md` — 43 funksjonskrav med testbare konsekvenser.
- `fremdriftsplan.md` — milepaeler og timeregnskap.

**De fem invariantene som oftest brytes av vane:**

1. **AD-1, AD-10:** ingen modellkall utenfor `generatorer/`. Generatorlaget importerer verken databaseklient eller rammeverkskode.
2. **AD-2, AD-12:** Kildeavsnitt er et avsnittsnummer, aldri et tegnspenn. Avsnittsdeling skjer i én funksjon, `tekst/avsnittsdeling.ts`, som ogsaa `maaling/` importerer.
3. **AD-8:** autorisasjon sjekkes i datatilgangslaget, aldri bare i `proxy.ts`. Hver datatilgangsfunksjon verifiserer eierskap.
4. **AD-11:** generert utdata valideres mot skjema foer lagring. Ugyldige elementer forkastes, for store sett kappes etter rangering.
5. **AD-16:** binaerdata lagres aldri. PDF parses i nettleseren, bilder krympes i klienten.

**GJENSTÅR, HØYT PRIORITERT: innlogging (FR-35).** Kjerneløypen bruker en midlertidig utviklingskonto i `data/konto.ts`. Appen er derfor sperret i drift og viser en forklaring i stedet. Better Auth er valgt men ikke installert. `tekst.kontoId` mangler fremmednøkkel til brukertabellen til dette er gjort.

**Fem stille feller i oppsettet:**

- Middleware heter `proxy.ts` og kjoerer paa Node-runtime. Oppskrifter for 15 og tidligere bruker det gamle navnet.
- Turbopack er standard. `webpack`-externals i pg/drizzle-oppskrifter feiler bygget.
- Sidegrenser maa bevares ved PDF-uttrekk, ellers mister PF-1 terskelen paa tegn per side.
- En sperre i rotlayouten hindrer IKKE at sidene kjoerer. Next evaluerer sidesegmentet selv om layouten ikke rendrer children, saa en sjekk som skal stoppe datatilgang maa staa i hver side.
- `.env.example` setter `LESEVENN_TESTMODUS=les`, saa en frisk utsjekk kaller IKKE modellen (AD-18). Et generatorkall som gir samme svar hver gang, eller feiler med `lagret_svar_mangler`, er testmodus - ikke en feil i generatoren. Sett `=av` for aa kalle modellen.

**Spraak:** domenebegreper i kode bruker ordlistens norske termer (Tekst, Avsnitt, Begrep, Fagsamtale). ASCII-translitterering der verktoey krever det: oe, aa, ae.
