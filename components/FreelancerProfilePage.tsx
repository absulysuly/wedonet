import React, { useState } from 'react';
import type { Freelancer, AddReviewData, Project } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { addReview } from '../services/api';
import { useLocale } from '../contexts/LocaleContext';

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
);
const StarIcon: React.FC<{ filled: boolean; className?: string; }> = ({ filled, className = 'h-5 w-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`${className} ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);
const VerifiedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
    </svg>
);

const AddReviewForm: React.FC<{ freelancerId: number, onReviewAdded: (freelancer: Freelancer) => void }> = ({ freelancerId, onReviewAdded }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useAuth();
    const { t } = useLocale();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0 || !comment.trim()) {
            setError(t('errorReview'));
            return;
        }
        setIsSubmitting(true);
        setError('');
        setSuccess('');
        try {
            await addReview(freelancerId, { rating, comment }, user!.name);
            setSuccess(t('reviewSuccess'));
            setRating(0);
            setComment('');
            // We would typically refetch the freelancer data here to show the new review
            // For this mock, we'll just signal that an update happened.
        } catch (err) {
            setError(t('reviewFail'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h4 className="text-xl font-bold text-gray-800 mb-4">{t('leaveAReview')}</h4>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('yourRating')}</label>
                    <div className="flex space-x-1 rtl:space-x-reverse">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button type="button" key={star} onClick={() => setRating(star)} onMouseOver={() => setRating(star)}>
                                <StarIcon filled={star <= rating} className="h-8 w-8 cursor-pointer" />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                     <label htmlFor="comment" className="block text-sm font-medium text-gray-700">{t('yourComment')}</label>
                     <textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500" required></textarea>
                </div>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
                <button type="submit" disabled={isSubmitting} className="bg-amber-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-amber-700 transition-colors disabled:bg-gray-400">
                    {isSubmitting ? t('submitting') : t('submitReview')}
                </button>
            </form>
        </div>
    );
};


interface FreelancerProfilePageProps {
    freelancer: Freelancer;
    clientProjects: Project[];
    onStartChat: (freelancer: Freelancer) => void;
    onBack: () => void;
    onProfileUpdate: (freelancer: Freelancer) => void;
    onHire: () => void;
}

export const FreelancerProfilePage: React.FC<FreelancerProfilePageProps> = ({ freelancer, clientProjects, onStartChat, onBack, onProfileUpdate, onHire }) => {
    const { isAuthenticated, user } = useAuth();
    const { t } = useLocale();
    
    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-6 py-12">
                <button onClick={onBack} className="inline-flex items-center text-gray-600 hover:text-amber-600 font-semibold mb-8">
                    <BackIcon />
                    {t('backToDirectory')}
                </button>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Profile Card */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-8 sticky top-28">
                            <img src={freelancer.avatarUrl} alt={freelancer.name} className="h-32 w-32 rounded-full object-cover mx-auto ring-4 ring-amber-100" />
                            <div className="text-center mt-4">
                                <div className="flex items-center justify-center">
                                    <h1 className="text-2xl font-bold text-gray-800">{freelancer.name}</h1>
                                    {freelancer.isVerified && <span className="ms-2" title={t('verifiedProfessional')}><VerifiedIcon /></span>}
                                </div>
                                <p className="text-amber-600 font-medium mt-1">{t(freelancer.services[0])}</p>
                                <p className="text-gray-500 text-sm mt-2">{t(freelancer.location)}</p>
                            </div>
                            <div className="mt-6 flex justify-center items-center">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < Math.round(freelancer.rating)} />)}
                                </div>
                                <span className="ms-2 text-gray-600 text-sm">{freelancer.rating.toFixed(1)} {t('reviewsCount', { count: freelancer.reviewCount })}</span>
                            </div>
                            <div className="mt-6 border-t pt-6">
                                <p className="text-gray-500 text-sm flex justify-between"><span>{t('experience')}</span> <span className="font-semibold text-gray-700">{freelancer.experienceYears} {t('years')}</span></p>
                            </div>
                             <div className="mt-8 space-y-3">
                                <button
                                    onClick={() => onStartChat(freelancer)}
                                    className="w-full bg-amber-600 text-white font-semibold py-3 rounded-md hover:bg-amber-700 transition-colors"
                                >
                                    {t('messageUser', { name: freelancer.name.split(' ')[0] })}
                                </button>
                                {user?.role === 'client' && clientProjects.length > 0 && (
                                     <button
                                        onClick={onHire}
                                        className="w-full bg-green-600 text-white font-semibold py-3 rounded-md hover:bg-green-700 transition-colors"
                                    >
                                        {t('hireMe')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Right Column: Details & Reviews */}
                    <main className="lg:col-span-2">
                         <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">{t('aboutUser', { name: freelancer.name })}</h2>
                            <p className="mt-4 text-gray-600 leading-relaxed whitespace-pre-line">{t(freelancer.bio)}</p>

                             <h3 className="text-xl font-bold text-gray-800 mt-8 border-b pb-3 mb-4">{t('servicesOffered')}</h3>
                             <div className="flex flex-wrap gap-2">
                                {freelancer.services.map(service => (
                                    <span key={service} className="bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full">{t(service)}</span>
                                ))}
                            </div>
                        </div>

                         <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
                            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">{t('clientReviews', { count: freelancer.reviewCount })}</h2>
                            <div className="space-y-6">
                                {freelancer.reviews.length > 0 ? (
                                    freelancer.reviews.map(review => (
                                        <div key={review.id} className="flex space-x-4 rtl:space-x-reverse">
                                            <div className="flex-shrink-0">
                                                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">{review.author.charAt(0)}</div>
                                            </div>
                                            <div>
                                                <div className="flex items-center">
                                                    <h4 className="font-bold text-gray-800">{review.author}</h4>
                                                    <div className="flex ms-4">
                                                         {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < review.rating} />)}
                                                    </div>
                                                </div>
                                                <p className="mt-1 text-gray-600">{t(review.comment)}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">{t('noReviewsYet')}</p>
                                )}
                            </div>

                            {isAuthenticated && user?.role === 'client' && (
                               <AddReviewForm freelancerId={freelancer.id} onReviewAdded={onProfileUpdate} />
                            )}
                         </div>
                    </main>
                </div>
            </div>
        </div>
    );
};