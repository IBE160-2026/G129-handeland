/**
 * POST /api/bilde — ett krympet bilde inn, teksten ut (FR-44).
 *
 * Krever innlogging: hvert kall koster et modellkall på prosjektets nøkkel,
 * og ruten skal ikke kunne brukes av hvem som helst. Logikken står i
 * opplasting/bilde-server.ts.
 */

import { hentAuth } from "../../../data/auth";
import { behandleBilde } from "../../../opplasting/bilde-server";

export async function POST(foresporsel: Request) {
  const oekt = await hentAuth().api.getSession({ headers: foresporsel.headers });
  if (!oekt) return Response.json({ kode: "ikke_innlogget" }, { status: 401 });

  const kropp = await foresporsel.json().catch(() => null);
  const svar = await behandleBilde(kropp);
  return Response.json(svar.kropp, { status: svar.status });
}
