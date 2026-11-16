/**
 * Hva samtalesiden viser under hver runde — FR-19, FR-20, FR-22.
 *
 * Ren funksjon over rundene, så reglene kan testes uten siden og uten
 * database. Siden (`app/tekst/[id]/samtale/[samtaleId]/page.tsx`) tegner bare
 * det denne sier.
 *
 * Kjent begrensning: en vurdering som fortsatt pågår (i en annen fane), ser
 * ut som en feilet vurdering ved ny innlasting, fordi rundene ikke har noe
 * tidsstempel for når svaret ble lagret. Å skille dem krever en ny kolonne
 * og dermed en migrering.
 */

import type { Runde } from "./fagsamtale";

export type Rundevisning = {
  nummer: number;
  /** FR-19: svaret er lagret, men vurderingen feilet. Runden telles ikke. */
  vurderingFeilet: boolean;
  /**
   * FR-20: siste runde er vurdert, men samtalen er verken avsluttet eller har
   * fått neste spørsmål. Det skjer bare når oppfølgingen feilet.
   */
  oppfolgingFeilet: boolean;
  /** FR-22: en vurdert runde kan leses på nytt én gang. */
  kanRevurderes: boolean;
  /** Runden eleven skal svare på nå: det første ubesvarte spørsmålet i en åpen samtale. */
  svarSkjema: boolean;
};

export function samtalevisning(runder: readonly Runde[], avsluttet: boolean): Rundevisning[] {
  const siste = runder.at(-1);
  const aktiv = avsluttet ? undefined : runder.find((r) => r.elevsvar === null);
  return runder.map((r) => ({
    nummer: r.nummer,
    vurderingFeilet: !avsluttet && r.elevsvar !== null && r.svarvurdering === null,
    oppfolgingFeilet: !avsluttet && r === siste && r.svarvurdering !== null,
    kanRevurderes: r.svarvurdering !== null && !r.revurdert,
    svarSkjema: aktiv === r,
  }));
}
