import React from "react";

export default function DefinitionCard({ activeWord }) {
  return (
    <div className="bg-[#f9f9f7] border border-[#e8e5e0] rounded-2xl p-4 space-y-1.5">
      <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-[#8a928e]">
        Definition
      </span>
      <p className="font-serif text-sm text-[#2c302e] leading-relaxed">
        {activeWord.definition}
      </p>
    </div>
  );
}
