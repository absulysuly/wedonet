import React, { useState, useEffect, useCallback } from 'react';
import { useLocale } from '../contexts/LocaleContext';
import { generateLegalPlaybook } from '../services/geminiService';

const LoadingSpinner: React.FC = () => {
    const { t } = useLocale();
    return (
        <div className="flex justify-center items-center space-x-2 rtl:space-x-reverse py-12">
            <div className="w-4 h-4 rounded-full bg-amber-600 animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-4 h-4 rounded-full bg-amber-600 animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-4 h-4 rounded-full bg-amber-600 animate-bounce" style={{animationDelay: '0.4s'}}></div>
            <span className="ms-3 text-gray-600">{t('generatingContent')}</span>
        </div>
    );
};

const playbooks = [
    {
        id: 'first-hire',
        titleKey: 'playbookHireFirstEmployee',
        descKey: 'playbookHireFirstEmployeeDesc',
        icon: '👥',
        steps: ['summary', 'checklist', 'find_lawyer'],
    },
    {
        id: 'lease-space',
        titleKey: 'playbookLeaseSpace',
        descKey: 'playbookLeaseSpaceDesc',
        icon: '🏢',
        steps: [], // Not implemented yet
    },
];

type Playbook = typeof playbooks[0];

export const LegalPlaybookPage: React.FC<{onNavigate: (page: string) => void}> = ({ onNavigate }) => {
    const { t } = useLocale();
    const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [stepData, setStepData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const activeStep = selectedPlaybook?.steps[currentStepIndex];

    const fetchStepData = useCallback(async () => {
        if (!selectedPlaybook || !activeStep || activeStep === 'find_lawyer') {
            setStepData(null);
            return;
        }
        setIsLoading(true);
        const data = await generateLegalPlaybook(selectedPlaybook.id, activeStep as 'summary' | 'checklist');
        setStepData(data);
        setIsLoading(false);
    }, [selectedPlaybook, activeStep]);

    useEffect(() => {
        fetchStepData();
    }, [fetchStepData]);

    const handleNextStep = () => {
        if (selectedPlaybook && currentStepIndex < selectedPlaybook.steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        }
    };
    
    const handleReset = () => {
        setSelectedPlaybook(null);
        setCurrentStepIndex(0);
        setStepData(null);
    }
    
    const renderStepContent = () => {
        if (isLoading) return <LoadingSpinner />;
        if (!stepData && activeStep !== 'find_lawyer') return <p className="text-center text-gray-500">Could not load content.</p>;

        switch (activeStep) {
            case 'summary':
                return (
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">{stepData.title}</h3>
                        <p className="mt-2 text-gray-600">{stepData.introduction}</p>
                        <div className="mt-6 space-y-4">
                            {stepData.considerations?.map((item: any, index: number) => (
                                <div key={index} className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
                                    <h4 className="font-semibold text-amber-800">{item.point}</h4>
                                    <p className="mt-1 text-sm text-amber-700">{item.explanation}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'checklist':
                return (
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">{stepData.title}</h3>
                        <div className="mt-4 space-y-3">
                            {stepData.checklist?.map((item: any, index: number) => (
                                <label key={index} className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer">
                                    <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                                    <span className="ms-3 text-gray-700">{item.step}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );
            case 'find_lawyer':
                 return (
                    <div className="text-center bg-green-50 p-8 rounded-lg">
                        <h3 className="text-2xl font-bold text-green-800">{t('playbookFinalStepTitle')}</h3>
                        <p className="mt-2 text-green-700 max-w-xl mx-auto">{t('playbookFinalStepDesc')}</p>
                        <button 
                            onClick={() => onNavigate('directory')}
                            className="mt-6 bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            {t('browseLawyers')}
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    if (selectedPlaybook) {
        return (
            <div className="container mx-auto max-w-3xl px-6 py-12">
                <button onClick={handleReset} className="text-sm font-semibold text-gray-600 hover:text-amber-600 mb-6">&larr; {t('backToPlaybooks')}</button>
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between border-b pb-4 mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">{t(selectedPlaybook.titleKey)}</h2>
                            <p className="text-gray-500">{t(`playbook.${activeStep}`)}</p>
                        </div>
                        <span className="text-5xl">{selectedPlaybook.icon}</span>
                    </div>
                    {renderStepContent()}
                    {activeStep !== 'find_lawyer' && !isLoading && (
                        <div className="mt-8 pt-6 border-t text-right">
                             <button onClick={handleNextStep} className="bg-amber-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-amber-700 transition-colors">
                                {t('nextStep')} &rarr;
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-6 py-12">
                 <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-800">{t('legalPlaybooks')}</h1>
                    <p className="mt-3 text-gray-600">{t('playbooksDescription')}</p>
                </div>
                <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {playbooks.map(playbook => (
                        <div key={playbook.id} className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
                            <div className="text-4xl mb-4">{playbook.icon}</div>
                            <h3 className="text-xl font-bold text-gray-800">{t(playbook.titleKey)}</h3>
                            <p className="text-gray-600 mt-2 text-sm h-12">{t(playbook.descKey)}</p>
                            <button
                                onClick={() => setSelectedPlaybook(playbook)}
                                disabled={playbook.steps.length === 0}
                                className="mt-6 w-full bg-amber-600 text-white font-semibold py-2 rounded-md hover:bg-amber-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {playbook.steps.length > 0 ? t('startPlaybook') : t('pageComingSoon')}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
