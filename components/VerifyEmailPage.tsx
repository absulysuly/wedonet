import React, { useState, useEffect } from 'react';
import { useLocale } from '../contexts/LocaleContext';
import { verifyEmail } from '../services/api';

const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ExclamationCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const LoadingSpinner = () => <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>;

export const VerifyEmailPage: React.FC<{ token: string | null, onNavigate: (page: string) => void }> = ({ token, onNavigate }) => {
    const { t } = useLocale();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            return;
        }

        const handleVerification = async () => {
            try {
                await verifyEmail(token);
                setStatus('success');
            } catch (error) {
                console.error(error);
                setStatus('error');
            }
        };
        
        // Add a small delay to show loading state
        const timer = setTimeout(handleVerification, 1000);
        return () => clearTimeout(timer);

    }, [token]);
    
    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <>
                        <LoadingSpinner />
                        <h2 className="mt-6 text-2xl font-bold text-gray-900">{t('verifyingEmail')}</h2>
                        <p className="mt-2 text-sm text-gray-600">{t('verifyingEmailMessage')}</p>
                    </>
                );
            case 'success':
                return (
                    <>
                        <CheckCircleIcon />
                        <h2 className="mt-6 text-2xl font-bold text-gray-900">{t('verificationSuccessTitle')}</h2>
                        <p className="mt-2 text-sm text-gray-600">{t('verificationSuccessMessage')}</p>
                        <button onClick={() => onNavigate('login')} className="mt-8 w-full bg-amber-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-amber-700 transition-colors">
                            {t('proceedToLogin')}
                        </button>
                    </>
                );
            case 'error':
                 return (
                    <>
                        <ExclamationCircleIcon />
                        <h2 className="mt-6 text-2xl font-bold text-gray-900">{t('verificationErrorTitle')}</h2>
                        <p className="mt-2 text-sm text-gray-600">{t('verificationErrorMessage')}</p>
                        <button onClick={() => onNavigate('home')} className="mt-8 w-full bg-gray-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-700 transition-colors">
                            {t('backToHome')}
                        </button>
                    </>
                );
        }
    };

    return (
        <div className="min-h-[calc(100vh-200px)] bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                {renderContent()}
            </div>
        </div>
    );
};
