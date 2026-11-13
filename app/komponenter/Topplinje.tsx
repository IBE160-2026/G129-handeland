/**
 * Topplinjen på alle sider: ordmerket (vei til arbeidsbordet) og menyen
 * («Arbeidsbord», «Samlingen», «Konto»).
 *
 * Bevisst uten øktoppslag. Menyen vises alltid; uten innlogging sender sidene
 * eleven til innlogging (data/konto.ts). Et oppslag her ville gjort hver side,
 * også 404-siden, avhengig av en databaseforespørsel.
 *
 * DESIGN.md, top-bar: bakgrunn og kant fra tokenene, minst 64 px høy, og
 * lenkene er minst 44 px. Aktivt menyvalg står i Meny (klientkomponent, fordi
 * den leser adressen).
 */

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
        <Meny />
      </nav>
    </header>
  );
}
