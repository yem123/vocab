import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      title="Back to top"
      className="fixed bottom-24 right-4 z-30 w-11 h-11 rounded-full bg-[#2c302e] text-white shadow-lg flex items-center justify-center hover:bg-black transition-colors"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
