import { createContext, useContext, useState } from 'react';
import { translations } from './translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem('mm_lang') ?? 'en',
  );

  function setLang(l) {
    setLangState(l);
    localStorage.setItem('mm_lang', l);
  }

  return (
    <LanguageContext.Provider value={{ t: translations[lang], lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
