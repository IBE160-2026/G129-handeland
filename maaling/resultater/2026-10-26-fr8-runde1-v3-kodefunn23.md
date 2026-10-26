# Måleresultat FR-8 — runde 1

Kjørt 2026-10-26 på 6 av 6 tekster.
Modell claude-haiku-5-5, prompt v3, 5 kjøringer, minst 3.

## Terskler

| Krav | Terskel | Målt | Status |
|---|---|---|---|
| FR-8 gjenkalling | ≥ 0,75 | 0.348 | **IKKE bestått** |
| FR-8 presisjon | ≥ 0,70 | 0.446 | **IKKE bestått** |

## Per tekst

| Tekst | Fag | Kilde | Type | Gull | Levert | Treff | Gjenkalling | Presisjon | F1 |
|---|---|---|---|---|---|---|---|---|---|
| Egenskaper hos ulike EM-bølger | naturfag | laeremiddel | oversikt | 12 | 7 | 4 | 0.333 | 0.571 | 0.421 |
| metafor | norsk | autentisk | oversikt | 7 | 5 | 3 | 0.429 | 0.600 | 0.500 |
| Språklige bilder: metafor, allegori og allusjon | norsk | laeremiddel | fokusert | 7 | 5 | 3 | 0.429 | 0.600 | 0.500 |
| Høy prisvekst gir ny renteøkning | samfunnsfag | autentisk | fokusert | 8 | 7 | 2 | 0.250 | 0.286 | 0.267 |
| Domeneoppbygning og toppdomene | teknologiforstaaelse | laeremiddel | fokusert | 5 | 7 | 2 | 0.400 | 0.286 | 0.333 |
| Operativsystem | teknologiforstaaelse | autentisk | oversikt | 8 | 6 | 2 | 0.250 | 0.333 | 0.286 |

Ingen av inndelingene under har egen terskel. Med én eller to tekster per
celle er tallet en observasjon og ikke en måling — men en systematisk
forskjell skal være synlig framfor skjult i et snitt (FR-8).

### Per fag

| fag | n | Gjenkalling | Presisjon |
|---|---|---|---|
| naturfag | 1 | 0.333 | 0.571 |
| norsk | 2 | 0.429 | 0.600 |
| samfunnsfag | 1 | 0.250 | 0.286 |
| teknologiforstaaelse | 2 | 0.325 | 0.310 |

### Per fagtype

| fagtype | n | Gjenkalling | Presisjon |
|---|---|---|---|
| fellesfag | 4 | 0.360 | 0.514 |
| programfag | 2 | 0.325 | 0.310 |

### Per tekstkilde

| tekstkilde | n | Gjenkalling | Presisjon |
|---|---|---|---|
| laeremiddel | 3 | 0.387 | 0.486 |
| autentisk | 3 | 0.310 | 0.406 |

### Per teksttype

| teksttype | n | Gjenkalling | Presisjon |
|---|---|---|---|
| oversikt | 3 | 0.337 | 0.502 |
| fokusert | 3 | 0.360 | 0.390 |
