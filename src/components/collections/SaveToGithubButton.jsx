import React, { useState } from "react";
import { UploadCloud, Check, Trash2 } from "lucide-react";
import { saveFavoritesToGithub } from "../../utils/saveFavoritesToGithub";
import { saveNotesToGithub } from "../../utils/saveNotesToGithub";

export default function SaveToGithubButton({
  buildGithubSyncPayload,
  clearSyncedLocalChanges,
  buildNotesPayload,
  onNotesSaved,
  notesOnly = false,
}) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | saving | success | error
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setStatus("saving");
    setMessage("");
    try {
      const filesChanges =
        !notesOnly && buildGithubSyncPayload ? buildGithubSyncPayload() : {};
      const notesPayload = buildNotesPayload ? buildNotesPayload() : null;

      const hasVocab = Object.keys(filesChanges).length > 0;
      const hasNotes =
        notesPayload &&
        notesPayload.notes.length + notesPayload.deletedIds.length > 0;

      if (!hasVocab && !hasNotes) {
        setStatus("idle");
        setMessage("Nothing to save.");
        return;
      }

      const parts = [];

      if (hasVocab) {
        const data = await saveFavoritesToGithub(password, filesChanges);
        const n = Object.values(data.results || {}).filter(
          (r) => r.updated,
        ).length;
        parts.push(
          n > 0
            ? `${n} vocabulary file${n === 1 ? "" : "s"} committed`
            : "vocabulary already up to date",
        );
      }

      if (hasNotes) {
        const r = await saveNotesToGithub(password, notesPayload);
        if (onNotesSaved) onNotesSaved(notesPayload);
        parts.push(
          r.unchanged ? "notes already up to date" : "notes committed",
        );
      }

      setStatus("success");
      setMessage(parts.join(" · ") + ".");
      setPassword("");
      setShowPrompt(false);
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Could not save.");
    }
  };

  const handleClear = () => {
    if (
      !confirm(
        "Remove local changes that already match the deployed version? Only do this after your last save has finished redeploying.",
      )
    )
      return;
    const removed = clearSyncedLocalChanges();
    setStatus("idle");
    setMessage(
      removed > 0
        ? `Cleared ${removed} synced local change${removed === 1 ? "" : "s"}.`
        : "Nothing to clear, no synced duplicates found.",
    );
  };

  return (
    <div className="space-y-2">
      {!showPrompt ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setShowPrompt(true);
              setStatus("idle");
              setMessage("");
            }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#2c302e] hover:bg-black text-white py-2.5 rounded-xl font-sans text-xs font-semibold transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5" /> Save
          </button>
          {clearSyncedLocalChanges && !notesOnly && (
            <button
              type="button"
              onClick={handleClear}
              title="Remove local overrides already reflected in the deployed data"
              className="flex items-center justify-center gap-1.5 bg-[#f4f3ef] hover:bg-[#eae7e2] text-[#637368] px-3.5 py-2.5 rounded-xl font-sans text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear synced
            </button>
          )}
        </div>
      ) : (
        <div className="bg-[#f4f3ef] border border-[#e8e5e0] rounded-xl p-3 space-y-2">
          <p className="font-sans text-[11px] text-[#637368]">
            {notesOnly
              ? "Enter the password to save your notebook to GitHub."
              : "Enter the password to save your vocabulary changes and notes to GitHub."}
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full font-sans bg-white border border-[#e8e5e0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#637368]"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={status === "saving" || !password}
              className="flex-1 bg-[#2c302e] hover:bg-black text-white py-2 rounded-lg font-sans text-xs font-semibold transition-colors disabled:opacity-40"
            >
              {status === "saving" ? "Saving..." : "Confirm"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowPrompt(false);
                setPassword("");
              }}
              className="flex-1 bg-white border border-[#e8e5e0] text-[#637368] py-2 rounded-lg font-sans text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {message && (
        <p
          className={`font-sans text-[11px] px-1 flex items-center gap-1 ${
            status === "success" ? "text-[#526859]" : "text-rose-500"
          }`}
        >
          {status === "success" && <Check className="w-3 h-3" />}
          {message}
        </p>
      )}
    </div>
  );
}
