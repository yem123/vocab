import React, { useRef } from "react";
import WordCard from "./WordCard";
import JumpToIdBar from "./JumpToIdBar";
import ScrollToTopButton from "./ScrollToTopButton";

const PAGE_SIZE = 100;

export default function VocabularyList({
  filteredVocabulary,
  setSelectedWordId,
  navigateTo,
  toggleFavorite,
  visibleCount,
  setVisibleCount,
}) {
  const wordRefs = useRef({});
  const [highlightId, setHighlightId] = React.useState(null);

  const visibleWords = filteredVocabulary.slice(0, visibleCount);
  const hasMore = visibleCount < filteredVocabulary.length;

  const handleJump = (id) => {
    const index = filteredVocabulary.findIndex((w) => w.id === id);
    if (index === -1) return false;

    // Make sure enough pages are loaded so the target word is actually rendered
    const neededCount = Math.ceil((index + 1) / PAGE_SIZE) * PAGE_SIZE;
    if (neededCount > visibleCount) {
      setVisibleCount(neededCount);
    }

    // Wait a tick for the DOM to render the newly-loaded words, then scroll
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = wordRefs.current[id];
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          setHighlightId(id);
          setTimeout(() => setHighlightId(null), 1500);
        }
      });
    });

    return true;
  };

  return (
    <div className="space-y-2 pt-1">
      <ScrollToTopButton />

      {filteredVocabulary.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-[#e2e7e3] rounded-2xl">
          <p className="font-sans text-sm text-[#767d78]">
            Keine Vokabeln gefunden.
          </p>
          <button
            onClick={() => navigateTo("add", "slide_up")}
            className="mt-2 font-sans text-xs font-bold text-[#435249] underline"
          >
            Wort hinzufügen
          </button>
        </div>
      ) : (
        <>
          <div className="sticky top-16 z-20 bg-[#fcfbf9]/95 backdrop-blur pb-2 pt-1 -mx-6 px-6">
            <JumpToIdBar onJump={handleJump} />
          </div>

          {visibleWords.map((item) => (
            <div
              key={item.id}
              ref={(el) => (wordRefs.current[item.id] = el)}
              className={`rounded-2xl transition-shadow ${
                highlightId === item.id
                  ? "ring-2 ring-[#637368] ring-offset-2"
                  : ""
              }`}
            >
              <WordCard
                item={item}
                setSelectedWordId={setSelectedWordId}
                navigateTo={navigateTo}
                toggleFavorite={toggleFavorite}
              />
            </div>
          ))}

          <div className="pt-2 pb-1 text-center font-sans">
            <p className="text-[11px] text-[#8a928e] mb-2">
              Showing {visibleWords.length} of {filteredVocabulary.length}
            </p>
            {hasMore && (
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="bg-[#f4f3ef] hover:bg-[#eae7e2] text-[#2c302e] px-5 py-2 rounded-full text-xs font-bold transition-colors"
              >
                Load 100 more
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
