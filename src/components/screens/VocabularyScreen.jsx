import React from "react";
import SanctuaryBanner from "../vocabulary/SanctuaryBanner";
import SearchAndFilters from "../vocabulary/SearchAndFilters";
import WordOfTheMorning from "../vocabulary/WordOfTheMorning";
import VocabularyList from "../vocabulary/VocabularyList";
import BackupControls from "../vocabulary/BackupControls";

export default function VocabularyScreen({
  vocabulary,
  filteredVocabulary,
  searchQuery,
  setSearchQuery,
  selectedThemeFilter,
  setSelectedThemeFilter,
  setSelectedWordId,
  navigateTo,
  themes,
  handleImportBackup,
  selectedLevelFilter,
  setSelectedLevelFilter,
}) {
  return (
    <div className="flex-1 flex flex-col px-6 py-5 space-y-5">
      {/* Sanctuary Banner */}
      <SanctuaryBanner vocabulary={vocabulary} navigateTo={navigateTo} />

      {/* Backup: export / import */}
      <BackupControls
        vocabulary={vocabulary}
        themes={themes}
        onImport={handleImportBackup}
      />

      {/* Search bar & Filter Pills */}
      <SearchAndFilters
        vocabulary={vocabulary}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedThemeFilter={selectedThemeFilter}
        setSelectedThemeFilter={setSelectedThemeFilter}
        selectedLevelFilter={selectedLevelFilter}
        setSelectedLevelFilter={setSelectedLevelFilter}
      />

      {/* Word of the Morning banner */}
      {vocabulary.length > 0 && (
        <WordOfTheMorning
          vocabulary={vocabulary}
          setSelectedWordId={setSelectedWordId}
          navigateTo={navigateTo}
        />
      )}

      {/* Vocabulary Scrollable List */}
      <VocabularyList
        filteredVocabulary={filteredVocabulary}
        setSelectedWordId={setSelectedWordId}
        navigateTo={navigateTo}
      />
    </div>
  );
}
