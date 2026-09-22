import React from "react";

export default function WordNavigationFooter({
  activeWord,
  vocabulary,
  setSelectedWordId,
}) {
  return (
    <div className="pt-2 flex gap-3">
      <button
        onClick={() => {
          const currentIndex = vocabulary.findIndex(
            (w) => w.id === activeWord.id,
          );
          const prevIndex =
            (currentIndex - 1 + vocabulary.length) % vocabulary.length;
          setSelectedWordId(vocabulary[prevIndex].id);
        }}
        className="flex-1 bg-[#f4f3ef] hover:bg-[#eae7e2] text-[#2c302e] py-3 rounded-xl font-sans text-xs font-bold transition-colors"
      >
        ← Vorheriges Wort
      </button>
      <button
        onClick={() => {
          const currentIndex = vocabulary.findIndex(
            (w) => w.id === activeWord.id,
          );
          const nextIndex = (currentIndex + 1) % vocabulary.length;
          setSelectedWordId(vocabulary[nextIndex].id);
        }}
        className="flex-1 bg-[#2c302e] hover:bg-black text-white py-3 rounded-xl font-sans text-xs font-bold transition-colors shadow-xs"
      >
        Nächstes Wort →
      </button>
    </div>
  );
}
