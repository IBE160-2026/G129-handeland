/**
 * FR-6 (endret 17.11.2026): forkunnskapen i aktiveringen.
 *
 * Eleven merker hver overskrift «Dette kan jeg», «Har hørt om» eller «Helt nytt», og
 * kan skrive ett spørsmål hun lurer på. Ingenting vurderes. I lesevisningen
 * vises det igjen under «Før du leste», så det hun gjorde før lesingen, får
 * en ende.
 *
 * Rene funksjoner, uten database og rammeverk: skjemaet leses her, og
 * lesevisningen bygger delen sin her. Begge kan dermed enhetstestes.
 */

import type { Avsnitt } from "./avsnittsdeling";

/** Lukket kodeverk, aldri fritekst. Rekkefølgen er rekkefølgen i skjemaet. */
export const MERKER = ["kjent", "litt", "nytt"] as const;
export type Merke = (typeof MERKER)[number];

export const MERKENAVN: Record<Merke, string> = {
  kjent: "Dette kan jeg",
  litt: "Har hørt om",
  nytt: "Helt nytt",
};

/**
 * Lagres med overskriftens tekst, ikke nummeret: i gjennomsynet for PDF og
 * bilde kan eleven flytte avsnittene etter aktiveringen.
 */
export type Overskriftsmerke = { overskrift: string; merke: Merke };

/** Høyst så mange tegn i «Noe du lurer på før du leser?». Feltet har samme grense. */
export const MAKS_LURER_PAA = 500;

/** Feltnavnet for merket på overskrift nummer `nummer`. */
export const merkefelt = (nummer: number) => `merke-${nummer}`;

/**
 * Leser merkene fra skjemaet. Overskriftene kommer fra serveren (AD-12), så
 * et nummer som ikke er en overskrift, eller en verdi utenfor kodeverket,
 * forkastes stille (AD-11-ånd). Umerkede overskrifter lagres ikke.
 */
export function lesMerking(
  data: { get(navn: string): unknown },
  titler: Avsnitt[],
): Overskriftsmerke[] {
  const merking: Overskriftsmerke[] = [];
  for (const o of titler) {
    const verdi = data.get(merkefelt(o.nummer));
    if (typeof verdi === "string" && (MERKER as readonly string[]).includes(verdi)) {
      merking.push({ overskrift: o.innhold, merke: verdi as Merke });
    }
  }
  return merking;
}

/**
 * Spørsmålet, uten luft rundt og kappet til grensen. Tomt blir tom streng.
 * Linjeskift gjøres om til `\n` først: feltets `maxLength` teller et
 * linjeskift som ett tegn, men skjemaet sender CRLF, og uten dette ville
 * tekst feltet godtok, blitt kappet her.
 */
export function lesLurerPaa(verdi: unknown): string {
  if (typeof verdi !== "string") return "";
  return verdi.replace(/\r\n?/g, "\n").trim().slice(0, MAKS_LURER_PAA).trim();
}

/** «A», «A og B», «A, B og C». */
export function somListe(deler: string[]): string {
  if (deler.length <= 1) return deler.join("");
  return `${deler.slice(0, -1).join(", ")} og ${deler[deler.length - 1]}`;
}

export type FoerDuLeste = {
  /** Spørsmålet eleven skrev, eller null. */
  lurerPaa: string | null;
  /** Overskriftene hun merket «Helt nytt». */
  heltNye: string[];
  /** «kjent» og «litt» oppsummert i én linje, eller null. */
  oppsummering: string | null;
  /** Det frie svaret fra før 17.11, eller null. */
  gammeltSvar: string | null;
};

/**
 * Delen «Før du leste» i lesevisningen. Null når teksten ikke har noe å vise,
 * og da vises ikke delen. Tekster fra før endringen har bare
 * `forkunnskapssvar`, og det vises som det er.
 */
export function foerDuLeste(rad: {
  forkunnskapMerking: Overskriftsmerke[] | null;
  lurerPaa: string | null;
  forkunnskapssvar: string | null;
}): FoerDuLeste | null {
  const merking = rad.forkunnskapMerking ?? [];
  const med = (m: Merke) => merking.filter((x) => x.merke === m).map((x) => x.overskrift);

  const kjent = med("kjent");
  const litt = med("litt");
  const linje = [
    kjent.length > 0 ? `Dette kunne du fra før: ${somListe(kjent)}.` : "",
    litt.length > 0 ? `Hadde hørt om: ${somListe(litt)}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const del: FoerDuLeste = {
    lurerPaa: rad.lurerPaa?.trim() || null,
    heltNye: med("nytt"),
    oppsummering: linje || null,
    gammeltSvar: rad.forkunnskapssvar?.trim() || null,
  };

  const tom = !del.lurerPaa && del.heltNye.length === 0 && !del.oppsummering && !del.gammeltSvar;
  return tom ? null : del;
}
