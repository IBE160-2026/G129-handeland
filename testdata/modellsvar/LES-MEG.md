# Lagrede modellsvar

Svar fra spraakmodellen, lagret som filer. Testmodus (`LESEVENN_TESTMODUS=les`)
leser herfra i stedet for aa kalle modellen, slik at appen kan kjores uten
API-noekkel og uten kostnad. Se `generatorer/lagretsvar.ts` og AD-18.

Filnavnet er et hashsammendrag av oppgave, promptversjon og den fulle teksten
som ble sendt inn. Det betyr at filene ikke er leselige paa navnet alene -
feltet `utdrag` inne i hver fil sier hvilken tekst den hoerer til.

**Slik lages en fil:** kjor loeypen med `LESEVENN_TESTMODUS=skriv` og en ekte
API-noekkel. Svaret havner her. Commit det.

**Naar promptversjonen endres** blir de gamle filene ikke lenger funnet, fordi
versjonen er med i noekkelen. Det er med vilje: et svar lagret under v1 er ikke
dokumentasjon paa hva v2 gjoer. Lag dem paa nytt med `=skriv`.

Filene er en del av leveransen og skal commites. De er ikke testdata i
betydningen "kan slettes".
