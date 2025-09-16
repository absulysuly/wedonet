import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocale } from '../contexts/LocaleContext';
import type { Freelancer, Project, Proposal } from '../types';
import { EditProfileForm } from './EditProfileForm';
import { updateFreelancerProfile } from '../services/api';
import { ViewProposalsModal } from './ViewProposalsModal';

interface DashboardPageProps {
    freelancerProfile?: Freelancer;
    projects: Project[];
    freelancers: Freelancer[];
    onProfileUpdate: (updatedFreelancer: Freelancer) => void;
    onNavigate: (page: string) => void;
    onStartChat: (freelancer: Freelancer) => void;
    onProjectDeleted: (projectId: number) => void;
    onAcceptProposal: (projectId: number, proposal: Proposal) => void;
    onManageProject: (project: Project) => void;
}

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);

const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

const ProjectStatusBadge: React.FC<{ status: Project['status'] }> = ({ status }) => {
    const { t } = useLocale();
    const statusStyles: Record<Project['status'], string> = {
        open: 'bg-blue-100 text-blue-800',
        'in-progress': 'bg-yellow-100 text-yellow-800',
        review: 'bg-purple-100 text-purple-800',
        completed: 'bg-green-100 text-green-800',
    };
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]}`}>
            {t(`status.${status}`)}
        </span>
    );
};

export const DashboardPage: React.FC<DashboardPageProps> = ({ freelancerProfile, projects, freelancers, onProfileUpdate, onNavigate, onStartChat, onProjectDeleted, onAcceptProposal, onManageProject }) => {
    const { user } = useAuth();
    const { t } = useLocale();
    const [isEditing, setIsEditing] = useState(false);
    const [viewingProposalsFor, setViewingProposalsFor] = useState<Project | null>(null);

    useEffect(() => {
        if (!user) {
            onNavigate('login');
        }
    }, [user, onNavigate]);

    if (!user) {
        return null; // Render nothing while the redirect happens
    }
    
    const handleSaveProfile = async (updatedData: Freelancer) => {
        try {
            await updateFreelancerProfile(updatedData.id, updatedData);
            onProfileUpdate(updatedData);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    const handleDeleteProject = (e: React.MouseEvent, projectId: number) => {
        e.stopPropagation(); // Prevent card click
        if (window.confirm(t('deleteConfirmation'))) {
            onProjectDeleted(projectId);
        }
    };
    
    const renderClientDashboard = () => {
        const clientProjects = projects.filter(p => p.clientName === user.name);
        return (
            <div>
                 {viewingProposalsFor && (
                    <ViewProposalsModal
                        project={viewingProposalsFor}
                        onClose={() => setViewingProposalsFor(null)}
                        onAcceptProposal={(proposal) => {
                            onAcceptProposal(viewingProposalsFor.id, proposal);
                            setViewingProposalsFor(null);
                        }}
                    />
                )}
                <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('clientDashboard')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-xl">{t('myProjects')}</h3>
                             <button 
                                onClick={() => onNavigate('post-project')}
                                className="bg-amber-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-amber-700 transition-colors">
                                {t('postNewProject')}
                            </button>
                        </div>
                        {clientProjects.length > 0 ? (
                            <div className="space-y-4">
                                {clientProjects.map(project => (
                                    <div 
                                        key={project.id} 
                                        className={`border p-4 rounded-md flex justify-between items-center ${project.status !== 'open' ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                                        onClick={() => project.status !== 'open' && onManageProject(project)}
                                    >
                                        <div className="flex-1">
                                            <p className="font-semibold">{t(project.title)}</p>
                                            <div className="flex items-center space-x-3 rtl:space-x-reverse mt-1">
                                                <ProjectStatusBadge status={project.status} />
                                                <p className="text-sm text-gray-500">${project.budget}</p>
                                            </div>
                                            {project.status === 'open' ? (
                                                <button onClick={(e) => { e.stopPropagation(); setViewingProposalsFor(project); }} className="text-sm text-amber-600 hover:underline mt-1">
                                                    {t('proposalsCount', { count: project.proposals?.length || 0 })}
                                                </button>
                                            ) : (
                                                 <p className="text-sm text-gray-600 mt-1">{t('assignedTo', {name: project.freelancerName || '...'})}</p>
                                            )}
                                        </div>
                                        {project.status === 'open' && (
                                            <button onClick={(e) => handleDeleteProject(e, project.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50">
                                                <TrashIcon />
                                            </button>
                                        )}
                                         {project.status !== 'open' && (
                                            <button className="bg-amber-600 text-white text-sm font-semibold py-1 px-3 rounded-md hover:bg-amber-700 transition-colors">
                                                {t('manageProject')}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">{t('noActiveProjects')}</p>
                        )}
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <MailIcon />
                        <h3 className="font-semibold text-xl mt-4">{t('myMessages')}</h3>
                        <p className="text-sm text-gray-500 mt-2">Stay connected with freelancers and manage your project communications.</p>
                         <button onClick={() => onNavigate('inbox')} className="mt-6 bg-transparent border border-amber-600 text-amber-600 font-semibold py-2 px-4 rounded-md hover:bg-amber-50 transition-colors w-full">
                            {t('viewMessages')}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderFreelancerDashboard = () => {
        if (!freelancerProfile) {
            return <p>Loading profile...</p>;
        }
        
        const myActiveProjects = projects.filter(p => p.freelancerId === user.id);

        if (isEditing) {
            return <EditProfileForm freelancer={freelancerProfile} onSave={handleSaveProfile} onCancel={() => setIsEditing(false)} />;
        }
        
        return (
             <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('freelancerDashboard')}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                         <h3 className="font-semibold text-xl mb-4">{t('myActiveProjects')}</h3>
                         {myActiveProjects.length > 0 ? (
                             <div className="space-y-4">
                                {myActiveProjects.map(project => (
                                    <div key={project.id} className="border p-4 rounded-md">
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold">{t(project.title)}</p>
                                            <ProjectStatusBadge status={project.status} />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{t('client')}: {project.clientName} - ${project.budget}</p>
                                    </div>
                                ))}
                            </div>
                         ) : (
                             <p className="text-gray-600">{t('noAssignedProjects')}</p>
                         )}
                    </div>
                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="font-semibold text-xl mb-4">{t('myProfile')}</h3>
                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <img src={freelancerProfile.avatarUrl} alt={freelancerProfile.name} className="w-16 h-16 rounded-full"/>
                                <div>
                                    <p className="font-bold">{freelancerProfile.name}</p>
                                    <p className="text-sm text-gray-500">{t('profileCompleteness', { percent: 80 })}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsEditing(true)} className="mt-4 bg-amber-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-amber-700 transition-colors w-full">
                                {t('editProfile')}
                            </button>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="font-semibold text-xl mb-4">{t('availableProjects')}</h3>
                            <p className="text-gray-600">{t('newProjectsMessage', { count: projects.filter(p => !p.freelancerId).length })}</p>
                            <button onClick={() => onNavigate('projects')} className="mt-4 bg-transparent border border-amber-600 text-amber-600 font-semibold py-2 px-4 rounded-md hover:bg-amber-50 transition-colors w-full">
                                {t('browseProjects')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="bg-gray-50 min-h-[calc(100vh-200px)]">
            <div className="container mx-auto px-6 py-12">
                 {viewingProposalsFor && user?.role === 'client' && (
                    <ViewProposalsModal
                        project={viewingProposalsFor}
                        onClose={() => setViewingProposalsFor(null)}
                        onAcceptProposal={(proposal) => {
                            onAcceptProposal(viewingProposalsFor.id, proposal);
                            setViewingProposalsFor(null);
                        }}
                    />
                )}
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('welcomeBackUser', { name: user.name.split(' ')[0] })}</h1>
                {user.role === 'client' ? renderClientDashboard() : renderFreelancerDashboard()}
            </div>
        </div>
    );
};