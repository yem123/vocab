import React, { useState, useMemo } from "react";
import { PenLine } from "lucide-react";
import WordCard from "../vocabulary/WordCard";
import SearchAndFilters from "../vocabulary/SearchAndFilters";
import { getWordType } from "../../utils/wordTypes";

export default function MyWordsScreen({
  myWords,
  setSelectedWordId,
  navigateTo,
  toggleFavorite,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThemeFilter, setSelectedThemeFilter] = useState("All Words");
  const [selectedLevelFilter, setSelectedLevelFilter] = useState("All Words");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All Types");

  const filteredMyWords = useMemo(() => {
    return myWords.filter((item) => {
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
    myWords,
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
            Meine Wörter
          </span>
          <span className="font-sans text-xs font-semibold bg-[#e2e7e3] text-[#4a5750] px-2.5 py-0.5 rounded-full">
            {myWords.length} Wörter
          </span>
        </div>
        <h2 className="text-xl font-serif text-[#2c302e] mt-1">My Words</h2>
        <p className="font-sans text-xs text-[#637368] mt-1 leading-relaxed">
          Wörter, die du selbst hinzugefügt hast.
        </p>
      </div>

      {/* Same search + level/type filters as Vocabulary, scoped to myWords */}
      <SearchAndFilters
        vocabulary={myWords}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedThemeFilter={selectedThemeFilter}
        setSelectedThemeFilter={setSelectedThemeFilter}
        selectedLevelFilter={selectedLevelFilter}
        setSelectedLevelFilter={setSelectedLevelFilter}
        selectedTypeFilter={selectedTypeFilter}
        setSelectedTypeFilter={setSelectedTypeFilter}
      />

      {/* Word list */}
      <div className="space-y-2 pt-1">
        {myWords.length === 0 ? (
          <div className="text-center py-12 px-6 border border-dashed border-[#e2e7e3] rounded-2xl">
            <PenLine className="w-6 h-6 text-[#b8c2bc] mx-auto mb-2" />
            <p className="font-sans text-sm text-[#767d78]">
              Noch keine eigenen Wörter.
            </p>
            <button
              onClick={() => navigateTo("add", "slide_up")}
              className="mt-3 font-sans text-xs font-bold text-[#435249] underline"
            >
              Wort hinzufügen
            </button>
          </div>
        ) : filteredMyWords.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#e2e7e3] rounded-2xl">
            <p className="font-sans text-sm text-[#767d78]">
              Keine Wörter gefunden.
            </p>
          </div>
        ) : (
          filteredMyWords.map((item) => (
            <WordCard
              key={item.id}
              item={item}
              setSelectedWordId={setSelectedWordId}
              navigateTo={navigateTo}
              toggleFavorite={toggleFavorite}
            />
          ))
        )}
      </div>
    </div>
  );
}
