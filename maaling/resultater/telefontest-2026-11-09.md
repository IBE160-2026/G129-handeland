# Telefontest: kjerneløypen i portrett (PRD §5 og §9.2)

Krav: «Kjerneløypen virker på telefon i portrettmodus», og leseinnstillingene og
tilgjengelighetskravene i §5 er «testet på telefon». Den automatiske sjekken
(`npm run sjekk:tilgjengelighet`) simulerer en telefon i Chrome. Denne testen er
den ekte.

**Telefon og nettleser:** ______________________  **Dato:** __________
**Adresse:** https://lesevenn.vercel.app

For hvert steg krysser du av for **Virker** (kom du videre uten hjelp?) og noterer
det som var **irriterende**: noe som var smått, gjemt, tregt, rart eller krevde
zoom. Skriv kort. Det trenger ikke være en feil for å være verdt å notere, for alt
her er også innspill til designfasen.

Bruk teksten i `testdata/eksempeltekst/em-egenskaper.txt` (send den til deg selv,
eller kopier fra GitHub på telefonen), og et bilde av en bokside hvis du har en.

---

## 1. Logg inn eller registrer

- Virker: X ja ☐ nei
- Irriterende:
- Hadde allerede bruker, så det gikk helt sømløst.
## 2. Lim inn tekst

Lim inn EM-teksten.

- Virker: X ja ☐ nei
- Irriterende:

## 3. Fotografer en bokside (bildeinnlesing, FR-44)

Ta bilde med kameraet. Prøv gjerne også et uskarpt bilde, og se om feilmeldingen
sier hva du skal gjøre.

- Virker: ☐ ja ☐ nei ☐ ikke testet
- Feilmeldingen var forståelig: ☐ ja ☐ nei ☐ ikke testet
- Irriterende:

## 4. Overskrifter og gjennomsyn

- Virker: X ja ☐ nei
- Irriterende: Litt irriterende info øverst. Kan dette gjøres mer kortfatet? 

## 5. Aktivering av forkunnskaper

- Virker: X ja ☐ nei
- Ventetid: viste appen hva den gjorde mens du ventet? [] ja X nei
- Irriterende: Opplevde ikke noe ventetid, så fikk heller ikke se noe. Men etter ogdkjenning av tekst, funket dette fint. 

## 5.5, Godkjenning av tekst
- Kan dette droppes? Jeg forstår at dette er med på å sikre kvalitet, men jeg tror de færreste elever vil lese gjennom, og hvertfall ikke rette (da må de jo ha oversikt over  den opprinnelige teksten), så da er det bare et kjedelig steg. Kunne vi "lagt inn" redigeringer på neste steg, slik at hvis de oppdager feil, så kan de rette dem, og så sendes teksten inn på ny?

## 6. Lesing med fagord markert

Trykk på et markert fagord.

- Forklaringen åpnet seg og var lett å lukke: X ja ☐ nei
- Teksten var lesbar uten zoom: X ja ☐ nei
- Ingen vannrett rulling: X ja ☐ nei
- Irriterende: Boksen som kom opp var litt vanskelig å se. Her kunne jeg både tenkt meg at den ble litt større, og kanskje hadde en annen bakgrunnsfarge, slik at det er tydelig at den er aktivert. 

## 7. Leseinnstillinger

Endre tekststørrelse og linjeavstand.

- Endringen ble synlig med en gang: X ja ☐ nei
- Ved største tekststørrelse: ingenting havnet utenfor skjermen: X ja ☐ nei
- Irriterende: Ikke så irriterende, men jeg tror jeg kunne ønsket meg at "ekstra stor" var enda litt større. Og ved "romslig", kunne jeg ønsket av avstanden mellom avsnittene ble enda større. En annen tanke er at "leseinnstillinger" kanskje ikke var så intuitivt, og når man kom langt ned på siden, så var det irriterende å scrolle opp. Kunne man da  ha hatt et brille-ikon som fulgte nedover siden (f.eks. oppe i høyre hjørne), som man kan trykke på underveis? 

## 8. Morsmål

Slå på et språk (gjerne ukrainsk, og arabisk for høyre-til-venstre).

- Virker: X ja ☐ nei
- Arabisk vises fra høyre mot venstre, og norsk står ved siden av: ☐ ja X nei ☐ ikke testet
- Irriterende: Ukrainsk fungerte, men hverken arabisk eller polsk kom opp når man trykket på ordene, de lå bare nederst. 
Ved siden av "velg morsmål", kan vi ha et norsk flagg by default, slik at det er enda lettere å oppdage. Er litt usikker på om det funket fra start. Kunne man også lagt inn at det gikk an å endre språk fra denne siden, at man ikke må på hjem-siden? Evt. får opp en alert-boks, med ekstrainfo, men at man likevel er på siden hele tiden. 
Ordforklaringen nederst: kan jeg få litt innrykk til forklaringene?

