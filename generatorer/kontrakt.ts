/**
 * Generatorlagets felles kontrakt — AD-1, AD-10, AD-11 og AD-14.
 *
 * AD-1 sier at det som er felles mellom generatorene er **kontrakten rundt
 * kallet**, ikke inndatatypen. Hver generator erklærer sin egen inndata —
 * bildeuttrekk tar bilder, svarvurdering tar elevsvar — men alle deler:
 *
 *   AD-14  oppslag av gjeldende promptversjon og modell, fra manifestet
 *   AD-11  skjemavalidering av utdata, med forkasting framfor lagring
 *   AD-4   stempling av promptversjon og modellidentitet på resultatet
 *   §5     feilform: kode, elevrettet melding på norsk, anbefalt handling
 *
 * AD-10 sier at laget er rent: ingen import av databaseklient eller
 * rammeverkskode. Derfor ligger ingenting her som vet hva en Tekst-rad er.
 * Inn: verdier. Ut: validert utdata. Kalleren lagrer.
 */

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { z } from "zod";
import type { Avsnitt } from "../tekst/avsnittsdeling";
import { hentLagret, lagreSvar, testmodus } from "./lagretsvar";

/* ------------------------------------------------------------------ *
 * Feilform (§5 — ingen feiltilstand er en blindvei). Står i `feil.ts`.
 * ------------------------------------------------------------------ */

import { FASTE_TEKSTER, GeneratorFeil, kanProevesPaaNytt } from "./feil";
export { FASTE_TEKSTER, FEILKODER, GeneratorFeil, kanProevesPaaNytt, type Feilkode } from "./feil";

/* ------------------------------------------------------------------ *
 * AD-14 — manifestet bestemmer hva som er gjeldende
 * ------------------------------------------------------------------ */

export type Oppgave =
  | "faguttrykk"
  | "quiz"
  | "samtalestart"
  | "svarvurdering"
  | "bildeuttrekk"
  | "oversettelse"
  | "oppsummering"
  | "utpeking"
  | "minnevers"
  | "etiketter";

/** Tenkemodusene manifestet kan oppgi. Se `_om_tenkning` der. */
export type Tenkemodus = "budsjett" | "adaptiv" | "av";

/**
 * Selvkonsistens: kjør N ganger, behold det minst k av dem fant.
 *
 * Dette hører i manifestet og ikke i koden, av samme grunn som `tenkning`:
 * det er en del av hvordan en oppgave kalles, og AD-14 sier at manifestet er
 * den ene kilden til det. En ny modell kan trenge andre tall, og da skal de
 * endres der versjonen forfremmes — ikke i en konstant et annet sted.
 */
export type Konsistens = { kjoeringer: number; minstEnighet: number };

type Manifest = {
  oppgaver: Record<
    string,
    {
      versjon: string;
      modell: string;
      tenkning: Tenkemodus;
      /** Utelatt betyr ett enkelt kall. */
      konsistens?: Konsistens;
    }
  >;
};

const PROMPTROT = path.join(process.cwd(), "prompts");

let manifestbuffer: Manifest | null = null;

/**
 * Leser manifestet. At det er bufret betyr at en endring krever omstart —
 * det er riktig: AD-6 sier at forfremmelse av en promptversjon er en
 * utgivelseshandling, ikke noe som skjer mens appen kjører.
 */
async function lesManifest(): Promise<Manifest> {
  if (manifestbuffer) return manifestbuffer;
  try {
    const rå = await readFile(path.join(PROMPTROT, "gjeldende.json"), "utf8");
    manifestbuffer = JSON.parse(rå) as Manifest;
    return manifestbuffer;
  } catch (e) {
    throw new GeneratorFeil(
      "prompt_mangler",
      "LeseBuddy mangler oppsettet sitt og kan ikke behandle teksten nå.",
      "Prøv igjen senere. Står det ved, er det en feil hos oss.",
      e,
    );
  }
}

export type Promptvalg = {
  versjon: string;
  modell: string;
  tenkning: Tenkemodus;
  /** Utelatt betyr ett enkelt kall. */
  konsistens?: Konsistens;
  tekst: string;
};

