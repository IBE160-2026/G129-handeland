# Promptregister — FR-39

Hver kjøretidsprompt ligger i `prompts/<oppgave>/vN.md`. Hvilken versjon som er
gjeldende, står i `prompts/gjeldende.json` (AD-14) — å legge en fil her er ikke
nok til å ta den i bruk. Dette registeret sier **hvorfor** hver versjon finnes,
og **hva som ble målt**. En versjon uten måling står som umålt.

Målerapportene ligger i `maaling/resultater/`.

---

## Faguttrykk (uttrekk av fagord, FR-7 til FR-11)

| Versjon | Dato | Endring og grunn | Målt | Status |
|---|---|---|---|---|
| v1 | 2026-10-07 | Første versjon. | Stabilitet (Jaccard) 0,262 med haiku-4-5 | Erstattet |
| v2 | 2026-10-08 | Todelt inklusjonstest, «ved tvil: utelat», ett uttrykk per oppføring, én form per begrep, ulike rangeringer. | Stabilitet ble *ikke* bedre (0,466 → 0,458 og 0,770 → 0,682), men like rangeringer forsvant (11 → 0). FR-8: gjenkalling 0,36, presisjon 0,42 (tre kjøringer) | Erstattet |
| v3 | 2026-10-14 | Annotatørens prioriteringsprinsipp, skrevet ned før data ble sett: ord som går igjen og er viktige, og sentrale ord teksten ikke forklarer. | FR-8 (tre kjøringer): gjenkalling 0,38 (ingen sikker forskjell), presisjon 0,46 (trolig litt bedre), mer stabil | **Gjeldende** |

**Den dokumenterte forbedringen FR-39 ber om:** v2 → v3, presisjon 0,42 → 0,46
over tre kjøringer hver, med spennene oppgitt. Og den ærlige delen: gjenkallingen
endret seg ikke, og FR-8 er ikke nådd.

## Quiz (FR-13, FR-14)

| Versjon | Dato | Endring og grunn | Målt | Status |
|---|---|---|---|---|
| v1 | 2026-10-16 | Første versjon. Ti kandidater, koden velger åtte. | Umålt (Quiz-gullsettet er M1) | Erstattet |
| v2 | 2026-10-16 | Utløst av et reelt FR-14-brudd funnet av utvikleren: «Hva er renter?» hadde som fasit hele tilbakebetalingen, mens teksten sier at rentene er *de ekstra pengene*. Krav om at det riktige alternativet betyr det samme som teksten, og at to spørsmål ikke spør om det samme. | Umålt. Én observasjon etter endringen: flere faktaspørsmål i demoquizen — følges opp i M1 | **Gjeldende** |

## Fagsamtale: startspørsmål og svarvurdering (FR-18 til FR-23)

| Versjon | Dato | Endring og grunn | Målt | Status |
|---|---|---|---|---|
| v1 | 2026-10-16 | Første versjon, claude-sonnet-5-5. Sikkerhetsregelen først, elevsvaret som data. | Prøvekjøring: 5 av 5 tilstander riktig, lot seg ikke lure | Erstattet |
| v2 | 2026-10-16 | Etter utviklerens testing: (1) et riktig svar ble vurdert *delvis* fordi **startspørsmålet var to spørsmål** bundet med «og hvorfor»; (2) vurderingene viste til «avsnitt 7», som eleven ikke ser; (3) «Det går fint å ikke vite, *for* avsnitt 7 …» knyttet trøsten til teksten. Ett spørsmål om én ting, ingen avsnittsnumre, dekkende krever poenget men ikke tekstens ordlyd, trøsten står for seg selv. | Prøvekjøring på de samme tilfellene: svaret som var *delvis* ble *dekkende*, ingen avsnittsnumre, trøsten står alene. Dobbeltspørsmål i 1 av 3 startspørsmål — koden gir derfor tre forsøk | **Gjeldende** |

**AD-6:** ingen av fagsamtaleversjonene har vært gjennom sikkerhetsporten i
FR-21, fordi Gullsettet på 36 tilfeller er lagt til M1. De er tatt i bruk umålt,
og grensesnittet sier at vurderingen kan ta feil.

**En observasjon til refleksjonsrapporten.** FR-20 krever at oppfølgingen bruker
et ord eleven selv innførte. Det fungerer godt ved misoppfatning og delvis, men ved
dekkende — der neste spørsmål skal gå til et *nytt* tema — gir det kunstige
overganger: «Du skrev at man får lov til å låne penger mot å betale renter. Hva
sier teksten om hvorfor renten på en sparekonto er høyere …?» Kravet er laget for
å bevise at systemet leser svaret, og det gjør det; prisen er en overgang en lærer
ikke ville brukt.

## Bildeuttrekk (FR-44, FR-45)

| Versjon | Dato | Endring og grunn | Målt | Status |
|---|---|---|---|---|
| v1 | 2026-10-16 | Første versjon, claude-haiku-5-5 (tar bilder). Ordrett avskrift, avsnitt og overskrifter på egne linjer, uten sidetall og topptekst; `lesbar: false` når bildet ikke viser tekst. | **Bevisst umålt** etter FR-45 — ingen terskel og ingen påstand om treffsikkerhet. Ett ekte kall med et blankt bilde ga riktig BF-1 | **Gjeldende** |

