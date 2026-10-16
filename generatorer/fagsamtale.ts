/**
 * Fagsamtalen — FR-18, FR-19, FR-20.
 *
 * To generatorer:
 *
 *   - `startSamtale` stiller det første spørsmålet (FR-18).
 *   - `vurderSvar` klassifiserer elevens svar i én av fem tilstander med én
 *     setnings begrunnelse (FR-19), og stiller neste spørsmål etter
 *     tilstandens regel, med `kildeavsnitt` og `maal` som strukturerte felt
 *     (FR-20).
 *
 * ## Hva koden sjekker, og hva den ikke kan
 *
 * Kravene i FR-20 som kan sjekkes maskinelt, sjekkes her ved hvert kall, i
 * to nivåer (AD-11):
 *
 *   - **Harde brudd** gjør runden ubrukelig: `maal` stemmer ikke med
 *     tilstanden, ugyldig kildeavsnitt, flere enn ett spørsmål, ord FR-23
 *     forbyr. Ett nytt forsøk; feiler også det, sier generatoren fra.
 *   - **Myke brudd** gjør oppfølgingen svakere, men ikke gal: den bruker
 *     ingen ord eleven innførte, eller ligner et tidligere spørsmål for mye.
 *     Ett nytt forsøk; ellers brukes det beste av de to, og bruddene
 *     rapporteres.
 *
 * Det koden IKKE kan sjekke, er om vurderingen er riktig. Det er FR-21, og
 * det måles mot et Gullsett på 36 tilfeller i M1. Til da er promptversjonen
 * umålt (se `_om_fagsamtale` i prompts/gjeldende.json).
 */

import { z } from "zod";
import { brukerNoenAv, innfortAvEleven, innholdsord, jaccard } from "../tekst/innholdsord";
import type { Avsnitt } from "../tekst/avsnittsdeling";
import { GeneratorFeil, formaterAvsnitt, kjoerGenerator } from "./kontrakt";

export const TILSTANDER = ["dekkende", "delvis", "misoppfatning", "uklart", "utenfor"] as const;
export type Tilstand = (typeof TILSTANDER)[number];

export const MAAL = [
  "nytt_aspekt",
  "peker_mot_manglende",
  "motsigende_avsnitt",
  "ber_om_utdyping",
  "deler_opp",
] as const;
export type Maal = (typeof MAAL)[number];

/** FR-19: hver tilstand har sin regel for neste spørsmål. */
export const MAAL_FOR: Record<Tilstand, Maal> = {
  dekkende: "nytt_aspekt",
  delvis: "peker_mot_manglende",
  misoppfatning: "motsigende_avsnitt",
  uklart: "ber_om_utdyping",
  utenfor: "deler_opp",
};

/** FR-22. */
export const MAKS_RUNDER = 6;
/** FR-20: «ingen gjentakelse» er Jaccard under denne grensen. */
export const MAKS_OVERLAPP = 0.6;

/* ------------------------------------------------------------------ *
 * Skjemaene
 * ------------------------------------------------------------------ */

export const StartSkjema = z.object({
  sporsmal: z.string().describe("Det første spørsmålet. Åpent, krever forklaring, ett spørsmål."),
  kildeavsnitt: z.number().int().describe("Avsnittet spørsmålet handler om. Aldri en overskrift."),
});

export const VurderingSkjema = z.object({
  tilstand: z.enum(TILSTANDER),
  begrunnelse: z.string().describe("Én setning til eleven. Aldri ordet «feil»."),
  oppfolging: z
    .object({
      sporsmal: z.string(),
      kildeavsnitt: z.number().int(),
      maal: z.enum(MAAL),
    })
    .nullable()
    .describe("Neste spørsmål. null bare i siste runde."),
});

type Vurderingsutkast = z.infer<typeof VurderingSkjema>;

/* ------------------------------------------------------------------ *
 * Sjekkene — rene funksjoner, testet hver for seg
 * ------------------------------------------------------------------ */

/** FR-23: ord som ikke skal brukes om eleven. Nedskrevet, slik kravet sier. */
export const FORBUDT = [/\bfeil\b/i, /\begentlig\b/i, /\bburde\s+(visst|vite|forstått|skjønt|kunne)\b/i];

/** FR-20: ett spørsmål. Telles som spørsmålstegn. */
export function antallSporsmal(tekst: string): number {
  return (tekst.match(/\?/g) ?? []).length;
}

