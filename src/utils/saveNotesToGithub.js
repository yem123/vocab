export const saveNotesToGithub = async (password, { notes, deletedIds }) => {
  const response = await fetch("/api/save-notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, notes, deletedIds }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Could not save notes");
  return data;
};
