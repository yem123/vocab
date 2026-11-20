import React from "react";
import { BookOpen } from "lucide-react";

export default function ExampleCard({ activeWord }) {
  return (
    <div className="bg-[#f4f6f4] border border-[#dce3df] rounded-2xl p-4 space-y-2">
      <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-[#526859] flex items-center gap-1">
        <BookOpen className="w-3 h-3" /> Beispielsatz
      </span>
      <div>
        <p className="font-serif text-sm italic text-[#2c302e]">
          {activeWord.example}
        </p>
        <p className="font-sans text-xs text-[#637368]">
          {activeWord.exampleTranslation}
        </p>
      </div>

      {activeWord.example2 && (
        <div>
          <p className="font-serif text-sm italic text-[#2c302e]">
            {activeWord.example2}
          </p>
          <p className="font-sans text-xs text-[#637368]">
            {activeWord.example2Translation}
          </p>
        </div>
      )}
    </div>
  );
}
