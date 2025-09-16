import React from 'react';
import { useLocale } from '../contexts/LocaleContext';

export const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLocale();
    const languages: { code: 'en' | 'ar' | 'ku'; name: string }[] = [
        { code: 'en', name: 'English' },
        { code: 'ar', name: 'العربية' },
        { code: 'ku', name: 'کوردی' },
    ];
    return (
        <div className="relative">
             <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'ar' | 'ku')}
                className="bg-gray-700 text-white rounded-md py-2 pl-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Select language"
            >
                {languages.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
        </div>
    );
};
