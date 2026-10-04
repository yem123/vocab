import {
  Coffee,
  Award,
  Compass,
  Home,
  Landmark,
  Stethoscope,
  ShoppingBag,
  Mail,
  BookOpen,
  Heart,
  Layers,
} from "lucide-react";

export const LEVELS = ["A1", "A2", "B1", "B2"];

// Themes are user-defined, so icons are picked by keyword (first match wins)
const ICON_RULES = [
  {
    test: /restaurant|café|cafe|essen|trinken|alltag|feierabend/i,
    icon: Coffee,
  },
  { test: /einkauf|shop|laden/i, icon: ShoppingBag },
  { test: /arzt|gesund|krank|medizin/i, icon: Stethoscope },
  { test: /beruf|arbeit|job/i, icon: Award },
  { test: /bank|geld|finanz/i, icon: Landmark },
  { test: /reise|verkehr|fernweh|urlaub/i, icon: Compass },
  { test: /wohn|haus|miete/i, icon: Home },
  { test: /behörd|post|amt/i, icon: Mail },
  { test: /kultur|geist|literatur|philosoph|natur/i, icon: BookOpen },
  { test: /liebe|familie|freund/i, icon: Heart },
];

export const getThemeIcon = (name) => {
  const rule = ICON_RULES.find((r) => r.test.test(name));
  return rule ? rule.icon : Layers;
};

// Builds the theme list (name, word count, levels, words) from the real vocabulary
export const getThemeStats = (vocabulary) => {
  const map = new Map();

  vocabulary.forEach((w, index) => {
    const name = (w.thema || "").trim() || "Ohne Thema";
    const key = name.toLowerCase();

    if (!map.has(key)) {
      map.set(key, {
        id: key,
        name,
        count: 0,
        favorites: 0,
        levels: {},
        words: [],
        firstIndex: index, // vocabulary is newest-first, so lower = newer
        icon: getThemeIcon(name),
      });
    }

    const theme = map.get(key);
    theme.count += 1;
    if (w.favorite) theme.favorites += 1;
    if (w.level) theme.levels[w.level] = (theme.levels[w.level] || 0) + 1;
    theme.words.push({ word: w.word, translation: w.translation });
  });

  return Array.from(map.values());
};
