export const WORD_TYPES = ["Word", "Phrase"];

const LEADING_STRIP =
  /^(der|die|das|den|dem|des|ein|eine|einem|einen|sich|mit|in|im|auf|für|von|vom|vor|zu|zum|zur|bei|beim|nach|über|unter|zwischen|durch|um|an|am|aus|gegen|ohne|während|wegen)\s+/i;

const stripLeadingNoise = (text) => {
  let result = text.trim();
  let prev;
  do {
    prev = result;
    result = result.replace(LEADING_STRIP, "").trim();
  } while (result !== prev);
  return result;
};

const mainPart = (segment) => {
  const noParens = segment.replace(/\([^)]*\)/g, " ");
  return noParens.split(",")[0].trim();
};

const mergeCompoundTokens = (tokens) => {
  const merged = [];
  tokens.forEach((tok) => {
    const isLowercaseContinuation = merged.length > 0 && /^[a-zäöüß]/.test(tok);
    if (isLowercaseContinuation) {
      merged[merged.length - 1] += tok;
    } else {
      merged.push(tok);
    }
  });
  return merged;
};

const countRealWords = (segment) => {
  const cleaned = stripLeadingNoise(mainPart(segment));
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  return mergeCompoundTokens(tokens).length;
};

export const guessWordType = (text = "") => {
  const clean = text.trim();
  if (!clean) return "Word";

  const segments = clean
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);
  if (
    segments.length > 1 &&
    segments.every((seg) => countRealWords(seg) <= 1)
  ) {
    return "Word";
  }

  return countRealWords(clean) <= 1 ? "Word" : "Phrase";
};

export const getWordType = (item) =>
  WORD_TYPES.includes(item.type) ? item.type : guessWordType(item.word);