/**
 * Henter gjeldende prompt for en oppgave, eller en navngitt versjon.
 *
 * Harnessen bruker `overstyrVersjon` for å måle en vilkårlig versjon (AD-5).
 * Webappen gjør det aldri — den tar det manifestet sier, og det er hele
 * poenget med AD-14: å legge en fil i mappa er ikke å ta den i bruk.
 */
export async function hentPrompt(
  oppgave: Oppgave,
  overstyrVersjon?: string,
): Promise<Promptvalg> {
  const manifest = await lesManifest();
  const oppføring = manifest.oppgaver[oppgave];

  if (!oppføring) {
    throw new GeneratorFeil(
      "ukjent_oppgave",
      "LeseBuddy kjenner ikke denne operasjonen.",
      "Dette er en feil hos oss. Prøv en annen funksjon i mellomtiden.",
    );
  }

  const versjon = overstyrVersjon ?? oppføring.versjon;

  try {
    const tekst = await readFile(
      path.join(PROMPTROT, oppgave, `${versjon}.md`),
      "utf8",
    );
    return {
      versjon,
      modell: oppføring.modell,
      tenkning: oppføring.tenkning,
      konsistens: oppføring.konsistens,
      tekst,
    };
  } catch (e) {
    throw new GeneratorFeil(
      "prompt_mangler",
      "LeseBuddy mangler oppsettet sitt for denne operasjonen.",
      "Prøv igjen senere. Står det ved, er det en feil hos oss.",
      e,
    );
  }
}

/* ------------------------------------------------------------------ *
 * Modellkallet
 * ------------------------------------------------------------------ */

let klientbuffer: Anthropic | null = null;

/**
 * Forsøkene ganges med hverandre: SDK-ens egne forsøk (nettverksfeil, 408,
 * 409, 429 og 5xx) ganger det ene nye forsøket i `kjoerGenerator`. Med
 * SDK-ens standard (2) ble det opptil seks kall per generatorkall, og flere
 * med generatorenes egne løkker. Derfor ett SDK-forsøk her.
 *
 * Tidsgrensen gjelder hvert kall. Uten den venter SDK-en i opptil ti
 * minutter. 90 sekunder fordi taket er 16 000 tokens (AD-19), og et svar
 * nær taket tar over et minutt. Et tidsavbrudd prøves én gang til.
 */
const SDK_FORSOEK = 1;
const TIDSGRENSE_MS = 90_000;

function klient(): Anthropic {
  if (klientbuffer) return klientbuffer;
  if (!process.env.ANTHROPIC_API_KEY) {
    const t = FASTE_TEKSTER.tilgang_avslaatt;
    throw new GeneratorFeil("tilgang_avslaatt", t.elevmelding, t.anbefaltHandling);
  }
  klientbuffer = new Anthropic({ maxRetries: SDK_FORSOEK, timeout: TIDSGRENSE_MS });
  return klientbuffer;
}

/**
 * Bare for testene: en falsk klient med `messages.parse`, så det nye forsøket
 * kan prøves uten modellkall (AD-5). `null` tar bort den falske klienten.
 * Kaster utenfor en testkjøring, så produksjonskoden ikke kan bytte klienten.
 */
export function settKlientForTest(falsk: { messages: { parse: (...a: never[]) => unknown } } | null): void {
  if (!process.env.VITEST && process.env.NODE_ENV !== "test") {
    throw new Error("settKlientForTest kan bare brukes i testene.");
  }
  klientbuffer = falsk as unknown as Anthropic | null;
}

/** Tokenbudsjettet når manifestet sier `budsjett`. */
const TENKEBUDSJETT = 4000;

/**
 * Oversetter manifestets tenkemodus til API-formen.
 *
 * ## Hvorfor dette leses fra manifestet og ikke gjettes fra modellnavnet
 *
 * Den første utgaven gjettet: `modell.startsWith("claude-haiku")` ga
 * `budget_tokens`, alt annet ga `adaptive`. Det var riktig for de to modellene
 * som fantes da, og feil som regel. Modellisten fra API-et viser hvorfor:
 *
 *   claude-haiku-4-5   thinking.types.enabled  støttet, adaptive IKKE
 *   claude-haiku-5-5   thinking.types.enabled  IKKE,    adaptive støttet
 *
 * Samme familie, motsatt krav. Heuristikken ville altså sendt `budget_tokens`
 * til en modell som avviser det, og kallet ville feilet med 400 — ved et
 * modellbytte, altså presis når man endrer én ting og forventer at resten
 * virker.
 *
 * Nå står modusen i manifestet ved siden av modellen. Det følger AD-14: en
 * modell kan ikke forfremmes uten at det samtidig oppgis hvordan den skal
 * kalles. Hva en modell faktisk støtter, slås opp i `capabilities.thinking`
 * fra `GET /v1/models`.
 */
