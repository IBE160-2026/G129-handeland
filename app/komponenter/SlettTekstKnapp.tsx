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
        className="inline-flex min-h-11 items-center px-1 text-dempet underline underline-offset-4 hover:text-fare"
      >
        Slett<span className="sr-only"> «{tittel}»</span>
      </button>
    );
  }

  return (
    <div role="alertdialog" aria-label={`Slette «${tittel}»?`} className="mt-2 rounded-md border-s-4 border-fare bg-fareflate p-3 text-sm">
      <p className="font-medium">Slette «{tittel}»?</p>
      <p className="mt-1">
        Teksten, fagordene, quizen, øvekortene, fagsamtalene og minneversene
        forsvinner for godt, og kan ikke hentes tilbake.
      </p>
      {feilet && (
        <p role="alert" className="mt-2 font-bold text-fare">
          Teksten ble ikke slettet. Prøv igjen, eller last siden på nytt hvis den alt er borte.
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
              router.push("/samling");
              router.refresh();
            } else {
              setVenter(false);
              setFeilet(true);
            }
          }}
          className="fylt min-h-11 rounded-md bg-fare px-3 py-1.5 font-bold text-bakgrunn hover:brightness-94 disabled:opacity-60"
        >
          {venter ? "Sletter…" : "Slett for godt"}
        </button>
        <button
          type="button"
          disabled={venter}
          onClick={() => setBekrefter(false)}
          className="rounded-md px-3 py-1.5 font-bold underline underline-offset-4"
        >
          Avbryt
        </button>
      </div>
    </div>
  );
}
