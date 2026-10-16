/**
 * Samsvar mellom to annoteringsrunder — FR-8, «egen annoteringsstøy».
 *
 * ## Hvorfor to tall, og ikke bare Cohens κ
 *
 * κ krever et fast sett saker, der hver sak får «ja» eller «nei» i begge
 * runder. «Hvilke faguttrykk står i teksten» har ikke et slikt sett. Den
 * første utgaven av annotering.md foreslo å bruke unionen av ordene fra de to
 * rundene som sakssett. Det virker ikke: i unionen finnes det per definisjon
 * ingen sak der begge rundene sa nei, og da blir telleren i κ
 *
 *     a·n − (a+b)(a+c) − b·c  =  −2·b·c       (n = a+b+c, d = 0)
 *
 * som aldri er positiv. κ over unionen er altså ≤ 0 uansett hvor enige
 * rundene er — se testen i samsvar.test.ts. Påstanden i veiledningen om at
 * metoden «overvurderer samsvaret noe» var feil; tallet er meningsløst.
 *
 * Derfor:
 *
 *   1. **Positivt samsvar** (positive specific agreement), 2a / (2a+b+c).
 *      Andelen av valgene som går igjen i begge rundene. Trenger ingen
 *      «nei»-saker, og er det tallet som anbefales når slike ikke finnes
 *      (Hripcsak og Rothschild, 2005). Det er også F1 mellom rundene — samme
 *      mål som F1 mellom modellen og Gullsettet, og derfor direkte
 *      sammenlignbart med det.
 *
 *   2. **κ over alle ordformer i teksten.** Sakssettet er hver ulike ordform
 *      i teksten, pluss de annoterte flerordsuttrykkene. Det gir «nei»-saker
 *      å regne på. Med mange ord som ingen runde valgte, nærmer κ seg det
 *      positive samsvaret — det er derfor de to tallene ligger tett, og det
 *      er en egenskap ved metoden, ikke en tilfeldighet.
 */

import { normaliser } from "./sammenligning";

export type Samsvar = {
  /** Valgt i begge runder. */
  begge: number;
  /** Bare runde 1. */
  bareForste: number;
  /** Bare runde 2. */
  bareAndre: number;
  /** Ingen av rundene — bare meningsfullt med et sakssett større enn unionen. */
  ingen: number;
  positivtSamsvar: number;
  kappa: number;
};

/** Hver ulike ordform i teksten, med samme normalisering som sammenligningen. */
export function ordformer(tekst: string): Set<string> {
  return new Set(
    tekst
      .split(/[^\p{L}\p{N}-]+/u)
      .map((o) => normaliser(o))
      .filter((o) => o.length > 0),
  );
}

/**
 * Regner samsvaret mellom to runder over et gitt sakssett. Uttrykk som ikke
 * står i sakssettet, legges til, slik at ingen valg faller utenfor.
 */
export function regnSamsvar(
  forste: string[],
  andre: string[],
  sakssett: Set<string>,
): Samsvar {
  const r1 = new Set(forste.map(normaliser));
  const r2 = new Set(andre.map(normaliser));
  const saker = new Set([...sakssett, ...r1, ...r2]);

  let begge = 0;
  let bareForste = 0;
  let bareAndre = 0;
  let ingen = 0;
  for (const s of saker) {
    const i1 = r1.has(s);
    const i2 = r2.has(s);
    if (i1 && i2) begge++;
    else if (i1) bareForste++;
    else if (i2) bareAndre++;
    else ingen++;
  }

  const n = saker.size;
  const positivtSamsvar =
    2 * begge + bareForste + bareAndre === 0
      ? 1
      : (2 * begge) / (2 * begge + bareForste + bareAndre);

  const observert = (begge + ingen) / n;
  const ja1 = (begge + bareForste) / n;
  const ja2 = (begge + bareAndre) / n;
  const tilfeldig = ja1 * ja2 + (1 - ja1) * (1 - ja2);
  const kappa = tilfeldig === 1 ? 1 : (observert - tilfeldig) / (1 - tilfeldig);

  return { begge, bareForste, bareAndre, ingen, positivtSamsvar, kappa };
}

/** Datoformatene i annoteringsfilene: «13.10.2026» eller «2026-10-13». */
export function tolkDato(dato: string): Date | null {
  const norsk = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(dato.trim());
  if (norsk) return new Date(Date.UTC(+norsk[3], +norsk[2] - 1, +norsk[1]));
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dato.trim());
  if (iso) return new Date(Date.UTC(+iso[1], +iso[2] - 1, +iso[3]));
  return null;
}

export function dagerMellom(fra: Date, til: Date): number {
  return Math.round((til.getTime() - fra.getTime()) / 86_400_000);
}

/** FR-8: runde 2 tidligst sju dager etter runde 1. */
export const MINST_DAGER_MELLOM = 7;
