/**
 * Når tekstene ikke kunne hentes — EXPERIENCE.md, Inngang og arbeidsbord
 * («Henting feiler»). Ingen blindvei (§5): «Prøv igjen» laster siden på nytt.
 *
 * DESIGN.md, danger-message: lys feilflate med feilfarget kant på startsiden.
 */

import { KNAPP_SEKUNDAER } from "./knapper";

export function Hentefeil({ igjen }: { igjen: string }) {
  return (
    <div role="alert" className="mt-6 rounded-md border-s-4 border-fare bg-fareflate p-4">
      <p className="font-bold">Vi fikk ikke hentet tekstene dine.</p>
      <p className="mt-3">
        {/* En vanlig lenke, så siden hentes helt på nytt fra serveren. */}
        <a href={igjen} className={KNAPP_SEKUNDAER}>
          Prøv igjen
        </a>
      </p>
    </div>
  );
}
