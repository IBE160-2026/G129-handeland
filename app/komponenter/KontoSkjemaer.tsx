"use client";

/**
 * Skjemaene for konto — FR-35 og FR-37.
 *
 * Klientkomponenter, fordi de snakker med Better Auths HTTP-ruter gjennom
 * `authKlient`. Det er der begrensningen av innloggingsforsøk ligger; en
 * server action som kalte `auth.api` direkte ville gått forbi den.
 */

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { INVITASJONSKODE_HEADER } from "../../data/invitasjon";
import { authKlient } from "./authKlient";
import { Feilmelding } from "./Feilmelding";

type Feil = { melding: string; handling: string };

/**
 * Oversetter Better Auths feilkoder til §5-form: hva som gikk galt, og hva
 * eleven kan gjøre. Ukjente koder får en generell melding framfor den
 * engelske teksten fra biblioteket.
 */
function somFeil(
  feil: { status?: number; code?: string } | null | undefined,
): Feil {
  if (feil?.status === 429) {
    return {
      melding: "For mange forsøk på kort tid.",
      handling: "Vent et minutt, og prøv igjen.",
    };
  }
  switch (feil?.code) {
    case "INVALID_EMAIL_OR_PASSWORD":
      return {
        melding: "E-post eller passord er feil.",
        handling:
          "Sjekk at du har skrevet riktig. Har du glemt passordet, må du lage en ny konto — Lesevenn sender ikke e-post, og kan derfor ikke tilbakestille det.",
      };
    case "USER_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return {
        melding: "Det finnes allerede en konto med denne e-posten.",
        handling: "Logg inn i stedet.",
      };
    case "PASSWORD_TOO_SHORT":
      return {
        melding: "Passordet er for kort.",
        handling: "Bruk minst 8 tegn. En setning du husker er lettere enn et kort, rart ord.",
      };
    case "PASSWORD_TOO_LONG":
      return {
        melding: "Passordet er for langt.",
        handling: "Bruk høyst 128 tegn.",
      };
    case "INVALID_EMAIL":
      return {
        melding: "E-postadressen ser ikke riktig ut.",
        handling: "Sjekk at den har med @ og et domene, som navn@eksempel.no.",
      };
    case "INVALID_PASSWORD":
      return {
        melding: "Passordet er feil. Ingenting er slettet.",
        handling: "Skriv inn passordet du logger inn med.",
      };
  }
  if (feil?.status === 403) {
    return {
      melding: "Invitasjonskoden er feil.",
      handling:
        "Sjekk koden du fikk av den som inviterte deg. Lesevenn er bare åpen for inviterte testbrukere.",
    };
  }
  return {
    melding: "Noe gikk galt hos oss.",
    handling: "Prøv igjen. Står det ved, er det en feil vi må rette.",
  };
}

const FELT =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-2 focus:outline-offset-1 focus:outline-slate-900 dark:border-slate-700 dark:bg-slate-900";
const KNAPP =
  "rounded-md bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-700 focus:outline-2 focus:outline-offset-2 focus:outline-slate-900 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300";

/* ------------------------------------------------------------------ */

