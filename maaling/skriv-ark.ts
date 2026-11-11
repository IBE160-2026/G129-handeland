/**
 * Skriver et vurderingsark — og dataene det bygger på — bare hvis arket ikke
 * finnes fra før.
 *
 * Et ark kan være fylt ut av utvikleren (AD-17), og en ny kjøring av målingen
 * ville skrevet over vurderingen. Det skjedde 9.11, da hele testsamlingen ble
 * kjørt direkte: quiz-, minnevers- og forklaringsarket ble overskrevet på
 * disken (hentet tilbake fra git). Dataene beskyttes sammen med arket, fordi
 * de kan komme ut annerledes ved neste kjøring — quiz-alternativene ble stokket
 * i ny rekkefølge, og da passer ikke avkrysningene lenger.
 *
 * En ny promptversjon gir nytt filnavn og skrives som vanlig. Vil man lage et
 * ark på nytt, sletter man det først. Samme regel som samtalesettets
 * relevans- og tonearket.
 */

import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

type Fil = { sti: string; innhold: string };

/** Gir `true` når arket ble skrevet, `false` når det fantes fra før. */
export async function skrivArk(ark: Fil, data: Fil[] = []): Promise<boolean> {
  if (existsSync(ark.sti)) {
    console.log(
      `Beholdt ${path.relative(process.cwd(), ark.sti)}: finnes alt og kan være fylt ut. ` +
        "Slett fila for å lage arket på nytt.",
    );
    return false;
  }
  await mkdir(path.dirname(ark.sti), { recursive: true });
  await writeFile(ark.sti, ark.innhold, "utf8");
  for (const f of data) await writeFile(f.sti, f.innhold, "utf8");
  return true;
}
