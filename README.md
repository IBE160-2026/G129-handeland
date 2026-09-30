# Gruppe G129

Gruppeprosjekt i **IBE160 Programmering med KI** ved Høgskolen i Molde, høsten 2026 (15 studiepoeng).

Repoet inneholder gruppens applikasjon og dokumentasjon av utvikling, testing og kvalitetssikring med KI.

## Medlemmer

- Arve Esteban Handeland

## Lesevenn

Leseforståelsesapp for elever på videregående. Eleven limer inn, laster opp som PDF eller fotograferer en fagtekst, og føres gjennom en lesestrategi-sekvens: aktivering av forkunnskaper, lesing med fagbegreper markert, og forståelsessjekk gjennom quiz, øvekort og en skriftlig fagsamtale.

### Komme i gang

```bash
npm install
cp .env.example .env.local   # fyll inn nøkler
npm run dev                  # http://localhost:3000
npm run build                # verifiser før push
```

### Dokumentasjon

Alt planleggingsmateriale ligger i [`_bmad-output/planning-artifacts/`](_bmad-output/planning-artifacts/):

| Fil | Innhold |
|---|---|
| `prd-lesevenn.md` | Kravspesifikasjon, 42 funksjonskrav med testbare konsekvenser |
| `arkitektur-lesevenn.md` | Arkitekturspine, 17 bindende invarianter |
| `proposal-lesevenn.md` | Arbeidskravet, godkjent 25.09.2026 |
| `fremdriftsplan.md` | Milepæler, timeregnskap og kuttrekkefølge |
| `ki-logg.md` | Løpende logg over KI-bruk i utviklingen (FR-38) |
| `underlag-refleksjonsrapport.md` | Råstoff til refleksjonsrapporten |
| `addendum-lesevenn.md` | Emnekontekst, teknologivurderinger, forkastede alternativer |
| `reviews/` | Gjennomganger av arkitekturspinen |

### Teknologi

Next.js 16 (App Router) · TypeScript · PostgreSQL med Drizzle · Better Auth · Tailwind CSS
