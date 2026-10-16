/**
 * Sjekker tilgjengelighetskravene i en ekte nettleser — §5, FR-10, FR-12.
 *
 *   npm run sjekk:tilgjengelighet
 *
 * Starter en Postgres i minnet og appen i testmodus `les`, og går gjennom
 * Kjerneløypen i Chrome slik en elev ville gjort: registrering, innliming av
 * eksempelteksten, aktivering, gjennomsyn, lesing. Deretter:
 *
 *   - axe-core på hver side, på PC og på telefon (WCAG 2.1 A og AA)
 *   - FR-10: forklaringen åpnes med fokus, pekerhvil og trykk; lukkes med
 *     Escape, trykk utenfor og lukkeknappen; rulleposisjonen står stille
 *   - FR-12: tekststørrelsen endres og huskes etter ny innlasting
 *   - §5: hopp-lenken er det første tastaturet treffer
 *   - §5 mobil: ingen side ruller sidelengs på en 375 px bred telefon
 *
 * Bruker Chrome som er installert på maskinen (playwright-core laster ikke ned
 * nettlesere). Rører ALDRI Neon: databaseadressen settes til 127.0.0.1, og
 * skriptet stopper før noe startes om den ikke er det.
 *
 * Rapporten skrives til maaling/resultater/tilgjengelighet-<dato>.md.
 */

import { spawn, spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { chromium } from "playwright-core";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const DBPORT = 5437;
const APPPORT = 3107;
const DB = `postgresql://postgres:postgres@127.0.0.1:${DBPORT}/postgres`;
const APP = `http://localhost:${APPPORT}`;
const KODE = "tilgjengelighet";
const EPOST = "sjekk@test.no";
const PASSORD = "et-langt-passord";

if (new URL(DB).hostname !== "127.0.0.1") throw new Error("Databasen må være lokal.");

const require = createRequire(import.meta.url);
const AXE = require.resolve("axe-core/axe.min.js");

const barn = [];
function start(kommando, argv, env = {}) {
  const p = spawn(kommando, argv, { shell: true, env: { ...process.env, ...env }, stdio: ["ignore", "pipe", "pipe"] });
  barn.push(p);
  return p;
}
function stopp() {
  for (const p of barn) {
    // På Windows dreper `kill` bare skallet; taskkill tar hele treet. Synkront,
    // ellers rekker skriptet å avslutte før serverne er borte, og neste kjøring
    // møter en gammel server på samme port.
    if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(p.pid), "/T", "/F"], { stdio: "ignore" });
    else p.kill();
  }
}
process.on("SIGINT", () => {
  stopp();
  process.exit(130);
});

async function vent(sjekk, hva, ms = 180000) {
  const slutt = Date.now() + ms;
  for (;;) {
    try {
      if (await sjekk()) return;
    } catch {}
    if (Date.now() > slutt) throw new Error(`Ventet for lenge på ${hva}`);
    await new Promise((ok) => setTimeout(ok, 500));
  }
}

/* ------------------------------------------------------------------ */

const funn = [];
const axeFunn = [];
function sjekk(navn, ok, detalj = "") {
  funn.push({ navn, ok, detalj });
  console.log(`${ok ? "✓" : "✗"} ${navn}${detalj ? ` — ${detalj}` : ""}`);
}

async function axe(side, navn) {
  await side.addScriptTag({ path: AXE });
  const r = await side.evaluate(() =>
    axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } }),
  );
  for (const v of r.violations) {
    axeFunn.push({ side: navn, id: v.id, alvor: v.impact, hjelp: v.help, antall: v.nodes.length, eksempel: v.nodes[0]?.target.join(" ") });
  }
  sjekk(`axe: ${navn}`, r.violations.length === 0, r.violations.map((v) => `${v.id} (${v.nodes.length})`).join(", "));
}

async function ingenSiderulling(side, navn) {
  const [bredde, vindu] = await side.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  sjekk(`mobil uten sidelengs rulling: ${navn}`, bredde <= vindu + 1, `${bredde} px innhold i ${vindu} px vindu`);
}

