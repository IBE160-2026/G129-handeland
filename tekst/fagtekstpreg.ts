/**
 * FR-7: mykt varsel når teksten ikke ser ut som en fagtekst.
 *
 * Varselet vises bare når Begrepssettet er tomt eller nær tomt OG teksten
 * har trekk som peker bort fra fagtekst: svært korte setninger,
 * replikkmarkører, listepreg. Det er en opplysning, aldri en sperre — og
 * tersklene er grove med vilje, fordi PRD-en sier at de ikke kan finjusteres
 * uten data Lesevenn ikke har.
 *
 * Råteksten leses linje for linje, ikke avsnittslisten: avsnittsdelingen slår
 * sammen linjer, og da forsvinner nettopp listene og replikkene.
 */

/** «Nær tomt»: så få Faguttrykk eller færre. */
export const NAER_TOMT = 2;

export function trekkBortFraFagtekst(tekst: string): string[] {
  const linjer = tekst
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (linjer.length === 0) return [];

  const grunner: string[] = [];
  const setninger = linjer
    .join(" ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.split(/\s+/).filter(Boolean).length)
    .filter((n) => n > 0);
  const snitt = setninger.reduce((a, b) => a + b, 0) / setninger.length;
  if (setninger.length >= 5 && snitt < 6) grunner.push("svært korte setninger");

  const replikker = linjer.filter((l) => /^[–—-]\s|^[«"]/.test(l)).length;
  if (replikker >= 3 && replikker / linjer.length >= 0.25) grunner.push("replikker");

  const punkter = linjer.filter((l) => /^([-•*·]|\d+[.)])\s/.test(l)).length;
  if (punkter >= 4 && punkter / linjer.length >= 0.4) grunner.push("listepreg");

  return grunner;
}

export function visFagtekstvarsel(tekst: string, antallFaguttrykk: number): string[] {
  return antallFaguttrykk <= NAER_TOMT ? trekkBortFraFagtekst(tekst) : [];
}
