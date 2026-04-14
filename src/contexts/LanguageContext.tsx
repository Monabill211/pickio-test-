import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<Language>((i18n.language as Language) || 'ar');

  const isRTL = language === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
  };

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    document.documentElement.className = isRTL ? 'font-arabic' : 'font-english';
  }, [language, dir, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
