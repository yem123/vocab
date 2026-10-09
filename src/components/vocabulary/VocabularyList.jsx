import React, { useState, useEffect } from "react";
import WordCard from "./WordCard";

const PAGE_SIZE = 100;

export default function VocabularyList({
  filteredVocabulary,
  setSelectedWordId,
  navigateTo,
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reset back to the first page whenever the filtered result set changes
  // (new search, theme, level, or type filter)
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filteredVocabulary]);

  const visibleWords = filteredVocabulary.slice(0, visibleCount);
  const hasMore = visibleCount < filteredVocabulary.length;

  return (
    <div className="space-y-2 pt-1">
      {filteredVocabulary.length === 0 ? (
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
      ) : (
        <>
          {visibleWords.map((item) => (
            <WordCard
              key={item.id}
              item={item}
              setSelectedWordId={setSelectedWordId}
              navigateTo={navigateTo}
            />
          ))}

          <div className="pt-2 pb-1 text-center font-sans">
            <p className="text-[11px] text-[#8a928e] mb-2">
              Showing {visibleWords.length} of {filteredVocabulary.length}
            </p>
            {hasMore && (
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((prev) => prev + PAGE_SIZE)
                }
                className="bg-[#f4f3ef] hover:bg-[#eae7e2] text-[#2c302e] px-5 py-2 rounded-full text-xs font-bold transition-colors"
              >
                Load 100 more
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
