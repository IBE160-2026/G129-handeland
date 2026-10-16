/**
 * Lager testfilene for PDF-feiltilstandene i FR-4, til testdata/pdf/.
 *
 *   node opplasting/lag-testfiler.mjs
 *
 * FR-4 krever en reproduserbar test med tilhørende testfil i repoet for hver
 * feiltilstand. Filene lages av dette skriptet framfor å hentes et sted fra,
 * så de er fri for opphavsrett og kan lages på nytt. Filene committes.
 *
 * To feiltilstander har ingen fil, og det er bevisst:
 *   - PF-5 for STØRRELSE testes med en etterligning av en fil på over 10 MB,
 *     så repoet ikke bærer 11 MB søppel. PF-5 for SIDETALL har en fil.
 *   - PF-7 (tidsavbrudd) testes med en pdfjs som aldri svarer. Ingen fil tar
 *     forutsigbart for lang tid.
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { deflateSync } from "node:zlib";
import { PDFDocument, PDFHexString, StandardFonts } from "pdf-lib";

function crc32(b) {
  let c = ~0;
  for (const x of b) {
    c ^= x;
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}
function bit(type, data) {
  const l = Buffer.alloc(4);
  l.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const c = Buffer.alloc(4);
  c.writeUInt32BE(crc32(td));
  return Buffer.concat([l, td, c]);
}
/** En gyldig, ensfarget PNG i gråtoner. */
function graaPng(w, h, graa = 200) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bitdybde
  ihdr[9] = 0; // gråtoner
  const rader = Buffer.alloc((w + 1) * h, graa);
  for (let y = 0; y < h; y++) rader[y * (w + 1)] = 0; // filtertype per rad
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), bit("IHDR", ihdr), bit("IDAT", deflateSync(rader)), bit("IEND", Buffer.alloc(0))]);
}

const UT = path.join(process.cwd(), "testdata", "pdf");
await mkdir(UT, { recursive: true });

const AVSNITT =
  "Celler deler seg for at kroppen skal vokse og reparere seg. Før delingen kopierer cellen arvestoffet sitt, " +
  "slik at begge de nye cellene får en fullstendig kopi. Prosessen er nøye styrt av kontrollpunkter underveis.";

/** Bryter en tekst i linjer på omtrent sidebredden. */
function linjer(tekst, bredde = 78) {
  const ut = [];
  let linje = "";
  for (const ord of tekst.split(" ")) {
    if ((linje + " " + ord).trim().length > bredde) {
      ut.push(linje.trim());
      linje = ord;
    } else linje += " " + ord;
  }
  if (linje.trim()) ut.push(linje.trim());
  return ut;
}

async function lagre(navn, doc) {
  await writeFile(path.join(UT, navn), await doc.save({ useObjectStreams: false }));
  console.log(`+ ${navn}`);
}

/* Vanlig fil: topptekst og sidetall på hver side, overskrifter, orddeling. */
{
  const doc = await PDFDocument.create();
  const f = await doc.embedFont(StandardFonts.Helvetica);
  const fb = await doc.embedFont(StandardFonts.HelveticaBold);
  for (let s = 1; s <= 3; s++) {
    const p = doc.addPage([595, 842]);
    p.drawText("Naturfag for videregående — kapittel 4", { x: 50, y: 810, size: 9, font: f });
    let y = 760;
    p.drawText(s === 1 ? "Celledeling" : s === 2 ? "Mitose" : "Når det går galt", { x: 50, y, size: 16, font: fb });
    y -= 30;
    const tekst =
      s === 2
        ? ["Under mitosen deles cellekjernen, og det gir to nye celler med samme informa-", "sjon som den gamle cellen hadde. Dette er KI-", "Assistert forklart."].concat(linjer(AVSNITT))
        : linjer(AVSNITT + " " + AVSNITT);
    for (const l of tekst) {
      p.drawText(l, { x: 50, y, size: 11, font: f });
      y -= 14;
    }
    y -= 20;
    for (const l of linjer(AVSNITT)) {
      p.drawText(l, { x: 50, y, size: 11, font: f });
      y -= 14;
    }
    p.drawText(`Side ${s}`, { x: 280, y: 30, size: 9, font: f });
  }
  await lagre("vanlig.pdf", doc);
}

