// Usage: node sort-by-id.mjs a1Vocabulary.js [output.js]
// Sorts the entries by ascending id. Entries are moved as untouched text blocks,
// so formatting, CRLF line endings and every field stay exactly as they are.
// Without [output.js] the result goes to <input>.sorted.js
import fs from "fs";

const [inFile, outFile = inFile.replace(/\.js$/, ".sorted.js")] = process.argv.slice(2);
if (!inFile) { console.error("Usage: node sort-by-id.mjs input.js [output.js]"); process.exit(1); }

const raw = fs.readFileSync(inFile, "utf8");
const crlf = raw.includes("\r\n");
const src = raw.replace(/\r\n/g, "\n");

const parts = src.split(/(?=\n[ \t]*\{[ \t]*\n[ \t]*id:[ \t]*\d+,)/);
const head = parts[0];
const blocks = parts.slice(1);
if (blocks.length === 0) { console.error("ERROR: no entries found. Nothing was written."); process.exit(1); }

// the last block still carries the closing "];"
const tail = blocks[blocks.length - 1].match(/\n\];?\n*$/);
const foot = tail ? tail[0] : "\n];\n";
if (tail) blocks[blocks.length - 1] = blocks[blocks.length - 1].slice(0, tail.index);

const idOf = (b) => Number(b.match(/\n[ \t]*id:[ \t]*(\d+),/)[1]);
const sorted = [...blocks].sort((a, b) => idOf(a) - idOf(b));

const ids = sorted.map(idOf);
const dups = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dups.length) console.warn("WARN: duplicate ids:", [...new Set(dups)].join(", "));

let result = head + sorted.join("") + foot;
if (crlf) result = result.replace(/\n/g, "\r\n");
fs.writeFileSync(outFile, result);
console.log(`Sorted ${sorted.length} entries (ids ${ids[0]}–${ids[ids.length - 1]}) -> ${outFile}`);
