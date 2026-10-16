/**
 * Hva som oversettes — FR-24 og FR-26.
 *
 * FR-24 sier at Morsmål bare gjelder Aktivering, oppsummering og forklaring
 * av Faguttrykk og språklige bilder. Her står de fire utvalgene, ett sted.
 * Siden bruker dem til å regne `kildeHash` og finne den lagrede oversettelsen,
 * handlingen til å lage en ny. Bygget de hvert sitt, ville hashen før eller
 * siden ikke passe, og oversettelsen blitt laget på nytt hver gang.
 */

import type { Element, Oppsummeringssetning, Utpekt } from "../generatorer/morsmaal";
import type { Avsnitt } from "../tekst/avsnittsdeling";

/** FR-26: overskriftene på aktiveringssiden. */
export function overskriftElementer(avsnitt: Avsnitt[]): Element[] {
  return avsnitt
    .filter((a) => a.erOverskrift)
    .map((a) => ({ id: `o${a.nummer}`, type: "overskrift", tekst: a.innhold }));
}

/**
 * FR-25: hvert Faguttrykk og forklaringen. Uttrykket oversettes for seg, så
 * visningen kan sette det norske i parentes etter — det skal stå der uansett
 * hva modellen gjør.
 */
export function begrepElementer(begreper: { id: string; uttrykk: string; forklaring: string }[]): Element[] {
  return begreper.flatMap((b): Element[] => [
    { id: `u:${b.id}`, type: "uttrykk", tekst: b.uttrykk },
    { id: `f:${b.id}`, type: "forklaring", tekst: b.forklaring },
  ]);
}

/** FR-26: oppsummeringen, setning for setning. */
export function oppsummeringElementer(setninger: Oppsummeringssetning[]): Element[] {
  return setninger.map((s, i) => ({ id: `s${i}`, type: "setning", tekst: s.tekst }));
}

/**
 * FR-27: bare forklaringen oversettes. Et språklig bilde oversatt ord for ord
 * er nettopp den bokstavelige lesningen forklaringen skal rydde bort.
 */
export function utpekingElementer(uttrykk: Utpekt[]): Element[] {
  return uttrykk.map((u, i) => ({ id: `f${i}`, type: "forklaring", tekst: u.forklaring }));
}

/** Oversettelsen som oppslag på id. */
export function somOppslag(oversatt: { id: string; oversatt: string }[] | null): Map<string, string> {
  return new Map((oversatt ?? []).map((o) => [o.id, o.oversatt]));
}
