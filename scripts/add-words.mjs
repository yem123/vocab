// Usage: node add-words.mjs A2_Vocabulary.js [new-words.txt] [output.js]
// 1) Skips words that are already in your file.
// 2) Appends the new words with fresh ids (max id + 1, ...).
// 3) Gives new words (and a few existing ones) a `family`, but ONLY when the
//    family ends up with at least 2 members in the final file.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const si = argv.indexOf("--start");
const startOverride = si >= 0 ? parseInt(argv[si + 1], 10) : null;
if (si >= 0) argv.splice(si, 2);
const [inFile, wordsFile = path.join(here, "new-words.txt"), outFile = inFile.replace(/\.js$/, ".merged.js")] = argv;
if (!inFile) { console.error("Usage: node add-words.mjs A2_Vocabulary.js [new-words.txt] [output.js] [--start 2085]"); process.exit(1); }

const THEMA = { A:"Arbeit", B:"Berufe", C:"Kommunikation", D:"Alltag", E:"Essen und Trinken", F:"Freizeit", G:"Gesundheit",
  I:"Eigenschaften", J:"Geografie", K:"Kleidung", L:"Gefühle", M:"Medien", N:"Natur", O:"Orte", P:"Menschen", Q:"Finanzen",
  R:"Reisen & Verkehr", S:"Schule", T:"Technik", U:"Kultur", V:"Verwaltung", W:"Wohnen", X:"Grammatik", Y:"Familie", Z:"Zeit" };
const PRIO = { H: "High", M: "Medium", L: "Low" };

// Existing words (normalized) that should join a family together with the new words.
const JOIN = {
  "prüfen":"prüfen","Beschreibung":"schreiben","nachfragen":"fragen","Haltestelle":"halten","aussteigen":"steigen",
  "umsteigen":"steigen","Einstieg":"steigen","umziehen":"ziehen","auswählen":"wählen","Wiederholung":"wiederholen",
  "einsammeln":"sammeln","reparieren":"reparieren","Organisation":"organisieren","Fotografie":"das Foto",
  "Festnetz-Telefon":"das Telefon","Musical":"die Musik","technisch":"die Technik","unglaublich":"glauben",
  "erleben":"leben","verliebt sein":"verlieben","Vokabeltrainer":"trainieren","Lernplattform":"lernen",
  "wünschen":"wünschen","zum Glück":"das Glück","anfangen":"anfangen","Bescheid sagen":"sagen",
  "Gruppengröße":"die Gruppe","Aufenthaltserlaubnis":"erlauben","Zeitdruck":"die Zeit","Zeitschrift":"die Zeit",
  "frei haben":"frei","stressig":"der Stress","Parkplatz":"parken","Schwimmen":"schwimmen","lustig":"die Lust",
  "Ausdruck":"drucken","Familienbetrieb":"die Familie","Wasserleitung":"das Wasser","Eissalon":"das Eis",
  "Brieftasche":"der Brief","Bankkarte":"die Karte","hoffen":"hoffen","Heiratsurkunde":"heiraten","früh":"früh",
  "Besprechung":"sprechen","Bericht":"berichten","Fahrzeugpapiere":"fahren","Schulzeit":"die Schule",
};

// ---- normalisation (case-sensitive so "essen" != "Essen") ----
function parts(word) {
  let w = word.split(",")[0].replace(/\((Sg|Pl)\.?\)/g, "").trim();
  return w.split(/\s*(?:<>|\/)\s*/).map((p) => p.trim()).filter(Boolean).map((p) => {
    const m = p.match(/^(der|die|das)\s+(.*)$/);
    return m ? { art: m[1], base: m[2].replace(/^sich\s+/, "") } : { art: null, base: p.replace(/^sich\s+/, "") };
  });
}
const same = (a, b) => a.base === b.base && (a.art === b.art || !a.art || !b.art);
const isDup = (word, list) => parts(word).some((p) => list.some((q) => same(p, q)));