## 9. Quiz

- Virker: X ja ☐ nei
- Knappene var store nok å treffe: x ja ☐ nei
- Irriterende: Kan quizen lages automatisk når man trykker inn på quizen, ikke at man må bekrefte først at den skal lages. 
Jeg tror jeg ønsker at deres evaluering av kortsvar skal komme sammen resten av fasiten (husk da å oppdatere score hvis de huker av at det var riktig.)
Jeg ønsker også at "hvor det står i teksten", ikke skal stå som default på feilsvar, men være mulig å trigge som nedtrekks-knapp.

## 10. Øvekort

- Virker: X ja ☐ nei
- Irriterende: Her tror jeg ikke at jeg ønsker å ha "hvor det står i teksten" som at det står by default. Også her ønsker jeg det som et valg med knapp. 
Kunne vi testet  ut at forrige og neste (kanskje bare piler) står ved siden av hverandre, under bildet, og så kunne vi prøvd ut "dette kan jeg" og "må øve mer" på høyre side av kortet. 

## 11. Fagsamtale

Skriv ett godt svar og ett «vet ikke».

- Virker: X ja ☐ nei
- Tastaturet dekket ikke tekstfeltet eller knappen: [] Ja X nei (nei, ingenting ble dekket)
- Det sto at vurderingen er gjort av en språkmodell og kan ta feil: X ja ☐ nei
- Irriterende:Syns det visuelt var litt stygt med så mange bokser stablet oppå hverandre til å starte med: "vurderinger er gjort av en ...", "Spørsmål 1 ....", "Svaret ditt".


## 12. Minnevers

- Virker: X ja ☐ nei
- Irriterende: Teknisk virker det, men veldig lav verdi. Dårlige rim, tar lang tid, og lite faglig innhold i minneverset.

## 13. Tilbake og videre

Bruk telefonens tilbakeknapp et par steder, og lukk og åpne appen igjen.

- Kom tilbake der du var, uten å miste noe: X ja ☐ nei
- Irriterende:

---

## Helhetsinntrykk

- Ville du brukt dette på telefonen til lekser? [] ja ☐ nei x kanskje
- Det beste: Jeg syns markeringen og forklaring av fagbegrep var topp. 
- Det verste: minnevers
- Det jeg ville rettet først:

**Kjerneløypen virker på telefon i portrett:** x ja ☐ nei

---

## Sortering (Claude, 9.11)

**Resultat:** kjerneløypen virker på telefon i portrett (§5 og §9.2). Tastaturet dekket ingenting, og forbeholdet om språkmodellen står i fagsamtalen.

**Må avklares før M1**
1. Arabisk og polsk kom ikke opp i fagord-boksen, bare i lista nederst (steg 8). Boksen og lista leser samme oversettelse i koden, så mistanken er tidsforløp: oversettelsen lages etter at siden er tegnet, og ord man trykker på før den er ferdig, er uten. Testes på nytt. Er den der etter at oversettelsen er ferdig, er det et ventetidsproblem; er den ikke det, er det en bug.
2. Bildeinnlesing (FR-44) er ikke testet på telefon (steg 3).

**Til designfasen (20.–27.11)**
- Fagord-boksen: større, og tydelig bakgrunn når den er åpen (steg 6).
- Leseinnstillinger: større «ekstra stor», mer avsnittsavstand ved «romslig», og en flytende knapp (brille-ikon) så man slipper å rulle opp (steg 7).
- Morsmål: norsk som synlig standardvalg, bytte språk på samme side, innrykk i ordforklaringene nederst (steg 8).
- Overskrifter: kortere informasjon øverst (steg 4).
- Fagsamtalen: færre bokser stablet ved start (steg 11).
- Øvekort: forrige/neste som piler ved siden av hverandre, «dette kan jeg»/«må øve mer» til høyre (steg 10).

**Endrer krav eller flyt, må vurderes mot PRD-en først**
- Droppe godkjenningen av teksten og heller rette i neste steg (steg 5.5). Berører kravene om innlesing og «ingen stille forkorting».
- Quiz: lages uten å bekrefte først; vurderingen av kortsvar sammen med fasiten; «hvor det står i teksten» som knapp, ikke standard (steg 9). Samme for øvekort (steg 10).
- Minnevers: virker, men lav verdi (steg 12). Stemmer med åpent spørsmål 15 i PRD-en.
