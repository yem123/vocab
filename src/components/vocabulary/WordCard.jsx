import React from "react";
import { ChevronRight } from "lucide-react";

export default function WordCard({ item, setSelectedWordId, navigateTo }) {
  return (
    <div
      key={item.id}
      onClick={() => {
        setSelectedWordId(item.id);
        navigateTo("detail", "push");
      }}
      className="group bg-white border border-[#f0eee9] hover:border-[#d0d7d3] p-2 px-4 rounded-2xl shadow-xs transition-all cursor-pointer flex items-center justify-between"
    >
      <div className="flex-1 pr-3">
        <div className="flex items-center gap-4">
          <h4 className="font-serif text-base text-[#2c302e] group-hover:text-[#435249] transition-colors min-w-30">
            {item.word}
          </h4>
          <p className="font-sans text-xs text-[#637368] mt-0.5 truncate max-w-30">
            {item.translation}
          </p>
          {item.favorite && <span className="text-amber-400 text-xs">⭐</span>}
        </div>
      </div>
      <div className="flex items-center gap-2 text-[#a8b0ac] group-hover:text-[#2c302e]">
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </div>
  );
}
