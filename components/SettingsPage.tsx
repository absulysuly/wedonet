import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocale } from '../contexts/LocaleContext';

type Tab = 'account' | 'notifications' | 'security';

const ToggleSwitch = ({ label, defaultChecked }: { label: string, defaultChecked?: boolean }) => (
    <div className="flex items-center justify-between py-2">
        <span className="text-gray-700">{label}</span>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" defaultChecked={defaultChecked} />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500"></div>
        </label>
    </div>
);

export const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const { t } = useLocale();
    const [activeTab, setActiveTab] = useState<Tab>('account');

    if (!user) {
        return <div className="p-8">{t('pleaseLoginDashboard')}</div>;
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'account':
                return (
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">{t('accountInfo')}</h3>
                        <p className="text-gray-500 mb-6">{t('updateAccountInfo')}</p>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">{t('fullName')}</label>
                                <input type="text" id="fullName" defaultValue={user.name} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('yourEmail')}</label>
                                <input type="email" id="email" defaultValue={user.email} disabled className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm" />
                            </div>
                             <button type="submit" className="bg-amber-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-amber-700">{t('saveChanges')}</button>
                        </form>
                    </div>
                );
            case 'notifications':
                return (
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">{t('emailNotifications')}</h3>
                        <div className="space-y-2 divide-y">
                            <ToggleSwitch label={t('newMessages')} defaultChecked />
                            <ToggleSwitch label={t('projectUpdates')} defaultChecked />
                            <ToggleSwitch label={t('platformAnnouncements')} />
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">{t('changePassword')}</h3>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="currentPassword">{t('currentPassword')}</label>
                                <input type="password" id="currentPassword" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label htmlFor="newPassword">{t('newPassword')}</label>
                                <input type="password" id="newPassword" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                             <div>
                                <label htmlFor="confirmNewPassword">{t('confirmNewPassword')}</label>
                                <input type="password" id="confirmNewPassword" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <button type="submit" className="bg-amber-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-amber-700">{t('updatePassword')}</button>
                        </form>
                    </div>
                );
        }
    };
    
    const TabButton: React.FC<{ tab: Tab; children: React.ReactNode }> = ({ tab, children }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left px-4 py-2 font-semibold rounded-md transition-colors ${activeTab === tab ? 'bg-amber-100 text-amber-800' : 'text-gray-600 hover:bg-gray-100'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">{t('accountSettings')}</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <aside className="md:col-span-1">
                        <nav className="flex flex-col space-y-2 bg-white p-4 rounded-lg shadow-md">
                            <TabButton tab="account">{t('account')}</TabButton>
                            <TabButton tab="notifications">{t('notifications')}</TabButton>
                            <TabButton tab="security">{t('security')}</TabButton>
                        </nav>
                    </aside>
                    <main className="md:col-span-3 bg-white p-8 rounded-lg shadow-md">
                        {renderTabContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};
