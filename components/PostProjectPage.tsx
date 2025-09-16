import React, { useState } from 'react';
import { useLocale } from '../contexts/LocaleContext';
import { createProject } from '../services/api';
import type { Project } from '../types';
import { useAuth } from '../contexts/AuthContext';

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
);

interface PostProjectPageProps {
    onProjectCreated: (project: Project) => void;
    onBack: () => void;
}

export const PostProjectPage: React.FC<PostProjectPageProps> = ({ onProjectCreated, onBack }) => {
    const { t } = useLocale();
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [skills, setSkills] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim() || !budget.trim() || !skills.trim()) {
            setError(t('errorAllFieldsRequired'));
            return;
        }
        
        setError('');
        setIsSubmitting(true);
        
        try {
            const newProjectData = {
                title,
                description,
                budget: Number(budget),
                skills: skills.split(',').map(skill => skill.trim()),
            };
            const newProject = await createProject(newProjectData, user!.name);
            onProjectCreated(newProject);
        } catch (err) {
            console.error(err);
            setError(t('errorUnexpected'));
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="bg-gray-50">
            <div className="container mx-auto max-w-3xl px-6 py-12">
                <button onClick={onBack} className="inline-flex items-center text-gray-600 hover:text-amber-600 font-semibold mb-8">
                    <BackIcon />
                    {t('backToDashboard')}
                </button>
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('tellUsAboutProject')}</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">{t('projectTitle')}</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder={t('projectTitlePlaceholder')}
                            />
                        </div>
                         <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">{t('projectDescription')}</label>
                            <textarea
                                id="description"
                                rows={6}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder={t('projectDescriptionPlaceholder_Post')}
                            ></textarea>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">{t('budget')}</label>
                                <input
                                    type="number"
                                    id="budget"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    placeholder={t('budgetPlaceholder')}
                                />
                            </div>
                              <div>
                                <label htmlFor="skills" className="block text-sm font-medium text-gray-700">{t('requiredSkills')}</label>
                                <input
                                    type="text"
                                    id="skills"
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    placeholder={t('requiredSkillsPlaceholder')}
                                />
                                <p className="text-xs text-gray-500 mt-1">Separate skills with a comma.</p>
                            </div>
                        </div>
                        
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        
                        <div className="pt-4 text-right">
                             <button type="submit" disabled={isSubmitting} className="bg-amber-600 text-white font-semibold py-3 px-8 rounded-md hover:bg-amber-700 transition-colors disabled:bg-gray-400">
                                {isSubmitting ? t('postingProject') : t('postNewProject')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
