/**
 * Tester for avsnittsetikettene — FR-5.
 */

import { describe, expect, test } from "vitest";
import { delIAvsnitt } from "../tekst/avsnittsdeling";
import { overskriftsplasser, settInnEtiketter } from "../tekst/overskrifter";
import { kontrollerEtiketter } from "./etiketter";

const TEKST = [
  "Celler er de minste levende enhetene, og alle organismer består av dem.",
  "Mitose er en type celledeling der det dannes to like datterceller.",
  "Meiose gir kjønnsceller med halvparten så mange kromosomer.",
  "Mutasjoner er endringer i arvestoffet som kan gå videre ved deling.",
].join("\n\n");
const A = delIAvsnitt(TEKST);

describe("FR-5 — kontrollen", () => {
  test("gyldige etiketter beholdes", () => {
    const r = kontrollerEtiketter(
      [
        { foranAvsnitt: 1, etikett: "Hva celler er" },
        { foranAvsnitt: 2, etikett: "To slags celledeling" },
        { foranAvsnitt: 4, etikett: "Endringer i arvestoffet" },
      ],
      A,
    );
    expect(r.etiketter).toHaveLength(3);
    expect(r.forkastet).toEqual([]);
  });

  test("ugyldig avsnitt, dublett, feil rekkefølge og setninger forkastes med grunn", () => {
    const r = kontrollerEtiketter(
      [
        { foranAvsnitt: 2, etikett: "Celledeling" },
        { foranAvsnitt: 9, etikett: "Finnes ikke" },
        { foranAvsnitt: 2, etikett: "Igjen" },
        { foranAvsnitt: 1, etikett: "Bakover" },
        { foranAvsnitt: 3, etikett: "Meiose gir kjønnsceller." },
        { foranAvsnitt: 4, etikett: "En etikett som er altfor lang til å være kort" },
      ],
      A,
    );
    expect(r.etiketter.map((e) => e.etikett)).toEqual(["Celledeling"]);
    expect(r.forkastet.map((f) => f.grunn)).toEqual([
      "avsnitt 9 er ikke et brødtekstavsnitt",
      "samme avsnitt to ganger",
      "i feil rekkefølge",
      "ikke en kort overskrift",
      "ikke en kort overskrift",
    ]);
  });
});

describe("FR-5 — innsetting i teksten", () => {
  test("etikettene blir overskrifter foran sine avsnitt, brødteksten urørt", () => {
    const ut = settInnEtiketter(TEKST, [
      { foranAvsnitt: 1, etikett: "Hva celler er" },
      { foranAvsnitt: 2, etikett: "Celledeling" },
    ]);
    expect(overskriftsplasser(ut).map((o) => o.tekst)).toEqual(["Hva celler er", "Celledeling"]);
    expect(delIAvsnitt(ut).filter((a) => !a.erOverskrift).map((a) => a.innhold)).toEqual(A.map((a) => a.innhold));
  });
});
