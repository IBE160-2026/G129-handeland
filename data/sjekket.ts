/**
 * Har eleven sjekket forståelsen sin? — PRD §6 og FR-26.
 *
 * «Lesevenn er ikke et sammendragsverktøy»: oppsummeringen kommer etter at
 * eleven har lest OG blitt sjekket, og den er ikke tilgjengelig før.
 * Sjekket betyr et levert quizforsøk, eller minst ett svar i en fagsamtale.
 *
 * Ett sted, fordi både visningen (skal knappen vises?) og handlingen (skal
 * oppsummeringen lages?) må svare likt. En knapp som bare skjules, er ingen
 * lås — en server action kan kalles uten knappen.
 */

import { listFagsamtaler } from "./fagsamtale";
import { listForsoek } from "./quiz";
import type { Tilgang } from "./tilgang";

export async function harSjekketForstaaelsen(t: Tilgang, tekstId: string): Promise<boolean> {
  const [forsoek, samtaler] = await Promise.all([listForsoek(t, tekstId), listFagsamtaler(t, tekstId)]);
  return forsoek.length > 0 || samtaler.some((s) => s.antallRunder > 0);
}
