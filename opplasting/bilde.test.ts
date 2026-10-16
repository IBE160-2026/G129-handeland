/**
 * Tester for bildeinnlesingen — FR-44, FR-45.
 *
 * Krympingen (krympBilde) bruker nettleserens lerret og testes ikke her;
 * resten gjør det: valg av bilder, meldingene og knappene for hver
 * feiltilstand, sendingen med ett nytt forsøk, og serversiden med lagrede
 * svar. Modellen kalles aldri.
 */

import { rm } from "node:fs/promises";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { BildeFeil as BildeFeilVisning } from "../app/komponenter/BildeFeil";
import { hentPrompt, noekkelMedBilde } from "../generatorer/kontrakt";
import { lagreSvar, noekkel } from "../generatorer/lagretsvar";
import { BILDEVALGTEKST, BildeFeil, bildeFeilmelding, type BildeFeilkode, type BildeValg } from "./bilde-feil";
import { BILDEGRENSER, base64Lengde, formatFor, lesBilde, nyStorrelse, sjekkValg } from "./bilde";
import { behandleBilde } from "./bilde-server";

const jpg = (name = "side.jpg") => ({ name, type: "image/jpeg" });

describe("valg av bilder — BF-2 og BF-3 før noe sendes", () => {
  test("opptil fire støttede bilder er i orden", () => {
    expect(sjekkValg([jpg(), { name: "b.png", type: "image/png" }, { name: "c.HEIC", type: "" }, jpg()])).toBeNull();
  });
  test("fem bilder er BF-2, med antallet i meldingen", () => {
    const f = sjekkValg([jpg(), jpg(), jpg(), jpg(), jpg()]);
    expect(f?.kode).toBe("BF-2");
    expect(bildeFeilmelding("BF-2", f!.detaljer).melding).toContain("5 bilder");
  });
  test("et format som ikke støttes, er BF-3, og formatet nevnes", () => {
    const f = sjekkValg([jpg(), { name: "side.gif", type: "image/gif" }]);
    expect(f?.kode).toBe("BF-3");
    expect(f?.detaljer.bilde).toBe(2);
    expect(bildeFeilmelding("BF-3", f!.detaljer).melding).toContain("GIF");
  });
  test("HEIC kjennes igjen på filendelsen når typen mangler", () => {
    expect(formatFor({ name: "IMG_0001.heic", type: "" })).toBe("HEIC");
  });
});

describe("krympingen — regnestykkene", () => {
  test("for bred blir 2 000 piksler, med samme forhold; smalere røres ikke", () => {
    expect(nyStorrelse(4032, 3024)).toEqual({ bredde: 2000, hoyde: 1500 });
    expect(nyStorrelse(1200, 1600)).toEqual({ bredde: 1200, hoyde: 1600 });
  });
  test("grensen per forespørsel gjelder den base64-kodede størrelsen", () => {
    expect(base64Lengde(3 * 1024 * 1024)).toBeLessThan(BILDEGRENSER.maksBytesPerForesporsel + 1024 * 1024 + 4);
    expect(base64Lengde(3)).toBe(4);
  });
});

/* ------------------------------------------------------------------ */

function visesMed(kode: BildeFeilkode, forventet: BildeValg[], detaljer = {}) {
  const html = renderToStaticMarkup(createElement(BildeFeilVisning, { kode, detaljer, onValg: () => {} }));
  expect(html).toContain(bildeFeilmelding(kode, detaljer).melding);
  for (const v of forventet) {
    expect(html).toContain(`data-valg="${v}"`);
    expect(html).toContain(BILDEVALGTEKST[v]);
  }
  expect(html).not.toMatch(/Exception|stack|noe gikk galt/i);
}

describe("feiltilstandene vises med melding og handling", () => {
  test("BF-1: ingen tekst — ta nytt bilde eller lim inn", () => visesMed("BF-1", ["ta_nytt", "lim_inn"], { bilde: 2 }));
  test("BF-2: for mange — endre bildene", () => visesMed("BF-2", ["fjern_bilder"], { antall: 6 }));
  test("BF-3: format — HEIC får et eget råd", () => {
    visesMed("BF-3", ["fjern_bilder", "lim_inn"], { format: "HEIC" });
    expect(bildeFeilmelding("BF-3", { format: "HEIC" }).handling).toMatch(/Mest kompatibel/);
  });
  test("BF-5: tidsavbrudd — prøv igjen, bildene er beholdt", () => {
    visesMed("BF-5", ["prov_igjen", "lim_inn"]);
    expect(bildeFeilmelding("BF-5").handling).toMatch(/beholdt/);
  });
});

