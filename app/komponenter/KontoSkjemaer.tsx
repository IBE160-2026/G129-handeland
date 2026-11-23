"use client";

/**
 * Skjemaene for konto — FR-35 og FR-37.
 *
 * Klientkomponenter, fordi de snakker med Better Auths HTTP-ruter gjennom
 * `authKlient`. Det er der begrensningen av innloggingsforsøk ligger; en
 * server action som kalte `auth.api` direkte ville gått forbi den.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { INVITASJONSKODE_HEADER } from "../../data/invitasjon";
import {
  ALDER_BEKREFTET,
  ALDER_HEADER,
  VILKAAR_FEIL,
  VILKAAR_HEADER,
  VILKAARSVERSJON,
} from "../../data/vilkaar";
import { slettEnhetsvalgHandling } from "../handlinger";
import { authKlient } from "./authKlient";
import { Feilmelding } from "./Feilmelding";
import { KNAPP_FARE, KNAPP_PRIMAER } from "./knapper";
import {
  SPERRE_OVER,
  STANDARD_SPERRETID,
  kanSende,
  knappetekstUnderSperre,
  nedtelling,
  sekunderFraSvar,
  sperremelding,
} from "./sperretid";

/** `vilkaarslenke`: meldingen får en lenke til «Vilkår og personvern». */
type Feil = { melding: string; handling: string; vilkaarslenke?: boolean };

/** Feilmeldingen, med lenke til vilkårene når feilen gjelder dem. */
function VisFeil({ feil }: { feil: Feil }) {
  const { vilkaarslenke, ...resten } = feil;
  return (
    <Feilmelding {...resten}>
      {vilkaarslenke ? (
        <Link href="/vilkaar" className="font-medium underline underline-offset-4">
          Les vilkårene og personvernerklæringen
        </Link>
      ) : undefined}
    </Feilmelding>
  );
}

/**
 * Oversetter Better Auths feilkoder til §5-form: hva som gikk galt, og hva
 * eleven kan gjøre. Ukjente koder får en generell melding framfor den
 * engelske teksten fra biblioteket.
 *
 * `sekunder`: hvor lenge sperren varer ved 429 (fra `X-Retry-After`).
 * Meldingen sier det faktiske tallet. Uten tallet (utlogging, sletting)
 * står det «et minutt».
 */
function somFeil(
  feil: { status?: number; code?: string } | null | undefined,
  sekunder?: number,
): Feil {
  if (feil?.status === 429) return sperremelding(sekunder);
  switch (feil?.code) {
    case "INVALID_EMAIL_OR_PASSWORD":
      return {
        melding: "E-post eller passord er feil.",
        handling:
          "Sjekk at du har skrevet riktig. Har du glemt passordet, må du lage en ny konto — LeseBuddy sender ikke e-post, og kan derfor ikke tilbakestille det.",
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
    // FR-53. Skjemaet krever begge avkrysningene, så disse kommer bare om
    // nettleseren ikke stoppet innsendingen, eller vilkårene er endret.
    case VILKAAR_FEIL.alder:
      return {
        melding: "Du må bekrefte at du er 15 år eller eldre.",
        handling:
          "LeseBuddy er for elever fra 15 år. Er du 15 eller eldre, kryss av for det og prøv igjen.",
      };
    case VILKAAR_FEIL.vilkaar:
      return {
        melding: "Du må bekrefte at du har lest vilkårene og personvernerklæringen.",
        handling: "Les dem, kryss av for at du har lest dem, og prøv igjen.",
        vilkaarslenke: true,
      };
    case VILKAAR_FEIL.endret:
      return {
        melding: "Vilkårene er endret — last siden på nytt.",
        handling: "Last siden på nytt, les de nye vilkårene, og kryss av igjen.",
        vilkaarslenke: true,
      };
  }
  if (feil?.status === 403) {
    return {
      melding: "Invitasjonskoden er feil.",
      handling:
        "Sjekk koden du fikk av den som inviterte deg. LeseBuddy er bare åpen for inviterte testbrukere.",
    };
  }
  return {
    melding: "Noe gikk galt hos oss.",
    handling: "Prøv igjen. Står det ved, er det en feil vi må rette.",
  };
}

const FELT =
  "mt-1 w-full rounded-md border border-slate-500 px-3 py-2 dark:border-slate-400 dark:bg-slate-900";
const KNAPP = KNAPP_PRIMAER;

/**
 * Tema- og håndkapselen slettes ved utlogging og sletting av kontoen, så
 * neste elev på en delt PC får «Følg enheten» og øvekortene som vanlig.
 * Feiler det, går utloggingen likevel videre: et arvet valg er ikke verdt å
 * stoppe den for. Etter 3 sekunder gis det opp, så utloggingen aldri henger.
 */
async function glemEnhetsvalg() {
  let tidsgrense: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      slettEnhetsvalgHandling(),
      new Promise((_, nei) => {
        tidsgrense = setTimeout(() => nei(new Error("tidsgrensen på 3 s")), 3000);
      }),
    ]);
  } catch (e) {
    console.error("Kunne ikke slette valgene på enheten:", e);
  } finally {
    clearTimeout(tidsgrense);
  }
}