/* ------------------------------------------------------------------ */

try {
  console.log("Starter database i minnet og appen i testmodus …");
  start("npx", ["pglite-server", `--port=${DBPORT}`, "--max-connections=20"]);
  await vent(async () => {
    const c = new pg.Client(DB);
    await c.connect();
    await c.end();
    return true;
  }, "databasen");
  // PGlite-serveren svarer på tilkobling litt før den tar imot spørringer.
  await vent(async () => {
    const pool = new pg.Pool({ connectionString: DB, max: 1 });
    try {
      await migrate(drizzle(pool, { casing: "snake_case" }), { migrationsFolder: "data/migrasjoner" });
      return true;
    } finally {
      await pool.end();
    }
  }, "migrasjonene", 60000);

  const app = start("npx", ["next", "dev", "-p", String(APPPORT)], {
    DATABASE_URL: DB,
    DATABASE_URL_UNPOOLED: DB,
    LESEVENN_TESTMODUS: "les",
    LESEVENN_BYGGEMAPPE: ".next-sjekk",
    LESEVENN_INVITASJONSKODE: KODE,
    BETTER_AUTH_SECRET: "lokal-hemmelighet-kun-for-tilgjengelighetssjekken",
    BETTER_AUTH_URL: APP,
    ANTHROPIC_API_KEY: "",
  });
  app.stderr.on("data", (d) => process.env.VERBOSE && process.stderr.write(d));
  app.stdout.on("data", (d) => process.env.VERBOSE && process.stdout.write(d));
  await vent(async () => (await fetch(`${APP}/api/helse`)).ok, "appen");

  const nettleser = await chromium.launch({ channel: "chrome", headless: true });
  globalThis.__nettleser = nettleser;

  /* --- PC: løypen fram til lesevisningen --------------------------- */
  const pc = await (await nettleser.newContext({ viewport: { width: 1280, height: 900 }, locale: "nb-NO" })).newPage();
  pc.setDefaultTimeout(120000);

  await pc.goto(`${APP}/registrer`);
  await axe(pc, "registrering");
  await pc.fill("#kode", KODE);
  await pc.fill("#epost", EPOST);
  await pc.fill("#passord", PASSORD);
  await pc.fill("#gjenta", PASSORD);
  await pc.click("form button[type=submit]");
  await pc.waitForURL(`${APP}/`);
  await axe(pc, "forsiden");

  // Hopp-lenken skal være det første Tab treffer etter en sidelasting.
  await pc.goto(`${APP}/`);
  await pc.keyboard.press("Tab");
  const foerste = await pc.evaluate(() => document.activeElement?.textContent?.trim());
  sjekk("hopp-lenken er første fokus", foerste === "Hopp til innholdet", `fikk «${foerste}»`);

  const eksempel = await readFile("testdata/eksempeltekst/em-egenskaper.txt", "utf8");
  await pc.fill("#tittel", "EM-bølger");
  await pc.fill("#tekst", eksempel);
  await pc.click("button[type=submit]:visible:has-text(\"Begynn\")");
  await pc.waitForURL(/\/aktivering$/);
  await axe(pc, "aktivering");
  await pc.fill("#svar", "Noe om bølger og stråling.");
  await pc.click("text=Videre");
  await pc.waitForURL(/\/gjennomsyn$/);
  await axe(pc, "gjennomsyn");
  await pc.click("text=Lås og finn fagordene");
  await pc.waitForURL(/\/lesing$/);
  const lesing = pc.url();
  const tekstUrl = lesing.replace(/\/lesing$/, "");
  await pc.waitForSelector("article button");
  await axe(pc, "lesevisning");

  /* --- FR-10 på PC ------------------------------------------------- */
  const ord = pc.locator("article button[aria-expanded]");
  const dialog = pc.locator("article [role=dialog]");
  const rull = () => pc.evaluate(() => window.scrollY);

  await pc.evaluate(() => window.scrollTo(0, 300));
  const foer = await rull();
  await ord.nth(0).focus();
  sjekk("FR-10: fokus åpner forklaringen", await dialog.isVisible());
  await pc.keyboard.press("Escape");
  sjekk("FR-10: Escape lukker", (await dialog.count()) === 0);
  sjekk(
    "FR-10: fokus står på ordet etter Escape",
    await ord.nth(0).evaluate((el) => el === document.activeElement),
  );
  sjekk("FR-10: rulleposisjonen står stille (fokus/Escape)", (await rull()) === foer, `${foer} → ${await rull()}`);

  await pc.locator("h1").click(); // fjern fokus
  await ord.nth(1).hover();
  sjekk("FR-10: pekerhvil åpner forklaringen", await dialog.isVisible());
  await pc.mouse.move(5, 5);
  sjekk("FR-10: forklaringen lukkes når pekeren går", (await dialog.count()) === 0);

  await ord.nth(1).click();
  await pc.mouse.move(5, 5);
  sjekk("FR-10: trykk fester forklaringen", await dialog.isVisible());
  await pc.locator("article [role=dialog] button").click();
  sjekk("FR-10: lukkeknappen lukker", (await dialog.count()) === 0);
  await ord.nth(1).click();
  await pc.locator("h1").click();
  sjekk("FR-10: trykk utenfor lukker", (await dialog.count()) === 0);
  await axe(pc, "lesevisning med åpen forklaring").catch(() => {});

  /* --- FR-12 ------------------------------------------------------- */
  const storrelse = () => pc.locator("#lesetekst").evaluate((el) => getComputedStyle(el).fontSize);
  await pc.click("summary:has-text('Leseinnstillinger')");
  await pc.click("label:has-text('Ekstra stor')");
  sjekk("FR-12: tekststørrelsen endres med en gang", (await storrelse()) === "26px", await storrelse());
  await pc.waitForTimeout(1500);
  await pc.reload();
  sjekk("FR-12: tekststørrelsen huskes", (await storrelse()) === "26px", await storrelse());
  const tegnPerLinje = await pc.locator("#lesetekst").evaluate((el) => {
    const p = el.querySelector("p");
    const ch = document.createElement("span");
    ch.textContent = "0";
    p.appendChild(ch);
    const w = ch.getBoundingClientRect().width;
    ch.remove();
    return Math.round(p.getBoundingClientRect().width / w);
  });
  sjekk("FR-12: linjelengden er om lag 70 tegn også med stor skrift", tegnPerLinje <= 75, `${tegnPerLinje} tegn`);
  await pc.click("summary:has-text('Leseinnstillinger')");
  await pc.click("label:has-text('Normal') >> nth=0");
  await pc.waitForTimeout(1500);

  for (const [navn, url] of [
    ["oppgaver", `${tekstUrl}/oppgaver`],
    ["øvekort", `${tekstUrl}/oevekort`],
    ["minnevers", `${tekstUrl}/minnevers`],
    ["konto", `${APP}/konto`],
  ]) {
    await pc.goto(url);
    await axe(pc, navn);
  }

  /* --- Telefon ------------------------------------------------------ */
  const kontekst = await nettleser.newContext({
    viewport: { width: 375, height: 740 },
    isMobile: true,
    hasTouch: true,
    locale: "nb-NO",
  });
  const tlf = await kontekst.newPage();
  tlf.setDefaultTimeout(120000);
  await tlf.goto(`${APP}/logg-inn`);
  await tlf.fill("#epost", EPOST);
  await tlf.fill("#passord", PASSORD);
  await tlf.click("form button[type=submit]");
  await tlf.waitForURL(`${APP}/`);

  for (const [navn, url] of [
    ["forsiden", `${APP}/`],
    ["aktivering", `${tekstUrl}/aktivering`],
    ["lesevisning", lesing],
    ["oppgaver", `${tekstUrl}/oppgaver`],
    ["øvekort", `${tekstUrl}/oevekort`],
    ["minnevers", `${tekstUrl}/minnevers`],
    ["konto", `${APP}/konto`],
  ]) {
    await tlf.goto(url);
    await ingenSiderulling(tlf, navn);
    await axe(tlf, `${navn} (telefon)`);
  }

  await tlf.goto(lesing);
  const tOrd = tlf.locator("article button[aria-expanded]");
  const tDialog = tlf.locator("article [role=dialog]");
  // Et ord langt til høyre i linja er det vanskeligste for plasseringen.
  const n = await tOrd.count();
  let hoeyre = 0;
  let maks = -1;
  for (let i = 0; i < Math.min(n, 15); i++) {
    const b = await tOrd.nth(i).boundingBox();
    if (b && b.x > maks) {
      maks = b.x;
      hoeyre = i;
    }
  }
  await tOrd.nth(hoeyre).scrollIntoViewIfNeeded();
  const tFoer = await tlf.evaluate(() => window.scrollY);
  await tOrd.nth(hoeyre).tap();
  sjekk("FR-10 telefon: trykk åpner forklaringen", await tDialog.isVisible());
  const kant = await tDialog.boundingBox();
  sjekk("FR-10 telefon: forklaringen er innenfor skjermen", !!kant && kant.x >= 0 && kant.x + kant.width <= 375 + 1, kant ? `${Math.round(kant.x)}–${Math.round(kant.x + kant.width)} px` : "");
  sjekk("FR-10 telefon: rulleposisjonen står stille", (await tlf.evaluate(() => window.scrollY)) === tFoer);
  await tlf.locator("h1").tap();
  sjekk("FR-10 telefon: trykk utenfor lukker", (await tDialog.count()) === 0);
  await ingenSiderulling(tlf, "lesevisning etter forklaring");

  await nettleser.close();
} catch (e) {
  sjekk("skriptet kjørte ferdig", false, e.message.split("\n")[0]);
  if (process.env.SKJERMBILDE) {
    for (const ctx of globalThis.__nettleser?.contexts() ?? [])
      for (const [i, p] of ctx.pages().entries()) {
        await p.screenshot({ path: path.join(process.env.SKJERMBILDE, `feil-${i}.png`), fullPage: true }).catch(() => {});
        console.log("Side ved feil:", p.url(), (await p.locator("[role=alert]").allTextContents().catch(() => [])).join(" | "));
      }
  }
} finally {
  stopp();
}

