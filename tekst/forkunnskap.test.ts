import { describe, expect, test } from "vitest";
import { delIAvsnitt, overskrifter } from "./avsnittsdeling";
import { MAKS_LURER_PAA, MERKENAVN, MERKER, foerDuLeste, lesLurerPaa, lesMerking, somListe } from "./forkunnskap";

const TEKST = "Mikrobølger\n\nMikrobølger får vannmolekyler til å riste.\n\nTallerkenen\n\nEn tallerken uten vann blir ikke varm.";
const titler = overskrifter(delIAvsnitt(TEKST));
const skjema = (felt: Record<string, string>) => new Map(Object.entries(felt));

describe("lesMerking (FR-6, endret 17.11)", () => {
  test("lagrer overskriftens tekst og merket, i rekkefølgen i teksten", () => {
    expect(lesMerking(skjema({ "merke-3": "nytt", "merke-1": "kjent" }), titler)).toEqual([
      { overskrift: "Mikrobølger", merke: "kjent" },
      { overskrift: "Tallerkenen", merke: "nytt" },
    ]);
  });

  test("ukjente nummer, brødtekst og ukjente verdier forkastes; umerkede lagres ikke", () => {
    expect(lesMerking(skjema({ "merke-99": "kjent", "merke-2": "litt", "merke-1": "feil" }), titler)).toEqual([]);
  });

  test("uten overskrifter blir det ingen merking", () => {
    expect(lesMerking(skjema({ "merke-1": "kjent" }), [])).toEqual([]);
  });

  test("«Skjønner ikke overskriften» (18.11): koden uklar godtas", () => {
    expect(lesMerking(skjema({ "merke-1": "uklar" }), titler)).toEqual([{ overskrift: "Mikrobølger", merke: "uklar" }]);
  });
});

describe("merkene (endret 18.11)", () => {
  test("fire valg i skjemarekkefølge, og de gamle kodene får de nye navnene", () => {
    expect(MERKER.map((m) => MERKENAVN[m])).toEqual(["Mye", "Litt", "Ingenting ennå", "Skjønner ikke overskriften"]);
    // Lagret før 18.11 med de samme kodene: ingen migrasjon.
    expect(MERKENAVN.kjent).toBe("Mye");
    expect(MERKENAVN.litt).toBe("Litt");
    expect(MERKENAVN.nytt).toBe("Ingenting ennå");
  });
});

describe("lesLurerPaa", () => {
  test("fjerner luft og kapper til grensen", () => {
    expect(lesLurerPaa("  Hvorfor?  ")).toBe("Hvorfor?");
    expect(lesLurerPaa("x".repeat(MAKS_LURER_PAA + 50))).toHaveLength(MAKS_LURER_PAA);
    expect(lesLurerPaa(null)).toBe("");
  });

  test("CRLF teller som ett tegn, slik feltets maxLength gjør", () => {
    // 250 linjer à «a» + linjeskift = 499 tegn i feltet, men 748 med CRLF.
    const felt = Array(250).fill("a").join("\n");
    const sendt = felt.replace(/\n/g, "\r\n");
    expect(lesLurerPaa(sendt)).toBe(felt);
  });
});

describe("somListe", () => {
  test("norsk oppramsing", () => {
    expect(somListe(["A"])).toBe("A");
    expect(somListe(["A", "B"])).toBe("A og B");
    expect(somListe(["A", "B", "C"])).toBe("A, B og C");
  });
});

describe("foerDuLeste", () => {
  test("ny tekst: spørsmålet, de helt nye overskriftene og én linje for resten", () => {
    expect(
      foerDuLeste({
        forkunnskapMerking: [
          { overskrift: "Mikrobølger", merke: "kjent" },
          { overskrift: "Tallerkenen", merke: "nytt" },
          { overskrift: "Ovnen", merke: "litt" },
        ],
        lurerPaa: "Hvorfor blir maten varm?",
        forkunnskapssvar: null,
      }),
    ).toEqual({
      lurerPaa: "Hvorfor blir maten varm?",
      heltNye: ["Tallerkenen"],
      uklare: [],
      oppsummering: "Du visste mye om: Mikrobølger. Du visste litt om: Ovnen.",
      gammeltSvar: null,
    });
  });

  test("gammel tekst: bare det frie svaret fra før 17.11", () => {
    expect(foerDuLeste({ forkunnskapMerking: null, lurerPaa: null, forkunnskapssvar: "Noe om ovner." })).toEqual({
      lurerPaa: null,
      heltNye: [],
      uklare: [],
      oppsummering: null,
      gammeltSvar: "Noe om ovner.",
    });
  });

  test("uklare overskrifter (18.11): egen liste, og de alene gir en del", () => {
    const del = foerDuLeste({
      forkunnskapMerking: [
        { overskrift: "Mikrobølger", merke: "uklar" },
        { overskrift: "Tallerkenen", merke: "uklar" },
      ],
      lurerPaa: null,
      forkunnskapssvar: null,
    });
    expect(del).toEqual({ lurerPaa: null, heltNye: [], uklare: ["Mikrobølger", "Tallerkenen"], oppsummering: null, gammeltSvar: null });
  });

  test("blandede merker: hver liste får sine, og avsluttende tegn fjernes i setningen", () => {
    const del = foerDuLeste({
      forkunnskapMerking: [
        { overskrift: "Hva er lys?", merke: "uklar" },
        { overskrift: "Bølger", merke: "nytt" },
        { overskrift: "Ovnen", merke: "kjent" },
        { overskrift: "Stråling:", merke: "litt" },
      ],
      lurerPaa: null,
      forkunnskapssvar: null,
    });
    expect(del).toMatchObject({
      uklare: ["Hva er lys"],
      heltNye: ["Bølger"],
      oppsummering: "Du visste mye om: Ovnen. Du visste litt om: Stråling.",
    });
  });

  test("tom: ingen del, verken for ny eller gammel tekst", () => {
    expect(foerDuLeste({ forkunnskapMerking: [], lurerPaa: null, forkunnskapssvar: null })).toBeNull();
    expect(foerDuLeste({ forkunnskapMerking: null, lurerPaa: "  ", forkunnskapssvar: "" })).toBeNull();
  });
});
