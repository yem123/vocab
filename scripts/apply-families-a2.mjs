// Usage: node apply-families.js A2_Vocabulary.js [output.js]
// Rewrites ONLY the `family` lines. Every entry in a group gets the exact same
// family string; entries not in any group get no family (so no 1-word groups).
import fs from "fs";

const GROUPS = {
  "das Büro": [1400, 1446, 2005],
  "stellen": [1401, 1831, 2078, 1505, 1529],
  "die Arbeit": [1407, 1443, 2066],
  "sehen": [1408, 1701, 1706, 1816],
  "die Ordnung": [1409, 1968],
  "bilden": [1413, 1987],
  "stehen": [1419, 1493],
  "der Kaffee": [1425, 1483, 1861],
  "kommen": [1433, 1462, 1667],
  "der Chef": [1435, 1436],
  "das Team": [1437, 1438, 1439, 1969, 1981],
  "das Haus": [1441, 1442],
  "freuen": [1405, 1447],
  "der Freund": [1455, 1456],
  "kennen": [1406, 1465],
  "schreiben": [1458, 1492, 1693],
  "lesen": [1676, 1680],
  "führen": [1411, 1993],
  "fahren": [1471, 1472, 1613, 1592, 1739, 2022, 2035, 2040],
  "das Rad": [1616, 1617, 1618],
  "das Auto": [1670, 1672],
  "gehen": [1687, 1688, 1751],
  "die Bahn": [1601, 1603, 1604, 1606, 1608, 1694, 1752],
  "die Region": [1705, 1737],
  "der Regen": [1642, 1643, 1644, 1736],
  "der Schnee": [1645, 1646],
  "die Sonne": [1647, 1730],
  "der Wind": [1725, 1726],
  "die Wolke": [1723, 1724],
  "der Nebel": [1727, 1728],
  "das Wetter": [1639, 1732],
  "blitzen": [1733, 2039],
  "das Klima": [1668, 1633],
  "danken": [1431, 1666, 1747],
  "die Schule": [1692, 1762, 1767, 1768, 1770, 1771, 1772, 1787, 1792, 2017],
  "die Klasse": [1766, 1769],
  "die Eltern": [1544, 1765],
  "das Kind": [1565, 1697, 1773],
  "die Ferien": [1536, 1790, 1791],
  "erziehen": [1784, 1785],
  "betreuen": [1794, 1795],
  "der Imbiss": [1740, 1796],
  "sprechen": [1774, 1721, 1799, 1893, 2041],
  "das Wort": [1805, 1891],
  "die Taste": [1807, 1854],
  "das Buch": [1818, 1819, 1847, 2061],
  "mobil": [1629, 1689, 1821],
  "nerven": [1735, 1840],
  "laden": [1871, 1872],
  "schließen": [1451, 1868],
  "das Dach": [1900, 1901, 1915, 1916],
  "malen": [1902, 1903],
  "schneiden": [1511, 1904, 1905],
  "der Tisch": [1906, 1907, 1992, 1554],
  "elektrisch": [1908, 1909, 1921, 1923],
  "installieren": [1910, 1911, 1922],
  "legen": [1919, 2042],
  "neu": [1928, 1998, 1519],
  "der Beruf": [1931, 1932, 1957],
  "der Astronaut": [1933, 1934],
  "der Architekt": [1935, 1936],
  "die Chemie": [1937, 1938],
  "die Mechanik": [1939, 1940],
  "der Fußball": [1585, 1943],
  "privat": [1551, 1950, 1951],
  "schlagen": [1716, 1717, 1720, 1960],
  "treffen": [1507, 1966],
  "kreativ": [1970, 1978],
  "die Motivation": [1971, 1980],
  "selbstständig": [1973, 1979],
  "der Konditor": [1974, 1975],
  "bewerben": [1982, 1983],
  "hören": [1984, 1985],
  "restaurieren": [1986, 1999],
  "bauen": [1504, 1988],
  "die Stadt": [1714, 1991],
  "das Handwerk": [1897, 1898, 1899, 1995],
  "das Werk": [1557, 1560, 1864, 1863, 1997],
  "das Amt": [2000, 2003, 2004, 2007, 2008],
  "die Behörde": [2001, 2002, 2062, 2063],
  "der Antrag": [2010, 2011, 2012],
  "melden": [2013, 2014, 2015],
  "die Hygiene": [2018, 2019],
  "finden": [2020, 2051, 2052],
  "warten": [2026, 2027, 2028],
  "die Sache": [2029, 2030],
  "trinken": [1477, 2033],
  "die Bremse": [1621, 2034],
  "das Bußgeld": [2037, 2038],
  "besitzen": [2054, 2055],
  "halten": [1780, 2053, 2058],
  "reisen": [1880, 2059],
  "leiten": [1445, 1759, 1760],
  "üben": [1888, 2065],
  "die Leistung": [2068, 2069],
  "die Unterlage": [2070, 2071],
  "der Termin": [2072, 2073],
  "der Kurs": [1886, 2036],
  "der Tutor": [1889, 1890],
  "spannen": [1523, 1702],
  "stimmen": [1722, 1746],
  "fliegen": [1609, 1700],
  "der Verkehr": [1461, 1600, 2084],
  "reagieren": [1410, 1532],
  "der Einstand": [1469, 1470],
  "der Sport": [1530, 1583],
  "das Tennis": [1584, 1593],
  "die Pflanze": [1581, 1895],
  "die Anlage": [1920, 1811],
  "der Sänger": [1512, 1513],
  "der Koch": [1509, 1510],
  "der Friseur": [1547, 1548],
  "der Bürger": [1561, 1562, 1686],
  "der Senior": [1568, 1569],
  "der Optiker": [1912, 1913],
  "der Rollstuhl": [1630, 1690, 1691],
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
