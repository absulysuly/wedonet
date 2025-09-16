import React, { useState } from 'react';
import type { Freelancer } from '../types';
import { useLocale } from '../contexts/LocaleContext';

interface EditProfileFormProps {
  freelancer: Freelancer;
  onSave: (updatedData: Freelancer) => Promise<void>;
  onCancel: () => void;
}

const LoadingSpinner = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

export const EditProfileForm: React.FC<EditProfileFormProps> = ({ freelancer, onSave, onCancel }) => {
  const { t } = useLocale();
  const [formData, setFormData] = useState({
    name: freelancer.name,
    bio: t(freelancer.bio), // Translate on load for editing
    experienceYears: freelancer.experienceYears,
    avatarUrl: freelancer.avatarUrl,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.bio.trim()) {
        setError(t('errorNameBioRequired'));
        return;
    }
    setError('');
    setIsSaving(true);
    
    // NOTE: In a real app, you would upload the avatar image file and get a URL.
    // Here we are using the base64 data URL directly.
    // Also, the bio is plain text here; in a real app it should be a translation key.
    // For this mock, we are saving the translated text back.
    const updatedFreelancer: Freelancer = {
        ...freelancer,
        ...formData,
        experienceYears: Number(formData.experienceYears),
        // This is a simplification. In a real i18n system, you wouldn't save the translated string.
        // You would have a separate process for updating translation keys.
        bio: `freelancer.${freelancer.id}.bio.updated`, // Create a new pseudo-key
    };

    await onSave(updatedFreelancer);
    setIsSaving(false);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('editProfile')}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
                <img src={formData.avatarUrl} alt="Avatar Preview" className="h-24 w-24 rounded-full object-cover" />
                <div>
                    <label htmlFor="avatar-upload" className="cursor-pointer bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-50 transition-colors">
                        {t('changeAvatar')}
                    </label>
                    <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    <p className="text-xs text-gray-500 mt-2">{t('avatarRecommended')}</p>
                </div>
            </div>

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('fullName')}</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
            </div>
            
            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">{t('aboutYourself')}</label>
                <textarea
                    id="bio"
                    name="bio"
                    rows={5}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
            </div>

            <div>
                <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700">{t('yearsOfExperience')}</label>
                <input
                    type="number"
                    id="experienceYears"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-md hover:bg-gray-300 transition-colors">
                    {t('cancel')}
                </button>
                <button type="submit" disabled={isSaving} className="bg-amber-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-amber-700 transition-colors disabled:bg-amber-400 flex items-center justify-center">
                    {isSaving ? <LoadingSpinner /> : t('saveChanges')}
                </button>
            </div>
        </form>
    </div>
  );
};
