export const WORD_TYPES = ["Word", "Phrase", "Sentence"];

// Guess for words that have no saved type (older or imported words)
export const guessWordType = (text = "") => {
  const clean = text.trim();
  // Ignore a leading article or "sich", so "die Speisekarte" counts as one word
  const core = clean.replace(/^(der|die|das|ein|eine|sich)\s+/i, "");
  const count = core.split(/\s+/).filter(Boolean).length;
  if (count <= 1) return "Word";
  if (count >= 5 || /[.!]$/.test(clean)) return "Sentence";
  return "Phrase";
};

// Saved type if there is one, otherwise the guess
export const getWordType = (item) =>
  WORD_TYPES.includes(item.type) ? item.type : guessWordType(item.word);
