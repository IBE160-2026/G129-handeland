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

import { readFile } from "node:fs/promises";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { z } from "zod";
import type { Avsnitt } from "../tekst/avsnittsdeling";
import { hentLagret, lagreSvar, testmodus } from "./lagretsvar";

/* ------------------------------------------------------------------ *
 * Feilform (§5 — ingen feiltilstand er en blindvei)
 * ------------------------------------------------------------------ */

export type Feilkode =
  | "prompt_mangler"
  | "ukjent_oppgave"
  | "modellfeil"
  | "ugyldig_utdata"
  | "tidsavbrudd"
  | "lagret_svar_mangler"
  /** Nøkkelen mangler, er utløpt, trukket tilbake, eller mangler rettighet. */
  | "tilgang_avslaatt"
  /** Kvote eller takt overskredet. Den ene feilen der «prøv igjen» er sant. */
  | "for_mange_kall";

/**
 * Alle feil fra generatorlaget har denne formen. Kravet i §5 om at ingen
 * feiltilstand er en blindvei håndheves dermed ett sted, framfor i hver flate
 * som kaller en generator.
 */
export class GeneratorFeil extends Error {
  readonly kode: Feilkode;
  readonly elevmelding: string;
  readonly anbefaltHandling: string;

  constructor(
    kode: Feilkode,
    elevmelding: string,
    anbefaltHandling: string,
    årsak?: unknown,
  ) {
    super(`${kode}: ${elevmelding}`);
    this.name = "GeneratorFeil";
    this.kode = kode;
    this.elevmelding = elevmelding;
    this.anbefaltHandling = anbefaltHandling;
    if (årsak instanceof Error) this.cause = årsak;
  }
}

/* ------------------------------------------------------------------ *
 * AD-14 — manifestet bestemmer hva som er gjeldende
 * ------------------------------------------------------------------ */

export type Oppgave = "faguttrykk";

type Manifest = {
  oppgaver: Record<string, { versjon: string; modell: string }>;
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
      "Lesevenn mangler oppsettet sitt og kan ikke behandle teksten nå.",
      "Prøv igjen senere. Står det ved, er det en feil hos oss.",
      e,
    );
  }
}

export type Promptvalg = {
  versjon: string;
  modell: string;
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
      "Lesevenn kjenner ikke denne operasjonen.",
      "Dette er en feil hos oss. Prøv en annen funksjon i mellomtiden.",
    );
  }

  const versjon = overstyrVersjon ?? oppføring.versjon;

  try {
    const tekst = await readFile(
      path.join(PROMPTROT, oppgave, `${versjon}.md`),
      "utf8",
    );
    return { versjon, modell: oppføring.modell, tekst };
  } catch (e) {
    throw new GeneratorFeil(
      "prompt_mangler",
      "Lesevenn mangler oppsettet sitt for denne operasjonen.",
      "Prøv igjen senere. Står det ved, er det en feil hos oss.",
      e,
    );
  }
}

/* ------------------------------------------------------------------ *
 * Modellkallet
 * ------------------------------------------------------------------ */

let klientbuffer: Anthropic | null = null;

function klient(): Anthropic {
  if (klientbuffer) return klientbuffer;
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new GeneratorFeil(
      "tilgang_avslaatt",
      "Lesevenn mangler tilgangen den trenger for å behandle teksten.",
      "Dette er en feil hos oss, ikke noe du har gjort. Teksten din er lagret, " +
        "og du kan lese den videre uten markeringer mens vi retter det.",
    );
  }
  klientbuffer = new Anthropic();
  return klientbuffer;
}

/**
 * Tenkekonfigurasjon per modell.
 *
 * Haiku 4.5 og Sonnet 5 har ULIK API-form her, og det er en direkte følge av
 * at §6.4 bruker ulike modeller til ulike oppgaver: Haiku tar
 * `{type: "enabled", budget_tokens: N}`, mens Sonnet 5 tar
 * `{type: "adaptive"}`. Å sende adaptiv til Haiku, eller `effort` til Haiku
 * i det hele tatt, feiler.
 *
 * Forskjellen er samlet her slik at ingen generator trenger å kjenne den.
 */
