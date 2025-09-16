import React, { useMemo } from 'react';
import type { CommunityEvent } from '../types';
import { useCity } from '../contexts/CityContext';
import { useLocale } from '../contexts/LocaleContext';

interface EventCardProps {
    event: CommunityEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const { t } = useLocale();
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
            <img className="h-48 w-full object-cover" src={event.imageUrl} alt={t(event.title)} />
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-800">{t(event.title)}</h3>
                <p className="text-sm text-gray-500 mt-2">
                    <span className="font-semibold">{t('date')}</span> {event.date}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    <span className="font-semibold">{t('location')}</span> {event.location}
                </p>
                <p className="text-gray-600 mt-4 text-sm flex-grow">{t(event.description)}</p>
                <div className="mt-6">
                    <button className="w-full bg-amber-600 text-white font-semibold py-2 rounded-md hover:bg-amber-700 transition-colors">
                        {t('learnMore')}
                    </button>
                </div>
            </div>
        </div>
    );
}

interface CommunityEventsPageProps {
    events: CommunityEvent[];
}

export const CommunityEventsPage: React.FC<CommunityEventsPageProps> = ({ events }) => {
    const { selectedCity } = useCity();
    const { t } = useLocale();

    const filteredEvents = useMemo(() => {
        const cityKey = selectedCity === t('All Cities') ? 'All Cities' : selectedCity;
        if (cityKey === 'All Cities') {
            return events;
        }
        return events.filter(event => event.location.includes(cityKey));
    }, [events, selectedCity, t]);

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{t('communityEvents')}</h1>
                <p className="text-gray-600 mb-8">
                    {selectedCity === t('All Cities')
                        ? t('discoverEventsIraq')
                        : t('discoverEventsCity', { city: selectedCity })}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))
                    ) : (
                         <p className="text-gray-600 col-span-full text-center">{t('noEventsFound', { city: selectedCity })}</p>
                    )}
                </div>
            </div>
        </div>
    );
};