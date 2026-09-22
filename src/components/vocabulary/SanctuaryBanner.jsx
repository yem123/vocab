import React from "react";
import { Plus, Sparkles } from "lucide-react";

export default function SanctuaryBanner({ vocabulary, navigateTo }) {
  return (
    <div className="bg-[#f4f6f4] border border-[#e5eae6] rounded-2xl p-5 shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-serif font-normal text-[#2c302e] mt-0.5">
            Mein Deutsches Vokabular
          </h2>
          <p className="font-sans text-xs text-[#637368] mt-1">
            {vocabulary.length} curated words · Stored locally on device
          </p>
        </div>
        <button
          onClick={() => navigateTo("add", "slide_up")}
          className="w-10 h-10 rounded-full bg-[#2c302e] text-white flex items-center justify-center shadow hover:bg-black transition-transform active:scale-95"
          title="Add Word"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
