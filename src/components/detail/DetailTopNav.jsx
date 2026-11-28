import React from "react";
import { ArrowLeft, Star } from "lucide-react";

export default function DetailTopNav({
  activeWord,
  vocabulary,
  navigateTo,
  toggleFavorite,
  detailOrigin,
}) {
  const ORIGIN_LABELS = {
    collections: "Collections",
    notebook: "notebook",
    vocabulary: "Vocabulary",
  };

  const backTarget = ORIGIN_LABELS[detailOrigin] ? detailOrigin : "vocabulary";
  const backLabel = ORIGIN_LABELS[detailOrigin] || "Vocabulary";

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => navigateTo(backTarget, "push_back")}
        className="font-sans text-xs font-semibold text-[#555d58] flex items-center gap-1.5 bg-[#f4f3ef] px-3 py-1.5 rounded-full hover:bg-[#eae7e2]"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> {backLabel}
      </button>
      <div className="flex items-center gap-3">
        <span className="font-sans text-xs text-[#767d78]">
          Word {vocabulary.findIndex((w) => w.id === activeWord.id) + 1} of{" "}
          {vocabulary.length}
        </span>
        <button
          onClick={(e) => toggleFavorite(activeWord.id, e)}
          className={`p-1.5 rounded-lg ${activeWord.favorite ? "text-amber-500 bg-amber-50" : "text-[#8a928e] bg-[#f4f3ef]"}`}
        >
          <Star className="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  );
}
