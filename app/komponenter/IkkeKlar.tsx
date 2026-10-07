/**
 * Vises i stedet for en side når ingenting kan gi en `Tilgang` — altså i
 * drift, til innlogging er satt opp (FR-35).
 *
 * Dette er ikke en feilside. Det er et bevisst valg: alternativet var å la
 * alle besøkende dele én konto, og da ville den første elevens tekster vært
 * synlige for den neste. Appen gjør seg heller utilgjengelig i drift enn å
 * være åpen på de vilkårene.
 *
 * Hver side som leser data sjekker `innloggingKlar()` øverst og returnerer
 * denne. Det er gjentakelse, og begrunnelsen for at det likevel er riktig står
 * i `data/konto.ts`: layouten kan ikke hindre at sidesegmentet evalueres.
 */

export function IkkeKlar() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Lesevenn</h1>
      <p className="mt-4">
        Appen er under utvikling, og innlogging er ikke satt opp ennå. Derfor er
        den ikke åpen her — uten innlogging ville alle besøkende delt samme
        konto, og tekstene dine ville vært synlige for andre.
      </p>
      <p className="mt-4 text-slate-600 dark:text-slate-400">
        Hele kjerneløypen kan kjøres lokalt uten nøkler eller egen konto.
        Stegene står i README i prosjektets repo.
      </p>
    </main>
  );
}
