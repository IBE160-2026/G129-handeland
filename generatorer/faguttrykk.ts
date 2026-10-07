/**
 * Uttrekk av Faguttrykk — FR-7, FR-8, FR-9.
 *
 * Den første ekte generatoren. Den viser formen de andre følger:
 *
 *   1. et Zod-skjema som sier hva modellen skal svare med (AD-11, lag 1)
 *   2. ett kall gjennom `kjoerGenerator` (AD-1, AD-14)
 *   3. validering mot teksten, med forkasting og begrunnelse (AD-11, lag 2)
 *   4. kapping etter rangering om settet er for tett (AD-11, settnivå)
 *   5. et forekomstsett som er det eneste visningen leser (AD-13)
 *
 * Laget er rent (AD-10): ingenting her importerer databaseklienten eller
 * rammeverkskode, og ingenting her lagrer noe. Kalleren får validerte verdier
 * og bestemmer selv hva som skjer med dem. Det er den regelen som gjør at
 * måleharnessen kan kjøre denne funksjonen uten database.
 */

import { z } from "zod";
import type { Avsnitt } from "../tekst/avsnittsdeling";
import {
  fjernOverlapp,
  finnForekomster,
  type Forekomst,
} from "../tekst/forekomster";
import { formaterAvsnitt, kjoerGenerator } from "./kontrakt";
import {
  filtrerUgyldige,
  kappEtterRangering,
  maalTetthet,
  type Begrepskandidat,
  type Kappet,
  type Tetthetsmaal,
} from "./validering";

/**
 * Skjemaet modellen svarer etter.
 *
 * Beskrivelsene er ikke kommentarer — de sendes med til modellen som del av
 * utdataformatet, og er derfor en del av prompten. De harde kravene står i
 * `prompts/faguttrykk/v1.md`; her står bare det som trengs for å forstå
 * feltene, slik at de to ikke sier det samme på to steder som kan komme i
 * utakt.
 */
export const FaguttrykkSkjema = z.object({
  faguttrykk: z
    .array(
      z.object({
        uttrykk: z
          .string()
          .describe(
            "Faguttrykket, ordrett slik det står i teksten, med den bøyningen teksten bruker.",
          ),
        forklaring: z
          .string()
          .describe(
            "Hva uttrykket betyr, på høyst to setninger, til en elev som ikke kan ordet.",
          ),
        viktighetsrangering: z
          .number()
          .int()
          .min(1)
          .describe(
            "1 er mest sentralt for tekstens argument. Brukes til å kutte nedenfra hvis det blir for mange markeringer.",
          ),
        kildeavsnitt: z
          .number()
          .int()
          .describe(
            "Nummeret til avsnittet uttrykket står i. Bare numre fra merkelappene i teksten.",
          ),
      }),
    )
    .describe(
      "Faguttrykkene som faktisk finnes i teksten. Tom liste hvis teksten ikke har fagspråk — ikke fyll opp til et antall.",
    ),
});

export type Faguttrykksvar = z.infer<typeof FaguttrykkSkjema>;

/** Et ferdig validert Begrep med markeringene sine. */
export type Begrep = Begrepskandidat & {
  forekomster: Forekomst[];
};

export type Faguttrykksresultat = {
  /** Det eleven skal se, i rangeringsrekkefølge. */
  begreper: Begrep[];
  /** AD-13: det samlede settet, uten overlapp, i dokumentrekkefølge. */
  forekomster: Forekomst[];
  /** Hva som falt, og hvorfor. Råstoff til FR-8 og KI-loggen. */
  forkastet: { kandidat: Begrepskandidat; aarsak: string }[];
  /** Målt på det endelige settet. Rapporteres, også når det er innenfor. */
  tetthet: Tetthetsmaal;
  /** Hvilket kappetrinn som fikk settet innenfor. Rapporteres, ikke skjules. */
  kappetrinn: Kappet["trinn"];
  /** AD-4. */
  promptversjon: string;
  modell: string;
};

/**
 * Slår sammen duplikater fra modellen.
 *
 * Modellen kan oppgi samme uttrykk to ganger, typisk fra to ulike avsnitt.
 * Det er ikke ugyldig utdata, men det ville gitt eleven to oppføringer av
 * samme ord i begrepslisten. Den beste rangeringen vinner — altså den laveste,
 * siden 1 er mest sentralt.
 *
 * Merk at markeringene ikke går tapt: `finnForekomster` finner alle stedene
 * uttrykket står, uavhengig av hvilket avsnitt modellen oppgav som kilde.
 * Kildeavsnittet er der forklaringen er hentet fra, ikke en liste over hvor
 * ordet forekommer.
 */
