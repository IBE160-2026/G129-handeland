/**
 * §5 — ingen feiltilstand er en blindvei.
 *
 * Kravet er at hver feil sier hva som gikk galt, på vanlig norsk, og tilbyr
 * minst én konkret neste handling. Komponenten tar derfor BEGGE som påkrevde
 * felter: det er ikke mulig å vise en feil her uten å ha skrevet en anbefaling,
 * og «noe gikk galt» uten vei videre kompilerer ikke.
 *
 * `role="alert"` gjør at skjermlesere leser meldingen når den kommer, uten at
 * eleven må finne den selv.
 */

type Props = {
  melding: string;
  handling: string;
};

export function Feilmelding({ melding, handling }: Props) {
  return (
    <div
      role="alert"
      className="my-4 rounded-md border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/40"
    >
      <p className="font-medium text-red-900 dark:text-red-200">{melding}</p>
      <p className="mt-1 text-red-800 dark:text-red-300">{handling}</p>
    </div>
  );
}
