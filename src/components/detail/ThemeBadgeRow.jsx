import React from "react";
import { Trash2, Pencil } from "lucide-react";

export default function ThemeBadgeRow({ activeWord, deleteWord, editWord }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-sans text-[10px] tracking-widest uppercase font-bold text-[#637368] bg-[#f4f6f4] px-3 py-1 rounded-full border border-[#e5eae6]">
          {activeWord.thema}
        </span>
        {activeWord.level && (
          <span className="font-sans text-[10px] tracking-widest font-bold text-white bg-[#2c302e] px-2.5 py-1 rounded-full">
            {activeWord.level}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => editWord(activeWord)}
          className="text-[#8a928e] hover:text-[#2c302e] p-1"
          title="Edit word"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => deleteWord(activeWord.id, e)}
          className="text-rose-400 hover:text-rose-600 p-1"
          title="Delete word"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
