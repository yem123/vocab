import React, { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { exportBackup, parseBackup } from "../../utils/backup";

export default function BackupControls({ vocabulary, themes, onImport }) {
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleExport = () => {
    exportBackup(vocabulary, themes);
    setIsError(false);
    setMessage(`${vocabulary.length} Wörter exportiert.`);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseBackup(text);
      const { added, skipped } = onImport(parsed);
      setIsError(false);
      setMessage(
        `${added} Wörter importiert, ${skipped} Duplikate übersprungen.`,
      );
    } catch (err) {
      setIsError(true);
      setMessage(err.message || "Import fehlgeschlagen.");
    }
    // Reset so the same file can be selected again
    e.target.value = "";
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 font-sans text-xs">
        <button
          type="button"
          onClick={handleExport}
          disabled={vocabulary.length === 0}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#f4f3ef] hover:bg-[#eae7e2] text-[#2c302e] py-2 rounded-xl font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download className="w-3.5 h-3.5" /> Export
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#f4f3ef] hover:bg-[#eae7e2] text-[#2c302e] py-2 rounded-xl font-semibold transition-colors"
        >
          <Upload className="w-3.5 h-3.5" /> Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {message && (
        <p
          className={`font-sans text-[11px] px-1 ${isError ? "text-rose-500" : "text-[#637368]"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
