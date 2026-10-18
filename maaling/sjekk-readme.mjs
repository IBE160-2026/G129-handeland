/**
 * FR-46: «README er testet av å bli fulgt.»
 *
 *   npm run sjekk:readme
 *
 * Kloner det som er committet til en tom mappe — uten .env.local og uten
 * prosjektets nøkler — følger stegene i README («Uten Docker»), og går
 * gjennom Kjerneløypen i Chrome: registrering, innliming av eksempelteksten,
 * overskriftskontroll, aktivering, gjennomsyn, lesevisning og quiz.
 *
 * Ett avvik fra README, som rapporteres: PGlite startes på en annen port enn
 * 5433, fordi utviklerens egen lokale database bruker den. Alt annet er
 * README-stegene som de står.
 *
 * Rapporten skrives til maaling/resultater/readme-<dato>.md.
 */

import { spawn, spawnSync } from "node:child_process";
import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright-core";

const REPO = process.cwd();
const DBPORT = 5439;
const APP = "http://localhost:3000";
const EPOST = "readme@test.no";
const PASSORD = "et-langt-passord";

const funn = [];
function sjekk(navn, ok, detalj = "") {
  funn.push({ navn, ok, detalj });
  console.log(`${ok ? "✓" : "✗"} ${navn}${detalj ? ` — ${detalj}` : ""}`);
}

// Ingen av prosjektets hemmeligheter skal kunne lekke inn fra skallet.
const env = { ...process.env };
for (const k of Object.keys(env)) {
  if (/^(ANTHROPIC|DATABASE_URL|PG|POSTGRES|NEON|VERCEL|BETTER_AUTH|LESEVENN)/.test(k)) delete env[k];
}

const barn = [];
function start(kommando, argv, cwd) {
  const p = spawn(kommando, argv, { cwd, shell: true, env, stdio: ["ignore", "pipe", "pipe"] });
  barn.push(p);
  return p;
}
function kjoer(kommando, argv, cwd) {
  const r = spawnSync(kommando, argv, { cwd, shell: true, env, encoding: "utf8" });
  if (r.status !== 0) throw new Error(`${kommando} ${argv.join(" ")} feilet:\n${(r.stderr || r.stdout).slice(-800)}`);
  return r.stdout;
}
function stopp() {
  for (const p of barn) {
    if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(p.pid), "/T", "/F"], { stdio: "ignore" });
    else p.kill();
  }
}
async function vent(sjekkFn, hva, ms = 240000) {
  const slutt = Date.now() + ms;
  for (;;) {
    try {
      if (await sjekkFn()) return;
    } catch {}
    if (Date.now() > slutt) throw new Error(`Ventet for lenge på ${hva}`);
    await new Promise((ok) => setTimeout(ok, 1000));
  }
}

const mappe = await mkdtemp(path.join(os.tmpdir(), "lesevenn-readme-"));
const commit = kjoer("git", ["rev-parse", "--short", "HEAD"], REPO).trim();

