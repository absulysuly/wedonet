import React from 'react';
import { useLocale } from '../contexts/LocaleContext';

const PageLayout: React.FC<{ titleKey: string }> = ({ titleKey }) => {
    const { t } = useLocale();
    return (
        <div className="bg-white">
            <div className="container mx-auto px-6 py-24 text-center">
                <h1 className="text-4xl font-bold text-gray-800">{t(titleKey)}</h1>
                <div className="mt-8 max-w-2xl mx-auto bg-gray-50 p-10 rounded-lg">
                    <h2 className="text-2xl font-semibold text-amber-700">{t('pageUnderConstruction')}</h2>
                    <p className="mt-4 text-gray-600">
                       {t('pageComingSoon')}
                    </p>
                </div>
            </div>
        </div>
    );
};


export const HowItWorksPage: React.FC = () => <PageLayout titleKey="howItWorks" />;
export const PricingPage: React.FC = () => <PageLayout titleKey="pricing" />;
export const BlogPage: React.FC = () => <PageLayout titleKey="blog" />;
export const PrivacyPolicyPage: React.FC = () => <PageLayout titleKey="privacyPolicy" />;
export const TermsOfServicePage: React.FC = () => <PageLayout titleKey="termsOfService" />;