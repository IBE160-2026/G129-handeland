# Gjennomgang av innloggingskoden — FR-41

**Gjennomgått av:** Arve Esteban Handeland
**Kode:** commits `5262c6e`, `2c30e3d`, `aae43f9` (innlogging, sider, migrasjon over HTTPS)
**Startet:** 2026-10-15

FR-41 krever at KI-generert kode for innlogging, lagring og sletting gjennomgås,
verifiseres og dokumenteres. Dette dokumentet er den dokumentasjonen.

## Metode, og hvorfor den ble endret underveis

Planen var en gjennomgang linje for linje, med 14 punkter jeg skulle sjekke ved
å lese koden, teste i appen og ødelegge koden med vilje. Etter to punkter
endret jeg metoden. Å vurdere om koden gjør det kommentaren sier, krever at man
kan lese den flytende, og det kan jeg ikke ennå. Øvelsene tok lang tid uten at
jeg lærte så mye av å gjenta dem. FR-41 ble endret tilsvarende 15.10.2026.

Gjennomgangen består nå av tre deler:

1. **To punkter gjort for hånd** (under), for å forstå metoden: jeg brøt en
   regel i koden, kjørte testene, og så at de oppdaget det.
2. **Resten av den samme metoden gjort av et skript**, `npm run sjekk:innlogging`
   (`data/sjekk-innlogging.mjs`). Det bryter sju regler én om gangen og sjekker
   at testene oppdager hver av dem. Rapporten ligger i `maaling/resultater/`.
   Skriptet kan kjøres om av hvem som helst, også sensor.
3. **Tre tester i appen** som jeg gjør selv, uten å røre koden: jeg prøver
   påstanden på <https://lesevenn.vercel.app> og ser hva som skjer.

**Hva metoden ikke kan avdekke:** den sjekker reglene noen har tenkt på å teste.
En feil ingen har forestilt seg, finnes det ingen test for, og da finner
mutasjonstesten den heller ikke.

## Del 1 — gjort for hånd

### 1. Registreringen er stengt uten kode
- Gjorde: Endret return false til return true på linje 62. 
- Fant: fire tester feilet. Linjen bestemmer hva som skjer når koden mangler, og feil kode stoppes uansett av sammenligningen under. 

× riktig kode godtas, feil eller manglende avvises 10ms
× uten kode i miljøet er registreringen stengt, ikke åpen 1ms
× en POST rett mot ruten uten kode avvises 120ms
× serverkallet går også gjennom sjekken 122ms

Altså: riktig kode ble fortsatt godtatt, og feil kode ble fortsatt stoppet. Det eneste som endret seg, var at manglende kode slapp gjennom, både når eleven lot feltet stå tomt og når koden mangler i Vercel. Da er registreringen åpen for alle. Testen «riktig kode godtas, feil eller manglende avvises» feilet fordi den sjekker alle tre tilfellene samtidig, og ett av dem brøt.
- Status: Satt tilbake

### 2. Koden sjekkes for hver registrering
- Hva jeg gjorde: Jeg har gjort to ting. Først sjekket jeg i appen hva som skjedde når jeg skrev inn feil kode, og da fikk jeg opp feilmelding som forventet.
Jeg endret også "/sign-up/email" til "/feil-sti", som sender alle registreringer videre, uten at man noen gang sjekker koden. 
- Hva jeg fant: Tre feil, som forventet.     
  × en POST rett mot ruten uten kode avvises 312ms
  × en POST rett mot ruten med feil kode avvises 206ms
  × serverkallet går også gjennom sjekken 282ms
- Status:Satt tilbake

## Del 2 — mutasjonstesten

Kjørt 15.10.2026: **7 av 7 brudd ble oppdaget av testene.** Full tabell i
`maaling/resultater/2026-10-15-innlogging-mutasjoner.md`.

| Nr | Regelen som ble brutt | Oppdaget av |
|---|---|---|
| 1 | Uten invitasjonskode i miljøet er registreringen stengt | 4 tester |
| 2 | Koden sjekkes ved hver registrering, også rett mot ruten | 3 tester |
| 3 | Navn og bilde lagres ikke | 1 test |
| 4 | IP-adresse og nettleserinfo lagres ikke | 1 test |
| 5 | Én elev finner ikke en annens tekst | 1 test |
| 6 | Når kontoen slettes, forsvinner tekstene med | 1 test |
| 7 | Eleven kan slette kontoen sin | 1 test |

Nr. 1 og 2 er de samme som jeg gjorde for hånd i del 1, og skriptet fikk samme
resultat som meg.

- Hva jeg tenker om resultatet: som forventet at det gikk gjennom, og bra at det ble testet.

## Del 3 — tester i appen

Lag testkontoer med invitasjonskoden, og slett dem på kontosiden etterpå.
Tabellene i databasen ser du i Neon-konsollen → prosjektet → *Tables*.

| Nr | Påstanden | Hvordan jeg tester den |
|---|---|---|
| A | Den som ikke er innlogget, slipper ikke inn | Åpne <https://lesevenn.vercel.app> og <https://lesevenn.vercel.app/konto> i et **privat** nettleservindu. Begge skal sende meg til innloggingssiden |
| B | Når kontoen slettes, forsvinner alt | Lag en testkonto, lim inn en kort tekst, og slett kontoen på kontosiden. Se i Neon at tabellen `tekst` ikke har teksten lenger, og at `user` ikke har testkontoen |
| C | Mange feil passord på rad blir stoppet | Logg inn med feil passord 5–6 ganger raskt etter hverandre. Jeg skal få «For mange forsøk på kort tid.» |

### A. Uinnloggede slipper ikke inn
- Hva jeg gjorde: Jeg åpnet lenkene i et privat nettleservindu, i motsettning til det vanlige nettleservinduet
- Hva jeg fant: Vanligvis kommer jeg rett inn på min egen konto når jeg limer inn i vanlig nettleser, mens i privat så ble jeg bare omdirigert til innlogging
- Status: Testet

### B. Sletting tar med alt
- Hva jeg gjorde: Jeg lagde en testkonto, kjørte en tekst gjennom den, og fikk den til å lage oversikt. Deretter så jeg at disse avsnittene hadde blitt lagret i Neon. Deretter slettet jeg prøvebrukeren min fra appen. 
- Hva jeg fant: Når jeg slettet brukeren min i appen, så ble også dataene slettet fra neon. 
- Status: Testet.

### C. Feil passord på rad stoppes
- Hva jeg gjorde: Jeg prøvde å skrive inn feil passord flere ganger på rad, innenfor en kort tidsramme 
- Hva jeg fant: Jeg fikk da opp en feilmelding om det var for mange forsøk.
- Status: Testet

## Oppsummering

Gjennomgangen viste at det har blitt tenkt på mange scenarioer som gjelder for innlogging, og at testene viser at det er som forventet. 