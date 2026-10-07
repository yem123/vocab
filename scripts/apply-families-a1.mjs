// Usage: node apply-families-a1.mjs a1Vocabulary.js [output.js]
// Same idea as apply-families.mjs, but for the A1 file (ids refer to the A1 file).
// Rewrites ONLY the `family` lines. Every entry in a group gets the exact same
// family string; entries not in any group get no family (so no 1-word groups).
import fs from "fs";

const GROUPS = {
  "anrufen": [228, 435, 1136],
  "antworten": [83, 89, 728],
  "bedienen": [275, 1216],
  "besuchen": [360, 1082],
  "bezahlen": [1175, 1390],
  "brauchen": [342, 944],
  "bringen": [276, 484],
  "checken": [764, 1141],
  "danken": [100, 929],
  "das Auge": [541, 542],
  "das Brot": [294, 316, 319, 344, 497],
  "das Buch": [183, 307, 1262],
  "das Essen": [299, 336, 482],
  "das Foto": [85, 339],
  "das Geld": [201, 349],
  "das Gespräch": [381, 818],
  "das Glück": [611, 683, 891, 892],
  "das Haus": [208, 402, 595, 1198],
  "das Herz": [856, 893, 1296],
  "das Jahr": [557, 752, 879, 902],
  "das Kilo": [465, 901],
  "das Kind": [163, 698, 1204],
  "das Land": [23, 68, 882],
  "das Meeting": [367, 372, 382],
  "das Rad": [87, 221, 747],
  "das Wasser": [287, 446],
  "das Zimmer": [617, 618, 719, 724],
  "der Abend": [4, 401, 721, 1386],
  "der Anfang": [11, 673],
  "der Architekt": [193, 575],
  "der Arzt": [596, 1053, 1055],
  "der Bahnhof": [261, 999],
  "der Ball": [81, 375, 715, 748, 1124],
  "der Bauch": [1079, 1314],
  "der Beruf": [151, 162, 869],
  "der Chat": [170, 712, 852],
  "der Computer": [218, 1280],
  "der Erzieher": [573, 1281],
  "der Freund": [259, 325, 341],
  "der Geburtstag": [894, 896],
  "der Gruß": [9, 269, 795],
  "der Ingenieur": [872, 873],
  "der Kaffee": [195, 641],
  "der Karneval": [799, 1340],
  "der Kuchen": [297, 314, 317, 897],
  "der Künstler": [757, 768],
  "der Kurs": [10, 128, 212, 340, 773, 787, 1110, 1111],
  "der Lehrer": [156, 770],
  "der Markt": [263, 443],
  "der Meter": [659, 885, 887],
  "der Mittag": [395, 397, 399],
  "der Morgen": [3, 331, 393],
  "der Name": [16, 42],
  "der Partner": [537, 539],
  "der Platz": [264, 600, 663, 685, 1197, 1374],
  "der Ring": [845, 1328],
  "der Saft": [285, 312, 1096],
  "der Salat": [460, 479, 480],
  "der Schauspieler": [157, 771],
  "der Sekretär": [880, 881],
  "der Sommer": [734, 904],
  "der Spaß": [48, 610],
  "der Sport": [368, 421, 736],
  "der Staat": [883, 890],
  "der Tag": [2, 377, 390],
  "der Techniker": [778, 780],
  "der Teil": [754, 870, 1064],
  "der Termin": [384, 385],
  "der Tisch": [189, 483, 629],
  "der Trainer": [1109, 1122, 1123],
  "der Vater": [510, 517],
  "der Zahn": [723, 1239],
  "Deutsch": [24, 135, 226, 580],
  "die Adresse": [44, 93],
  "die Aktivität": [428, 704, 1224],
  "die Arbeit": [149, 153, 270, 370, 502, 834, 1156, 1173, 1191],
  "die Eltern": [509, 516, 583],
  "die Familie": [17, 43, 558, 781],
  "die Fitness": [425, 1104],
  "die Geburt": [886, 888, 1330],
  "die Informatik": [152, 1170],
  "die Karte": [551, 749, 800, 803, 895, 1052, 1103, 1335],
  "die Kartoffel": [450, 1309],
  "die Konferenz": [383, 1183, 1184],
  "die Liste": [343, 1138],
  "die Lust": [669, 1116],
  "die Mail": [13, 371, 478, 861],
  "die Musik": [38, 1242],
  "die Mutter": [511, 519],
  "die Nacht": [403, 1158],
  "die Nase": [1068, 1098],
  "die Nummer": [46, 49, 50, 92],
  "die Olive": [346, 448],
  "die Pizza": [318, 412],
  "die Richtung": [1004, 1038],
  "die Schule": [159, 782, 786, 939, 942, 1203, 1207, 1209],
  "die Stadt": [33, 732, 739, 1027],
  "die Stunde": [415, 416, 776, 1359],
  "die Suppe": [320, 607],
  "die Tasche": [197, 203],
  "die Toilette": [625, 626, 627],
  "die Türkei": [30, 142],
  "die Uhr": [378, 379, 388],
  "die Woche": [350, 351, 352, 753],
  "die Wurst": [348, 445, 1307],
  "die Zeit": [391, 392, 750, 1361],
  "einladen": [430, 481],
  "England": [134, 923, 926, 937],
  "entschuldigen": [18, 324, 1090],
  "Europa": [789, 821, 931],
  "fahren": [406, 738, 756, 811, 961, 975, 986, 993, 996, 1223],
  "fliegen": [531, 760, 761, 762, 971],
  "fragen": [82, 1357],
  "frühstücken": [361, 373],
  "geben": [205, 935, 1236, 1276],
  "gehen": [19, 209, 588, 1235],
  "halten": [400, 1018],
  "hoffen": [21, 1133],
  "Italien": [133, 579, 921, 932],
  "Japan": [1284, 1285],
  "kaufen": [309, 310, 432, 597, 1360],
  "kennen": [77, 716],
  "kommen": [35, 506, 717, 983, 1087],
  "kosten": [301, 777],
  "lernen": [126, 1213, 1263, 1273, 1274],
  "lesen": [71, 168],
  "lieben": [272, 543, 565, 843, 844, 1101],
  "machen": [102, 477, 591, 1013],
  "markieren": [76, 225],
  "nehmen": [507, 862, 1303, 1372],
  "normal": [1157, 1221],
  "öffnen": [424, 426],
  "Oktober": [917, 1346],
  "Polen": [26, 139, 581],
  "programmieren": [1144, 1212, 1282],
  "schauen": [707, 1140],
  "schließen": [427, 833],
  "schreiben": [51, 784, 1021, 1272],
  "schwimmen": [726, 924],
  "sehen": [247, 433, 584, 972],
  "Spanien": [25, 132],
  "spielen": [594, 601, 708, 848, 1292],
  "sprechen": [72, 73, 131, 1201, 1205],
  "stellen": [79, 202],
  "süß": [540, 612, 943],
  "Syrien": [29, 582],
  "tanzen": [365, 369],
  "treffen": [709, 731],
  "verabreden": [437, 743],
  "waschen": [217, 409, 638, 849],
  "Weihnachten": [1299, 1322, 1333, 1351, 1352],
  "willkommen": [1, 12],
  "wohnen": [36, 436, 666, 676, 1026],
  "zusammen": [166, 323],
};

