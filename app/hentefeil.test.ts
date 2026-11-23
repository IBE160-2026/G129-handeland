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
