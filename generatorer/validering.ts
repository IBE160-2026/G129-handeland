/**
 * AD-11 — skjemavalidering før lagring, ugyldig forkastes.
 *
 * Her ligger de maskinsjekkbare kravene i FR-7 som rene funksjoner. De er
 * rene av to grunner: de skal kjøre i `npm test` uten å kalle modellen
 * (aksen i AD-5), og måleharnessen skal bruke nøyaktig de samme
 * funksjonene som produksjonskoden (AD-1).
 *
 * AD-11 skiller to nivåer, og skillet er kodet inn her:
 *
 *   ELEMENTBRUDD  et enkelt Faguttrykk bryter et krav → elementet forkastes.
 *   SETTBRUDD     settet bryter en tetthetsgrense → settet KAPPES etter
 *                 viktighetsrangering, lavest først. Det forkastes ikke.
 */

import type { Avsnitt } from "../tekst/avsnittsdeling";
import { antallOrd } from "../tekst/avsnittsdeling";
import type { Forekomst } from "../tekst/forekomster";

/** Et kandidatbegrep slik generatoren leverer det, før validering. */
export type Begrepskandidat = {
  uttrykk: string;
  forklaring: string;
  viktighetsrangering: number;
  kildeavsnittNummer: number;
};

/**
 * En enkelt markering i teksten. AD-13.
 *
 * Typen eies av `tekst/forekomster.ts`, der regnestykket som lager settet
 * ligger. Den re-eksporteres her fordi tetthetsmålingene under tar den som
 * inndata, og et kallsted skal ikke trenge to importer for én operasjon.
 */
export type { Forekomst };

/* ------------------------------------------------------------------ *
 * Elementnivå — FR-7
 * ------------------------------------------------------------------ */

/**
 * FR-7: hvert Faguttrykk forekommer ordrett i Teksten. Terskel 100 prosent,
 * uten unntak. Et uttrykk som ikke består, kastes før visning.
 *
 * Sammenligningen er ufølsom for store og små bokstaver, fordi et uttrykk som
 * står først i en setning er samme uttrykk. Den er ikke ufølsom for bøyning —
 * «mitosen» er ikke «mitose», og generatoren skal oppgi formen som står i
 * teksten.
 */
export function erVerbatim(uttrykk: string, avsnitt: Avsnitt[]): boolean {
  const naal = uttrykk.trim().toLowerCase();
  if (naal.length === 0) return false;
  return avsnitt.some((a) => a.innhold.toLowerCase().includes(naal));
}

/**
 * FR-7: ingen forklaring er sirkulær. Forklaringen kan ikke bestå utelukkende
 * av uttrykket selv med bøyninger eller ordklasseendring.
 *
 * Regelen er bevisst grov: den fanger den åpenbare sirkulariteten
 * («Mitose er mitose»), ikke den subtile. Den subtile er en faglig vurdering,
 * og den hører i den manuelle gjennomgangen i FR-8 — ikke i en regex.
 */
