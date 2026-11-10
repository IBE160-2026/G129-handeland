# Bildeinnlesing på telefon (FR-44, FR-45, M1)

FR-45 sier at bildeuttrekket er **umålt**: det finnes ingen terskel for hvor godt
teksten leses. Denne testen måler altså ikke kvaliteten. Den sjekker at
funksjonen **virker på en ekte telefon**, og at de fem navngitte feiltilstandene
(BF-1 til BF-5) sier hva som skjedde og hva eleven kan gjøre.

**Telefon og nettleser:** ______________________  **Dato:** __________
**Adresse:** https://lesevenn.vercel.app

**Ha klart:** en lærebok eller annen bok med vanlig tekst, en side med lite
tekst (en overskrift eller ett kort avsnitt), og fem sider du kan fotografere.

Det som allerede er dekket av automatiske tester (`opplasting/bilde.test.ts`):
BF-1, BF-2, BF-3 og BF-5 i koden, krymping og at metadata fjernes. Her tester
du det koden ikke kan: kameraet, telefonens bildeformat og hvordan det oppleves.

---

## Del 1: Det vanlige løpet

### 1. Ett bilde, rett fra kameraet

Velg bildeinnlesing, og ta bilde av en vanlig bokside.

- Påminnelsen om å fotografere bare den siden du trenger, kom før opplastingen: ☐ ja ☐ nei
- Kameraet åpnet seg (eller du fikk velge kamera eller bildegalleri): ☐ ja ☐ nei
- Appen viste framdrift mens teksten ble lest: ☐ ja ☐ nei
- Merknaden om at teksten er lest fra et bilde og bør leses nøye, sto i gjennomsynet (FR-45): ☐ ja ☐ nei
- Omtrent hvor mye av teksten ble riktig? ☐ nesten alt ☐ det meste ☐ mye feil
- Irriterende:

### 2. Bildeformatet på telefonen

iPhone lagrer ofte bilder som HEIC. Appen skal godta JPEG, PNG og HEIC.

- Telefonen er: ☐ iPhone ☐ Android
- Et bilde fra **bildegalleriet** (ikke tatt nå) ble godtatt: ☐ ja ☐ nei
- Irriterende:

### 3. Flere sider, og rekkefølgen

Last opp 2–3 bilder av sider som henger sammen, og bytt rekkefølgen før uttrekket.

- Du kunne endre rekkefølgen: ☐ ja ☐ nei
- Teksten kom i riktig rekkefølge etterpå: ☐ ja ☐ nei
- Framdrift per bilde: ☐ ja ☐ nei
- Irriterende:

### 4. Videre i løypen

Godkjenn gjennomsynet og gå til aktiveringen.

- Teksten fra bildet gikk videre som en vanlig tekst (overskrifter, aktivering, lesing): ☐ ja ☐ nei
- Irriterende:

---

## Del 2: Feiltilstandene

For hver: **sa meldingen hva som skjedde**, og **hva du kunne gjøre**?

### BF-1. Ingen tekst i bildet

Ta bilde av en vegg, et gulv eller en tom side.

- Meldingen sa at det ikke ble funnet tekst: ☐ ja ☐ nei
- Den foreslo nytt bilde i bedre lys, eller å lime inn teksten: ☐ ja ☐ nei
- Ordlyden:

### BF-2. For mange bilder

Velg **fem** bilder (grensen er fire).

- Meldingen oppga hvor mange du valgte, og hva grensen er: ☐ ja ☐ nei
- Den sa hva du kan gjøre: ☐ ja ☐ nei
- Ordlyden:

### BF-3. Filformat som ikke støttes

Prøv en fil som ikke er et bilde, eller et format som GIF eller WebP (for
eksempel en GIF fra en melding, eller en PDF fra Filer). Er det vanskelig å
finne på telefonen, gjør denne på PC-en.

- Meldingen oppga formatet, og hvilke formater som virker: ☐ ja ☐ nei ☐ ikke testet
- Ordlyden:

### BF-4. Svært lite tekst

Ta bilde av en side med bare en overskrift eller ett kort avsnitt.

- Gjennomsynet ble vist likevel, så du kunne skrive inn resten selv: ☐ ja ☐ nei
- Det sto at teksten var kort: ☐ ja ☐ nei
- Ordlyden:

### BF-5. Tidsavbrudd eller nettverksfeil

Last opp et bilde, og slå på **flymodus** med en gang uttrekket har startet. Slå
flymodus av igjen etterpå.

- Det kom en melding med en «prøv igjen»-knapp: ☐ ja ☐ nei ☐ fikk ikke til
- Bildet var der fortsatt, så du slapp å ta det på nytt: ☐ ja ☐ nei ☐ fikk ikke til
- «Prøv igjen» virket da nettet var tilbake: ☐ ja ☐ nei ☐ fikk ikke til
- Ordlyden:

---

## Helhetsinntrykk

- Ville en elev med papirbok klart seg med dette? ☐ ja ☐ nei ☐ kanskje
- Det beste:
- Det verste:

**Bildeinnlesingen virker på telefon:** ☐ ja ☐ nei
**Alle feiltilstandene jeg fikk testet, sa hva som skjedde og hva jeg kunne gjøre:** ☐ ja ☐ nei

---

## Resultat (utviklerens svar i chat 10.11, ført inn av Claude)

**Del 1:** alle fire steg virket. Påminnelse, kamera, framdrift og FR-45-merknaden
var der (1), bilde fra galleriet ble godtatt (2), rekkefølgen kunne endres og ble
riktig (3), og teksten gikk videre i løypen (4).

**Del 2:**
- **BF-1:** god feilmelding.
- **BF-2:** virket.
- **BF-3:** ikke testet. Bildevelgeren tillater bare JPEG, PNG og HEIC, så på
  telefon kan man ikke velge feil format; nettleseren stopper det før appen.
  Dekket av `opplasting/bilde.test.ts`. Kan prøves på PC ved å velge «Alle filer»
  i fildialogen.
- **BF-4:** ett ord ga en feilmelding. En overskrift og ett kort avsnitt gikk
  videre, men tok lang tid før det stoppet senere i løypen. Hvor og med hvilken
  melding er ikke avklart; koden stopper ikke kort tekst fra bilder (FR-44 sier
  at gjennomsynet skal vises likevel), så stoppet kommer et annet sted.
- **BF-5:** virket.

**Bildeinnlesingen virker på telefon:** ja.

**Innspill til designfasen fra samme test:** tydeligere ventegrafikk (gjerne
animasjon), fagsamtalen som dialog med KI-en til venstre og eleven til høyre,
«Mine tekster» som egen side ved siden av «Hjem» på mobil. Oppsummeringen etter
fagsamtalen (for mye tekst før «Ingen svar ble vurdert som dekkende») er rettet
samme dag.
