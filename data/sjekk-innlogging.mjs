/**
 * Ødelegger innloggingskoden med vilje, én feil om gangen, og sjekker at
 * testene oppdager hver av dem — FR-41.
 *
 *   npm run sjekk:innlogging
 *
 * ## Hvorfor dette finnes
 *
 * En test som består, sier bare at koden gjør det testen sjekker. Den sier
 * ikke om testen ville oppdaget en feil. Dette skriptet sier det: for hver
 * regel innloggingen skal holde, bryter det regelen i koden, kjører testene,
 * og krever at minst én test feiler. Består alle testene med en brutt regel,
 * beskytter ingen test mot den feilen — og det er et funn.
 *
 * Metoden kalles mutasjonstesting. Den krever ikke at man leser koden for å
 * vurdere den, og den kan kjøres om av hvem som helst.
 *
 * ## Sikkerhet
 *
 * - Nekter å starte hvis en av filene har endringer som ikke er committet,
 *   slik at det aldri skriver over arbeid.
 * - Setter hver fil tilbake etter hver feil, også ved krasj og ved Ctrl+C.
 * - Rører ikke databasen: testene går mot en Postgres i minnet. Endringen i
 *   migrasjonsfila (feil 6) må derfor ALDRI følges av en migrasjon — og det
 *   gjør den ikke, fordi fila er satt tilbake før skriptet avslutter.
 */

import { execSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const FEIL = [
  {
    regel: "Uten invitasjonskode i miljøet er registreringen stengt",
    fil: "data/auth.ts",
    fra: "if (!forventet || !oppgitt) return false;",
    til: "if (!forventet || !oppgitt) return true;",
  },
  {
    regel: "Koden sjekkes ved hver registrering, også rett mot ruten",
    fil: "data/auth.ts",
    fra: `if (ctx.path !== "/sign-up/email") return;`,
    til: `if (ctx.path !== "/feil-sti") return;`,
  },
  {
    regel: "Navn og bilde lagres ikke",
    fil: "data/auth.ts",
    fra: `data: { ...bruker, name: "", image: null },`,
    til: `data: { ...bruker },`,
  },
  {
    regel: "IP-adresse og nettleserinfo lagres ikke",
    fil: "data/auth.ts",
    fra: `data: { ...oekt, ipAddress: null, userAgent: null },`,
    til: `data: { ...oekt },`,
  },
  {
    regel: "Én elev finner ikke en annens tekst",
    fil: "data/tilgang.ts",
    fra: `.where(and(eq(tekst.id, tekstId), eq(tekst.kontoId, t.kontoId)))\n    .limit(1);`,
    til: `.where(eq(tekst.id, tekstId))\n    .limit(1);`,
  },
  {
    regel: "Når kontoen slettes, forsvinner tekstene med",
    fil: "data/migrasjoner/0001_innlogging.sql",
    fra: `REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;`,
    til: `REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;`,
    // Siste forekomst i fila er fremmednøkkelen fra tekst.
    sisteForekomst: true,
  },
  {
    regel: "Eleven kan slette kontoen sin",
    fil: "data/auth.ts",
    fra: "user: { deleteUser: { enabled: true } },",
    til: "user: { deleteUser: { enabled: false } },",
  },
  // Lagt til 19.11.2026 (FR-53, spec-vilkaar-og-aldersgrense, kodefunn 28).
  {
    regel: "Alder og vilkår sjekkes ved hver registrering, også rett mot ruten",
    fil: "data/auth.ts",
    fra: "if (feil) throw feil;",
    til: "if (feil) void feil;",
  },
  {
    regel: "Bekreftelsen av vilkårene lagres når kontoen lages",
    fil: "data/auth.ts",
    fra: `if (ctx?.path !== "/sign-up/email") return;`,
    til: "return;",
  },
  {
    regel: "Ingen konto uten bekreftelse: begge lagres i samme transaksjon",
    fil: "data/auth.ts",
    fra: "transaction: true,",
    til: "transaction: false,",
  },
  {
    regel: "IP-adressen lagres ikke i klartekst i telleren for innloggingsforsøk",
    fil: "data/auth.ts",
    fra: "const key = hashTellernoekkel(noekkel, hemmelighet());",
    til: "const key = noekkel;",
  },
  {
    regel: "Begrensningen av innloggingsforsøk virker med hashet nøkkel",
    fil: "data/auth.ts",
    fra: "if (sist === naa) {",
    til: "if (sist === naa || true) {",
  },
  {
    regel: "Etter tidsvinduet slipper telleren gjennom igjen",
    fil: "data/auth.ts",
    // Fjerner begge utløpsgrenene i telleren: et gammelt forsøk teller som nytt.
    fra: "const utloept = sql`${rl.lastRequest} <= ${vinduStart}`;",
    til: "const utloept = sql`false`;",
  },
  // Lagt til 23.11.2026 (spec-runde-3-1-innloggingssperre).
  {
    regel: "Innlogging tillater fem forsøk per minutt",
    fil: "data/auth.ts",
    // Regelen matcher ingen sti: Better Auths standard (3 per 10 s) gjelder igjen.
    fra: `"/sign-in/email": { window: 60, max: 5 },`,
    til: `"/feil-sti": { window: 60, max: 5 },`,
  },
];

/* ------------------------------------------------------------------ */

const filer = [...new Set(FEIL.map((f) => f.fil))];

// Nekt å starte hvis noe ikke er committet: skriptet skriver til disse filene.
const endret = execSync(`git status --porcelain -- ${filer.join(" ")}`, {
  encoding: "utf8",
}).trim();
if (endret) {
  console.error(
    "Disse filene har endringer som ikke er committet:\n" +
      endret +
      "\n\nSkriptet skriver til dem, og vil ikke risikere å overskrive arbeidet ditt." +
      "\nSett dem tilbake med `git restore <fil>`, eller commit, og kjør på nytt.",
  );
  process.exit(1);
}

const original = new Map(filer.map((f) => [f, readFileSync(f, "utf8")]));
const settTilbake = () => {
  for (const [f, innhold] of original) writeFileSync(f, innhold);
};
// Ctrl+C eller krasj midt i: filene skal tilbake uansett.
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    settTilbake();
    console.error("\nAvbrutt. Filene er satt tilbake.");
    process.exit(130);
  });
}
process.on("uncaughtException", (e) => {
  settTilbake();
  throw e;
});

