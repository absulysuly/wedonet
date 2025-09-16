import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import en from '../locales/en';
import ar from '../locales/ar';
import ku from '../locales/ku';

type Language = 'en' | 'ar' | 'ku';

interface LocaleContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string, values?: Record<string, string | number>) => string;
}

const translations: Record<Language, Record<string, string>> = { en, ar, ku };

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        const dir = (language === 'ar' || language === 'ku') ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = language;
    }, [language]);

    const t = useCallback((key: string, values?: Record<string, string | number>): string => {
        let translation = translations[language][key] || translations['en'][key] || key;
        
        if (values) {
            Object.keys(values).forEach(valueKey => {
                const regex = new RegExp(`{${valueKey}}`, 'g');
                translation = translation.replace(regex, String(values[valueKey]));
            });
        }

        return translation;
    }, [language]);


    const value = {
        language,
        setLanguage,
        t,
    };

    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
    const context = useContext(LocaleContext);
    if (context === undefined) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
};
