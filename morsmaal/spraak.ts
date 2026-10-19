/**
 * Den lukkede listen over morsmål — FR-24.
 *
 * Valgt 16. oktober 2026 ut fra SSBs tabell over innvandrere og norskfødte med
 * innvandrerforeldre etter landbakgrunn, 1. januar 2026 (PRD FR-24 har
 * grunnlaget). Koden er en BCP 47-språkkode, som også brukes i `lang`-
 * attributtet, så skjermlesere velger riktig uttale.
 *
 * ## Nivået er en egenskap ved språket, ikke ved eleven
 *
 * FR-24: et språk er Kvalitetssikret bare når det har bestått målingen i FR-28.
 * Til da er også ukrainsk Modellstøttet, og det øverste nivået finnes ikke i
 * grensesnittet i det hele tatt. Når målingen består, endres
 * `KVALITETSSIKRET` her — og ingen andre steder.
 */

export type Retning = "ltr" | "rtl";
export type Nivaa = "kvalitetssikret" | "modellstoettet";

export type Spraak = {
  kode: string;
  /** Navnet på norsk, slik listen viser det. */
  navn: string;
  /** Navnet på språket selv, så eleven kjenner det igjen. */
  egetNavn: string;
  retning: Retning;
};

export const SPRAAK: readonly Spraak[] = [
  { kode: "uk", navn: "Ukrainsk", egetNavn: "Українська", retning: "ltr" },
  { kode: "pl", navn: "Polsk", egetNavn: "Polski", retning: "ltr" },
  { kode: "lt", navn: "Litauisk", egetNavn: "Lietuvių", retning: "ltr" },
  { kode: "ar", navn: "Arabisk", egetNavn: "العربية", retning: "rtl" },
  { kode: "so", navn: "Somali", egetNavn: "Soomaali", retning: "ltr" },
  { kode: "ur", navn: "Urdu", egetNavn: "اردو", retning: "rtl" },
  { kode: "ti", navn: "Tigrinja", egetNavn: "ትግርኛ", retning: "ltr" },
  { kode: "tl", navn: "Tagalog", egetNavn: "Tagalog", retning: "ltr" },
  { kode: "prs", navn: "Dari", egetNavn: "دری", retning: "rtl" },
  { kode: "ru", navn: "Russisk", egetNavn: "Русский", retning: "ltr" },
  { kode: "fa", navn: "Persisk", egetNavn: "فارسی", retning: "rtl" },
  { kode: "th", navn: "Thai", egetNavn: "ไทย", retning: "ltr" },
  { kode: "vi", navn: "Vietnamesisk", egetNavn: "Tiếng Việt", retning: "ltr" },
  { kode: "tr", navn: "Tyrkisk", egetNavn: "Türkçe", retning: "ltr" },
  { kode: "ro", navn: "Rumensk", egetNavn: "Română", retning: "ltr" },
  { kode: "sq", navn: "Albansk", egetNavn: "Shqip", retning: "ltr" },
  { kode: "ckb", navn: "Kurdisk (sorani)", egetNavn: "کوردی", retning: "rtl" },
];

/**
 * Språk som har bestått FR-28 (begrepsanker ≥ 0,95 OG ekstern vurdering).
 * Se maaling/resultater/ for målingene som ga nivået.
 *
 * Ukrainsk, 19.10.2026: begrepsanker 0,981 (≥ 0,95), tilbakeoversettelse 0
 * avvik, og ekstern vurdering av en ukrainsk morsmålsbruker med 0
 * anmerkninger av 16 (fr28-dommer-uk.json).
 */
export const KVALITETSSIKRET: ReadonlySet<string> = new Set<string>(["uk"]);

export function finnSpraak(kode: string | null | undefined): Spraak | null {
  return SPRAAK.find((s) => s.kode === kode) ?? null;
}

export function nivaaFor(kode: string): Nivaa {
  return KVALITETSSIKRET.has(kode) ? "kvalitetssikret" : "modellstoettet";
}
