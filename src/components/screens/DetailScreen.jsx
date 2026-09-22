import React from "react";
import DetailTopNav from "../detail/DetailTopNav";
import ThemeBadgeRow from "../detail/ThemeBadgeRow";
import WordHeader from "../detail/WordHeader";
import DefinitionCard from "../detail/DefinitionCard";
import ExampleCard from "../detail/ExampleCard";
import WordNavigationFooter from "../detail/WordNavigationFooter";

export default function DetailScreen({
  activeWord,
  vocabulary,
  navigateTo,
  toggleFavorite,
  deleteWord,
  editWord,
  detailOrigin,
  setSelectedWordId,
}) {
  return (
    <div className="flex-1 flex flex-col px-6 py-5 space-y-6">
      {/* Top Navigation Row */}
      <DetailTopNav
        activeWord={activeWord}
        vocabulary={vocabulary}
        navigateTo={navigateTo}
        toggleFavorite={toggleFavorite}
        detailOrigin={detailOrigin}
      />

      {/* Theme Badge */}
      <ThemeBadgeRow
        activeWord={activeWord}
        deleteWord={deleteWord}
        editWord={editWord}
      />

      {/* Main Word Header with Audio */}
      <WordHeader activeWord={activeWord} />

      {/* Deutsche Definition Card */}
      <DefinitionCard activeWord={activeWord} />

      {/* Deutscher Beispielsatz Card */}
      <ExampleCard activeWord={activeWord} />

      {/* Word Navigation Footer */}
      <WordNavigationFooter
        activeWord={activeWord}
        vocabulary={vocabulary}
        setSelectedWordId={setSelectedWordId}
      />
    </div>
  );
}