export const saveFavoritesToGithub = async (password, filesFavorites) => {
  const response = await fetch("/api/save-favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, filesFavorites }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Save failed");
  }
  return data;
};