function sjekkAvsnitt(nummer: number, avsnitt: Avsnitt[]): string | null {
  const a = avsnitt.find((x) => x.nummer === nummer);
  if (!a) return `kildeavsnitt ${nummer} finnes ikke i teksten`;
  if (a.erOverskrift) return `kildeavsnitt ${nummer} er en overskrift`;
  return null;
}

/**
 * FR-20, «ett spørsmål»: to spørsmål bundet sammen med «og»/«eller» og et
 * spørreord har ett spørsmålstegn, men er to spørsmål. Funnet i testing
 * 16.10: «Hva er forskjellen på renter og avdrag, og hvorfor må man betale
 * begge deler?» — eleven svarte på det første og ble vurdert som delvis fordi
 * det andre manglet.
 */
export const SAMMENBUNDET = /\b(og|eller)\s+(hva|hvorfor|hvordan|hvilken|hvilket|hvilke|hvem|hvor|når)\b/i;

/** Eleven ser ikke avsnittsnumre. «Les avsnitt 7» peker på noe hun ikke finner. */
export const AVSNITTSNUMMER = /\bavsnitt(et)?\s+(nr\.?\s*)?\d+/i;

export function bruddPaaStart(
  s: z.infer<typeof StartSkjema>,
  avsnitt: Avsnitt[],
): { harde: string[]; myke: string[] } {
  const harde: string[] = [];
  const myke: string[] = [];
  if (s.sporsmal.trim().length === 0) harde.push("tomt spørsmål");
  if (antallSporsmal(s.sporsmal) !== 1) harde.push(`${antallSporsmal(s.sporsmal)} spørsmålstegn, ikke ett`);
  const a = sjekkAvsnitt(s.kildeavsnitt, avsnitt);
  if (a) harde.push(a);
  if (SAMMENBUNDET.test(s.sporsmal)) myke.push("to spørsmål bundet sammen med «og/eller»");
  if (AVSNITTSNUMMER.test(s.sporsmal)) myke.push("viser til et avsnittsnummer eleven ikke ser");
  return { harde, myke };
}

export type Kontekst = {
  avsnitt: Avsnitt[];
  /** Alle spørsmål som er stilt i samtalen, også det eleven nettopp svarte på. */
  stilteSporsmal: string[];
  /** Spørsmålet eleven svarte på. */
  sporsmal: string;
  elevsvar: string;
  sisteRunde: boolean;
};

export function bruddPaaVurdering(
  v: Vurderingsutkast,
  k: Kontekst,
): { harde: string[]; myke: string[] } {
  const harde: string[] = [];
  const myke: string[] = [];

  if (v.begrunnelse.trim().length === 0) harde.push("tom begrunnelse");
  for (const m of FORBUDT) if (m.test(v.begrunnelse)) harde.push(`begrunnelsen bruker «${m.source}»`);

  if (k.sisteRunde) return { harde, myke }; // oppfølgingen brukes ikke

  const o = v.oppfolging;
  if (!o) {
    harde.push("mangler oppfølging");
    return { harde, myke };
  }
  if (o.maal !== MAAL_FOR[v.tilstand]) {
    harde.push(`maal «${o.maal}» følger ikke tilstanden «${v.tilstand}» (skal være «${MAAL_FOR[v.tilstand]}»)`);
  }
  if (antallSporsmal(o.sporsmal) !== 1) harde.push(`${antallSporsmal(o.sporsmal)} spørsmålstegn i oppfølgingen, ikke ett`);
  const a = sjekkAvsnitt(o.kildeavsnitt, k.avsnitt);
  if (a) harde.push(a);
  for (const m of FORBUDT) if (m.test(o.sporsmal)) harde.push(`oppfølgingen bruker «${m.source}»`);
  if (SAMMENBUNDET.test(o.sporsmal)) myke.push("to spørsmål bundet sammen med «og/eller»");
  if (AVSNITTSNUMMER.test(o.sporsmal) || AVSNITTSNUMMER.test(v.begrunnelse)) {
    myke.push("viser til et avsnittsnummer eleven ikke ser");
  }

  // Sporbarhet: gjelder bare når eleven faktisk innførte noe.
  const innfort = innfortAvEleven(k.elevsvar, k.sporsmal);
  if (innfort.size > 0) {
    if (!brukerNoenAv(o.sporsmal, innfort)) {
      myke.push("oppfølgingen bruker ingen ord eleven selv innførte");
    }
  }

  // Ingen gjentakelse.
  const ny = innholdsord(o.sporsmal);
  for (const tidligere of k.stilteSporsmal) {
    const overlapp = jaccard(ny, innholdsord(tidligere));
    if (overlapp >= MAKS_OVERLAPP) {
      myke.push(`oppfølgingen ligner et tidligere spørsmål (overlapp ${overlapp.toFixed(2)})`);
      break;
    }
  }

  return { harde, myke };
}

