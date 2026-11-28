import React, { useState } from "react";
import GermanTextField from "../common/GermanTextField";

export default function NoteComposer({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Speichern",
}) {
  const [text, setText] = useState(initial?.text || "");
  const [translation, setTranslation] = useState(initial?.translation || "");

  const canSave = text.trim().length > 0;

  const submit = () => {
    if (!canSave) return;
    onSubmit({ text, translation });
  };

  return (
    <div className="bg-[#e8ecef] border border-[#e6dfc9] rounded-2xl p-3.5 shadow-sm space-y-2.5">
      <GermanTextField
        as="textarea"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Satz oder Redewendung schreiben…"
        className="w-full bg-transparent border-none text-[15px] font-serif text-[#2c302e] focus:outline-none resize-none placeholder:text-[#9aafb8]"
      />
        <div className="space-y-2">
          <GermanTextField
            type="text"
            specialChars={false}
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder="English translation (optional)"
            className="w-full bg-white border border-[#ece6d6] rounded-lg px-3 py-2 text-xs font-sans text-[#2c302e] focus:outline-none focus:border-[#637368] placeholder:text-[#b8b19a]"
          />
        </div>

      <div className="flex gap-2 pt-1 font-sans text-xs">
        <button
          type="button"
          onClick={submit}
          disabled={!canSave}
          className="flex-1 bg-[#2c302e] hover:bg-black text-white py-2 rounded-lg font-semibold transition-colors disabled:opacity-40"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white border border-[#e8e5e0] text-[#637368] py-2 rounded-lg font-semibold"
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
}
