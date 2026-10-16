/**
 * Morsmålsgeneratorene — FR-25, FR-26, FR-27 og tilbakeoversettelsen i FR-28.
 *
 * Tre kall:
 *
 *   oversett   en bunt korte norske tekster til ett språk, med de norske
 *              fagordene i parentes (FR-25). Brukes også tilbake til norsk.
 *   oppsummer  høyst fem setninger på norsk, hver med kildeavsnitt (FR-26).
 *              Oversettes etterpå med `oversett`, så norsk og morsmål bygger
 *              på samme setninger.
 *   pekUt      språklige bilder og akademisk allmennspråk (FR-27), med
 *              forklaring på norsk som også oversettes etterpå.
 *
 * At oppsummering og utpeking lages på norsk først, er bevisst: den norske
 * utgaven er den som vises likeverdig ved siden av (FR-25), og den kan
 * valideres mot teksten — det kan ikke en oversettelse.
 */

import { z } from "zod";
import type { Spraak } from "../morsmaal/spraak";
import type { Avsnitt } from "../tekst/avsnittsdeling";
import { antallOrd } from "../tekst/avsnittsdeling";
import { GeneratorFeil, formaterAvsnitt, kjoerGenerator } from "./kontrakt";
import { erVerbatim } from "./validering";

/* ------------------------------------------------------------------ *
 * Oversettelse
 * ------------------------------------------------------------------ */

export const OversettelseSkjema = z.object({
  oversettelser: z.array(
    z.object({
      id: z.string().describe("Samme id som elementet."),
      oversatt: z.string().describe("Oversettelsen."),
    }),
  ),
});

export type Elementtype = "overskrift" | "setning" | "forklaring" | "uttrykk";
export type Element = { id: string; type: Elementtype; tekst: string };
export type Oversatt = { id: string; oversatt: string };

export type Oversettelsesresultat = {
  oversatt: Oversatt[];
  promptversjon: string;
  modell: string;
};

/** Målspråket ved tilbakeoversettelse (FR-28). */
export const NORSK: Spraak = { kode: "nb", navn: "Norsk bokmål", egetNavn: "Norsk bokmål", retning: "ltr" };

/**
 * Oversetter en bunt elementer.
 *
 * Et svar som mangler et element, er et settbrudd: visningen kan ikke vise
 * halvparten av overskriftene på morsmål og resten bare på norsk uten å si
 * hvorfor. Generatoren feiler da, og FR-29 viser norsk alene med prøv igjen.
 */
export async function oversett({
  spraak,
  elementer,
  fagord,
  overstyrVersjon,
}: {
  spraak: Spraak;
  elementer: Element[];
  fagord: string[];
  overstyrVersjon?: string;
}): Promise<Oversettelsesresultat> {
  if (elementer.length === 0) return { oversatt: [], promptversjon: "", modell: "" };

  const melding = JSON.stringify(
    { maalspraak: { navn: spraak.navn, kode: spraak.kode }, fagord, elementer },
    null,
    2,
  );
  const r = await kjoerGenerator({
    oppgave: "oversettelse",
    skjema: OversettelseSkjema,
    brukermelding: melding,
    overstyrVersjon,
    maksTokens: 16000,
  });

  const etterId = new Map(r.data.oversettelser.map((o) => [o.id, o.oversatt.trim()]));
  const oversatt: Oversatt[] = [];
  for (const e of elementer) {
    const tekst = etterId.get(e.id);
    if (!tekst) {
      throw new GeneratorFeil(
        "ugyldig_utdata",
        "Oversettelsen ble ikke hel.",
        "Prøv igjen. Den norske teksten står som før.",
      );
    }
    oversatt.push({ id: e.id, oversatt: tekst });
  }
  return { oversatt, promptversjon: r.promptversjon, modell: r.modell };
}

/* ------------------------------------------------------------------ *
 * Oppsummering (FR-26)
 * ------------------------------------------------------------------ */

export const OppsummeringSkjema = z.object({
  setninger: z
    .array(
      z.object({
        tekst: z.string().describe("Én setning på norsk bokmål."),
        kildeavsnitt: z.number().int().describe("Avsnittet setningen bygger mest på. Aldri en overskrift."),
      }),
    )
    .describe("Høyst fem setninger, det viktigste først."),
});

export const MAKS_SETNINGER = 5;

export type Oppsummeringssetning = { tekst: string; kildeavsnitt: number };

export type Oppsummeringsresultat = {
  setninger: Oppsummeringssetning[];
  forkastet: { tekst: string; grunn: string }[];
  promptversjon: string;
  modell: string;
};

/**
 * Elementkontrollen i AD-11 for oppsummeringen. Eksportert for testene.
 *
 * Kildeavsnittet må finnes og være brødtekst. Det beviser ikke at setningen
 * er sann — FR-26s «ingen påstand som ikke står i Teksten» krever en leser,
 * og det er den eksterne vurderingen i FR-28 — men det fanger setninger som
 * peker på ingenting.
 */
export function kontrollerOppsummering(
  kandidater: Oppsummeringssetning[],
  avsnitt: Avsnitt[],
): Pick<Oppsummeringsresultat, "setninger" | "forkastet"> {
  const brodtekst = new Set(avsnitt.filter((a) => !a.erOverskrift).map((a) => a.nummer));
  const setninger: Oppsummeringssetning[] = [];
  const forkastet: { tekst: string; grunn: string }[] = [];
  for (const k of kandidater) {
    const tekst = k.tekst.trim();
    if (tekst.length === 0) continue;
    if (!brodtekst.has(k.kildeavsnitt)) {
      forkastet.push({ tekst, grunn: `kildeavsnitt ${k.kildeavsnitt} er ikke et brødtekstavsnitt` });
    } else if (setninger.length >= MAKS_SETNINGER) {
      forkastet.push({ tekst, grunn: "over fem setninger" });
    } else {
      setninger.push({ tekst, kildeavsnitt: k.kildeavsnitt });
    }
  }
  return { setninger, forkastet };
}

