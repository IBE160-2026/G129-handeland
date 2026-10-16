/**
 * Tester for quizgeneratoren — FR-13 og formkravene i FR-14.
 *
 * Modellen kalles aldri: svaret legges i testmodus-lageret først, som i
 * faguttrykk.test.ts. Det disse testene IKKE sier noe om, er om spørsmålene
 * er gode og forankret — det måles manuelt på Quiz-gullsettet (FR-14, M1).
 */

import { rm } from "node:fs/promises";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { delIAvsnitt } from "../tekst/avsnittsdeling";
import { GeneratorFeil, formaterAvsnitt, hentPrompt } from "./kontrakt";
import { lagreSvar, noekkel } from "./lagretsvar";
import {
  ANTALL_SPORSMAL,
  MINST_FLERVALG,
  delerITeksten,
  genererQuiz,
  grunnTilForkasting,
} from "./quiz";

const GJELDENDE = await hentPrompt("quiz");

// Tre deler med overskrift, to avsnitt brødtekst i hver.
//   1 overskrift, 2-3 brødtekst | 4 overskrift, 5-6 | 7 overskrift, 8-9
const TEKST =
  "Celledeling\n\n" +
  "Mitose er den vanligste formen for celledeling hos planter og dyr.\n\n" +
  "Cellen kopierer arvestoffet sitt før den deler seg.\n\n" +
  "Meiose\n\n" +
  "Meiose gir kjønnsceller med halvparten så mange kromosomer.\n\n" +
  "Den skjer bare i kjønnsorganene.\n\n" +
  "Når det går galt\n\n" +
  "En feil i kopieringen kalles en mutasjon.\n\n" +
  "De fleste mutasjoner er harmløse.";

const avsnitt = delIAvsnitt(TEKST);
const melding = formaterAvsnitt(avsnitt);

function flervalg(kildeavsnitt: number, n: number) {
  return {
    type: "flervalg" as const,
    sporsmal: `Flervalgsspørsmål ${n}?`,
    alternativer: [`Riktig ${n}`, `Galt A${n}`, `Galt B${n}`, `Galt C${n}`],
    riktigSvar: `Riktig ${n}`,
    kildeavsnitt,
  };
}
function kortsvar(kildeavsnitt: number, n: number) {
  return {
    type: "kortsvar" as const,
    sporsmal: `Forklar ${n}?`,
    alternativer: [],
    riktigSvar: `Et eksempelsvar ${n}.`,
    kildeavsnitt,
  };
}

let foer: { modus?: string; noekkel?: string };
beforeEach(() => {
  foer = { modus: process.env.LESEVENN_TESTMODUS, noekkel: process.env.ANTHROPIC_API_KEY };
  delete process.env.ANTHROPIC_API_KEY;
  process.env.LESEVENN_TESTMODUS = "les";
});
afterEach(async () => {
  if (foer.modus === undefined) delete process.env.LESEVENN_TESTMODUS;
  else process.env.LESEVENN_TESTMODUS = foer.modus;
  if (foer.noekkel === undefined) delete process.env.ANTHROPIC_API_KEY;
  else process.env.ANTHROPIC_API_KEY = foer.noekkel;
  await rm(
    path.join(process.cwd(), "testdata", "modellsvar", "quiz", `${noekkel("quiz", GJELDENDE.versjon, melding)}.json`),
    { force: true },
  );
});

async function gittSvar(sporsmal: unknown[]) {
  await lagreSvar("quiz", GJELDENDE.versjon, GJELDENDE.modell, melding, { sporsmal });
}

/* ------------------------------------------------------------------ */

describe("tekstens deler", () => {
  test("en del begynner ved en overskrift", () => {
    const d = delerITeksten(avsnitt);
    expect([2, 3].map((n) => d.get(n))).toEqual([0, 0]);
    expect([5, 6].map((n) => d.get(n))).toEqual([1, 1]);
    expect([8, 9].map((n) => d.get(n))).toEqual([2, 2]);
    expect(d.has(1)).toBe(false); // overskrifter hører ikke til noen del
  });

  test("tekst uten overskrifter er én del", () => {
    const d = delerITeksten(delIAvsnitt("Første avsnitt her.\n\nAndre avsnitt her."));
    expect(new Set(d.values()).size).toBe(1);
  });
});

describe("forkasting — elementbrudd (AD-11)", () => {
  const brodtekst = new Set([2, 3, 5, 6, 8, 9]);
  const alle = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const grunn = (k: Parameters<typeof grunnTilForkasting>[0]) =>
    grunnTilForkasting(k, brodtekst, alle);

  test("et gyldig flervalg og et gyldig kortsvar holder", () => {
    expect(grunn(flervalg(2, 1))).toBeNull();
    expect(grunn(kortsvar(5, 2))).toBeNull();
  });
  test("kildeavsnitt som ikke finnes", () => {
    expect(grunn(flervalg(42, 1))).toMatch(/finnes ikke/);
  });
  test("kildeavsnitt som er en overskrift", () => {
    expect(grunn(flervalg(4, 1))).toMatch(/overskrift/);
  });
  test("tre alternativer", () => {
    expect(grunn({ ...flervalg(2, 1), alternativer: ["Riktig 1", "a", "b"] })).toMatch(/3 alternativer/);
  });
  test("to like alternativer", () => {
    expect(grunn({ ...flervalg(2, 1), alternativer: ["Riktig 1", "a", "A ", "b"] })).toMatch(/like/);
  });
  test("riktig svar som ikke er blant alternativene", () => {
    expect(grunn({ ...flervalg(2, 1), riktigSvar: "Noe helt annet" })).toMatch(/ikke ett av alternativene/);
  });
});

