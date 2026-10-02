import React from "react";
import AddHeaderRow from "../add/AddHeaderRow";
import AddWordForm from "../add/AddWordForm";

export default function AddWordScreen({
  navigateTo,
  handleSaveNewWord,
  isEditing,
  formThema,
  setFormThema,
  formWord,
  setFormWord,
  formTranslation,
  setFormTranslation,
  formDefinition,
  setFormDefinition,
  formExample,
  setFormExample,
  formExampleTranslation,
  setFormExampleTranslation,
  formPriority,
  setFormPriority,
  handleAIFill,
  isGenerating,
  aiError,
  themes,
  removeTheme,
  formCustomThema,
  setFormCustomThema,
  formLevel,
  setFormLevel,
  formType,
  setFormType,
}) {
  return (
    <div className="flex-1 flex flex-col px-6 py-5 space-y-5 animate-slide-up">
      {/* Header Action Row */}
      <AddHeaderRow
        navigateTo={navigateTo}
        handleSaveNewWord={handleSaveNewWord}
        isEditing={isEditing}
      />

      {/* Add Word Form */}
      <AddWordForm
        handleSaveNewWord={handleSaveNewWord}
        formThema={formThema}
        setFormThema={setFormThema}
        formWord={formWord}
        setFormWord={setFormWord}
        formTranslation={formTranslation}
        setFormTranslation={setFormTranslation}
        formDefinition={formDefinition}
        setFormDefinition={setFormDefinition}
        formExample={formExample}
        setFormExample={setFormExample}
        formExampleTranslation={formExampleTranslation}
        setFormExampleTranslation={setFormExampleTranslation}
        formPriority={formPriority}
        setFormPriority={setFormPriority}
        handleAIFill={handleAIFill}
        isGenerating={isGenerating}
        aiError={aiError}
        isEditing={isEditing}
        themes={themes}
        removeTheme={removeTheme}
        formCustomThema={formCustomThema}
        setFormCustomThema={setFormCustomThema}
        formType={formType}
        setFormType={setFormType}
        formLevel={formLevel}
        setFormLevel={setFormLevel}
      />
    </div>
  );
}