## Morsmål: oversettelse, oppsummering og utpeking (FR-24 til FR-29)

| Oppgave | Versjon | Dato | Endring og grunn | Målt | Status |
|---|---|---|---|---|---|
| oversettelse | v1 | 2026-10-16 | Første versjon, claude-haiku-5-5. Bunt av korte elementer med id; norsk Faguttrykk i parentes i uendret form (FR-25); nekting, tall og navn beholdes (FR-28). Samme prompt brukes til tilbakeoversettelse. | **FR-28 bestått for ukrainsk (19.10):** begrepsanker 0,981 (≥ 0,95), tilbakeoversettelse 0 avvik, ekstern vurdering 0 anmerkninger av 16. Morsmålsbrukeren endret tre steder (to ordvalg, én formulering), ingen feil. Svakhet funnet: samme fagord kan oversettes ulikt i ulike kall (kodefunn 22) | **Gjeldende** |
| oppsummering | v1 | 2026-10-16 | Første versjon. Høyst fem setninger på norsk, bare det teksten sier, hver med kildeavsnitt (FR-26). Lages på norsk og oversettes etterpå, så begge språk bygger på samme setninger. | Umålt. Vurderes av morsmålsbrukeren i FR-28 | **Gjeldende** |
| utpeking | v1 | 2026-10-16 | Første versjon. Språklige bilder og akademisk allmennspråk, ordrett, utenom Faguttrykkene, høyst åtte per 1 000 ord per kategori (FR-27). | Umålt. Ingen terskel i PRD utover formkravene, som koden håndhever | **Gjeldende** |

## Minnevers og Suno-prompt (FR-30, FR-31)

| Versjon | Dato | Endring og grunn | Målt | Status |
|---|---|---|---|---|
| v1 | 2026-10-16 | Første versjon, claude-haiku-5-5. «Sannhet går foran rim»; bare det teksten sier; ingen fagord utenfor listen. Koden avviser vers med fagord utenfor Begrepssettet, færre enn tre fagord eller feil linjetall, og prøver én gang til (AD-11). | Maskinelt: 10 av 10 vers besto kontrollen (ett etter nytt forsøk). Usanne påstander: venter på utviklerens vurdering (`maaling/resultater/fr31-vurderingsark.md`) | Erstattet |
| v2 | 2026-10-17 | Utløst av utviklerens spørsmål «hva er egentlig et minnevers?»: v1 ga rimfrie oppsummeringer med linjer på opptil 25 stavelser. Korte linjer (6–10 stavelser), parrim, fast rytme, ett poeng per linje, ingen tall; sannhetskravet uendret. Koden avviser linjer over 14 stavelser (først 12, hevet fordi lange fagord alene tar halve linjen). Tokentaket hevet fra 4 000 til 16 000: sju av ti kall gikk tom før svaret var ferdig. | Maskinelt: 10 av 10 etter nye forsøk (stavelsessjekken avviste ett vers fire ganger ved grense 12). Usanne påstander og «fungerer som huskeregel»: venter på utviklerens vurdering (`maaling/resultater/fr31-vurderingsark-v2.md`) | Erstattet av v3 før den ble vurdert |

## Avsnittsetiketter (FR-5)

| Versjon | Dato | Endring og grunn | Målt | Status |
|---|---|---|---|---|
| v1 | 2026-10-17 | Første versjon, claude-haiku-5-5. Tre til seks etiketter på to til seks ord, med avsnittet delen begynner i; et kart, ikke et sammendrag — røper ikke konklusjonene. Koden forkaster etiketter med ugyldig avsnitt, dubletter, feil rekkefølge og setninger, og kutter over seks. | Én prøve: prisvekst-teksten uten overskrifter ga seks gode etiketter av åtte foreslåtte (to kuttet av taket). Ikke målt mot et gullsett; FR-5 har ingen terskel | **Gjeldende** |
| v3 | 2026-10-18 | Som v2, pluss kildeavsnitt per linje (§5: «Ingen KI-utdata uten kilde» nevner vers spesielt). Koden avviser vers der en linje peker på en overskrift eller et avsnitt som ikke finnes. Lenkene vises eleven; på vurderingsarket står avsnittene under verset. | Maskinelt: 10 av 10 på første forsøk. **Utviklerens vurdering 19.10: 0 usanne påstander (FR-31 bestått), huskeregel 6 av 10** (`fr31-dommer-v3.json`). Kommentarene: rim som ser like ut men ikke låter likt, fyllinjer, unorsk formulering, og for mange temaer i ett vers | **Gjeldende** |
| v4 | 2026-10-19 | Etter utviklerens vurdering av v3: **ett tema i dybden** framfor mange i bredden (vers 9 var best); rim som rimer når de sies høyt (samme vokallyd og -lengde, med utviklerens eksempler); ingen fyllinjer; forståelig med en gang; naturlig norsk. Suno-formen tatt ut, den er satt på pause. | Maskinelt: 10 av 10 etter ett nytt forsøk (ett vers hadde bare to fagord — spenningen mellom ett tema og kravet om tre fagord). Usanne påstander og huskeregel: venter på utviklerens vurdering (`fr31-vurderingsark-v4.md`) | Kandidat |
