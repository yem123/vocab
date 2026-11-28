const GITHUB_API = "https://api.github.com";
const REPO = "yem123/vocab";
const BRANCH = "main";
const FILE_PATH = "src/data/myNotebook.js";

const gh = (url, options = {}) =>
  fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "vocab-app",
      ...(options.headers || {}),
    },
  });

const describe = async (res) => {
  const body = await res.json().catch(() => ({}));
  return `${res.status}: ${body.message || res.statusText || "error"}`;
};

const clip = (v, max) => String(v ?? "").slice(0, max);

function cleanNote(n) {
  if (!n || typeof n.id !== "string" || !n.id || n.id.length > 60) return null;
  const text = clip(n.text, 2000).trim();
  if (!text) return null;
  const now = new Date().toISOString();
  return {
    id: n.id,
    text,
    translation: clip(n.translation, 2000).trim(),
    pinned: Boolean(n.pinned),
    createdAt: clip(n.createdAt || now, 40),
    updatedAt: clip(n.updatedAt || now, 40),
  };
}

function parseNotes(text) {
  const start = text.indexOf("[", Math.max(0, text.indexOf("MY_NOTEBOOK")));
  const end = text.lastIndexOf("]");
  if (start === -1 || end < start) return [];
  const arr = JSON.parse(text.slice(start, end + 1));
  return Array.isArray(arr) ? arr : [];
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { password, notes, deletedIds } = req.body || {};

    if (!process.env.GITHUB_TOKEN) {
      return res.status(500).json({ error: "Server is missing GITHUB_TOKEN." });
    }
    if (!process.env.SAVE_PASSWORD || password !== process.env.SAVE_PASSWORD) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    const incoming = Array.isArray(notes) ? notes : [];
    const removed = Array.isArray(deletedIds) ? deletedIds : [];
    if (incoming.length + removed.length === 0) {
      return res.status(400).json({ error: "No notes provided" });
    }
    if (incoming.length > 500 || removed.length > 500) {
      return res.status(400).json({ error: "Too many notes in one request" });
    }

    const url = `${GITHUB_API}/repos/${REPO}/contents/${FILE_PATH}`;
    let currentText = "";
    let sha;

    const getRes = await gh(`${url}?ref=${BRANCH}`);
    if (getRes.ok) {
      const file = await getRes.json();
      sha = file.sha;
      if (file.encoding === "base64" && file.content) {
        currentText = Buffer.from(file.content, "base64").toString("utf-8");
      } else {
        // Files over 1 MB come back without content, so read the raw text
        const rawRes = await gh(`${url}?ref=${BRANCH}`, {
          headers: { Accept: "application/vnd.github.raw+json" },
        });
        if (!rawRes.ok) {
          return res
            .status(502)
            .json({
              error: `Could not read notebook (${await describe(rawRes)})`,
            });
        }
        currentText = await rawRes.text();
      }
    } else if (getRes.status !== 404) {
      return res
        .status(502)
        .json({ error: `Could not reach GitHub (${await describe(getRes)})` });
    }

    let existing;
    try {
      existing = currentText ? parseNotes(currentText) : [];
    } catch {
      return res
        .status(500)
        .json({ error: "Could not read the notebook file" });
    }

    // Merge by id: the newer change wins; deletions remove the note
    const map = new Map(existing.map((n) => [n.id, n]));
    incoming.forEach((raw) => {
      const n = cleanNote(raw);
      if (!n) return;
      const cur = map.get(n.id);
      if (!cur || (n.updatedAt || "") >= (cur.updatedAt || ""))
        map.set(n.id, n);
    });
    removed.forEach((id) => map.delete(String(id)));

    const list = [...map.values()].sort((a, b) =>
      String(b.createdAt).localeCompare(String(a.createdAt)),
    );
    const updatedText =
      `// Managed by the app's Notizbuch. Do not edit by hand.\n` +
      `export const MY_NOTEBOOK = ${JSON.stringify(list, null, 2)};\n`;

    if (updatedText === currentText) {
      return res
        .status(200)
        .json({ success: true, unchanged: true, count: list.length });
    }

    const putRes = await gh(url, {
      method: "PUT",
      body: JSON.stringify({
        message: `Update notebook (${list.length} notes)`,
        content: Buffer.from(updatedText, "utf-8").toString("base64"),
        branch: BRANCH,
        ...(sha ? { sha } : {}),
      }),
    });
    if (!putRes.ok) {
      return res
        .status(502)
        .json({
          error: `Could not save to GitHub (${await describe(putRes)})`,
        });
    }

    return res
      .status(200)
      .json({ success: true, updated: true, count: list.length });
  } catch (e) {
    console.error("save-notes error:", e);
    return res
      .status(500)
      .json({ error: e.message || "Unexpected server error." });
  }
}
