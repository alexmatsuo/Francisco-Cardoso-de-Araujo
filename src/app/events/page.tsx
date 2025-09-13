'use client'

import { useState, useEffect } from "react";
import { Calendar, MapPin, ExternalLink, Music, Users, Clock } from "lucide-react";

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  venue?: string;
  description?: string;
  eventType: string;
  works?: string;
  performers?: string;
  website?: string;
  isUpcoming: boolean;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'upcoming') return event.isUpcoming;
    if (filter === 'past') return !event.isUpcoming;
    return true;
  });

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <main className="works-container">
        <div className="text-center text-[#D3CEAD]">Loading ...</div>
      </main>
    );
  }

  return (
    <main className="works-container">
      <h1 className="works-title">Events & Performances</h1>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            filter === 'all' 
              ? 'border-[#D3CEAD] bg-[#D3CEAD] text-black' 
              : 'border-[#D3CEAD] text-[#D3CEAD] hover:bg-[#D3CEAD] hover:text-black'
          }`}
        >
          All Events
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            filter === 'upcoming' 
              ? 'border-[#D3CEAD] bg-[#D3CEAD] text-black' 
              : 'border-[#D3CEAD] text-[#D3CEAD] hover:bg-[#D3CEAD] hover:text-black'
          }`}
        >
          Upcoming ({events.filter(e => e.isUpcoming).length})
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            filter === 'past' 
              ? 'border-[#D3CEAD] bg-[#D3CEAD] text-black' 
              : 'border-[#D3CEAD] text-[#D3CEAD] hover:bg-[#D3CEAD] hover:text-black'
          }`}
        >
          Past Events ({events.filter(e => !e.isUpcoming).length})
        </button>
      </div>

      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className={`work-item ${event.website ? "work-item-hover" : ""} ${
              event.isUpcoming ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-gray-500'
            }`}
            onClick={event.website ? () => window.open(event.website, '_blank') : undefined}
          >
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-white text-lg">{event.title}</div>
                  {event.venue && (
                    <div className="text-sm text-gray-400 mb-1">{event.venue}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${
                    event.eventType === 'concert' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    event.eventType === 'premiere' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    event.eventType === 'workshop' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                    event.eventType === 'masterclass' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                    event.eventType === 'festival' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' :
                    'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {event.eventType}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    event.isUpcoming 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {event.isUpcoming ? 'Upcoming' : 'Past'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className="flex items-center gap-2 text-[#D3CEAD]">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="work-instruments">{formatDateTime(event.date)}</span>
                </div>

                <div className="flex items-center gap-2 text-[#D3CEAD]">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="work-instruments">{event.location}</span>
                </div>

                {event.works && (
                  <div className="flex items-start gap-2 text-[#D3CEAD]">
                    <Music className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="work-instruments">{event.works}</span>
                  </div>
                )}

                {event.performers && (
                  <div className="flex items-start gap-2 text-[#D3CEAD]">
                    <Users className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="work-instruments">{event.performers}</span>
                  </div>
                )}
              </div>

              {event.description && (
                <p className="text-gray-300 text-sm mb-2 leading-relaxed">{event.description}</p>
              )}
            </div>
            
            {event.website && (
              <div className="ml-4" title="Click to view event details">
                <ExternalLink className="w-5 h-5 text-[#D3CEAD] hover:text-[#C3BE9D] transition-colors" />
              </div>
            )}
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            {filter === 'upcoming' && 'No upcoming events at this time.'}
            {filter === 'past' && 'No past events to display.'}
            {filter === 'all' && 'No events to display.'}
          </div>
        )}
      </div>

    </main>
  );
}