/**
 * Tester for generatorkontrakten.
 *
 * Alt her er deterministisk og kaller ikke modellen — `npm test`-halvdelen av
 * AD-5. Det selve modellkallet gjør, hører i `npm run maal`.
 *
 * Den viktigste testen er den siste: at hver versjon manifestet navngir
 * faktisk finnes på disk. Det er feilen AD-14 gjør mulig å gjøre — å
 * forfremme en versjon som ikke er der — og den ville ellers først vist seg
 * når en elev trykket på en knapp.
 */

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { z } from "zod";
import { delIAvsnitt } from "../tekst/avsnittsdeling";
import {
  FEILKODER,
  GeneratorFeil,
  formaterAvsnitt,
  hentPrompt,
  kanProevesPaaNytt,
  kjoerGenerator,
  settKlientForTest,
  type Feilkode,
  type Oppgave,
} from "./kontrakt";

const PROMPTROT = path.join(process.cwd(), "prompts");

describe("AD-14 — manifestet bestemmer hva som er gjeldende", () => {
  test("hentPrompt gir det manifestet navngir, ikke noe hardkodet", async () => {
    // Sammenlignes mot manifestet og ikke mot konstanter. Ellers tester denne
    // fila hva manifestet TILFELDIGVIS inneholder, og brekker hver gang en
    // versjon eller modell forfremmes legitimt — altså akkurat den handlingen
    // AD-14 finnes for å gjøre trygg.
    const manifest = JSON.parse(
      await readFile(path.join(PROMPTROT, "gjeldende.json"), "utf8"),
    ) as { oppgaver: Record<string, { versjon: string; modell: string }> };

    const p = await hentPrompt("faguttrykk");
    expect(p.versjon).toBe(manifest.oppgaver.faguttrykk.versjon);
    expect(p.modell).toBe(manifest.oppgaver.faguttrykk.modell);
    expect(p.tekst.length).toBeGreaterThan(100);
  });

  test("promptteksten beskriver avsnittsformatet den faktisk får", async () => {
    // Teksten sendes som brukermelding, ikke bakt inn i systemprompten.
    // Da må systemprompten beskrive formatet i stedet — ellers må modellen
    // gjette hva merkelappene betyr, og kildeavsnittene blir upålitelige.
    //
    // Denne testen erstatter en tidligere som sjekket at prompten inneholdt
    // plassholderen {{AVSNITT}}. Plassholderen ble aldri fylt ut av noen:
    // `kjoerGenerator` sender prompten som system og teksten som melding.
    // Testen bestod, og beskyttet ingenting.
    const p = await hentPrompt("faguttrykk");
    expect(p.tekst).toContain("[avsnitt 1, overskrift]");
    expect(p.tekst).not.toContain("{{");
  });

  test("harnessen kan overstyre versjonen", async () => {
    // AD-5: måleharnessen skal kunne kjøre en vilkårlig versjon for å
    // sammenligne to. Webappen gjør det aldri.
    const p = await hentPrompt("faguttrykk", "v1");
    expect(p.versjon).toBe("v1");
  });

  test("ukjent oppgave gir GeneratorFeil med kode og anbefalt handling", async () => {
    await expect(
      hentPrompt("finnes_ikke" as Oppgave),
    ).rejects.toThrowError(GeneratorFeil);

    try {
      await hentPrompt("finnes_ikke" as Oppgave);
    } catch (e) {
      const f = e as GeneratorFeil;
      expect(f.kode).toBe("ukjent_oppgave");
      // §5: ingen feiltilstand er en blindvei. Alle tre feltene må finnes.
      expect(f.elevmelding.length).toBeGreaterThan(0);
      expect(f.anbefaltHandling.length).toBeGreaterThan(0);
    }
  });

  test("versjon som ikke finnes på disk gir prompt_mangler", async () => {
    try {
      await hentPrompt("faguttrykk", "v99");
      throw new Error("skulle kastet");
    } catch (e) {
      expect(e).toBeInstanceOf(GeneratorFeil);
      expect((e as GeneratorFeil).kode).toBe("prompt_mangler");
    }
  });

  test("hver versjon manifestet navngir finnes faktisk på disk", async () => {
    const manifest = JSON.parse(
      await readFile(path.join(PROMPTROT, "gjeldende.json"), "utf8"),
    ) as { oppgaver: Record<string, { versjon: string; modell: string }> };

    for (const [oppgave, oppføring] of Object.entries(manifest.oppgaver)) {
      const filer = await readdir(path.join(PROMPTROT, oppgave));
      expect(filer, `${oppgave} mangler ${oppføring.versjon}.md`).toContain(
        `${oppføring.versjon}.md`,
      );
    }
  });

  test("hver oppføring oppgir en gyldig tenkemodus", async () => {
    // Dette er testen som hindrer feilen heuristikken gjorde mulig: Haiku 4.5
    // tar `budget_tokens` og avviser `adaptive`, mens Haiku 5.5 gjør det
    // motsatte. Samme familie, motsatt krav. Å gjette fra modellnavnet gir
    // derfor 400 ved neste modellbytte, så modusen må stå i manifestet — og
    // da må noe håndheve at den faktisk gjør det.
    const manifest = JSON.parse(
      await readFile(path.join(PROMPTROT, "gjeldende.json"), "utf8"),
    ) as { oppgaver: Record<string, { tenkning?: string }> };

    const gyldige = ["budsjett", "adaptiv", "av"];

    for (const [oppgave, oppføring] of Object.entries(manifest.oppgaver)) {
      expect(
        oppføring.tenkning,
        `${oppgave} mangler tenkemodus. Gyldige: ${gyldige.join(", ")}`,
      ).toBeDefined();
      expect(
        gyldige,
        `${oppgave} har ugyldig tenkemodus «${oppføring.tenkning}»`,
      ).toContain(oppføring.tenkning);
    }
  });

  test("hentPrompt gir tenkemodusen og konsistensen videre", async () => {
    const manifest = JSON.parse(
      await readFile(path.join(PROMPTROT, "gjeldende.json"), "utf8"),
    ) as {
      oppgaver: Record<
        string,
        {
          tenkning: string;
          konsistens?: { kjoeringer: number; minstEnighet: number };
        }
      >;
    };
    const o = manifest.oppgaver.faguttrykk;
    const p = await hentPrompt("faguttrykk");

    expect(p.tenkning).toBe(o.tenkning);
    expect(p.konsistens).toEqual(o.konsistens);
  });

  test("konsistens, om den er oppgitt, krever flertall og ikke mer", async () => {
    // FR-11: minstEnighet maa vaere minst 2 for at det skal vaere enighet i
    // det hele tatt, og hoeyst kjoeringer — et krav om seks av fem er
    // umulig og ville gitt tomt Begrepssett for hver tekst.
    const manifest = JSON.parse(
      await readFile(path.join(PROMPTROT, "gjeldende.json"), "utf8"),
    ) as {
      oppgaver: Record<
        string,
        { konsistens?: { kjoeringer: number; minstEnighet: number } }
      >;
    };

    for (const [oppgave, o] of Object.entries(manifest.oppgaver)) {
      if (!o.konsistens) continue;
      const { kjoeringer, minstEnighet } = o.konsistens;
      expect(kjoeringer, `${oppgave}: for få kjøringer`).toBeGreaterThan(1);
      expect(minstEnighet, `${oppgave}: enighet må være minst 2`).toBeGreaterThan(1);
      expect(
        minstEnighet,
        `${oppgave}: krever ${minstEnighet} av ${kjoeringer} — umulig`,
      ).toBeLessThanOrEqual(kjoeringer);
    }
  });

  test("hver oppføring navngir en modell", async () => {
    // AD-4: modellidentitet stemples på alt generert. Mangler den i
    // manifestet, har stempelet ingen kilde.
    const manifest = JSON.parse(
      await readFile(path.join(PROMPTROT, "gjeldende.json"), "utf8"),
    ) as { oppgaver: Record<string, { versjon: string; modell: string }> };

    for (const [oppgave, oppføring] of Object.entries(manifest.oppgaver)) {
      expect(oppføring.modell, `${oppgave} mangler modell`).toMatch(
        /^claude-/,
      );
    }
  });
});

