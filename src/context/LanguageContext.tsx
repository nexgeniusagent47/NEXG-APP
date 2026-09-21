import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationSchema, translations } from '../data/translations';
import { EnglishIcon, ChineseIcon, SwahiliIcon, ArabicIcon } from '../components/LanguageIcons';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeName: string;
  region: string;
  dir: 'ltr' | 'rtl';
  Icon: React.ComponentType<{ className?: string; size?: number }>;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: 'en',
    label: 'English',
    nativeName: 'English',
    region: 'International',
    dir: 'ltr',
    Icon: EnglishIcon,
  },
  {
    code: 'zh',
    label: 'Chinese',
    nativeName: '中文',
    region: 'China / East Asia',
    dir: 'ltr',
    Icon: ChineseIcon,
  },
  {
    code: 'sw',
    label: 'Kiswahili',
    nativeName: 'Kiswahili',
    region: 'Afrika Mashariki',
    dir: 'ltr',
    Icon: SwahiliIcon,
  },
  {
    code: 'ar',
    label: 'Arabic',
    nativeName: 'العربية',
    region: 'Middle East & Gulf',
    dir: 'rtl',
    Icon: ArabicIcon,
  },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationSchema;
  currentOption: LanguageOption;
  isRTL: boolean;
  options: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('nexg_language') as Language;
      if (saved && (saved === 'en' || saved === 'zh' || saved === 'sw' || saved === 'ar')) {
        return saved;
      }
      return 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nexg_language', language);
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    } catch {
      // ignore
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const currentOption = LANGUAGE_OPTIONS.find((opt) => opt.code === language) || LANGUAGE_OPTIONS[0];
  const t = translations[language] || translations.en;
  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentOption,
        isRTL,
        options: LANGUAGE_OPTIONS,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