/* ------------------------------------------------------------------ */

const svarMed = (status: number, kropp: unknown) =>
  (async () => new Response(JSON.stringify(kropp), { status })) as unknown as typeof fetch;

describe("sendingen — ett automatisk nytt forsøk (BF-5)", () => {
  test("teksten kommer tilbake", async () => {
    expect(await lesBilde("abc", 1, svarMed(200, { tekst: "Celledeling" }))).toBe("Celledeling");
  });

  test("BF-1 fra serveren prøves ikke på nytt", async () => {
    let kall = 0;
    const hent = (async () => (kall++, new Response(JSON.stringify({ kode: "BF-1" }), { status: 422 }))) as unknown as typeof fetch;
    const e = await lesBilde("abc", 3, hent).catch((x) => x);
    expect(e).toBeInstanceOf(BildeFeil);
    expect(e.kode).toBe("BF-1");
    expect(e.detaljer.bilde).toBe(3);
    expect(kall).toBe(1);
  });

  test("tjenerfeil to ganger gir BF-5 etter to forsøk", async () => {
    let kall = 0;
    const hent = (async () => (kall++, new Response("{}", { status: 503 }))) as unknown as typeof fetch;
    const e = await lesBilde("abc", 1, hent).catch((x) => x);
    expect(e.kode).toBe("BF-5");
    expect(kall).toBe(2);
  });

  test("én tjenerfeil som går over, gir teksten", async () => {
    let kall = 0;
    const hent = (async () =>
      ++kall === 1
        ? new Response("{}", { status: 503 })
        : new Response(JSON.stringify({ tekst: "Mitose" }), { status: 200 })) as unknown as typeof fetch;
    expect(await lesBilde("abc", 1, hent)).toBe("Mitose");
  });
});

/* ------------------------------------------------------------------ */

const PROMPT = await hentPrompt("bildeuttrekk");
const MELDING = "Skriv av teksten på denne siden.";
const BILDE_LESBART = "bGVzYmFydGJpbGRl"; // vilkårlig base64 — innholdet kontrolleres ikke her
const BILDE_TOMT = "dG9tdGJpbGRl";

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
  for (const b of [BILDE_LESBART, BILDE_TOMT]) {
    await rm(
      path.join(process.cwd(), "testdata", "modellsvar", "bildeuttrekk", `${noekkel("bildeuttrekk", PROMPT.versjon, noekkelMedBilde(MELDING, b))}.json`),
      { force: true },
    );
  }
});

const gittSvar = (bilde: string, data: unknown) =>
  lagreSvar("bildeuttrekk", PROMPT.versjon, PROMPT.modell, noekkelMedBilde(MELDING, bilde), data);

describe("serversiden — /api/bilde", () => {
  test("et lesbart bilde gir teksten", async () => {
    await gittSvar(BILDE_LESBART, { lesbar: true, tekst: "Celledeling\n\nMitose er den vanligste formen for celledeling." });
    const r = await behandleBilde({ mediaType: "image/jpeg", data: BILDE_LESBART });
    expect(r.status).toBe(200);
    expect(r.kropp.tekst).toMatch(/^Celledeling/);
  });

  test("et bilde uten lesbar tekst gir BF-1", async () => {
    await gittSvar(BILDE_TOMT, { lesbar: false, tekst: "" });
    const r = await behandleBilde({ mediaType: "image/jpeg", data: BILDE_TOMT });
    expect(r).toEqual({ status: 422, kropp: { kode: "BF-1" } });
  });

  test("feil form avvises før modellen kalles", async () => {
    expect((await behandleBilde({ mediaType: "image/gif", data: "abc" })).kropp.kode).toBe("BF-3");
    expect((await behandleBilde({ mediaType: "image/jpeg", data: "ikke base64!" })).kropp.kode).toBe("BF-3");
  });

  test("et for stort bilde avvises også på serveren (AD-16)", async () => {
    const stort = "A".repeat(BILDEGRENSER.maksBytesPerForesporsel + 4);
    expect(await behandleBilde({ mediaType: "image/jpeg", data: stort })).toEqual({ status: 413, kropp: { kode: "BF-2" } });
  });

  test("en modellfeil blir BF-5 for eleven, ikke et teknisk spor", async () => {
    // Ingen lagret svar i les-modus: kontrakten kaster, og det skal bli BF-5.
    const r = await behandleBilde({ mediaType: "image/jpeg", data: "aW5nZW5zdmFy" });
    expect(r).toEqual({ status: 503, kropp: { kode: "BF-5" } });
  });
});
