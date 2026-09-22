// Saves vocabulary + themes as a JSON file the user can keep anywhere
export const exportBackup = (vocabulary, themes) => {
  const payload = {
    app: "lexis_german_vocab",
    version: 1,
    exportedAt: new Date().toISOString(),
    vocabulary,
    themes,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `german-vocabulary-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Reads and validates a backup file's text. Throws a readable error if invalid.
export const parseBackup = (text) => {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Die Datei ist keine gültige JSON-Datei.");
  }

  // Accept our backup format, or a plain array of words
  const list = Array.isArray(data) ? data : data?.vocabulary;
  if (!Array.isArray(list)) {
    throw new Error("Keine Vokabeln in der Datei gefunden.");
  }

  const vocabulary = list
    .filter(
      (w) =>
        w &&
        typeof w.word === "string" &&
        w.word.trim() &&
        typeof w.translation === "string" &&
        w.translation.trim(),
    )
    .map((w) => {
      const word = w.word.trim();
      return {
        id: w.id,
        word,
        translation: w.translation.trim(),
        definition:
          typeof w.definition === "string" && w.definition
            ? w.definition
            : "Keine deutsche Definition hinterlegt.",
        example:
          typeof w.example === "string" && w.example
            ? w.example
            : `„Ein wunderbares Beispiel für ${word}.“`,
        exampleTranslation:
          typeof w.exampleTranslation === "string" && w.exampleTranslation
            ? w.exampleTranslation
            : "English translation of study example.",
        thema:
          typeof w.thema === "string" && w.thema.trim()
            ? w.thema.trim()
            : "Ohne Thema",
        priority: ["High", "Medium", "Low"].includes(w.priority)
          ? w.priority
          : "High",
        level: ["Basic", "Intermediate", "Advanced"].includes(w.level)
          ? w.level
          : "",
        favorite: Boolean(w.favorite),
      };
    });

  if (vocabulary.length === 0) {
    throw new Error("Die Datei enthält keine gültigen Wörter.");
  }

  const themes = Array.isArray(data?.themes)
    ? data.themes
        .filter((t) => typeof t === "string" && t.trim())
        .map((t) => t.trim())
    : [];

  return { vocabulary, themes };
};
