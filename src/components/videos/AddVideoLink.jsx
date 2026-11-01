import React, { useState } from "react";
import { Link2, Check } from "lucide-react";
import { saveVideoToGithub } from "../../utils/saveVideoToGithub";

export default function AddVideoLink({ onAdded }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | saving | success | error
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState("");

  const handleAdd = async () => {
    setStatus("saving");
    setMessage("");
    const d = duration.trim();
    if (d && !/^(\d{1,2}:[0-5]\d:[0-5]\d|\d{1,3}:[0-5]\d)$/.test(d)) {
      setStatus("error");
      setMessage("Duration must look like 12:34 or 1:02:03");
      return;
    }
    try {
      const video = await saveVideoToGithub(password.trim(), url.trim(), d);
      onAdded(video);
      setStatus("success");
      setMessage(`Added: ${video.title}`);
      setUrl("");
      setPassword("");
      setOpen(false);
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Could not add video.");
    }
  };

  return (
    <div className="space-y-2">
      {!open ? (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setStatus("idle");
            setMessage("");
          }}
          className="w-full flex items-center justify-center gap-1.5 bg-[#2c302e] hover:bg-black text-white py-2.5 rounded-xl font-sans text-xs font-semibold transition-colors"
        >
          <Link2 className="w-3.5 h-3.5" /> Add link
        </button>
      ) : (
        <div className="bg-[#f4f3ef] border border-[#e8e5e0] rounded-xl p-3 space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube link…"
              className="flex-1 min-w-0 font-sans bg-white border border-[#e8e5e0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#637368]"
            />
            <input
              type="text"
              inputMode="numeric"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="12:34"
              className="w-20 shrink-0 font-sans bg-white border border-[#e8e5e0] rounded-lg px-3 py-2 text-xs text-center focus:outline-none focus:border-[#637368]"
            />
          </div>
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
              onClick={handleAdd}
              disabled={status === "saving" || !url.trim() || !password}
              className="flex-1 bg-[#2c302e] hover:bg-black text-white py-2 rounded-lg font-sans text-xs font-semibold transition-colors disabled:opacity-40"
            >
              {status === "saving" ? "Adding..." : "Add"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setUrl("");
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
