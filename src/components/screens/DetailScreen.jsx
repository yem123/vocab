import React from "react";
import DetailTopNav from "../detail/DetailTopNav";
import ThemeBadgeRow from "../detail/ThemeBadgeRow";
import WordHeader from "../detail/WordHeader";
import DefinitionCard from "../detail/DefinitionCard";
import ExampleCard from "../detail/ExampleCard";
import WordNavigationFooter from "../detail/WordNavigationFooter";
import FamilyCard from "../detail/FamilyCard";
import SynonymsCard from "../detail/SynonymsCard";

export default function DetailScreen({
  activeWord,
  vocabulary,
  navigateTo,
  toggleFavorite,
  deleteWord,
  editWord,
  detailOrigin,
  setSelectedWordId,
  getFamilyMembers,
}) {
  return (
    <div className="flex-1 flex flex-col px-6 py-5 space-y-6">
      <DetailTopNav
        activeWord={activeWord}
        vocabulary={vocabulary}
        navigateTo={navigateTo}
        toggleFavorite={toggleFavorite}
        detailOrigin={detailOrigin}
      />
      <ThemeBadgeRow
        activeWord={activeWord}
        deleteWord={deleteWord}
        editWord={editWord}
      />
      <WordHeader activeWord={activeWord} />
      <DefinitionCard activeWord={activeWord} />
      <ExampleCard activeWord={activeWord} /> {/* Synonyms, grouped by level */}
      <SynonymsCard synonyms={activeWord.synonyms} />
      <FamilyCard
        familyMembers={getFamilyMembers(activeWord)}
        onSelectWord={(id) => setSelectedWordId(id)}
      />
      <WordNavigationFooter
        activeWord={activeWord}
        vocabulary={vocabulary}
        setSelectedWordId={setSelectedWordId}
      />
    </div>
  );
}