/**
 * Hentefeil på arbeidsbordet (/) og i Samlingen — EXPERIENCE.md, Inngang og
 * arbeidsbord («Henting feiler»), §5.
 *
 * Det som må holde: kaster `hentArbeidsbord`, viser siden Hentefeil med
 * «Prøv igjen» i stedet for en 500. Og innloggingen sjekkes FØR try-blokken
 * (AGENTS.md): utlogget gir landingssiden på / og omdirigeringen fra
 * `tilgang()` på /samling, aldri Hentefeil.
 *
 * Sidene er asynkrone serverkomponenter. De kalles som funksjoner, og
 * treet de gir, tegnes med renderToStaticMarkup (som Tenker.test.ts).
 * Datalaget og innloggingen er byttet ut (mønsteret i handlinger.test.ts).
 */

import { isValidElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, test, vi } from "vitest";

const { innlogget, hentArbeidsbord, Omdirigert } = vi.hoisted(() => ({
  innlogget: { tilgang: null as { kontoId: string } | null },
  hentArbeidsbord: vi.fn(),
  Omdirigert: class Omdirigert extends Error {
    constructor(readonly adresse: string) {
      super(`omdirigert til ${adresse}`);
    }
  },
}));
vi.mock("next/navigation", () => ({
  redirect: (adresse: string) => {
    throw new Omdirigert(adresse);
  },
  useRouter: () => ({ push: () => {}, refresh: () => {} }),
  usePathname: () => "/",
}));
vi.mock("../data/konto", () => ({
  valgfriTilgang: async () => innlogget.tilgang,
  tilgang: async () => {
    if (!innlogget.tilgang) throw new Omdirigert("/logg-inn");
    return innlogget.tilgang;
  },
}));
vi.mock("../data/arbeidsbord", async (original) => ({
  ...(await original<typeof import("../data/arbeidsbord")>()),
  hentArbeidsbord,
}));
vi.mock("../data/forbruk", () => ({ samtalegrenseNaadd: async () => false }));
// FR-50: Mappene i Samlingen. Byttet ut, så testene ikke treffer databasen.
const { listMapper, mapperPerTekst } = vi.hoisted(() => ({
  listMapper: vi.fn(async () => []),
  mapperPerTekst: vi.fn(async () => new Map<string, string[]>()),
}));
vi.mock("../data/mapper", async (original) => ({
  ...(await original<typeof import("../data/mapper")>()),
  listMapper,
  mapperPerTekst,
}));
// Landingssiden laster skrifter med next/font, som bare virker i Next-bygget.
vi.mock("./komponenter/Landingsside", () => ({ Landingsside: function Landingsside() { return null; } }));

const { default: Forside } = await import("./page");
const { default: Samling } = await import("./samling/page");
const { Landingsside } = await import("./komponenter/Landingsside");

const FEILTEKST = "Vi fikk ikke hentet tekstene dine.";

/** Forsiden gir et element for ArbeidsbordSide; det kalles også, så treet kan tegnes. */
async function forside(): Promise<ReactElement> {
  const el = await Forside();
  if (el.type === Landingsside) return el;
  const indre = await (el.type as (p: unknown) => Promise<ReactElement>)(el.props);
  expect(isValidElement(indre)).toBe(true);
  return indre;
}

async function samling(): Promise<ReactElement> {
  return Samling({ searchParams: Promise.resolve({}) } as Parameters<typeof Samling>[0]);
}

afterEach(() => {
  hentArbeidsbord.mockReset();
  innlogget.tilgang = null;
  vi.restoreAllMocks();
});