/* ------------------------------------------------------------------ */

/**
 * Sperren etter for mange forsøk (429), med nedtelling — FR-35.
 *
 * `sperr(sek)` starter den. Mens den står, er `igjen` antall sekunder som
 * gjenstår, og skjemaet sender ikke. Knappen viser tallet, men er ingen
 * levende region, så nedtellingen leses ikke opp hvert sekund; meldingen
 * om sperren leses opp én gang av `Feilmelding` (`role="alert"`). Ved 0
 * kalles `ferdig` (skjemaet fjerner feilen), og statusregionen sier én gang,
 * høflig, at eleven kan prøve igjen.
 *
 * Tiden regnes fra et sluttidspunkt, ikke ved å telle intervaller, så en fane
 * som har ligget i bakgrunnen (der nettleseren struper tidtakere) viser
 * riktig tall når eleven kommer tilbake.
 */
function useSperre(ferdig: () => void) {
  const [slutt, setSlutt] = useState<number | null>(null);
  const [igjen, setIgjen] = useState(0);
  const [status, setStatus] = useState("");
  const ferdigRef = useRef(ferdig);
  useEffect(() => {
    ferdigRef.current = ferdig;
  });

  useEffect(() => {
    if (slutt === null) return;
    const t = setInterval(() => {
      const sek = nedtelling(slutt, Date.now());
      if (sek !== "ferdig") return setIgjen(sek);
      clearInterval(t);
      setSlutt(null);
      setIgjen(0);
      ferdigRef.current();
      setStatus(SPERRE_OVER);
    }, 1000);
    return () => clearInterval(t);
  }, [slutt]);

  return {
    /** Sekunder som gjenstår; 0 når skjemaet ikke er sperret. */
    igjen: slutt === null ? 0 : igjen,
    status,
    sperret: slutt !== null,
    sperr(sek: number) {
      setStatus("");
      setIgjen(sek);
      setSlutt(Date.now() + sek * 1000);
    },
    /** Et nytt forsøk: statusmeldingen fra forrige sperre fjernes. */
    nyttForsoek() {
      setStatus("");
    },
  };
}

/**
 * Statusregionen for sperren. Finnes tom fra montering, ellers leser
 * skjermleseren den ikke opp når den fylles (som `LagretMelding`). Tom er
 * den `sr-only`, ikke skjult: `display: none` tar regionen ut av
 * tilgjengelighetstreet, og da kan kunngjøringen ved 0 gå tapt. Slik tar
 * den heller ikke plass i skjemaet mens den er tom.
 */
function Sperrestatus({ tekst }: { tekst: string }) {
  return (
    <p role="status" aria-live="polite" className="font-medium empty:sr-only">
      {tekst}
    </p>
  );
}

/**
 * Send-knappen i innloggings- og registreringsskjemaet. Under sperren viser
 * den «Vent N s» og er `aria-disabled`, ikke `disabled`: en `disabled` knapp
 * hoppes over av Tab og mister fokuset den hadde, så eleven ville ikke
 * funnet ut hvorfor ingenting skjer. Skjemaet nekter selv å sende (`send`).
 */
function SendKnapp({
  venter,
  igjen,
  children,
}: {
  venter: boolean;
  igjen: number;
  children: string;
}) {
  const sperret = igjen > 0;
  return (
    <button
      type="submit"
      disabled={venter}
      aria-disabled={sperret || undefined}
      className={`${KNAPP} aria-disabled:cursor-not-allowed aria-disabled:opacity-60`}
    >
      {sperret ? knappetekstUnderSperre(igjen) : children}
    </button>
  );
}

