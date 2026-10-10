import React from "react";
import SanctuaryBanner from "../vocabulary/SanctuaryBanner";
import SearchAndFilters from "../vocabulary/SearchAndFilters";
import VocabularyList from "../vocabulary/VocabularyList";
import BackupControls from "../vocabulary/BackupControls";
import SaveToGithubButton from "../collections/SaveToGithubButton";

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
  selectedTypeFilter,
  setSelectedTypeFilter,
  toggleFavorite,
  visibleVocabCount,
  setVisibleVocabCount,
  vocabScrollY,
  buildGithubSyncPayload,
  clearSyncedLocalChanges,
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

      {/* Saves favorites, edits, deletions, and new words back to GitHub */}
      <SaveToGithubButton
        buildGithubSyncPayload={buildGithubSyncPayload}
        clearSyncedLocalChanges={clearSyncedLocalChanges}
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
        selectedTypeFilter={selectedTypeFilter}
        setSelectedTypeFilter={setSelectedTypeFilter}
      />

      {/* Vocabulary Scrollable List */}
      <VocabularyList
        filteredVocabulary={filteredVocabulary}
        setSelectedWordId={setSelectedWordId}
        navigateTo={navigateTo}
        toggleFavorite={toggleFavorite}
        visibleCount={visibleVocabCount}
        setVisibleCount={setVisibleVocabCount}
        vocabScrollY={vocabScrollY}
      />
    </div>
  );
}
