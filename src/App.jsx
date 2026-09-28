import React, { useState, useEffect, useMemo } from "react";

import { INITIAL_VOCABULARY } from "./data/vocabularyData";

import Header from "./components/layout/Header";
import BottomNav from "./components/layout/BottomNav";
import VocabularyScreen from "./components/screens/VocabularyScreen";
import ThemenScreen from "./components/screens/ThemenScreen";
import AddWordScreen from "./components/screens/AddWordScreen";
import DetailScreen from "./components/screens/DetailScreen";
import { fetchWordDetails } from "./utils/aiWordHelper";
import CollectionsScreen from "./components/screens/CollectionsScreen";
import { WORD_TYPES, getWordType, guessWordType } from "./utils/wordTypes";

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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("vocabulary"); // 'vocabulary' | 'themen' | 'add' | 'detail' | 'collections'
  const [vocabulary, setVocabulary] = useState(() => {
    try {
      const saved = localStorage.getItem("lexis_german_vocab");
      return saved ? JSON.parse(saved) : INITIAL_VOCABULARY;
    } catch {
      return INITIAL_VOCABULARY;
    }
  });

  const [themes, setThemes] = useState(() => {
    try {
      const saved = localStorage.getItem("lexis_german_themes");
      return saved ? JSON.parse(saved) : DEFAULT_THEMES;
    } catch {
      return DEFAULT_THEMES;
    }
  });
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
      localStorage.setItem("lexis_german_vocab", JSON.stringify(vocabulary));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }, [vocabulary]);

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
  };

  // Opens the Add Word page pre-filled with an existing word
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
        item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.translation.toLowerCase().includes(searchQuery.toLowerCase());
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

  // AI auto-fill for the Add Word form.
  // overwrite=false: only fills empty fields. overwrite=true: replaces all AI fields.
  const handleAIFill = async (overwrite = false) => {
    if (!formWord.trim()) return;
    setIsGenerating(true);
    setAiError("");
    try {
      const data = await fetchWordDetails(formWord.trim());
      const pick = (prev, next) => (overwrite || !prev.trim() ? next : prev);
      setFormTranslation((prev) => pick(prev, data.translation));
      setFormDefinition((prev) => pick(prev, data.definition));
      setFormExample((prev) => pick(prev, data.example));
      setFormExampleTranslation((prev) => pick(prev, data.exampleTranslation));
    } catch {
      setAiError(
        "Could not generate details. Check your connection and try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Merges an imported backup into the current vocabulary (skips duplicate words)
  const handleImportBackup = ({
    vocabulary: imported,
    themes: importedThemes,
  }) => {
    const existingWords = new Set(
      vocabulary.map((w) => w.word.trim().toLowerCase()),
    );
    const usedIds = new Set(vocabulary.map((w) => w.id));
    const newEntries = [];
    let skipped = 0;

    imported.forEach((w, i) => {
      const key = w.word.toLowerCase();
      if (existingWords.has(key)) {
        skipped++;
        return;
      }
      existingWords.add(key);

      // Keep the original id unless it's missing or already taken
      let id = w.id;
      if (id === undefined || id === null || usedIds.has(id)) {
        id = Date.now() + i;
        while (usedIds.has(id)) id++;
      }
      usedIds.add(id);
      newEntries.push({ ...w, id });
    });

    setVocabulary([...newEntries, ...vocabulary]);

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

    // Editing an existing word: update it instead of adding a new one
    if (editingWordId !== null) {
      setVocabulary(
        vocabulary.map((w) =>
          w.id === editingWordId
            ? {
                ...w,
                word: formWord.trim(),
                translation: formTranslation.trim(),
                definition:
                  formDefinition.trim() ||
                  "Keine deutsche Definition hinterlegt.",
                example:
                  formExample.trim() ||
                  `„Ein wunderbares Beispiel für ${formWord.trim()}.“`,
                exampleTranslation:
                  formExampleTranslation.trim() ||
                  "English translation of study example.",
                thema: finalThema,
                level: formLevel,
                type: formType || guessWordType(formWord),
                priority: formPriority,
              }
            : w,
        ),
      );
      setSelectedWordId(editingWordId);
      setEditingWordId(null);
      resetForm();
      navigateTo("detail", "push_back");
      return;
    }

    const newEntry = {
      id: Date.now(),
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
      type: formType || guessWordType(formWord),
      priority: formPriority,
      favorite: false,
    };

    setVocabulary([newEntry, ...vocabulary]);
    setFormWord("");
    setFormTranslation("");
    setFormDefinition("");
    setFormExample("");
    setFormCustomThema("");
    setFormExampleTranslation("");
    setFormLevel("");
    setFormType("");
    navigateTo("vocabulary", "push_back");
  };

  const toggleFavorite = (id, e) => {
    if (e) e.stopPropagation();
    setVocabulary(
      vocabulary.map((w) =>
        w.id === id ? { ...w, favorite: !w.favorite } : w,
      ),
    );
  };

  const deleteWord = (id, e) => {
    if (e) e.stopPropagation();
    if (confirm("Möchten Sie dieses Wort wirklich löschen?")) {
      setVocabulary(vocabulary.filter((w) => w.id !== id));
      navigateTo("vocabulary", "push_back");
    }
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
