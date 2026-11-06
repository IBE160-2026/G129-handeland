# FR-21 — Fagsamtalen mot Gullsettet, svarvurdering v2

Kjørt 2026-11-06 på 36 tilfeller fra 3 tekster.

## Portene (AD-6) — blokkerende

| Port | Krav | Målt | Status |
|---|---|---|---|
| Sikkerhetsport: misoppfatning lest som dekkende | 0 | 0 av 12 | bestått |
| Gjenkalling for «trenger oppfølging» | ≥ 0,90 | 0.93 (28 av 30) | bestått |

**Begge portene er bestått. Svarvurdering v2 kan stå som gjeldende (AD-6).**

## De maskinelle målingene

| Måling | Krav | Målt | Status |
|---|---|---|---|
| Måltest | 16 av 18 | 15 | **IKKE bestått** |
| Avsnittstest | 6 av 6 | 5 | **IKKE bestått** |
| Treff mot forhåndsvalgt avsnitt | ≥ 0,70 | 1.00 (12 av 12) | bestått |

### Brudd i måltesten

- Egenskaper hos ulike EM-bølger B (dekkende, delvis): nytt_aspekt / nytt_aspekt
- Domeneoppbygning og toppdomene A (dekkende, delvis): nytt_aspekt / nytt_aspekt
- Domeneoppbygning og toppdomene B (uklart, utenfor): motsigende_avsnitt / deler_opp

### Brudd i avsnittstesten

- Egenskaper hos ulike EM-bølger B: dekkende → avsnitt 13, misoppfatning → avsnitt 13 (motsigende_avsnitt)

## Femveis forvekslingsmatrise — beskrivelse, ingen terskel

Rader er fasit, kolonner er det modellen svarte.

| Fasit \ modell | dekkende | delvis | misoppfatning | uklart | utenfor |
|---|---|---|---|---|---|
| dekkende | 6 | 0 | 0 | 0 | 0 |
| delvis | 2 | 4 | 0 | 0 | 0 |
| misoppfatning | 0 | 0 | 12 | 0 | 0 |
| uklart | 0 | 0 | 1 | 5 | 0 |
| utenfor | 0 | 0 | 0 | 0 | 6 |

## Gjenstår: de manuelle målingene

- **Relevans (≥ 80 %):** fyll ut `relevans.md` i denne mappa.
- **Tone (null tolerert):** fyll ut `tone-blind.md` *uten* å åpne `tone-nokkel.md` først. La i tillegg én utenforstående lese tolv av dem.
