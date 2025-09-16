import React, { useState } from 'react';
import { useLocale } from '../contexts/LocaleContext';
import { analyzeLegalDocument, generateLegalAgreement } from '../services/geminiService';

type Tab = 'analyze' | 'generate';

interface AnalysisResult {
    summary: string;
    keyClauses: { title: string, explanation: string }[];
    potentialRisks: { risk: string, suggestion: string }[];
}

const LoadingSpinner = () => {
    const { t } = useLocale();
    return (
        <div className="flex justify-center items-center space-x-2 rtl:space-x-reverse py-8">
            <div className="w-3 h-3 rounded-full bg-amber-600 animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-3 h-3 rounded-full bg-amber-600 animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 rounded-full bg-amber-600 animate-bounce" style={{animationDelay: '0.4s'}}></div>
            <span className="ms-3 text-gray-600">{t('analyzing')}...</span>
        </div>
    );
};

export const LegalAssistantPage: React.FC = () => {
    const { t } = useLocale();
    const [activeTab, setActiveTab] = useState<Tab>('analyze');

    // State for Analyzer
    const [documentText, setDocumentText] = useState('');
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // State for Generator
    const [agreementDesc, setAgreementDesc] = useState('');
    const [agreementType, setAgreementType] = useState('Non-Disclosure Agreement (NDA)');
    const [generatedText, setGeneratedText] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    const handleAnalyze = async () => {
        if (!documentText.trim()) {
            setError(t('errorNoText'));
            return;
        }
        setError('');
        setIsAnalyzing(true);
        setAnalysisResult(null);
        const result = await analyzeLegalDocument(documentText);
        if (result) {
            setAnalysisResult(result);
        } else {
            setError(t('errorAI'));
        }
        setIsAnalyzing(false);
    };

    const handleGenerate = async () => {
        if (!agreementDesc.trim()) {
            setError(t('errorNoDescription'));
            return;
        }
        setError('');
        setIsGenerating(true);
        setGeneratedText(null);
        const result = await generateLegalAgreement(agreementDesc, agreementType);
        if (result) {
            setGeneratedText(result);
        } else {
            setError(t('errorAI'));
        }
        setIsGenerating(false);
    };

    const handleCopy = () => {
        if (generatedText) {
            navigator.clipboard.writeText(generatedText);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };
    
    const TabButton: React.FC<{ tab: Tab; children: React.ReactNode }> = ({ tab, children }) => (
        <button
            onClick={() => {
                setActiveTab(tab);
                setError('');
            }}
            className={`px-6 py-3 font-semibold text-lg rounded-t-lg transition-colors ${activeTab === tab ? 'bg-white text-amber-600 border-b-0' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-6 py-12">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-800">{t('legalAI')}</h1>
                    <p className="mt-3 text-gray-600">{t('legalAIDescription')}</p>
                </div>

                <div className="mt-10 max-w-4xl mx-auto">
                    <div className="flex border-b border-gray-200">
                        <TabButton tab="analyze">{t('analyzeDocument')}</TabButton>
                        <TabButton tab="generate">{t('generateAgreement')}</TabButton>
                    </div>
                    
                    <div className="bg-white p-8 rounded-b-lg rounded-r-lg shadow-md">
                        {activeTab === 'analyze' && (
                            <div>
                                <textarea
                                    value={documentText}
                                    onChange={(e) => setDocumentText(e.target.value)}
                                    className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    placeholder={t('pasteDocumentText')}
                                    disabled={isAnalyzing}
                                />
                                <button
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing}
                                    className="mt-4 w-full bg-amber-600 text-white font-bold py-3 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-gray-400"
                                >
                                    {isAnalyzing ? t('analyzing') : t('analyzeButton')}
                                </button>

                                {isAnalyzing && <LoadingSpinner />}
                                
                                {analysisResult && (
                                    <div className="mt-8 space-y-6">
                                        <h3 className="text-2xl font-bold">{t('analysisResults')}</h3>
                                        <div>
                                            <h4 className="text-lg font-semibold text-amber-700 border-b pb-2">{t('summary')}</h4>
                                            <p className="mt-2 text-gray-700">{analysisResult.summary}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-amber-700 border-b pb-2">{t('keyClauses')}</h4>
                                            <ul className="mt-2 space-y-3">
                                                {analysisResult.keyClauses.map((clause, i) => (
                                                    <li key={i} className="bg-gray-50 p-3 rounded-md">
                                                        <p className="font-bold">{clause.title}</p>
                                                        <p className="text-sm text-gray-600">{clause.explanation}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                         <div>
                                            <h4 className="text-lg font-semibold text-amber-700 border-b pb-2">{t('potentialRisks')}</h4>
                                             <ul className="mt-2 space-y-3">
                                                {analysisResult.potentialRisks.map((risk, i) => (
                                                     <li key={i} className="bg-red-50 p-3 rounded-md border-l-4 border-red-400">
                                                        <p className="font-bold text-red-800">{risk.risk}</p>
                                                        <p className="text-sm text-red-700 mt-1"><span className="font-semibold">Suggestion:</span> {risk.suggestion}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'generate' && (
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="agreementType" className="block text-sm font-medium text-gray-700">{t('agreementType')}</label>
                                        <select
                                            id="agreementType"
                                            value={agreementType}
                                            onChange={e => setAgreementType(e.target.value)}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
                                        >
                                            <option>{t('nda')}</option>
                                            <option>{t('serviceAgreement')}</option>
                                            <option>{t('leaseAgreement')}</option>
                                        </select>
                                    </div>
                                </div>
                                <textarea
                                    value={agreementDesc}
                                    onChange={(e) => setAgreementDesc(e.target.value)}
                                    className="w-full h-32 mt-4 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    placeholder={t('describeAgreement')}
                                    disabled={isGenerating}
                                />
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="mt-4 w-full bg-amber-600 text-white font-bold py-3 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-gray-400"
                                >
                                    {isGenerating ? t('generating') : t('generateButton')}
                                </button>
                                
                                {isGenerating && <LoadingSpinner />}

                                {generatedText && (
                                    <div className="mt-8">
                                        <div className="flex justify-between items-center">
                                             <h3 className="text-2xl font-bold">{t('generatedAgreement')}</h3>
                                             <button onClick={handleCopy} className="bg-gray-200 text-gray-700 text-sm font-semibold py-1 px-3 rounded-md hover:bg-gray-300">
                                                {copySuccess ? t('copied') : t('copyText')}
                                             </button>
                                        </div>
                                        <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-[400px] overflow-y-auto">
                                            <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">
                                                {generatedText}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                    </div>

                     <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                        <p className="text-sm text-yellow-800">{t('legalDisclaimer')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