function tenkning(modell: string) {
  if (modell.startsWith("claude-haiku")) {
    return { type: "enabled" as const, budget_tokens: 4000 };
  }
  return { type: "adaptive" as const };
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
export async function kjoerGenerator<S extends z.ZodType>({
  oppgave,
  skjema,
  brukermelding,
  overstyrVersjon,
  maksTokens = 8000,
}: {
  oppgave: Oppgave;
  skjema: S;
  brukermelding: string;
  overstyrVersjon?: string;
  maksTokens?: number;
}): Promise<Resultat<z.infer<S>>> {
  const prompt = await hentPrompt(oppgave, overstyrVersjon);
  const modus = testmodus();

  /*
   * Testmodus `les`: svaret kommer fra disk, og modellen kalles ikke.
   *
   * Merk at skjemavalideringen kjører likevel, på presis samme måte som for et
   * ferskt svar. En testmodus som hoppet over den ville demonstrert en kodevei
   * som ikke finnes i drift.
   */
  if (modus === "les") {
    const lagret = await hentLagret(oppgave, prompt.versjon, brukermelding);

    if (!lagret) {
      throw new GeneratorFeil(
        "lagret_svar_mangler",
        "Lesevenn kjører i testmodus, og det finnes ikke noe lagret svar for denne teksten.",
        "Testmodus dekker bare eksempelteksten som ligger i repoet. Bruk den, " +
          "eller sett LESEVENN_TESTMODUS=av og legg inn en egen API-nøkkel for å " +
          "kjøre mot modellen.",
      );
    }

    const validert = skjema.safeParse(lagret.data);
    if (!validert.success) {
      throw new GeneratorFeil(
        "ugyldig_utdata",
        "Det lagrede svaret passer ikke formen Lesevenn forventer.",
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

  try {
    const svar = await klient().messages.parse({
      model: prompt.modell,
      max_tokens: maksTokens,
      thinking: tenkning(prompt.modell),
      system: prompt.tekst,
      messages: [{ role: "user", content: brukermelding }],
      output_config: { format: zodOutputFormat(skjema) },
    });

    if (svar.parsed_output === null || svar.parsed_output === undefined) {
      throw new GeneratorFeil(
        "ugyldig_utdata",
        "Lesevenn fikk et svar den ikke kunne bruke.",
        "Prøv igjen. Skjer det på nytt med samme tekst, kan teksten være vanskelig å behandle — prøv et kortere utdrag.",
      );
    }

    // Testmodus `skriv`: dette er hvordan filene i testdata/ lages. Lagringen
    // skjer etter valideringen over, så et svar som ikke holdt formen havner
    // aldri på disk.
    if (modus === "skriv") {
      await lagreSvar(
        oppgave,
        prompt.versjon,
        prompt.modell,
        brukermelding,
        svar.parsed_output,
      );
    }

    return {
      data: svar.parsed_output as z.infer<S>,
      promptversjon: prompt.versjon,
      modell: prompt.modell,
    };
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
      throw new GeneratorFeil(
        "tilgang_avslaatt",
        "Lesevenn mangler tilgangen den trenger for å behandle teksten.",
        "Dette er en feil hos oss, ikke noe du har gjort. Teksten din er " +
          "lagret, og du kan lese den videre uten markeringer mens vi retter det.",
        e,
      );
    }

    // 429: den ene feilen der «prøv igjen om litt» faktisk er riktig råd.
    if (e instanceof Anthropic.RateLimitError) {
      throw new GeneratorFeil(
        "for_mange_kall",
        "Lesevenn har for mye å gjøre akkurat nå.",
        "Vent et minutt og prøv igjen. Teksten din er lagret.",
        e,
      );
    }

    throw new GeneratorFeil(
      "modellfeil",
      "Lesevenn fikk ikke behandlet teksten.",
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
