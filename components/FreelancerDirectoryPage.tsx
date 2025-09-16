import React, { useState, useMemo } from 'react';
import { FreelancerCard } from './FreelancerCard';
import { FilterBar } from './FilterBar';
import { useCity } from '../contexts/CityContext';
import type { Freelancer, ServiceCategory } from '../types';
import { useLocale } from '../contexts/LocaleContext';

interface FreelancerDirectoryPageProps {
    freelancers: Freelancer[];
    serviceCategories: ServiceCategory[];
    onStartChat: (freelancer: Freelancer) => void;
    onViewProfile: (freelancer: Freelancer) => void;
}

export const FreelancerDirectoryPage: React.FC<FreelancerDirectoryPageProps> = ({
    freelancers,
    serviceCategories,
    onStartChat,
    onViewProfile
}) => {
    const { selectedCity } = useCity();
    const { t } = useLocale();
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [ratingFilter, setRatingFilter] = useState(0);
    const [experienceFilter, setExperienceFilter] = useState(0);

    const clearFilters = () => {
        setCategoryFilter('All');
        setRatingFilter(0);
        setExperienceFilter(0);
    };

    const filteredFreelancers = useMemo(() => {
        return freelancers.filter(f => {
            const cityMatch = selectedCity === t('All Cities') || t(f.location) === selectedCity;
            const categoryMatch = categoryFilter === 'All' || f.category === categoryFilter;
            const ratingMatch = f.rating >= ratingFilter;
            const experienceMatch = f.experienceYears >= experienceFilter;
            return cityMatch && categoryMatch && ratingMatch && experienceMatch;
        });
    }, [freelancers, selectedCity, categoryFilter, ratingFilter, experienceFilter, t]);

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{t('freelancerDirectory')}</h1>
                <p className="text-gray-600 mb-8">
                    {selectedCity === t('All Cities') 
                        ? t('searchProfessionals')
                                                : t('showingProfessionalsIn', { city: selectedCity })}
                </p>
                
                <FilterBar
                    categories={serviceCategories}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    ratingFilter={ratingFilter}
                    setRatingFilter={setRatingFilter}
                    experienceFilter={experienceFilter}
                    setExperienceFilter={setExperienceFilter}
                    clearFilters={clearFilters}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredFreelancers.length > 0 ? (
                        filteredFreelancers.map((freelancer) => (
                            <FreelancerCard 
                                key={freelancer.id} 
                                freelancer={freelancer} 
                                onStartChat={onStartChat} 
                                onViewProfile={onViewProfile} 
                            />
                        ))
                    ) : (
                         <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-700">{t('noFreelancersFound')}</h3>
                            <p className="mt-2 text-gray-500">{t('adjustFilters')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};