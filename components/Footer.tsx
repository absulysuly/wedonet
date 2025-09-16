import React from 'react';
import { useLocale } from '../contexts/LocaleContext';

interface FooterProps {
    onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    const { t } = useLocale();

    const NavButton: React.FC<{ page: string; children: React.ReactNode }> = ({ page, children }) => (
        <button onClick={() => onNavigate(page)} className="text-gray-400 hover:text-white text-left">{children}</button>
    );

    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-bold"><span className="text-amber-500">We</span>donet</h3>
                        <p className="mt-2 text-gray-400 text-sm">{t('tagline')}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">{t('forClients')}</h4>
                        <ul className="mt-4 space-y-2 text-sm flex flex-col items-start">
                            <li><NavButton page="directory">{t('findAFreelancer')}</NavButton></li>
                            <li><NavButton page="how-it-works">{t('howItWorks')}</NavButton></li>
                            <li><NavButton page="blog">{t('blog')}</NavButton></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold">{t('forFreelancers')}</h4>
                        <ul className="mt-4 space-y-2 text-sm flex flex-col items-start">
                             <li><NavButton page="home">{t('joinWedonet')}</NavButton></li>
                            <li><NavButton page="pricing">{t('pricing')}</NavButton></li>
                            <li><NavButton page="dashboard">{t('dashboard')}</NavButton></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold">{t('company')}</h4>
                        <ul className="mt-4 space-y-2 text-sm flex flex-col items-start">
                            <li><NavButton page="about">{t('aboutUs')}</NavButton></li>
                            <li><NavButton page="contact">{t('contactUs')}</NavButton></li>
                            <li><NavButton page="privacy-policy">{t('privacyPolicy')}</NavButton></li>
                            <li><NavButton page="terms-of-service">{t('termsOfService')}</NavButton></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
                    <p>{t('copyright', { year: new Date().getFullYear() })}</p>
                </div>
            </div>
        </footer>
    );
};