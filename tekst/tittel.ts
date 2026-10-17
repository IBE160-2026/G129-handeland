/**
 * Tittelforslag — FR-1: «står feltet tomt, foreslås første overskrift eller
 * første setning».
 *
 * Før 17.10 ble første avsnitt kuttet etter 80 tegn, ofte midt i et ord. En
 * tittel som slutter på «elektromagneti» er verre enn en lang tittel.
 */

import type { Avsnitt } from "./avsnittsdeling";

const MAKS = 80;

export function foreslaaTittel(avsnitt: Avsnitt[]): string {
  const overskrift = avsnitt.find((a) => a.erOverskrift);
  if (overskrift) return kort(overskrift.innhold);
  const forste = avsnitt[0]?.innhold.trim();
  if (!forste) return "Uten tittel";
  const setning = forste.split(/(?<=[.!?])\s+/)[0];
  return kort(setning.replace(/[.!?]$/, ""));
}

/** Kutter på ordgrense og sier fra med «…», aldri midt i et ord. */
function kort(t: string): string {
  if (t.length <= MAKS) return t;
  const kuttet = t.slice(0, MAKS);
  const mellomrom = kuttet.lastIndexOf(" ");
  return `${(mellomrom > 20 ? kuttet.slice(0, mellomrom) : kuttet).trimEnd()} …`;
}
