import React, { useState } from "react";
import { FileText, PlayCircle } from "lucide-react";
import PdfLibrary from "../media/PdfLibrary";
import VideosScreen from "./VideosScreen";
import { PDFS } from "virtual:media-pdfs";

export default function MediaScreen({ videos, onVideoAdded }) {
  const [tab, setTab] = useState("pdfs"); // pdfs | videos

  const tabs = [
    { id: "pdfs", label: "PDFs", icon: FileText, count: PDFS.length },
    { id: "videos", label: "Videos", icon: PlayCircle, count: videos.length },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-6 pt-2 space-y-3">
        <div className="bg-[#f4f6f4] border border-[#e5eae6] rounded-2xl p-5">
          <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-[#637368]">
            Lernmaterial
          </span>
          <h2 className="text-xl font-serif text-[#2c302e] mt-1">Media</h2>
          <p className="font-sans text-xs text-[#637368] mt-1 leading-relaxed">
            Bücher als PDF und Videos an einem Ort.
          </p>
        </div>

        {/* Segmented tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#f4f3ef] rounded-xl font-sans text-xs">
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all ${
                tab === id
                  ? "bg-white text-[#2c302e] shadow-sm"
                  : "text-[#637368] hover:text-[#2c302e]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
              <span
                className={`min-w-4.5 px-1 rounded-full text-[10px] leading-4.5 ${
                  tab === id ? "bg-[#2c302e] text-white" : "bg-[#e2e7e3]"
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {tab === "pdfs" ? (
        <div className="px-6 pt-3">
          <PdfLibrary />
        </div>
      ) : (
        <VideosScreen videos={videos} onVideoAdded={onVideoAdded} />
      )}
    </div>
  );
}
