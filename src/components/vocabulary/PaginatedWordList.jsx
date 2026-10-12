import React, { useRef, useEffect, useState } from "react";
import WordCard from "./WordCard";
import JumpToIdBar from "./JumpToIdBar";
import ScrollToTopButton from "./ScrollToTopButton";

const PAGE_SIZE = 100;

export default function PaginatedWordList({
  items,
  setSelectedWordId,
  navigateTo,
  toggleFavorite,
  visibleCount,
  setVisibleCount,
  scrollY,
  emptyState,
}) {
  const wordRefs = useRef({});
  const [highlightId, setHighlightId] = useState(null);
  const hasRestoredScroll = useRef(false);

  // Restore the saved scroll position once, instantly (not smooth — smooth
  // scroll over a large distance can take seconds and looks like it's stuck)
  useEffect(() => {
    if (hasRestoredScroll.current) return;
    if (scrollY <= 0) {
      hasRestoredScroll.current = true;
      return;
    }

    let cancelled = false;
    const tryRestore = (attemptsLeft) => {
      if (cancelled) return;
      const pageHeight = document.documentElement.scrollHeight;
      if (pageHeight >= scrollY + window.innerHeight || attemptsLeft <= 0) {
        window.scrollTo({ top: scrollY, left: 0, behavior: "instant" });
        hasRestoredScroll.current = true;
        return;
      }
      requestAnimationFrame(() => tryRestore(attemptsLeft - 1));
    };

    requestAnimationFrame(() => tryRestore(40));
    return () => {
      cancelled = true;
    };
  }, [scrollY]);

  const visibleWords = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  const handleJump = (id) => {
    const index = items.findIndex((w) => w.id === id);
    if (index === -1) return false;

    const neededCount = Math.ceil((index + 1) / PAGE_SIZE) * PAGE_SIZE;
    if (neededCount > visibleCount) {
      setVisibleCount(neededCount);
    }

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

  if (items.length === 0) {
    return emptyState || null;
  }

  return (
    <div className="space-y-2 pt-1">
      <ScrollToTopButton />

      <div className="sticky top-16 z-20 bg-[#fcfbf9]/95 backdrop-blur pb-2 pt-1 -mx-6 px-6">
        <JumpToIdBar onJump={handleJump} />
      </div>

      {visibleWords.map((item) => (
        <div
          key={item.id}
          ref={(el) => (wordRefs.current[item.id] = el)}
          className={`rounded-2xl transition-shadow ${
            highlightId === item.id ? "ring-2 ring-[#637368] ring-offset-2" : ""
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
          Showing {visibleWords.length} of {items.length}
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
    </div>
  );
}
