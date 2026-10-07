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
import { formaterAvsnitt, hentPrompt, kjoerGenerator } from "./kontrakt";
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
  /**
   * Selvkonsistensen som faktisk ble brukt, eller null ved ett enkelt kall.
   * Rapporteres fordi et tall maalt med fem kjoeringer ikke er sammenlignbart
   * med et maalt med ett (AD-4, samme grunn som promptversjon og modell).
   */
  konsistens: { kjoeringer: number; minstEnighet: number } | null;
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
 * Slår sammen flere uavhengige kjøringer til ett sett — selvkonsistens.
 *
 * ## Hvorfor
 *
 * Enkeltkjøringer er ustabile. Målt 8. oktober på prompt v2 og
 * claude-haiku-5-5: Jaccard 0,734 mellom to kjøringer av en fokusert tekst, og
 * 0,441 på en oversiktstekst. FR-11 krever 0,80. Promptarbeid ble forsøkt
 * først (v1 mot v2) og hjalp ikke på stabiliteten.
 *
 * Med fem kjøringer og flertallskrav ble de samme tallene 0,865 og 0,564.
 * Teknikken virker, og den gjør settet deterministisk ved konstruksjon framfor
 * ved håp.
 *
 * ## Hvordan rangeringen blir bedre på veien
 *
 * Enighet er et bedre signal på hvor sentralt et uttrykk er enn modellens egen
 * rangering. Den rangeringen hadde dessuten elendig oppløsning — 26 uttrykk
 * fordelt på fire nivåer, der ti delte nivå 2, slik at kappingen i praksis
 * avgjordes av utdatarekkefølgen. Her sorteres det primært på hvor mange
 * kjøringer som fant uttrykket, og bare sekundært på modellens tall. Et
 * uttrykk alle fem kjøringene fant er mer sentralt enn et modellen kalte
 * «1» i én kjøring og overså i fire.
 */
function slaaSammenKjoeringer(
  kjoeringer: Begrepskandidat[][],
  minstEnighet: number,
): Begrepskandidat[] {
  type Oppsamling = {
    beste: Begrepskandidat;
    enighet: number;
  };
  const samlet = new Map<string, Oppsamling>();

  for (const kjoering of kjoeringer) {
    // Innenfor ÉN kjøring teller samme uttrykk bare én gang, ellers ville en
    // kjøring som nevnte et ord to ganger fått dobbel stemmevekt.
    const settIKjoering = new Map<string, Begrepskandidat>();
    for (const k of kjoering) {
      const n = k.uttrykk.trim().toLowerCase();
      const finnes = settIKjoering.get(n);
      if (!finnes || k.viktighetsrangering < finnes.viktighetsrangering) {
        settIKjoering.set(n, k);
      }
    }

    for (const [n, k] of settIKjoering) {
      const f = samlet.get(n);
      if (!f) {
        samlet.set(n, { beste: k, enighet: 1 });
      } else {
        f.enighet += 1;
        // Representanten er oppføringen med best rangering blant kjøringene
        // som fant uttrykket. Deterministisk, og uavhengig av rekkefølgen.
        if (k.viktighetsrangering < f.beste.viktighetsrangering) f.beste = k;
      }
    }
  }

  return [...samlet.values()]
    .filter((o) => o.enighet >= minstEnighet)
    .sort(
      (a, b) =>
        b.enighet - a.enighet ||
        a.beste.viktighetsrangering - b.beste.viktighetsrangering ||
        a.beste.uttrykk.localeCompare(b.beste.uttrykk, "nb"),
    )
    // Rangeringen settes på nytt, 1 og oppover uten hull. Kappingen i AD-11
    // forutsetter at rangeringen skiller, og enigheten gjør den nå det.
    .map((o, i) => ({ ...o.beste, viktighetsrangering: i + 1 }));
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
  const brukermelding = formaterAvsnitt(avsnitt);
  const oppsett = await hentPrompt("faguttrykk", valg.overstyrVersjon);
  const k = oppsett.konsistens;

  const kall = () =>
    kjoerGenerator({
      oppgave: "faguttrykk",
      skjema: FaguttrykkSkjema,
      brukermelding,
      overstyrVersjon: valg.overstyrVersjon,
    });

  const tilKandidater = (
    svar: Awaited<ReturnType<typeof kall>>,
  ): Begrepskandidat[] =>
    svar.data.faguttrykk.map((f) => ({
      uttrykk: f.uttrykk,
      forklaring: f.forklaring,
      viktighetsrangering: f.viktighetsrangering,
      kildeavsnittNummer: f.kildeavsnitt,
    }));

  let svar: Awaited<ReturnType<typeof kall>>;
  let raa: Begrepskandidat[];
  let enighetBrukt: Faguttrykksresultat["konsistens"];

  if (!k || k.kjoeringer <= 1) {
    svar = await kall();
    raa = slaaSammenDuplikater(tilKandidater(svar));
    enighetBrukt = null;
  } else {
    /*
     * Kallene går parallelt. Fem sekvensielle kall ville tatt et halvt minutt
     * og gjort §5-kravet om synlig ventetid til et løfte vi måtte innfri;
     * parallelt tar de omtrent like lang tid som ett.
     */
    const utfall = await Promise.allSettled(
      Array.from({ length: k.kjoeringer }, () => kall()),
    );
    const vellykkede = utfall.filter(
      (u): u is PromiseFulfilledResult<Awaited<ReturnType<typeof kall>>> =>
        u.status === "fulfilled",
    );

    /*
     * Vi trenger bare `minstEnighet` kjøringer for å kunne avgjøre noe, så et
     * par feilede kall skal ikke felle hele operasjonen. Men faller vi under
     * den grensen, er det ikke lenger selvkonsistens — og da kastes den
     * første feilen framfor å levere et sett som ser ut som et flertall uten
     * å være det.
     */
    if (vellykkede.length < k.minstEnighet) {
      const foersteFeil = utfall.find((u) => u.status === "rejected");
      throw (foersteFeil as PromiseRejectedResult | undefined)?.reason ??
        new Error("Ingen av kjøringene lyktes.");
    }

    svar = vellykkede[0].value;
    raa = slaaSammenKjoeringer(
      vellykkede.map((u) => tilKandidater(u.value)),
      k.minstEnighet,
    );
    enighetBrukt = {
      kjoeringer: vellykkede.length,
      minstEnighet: k.minstEnighet,
    };
  }

  const { bestaatt, forkastet } = filtrerUgyldige(raa, avsnitt);

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
    konsistens: enighetBrukt,
    promptversjon: svar.promptversjon,
    modell: svar.modell,
  };
}