/* ------------------------------------------------------------------ *
 * Meldingene
 * ------------------------------------------------------------------ */

export type TidligereRunde = {
  nummer: number;
  sporsmal: string;
  kildeavsnittNummer: number;
  elevsvar: string;
  tilstand: Tilstand;
  begrunnelse: string;
};

/**
 * Elevens svar kan ikke lukke markøren selv. Uten dette kunne et svar som
 * inneholder «ELEVSVAR>>>» etterfulgt av tekst, se ut som noe utenfor svaret.
 */
function vask(svar: string): string {
  return svar.replace(/<<<ELEVSVAR|ELEVSVAR>>>/g, "");
}

export function formaterVurdering(
  avsnitt: Avsnitt[],
  tidligere: TidligereRunde[],
  gjeldende: { sporsmal: string; kildeavsnittNummer: number },
  elevsvar: string,
  valg: { sisteRunde: boolean; nyVurdering: boolean },
): string {
  const deler = [`# Teksten\n\n${formaterAvsnitt(avsnitt)}`];

  deler.push(
    tidligere.length === 0
      ? "# Samtalen så langt\n\nDette er første svar i samtalen."
      : "# Samtalen så langt\n\n" +
          tidligere
            .map(
              (r) =>
                `Runde ${r.nummer} (avsnitt ${r.kildeavsnittNummer})\nSpørsmål: ${r.sporsmal}\n` +
                `Svar: ${vask(r.elevsvar)}\nVurdering: ${r.tilstand} — ${r.begrunnelse}`,
            )
            .join("\n\n"),
  );

  deler.push(
    `# Spørsmålet eleven svarte på (avsnitt ${gjeldende.kildeavsnittNummer})\n\n${gjeldende.sporsmal}`,
  );
  deler.push(`# Elevens svar\n\n<<<ELEVSVAR\n${vask(elevsvar)}\nELEVSVAR>>>`);

  const merknader: string[] = [];
  if (valg.sisteRunde) merknader.push("Dette er siste runde. Vurder svaret, og la `oppfolging` være null.");
  if (valg.nyVurdering) {
    merknader.push("Eleven har bedt om ny vurdering fordi hun mener vurderingen misforsto svaret.");
  }
  if (merknader.length > 0) deler.push(`# Merknad\n\n${merknader.join("\n")}`);

  return deler.join("\n\n");
}

/* ------------------------------------------------------------------ *
 * Generatorene
 * ------------------------------------------------------------------ */

/**
 * Et ekstra forsøk etter et mykt brudd. I testmodus `les` finnes det ofte bare
 * et lagret svar for første forsøk — da skal det beste svaret vi alt har,
 * brukes, framfor at hele runden feiler med «lagret svar mangler». Funnet da
 * måleverktøyet for FR-21 ble prøvd med lagrede svar.
 *
 * Returnerer null når forsøket skal droppes.
 */
type Generert<T> = { data: T; promptversjon: string; modell: string };

async function nyttForsok<T>(forsok: number, harEtSvar: boolean, kall: () => Promise<T>): Promise<T | null> {
  try {
    return await kall();
  } catch (e) {
    if (forsok > 0 && harEtSvar && e instanceof GeneratorFeil && e.kode === "lagret_svar_mangler") return null;
    throw e;
  }
}

export type Startresultat = {
  sporsmal: string;
  kildeavsnittNummer: number;
  promptversjon: string;
  modell: string;
};

