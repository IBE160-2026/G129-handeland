/**
 * AD-13 — forekomstsettet.
 *
 * Et Faguttrykk er ikke en markering. Markeringen er *hvor i teksten* uttrykket
 * står, og det kan være flere steder. AD-13 sier at forekomstsettet eies,
 * lagres, og er det eneste visningen leser — lesevisningen skal aldri lete
 * etter uttrykket selv, fordi to søk gjort på to steder før eller siden gir to
 * ulike svar.
 *
 * Her er regnestykket som lager settet. Det hører i `tekst/` og ikke i
 * `generatorer/`, fordi det er ren tekstbehandling: ingenting her kjenner
 * modellen, og måleharnessen bruker samme funksjon som appen.
 */

import type { Avsnitt } from "./avsnittsdeling";

/**
 * Én markering: hvilket uttrykk, hvilket avsnitt, og tegnspennet innenfor
 * det avsnittet.
 *
 * At uttrykket er med, og ikke bare posisjonen, er nødvendig av to grunner:
 *
 * 1. **FR-7 måler «unike Faguttrykk per 1 000 ord».** Uten uttrykket kan
 *    målingen ikke skille tre begreper som står fem ganger hver fra femten
 *    begreper som står én gang. Det er to helt ulike sider, og bare det
 *    andre er et gult teppe.
 * 2. **Visningen må vite hvilken forklaring en markering hører til.** Dette
 *    speiler `forekomst.begrep_id` i databasen; her er uttrykket nøkkelen,
 *    siden generatorlaget ikke kjenner database-id-er (AD-10).
 */
export type Forekomst = {
  uttrykk: string;
  avsnittNummer: number;
  start: number;
  slutt: number;
};

/**
 * Er tegnet på denne posisjonen en del av et ord?
 *
 * Brukes til å avgjøre om et treff står alene eller er inni et lengre ord.
 * Bokstavklassen må dekke norsk: `\w` i JavaScript dekker ikke æ, ø og å med
 * mindre regexen er unicode-bevisst, og et treff på «lov» inni «løvtre» ville
 * ellers sluppet gjennom i den ene retningen og ikke i den andre.
 */
function erOrdtegn(tegn: string | undefined): boolean {
  if (tegn === undefined) return false;
  return /[\p{L}\p{N}]/u.test(tegn);
}

/**
 * Alle steder uttrykket står i teksten.
 *
 * To regler, begge med konsekvenser eleven ser:
 *
 * 1. **Ufølsom for store og små bokstaver.** Et uttrykk som står først i en
 *    setning er samme uttrykk. Samme regel som `erVerbatim` i valideringen —
 *    de to må være enige, ellers kan et uttrykk bestå verbatim-kravet og
 *    likevel ikke få noen markering.
 *
 * 2. **Treffet må stå på egne ordgrenser.** «mitose» markeres ikke inni
 *    «mitosefasen». Uten denne regelen ville visningen understreket halve ord,
 *    som ser ut som en feil selv når uttrykket faktisk er der. Sammensetninger
 *    er vanlige i norsk fagspråk, så dette er ikke et kantfenomen.
 *
 * Merk at regel 2 betyr at et uttrykk kan bestå verbatim-kravet uten å få en
 * forekomst — nettopp når teksten bare har det som del av et sammensatt ord.
 * Det håndteres av kalleren: et begrep uten forekomster kan ikke markeres.
 */
export function finnForekomster(
  uttrykk: string,
  avsnitt: Avsnitt[],
): Forekomst[] {
  const naal = uttrykk.trim().toLowerCase();
  if (naal.length === 0) return [];

  const ut: Forekomst[] = [];

  for (const a of avsnitt) {
    const h = a.innhold.toLowerCase();
    let fra = 0;

    for (;;) {
      const i = h.indexOf(naal, fra);
      if (i === -1) break;

      const slutt = i + naal.length;
      const foer = i === 0 ? undefined : a.innhold[i - 1];
      const etter = a.innhold[slutt];

      if (erOrdtegn(foer) === false && erOrdtegn(etter) === false) {
        // Uttrykket lagres slik det ble bedt om, ikke slik det står i
        // teksten: det er nøkkelen tilbake til begrepet og forklaringen.
        ut.push({ uttrykk: uttrykk.trim(), avsnittNummer: a.nummer, start: i, slutt });
      }

      // Rykk fram ett tegn, ikke lengden av nålen: overlappende treff på
      // samme uttrykk er sjeldne, men å hoppe over dem stille er verre enn
      // å bruke et øyeblikk mer på søket.
      fra = i + 1;
    }
  }

  return ut;
}

/**
 * Fjerner overlappende markeringer fra et samlet forekomstsett.
 *
 * Problemet oppstår når to Faguttrykk dekker samme tekst — «energi» og «indre
 * energi» er begge gyldige uttrykk, og teksten inneholder begge på samme sted.
 * Uten denne funksjonen ville visningen tegnet to markeringer oppå hverandre,
 * og eleven ville sett et rot som ingen av de to begrepene fortjener.
 *
 * Regelen er **lengste treff vinner**, og ved likt lengde det som står først.
 * Lengste vinner fordi det er det mest spesifikke: «indre energi» sier mer enn
 * «energi», og det er det mest spesifikke begrepet eleven trenger forklart.
 */
export function fjernOverlapp(forekomster: Forekomst[]): Forekomst[] {
  const sortert = [...forekomster].sort((a, b) => {
    if (a.avsnittNummer !== b.avsnittNummer) {
      return a.avsnittNummer - b.avsnittNummer;
    }
    const lengdeA = a.slutt - a.start;
    const lengdeB = b.slutt - b.start;
    if (lengdeA !== lengdeB) return lengdeB - lengdeA; // lengst først
    return a.start - b.start;
  });

  const beholdt: Forekomst[] = [];

  for (const f of sortert) {
    const kolliderer = beholdt.some(
      (b) =>
        b.avsnittNummer === f.avsnittNummer &&
        f.start < b.slutt &&
        b.start < f.slutt,
    );
    if (kolliderer === false) beholdt.push(f);
  }

  // Tilbake i dokumentrekkefølge. Visningen leser settet i rekkefølge, og
  // sorteringen over var etter lengde, ikke etter posisjon.
  return beholdt.sort((a, b) =>
    a.avsnittNummer !== b.avsnittNummer
      ? a.avsnittNummer - b.avsnittNummer
      : a.start - b.start,
  );
}
