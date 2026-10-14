/**
 * Better Auths HTTP-ruter: innlogging, registrering, utlogging, sletting.
 *
 * Handleren bygges ved første forespørsel og ikke når modulen lastes, fordi
 * `next build` evaluerer rutefiler uten at hemmeligheten nødvendigvis finnes.
 */

import { toNextJsHandler } from "better-auth/next-js";
import { hentAuth } from "../../../../data/auth";

export async function GET(forespoersel: Request) {
  return toNextJsHandler(hentAuth()).GET(forespoersel);
}

export async function POST(forespoersel: Request) {
  return toNextJsHandler(hentAuth()).POST(forespoersel);
}
