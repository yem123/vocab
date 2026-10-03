import React from "react";
import { Star } from "lucide-react";
import WordCard from "../vocabulary/WordCard";
import SaveToGithubButton from "../collections/SaveToGithubButton";

export default function CollectionsScreen({
  favoriteVocabulary,
  setSelectedWordId,
  navigateTo,
}) {
  return (
    <div className="flex-1 flex flex-col px-6 py-5 space-y-5">
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

      <SaveToGithubButton favoriteVocabulary={favoriteVocabulary} />

      {/* Favorite words list */}
      <div className="space-y-2 pt-1">
        {favoriteVocabulary.length === 0 ? (
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
          favoriteVocabulary.map((item) => (
            <WordCard
              key={item.id}
              item={item}
              setSelectedWordId={setSelectedWordId}
              navigateTo={navigateTo}
            />
          ))
        )}
      </div>
    </div>
  );
}
