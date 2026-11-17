- source_spec: none
  summary: Quizen lages når eleven åpner den, kildeavsnittet ved feil svar tilbys med én knapp, og et avkrysset riktig kortsvar teller med i antall riktige (FR-13, FR-15, endret 11.11.2026).
  evidence: Delt fra flytendringene i commit 71500d7 etter scope-sjekken i bmad-build 12.11; kan leveres uavhengig av FR-3-endringen.
- source_spec: none
  summary: Kildeavsnittet på øvekortets bakside tilbys med én knapp i stedet for å vises (FR-16, endret 11.11.2026).
  evidence: Delt fra flytendringene i commit 71500d7 etter scope-sjekken i bmad-build 12.11; deler knappen med quiz-endringen, men kan leveres alene.
- source_spec: `_bmad-output/implementation-artifacts/spec-fr-3-innlimt-tekst-uten-gjennomsyn.md`
  summary: Enhetstest av lagreAktivering for innlimt tekst (vellykket låsing, feilet låsing, feilet generering).
  evidence: Gjennomgangen 12.11; grenen dekkes bare av demotesten i dag.
  resolved: cee7f82 (16.11) — tre tester i app/handlinger.test.ts (låst og fagord lagret, låsingen feiler, genereringen feiler).
- source_spec: `_bmad-output/implementation-artifacts/spec-fr-3-innlimt-tekst-uten-gjennomsyn.md`
  summary: PRD-en linje 112 («ender på samme sted — et redigerbart gjennomsyn») og 899 («Liming av tekst, med gjennomsyn og retting») må samsvare med FR-3 slik den ble endret 11.11.
  evidence: Gjennomgangen 12.11; motsier FR-3 linje 154.
- source_spec: `_bmad-output/implementation-artifacts/spec-fr-13-15-quizflyt.md`
  summary: Tilgjengelighetssjekken (axe) må nå gjennomsynet via PDF eller bilde, siden innlimt tekst ikke lenger går dit (FR-3).
  evidence: Gjennomgangen 12.11; axe-sjekken av gjennomsynet ble fjernet fra sjekk-tilgjengelighet.mjs da innlimt tekst sluttet å gå via siden.
  resolved: cee7f82 (16.11) — sjekk-tilgjengelighet.mjs legger en PDF- og en bildetekst i tilstand aktivert rett i databasen og kjører axe på gjennomsynet i lys og mørk modus.

- source_spec: `_bmad-output/implementation-artifacts/spec-design-1-identitet-og-tenkeindikator.md`
  summary: Favicon har ingen PNG/ICO-reserve og ingen apple-icon (bare app/icon.svg).
  evidence: favicon.ico ble slettet i bolk 1; eldre Safari og iOS-hjemskjerm viser da ikke ikon.
  resolved: cee7f82 (16.11) — app/icon1.tsx (32 px) og app/apple-icon.tsx (180 px) lager B-merket som PNG med ImageResponse; icon.svg står som før.
- source_spec: `_bmad-output/implementation-artifacts/spec-design-1-identitet-og-tenkeindikator.md`
  summary: Knappesystemet mangler fare- og lenkevariant; --lb-fare/--lb-fareflate er ubrukt, og små knapper (Slett for godt, Kopier, Lagre i Morsmaal, LITEN i Overskriftskontroll) er under 44 px.
  evidence: Blind-gjennomgangen av bolk 1; DESIGN.md krever 44 px trykkflate og danger-message-komponenten.
  resolved: cee7f82 (16.11) — KNAPP_FARE og KNAPP_LENKE i knapper.ts; Slett for godt, Avbryt, Kopier, Lagre i Morsmaal og LITEN er minst 44 px, og red-* er byttet mot fare-tokenene.
- source_spec: `_bmad-output/implementation-artifacts/spec-design-2-arbeidsbord-og-samling.md`
  summary: Hentefeil-tilstanden på / og /samling (og at tilgang() står utenfor try) har ingen test.
  evidence: Medium, ikke verifisert; krever enten servertest i vitest eller simulert databasefeil i e2e-skriptene.
  resolved: cee7f82 (16.11) — app/hentefeil.test.ts: Hentefeil når hentArbeidsbord kaster, landingssiden og omdirigeringen (ikke Hentefeil) uten innlogging.
