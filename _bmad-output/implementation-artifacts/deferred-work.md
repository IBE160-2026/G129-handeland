- source_spec: none
  summary: Quizen lages når eleven åpner den, kildeavsnittet ved feil svar tilbys med én knapp, og et avkrysset riktig kortsvar teller med i antall riktige (FR-13, FR-15, endret 11.11.2026).
  evidence: Delt fra flytendringene i commit 71500d7 etter scope-sjekken i bmad-build 12.11; kan leveres uavhengig av FR-3-endringen.
- source_spec: none
  summary: Kildeavsnittet på øvekortets bakside tilbys med én knapp i stedet for å vises (FR-16, endret 11.11.2026).
  evidence: Delt fra flytendringene i commit 71500d7 etter scope-sjekken i bmad-build 12.11; deler knappen med quiz-endringen, men kan leveres alene.
- source_spec: `_bmad-output/implementation-artifacts/spec-fr-3-innlimt-tekst-uten-gjennomsyn.md`
  summary: Enhetstest av lagreAktivering for innlimt tekst (vellykket låsing, feilet låsing, feilet generering).
  evidence: Gjennomgangen 12.11; grenen dekkes bare av demotesten i dag.
- source_spec: `_bmad-output/implementation-artifacts/spec-fr-3-innlimt-tekst-uten-gjennomsyn.md`
  summary: PRD-en linje 112 («ender på samme sted — et redigerbart gjennomsyn») og 899 («Liming av tekst, med gjennomsyn og retting») må samsvare med FR-3 slik den ble endret 11.11.
  evidence: Gjennomgangen 12.11; motsier FR-3 linje 154.
- source_spec: `_bmad-output/implementation-artifacts/spec-fr-13-15-quizflyt.md`
  summary: Tilgjengelighetssjekken (axe) må nå gjennomsynet via PDF eller bilde, siden innlimt tekst ikke lenger går dit (FR-3).
  evidence: Gjennomgangen 12.11; axe-sjekken av gjennomsynet ble fjernet fra sjekk-tilgjengelighet.mjs da innlimt tekst sluttet å gå via siden.
