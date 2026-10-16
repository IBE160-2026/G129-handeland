/**
 * Måling av oversettelseskvaliteten — FR-28, for ukrainsk.
 *
 *   npm run maal:fr28              regner om fra lagrede modellsvar, gratis
 *   npm run maal:fr28:ferskt       kaller modellen og lagrer svarene
 *
 * Tre ting, slik FR-28 sier:
 *
 *   1. Begrepsanker, maskinelt: minst 0,95 av Faguttrykkene i de oversatte
 *      overskriftene og oppsummeringene har det norske uttrykket i parentes.
 *   2. Tilbakeoversettelse, bare for tapt nekting, endrede tall og endrede
 *      navn. Målet er null avvik.
 *   3. Vurderingsarket til morsmålsbrukeren. Det lages her, men fylles ut av
 *      et menneske — det er den eneste delen som er reelt uavhengig.
 *
 * Fagordene er Gullsettets, ikke uttrekkets. Da måles oversettelsen mot en
 * kjent liste, og støyen i uttrekket (FR-8) blandes ikke inn i tallet.
 *
 * Samme funksjoner som appen (AD-1): `oppsummer`, `oversett`, `maalAnker`.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { config } from "dotenv";
import { describe, expect, test } from "vitest";

// Se maal-faguttrykk.test.ts: testmodus avgjøres før .env.local lastes.
const modusFraKommandolinjen = process.env.LESEVENN_TESTMODUS;
config({ path: ".env.local" });
process.env.LESEVENN_TESTMODUS = modusFraKommandolinjen ?? "les";

import { NORSK, oppsummer, oversett } from "../generatorer/morsmaal";
import { ANKERTERSKEL, ankerandel, maalAnker, sammenlignTilbake, type Ankermaal, type Avvik } from "../morsmaal/kontroll";
import { oppsummeringElementer, overskriftElementer } from "../morsmaal/elementer";
import { finnSpraak } from "../morsmaal/spraak";
import { delIAvsnitt } from "../tekst/avsnittsdeling";

/**
 * De fire tekstene fra FR-8-gullsettet, én per fag. Valgt slik at både
 * fellesfag og programfag, oversikt og drøfting er med. Endres her.
 */
export const TEKSTER = [
  "naturfag-em-bolger",
  "samfunnsfag-prisvekst",
  "norsk-sprakligebilder",
  "teknologi-operativsystem",
];

const SPRAAKKODE = "uk";
const MAPPE = path.join(process.cwd(), "testdata", "gullsett");
const RESULTATER = path.join(process.cwd(), "maaling", "resultater");

type Tekstmaal = {
  tekst: string;
  tittel: string;
  overskrifter: { norsk: string; oversatt: string }[];
  oppsummering: { norsk: string; oversatt: string; tilbake: string; avvik: Avvik[] }[];
  anker: Ankermaal;
  promptversjoner: Record<string, string>;
  modell: string;
};

const sum = (m: Ankermaal[]): Ankermaal => ({
  forventet: m.reduce((s, x) => s + x.forventet, 0),
  funnet: m.reduce((s, x) => s + x.funnet, 0),
  mangler: [...new Set(m.flatMap((x) => x.mangler))],
});

describe(`FR-28 — oversettelse til ${SPRAAKKODE}`, () => {
  const spraak = finnSpraak(SPRAAKKODE)!;
  const resultater: Tekstmaal[] = [];

  test.each(TEKSTER)("%s", { timeout: 300000 }, async (navn) => {
    const raa = await readFile(path.join(MAPPE, `${navn}.txt`), "utf8");
    const gull = JSON.parse(await readFile(path.join(MAPPE, `${navn}.runde1.gullsett.json`), "utf8")) as {
      tittel: string;
      faguttrykk: string[];
    };
    const avsnitt = delIAvsnitt(raa);
    const fagord = gull.faguttrykk;

    const sammendrag = await oppsummer({ avsnitt });
    const elOverskrift = overskriftElementer(avsnitt);
    const elOppsummering = oppsummeringElementer(sammendrag.setninger);

    const [ovO, ovS] = await Promise.all([
      oversett({ spraak, elementer: elOverskrift, fagord }),
      oversett({ spraak, elementer: elOppsummering, fagord }),
    ]);

    // Tilbake til norsk, i et eget kall (FR-28). Fagordene sendes ikke med:
    // tilbakeoversettelsen skal ikke få hjelp til å gjenskape originalen.
    const tilbake = await oversett({
      spraak: NORSK,
      elementer: ovS.oversatt.map((o) => ({ id: o.id, type: "setning", tekst: o.oversatt })),
      fagord: [],
    });

    const tilbakeEtterId = new Map(tilbake.oversatt.map((o) => [o.id, o.oversatt]));
    const oversattEtterId = new Map([...ovO.oversatt, ...ovS.oversatt].map((o) => [o.id, o.oversatt]));

    const anker = sum(
      [...elOverskrift, ...elOppsummering].map((e) => maalAnker(e.tekst, oversattEtterId.get(e.id)!, fagord)),
    );

    const m: Tekstmaal = {
      tekst: navn,
      tittel: gull.tittel,
      overskrifter: elOverskrift.map((e) => ({ norsk: e.tekst, oversatt: oversattEtterId.get(e.id)! })),
      oppsummering: elOppsummering.map((e) => {
        const t = tilbakeEtterId.get(e.id)!;
        return { norsk: e.tekst, oversatt: oversattEtterId.get(e.id)!, tilbake: t, avvik: sammenlignTilbake(e.tekst, t) };
      }),
      anker,
      promptversjoner: {
        oppsummering: sammendrag.promptversjon,
        oversettelse: ovS.promptversjon,
      },
      modell: ovS.modell,
    };
    resultater.push(m);

    const avvik = m.oppsummering.flatMap((s) => s.avvik);
    console.log(
      `\n= ${navn}: anker ${anker.funnet}/${anker.forventet}` +
        (anker.mangler.length ? ` (mangler: ${anker.mangler.join(", ")})` : "") +
        `, tilbakeoversettelse ${avvik.length} avvik` +
        (avvik.length ? `: ${avvik.map((a) => `${a.kategori} ${a.detalj}`).join("; ")}` : ""),
    );
  });

  test("samlet, og vurderingsarket", async () => {
    expect(resultater.length).toBe(TEKSTER.length);
    resultater.sort((a, b) => TEKSTER.indexOf(a.tekst) - TEKSTER.indexOf(b.tekst));

    const andel = ankerandel(resultater.map((r) => r.anker));
    const avvik = resultater.flatMap((r) => r.oppsummering.flatMap((s) => s.avvik));
    const dato = new Date().toISOString().slice(0, 10);

    const rapport = {
      krav: "FR-28",
      spraak: SPRAAKKODE,
      dato,
      tekster: TEKSTER,
      begrepsanker: { andel, terskel: ANKERTERSKEL, bestaatt: andel >= ANKERTERSKEL },
      tilbakeoversettelse: { avvik: avvik.length, maal: 0, bestaatt: avvik.length === 0 },
      eksternVurdering: "Ikke gjort. Se vurderingsarket.",
      resultater,
    };

    await mkdir(RESULTATER, { recursive: true });
    await writeFile(path.join(RESULTATER, `fr28-${SPRAAKKODE}-${dato}.json`), JSON.stringify(rapport, null, 2) + "\n");
    await writeFile(path.join(RESULTATER, `fr28-vurderingsark-${SPRAAKKODE}.md`), vurderingsark(resultater, spraak.navn));

    console.log(
      `\n== FR-28 (${SPRAAKKODE}): begrepsanker ${andel.toFixed(3)} (terskel ${ANKERTERSKEL}), ` +
        `tilbakeoversettelse ${avvik.length} avvik (mål 0). Ekstern vurdering gjenstår.`,
    );
  });
});

