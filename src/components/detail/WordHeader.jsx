import React from "react";
import { Volume2 } from "lucide-react";
import { speakGerman } from "../../utils/speech";

export default function WordHeader({ activeWord }) {
  return (
    <div className="text-center space-y-2 py-2">
      <div className="inline-flex items-center justify-center gap-2">
        <h2 className="text-3xl font-serif text-[#2c302e] tracking-tight">
          {activeWord.word}
        </h2>
        <button
          onClick={() => speakGerman(activeWord.word)}
          className="w-8 h-8 rounded-full bg-[#2c302e] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-xs"
          title="Aussprache anhören"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
      <p className="font-sans text-sm text-[#555d58] font-medium">
        {activeWord.translation}
      </p>
    </div>
  );
}
