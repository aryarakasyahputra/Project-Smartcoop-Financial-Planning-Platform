import idFinance from "./locales/id/finance.json";
import enFinance from "./locales/en/finance.json";

export const translations = {
  id: {
    finance: idFinance
  },
  en: {
    finance: enFinance
  }
};

/**
 * Get translated value by path e.g. "finance.sidebar.modelOverview"
 */
export function getTranslation(lang, keyPath, fallback = "") {
  const selectedLang = translations[lang] ? lang : "id";
  const keys = keyPath.split(".");
  let current = translations[selectedLang];

  for (const k of keys) {
    if (current && current[k] !== undefined) {
      current = current[k];
    } else {
      // Fallback to ID if key missing in EN
      if (selectedLang !== "id") {
        return getTranslation("id", keyPath, fallback);
      }
      return fallback || keyPath;
    }
  }

  return current;
}