describe("§5 — tilgangsfeil gir ikke rådet «prøv igjen»", () => {
  test("manglende nøkkel gir tilgang_avslaatt, ikke modellfeil", async () => {
    // Samme feilkode som en utløpt eller tilbaketrukket nøkkel gir, fordi det
    // er samme problem for eleven: appen kommer ikke til modellen, og det er
    // ingenting eleven kan gjøre med det.
    //
    // Det som gjør skillet verdt en egen kode er RÅDET. Den generelle
    // modellfeil-grenen sier «prøv igjen om litt», og det kan aldri virke mot
    // en utløpt nøkkel. §5 krever minst én konkret ting eleven kan gjøre, og
    // et råd som ikke kan virke er ikke det.
    const foerModus = process.env.LESEVENN_TESTMODUS;
    const foerNoekkel = process.env.ANTHROPIC_API_KEY;
    process.env.LESEVENN_TESTMODUS = "av";
    delete process.env.ANTHROPIC_API_KEY;

    try {
      await kjoerGenerator({
        oppgave: "faguttrykk",
        skjema: z.object({ noe: z.string() }),
        brukermelding: "hva som helst",
      });
      throw new Error("skulle kastet");
    } catch (e) {
      expect(e).toBeInstanceOf(GeneratorFeil);
      const f = e as GeneratorFeil;
      expect(f.kode).toBe("tilgang_avslaatt");
      expect(f.anbefaltHandling).not.toMatch(/prøv igjen/i);
      // Og eleven skal få vite at arbeidet ikke er tapt.
      expect(f.anbefaltHandling).toMatch(/lagret/i);
    } finally {
      if (foerModus === undefined) delete process.env.LESEVENN_TESTMODUS;
      else process.env.LESEVENN_TESTMODUS = foerModus;
      if (foerNoekkel === undefined) delete process.env.ANTHROPIC_API_KEY;
      else process.env.ANTHROPIC_API_KEY = foerNoekkel;
    }
  });
});

