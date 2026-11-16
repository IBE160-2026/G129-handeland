/**
 * POST /api/bilde — ett krympet bilde inn, teksten ut (FR-44).
 *
 * Krever innlogging: hvert kall koster et modellkall på prosjektets nøkkel,
 * og ruten skal ikke kunne brukes av hvem som helst. Logikken står i
 * opplasting/bilde-server.ts.
 *
 * PRD §6.4: har kontoen lagt inn 5 tekster i dag, sendes bildet ikke til
 * modellen (BF-7), fordi teksten ikke kan lagres uansett. Kallet går under
 * dagstaket (`underTaket`); er taket nådd, er svaret BF-6. Tokenbruken
 * registreres etterpå, også når uttrekket feilet.
 */

import { tekstgrenseNaadd, underTaket } from "../../../data/forbruk";
import { GrenseNaadd } from "../../../data/grenser";
import { tilgangForForesporsel } from "../../../data/konto";
import { behandleBilde } from "../../../opplasting/bilde-server";

export async function POST(foresporsel: Request) {
  const t = await tilgangForForesporsel(foresporsel.headers);
  if (!t) return Response.json({ kode: "ikke_innlogget" }, { status: 401 });
  if (await tekstgrenseNaadd(t)) return Response.json({ kode: "BF-7" }, { status: 429 });

  const kropp = await foresporsel.json().catch(() => null);
  try {
    const svar = await underTaket(t, (vakt) => behandleBilde(kropp, vakt));
    return Response.json(svar.kropp, { status: svar.status });
  } catch (e) {
    if (e instanceof GrenseNaadd) return Response.json({ kode: "BF-6" }, { status: 429 });
    throw e;
  }
}
