import React, { useState } from 'react';
import { useLocale } from '../contexts/LocaleContext';
import { resendVerificationEmail } from '../services/api';

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);

export const CheckEmailPage: React.FC<{ email: string, onNavigate: (page: string) => void }> = ({ email, onNavigate }) => {
    const { t } = useLocale();
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);

    const handleResend = async () => {
        setIsResending(true);
        setResendSuccess(false);
        await resendVerificationEmail(email);
        setIsResending(false);
        setResendSuccess(true);
    };

    return (
        <div className="min-h-[calc(100vh-200px)] bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                <MailIcon />
                <h2 className="mt-6 text-2xl font-bold text-gray-900">{t('verifyYourEmail')}</h2>
                <p className="mt-2 text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: t('verifyEmailMessage', { email: `<strong>${email}</strong>` }) }} />

                <div className="mt-8">
                    <button
                        onClick={handleResend}
                        disabled={isResending}
                        className="w-full text-sm font-semibold text-amber-600 hover:underline disabled:text-gray-400"
                    >
                        {isResending ? t('resending') : t('resendVerificationEmail')}
                    </button>
                    {resendSuccess && <p className="text-green-600 text-sm mt-2">{t('resendSuccess')}</p>}
                </div>
                <div className="mt-4 border-t pt-4">
                    <button onClick={() => onNavigate('login')} className="text-sm font-semibold text-gray-600 hover:text-amber-600">
                        &larr; {t('backToLogin')}
                    </button>
                </div>
            </div>
        </div>
    );
};
