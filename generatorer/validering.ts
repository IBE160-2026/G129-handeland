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
 * AD-11, settnivå: bryter settet en tetthetsgrense, KAPPES det etter
 * viktighetsrangering — lavest først — framfor å forkastes.
 *
 * Gulvet er «inntil 5», ikke «minst 5». Finnes det tre gyldige Faguttrykk,
 * beholdes tre. Finnes det null, beholdes null. Et gulv ville tvunget
 * modellen til å finne opp uttrykk, i strid med verbatim-kravet i samme FR.
 */
export function kappEtterRangering(
  kandidater: Begrepskandidat[],
  forekomsterFor: (uttrykk: string) => Forekomst[],
  avsnitt: Avsnitt[],
): Begrepskandidat[] {
  const sortert = [...kandidater].sort(
    (a, b) => a.viktighetsrangering - b.viktighetsrangering,
  );

  let beholdt = sortert;
  while (beholdt.length > 0) {
    const forekomster = beholdt.flatMap((k) => forekomsterFor(k.uttrykk));
    if (maalTetthet(forekomster, avsnitt).innenfor) break;
    if (beholdt.length <= TETTHETSTAK.gulvForKorteTekster) break;
    beholdt = beholdt.slice(0, -1);
  }

  return beholdt;
}
