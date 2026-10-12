import React from "react";
import PaginatedWordList from "./PaginatedWordList";

export default function VocabularyList({
  filteredVocabulary,
  setSelectedWordId,
  navigateTo,
  toggleFavorite,
  visibleCount,
  setVisibleCount,
  vocabScrollY,
}) {
  return (
    <PaginatedWordList
      items={filteredVocabulary}
      setSelectedWordId={setSelectedWordId}
      navigateTo={navigateTo}
      toggleFavorite={toggleFavorite}
      visibleCount={visibleCount}
      setVisibleCount={setVisibleCount}
      scrollY={vocabScrollY}
      emptyState={
        <div className="text-center py-12 border border-dashed border-[#e2e7e3] rounded-2xl">
          <p className="font-sans text-sm text-[#767d78]">
            Keine Vokabeln gefunden.
          </p>
          <button
            onClick={() => navigateTo("add", "slide_up")}
            className="mt-2 font-sans text-xs font-bold text-[#435249] underline"
          >
            Wort hinzufügen
          </button>
        </div>
      }
    />
  );
}