- source_spec: `_bmad-output/implementation-artifacts/spec-design-3-landingsside.md`
  summary: /logg-inn og /registrer kaller innloggetEpost() uten vakt, så de gir 500 når øktoppslaget feiler, mens / nå viser landingssiden.
  evidence: Edge-case-gjennomgangen av bolk 3; innloggetEpost i data/konto.ts har ingen try/unstable_rethrow.
  resolved: cee7f82 (16.11) — innloggetEpost har samme vakt som valgfriTilgang og gir null ved feil; fire tester i data/konto.test.ts.
- source_spec: `_bmad-output/implementation-artifacts/spec-design-4-mobilfeil-og-temavalg.md`
  summary: Tema-kapselen (lys/mørk) slettes ikke ved utlogging, så neste elev på en delt PC arver valget på landingssiden.
  evidence: Blind-gjennomgangen av bolk 4; utloggingen går via authKlient.signOut i klienten, og kapselen er httpOnly.
  resolved: cee7f82 (16.11) — slettTemaHandling sletter kapselen etter signOut og etter sletting av kontoen.
- source_spec: `_bmad-output/implementation-artifacts/spec-design-6-mobilflater.md`
  summary: Rotasjon over 760 px på landingssiden og arbeidsbordet (DOM-bytte span/knapp, maalA-kappløp, arket animeres på nytt) er ikke sjekket.
  evidence: Verification-gap- og blind-gjennomgangen av bolk 6; alle sjekker åpner en fersk kontekst med fast bredde.
  resolved: cee7f82 (16.11) — sjekken endrer bredden 375 → 1280 → 375 px på landingssiden og på arbeidsbordet med arket åpent; ingen feil funnet, ingen kode måtte rettes.
- source_spec: `_bmad-output/implementation-artifacts/spec-ki-feil-nytt-forsoek.md`
  summary: Regelene for hva samtalesiden viser (vurderingFeilet, oppfolgingFeilet, RevurderKnapp) står inne i siden og er ikke testet; en vurdering som pågår, vises som «feilet» ved ny innlasting.
  evidence: Gjennomgangen av KI-feil-bolken; trekk ut en ren funksjon over Runde[] og test den, og vurder et tidsstempel for når svaret ble lagret.
  resolved: cee7f82 (16.11) — samtalevisning() i data/samtalevisning.ts med enhetstester, og siden bruker den. Tidsstempelet for en vurdering som pågår, er ikke laget (krever migrering).
- source_spec: `_bmad-output/implementation-artifacts/spec-bruksgrenser.md`
  summary: Grensetestene dekker ikke limInnPdf/limInnBilde direkte, og at sidene sender konto til nesteSteg/kortstatus er ikke testet.
  evidence: Verification-gap-gjennomgangen av bruksgrensene; hjelperen opprettEllerGrense er testet via limInnTekst.
  resolved: cee7f82 (16.11) — limInnPdf og limInnBilde gir GRENSE_FEIL.tekster ved sjette tekst. At sidene sender konto til nesteSteg/kortstatus, er fortsatt ikke testet.
- source_spec: none
  summary: Tenkeindikatorens avslutning (briller → B) spilles bare ved quizrettingen; etter navigering eller refresh forsvinner indikatoren uten avslutning, i strid med EXPERIENCE.md.
  evidence: Delt ut fra forkunnskapsbolken 17.11 (to uavhengige mål). Utviklerens telefontest 17.11 så avslutningen bare i quizen. Bygges som neste bolk.
- source_spec: `_bmad-output/implementation-artifacts/spec-fr-6-forkunnskap-merk-og-lurer-paa.md`
  summary: Delen «Før du leste» i lesevisningen viser overskriftene bare på norsk, selv om aktiveringen viste dem med morsmålslinje (FR-26).
  evidence: Blind-gjennomgangen av FR-6-bolken 17.11; overskriftsoversettelsen finnes alt (elementet «overskrifter»), så den kan trolig gjenbrukes.
