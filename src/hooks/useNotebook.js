import { useState, useEffect, useMemo } from "react";
import { MY_NOTEBOOK } from "../data/myNotebook";
import { makeNoteId } from "../utils/notebook";

const LAYER_KEY = "lexis_notebook_layer";
const SAVED_KEY = "lexis_notebook_saved";

const BASE = Array.isArray(MY_NOTEBOOK) ? MY_NOTEBOOK : [];
const BASE_BY_ID = new Map(BASE.map((n) => [n.id, n]));

const read = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
};

const sig = (n) =>
  [
    n.id,
    n.title,
    n.text,
    n.translation,
    n.remark,
    n.category,
    n.pinned,
    n.createdAt,
    n.updatedAt,
  ].join("|");
const keyOf = (e) => `${e.id}:${e.updatedAt || ""}:${e.deleted ? 1 : 0}`;

export function useNotebook() {
  const [layer, setLayer] = useState(() => {
    const l = read(LAYER_KEY, []);
    return Array.isArray(l) ? l : [];
  });
  const [savedKeys, setSavedKeys] = useState(
    () => new Set(read(SAVED_KEY, [])),
  );

  useEffect(() => {
    setLayer((prev) => {
      const next = prev.filter((e) => {
        const base = BASE_BY_ID.get(e.id);
        if (e.deleted) return !(!base && savedKeys.has(keyOf(e)));
        return !(base && sig(base) === sig(e));
      });
      return next.length === prev.length ? prev : next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LAYER_KEY, JSON.stringify(layer));
    } catch (e) {
      console.error("Failed to save notebook", e);
    }
  }, [layer]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify([...savedKeys]));
    } catch (e) {
      console.error("Failed to save notebook state", e);
    }
  }, [savedKeys]);

  const notes = useMemo(() => {
    const map = new Map(BASE.map((n) => [n.id, n]));
    layer.forEach((e) => {
      if (e.deleted) {
        map.delete(e.id);
        return;
      }
      const base = map.get(e.id);
      if (!base || (e.updatedAt || "") >= (base.updatedAt || ""))
        map.set(e.id, e);
    });
    return [...map.values()];
  }, [layer]);

  const isSynced = (e) => {
    if (savedKeys.has(keyOf(e))) return true;
    const base = BASE_BY_ID.get(e.id);
    return !e.deleted && base && sig(base) === sig(e);
  };

  const unsavedCount = layer.filter((e) => !isSynced(e)).length;

  const upsert = (note) =>
    setLayer((prev) => [note, ...prev.filter((e) => e.id !== note.id)]);

    const clean = (d) => ({
      title: String(d.title || "").trim(),
      text: String(d.text || "").trim(),
      translation: String(d.translation || "").trim(),
      remark: String(d.remark || "").trim(),
      category: d.category || "Satz",
    });

  const addNote = (data) => {
    const now = new Date().toISOString();
    upsert({
      id: makeNoteId(),
      ...clean(data),
      pinned: false,
      createdAt: now,
      updatedAt: now,
    });
  };

  const updateNote = (id, data) => {
    const cur = notes.find((n) => n.id === id);
    if (!cur) return;
    upsert({ ...cur, ...clean(data), updatedAt: new Date().toISOString() });
  };

  const deleteNote = (id) => {
    const wasSaved = [...savedKeys].some((k) => k.startsWith(`${id}:`));
    if (BASE_BY_ID.has(id) || wasSaved) {
      // GitHub may already have it, so keep a tombstone until the next save
      const tomb = { id, deleted: true, updatedAt: new Date().toISOString() };
      setLayer((prev) => [tomb, ...prev.filter((e) => e.id !== id)]);
    } else {
      setLayer((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const buildNotesPayload = () => {
    const dirty = layer.filter((e) => !isSynced(e));
    if (dirty.length === 0) return null;
    return {
      notes: dirty.filter((e) => !e.deleted),
      deletedIds: dirty.filter((e) => e.deleted).map((e) => e.id),
      keys: dirty.map(keyOf),
    };
  };

  const markNotesSaved = (payload) => {
    if (!payload?.keys) return;
    setSavedKeys((prev) => new Set([...prev, ...payload.keys]));
  };

  return {
    notes,
    unsavedCount,
    addNote,
    updateNote,
    deleteNote,
    buildNotesPayload,
    markNotesSaved,
  };
}
