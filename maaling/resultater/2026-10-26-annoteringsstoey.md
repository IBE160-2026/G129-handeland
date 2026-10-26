# Egen annoteringsstøy — 2026-10-26

Runde 1 mot runde 2 av samme annotatør, samme tekster. Sammenligningsregelen er
den samme som i FR-8-målingen (maaling/sammenligning.ts).

| Tekst | Dager mellom | Runde 1 | Runde 2 | Begge | Bare 1 | Bare 2 | Positivt samsvar | κ (alle ordformer) |
|---|---|---|---|---|---|---|---|---|
| Språklige bilder: metafor, allegori og allusjon | 12 | 7 | 6 | 5 | 2 | 1 | 0.769 | 0.766 |
| Operativsystem | 12 | 8 | 9 | 4 | 4 | 5 | 0.471 | 0.457 |
| **Snitt** | | | | | | | **0.620** | **0.611** |

## Slik leses tallene

- **Positivt samsvar** er andelen av valgene som går igjen i begge runder, 2·begge / (2·begge + bare 1 + bare 2).
  Det er F1 mellom rundene, og kan sammenlignes direkte med F1 mellom modellen og Gullsettet:
  ligger modellens F1 nær dette tallet, er modellen omtrent så enig med deg som du er med deg selv.
- **κ** er regnet med hver ulike ordform i teksten som sak. Med mange ord ingen runde valgte,
  ligger κ tett på det positive samsvaret — det er en egenskap ved metoden.
- **Begrensning:** to tekster er et lite grunnlag. Tallet sier noe om retningen, ikke en presis verdi.

## Merknader (skrevet etter at tallene var regnet)

- **Valg av tekster.** Runde 2 ble gjort i chat 26.10: teksten ble vist ordrett uten markering, annotatøren skrev ordene, og
  Claude førte dem inn uten forslag. Runde 1-filene ble ikke åpnet før begge tekstene var ført inn.
- **Påvirkning.** *Språklige bilder* har ikke vært brukt i minneversmålingen (FR-31). *Operativsystem* har det: annotatøren
  har sett fagord fra runde 1 på vurderingsarkene for minnevers (v3–v6). Begrensningen trekker samsvaret for den teksten opp,
  ikke ned — og det ble likevel det laveste.
- **Hva uenigheten består av.** Av de tolv ulike valgene er tre bare bøyning eller presisjon av samme begrep
  (*konnotasjoner / konnotasjon*, *driverprogrammet / driverprogram*, *minne / hovedminne*). Regnet uten bøyning ville
  snittet vært rundt 0,76 (0,92 og 0,59). Den strenge regelen gjelder, men det viser at en del av støyen er form, ikke skjønn.
- **Ett brudd på regelen i runde 1:** *Lyriske virkemidler* er en overskrift i teksten.
