import React, { useState, useCallback } from 'react';
import { getAIRecommendations } from '../services/geminiService';
import type { AIRecommendation } from '../types';
import { useLocale } from '../contexts/LocaleContext';

const LoadingSpinner = () => {
    const { t } = useLocale();
    return (
        <div className="flex justify-center items-center space-x-2 rtl:space-x-reverse">
            <div className="w-3 h-3 rounded-full bg-amber-600 animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-3 h-3 rounded-full bg-amber-600 animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 rounded-full bg-amber-600 animate-bounce" style={{animationDelay: '0.4s'}}></div>
            <span className="ms-3 text-gray-600">{t('analyzingProject')}</span>
        </div>
    );
};

const RecommendationCard: React.FC<{ recommendation: AIRecommendation }> = ({ recommendation }) => {
    const { t } = useLocale();
    return (
        <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start">
                <h4 className="font-bold text-lg text-amber-700">{t(recommendation.serviceCategory)}</h4>
                <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {t('matchScore', { score: recommendation.relevanceScore })}
                </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">{recommendation.reasoning}</p>
        </div>
    );
};

export const AiMatcher: React.FC = () => {
    const [projectDescription, setProjectDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<AIRecommendation[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { t } = useLocale();

    const handleFindFreelancer = useCallback(async () => {
        if (!projectDescription.trim()) {
            setError(t('errorProjectDescription'));
            return;
        }
        setIsLoading(true);
        setError(null);
        setRecommendations(null);

        try {
            const result = await getAIRecommendations(projectDescription);
            if (result) {
                setRecommendations(result);
            } else {
                setError(t('errorGetRecommendations'));
            }
        } catch (err) {
            setError(t('errorUnexpected'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [projectDescription, t]);

    return (
        <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-800">{t('describeYourProject')}</h2>
            <p className="text-center text-gray-600 mt-2">{t('aiMatcherSubtitle')}</p>

            <div className="mt-6">
                <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow"
                    placeholder={t('projectDescriptionPlaceholder')}
                    disabled={isLoading}
                />
            </div>

            <div className="mt-4">
                <button
                    onClick={handleFindFreelancer}
                    disabled={isLoading}
                    className="w-full bg-amber-600 text-white font-bold py-3 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? <LoadingSpinner/> : t('findAFreelancerButton')}
                </button>
            </div>
            
            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
            
            {recommendations && (
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">{t('recommendedServiceCategories')}</h3>
                    <div className="space-y-4">
                        {recommendations.map((rec, index) => (
                            <RecommendationCard key={index} recommendation={rec} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