describe("arbeidsbordet (/)", () => {
  test("hentArbeidsbord kaster: Hentefeil med «Prøv igjen» til /, og feilen logges", async () => {
    innlogget.tilgang = { kontoId: "konto-1" };
    hentArbeidsbord.mockRejectedValue(new Error("databasen svarer ikke"));
    const logg = vi.spyOn(console, "error").mockImplementation(() => {});

    const html = renderToStaticMarkup(await forside());
    expect(html).toContain('role="alert"');
    expect(html).toContain(FEILTEKST);
    expect(html).toMatch(/<a href="\/"[^>]*>Prøv igjen<\/a>/);
    expect(logg).toHaveBeenCalledOnce();
  });

  test("utlogget: landingssiden, ikke Hentefeil, og tekstene hentes ikke", async () => {
    const el = await forside();
    expect(el.type).toBe(Landingsside);
    expect(hentArbeidsbord).not.toHaveBeenCalled();
  });
});

/* --- Runde 3, bolk 5: arbeidsbordet grupperer etter Mappe --------------- */

describe("arbeidsbordet med mapper (/)", () => {
  const T0 = new Date("2026-11-20T10:00:00Z");
  const tekst = (id: string, tittel: string, dager: number) => ({
    id,
    tittel,
    tilstand: "laast" as const,
    opprettet: T0,
    sistAktiv: new Date(T0.getTime() + dager * 86_400_000),
    antallFagord: 10,
    antallKan: 0,
    antallMerket: 0,
    sisteQuiz: null,
    samtale: null,
    harMinnevers: false,
  });
  const EM = "11111111-1111-4111-8111-111111111111";
  const DIKT = "22222222-2222-4222-8222-222222222222";
  const NATURFAG = "33333333-3333-4333-8333-333333333333";

  test("siste tekst i en mappe: mappen er hovedbunken med «Mappe», og teksten er ikke egen bunke", async () => {
    innlogget.tilgang = { kontoId: "konto-1" };
    hentArbeidsbord.mockResolvedValue([tekst(EM, "EM-bølger", 2), tekst(DIKT, "Diktanalyse", 1)]);
    listMapper.mockResolvedValueOnce([{ id: NATURFAG, tittel: "Naturfag", opprettet: T0, antallTekster: 1 }] as never);
    mapperPerTekst.mockResolvedValueOnce(new Map([[EM, [NATURFAG]]]));

    const html = renderToStaticMarkup(await forside());
    // Uten skript (tegnet på serveren) er mappebunken en lenke til mappesiden.
    expect(html).toMatch(new RegExp(`<a href="/mappe/${NATURFAG}" class="bunke-knapp"><span class="sr-only">Vis tekstene i mappen Naturfag</span></a>`));
    expect(html).toContain('<p class="bunke-mappemerke">Mappe</p>');
    expect(html).toContain("1 tekst</p>");
    // Hovedbunken er mappen, og neste steg gjelder teksten, med tittelen i lenken.
    expect(html).toMatch(/<li[^>]*class="bunke bunke-hoved bunke-mappe"/);
    expect(html).toMatch(new RegExp(`<a class="bunke-neste" href="/tekst/${EM}/quiz">EM-bølger: Neste: Ta quizen`));
    expect(html).toContain("Du holdt på med <strong");
    expect(html).toMatch(/Du holdt på med <strong[^>]*>EM-bølger<\/strong>/);
    expect(html).not.toContain("Vis aktiviteter for EM-bølger");
    expect(html).toContain("Vis aktiviteter for Diktanalyse");
    expect(html).not.toContain("Se alle");
  });

  test("tre tekster i én mappe: alle kan nås fra bordet, så ingen «Se alle»", async () => {
    innlogget.tilgang = { kontoId: "konto-1" };
    const ider = ["a", "b", "c"].map((x) => `${x.repeat(8)}-${x.repeat(4)}-4${x.repeat(3)}-8${x.repeat(3)}-${x.repeat(12)}`);
    hentArbeidsbord.mockResolvedValue(ider.map((id, i) => tekst(id, `Tekst ${i}`, i)));
    listMapper.mockResolvedValueOnce([{ id: NATURFAG, tittel: "Naturfag", opprettet: T0, antallTekster: 3 }] as never);
    mapperPerTekst.mockResolvedValueOnce(new Map(ider.map((id) => [id, [NATURFAG]])));

    const html = renderToStaticMarkup(await forside());
    expect(html).toContain("Vis tekstene i mappen Naturfag");
    expect(html).not.toContain("Se alle");
  });

  test("sju løse tekster: fem på bordet, og «Se alle 7 tekstene i Samlinger»", async () => {
    innlogget.tilgang = { kontoId: "konto-1" };
    hentArbeidsbord.mockResolvedValue(Array.from({ length: 7 }, (_, i) => tekst(`${i}`.repeat(8) + "-1111-4111-8111-111111111111", `Tekst ${i}`, i)));

    const html = renderToStaticMarkup(await forside());
    expect(html).toContain("Se alle 7 tekstene i Samlinger");
  });

  test("mappeoppslaget feiler: bordet som før, med bare tekstene, og feilen logges", async () => {
    innlogget.tilgang = { kontoId: "konto-1" };
    hentArbeidsbord.mockResolvedValue([tekst(EM, "EM-bølger", 2), tekst(DIKT, "Diktanalyse", 1)]);
    mapperPerTekst.mockRejectedValueOnce(new Error("databasen svarer ikke"));
    const logg = vi.spyOn(console, "error").mockImplementation(() => {});

    const html = renderToStaticMarkup(await forside());
    expect(html).not.toContain(FEILTEKST);
    expect(html).not.toContain("bunke-mappe");
    expect(html).toContain("Vis aktiviteter for EM-bølger");
    expect(html).toContain("Vis aktiviteter for Diktanalyse");
    expect(html).toMatch(new RegExp(`<a class="bunke-neste" href="/tekst/${EM}/quiz">Neste: Ta quizen`));
    expect(logg).toHaveBeenCalledOnce();
  });
});

