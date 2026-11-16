import React, { useMemo, useState } from "react";
import {
  FileText,
  Download,
  Search,
  ChevronRight,
  Folder,
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

const countFiles = (node) =>
  node.files.length +
  [...node.folders.values()].reduce((n, f) => n + countFiles(f), 0);

function PdfCard({ pdf }) {
  return (
    <div className="group flex items-center gap-3 bg-white border border-[#f0eee9] hover:border-[#d0d7d3] rounded-2xl p-3 shadow-xs transition-all">
      <a
        href={href(pdf)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 min-w-0 flex-1"
      >
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

function FolderRow({ node, depth, open, onToggle, children }) {
  const total = countFiles(node);
  const subCount = node.folders.size;

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`w-full flex items-center gap-3 rounded-2xl border text-left transition-all ${
          depth === 0 ? "p-3" : "px-3 py-2.5"
        } ${
          open
            ? "bg-[#f4f6f4] border-[#b8c2bc] shadow-sm"
            : "bg-white border-[#f0eee9] hover:border-[#d0d7d3] shadow-xs"
        }`}
      >
        <div
          className={`shrink-0 rounded-xl flex items-center justify-center transition-colors ${
            depth === 0 ? "w-10 h-10" : "w-8 h-8"
          } ${open ? "bg-[#435249] text-white" : "bg-[#f4f6f4] text-[#4a5750]"}`}
        >
          {open ? (
            <FolderOpen className={depth === 0 ? "w-5 h-5" : "w-4 h-4"} />
          ) : (
            <Folder className={depth === 0 ? "w-5 h-5" : "w-4 h-4"} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`font-serif text-[#2c302e] truncate ${
              depth === 0 ? "text-base" : "text-[15px]"
            }`}
          >
            {prettify(node.name)}
          </p>
          <p className="font-sans text-[11px] text-[#8a928e] mt-0.5">
            {total} {total === 1 ? "PDF" : "PDFs"}
            {subCount > 0 &&
              ` · ${subCount} ${subCount === 1 ? "Ordner" : "Ordner"}`}
          </p>
        </div>

        <ChevronRight
          className={`w-4 h-4 shrink-0 text-[#8a928e] transition-transform duration-200 ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>

      {open && (
        <div className="animate-fade-in ml-5 pl-3 mt-2 space-y-2 border-l-2 border-[#dfe5e1]">
          {children}
        </div>
      )}
    </div>
  );
}

export default function PdfLibrary() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("name"); // name | recent | size
  // One open folder per level: { [parentPath]: openChildPath }
  const [openMap, setOpenMap] = useState({});

  const searching = query.trim().length > 0;

  const { tree, shown } = useMemo(() => {
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

    const root = { name: "", path: "", folders: new Map(), files: [] };
    list.forEach((p) => {
      let node = root;
      if (p.folder) {
        let path = "";
        p.folder.split("/").forEach((seg) => {
          path = path ? `${path}/${seg}` : seg;
          if (!node.folders.has(seg)) {
            node.folders.set(seg, {
              name: seg,
              path,
              folders: new Map(),
              files: [],
            });
          }
          node = node.folders.get(seg);
        });
      }
      node.files.push(p);
    });

    return { tree: root, shown: list.length };
  }, [query, sort]);

  const toggle = (parentPath, childPath) => {
    setOpenMap((prev) => {
      const next = { ...prev };
      const current = prev[parentPath];
      // Collapse the folder that was open and everything inside it
      const closeBranch = (path) => {
        Object.keys(next).forEach((k) => {
          if (k === path || k.startsWith(path + "/")) delete next[k];
        });
      };
      if (current) closeBranch(current);
      if (current === childPath) {
        delete next[parentPath];
      } else {
        next[parentPath] = childPath;
      }
      return next;
    });
  };

  const renderLevel = (node, depth) => {
    const folders = [...node.folders.values()].sort((a, b) =>
      a.name.localeCompare(b.name, "de", { numeric: true }),
    );
    return (
      <>
        {folders.map((f) => (
          <FolderRow
            key={f.path}
            node={f}
            depth={depth}
            // While searching, every matching folder is shown open
            open={searching || openMap[node.path] === f.path}
            onToggle={() => toggle(node.path, f.path)}
          >
            {renderLevel(f, depth + 1)}
          </FolderRow>
        ))}
        {node.files.map((p) => (
          <PdfCard key={p.url} pdf={p} />
        ))}
      </>
    );
  };

  const total = PDFS.length;

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
        <div className="space-y-2">{renderLevel(tree, 0)}</div>
      )}
    </div>
  );
}