describe("genererQuiz — settkravene i FR-13", () => {
  test("ti gyldige gir åtte, med minst fem flervalg og minst ett kortsvar", async () => {
    await gittSvar([
      flervalg(2, 1), flervalg(3, 2), flervalg(5, 3), flervalg(6, 4), flervalg(8, 5),
      flervalg(9, 6), flervalg(2, 7), flervalg(5, 8), kortsvar(3, 9), kortsvar(8, 10),
    ]);
    const q = await genererQuiz(avsnitt);
    expect(q.sporsmal).toHaveLength(ANTALL_SPORSMAL);
    expect(q.sporsmal.filter((s) => s.erFlervalg).length).toBeGreaterThanOrEqual(MINST_FLERVALG);
    expect(q.sporsmal.some((s) => !s.erFlervalg)).toBe(true);
    expect(q.udekkedeDeler).toEqual([]);
    // Tekstens rekkefølge.
    const numre = q.sporsmal.map((s) => s.kildeavsnittNummer);
    expect(numre).toEqual([...numre].sort((a, b) => a - b));
  });

  test("alle deler får et spørsmål, selv når modellen samlet de beste i åpningen", async () => {
    // De åtte første er alle fra del 1. Uten dekningskravet ville quizen
    // ikke spurt om meiose eller mutasjoner i det hele tatt.
    await gittSvar([
      flervalg(2, 1), flervalg(3, 2), flervalg(2, 3), flervalg(3, 4), flervalg(2, 5),
      flervalg(3, 6), kortsvar(2, 7), flervalg(3, 8), flervalg(5, 9), flervalg(9, 10),
    ]);
    const q = await genererQuiz(avsnitt);
    const deler = delerITeksten(avsnitt);
    const dekket = new Set(q.sporsmal.map((s) => deler.get(s.kildeavsnittNummer)));
    expect(dekket).toEqual(new Set([0, 1, 2]));
    expect(q.udekkedeDeler).toEqual([]);
  });

  test("en del uten kandidater rapporteres, framfor å felle quizen", async () => {
    await gittSvar([
      flervalg(2, 1), flervalg(3, 2), flervalg(5, 3), flervalg(6, 4), flervalg(2, 5),
      flervalg(3, 6), kortsvar(5, 7), flervalg(6, 8),
    ]);
    const q = await genererQuiz(avsnitt);
    expect(q.sporsmal).toHaveLength(8);
    expect(q.udekkedeDeler).toEqual([2]);
  });

  test("ugyldige kandidater forkastes med begrunnelse", async () => {
    await gittSvar([
      flervalg(2, 1), flervalg(3, 2), flervalg(5, 3), flervalg(6, 4), flervalg(8, 5),
      flervalg(9, 6), kortsvar(3, 7), flervalg(2, 8),
      flervalg(4, 9), // overskrift
      { ...flervalg(5, 10), riktigSvar: "finnes ikke" },
    ]);
    const q = await genererQuiz(avsnitt);
    expect(q.forkastet).toHaveLength(2);
    expect(q.forkastet.map((f) => f.grunn).join(" ")).toMatch(/overskrift/);
  });

  test("for få gyldige gir en feil eleven kan gjøre noe med, ikke en halv quiz", async () => {
    await gittSvar([flervalg(2, 1), flervalg(3, 2), kortsvar(5, 3)]);
    await expect(genererQuiz(avsnitt)).rejects.toBeInstanceOf(GeneratorFeil);
  });

  test("ingen kortsvar gir feil, siden FR-13 krever minst ett", async () => {
    await gittSvar(Array.from({ length: 10 }, (_, i) => flervalg([2, 3, 5, 6, 8, 9][i % 6], i)));
    await expect(genererQuiz(avsnitt)).rejects.toBeInstanceOf(GeneratorFeil);
  });

  test("alternativene stokkes, men er de samme fire, med fasiten blant dem", async () => {
    await gittSvar([
      flervalg(2, 1), flervalg(3, 2), flervalg(5, 3), flervalg(6, 4), flervalg(8, 5),
      flervalg(9, 6), flervalg(2, 7), flervalg(5, 8), kortsvar(3, 9), kortsvar(8, 10),
    ]);
    const q = await genererQuiz(avsnitt);
    for (const s of q.sporsmal.filter((s) => s.erFlervalg)) {
      expect(s.alternativer).toHaveLength(4);
      expect(s.alternativer).toContain(s.riktigSvar);
    }
    // Modellen la alltid fasiten først. Etter stokking skal den ikke alltid
    // stå først — sannsynligheten for det med sju flervalg er 1/4^7.
    const foerst = q.sporsmal.filter((s) => s.erFlervalg).every((s) => s.alternativer[0] === s.riktigSvar);
    expect(foerst).toBe(false);
  });
});
