# Mutasjonstest av innloggingen — 2026-10-15

Kjørt med `npm run sjekk:innlogging` (data/sjekk-innlogging.mjs). Hver rad er en
regel innloggingen skal holde. Regelen ble brutt i koden, testene i
`data/auth.test.ts` ble kjørt, og fila ble satt tilbake.

**7 av 7 brudd ble oppdaget av testene.**

| Nr | Regel | Fil | Utfall | Testene som feilet |
|---|---|---|---|---|
| 1 | Uten invitasjonskode i miljøet er registreringen stengt | `data/auth.ts` | oppdaget | riktig kode godtas, feil eller manglende avvises; uten kode i miljøet er registreringen stengt, ikke åpen; en POST rett mot ruten uten kode avvises; serverkallet går også gjennom sjekken |
| 2 | Koden sjekkes ved hver registrering, også rett mot ruten | `data/auth.ts` | oppdaget | en POST rett mot ruten uten kode avvises; en POST rett mot ruten med feil kode avvises; serverkallet går også gjennom sjekken |
| 3 | Navn og bilde lagres ikke | `data/auth.ts` | oppdaget | navnet klienten sendte lagres ikke |
| 4 | IP-adresse og nettleserinfo lagres ikke | `data/auth.ts` | oppdaget | økten lagrer verken IP-adresse eller nettleserinfo |
| 5 | Én elev finner ikke en annens tekst | `data/tilgang.ts` | oppdaget | én konto finner ikke en annens tekst, selv med riktig id |
| 6 | Når kontoen slettes, forsvinner tekstene med | `data/migrasjoner/0001_innlogging.sql` | oppdaget | kontoen og alt innholdet forsvinner |
| 7 | Eleven kan slette kontoen sin | `data/auth.ts` | oppdaget | kontoen og alt innholdet forsvinner |
