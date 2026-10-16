"use client";

/**
 * Kopierer en tekst til utklippstavlen — FR-30: Suno-prompten skal kunne
 * limes rett inn. Statusen leses opp av skjermleser (aria-live).
 */

import { useState } from "react";

export function Kopier({ tekst, hva }: { tekst: string; hva: string }) {
  const [status, settStatus] = useState("");

  async function kopier() {
    try {
      await navigator.clipboard.writeText(tekst);
      settStatus(`${hva} er kopiert.`);
    } catch {
      settStatus("Kopieringen virket ikke. Merk teksten og kopier den selv.");
    }
  }

  return (
    <span className="inline-flex items-center gap-3">
      <button
        type="button"
        onClick={kopier}
        className="rounded-md border border-slate-400 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 focus:outline-2 focus:outline-offset-2 focus:outline-slate-900 dark:border-slate-600 dark:hover:bg-slate-800"
      >
        Kopier {hva.toLowerCase()}
      </button>
      <span aria-live="polite" className="text-sm text-slate-600 dark:text-slate-400">
        {status}
      </span>
    </span>
  );
}
