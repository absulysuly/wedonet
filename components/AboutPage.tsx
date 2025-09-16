import React from 'react';
import { useLocale } from '../contexts/LocaleContext';

const teamMembers = [
    {
        nameKey: 'teamMember1Name',
        roleKey: 'teamMember1Role',
        avatarUrl: 'https://i.pravatar.cc/150?img=5'
    },
    {
        nameKey: 'teamMember2Name',
        roleKey: 'teamMember2Role',
        avatarUrl: 'https://i.pravatar.cc/150?img=6'
    },
    {
        nameKey: 'teamMember3Name',
        roleKey: 'teamMember3Role',
        avatarUrl: 'https://i.pravatar.cc/150?img=7'
    }
];

export const AboutPage: React.FC = () => {
    const { t } = useLocale();

    return (
        <div className="bg-white">
            <div className="container mx-auto px-6 py-16">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800">{t('aboutWedonet')}</h1>
                </div>
                
                <div className="mt-16 max-w-3xl mx-auto">
                    <div className="bg-amber-50 p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-amber-700 mb-4">{t('ourMission')}</h2>
                        <p className="text-gray-600 leading-relaxed">
                            {t('ourMissionText')}
                        </p>
                    </div>
                </div>

                <div className="mt-20">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{t('meetTheTeam')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {teamMembers.map((member) => (
                            <div key={member.nameKey} className="text-center">
                                <img
                                    src={member.avatarUrl}
                                    alt={t(member.nameKey)}
                                    className="w-32 h-32 rounded-full mx-auto object-cover ring-4 ring-amber-200"
                                />
                                <h3 className="mt-4 text-xl font-semibold text-gray-800">{t(member.nameKey)}</h3>
                                <p className="text-gray-500">{t(member.roleKey)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};