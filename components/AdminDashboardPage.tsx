import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocale } from '../contexts/LocaleContext';

const StatCard: React.FC<{ title: string; value: string | number, icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 rtl:space-x-reverse">
        <div className="bg-amber-100 text-amber-600 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const ActionCard: React.FC<{ title: string; onClick: () => void }> = ({ title, onClick }) => (
    <button onClick={onClick} className="bg-white p-6 rounded-lg shadow-md text-left w-full hover:bg-gray-50 hover:shadow-lg transition-all">
        <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
    </button>
);

const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 016-5.197" /></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 21h14a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2z" /></svg>;

export const AdminDashboardPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const { user } = useAuth();
    const { t } = useLocale();

    if (user?.role !== 'admin') {
        return (
            <div className="container mx-auto px-6 py-16 text-center">
                <h1 className="text-3xl font-bold text-red-600">{t('notAuthorized')}</h1>
                <p className="mt-2 text-gray-600">{t('notAuthorizedSubtitle')}</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">{t('adminDashboard')}</h1>
                
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">{t('platformOverview')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title={t('totalUsers')} value="1,245" icon={<UsersIcon />} />
                    <StatCard title={t('totalFreelancers')} value="832" icon={<UsersIcon />} />
                    <StatCard title={t('totalClients')} value="413" icon={<UsersIcon />} />
                    <StatCard title={t('totalProjects')} value="589" icon={<BriefcaseIcon />} />
                </div>

                <h2 className="text-2xl font-semibold text-gray-700 mt-12 mb-4">{t('quickActions')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ActionCard title={t('manageUsers')} onClick={() => onNavigate('user-management')} />
                    <ActionCard title={t('manageProjects')} onClick={() => onNavigate('projects')} />
                    <ActionCard title={t('viewAnalytics')} onClick={() => alert('Navigate to Analytics')} />
                    <ActionCard title={t('contentManagement')} onClick={() => alert('Navigate to CMS')} />
                </div>
            </div>
        </div>
    );
};