/* PF-1: bare et bilde, ingen tekstlag. */
{
  const doc = await PDFDocument.create();
  // Et grått bilde, laget som en gyldig PNG. Den første utgaven brukte en
  // håndskrevet PNG som pdf-lib godtok, men som API-et avviste («Could not
  // process image») da bildeinnlesingen ble prøvd med den — så den var ugyldig.
  const png = graaPng(200, 280);
  const bilde = await doc.embedPng(png);
  for (let s = 0; s < 2; s++) doc.addPage([595, 842]).drawImage(bilde, { x: 0, y: 0, width: 595, height: 842 });
  await lagre("pf1-skannet.pdf", doc);
}

/* PF-2: krever passord. En krypteringsoppføring som ikke passer et tomt passord. */
{
  const doc = await PDFDocument.create();
  const f = await doc.embedFont(StandardFonts.Helvetica);
  doc.addPage().drawText("Denne teksten er låst.", { x: 50, y: 700, size: 12, font: f });
  const ctx = doc.context;
  ctx.trailerInfo.Encrypt = ctx.register(
    ctx.obj({ Filter: "Standard", V: 1, R: 2, O: PDFHexString.of("a".repeat(64)), U: PDFHexString.of("b".repeat(64)), P: -4 }),
  );
  const id = PDFHexString.of("0123456789abcdef0123456789abcdef");
  ctx.trailerInfo.ID = ctx.obj([id, id]);
  await lagre("pf2-passord.pdf", doc);
}

/* PF-3: ikke en PDF, og en PDF som er ødelagt. */
await writeFile(path.join(UT, "pf3-ikke-pdf.pdf"), "Dette er en tekstfil som har fått navnet .pdf.\n");
console.log("+ pf3-ikke-pdf.pdf");
await writeFile(path.join(UT, "pf3-oedelagt.pdf"), "%PDF-1.7\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R\n%% avbrutt midt i\n");
console.log("+ pf3-oedelagt.pdf");

/* PF-4: to spalter. Oppdages ikke automatisk — fanges av gjennomsynet. */
{
  const doc = await PDFDocument.create();
  const f = await doc.embedFont(StandardFonts.Helvetica);
  const p = doc.addPage([595, 842]);
  const venstre = linjer(AVSNITT + " " + AVSNITT, 40);
  const hoyre = linjer("Høyre spalte handler om noe annet. " + AVSNITT, 40);
  let y = 780;
  for (let i = 0; i < Math.max(venstre.length, hoyre.length); i++) {
    if (venstre[i]) p.drawText(venstre[i], { x: 40, y, size: 10, font: f });
    if (hoyre[i]) p.drawText(hoyre[i], { x: 310, y, size: 10, font: f });
    y -= 13;
  }
  await lagre("pf4-spalter.pdf", doc);
}

/* PF-5: flere sider enn grensen på 40. */
{
  const doc = await PDFDocument.create();
  const f = await doc.embedFont(StandardFonts.Helvetica);
  for (let s = 1; s <= 41; s++) doc.addPage([595, 842]).drawText(`Side ${s}. ${AVSNITT}`.slice(0, 90), { x: 40, y: 780, size: 10, font: f });
  await lagre("pf5-for-mange-sider.pdf", doc);
}

/* PF-6: tekst på hver side, men for lite til sammen (over 100 per side, under 400 totalt). */
{
  const doc = await PDFDocument.create();
  const f = await doc.embedFont(StandardFonts.Helvetica);
  const kort = "Denne siden har bare en kort setning om celler og deling, og ikke stort mer enn det på hele denne siden.";
  for (let s = 0; s < 3; s++) doc.addPage([595, 842]).drawText(`${kort} (${s + 1})`, { x: 40, y: 780, size: 10, font: f });
  await lagre("pf6-lite-tekst.pdf", doc);
}

console.log(`\nTestfilene ligger i ${path.relative(process.cwd(), UT)}.`);
