import React from "react";
import { Sparkles } from "lucide-react";
import ThemeDropdown from "./ThemeDropdown";
import GermanTextField from "../common/GermanTextField";
import { WORD_TYPES } from "../../utils/wordTypes";

export default function AddWordForm({
  handleSaveNewWord,
  formThema,
  setFormThema,
  formWord,
  setFormWord,
  formTranslation,
  setFormTranslation,
  formDefinition,
  setFormDefinition,
  formDefinitionTranslation,
  setFormDefinitionTranslation,
  formExample,
  setFormExample,
  formExampleTranslation,
  setFormExampleTranslation,
  formPriority,
  setFormPriority,
  handleAIFill,
  isGenerating,
  aiError,
  isEditing,
  themes,
  removeTheme,
  formCustomThema,
  setFormCustomThema,
  formType,
  setFormType,
  formLevel,
  setFormLevel,
}) {
  return (
    <form onSubmit={handleSaveNewWord} className="space-y-4 font-sans text-xs">
      {/* Thema selector */}
      <div className="bg-[#f9f9f7] border border-[#e8e5e0] p-3.5 rounded-2xl space-y-1">
        <div className="flex justify-between items-center text-[#767d78]">
          <span className="font-semibold uppercase tracking-wider text-[10px]">
            Thema
          </span>
          <span>Optional</span>
        </div>

        {/* Manual thema input: added to the dropdown list on save if it's new */}
        <GermanTextField
          type="text"
          placeholder="Neues Thema eingeben..."
          value={formCustomThema}
          onChange={(e) => setFormCustomThema(e.target.value)}
          className="w-full bg-transparent border-none text-sm font-serif text-[#2c302e] focus:outline-none placeholder:text-[#b8c2bc]"
        />

        {/* Dropdown list with a remove (X) button on each thema */}
        <ThemeDropdown
          themes={themes}
          formThema={formThema}
          setFormThema={setFormThema}
          setFormCustomThema={setFormCustomThema}
          removeTheme={removeTheme}
        />
      </div>

      {/* Word level */}
      <div className="bg-[#f9f9f7] border border-[#e8e5e0] p-3.5 rounded-2xl space-y-2">
        <div className="flex justify-between items-center text-[#767d78]">
          <span className="font-semibold uppercase tracking-wider text-[10px]">
            Wortniveau
          </span>
          <span>Optional</span>
        </div>
        <div className="flex gap-1.5">
          {["Basic", "Intermediate", "Advanced"].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setFormLevel(formLevel === level ? "" : level)}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
                formLevel === level
                  ? "bg-[#2c302e] text-white"
                  : "bg-[#f4f3ef] text-[#637368] hover:bg-[#eae7e2]"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Word type */}
      <div className="bg-[#f9f9f7] border border-[#e8e5e0] p-3.5 rounded-2xl space-y-2">
        <div className="flex justify-between items-center text-[#767d78]">
          <span className="font-semibold uppercase tracking-wider text-[10px]">
            Art
          </span>
          <span>Leer = automatisch</span>
        </div>
        <div className="flex gap-1.5">
          {WORD_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormType(formType === type ? "" : type)}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
                formType === type
                  ? "bg-[#435249] text-white"
                  : "bg-[#f4f3ef] text-[#637368] hover:bg-[#eae7e2]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Deutsches Wort */}
      <div className="bg-[#f9f9f7] border border-[#e8e5e0] p-3.5 rounded-2xl space-y-1">
        <span className="font-semibold uppercase tracking-wider text-[10px] text-[#767d78]">
          Deutsches Wort / Begriff *
        </span>
        <GermanTextField
          type="text"
          required
          placeholder="e.g., Gemütlichkeit"
          value={formWord}
          onChange={(e) => setFormWord(e.target.value)}
          className="w-full bg-transparent border-none text-sm font-serif text-[#2c302e] focus:outline-none placeholder:text-[#b8c2bc]"
        />{" "}
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleAIFill(false)}
            disabled={isGenerating || !formWord.trim()}
            className="flex items-center gap-1.5 bg-[#2c302e] text-white px-3 py-1.5 rounded-full font-semibold text-[11px] hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isGenerating ? "Generating..." : "AI Fill"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => handleAIFill(true)}
              disabled={isGenerating || !formWord.trim()}
              className="flex items-center gap-1.5 bg-[#f4f3ef] text-[#2c302e] px-3 py-1.5 rounded-full font-semibold text-[11px] hover:bg-[#eae7e2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Regenerate all
            </button>
          )}
        </div>
        {aiError && <p className="text-rose-500 text-[11px] mt-1">{aiError}</p>}
      </div>

      {/* English Translation */}
      <div className="bg-[#f9f9f7] border border-[#e8e5e0] p-3.5 rounded-2xl space-y-1">
        <div className="flex justify-between items-center text-[#767d78]">
          <span className="font-semibold uppercase tracking-wider text-[10px]">
            Englische Übersetzung / Meaning *
          </span>
          <span>Target prompt</span>
        </div>
        <GermanTextField
          type="text"
          required
          placeholder="e.g., Cozy warmth & unhurried contentment"
          value={formTranslation}
          onChange={(e) => setFormTranslation(e.target.value)}
          className="w-full bg-transparent border-none text-sm font-sans text-[#2c302e] focus:outline-none placeholder:text-[#b8c2bc]"
        />
      </div>

      {/* Deutsche Definition */}
      <div className="bg-[#f9f9f7] border border-[#e8e5e0] p-3.5 rounded-2xl space-y-1">
        <div className="flex justify-between items-center text-[#767d78]">
          <span className="font-semibold uppercase tracking-wider text-[10px]">
            Deutsche Definition
          </span>
          <span>Bedeutung</span>
        </div>
        <GermanTextField
          as="textarea"
          rows="2"
          placeholder="z.B. Das Gefühl, einsam im Wald zu sein..."
          value={formDefinition}
          onChange={(e) => setFormDefinition(e.target.value)}
          className="w-full bg-transparent border-none text-sm font-serif text-[#2c302e] focus:outline-none resize-none placeholder:text-[#b8c2bc]"
        />
        <input
          type="text"
          placeholder="English translation of the definition..."
          value={formDefinitionTranslation}
          onChange={(e) => setFormDefinitionTranslation(e.target.value)}
          className="w-full bg-transparent border-t border-[#e8e5e0] pt-1.5 text-xs text-[#767d78] focus:outline-none placeholder:text-[#b8c2bc]"
        />
      </div>

      {/* Deutscher Beispielsatz */}
      <div className="bg-[#f4f6f4] border border-[#dce3df] p-3.5 rounded-2xl space-y-1">
        <div className="flex justify-between items-center text-[#526859]">
          <span className="font-semibold uppercase tracking-wider text-[10px]">
            Deutscher Beispielsatz
          </span>
          <span>Im Kontext</span>
        </div>
        <GermanTextField
          as="textarea"
          rows="2"
          placeholder="z.B. „Nach einer anstrengenden Woche...“"
          value={formExample}
          onChange={(e) => setFormExample(e.target.value)}
          className="w-full bg-transparent border-none text-sm font-serif text-[#2c302e] focus:outline-none resize-none placeholder:text-[#b8c2bc]"
        />
        <input
          type="text"
          placeholder="English translation of the example..."
          value={formExampleTranslation}
          onChange={(e) => setFormExampleTranslation(e.target.value)}
          className="w-full bg-transparent border-t border-[#dce3df] pt-1.5 text-xs text-[#526859] focus:outline-none placeholder:text-[#b8c2bc]"
        />
      </div>

      {/* Priority Selector */}
      <div className="flex items-center justify-between pt-2 px-1">
        <span className="text-[#767d78] font-medium">
          Spaced repetition priority
        </span>
        <select
          value={formPriority}
          onChange={(e) => setFormPriority(e.target.value)}
          className="bg-[#f4f3ef] text-[#2c302e] px-3 py-1.5 rounded-xl font-semibold focus:outline-none"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
    </form>
  );
}
