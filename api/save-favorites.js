const GITHUB_API = "https://api.github.com";
const BRANCH = "main";

// Splits an array literal's contents into top-level {...} object substrings.
function splitObjects(source) {
  const objects = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        objects.push({ start, end: i + 1, text: source.slice(start, i + 1) });
        start = -1;
      }
    }
  }
  return objects;
}

function setFavoriteInObject(objText, value) {
  if (/\bfavorite\s*:\s*(true|false)/.test(objText)) {
    return objText.replace(
      /\bfavorite\s*:\s*(true|false)/,
      `favorite: ${value}`,
    );
  }
  return objText.replace(/\{/, `{\n    favorite: ${value},`);
}

// Field order used when rewriting a fully edited word object
const FIELD_ORDER = [
  "id",
  "word",
  "translation",
  "definition",
  "definitionTranslation",
  "example",
  "exampleTranslation",
  "thema",
  "level",
  "type",
  "family",
  "priority",
  "favorite",
];

function serializeValue(v) {
  return JSON.stringify(v);
}

function serializeWordObject(word) {
  const lines = [];
  FIELD_ORDER.forEach((key) => {
    if (word[key] === undefined) return;
    lines.push(`    ${key}: ${serializeValue(word[key])},`);
  });
  // Include any extra fields not in the known list, so nothing is silently dropped
  Object.keys(word).forEach((key) => {
    if (!FIELD_ORDER.includes(key) && word[key] !== undefined) {
      lines.push(`    ${key}: ${serializeValue(word[key])},`);
    }
  });
  return `{\n${lines.join("\n")}\n  }`;
}

function applyChanges(
  fileText,
  { favoritedIds, editsById, deletedIds, additions },
) {
  const objects = splitObjects(fileText);
  let result = "";
  let cursor = 0;

  objects.forEach((obj) => {
    const idMatch = obj.text.match(/\bid\s*:\s*(\d+)/);
    const id = idMatch ? Number(idMatch[1]) : null;

    if (id !== null && deletedIds.has(id)) {
      result += fileText.slice(cursor, obj.start);
      cursor = obj.end;
      let skip = cursor;
      while (skip < fileText.length && /\s/.test(fileText[skip])) skip++;
      if (fileText[skip] === ",") cursor = skip + 1;
      return;
    }

    result += fileText.slice(cursor, obj.start);
    if (id !== null && editsById.has(id)) {
      result += serializeWordObject(editsById.get(id));
    } else if (id !== null) {
      result += setFavoriteInObject(obj.text, favoritedIds.has(id));
    } else {
      result += obj.text;
    }
    cursor = obj.end;
  });
  result += fileText.slice(cursor);

  if (additions && additions.length > 0) {
    const newEntries = additions
      .map((w) => "  " + serializeWordObject(w) + ",")
      .join("\n");
    // Insert before the closing `];` of the array
    result = result.replace(/\]\s*;?\s*$/, (match) => {
      const closer = match.trim().endsWith(";") ? "];" : "]";
      return `${newEntries}\n${closer}`;
    });
  }

  return result;
}

const githubHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "User-Agent": "vocab-app",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password, filesChanges } = req.body || {};

  if (!process.env.SAVE_PASSWORD || password !== process.env.SAVE_PASSWORD) {
    return res.status(401).json({ error: "Incorrect password" });
  }
  if (!filesChanges || typeof filesChanges !== "object") {
    return res.status(400).json({ error: "No changes provided" });
  }

  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const headers = githubHeaders(process.env.GITHUB_TOKEN);
  const results = {};

  try {
    for (const [filePath, changes] of Object.entries(filesChanges)) {
      const favoritedIds = new Set(changes.favoritedIds || []);
      const deletedIds = new Set(changes.deletedIds || []);
      const editsById = new Map((changes.edits || []).map((w) => [w.id, w]));
      const additions = changes.additions || [];

      const getRes = await fetch(
        `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}?ref=${BRANCH}`,
        { headers },
      );
      if (!getRes.ok) {
        const errText = await getRes.text();
        console.error(
          `GitHub GET error (${filePath}):`,
          getRes.status,
          errText,
        );
        results[filePath] = { error: "Could not fetch file" };
        continue;
      }
      const fileData = await getRes.json();
      const currentText = Buffer.from(fileData.content, "base64").toString(
        "utf-8",
      );

      const updatedText = applyChanges(currentText, {
        favoritedIds,
        editsById,
        deletedIds,
        additions,
      });

      if (updatedText === currentText) {
        results[filePath] = { unchanged: true };
        continue;
      }

      const putRes = await fetch(
        `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`,
        {
          method: "PUT",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Sync vocabulary changes in ${filePath}`,
            content: Buffer.from(updatedText, "utf-8").toString("base64"),
            branch: BRANCH,
            sha: fileData.sha,
          }),
        },
      );

      if (!putRes.ok) {
        const errText = await putRes.text();
        console.error(
          `GitHub PUT error (${filePath}):`,
          putRes.status,
          errText,
        );
        results[filePath] = { error: "Could not save file" };
        continue;
      }

      results[filePath] = { updated: true };
    }

    return res.status(200).json({ success: true, results });
  } catch (err) {
    console.error("save-favorites error:", err);
    return res.status(500).json({ error: "Unexpected error" });
  }
}
