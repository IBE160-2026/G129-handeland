/**
 * Fase 3a — overskriftskontrollen (FR-3).
 *
 * Eleven ser bare overskriftene, og kan rette, slette, flytte og legge til en
 * øverst. Her er regnestykket som fører endringene tilbake i teksten uten å
 * røre brødteksten.
 *
 * ## Hva «flytte» betyr når brødteksten er skjult
 *
 * Overskriftene står på faste plasser i teksten — foran sin del av
 * brødteksten. Å flytte en overskrift opp er derfor å bytte TEKST med plassen
 * over; brødteksten blir stående. Det er det eleven kan vurdere uten å se
 * brødteksten: at en overskrift står på feil plass i rekkefølgen.
 *
 * Å legge til en overskrift midt i teksten krever å se hvor brødteksten
 * skifter tema, og det kan ikke gjøres i en fase der brødteksten med vilje er
 * skjult. Den muligheten ligger i fase 3b, der hele teksten kan redigeres. Her
 * kan eleven legge til én øverst — det vanligste tilfellet, når tittelen har
 * falt bort i uttrekket.
 */

import { delIAvsnitt, erOverskrift } from "./avsnittsdeling";

export type Overskriftsplass = { nummer: number; tekst: string };

/** Overskriftene med plassen sin, til visningen. Bare overskriftene — aldri brødteksten. */
export function overskriftsplasser(redigert: string): Overskriftsplass[] {
  return delIAvsnitt(redigert)
    .filter((a) => a.erOverskrift)
    .map((a) => ({ nummer: a.nummer, tekst: a.innhold }));
}

/**
 * Er dette en gyldig overskrift etter delingsregelen? Ellers ville den blitt
 * lest som brødtekst etter lagring, og forsvunnet fra aktiveringen uten at
 * eleven skjønte hvorfor.
 */
export function overskriftsfeil(tekst: string): string | null {
  const t = tekst.trim();
  if (t.includes("\n")) return "Overskriften må stå på én linje.";
  if (!erOverskrift(t)) return "En overskrift er kort — høyst ti ord — og slutter ikke med punktum eller kolon.";
  return null;
}

/**
 * FR-5: setter genererte etiketter inn som overskrifter foran avsnittene de
 * hører til. Brødteksten er urørt.
 */
export function settInnEtiketter(redigert: string, etiketter: { foranAvsnitt: number; etikett: string }[]): string {
  const foran = new Map(etiketter.map((e) => [e.foranAvsnitt, e.etikett.trim()]));
  return delIAvsnitt(redigert)
    .flatMap((a) => (foran.has(a.nummer) ? [foran.get(a.nummer)!, a.innhold] : [a.innhold]))
    .join("\n\n");
}

/**
 * Fører endringene inn i teksten.
 *
 * `endringer` har ny tekst per plass; tom tekst sletter overskriften. Plasser
 * som ikke er med, står uendret. Brødteksten er urørt: hvert avsnitt som ikke
 * er en overskrift, kommer ut med samme innhold og i samme rekkefølge.
 */
export function byttOverskrifter(redigert: string, endringer: Map<number, string>, topp?: string): string {
  const deler: string[] = [];
  const ny = topp?.trim();
  if (ny) deler.push(ny);
  for (const a of delIAvsnitt(redigert)) {
    if (!a.erOverskrift) {
      deler.push(a.innhold);
      continue;
    }
    const t = (endringer.has(a.nummer) ? endringer.get(a.nummer)! : a.innhold).trim();
    if (t) deler.push(t);
  }
  return deler.join("\n\n");
}