const [inFile, outFile = inFile.replace(/\.js$/, ".families.js")] = process.argv.slice(2);
if (!inFile) { console.error("Usage: node apply-families.mjs input.js [output.js]"); process.exit(1); }

const idToFamily = new Map();
for (const [fam, ids] of Object.entries(GROUPS)) {
  if (ids.length < 2) console.warn(`WARN: group "${fam}" has only ${ids.length} member`);
  for (const id of ids) {
    if (idToFamily.has(id)) console.warn(`WARN: id ${id} is in two groups ("${idToFamily.get(id)}", "${fam}")`);
    idToFamily.set(id, fam);
  }
}

// handles Windows \r\n line endings and any indentation
const raw = fs.readFileSync(inFile, "utf8");
const crlf = raw.includes("\r\n");
const src = raw.replace(/\r\n/g, "\n");
const parts = src.split(/(?=\n[ \t]*\{[ \t]*\n[ \t]*id:[ \t]*\d+,)/);
const seen = new Set();

const out = parts.map((block) => {
  const m = block.match(/\n[ \t]*id:[ \t]*(\d+),/);
  if (!m || !/\n[ \t]*word:/.test(block)) return block;
  const id = Number(m[1]);
  seen.add(id);
  let b = block.replace(/\n[ \t]*family:[ \t]*"(?:[^"\\]|\\.)*",/, "");
  const fam = idToFamily.get(id);
  if (fam) b = b.replace(/(\n([ \t]*)level:[ \t]*"[^"]*",)/, (_, a, i) => `${a}\n${i}family: ${JSON.stringify(fam)},`);
  return b;
}).join("");

if (seen.size === 0) { console.error("ERROR: no entries found in " + inFile + ". Nothing was written."); process.exit(1); }
for (const id of idToFamily.keys()) if (!seen.has(id)) console.warn(`WARN: id ${id} not found in file`);

fs.writeFileSync(outFile, crlf ? out.replace(/\n/g, "\r\n") : out);
console.log(`Done. ${seen.size} entries read; ${idToFamily.size} words in ${Object.keys(GROUPS).length} families -> ${outFile}`);

const words = new Map();
for (const m of out.matchAll(/\n[ \t]*id:[ \t]*(\d+),\s*\n[ \t]*word:[ \t]*"([^"]*)"/g)) {
  (words.get(m[2]) || words.set(m[2], []).get(m[2])).push(m[1]);
}
for (const [w, ids] of words) if (ids.length > 1) console.log(`DUPLICATE word "${w}": ids ${ids.join(", ")}`);