/** FR-18: det første spørsmålet. */
export async function startSamtale(avsnitt: Avsnitt[]): Promise<Startresultat> {
  const brukermelding = formaterAvsnitt(avsnitt);
  let siste: string[] = [];
  let beste: { r: { data: z.infer<typeof StartSkjema>; promptversjon: string; modell: string }; myke: number } | null = null;
  // Tre forsøk, ikke to: et dobbeltspørsmål her gir en urettferdig vurdering
  // av elevens første svar, og prompten har gjort det sjeldnere, ikke borte
  // (1 av 3 i prøvekjøringen 16.10). Startspørsmålet lages én gang per samtale.
  for (let forsok = 0; forsok < 3; forsok++) {
    const r: Generert<z.infer<typeof StartSkjema>> | null = await nyttForsok(forsok, beste !== null, () =>
      kjoerGenerator({ oppgave: "samtalestart", skjema: StartSkjema, brukermelding, kjoering: forsok }),
    );
    if (!r) break;
    const { harde, myke } = bruddPaaStart(r.data, avsnitt);
    if (harde.length > 0) {
      siste = harde;
      continue;
    }
    if (!beste || myke.length < beste.myke) beste = { r, myke: myke.length };
    if (myke.length === 0) break;
  }
  if (beste) {
    return {
      sporsmal: beste.r.data.sporsmal.trim(),
      kildeavsnittNummer: beste.r.data.kildeavsnitt,
      promptversjon: beste.r.promptversjon,
      modell: beste.r.modell,
    };
  }
  throw new GeneratorFeil(
    "ugyldig_utdata",
    "Lesevenn fikk ikke til et godt første spørsmål.",
    "Prøv å starte samtalen igjen.",
    // Detaljene er for utvikleren, ikke for eleven (§5: ingen tekniske feilspor).
    new Error(`Brudd på startspørsmålet: ${siste.join("; ")}`),
  );
}

export type Vurdering = {
  tilstand: Tilstand;
  begrunnelse: string;
  /** null i siste runde. */
  oppfolging: { sporsmal: string; kildeavsnittNummer: number; maal: Maal } | null;
  /** Myke brudd som sto igjen etter siste forsøk. Rapporteres, ikke skjules. */
  svakheter: string[];
  promptversjon: string;
  modell: string;
};

/** FR-19 og FR-20: vurdering av elevens svar, og neste spørsmål. */
export async function vurderSvar(inn: {
  avsnitt: Avsnitt[];
  tidligere: TidligereRunde[];
  gjeldende: { sporsmal: string; kildeavsnittNummer: number };
  elevsvar: string;
  sisteRunde: boolean;
  nyVurdering?: boolean;
}): Promise<Vurdering> {
  const brukermelding = formaterVurdering(inn.avsnitt, inn.tidligere, inn.gjeldende, inn.elevsvar, {
    sisteRunde: inn.sisteRunde,
    nyVurdering: inn.nyVurdering ?? false,
  });
  const kontekst: Kontekst = {
    avsnitt: inn.avsnitt,
    stilteSporsmal: [...inn.tidligere.map((r) => r.sporsmal), inn.gjeldende.sporsmal],
    sporsmal: inn.gjeldende.sporsmal,
    elevsvar: inn.elevsvar,
    sisteRunde: inn.sisteRunde,
  };

  let beste: { v: Vurderingsutkast; myke: string[]; promptversjon: string; modell: string } | null = null;
  let sisteHarde: string[] = [];

  for (let forsok = 0; forsok < 2; forsok++) {
    const r: Generert<Vurderingsutkast> | null = await nyttForsok(forsok, beste !== null, () =>
      kjoerGenerator({ oppgave: "svarvurdering", skjema: VurderingSkjema, brukermelding, kjoering: forsok }),
    );
    if (!r) break;
    const { harde, myke } = bruddPaaVurdering(r.data, kontekst);
    if (harde.length > 0) {
      sisteHarde = harde;
      continue;
    }
    if (!beste || myke.length < beste.myke.length) {
      beste = { v: r.data, myke, promptversjon: r.promptversjon, modell: r.modell };
    }
    if (myke.length === 0) break;
  }

  if (!beste) {
    throw new GeneratorFeil(
      "ugyldig_utdata",
      "Lesevenn fikk ikke vurdert svaret ditt denne gangen.",
      "Svaret ditt er ikke borte — trykk «Svar» igjen for å prøve på nytt.",
      new Error(`Brudd på vurderingen: ${sisteHarde.join("; ")}`),
    );
  }

  const { v } = beste;
  return {
    tilstand: v.tilstand,
    begrunnelse: v.begrunnelse.trim(),
    oppfolging:
      inn.sisteRunde || !v.oppfolging
        ? null
        : {
            sporsmal: v.oppfolging.sporsmal.trim(),
            kildeavsnittNummer: v.oppfolging.kildeavsnitt,
            maal: v.oppfolging.maal,
          },
    svakheter: beste.myke,
    promptversjon: beste.promptversjon,
    modell: beste.modell,
  };
}
