/**
 * Topplinjen på alle sider: ordmerket (vei hjem), «Hjem» og kontoen.
 *
 * Bevisst uten øktoppslag. «Konto» vises alltid; uten innlogging sender
 * kontosiden eleven til innlogging (data/konto.ts). Et oppslag her ville gjort
 * hver side, også 404-siden, avhengig av en databaseforespørsel.
 *
 * DESIGN.md, top-bar: bakgrunn og kant fra tokenene, minst 64 px høy, og
 * lenkene er minst 44 px. Menyen («Arbeidsbord», «Samlingen») kommer senere.
 */

import Link from "next/link";
import { Ordmerke } from "./Ordmerke";

const LENKE =
  "inline-flex min-h-11 items-center rounded-md px-3 font-bold hover:bg-markering";

export function Topplinje() {
  return (
    <header className="border-b border-kant bg-bakgrunn">
      <nav
        aria-label="Hovedmeny"
        className="mx-auto flex min-h-16 w-full max-w-5xl items-center justify-between gap-4 px-4 py-2"
      >
        <div className="flex items-center gap-2">
          <Ordmerke className="mr-2 text-[1.625rem]" />
          <Link href="/" className={LENKE}>
            Hjem
          </Link>
        </div>
        <Link href="/konto" className={LENKE}>
          Konto
        </Link>
      </nav>
    </header>
  );
}
