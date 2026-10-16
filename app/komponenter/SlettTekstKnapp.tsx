"use client";

/**
 * Sletting av én Tekst — FR-37.
 *
 * FR-37 krever at sletting bekreftes, og at bekreftelsen navngir hva som
 * forsvinner. Derfor to trinn: «Slett» åpner en bekreftelse med tekstens
 * tittel og alt som går med den, og først «Slett for godt» sletter.
 * Selve slettingen skjer i `slett` på serveren, med eierskapssjekk (AD-8);
 * alt generert innhold går med via fremmednøklenes cascade.
 */

import { useRouter } from "next/navigation";
import { useState } from "react";
import { slett } from "../handlinger";

export function SlettTekstKnapp({ tekstId, tittel }: { tekstId: string; tittel: string }) {
  const router = useRouter();
  const [bekrefter, setBekrefter] = useState(false);
  const [venter, setVenter] = useState(false);
  const [feilet, setFeilet] = useState(false);

  if (!bekrefter) {
    return (
      <button
        type="button"
        onClick={() => setBekrefter(true)}
        className="text-sm text-slate-600 underline underline-offset-4 hover:text-red-700 focus:outline-2 focus:outline-offset-2 dark:text-slate-400 dark:hover:text-red-400"
      >
        Slett
      </button>
    );
  }

  return (
    <div role="alertdialog" aria-label={`Slette «${tittel}»?`} className="mt-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm dark:border-red-800 dark:bg-red-950/40">
      <p className="font-medium">Slette «{tittel}»?</p>
      <p className="mt-1">
        Teksten, fagordene, quizen og alle forsøkene dine forsvinner for godt,
        og kan ikke hentes tilbake.
      </p>
      {feilet && (
        <p role="alert" className="mt-2 font-medium text-red-800 dark:text-red-300">
          Teksten kunne ikke slettes. Den er kanskje alt slettet — last siden på nytt.
        </p>
      )}
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          disabled={venter}
          onClick={async () => {
            setVenter(true);
            setFeilet(false);
            const { slettet } = await slett(tekstId).catch(() => ({ slettet: false }));
            if (slettet) {
              router.push("/");
              router.refresh();
            } else {
              setVenter(false);
              setFeilet(true);
            }
          }}
          className="rounded-md bg-red-700 px-3 py-1.5 font-medium text-white hover:bg-red-800 focus:outline-2 focus:outline-offset-2 focus:outline-red-700 disabled:opacity-60"
        >
          {venter ? "Sletter…" : "Slett for godt"}
        </button>
        <button
          type="button"
          disabled={venter}
          onClick={() => setBekrefter(false)}
          className="rounded-md px-3 py-1.5 font-medium underline underline-offset-4"
        >
          Avbryt
        </button>
      </div>
    </div>
  );
}
