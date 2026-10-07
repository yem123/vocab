// Usage: node clean-families.mjs input.js [output.js] [--config families-config.json]
// Rebuilds the `family` field of a vocabulary file from scratch (A1/A2/B1/B2 files all work).
//  - Words that share a root (Kurs / Deutschkurs, kommen / bekommen, Arbeit / arbeiten ...) get the SAME family text.
//  - Labels follow your convention: nouns with article ("die Arbeit"), verbs as infinitive ("fahren").
//  - A family always has at least 2 members; an entry belongs to exactly one family.
//  - Everything except the `family` lines stays untouched (formatting, CRLF, order).
// Also writes <output>.families.txt: every group in readable form so you can review it.
// To fix wrong links: put the wrong word(s) into "exclude" of a config file and run again, or define a
// group yourself under "force". Config example:
//   { "exclude": ["die Kontrolle", "der Diesel"],
//     "force":   { "das Mittel": ["das Waschmittel", "das Schmerzmittel"] } }
// Words in "exclude"/"force" are written the way they appear in the file before the first comma.
import fs from "fs";

const args = process.argv.slice(2);
let cfgFile = null; const ci = args.indexOf("--config"); if (ci >= 0) { cfgFile = args[ci + 1]; args.splice(ci, 2); }
const [inFile, outArg] = args;
if (!inFile) { console.error("Usage: node clean-families.mjs input.js [output.js] [--config config.json]"); process.exit(1); }
const outFile = outArg || inFile.replace(/\.js$/, ".families.js");
const cfg = cfgFile ? JSON.parse(fs.readFileSync(cfgFile, "utf8")) : {};

// ---------- built-in false friends found while cleaning A1/B1 (edit freely) ----------
const BUILTIN_EXCLUDE = ["die Belegschaft","die Übertragung","der Lehrgang","verdrängen","einwandfrei","die Gleichberechtigung","die Verfassung","der Einwand","herrlich","der Brauch","die Kommode","der Kommentar","das Kostüm","besuchen","der Wahnsinn","der Sinn","die Software","die Ware","das Poster","der Euro","die Kontrolle","die Solaranlage","die Vorlage","die Warnblinkanlage","das Marketing","die Distanz","die Langeweile","der Zeuge","die Giraffe","der Diesel","das Sandwich","der Sattel","problemlos","stehlen","die Zigarette","das Streichholz","die Trennung","der Hausbesuch","die Untersuchung","der Versuch","die Erzählung","gründlich","merkwürdig","umsonst","umgehend","die Fernbedienung","der Studierende","die Bankleitzahl","der Automat","die Hochzeit","die Zeitung","die Anzeige","das Beispiel","das Tischtennis"];
const EXCLUDE = new Set([...BUILTIN_EXCLUDE, ...(cfg.exclude || [])]);
const FORCE = cfg.force || {};
const STOP = new Set("nach frei haben vor mit sein gut auf aus bei groß klein alt neu viel mehr alle alles etwas nicht nichts sehr hier dort dann wann wohin immer oft jetzt heute gern lang kurz wie ein eins zwei drei vier acht hund zehn fünf sieben neun hundert tausend zwanzig dreißig gerade weit weiter wieder über früh spät bisschen kennen normal etwa richtig".split(" "));
const PRE = ["ab","an","auf","aus","bei","ein","fest","her","hin","los","mit","nach","um","vor","weg","weiter","zu","zurück","zusammen","wieder","be","ent","er","ge","ver","über","unter","durch","vorbei","spazieren","kennen","dar","statt","teil","fern","frei","hoch","herunter","heraus","herein","hinein","hinaus","miss","zer","voraus","entgegen","kaputt"];
const RENAME = { "die Arbeiterin": "der Arbeiter", "die Botin": "der Bote", "die Täterin": "der Täter", "die Migrantin": "der Migrant", "die Trainerin": "der Trainer" };

// ---------- read file as blocks ----------
const raw = fs.readFileSync(inFile, "utf8");
const crlf = raw.includes("\r\n");
const src = raw.replace(/\r\n/g, "\n");
const parts = src.split(/(?=\n[ \t]*\{[ \t]*\n[ \t]*id:[ \t]*\d+,)/);
const head = parts[0]; let blocks = parts.slice(1);
const tail = blocks[blocks.length - 1].match(/\n\];?\n*$/);
const foot = tail ? tail[0] : "\n];\n";
if (tail) blocks[blocks.length - 1] = blocks[blocks.length - 1].slice(0, tail.index);
const wordOf = b => { const m = b.match(/\n[ \t]*word:[ \t]*(?:"((?:[^"\\]|\\.)*)"|'([^']*)')/); return JSON.parse('"' + (m[1] ?? m[2].replace(/"/g, '\\"')) + '"'); };
const idOf = b => Number(b.match(/\n[ \t]*id:[ \t]*(\d+),/)[1]);
const words = blocks.map(wordOf);
const key = w => w.split(",")[0].replace(/\s*\((?:Sg|Pl)\.?\)/, "").trim();
const K = words.map(key);