export function erSirkulaer(uttrykk: string, forklaring: string): boolean {
  const stamme = uttrykk.trim().toLowerCase();
  if (stamme.length === 0) return true;

  const meningsbaerende = forklaring
    .toLowerCase()
    .replace(/[.,;:!?()«»"']/g, " ")
    .split(/\s+/)
    .filter((o) => o.length > 0)
    .filter((o) => FYLLORD.has(o) === false)
    // Fjern ord som er uttrykket selv, eller en bøyning av det.
    .filter((o) => erSammeStamme(o, stamme) === false);

  return meningsbaerende.length === 0;
}

/** Norske fyllord som ikke gjør en forklaring mindre sirkulær. */
const FYLLORD = new Set([
  "er",
  "en",
  "et",
  "ei",
  "den",
  "det",
  "de",
  "som",
  "og",
  "eller",
  "av",
  "i",
  "på",
  "til",
  "for",
  "med",
  "at",
  "å",
  "kalles",
  "betyr",
  "vil",
  "si",
  "altså",
]);

/** Grov bøyningssjekk: deler ordene samme stamme på minst fire tegn? */
function erSammeStamme(ord: string, stamme: string): boolean {
  if (ord === stamme) return true;
  const kort = Math.min(ord.length, stamme.length);
  if (kort < 4) return false;
  return ord.startsWith(stamme.slice(0, Math.max(4, kort - 3)));
}

/** Kildeavsnittet må finnes i den mottatte avsnittslisten. AD-10. */
export function harGyldigKildeavsnitt(
  kandidat: Begrepskandidat,
  avsnitt: Avsnitt[],
): boolean {
  return avsnitt.some((a) => a.nummer === kandidat.kildeavsnittNummer);
}

/**
 * Elementnivå samlet. Returnerer de kandidatene som består, og hvorfor de
 * andre falt — årsaken er det måleharnessen og KI-loggen trenger.
 */
export function filtrerUgyldige(
  kandidater: Begrepskandidat[],
  avsnitt: Avsnitt[],
): {
  bestaatt: Begrepskandidat[];
  forkastet: { kandidat: Begrepskandidat; aarsak: string }[];
} {
  const bestaatt: Begrepskandidat[] = [];
  const forkastet: { kandidat: Begrepskandidat; aarsak: string }[] = [];

  for (const k of kandidater) {
    if (erVerbatim(k.uttrykk, avsnitt) === false) {
      forkastet.push({ kandidat: k, aarsak: "ikke verbatim i teksten" });
    } else if (harGyldigKildeavsnitt(k, avsnitt) === false) {
      forkastet.push({ kandidat: k, aarsak: "kildeavsnitt utenfor listen" });
    } else if (erSirkulaer(k.uttrykk, k.forklaring)) {
      forkastet.push({ kandidat: k, aarsak: "sirkulær forklaring" });
    } else {
      bestaatt.push(k);
    }
  }

  return { bestaatt, forkastet };
}

/* ------------------------------------------------------------------ *
 * Settnivå — tetthetstakene i FR-7
 * ------------------------------------------------------------------ */

/** Tallene fra FR-7. Samlet her slik at ingen kallsted har sin egen kopi. */
export const TETTHETSTAK = {
  /** Høyst 4 prosent av løpende ord markert. */
  andelAvOrd: 0.04,
  /** Høyst 12 unike Faguttrykk per 1 000 ord. */
  unikePerTusenOrd: 12,
  /** Høyst 3 markeringer per 100 sammenhengende ord. */
  perHundreSammenhengende: 3,
  /** Inntil 5 beholdes i korte tekster selv om prosentgrensen brytes. */
  gulvForKorteTekster: 5,
} as const;

export type Tetthetsmaal = {
  /** Antall markeringer eleven ser. */
  antallForekomster: number;
  /** Antall ulike Faguttrykk blant markeringene. */
  antallUnike: number;
  antallOrd: number;
  andelAvOrd: number;
  unikePerTusenOrd: number;
  hoeyesteVindu: number;
  innenfor: boolean;
};

/**
 * Regner alle tre målene i FR-7.
 *
 * To av dem gjelder MARKERINGENE, altså det eleven faktisk ser (AD-13):
 * andelen av løpende ord, og det høyeste antallet i et vindu på 100 ord.
 *
 * Det tredje gjelder UNIKE FAGUTTRYKK, fordi FR-7 sier «høyst 12 unike
 * Faguttrykk per 1 000 ord». Skillet er ikke pedantisk: tre begreper som står
 * fem ganger hver, og femten begreper som står én gang, gir samme antall
 * markeringer men er helt ulike sider. Det første er en tekst med tre
 * gjennomgangsbegreper, det andre er et gult teppe. En tidligere versjon av
 * denne funksjonen telte unike *posisjoner* og kunne derfor ikke skille dem.
 */
export function maalTetthet(
  forekomster: Forekomst[],
  avsnitt: Avsnitt[],
): Tetthetsmaal {
  const ord = antallOrd(avsnitt);
  const unike = new Set(
    forekomster.map((f) => f.uttrykk.trim().toLowerCase()),
  ).size;

  const andel = ord === 0 ? 0 : forekomster.length / ord;
  const perTusen = ord === 0 ? 0 : (unike / ord) * 1000;
  const vindu = hoeyesteVindu(forekomster, avsnitt);

  const innenfor =
    andel <= TETTHETSTAK.andelAvOrd &&
    perTusen <= TETTHETSTAK.unikePerTusenOrd &&
    vindu <= TETTHETSTAK.perHundreSammenhengende;

  return {
    antallForekomster: forekomster.length,
    antallUnike: unike,
    antallOrd: ord,
    andelAvOrd: andel,
    unikePerTusenOrd: perTusen,
    hoeyesteVindu: vindu,
    innenfor,
  };
}

/**
 * Det tredje målet, og det som fanger det de to andre slipper gjennom:
 * et snitt over hele teksten kan skjule at ett avsnitt er nedlesset.
 * Glidende vindu på 100 ord, høyeste antall markeringer i noe vindu.
 */
function hoeyesteVindu(forekomster: Forekomst[], avsnitt: Avsnitt[]): number {
  // Bygg en flat ordposisjon per forekomst, i dokumentrekkefølge.
  const ordFoerAvsnitt = new Map<number, number>();
  let loepende = 0;
  for (const a of avsnitt) {
    ordFoerAvsnitt.set(a.nummer, loepende);
    loepende += antallOrd([a]);
  }

  const posisjoner = forekomster
    .map((f) => {
      const foer = ordFoerAvsnitt.get(f.avsnittNummer);
      if (foer === undefined) return null;
      const a = avsnitt.find((x) => x.nummer === f.avsnittNummer)!;
      const ordFoerIAvsnitt = a.innhold
        .slice(0, f.start)
        .split(/\s+/)
        .filter((o) => o.length > 0).length;
      return foer + ordFoerIAvsnitt;
    })
    .filter((p): p is number => p !== null)
    .sort((a, b) => a - b);

  let hoeyest = 0;
  for (let i = 0; i < posisjoner.length; i++) {
    let antall = 0;
    for (let j = i; j < posisjoner.length; j++) {
      if (posisjoner[j] - posisjoner[i] < 100) antall++;
      else break;
    }
    if (antall > hoeyest) hoeyest = antall;
  }
  return hoeyest;
}

/**
 * Hvor mange Faguttrykk antallstaket tillater i en tekst av denne lengden.
 *
 * Dette er tallet FR-7 alt har bestemt — «høyst 12 unike Faguttrykk per
 * 1 000 ord» — bare regnet ut. For 794 ord blir det 9.
 *
 * Gulvet gjelder korte tekster: for 200 ord ville taket gitt 2, og FR-7 sier
 * at inntil 5 kan beholdes likevel, slik at en kort tekst ikke ender med ett
 * markert ord. Merk at det er et TAK og ikke et mål: finnes det tre gyldige
 * Faguttrykk, beholdes tre.
 */
export function begrepsbudsjett(avsnitt: Avsnitt[]): number {
  const ord = antallOrd(avsnitt);
  const fraTak = Math.floor((TETTHETSTAK.unikePerTusenOrd * ord) / 1000);
  return Math.max(fraTak, TETTHETSTAK.gulvForKorteTekster);
}

export type Kappet = {
  beholdt: Begrepskandidat[];
  /** Markeringene som skal vises. Kan være færre enn alle forekomstene. */
  forekomster: Forekomst[];
  /** Hvilket trinn som fikk settet innenfor. Rapporteres, ikke skjules. */
  trinn:
    | "ingen"
    | "antallstak"
    | "en_per_avsnitt"
    | "en_per_begrep"
    | "rapportert_brutt";
};

/**
 * AD-11, settnivå: bryter settet en tetthetsgrense, kappes det — framfor å
 * forkastes.
 *
 * ## Hvorfor dette er fire trinn og ikke én løkke
 *
 * Den første utgaven kuttet bare hele Faguttrykk nedenfra, og den oppførte
 * seg galt på en måte som først ble synlig i en ekte kjøring: på en NDLA-tekst
 * med 26 gyldige Faguttrykk kuttet den 21 av dem, ned til gulvet på 5, og
 * tetthetsmålet var *fortsatt* brutt.
 *
 * Grunnen var at to av de tre takene teller MARKERINGER, mens den eneste
 * knappen var å fjerne BEGREPER. Å fjerne «sølvklorid», som står én gang,
 * fjerner én markering — mens opphopningen kom fra «radiobølger» og «synlig
 * lys» med fem markeringer hver, som var vernet av høy rangering. Den ofret
 * altså dekningen for å rette et problem de beholdte selv forårsaket, og den
 * kuttet forbi de 9 begrepene antallstaket faktisk tillater.
 *
 * Rekkefølgen under retter det ved å bruke den billigste knappen først:
 *
 *   1. antallstak        kutt til `begrepsbudsjett`. Deterministisk, og det er
 *                        tallet kravet alt har bestemt.
 *   2. én per avsnitt    hvert Faguttrykk markeres høyst én gang per avsnitt.
 *                        Beholder hjelp der leseren er.
 *   3. én per begrep     hvert Faguttrykk markeres bare første gang.
 *
 * Begreper fjernes BARE i trinn 1, altså bare for antallstaket. Et fjernet
 * Faguttrykk er et fagord eleven ikke får forklart, mens en fjernet markering
 * bare er samme ord uthevet én gang mindre. Er vindustaket fortsatt brutt
 * etter trinn 3, rapporteres det som brutt — se begrunnelsen nederst i
 * funksjonen, som er målt og ikke antatt.
 */
export function kappEtterRangering(
  kandidater: Begrepskandidat[],
  forekomsterFor: (uttrykk: string) => Forekomst[],
  avsnitt: Avsnitt[],
): Kappet {
  const sortert = [...kandidater].sort(
    (a, b) => a.viktighetsrangering - b.viktighetsrangering,
  );

  // Trinn 1 — antallstaket. Skjer alltid, uavhengig av om noe er brutt.
  let beholdt = sortert.slice(0, begrepsbudsjett(avsnitt));

  const alle = () => beholdt.flatMap((k) => forekomsterFor(k.uttrykk));

  const enPerAvsnitt = () =>
    beholdt.flatMap((k) => {
      const sett = new Set<number>();
      return forekomsterFor(k.uttrykk).filter((f) => {
        if (sett.has(f.avsnittNummer)) return false;
        sett.add(f.avsnittNummer);
        return true;
      });
    });

  const enPerBegrep = () =>
    beholdt.flatMap((k) => forekomsterFor(k.uttrykk).slice(0, 1));

  const innenfor = (f: Forekomst[]) => maalTetthet(f, avsnitt).innenfor;

  let forekomster = alle();
  if (innenfor(forekomster)) {
    return {
      beholdt,
      forekomster,
      trinn: beholdt.length < sortert.length ? "antallstak" : "ingen",
    };
  }

  forekomster = enPerAvsnitt();
  if (innenfor(forekomster)) {
    return { beholdt, forekomster, trinn: "en_per_avsnitt" };
  }

  forekomster = enPerBegrep();

  /*
   * Og her stopper kappingen, også når vindustaket fortsatt er brutt.
   *
   * Grunnen er målt og ikke antatt. På NDLA-teksten ligger førsteforekomstene
   * til de fem viktigste Faguttrykkene i avsnitt 1, 2, 3, 3 og 22 — fire av
   * dem innenfor de første hundre ordene, fordi åpningsavsnittet er der
   * fagspråket introduseres. Vindustaket kan dermed IKKE oppfylles så lenge
   * hvert beholdt Faguttrykk skal ha minst én markering. Ordene står der de
   * står.
   *
   * En tidligere utgave kuttet videre for å jage vinduet. Den endte på fem
   * begreper av 26 og brøt taket likevel — altså ofret 21 fagord eleven ikke
   * fikk forklart, for ingenting. Å kutte et Faguttrykk er det dyreste
   * virkemidlet vi har, og det skal bare brukes for antallstaket, som er det
   * taket som faktisk handler om hvor mange begreper en tekst tåler.
   *
   * Vindustaket rapporteres derfor som brutt når det er brutt. Det er samme
   * regel FR-7 alt fastsetter for gulvet: tetthetstallene er måletall, ikke
   * garantier om det eleven ser.
   */
  return {
    beholdt,
    forekomster,
    trinn: innenfor(forekomster) ? "en_per_begrep" : "rapportert_brutt",
  };
}