// ---- read existing file (handles Windows \r\n line endings) ----
const raw = fs.readFileSync(inFile, "utf8");
const crlf = raw.includes("\r\n");
const src = raw.replace(/\r\n/g, "\n");
const blocks = src.split(/(?=\n[ \t]*\{[ \t]*\n[ \t]*id:[ \t]*\d+,)/);
const existing = []; // {id, word, family}
for (const b of blocks) {
  const m = b.match(/\n[ \t]*id:[ \t]*(\d+),\s*\n[ \t]*word:[ \t]*"((?:[^"\\]|\\.)*)"/);
  if (!m) continue;
  const f = b.match(/\n[ \t]*family:[ \t]*"((?:[^"\\]|\\.)*)",/);
  existing.push({ id: +m[1], word: m[2], family: f ? f[1] : null });
}
if (existing.length === 0) {
  console.error("ERROR: no entries found in " + inFile + ". Is it the right file / format? Nothing was written.");
  process.exit(1);
}
const existingParts = existing.flatMap((e) => parts(e.word));
const maxId = Math.max(...existing.map((e) => e.id));
let nextId = startOverride ?? maxId + 1;
if (!Number.isInteger(nextId) || nextId <= maxId) {
  console.error(`ERROR: start id ${nextId} must be an integer greater than the highest existing id (${maxId}).`);
  process.exit(1);
}
const ind = (src.match(/\n([ \t]*)\{[ \t]*\n([ \t]*)id:/) || [, "  ", "    "]);
const I1 = ind[1], I2 = ind[2];

// ---- read new words ----
const rows = fs.readFileSync(wordsFile, "utf8").split(/\r?\n/).filter((l) => l.trim() && !l.startsWith("#"));
const added = [], skipped = [], seenParts = [];
for (const line of rows) {
  const [word, translation, definition, example, exampleTranslation, th, pr, family = ""] = line.split("|");
  if (!THEMA[th] || !PRIO[pr]) { console.warn(`WARN bad code in: ${line.slice(0, 60)}`); continue; }
  if (isDup(word, existingParts) || isDup(word, seenParts)) { skipped.push(word); continue; }
  seenParts.push(...parts(word));
  added.push({ word, translation, definition, example, exampleTranslation, thema: THEMA[th], priority: PRIO[pr], family: family.trim() });
}

// ---- family bookkeeping: only keep families with >= 2 members ----
const count = new Map();
const bump = (f) => f && count.set(f, (count.get(f) || 0) + 1);
existing.forEach((e) => bump(e.family));
const joins = new Map(); // existing id -> family
for (const e of existing) {
  if (e.family) continue;
  const key = Object.keys(JOIN).find((k) => parts(k).some((p) => parts(e.word).some((q) => p.base === q.base && p.art === q.art)));
  if (key) { joins.set(e.id, JOIN[key]); bump(JOIN[key]); }
}
added.forEach((a) => bump(a.family));
const ok = (f) => f && count.get(f) >= 2;
let dropped = new Set();
for (const a of added) if (a.family && !ok(a.family)) { dropped.add(a.family); a.family = ""; }
for (const [id, f] of [...joins]) if (!ok(f)) joins.delete(id);

// ---- write ----
const out = blocks.map((b) => {
  const m = b.match(/\n[ \t]*id:[ \t]*(\d+),/);
  if (!m || !joins.has(+m[1])) return b;
  return b.replace(/(\n([ \t]*)level:[ \t]*"[^"]*",)/, (_, a, i) => `${a}\n${i}family: ${JSON.stringify(joins.get(+m[1]))},`);
}).join("");

const q = JSON.stringify;
const text = added.map((a) => {
  const lines = [`${I1}{`, `${I2}id: ${nextId++},`, `${I2}word: ${q(a.word)},`, `${I2}translation: ${q(a.translation)},`,
    `${I2}definition: ${q(a.definition)},`, `${I2}example: ${q(a.example)},`, `${I2}exampleTranslation: ${q(a.exampleTranslation)},`,
    `${I2}thema: ${q(a.thema)},`, `${I2}priority: ${q(a.priority)},`, `${I2}favorite: false,`, `${I2}level: "A2",`];
  if (a.family) lines.push(`${I2}family: ${q(a.family)},`);
  lines.push(`${I1}},`);
  return lines.join("\n");
}).join("\n");

const end = out.lastIndexOf("];");
if (end < 0) { console.error("Could not find the closing ]; of the array."); process.exit(1); }
let result = out.slice(0, end).replace(/\s*$/, "\n") + text + "\n" + out.slice(end);
if (crlf) result = result.replace(/\n/g, "\r\n");
fs.writeFileSync(outFile, result);

console.log(`Existing words: ${existing.length}`);
console.log(`Added: ${added.length}  (ids ${nextId - added.length}–${nextId - 1})`);
console.log(`Skipped (already in your file): ${skipped.length}`);
if (skipped.length) console.log("  " + skipped.join(", "));
console.log(`Existing words that joined a family: ${joins.size}`);
if (dropped.size) console.log(`Families dropped (only 1 member): ${[...dropped].join(", ")}`);
console.log(`-> ${outFile}`);
