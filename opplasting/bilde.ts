/**
 * Bildeinnlesing i nettleseren — FR-44, AD-16.
 *
 * Bildene krympes HER, før noe sendes: høyst 2 000 piksler bredde, JPEG rundt
 * kvalitet 85. Det gjør tre ting på en gang — holder hver forespørsel under
 * leverandørens grense på 4,5 MB, gjør kallet billigere, og fjerner metadata
 * (posisjon, enhet, tidspunkt), fordi et bilde tegnet på nytt på et lerret
 * ikke tar med seg noe av den opprinnelige filens metadata.
 *
 * Ett bilde per forespørsel, så eleven ser framdrift per bilde.
 */

import { BildeFeil } from "./bilde-feil";

export const BILDEGRENSER = {
  maksBilder: 4,
  maksBredde: 2000,
  kvalitet: 0.85,
  /** Under leverandørens 4,5 MB, med margin (FR-44). */
  maksBytesPerForesporsel: 4 * 1024 * 1024,
  tidsavbruddMs: 60_000,
} as const;

const STOTTET: Record<string, string> = {
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/heic": "HEIC",
  "image/heif": "HEIC",
};

/** Formatet på en fil, fra typen eller filendelsen. */
export function formatFor(fil: { name: string; type: string }): string | null {
  if (STOTTET[fil.type]) return STOTTET[fil.type];
  const endelse = fil.name.split(".").pop()?.toLowerCase();
  if (endelse === "jpg" || endelse === "jpeg") return "JPEG";
  if (endelse === "png") return "PNG";
  if (endelse === "heic" || endelse === "heif") return "HEIC";
  return null;
}

/** BF-2 og BF-3, før noe leses: for mange bilder, eller et format som ikke støttes. */
export function sjekkValg(filer: { name: string; type: string }[]): BildeFeil | null {
  if (filer.length > BILDEGRENSER.maksBilder) return new BildeFeil("BF-2", { antall: filer.length });
  const i = filer.findIndex((f) => formatFor(f) === null);
  if (i >= 0) {
    const endelse = filer[i].name.split(".").pop()?.toUpperCase();
    return new BildeFeil("BF-3", { bilde: i + 1, format: endelse || filer[i].type || "ukjent" });
  }
  return null;
}

/** Ny størrelse innenfor maksbredden, med samme forhold. Forstørrer aldri. */
export function nyStorrelse(bredde: number, hoyde: number, maks: number = BILDEGRENSER.maksBredde) {
  if (bredde <= maks) return { bredde, hoyde };
  return { bredde: maks, hoyde: Math.round((hoyde * maks) / bredde) };
}

/** Lengden et base64-kodet innhold får. */
export const base64Lengde = (bytes: number) => Math.ceil(bytes / 3) * 4;

/* ------------------------------------------------------------------ *
 * Det som bare kan kjøres i nettleseren
 * ------------------------------------------------------------------ */

async function tilBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binaer = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binaer += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binaer);
}

/**
 * Krymper ett bilde og gjør det til JPEG uten metadata. Prøver lavere
 * kvalitet og så mindre bredde hvis det fortsatt er for stort; går det ikke,
 * BF-2. Kan nettleseren ikke lese bildet (typisk HEIC utenfor Safari), BF-3.
 */
export async function krympBilde(fil: File, nummer: number): Promise<{ data: string; bytes: number }> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(fil);
  } catch (e) {
    throw new BildeFeil("BF-3", { bilde: nummer, format: formatFor(fil) ?? "ukjent" }, e);
  }

  const forsok: [number, number][] = [
    [BILDEGRENSER.maksBredde, BILDEGRENSER.kvalitet],
    [BILDEGRENSER.maksBredde, 0.7],
    [1500, 0.7],
  ];
  let siste = 0;
  for (const [bredde, kvalitet] of forsok) {
    const s = nyStorrelse(bitmap.width, bitmap.height, bredde);
    const lerret = document.createElement("canvas");
    lerret.width = s.bredde;
    lerret.height = s.hoyde;
    lerret.getContext("2d")!.drawImage(bitmap, 0, 0, s.bredde, s.hoyde);
    const blob = await new Promise<Blob | null>((ok) => lerret.toBlob(ok, "image/jpeg", kvalitet));
    if (!blob) continue;
    siste = blob.size;
    if (base64Lengde(blob.size) < BILDEGRENSER.maksBytesPerForesporsel) {
      bitmap.close();
      return { data: await tilBase64(blob), bytes: blob.size };
    }
  }
  bitmap.close();
  throw new BildeFeil("BF-2", { bilde: nummer, storrelse: siste });
}

/**
 * Sender ett krympet bilde til serveren og får teksten tilbake. Ett automatisk
 * nytt forsøk ved tidsavbrudd eller tjenerfeil, deretter BF-5 (FR-44).
 */
export async function lesBilde(data: string, nummer: number, hent: typeof fetch = fetch): Promise<string> {
  for (let forsok = 0; forsok < 2; forsok++) {
    const avbryt = new AbortController();
    const t = setTimeout(() => avbryt.abort(), BILDEGRENSER.tidsavbruddMs);
    try {
      const svar = await hent("/api/bilde", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mediaType: "image/jpeg", data }),
        signal: avbryt.signal,
      });
      const innhold = (await svar.json().catch(() => ({}))) as { tekst?: string; kode?: string };
      if (svar.ok && innhold.tekst) return innhold.tekst;
      if (innhold.kode === "BF-1") throw new BildeFeil("BF-1", { bilde: nummer });
      if (innhold.kode === "BF-2") throw new BildeFeil("BF-2", { bilde: nummer });
      // Annet: tjenerfeil — prøv igjen.
    } catch (e) {
      if (e instanceof BildeFeil) throw e;
    } finally {
      clearTimeout(t);
    }
  }
  throw new BildeFeil("BF-5", { bilde: nummer });
}
