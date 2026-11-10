/**
 * Leseinnstillingene — FR-12.
 *
 * Trinnene står her, ett sted. Databasen lagrer navnet på trinnet, så et
 * trinn kan gjøres litt større uten migrasjon.
 *
 * Linjelengden regnes i `ch` (bredden av et tegn i gjeldende skrift). Da
 * holder den seg på om lag 70 tegn også når eleven gjør skriften større —
 * en fast bredde i rem ville gitt kortere og kortere linjer.
 */

export const TEKSTSTORRELSER = {
  liten: { navn: "Liten", rem: 1 },
  normal: { navn: "Normal", rem: 1.125 },
  stor: { navn: "Stor", rem: 1.375 },
  // 2 og ikke 1,625 etter telefontesten 9.11: «ekstra stor» var for lite
  // forskjellig fra «stor».
  ekstra: { navn: "Ekstra stor", rem: 2 },
} as const;

/**
 * Avstanden mellom avsnittene følger linjeavstanden (telefontest 9.11: med
 * «romslig» var avsnittene for tett). I em, så den vokser med skriften.
 */
export const LINJEAVSTANDER = {
  tett: { navn: "Tett", faktor: 1.5, avsnitt: 0.8 },
  normal: { navn: "Normal", faktor: 1.8, avsnitt: 1.1 },
  romslig: { navn: "Romslig", faktor: 2.2, avsnitt: 1.8 },
} as const;

export type Tekststorrelse = keyof typeof TEKSTSTORRELSER;
export type Linjeavstand = keyof typeof LINJEAVSTANDER;
export type Leseinnstillinger = { tekststorrelse: Tekststorrelse; linjeavstand: Linjeavstand };

export const STANDARD: Leseinnstillinger = { tekststorrelse: "normal", linjeavstand: "normal" };

/** FR-12: om lag 70 tegn per linje. */
export const LINJELENGDE_CH = 70;

/**
 * Tolker lagrede eller innsendte verdier. Ukjent trinn gir standarden, aldri en
 * feil. `Object.hasOwn` og ikke `in`: `"constructor" in {}` er sant.
 */
export function tolkInnstillinger(v: { tekststorrelse?: unknown; linjeavstand?: unknown }): Leseinnstillinger {
  const s = String(v.tekststorrelse ?? "");
  const l = String(v.linjeavstand ?? "");
  return {
    tekststorrelse: Object.hasOwn(TEKSTSTORRELSER, s) ? (s as Tekststorrelse) : STANDARD.tekststorrelse,
    linjeavstand: Object.hasOwn(LINJEAVSTANDER, l) ? (l as Linjeavstand) : STANDARD.linjeavstand,
  };
}

/** CSS-variabelen avsnittene leser avstanden sin fra (`MarkertAvsnitt`). */
export const AVSNITTSVARIABEL = "--avsnittsavstand";

/** Stilen Lesevisningen bruker på teksten. */
export function lesestil(i: Leseinnstillinger) {
  return {
    fontSize: `${TEKSTSTORRELSER[i.tekststorrelse].rem}rem`,
    lineHeight: LINJEAVSTANDER[i.linjeavstand].faktor,
    maxWidth: `${LINJELENGDE_CH}ch`,
    [AVSNITTSVARIABEL]: `${LINJEAVSTANDER[i.linjeavstand].avsnitt}em`,
  };
}
