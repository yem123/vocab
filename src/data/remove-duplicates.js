// remove-duplicates.js
// Usage:  node remove-duplicates.js [duplicate_report.md]
//
// Reads "## 1. True duplicates" from the report, decides which entry of every
// group is KEPT, and writes A1-duplicate-remove.js, A2-..., B1-..., B2-...
// with the other entries removed. Nothing else in the files is touched
// (formatting, order, comments, other entries stay byte-identical).
//
// Keep rule per group:
//   1. lowest level wins (A1 < A2 < B1 < B2)
//   2. tie -> the longer `word` text wins (the fuller form, e.g. with plural / feminine)
//   3. tie -> the lower id wins
// Edit KEEP_RULE below if you prefer something else.

import fs from "node:fs";

const CONFIG = {
  A1: { input: "a1Vocabulary.js", output: "A1-duplicate-remove.js" },
  A2: { input: "a2Vocabulary.js", output: "A2-duplicate-remove.js" },
  B1: { input: "b1Vocabulary.js", output: "B1-duplicate-remove.js" },
  B2: { input: "b2Vocabulary.js", output: "B2-duplicate-remove.js" },
};
const REPORT = process.argv[2] || "duplicate_report.md";
const LEVEL_ORDER = { A1: 0, A2: 1, B1: 2, B2: 3 };

// returns negative if a should be kept over b
const KEEP_RULE = (a, b) =>
  LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level] ||
  b.word.length - a.word.length ||
  a.id - b.id;

// ---------- 1. read the report ----------
const report = fs.readFileSync(REPORT, "utf8").replace(/\r/g, "");
const start = report.indexOf("## 1.");
const end = report.indexOf("## 2.");
if (start < 0 || end < 0) throw new Error("Could not find sections '## 1.' and '## 2.' in " + REPORT);
const section = report.slice(start, end);

const ENTRY = /\b(A1|A2|B1|B2) id (\d+): (.*?) \[(A1|A2|B1|B2)\](?= \| |\s+→)/g;
const toRemove = { A1: new Set(), A2: new Set(), B1: new Set(), B2: new Set() };
const keepers = new Set();
let groups = 0;

for (const line of section.split("\n")) {
  if (!line.startsWith("- ")) continue;
  const entries = [...line.matchAll(ENTRY)].map((m) => ({
    file: m[1], id: Number(m[2]), word: m[3], level: m[4],
  }));
  if (entries.length < 2) { console.warn("Skipped line (fewer than 2 entries):", line); continue; }
  groups++;
  entries.sort(KEEP_RULE);
  keepers.add(entries[0].file + ":" + entries[0].id);
  for (const e of entries.slice(1)) toRemove[e.file].add(e.id);
}
// safety: never remove an entry that is the keeper of another group
for (const f of Object.keys(toRemove))
  for (const id of [...toRemove[f]])
    if (keepers.has(f + ":" + id)) { console.warn(`Not removing ${f} id ${id} (it is kept in another group)`); toRemove[f].delete(id); }

console.log(`Groups read from report: ${groups}`);

// ---------- 2. remove the entries ----------
const BLOCK = /\n  \{\n([\s\S]*?)\n  \},/g; // one entry = 2-space "{ ... }," block
let totalRemoved = 0;

for (const [file, cfg] of Object.entries(CONFIG)) {
  const ids = toRemove[file];
  const text = fs.readFileSync(cfg.input, "utf8");
  const found = new Set();
  let total = 0;
  const result = text.replace(BLOCK, (whole, body) => {
    total++;
    const m = body.match(/^    id: (\d+),/m);
    const id = m ? Number(m[1]) : null;
    if (id !== null && ids.has(id)) { found.add(id); return ""; }
    return whole;
  });
  const missing = [...ids].filter((id) => !found.has(id));
  fs.writeFileSync(cfg.output, result, "utf8");
  totalRemoved += found.size;
  console.log(`${file}: ${total} entries -> ${total - found.size} (removed ${found.size}) -> ${cfg.output}`);
  if (missing.length) console.warn(`  ids listed in the report but NOT found in ${cfg.input}:`, missing.join(", "));
}
console.log("Total removed:", totalRemoved);
