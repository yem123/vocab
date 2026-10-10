import React from "react";
import SanctuaryBanner from "../vocabulary/SanctuaryBanner";
import SearchAndFilters from "../vocabulary/SearchAndFilters";
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
  selectedTypeFilter,
  setSelectedTypeFilter,
  toggleFavorite,
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
        selectedTypeFilter={selectedTypeFilter}
        setSelectedTypeFilter={setSelectedTypeFilter}
      />

      {/* Vocabulary Scrollable List */}
      <VocabularyList
        filteredVocabulary={filteredVocabulary}
        setSelectedWordId={setSelectedWordId}
        navigateTo={navigateTo}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
}