function bytt(innhold, { fra, til, sisteForekomst }) {
  const s = innhold.split("\r\n").join("\n");
  const i = sisteForekomst ? s.lastIndexOf(fra) : s.indexOf(fra);
  if (i === -1) return null;
  return s.slice(0, i) + til + s.slice(i + fra.length);
}

console.log("Kjører testene én gang uendret, for å se at de er grønne…");
try {
  execSync("npx vitest run data/auth.test.ts", { stdio: "pipe" });
} catch {
  console.error("Testene feiler allerede uten endringer. Rett det først.");
  process.exit(1);
}

const resultater = [];
for (const [nr, feil] of FEIL.entries()) {
  process.stdout.write(`\n${nr + 1}. ${feil.regel}\n   bryter regelen i ${feil.fil} … `);
  const ny = bytt(original.get(feil.fil), feil);
  if (ny === null) {
    console.log("FANT IKKE LINJEN — koden er endret siden skriptet ble skrevet.");
    resultater.push({ ...feil, utfall: "ikke funnet", fanget: [] });
    continue;
  }

  writeFileSync(feil.fil, ny);
  let ut = "";
  try {
    ut = execSync("npx vitest run data/auth.test.ts", { encoding: "utf8", stdio: "pipe" });
  } catch (e) {
    ut = `${e.stdout ?? ""}${e.stderr ?? ""}`;
  } finally {
    writeFileSync(feil.fil, original.get(feil.fil));
  }

  const fanget = [...ut.matchAll(/×\s+(.+?)\s+\d+ms/g)].map((m) => m[1]);
  console.log(fanget.length > 0 ? `OPPDAGET av ${fanget.length} test(er)` : "IKKE OPPDAGET");
  for (const t of fanget) console.log(`     – ${t}`);
  resultater.push({ ...feil, utfall: fanget.length > 0 ? "oppdaget" : "ikke oppdaget", fanget });
}

settTilbake();

/* ------------------------------------------------------------------ */

const oppdaget = resultater.filter((r) => r.utfall === "oppdaget").length;
const dato = new Date().toISOString().slice(0, 10);
const rapport = [
  `# Mutasjonstest av innloggingen — ${dato}`,
  "",
  "Kjørt med `npm run sjekk:innlogging` (data/sjekk-innlogging.mjs). Hver rad er en",
  "regel innloggingen skal holde. Regelen ble brutt i koden, testene i",
  "`data/auth.test.ts` ble kjørt, og fila ble satt tilbake.",
  "",
  `**${oppdaget} av ${resultater.length} brudd ble oppdaget av testene.**`,
  "",
  "| Nr | Regel | Fil | Utfall | Testene som feilet |",
  "|---|---|---|---|---|",
  ...resultater.map(
    (r, i) =>
      `| ${i + 1} | ${r.regel} | \`${r.fil}\` | ${r.utfall} | ${r.fanget.join("; ") || "—"} |`,
  ),
  "",
].join("\n");

const ut = path.join("maaling", "resultater", `${dato}-innlogging-mutasjoner.md`);
await mkdir(path.dirname(ut), { recursive: true });
await writeFile(ut, rapport, "utf8");

console.log(`\n${oppdaget} av ${resultater.length} brudd oppdaget. Rapport: ${ut}`);
console.log("Filene er satt tilbake. Sjekk gjerne med `git status`.");
process.exit(oppdaget === resultater.length ? 0 : 1);
