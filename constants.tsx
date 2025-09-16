import React from 'react';
import type { ServiceCategory } from './types';

const IconPlaceholder = ({ className }: { className?: string }) => (
    <svg className={`w-8 h-8 text-amber-600 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

export const SERVICE_CATEGORIES: ServiceCategory[] = [
    { id: 1, name: 'Web Development', icon: <IconPlaceholder /> },
    { id: 2, name: 'Graphic Design', icon: <IconPlaceholder /> },
    { id: 3, name: 'Digital Marketing', icon: <IconPlaceholder /> },
    { id: 4, name: 'Writing & Translation', icon: <IconPlaceholder /> },
    { id: 5, name: 'Video & Animation', icon: <IconPlaceholder /> },
    { id: 6, name: 'Music & Audio', icon: <IconPlaceholder /> },
    { id: 7, name: 'Business Consulting', icon: <IconPlaceholder /> },
    { id: 8, name: 'Legal Services', icon: <IconPlaceholder /> },
];
