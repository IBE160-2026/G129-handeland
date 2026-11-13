/**
 * Topplinjen på alle sider: ordmerket (vei til forsiden) og menyen.
 *
 * To menyer, og siden bestemmer hvilken som vises:
 *   - inne i appen: «Arbeidsbord», «Samlingen» og «Konto» (Meny)
 *   - på landingssiden, for den som ikke er innlogget: «For lærere» (bare
 *     fra 760 px) og «Logg inn»
 *
 * Bevisst uten øktoppslag. Et oppslag her ville gjort hver side, også
 * 404-siden, avhengig av en databaseforespørsel. Byttet gjøres i stedet i CSS
 * (globals.css, .meny-landing): finnes landingssiden i dokumentet, er det
 * fordi `/` fant at ingen er innlogget (data/konto.ts, valgfriTilgang). Det
 * virker uten JavaScript, og den skjulte menyen er `display: none`, så den
 * heller ikke nås med tastatur eller skjermleser.
 *
 * DESIGN.md, top-bar: bakgrunn og kant fra tokenene, minst 64 px høy, og
 * lenkene er minst 44 px. Aktivt menyvalg står i Meny (klientkomponent, fordi
 * den leser adressen).
 */

import Link from "next/link";
import { KNAPP_PRIMAER } from "./knapper";
import { Meny } from "./Meny";
import { Ordmerke } from "./Ordmerke";

export function Topplinje() {
  return (
    <header className="border-b border-kant bg-bakgrunn">
      <nav
        aria-label="Hovedmeny"
        className="mx-auto flex min-h-16 w-full max-w-[70rem] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 min-[760px]:px-5"
      >
        <Ordmerke className="text-[1.625rem]" />
        <div className="meny-app">
          <Meny />
        </div>
        <ul className="meny-landing items-center gap-3">
          <li className="hidden min-[760px]:block">
            <a
              href="#laerere"
              className="inline-flex min-h-11 items-center rounded-md px-3 font-bold underline decoration-primaer decoration-2 underline-offset-4 hover:bg-markering"
            >
              For lærere
            </a>
          </li>
          <li>
            <Link href="/logg-inn" className={KNAPP_PRIMAER}>
              Logg inn
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
