import React, { useState, useEffect, useMemo, useRef } from "react";
import { Star } from "lucide-react";
import SearchAndFilters from "../vocabulary/SearchAndFilters";
import { getWordType } from "../../utils/wordTypes";
import ExpandableThemeFilter from "../collections/ExpandableThemeFilter";
import PaginatedWordList from "../vocabulary/PaginatedWordList";

export default function CollectionsScreen({
  favoriteVocabulary,
  setSelectedWordId,
  navigateTo,
  toggleFavorite,
  visibleCollectionsCount,
  setVisibleCollectionsCount,
  collectionsScrollY,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThemeFilter, setSelectedThemeFilter] = useState("All Words");
  const [selectedLevelFilter, setSelectedLevelFilter] = useState("All Words");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All Types");

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setVisibleCollectionsCount(100);
  }, [
    searchQuery,
    selectedThemeFilter,
    selectedLevelFilter,
    selectedTypeFilter,
  ]);

  const favoriteThemes = useMemo(() => {
    const counts = new Map();
    favoriteVocabulary.forEach((w) => {
      const name = w.thema || "Ohne Thema";
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "de"))
      .map(([name, count]) => ({ name, count }));
  }, [favoriteVocabulary]);

  const filteredFavorites = useMemo(() => {
    return favoriteVocabulary.filter((item) => {
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
    favoriteVocabulary,
    searchQuery,
    selectedThemeFilter,
    selectedLevelFilter,
    selectedTypeFilter,
  ]);

  return (
    <div className="flex-1 flex flex-col px-6 py-2 space-y-2">
      {/* Header Box */}
      <div className="bg-[#f4f6f4] border border-[#e5eae6] rounded-2xl p-5">
        <div className="flex justify-between items-center">
          <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-[#637368]">
            Meine Favoriten
          </span>
          <span className="font-sans text-xs font-semibold bg-[#e2e7e3] text-[#4a5750] px-2.5 py-0.5 rounded-full">
            {favoriteVocabulary.length} Wörter
          </span>
        </div>
        <h2 className="text-xl font-serif text-[#2c302e] mt-1">Collections</h2>
        <p className="font-sans text-xs text-[#637368] mt-1 leading-relaxed">
          Deine mit einem Stern markierten Wörter an einem Ort.
        </p>
      </div>

      {/* Same search + level/type filters as the Vocabulary screen,
          but scoped to favoriteVocabulary instead of the full list */}
      <SearchAndFilters
        vocabulary={favoriteVocabulary}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedThemeFilter={selectedThemeFilter}
        setSelectedThemeFilter={setSelectedThemeFilter}
        selectedLevelFilter={selectedLevelFilter}
        setSelectedLevelFilter={setSelectedLevelFilter}
        selectedTypeFilter={selectedTypeFilter}
        setSelectedTypeFilter={setSelectedTypeFilter}
      />

      {/* Theme pills, built from favorites only */}
      <ExpandableThemeFilter
        favoriteThemes={favoriteThemes}
        selectedThemeFilter={selectedThemeFilter}
        setSelectedThemeFilter={setSelectedThemeFilter}
      />

      {/* Favorite words list: pagination, scroll restore, jump to ID,
          scroll to top — all shared with the Vocabulary screen */}
      <PaginatedWordList
        items={filteredFavorites}
        setSelectedWordId={setSelectedWordId}
        navigateTo={navigateTo}
        toggleFavorite={toggleFavorite}
        visibleCount={visibleCollectionsCount}
        setVisibleCount={setVisibleCollectionsCount}
        scrollY={collectionsScrollY}
        emptyState={
          favoriteVocabulary.length === 0 ? (
            <div className="text-center py-12 px-6 border border-dashed border-[#e2e7e3] rounded-2xl">
              <Star className="w-6 h-6 text-[#b8c2bc] mx-auto mb-2" />
              <p className="font-sans text-sm text-[#767d78]">
                Noch keine Favoriten.
              </p>
              <p className="font-sans text-xs text-[#8a928e] mt-1">
                Tap the star on a word to save it here.
              </p>
              <button
                onClick={() => navigateTo("vocabulary", "push_back")}
                className="mt-3 font-sans text-xs font-bold text-[#435249] underline"
              >
                Zum Vokabular
              </button>
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-[#e2e7e3] rounded-2xl">
              <p className="font-sans text-sm text-[#767d78]">
                Keine Favoriten gefunden.
              </p>
            </div>
          )
        }
      />
    </div>
  );
}
