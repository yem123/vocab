import React from "react";

export default function ThemenHeader({ themeCount }) {
  return (
    <div className="bg-[#f4f6f4] border border-[#e5eae6] rounded-2xl p-5">
      <div className="flex justify-between items-center">
        <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-[#637368]">
          Thematische Sammlungen
        </span>
        <span className="font-sans text-xs font-semibold bg-[#e2e7e3] text-[#4a5750] px-2.5 py-0.5 rounded-full">
          {themeCount} {themeCount === 1 ? "Themenbereich" : "Themenbereiche"}
        </span>
      </div>
      <h2 className="text-xl font-serif text-[#2c302e] mt-1">Themen</h2>
      <p className="font-sans text-xs text-[#637368] mt-1 leading-relaxed">
        Sinnstiftend verknüpfte Wortwelten für ein kontemplatives
        Sprachverständnis ohne Hektik.
      </p>
    </div>
  );
}
