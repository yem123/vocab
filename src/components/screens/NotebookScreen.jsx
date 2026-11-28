import React, { useMemo, useState } from "react";
import { Search, NotebookPen, Plus } from "lucide-react";
import GermanTextField from "../common/GermanTextField";
import SaveToGithubButton from "../collections/SaveToGithubButton";
import NotePaper from "../notebook/NotePaper";

export default function NotebookScreen({
  notes,
  unsavedCount,
  addNote,
  updateNote,
  deleteNote,
  buildNotesPayload,
  markNotesSaved,
}) {
  const [query, setQuery] = useState("");
  const [composing, setComposing] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes
      .filter(
        (n) =>
          !q ||
          n.text.toLowerCase().includes(q) ||
          (n.translation || "").toLowerCase().includes(q) ||
          (n.remark || "").toLowerCase().includes(q),
      )
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  }, [notes, query]);

  const handleDelete = (id) => {
    if (confirm("Diese Notiz wirklich löschen?")) deleteNote(id);
  };

  return (
    <div className="flex-1 flex flex-col px-6 py-2 space-y-3">
      {/* Header */}
      <div className="bg-[#f4f6f4] border border-[#e5eae6] rounded-2xl p-5">
        <div className="flex justify-between items-center">
          <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-[#637368]">
            Meine Notizen
          </span>
          <div className="flex items-center gap-1.5">
            {unsavedCount > 0 && (
              <span className="font-sans text-[11px] font-semibold bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full">
                {unsavedCount} nicht gespeichert
              </span>
            )}
            <span className="font-sans text-xs font-semibold bg-[#e2e7e3] text-[#4a5750] px-2.5 py-0.5 rounded-full">
              {notes.length}
            </span>
          </div>
        </div>
        <h2 className="text-xl font-serif text-[#2c302e] mt-1">Notizbuch</h2>
        <p className="font-sans text-xs text-[#637368] mt-1 leading-relaxed">
          Sätze, Redewendungen und alles, was du dir merken willst.
        </p>
      </div>

      <SaveToGithubButton
        notesOnly
        buildNotesPayload={buildNotesPayload}
        onNotesSaved={markNotesSaved}
      />

      {/* Search + new note */}
      <div className="flex items-start gap-2">
        <GermanTextField
          wrapperClassName="flex-1 min-w-0"
          icon={
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8a928e]" />
          }
          type="text"
          placeholder="Notizen durchsuchen..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full font-sans bg-[#f9f9f7] border border-[#e8e5e0] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#637368] placeholder:text-[#9ea6a1]"
        />
        <button
          type="button"
          onClick={() => setComposing(true)}
          disabled={composing}
          title="Neue Notiz"
          className="shrink-0 w-11.5 h-11.5 rounded-xl bg-[#2c302e] hover:bg-black text-white flex items-center justify-center transition-colors disabled:opacity-40"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* A blank page, written on right in the list */}
      {composing && (
        <NotePaper
          isNew
          note={null}
          onSave={(data) => {
            addNote(data);
            setComposing(false);
          }}
          onCancelNew={() => setComposing(false)}
        />
      )}

      {notes.length === 0 && !composing ? (
        <div className="text-center py-12 px-6 border border-dashed border-[#e2e7e3] rounded-2xl">
          <NotebookPen className="w-6 h-6 text-[#b8c2bc] mx-auto mb-2" />
          <p className="font-sans text-sm text-[#767d78]">
            Noch keine Notizen.
          </p>
          <p className="font-sans text-xs text-[#8a928e] mt-1">
            Tippe auf „+“, um deine erste Notiz zu schreiben.
          </p>
        </div>
      ) : list.length === 0 && notes.length > 0 ? (
        <div className="text-center py-10 border border-dashed border-[#e2e7e3] rounded-2xl">
          <p className="font-sans text-sm text-[#767d78]">Nichts gefunden.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {list.map((n) => (
            <NotePaper
              key={n.id}
              note={n}
              onSave={(data) => updateNote(n.id, data)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
