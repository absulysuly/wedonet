import React from 'react';
import type { ServiceCategory } from '../types';
import { useLocale } from '../contexts/LocaleContext';

interface FilterBarProps {
    categories: ServiceCategory[];
    categoryFilter: string;
    setCategoryFilter: (value: string) => void;
    ratingFilter: number;
    setRatingFilter: (value: number) => void;
    experienceFilter: number;
    setExperienceFilter: (value: number) => void;
    clearFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
    categories,
    categoryFilter, setCategoryFilter,
    ratingFilter, setRatingFilter,
    experienceFilter, setExperienceFilter,
    clearFilters
}) => {
    const { t } = useLocale();
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">{t('category')}</label>
                    <select
                        id="category"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
                    >
                        <option value="All">{t('allCategories')}</option>
                        {categories.map(cat => <option key={cat.id} value={cat.name}>{t(cat.name)}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700">{t('rating')}</label>
                    <select
                        id="rating"
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(Number(e.target.value))}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
                    >
                        <option value="0">{t('anyRating')}</option>
                        <option value="4">{t('ratingAndUp', { stars: 4 })}</option>
                        <option value="3">{t('ratingAndUp', { stars: 3 })}</option>
                        <option value="2">{t('ratingAndUp', { stars: 2 })}</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">{t('experience')}</label>
                    <select
                        id="experience"
                        value={experienceFilter}
                        onChange={(e) => setExperienceFilter(Number(e.target.value))}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
                    >
                        <option value="0">{t('anyExperience')}</option>
                        <option value="5">{t('experienceAndUp', { years: 5 })}</option>
                        <option value="3">{t('experienceAndUp', { years: 3 })}</option>
                        <option value="1">{t('oneYearPlus')}</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <button
                        onClick={clearFilters}
                        className="w-full bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        {t('clearFilters')}
                    </button>
                </div>
            </div>
        </div>
    );
};