/** Arket morsmålsbrukeren fyller ut. Fire punkter per tekst, slik FR-28 sier. */
function vurderingsark(resultater: Tekstmaal[], spraaknavn: string): string {
  const deler: string[] = [
    `# Vurderingsark — oversettelse til ${spraaknavn.toLowerCase()} (FR-28)`,
    "",
    "Takk for at du hjelper til! Lesevenn er en leseapp for elever på videregående. Elever som har et annet morsmål enn norsk, kan få overskriftene og en kort oppsummering av en fagtekst på morsmålet, med norsk ved siden av. Oversettelsene er laget av en språkmodell. Du er den eneste som kontrollerer dem.",
    "",
    "**Slik gjør du det** (om lag 30 minutter):",
    "",
    "1. Les den norske teksten og oversettelsen under hver tekst. Du trenger ikke lese hele fagteksten.",
    "2. Svar på de fire spørsmålene. Skriv gjerne kort hva som er galt, og hvilket ord som burde stått der.",
    "3. Fagordene står på norsk i parentes etter det ukrainske ordet. Det er med vilje — eleven skal lære det norske fagordet. Du skal **ikke** vurdere om parentesen er der, bare om det ukrainske ordet foran den er riktig.",
    "",
    "Spørsmålene:",
    "",
    "- **A. Terminologi:** Er fagordene oversatt med de ordene en ukrainsk lærebok ville brukt?",
    "- **B. Register:** Passer språket for en elev på 16–19 år — ikke barnslig, ikke for akademisk?",
    "- **C. Uforståelig:** Er noe vanskelig eller umulig å forstå?",
    "- **D. Direkte galt:** Sier oversettelsen noe annet enn det norske?",
    "",
  ];

  resultater.forEach((r, i) => {
    deler.push("---", "", `## Tekst ${i + 1}: ${r.tittel}`, "");
    if (r.overskrifter.length > 0) {
      deler.push("### Overskrifter", "", "| Norsk | Ukrainsk |", "|---|---|");
      for (const o of r.overskrifter) deler.push(`| ${o.norsk} | ${o.oversatt} |`);
      deler.push("");
    }
    deler.push("### Oppsummering", "");
    r.oppsummering.forEach((s, j) => {
      deler.push(`${j + 1}. ${s.norsk}`, `   > ${s.oversatt}`, "");
    });
    deler.push(
      "### Din vurdering",
      "",
      "| | Ja | Nei | Kommentar |",
      "|---|:-:|:-:|---|",
      "| A. Fagordene er riktig oversatt | ☐ | ☐ | |",
      "| B. Språket passer for en elev på videregående | ☐ | ☐ | |",
      "| C. Noe er uforståelig | ☐ | ☐ | |",
      "| D. Noe er direkte galt | ☐ | ☐ | |",
      "",
    );
  });

  deler.push(
    "---",
    "",
    "## Til slutt",
    "",
    "Ville du selv gitt denne oversettelsen til en ukrainsk elev, som hjelp ved siden av den norske teksten? ☐ Ja ☐ Ja, med rettelser ☐ Nei",
    "",
    "Navn (valgfritt): ____________________  Dato: ____________",
    "",
  );
  return deler.join("\n");
}
