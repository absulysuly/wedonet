import React, { useState, useEffect } from 'react';
import type { Project, Proposal, Freelancer, AIProposalDraft } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useLocale } from '../contexts/LocaleContext';
import { ViewProposalsModal } from './ViewProposalsModal';
import { generateProposalDraft } from '../services/geminiService';

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
);

interface ProjectDetailsPageProps {
    project: Project;
    onBack: () => void;
    onSubmitProposal: (projectId: number, proposalData: Omit<Proposal, 'id' | 'timestamp'>) => Promise<void>;
    onAcceptProposal: (projectId: number, proposal: Proposal) => void;
    currentUserProfile?: Freelancer;
}

const AIProposalAssistant: React.FC<{ project: Project, freelancer: Freelancer, onDraftGenerated: (draft: AIProposalDraft) => void }> = ({ project, freelancer, onDraftGenerated }) => {
    const { t } = useLocale();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateDraft = async () => {
        setIsLoading(true);
        setError('');
        try {
            const draft = await generateProposalDraft(project, freelancer);
            if (draft) {
                onDraftGenerated(draft);
            } else {
                setError(t('errorAI'));
            }
        } catch (err) {
            setError(t('errorUnexpected'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mt-8">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <span className="text-2xl">✨</span>
                <div>
                    <h4 className="font-bold text-amber-800">{t('aiProposalAssistant')}</h4>
                    <p className="text-sm text-amber-700">{t('aiProposalAssistantSubtitle')}</p>
                    {isLoading ? (
                        <div className="mt-2 text-sm text-amber-700 animate-pulse">{t('generatingDraft')}</div>
                    ) : (
                        <button onClick={handleGenerateDraft} className="mt-2 bg-amber-600 text-white text-sm font-semibold py-1 px-3 rounded-md hover:bg-amber-700">
                            {t('generateDraftButton')}
                        </button>
                    )}
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>
            </div>
        </div>
    );
};

const ProposalForm: React.FC<{
    project: Project,
    onSubmit: ProjectDetailsPageProps['onSubmitProposal'],
    currentUserProfile: Freelancer,
    initialDraft: AIProposalDraft | null,
}> = ({ project, onSubmit, currentUserProfile, initialDraft }) => {
    const { t } = useLocale();
    const [coverLetter, setCoverLetter] = useState('');
    const [bid, setBid] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialDraft) {
            setCoverLetter(initialDraft.draftCoverLetter);
            // Set bid to the average of the suggested range
            const suggestedBid = Math.round((initialDraft.suggestedBidMin + initialDraft.suggestedBidMax) / 2);
            setBid(String(suggestedBid));
        }
    }, [initialDraft]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!coverLetter.trim() || !bid.trim()) {
            setError(t('errorBidCoverLetter'));
            return;
        }
        setError('');
        setIsSubmitting(true);
        await onSubmit(project.id, {
            freelancerId: currentUserProfile.id,
            freelancerName: currentUserProfile.name,
            freelancerAvatarUrl: currentUserProfile.avatarUrl,
            coverLetter,
            proposedBid: Number(bid)
        });
        setIsSubmitting(false);
    };
    
    return (
        <div className="bg-gray-50 p-6 rounded-lg mt-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{t('yourProposal')}</h3>
            {initialDraft && (
                 <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-md mb-4">
                     <p className="text-sm text-blue-800">
                        <span className="font-semibold">{t('aiSuggestion')}: </span>
                        {initialDraft.reasoning} {t('aiSuggestion personalize')}
                     </p>
                 </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">{t('coverLetter')}</label>
                    <textarea id="coverLetter" value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={8} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder={t('coverLetterPlaceholder')} required></textarea>
                </div>
                 <div>
                    <label htmlFor="bid" className="block text-sm font-medium text-gray-700">{t('yourBid')}</label>
                    <input type="number" id="bid" value={bid} onChange={e => setBid(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder={t('bidPlaceholder')} required />
                </div>
                 {error && <p className="text-red-500 text-sm">{error}</p>}
                 <button type="submit" disabled={isSubmitting} className="w-full bg-amber-600 text-white font-semibold py-3 rounded-md hover:bg-amber-700 transition-colors disabled:bg-gray-400">
                    {isSubmitting ? t('submittingProposal') : t('submitYourProposal')}
                </button>
            </form>
        </div>
    );
};

export const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({ project, onBack, onSubmitProposal, onAcceptProposal, currentUserProfile }) => {
    const { user } = useAuth();
    const { t } = useLocale();
    const [isProposalsModalOpen, setIsProposalsModalOpen] = useState(false);
    const [aiDraft, setAiDraft] = useState<AIProposalDraft | null>(null);

    const isClientOwner = user?.role === 'client' && user.name === project.clientName;
    const hasAlreadyProposed = user?.role === 'freelancer' && project.proposals?.some(p => p.freelancerId === user.id);

    return (
        <div className="bg-gray-50">
             {isProposalsModalOpen && (
                <ViewProposalsModal 
                    project={project}
                    onClose={() => setIsProposalsModalOpen(false)}
                    onAcceptProposal={(proposal) => {
                        onAcceptProposal(project.id, proposal);
                        setIsProposalsModalOpen(false);
                    }}
                />
             )}
            <div className="container mx-auto max-w-4xl px-6 py-12">
                 <button onClick={onBack} className="inline-flex items-center text-gray-600 hover:text-amber-600 font-semibold mb-8">
                    <BackIcon />
                    {t('backToProjects')}
                </button>
                <div className="bg-white rounded-lg shadow-lg p-8">
                     <div className="flex justify-between items-start border-b pb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{t(project.title)}</h1>
                            <p className="text-sm text-gray-500 mt-2">{t('postedByOn', { name: project.clientName, date: project.postedDate })}</p>
                        </div>
                        <span className="text-2xl font-bold text-amber-600">${project.budget}</span>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-xl font-semibold text-gray-700">{t('projectDescription')}</h2>
                        <p className="mt-2 text-gray-600 leading-relaxed whitespace-pre-line">{t(project.description)}</p>
                    </div>

                     <div className="mt-6">
                        <h3 className="text-xl font-semibold text-gray-700">{t('requiredSkills')}</h3>
                         <div className="flex flex-wrap gap-2 mt-2">
                            {project.skills.map(skill => (
                                <span key={skill} className="bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">{t(skill)}</span>
                            ))}
                        </div>
                    </div>

                    {project.freelancerName ? (
                        <div className="mt-8 text-center bg-green-50 p-4 rounded-lg">
                            <p className="font-semibold text-green-700">{t('assignedTo', {name: project.freelancerName})}</p>
                        </div>
                    ) : (
                         <>
                            {isClientOwner && (
                                <div className="mt-8">
                                    <button onClick={() => setIsProposalsModalOpen(true)} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-colors">
                                        {t('proposalsCount', { count: project.proposals?.length || 0 })}
                                    </button>
                                </div>
                            )}

                            {user?.role === 'freelancer' && currentUserProfile && (
                                hasAlreadyProposed ? (
                                    <div className="mt-8 text-center bg-gray-100 p-4 rounded-lg">
                                        <p className="font-semibold text-gray-700">{t('alreadyProposed')}</p>
                                    </div>
                                ) : (
                                    <>
                                        <AIProposalAssistant project={project} freelancer={currentUserProfile} onDraftGenerated={setAiDraft} />
                                        <ProposalForm project={project} onSubmit={onSubmitProposal} currentUserProfile={currentUserProfile} initialDraft={aiDraft} />
                                    </>
                                )
                            )}
                         </>
                    )}
                </div>
            </div>
        </div>
    );
};
