import React, { createContext, useContext, useState, useEffect } from "react";
import { getTranslation, translations } from "../config/i18n";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("app_language") || "id";
  });

  const setLanguage = (lang) => {
    if (lang === "id" || lang === "en") {
      setLanguageState(lang);
      localStorage.setItem("app_language", lang);
    }
  };

  const t = (keyPath, fallback = "") => {
    return getTranslation(language, keyPath, fallback);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