describe("§5 — ett nytt forsøk når kallet feiler", () => {
  // En falsk klient i stedet for modellen (AD-5: `npm test` kaller den aldri).
  // Hver test gir den en rekke utfall, ett per kall, og teller kallene.
  const skjema = z.object({ noe: z.string() });
  const gyldig = { parsed_output: { noe: "svar" }, stop_reason: "end_turn", usage: { output_tokens: 10 } };
  const ugyldig = { parsed_output: null, stop_reason: "max_tokens", usage: { output_tokens: 16000 } };
  const tidsavbrudd = () => new Anthropic.APIConnectionTimeoutError();
  const avslaatt = () => new Anthropic.AuthenticationError(401, undefined, "ugyldig nøkkel", new Headers());
  const forMange = () => new Anthropic.RateLimitError(429, undefined, "for mange kall", new Headers());
  const feilForesporsel = () => new Anthropic.BadRequestError(400, undefined, "ukjent felt", new Headers());

  let foerModus: string | undefined;
  let advarsel: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    foerModus = process.env.LESEVENN_TESTMODUS;
    process.env.LESEVENN_TESTMODUS = "av";
    advarsel = vi.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => {
    advarsel.mockRestore();
    settKlientForTest(null);
    if (foerModus === undefined) delete process.env.LESEVENN_TESTMODUS;
    else process.env.LESEVENN_TESTMODUS = foerModus;
  });

  /** Klienten gir utfallene i rekkefølge: et objekt er et svar, en Error kastes. */
  function falskKlient(...utfall: (object | (() => Error))[]) {
    const parse = vi.fn(async () => {
      const neste = utfall.shift();
      if (neste === undefined) throw new Error("testen ga for få utfall");
      if (typeof neste === "function") throw neste();
      return neste;
    });
    settKlientForTest({ messages: { parse } });
    return parse;
  }

  const kjoer = () => kjoerGenerator({ oppgave: "quiz", skjema, brukermelding: "hva som helst" });
  const feilkode = (p: Promise<unknown>) =>
    p.then(
      () => "ingen feil",
      (e) => (e instanceof GeneratorFeil ? e.kode : `annen feil: ${e}`),
    );

  test("første svar ugyldig, andre gyldig: resultatet fra det andre", async () => {
    const parse = falskKlient(ugyldig, gyldig);
    const r = await kjoer();
    expect(r.data).toEqual({ noe: "svar" });
    expect(parse).toHaveBeenCalledTimes(2);
  });

  test("to ugyldige svar gir ugyldig_utdata, og ikke et tredje kall", async () => {
    const parse = falskKlient(ugyldig, ugyldig, gyldig);
    expect(await feilkode(kjoer())).toBe("ugyldig_utdata");
    expect(parse).toHaveBeenCalledTimes(2);
  });

  test("tidsavbrudd, så svar: resultatet", async () => {
    const parse = falskKlient(tidsavbrudd, gyldig);
    expect((await kjoer()).data).toEqual({ noe: "svar" });
    expect(parse).toHaveBeenCalledTimes(2);
  });

  test("to tidsavbrudd gir tidsavbrudd", async () => {
    const parse = falskKlient(tidsavbrudd, tidsavbrudd);
    expect(await feilkode(kjoer())).toBe("tidsavbrudd");
    expect(parse).toHaveBeenCalledTimes(2);
  });

  test("en annen modellfeil, så svar: resultatet", async () => {
    const parse = falskKlient(() => new Error("500 fra leverandøren"), gyldig);
    expect((await kjoer()).data).toEqual({ noe: "svar" });
    expect(parse).toHaveBeenCalledTimes(2);
  });

  test("tilgang avslått (401): ingen nytt forsøk, samme melding som før", async () => {
    const parse = falskKlient(avslaatt, gyldig);
    const e = await kjoer().catch((x) => x);
    expect(e).toBeInstanceOf(GeneratorFeil);
    expect(e.kode).toBe("tilgang_avslaatt");
    expect(e.anbefaltHandling).not.toMatch(/prøv igjen/i);
    expect(parse).toHaveBeenCalledTimes(1);
  });

  test("429: ingen nytt forsøk her (SDK-en har sine egne)", async () => {
    const parse = falskKlient(forMange, gyldig);
    expect(await feilkode(kjoer())).toBe("for_mange_kall");
    expect(parse).toHaveBeenCalledTimes(1);
  });

  test("det nye svaret valideres som det første", async () => {
    // AD-11: det andre kallet går gjennom samme sjekk som det første. Et
    // ugyldig andre svar slipper ikke gjennom bare fordi det er et nytt forsøk.
    const parse = falskKlient(tidsavbrudd, ugyldig);
    expect(await feilkode(kjoer())).toBe("ugyldig_utdata");
    expect(parse).toHaveBeenCalledTimes(2);
  });

  test("testmodus les: ingen nytt forsøk, og modellen kalles ikke", async () => {
    process.env.LESEVENN_TESTMODUS = "les";
    const parse = falskKlient(gyldig, gyldig);
    expect(await feilkode(kjoer())).toBe("lagret_svar_mangler");
    expect(parse).not.toHaveBeenCalled();
  });

  test("400 (feil forespørsel): ingen nytt forsøk, og en kode som ikke prøves på nytt", async () => {
    const parse = falskKlient(feilForesporsel, gyldig);
    expect(await feilkode(kjoer())).toBe("ugyldig_foresporsel");
    expect(parse).toHaveBeenCalledTimes(1);
  });

  test("den første feilen logges før det nye forsøket", async () => {
    falskKlient(ugyldig, gyldig);
    await kjoer();
    expect(advarsel).toHaveBeenCalledOnce();
    expect(String(advarsel.mock.calls[0][0])).toMatch(/quiz.*ugyldig_utdata/);
  });

  test("nyttForsoek: false (generatorer med egen løkke): ett kall, også ved en feil som kan gå over", async () => {
    const parse = falskKlient(ugyldig, gyldig);
    expect(await feilkode(kjoerGenerator({ oppgave: "quiz", skjema, brukermelding: "hva som helst", nyttForsoek: false }))).toBe("ugyldig_utdata");
    expect(parse).toHaveBeenCalledTimes(1);
  });

  test("PRD §6.4: tokenbruken står på resultatet og meldes til paaForbruk, én gang per kall", async () => {
    const medBruk = { ...gyldig, usage: { input_tokens: 1200, cache_read_input_tokens: 300, output_tokens: 400 } };
    falskKlient(medBruk);
    const meldt: unknown[] = [];
    const r = await kjoerGenerator({ oppgave: "quiz", skjema, brukermelding: "x", paaForbruk: (p) => meldt.push(p) });
    const modell = (await hentPrompt("quiz")).modell;
    // Bufrede tokens telles med inn.
    expect(r.forbruk).toEqual([{ oppgave: "quiz", modell, inn: 1500, ut: 400, bufferSkriving: 0 }]);
    expect(meldt).toEqual(r.forbruk);
  });

  test("PRD §6.4: skriving til hurtigbufferen skilles ut, så den kan prises høyere", async () => {
    falskKlient({ ...gyldig, usage: { input_tokens: 100, cache_creation_input_tokens: 900, output_tokens: 10 } });
    const r = await kjoer();
    expect(r.forbruk[0]).toMatchObject({ inn: 1000, bufferSkriving: 900 });
  });

  test("PRD §6.4: foerKall kjøres før hvert kall, også det nye forsøket", async () => {
    falskKlient(ugyldig, gyldig);
    const foerKall = vi.fn(async () => {});
    await kjoerGenerator({ oppgave: "quiz", skjema, brukermelding: "x", foerKall });
    expect(foerKall).toHaveBeenCalledTimes(2);
  });

  test("PRD §6.4: kaster foerKall, kalles ikke modellen, og feilen går uendret videre", async () => {
    const parse = falskKlient(ugyldig, gyldig);
    const stopp = new Error("taket");
    let n = 0;
    const foerKall = async () => {
      if (++n === 2) throw stopp;
    };
    const e = await kjoerGenerator({ oppgave: "quiz", skjema, brukermelding: "x", foerKall }).catch((x) => x);
    expect(e).toBe(stopp);
    expect(parse).toHaveBeenCalledTimes(1);
  });

  test("PRD §6.4: testmodus les kjører ikke foerKall", async () => {
    process.env.LESEVENN_TESTMODUS = "les";
    const foerKall = vi.fn(async () => {});
    await kjoerGenerator({ oppgave: "quiz", skjema, brukermelding: "x", foerKall }).catch(() => {});
    expect(foerKall).not.toHaveBeenCalled();
  });

  test("PRD §6.4: to ugyldige svar — begge kallene meldes, og feilen bærer dem", async () => {
    falskKlient(ugyldig, ugyldig);
    const meldt: { ut: number }[] = [];
    const e = await kjoerGenerator({ oppgave: "quiz", skjema, brukermelding: "x", paaForbruk: (p) => meldt.push(p) }).catch((x) => x);
    expect(e).toBeInstanceOf(GeneratorFeil);
    expect(meldt.map((p) => p.ut)).toEqual([16000, 16000]);
    expect(e.forbruk).toHaveLength(2);
  });

  test("PRD §6.4: et tidsavbrudd anslås høyt (hele tokentaket ut), et 401 meldes med null", async () => {
    falskKlient(tidsavbrudd, gyldig);
    const meldt: { inn: number; ut: number }[] = [];
    await kjoerGenerator({ oppgave: "quiz", skjema, brukermelding: "x", paaForbruk: (p) => meldt.push(p) });
    expect(meldt).toHaveLength(2);
    expect(meldt[0].ut).toBe(16000);
    expect(meldt[0].inn).toBeGreaterThan(0);

    falskKlient(avslaatt);
    const meldt2: { inn: number; ut: number }[] = [];
    await kjoerGenerator({ oppgave: "quiz", skjema, brukermelding: "x", paaForbruk: (p) => meldt2.push(p) }).catch(() => {});
    expect(meldt2).toEqual([expect.objectContaining({ inn: 0, ut: 0 })]);
  });

  test("PRD §6.4: testmodus les melder ingenting", async () => {
    process.env.LESEVENN_TESTMODUS = "les";
    falskKlient(gyldig);
    const meldt: unknown[] = [];
    await kjoerGenerator({ oppgave: "quiz", skjema, brukermelding: "x", paaForbruk: (p) => meldt.push(p) }).catch(() => {});
    expect(meldt).toEqual([]);
  });

  test("kanProevesPaaNytt følger matrisen, for hver kode som finnes", () => {
    const proeves: Feilkode[] = ["ugyldig_utdata", "tidsavbrudd", "modellfeil"];
    for (const k of FEILKODER) expect(kanProevesPaaNytt(k), k).toBe(proeves.includes(k));
  });

  test("settKlientForTest kaster utenfor en testkjøring", () => {
    const foer = { vitest: process.env.VITEST, node: process.env.NODE_ENV };
    delete process.env.VITEST;
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    try {
      expect(() => settKlientForTest(null)).toThrow(/bare brukes i testene/);
    } finally {
      process.env.VITEST = foer.vitest;
      (process.env as Record<string, string | undefined>).NODE_ENV = foer.node;
    }
  });
});

describe("AD-10 — avsnittslisten sendes med, numrene gjettes ikke", () => {
  const avsnitt = delIAvsnitt(
    "Celledeling\n\nMitose er den vanligste formen.\n\nNår det går galt\n\nArvestoffet kopieres feil.",
  );

  test("hvert avsnittsnummer er synlig for modellen", () => {
    const formatert = formaterAvsnitt(avsnitt);
    for (const a of avsnitt) {
      expect(formatert).toContain(`[avsnitt ${a.nummer}`);
    }
  });

  test("overskrifter er merket, slik at modellen kan skille dem", () => {
    const formatert = formaterAvsnitt(avsnitt);
    expect(formatert).toContain("[avsnitt 1, overskrift]");
    expect(formatert).toContain("[avsnitt 2]");
  });

  test("innholdet følger med", () => {
    const formatert = formaterAvsnitt(avsnitt);
    expect(formatert).toContain("Mitose er den vanligste formen.");
  });

  test("tom liste gir tom streng framfor å kaste", () => {
    expect(formaterAvsnitt([])).toBe("");
  });
});
