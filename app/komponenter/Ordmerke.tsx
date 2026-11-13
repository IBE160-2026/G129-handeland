/**
 * Ordmerket — DESIGN.md, wordmark (4d, foreløpig valg).
 *
 * «lese» i Instrument Serif kursiv i tekstfarge, B-merket litt større enn
 * bokstavene (0,9 em) med 0,16 em luft før, og «uddy» i Quicksand 700 i
 * primærfargen. Så leses «lese» som et forord og «Buddy» som ett fiolett ord.
 *
 * Hele merket er én lenke til forsiden. Skjermlesere hører bare navnet
 * «LeseBuddy, forsiden»; delene er skjult.
 */

import Link from "next/link";
import { BuddyMerke } from "./Merke";

export function Ordmerke({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex min-h-11 items-center rounded-md px-1 text-tekst ${className}`}>
      <span aria-hidden="true" className="inline-flex items-baseline whitespace-nowrap leading-none">
        <span className="font-serif italic">lese</span>
        <BuddyMerke variant="b" storrelse="0.9em" className="mr-[0.01em] ml-[0.16em] self-baseline" />
        <span className="font-ordmerke font-bold text-primaer">uddy</span>
      </span>
      {/*
        Navnet står som skjult tekst, ikke som aria-label: B-en er en tegning,
        så den synlige teksten er «lese…uddy», og en aria-label som ikke
        inneholder den, regnes som et avvik fra 2.5.3 (axe:
        label-content-name-mismatch). Skjermleseren hører det samme.
      */}
      <span className="sr-only">LeseBuddy, forsiden</span>
    </Link>
  );
}
