/**
 * En bruksgrense som er nådd når siden tegnes — PRD §6.4, EXPERIENCE.md
 * (State Patterns: Bruksgrenser).
 *
 * Står der handlingen ellers ville vært: på Ny tekst før innlesingen, og på
 * quizen i stedet for tenkeindikatoren. Ingen deaktivert knapp, og ingen
 * `role="alert"`: eleven har ikke gjort noe galt, og siden har ikke byttet
 * innhold under henne. Meldingen sier hva som er nådd og når det åpner igjen.
 * Når en grense nås etter et trykk, viser Feilmelding den samme teksten.
 *
 * Ren visning uten klientkode, så den kan tegnes på serveren.
 */

import Link from "next/link";
import type { Feiltekst } from "../kifeil";
import { KNAPP_SEKUNDAER } from "./knapper";

export function Grensemelding({
  melding,
  handling,
  grense,
  lenke,
}: Feiltekst & {
  /** En vei videre, for eksempel arbeidsbordet. */
  lenke?: { href: string; tekst: string };
}) {
  return (
    <div
      data-grense={grense}
      className="my-4 rounded-md border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900"
    >
      <p className="font-medium">{melding}</p>
      <p className="mt-1">{handling}</p>
      {lenke && (
        <p className="mt-3">
          <Link href={lenke.href} className={KNAPP_SEKUNDAER}>
            {lenke.tekst}
          </Link>
        </p>
      )}
    </div>
  );
}
