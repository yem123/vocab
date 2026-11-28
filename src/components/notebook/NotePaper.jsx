import React, { useState, useLayoutEffect, useRef } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import GermanTextField from "../common/GermanTextField";

const LINE = 28; // line height in px, same for reading and writing

const ruled = {
  backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${LINE - 1}px, #ece6d6 ${LINE - 1}px, #ece6d6 ${LINE}px)`,
};

const fieldStyle = {
  ...ruled,
  display: "block",
  padding: 0,
  lineHeight: `${LINE}px`,
  overflow: "hidden",
};

const iconBtn =
  "h-7 w-full flex items-center justify-center text-[#8a928e] hover:text-[#2c302e] transition-colors";

export default function NotePaper({
  note, // null for a new note
  isNew = false,
  onSave,
  onDelete,
  onCancelNew,
}) {
  const [editing, setEditing] = useState(isNew);
  const [text, setText] = useState(note?.text || "");
  const [translation, setTranslation] = useState(note?.translation || "");
  const [remark, setRemark] = useState(note?.remark || "");
  const wrapRef = useRef(null);

  // Optional lines only show while editing if the note already has them
  const hasTranslation = Boolean(note?.translation);
  const hasRemark = Boolean(note?.remark);

  // Grow every text field to fit its text, in whole ruled lines
  useLayoutEffect(() => {
    wrapRef.current?.querySelectorAll("textarea").forEach((el) => {
      el.style.height = "auto";
      const min = Number(el.dataset.min || LINE * 2);
      el.style.height = `${Math.max(el.scrollHeight, min)}px`;
    });
  }, [text, translation, remark, editing]);

  const save = () => {
    if (!text.trim()) {
      if (isNew) onCancelNew();
      return;
    }
    onSave({
      text,
      translation,
      remark,
      category: note?.category || "Satz",
    });
    if (!isNew) setEditing(false);
  };

  const cancel = () => {
    if (isNew) {
      onCancelNew();
      return;
    }
    setText(note.text || "");
    setTranslation(note.translation || "");
    setRemark(note.remark || "");
    setEditing(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") cancel();
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") save();
  };

  const toEnd = (e) => {
    const l = e.target.value.length;
    e.target.setSelectionRange(l, l);
  };

  const fieldClass =
    "w-full bg-transparent border-none focus:outline-none resize-none break-words";

  return (
    <div
      className={`relative bg-[#fffdf5] border rounded-2xl shadow-xs overflow-hidden transition-colors ${
        editing ? "border-[#b8ad88]" : "border-[#ece6d6]"
      }`}
    >
      {/* Red margin line */}
      <div
        className="absolute top-0 bottom-0 w-px bg-[#efc3bb]"
        style={{ left: 30 }}
      />

      {/* Buttons in the margin: same place while reading and writing */}
      <div
        className="absolute top-2.5 left-0 flex flex-col"
        style={{ width: 30 }}
      >
        {editing ? (
          <>
            <button
              type="button"
              onClick={save}
              title="Speichern (Strg+Enter)"
              className={`${iconBtn} text-[#435249] hover:text-black ${
                !text.trim() ? "opacity-40" : ""
              }`}
            >
              <Check className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={cancel}
              title="Abbrechen (Esc)"
              className={iconBtn}
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setEditing(true)}
              title="Bearbeiten"
              className={iconBtn}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(note.id)}
              title="Löschen"
              className={`${iconBtn} hover:text-rose-500`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      <div ref={wrapRef} className="py-2.5 pl-10.5 pr-6">
        {editing ? (
          <>
            <GermanTextField
              as="textarea"
              rows={1}
              autoFocus
              data-min={LINE * 2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={toEnd}
              placeholder="Schreib hier…"
              style={fieldStyle}
              className={`${fieldClass} font-serif text-base text-[#2c302e] placeholder:text-[#b8b19a]`}
            />
            {hasTranslation && (
              <GermanTextField
                as="textarea"
                rows={1}
                specialChars={false}
                data-min={LINE}
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Übersetzung"
                style={fieldStyle}
                className={`${fieldClass} font-sans text-xs text-[#637368] placeholder:text-[#b8b19a]`}
              />
            )}
            {hasRemark && (
              <GermanTextField
                as="textarea"
                rows={1}
                data-min={LINE}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Bemerkung"
                style={fieldStyle}
                className={`${fieldClass} font-sans text-xs italic text-[#8a7f5f] placeholder:text-[#b8b19a]`}
              />
            )}
          </>
        ) : (
          <div style={ruled}>
            <p
              className="font-serif text-base text-[#2c302e] whitespace-pre-wrap wrap-break"
              style={{ lineHeight: `${LINE}px` }}
            >
              {note.text}
            </p>
            {note.translation && (
              <p
                className="font-sans text-xs text-[#637368] whitespace-pre-wrap wrap-break"
                style={{ lineHeight: `${LINE}px` }}
              >
                {note.translation}
              </p>
            )}
            {note.remark && (
              <p
                className="font-sans text-xs italic text-[#8a7f5f] whitespace-pre-wrap wrap-break"
                style={{ lineHeight: `${LINE}px` }}
              >
                {note.remark}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
