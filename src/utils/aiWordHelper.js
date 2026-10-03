// Calls our backend, which holds the API key and talks to Claude
export const fetchWordDetails = async (word) => {
  const response = await fetch("/api/word-helper", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ word }),
  });

  if (!response.ok) {
    throw new Error("AI request failed");
  }
  return response.json();
};
