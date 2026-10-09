import React, { useState, useEffect, useMemo } from "react";

import { A1_Vocabulary } from "./data/a1Vocabulary";
import { A2_Vocabulary } from "./data/a2Vocabulary";
import { B1_Vocabulary } from "./data/b1Vocabulary";
import { B2_Vocabulary } from "./data/b2Vocabulary";

import Header from "./components/layout/Header";
import BottomNav from "./components/layout/BottomNav";
import VocabularyScreen from "./components/screens/VocabularyScreen";
import ThemenScreen from "./components/screens/ThemenScreen";
import AddWordScreen from "./components/screens/AddWordScreen";
import DetailScreen from "./components/screens/DetailScreen";
import { fetchWordDetails } from "./utils/aiWordHelper";
import CollectionsScreen from "./components/screens/CollectionsScreen";
import { WORD_TYPES, getWordType } from "./utils/wordTypes";

const DEFAULT_THEMES = [
  "im Restaurant",
  "im Café",
  "beim Einkaufen",
  "beim Arzt",
  "im Beruf",
  "bei der Bank",
  "Reisen & Verkehr",
  "Wohnen",
  "Behörden & Post",
  "Alltag",
];

const SOURCE_FILES = [
  { path: "src/data/a1Vocabulary.js", words: A1_Vocabulary },
  { path: "src/data/a2Vocabulary.js", words: A2_Vocabulary },
  { path: "src/data/b1Vocabulary.js", words: B1_Vocabulary },
  { path: "src/data/b2Vocabulary.js", words: B2_Vocabulary },
];

const ALL_VOCABULARY = SOURCE_FILES.flatMap((f) => f.words).flat();

const BASE_MAX_ID = ALL_VOCABULARY.reduce(
  (max, w) => (typeof w.id === "number" && w.id > max ? w.id : max),
  0,
);

// id -> source file path, for ids that belong to a built-in word
const ID_TO_FILE = new Map();
SOURCE_FILES.forEach(({ path, words }) => {
  words.flat().forEach((w) => {
    if (typeof w.id === "number") ID_TO_FILE.set(w.id, path);
  });
});

