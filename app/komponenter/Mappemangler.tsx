/**
 * Hva en Tekst i en Mappe mangler for de samlede aktivitetene — FR-51, FR-52.
 *
 * Mappen lager aldri noe selv. En Tekst uten låst tilstand, uten fagord eller
 * uten quiz vises med hva som mangler og en lenke dit det lages, i Teksten.
 * Felles for mappesiden, øvekortene og quizen, så ordlyden er den samme.
 *
 * Ren visning uten klientkode.
 */

import Link from "next/link";
import type { Mappetekst } from "../../data/mapper";

const LENKE = "inline-flex min-h-11 items-center font-bold underline decoration-primaer underline-offset-4";

/** Hva Teksten mangler for Øvekortene, eller null når den har kort. */
export function kortmangel(t: Mappetekst): { tekst: string; lenke: { href: string; tekst: string } } | null {
  if (t.tilstand !== "laast") {
    return { tekst: "Ikke lest ferdig ennå, så den har ingen øvekort.", lenke: { href: `/tekst/${t.id}/aktivering`, tekst: "Gå til teksten" } };
  }
  if (t.antallFagord === null) {
    return { tekst: "Fagordene er ikke funnet ennå.", lenke: { href: `/tekst/${t.id}/lesing`, tekst: "Finn fagordene i teksten" } };
  }
  if (t.antallFagord === 0) {
    return { tekst: "Ingen fagord i teksten, så den har ingen øvekort.", lenke: { href: `/tekst/${t.id}/oppgaver`, tekst: "Se oppgavene til teksten" } };
  }
  return null;
}

/** Hva Teksten mangler for den samlede Quizen, eller null når den har quiz. */
export function quizmangel(t: Mappetekst): { tekst: string; lenke: { href: string; tekst: string } } | null {
  if (t.tilstand !== "laast") {
    return { tekst: "Ikke lest ferdig ennå, så den har ingen quiz.", lenke: { href: `/tekst/${t.id}/aktivering`, tekst: "Gå til teksten" } };
  }
  if (!t.antallSporsmal) {
    return { tekst: "Quiz ikke laget ennå.", lenke: { href: `/tekst/${t.id}/quiz`, tekst: "Lag quizen i teksten" } };
  }
  return null;
}

/**
 * Listen over Tekstene som ikke er med i en samlet aktivitet, og hvorfor.
 * Vises ikke når alle er med.
 */
export function Mangler({
  tekster,
  mangel,
  overskrift,
}: {
  tekster: Mappetekst[];
  mangel: typeof kortmangel;
  overskrift: string;
}) {
  const med = tekster.map((t) => ({ t, m: mangel(t) })).filter((x) => x.m !== null);
  if (med.length === 0) return null;
  return (
    <section className="mt-10" aria-labelledby="mangler-tittel">
      <h2 id="mangler-tittel" className="text-[1.5rem]">
        {overskrift}
      </h2>
      <ul className="mt-3 divide-y divide-kant border-y border-kant">
        {med.map(({ t, m }) => (
          <li key={t.id} className="py-3">
            <p className="font-bold [overflow-wrap:anywhere]">{t.tittel}</p>
            <p className="mt-1">{m!.tekst}</p>
            <Link href={m!.lenke.href} className={LENKE}>
              {m!.lenke.tekst}
              <span className="sr-only"> «{t.tittel}»</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
