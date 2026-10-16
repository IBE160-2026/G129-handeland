/**
 * Topplinjen på alle sider: vei hjem og til kontoen.
 *
 * Bevisst uten øktoppslag. «Konto» vises alltid; uten innlogging sender
 * kontosiden eleven til innlogging (data/konto.ts). Et oppslag her ville gjort
 * hver side, også 404-siden, avhengig av en databaseforespørsel.
 */

import Link from "next/link";

const LENKE =
  "rounded-md px-3 py-1.5 font-medium hover:bg-slate-100 focus:outline-2 focus:outline-offset-2 focus:outline-slate-900 dark:hover:bg-slate-800";

export function Topplinje() {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800">
      <nav
        aria-label="Hovedmeny"
        className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <Link href="/" className="mr-2 text-lg font-semibold tracking-tight">
            Lesevenn
          </Link>
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