describe("Samlingen (/samling)", () => {
  test("hentArbeidsbord kaster: Hentefeil med «Prøv igjen» til /samling, og feilen logges", async () => {
    innlogget.tilgang = { kontoId: "konto-1" };
    hentArbeidsbord.mockRejectedValue(new Error("databasen svarer ikke"));
    const logg = vi.spyOn(console, "error").mockImplementation(() => {});

    const html = renderToStaticMarkup(await samling());
    expect(html).toContain(FEILTEKST);
    expect(html).toMatch(/<a href="\/samling"[^>]*>Prøv igjen<\/a>/);
    expect(logg).toHaveBeenCalledOnce();
  });

  test("listMapper kaster: tekstene vises likevel, uten Hentefeil (FR-50)", async () => {
    innlogget.tilgang = { kontoId: "konto-1" };
    hentArbeidsbord.mockResolvedValue([]);
    listMapper.mockRejectedValueOnce(new Error("relation \"mappe\" does not exist"));
    const logg = vi.spyOn(console, "error").mockImplementation(() => {});

    const html = renderToStaticMarkup(await samling());
    expect(html).not.toContain(FEILTEKST);
    expect(html).toContain("Mappene dine");
    expect(logg).toHaveBeenCalledOnce();
  });

  test("mapperPerTekst kaster: mappene og tekstene vises likevel (runde 3, bolk 4)", async () => {
    innlogget.tilgang = { kontoId: "konto-1" };
    hentArbeidsbord.mockResolvedValue([]);
    mapperPerTekst.mockRejectedValueOnce(new Error("databasen svarer ikke"));
    const logg = vi.spyOn(console, "error").mockImplementation(() => {});

    const html = renderToStaticMarkup(await samling());
    expect(html).not.toContain(FEILTEKST);
    expect(html).not.toContain('role="alert"');
    expect(html).toContain("Mappene dine");
    expect(logg).toHaveBeenCalledOnce();
  });

  test("utlogget: tilgang() står utenfor try, så omdirigeringen slipper ut i stedet for Hentefeil", async () => {
    const logg = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(samling()).rejects.toMatchObject({ adresse: "/logg-inn" });
    expect(hentArbeidsbord).not.toHaveBeenCalled();
    expect(logg).not.toHaveBeenCalled();
  });
});