const mergeVocabulary = (userLayer) => {
  const overrides = new Map();
  const deleted = new Set();
  const additions = [];

  userLayer.forEach((entry) => {
    if (entry.deleted) {
      deleted.add(entry.id);
    } else if (entry.id <= BASE_MAX_ID) {
      overrides.set(entry.id, entry);
    } else {
      additions.push(entry);
    }
  });

  const base = ALL_VOCABULARY.filter((w) => !deleted.has(w.id)).map(
    (w) => overrides.get(w.id) || w,
  );

  return [...additions, ...base];
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("vocabulary");
  const [formFamily, setFormFamily] = useState("");

  const [userVocabulary, setUserVocabulary] = useState(() => {
    try {
      const saved = localStorage.getItem("lexis_german_vocab_user");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const vocabulary = useMemo(
    () => mergeVocabulary(userVocabulary),
    [userVocabulary],
  );

  const [themes, setThemes] = useState(() => {
    try {
      const saved = localStorage.getItem("lexis_german_themes");
      return saved ? JSON.parse(saved) : DEFAULT_THEMES;
    } catch {
      return DEFAULT_THEMES;
    }
  });

  const [aiPassword, setAiPassword] = useState("");

  const [formCustomThema, setFormCustomThema] = useState("");

  const [selectedWordId, setSelectedWordId] = useState(1);
  const [selectedThemeFilter, setSelectedThemeFilter] = useState("All Words");
  const [searchQuery, setSearchQuery] = useState("");
  const [transitionAnim, setTransitionAnim] = useState("animate-fade-in");
  const [editingWordId, setEditingWordId] = useState(null);
  const [detailOrigin, setDetailOrigin] = useState("vocabulary");
  const [selectedLevelFilter, setSelectedLevelFilter] = useState("All Words");
  const [formLevel, setFormLevel] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All Types");
  const [formType, setFormType] = useState("");

  // Add word form state
  const [formThema, setFormThema] = useState("Alltag");
  const [formWord, setFormWord] = useState("");
  const [formTranslation, setFormTranslation] = useState("");
  const [formDefinition, setFormDefinition] = useState("");
  const [formExample, setFormExample] = useState("");
  const [formPriority, setFormPriority] = useState("High");

  const [formExampleTranslation, setFormExampleTranslation] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(
        "lexis_german_vocab_user",
        JSON.stringify(userVocabulary),
      );
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }, [userVocabulary]);

  useEffect(() => {
    try {
      localStorage.setItem("lexis_german_themes", JSON.stringify(themes));
    } catch (e) {
      console.error("Failed to save themes", e);
    }
  }, [themes]);

  const resetForm = () => {
    setFormThema("Alltag");
    setFormWord("");
    setFormTranslation("");
    setFormDefinition("");
    setFormExample("");
    setFormExampleTranslation("");
    setFormPriority("High");
    setFormLevel("");
    setFormType("");
    setFormCustomThema("");
    setFormFamily("");
  };

  const getFamilyMembers = (word) => {
    if (!word.family) return [];
    return vocabulary.filter(
      (w) => w.family === word.family && w.id !== word.id,
    );
  };

  const startEditWord = (word) => {
    const isPlaceholderDefinition =
      word.definition === "Keine deutsche Definition hinterlegt.";
    const isPlaceholderExample = (word.example || "").startsWith(
      "„Ein wunderbares Beispiel für ",
    );
    const isPlaceholderExampleTranslation =
      word.exampleTranslation === "English translation of study example.";

    setEditingWordId(word.id);
    if (themes.includes(word.thema)) {
      setFormThema(word.thema);
      setFormCustomThema("");
    } else {
      // Theme was removed from the list: keep it via the manual field
      setFormThema(themes[0] || "");
      setFormCustomThema(word.thema);
    }
    setFormWord(word.word);
    setFormTranslation(word.translation);
    setFormDefinition(isPlaceholderDefinition ? "" : word.definition || "");
    setFormExample(isPlaceholderExample ? "" : word.example || "");
    setFormExampleTranslation(
      isPlaceholderExampleTranslation ? "" : word.exampleTranslation || "",
    );

    setFormLevel(word.level || "");
    setFormType(getWordType(word));
    setFormPriority(word.priority || "High");
    navigateTo("add", "slide_up");
    setFormFamily(word.family || "");
  };

  // Opens the Vocabulary list filtered to one thema
  const openTheme = (name) => {
    setSelectedThemeFilter(name);
    setSelectedLevelFilter("All Words");
    setSelectedTypeFilter("All Types");
    setSearchQuery("");
    navigateTo("vocabulary", "push_back");
  };

  // Screen transition handler
  const navigateTo = (screen, anim = "push") => {
    if (screen !== "add" && editingWordId !== null) {
      setEditingWordId(null);
      resetForm();
    }
    if (
      screen === "detail" &&
      (currentScreen === "vocabulary" || currentScreen === "collections")
    ) {
      setDetailOrigin(currentScreen);
    }
    setTransitionAnim(
      anim === "slide_up" ? "animate-slide-up" : "animate-fade-in",
    );
    setTimeout(() => {
      setCurrentScreen(screen);
      setTransitionAnim("animate-fade-in");
    }, 120);
  };

  const activeWord = useMemo(() => {
    return vocabulary.find((w) => w.id === selectedWordId) || vocabulary[0];
  }, [vocabulary, selectedWordId]);

  const filteredVocabulary = useMemo(() => {
    return vocabulary.filter((item) => {
      const matchesSearch =
        (item.word || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.translation || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesLevel =
        selectedLevelFilter === "All Words" ||
        item.level === selectedLevelFilter;
      const matchesType =
        selectedTypeFilter === "All Types" ||
        getWordType(item) === selectedTypeFilter;
      if (!matchesSearch || !matchesLevel || !matchesType) return false;
      if (
        selectedThemeFilter === "All Words" ||
        selectedThemeFilter === "Alle Themen"
      )
        return true;
      return (
        (item.thema || "Ohne Thema").toLowerCase() ===
        selectedThemeFilter.toLowerCase()
      );
    });
  }, [
    vocabulary,
    searchQuery,
    selectedThemeFilter,
    selectedLevelFilter,
    selectedTypeFilter,
  ]);

  const favoriteVocabulary = useMemo(() => {
    return vocabulary.filter((w) => w.favorite);
  }, [vocabulary]);

  const handleAIFill = async (overwrite = false) => {
    if (!formWord.trim()) return;
    if (!aiPassword.trim()) {
      setAiError("Please enter the password first.");
      return;
    }
    setIsGenerating(true);
    setAiError("");
    try {
      const data = await fetchWordDetails(formWord.trim(), aiPassword.trim());
      const pick = (prev, next) => (overwrite || !prev.trim() ? next : prev);
      setFormTranslation((prev) => pick(prev, data.translation));
      setFormDefinition((prev) => pick(prev, data.definition));
      setFormExample((prev) => pick(prev, data.example));
      setFormExampleTranslation((prev) => pick(prev, data.exampleTranslation));
    } catch (err) {
      setAiError(
        err.message === "Incorrect password"
          ? "Incorrect password."
          : "Could not generate details. Check your connection and try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const getNextId = () => {
    const userIds = userVocabulary
      .map((w) => w.id)
      .filter((id) => typeof id === "number");
    const maxUser = userIds.length > 0 ? Math.max(...userIds) : BASE_MAX_ID;
    return Math.max(BASE_MAX_ID, maxUser) + 1;
  };

  // Merges an imported backup into the user layer (skips duplicate words,
  // matched against the full merged vocabulary)
  const handleImportBackup = ({
    vocabulary: imported,
    themes: importedThemes,
  }) => {
    const existingWords = new Set(
      vocabulary.map((w) => w.word.trim().toLowerCase()),
    );
    let nextId = getNextId();
    const newEntries = [];
    let skipped = 0;

    imported.forEach((w) => {
      const key = w.word.toLowerCase();
      if (existingWords.has(key)) {
        skipped++;
        return;
      }
      existingWords.add(key);
      newEntries.push({ ...w, id: nextId });
      nextId += 1;
    });

    setUserVocabulary([...newEntries, ...userVocabulary]);

    // Add any new themes from the file (ignoring upper/lower case)
    const newThemes = importedThemes.filter(
      (t) => !themes.some((x) => x.toLowerCase() === t.toLowerCase()),
    );
    if (newThemes.length > 0) setThemes([...themes, ...newThemes]);

    return { added: newEntries.length, skipped };
  };

  const handleSaveNewWord = (e) => {
    e.preventDefault();
    if (!formWord.trim() || !formTranslation.trim()) return;

    // Manual thema wins; it is added to the list only if it doesn't exist yet
    const typedThema = formCustomThema.trim();
    let finalThema = formThema || "Ohne Thema";
    if (typedThema) {
      const existing = themes.find(
        (t) => t.toLowerCase() === typedThema.toLowerCase(),
      );
      if (existing) {
        finalThema = existing;
      } else {
        finalThema = typedThema;
        setThemes([...themes, typedThema]);
      }
    }

    if (editingWordId !== null) {
      const original = vocabulary.find((w) => w.id === editingWordId);
      const updated = {
        ...original,
        word: formWord.trim(),
        translation: formTranslation.trim(),
        definition:
          formDefinition.trim() || "Keine deutsche Definition hinterlegt.",

        example:
          formExample.trim() ||
          `„Ein wunderbares Beispiel für ${formWord.trim()}.“`,
        exampleTranslation:
          formExampleTranslation.trim() ||
          "English translation of study example.",
        thema: finalThema,
        level: formLevel,
        type: formType,
        priority: formPriority,
        family: formFamily.trim() || undefined,
      };

      setUserVocabulary((prev) => {
        const exists = prev.some((w) => w.id === editingWordId);
        return exists
          ? prev.map((w) => (w.id === editingWordId ? updated : w))
          : [updated, ...prev];
      });

      setSelectedWordId(editingWordId);
      setEditingWordId(null);
      resetForm();
      navigateTo("detail", "push_back");
      return;
    }

    const newEntry = {
      id: getNextId(),
      word: formWord.trim(),
      translation: formTranslation.trim(),
      definition:
        formDefinition.trim() || "Keine deutsche Definition hinterlegt.",

      example:
        formExample.trim() ||
        `„Ein wunderbares Beispiel für ${formWord.trim()}.“`,
      exampleTranslation:
        formExampleTranslation.trim() ||
        "English translation of study example.",
      thema: finalThema,
      level: formLevel,
      type: formType,
      priority: formPriority,
      favorite: false,
      family: formFamily.trim() || undefined,
    };

    setUserVocabulary([newEntry, ...userVocabulary]);
    setFormWord("");
    setFormTranslation("");
    setFormDefinition("");
    setFormExample("");
    setFormCustomThema("");
    setFormExampleTranslation("");
    setFormLevel("");
    setFormType("");
    navigateTo("vocabulary", "push_back");
    setFormFamily("");
  };

  const toggleFavorite = (id, e) => {
    if (e) e.stopPropagation();
    const current = vocabulary.find((w) => w.id === id);
    if (!current) return;
    const updated = { ...current, favorite: !current.favorite };

    setUserVocabulary((prev) => {
      const exists = prev.some((w) => w.id === id);
      return exists
        ? prev.map((w) => (w.id === id ? updated : w))
        : [updated, ...prev];
    });
  };

  const deleteWord = (id, e) => {
    if (e) e.stopPropagation();
    if (!confirm("Möchten Sie dieses Wort wirklich löschen?")) return;

    setUserVocabulary((prev) => {
      const isBuiltIn = id <= BASE_MAX_ID;
      const withoutExisting = prev.filter((w) => w.id !== id);
      // Built-in words need a tombstone so the merge hides them;
      // user-added words can just be removed outright.
      return isBuiltIn
        ? [...withoutExisting, { id, deleted: true }]
        : withoutExisting;
    });
    navigateTo("vocabulary", "push_back");
  };

  const removeTheme = (name) => {
    if (
      !confirm(
        `Thema "${name}" entfernen? Bereits gespeicherte Wörter behalten ihr Thema.`,
      )
    )
      return;
    const remaining = themes.filter((t) => t !== name);
    setThemes(remaining);
    if (formThema === name) setFormThema(remaining[0] || "");
  };

  const cleanupSyncedFavorites = (savedIds) => {
    setUserVocabulary((prev) =>
      prev.filter((entry) => {
        if (entry.deleted) return true; // never touch deletion tombstones
        if (!savedIds.has(entry.id)) return true; // not part of this save

        const builtIn = BASE_VOCABULARY.find((w) => w.id === entry.id);
        if (!builtIn) return true; // not a built-in word, keep as-is

        // Compare entry to builtIn ignoring the favorite field; if everything
        // else matches, this override is now redundant and can be dropped.
        const { favorite: entryFav, ...entryRest } = entry;
        const { favorite: builtInFav, ...builtInRest } = builtIn;
        const isPureFavoriteDuplicate =
          JSON.stringify(entryRest) === JSON.stringify(builtInRest);

        return !isPureFavoriteDuplicate;
      }),
    );
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#2c302e] font-serif flex flex-col items-center justify-start selection:bg-[#8fa394]/30">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col relative border-x border-[#eae7e2]">
        {/* Global Header */}
        <Header />

        {/* Dynamic Screen Viewport */}
        <main
          className={`flex-1 flex flex-col pb-28 transition-all duration-200 ${transitionAnim}`}
        >
          {/* ================================================= */}
          {/* SCREEN 1: VOCABULARY LIST & SEARCH VIEW           */}
          {/* ================================================= */}
          {currentScreen === "vocabulary" && (
            <VocabularyScreen
              vocabulary={vocabulary}
              filteredVocabulary={filteredVocabulary}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedThemeFilter={selectedThemeFilter}
              setSelectedThemeFilter={setSelectedThemeFilter}
              setSelectedWordId={setSelectedWordId}
              navigateTo={navigateTo}
              themes={themes}
              handleImportBackup={handleImportBackup}
              selectedLevelFilter={selectedLevelFilter}
              setSelectedLevelFilter={setSelectedLevelFilter}
              selectedTypeFilter={selectedTypeFilter}
              setSelectedTypeFilter={setSelectedTypeFilter}
              toggleFavorite={toggleFavorite}
            />
          )}

          {/* ================================================= */}
          {/* SCREEN 2: THEMEN & COLLECTIONS                    */}
          {/* ================================================= */}
          {currentScreen === "themen" && (
            <ThemenScreen vocabulary={vocabulary} openTheme={openTheme} />
          )}

          {/* ================================================= */}
          {/* SCREEN: COLLECTIONS (FAVORITES)                   */}
          {/* ================================================= */}
          {currentScreen === "collections" && (
            <CollectionsScreen
              favoriteVocabulary={favoriteVocabulary}
              setSelectedWordId={setSelectedWordId}
              navigateTo={navigateTo}
              idToFile={ID_TO_FILE}
              cleanupSyncedFavorites={cleanupSyncedFavorites}
              toggleFavorite={toggleFavorite}
            />
          )}

          {/* ================================================= */}
          {/* SCREEN 3: ADD WORD SCREEN                         */}
          {/* ================================================= */}
          {currentScreen === "add" && (
            <AddWordScreen
              navigateTo={navigateTo}
              handleSaveNewWord={handleSaveNewWord}
              formThema={formThema}
              setFormThema={setFormThema}
              formWord={formWord}
              setFormWord={setFormWord}
              formTranslation={formTranslation}
              setFormTranslation={setFormTranslation}
              formDefinition={formDefinition}
              setFormDefinition={setFormDefinition}
              formExample={formExample}
              setFormExample={setFormExample}
              formExampleTranslation={formExampleTranslation}
              setFormExampleTranslation={setFormExampleTranslation}
              formPriority={formPriority}
              setFormPriority={setFormPriority}
              handleAIFill={handleAIFill}
              isGenerating={isGenerating}
              aiError={aiError}
              isEditing={editingWordId !== null}
              themes={themes}
              removeTheme={removeTheme}
              formCustomThema={formCustomThema}
              setFormCustomThema={setFormCustomThema}
              formLevel={formLevel}
              setFormLevel={setFormLevel}
              formType={formType}
              setFormType={setFormType}
              aiPassword={aiPassword}
              setAiPassword={setAiPassword}
              formFamily={formFamily}
              setFormFamily={setFormFamily}
            />
          )}

          {/* ================================================= */}
          {/* SCREEN 4: DETAIL CARD                             */}
          {/* ================================================= */}
          {currentScreen === "detail" && activeWord && (
            <DetailScreen
              activeWord={activeWord}
              vocabulary={vocabulary}
              navigateTo={navigateTo}
              toggleFavorite={toggleFavorite}
              deleteWord={deleteWord}
              setSelectedWordId={setSelectedWordId}
              editWord={startEditWord}
              detailOrigin={detailOrigin}
              getFamilyMembers={getFamilyMembers}
            />
          )}
        </main>

        {/* Global Bottom Navigation Bar */}
        <BottomNav
          currentScreen={currentScreen}
          navigateTo={navigateTo}
          vocabulary={vocabulary}
          setSelectedWordId={setSelectedWordId}
          detailOrigin={detailOrigin}
        />
      </div>
    </div>
  );
}