try {
  console.log(`Kloner ${commit} til ${mappe} …`);
  kjoer("git", ["clone", "--quiet", `"${REPO}"`, `"${mappe}"`], REPO);
  sjekk("klonen har ingen .env.local", !(await readFile(path.join(mappe, ".env.local"), "utf8").then(() => true, () => false)));

  console.log("npm install …");
  kjoer("npm", ["install", "--no-audit", "--no-fund"], mappe);
  sjekk("npm install", true);

  // README: cp .env.example .env.local — «virker som den står».
  await cp(path.join(mappe, ".env.example"), path.join(mappe, ".env.local"));
  // README, «Uten Docker»: sett DATABASE_URL til PGlite. Porten er det ene avviket.
  let lokal = await readFile(path.join(mappe, ".env.local"), "utf8");
  lokal = lokal.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL=postgres://postgres:postgres@127.0.0.1:${DBPORT}/postgres`);
  await writeFile(path.join(mappe, ".env.local"), lokal);

  start("npx", ["pglite-server", `--port=${DBPORT}`, "--max-connections=20"], mappe);
  await new Promise((ok) => setTimeout(ok, 4000));
  await vent(async () => {
    kjoer("npm", ["run", "db:migrer"], mappe);
    return true;
  }, "migrasjonene", 60000);
  sjekk("npm run db:migrer", true);

  start("npm", ["run", "dev"], mappe);
  await vent(async () => (await fetch(`${APP}/api/helse`)).ok, "npm run dev");
  sjekk("npm run dev svarer", true);

  const nettleser = await chromium.launch({ channel: "chrome", headless: true });
  const s = await (await nettleser.newContext({ locale: "nb-NO" })).newPage();
  s.setDefaultTimeout(180000);

  await s.goto(`${APP}/registrer`);
  await s.fill("#kode", "lokal");
  await s.fill("#epost", EPOST);
  await s.fill("#passord", PASSORD);
  await s.fill("#gjenta", PASSORD);
  await s.click("form button[type=submit]");
  await s.waitForURL(`${APP}/`);
  sjekk("registrering med invitasjonskoden fra .env.example", true);

  const eksempel = await readFile(path.join(mappe, "testdata", "eksempeltekst", "em-egenskaper.txt"), "utf8");
  await s.fill("#tittel", "EM-bølger");
  await s.fill("#tekst", eksempel);
  await s.click('button[type=submit]:visible:has-text("Begynn")');
  await s.waitForURL(/\/overskrifter$/);
  await s.click("text=Overskriftene stemmer — videre");
  await s.waitForURL(/\/aktivering$/);
  sjekk("innliming og overskriftskontroll", true);
  await s.fill("#svar", "Noe om bølger.");
  await s.click("text=Videre");
  await s.waitForURL(/\/gjennomsyn$/);
  await s.click("text=Lås og finn fagordene");
  await s.waitForURL(/\/lesing$/);
  const markeringer = await s.locator("article button[aria-expanded]").count();
  sjekk("lesevisning med fagord markert, uten API-nøkkel", markeringer > 0, `${markeringer} markeringer`);

  const tekstUrl = s.url().replace(/\/lesing$/, "");
  await s.goto(`${tekstUrl}/quiz`);
  const lag = s.locator('button:has-text("Lag quizen")');
  if (await lag.count()) await lag.click();
  await s.waitForSelector("ol fieldset");
  for (const f of await s.locator("ol > li fieldset").all()) {
    const radio = f.locator("input[type=radio]");
    if (await radio.count()) await radio.first().check();
    const felt = f.locator("textarea");
    if (await felt.count()) await felt.fill("Vet ikke helt.");
  }
  await s.click('button:has-text("Lever")');
  const vurder = s.locator("text=Nei, ikke helt");
  await vurder.first().waitFor({ timeout: 20000 }).catch(() => {});
  for (const v of await vurder.all()) await v.click();
  const seResultat = s.locator('button:has-text("Se resultatet")');
  if (await seResultat.count()) await seResultat.click();
  await s.waitForSelector("text=/Du fikk \\d+ av \\d+ riktige/");
  sjekk("quiz levert og rettet, uten API-nøkkel", true, (await s.locator("text=/Du fikk/").first().textContent())?.trim());

  await nettleser.close();
} catch (e) {
  sjekk("README kunne følges til endes", false, e.message.split("\n")[0]);
} finally {
  stopp();
  await rm(mappe, { recursive: true, force: true }).catch(() => {});
}

const dato = new Date().toISOString().slice(0, 10);
const ok = funn.filter((f) => f.ok).length;
const linjer = [
  `# FR-46: README fulgt — ${dato}`,
  "",
  `Commit \`${commit}\`, klonet til en tom mappe uten \`.env.local\` og uten prosjektets nøkler (alle ANTHROPIC-, DATABASE-, NEON-, VERCEL- og BETTER_AUTH-variabler fjernet fra miljøet). Fulgt: «Komme i gang», veien «Uten Docker». Kjerneløypen gått gjennom i Chrome.`,
  "",
  `**Avvik fra README:** PGlite på port ${DBPORT} i stedet for 5433, fordi utviklerens lokale database bruker 5433. Ingen andre.`,
  "",
  `**${ok} av ${funn.length} steg bestått.**`,
  "",
  "| | Steg | Detalj |",
  "|---|---|---|",
  ...funn.map((f) => `| ${f.ok ? "✓" : "✗"} | ${f.navn} | ${String(f.detalj).replace(/\|/g, "\\|")} |`),
  "",
];
await mkdir(path.join(REPO, "maaling", "resultater"), { recursive: true });
await writeFile(path.join(REPO, "maaling", "resultater", `readme-${dato}.md`), linjer.join("\n"));
console.log(`\n${ok} av ${funn.length} bestått.`);
process.exit(ok === funn.length ? 0 : 1);