function slaaSammenDuplikater(
  kandidater: Begrepskandidat[],
): Begrepskandidat[] {
  const beste = new Map<string, Begrepskandidat>();

  for (const k of kandidater) {
    const n = k.uttrykk.trim().toLowerCase();
    const finnes = beste.get(n);
    if (!finnes || k.viktighetsrangering < finnes.viktighetsrangering) {
      beste.set(n, k);
    }
  }

  return [...beste.values()];
}

/**
 * Henter Faguttrykkene i en tekst.
 *
 * `avsnitt` skal komme fra `delIAvsnitt` (AD-12) — ikke fra en egen deling,
 * fordi kildeavsnittnumrene modellen svarer med bare betyr noe mot presis den
 * nummereringen.
 */
export async function hentFaguttrykk(
  avsnitt: Avsnitt[],
  valg: { overstyrVersjon?: string } = {},
): Promise<Faguttrykksresultat> {
  const svar = await kjoerGenerator({
    oppgave: "faguttrykk",
    skjema: FaguttrykkSkjema,
    brukermelding: formaterAvsnitt(avsnitt),
    overstyrVersjon: valg.overstyrVersjon,
  });

  const raa: Begrepskandidat[] = svar.data.faguttrykk.map((f) => ({
    uttrykk: f.uttrykk,
    forklaring: f.forklaring,
    viktighetsrangering: f.viktighetsrangering,
    kildeavsnittNummer: f.kildeavsnitt,
  }));

  const { bestaatt, forkastet } = filtrerUgyldige(
    slaaSammenDuplikater(raa),
    avsnitt,
  );

  /*
   * Et uttrykk kan bestå verbatim-kravet og likevel ikke få noen markering:
   * det skjer når teksten bare har ordet som del av et sammensatt ord, siden
   * `finnForekomster` krever ordgrenser. Et begrep uten markering kan ikke
   * vises i lesevisningen, så det forkastes her framfor å havne i
   * begrepslisten som en oppføring eleven aldri finner igjen i teksten.
   */
  const medMarkering: Begrepskandidat[] = [];
  const utenMarkering = [...forkastet];

  for (const k of bestaatt) {
    if (finnForekomster(k.uttrykk, avsnitt).length > 0) {
      medMarkering.push(k);
    } else {
      utenMarkering.push({
        kandidat: k,
        aarsak: "ingen forekomst på ordgrense (står bare i sammensatt ord)",
      });
    }
  }

  /*
   * Kappingen måler tetthet på forekomster slått sammen per uttrykk, altså
   * FØR overlapp fjernes. Det overvurderer tettheten litt der to uttrykk
   * dekker samme tekst, og kapper derfor marginalt hardere enn strengt
   * nødvendig. Retningen er med vilje: SM-C1 sier at flere markeringer ikke
   * er bedre, så en feilmargin som gir færre markeringer er den trygge.
   *
   * Kappingen bestemmer BÅDE hvilke begreper som beholdes og hvilke
   * markeringer som vises — de to kan ikke avgjøres hver for seg, fordi to av
   * de tre takene teller markeringer og ett teller begreper.
   */
  const kapping = kappEtterRangering(
    medMarkering,
    (uttrykk) => finnForekomster(uttrykk, avsnitt),
    avsnitt,
  );
  const beholdt = kapping.beholdt;

  const kappet = medMarkering
    .filter((k) => beholdt.includes(k) === false)
    .map((kandidat) => ({ kandidat, aarsak: "kappet av tetthetstaket" }));

  const samlet = fjernOverlapp(kapping.forekomster);

  const begreper: Begrep[] = beholdt
    .map((k) => ({
      ...k,
      // Bare de markeringene som overlevde overlappsfjerningen. Ellers ville
      // et begrep påstått en markering visningen ikke tegner.
      forekomster: samlet.filter(
        (f) => f.uttrykk.toLowerCase() === k.uttrykk.trim().toLowerCase(),
      ),
    }))
    .sort((a, b) => a.viktighetsrangering - b.viktighetsrangering);

  return {
    begreper,
    forekomster: samlet,
    forkastet: [...utenMarkering, ...kappet],
    tetthet: maalTetthet(samlet, avsnitt),
    kappetrinn: kapping.trinn,
    promptversjon: svar.promptversjon,
    modell: svar.modell,
  };
}
