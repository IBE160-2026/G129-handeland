/**
 * Gullsettet for Fagsamtalen — FR-21.
 *
 * 3 tekster × 2 startspørsmål × 6 svar = 36 tilfeller. Utvikleren skriver
 * svarene og fasiten; modellen vurderer; dette regner ut om den holdt.
 *
 * Fila inneholder bare rene funksjoner — formen på gullsett-filene,
 * valideringen av dem, og målingene. Verktøyene som leser filer og kaller
 * modellen, ligger i samtalesett-*.test.ts og kalles via
 * `npm run samtalesett` (maaling/samtalesett-kjor.mjs).
 */

import { AVSNITTSNUMMER, MAAL_FOR, SAMMENBUNDET, antallSporsmal, type Maal, type Tilstand } from "../generatorer/fagsamtale";
import type { Avsnitt } from "../tekst/avsnittsdeling";

/** De seks variantene, i den rekkefølgen FR-21 nevner dem. */
export const VARIANTER = ["dekkende", "delvis", "misoppfatning1", "misoppfatning2", "uklart", "utenfor"] as const;
export type Variant = (typeof VARIANTER)[number];

/** Hvilken tilstand hver variant skal få. */
export const FASIT: Record<Variant, Tilstand> = {
  dekkende: "dekkende",
  delvis: "delvis",
  misoppfatning1: "misoppfatning",
  misoppfatning2: "misoppfatning",
  uklart: "uklart",
  utenfor: "utenfor",
};

export type Svarvariant = {
  tekst: string;
  /** Bare for misoppfatningene: avsnittet som motsier dem, skrevet ned på forhånd. */
  motsigendeAvsnitt?: number | null;
};

export type Startsporsmal = {
  id: string;
  sporsmal: string;
  kildeavsnitt: number | null;
  svar: Record<Variant, Svarvariant>;
};

export type Samtalesett = {
  tekst: string;
  tittel: string;
  annotert: string | null;
  startsporsmal: Startsporsmal[];
};

/* ------------------------------------------------------------------ *
 * Validering — før måling
 * ------------------------------------------------------------------ */

/**
 * Hva som er galt med en fil, eller tom liste. Samme idé som
 * valider-annotering: feil som gjør målingen gal, skal fanges før den kjøres.
 */
export function validerSamtalesett(s: Samtalesett, avsnitt: Avsnitt[]): string[] {
  const feil: string[] = [];
  const brodtekst = new Set(avsnitt.filter((a) => !a.erOverskrift).map((a) => a.nummer));
  const gyldig = (n: number | null | undefined) => typeof n === "number" && brodtekst.has(n);

  if (!s.annotert) feil.push("«annotert» mangler dato — skriv datoen du skrev svarene");
  if (s.startsporsmal.length !== 2) feil.push(`${s.startsporsmal.length} startspørsmål, FR-21 krever to`);

  for (const st of s.startsporsmal) {
    const hvor = `startspørsmål ${st.id}`;
    if (!st.sporsmal.trim()) feil.push(`${hvor}: spørsmålet er tomt`);
    else {
      if (antallSporsmal(st.sporsmal) !== 1) feil.push(`${hvor}: har ${antallSporsmal(st.sporsmal)} spørsmålstegn, ikke ett`);
      if (SAMMENBUNDET.test(st.sporsmal)) feil.push(`${hvor}: ser ut som to spørsmål bundet med «og/eller»`);
      if (AVSNITTSNUMMER.test(st.sporsmal)) feil.push(`${hvor}: viser til et avsnittsnummer eleven ikke ser`);
    }
    if (!gyldig(st.kildeavsnitt)) feil.push(`${hvor}: «kildeavsnitt» må være et avsnitt med brødtekst (se avsnittsoversikten)`);

    const tekster = new Set<string>();
    for (const v of VARIANTER) {
      const sv = st.svar[v];
      if (!sv || !sv.tekst.trim()) {
        feil.push(`${hvor}, ${v}: svaret er tomt`);
        continue;
      }
      const norm = sv.tekst.trim().toLowerCase();
      if (tekster.has(norm)) feil.push(`${hvor}, ${v}: samme svar som en annen variant`);
      tekster.add(norm);
      if (v.startsWith("misoppfatning") && !gyldig(sv.motsigendeAvsnitt)) {
        feil.push(`${hvor}, ${v}: «motsigendeAvsnitt» mangler eller er ikke et avsnitt med brødtekst`);
      }
    }
  }
  return feil;
}

/* ------------------------------------------------------------------ *
 * Målingene — FR-21
 * ------------------------------------------------------------------ */

/** Resultatet for ett tilfelle: det modellen svarte. */
export type Tilfelle = {
  tekst: string;
  startId: string;
  variant: Variant;
  fasit: Tilstand;
  motsigendeAvsnitt: number | null;
  elevsvar: string;
  tilstand: Tilstand;
  begrunnelse: string;
  oppfolging: { sporsmal: string; kildeavsnittNummer: number; maal: Maal } | null;
};

