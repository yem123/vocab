import React, { useState } from "react";
import { ChevronDown, Link2 } from "lucide-react";

export default function FamilyCard({ familyMembers, onSelectWord }) {
  const [open, setOpen] = useState(false);

  if (familyMembers.length === 0) return null;

  return (
    <div className="bg-[#f4f6f4] border border-[#dce3df] rounded-2xl p-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between"
      >
        <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-[#526859] flex items-center gap-1">
          <Link2 className="w-3 h-3" /> Wortfamilie
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#8a928e] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="mt-2.5 space-y-1.5">
          {familyMembers.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => onSelectWord(w.id)}
              className="w-full flex items-center justify-between bg-white border border-[#e8e5e0] hover:border-[#b8c2bc] rounded-xl px-3 py-2 text-left transition-colors"
            >
              <p className="min-w-0 pr-2 font-serif text-sm text-[#2c302e] truncate">
                {w.word}
              </p>
              <p className="font-sans text-xs text-[#637368] truncate">
                {w.translation}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