export function InnloggingSkjema() {
  const router = useRouter();
  const [feil, setFeil] = useState<Feil | null>(null);
  const [venter, setVenter] = useState(false);

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setVenter(true);
    setFeil(null);
    const { error } = await authKlient.signIn.email({
      email: String(data.get("epost") ?? ""),
      password: String(data.get("passord") ?? ""),
    });
    setVenter(false);
    if (error) return setFeil(somFeil(error));
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={send} className="space-y-4">
      {feil && <Feilmelding {...feil} />}
      <div>
        <label htmlFor="epost" className="block font-medium">E-post</label>
        <input id="epost" name="epost" type="email" autoComplete="email" required className={FELT} />
      </div>
      <div>
        <label htmlFor="passord" className="block font-medium">Passord</label>
        <input id="passord" name="passord" type="password" autoComplete="current-password" required className={FELT} />
      </div>
      <button type="submit" disabled={venter} className={KNAPP}>
        {venter ? "Logger inn…" : "Logg inn"}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */

export function RegistreringSkjema() {
  const router = useRouter();
  const [feil, setFeil] = useState<Feil | null>(null);
  const [venter, setVenter] = useState(false);

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const passord = String(data.get("passord") ?? "");

    // Ingen «glemt passord» i v1, så en skrivefeil her ville låst eleven
    // ute for godt. Derfor to felt.
    if (passord !== String(data.get("gjenta") ?? "")) {
      return setFeil({
        melding: "Passordene er ikke like.",
        handling: "Skriv det samme passordet i begge feltene.",
      });
    }

    setVenter(true);
    setFeil(null);
    const { error } = await authKlient.signUp.email({
      email: String(data.get("epost") ?? ""),
      password: passord,
      // Better Auth krever feltet, men Lesevenn spør ikke om navn (FR-35).
      // Serveren overskriver det uansett med en tom streng.
      name: "",
      fetchOptions: {
        headers: {
          [INVITASJONSKODE_HEADER]: String(data.get("kode") ?? ""),
        },
      },
    });
    setVenter(false);
    if (error) return setFeil(somFeil(error));
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={send} className="space-y-4">
      {feil && <Feilmelding {...feil} />}
      <div>
        <label htmlFor="kode" className="block font-medium">Invitasjonskode</label>
        <input id="kode" name="kode" type="text" autoComplete="off" required className={FELT} />
      </div>
      <div>
        <label htmlFor="epost" className="block font-medium">E-post</label>
        <input id="epost" name="epost" type="email" autoComplete="email" required className={FELT} />
      </div>
      <div>
        <label htmlFor="passord" className="block font-medium">Passord</label>
        <p id="passord-hjelp" className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Minst 8 tegn. Skriv det ned et trygt sted: Lesevenn kan ikke sende deg
          et nytt hvis du glemmer det.
        </p>
        <input id="passord" name="passord" type="password" autoComplete="new-password" minLength={8} required aria-describedby="passord-hjelp" className={FELT} />
      </div>
      <div>
        <label htmlFor="gjenta" className="block font-medium">Gjenta passordet</label>
        <input id="gjenta" name="gjenta" type="password" autoComplete="new-password" minLength={8} required className={FELT} />
      </div>
      <button type="submit" disabled={venter} className={KNAPP}>
        {venter ? "Oppretter konto…" : "Opprett konto"}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */

export function LoggUtKnapp() {
  const router = useRouter();
  const [venter, setVenter] = useState(false);

  async function loggUt() {
    setVenter(true);
    await authKlient.signOut();
    router.push("/logg-inn");
    router.refresh();
  }

  return (
    <button type="button" onClick={loggUt} disabled={venter} className={KNAPP}>
      {venter ? "Logger ut…" : "Logg ut"}
    </button>
  );
}

/* ------------------------------------------------------------------ */

/**
 * FR-37: sletting krever bekreftelse som navngir hva som forsvinner. Hva som
 * forsvinner står på kontosiden rett over skjemaet; passordet er
 * bekreftelsen.
 */
export function SlettKontoSkjema() {
  const router = useRouter();
  const [feil, setFeil] = useState<Feil | null>(null);
  const [venter, setVenter] = useState(false);

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setVenter(true);
    setFeil(null);
    const { error } = await authKlient.deleteUser({
      password: String(data.get("passord") ?? ""),
    });
    setVenter(false);
    if (error) return setFeil(somFeil(error));
    router.push("/logg-inn");
    router.refresh();
  }

  return (
    <form onSubmit={send} className="space-y-4">
      {feil && <Feilmelding {...feil} />}
      <div>
        <label htmlFor="slett-passord" className="block font-medium">
          Skriv passordet ditt for å bekrefte
        </label>
        <input id="slett-passord" name="passord" type="password" autoComplete="current-password" required className={FELT} />
      </div>
      <button
        type="submit"
        disabled={venter}
        className="rounded-md bg-red-700 px-5 py-2.5 font-medium text-white hover:bg-red-800 focus:outline-2 focus:outline-offset-2 focus:outline-red-700 disabled:opacity-60"
      >
        {venter ? "Sletter…" : "Slett kontoen og alt innholdet"}
      </button>
    </form>
  );
}
