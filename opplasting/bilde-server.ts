/**
 * Serversiden av bildeinnlesingen — FR-44, AD-16.
 *
 * Tar imot ett krympet bilde, kaller modellen, og svarer med teksten — eller
 * med en feilkode nettleseren kan gjøre om til en melding. Bildet holdes i
 * minnet gjennom kallet og skrives aldri noe sted.
 *
 * Skilt ut fra ruten (app/api/bilde/route.ts) så den kan testes uten
 * innlogging og uten HTTP.
 */

import { z } from "zod";
import { IngenTekstIBilde, lesTekstFraBilde } from "../generatorer/bildeuttrekk";
import { BILDEGRENSER } from "./bilde";

const Foresporsel = z.object({
  mediaType: z.literal("image/jpeg"),
  data: z.string().regex(/^[A-Za-z0-9+/]+=*$/, "ikke base64"),
});

export type Bildesvar = { status: number; kropp: { tekst?: string; kode?: string } };

export async function behandleBilde(kropp: unknown): Promise<Bildesvar> {
  const f = Foresporsel.safeParse(kropp);
  if (!f.success) return { status: 400, kropp: { kode: "BF-3" } };
  // AD-16: grensen håndheves i klienten, men også her.
  if (f.data.data.length > BILDEGRENSER.maksBytesPerForesporsel) return { status: 413, kropp: { kode: "BF-2" } };

  try {
    const r = await lesTekstFraBilde({ mediaType: "image/jpeg", data: f.data.data });
    return { status: 200, kropp: { tekst: r.tekst } };
  } catch (e) {
    if (e instanceof IngenTekstIBilde) return { status: 422, kropp: { kode: "BF-1" } };
    // Alt annet — modellfeil, tidsavbrudd, kvote — er BF-5 for eleven.
    return { status: 503, kropp: { kode: "BF-5" } };
  }
}
