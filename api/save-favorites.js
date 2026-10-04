const GITHUB_API = "https://api.github.com";
const BRANCH = "main";

// Splits an array literal's contents into top-level {...} object substrings.
// Naive brace-depth scan; assumes no unescaped `{`/`}` inside string values,
// which holds for this project's generated word-object files.
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

// Sets favorite: true/false inside one object's text, inserting the field
// if it isn't already there.
function setFavoriteInObject(objText, value) {
  if (/\bfavorite\s*:\s*(true|false)/.test(objText)) {
    return objText.replace(
      /\bfavorite\s*:\s*(true|false)/,
      `favorite: ${value}`,
    );
  }
  // No favorite field yet: insert right after the opening brace
  return objText.replace(/\{/, `{\n    favorite: ${value},`);
}

// Rewrites every word object's favorite flag in a file's full source text
function applyFavorites(fileText, favoritedIds) {
  const objects = splitObjects(fileText);
  let result = "";
  let cursor = 0;

  objects.forEach((obj) => {
    const idMatch = obj.text.match(/\bid\s*:\s*(\d+)/);
    result += fileText.slice(cursor, obj.start);
    if (idMatch) {
      const id = Number(idMatch[1]);
      result += setFavoriteInObject(obj.text, favoritedIds.has(id));
    } else {
      result += obj.text; // leave untouched if no id found
    }
    cursor = obj.end;
  });
  result += fileText.slice(cursor);
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

  const { password, filesFavorites } = req.body || {};

  if (!process.env.SAVE_PASSWORD || password !== process.env.SAVE_PASSWORD) {
    return res.status(401).json({ error: "Incorrect password" });
  }
  if (!filesFavorites || typeof filesFavorites !== "object") {
    return res.status(400).json({ error: "No favorites data provided" });
  }

  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const headers = githubHeaders(process.env.GITHUB_TOKEN);

  const results = {};

  try {
    for (const [filePath, ids] of Object.entries(filesFavorites)) {
      const favoritedIds = new Set(ids);

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

      const updatedText = applyFavorites(currentText, favoritedIds);

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
            message: `Update favorites in ${filePath}`,
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
