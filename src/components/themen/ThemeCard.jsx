import React from "react";
import { ChevronRight } from "lucide-react";
import { LEVELS } from "../../utils/themes";

export default function ThemeCard({ theme, openTheme }) {
  const Icon = theme.icon;
  const samples = theme.words
    .slice(0, 3)
    .map((w) => w.word)
    .join(", ");
  const levelSummary = LEVELS.filter((l) => theme.levels[l])
    .map((l) => `${l} · ${theme.levels[l]}`)
    .join("   ");

  return (
    <div
      onClick={() => openTheme(theme.name)}
      className="bg-white border border-[#f0eee9] hover:border-[#b8c2bc] rounded-2xl p-4 shadow-xs transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#f4f6f4] text-[#4a5750] flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-serif text-base text-[#2c302e] group-hover:text-[#435249] truncate">
              {theme.name}
            </h3>
            <p className="font-sans text-xs text-[#637368] mt-0.5 truncate">
              z. B. {samples}
            </p>
          </div>
        </div>
        <span className="font-sans text-[11px] font-semibold bg-[#f4f3ef] text-[#555d58] px-2.5 py-1 rounded-full shrink-0">
          {theme.count} {theme.count === 1 ? "Wort" : "Wörter"}
        </span>
      </div>

      
    </div>
  );
}
