"use client";

/**
 * Tenkeindikatoren — DESIGN.md (thinking-indicator) og EXPERIENCE.md
 * (Component Patterns, State Patterns).
 *
 * Én felles visning for all venting på språkmodellen (§5):
 *
 *   - Statusregionen (`role="status"`) rendres ALLTID, også når ingenting
 *     venter, så den finnes tom i siden før teksten skrives inn. Ellers er det
 *     tilfeldig om skjermleseren sier noe.
 *   - Mens `aktiv`: brilleansiktet (64 px) med øyne som leser i en løkke, og
 *     statusteksten i fet skrift. Etter 30 s kommer et tillegg.
 *   - Går den fra aktiv til ikke aktiv med `ferdigStatus`, spilles
 *     avslutningen (4,3 s) én gang i indikatorens plass, og statusen settes
 *     til `ferdigStatus`. Uten `ferdigStatus` (feil, eller siden byttes)
 *     forsvinner indikatoren bare.
 *
 * Med `prefers-reduced-motion` står øynene stille, og avslutningen viser B-en
 * direkte (globals.css). Statusteksten bærer beskjeden.
 */

import { useEffect, useState } from "react";
import { BuddyMerke } from "./Merke";

const LANG_VENTING_MS = 30_000;
/** Avslutningen er 4,3 s; B-en blir stående litt før indikatoren går. */
const AVSLUTNING_MS = 4300 + 1200;
export const LANG_VENTING_TEKST = "Dette tar lenger tid enn vanlig. Buddy jobber fortsatt.";

export function Tenker({
  aktiv,
  status,
  hjelp,
  ferdigStatus,
  bareAvslutning = false,
  className = "",
}: {
  aktiv: boolean;
  /** Hva Buddy gjør, for eksempel «Buddy finner fagordene …». */
  status: string;
  /** En kort linje under statusen, for eksempel hvor lenge det pleier å ta. */
  hjelp?: string;
  /** Settes bare når svaret kom og komponenten lever videre, for eksempel «Quizen er rettet.». */
  ferdigStatus?: string;
  /**
   * Vis bare avslutningen, ikke selve ventingen. Brukes der svaret vises et
   * annet sted enn knappen (quizen ruller til resultatet øverst), mens en
   * annen Tenker ved knappen viser ventingen.
   */
  bareAvslutning?: boolean;
  /** Avstand rundt indikatoren når den vises. */
  className?: string;
}) {
  // Avledet tilstand fra forrige `aktiv`, regnet ut under rendring (ikke i en
  // effekt), så avslutningen starter i samme tegning som svaret vises.
  const [forrigeAktiv, settForrigeAktiv] = useState(aktiv);
  const [sluttTekst, settSluttTekst] = useState<string | null>(null);
  const [lenge, settLenge] = useState(false);
  const [montert, settMontert] = useState(false);

  if (aktiv !== forrigeAktiv) {
    settForrigeAktiv(aktiv);
    settSluttTekst(!aktiv && ferdigStatus ? ferdigStatus : null);
    settLenge(false);
  }

  // Regionen skal finnes tom før teksten kommer, også når komponenten
  // monteres midt i en venting (quizen som lages av seg selv).
  useEffect(() => {
    const id = requestAnimationFrame(() => settMontert(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!aktiv) return;
    const t = setTimeout(() => settLenge(true), LANG_VENTING_MS);
    return () => clearTimeout(t);
  }, [aktiv]);

  useEffect(() => {
    if (sluttTekst === null) return;
    const t = setTimeout(() => settSluttTekst(null), AVSLUTNING_MS);
    return () => clearTimeout(t);
  }, [sluttTekst]);

  const avslutter = !aktiv && sluttTekst !== null;
  // `bareAvslutning`: vis ingenting mens det ventes, bare avslutningen etterpå.
  const synlig = (aktiv && !bareAvslutning) || avslutter;
  const innhold = !synlig ? null : avslutter ? (
    <p className="font-bold">{sluttTekst}</p>
  ) : (
    <>
      <p className="font-bold">{status}</p>
      {hjelp && <p className="text-dempet">{hjelp}</p>}
      {lenge && <p className="text-dempet">{LANG_VENTING_TEKST}</p>}
    </>
  );

  return (
    <div className={synlig ? `flex items-center gap-4 ${className}` : "contents"}>
      {synlig && <BuddyMerke variant="ansikt" tilstand={aktiv ? "tenker" : "slutt"} storrelse={64} />}
      {/*
        Før montering (serverrendringen og første tegning) står teksten som en
        synlig kopi utenfor regionen, skjult for skjermlesere. Regionen er tom
        til etter montering, så den finnes før teksten skrives inn.
      */}
      {synlig && !montert && (
        <div aria-hidden="true" className="min-w-0">
          {innhold}
        </div>
      )}
      <div role="status" aria-live="polite" className={synlig && montert ? "min-w-0" : "sr-only"}>
        {montert && innhold}
      </div>
    </div>
  );
}
