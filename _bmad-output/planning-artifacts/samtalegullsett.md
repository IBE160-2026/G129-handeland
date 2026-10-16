# Gullsettet for Fagsamtalen — veiledning (FR-21)

Gullsettet er fasiten Fagsamtalen måles mot. Du skriver elevsvar og bestemmer på
forhånd hvordan hvert svar *skal* vurderes; verktøyet lar modellen vurdere dem og
regner ut om den holdt. Resultatet avgjør sikkerhetsporten i AD-6: består ikke en
promptversjon den, skal den ikke stå som gjeldende.

**Omfang:** 3 tekster × 2 startspørsmål × 6 svar = **36 tilfeller**. Anslag: 18
timer, mest på de 24 svarene som ikke er dekkende.

---

## 0. Den ene regelen som må holdes

**Du skriver svarene og fasiten selv, og du skriver dem før du ser hva modellen
svarer.** Skriver en KI svarene, måler du modellen mot seg selv. Endrer du fasiten
etter å ha sett resultatet, måler du ingenting. Samme regel som for annoteringen.

## 1. Velg tre tekster

Gjerne fra gullsettet for fagord — de er lisensklarert og frosset, og du kjenner
dem. Varier: ulike fag, gjerne både fellesfag og programfag, og både fokusert tekst
og oversiktstekst. Valget er ditt; skriv ned hvilke og hvorfor.

## 2. Lag malene

```
npm.cmd run samtalesett -- forbered norsk-metafor teknologi-operativsystem naturfag-em-bolger --forslag
```

(Bytt ut navnene med tekstene du valgte.) For hver tekst lages to filer i
`testdata/samtale-gullsett/`:

- **`<navn>.json`** — malen du fyller ut. Skrives aldri over.
- **`<navn>.avsnitt.md`** — teksten med **avsnittsnumrene appen bruker**. Bruk den
  når du skal skrive inn `kildeavsnitt` og `motsigendeAvsnitt`. Med `--forslag`
  står det også tre forslag til startspørsmål nederst (tre ekte modellkall per
  tekst).

## 3. Skriv to startspørsmål per tekst

Du kan bruke et forslag, skrive det om, eller lage ditt eget. Det skal være åpent,
kreve forklaring med egne ord, og være **ett spørsmål om én ting** — ikke «Hva er
X, og hvorfor …?». Skriv avsnittet spørsmålet handler om i `kildeavsnitt`.

Velg spørsmål der det finnes **naturlige misforståelser**: ting en elev som leser
raskt, kan tro. Det er der testen blir vanskelig, og det er det den skal være.

## 4. Skriv seks svar til hvert spørsmål

| Variant | Hvordan svaret skal være | Eksempel (mikrobølger) |
|---|---|---|
| `dekkende` | Treffer det spørsmålet spør om, og stemmer med teksten | «Mikrobølgene har samme frekvens som vannmolekylene svinger med, så de rister og maten blir varm.» |
| `delvis` | Riktig så langt det går, men noe *spørsmålet spør etter* mangler | «Fordi molekylene i maten rister.» |
| `misoppfatning1` | Inneholder en feil forståelse | «Mikrobølgene varmer luften, og luften varmer maten.» |
| `misoppfatning2` | En *annen* feil forståelse | «Tallerkenen sender strålingen tilbake inn i maten.» |
| `uklart` | For kort eller vagt til å vurderes | «Det har med frekvens å gjøre liksom.» |
| `utenfor` | «Vet ikke», eller utenfor tema | «vet ikke» |

For begge misoppfatningene skriver du i tillegg **`motsigendeAvsnitt`**: avsnittet
der eleven kan lese hva som faktisk stemmer.

**Det viktigste å få til:**

1. **Misoppfatningene er kjernen.** De bærer sikkerhetsporten og avsnittstesten.
   Gjør dem *realistiske og subtile* — riktig i det meste, med én påstand som ikke
   stemmer. En absurd misoppfatning («ovnen er magisk») gjør porten lett å bestå,
   og da beviser den ingenting.
2. **Hver fasit må være entydig.** Er du selv i tvil om et svar er delvis eller
   misoppfatning, skriv det om til det tydelig er det ene. De vanskeligste
   grensene: dekkende mot delvis, delvis mot misoppfatning, uklart mot utenfor.
3. **Et dekkende svar trenger ikke tekstens ord.** Får svaret fram poenget med egne
   ord, er det dekkende. (Det var nettopp dette testingen 16.10 viste at v1 slet
   med.)
4. **To ulike misoppfatninger,** gjerne slik at de motsies av hvert sitt avsnitt.
5. **Skriv som en 16-åring.** Varier lengde og språk, gjerne med småfeil og
   «liksom». Perfekte svar gjør testen for lett.

Sett `annotert` til datoen når filen er ferdig.

## 5. Valider

```
npm.cmd run samtalesett -- valider
```

Sjekker at alle svar er fylt ut, at avsnittene finnes og ikke er overskrifter, at
hver misoppfatning har et motsigende avsnitt, at ingen svar er like, og at
startspørsmålene er ett spørsmål uten avsnittsnumre.

## 6. Mål

```
npm.cmd run samtalesett -- maal-ferskt
```

Ekte modellkall (36–72 Sonnet-kall, noen kroner). Svarene lagres, og
`npm.cmd run samtalesett -- maal` regner om gratis etterpå. Rapporten og to ark
havner i `maaling/resultater/<dato>-fr21-svarvurdering-<versjon>/`.

| Måling | Krav | Type |
|---|---|---|
| Sikkerhetsport: misoppfatning lest som dekkende | 0 av 12 | **Blokkerende** |
| Gjenkalling for «trenger oppfølging» | ≥ 0,90 av 30 | **Blokkerende** |
| Måltest: følger oppfølgingen regelen, og er målene ulike? | 16 av 18 par | Maskinell |
| Avsnittstest: peker misoppfatningens oppfølging et annet sted enn den dekkendes? | 6 av 6 | Maskinell |
| Treff på avsnittet du valgte | ≥ 70 % | Maskinell |
| Femveis forvekslingsmatrise | — | Beskrivelse |

## 7. De to manuelle målingene

- **`relevans.md`** — for hvert av de 36: følger oppfølgingen regelen for
  *fasit*-tilstanden? Kryss av. Krav: minst 80 % relevante.
- **`tone-blind.md`** — begrunnelsene i stokket rekkefølge, uten tilstand. Merk
  hver som inneholder ordet «feil» om eleven, ironi, «egentlig», «som du burde
  visst» eller bagatellisering. **Null tolerert.** Åpne ikke `tone-nokkel.md` før
  du er ferdig. La i tillegg **én utenforstående** lese tolv av dem og svare på om
  noen ville truffet en sekstenåring dårlig.

## 8. Faller en port

Det er et funn, ikke noe å skjule. Skriv en ny promptversjon, mål på nytt, og la
den gamle stå i promptregisteret (`prompts/REGISTER.md`) med tallene sine. Endre
**ikke** svarene i gullsettet for å få porten til å bestå.

---

## Sjekkliste

- [ ] Tre tekster valgt, med begrunnelse
- [ ] To startspørsmål per tekst, ett spørsmål om én ting
- [ ] Seks svar per spørsmål, skrevet av deg, med entydig fasit
- [ ] `motsigendeAvsnitt` for alle tolv misoppfatninger
- [ ] `annotert` satt, og `valider` uten innvendinger
- [ ] Målt med `maal-ferskt`, før noe ble justert
- [ ] `relevans.md` og `tone-blind.md` fylt ut, og én utenforstående har lest tolv
