import React from 'react';
import type { Project, Freelancer, ProjectStatus } from '../types';
import { useLocale } from '../contexts/LocaleContext';

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
);

interface ManageProjectPageProps {
    project: Project;
    freelancer: Freelancer;
    onBack: () => void;
    onUpdateStatus: (projectId: number, status: ProjectStatus) => void;
    onContact: () => void;
}

const StatusTimeline: React.FC<{ currentStatus: ProjectStatus }> = ({ currentStatus }) => {
    const { t } = useLocale();
    const statuses: ProjectStatus[] = ['in-progress', 'review', 'completed'];
    const currentIndex = statuses.indexOf(currentStatus);

    return (
        <div className="flex items-center justify-between">
            {statuses.map((status, index) => {
                const isActive = index <= currentIndex;
                const isCurrent = index === currentIndex;
                return (
                    <React.Fragment key={status}>
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isActive ? 'bg-amber-500 border-amber-500 text-white' : 'bg-gray-200 border-gray-300 text-gray-500'}`}>
                                {index < currentIndex ? '✓' : index + 1}
                            </div>
                            <p className={`mt-2 text-xs font-semibold ${isCurrent ? 'text-amber-600' : 'text-gray-500'}`}>{t(`status.${status}`)}</p>
                        </div>
                        {index < statuses.length - 1 && <div className={`flex-1 h-1 mx-2 ${index < currentIndex ? 'bg-amber-500' : 'bg-gray-300'}`}></div>}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export const ManageProjectPage: React.FC<ManageProjectPageProps> = ({ project, freelancer, onBack, onUpdateStatus, onContact }) => {
    const { t } = useLocale();
    
    const handleReleasePayment = () => {
        alert(t('paymentReleased', { amount: project.budget, name: freelancer.name }));
    }

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto max-w-4xl px-6 py-12">
                 <button onClick={onBack} className="inline-flex items-center text-gray-600 hover:text-amber-600 font-semibold mb-8">
                    <BackIcon />
                    {t('backToDashboard')}
                </button>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{t('projectManagement')}</h1>
                <p className="text-gray-600 mb-8">{t(project.title)}</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <main className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">{t('projectStatus')}</h2>
                            <StatusTimeline currentStatus={project.status} />
                             <div className="mt-6 text-right">
                                {project.status === 'in-progress' && (
                                    <button onClick={() => onUpdateStatus(project.id, 'review')} className="bg-amber-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-amber-700">
                                        Mark as Awaiting Review
                                    </button>
                                )}
                                 {project.status === 'review' && (
                                    <button onClick={() => onUpdateStatus(project.id, 'completed')} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700">
                                        {t('markAsCompleted')}
                                    </button>
                                )}
                            </div>
                        </div>
                         <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">{t('projectDeliverables')}</h2>
                            <p className="text-gray-500">{t('noDeliverables')}</p>
                        </div>
                    </main>
                    <aside className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">{t('hiredFreelancer')}</h3>
                             <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <img src={freelancer.avatarUrl} alt={freelancer.name} className="w-12 h-12 rounded-full"/>
                                <div>
                                    <p className="font-bold">{freelancer.name}</p>
                                    <p className="text-sm text-gray-500">{t(freelancer.category)}</p>
                                </div>
                            </div>
                            <button onClick={onContact} className="mt-4 w-full bg-transparent border border-amber-600 text-amber-600 font-semibold py-2 px-4 rounded-md hover:bg-amber-50 transition-colors">
                                {t('contactFreelancer')}
                            </button>
                        </div>
                        {project.status === 'completed' && (
                             <div className="bg-white p-6 rounded-lg shadow-md">
                                <button onClick={handleReleasePayment} className="w-full bg-green-600 text-white font-semibold py-3 rounded-md hover:bg-green-700 transition-colors">
                                    {t('releasePayment')} (${project.budget})
                                </button>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
};
