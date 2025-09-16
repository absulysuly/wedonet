import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { useLocale } from './LocaleContext';

export const CITIES_KEYS = ['All Cities', 'Baghdad', 'Erbil', 'Basra', 'Sulaymaniyah', 'Mosul'];

interface CityContextType {
    selectedCity: string;
    setSelectedCityKey: (cityKey: string) => void;
    citiesWithKeys: { key: string; name: string }[];
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { t } = useLocale();
    const [selectedCityKey, setSelectedCityKey] = useState<string>(CITIES_KEYS[0]);

    const citiesWithKeys = useMemo(() => CITIES_KEYS.map(key => ({ key, name: t(key) })), [t]);

    const selectedCity = useMemo(() => t(selectedCityKey), [t, selectedCityKey]);

    const value = {
        selectedCity,
        setSelectedCityKey,
        citiesWithKeys,
    };

    return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
};

export const useCity = () => {
    const context = useContext(CityContext);
    if (context === undefined) {
        throw new Error('useCity must be used within a CityProvider');
    }
    return context;
};
