/**
 * De sju navngitte feiltilstandene for PDF — FR-4.
 *
 * Hver har sin egen melding og sin egen anbefalte handling, og ingen viser et
 * teknisk feilspor eller en generisk «noe gikk galt». `valg` er handlingene
 * grensesnittet skal tilby som knapper — testen i pdf.test.ts sjekker at de
 * faktisk vises.
 */

export type PdfFeilkode = "PF-1" | "PF-2" | "PF-3" | "PF-5" | "PF-6" | "PF-7";
// PF-4 (spalter i feil rekkefølge) oppdages ikke automatisk. Den fanges av
// gjennomsynet i FR-3, som sier fra om det — se gjennomsynssiden.

/** Handlinger grensesnittet kan tilby. */
export type Valg = "lim_inn" | "bilde" | "prov_igjen" | "velg_annen";

export type PdfFeildetaljer = {
  storrelse?: number;
  sider?: number;
};

export class PdfFeil extends Error {
  constructor(
    readonly kode: PdfFeilkode,
    readonly detaljer: PdfFeildetaljer = {},
    aarsak?: unknown,
  ) {
    super(kode);
    this.name = "PdfFeil";
    if (aarsak instanceof Error) this.cause = aarsak;
  }
}

const mb = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;

export function pdfFeilmelding(
  kode: PdfFeilkode,
  d: PdfFeildetaljer = {},
): { melding: string; handling: string; valg: Valg[] } {
  switch (kode) {
    case "PF-1":
      return {
        melding: "Filen ser ut til å være et bilde av en tekst.",
        handling:
          "Lesevenn leser ikke bilder inne i en PDF. Ta bilder av sidene i stedet, eller lim inn teksten.",
        valg: ["bilde", "lim_inn"],
      };
    case "PF-2":
      return {
        melding: "Filen er låst med passord.",
        handling: "Åpne den i en PDF-leser og lagre en kopi uten passord, eller lim inn teksten.",
        valg: ["velg_annen", "lim_inn"],
      };
    case "PF-3":
      return {
        melding: "Filen kunne ikke åpnes som PDF.",
        handling: "Kontroller at det er riktig fil og at den ikke er skadet, eller lim inn teksten.",
        valg: ["velg_annen", "lim_inn"],
      };
    case "PF-5":
      return {
        melding:
          d.sider !== undefined
            ? `Filen har ${d.sider} sider. Lesevenn tar høyst 40.`
            : `Filen er på ${mb(d.storrelse ?? 0)}. Lesevenn tar høyst 10 MB.`,
        handling: "Del filen i mindre deler og last opp den du trenger, eller lim inn begynnelsen av teksten.",
        valg: ["velg_annen", "lim_inn"],
      };
    case "PF-6":
      return {
        melding: "Det ble funnet for lite tekst i filen til å lage en leseløype.",
        handling: "Lim inn teksten, eller velg en annen fil.",
        valg: ["lim_inn", "velg_annen"],
      };
    case "PF-7":
      return {
        melding: "Det tok for lang tid å lese filen.",
        handling: "Filen er fortsatt valgt. Prøv igjen, eller lim inn teksten.",
        valg: ["prov_igjen", "lim_inn"],
      };
  }
}

export const VALGTEKST: Record<Valg, string> = {
  lim_inn: "Lim inn teksten i stedet",
  bilde: "Ta bilder av sidene",
  prov_igjen: "Prøv igjen",
  velg_annen: "Velg en annen fil",
};
