import React from "react";
import { Volume2 } from "lucide-react";
import { speakGerman } from "../../utils/speech";

export default function WordOfTheMorning({
  vocabulary,
  setSelectedWordId,
  navigateTo,
}) {
  return (
    <div
      onClick={() => {
        setSelectedWordId(vocabulary[0].id);
        navigateTo("detail", "push");
      }}
      className="bg-[#faf9f6] border border-[#e8e5e0] rounded-2xl p-4 shadow-xs hover:border-[#b8c2bc] transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between">
        <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-[#767d78]">
          Word of the Morning
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            speakGerman(vocabulary[0].word);
          }}
          className="text-[#555d58] hover:text-black p-1"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <h3 className="text-xl font-serif text-[#2c302e] mt-1 group-hover:text-[#435249] transition-colors">
          {vocabulary[0].word}
        </h3>
        <p className="font-sans text-xs text-[#637368] mt-0.5 line-clamp-1">
          {vocabulary[0].translation}
        </p>
      </div>
    </div>
  );
}
