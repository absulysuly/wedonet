import React, { useState } from 'react';
import type { Freelancer, Project } from '../types';
import { useLocale } from '../contexts/LocaleContext';

interface HireModalProps {
  freelancer: Freelancer;
  projects: Project[];
  onClose: () => void;
  onHire: (projectId: number, freelancer: Freelancer) => Promise<void>;
}

export const HireModal: React.FC<HireModalProps> = ({ freelancer, projects, onClose, onHire }) => {
    const { t } = useLocale();
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(projects.length > 0 ? projects[0].id : null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selectedProjectId) return;
        setIsSubmitting(true);
        await onHire(selectedProjectId, freelancer);
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('hireForProject', { name: freelancer.name.split(' ')[0] })}</h2>
                    <p className="text-gray-600 mb-6">{t('selectProjectToAssign', { name: freelancer.name.split(' ')[0] })}</p>

                    {projects.length > 0 ? (
                        <div className="space-y-4">
                            <select
                                value={selectedProjectId ?? ''}
                                onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
                            >
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {t(p.title)} (${p.budget})
                                    </option>
                                ))}
                            </select>

                            <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
                                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-md hover:bg-gray-300 transition-colors">
                                    {t('cancel')}
                                </button>
                                <button 
                                    onClick={handleSubmit} 
                                    disabled={isSubmitting || !selectedProjectId} 
                                    className="bg-green-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400"
                                >
                                    {isSubmitting ? t('assigning') : t('assignProject')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                             <p className="text-center text-gray-500 bg-gray-50 p-6 rounded-md">{t('noOpenProjects')}</p>
                             <div className="text-right mt-4">
                                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-md hover:bg-gray-300 transition-colors">
                                    {t('cancel')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};