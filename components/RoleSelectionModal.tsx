import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocale } from '../contexts/LocaleContext';

const ClientIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.274-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.274.356-1.857m0 0a5.002 5.002 0 019.288 0M12 14a5 5 0 100-10 5 5 0 000 10z" /></svg>
);

const FreelancerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 21h14a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2z" /></svg>
);


export const RoleSelectionModal: React.FC = () => {
    const { selectUserRole } = useAuth();
    const { t } = useLocale();
    const [selectedRole, setSelectedRole] = useState<'client' | 'freelancer' | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selectedRole) return;
        setIsSubmitting(true);
        await selectUserRole(selectedRole);
        // The modal will be closed by the AuthContext state change
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-auto p-8 text-center animate-fade-in-up">
                <h2 className="text-3xl font-bold text-gray-800">{t('welcomeToWedonet')}</h2>
                <p className="text-gray-600 mt-2 mb-8">{t('completeYourProfile')}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                        onClick={() => setSelectedRole('client')}
                        className={`p-6 border-2 rounded-lg text-center transition-all duration-200 ${selectedRole === 'client' ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200' : 'border-gray-300 hover:border-amber-400'}`}
                    >
                        <ClientIcon />
                        <h3 className="text-lg font-bold text-gray-800">{t('iAmAClient')}</h3>
                        <p className="text-sm text-gray-500 mt-1">{t('clientDescription')}</p>
                    </button>
                    <button
                        onClick={() => setSelectedRole('freelancer')}
                        className={`p-6 border-2 rounded-lg text-center transition-all duration-200 ${selectedRole === 'freelancer' ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200' : 'border-gray-300 hover:border-amber-400'}`}
                    >
                        <FreelancerIcon />
                        <h3 className="text-lg font-bold text-gray-800">{t('iAmAFreelancer')}</h3>
                        <p className="text-sm text-gray-500 mt-1">{t('freelancerDescription')}</p>
                    </button>
                </div>
                
                <div className="mt-8">
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedRole || isSubmitting}
                        className="w-full max-w-xs mx-auto bg-amber-600 text-white font-bold py-3 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? '...' : t('confirmSelection')}
                    </button>
                </div>
            </div>
        </div>
    );
};