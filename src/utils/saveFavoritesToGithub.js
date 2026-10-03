export const saveFavoritesToGithub = async (password, words) => {
  const response = await fetch("/api/save-favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, words }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Save failed");
  }
  return data;
};
