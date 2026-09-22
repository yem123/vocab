import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, X } from "lucide-react";

export default function ThemeDropdown({
  themes,
  formThema,
  setFormThema,
  setFormCustomThema,
  removeTheme,
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close the list when tapping outside of it
  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      {/* Closed state: shows the selected thema */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between border-t border-[#e8e5e0] pt-1.5 text-sm font-serif font-medium text-[#2c302e] focus:outline-none"
      >
        <span>{formThema || "Thema wählen"}</span>
        <ChevronDown
          className={`w-4 h-4 text-[#8a928e] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Open state: list with a remove button on every row */}
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-[#e8e5e0] rounded-xl shadow-lg max-h-50 overflow-y-auto">
          {themes.length === 0 ? (
            <p className="px-3 py-2.5 text-xs text-[#8a928e]">
              Keine Themen vorhanden.
            </p>
          ) : (
            themes.map((t) => (
              <div
                key={t}
                className={`flex items-center justify-between px-3 py-2 hover:bg-[#f4f6f4] ${
                  formThema === t ? "bg-[#f4f6f4]" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setFormThema(t);
                    setFormCustomThema("");
                    setOpen(false);
                  }}
                  className="flex-1 text-left text-sm font-serif text-[#2c302e]"
                >
                  {t}
                </button>
                <button
                  type="button"
                  onClick={() => removeTheme(t)}
                  title="Thema entfernen"
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[#8a928e] hover:text-rose-500 hover:bg-rose-50"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