export async function oppsummer({
  avsnitt,
  overstyrVersjon,
}: {
  avsnitt: Avsnitt[];
  overstyrVersjon?: string;
}): Promise<Oppsummeringsresultat> {
  const r = await kjoerGenerator({
    oppgave: "oppsummering",
    skjema: OppsummeringSkjema,
    brukermelding: formaterAvsnitt(avsnitt),
    overstyrVersjon,
    maksTokens: 4000,
  });
  const { setninger, forkastet } = kontrollerOppsummering(r.data.setninger, avsnitt);
  if (setninger.length === 0) {
    throw new GeneratorFeil(
      "ugyldig_utdata",
      "Lesevenn fikk ikke laget en oppsummering av denne teksten.",
      "Prøv igjen. Teksten står som før.",
    );
  }
  return { setninger, forkastet, promptversjon: r.promptversjon, modell: r.modell };
}

/* ------------------------------------------------------------------ *
 * Utpeking (FR-27)
 * ------------------------------------------------------------------ */

export const UtpekingSkjema = z.object({
  uttrykk: z.array(
    z.object({
      uttrykk: z.string().describe("Ordrett fra teksten, med samme bøyning."),
      kategori: z.enum(["spraklig_bilde", "akademisk"]),
      forklaring: z.string().describe("På norsk, høyst to setninger. For språklige bilder: hva det betyr her."),
      kildeavsnitt: z.number().int().describe("Avsnittet uttrykket står i."),
    }),
  ),
});

export type Utpekingskategori = "spraklig_bilde" | "akademisk";
export type Utpekt = { uttrykk: string; kategori: Utpekingskategori; forklaring: string; kildeavsnitt: number };

export type Utpekingsresultat = {
  uttrykk: Utpekt[];
  forkastet: { uttrykk: string; grunn: string }[];
  promptversjon: string;
  modell: string;
};

/** FR-27: høyst åtte per 1 000 ord per kategori. Minst ett, så korte tekster ikke får null. */
export function utpekingstak(avsnitt: Avsnitt[]): number {
  return Math.max(1, Math.floor((8 * antallOrd(avsnitt)) / 1000));
}

/**
 * Elementkontrollen i AD-11 for utpekingen. Eksportert for testene.
 *
 * Regelen om fagord er streng med vilje: et uttrykk som er, eller inneholder,
 * et Faguttrykk, hører i Begrepssettet og skal ikke forklares to ganger med
 * to forklaringer som kan si ulike ting.
 */
export function kontrollerUtpeking(
  kandidater: Utpekt[],
  avsnitt: Avsnitt[],
  fagord: string[],
): Pick<Utpekingsresultat, "uttrykk" | "forkastet"> {
  const tak = utpekingstak(avsnitt);
  const fag = fagord.map((f) => f.trim().toLowerCase()).filter(Boolean);
  const sett = new Set<string>();
  const perKategori = new Map<Utpekingskategori, number>();
  const uttrykk: Utpekt[] = [];
  const forkastet: { uttrykk: string; grunn: string }[] = [];

  for (const k of kandidater) {
    const u = k.uttrykk.trim();
    const liten = u.toLowerCase();
    const avsnittet = avsnitt.find((a) => a.nummer === k.kildeavsnitt);
    let grunn: string | null = null;
    if (!erVerbatim(u, avsnitt)) grunn = "står ikke ordrett i teksten";
    else if (!avsnittet) grunn = `kildeavsnitt ${k.kildeavsnitt} finnes ikke`;
    else if (!avsnittet.innhold.toLowerCase().includes(liten)) grunn = "står ikke i kildeavsnittet";
    else if (fag.some((f) => liten.includes(f) || f.includes(liten))) grunn = "er et Faguttrykk";
    else if (sett.has(liten)) grunn = "dublett";
    else if (k.forklaring.trim().length === 0) grunn = "mangler forklaring";
    else if ((perKategori.get(k.kategori) ?? 0) >= tak) grunn = "over taket i FR-27";

    if (grunn) {
      forkastet.push({ uttrykk: u, grunn });
      continue;
    }
    sett.add(liten);
    perKategori.set(k.kategori, (perKategori.get(k.kategori) ?? 0) + 1);
    uttrykk.push({ ...k, uttrykk: u, forklaring: k.forklaring.trim() });
  }
  return { uttrykk, forkastet };
}

export async function pekUt({
  avsnitt,
  fagord,
  overstyrVersjon,
}: {
  avsnitt: Avsnitt[];
  fagord: string[];
  overstyrVersjon?: string;
}): Promise<Utpekingsresultat> {
  const melding = [
    `maksPerKategori: ${utpekingstak(avsnitt)}`,
    `fagord: ${JSON.stringify(fagord)}`,
    "",
    formaterAvsnitt(avsnitt),
  ].join("\n");
  const r = await kjoerGenerator({
    oppgave: "utpeking",
    skjema: UtpekingSkjema,
    brukermelding: melding,
    overstyrVersjon,
    maksTokens: 8000,
  });
  // Et tomt sett er et gyldig svar: en tekst kan mangle begge kategoriene.
  return { ...kontrollerUtpeking(r.data.uttrykk, avsnitt, fagord), promptversjon: r.promptversjon, modell: r.modell };
}
