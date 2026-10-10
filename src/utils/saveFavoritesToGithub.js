export const saveFavoritesToGithub = async (password, filesChanges) => {
  const response = await fetch("/api/save-favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, filesChanges }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Save failed");
  }

  const entries = Object.entries(data.results || {});
  const failed = entries.filter(([, r]) => r.error);
  const updated = entries.filter(([, r]) => r.updated);

  if (entries.length > 0 && failed.length === entries.length) {
    throw new Error(
      `All files failed: ${failed.map(([f, r]) => `${f} (${r.error})`).join(", ")}`,
    );
  }
  if (failed.length > 0) {
    throw new Error(
      `${updated.length} saved, ${failed.length} failed: ${failed
        .map(([f]) => f)
        .join(", ")}`,
    );
  }

  return data;
};
