/**
 * Feilformen i generatorlaget (§5 — ingen feiltilstand er en blindvei).
 *
 * Egen fil uten import, fordi visningene i nettleseren også trenger kodene og
 * `GeneratorFeil` (meldingene per funksjon, `app/kifeil.ts`), og ikke skal
 * dra med seg SDK-en og filsystemet fra `kontrakt.ts`. `kontrakt.ts`
 * eksporterer alt herfra videre, så generatorene importerer som før.
 */

export const FEILKODER = [
  "prompt_mangler",
  "ukjent_oppgave",
  "modellfeil",
  "ugyldig_utdata",
  "tidsavbrudd",
  "lagret_svar_mangler",
  /** Nøkkelen mangler, er utløpt, trukket tilbake, eller mangler rettighet. */
  "tilgang_avslaatt",
  /** Kvote eller takt overskredet. */
  "for_mange_kall",
  /**
   * 400, 404, 422: forespørselen er feil, og samme forespørsel gir samme svar
   * neste gang. En feil hos oss, ikke hos eleven.
   */
  "ugyldig_foresporsel",
] as const;

export type Feilkode = (typeof FEILKODER)[number];

/**
 * Alle feil fra generatorlaget har denne formen. Kravet i §5 om at ingen
 * feiltilstand er en blindvei håndheves dermed ett sted, framfor i hver flate
 * som kaller en generator.
 */
export class GeneratorFeil extends Error {
  readonly kode: Feilkode;
  readonly elevmelding: string;
  readonly anbefaltHandling: string;

  constructor(
    kode: Feilkode,
    elevmelding: string,
    anbefaltHandling: string,
    årsak?: unknown,
  ) {
    super(`${kode}: ${elevmelding}`);
    this.name = "GeneratorFeil";
    this.kode = kode;
    this.elevmelding = elevmelding;
    this.anbefaltHandling = anbefaltHandling;
    if (årsak instanceof Error) this.cause = årsak;
  }
}

/**
 * PRD §5: et kall som feiler, prøves én gang til før eleven får vite det.
 *
 * Bare feilene der et nytt kall kan gi et annet utfall. En avslått nøkkel
 * blir ikke bedre av å prøve igjen, 429 har SDK-ens egne forsøk (og et nytt
 * forsøk her ville bare forsterket presset), og en feil forespørsel, et
 * manglende oppsett eller et manglende lagret svar er det samme ved neste kall.
 */
const NYTT_FORSOEK: ReadonlySet<Feilkode> = new Set<Feilkode>(["ugyldig_utdata", "tidsavbrudd", "modellfeil"]);

/** Om feilen er en av dem `kjoerGenerator` prøver én gang til. Kallerne bruker den til meldingene per funksjon. */
export function kanProevesPaaNytt(kode: Feilkode): boolean {
  return NYTT_FORSOEK.has(kode);
}

/**
 * Teksten til feilene som ikke prøves på nytt. Brukes av `kontrakt.ts` når
 * den kaster, og av visningene når bare koden har kommet fram (en
 * omdirigering bærer koden, ikke meldingen).
 */
export const FASTE_TEKSTER: Record<
  Exclude<Feilkode, "ugyldig_utdata" | "tidsavbrudd" | "modellfeil">,
  { elevmelding: string; anbefaltHandling: string }
> = {
  prompt_mangler: {
    elevmelding: "LeseBuddy mangler oppsettet sitt for denne operasjonen.",
    anbefaltHandling: "Prøv igjen senere. Står det ved, er det en feil hos oss.",
  },
  ukjent_oppgave: {
    elevmelding: "LeseBuddy kjenner ikke denne operasjonen.",
    anbefaltHandling: "Dette er en feil hos oss. Prøv en annen funksjon i mellomtiden.",
  },
  lagret_svar_mangler: {
    elevmelding: "LeseBuddy kjører i testmodus, og det finnes ikke noe lagret svar for denne teksten.",
    anbefaltHandling:
      "Testmodus dekker bare eksempelteksten som ligger i repoet. Bruk den, " +
      "eller sett LESEVENN_TESTMODUS=av og legg inn en egen API-nøkkel for å " +
      "kjøre mot modellen.",
  },
  tilgang_avslaatt: {
    elevmelding: "LeseBuddy mangler tilgangen den trenger for å behandle teksten.",
    anbefaltHandling:
      "Dette er en feil hos oss, ikke noe du har gjort. Teksten din er " +
      "lagret, og du kan lese den videre uten markeringer mens vi retter det.",
  },
  for_mange_kall: {
    elevmelding: "LeseBuddy har for mye å gjøre akkurat nå.",
    anbefaltHandling: "Vent et minutt og prøv igjen. Teksten din er lagret.",
  },
  ugyldig_foresporsel: {
    elevmelding: "LeseBuddy fikk ikke sendt teksten til behandling.",
    anbefaltHandling: "Dette er en feil hos oss, ikke noe du har gjort. Teksten din er lagret.",
  },
};