/* --- Rapport --------------------------------------------------------- */
const dato = new Date().toISOString().slice(0, 10);
const ok = funn.filter((f) => f.ok).length;
const linjer = [
  `# Tilgjengelighetssjekk — ${dato}`,
  "",
  "Kjørt med `npm run sjekk:tilgjengelighet`: Chrome, PC (1280 px) og telefon (375 px, berøring), axe-core WCAG 2.1 A/AA.",
  "",
  `**${ok} av ${funn.length} sjekker bestått.**`,
  "",
  "| | Sjekk | Detalj |",
  "|---|---|---|",
  ...funn.map((f) => `| ${f.ok ? "✓" : "✗"} | ${f.navn} | ${f.detalj.replace(/\|/g, "\\|")} |`),
  "",
];
if (axeFunn.length > 0) {
  linjer.push("## Funn fra axe-core", "", "| Side | Regel | Alvor | Antall | Eksempel | Hva |", "|---|---|---|---|---|---|");
  for (const a of axeFunn) linjer.push(`| ${a.side} | ${a.id} | ${a.alvor} | ${a.antall} | \`${a.eksempel}\` | ${a.hjelp} |`);
  linjer.push("");
}
linjer.push("Det axe-core ikke kan se — om rekkefølgen gir mening, om teksten er forståelig — krever en person. Se også testen på ekte telefon i fremdriftsplanen.", "");
await mkdir(path.join("maaling", "resultater"), { recursive: true });
await writeFile(path.join("maaling", "resultater", `tilgjengelighet-${dato}.md`), linjer.join("\n"));
console.log(`\n${ok} av ${funn.length} bestått. Rapport: maaling/resultater/tilgjengelighet-${dato}.md`);
process.exit(ok === funn.length ? 0 : 1);
