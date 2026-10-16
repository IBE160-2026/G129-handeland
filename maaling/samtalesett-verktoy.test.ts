/**
 * Verktøyet for Gullsettet til Fagsamtalen — FR-21. Kjøres via
 *
 *   npm run samtalesett -- forbered <tekst> <tekst> <tekst> [--forslag]
 *   npm run samtalesett -- valider
 *   npm run samtalesett -- maal            (fra lagrede svar, gratis)
 *   npm run samtalesett -- maal-ferskt     (ekte kall, lagrer svarene)
 *
 * som setter SAMTALESETT_KOMMANDO og starter denne fila (maaling/samtalesett-kjor.mjs).
 * Vitest brukes fordi verktøyet må kalle de samme funksjonene som appen —
 * delIAvsnitt og vurderSvar — ikke en kopi (AD-1).
 *
 * Veiledningen står i _bmad-output/planning-artifacts/samtalegullsett.md.
 */

import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { config } from "dotenv";
import { expect, test } from "vitest";

// Testmodus avgjøres FØR .env.local lastes — samme felle som kodefunn 10.
const modusFraKommandolinjen = process.env.LESEVENN_TESTMODUS;
config({ path: ".env.local", quiet: true });
process.env.LESEVENN_TESTMODUS = modusFraKommandolinjen ?? "les";

import { startSamtale, vurderSvar } from "../generatorer/fagsamtale";
import { hentPrompt } from "../generatorer/kontrakt";
import { delIAvsnitt, type Avsnitt } from "../tekst/avsnittsdeling";
import { FASIT, VARIANTER, regnMaal, validerSamtalesett, type Samtalesett, type Tilfelle } from "./samtalesett";

const MAPPE = path.join(process.cwd(), "testdata", "samtale-gullsett");
const RESULTATER = path.join(process.cwd(), "maaling", "resultater");
const KOMMANDO = process.env.SAMTALESETT_KOMMANDO ?? "valider";
const TEKSTER = (process.env.SAMTALESETT_TEKSTER ?? "").split(",").filter(Boolean);
const FORSLAG = process.env.SAMTALESETT_FORSLAG === "1";

/** Tekstfila: fra gullsettet for fagord, eller eksempeltekstene. */
function tekstfil(navn: string): string {
  for (const mappe of ["gullsett", "eksempeltekst"]) {
    const f = path.join(process.cwd(), "testdata", mappe, `${navn}.txt`);
    if (existsSync(f)) return f;
  }
  throw new Error(`Fant ikke «${navn}.txt» i testdata/gullsett eller testdata/eksempeltekst.`);
}

async function lesAvsnitt(s: Samtalesett): Promise<Avsnitt[]> {
  return delIAvsnitt(await readFile(path.join(process.cwd(), "testdata", s.tekst), "utf8"));
}

async function lesSett(): Promise<{ fil: string; s: Samtalesett }[]> {
  if (!existsSync(MAPPE)) return [];
  const filer = (await readdir(MAPPE)).filter((f) => f.endsWith(".json")).sort();
  return Promise.all(
    filer.map(async (fil) => ({ fil, s: JSON.parse(await readFile(path.join(MAPPE, fil), "utf8")) as Samtalesett })),
  );
}

const erUtfylt = (s: Samtalesett) => s.startsporsmal.some((st) => VARIANTER.some((v) => st.svar[v]?.tekst.trim()));

/* ------------------------------------------------------------------ */

test(`samtalesett: ${KOMMANDO}`, { timeout: 900000 }, async () => {
  if (KOMMANDO === "forbered") return forbered();
  if (KOMMANDO === "valider") return valider();
  if (KOMMANDO === "maal") return maal();
  throw new Error(`Ukjent kommando «${KOMMANDO}». Bruk forbered, valider, maal eller maal-ferskt.`);
});

/* ------------------------------------------------------------------ */

