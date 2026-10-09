export const WORD_TYPES = ["Word", "Phrase"];

// Saved type if there is one, otherwise the guess
export const getWordType = (item) => {
  const saved = (item.type || "").trim();
  const match = WORD_TYPES.find((t) => t.toLowerCase() === saved.toLowerCase());
  return match || "Word";
};
