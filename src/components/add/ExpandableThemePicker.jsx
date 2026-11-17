import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function ExpandableThemePicker({ themes, value, onSelect }) {
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

  // Selected theme first, so it is always visible in the collapsed row.
  // If the selected theme isn't in the list yet, show it anyway.
  const items = (() => {
    const list = [...themes];
    if (value && !list.some((t) => t.name === value)) {
      list.unshift({ name: value, count: 0 });
    }
    const selected = list.find((t) => t.name === value);
    return selected
      ? [selected, ...list.filter((t) => t.name !== value)]
      : list;
  })();

  if (items.length === 0) return null;

  const pillClass = (active) =>
    `px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 whitespace-nowrap ${
      active
        ? "bg-[#435249] text-white shadow-sm"
        : "bg-[#f4f6f4] text-[#637368] hover:bg-[#e2e7e3]"
    }`;

  const handleSelect = (name) => {
    onSelect(name);
    setExpanded(false);
  };

  const renderPills = () =>
    items.map(({ name, count }) => (
      <button
        key={name}
        type="button"
        onClick={() => handleSelect(name)}
        className={pillClass(name === value)}
      >
        {name}
        {count > 0 && ` (${count})`}
      </button>
    ));

  return (
    // Fixed-height wrapper: the expanded panel is absolute, so it floats
    // over the fields below instead of pushing them down.
    <div ref={wrapperRef} className="relative">
      <div className="bg-white border border-[#e8e5e0] rounded-2xl pt-2 px-2.5 relative">
        {/* Collapsed row: clipped to one row */}
        <div className="flex flex-wrap gap-2 max-h-9 overflow-hidden font-sans text-xs">
          {renderPills()}
        </div>

        {/* Expand/collapse handle, centered on the bottom edge */}
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

      {/* Expanded panel */}
      {expanded && (
        <div className="absolute left-0 right-0 top-0 z-30 bg-white border border-[#d0d7d3] rounded-2xl pt-2 px-2.5 pb-4 shadow-lg max-h-72 overflow-y-auto">
          <div className="flex flex-wrap gap-2 font-sans text-xs">
            {renderPills()}
          </div>
        </div>
      )}
    </div>
  );
}
