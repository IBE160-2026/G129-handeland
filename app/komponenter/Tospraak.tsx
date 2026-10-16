/**
 * Morsmålstekst ved siden av norsk — FR-25.
 *
 * `lang` og `dir` settes på morsmålsteksten alene. Da får skjermleseren riktig
 * uttale, og arabisk, urdu, dari, persisk og sorani går høyre-til-venstre uten
 * at den norske teksten ved siden av flytter seg.
 *
 * Komponenten tegner ALDRI morsmål i stedet for norsk: den har ingen norsk
 * tekst å erstatte. Norsk tegnes av kalleren, og dette legges til under.
 */

import type { Spraak } from "../../morsmaal/spraak";

export function Morsmaalstekst({
  spraak,
  tekst,
  som = "p",
  className = "",
}: {
  spraak: Spraak;
  tekst: string | undefined;
  som?: "p" | "span" | "li";
  className?: string;
}) {
  if (!tekst) return null;
  const Tag = som;
  return (
    <Tag
      lang={spraak.kode}
      dir={spraak.retning}
      className={`text-slate-700 dark:text-slate-300 ${spraak.retning === "rtl" ? "text-right" : ""} ${className}`}
    >
      {tekst}
    </Tag>
  );
}

/** FR-24: merknaden for Modellstøttet språk. Kort, og den står der hver gang. */
export function Spraakmerknad({ spraak, kvalitetssikret }: { spraak: Spraak; kvalitetssikret: boolean }) {
  if (kvalitetssikret) return null;
  return (
    <p className="text-xs text-slate-500">
      {spraak.navn}: oversatt av en språkmodell. Ingen har kontrollert oversettelsen.
    </p>
  );
}
