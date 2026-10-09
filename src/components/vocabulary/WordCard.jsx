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
      className="group bg-white border border-[#f0eee9] hover:border-[#d0d7d3] p-2 px-4 rounded shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3"
    >
      <div className="flex items-center justify-between gap-3 min-w-0 flex-1">
        <h4 className="font-serif text-base text-[#2c302e] group-hover:text-[#435249] transition-colors truncate shrink-0">
          {item.word}
        </h4>
        <span className="flex-1 min-w-3 border-b border-dotted border-[#d0d7d3]" />
        <p className="font-sans text-xs text-[#637368] mt-0.5 truncate shrink-0 max-w-[40%] text-right">
          {item.translation}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={(e) => toggleFavorite(item.id, e)}
          className={`p-1.5 rounded-lg transition-colors ${
            item.favorite
              ? "text-amber-500"
              : "text-[#c5cac6] hover:text-amber-400"
          }`}
          title={item.favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star
            className="w-4 h-4"
            fill={item.favorite ? "currentColor" : "none"}
          />
        </button>
        <ChevronRight className="w-4 h-4 text-[#a8b0ac] group-hover:text-[#2c302e] transition-transform group-hover:translate-x-0.5" />
      </div>
    </div>
  );
}
