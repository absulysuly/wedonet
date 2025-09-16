import React from 'react';
import type { Notification } from '../types';
import { useLocale } from '../contexts/LocaleContext';
import { markAllNotificationsAsRead } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface NotificationsPageProps {
    notifications: Notification[];
    onNavigate: (page: string, payload?: any) => void;
    onNotificationRead: (id: number) => void;
}

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
);


export const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications, onNavigate, onNotificationRead }) => {
    const { t } = useLocale();
    const { user } = useAuth();
    
    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            onNotificationRead(notification.id);
        }
        const [page, id] = notification.link.split('/');
        onNavigate(page, id ? { id: Number(id) } : undefined);
    };

    const handleMarkAllAsRead = async () => {
        if (!user) return;
        await markAllNotificationsAsRead(user.id);
        // This is an optimistic update. In a real app, you'd probably refetch.
        notifications.forEach(n => {
            if (!n.isRead) onNotificationRead(n.id);
        });
    };

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto max-w-3xl px-6 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">{t('notifications')}</h1>
                    <button onClick={handleMarkAllAsRead} className="text-sm font-semibold text-amber-600 hover:underline">
                        {t('notif.markAllAsRead')}
                    </button>
                </div>
                
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {notifications.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {notifications.map(notification => (
                                <li key={notification.id}>
                                    <button 
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`w-full text-left p-4 flex items-start space-x-4 rtl:space-x-reverse transition-colors ${notification.isRead ? 'hover:bg-gray-50' : 'bg-amber-50 hover:bg-amber-100'}`}
                                    >
                                        <div className="flex-shrink-0 pt-1">
                                            <BellIcon />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-800">
                                                {t(notification.textKey, notification.textPayload)}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(notification.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                        {!notification.isRead && (
                                            <div className="flex-shrink-0 pt-1">
                                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                                            </div>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-16">
                            <h3 className="text-xl font-semibold text-gray-700">{t('notif.noNotifications')}</h3>
                            <p className="mt-2 text-gray-500">You're all caught up!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
