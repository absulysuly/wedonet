import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../services/api';
import type { User } from '../types';
import { useLocale } from '../contexts/LocaleContext';

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
);

export const UserManagementPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useLocale();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await getAllUsers();
                setUsers(fetchedUsers);
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-6 py-12">
                <button onClick={onBack} className="inline-flex items-center text-gray-600 hover:text-amber-600 font-semibold mb-8">
                    <BackIcon />
                    {t('backToAdminDashboard')}
                </button>
                <h1 className="text-4xl font-bold text-gray-800 mb-8">{t('userManagement')}</h1>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {isLoading ? (
                        <p className="p-6">{t('loadingUsers')}</p>
                    ) : (
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {t('userName')}
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {t('userEmail')}
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {t('userRole')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{user.name}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{user.email}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${
                                                user.role === 'admin' ? 'bg-red-200 text-red-900' :
                                                user.role === 'freelancer' ? 'bg-green-200 text-green-900' :
                                                'bg-blue-200 text-blue-900'
                                            }`}>
                                                <span aria-hidden className="absolute inset-0 opacity-50 rounded-full"></span>
                                                <span className="relative">{user.role}</span>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};