async function forbered() {
  expect(TEKSTER.length, "Oppgi tekstene: npm run samtalesett -- forbered norsk-metafor teknologi-operativsystem …").toBeGreaterThan(0);
  await mkdir(MAPPE, { recursive: true });

  for (const navn of TEKSTER) {
    const fil = tekstfil(navn);
    const relativ = path.relative(path.join(process.cwd(), "testdata"), fil).split(path.sep).join("/");
    const avsnitt = delIAvsnitt(await readFile(fil, "utf8"));
    const tittel = avsnitt.find((a) => a.erOverskrift)?.innhold ?? navn;

    // Malen — skrives aldri over. Svarene er timer med arbeid.
    const mal = path.join(MAPPE, `${navn}.json`);
    if (existsSync(mal)) {
      console.log(`= ${navn}.json finnes alt, rører den ikke`);
    } else {
      const tomt = () => ({
        dekkende: { tekst: "" },
        delvis: { tekst: "" },
        misoppfatning1: { tekst: "", motsigendeAvsnitt: null },
        misoppfatning2: { tekst: "", motsigendeAvsnitt: null },
        uklart: { tekst: "" },
        utenfor: { tekst: "" },
      });
      const innhold = {
        _om: "Gullsettet for Fagsamtalen (FR-21). Fyll inn to startspørsmål og seks svar til hvert. Se samtalegullsett.md. Avsnittsnumrene står i " + `${navn}.avsnitt.md.`,
        tekst: relativ,
        tittel,
        annotert: null,
        startsporsmal: [
          { id: "A", sporsmal: "", kildeavsnitt: null, svar: tomt() },
          { id: "B", sporsmal: "", kildeavsnitt: null, svar: tomt() },
        ],
      };
      await writeFile(mal, `${JSON.stringify(innhold, null, 2)}\n`, "utf8");
      console.log(`+ ${navn}.json laget`);
    }

    // Avsnittsoversikten — med numrene appen bruker. Avledet, så den kan
    // skrives på nytt.
    const linjer = [
      `# ${tittel} — avsnittene`,
      "",
      "Numrene er de appen bruker (delIAvsnitt). Bruk dem i «kildeavsnitt» og «motsigendeAvsnitt».",
      "Overskrifter kan ikke brukes — svaret står alltid i brødteksten.",
      "",
      ...avsnitt.map((a) => (a.erOverskrift ? `## [${a.nummer}] ${a.innhold}` : `**[${a.nummer}]** ${a.innhold}\n`)),
    ];

    if (FORSLAG) {
      linjer.push("", "---", "", "## Forslag til startspørsmål fra appen", "");
      linjer.push("Laget av samtalestart-prompten. Bruk dem som de er, skriv dem om, eller lag egne.", "");
      for (let i = 0; i < 3; i++) {
        const s = await startSamtale(avsnitt);
        linjer.push(`- (avsnitt ${s.kildeavsnittNummer}) ${s.sporsmal}`);
      }
    }
    await writeFile(path.join(MAPPE, `${navn}.avsnitt.md`), `${linjer.join("\n")}\n`, "utf8");
    console.log(`+ ${navn}.avsnitt.md skrevet${FORSLAG ? ", med forslag" : ""}`);
  }
}

/* ------------------------------------------------------------------ */

async function valider() {
  const sett = await lesSett();
  if (sett.length === 0) {
    console.log("\nIngen filer ennå. Start med: npm run samtalesett -- forbered <tekst> <tekst> <tekst>");
    return;
  }
  let alleOk = true;
  for (const { fil, s } of sett) {
    if (!erUtfylt(s)) {
      console.log(`\n= ${fil}: ikke utfylt ennå`);
      continue;
    }
    const feil = validerSamtalesett(s, await lesAvsnitt(s));
    console.log(`\n════════ ${s.tittel} (${fil})`);
    if (feil.length === 0) console.log("  Ingen innvendinger.");
    else {
      alleOk = false;
      for (const f of feil) console.log(`  – ${f}`);
    }
  }
  expect(alleOk, "Se innvendingene over").toBe(true);
}

/* ------------------------------------------------------------------ */

