# Mutasjonstest av innloggingen — 2026-11-19

Kjørt med `npm run sjekk:innlogging` (data/sjekk-innlogging.mjs). Hver rad er en
regel innloggingen skal holde. Regelen ble brutt i koden, testene i
`data/auth.test.ts` ble kjørt, og fila ble satt tilbake.

**12 av 12 brudd ble oppdaget av testene.**

| Nr | Regel | Fil | Utfall | Testene som feilet |
|---|---|---|---|---|
| 1 | Uten invitasjonskode i miljøet er registreringen stengt | `data/auth.ts` | oppdaget | riktig kode godtas, feil eller manglende avvises; uten kode i miljøet er registreringen stengt, ikke åpen; serverkallet går også gjennom sjekken |
| 2 | Koden sjekkes ved hver registrering, også rett mot ruten | `data/auth.ts` | oppdaget | en POST rett mot ruten uten kode avvises; en POST rett mot ruten med feil kode avvises; serverkallet går også gjennom sjekken; mangler alder: ingen konto, ingen rad, og meldingen sier aldersgrensen; mangler vilkår: ingen konto, og meldingen viser til siden; rett mot ruten med riktig kode, men uten headerne: avvist; alder må være nettopp «ja», ikke hva som helst; gammel versjon: avvist med «Vilkårene er endret — last siden på nytt»; serverkallet går også gjennom vilkårssjekken |
| 3 | Navn og bilde lagres ikke | `data/auth.ts` | oppdaget | navnet klienten sendte lagres ikke |
| 4 | IP-adresse og nettleserinfo lagres ikke | `data/auth.ts` | oppdaget | økten lagrer verken IP-adresse eller nettleserinfo |
| 5 | Én elev finner ikke en annens tekst | `data/tilgang.ts` | oppdaget | én konto finner ikke en annens tekst, selv med riktig id |
| 6 | Når kontoen slettes, forsvinner tekstene med | `data/migrasjoner/0001_innlogging.sql` | oppdaget | kontoen og alt innholdet forsvinner |
| 7 | Eleven kan slette kontoen sin | `data/auth.ts` | oppdaget | kontoen og alt innholdet forsvinner; kontosletting tar med bekreftelsen (cascade) |
| 8 | Alder og vilkår sjekkes ved hver registrering, også rett mot ruten | `data/auth.ts` | oppdaget | mangler alder: ingen konto, ingen rad, og meldingen sier aldersgrensen; mangler vilkår: ingen konto, og meldingen viser til siden; rett mot ruten med riktig kode, men uten headerne: avvist; alder må være nettopp «ja», ikke hva som helst; gammel versjon: avvist med «Vilkårene er endret — last siden på nytt»; serverkallet går også gjennom vilkårssjekken |
| 9 | Bekreftelsen av vilkårene lagres når kontoen lages | `data/auth.ts` | oppdaget | godkjent: kontoen lages, med én rad med gjeldende versjon og tidspunkt; kontosletting tar med bekreftelsen (cascade); ingen konto uten bekreftelse: mislykkes lagringen, finnes ikke kontoen |
| 10 | Ingen konto uten bekreftelse: begge lagres i samme transaksjon | `data/auth.ts` | oppdaget | serverkallet med riktig kode i headeren lykkes; navnet klienten sendte lagres ikke; passordet lagres aldri i klartekst; økten lagrer verken IP-adresse eller nettleserinfo; id-ene er UUID, slik fremmednøkkelen fra tekst krever; én konto finner ikke en annens tekst, selv med riktig id; feil passord sletter ingenting; kontoen og alt innholdet forsvinner; gjentatte feil passord stoppes; godkjent: kontoen lages, med én rad med gjeldende versjon og tidspunkt; eksisterende konto uten bekreftelse logger inn som før; kontosletting tar med bekreftelsen (cascade); ingen konto uten bekreftelse: mislykkes lagringen, finnes ikke kontoen |
| 11 | IP-adressen lagres ikke i klartekst i telleren for innloggingsforsøk | `data/auth.ts` | oppdaget | telleren lagrer ikke IP-adressen i klartekst — kodefunn 28 |
| 12 | Begrensningen av innloggingsforsøk virker med hashet nøkkel | `data/auth.ts` | oppdaget | gjentatte feil passord stoppes; en annen IP-adresse sperres ikke av den første |
