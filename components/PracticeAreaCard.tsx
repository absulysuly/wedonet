import React from 'react';
import type { ServiceCategory } from '../types';
import { useLocale } from '../contexts/LocaleContext';

interface ServiceCategoryCardProps {
    category: ServiceCategory;
}

export const ServiceCategoryCard: React.FC<ServiceCategoryCardProps> = ({ category }) => {
    const { t } = useLocale();
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center transform hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="flex justify-center items-center h-16 w-16 mx-auto bg-amber-100 rounded-full">
                {category.icon}
            </div>
            <h4 className="mt-4 font-semibold text-gray-700">{t(category.name)}</h4>
        </div>
    );
};