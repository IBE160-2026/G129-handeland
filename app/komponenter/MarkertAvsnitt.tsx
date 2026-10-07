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
 */

type Markering = {
  start: number;
  slutt: number;
  begrepId: string;
  uttrykk: string;
};

type Props = {
  innhold: string;
  erOverskrift: boolean;
  markeringer: Markering[];
};

export function MarkertAvsnitt({ innhold, erOverskrift, markeringer }: Props) {
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
      <button
        key={`${m.begrepId}-${m.start}`}
        type="button"
        aria-describedby={`forklaring-${m.begrepId}`}
        className="rounded-sm bg-amber-100 px-0.5 underline decoration-amber-600 decoration-2 underline-offset-2 hover:bg-amber-200 focus:outline-2 focus:outline-offset-2 focus:outline-amber-700 dark:bg-amber-900/50 dark:decoration-amber-400 dark:hover:bg-amber-900"
      >
        {innhold.slice(m.start, m.slutt)}
      </button>,
    );

    peker = m.slutt;
  }

  if (peker < innhold.length) {
    deler.push(innhold.slice(peker));
  }

  if (erOverskrift) {
    return (
      <h2 className="mt-10 mb-3 text-xl font-semibold tracking-tight">
        {deler}
      </h2>
    );
  }

  return <p className="mb-5">{deler}</p>;
}
