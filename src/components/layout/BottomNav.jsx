import React from "react";
import { BookOpen, Layers, Star, PenLine } from "lucide-react"; // add PenLine

export default function BottomNav({ currentScreen, navigateTo, detailOrigin }) {
  // Which tab is highlighted: detail pages belong to the tab they were opened from,
  // and the Add Word page belongs to Vocabulary
  const activeTab =
    currentScreen === "detail"
      ? detailOrigin
      : currentScreen === "add"
        ? "vocabulary"
        : currentScreen;

  // Shared style: the selected tab gets a dark pill, the others stay muted
  const tabClass = (isActive) =>
    `flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors ${
      isActive
        ? "bg-[#2c302e] text-white font-bold shadow-sm"
        : "text-[#8a928e] hover:text-[#555d58]"
    }`;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur border-t border-[#f0eee9] px-6 py-2 z-40 flex items-center justify-around font-sans">
      <button
        onClick={() => navigateTo("vocabulary", "none")}
        className={tabClass(activeTab === "vocabulary")}
      >
        <BookOpen
          className="w-5 h-5"
          strokeWidth={activeTab === "vocabulary" ? 2.5 : 2}
        />
        <span className="text-[10px]">Vocabulary</span>
      </button>

      <button
        onClick={() => navigateTo("themen", "none")}
        className={tabClass(activeTab === "themen")}
      >
        <Layers
          className="w-5 h-5"
          strokeWidth={activeTab === "themen" ? 2.5 : 2}
        />
        <span className="text-[10px]">Themen</span>
      </button>

      <button
        onClick={() => navigateTo("collections", "none")}
        className={tabClass(activeTab === "collections")}
      >
        <Star
          className="w-5 h-5"
          strokeWidth={activeTab === "collections" ? 2.5 : 2}
        />
        <span className="text-[10px]">Favorites</span>
      </button>
      <button
        onClick={() => navigateTo("myWords", "none")}
        className={`flex flex-col items-center gap-1 px-2 ${
          currentScreen === "myWords" ||
          (detailOrigin === "myWords" && currentScreen === "detail")
            ? "text-[#2c302e]"
            : "text-[#8a928e]"
        }`}
      >
        <PenLine className="w-5 h-5" />
        <span className="text-[10px] font-sans mt-0.5">My Words</span>
      </button>
    </nav>
  );
}
