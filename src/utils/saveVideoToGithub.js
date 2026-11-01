export const saveVideoToGithub = async (password, url, duration) => {
  const response = await fetch("/api/save-video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, url, duration }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Could not add video");
  return data.video;
};
