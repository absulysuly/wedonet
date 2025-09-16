import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocale } from '../contexts/LocaleContext';

interface AuthModalProps {
  closeModal: () => void;
}

const LoadingSpinner = () => (
    <div className="absolute inset-0 bg-white/50 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const GoogleIcon = () => (
    <svg className="w-5 h-5 me-2" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.485 11.54C34.643 7.964 29.743 6 24 6C13.486 6 5 14.486 5 25s8.486 19 19 19s19-8.486 19-19c0-1.042-.092-2.052-.266-3.024z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.524-5.524C34.643 7.964 29.743 6 24 6C17.66 6 12.064 9.09 8.216 13.591l-1.91-1.902z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-4.823C29.211 35.091 26.715 36 24 36c-5.222 0-9.618-3.356-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 4.823C42.019 35.637 44 30.651 44 25c0-1.042-.092-2.052-.266-3.024z" />
    </svg>
);

const FacebookIcon = () => (
    <svg className="w-5 h-5 me-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
         <path fill="#1877F2" d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.407.593 24 1.324 24h11.494v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.324V1.324C24 .593 23.407 0 22.676 0z"/>
    </svg>
);


export const AuthModal: React.FC<AuthModalProps> = ({ closeModal }) => {
    const [view, setView] = useState<'login' | 'register'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { loginWithEmail, registerWithEmail, loginWithGoogle, loginWithFacebook } = useAuth();
    const { t } = useLocale();
    
    const handleSocialLogin = async (provider: 'google' | 'facebook') => {
        setIsLoading(true);
        setError('');
        try {
            if (provider === 'google') {
                await loginWithGoogle();
            } else {
                await loginWithFacebook();
            }
            closeModal();
        } catch (err: any) {
            setError(err.message || t('errorUnexpected'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            if (view === 'login') {
                await loginWithEmail(email, password);
            } else {
                await registerWithEmail(name, email, password);
            }
            // On success, the AuthContext will either close the modal by changing state or show the role selection
        } catch (err: any) {
            setError(err.message || t('errorUnexpected'));
        } finally {
            setIsLoading(false);
        }
    };

    const toggleView = () => {
        setError('');
        setView(view === 'login' ? 'register' : 'login');
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={closeModal}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm mx-auto" onClick={(e) => e.stopPropagation()}>
                <div className="relative p-8">
                    {isLoading && <LoadingSpinner />}
                    
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                        {view === 'login' ? t('login') : t('register')}
                    </h2>
                    <p className="text-gray-500 text-center mb-6">
                        {view === 'login' ? t('loginToContinue') : t('createAnAccount')}
                    </p>
                    
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                        {view === 'register' && (
                             <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('fullName')}</label>
                                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('yourEmail')}</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t('password')}</label>
                            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500" />
                        </div>
                        
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <button type="submit" disabled={isLoading} className="w-full bg-amber-600 text-white font-semibold py-2.5 rounded-md hover:bg-amber-700 transition-colors disabled:bg-gray-400">
                             {view === 'login' ? t('login') : t('register')}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">OR</span>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <button onClick={() => handleSocialLogin('google')} disabled={isLoading} className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 transition-colors">
                            <GoogleIcon />
                            {t('signInWithGoogle')}
                        </button>
                         <button onClick={() => handleSocialLogin('facebook')} disabled={isLoading} className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 transition-colors">
                            <FacebookIcon />
                            {t('signInWithFacebook')}
                        </button>
                    </div>

                    <p className="mt-6 text-center text-sm">
                        <button onClick={toggleView} className="font-medium text-amber-600 hover:text-amber-500">
                            {view === 'login' ? t('dontHaveAccount') : t('alreadyHaveAccount')}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};