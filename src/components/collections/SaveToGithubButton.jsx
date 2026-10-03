import React, { useState } from "react";
import { UploadCloud, Check } from "lucide-react";
import { saveFavoritesToGithub } from "../../utils/saveFavoritesToGithub";

export default function SaveToGithubButton({ favoriteVocabulary }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | saving | success | error
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setStatus("saving");
    setMessage("");
    try {
      const result = await saveFavoritesToGithub(password, favoriteVocabulary);
      setStatus("success");
      setMessage(`Saved ${result.count} words to GitHub.`);
      setPassword("");
      setShowPrompt(false);
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Could not save.");
    }
  };

  return (
    <div className="space-y-2">
      {!showPrompt ? (
        <button
          type="button"
          onClick={() => {
            setShowPrompt(true);
            setStatus("idle");
            setMessage("");
          }}
          disabled={favoriteVocabulary.length === 0}
          className="w-full flex items-center justify-center gap-1.5 bg-[#2c302e] hover:bg-black text-white py-2.5 rounded-xl font-sans text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <UploadCloud className="w-3.5 h-3.5" /> Save
        </button>
      ) : (
        <div className="bg-[#f4f3ef] border border-[#e8e5e0] rounded-xl p-3 space-y-2">
          <p className="font-sans text-[11px] text-[#637368]">
            Enter the password to commit {favoriteVocabulary.length} favorites
            to GitHub.
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
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#2c302e] hover:bg-black text-white py-2 rounded-lg font-sans text-xs font-semibold transition-colors disabled:opacity-40"
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
