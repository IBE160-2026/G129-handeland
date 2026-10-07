# Eksempeltekster

Fagtekstene Lesevenn demonstreres og måles mot. De ligger i repoet fordi
testmodus (AD-18, FR-46) trenger en tekst de lagrede modellsvarene hører til,
og fordi målingene i FR-8 må kunne kjøres om av andre enn utvikleren.

## Opphav og lisens

Begge tekstene er hentet fra **NDLA** (Nasjonal digital læringsarena) og er
lisensiert **CC BY-SA 4.0**. Lisensen er bekreftet i NDLAs eget artikkel-API,
i feltet `copyright.license`, ikke lest av en nettside.

| Fil | Artikkel | NDLA-id | Lenke |
|---|---|---|---|
| `em-egenskaper.txt` | Egenskaper hos ulike EM-bølger | 22989 | <https://ndla.no/r/naturfag-sf/egenskaper-hos-ulike-em-bolger/29d03c7ab9> |
| `straling-radioaktive-kilder.txt` | Stråling fra radioaktive kilder | 23109 | <https://ndla.no/r/naturfag-sf/straling-fra-radioaktive-kilder/e524a9cc50> |

**Kreditering, slik NDLA oppgir den:**

- *Egenskaper hos ulike EM-bølger* — Astrid Johansen (forfatter), Kristin Bøhle
  (medforfatter), Kari Marlene Mulder (språk), Anne Lilleng (korrektur).
- *Stråling fra radioaktive kilder* — Astrid Johansen (forfatter), Thomas Bedin
  (medforfatter), Kari Marlene Mulder (språk), Anne Lilleng (korrektur),
  Anne Vagstein (korrektur).

**Hva CC BY-SA 4.0 krever av dette prosjektet:** kreditering (over), lenke til
lisensen, at endringer oppgis, og at tekstene videreformidles under samme
lisens. Vilkårene gjelder **tekstfilene i denne mappa**, ikke kildekoden i
repoet for øvrig — det er to ulike verk, og lisensen smitter ikke over på koden.
Lisenstekst: <https://creativecommons.org/licenses/by-sa/4.0/deed.no>

## Endringer gjort

Tekstene er hentet som HTML fra NDLAs artikkel-API og konvertert til ren tekst.
Konkret:

- Bilder, figurer, videoer, tabeller og NDLAs innbygde simuleringer er fjernet.
  Bildene har dessuten **egne lisenser** som ikke er de samme som tekstens —
  minst én illustrasjon i dette stoffet er CC BY-NC-ND. Det er en grunn til å
  ikke ta dem med, utover at Lesevenn bare bruker tekst.
- Overskrifter er beholdt som egne linjer, og avsnitt er skilt med blanke
  linjer. Det er formatet `tekst/avsnittsdeling.ts` (AD-12) deler på.
- HTML-entiteter er oversatt til vanlige tegn, og hardt mellomrom til vanlig
  mellomrom.
- Ingen setninger er endret, forkortet eller omskrevet. Verbatim-kravet i FR-7
  måler mot presis denne teksten, så en omskriving ville gjort valideringen
  meningsløs.

## Hvorfor to tekster, og hvorfor disse

**`em-egenskaper.txt` (779 ord) er demoteksten.** Den har sju overskrifter, høy
og reell begrepstetthet, og — viktigst — ingen blokker som
`tekst/avsnittsdeling.ts` feilleser som overskrift. Den viser løypen uten at
rot i inndataene står i veien.

**`straling-radioaktive-kilder.txt` (507 ord) er den rotete.** Den har to
blokker som blir lest som overskrift uten å være det:

- `"Denne prosessen kalles"` — en setning som fortsatte i et innbygd element
  som ble fjernet, så det som står igjen er et fragment uten punktum.
- `"R88226a→R86222n+H24e"` — en kjernefysisk likning der sub- og superskript er
  kollapset til én linje.

Begge treffer samme regel i `erOverskrift`: høyst 100 tegn, slutter ikke på
`.!?:`. Det er **ikke en feil som skal skjules** — det er nøyaktig den klassen
rot gjennomsynet i FR-3 fase 3b finnes for, og en tekst som utløser den er
verdt mer som testmateriale enn en som ikke gjør det. Se `kodefunn.md`.