/* ------------------------------------------------------------------ */

export function InnloggingSkjema() {
  const router = useRouter();
  const [feil, setFeil] = useState<Feil | null>(null);
  const [venter, setVenter] = useState(false);
  const sperre = useSperre(() => setFeil(null));

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Knappen er bare aria-disabled under sperren, og Enter i et felt sender
    // skjemaet uansett. Derfor stoppes det her.
    if (!kanSende({ venter, sperret: sperre.sperret })) return;
    const data = new FormData(e.currentTarget);
    setVenter(true);
    setFeil(null);
    sperre.nyttForsoek();
    let sekunder = STANDARD_SPERRETID;
    const { error } = await authKlient.signIn.email(
      {
        email: String(data.get("epost") ?? ""),
        password: String(data.get("passord") ?? ""),
      },
      {
        onError(ctx) {
          sekunder = sekunderFraSvar(ctx.response);
        },
      },
    );
    setVenter(false);
    if (error) {
      if (error.status === 429) sperre.sperr(sekunder);
      return setFeil(somFeil(error, sekunder));
    }
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={send} className="space-y-4">
      {feil && <VisFeil feil={feil} />}
      <Sperrestatus tekst={sperre.status} />
      <div>
        <label htmlFor="epost" className="block font-medium">E-post</label>
        <input id="epost" name="epost" type="email" autoComplete="email" required className={FELT} />
      </div>
      <div>
        <label htmlFor="passord" className="block font-medium">Passord</label>
        <input id="passord" name="passord" type="password" autoComplete="current-password" required className={FELT} />
      </div>
      <SendKnapp venter={venter} igjen={sperre.igjen}>
        {venter ? "Logger inn…" : "Logg inn"}
      </SendKnapp>
    </form>
  );
}

/* ------------------------------------------------------------------ */

export function RegistreringSkjema() {
  const router = useRouter();
  const [feil, setFeil] = useState<Feil | null>(null);
  const [venter, setVenter] = useState(false);
  const sperre = useSperre(() => setFeil(null));

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!kanSende({ venter, sperret: sperre.sperret })) return;
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
    sperre.nyttForsoek();
    let sekunder = STANDARD_SPERRETID;
    const { error } = await authKlient.signUp.email({
      email: String(data.get("epost") ?? ""),
      password: passord,
      // Better Auth krever feltet, men Lesevenn spør ikke om navn (FR-35).
      // Serveren overskriver det uansett med en tom streng.
      name: "",
      fetchOptions: {
        headers: {
          [INVITASJONSKODE_HEADER]: String(data.get("kode") ?? ""),
          // FR-53: serveren sjekker begge, så en tom verdi avvises der også.
          [ALDER_HEADER]: data.get("alder") === "ja" ? ALDER_BEKREFTET : "",
          [VILKAAR_HEADER]: data.get("vilkaar") === "ja" ? VILKAARSVERSJON : "",
        },
        onError(ctx) {
          sekunder = sekunderFraSvar(ctx.response);
        },
      },
    });
    setVenter(false);
    if (error) {
      if (error.status === 429) sperre.sperr(sekunder);
      return setFeil(somFeil(error, sekunder));
    }
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={send} className="space-y-4">
      {feil && <VisFeil feil={feil} />}
      <Sperrestatus tekst={sperre.status} />
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
          Minst 8 tegn. Skriv det ned et trygt sted: LeseBuddy kan ikke sende deg
          et nytt hvis du glemmer det.
        </p>
        <input id="passord" name="passord" type="password" autoComplete="new-password" minLength={8} required aria-describedby="passord-hjelp" className={FELT} />
      </div>
      <div>
        <label htmlFor="gjenta" className="block font-medium">Gjenta passordet</label>
        <input id="gjenta" name="gjenta" type="password" autoComplete="new-password" minLength={8} required className={FELT} />
      </div>
      {/*
        FR-53: to påkrevde avkrysninger, aldri forhåndsavkrysset. Dette er
        ikke samtykke: grunnlaget er avtale, og boksene bekrefter at eleven
        er gammel nok og har fått informasjonen.
      */}
      <div>
        <label className="flex min-h-11 cursor-pointer items-start gap-3 py-1">
          <input
            id="alder"
            name="alder"
            type="checkbox"
            value="ja"
            required
            aria-describedby="alder-hjelp"
            className="mt-1 size-5 shrink-0"
          />
          <span className="font-medium">Jeg er 15 år eller eldre</span>
        </label>
        <p id="alder-hjelp" className="ms-8 text-sm text-slate-600 dark:text-slate-400">
          LeseBuddy er for elever fra 15 år. Vi spør ikke om alderen din og lagrer den ikke.
        </p>
      </div>
      <div>
        <label className="flex min-h-11 cursor-pointer items-start gap-3 py-1">
          <input
            id="vilkaar"
            name="vilkaar"
            type="checkbox"
            value="ja"
            required
            aria-describedby="vilkaar-hjelp"
            className="mt-1 size-5 shrink-0"
          />
          <span className="font-medium">Jeg har lest vilkårene og personvernerklæringen</span>
        </label>
        <p id="vilkaar-hjelp" className="ms-8 text-sm text-slate-600 dark:text-slate-400">
          <Link href="/vilkaar" target="_blank" className="font-medium underline underline-offset-4">
            Les vilkår og personvern
          </Link>{" "}
          (åpnes i en ny fane). Der står det hva som lagres, hvor tekstene dine går, og hvordan du sletter alt.
        </p>
      </div>
      <SendKnapp venter={venter} igjen={sperre.igjen}>
        {venter ? "Oppretter konto…" : "Opprett konto"}
      </SendKnapp>
    </form>
  );
}

