import React, { useRef, useState, useLayoutEffect } from "react";

const GERMAN_CHARS = ["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü", "„", "“"];

/**
 * Drop-in replacement for <input> / <textarea>.
 * Shows a slide-down row of German characters while the field is focused.
 * - as: "input" (default) or "textarea"
 * - icon: optional absolutely-positioned icon rendered inside the field's box
 * - specialChars: set to false to turn the bar off for a field
 * All other props (className, placeholder, rows, required...) go to the field.
 */
export default function GermanTextField({
  as = "input",
  value,
  onChange,
  icon = null,
  specialChars = true,
  wrapperClassName = "",
  ...props
}) {
  const fieldRef = useRef(null);
  const pendingCaret = useRef(null);
  const [focused, setFocused] = useState(false);

  // Show the bar while the field is focused.
  // To show it only once there is text, use: specialChars && focused && value.length > 0
    const open = specialChars && focused;

  // After React re-renders with the inserted character, restore focus + caret
  useLayoutEffect(() => {
    if (pendingCaret.current !== null && fieldRef.current) {
      const pos = pendingCaret.current;
      fieldRef.current.focus();
      fieldRef.current.setSelectionRange(pos, pos);
      pendingCaret.current = null;
    }
  }, [value]);

  const insertChar = (char) => {
    const el = fieldRef.current;
    if (!el) return;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    pendingCaret.current = start + char.length;
    // Same shape as a real change event, so existing handlers keep working
    onChange({ target: { value: value.slice(0, start) + char + value.slice(end) } });
  };

  const Field = as;

  return (
    <div
      className={wrapperClassName}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        // Stay open while focus moves inside this wrapper
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <div className="relative">
        {icon}
        <Field ref={fieldRef} value={value} onChange={onChange} {...props} />
      </div>

      {/* Slide-down bar: animates its height from 0 to its natural size */}
      <div
        className={`grid transition-all duration-200 ease-out ${
          open
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="overflow-hidden min-h-0">
          <div
            role="toolbar"
            aria-label="Deutsche Sonderzeichen"
            className="flex items-center gap-1.5 pt-2 pb-0.5 overflow-x-auto no-scrollbar font-serif"
          >
            {GERMAN_CHARS.map((char) => (
              <button
                key={char}
                type="button"
                tabIndex={-1}
                // Keeps the text field focused so the keyboard doesn't close
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => insertChar(char)}
                className="min-w-8.5 h-8 px-2 shrink-0 rounded-lg bg-[#f4f3ef] hover:bg-[#e2e7e3] active:scale-90 text-[#2c302e] text-sm font-medium transition-all"
              >
                {char}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}