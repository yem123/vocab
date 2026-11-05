import React, { useMemo, useState } from "react";
import {
  FileText,
  Download,
  Search,
  ChevronRight,
  FolderOpen,
} from "lucide-react";
import { PDFS } from "virtual:media-pdfs";

const prettify = (name) =>
  name.replace(/[_]+/g, " ").replace(/\s+/g, " ").trim();

const formatSize = (bytes) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const href = (p) => `${import.meta.env.BASE_URL}${p.url}`;

function PdfCard({ pdf }) {
  return (
    <div className="group flex items-center gap-3 bg-white border border-[#f0eee9] hover:border-[#d0d7d3] rounded-2xl p-3 shadow-xs transition-all">
      <a
        href={href(pdf)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 min-w-0 flex-1"
      >
        {/* Document-style tile */}
        <div className="relative w-11 h-14 shrink-0 rounded-lg bg-[#f8ede9] border border-[#efd9d1] flex items-center justify-center">
          <FileText className="w-5 h-5 text-[#b5513a]" />
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#b5513a] text-white font-sans text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded">
            PDF
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-serif text-[15px] leading-snug text-[#2c302e] group-hover:text-[#435249] line-clamp-2">
            {prettify(pdf.name)}
          </p>
          <p className="font-sans text-[11px] text-[#8a928e] mt-1">
            {formatSize(pdf.size)} · {formatDate(pdf.modified)}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-[#a8b0ac] group-hover:text-[#2c302e] shrink-0 transition-transform group-hover:translate-x-0.5" />
      </a>

      <a
        href={href(pdf)}
        download
        title="Download"
        className="shrink-0 p-2 rounded-full bg-[#f4f3ef] hover:bg-[#eae7e2] text-[#637368]"
      >
        <Download className="w-4 h-4" />
      </a>
    </div>
  );
}

export default function PdfLibrary() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("name"); // name | recent | size

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = PDFS.filter(
      (p) =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.folder.toLowerCase().includes(q),
    ).sort((a, b) => {
      if (sort === "recent") return b.modified.localeCompare(a.modified);
      if (sort === "size") return b.size - a.size;
      return a.name.localeCompare(b.name, "de", { numeric: true });
    });

    const map = new Map();
    list.forEach((p) => {
      const key = p.folder || "";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    });
    // Files in the root first, then folders A–Z
    return [...map.entries()].sort(([a], [b]) =>
      a === "" ? -1 : b === "" ? 1 : a.localeCompare(b, "de"),
    );
  }, [query, sort]);

  const total = PDFS.length;
  const shown = groups.reduce((n, [, items]) => n + items.length, 0);

  if (total === 0) {
    return (
      <div className="text-center py-12 px-6 border border-dashed border-[#e2e7e3] rounded-2xl">
        <FileText className="w-6 h-6 text-[#b8c2bc] mx-auto mb-2" />
        <p className="font-sans text-sm text-[#767d78]">Keine PDFs gefunden.</p>
        <p className="font-sans text-xs text-[#8a928e] mt-1">
          Put .pdf files into the <code>public</code> folder and restart.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8a928e]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="PDF suchen..."
          className="w-full font-sans bg-[#f9f9f7] border border-[#e8e5e0] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#637368] placeholder:text-[#9ea6a1]"
        />
      </div>

      <div className="flex items-center justify-between gap-2 font-sans text-xs">
        <div className="flex gap-2">
          {[
            ["name", "A–Z"],
            ["recent", "Neueste"],
            ["size", "Größe"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setSort(id)}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
                sort === id
                  ? "bg-[#2c302e] text-white shadow-sm"
                  : "bg-[#f4f3ef] text-[#637368] hover:bg-[#eae7e2]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-[#8a928e]">
          {shown} / {total}
        </span>
      </div>

      {shown === 0 ? (
        <div className="text-center py-10 border border-dashed border-[#e2e7e3] rounded-2xl">
          <p className="font-sans text-sm text-[#767d78]">Nichts gefunden.</p>
        </div>
      ) : (
        groups.map(([folder, items]) => (
          <section key={folder || "root"} className="space-y-2">
            {folder && (
              <h3 className="flex items-center gap-1.5 pt-1 font-sans text-[10px] uppercase font-bold tracking-wider text-[#637368]">
                <FolderOpen className="w-3.5 h-3.5" />
                {folder}
                <span className="font-semibold text-[#8a928e]">
                  · {items.length}
                </span>
              </h3>
            )}
            {items.map((p) => (
              <PdfCard key={`${folder}/${p.name}`} pdf={p} />
            ))}
          </section>
        ))
      )}
    </div>
  );
}
