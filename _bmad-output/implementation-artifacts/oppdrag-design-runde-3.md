# Oppdrag: design runde 3 og innloggingssperre

Bestilt av Arve 23.11.2026 etter telefontest i prod (VoiceOver bestått). Kodefrys 27.11. Bygges med bmad-build på grenen `design-runde-3`, i bolker. Utrulling krever ja.

## Avgjørelser (Arve, 23.11)

- **Navn:** bare sideoverskriften endres, «Samlingen» → «Samlinger». Domenebegrepet Mappe beholdes overalt ellers («Mappene dine», knapper, quiz, øvekort, PRD).
- **Arbeidsbordet:** en Tekst som ligger i én eller flere Mapper, vises IKKE alene i hovedbunken; den vises under HVER Mappe den ligger i. Mappen åpnes først, så velges Teksten, og derfra er alt som før. Visuell indikator på at det er en Mappe og ikke én Tekst. Tekster uten Mappe vises som i dag.
- **Dra og slipp:** ja, på stor skjerm, MED en vanlig knapp («Legg i mappe») for tastatur og skjermleser.
- **Innloggingssperre:** 5 forsøk per 60 s på `/sign-in/email` (customRules i `data/auth.ts`; standarden er 3 per 10 s). Skjemaet sperres med nedtelling fra `X-Retry-After`, og meldingen viser faktisk antall sekunder i stedet for «Vent et minutt». Ny regel i `sjekk:innlogging` (13 → 14).

## Bolker (forslag til rekkefølge, minst risiko først)

1. **Sperre:** serverregel, nedtelling, melding, enhetstest, mutasjonsregel.
2. **Små endringer:**
   - Forkunnskap («Hva vet du om dette fra før?») som glider med tre trinn, `<input type="range">`: Ingenting ennå (venstre) – Litt – Mye (høyre). «Skjønner ikke» sentrert under. Lagrede verdier og merkene beholdes.
   - Øvekort: piler i stedet for «Forrige»/«Neste» (med tilgjengelig navn), «Tilbake til mappen» øverst som del av headeren, «Kan» → «Har kontroll».
   - Overskrift «Samlinger».
   - Tastatur på øvekort: piltaster bytter kort, mellomrom snur. Mellomrom må ikke dobbeltvirke på en fokusert knapp, og ingenting skal fange tastene i skjemafelt.
3. **Øvekort på stor skjerm:** større kort som bruker mer av bredden; «Må øve mer» / «Har kontroll» inne i kortet; «Tilbake til mappen» nede til venstre, lenger ut mot kanten.
4. **Samlinger på stor skjerm:** todelt 30/70, søk og tekstene til venstre, mappene til høyre; dra og slipp + «Legg i mappe»-knapp.
5. **Arbeidsbordet grupperer etter Mappe** (se avgjørelsen over). Rører hovedbunken, `nesteSteg` og demotesten (steg 13b).

## Må sjekkes

- Venstrehendt-valget på øvekortene skal fortsatt virke med de nye knappene.
- Tilgjengelighetssjekken, demotesten og README-testen etter hver bolk; full vitest overskriver vurderingsark (se minnet).
- EXPERIENCE.md/DESIGN.md oppdateres der de beskriver forkunnskapsmerkene, øvekortknappene og arbeidsbordet.
- PRD: FR-6 (forkunnskap), FR-50–52 (mapper) og FR-35/41 (sperren) får endringene inn.