function tilApiform(modus: Tenkemodus) {
  if (modus === "budsjett") {
    return { type: "enabled" as const, budget_tokens: TENKEBUDSJETT };
  }
  if (modus === "adaptiv") return { type: "adaptive" as const };
  return { type: "disabled" as const };
}

export type Resultat<T> = {
  data: T;
  /** AD-4: begge stemples, slik at to måletall er sammenlignbare. */
  promptversjon: string;
  modell: string;
};

/**
 * Kjører ett generatorkall med strukturert utdata.
 *
 * Skjemaet er et Zod-skjema, og SDK-en validerer svaret mot det. Det er
 * AD-11s første forsvarslinje: utdata som ikke har rett form kommer aldri ut
 * av denne funksjonen. Den andre linjen — verbatim-kravet, kildeavsnitt-
 * medlemskap og tetthetstakene — ligger i `validering.ts`, fordi den trenger
 * teksten å sammenligne mot.
 */
/** Meldingen et lagret svar nøkles på når et bilde er med. Eksportert for testene. */
export function noekkelMedBilde(brukermelding: string, bildedata: string): string {
  const sammendrag = createHash("sha256").update(bildedata).digest("hex").slice(0, 32);
  return `${brukermelding}\n[bilde ${sammendrag}]`;
}

