/**
 * Innsyn: alt som er lagret om én konto, som én JSON-fil (FR-53, retten til
 * å få en kopi i «Vilkår og personvern»).
 *
 *   node data/innsyn.mjs <e-post>              skriver innsyn-<dato>.json
 *   node data/innsyn.mjs <e-post> --ut innsyn-kopi.json
 *
 * Bruk et filnavn som begynner med `innsyn-`, så `.gitignore` dekker det.
 *
 * Leser `.env.local` som data/migrer-https.mjs, og peker derfor som regel mot
 * produksjonsdatabasen. **Bare lesing:** skriptet kjører ingen INSERT,
 * UPDATE eller DELETE, og spørringene går i skrivebeskyttede transaksjoner
 * (`READ ONLY`), så Postgres selv nekter en skriving. Mot Neon går de over
 * HTTPS, som migrer-https.mjs; mot en lokal Postgres over `pg`.
 *
 * ## Hva som tas med
 *
 * Alle rader i alle tabeller som peker til kontoen, direkte eller via noe som
 * peker til den (tekstene, og alt som peker til tekstene, osv.). Hvilke
 * tabeller det er, leses fra fremmednøklene i databasen og ikke fra en liste
 * her, så en ny tabell med fremmednøkkel kommer med av seg selv. I tillegg
 * `forbruk`, som med vilje ikke har fremmednøkkel (data/skjema.ts), men har
 * `konto_id`.
 *
 * **Tas ut:** passordhashen og økttokenene (`password`, `token`,
 * `access_token`, `refresh_token`, `id_token`). De er ikke opplysninger om
 * eleven, og en kopi av dem på avveie ville gitt tilgang til kontoen.
 *
 * Bruksanvisning for den som svarer på en innsynsforespørsel: se
 * `_bmad-output/planning-artifacts/gjennomgang-innlogging.md`, «Innsyn».
 */

import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

/** Kolonner som aldri tas med i innsynet. */
export const UTELATTE_KOLONNER = ["password", "token", "access_token", "refresh_token", "id_token"];

/** Tabeller uten fremmednøkkel som likevel har kontoens id. */
const UTEN_FREMMEDNOEKKEL = [{ tabell: "forbruk", kolonne: "konto_id" }];

const navn = (s) => `"${String(s).replaceAll('"', '""')}"`;

function rens(rad) {
  const ut = {};
  for (const [k, v] of Object.entries(rad)) {
    if (UTELATTE_KOLONNER.includes(k)) continue;
    ut[k] = typeof v === "bigint" ? v.toString() : v;
  }
  return ut;
}

/**
 * Samler alt for kontoen med `epost`. `sporring(tekst, parametre)` kjører én
 * SQL-spørring og gir radene. Gir `null` når kontoen ikke finnes.
 */
