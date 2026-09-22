import React, { useState, useMemo } from "react";
import { getThemeStats } from "../../utils/themes";
import ThemenHeader from "../themen/ThemenHeader";
import ThemeSearchAndTabs from "../themen/ThemeSearchAndTabs";
import ThemeCard from "../themen/ThemeCard";

export default function ThemenScreen({ vocabulary, openTheme }) {
  const [themeSearch, setThemeSearch] = useState("");
  const [sortMode, setSortMode] = useState("count"); // 'count' | 'az' | 'recent'

  const themeStats = useMemo(() => getThemeStats(vocabulary), [vocabulary]);

  const visibleThemes = useMemo(() => {
    const q = themeSearch.trim().toLowerCase();
    const list = themeStats.filter(
      (t) =>
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.words.some(
          (w) =>
            w.word.toLowerCase().includes(q) ||
            w.translation.toLowerCase().includes(q),
        ),
    );

    return [...list].sort((a, b) => {
      if (sortMode === "az") return a.name.localeCompare(b.name, "de");
      if (sortMode === "recent") return a.firstIndex - b.firstIndex;
      return b.count - a.count || a.name.localeCompare(b.name, "de");
    });
  }, [themeStats, themeSearch, sortMode]);

  return (
    <div className="flex-1 flex flex-col px-6 py-5 space-y-5">
      {/* Header Box */}
      <ThemenHeader themeCount={themeStats.length} />

      {/* Theme search & pills */}
      <ThemeSearchAndTabs
        themeSearch={themeSearch}
        setThemeSearch={setThemeSearch}
        sortMode={sortMode}
        setSortMode={setSortMode}
      />

      {/* Theme Cards List */}
      <div className="space-y-3">
        {themeStats.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#e2e7e3] rounded-2xl">
            <p className="font-sans text-sm text-[#767d78]">
              Noch keine Wörter, daher keine Themen.
            </p>
          </div>
        ) : visibleThemes.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#e2e7e3] rounded-2xl">
            <p className="font-sans text-sm text-[#767d78]">
              Keine Themen gefunden.
            </p>
          </div>
        ) : (
          visibleThemes.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} openTheme={openTheme} />
          ))
        )}
      </div>
    </div>
  );
}
