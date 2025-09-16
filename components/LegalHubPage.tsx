import React from 'react';
import { useLocale } from '../contexts/LocaleContext';

const ToolCard: React.FC<{ title: string; description: string; icon: string; onClick: () => void }> = ({ title, description, icon, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white p-8 rounded-lg shadow-lg border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
    >
        <span className="text-6xl mb-4" role="img" aria-label="icon">{icon}</span>
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
    </div>
);

export const LegalHubPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const { t } = useLocale();

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-6 py-16">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-800">{t('legalHub')}</h1>
                    <p className="mt-3 text-gray-600">{t('legalAIDescription')}</p>
                </div>
                
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    <ToolCard
                        title={t('legalAI')}
                        description={t('legalAIDescription')}
                        icon="⚖️"
                        onClick={() => onNavigate('legal-assistant')}
                    />
                    <ToolCard
                        title={t('legalPlaybooks')}
                        description={t('playbooksDescription')}
                        icon="📚"
                        onClick={() => onNavigate('legal-playbooks')}
                    />
                </div>

                <div className="mt-12 text-center max-w-3xl mx-auto">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                        <p className="text-sm text-yellow-800">{t('legalDisclaimer')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};