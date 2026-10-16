/**
 * Tester for de maskinelle kontrollene i FR-25 og FR-28, og for språklisten
 * i FR-24.
 */

import { describe, expect, test } from "vitest";
import { ankerandel, egennavn, maalAnker, sammenlignTilbake } from "./kontroll";
import { KVALITETSSIKRET, SPRAAK, finnSpraak, nivaaFor } from "./spraak";

describe("FR-24 — språklisten", () => {
  test("17 språk, ukrainsk først, ingen dubletter", () => {
    expect(SPRAAK).toHaveLength(17);
    expect(SPRAAK[0].kode).toBe("uk");
    expect(new Set(SPRAAK.map((s) => s.kode)).size).toBe(SPRAAK.length);
  });

  test("de fem høyre-til-venstre-språkene er merket", () => {
    const rtl = SPRAAK.filter((s) => s.retning === "rtl").map((s) => s.kode).sort();
    expect(rtl).toEqual(["ar", "ckb", "fa", "prs", "ur"]);
  });

  test("ingen språk er kvalitetssikret før FR-28 er målt — heller ikke ukrainsk", () => {
    expect(KVALITETSSIKRET.size).toBe(0);
    expect(nivaaFor("uk")).toBe("modellstoettet");
  });

  test("ukjent kode gir null, ikke et gjettet språk", () => {
    expect(finnSpraak("xx")).toBeNull();
    expect(finnSpraak(null)).toBeNull();
    expect(finnSpraak("ar")?.navn).toBe("Arabisk");
  });
});

describe("FR-28 — begrepsankeret", () => {
  test("ett anker per forekomst", () => {
    const m = maalAnker(
      "Fotosyntese skjer i bladet. Uten fotosyntese ingen sukker.",
      "Фотосинтез (fotosyntese) відбувається в листі. Без фотосинтезу (fotosyntese) немає цукру.",
      ["fotosyntese"],
    );
    expect(m).toEqual({ forventet: 2, funnet: 2, mangler: [] });
  });

  test("manglende anker telles, og uttrykket navngis", () => {
    const m = maalAnker("Mitose og meiose.", "Мітоз (mitose) і мейоз.", ["mitose", "meiose"]);
    expect(m.forventet).toBe(2);
    expect(m.funnet).toBe(1);
    expect(m.mangler).toEqual(["meiose"]);
  });

  test("ankeret må stå i uendret form — en bøyd form i parentes teller ikke", () => {
    const m = maalAnker("Mitose er celledeling.", "Мітоз (mitosen) — це поділ.", ["mitose"]);
    expect(m.funnet).toBe(0);
  });

  test("ekstra ankre veier ikke opp for et som mangler", () => {
    const m = maalAnker("Mitose. Mitose.", "(mitose) (mitose) (mitose)", ["mitose"]);
    expect(m.funnet).toBe(2);
  });

  test("ordgrenser: «mitose» i «mitosefasen» er ikke en forekomst", () => {
    expect(maalAnker("Mitosefasen er lang.", "Фаза.", ["mitose"]).forventet).toBe(0);
  });

  test("andelen over flere tekster, og 1 når ingenting var ventet", () => {
    expect(ankerandel([{ forventet: 10, funnet: 9, mangler: [] }, { forventet: 10, funnet: 10, mangler: [] }])).toBe(0.95);
    expect(ankerandel([])).toBe(1);
  });
});

describe("FR-28 — tilbakeoversettelsen, bare for tre ting", () => {
  test("lik tekst gir null avvik", () => {
    const t = "Stortinget vedtok loven i 1814. Kongen kunne ikke stoppe den.";
    expect(sammenlignTilbake(t, t)).toEqual([]);
  });

  test("tapt nekting fanges", () => {
    const a = sammenlignTilbake("Planter kan ikke leve uten lys.", "Planter kan leve uten lys.");
    expect(a).toEqual([{ kategori: "nekting", detalj: "«ikke» 1 → 0" }]);
  });

  test("en ekstra nekting er ikke et avvik", () => {
    expect(sammenlignTilbake("Planter trenger lys.", "Planter trenger ikke annet enn lys.")).toEqual([]);
  });

  test("endret tall fanges, men komma og punktum er samme tall", () => {
    expect(sammenlignTilbake("Det tok 1,5 år.", "Det tok 1.5 år.")).toEqual([]);
    expect(sammenlignTilbake("I 1814 og 1905.", "I 1814 og 1907.")[0].kategori).toBe("tall");
  });

  test("endret egennavn fanges", () => {
    const a = sammenlignTilbake("Grunnloven ble skrevet på Eidsvoll.", "Grunnloven ble skrevet på Eidsvold.");
    expect(a).toEqual([{ kategori: "navn", detalj: "Eidsvoll" }]);
  });

  test("egennavn: ordet først i setningen telles ikke", () => {
    expect(egennavn("Celler deler seg. Mendel fant det ut i Brno.")).toEqual(["Brno"]);
  });
});
