/**
 * Lesevisningens markering av Faguttrykk — FR-9, AD-13.
 *
 * ## Hvorfor denne komponenten ikke leter etter uttrykkene selv
 *
 * Den får forekomstsettet som inndata og tegner presis de spennene det sier.
 * Den søker ikke i teksten. Det er AD-13, og begrunnelsen er at to søk gjort
 * på to steder før eller siden gir to ulike svar — da ville Lesevisningen og
 * Øvekortene vist ulike sett, og avvikstesten i FR-16 målt ingenting.
 *
 * ## Tilgjengelighet
 *
 * §5 krever at Kjerneløypen kan fullføres med tastatur alene, at markerte
 * Faguttrykk er fokuserbare, og at forklaringen er tilgjengelig for
 * skjermleser. Derfor er hver markering et `<button>` og ikke et `<span>`:
 * den er i tabulatorrekkefølgen av seg selv, og `aria-describedby` knytter
 * forklaringen til den uten å kreve at musepekeren er over.
 *
 * Markeringen bruker både bakgrunn OG understreking. §5 sier at ingen
 * informasjon formidles ved farge alene.
 *
 * Selve markeringen, med forklaringen ved ordet (FR-10), er `Fagord`.
 */

import { Fagord } from "./Fagord";

type Markering = {
  start: number;
  slutt: number;
  begrepId: string;
  uttrykk: string;
  forklaring: string;
  morsmaal?: { tekst: string; kode: string; retning: "ltr" | "rtl" };
};

type Props = {
  innhold: string;
  erOverskrift: boolean;
  markeringer: Markering[];
  /** Gir avsnittet et anker, slik at quizen kan lenke rett til det (FR-15). */
  nummer?: number;
};

export function MarkertAvsnitt({ innhold, erOverskrift, markeringer, nummer }: Props) {
  const id = nummer === undefined ? undefined : `avsnitt-${nummer}`;
  // Sorteres på posisjon. Settet er alt uten overlapp (fjernOverlapp), så
  // enkel gjennomgang fra venstre til høyre er nok.
  const sortert = [...markeringer].sort((a, b) => a.start - b.start);

  const deler: React.ReactNode[] = [];
  let peker = 0;

  for (const m of sortert) {
    // Hopp over en markering som ligger utenfor innholdet. Skal ikke kunne
    // skje, men en krasj i den viktigste flaten er en dyr måte å oppdage det.
    if (m.start < peker || m.slutt > innhold.length) continue;

    if (m.start > peker) {
      deler.push(innhold.slice(peker, m.start));
    }

    deler.push(
      <Fagord
        key={`${m.begrepId}-${m.start}`}
        tekst={innhold.slice(m.start, m.slutt)}
        uttrykk={m.uttrykk}
        forklaring={m.forklaring}
        beskrivelseId={`forklaring-${m.begrepId}`}
        morsmaal={m.morsmaal}
      />,
    );

    peker = m.slutt;
  }

  if (peker < innhold.length) {
    deler.push(innhold.slice(peker));
  }

  if (erOverskrift) {
    return (
      <h2 id={id} className="mt-10 mb-3 scroll-mt-6 text-xl font-semibold tracking-tight">
        {deler}
      </h2>
    );
  }

  return (
    // data-uthevet settes av UthevAvsnitt når en lenke viser hit. Etiketten
    // sier det med ord, ikke bare med farge (§5).
    <p
      id={id}
      className="relative mb-5 scroll-mt-24 rounded-sm transition-colors data-[uthevet=true]:-mx-3 data-[uthevet=true]:mt-8 data-[uthevet=true]:border-l-4 data-[uthevet=true]:border-sky-500 data-[uthevet=true]:bg-sky-50 data-[uthevet=true]:px-3 data-[uthevet=true]:py-2 data-[uthevet=true]:before:absolute data-[uthevet=true]:before:-top-6 data-[uthevet=true]:before:left-0 data-[uthevet=true]:before:text-sm data-[uthevet=true]:before:font-semibold data-[uthevet=true]:before:text-sky-800 data-[uthevet=true]:before:content-['Her_står_det'] dark:data-[uthevet=true]:bg-sky-950/40 dark:data-[uthevet=true]:before:text-sky-300"
    >
      {deler}
    </p>
  );
}
