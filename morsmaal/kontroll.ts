/**
 * De maskinelle kontrollene i FR-25 og FR-28.
 *
 * Ren tekstbehandling, uten modell og database. Appen, testene og målingen
 * i FR-28 bruker de samme funksjonene — to regnestykker for samme krav gir
 * før eller siden to svar.
 */

/** Bokstav eller tall. Unicode-bevisst, så æ, ø, å og kyrillisk teller. */
const ORDTEGN = /[\p{L}\p{N}]/u;

/** Antall ganger `ord` står på egne ordgrenser i `tekst`, uten hensyn til store og små bokstaver. */
function antallTreff(tekst: string, ord: string): number {
  const h = tekst.toLowerCase();
  const naal = ord.trim().toLowerCase();
  if (naal.length === 0) return 0;
  let n = 0;
  for (let i = h.indexOf(naal); i !== -1; i = h.indexOf(naal, i + 1)) {
    const foer = h[i - 1];
    const etter = h[i + naal.length];
    if (!(foer && ORDTEGN.test(foer)) && !(etter && ORDTEGN.test(etter))) n++;
  }
  return n;
}

/* ------------------------------------------------------------------ *
 * FR-25 / FR-28 — begrepsankeret
 * ------------------------------------------------------------------ */

export type Ankermaal = {
  /** Forekomster av Faguttrykk i den norske teksten. */
  forventet: number;
  /** Av dem: hvor mange har «(uttrykk)» i oversettelsen. */
  funnet: number;
  /** Uttrykk med færre ankre enn forekomster. */
  mangler: string[];
};

/**
 * Teller begrepsankrene i én oversettelse.
 *
 * For hvert Faguttrykk som står i den norske teksten, ventes like mange
 * forekomster av «(uttrykk)» i oversettelsen, med uttrykket i uendret form.
 * Flere ankre enn forekomster teller ikke ekstra — det kan ikke veie opp for
 * et som mangler et annet sted.
 */
export function maalAnker(norsk: string, oversatt: string, fagord: string[]): Ankermaal {
  let forventet = 0;
  let funnet = 0;
  const mangler: string[] = [];
  for (const ord of fagord) {
    const n = antallTreff(norsk, ord);
    if (n === 0) continue;
    const ankre = oversatt.split(`(${ord.trim()})`).length - 1;
    forventet += n;
    funnet += Math.min(n, ankre);
    if (ankre < n) mangler.push(ord);
  }
  return { forventet, funnet, mangler };
}

/** FR-28: primærmålet. */
export const ANKERTERSKEL = 0.95;

/** Andelen ankre over flere oversettelser. 1 når ingenting var ventet. */
export function ankerandel(maal: Ankermaal[]): number {
  const forventet = maal.reduce((s, m) => s + m.forventet, 0);
  const funnet = maal.reduce((s, m) => s + m.funnet, 0);
  return forventet === 0 ? 1 : funnet / forventet;
}

/* ------------------------------------------------------------------ *
 * FR-28 — tilbakeoversettelsen, bare for tre ting
 * ------------------------------------------------------------------ */

/**
 * Nektingsordene FR-28 nevner, og de nærmeste slektningene. Teller som avvik
 * bare når tilbakeoversettelsen har FÆRRE nektinger i alt enn originalen: en nekting som er
 * borte, snur meningen, mens en ekstra er sjelden og ufarlig å overse.
 */
export const NEKTINGSORD = ["ikke", "aldri", "uten", "ingen", "intet", "ingenting", "verken"];

/** Tall som de står, med komma og punktum normalisert. «1,5» og «1.5» er samme tall. */
function tall(tekst: string): string[] {
  return (tekst.match(/\d+(?:[.,]\d+)*/g) ?? []).map((t) => t.replace(/,/g, ".")).sort();
}

/**
 * Egennavn, grovt: ord med stor forbokstav som ikke står først i en setning.
 * Grovheten er bevisst. FR-28 spør om navn har *endret seg*, og et navn som
 * står først i setningen og derfor ikke telles, kan ikke gi et falskt avvik.
 */
export function egennavn(tekst: string): string[] {
  const ut: string[] = [];
  for (const setning of tekst.split(/(?<=[.!?:])\s+|\n+/)) {
    const ord = setning.split(/\s+/).filter(Boolean);
    for (const o of ord.slice(1)) {
      const rent = o.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "");
      if (/^\p{Lu}\p{Ll}/u.test(rent)) ut.push(rent);
    }
  }
  return [...new Set(ut)];
}

export type Avvik = { kategori: "nekting" | "tall" | "navn"; detalj: string };

/** De tre sammenligningene i FR-28. Målet er null avvik. */
export function sammenlignTilbake(original: string, tilbake: string): Avvik[] {
  const avvik: Avvik[] = [];

  // Ordene telles samlet, ikke hvert for seg: «tyder ikke på noen oppgang»
  // tilbake som «viser ingen oppgang» er samme nekting med et annet ord. Det
  // første målet på fire tekster ga nettopp det falske avviket.
  const nektinger = (t: string) => NEKTINGSORD.reduce((s, o) => s + antallTreff(t, o), 0);
  const foer = nektinger(original);
  const etter = nektinger(tilbake);
  if (etter < foer) avvik.push({ kategori: "nekting", detalj: `${foer} → ${etter}` });

  const a = tall(original);
  const b = tall(tilbake);
  if (a.join("|") !== b.join("|")) {
    avvik.push({ kategori: "tall", detalj: `${a.join(", ") || "–"} → ${b.join(", ") || "–"}` });
  }

  const navnEtter = tilbake.toLowerCase();
  for (const navn of egennavn(original)) {
    if (antallTreff(navnEtter, navn) === 0) avvik.push({ kategori: "navn", detalj: navn });
  }

  return avvik;
}
