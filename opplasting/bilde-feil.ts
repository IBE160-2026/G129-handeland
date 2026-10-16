/**
 * De navngitte feiltilstandene for bildeinnlesing — FR-44.
 *
 * Samme regel som FR-4: hver feil sier hva som gikk galt og hva eleven kan
 * gjøre, aldri et teknisk spor. BF-4 (lite tekst) er ingen feil her —
 * gjennomsynet vises likevel, så eleven kan skrive inn resten selv.
 */

export type BildeFeilkode = "BF-1" | "BF-2" | "BF-3" | "BF-5";

export type BildeValg = "ta_nytt" | "fjern_bilder" | "lim_inn" | "prov_igjen";

export type BildeFeildetaljer = {
  /** Hvilket bilde det gjelder, 1-basert. */
  bilde?: number;
  antall?: number;
  storrelse?: number;
  format?: string;
};

export class BildeFeil extends Error {
  constructor(
    readonly kode: BildeFeilkode,
    readonly detaljer: BildeFeildetaljer = {},
    aarsak?: unknown,
  ) {
    super(kode);
    this.name = "BildeFeil";
    if (aarsak instanceof Error) this.cause = aarsak;
  }
}

const mb = (b: number) => `${(b / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
const iBilde = (d: BildeFeildetaljer) => (d.bilde ? ` i bilde ${d.bilde}` : "");

export function bildeFeilmelding(kode: BildeFeilkode, d: BildeFeildetaljer = {}): { melding: string; handling: string; valg: BildeValg[] } {
  switch (kode) {
    case "BF-1":
      return {
        melding: `Det ble ikke funnet tekst${iBilde(d)}.`,
        handling: "Ta et nytt bilde i bedre lys, rett ovenfra og nærme nok til at teksten er skarp — eller lim inn teksten.",
        valg: ["ta_nytt", "lim_inn"],
      };
    case "BF-2":
      return {
        melding:
          d.antall !== undefined
            ? `Du har valgt ${d.antall} bilder. Lesevenn tar høyst 4 per tekst.`
            : `${d.bilde ? `Bilde ${d.bilde}` : "Bildet"} er på ${mb(d.storrelse ?? 0)} selv etter krymping. Grensen er 4 MB.`,
        handling:
          d.antall !== undefined
            ? "Fjern bildene du ikke trenger. Ta bare bilder av sidene du skal lese."
            : "Ta bildet på nytt med lavere oppløsning, eller fjern det.",
        valg: ["fjern_bilder"],
      };
    case "BF-3":
      return {
        melding: `Formatet ${d.format ?? "på filen"} kan ikke leses${iBilde(d)}.`,
        handling:
          d.format === "HEIC"
            ? "Nettleseren din kan ikke lese HEIC-bilder. Velg «Mest kompatibel» under Kamera i innstillingene på telefonen, eller ta skjermbilde av bildet og bruk det."
            : "Lesevenn leser JPEG-, PNG- og HEIC-bilder. Velg et bilde i et av disse formatene.",
        valg: ["fjern_bilder", "lim_inn"],
      };
    case "BF-5":
      return {
        melding: `Det tok for lang tid å lese teksten${iBilde(d)}.`,
        handling: "Bildene er beholdt. Prøv igjen, eller lim inn teksten.",
        valg: ["prov_igjen", "lim_inn"],
      };
  }
}

export const BILDEVALGTEKST: Record<BildeValg, string> = {
  ta_nytt: "Ta et nytt bilde",
  fjern_bilder: "Endre bildene",
  lim_inn: "Lim inn teksten i stedet",
  prov_igjen: "Prøv igjen",
};
