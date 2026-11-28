import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function JumpToIdBar({ onJump }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = Number(value.trim());
    if (!value.trim() || Number.isNaN(id)) {
      setError("Enter a valid ID");
      return;
    }
    const found = onJump(id);
    setError(found ? "" : "ID not found in current view");
    if (found) setValue("");
  };

  return (
    <form name="noteId" onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setError("");
        }}
        placeholder="Go to ID…"
        className="w-full font-sans bg-[#f9f9f7] border border-[#e8e5e0] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#637368] placeholder:text-[#9ea6a1]"
      />
      <button
        type="submit"
        className="shrink-0 bg-[#2c302e] hover:bg-black text-white p-2 rounded-xl transition-colors"
        title="Jump to this ID"
      >
        <ArrowRight className="w-4 h-4" />
      </button>
      {error && (
        <span className="absolute mt-10 text-[10px] text-rose-500 font-sans">
          {error}
        </span>
      )}
    </form>
  );
}
