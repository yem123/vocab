import React, { useState } from "react";
import { ChevronDown, Repeat } from "lucide-react";

export default function SynonymsCard({ synonyms }) {
  const [open, setOpen] = useState(true);

  const levels = synonyms ? Object.keys(synonyms) : [];
  const hasSynonyms = levels.some(
    (level) => (synonyms[level] || []).length > 0,
  );

  if (!hasSynonyms) return null;

  return (
    <div className="bg-[#f4f6f4] border border-[#dce3df] rounded-2xl p-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between"
      >
        <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-[#526859] flex items-center gap-1">
          <Repeat className="w-3 h-3" /> Synonyme
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#8a928e] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="mt-3 flex flex-wrap gap-3">
          {levels.flatMap((level) =>
            (synonyms[level] || []).map((syn) => (
              <span
                key={`${level}-${syn}`}
                className="relative bg-white border border-[#e8e5e0] rounded-xl pl-3 pr-2 py-1.5"
              >
                <span className="font-serif text-sm text-[#2c302e]">{syn}</span>
                <span className="absolute -top-2 -right-2 font-sans text-[9px] font-bold text-white bg-[#2c302e] px-1.5 py-0.5 rounded-full shadow-sm">
                  {level}
                </span>
              </span>
            )),
          )}
        </div>
      )}
    </div>
  );
}
