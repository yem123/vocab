const GITHUB_API = "https://api.github.com";
const BRANCH = "main";
const REPO = "yem123 / vocab";
const FILE_PATH = "src/data/videos.js";
const TEMPLATE = `// Managed by the app's "Add link" button. Do not edit by hand.
export const VIDEOS = [
];
`;

function extractVideoId(input = "") {
  const s = String(input).trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    const host = u.hostname.replace(/^(www\.|m\.)/, "");
    let id = null;
    if (host === "youtu.be") {
      id = u.pathname.slice(1).split("/")[0];
    } else if (
      host.endsWith("youtube.com") ||
      host.endsWith("youtube-nocookie.com")
    ) {
      id = u.searchParams.get("v");
      if (!id) {
        const m = u.pathname.match(/^\/(shorts|embed|live)\/([\w-]{11})/);
        if (m) id = m[2];
      }
    }
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password, url, duration } = req.body || {};
  if (!process.env.SAVE_PASSWORD || password !== process.env.SAVE_PASSWORD) {
    return res.status(401).json({ error: "Incorrect password" });
  }

  const id = extractVideoId(url);
  if (!id) return res.status(400).json({ error: "Not a valid YouTube link" });

  const cleanDuration = String(duration || "").trim();
  if (
    cleanDuration &&
    !/^(\d{1,2}:[0-5]\d:[0-5]\d|\d{1,3}:[0-5]\d)$/.test(cleanDuration)
  ) {
    return res
      .status(400)
      .json({ error: "Duration must look like 12:34 or 1:02:03" });
  }

  try {
    // Title + channel from YouTube's public oEmbed (no API key needed).
    // It also fails for deleted/private/non-embeddable videos.
    const oembed = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(
        `https://www.youtube.com/watch?v=${id}`,
      )}&format=json`,
    );
    if (!oembed.ok) {
      return res
        .status(400)
        .json({ error: "Video not found or cannot be embedded" });
    }
    const meta = await oembed.json();

    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "vocab-app",
    };
    const fileUrl = `${GITHUB_API}/repos/${REPO}/contents/${FILE_PATH}`;

    let text = TEMPLATE;
    let sha;
    const getRes = await fetch(`${fileUrl}?ref=${BRANCH}`, { headers });
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
      text = Buffer.from(data.content, "base64").toString("utf-8");
    } else if (getRes.status !== 404) {
      console.error("GitHub GET error:", getRes.status, await getRes.text());
      return res.status(502).json({ error: "Could not reach GitHub" });
    }

    if (text.includes(`"${id}"`)) {
      return res
        .status(409)
        .json({ error: "This video is already in the list" });
    }

    const video = {
      id,
      title: meta.title,
      channel: meta.author_name,
      addedAt: new Date().toISOString(),
    };
    const entry =
      `  {\n` +
      `    id: ${JSON.stringify(video.id)},\n` +
      `    title: ${JSON.stringify(video.title)},\n` +
      `    channel: ${JSON.stringify(video.channel)},\n` +
      `    addedAt: ${JSON.stringify(video.addedAt)},\n` +
      `  },\n`;

    const updated = text.replace(/\]\s*;?\s*$/, `${entry}];\n`);

    const putRes = await fetch(fileUrl, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Add video: ${video.title}`.slice(0, 200),
        content: Buffer.from(updated, "utf-8").toString("base64"),
        branch: BRANCH,
        ...(sha ? { sha } : {}),
      }),
    });
    if (!putRes.ok) {
      console.error("GitHub PUT error:", putRes.status, await putRes.text());
      return res.status(502).json({ error: "Could not save to GitHub" });
    }

    return res.status(200).json({ success: true, video });
  } catch (err) {
    console.error("save-video error:", err);
    return res.status(500).json({ error: "Unexpected error" });
  }
}