export async function kjoerGenerator<S extends z.ZodType>({
  oppgave,
  skjema,
  brukermelding,
  overstyrVersjon,
  overstyrModell,
  /*
   * Taket gjelder tenking OG svar til sammen. Med adaptiv tenking avgjør
   * modellen selv hvor mye den tenker, og 8 000 holdt ikke: sju av ti
   * minnevers (17.10) og én av tre quizer (18.10) ble kuttet midt i svaret,
   * som da ikke var gyldig JSON. Ett felles tak her, ikke et lavere per
   * generator, så samme feil ikke kan komme tilbake ett sted om gangen.
   */
  maksTokens = 16000,
  kjoering,
  bilde,
  nyttForsoek = true,
}: {
  oppgave: Oppgave;
  skjema: S;
  brukermelding: string;
  overstyrVersjon?: string;
  /**
   * Harnessen kan prøve en kandidatversjon på en annen modell enn manifestets
   * (FR-31, 19.10: v5 på Sonnet). Webappen gjør det aldri, se `hentPrompt`.
   * Tenkemodusen er fortsatt manifestets.
   */
  overstyrModell?: string;
  maksTokens?: number;
  /** Nummeret i selvkonsistensen. Skiller de lagrede svarene, se `noekkel`. */
  kjoering?: number;
  /**
   * Et bilde sendt foran teksten (FR-44). Holdes bare i minnet — det skrives
   * aldri til disk, heller ikke i testmodus `skriv`, der bare svaret lagres
   * (AD-16).
   */
  bilde?: { mediaType: "image/jpeg" | "image/png"; data: string };
  /**
   * Det ene nye forsøket ved en feil som kan gå over (PRD §5). `false` for
   * generatorer som har sin egen løkke med nye forsøk (fagsamtalen), så
   * forsøkene ikke ganges med hverandre.
   */
  nyttForsoek?: boolean;
}): Promise<Resultat<z.infer<S>>> {
  const valgt = await hentPrompt(oppgave, overstyrVersjon);
  const prompt = overstyrModell ? { ...valgt, modell: overstyrModell } : valgt;
  const modus = testmodus();

  // Nøkkelen for lagrede svar må skille bilder fra hverandre. Et sammendrag
  // av bildet tas med, ikke bildet selv — det skal ikke ligge i repoet.
  // En overstyrt modell skiller også, ellers ville svarene overskrive
  // manifestmodellens svar på samme prompt. Uten overstyring er nøkkelen
  // som før, så lagrede svar fortsatt treffer.
  const medBilde = bilde ? noekkelMedBilde(brukermelding, bilde.data) : brukermelding;
  const noekkelmelding = overstyrModell ? `${medBilde}
[modell ${overstyrModell}]` : medBilde;

  /*
   * Testmodus `les`: svaret kommer fra disk, og modellen kalles ikke.
   *
   * Merk at skjemavalideringen kjører likevel, på presis samme måte som for et
   * ferskt svar. En testmodus som hoppet over den ville demonstrert en kodevei
   * som ikke finnes i drift.
   */
  // `fyll` leser som `les` når svaret finnes, og kaller og lagrer som
  // `skriv` når det mangler.
  const lagret =
    modus === "les" || modus === "fyll"
      ? await hentLagret(oppgave, prompt.versjon, noekkelmelding, kjoering)
      : null;

  if (modus === "les" || lagret) {
    if (!lagret) {
      const t = FASTE_TEKSTER.lagret_svar_mangler;
      throw new GeneratorFeil("lagret_svar_mangler", t.elevmelding, t.anbefaltHandling);
    }

    const validert = skjema.safeParse(lagret.data);
    if (!validert.success) {
      throw new GeneratorFeil(
        "ugyldig_utdata",
        "Det lagrede svaret passer ikke formen LeseBuddy forventer.",
        "Fila er sannsynligvis lagret under en eldre utgave av skjemaet. " +
          "Lag den på nytt med LESEVENN_TESTMODUS=skriv.",
      );
    }

    return {
      data: validert.data as z.infer<S>,
      promptversjon: lagret.promptversjon,
      modell: lagret.modell,
    };
  }

  /*
   * PRD §5: feiler kallet med en feil der et nytt kall kan hjelpe, kjøres hele
   * kallet én gang til, og svaret valideres akkurat som det første (AD-11).
   * Ikke mer enn én gang, og ikke i testmodus `les` (det lagrede svaret over
   * blir ikke annerledes av å hentes igjen). Forsøket skjer stille: en
   * serverhandling kan ikke sende status underveis, og tenkeindikatorens
   * tillegg etter 30 sekunder dekker den lengre ventingen. Selvkonsistensen
   * kaller denne funksjonen per kjøring, så forsøket gjelder hvert kall, ikke
   * serien.
   */
  const kall = () => kallModellen(prompt, skjema, brukermelding, maksTokens, bilde);
  let data: z.infer<S>;
  try {
    data = await kall();
  } catch (e) {
    if (!nyttForsoek || !(e instanceof GeneratorFeil) || !kanProevesPaaNytt(e.kode)) throw e;
    // Den første feilen ville ellers forsvunnet uten spor når forsøket lykkes.
    console.warn(`[${oppgave}] ${e.message} — prøver én gang til.`, e.cause ?? "");
    data = await kall();
  }

  // Testmodus `skriv`: dette er hvordan filene i testdata/ lages. Lagringen
  // skjer etter valideringen, så et svar som ikke holdt formen havner aldri
  // på disk.
  if (modus === "skriv" || modus === "fyll") {
    await lagreSvar(oppgave, prompt.versjon, prompt.modell, noekkelmelding, data, kjoering);
  }

  return {
    data,
    promptversjon: prompt.versjon,
    modell: prompt.modell,
  };
}

/**
 * Ett kall til modellen, med skjemavalidering og oversetting av feil til
 * `GeneratorFeil`. `kjoerGenerator` kaller den høyst to ganger, og SDK-en
 * prøver selv én gang til ved nettverksfeil, 429 og 5xx (`SDK_FORSOEK`).
 */
