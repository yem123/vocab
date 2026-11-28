import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import { Pencil, Trash2, Check, X, ChevronDown } from "lucide-react";
import GermanTextField from "../common/GermanTextField";

const LINE = 28;

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
  open = true,
  onToggle,
  onSave,
  onDelete,
  onCancelNew,
}) {
  const [editing, setEditing] = useState(isNew);
  const [title, setTitle] = useState(note?.title || "");
  const [text, setText] = useState(note?.text || "");
  const [translation, setTranslation] = useState(note?.translation || "");
  const [remark, setRemark] = useState(note?.remark || "");
  const wrapRef = useRef(null);

  const hasTranslation = Boolean(note?.translation);
  const hasRemark = Boolean(note?.remark);

  const resetDrafts = () => {
    setTitle(note?.title || "");
    setText(note?.text || "");
    setTranslation(note?.translation || "");
    setRemark(note?.remark || "");
  };

  // Collapsing another note's neighbour closes this one: leave edit mode
  useEffect(() => {
    if (!open && !isNew) {
      resetDrafts();
      setEditing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useLayoutEffect(() => {
    wrapRef.current?.querySelectorAll("textarea").forEach((el) => {
      el.style.height = "auto";
      const min = Number(el.dataset.min || LINE * 2);
      el.style.height = `${Math.max(el.scrollHeight, min)}px`;
    });
  }, [text, translation, remark, editing, open]);

  const canSave = text.trim().length > 0;

  const save = () => {
    if (!canSave) {
      if (isNew) onCancelNew();
      return;
    }
    onSave({
      title,
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
    resetDrafts();
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

  const firstLine = (note?.text || "").split("\n")[0];

  // ---------- Collapsed row ----------
  if (!open && !isNew) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="relative w-full flex items-center gap-2 bg-[#fffdf5] border border-[#ece6d6] hover:border-[#d9d0b5] rounded-2xl shadow-xs pl-10.5 pr-3 py-3 text-left transition-colors overflow-hidden"
      >
        <div
          className="absolute top-0 bottom-0 w-px bg-[#efc3bb]"
          style={{ left: 30 }}
        />
        <div className="min-w-0 flex-1">
          <p className="font-serif text-base font-bold text-[#2c302e] truncate">
            {note.title || firstLine}
          </p>
          {note.title && firstLine && (
            <p className="font-sans text-xs text-[#8a928e] truncate mt-0.5">
              {firstLine}
            </p>
          )}
        </div>
        <ChevronDown className="w-4 h-4 shrink-0 text-[#8a928e]" />
      </button>
    );
  }

  // ---------- Expanded / editing ----------
  return (
    <div
      className={`relative bg-[#fffdf5] border rounded-2xl shadow-xs overflow-hidden transition-colors ${
        editing ? "border-[#b8ad88]" : "border-[#ece6d6]"
      }`}
    >
      <div
        className="absolute top-0 bottom-0 w-px bg-[#efc3bb]"
        style={{ left: 30 }}
      />

      {/* Margin buttons: same place while reading and writing */}
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
                !canSave ? "opacity-40" : ""
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

      {/* Collapse arrow (reading mode only) */}
      {!editing && !isNew && (
        <button
          type="button"
          onClick={onToggle}
          title="Einklappen"
          className="absolute top-2.5 right-2 p-1 text-[#8a928e] hover:text-[#2c302e]"
        >
          <ChevronDown className="w-4 h-4 rotate-180" />
        </button>
      )}

      <div ref={wrapRef} className="py-2.5 pl-10.5 pr-8">
        {editing ? (
          <>
            <GermanTextField
              type="text"
              autoFocus={isNew}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Titel"
              style={{
                ...ruled,
                display: "block",
                padding: 0,
                height: LINE,
                lineHeight: `${LINE}px`,
              }}
              className={`${fieldClass} font-serif text-base font-bold text-[#2c302e] placeholder:font-normal placeholder:text-[#b8b19a]`}
            />
            <GermanTextField
              as="textarea"
              rows={1}
              autoFocus={!isNew}
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
            {note.title && (
              <p
                onClick={onToggle}
                className="font-serif text-base font-bold text-[#2c302e] wrap-break-word cursor-pointer"
                style={{ lineHeight: `${LINE}px` }}
              >
                {note.title}
              </p>
            )}
            <p
              className="font-serif text-base text-[#2c302e] whitespace-pre-wrap wrap-break-word"
              style={{ lineHeight: `${LINE}px` }}
            >
              {note.text}
            </p>
            {note.translation && (
              <p
                className="font-sans text-xs text-[#637368] whitespace-pre-wrap wrap-break-word"
                style={{ lineHeight: `${LINE}px` }}
              >
                {note.translation}
              </p>
            )}
            {note.remark && (
              <p
                className="font-sans text-xs italic text-[#8a7f5f] whitespace-pre-wrap wrap-break-word"
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