/* ------------------------------------------------------------------ */

export function LoggUtKnapp() {
  const router = useRouter();
  const [venter, setVenter] = useState(false);
  const [feil, setFeil] = useState<Feil | null>(null);

  async function loggUt() {
    setVenter(true);
    setFeil(null);
    try {
      // signOut kan svare med en feil uten å kaste. Da er eleven fortsatt
      // innlogget, og verken valgene slettes eller siden byttes.
      const { error } = await authKlient.signOut();
      if (error) return setFeil(somFeil(error));
      await glemEnhetsvalg();
      router.push("/logg-inn");
      router.refresh();
    } catch {
      setFeil(somFeil(null));
    } finally {
      setVenter(false);
    }
  }

  return (
    <>
      {feil && <VisFeil feil={feil} />}
      <button type="button" onClick={loggUt} disabled={venter} className={KNAPP}>
        {venter ? "Logger ut…" : "Logg ut"}
      </button>
    </>
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
    if (error) {
      setVenter(false);
      return setFeil(somFeil(error));
    }
    // Knappen står låst til siden byttes, også mens valgene slettes.
    await glemEnhetsvalg();
    router.push("/logg-inn");
    router.refresh();
  }

  return (
    <form onSubmit={send} className="space-y-4">
      {feil && <VisFeil feil={feil} />}
      <div>
        <label htmlFor="slett-passord" className="block font-medium">
          Skriv passordet ditt for å bekrefte
        </label>
        <input id="slett-passord" name="passord" type="password" autoComplete="current-password" required className={FELT} />
      </div>
      <button
        type="submit"
        disabled={venter}
        className={KNAPP_FARE}
      >
        {venter ? "Sletter…" : "Slett kontoen og alt innholdet"}
      </button>
    </form>
  );
}

/**
 * Bekreftelsen etter «Lagre» under «Utseende» (bolk 4).
 *
 * Statusregionen finnes tom fra montering og fylles etterpå, ellers leser
 * skjermleseren den ikke opp. Når meldingen er vist, fjernes `lagret` fra
 * adressen, så den ikke kommer tilbake ved oppdatering eller Tilbake. Siden
 * gir komponenten en ny nøkkel for hver lagring, så også to lagringer etter
 * hverandre kunngjøres. Uten JavaScript står meldingen i <noscript>.
 */
export function LagretMelding({ tekst }: { tekst: string | null }) {
  const [vist, setVist] = useState("");
  useEffect(() => {
    if (!tekst) return;
    const t = setTimeout(() => {
      setVist(tekst);
      const url = new URL(window.location.href);
      url.searchParams.delete("lagret");
      url.searchParams.delete("n");
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    }, 100);
    return () => clearTimeout(t);
  }, [tekst]);
  return (
    <>
      <p role="status" className="mt-1 text-sm font-medium">
        {vist}
      </p>
      {tekst && (
        <noscript>
          <p className="mt-1 text-sm font-medium">{tekst}</p>
        </noscript>
      )}
    </>
  );
}
