import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss(), mediaPdfs()],
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});

function mediaPdfs() {
  const virtualId = "virtual:media-pdfs";
  const resolvedId = "\0" + virtualId;
  const publicDir = path.resolve(process.cwd(), "public");

  const scan = (dir, base = "") => {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const rel = base ? `${base}/${entry.name}` : entry.name;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return scan(full, rel);
      if (!/\.pdf$/i.test(entry.name)) return [];
      const stat = fs.statSync(full);
      return [
        {
          name: entry.name.replace(/\.pdf$/i, ""),
          folder: base,
          url: rel.split("/").map(encodeURIComponent).join("/"),
          size: stat.size,
          modified: stat.mtime.toISOString(),
        },
      ];
    });
  };

  return {
    name: "media-pdfs",
    resolveId(id) {
      if (id === virtualId) return resolvedId;
    },
    load(id) {
      if (id === resolvedId) {
        return `export const PDFS = ${JSON.stringify(scan(publicDir))};`;
      }
    },
    configureServer(server) {
      server.watcher.add(publicDir);
      const reload = (file) => {
        if (!/\.pdf$/i.test(file)) return;
        const mod = server.moduleGraph.getModuleById(resolvedId);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", reload);
      server.watcher.on("unlink", reload);
    },
  };
}