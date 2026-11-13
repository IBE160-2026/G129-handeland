"use client";

/**
 * Menyen i topplinjen — EXPERIENCE.md, Topplinje.
 *
 * «Arbeidsbord», «Samlingen» og «Konto». Aktivt valg har
 * `aria-current="page"`, og vises med markeringsflate og understrek
 * (globals.css, .meny-lenke). På telefon nås «Arbeidsbord» via ordmerket, så
 * bare den lenken skjules der; «Samlingen» og «Konto» står fortsatt.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

const LENKE = "meny-lenke inline-flex min-h-11 items-center whitespace-nowrap rounded-md px-3 font-bold hover:bg-markering";

const VALG = [
  { href: "/", tekst: "Arbeidsbord", skjulPaaTelefon: true },
  { href: "/samling", tekst: "Samlingen", skjulPaaTelefon: false },
  { href: "/konto", tekst: "Konto", skjulPaaTelefon: false },
] as const;

export function Meny() {
  const sti = usePathname();
  return (
    <ul className="flex flex-wrap items-center gap-1">
      {VALG.map((v) => (
        <li key={v.href} className={v.skjulPaaTelefon ? "hidden min-[760px]:block" : undefined}>
          <Link href={v.href} aria-current={sti === v.href ? "page" : undefined} className={LENKE}>
            {v.tekst}
          </Link>
        </li>
      ))}
    </ul>
  );
}
