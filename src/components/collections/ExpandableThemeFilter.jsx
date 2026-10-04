import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function ExpandableThemeFilter({
  favoriteThemes,
  selectedThemeFilter,
  setSelectedThemeFilter,
}) {
  const [expanded, setExpanded] = useState(false);
  const wrapperRef = useRef(null);

  // Close when tapping outside the box
  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  if (favoriteThemes.length === 0) return null;

  const pillClass = (isActive) =>
    `px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 whitespace-nowrap ${
      isActive
        ? "bg-[#435249] text-white shadow-sm"
        : "bg-[#f4f6f4] text-[#637368] hover:bg-[#e2e7e3]"
    }`;

  const handleSelect = (name) => {
    setSelectedThemeFilter(name);
    setExpanded(false);
  };

  const Pills = () => (
    <>
      <button
        onClick={() => handleSelect("All Words")}
        className={pillClass(selectedThemeFilter === "All Words")}
      >
        Alle Themen
      </button>
      {favoriteThemes.map(({ name, count }) => (
        <button
          key={name}
          onClick={() =>
            handleSelect(selectedThemeFilter === name ? "All Words" : name)
          }
          className={pillClass(selectedThemeFilter === name)}
        >
          {name} ({count})
        </button>
      ))}
    </>
  );

  return (
    <div ref={wrapperRef} className="relative">
      <div className="bg-gray-50 border border-[#e8e5e0] rounded-2xl pt-2 px-2.5 relative">
        <div className="flex flex-wrap gap-2 max-h-24 overflow-hidden font-sans text-xs">
          <Pills />
        </div>
        <div className="flex justify-center -mb-3 pt-1.5 relative z-20">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Themen einklappen" : "Alle Themen zeigen"}
            className="w-6 h-6 rounded-full bg-white border border-[#e8e5e0] shadow-sm flex items-center justify-center text-[#8a928e] hover:text-[#2c302e]"
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>
      {expanded && (
        <div className="absolute left-0 right-0 top-0 z-30 bg-[#f9f9f7] border border-[#d0d7d3] rounded-2xl pt-2 px-2.5 pb-3 shadow-lg">
          <div className="flex flex-wrap gap-2 font-sans text-xs">
            <Pills />
          </div>
        </div>
      )}
    </div>
  );
}
