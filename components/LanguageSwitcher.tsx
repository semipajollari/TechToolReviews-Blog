import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Language } from '../i18n';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: Language[] = ['en', 'de', 'es', 'fr'];

  // Country codes for flag display
  const countryFlags: { [key in Language]: string } = {
    en: '🇬🇧',
    de: '🇩🇪',
    es: '🇪🇸',
    fr: '🇫🇷',
  };

  const countryNames: { [key in Language]: string } = {
    en: 'English',
    de: 'Deutsch',
    es: 'Español',
    fr: 'Français',
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-sm font-medium text-gray-700 dark:text-gray-300"
        aria-label="Select language"
      >
        <span className="text-lg">{countryFlags[language]}</span>
        <span className="inline">{countryNames[language]}</span>
        <i className={`fas fa-chevron-down text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {/* Always use modal for language selection */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-80 max-w-full p-4 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg">Select Language</span>
              <button onClick={() => setIsOpen(false)} aria-label="Close" className="text-2xl">&times;</button>
            </div>
            <div className="flex flex-col gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    language === lang
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-xl">{countryFlags[lang]}</span>
                  <span className="font-medium">{countryNames[lang]}</span>
                  {language === lang && (
                    <i className="fas fa-check ml-auto text-indigo-600 dark:text-indigo-400"></i>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
