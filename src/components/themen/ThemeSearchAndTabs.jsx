import React from "react";
import { Search } from "lucide-react";
import GermanTextField from "../common/GermanTextField";

const SORT_TABS = [
  { id: "count", label: "Meiste Wörter" },
  { id: "az", label: "A–Z" },
  { id: "recent", label: "Neueste" },
];

export default function ThemeSearchAndTabs({
  themeSearch,
  setThemeSearch,
  sortMode,
  setSortMode,
}) {
  return (
    <div className="space-y-3">
      <GermanTextField
        icon={
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8a928e]" />
        }
        type="text"
        placeholder="Thema oder Stichwort suchen..."
        value={themeSearch}
        onChange={(e) => setThemeSearch(e.target.value)}
        className="w-full font-sans bg-[#f9f9f7] border border-[#e8e5e0] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#637368]"
      />
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar font-sans text-xs">
        {SORT_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSortMode(tab.id)}
            className={`px-3.5 py-1.5 rounded-full font-medium shrink-0 ${
              sortMode === tab.id
                ? "bg-[#2c302e] text-white"
                : "bg-[#f4f3ef] text-[#637368]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
