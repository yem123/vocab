
export const makeNoteId = () =>
  `n_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
