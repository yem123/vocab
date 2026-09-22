import React from "react";
import { X } from "lucide-react";

export default function AddHeaderRow({
  navigateTo,
  handleSaveNewWord,
  isEditing,
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#f0eee9] pb-3">
      <button
        onClick={() =>
          navigateTo(isEditing ? "detail" : "vocabulary", "push_back")
        }
        className="font-sans text-xs font-semibold text-[#555d58] flex items-center gap-1 bg-[#f4f3ef] px-3 py-1.5 rounded-full hover:bg-[#eae7e2]"
      >
        <X className="w-3.5 h-3.5" /> Cancel
      </button>
      <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#8a928e]">
        {isEditing ? "Eintrag bearbeiten" : "Neuer Eintrag"}
      </span>
      <button
        onClick={handleSaveNewWord}
        className="font-sans text-xs font-bold text-white bg-[#2c302e] px-4 py-1.5 rounded-full hover:bg-black shadow-xs"
      >
        Save
      </button>
    </div>
  );
}