// ---------- tokens ----------
const toks = [];
words.forEach((w, i) => {
  let t = w.replace(/\((?:Sg|Pl)\.?\)/g, "").replace(/\b(der|die|das)\s*\/\s*(der|die|das)\s/g, "$1|$2 ");
  for (const seg of t.split(/\s*(?:\/|<>)\s*/)) {
    let first = seg.split(",")[0].replace(/\([^)]*\)/g, "").trim();
    first = first.replace(/^sich\s+/, "");
    const m = first.match(/^(der|die|das)(?:\|(?:der|die|das))?\s+(.*)$/);
    const art = m ? m[1] : null, base = m ? m[2] : first;
    if (!base) continue;
    const ws = base.split(" ");
    let core = art ? base : (ws.length > 1 ? (ws.find(x => /(en|ern|eln)$/.test(x) && x.length > 4) || null) : base);
    if (!core) continue;
    core = core.replace(/[^A-Za-zäöüÄÖÜß-]/g, "");
    if (core.length < 3) continue;
    toks.push({ i, core, lower: core.toLowerCase(), noun: !!art, art, verb: !art && /(en|ern|eln)$/.test(core) && core.length > 4 && /^[a-zäöüß]/.test(core) });
  }
});
const stem = t => t.verb ? t.lower.replace(/(eln|ern|en)$/, "") : t.lower;
function rel(x, y) {
  if (x.i === y.i || EXCLUDE.has(K[x.i]) || EXCLUDE.has(K[y.i])) return null;
  const xs = stem(x), yl = y.lower;
  if (STOP.has(x.lower) || STOP.has(xs)) return null;
  if (x.verb && y.verb && yl !== x.lower && yl.endsWith(x.lower) && PRE.includes(yl.slice(0, yl.length - x.lower.length))) return "prefix verb";
  if (xs.length >= 4 && yl.startsWith(xs) && yl.length > xs.length + 1) return "stem";
  if (xs.length >= 4 && yl === xs && x.verb !== y.verb) return "noun-verb";
  if (x.noun && y.noun && x.lower.length >= 4 && yl.length - x.lower.length >= 3 && yl.endsWith(x.lower)) return "compound";
  if (x.verb && xs.length >= 5 && y.noun && yl.length > xs.length + 2 && yl.includes(xs)) return "contained";
  return null;
}
// ---------- star groups: every word joins its biggest root ----------
const cand = new Map();
for (const y of toks) for (const x of toks) { const r = rel(x, y); if (r) (cand.get(y.i) || cand.set(y.i, []).get(y.i)).push({ x }); }
const size = new Map(); for (const [, c] of cand) for (const rt of new Set(c.map(z => z.x.i + ":" + z.x.lower))) size.set(rt, (size.get(rt) || 0) + 1);
const assign = new Map();
for (const [yi, c] of cand) { c.sort((a, b) => (size.get(b.x.i + ":" + b.x.lower) - size.get(a.x.i + ":" + a.x.lower)) || (b.x.lower.length - a.x.lower.length)); assign.set(yi, c[0].x); }
const rootIdx = new Set([...assign.values()].map(x => x.i));
for (const yi of [...assign.keys()]) if (rootIdx.has(yi) && assign.get(yi).i !== yi) { if ([...assign.entries()].some(([k, x]) => x.i === yi && k !== yi)) assign.delete(yi); }
const label = t => t.noun ? `${t.art} ${t.core}` : t.core;
const groups = new Map();
for (const [yi, rt] of assign) { const L = RENAME[label(rt)] || label(rt); (groups.get(L) || groups.set(L, new Set()).get(L)).add(yi).add(rt.i); }
// ---------- forced groups from config ----------
const byKey = new Map(); K.forEach((k, i) => (byKey.get(k) || byKey.set(k, []).get(k)).push(i));
const warn = [];
for (const [L, keys] of Object.entries(FORCE)) {
  const set = new Set();
  for (const k of keys) { const ix = byKey.get(k); if (!ix) { warn.push(`force "${L}": word not found: ${k}`); continue; } ix.forEach(i => set.add(i)); }
  for (const g of groups.values()) for (const i of set) g.delete(i);
  (groups.get(L) || groups.set(L, new Set()).get(L)); set.forEach(i => groups.get(L).add(i));
}
// ---------- final groups ----------
const final = [], owner = new Map();
for (const [L, set] of groups) { const mem = [...set].filter(i => !EXCLUDE.has(K[i]) || Object.values(FORCE).some(a => a.includes(K[i]))); if (mem.length < 2 || new Set(mem.map(i => K[i])).size < 2) continue; final.push([L, mem]); }
final.sort((a, b) => a[0].localeCompare(b[0], "de"));
for (const [L, mem] of final) for (const i of mem) { if (owner.has(i)) warn.push(`"${K[i]}" is in both "${owner.get(i)}" and "${L}" (kept the first)`); else owner.set(i, L); }
// ---------- write ----------
const dropFamily = t => t.replace(/\n[ \t]*family:[ \t]*(?:"(?:[^"\\]|\\.)*"|'[^'\n]*'),/, "");
const out = blocks.map((b, i) => {
  b = dropFamily(b); const L = owner.get(i); if (!L) return b;
  return b.replace(/(\n([ \t]*)level:[ \t]*"[^"]*",)/, (m, a, ind) => `${a}\n${ind}family: ${JSON.stringify(L)},`);
});
let result = head + out.join("") + foot; if (crlf) result = result.replace(/\n/g, "\r\n");
fs.writeFileSync(outFile, result);
const report = final.map(([L, mem]) => `${L} :: ${mem.map(i => K[i]).join(" | ")}`).join("\n") + (warn.length ? "\n\nWARNINGS\n" + warn.join("\n") : "") + "\n";
fs.writeFileSync(outFile.replace(/\.js$/, "") + ".families.txt", report);
console.log(`${blocks.length} entries -> ${final.length} families covering ${owner.size} words`);
console.log(`Written: ${outFile}\nReview the groups in: ${outFile.replace(/\.js$/, "")}.families.txt`);
if (warn.length) console.log(`${warn.length} warning(s), see the report.`);
