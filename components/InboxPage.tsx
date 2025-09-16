import React, { useState, useEffect } from 'react';
import { getConversations } from '../services/api';
import type { Conversation, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useLocale } from '../contexts/LocaleContext';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-40">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

export const InboxPage: React.FC<{ onStartChat: (partnerId: number) => void; }> = ({ onStartChat }) => {
    const { user } = useAuth();
    const { t } = useLocale();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchConversations = async () => {
            try {
                const convos = await getConversations(user.id);
                setConversations(convos);
            } catch (error) {
                console.error("Failed to fetch conversations:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchConversations();
    }, [user]);
    
    if (!user) {
        return <div className="p-8">{t('pleaseLoginDashboard')}</div>;
    }

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto max-w-4xl px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">{t('inbox')}</h1>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : conversations.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {conversations.map(({ partner, lastMessage }) => (
                                <li 
                                    key={partner.id} 
                                    onClick={() => onStartChat(partner.id)}
                                    className="p-4 hover:bg-gray-50 cursor-pointer flex items-center space-x-4 rtl:space-x-reverse"
                                >
                                    <img 
                                        className="h-12 w-12 rounded-full object-cover" 
                                        src={(partner as any).avatarUrl || `https://i.pravatar.cc/150?u=${partner.id}`} 
                                        alt={partner.name} 
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <p className="text-md font-semibold text-gray-800">{partner.name}</p>
                                            <p className="text-xs text-gray-500">{new Date(lastMessage.timestamp).toLocaleDateString()}</p>
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">
                                            {lastMessage.content.type === 'image' 
                                                ? 'Sent an image' 
                                                : lastMessage.content.value}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="text-xl font-semibold text-gray-700">{t('noConversations')}</h3>
                            <p className="mt-2 text-gray-500">{t('startAConversation')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
