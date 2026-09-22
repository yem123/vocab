import React from "react";
import WordCard from "./WordCard";

export default function VocabularyList({
  filteredVocabulary,
  setSelectedWordId,
  navigateTo,
}) {
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
        filteredVocabulary.map((item) => (
          <WordCard
            key={item.id}
            item={item}
            setSelectedWordId={setSelectedWordId}
            navigateTo={navigateTo}
          />
        ))
      )}
    </div>
  );
}
