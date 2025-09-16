import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCity } from '../contexts/CityContext';
import { useLocale } from '../contexts/LocaleContext';
import type { Notification } from '../types';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
    onNavigate: (page: string, payload?: any) => void;
    notifications: Notification[];
    onNotificationRead: (id: number) => void;
}

const HamburgerIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
);

const BellIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
);


const CitySelector: React.FC = () => {
    const { selectedCity, setSelectedCityKey, citiesWithKeys } = useCity();
    return (
        <div className="relative">
            <select
                value={selectedCity}
                onChange={(e) => {
                    const selectedName = e.target.value;
                    const cityObject = citiesWithKeys.find(c => c.name === selectedName);
                    if (cityObject) {
                        setSelectedCityKey(cityObject.key);
                    }
                }}
                className="bg-gray-700 text-white rounded-md py-2 pl-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
                {citiesWithKeys.map(city => <option key={city.key} value={city.name}>{city.name}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
        </div>
    );
};

const UserMenu: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const { user, logout } = useAuth();
    const { t } = useLocale();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    if (!user) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-semibold transition-colors">
                <UserIcon />
                <span>{user.name.split(' ')[0]}</span>
            </button>
            {isOpen && (
                <div className="absolute end-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                    <button onClick={() => { onNavigate('dashboard'); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('dashboard')}</button>
                    <button onClick={() => { onNavigate('settings'); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('settings')}</button>
                    {user.role === 'admin' && (
                        <button onClick={() => { onNavigate('admin'); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('adminPanel')}</button>
                    )}
                    <div className="border-t my-1"></div>
                    <button onClick={() => { logout(); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('logout')}</button>
                </div>
            )}
        </div>
    );
};

const NotificationsMenu: React.FC<{ notifications: Notification[], onNavigate: HeaderProps['onNavigate'], onRead: (id: number) => void }> = ({ notifications, onNavigate, onRead }) => {
    const { t } = useLocale();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (notification: Notification) => {
        onRead(notification.id);
        const [page, id] = notification.link.split('/');
        onNavigate(page, id ? { id: Number(id) } : undefined);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="relative text-white p-2 rounded-full hover:bg-gray-700">
                <BellIcon />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-gray-800"></span>
                )}
            </button>
            {isOpen && (
                <div className="absolute end-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5">
                    <div className="p-3 font-semibold border-b text-gray-700">{t('notifications')}</div>
                    <div className="py-1 max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.slice(0, 5).map(n => (
                                <button
                                    key={n.id}
                                    onClick={() => handleNotificationClick(n)}
                                    className={`w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 flex items-start space-x-2 rtl:space-x-reverse ${!n.isRead ? 'bg-amber-50' : ''}`}
                                >
                                    {!n.isRead && <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>}
                                    <span className="flex-1">{t(n.textKey, n.textPayload)}</span>
                                </button>
                            ))
                        ) : (
                            <p className="px-3 py-4 text-sm text-gray-500 text-center">{t('notif.noNotifications')}</p>
                        )}
                    </div>
                    <div className="border-t">
                        <button onClick={() => { onNavigate('notifications'); setIsOpen(false); }} className="block w-full text-center px-4 py-2 text-sm font-semibold text-amber-600 hover:bg-gray-100">
                            {t('notif.viewAll')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


export const Header: React.FC<HeaderProps> = ({ onNavigate, notifications, onNotificationRead }) => {
    const { isAuthenticated } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t } = useLocale();

    const handleMobileNav = (page: string) => {
        onNavigate(page);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <header className="bg-gray-800 text-white shadow-md sticky top-0 z-40">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold cursor-pointer" onClick={() => onNavigate('home')}>
                        <span className="text-amber-500">We</span>donet
                    </div>
                    <nav className="hidden md:flex items-center space-x-6">
                        <button onClick={() => onNavigate('home')} className="hover:text-amber-500 transition-colors">{t('home')}</button>
                        <button onClick={() => onNavigate('directory')} className="hover:text-amber-500 transition-colors">{t('findFreelancers')}</button>
                        <button onClick={() => onNavigate('projects')} className="hover:text-amber-500 transition-colors">{t('projects')}</button>
                        <button onClick={() => onNavigate('legal-hub')} className="hover:text-amber-500 transition-colors">{t('legalHub')}</button>
                        <button onClick={() => onNavigate('events')} className="hover:text-amber-500 transition-colors">{t('events')}</button>
                        <button onClick={() => onNavigate('about')} className="hover:text-amber-500 transition-colors">{t('aboutUs')}</button>
                        <button onClick={() => onNavigate('contact')} className="hover:text-amber-500 transition-colors">{t('contactUs')}</button>
                    </nav>
                    <div className="flex items-center space-x-4">
                         <div className="hidden md:flex items-center space-x-4">
                            <CitySelector />
                            <LanguageSwitcher />
                            {isAuthenticated ? (
                                <>
                                    <NotificationsMenu notifications={notifications} onNavigate={onNavigate} onRead={onNotificationRead} />
                                    <UserMenu onNavigate={onNavigate} />
                                </>
                            ) : (
                                <>
                                    <button onClick={() => onNavigate('login')} className="text-sm">{t('login')}</button>
                                    <button onClick={() => onNavigate('signup')} className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-md text-sm font-semibold transition-colors">{t('register')}</button>
                                </>
                            )}
                        </div>
                        <div className="md:hidden">
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="focus:outline-none">
                                {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`transition-all duration-300 md:hidden ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'} overflow-hidden`}>
                     <nav className="px-6 pt-2 pb-4 flex flex-col space-y-3 bg-gray-800 border-t border-gray-700">
                        <button onClick={() => handleMobileNav('home')} className="text-left py-2 hover:text-amber-500 transition-colors">{t('home')}</button>
                        <button onClick={() => handleMobileNav('directory')} className="text-left py-2 hover:text-amber-500 transition-colors">{t('findFreelancers')}</button>
                        <button onClick={() => handleMobileNav('projects')} className="text-left py-2 hover:text-amber-500 transition-colors">{t('projects')}</button>
                        <button onClick={() => handleMobileNav('legal-hub')} className="text-left py-2 hover:text-amber-500 transition-colors">{t('legalHub')}</button>
                        <button onClick={() => handleMobileNav('events')} className="text-left py-2 hover:text-amber-500 transition-colors">{t('events')}</button>
                        <button onClick={() => handleMobileNav('about')} className="text-left py-2 hover:text-amber-500 transition-colors">{t('aboutUs')}</button>
                        <button onClick={() => handleMobileNav('contact')} className="text-left py-2 hover:text-amber-500 transition-colors">{t('contactUs')}</button>
                        
                        <div className="pt-4 border-t border-gray-700 space-y-4">
                             {isAuthenticated ? (
                                <>
                                    <button onClick={() => handleMobileNav('notifications')} className="text-left py-2 hover:text-amber-500 transition-colors w-full">{t('notifications')}</button>
                                    <UserMenu onNavigate={handleMobileNav} />
                                </>
                            ) : (
                                <div className="flex space-x-2 rtl:space-x-reverse">
                                    <button onClick={() => { onNavigate('login'); setIsMobileMenuOpen(false); }} className="flex-1 text-sm border border-gray-500 py-2 rounded-md">{t('login')}</button>
                                    <button onClick={() => { onNavigate('signup'); setIsMobileMenuOpen(false); }} className="flex-1 bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-md text-sm font-semibold transition-colors">{t('register')}</button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                           <CitySelector />
                           <LanguageSwitcher />
                        </div>
                    </nav>
                </div>
            </header>
        </>
    );
};