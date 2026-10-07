// Usage: node renumber-ids.mjs input.js [output.js] [--start N] [--sort]
// Gives every entry a gap-free id: start, start+1, start+2, ...
//  --start N  first id (default: the smallest id currently in the file, so A1 stays at 1 and A2 at 1400)
//  --sort     sort by the OLD id first (default: keep the order the entries have in the file)
// Only the `id:` lines change. Also writes <output>.id-map.csv (old id -> new id).
import fs from "fs";

const argv = process.argv.slice(2);
const take = (flag, hasValue) => { const i = argv.indexOf(flag); if (i < 0) return null; const v = hasValue ? argv[i + 1] : true; argv.splice(i, hasValue ? 2 : 1); return v; };
const startArg = take("--start", true);
const doSort = take("--sort", false);
const [inFile, outFile = inFile.replace(/\.js$/, ".renumbered.js")] = argv;
if (!inFile) { console.error("Usage: node renumber-ids.mjs input.js [output.js] [--start N] [--sort]"); process.exit(1); }

const raw = fs.readFileSync(inFile, "utf8");
const crlf = raw.includes("\r\n");
const src = raw.replace(/\r\n/g, "\n");
const parts = src.split(/(?=\n[ \t]*\{[ \t]*\n[ \t]*id:[ \t]*\d+,)/);
const head = parts[0];
let blocks = parts.slice(1);
if (blocks.length === 0) { console.error("ERROR: no entries found. Nothing was written."); process.exit(1); }
const tail = blocks[blocks.length - 1].match(/\n\];?\n*$/);
const foot = tail ? tail[0] : "\n];\n";
if (tail) blocks[blocks.length - 1] = blocks[blocks.length - 1].slice(0, tail.index);

const idRe = /(\n[ \t]*id:[ \t]*)(\d+)(,)/;
const oldId = (b) => Number(b.match(idRe)[2]);
if (doSort) blocks = [...blocks].sort((a, b) => oldId(a) - oldId(b));

const start = startArg !== null ? parseInt(startArg, 10) : Math.min(...blocks.map(oldId));
if (!Number.isInteger(start) || start < 0) { console.error("ERROR: --start must be a non-negative integer."); process.exit(1); }

const map = ["old_id,new_id"];
const out = blocks.map((b, i) => {
  const o = oldId(b), n = start + i;
  map.push(`${o},${n}`);
  return b.replace(idRe, (_, a, __, c) => `${a}${n}${c}`);
});

let result = head + out.join("") + foot;
if (crlf) result = result.replace(/\n/g, "\r\n");
fs.writeFileSync(outFile, result);
fs.writeFileSync(outFile.replace(/\.js$/, "") + ".id-map.csv", map.join("\n") + "\n");
console.log(`Renumbered ${out.length} entries: ${start}–${start + out.length - 1} -> ${outFile}`);
if (start === 1 && start + out.length - 1 >= 1400) console.warn("NOTE: ids now reach 1400 or higher, which overlaps your A2 range.");
