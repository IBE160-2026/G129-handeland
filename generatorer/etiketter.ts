/**
 * Avsnittsetiketter — FR-5.
 *
 * «Har Teksten ingen gjenkjennelige overskrifter, genererer Lesevenn tre til
 * seks korte avsnittsetiketter fra innholdet, og merker dem synlig som laget
 * av Lesevenn og ikke hentet fra teksten.»
 *
 * Elementkontrollen følger AD-11: en etikett som peker på et avsnitt som ikke
 * finnes, står foran en overskrift, gjentar et nummer, eller ikke ville blitt
 * lest som overskrift, forkastes. Blir det færre enn tre igjen (og teksten har
 * minst tre avsnitt), er det et settbrudd — og eleven går videre uten
 * etiketter, slik hun ville gjort før denne funksjonen fantes.
 */

import { z } from "zod";
import { erOverskrift, type Avsnitt } from "../tekst/avsnittsdeling";
import { GeneratorFeil, formaterAvsnitt, kjoerGenerator } from "./kontrakt";

export const EtikettSkjema = z.object({
  etiketter: z.array(
    z.object({
      foranAvsnitt: z.number().int().describe("Avsnittet delen begynner i."),
      etikett: z.string().describe("To til seks ord, uten punktum eller kolon på slutten."),
    }),
  ),
});

export type Etikett = { foranAvsnitt: number; etikett: string };

export const MIN_ETIKETTER = 3;
export const MAKS_ETIKETTER = 6;
const MAKS_ORD = 6;

/** Eksportert for testene. */
export function kontrollerEtiketter(
  kandidater: Etikett[],
  avsnitt: Avsnitt[],
): { etiketter: Etikett[]; forkastet: { etikett: string; grunn: string }[] } {
  const brodtekst = new Set(avsnitt.filter((a) => !a.erOverskrift).map((a) => a.nummer));
  const brukt = new Set<number>();
  const etiketter: Etikett[] = [];
  const forkastet: { etikett: string; grunn: string }[] = [];
  let forrige = 0;

  for (const k of kandidater) {
    const e = k.etikett.trim();
    let grunn: string | null = null;
    if (!brodtekst.has(k.foranAvsnitt)) grunn = `avsnitt ${k.foranAvsnitt} er ikke et brødtekstavsnitt`;
    else if (brukt.has(k.foranAvsnitt)) grunn = "samme avsnitt to ganger";
    else if (k.foranAvsnitt < forrige) grunn = "i feil rekkefølge";
    else if (!erOverskrift(e) || e.split(/\s+/).length > MAKS_ORD) grunn = "ikke en kort overskrift";
    else if (etiketter.length >= MAKS_ETIKETTER) grunn = "over seks etiketter";
    if (grunn) {
      forkastet.push({ etikett: e, grunn });
      continue;
    }
    brukt.add(k.foranAvsnitt);
    forrige = k.foranAvsnitt;
    etiketter.push({ foranAvsnitt: k.foranAvsnitt, etikett: e });
  }
  return { etiketter, forkastet };
}

export async function lagEtiketter(avsnitt: Avsnitt[]): Promise<{
  etiketter: Etikett[];
  forkastet: { etikett: string; grunn: string }[];
  promptversjon: string;
  modell: string;
}> {
  const r = await kjoerGenerator({
    oppgave: "etiketter",
    skjema: EtikettSkjema,
    brukermelding: formaterAvsnitt(avsnitt),
    maksTokens: 8000,
  });
  const k = kontrollerEtiketter(r.data.etiketter, avsnitt);
  const krav = Math.min(MIN_ETIKETTER, avsnitt.filter((a) => !a.erOverskrift).length);
  if (k.etiketter.length < krav) {
    throw new GeneratorFeil(
      "ugyldig_utdata",
      "Lesevenn fikk ikke laget etiketter til teksten.",
      "Gå videre uten — du kan legge til en overskrift selv øverst.",
    );
  }
  return { ...k, promptversjon: r.promptversjon, modell: r.modell };
}
