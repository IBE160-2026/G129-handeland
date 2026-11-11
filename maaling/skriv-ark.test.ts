import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { skrivArk } from "./skriv-ark";

describe("skrivArk — et utfylt ark skrives aldri over", () => {
  test("skriver arket og dataene når arket ikke finnes", async () => {
    const mappe = await mkdtemp(path.join(tmpdir(), "ark-"));
    const ark = { sti: path.join(mappe, "ark.md"), innhold: "tomt ark" };
    const data = { sti: path.join(mappe, "data.json"), innhold: "{}" };
    expect(await skrivArk(ark, [data])).toBe(true);
    expect(await readFile(ark.sti, "utf8")).toBe("tomt ark");
    expect(await readFile(data.sti, "utf8")).toBe("{}");
  });

  test("lar både arket og dataene stå når arket finnes", async () => {
    const mappe = await mkdtemp(path.join(tmpdir(), "ark-"));
    const ark = path.join(mappe, "ark.md");
    const data = path.join(mappe, "data.json");
    await writeFile(ark, "**A** X ja", "utf8");
    await writeFile(data, '{"rekkefolge":"gammel"}', "utf8");
    expect(await skrivArk({ sti: ark, innhold: "tomt ark" }, [{ sti: data, innhold: '{"rekkefolge":"ny"}' }])).toBe(false);
    expect(await readFile(ark, "utf8")).toBe("**A** X ja");
    expect(await readFile(data, "utf8")).toBe('{"rekkefolge":"gammel"}');
  });
});
