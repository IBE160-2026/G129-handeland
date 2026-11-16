"use client";

/**
 * §5 — ingen feiltilstand er en blindvei.
 *
 * Kravet er at hver feil sier hva som gikk galt, på vanlig norsk, og tilbyr
 * minst én konkret neste handling. Komponenten tar derfor BEGGE som påkrevde
 * felter: det er ikke mulig å vise en feil her uten å ha skrevet en anbefaling,
 * og «noe gikk galt» uten vei videre kompilerer ikke.
 *
 * `role="alert"` gjør at skjermlesere leser meldingen når den kommer, uten at
 * eleven må finne den selv.
 *
 * KI-feil (EXPERIENCE.md, Feilmelding): meldingen har «Prøv igjen», og fokus
 * flyttes dit når meldingen vises. Enten `proevIgjen` (en vanlig knapp), eller
 * en egen knapp som `children`, for eksempel en tenkeknapp. Fokus går til den
 * første knappen i meldingen. Skal meldingen vises på nytt etter et nytt
 * mislykket forsøk, gir kalleren den en ny `key`, så den leses opp og får
 * fokus igjen.
 *
 * Bruksgrenser (PRD §6.4): har meldingen `grense`, vises ingen knapper. Et
 * nytt trykk kan ikke virke før i morgen, og meldingen sier selv hva eleven
 * kan gjøre. Handlingssvarene bærer feltet, så `{...svar.feil}` tar det med.
 */

import { useEffect, useRef, type ReactNode } from "react";
import type { Grense } from "../../data/grenser";
import { KNAPP_PRIMAER } from "./knapper";

type Props = {
  melding: string;
  handling: string;
  /** Viser «Prøv igjen» og flytter fokus dit. */
  proevIgjen?: () => void;
  /** En egen «Prøv igjen»-knapp. Fokus flyttes til den første knappen. */
  children?: ReactNode;
  /**
   * Om fokus flyttes til «Prøv igjen» når meldingen vises (standard). `false`
   * når siden lastes inn med en feil som ble lagret tidligere: da har eleven
   * ikke nettopp trykket på noe, og fokus skal ikke hoppe midt inn i siden.
   */
  fokus?: boolean;
  /** En bruksgrense er nådd (`GRENSE_FEIL` i data/grenser.ts). Da vises ingen «Prøv igjen». */
  grense?: Grense;
};

export function Feilmelding({ melding, handling, proevIgjen, children, fokus = true, grense }: Props) {
  const ramme = useRef<HTMLDivElement>(null);
  const harKnapp = grense === undefined && (proevIgjen !== undefined || children !== undefined);

  useEffect(() => {
    if (harKnapp && fokus) ramme.current?.querySelector("button")?.focus();
  }, [harKnapp, fokus]);

  return (
    <div
      ref={ramme}
      role="alert"
      data-grense={grense}
      className="my-4 rounded-md border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/40"
    >
      <p className="font-medium text-red-900 dark:text-red-200">{melding}</p>
      <p className="mt-1 text-red-800 dark:text-red-300">{handling}</p>
      {harKnapp && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {proevIgjen && (
            <button type="button" onClick={proevIgjen} className={KNAPP_PRIMAER}>
              Prøv igjen
            </button>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
