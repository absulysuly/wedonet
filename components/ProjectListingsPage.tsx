import React from 'react';
import { ProjectCard } from './ProjectCard';
import type { Project } from '../types';
import { useLocale } from '../contexts/LocaleContext';

interface ProjectListingsPageProps {
    projects: Project[];
    onViewDetails: (project: Project) => void;
}

export const ProjectListingsPage: React.FC<ProjectListingsPageProps> = ({ projects, onViewDetails }) => {
    const { t } = useLocale();
    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{t('projectListings')}</h1>
                <p className="text-gray-600 mb-8">{t('findOpportunities')}</p>
                {projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map(project => (
                            <ProjectCard key={project.id} project={project} onViewDetails={onViewDetails} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-700">{t('noProjectsAvailable')}</h3>
                        <p className="mt-2 text-gray-500">{t('checkBackLater')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};