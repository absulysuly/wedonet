import React, { useState } from 'react';
import { useLocale } from '../contexts/LocaleContext';

const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

export const ContactPage: React.FC = () => {
    const { t } = useLocale();
    const [formStatus, setFormStatus] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('sending');
        // Simulate API call
        setTimeout(() => {
            setFormStatus('sent');
            // Clear form on success
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
        }, 1500);
    };

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-6 py-16">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800">{t('getInTouch')}</h1>
                    <p className="mt-3 text-gray-600 max-w-2xl mx-auto">{t('contactSubtitle')}</p>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-center">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <LocationIcon />
                        <h3 className="text-xl font-semibold mt-4">{t('ourOffice')}</h3>
                        <p className="text-gray-500 mt-2">{t('officeAddress')}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <MailIcon />
                        <h3 className="text-xl font-semibold mt-4">{t('emailSupport')}</h3>
                        <p className="text-gray-500 mt-2">{t('emailAddress')}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <PhoneIcon />
                        <h3 className="text-xl font-semibold mt-4">{t('phoneSupport')}</h3>
                        <p className="text-gray-500 mt-2">{t('phoneNumber')}</p>
                    </div>
                </div>

                <div className="mt-16 max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('contactFormTitle')}</h2>
                    {formStatus === 'sent' ? (
                        <p className="text-green-600 font-semibold">{t('messageSentSuccess')}</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('yourName')}</label>
                                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('yourEmail')}</label>
                                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">{t('subject')}</label>
                                <input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">{t('yourMessage')}</label>
                                <textarea id="message" rows={4} value={message} onChange={e => setMessage(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"></textarea>
                            </div>
                            <div>
                                <button type="submit" disabled={formStatus === 'sending'} className="w-full bg-amber-600 text-white font-semibold py-3 rounded-md hover:bg-amber-700 transition-colors disabled:bg-gray-400">
                                    {formStatus === 'sending' ? t('sending') : t('sendMessage')}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
