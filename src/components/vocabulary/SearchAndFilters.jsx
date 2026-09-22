import React, { useMemo } from "react";
import { Search, X } from "lucide-react";
import GermanTextField from "../common/GermanTextField";

export default function SearchAndFilters({
  vocabulary,
  searchQuery,
  setSearchQuery,
  selectedThemeFilter,
  setSelectedThemeFilter,
  selectedLevelFilter,
  setSelectedLevelFilter,
}) {
  const themeFilterActive =
    selectedThemeFilter !== "All Words" &&
    selectedThemeFilter !== "Alle Themen";

  // Number of words per level; "All Words" counts every word
  const levelCounts = useMemo(() => {
    const counts = { "All Words": vocabulary.length };
    ["Basic", "Intermediate", "Advanced"].forEach((level) => {
      counts[level] = vocabulary.filter((w) => w.level === level).length;
    });
    return counts;
  }, [vocabulary]);

  return (
    <div className="space-y-3">
      <GermanTextField
        icon={
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8a928e]" />
        }
        type="text"
        placeholder="Search word or translation..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full font-sans bg-[#f9f9f7] border border-[#e8e5e0] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#637368] transition-all placeholder:text-[#9ea6a1]"
      />

      {/* pt-2 / pr-2 leave room for the count badges that overhang each pill */}
      <div className="flex items-center gap-2 overflow-x-auto pt-2 pr-2 pb-1 no-scrollbar font-sans text-xs">
        {["All Words", "Basic", "Intermediate", "Advanced"].map((pill) => (
          <button
            key={pill}
            onClick={() => {
              setSelectedLevelFilter(pill);
              if (pill === "All Words") setSelectedThemeFilter("All Words");
            }}
            className={`relative px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 ${
              selectedLevelFilter === pill
                ? "bg-[#2c302e] text-white shadow-sm"
                : "bg-[#f4f3ef] text-[#637368] hover:bg-[#eae7e2]"
            }`}
          >
            {pill}
            <span
              className={`absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full flex items-center justify-center text-[9px] font-bold leading-none ${
                selectedLevelFilter === pill
                  ? "bg-white text-[#2c302e] border border-[#2c302e]"
                  : "bg-[#637368] text-white"
              }`}
            >
              {levelCounts[pill]}
            </span>
          </button>
        ))}
      </div>

      {/* Shows the theme filter chosen on the Themen screen, with a clear button */}
      {themeFilterActive && (
        <div className="flex items-center gap-1.5 font-sans text-[11px] text-[#637368]">
          <span>Thema:</span>
          <span className="inline-flex items-center gap-1 bg-[#f4f6f4] border border-[#e5eae6] pl-2.5 pr-1 py-1 rounded-full font-medium">
            {selectedThemeFilter}
            <button
              type="button"
              onClick={() => setSelectedThemeFilter("All Words")}
              title="Filter entfernen"
              className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-black/10"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
