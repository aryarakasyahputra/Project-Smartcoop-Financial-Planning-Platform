import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const LANGUAGES = {
  id: { code: "ID", label: "Bahasa Indonesia" },
  en: { code: "EN", label: "English" }
};

export default function LanguageSwitcher({ variant = "default" }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = LANGUAGES[language] || LANGUAGES.id;
  const isSidebar = variant === "sidebar";

  return (
    <div className={`relative shrink-0 ${isSidebar ? "flex-1 min-w-0" : ""}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
          isSidebar
            ? "w-full bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 rounded-xl backdrop-blur-sm text-xs font-extrabold text-white shadow-2xs"
            : "bg-white dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60"
        }`}
        type="button"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5">
          <Globe className={`h-3.5 w-3.5 ${isSidebar ? "text-[#FFD700]" : "text-[#005fa4] dark:text-blue-400"} shrink-0 stroke-[2.2]`} />
          <span>{currentLang.code}</span>
        </div>
        <ChevronDown className={`h-3 w-3 ${isSidebar ? "text-blue-200" : "text-slate-400"} transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className={`absolute left-0 right-0 mt-1.5 ${isSidebar ? "w-full bg-[#002d50] border-blue-800/80" : "w-24 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 right-0 left-auto"} border rounded-xl shadow-xl p-1 z-50 animate-fadeIn`}>
          {Object.keys(LANGUAGES).map((langKey) => {
            const isSelected = language === langKey;
            const item = LANGUAGES[langKey];
            return (
              <button
                key={langKey}
                onClick={() => {
                  setLanguage(langKey);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isSidebar
                    ? isSelected
                      ? "bg-white/20 text-[#FFD700] font-extrabold"
                      : "text-blue-100 hover:bg-white/10"
                    : isSelected
                      ? "bg-[#005fa4]/10 text-[#005fa4] dark:text-blue-400 font-extrabold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                }`}
              >
                <span>{item.code}</span>
                {isSelected && <Check className={`h-3.5 w-3.5 ${isSidebar ? "text-[#FFD700]" : "text-[#005fa4] dark:text-blue-400"} ml-1`} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