async function kallModellen<S extends z.ZodType>(
  prompt: Promptvalg,
  skjema: S,
  brukermelding: string,
  maksTokens: number,
  bilde: { mediaType: "image/jpeg" | "image/png"; data: string } | undefined,
): Promise<z.infer<S>> {
  try {
    const svar = await klient().messages.parse({
      model: prompt.modell,
      max_tokens: maksTokens,
      thinking: tilApiform(prompt.tenkning),
      system: prompt.tekst,
      messages: [
        {
          role: "user",
          content: bilde
            ? [
                { type: "image", source: { type: "base64", media_type: bilde.mediaType, data: bilde.data } },
                { type: "text", text: brukermelding },
              ]
            : brukermelding,
        },
      ],
      output_config: { format: zodOutputFormat(skjema) },
    });

    if (svar.parsed_output === null || svar.parsed_output === undefined) {
      throw new GeneratorFeil(
        "ugyldig_utdata",
        "LeseBuddy fikk et svar den ikke kunne bruke.",
        "Prøv igjen. Skjer det på nytt med samme tekst, kan teksten være vanskelig å behandle — prøv et kortere utdrag.",
        // Til loggen og harnessen: «max_tokens» betyr at tenkingen spiste taket.
        new Error(`stop_reason=${svar.stop_reason}, output_tokens=${svar.usage.output_tokens}`),
      );
    }

    return svar.parsed_output as z.infer<S>;
  } catch (e) {
    if (e instanceof GeneratorFeil) throw e;

    /*
     * Mest spesifikk først. Oppdelingen her er ikke pedanteri: §5 krever at
     * hver feil tilbyr minst én KONKRET ting eleven kan gjøre videre, og
     * «prøv igjen» er sant for noen av disse og usant for andre. Et råd som
     * aldri kan virke er en blindvei med et skilt på, og det er verre enn å
     * si rett ut at eleven ikke kan gjøre noe.
     */
    if (e instanceof Anthropic.APIConnectionTimeoutError) {
      throw new GeneratorFeil(
        "tidsavbrudd",
        "Det tok for lang tid å behandle teksten.",
        "Prøv igjen. Er teksten lang, kan et kortere utdrag gå raskere.",
        e,
      );
    }

    /*
     * 401 og 403: nøkkelen er utløpt, trukket tilbake, feil, eller mangler
     * rettigheten. Ingen av dem lar seg rette av eleven, og ingen av dem
     * blir bedre av å vente — derfor ikke «prøv igjen om litt».
     *
     * Dette er feilen en utløpt API-nøkkel gir, og den er verdt å skille ut
     * nettopp fordi den er usynlig for alt annet: testene kaller ikke
     * modellen, bygget kaller ikke modellen, og helsesjekken går mot
     * databasen. Alt er grønt mens appen ikke virker.
     */
    if (
      e instanceof Anthropic.AuthenticationError ||
      e instanceof Anthropic.PermissionDeniedError
    ) {
      const t = FASTE_TEKSTER.tilgang_avslaatt;
      throw new GeneratorFeil("tilgang_avslaatt", t.elevmelding, t.anbefaltHandling, e);
    }

    // 429: den ene feilen der «prøv igjen om litt» faktisk er riktig råd.
    if (e instanceof Anthropic.RateLimitError) {
      const t = FASTE_TEKSTER.for_mange_kall;
      throw new GeneratorFeil("for_mange_kall", t.elevmelding, t.anbefaltHandling, e);
    }

    /*
     * 400, 404 og 422: forespørselen er feil (et ukjent modellnavn, en
     * tenkemodus modellen avviser, et skjema API-et ikke godtar). Samme
     * forespørsel gir samme svar, så den prøves ikke på nytt.
     */
    if (
      e instanceof Anthropic.BadRequestError ||
      e instanceof Anthropic.NotFoundError ||
      e instanceof Anthropic.UnprocessableEntityError
    ) {
      const t = FASTE_TEKSTER.ugyldig_foresporsel;
      throw new GeneratorFeil("ugyldig_foresporsel", t.elevmelding, t.anbefaltHandling, e);
    }

    throw new GeneratorFeil(
      "modellfeil",
      "LeseBuddy fikk ikke behandlet teksten.",
      "Prøv igjen om litt. Står det ved, er det en feil hos oss.",
      e,
    );
  }
}

/* ------------------------------------------------------------------ *
 * Felles formatering av inndata
 * ------------------------------------------------------------------ */

/**
 * Avsnittslisten som tekst til modellen, med numrene synlige.
 *
 * Nummereringen MÅ være den fra `delIAvsnitt` (AD-12), og den sendes med
 * eksplisitt framfor å la modellen telle selv. Det er AD-10: utdata skal
 * referere numre fra den mottatte listen, og da må listen være mottatt.
 */
export function formaterAvsnitt(avsnitt: Avsnitt[]): string {
  return avsnitt
    .map(
      (a) =>
        `[avsnitt ${a.nummer}${a.erOverskrift ? ", overskrift" : ""}]\n${a.innhold}`,
    )
    .join("\n\n");
}