export type Maaleresultat = {
  antall: number;
  sikkerhetsport: { feil: Tilfelle[]; avMulige: number; bestatt: boolean };
  gjenkalling: { treff: number; avMulige: number; verdi: number; bestatt: boolean };
  maaltest: { bestatt: number; avMulige: number; krav: number; ok: boolean; brudd: string[] };
  avsnittstest: { bestatt: number; avMulige: number; ok: boolean; brudd: string[] };
  treffForhandsvalgt: { treff: number; avMulige: number; verdi: number; ok: boolean };
  forveksling: Record<Tilstand, Record<Tilstand, number>>;
};

const TILSTANDER: Tilstand[] = ["dekkende", "delvis", "misoppfatning", "uklart", "utenfor"];

export function regnMaal(t: Tilfelle[]): Maaleresultat {
  const finn = (tekst: string, startId: string, variant: Variant) =>
    t.find((x) => x.tekst === tekst && x.startId === startId && x.variant === variant);
  const starter = [...new Set(t.map((x) => `${x.tekst}|${x.startId}`))].map((k) => k.split("|"));

  // Sikkerhetsport: ingen misoppfatning lest som dekkende.
  const misopp = t.filter((x) => x.fasit === "misoppfatning");
  const portfeil = misopp.filter((x) => x.tilstand === "dekkende");

  // Binær gjenkalling for «trenger oppfølging».
  const ikkeDekkende = t.filter((x) => x.fasit !== "dekkende");
  const oppdaget = ikkeDekkende.filter((x) => x.tilstand !== "dekkende").length;

  // Måltest: tre par per startspørsmål. Begge målene skal følge FR-19 for
  // sin fasit, og de skal være ulike.
  const PAR: [Variant, Variant][] = [
    ["dekkende", "delvis"],
    ["dekkende", "misoppfatning1"],
    ["uklart", "utenfor"],
  ];
  let maalOk = 0;
  let maalMulige = 0;
  const maalBrudd: string[] = [];
  for (const [tekst, startId] of starter) {
    for (const [a, b] of PAR) {
      const x = finn(tekst, startId, a);
      const y = finn(tekst, startId, b);
      if (!x || !y) continue;
      maalMulige++;
      const mx = x.oppfolging?.maal;
      const my = y.oppfolging?.maal;
      const ok = mx === MAAL_FOR[x.fasit] && my === MAAL_FOR[y.fasit] && mx !== my;
      if (ok) maalOk++;
      else maalBrudd.push(`${tekst} ${startId} (${a}, ${b}): ${mx ?? "ingen"} / ${my ?? "ingen"}`);
    }
  }

  // Avsnittstest: misoppfatningens oppfølging peker et annet sted enn den
  // dekkendes, og målet er «motsigende avsnitt». Én per startspørsmål.
  let avsOk = 0;
  let avsMulige = 0;
  const avsBrudd: string[] = [];
  for (const [tekst, startId] of starter) {
    const d = finn(tekst, startId, "dekkende");
    const m = finn(tekst, startId, "misoppfatning1");
    if (!d || !m) continue;
    avsMulige++;
    const ok =
      !!d.oppfolging &&
      !!m.oppfolging &&
      m.oppfolging.kildeavsnittNummer !== d.oppfolging.kildeavsnittNummer &&
      m.oppfolging.maal === "motsigende_avsnitt";
    if (ok) avsOk++;
    else {
      avsBrudd.push(
        `${tekst} ${startId}: dekkende → avsnitt ${d.oppfolging?.kildeavsnittNummer ?? "–"}, ` +
          `misoppfatning → avsnitt ${m.oppfolging?.kildeavsnittNummer ?? "–"} (${m.oppfolging?.maal ?? "ingen"})`,
      );
    }
  }

  // Treff mot avsnittet utvikleren valgte på forhånd.
  const medFasit = misopp.filter((x) => x.motsigendeAvsnitt !== null);
  const avsTreff = medFasit.filter((x) => x.oppfolging?.kildeavsnittNummer === x.motsigendeAvsnitt).length;

  const forveksling = Object.fromEntries(
    TILSTANDER.map((f) => [f, Object.fromEntries(TILSTANDER.map((p) => [p, 0]))]),
  ) as Record<Tilstand, Record<Tilstand, number>>;
  for (const x of t) forveksling[x.fasit][x.tilstand]++;

  const gjenkalling = ikkeDekkende.length ? oppdaget / ikkeDekkende.length : 0;
  const treffVerdi = medFasit.length ? avsTreff / medFasit.length : 0;

  return {
    antall: t.length,
    sikkerhetsport: { feil: portfeil, avMulige: misopp.length, bestatt: portfeil.length === 0 },
    gjenkalling: { treff: oppdaget, avMulige: ikkeDekkende.length, verdi: gjenkalling, bestatt: gjenkalling >= 0.9 },
    // FR-21: minst 16 av 18. Med færre par skaleres kravet likt.
    maaltest: {
      bestatt: maalOk,
      avMulige: maalMulige,
      krav: Math.ceil((16 / 18) * maalMulige),
      ok: maalOk >= Math.ceil((16 / 18) * maalMulige),
      brudd: maalBrudd,
    },
    avsnittstest: { bestatt: avsOk, avMulige: avsMulige, ok: avsOk === avsMulige && avsMulige > 0, brudd: avsBrudd },
    treffForhandsvalgt: { treff: avsTreff, avMulige: medFasit.length, verdi: treffVerdi, ok: treffVerdi >= 0.7 },
    forveksling,
  };
}