export async function samleInnsyn(sporring, epost) {
  const [bruker] = await sporring(`SELECT * FROM "user" WHERE lower(email) = lower($1)`, [epost]);
  if (!bruker) return null;

  // Fremmednøklene i public: barnetabell.kolonne -> foreldertabell.kolonne.
  const kanter = await sporring(
    `SELECT kcu.table_name AS barn, kcu.column_name AS barnekolonne,
            ccu.table_name AS forelder, ccu.column_name AS foreldrekolonne
       FROM information_schema.table_constraints tc
       JOIN information_schema.key_column_usage kcu
         ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
       JOIN information_schema.constraint_column_usage ccu
         ON tc.constraint_name = ccu.constraint_name AND tc.table_schema = ccu.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
      ORDER BY 1, 2`,
    [],
  );

  // tabell -> Map(nøkkel -> rad). Nøkkelen er `id`, eller hele raden der
  // tabellen ikke har `id` (som tabellene med konto_id som primærnøkkel).
  const funnet = new Map([["user", new Map([[bruker.id, bruker]])]]);
  const noekkel = (rad) => (rad.id !== undefined ? String(rad.id) : JSON.stringify(rad));
  const leggTil = (tabell, rader) => {
    let nye = 0;
    if (!funnet.has(tabell)) funnet.set(tabell, new Map());
    const m = funnet.get(tabell);
    for (const r of rader) {
      const k = noekkel(r);
      if (!m.has(k)) {
        m.set(k, r);
        nye++;
      }
    }
    return nye;
  };

  // Følg fremmednøklene nedover til ingen nye rader dukker opp.
  const MAKS_RUNDER = 20;
  for (let runde = 0; ; runde++) {
    if (runde === MAKS_RUNDER) {
      // Aldri en eksport som later som den er komplett.
      throw new Error(`Innsynet ble ikke ferdig etter ${MAKS_RUNDER} runder; eksporten ville vært ufullstendig.`);
    }
    let nye = 0;
    for (const k of kanter) {
      const foreldre = funnet.get(k.forelder);
      if (!foreldre || foreldre.size === 0) continue;
      const verdier = [...new Set([...foreldre.values()].map((r) => r[k.foreldrekolonne]))].filter(
        (v) => v !== null && v !== undefined,
      );
      if (verdier.length === 0) continue;
      const rader = await sporring(
        `SELECT * FROM ${navn(k.barn)} WHERE ${navn(k.barnekolonne)}::text = ANY($1::text[])`,
        [verdier.map(String)],
      );
      nye += leggTil(k.barn, rader);
    }
    if (nye === 0) break;
  }

  for (const { tabell, kolonne } of UTEN_FREMMEDNOEKKEL) {
    const rader = await sporring(`SELECT * FROM ${navn(tabell)} WHERE ${navn(kolonne)} = $1`, [bruker.id]);
    leggTil(tabell, rader);
  }

  /** @type {Record<string, Record<string, unknown>[]>} */
  const tabeller = {};
  for (const tabell of [...funnet.keys()].sort()) {
    const rader = [...funnet.get(tabell).values()].map(rens);
    if (rader.length > 0) tabeller[tabell] = rader;
  }
  return {
    hentet: new Date().toISOString(),
    epost: bruker.email,
    kontoId: bruker.id,
    merknad:
      "Alt LeseBuddy har lagret om kontoen, tabell for tabell. Passordhash og økttokener er tatt ut.",
    tabeller,
  };
}

/* ------------------------------------------------------------------ */

async function hovedprogram() {
  const args = process.argv.slice(2);
  const utIndeks = args.indexOf("--ut");
  const utfil = utIndeks >= 0 ? args[utIndeks + 1] : undefined;
  const epost = args.find((a, i) => !a.startsWith("--") && !(utIndeks >= 0 && i === utIndeks + 1));
  if (!epost) {
    console.error("Bruk: node data/innsyn.mjs <e-post> [--ut innsyn-kopi.json]");
    process.exit(2);
  }

  const { config } = await import("dotenv");
  config({ path: ".env.local", quiet: true });
  const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (!url) {
    console.error("Fant ingen DATABASE_URL i .env.local. Kjør `npx vercel env pull .env.local` først.");
    process.exit(2);
  }

  let innsyn;
  if (new URL(url).hostname.endsWith(".neon.tech")) {
    // Neon over HTTPS, som migrer-https.mjs, fordi port 5432 ikke slipper
    // gjennom på alle nett. Hver spørring går i sin egen READ ONLY-transaksjon.
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(url);
    innsyn = await samleInnsyn(
      async (tekst, parametre) => (await sql.transaction([sql.query(tekst, parametre)], { readOnly: true }))[0],
      epost,
    );
  } else {
    // Lokal Postgres: én klient, så hele uttrekket er én READ ONLY-transaksjon.
    const { default: pg } = await import("pg");
    const klient = new pg.Client({ connectionString: url });
    await klient.connect();
    try {
      await klient.query("BEGIN TRANSACTION READ ONLY");
      innsyn = await samleInnsyn(async (tekst, parametre) => (await klient.query(tekst, parametre)).rows, epost);
      await klient.query("COMMIT");
    } finally {
      await klient.end();
    }
  }

  if (!innsyn) {
    console.error(`Fant ingen konto med e-posten ${epost}. Ingenting er skrevet.`);
    process.exit(1);
  }
  const fil = utfil ?? `innsyn-${new Date().toISOString().slice(0, 10)}.json`;
  // Bare eieren kan lese fila: den inneholder elevens tekster.
  await writeFile(fil, JSON.stringify(innsyn, null, 2) + "\n", { encoding: "utf8", mode: 0o600 });
  const antall = Object.values(innsyn.tabeller).reduce((n, r) => n + r.length, 0);
  console.log(`Vert: ${new URL(url).hostname}`);
  console.log(`${antall} rader fra ${Object.keys(innsyn.tabeller).length} tabeller skrevet til ${path.resolve(fil)}`);
  console.log("Fila inneholder elevens tekster. Send den til eleven, og slett den her etterpå.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await hovedprogram();
}