async function maal() {
  const sett = (await lesSett()).filter(({ s }) => erUtfylt(s));
  expect(sett.length, "Ingen utfylte filer å måle").toBeGreaterThan(0);
  for (const { fil, s } of sett) {
    const feil = validerSamtalesett(s, await lesAvsnitt(s));
    expect(feil, `${fil} har innvendinger — kjør «npm run samtalesett -- valider» først`).toEqual([]);
  }

  const versjon = (await hentPrompt("svarvurdering")).versjon;
  const tilfeller: Tilfelle[] = [];
  for (const { s } of sett) {
    const avsnitt = await lesAvsnitt(s);
    for (const st of s.startsporsmal) {
      for (const v of VARIANTER) {
        const sv = st.svar[v];
        const r = await vurderSvar({
          avsnitt,
          tidligere: [],
          gjeldende: { sporsmal: st.sporsmal, kildeavsnittNummer: st.kildeavsnitt! },
          elevsvar: sv.tekst,
          sisteRunde: false,
        });
        tilfeller.push({
          tekst: s.tittel,
          startId: st.id,
          variant: v,
          fasit: FASIT[v],
          motsigendeAvsnitt: sv.motsigendeAvsnitt ?? null,
          elevsvar: sv.tekst,
          tilstand: r.tilstand,
          begrunnelse: r.begrunnelse,
          oppfolging: r.oppfolging,
        });
      }
    }
  }

  const m = regnMaal(tilfeller);
  const dato = new Date().toISOString().slice(0, 10);
  const mappe = path.join(RESULTATER, `${dato}-fr21-svarvurdering-${versjon}`);
  await mkdir(mappe, { recursive: true });
  const ja = (b: boolean) => (b ? "bestått" : "**IKKE bestått**");
  const p = (x: number) => x.toFixed(2);

  const rapport = [
    `# FR-21 — Fagsamtalen mot Gullsettet, svarvurdering ${versjon}`,
    "",
    `Kjørt ${dato} på ${m.antall} tilfeller fra ${sett.length} tekster.`,
    "",
    "## Portene (AD-6) — blokkerende",
    "",
    "| Port | Krav | Målt | Status |",
    "|---|---|---|---|",
    `| Sikkerhetsport: misoppfatning lest som dekkende | 0 | ${m.sikkerhetsport.feil.length} av ${m.sikkerhetsport.avMulige} | ${ja(m.sikkerhetsport.bestatt)} |`,
    `| Gjenkalling for «trenger oppfølging» | ≥ 0,90 | ${p(m.gjenkalling.verdi)} (${m.gjenkalling.treff} av ${m.gjenkalling.avMulige}) | ${ja(m.gjenkalling.bestatt)} |`,
    "",
    m.sikkerhetsport.bestatt && m.gjenkalling.bestatt
      ? `**Begge portene er bestått. Svarvurdering ${versjon} kan stå som gjeldende (AD-6).**`
      : `**En port er ikke bestått. Etter AD-6 skal svarvurdering ${versjon} ikke stå som gjeldende.**`,
    "",
    "## De maskinelle målingene",
    "",
    "| Måling | Krav | Målt | Status |",
    "|---|---|---|---|",
    `| Måltest | ${m.maaltest.krav} av ${m.maaltest.avMulige} | ${m.maaltest.bestatt} | ${ja(m.maaltest.ok)} |`,
    `| Avsnittstest | ${m.avsnittstest.avMulige} av ${m.avsnittstest.avMulige} | ${m.avsnittstest.bestatt} | ${ja(m.avsnittstest.ok)} |`,
    `| Treff mot forhåndsvalgt avsnitt | ≥ 0,70 | ${p(m.treffForhandsvalgt.verdi)} (${m.treffForhandsvalgt.treff} av ${m.treffForhandsvalgt.avMulige}) | ${ja(m.treffForhandsvalgt.ok)} |`,
    "",
    ...(m.sikkerhetsport.feil.length
      ? ["### Misoppfatninger lest som dekkende", "", ...m.sikkerhetsport.feil.map((x) => `- ${x.tekst} ${x.startId} ${x.variant}: «${x.elevsvar}» → ${x.begrunnelse}`), ""]
      : []),
    ...(m.maaltest.brudd.length ? ["### Brudd i måltesten", "", ...m.maaltest.brudd.map((b) => `- ${b}`), ""] : []),
    ...(m.avsnittstest.brudd.length ? ["### Brudd i avsnittstesten", "", ...m.avsnittstest.brudd.map((b) => `- ${b}`), ""] : []),
    "## Femveis forvekslingsmatrise — beskrivelse, ingen terskel",
    "",
    "Rader er fasit, kolonner er det modellen svarte.",
    "",
    "| Fasit \\ modell | dekkende | delvis | misoppfatning | uklart | utenfor |",
    "|---|---|---|---|---|---|",
    ...Object.entries(m.forveksling).map(([f, rad]) => `| ${f} | ${Object.values(rad).join(" | ")} |`),
    "",
    "## Gjenstår: de manuelle målingene",
    "",
    "- **Relevans (≥ 80 %):** fyll ut `relevans.md` i denne mappa.",
    "- **Tone (null tolerert):** fyll ut `tone-blind.md` *uten* å åpne `tone-nokkel.md` først. La i tillegg én utenforstående lese tolv av dem.",
    "",
  ].join("\n");

  // Relevansarket: én rad per tilfelle, med regelen for tilstanden.
  const REGEL: Record<string, string> = {
    dekkende: "gå videre til et nytt aspekt av teksten",
    delvis: "peke mot det som mangler, uten å si det",
    misoppfatning: "rette oppmerksomheten mot avsnittet som motsier misoppfatningen",
    uklart: "be om utdyping av det konkrete uklare uttrykket",
    utenfor: "dele spørsmålet opp i et enklere delspørsmål",
  };
  const relevans = [
    `# Relevans — svarvurdering ${versjon}`,
    "",
    "For hvert tilfelle: følger oppfølgingen regelen for **fasit-tilstanden**? Kryss av. Krav: minst 80 % relevante.",
    "",
    ...tilfeller.flatMap((x, i) => [
      `## ${i + 1}. ${x.tekst} ${x.startId} — ${x.variant}`,
      "",
      `- **Elevsvar:** ${x.elevsvar}`,
      `- **Fasit:** ${x.fasit} — oppfølgingen skal ${REGEL[x.fasit]}`,
      `- **Modellen:** ${x.tilstand} — ${x.begrunnelse}`,
      `- **Oppfølging** (avsnitt ${x.oppfolging?.kildeavsnittNummer ?? "–"}): ${x.oppfolging?.sporsmal ?? "–"}`,
      "- Relevant: [ ] ja  [ ] nei",
      "",
    ]),
  ].join("\n");

  // Tonearket, blindet: begrunnelsene i fast, stokket rekkefølge uten tilstand.
  const rekkefolge = tilfeller.map((_, i) => i).sort((a, b) => ((a * 7919) % 101) - ((b * 7919) % 101));
  const tone = [
    `# Tone, blindet — svarvurdering ${versjon}`,
    "",
    "Les hver begrunnelse uten å vite hvilken tilstand den hører til. Merk den om den inneholder noe fra lista:",
    "ordet «feil» om eleven, ironi, «egentlig», «som du burde visst», bagatellisering. Null tolerert (FR-23).",
    "",
    ...rekkefolge.map((i, n) => `${n + 1}. ${tilfeller[i].begrunnelse}\n   - Nedvurderende: [ ] nei  [ ] ja — hva:`),
    "",
  ].join("\n");
  const nokkel = [
    "# Nøkkel til tonearket — ikke åpne før tone-blind.md er fylt ut",
    "",
    ...rekkefolge.map((i, n) => `${n + 1}. ${tilfeller[i].tekst} ${tilfeller[i].startId} ${tilfeller[i].variant} → ${tilfeller[i].tilstand}`),
    "",
  ].join("\n");

  await writeFile(path.join(mappe, "rapport.md"), rapport, "utf8");
  await writeFile(path.join(mappe, "tilfeller.json"), `${JSON.stringify({ dato, versjon, tilfeller, maal: m }, null, 2)}\n`, "utf8");
  // Arkene skrives ikke over: de kan alt være fylt ut.
  for (const [navn, innhold] of [["relevans.md", relevans], ["tone-blind.md", tone], ["tone-nokkel.md", nokkel]] as const) {
    const f = path.join(mappe, navn);
    if (!existsSync(f)) await writeFile(f, innhold, "utf8");
  }
  console.log(`\n${rapport}\nSkrevet til ${path.relative(process.cwd(), mappe)}`);
}
