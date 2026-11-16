/**
 * `valgfriTilgang()` — forsiden viser landingssiden uten innlogging (FR-47).
 *
 * Det som må holde: uten økt gir den `null` (ikke en omdirigering), med økt
 * en Tilgang fra den verifiserte økten, og et øktoppslag som feiler, gir
 * `null` og en logglinje i stedet for en 500. Nexts egne kast (redirect,
 * notFound, dynamisk bruk under forhåndsrendring) skal ikke svelges.
 */

import { afterEach, describe, expect, test, vi } from "vitest";
import { redirect } from "next/navigation";
import { innloggetEpost, valgfriTilgang } from "./konto";

const { getSession } = vi.hoisted(() => ({ getSession: vi.fn() }));
vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("./auth", () => ({ hentAuth: () => ({ api: { getSession } }) }));

afterEach(() => {
  getSession.mockReset();
  vi.restoreAllMocks();
});

describe("valgfriTilgang", () => {
  test("uten økt: null, ingen omdirigering", async () => {
    getSession.mockResolvedValue(null);
    await expect(valgfriTilgang()).resolves.toBeNull();
  });

  test("med økt: Tilgang fra den verifiserte økten", async () => {
    getSession.mockResolvedValue({ user: { id: "konto-1", email: "a@b.no" } });
    await expect(valgfriTilgang()).resolves.toEqual({ kontoId: "konto-1" });
  });

  test("øktoppslaget feiler: null, og feilen logges", async () => {
    const logg = vi.spyOn(console, "error").mockImplementation(() => {});
    getSession.mockRejectedValue(new Error("databasen svarer ikke"));
    await expect(valgfriTilgang()).resolves.toBeNull();
    expect(logg).toHaveBeenCalledOnce();
  });

  test("Nexts egne kast (her redirect) slippes gjennom, ikke svelges", async () => {
    const logg = vi.spyOn(console, "error").mockImplementation(() => {});
    let nextFeil: unknown;
    try {
      redirect("/et-annet-sted");
    } catch (e) {
      nextFeil = e;
    }
    getSession.mockRejectedValue(nextFeil);
    await expect(valgfriTilgang()).rejects.toBe(nextFeil);
    expect(logg).not.toHaveBeenCalled();
  });
});

describe("innloggetEpost (/logg-inn og /registrer)", () => {
  test("uten økt: null", async () => {
    getSession.mockResolvedValue(null);
    await expect(innloggetEpost()).resolves.toBeNull();
  });

  test("med økt: e-postadressen", async () => {
    getSession.mockResolvedValue({ user: { id: "konto-1", email: "a@b.no" } });
    await expect(innloggetEpost()).resolves.toBe("a@b.no");
  });

  test("øktoppslaget feiler: null (siden vises som for en utlogget), og feilen logges", async () => {
    const logg = vi.spyOn(console, "error").mockImplementation(() => {});
    getSession.mockRejectedValue(new Error("databasen svarer ikke"));
    await expect(innloggetEpost()).resolves.toBeNull();
    expect(logg).toHaveBeenCalledOnce();
  });

  test("Nexts egne kast slippes gjennom, ikke svelges", async () => {
    const logg = vi.spyOn(console, "error").mockImplementation(() => {});
    let nextFeil: unknown;
    try {
      redirect("/et-annet-sted");
    } catch (e) {
      nextFeil = e;
    }
    getSession.mockRejectedValue(nextFeil);
    await expect(innloggetEpost()).rejects.toBe(nextFeil);
    expect(logg).not.toHaveBeenCalled();
  });
});
