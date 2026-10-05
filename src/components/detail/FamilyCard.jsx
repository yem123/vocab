import React from "react";
import { Link2 } from "lucide-react";

export default function FamilyCard({ familyMembers, onSelectWord }) {
  if (familyMembers.length === 0) return null;

  return (
    <div className="bg-[#f4f6f4] border border-[#dce3df] rounded-2xl p-4 space-y-2.5">
      <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-[#526859] flex items-center gap-1">
        <Link2 className="w-3 h-3" /> Wortfamilie
      </span>
      <div className="space-y-1.5">
        {familyMembers.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => onSelectWord(w.id)}
            className="w-full flex items-center justify-between bg-white border border-[#e8e5e0] hover:border-[#b8c2bc] rounded-xl px-3 py-2 text-left transition-colors"
          >
            <div className="min-w-0 pr-2">
              <p className="font-serif text-sm text-[#2c302e] truncate">
                {w.word}
              </p>
              <p className="font-sans text-xs text-[#637368] truncate">
                {w.translation}
              </p>
            </div>
            {w.type && (
              <span className="font-sans text-[10px] font-semibold bg-[#f4f6f4] text-[#526859] border border-[#e5eae6] px-1.5 py-0.5 rounded-md shrink-0">
                {w.type}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
