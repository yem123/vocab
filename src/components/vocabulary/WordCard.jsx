import React from "react";
import { ChevronRight, Star } from "lucide-react";

export default function WordCard({
  item,
  setSelectedWordId,
  navigateTo,
  toggleFavorite,
}) {
  return (
    <div
      key={item.id}
      onClick={() => {
        setSelectedWordId(item.id);
        navigateTo("detail", "push");
      }}
      className="group bg-white border border-[#f0eee9] hover:border-[#d0d7d3] px-3.5 py-2.5 w-full rounded-md shadow-xs transition-all cursor-pointer flex items-center justify-between gap-2.5 overflow-hidden"
    >
      {/* Main content row with strict min-w-0 to enable proper truncation */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {/* Word */}
        <h4 className="font-serif text-sm sm:text-base text-[#2c302e] group-hover:text-[#435249] max-w-[60%] transition-colors truncate shrink">
          {item.word}
        </h4>

        {/* Dotted spacer */}
        <span className="flex-1 min-w-3 border-b border-dotted border-[#d0d7d3] mx-1 self-center" />

        {/* Translation */}
        <p className="font-sans text-xs sm:text-sm text-[#637368] truncate shrink max-w-[30%] text-right">
          {item.translation}
        </p>
      </div>

      {/* Actions (Star & Chevron) guaranteed to stay inside bounds */}
      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 ml-1">
        <button
          type="button"
          onClick={(e) => toggleFavorite(item.id, e)}
          className={`p-1.5 rounded-lg transition-colors ${
            item.favorite
              ? "text-amber-400"
              : "text-[#c5cac6] hover:text-amber-300"
          }`}
          title={item.favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star
            className="w-4 h-4 shrink-0"
            fill={item.favorite ? "currentColor" : "none"}
          />
        </button>
        <ChevronRight className="w-4 h-4 text-[#a8b0ac] group-hover:text-[#2c302e] transition-transform group-hover:translate-x-0.5 shrink-0" />
      </div>
    </div>
  );
}
