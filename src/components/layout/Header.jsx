import React from "react";

export default function Header() {
  return (
    <header className="bg-white/90 backdrop-blur sticky top-0 z-40 px-6 py-4 border-b border-[#f0eee9] flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#2c302e] text-[#fcfbf9] flex items-center justify-center font-sans font-bold text-sm">
          𝔇
        </div>
        <div>
          <h1 className="font-sans font-bold text-sm tracking-tight text-[#2c302e]">
            Wortschatz · Vocabulary
          </h1>
          <p className="font-sans text-[11px] text-[#767d78]">
            Deutsch · English
          </p>
        </div>
      </div>
    </header>
  );
}
