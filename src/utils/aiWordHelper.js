export const fetchWordDetails = async (word, password) => {
  const response = await fetch("/api/word-helper", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ word, password }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "AI request failed");
  }

  return response.json();
};
