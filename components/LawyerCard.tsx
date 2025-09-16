import React from 'react';
import type { Freelancer } from '../types';
import { useLocale } from '../contexts/LocaleContext';

// Copied from FreelancerCard for consistency
const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

// Copied from FreelancerCard for consistency
const VerifiedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
    </svg>
);

interface LawyerCardProps {
    lawyer: Freelancer;
}

export const LawyerCard: React.FC<LawyerCardProps> = ({ lawyer }) => {
    const { t } = useLocale();
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
            <div className="p-6 flex-grow">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <img className="h-20 w-20 rounded-full object-cover" src={lawyer.avatarUrl} alt={lawyer.name} />
                    <div>
                        <div className="flex items-center">
                           <h3 className="text-xl font-bold text-gray-800">{lawyer.name}</h3>
                           {lawyer.isVerified && <span className="ms-2" title={t('verifiedProfessional')}><VerifiedIcon/></span>}
                        </div>
                        {lawyer.category && <p className="text-amber-600 font-medium">{t(lawyer.category)}</p>}
                    </div>
                </div>
                <div className="mt-4">
                    <div className="flex items-center">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < Math.round(lawyer.rating)} />)}
                        </div>
                        <span className="ms-2 text-gray-600 text-sm">{lawyer.rating.toFixed(1)} {t('reviewsCount', { count: lawyer.reviewCount })}</span>
                    </div>
                    <p className="text-gray-500 mt-2 text-sm">
                        <span className="font-semibold">{t('location')}:</span> {t(lawyer.location)}
                    </p>
                    <p className="text-gray-500 mt-1 text-sm">
                        <span className="font-semibold">{t('experience')}:</span> {lawyer.experienceYears} {t('years')}
                    </p>
                </div>
            </div>
            <div className="p-6 pt-0 mt-auto">
                <button
                    onClick={() => alert(`Viewing profile for ${lawyer.name}`)} // Placeholder action
                    className="w-full bg-gray-800 text-white font-semibold py-2 rounded-md hover:bg-gray-900 transition-colors"
                >
                    {t('viewProfile')}
                </button>
            </div>
        </div>
    );
};
