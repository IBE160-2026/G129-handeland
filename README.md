# Gruppe G129

Gruppeprosjekt i **IBE160 Programmering med KI** ved Høgskolen i Molde, høsten 2026 (15 studiepoeng).

Repoet inneholder gruppens applikasjon og dokumentasjon av utvikling, testing og kvalitetssikring med KI.

## Medlemmer

- Arve Esteban Handeland

## Lesevenn

Leseforståelsesapp for elever på videregående. Eleven limer inn, laster opp som PDF eller fotograferer en fagtekst, og føres gjennom en lesestrategi-sekvens: aktivering av forkunnskaper, lesing med fagbegreper markert, og forståelsessjekk gjennom quiz, øvekort og en skriftlig fagsamtale.

### Komme i gang

Appen kan kjøres uten API-nøkler og uten betalte kontoer. Databasen kjører
lokalt i Docker, og språkmodellkallene leses fra lagrede svar som ligger i
repoet. Det eneste som kreves er Node 22 eller nyere og Docker.

```bash
npm install
cp .env.example .env.local   # virker som den står, ingen nøkler å fylle inn
npm run db:opp               # starter Postgres i Docker og venter til den er klar
npm run db:migrer            # lager tabellene
npm run dev                  # http://localhost:3000
```

Hele kjerneløypen kan gås gjennom slik: lese inn eksempelteksten, aktivering,
lesevisning med faguttrykk markert, quiz, og fagsamtale. `npm run db:ned`
stopper databasen; dataene beholdes. `docker compose down -v` sletter dem.

**Lagrede modellsvar.** `.env.example` setter `LESEVENN_TESTMODUS=les`, som
betyr at generatorlaget leser svaret fra `testdata/modellsvar/` i stedet for å
kalle språkmodellen. Svarene valideres mot samme skjema som ferske svar, så
kodeveien som kjøres er den samme som i drift — bare uten kall og uten kostnad.
Testmodus dekker eksempelteksten i repoet; en annen tekst gir en feilmelding som
sier nettopp det. Begrunnelsen og de tre modusene står i
[`generatorer/lagretsvar.ts`](generatorer/lagretsvar.ts).

**Kjøre mot ekte modellkall.** Sett `LESEVENN_TESTMODUS=av` og legg inn en egen
`ANTHROPIC_API_KEY` i `.env.local`. Dette koster penger per kall. Vil du lagre
svarene for senere gjenbruk, bruk `=skriv` i stedet, som både kaller modellen og
skriver svaret til `testdata/modellsvar/`.

**Kjøre mot prosjektets egen database.** `npx vercel env pull .env.local` henter
Neon-tilkoblingen fra Vercel. [`data/db.ts`](data/db.ts) velger driver ut fra
vertsnavnet i `DATABASE_URL`, så ingenting må endres i koden.

### Tester

```bash
npm test         # 88 tester, ingen av dem kaller språkmodellen
npx tsc --noEmit # typesjekk
npm run build    # verifiser før push
```

### Dokumentasjon

Alt planleggingsmateriale ligger i [`_bmad-output/planning-artifacts/`](_bmad-output/planning-artifacts/):

| Fil | Innhold |
|---|---|
| `product-brief-lesevenn.md` | Hvorfor appen finnes, hvem den er for, og hva som er med i v1 |
| `prd-lesevenn.md` | Kravspesifikasjon, 43 funksjonskrav med testbare konsekvenser |
| `arkitektur-lesevenn.md` | Arkitekturspine, 18 bindende invarianter |
| `proposal-lesevenn.md` | Arbeidskravet, godkjent 25.09.2026 |
| `fremdriftsplan.md` | Milepæler, timeregnskap og kuttrekkefølge |
| `ki-logg.md` | Løpende logg over KI-bruk i utviklingen (FR-38) |
| `kodefunn.md` | Feil og svakheter funnet i KI-generert kode, med hvordan (FR-41) |
| `underlag-refleksjonsrapport.md` | Råstoff til refleksjonsrapporten |
| `addendum-lesevenn.md` | Emnekontekst, teknologivurderinger, forkastede alternativer |
| `tilbakemelding-product-brief.md` | Tilbakemelding fra emneansvarlig, 06.10.2026 |
| `reviews/` | Gjennomganger av arkitekturspinen |
| `arbeidsnotater/` | Mellomprodukter fra planleggingen: avstemminger og gjennomganger av PRD-en |

### Teknologi

Next.js 16 (App Router) · TypeScript · PostgreSQL med Drizzle · Better Auth · Tailwind CSS
