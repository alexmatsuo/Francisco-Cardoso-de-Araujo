'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, ExternalLink, Music, Users, Clock, ChevronRight, Image, Eye } from "lucide-react";
import { Loading } from "@/components/Loading";

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
  imageFileNames?: string[];
  imageFileName?: string;
}

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      console.log('Fetching events...');
      const response = await fetch("/api/events");
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      
      // Handle backward compatibility for images
      const processedEvents = (data.events || []).map((event: Event) => ({
        ...event,
        imageFileNames: event.imageFileNames || (event.imageFileName ? [event.imageFileName] : [])
      }));
      
      setEvents(processedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events. Please try again later.");
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
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        time: date.toLocaleString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        fullDate: date.toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return { date: 'Date unavailable', time: '', fullDate: 'Date unavailable' };
    }
  };

  const getEventTypeStyle = (eventType: string) => {
    const styles = {
      concert: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      premiere: 'bg-green-500/20 text-green-400 border-green-500/30',
      workshop: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      masterclass: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      festival: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      default: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return styles[eventType as keyof typeof styles] || styles.default;
  };

  const handleEventClick = (eventId: number) => {
    router.push(`/events/${eventId}`);
  };

  if (isLoading) {
    return <Loading message="Loading events..." />;
  }

  if (error) {
    return (
      <main className="works-container">
        <div className="text-center text-red-400">
          <p className="mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              fetchEvents();
            }}
            className="text-[#D3CEAD] hover:text-[#C3BE9D] underline"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="works-container">
      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-[#D3CEAD]">Events & Performances</h1>
            <p className="text-[#D3CEAD]/70">Concerts, premieres, workshops, and more</p>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/5 backdrop-blur-sm px-4 py-2">
              <div className="text-2xl font-bold text-[#D3CEAD]">{events.filter(e => e.isUpcoming).length}</div>
              <div className="text-sm text-[#D3CEAD]/70">Upcoming</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm px-4 py-2">
              <div className="text-2xl font-bold text-[#D3CEAD]">{events.length}</div>
              <div className="text-sm text-[#D3CEAD]/70">Total Events</div>
            </div>
          </div>
        </div>

       {/* Filter Buttons - Universal Mobile Fix */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center sm:justify-start">
          <button
            onClick={() => setFilter('all')}
            className={`flex-shrink-0 px-4 py-3 text-sm transition-all duration-300 whitespace-nowrap ${
              filter === 'all' 
                ? 'border-[#D3CEAD] bg-[#D3CEAD] text-black' 
                : 'border-[#D3CEAD] text-[#D3CEAD] hover:bg-[#D3CEAD] hover:text-black'
            }`}
          >
            All ({events.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`flex-shrink-0 px-4 py-3 text-sm transition-all duration-300 whitespace-nowrap ${
              filter === 'upcoming' 
                ? 'border-[#D3CEAD] bg-[#D3CEAD] text-black' 
                : 'border-[#D3CEAD] text-[#D3CEAD] hover:bg-[#D3CEAD] hover:text-black'
            }`}
          >
            Upcoming ({events.filter(e => e.isUpcoming).length})
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`flex-shrink-0 px-4 py-3 text-sm transition-all duration-300 whitespace-nowrap ${
              filter === 'past' 
                ? 'border-[#D3CEAD] bg-[#D3CEAD] text-black ' 
                : 'border-[#D3CEAD] text-[#D3CEAD] hover:bg-[#D3CEAD] hover:text-black'
            }`}
          >
            Past ({events.filter(e => !e.isUpcoming).length})
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-[#D3CEAD]/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#D3CEAD] mb-2">No events found</h3>
          <p className="text-[#D3CEAD]/70">
            {filter === 'upcoming' && 'No upcoming events at this time.'}
            {filter === 'past' && 'No past events to display.'}
            {filter === 'all' && 'No events to display.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {filteredEvents.map((event) => {
            const { date, time, fullDate } = formatDateTime(event.date);
            const hasImages = event.imageFileNames && event.imageFileNames.length > 0;
            const eventTypeStyle = getEventTypeStyle(event.eventType);
            
            return (
              <div
                key={event.id}
                className="group bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:border-[#D3CEAD]/30 cursor-pointer overflow-hidden h-full flex flex-col"
                onClick={() => handleEventClick(event.id)}
              >
                <div className="p-6 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h2 className="text-lg font-bold text-[#D3CEAD] group-hover:text-white transition-colors line-clamp-2">
                          {event.title}
                        </h2>
                        {event.isUpcoming && (
                          <span className="px-2 py-1 text-xs font-semibold bg-green-500/20 text-green-400 whitespace-nowrap">
                            UPCOMING
                          </span>
                        )}
                      </div>
                      
                      {event.venue && (
                        <p className="text-[#D3CEAD]/80 font-medium text-sm line-clamp-1">{event.venue}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <div className={`px-2 py-1 text-xs font-medium uppercase border ${eventTypeStyle} whitespace-nowrap`}>
                        {event.eventType}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-4 h-4 text-[#D3CEAD]" />
                      </div>
                    </div>
                  </div>

                  {/* Date & Location - Always Visible */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#D3CEAD]/20 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-[#D3CEAD]" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-[#D3CEAD] text-sm">{date}</div>
                        {time && <div className="text-xs text-[#D3CEAD]/70">{time}</div>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#D3CEAD]/20 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-[#D3CEAD]" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-[#D3CEAD] text-sm line-clamp-1">{event.location}</div>
                      </div>
                    </div>
                  </div>

                  {/* Works & Performers - Compact */}
                  {(event.works || event.performers) && (
                    <div className="space-y-3 mb-4 flex-1">
                      {event.works && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#D3CEAD]/20 flex items-center justify-center flex-shrink-0">
                            <Music className="w-4 h-4 text-[#D3CEAD]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-[#D3CEAD] text-sm mb-1">Works</div>
                            <div className="text-xs text-[#D3CEAD]/80 leading-relaxed line-clamp-2">{event.works}</div>
                          </div>
                        </div>
                      )}

                      {event.performers && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#D3CEAD]/20 flex items-center justify-center flex-shrink-0">
                            <Users className="w-4 h-4 text-[#D3CEAD]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-[#D3CEAD] text-sm mb-1">Performers</div>
                            <div className="text-xs text-[#D3CEAD]/80 leading-relaxed line-clamp-2">{event.performers}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description - Truncated */}
                  {event.description && (
                    <div className="bg-white/5 p-3 mt-auto">
                      <p className="text-[#D3CEAD]/80 text-xs leading-relaxed line-clamp-3">{event.description}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {events.length > 0 && (
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-[#D3CEAD]/70">
          Showing {filteredEvents.length} of {events.length} events
        </div>
      )}
    </main>
  );
}