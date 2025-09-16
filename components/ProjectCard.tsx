import React from 'react';
import type { Project } from '../types';
import { useLocale } from '../contexts/LocaleContext';

interface ProjectCardProps {
    project: Project;
    onViewDetails: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewDetails }) => {
    const { t } = useLocale();
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all transform hover:-translate-y-1">
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-gray-800">{t(project.title)}</h3>
                <span className="text-lg font-semibold text-amber-600">${project.budget}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{t('postedByOn', { name: project.clientName, date: project.postedDate })}</p>
            <p className="text-gray-600 mt-4 text-sm">{t(project.description)}</p>
            <div className="mt-4 flex flex-wrap gap-2">
                {project.skills.map(skill => (
                    <span key={skill} className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">{t(skill)}</span>
                ))}
            </div>
            <button onClick={() => onViewDetails(project)} className="mt-6 w-full bg-amber-600 text-white font-semibold py-2 rounded-md hover:bg-amber-700 transition-colors">
                {t('viewProject')}
            </button>
        </div>
    );
};
