import React, { useState, useEffect } from 'react';
import type { Project, Proposal, AIOpportunityScoreData, Freelancer } from '../types';
import { useLocale } from '../contexts/LocaleContext';
import { scoreProposal } from '../services/geminiService';

// This is a simplified mock; in a real app, you would fetch all freelancers.
import { MOCK_FREELANCERS } from '../App'; 

interface ViewProposalsModalProps {
  project: Project;
  onClose: () => void;
  onAcceptProposal: (proposal: Proposal) => void;
}

const AIOpportunityScore: React.FC<{ scoreData: AIOpportunityScoreData }> = ({ scoreData }) => {
    const { t } = useLocale();
    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-green-600';
        if (score >= 6) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="mt-4 border-t pt-4 border-dashed border-gray-300">
            <h4 className="text-sm font-bold text-gray-700 mb-3">{t('aiOpportunityScore')}</h4>
            <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="text-center">
                     <p className={`text-4xl font-bold ${getScoreColor(scoreData.overallScore)}`}>{scoreData.overallScore.toFixed(1)}</p>
                     <p className="text-xs text-gray-500">/ 10</p>
                </div>
                <div className="flex-1">
                    <p className="text-sm text-gray-600 italic">"{scoreData.summary}"</p>
                    <div className="mt-2 space-y-1">
                        {scoreData.scoreBreakdown.map(item => (
                            <div key={item.factor} className="text-xs">
                                <span className={`font-semibold ${getScoreColor(item.score)}`}>{t(item.factor)} ({item.score}/10):</span>
                                <span className="text-gray-500 ms-1">{item.reasoning}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ViewProposalsModal: React.FC<ViewProposalsModalProps> = ({ project, onClose, onAcceptProposal }) => {
    const { t } = useLocale();
    const [scores, setScores] = useState<Record<number, AIOpportunityScoreData | null>>({});
    const [loadingScores, setLoadingScores] = useState<Record<number, boolean>>({});

    useEffect(() => {
        const fetchScores = async () => {
            if (!project.proposals) return;
            
            project.proposals.forEach(proposal => {
                // Don't refetch if score exists
                if (scores[proposal.id] !== undefined) return;

                setLoadingScores(prev => ({ ...prev, [proposal.id]: true }));
                
                // In a real app, you might already have freelancer data. Here we mock finding it.
                const freelancer = MOCK_FREELANCERS.find(f => f.id === proposal.freelancerId);
                
                if (freelancer) {
                    scoreProposal(project, freelancer, proposal).then(scoreData => {
                        setScores(prev => ({ ...prev, [proposal.id]: scoreData }));
                        setLoadingScores(prev => ({ ...prev, [proposal.id]: false }));
                    });
                } else {
                     setLoadingScores(prev => ({ ...prev, [proposal.id]: false }));
                }
            });
        };
        fetchScores();
    }, [project, scores]);


    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-auto max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">{t('proposalsReceived')}</h2>
                    <p className="text-gray-600">{t(project.title)}</p>
                </div>
                <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
                    {project.proposals && project.proposals.length > 0 ? (
                        <div className="space-y-6">
                            {project.proposals.map(proposal => (
                                <div key={proposal.id} className="bg-white border p-4 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                            <img src={proposal.freelancerAvatarUrl} alt={proposal.freelancerName} className="w-12 h-12 rounded-full" />
                                            <div>
                                                <p className="font-bold text-lg">{proposal.freelancerName}</p>
                                                <p className="text-sm text-gray-500">{new Date(proposal.timestamp).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-amber-600">${proposal.proposedBid}</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-gray-600 whitespace-pre-line">{proposal.coverLetter}</p>
                                    
                                    {loadingScores[proposal.id] && <p className="text-sm text-gray-500 mt-4 text-center animate-pulse">{t('scoringInProgress')}</p>}
                                    {scores[proposal.id] && <AIOpportunityScore scoreData={scores[proposal.id]!} />}
                                    
                                    <div className="mt-4 text-right">
                                        <button 
                                            onClick={() => onAcceptProposal(proposal)}
                                            className="bg-green-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-green-700 transition-colors"
                                        >
                                            {t('acceptProposal')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center py-8">{t('noProposalsYet')}</p>
                    )}
                </div>
                 <div className="p-4 bg-gray-100 border-t text-right">
                    <button onClick={onClose} className="bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-md hover:bg-gray-400 transition-colors">
                        {t('cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
};