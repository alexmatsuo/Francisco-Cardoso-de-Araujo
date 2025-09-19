'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, ExternalLink, Music, Users, Clock, ChevronRight, Image, Eye, Grid, List } from "lucide-react";
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
  posterUrl?: string;  // Main poster image
  imageUrls?: string[]; // Additional images
  pdfUrl?: string;
  imageFileNames?: string[];
  imageFileName?: string;
}

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
      concert: 'bg-blue-500/20 text-blue-400',
      premiere: 'bg-green-500/20 text-green-400',
      workshop: 'bg-purple-500/20 text-purple-400',
      masterclass: 'bg-orange-500/20 text-orange-400',
      festival: 'bg-pink-500/20 text-pink-400',
      default: 'bg-gray-500/20 text-gray-400'
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

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 flex-1">
            <button
              onClick={() => setFilter('all')}
              className={`flex-shrink-0 px-4 py-3 text-sm transition-all duration-300 whitespace-nowrap ${
                filter === 'all' 
                  ? 'bg-[#D3CEAD] text-black' 
                  : 'text-[#D3CEAD] hover:bg-[#D3CEAD] hover:text-black'
              }`}
            >
              All ({events.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`flex-shrink-0 px-4 py-3 text-sm transition-all duration-300 whitespace-nowrap ${
                filter === 'upcoming' 
                  ? 'bg-[#D3CEAD] text-black' 
                  : 'text-[#D3CEAD] hover:bg-[#D3CEAD] hover:text-black'
              }`}
            >
              Upcoming ({events.filter(e => e.isUpcoming).length})
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`flex-shrink-0 px-4 py-3 text-sm transition-all duration-300 whitespace-nowrap ${
                filter === 'past' 
                  ? 'bg-[#D3CEAD] text-black' 
                  : 'text-[#D3CEAD] hover:bg-[#D3CEAD] hover:text-black'
              }`}
            >
              Past ({events.filter(e => !e.isUpcoming).length})
            </button>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex bg-white/5 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-[#D3CEAD] text-black' 
                  : 'text-[#D3CEAD] hover:bg-white/10'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 transition-colors ${
                viewMode === 'list' 
                  ? 'bg-[#D3CEAD] text-black' 
                  : 'text-[#D3CEAD] hover:bg-white/10'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Events Display */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-[#D3CEAD] mb-2">No events found</h3>
          <p className="text-[#D3CEAD]/70">
            {filter === 'upcoming' && 'No upcoming events at this time.'}
            {filter === 'past' && 'No past events to display.'}
            {filter === 'all' && 'No events to display.'}
          </p>
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-6 text-sm text-[#D3CEAD]/70">
            Showing {filteredEvents.length} of {events.length} events
          </div>

          {/* Grid View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEvents.map((event) => {
                const { date, time } = formatDateTime(event.date);
                const eventTypeStyle = getEventTypeStyle(event.eventType);
                const hasImage = event.posterUrl || (event.imageFileNames && event.imageFileNames.length > 0);
                const imageUrl = event.posterUrl || (event.imageFileNames && event.imageFileNames[0] ? `/uploads/${event.imageFileNames[0]}` : null);
                
                return (
                  <div
                    key={event.id}
                    className="group bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 cursor-pointer overflow-hidden h-full flex flex-col relative"
                    onClick={() => handleEventClick(event.id)}
                  >
                    {/* Poster Image - Positioned absolutely */}
                    {hasImage && imageUrl && (
                      <div className="absolute top-4 right-4 w-32 h-48 flex-shrink-0 overflow-hidden z-10">
                        <img 
                          src={imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="p-4 pr-32 flex-1 flex flex-col">
                      {/* Header */}
                      <div className="mb-3">
                        <h2 className="text-lg font-bold text-[#D3CEAD] group-hover:text-white transition-colors line-clamp-2 mb-2">
                          {event.title}
                        </h2>
                        {event.venue && (
                          <p className="text-[#D3CEAD]/80 font-medium text-sm line-clamp-1 mb-2">{event.venue}</p>
                        )}
                      </div>

                      {/* Date & Location */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-[#D3CEAD]" />
                          <div className="text-sm text-[#D3CEAD]">{date}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-[#D3CEAD]" />
                          <div className="text-sm text-[#D3CEAD] line-clamp-1">{event.location}</div>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-2 py-1 text-xs font-medium uppercase ${eventTypeStyle}`}>
                          {event.eventType}
                        </span>
                        {event.isUpcoming && (
                          <span className="px-2 py-1 text-xs font-semibold bg-green-500/20 text-green-400">
                            UPCOMING
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {event.description && (
                        <div className="mt-auto">
                          <p className="text-[#D3CEAD]/80 text-xs leading-relaxed line-clamp-3">{event.description}</p>
                        </div>
                      )}
                    </div>

                    {/* Eye icon */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-4 h-4 text-[#D3CEAD]" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="flex flex-col gap-4">
              {filteredEvents.map((event) => {
                const { date, time } = formatDateTime(event.date);
                const eventTypeStyle = getEventTypeStyle(event.eventType);
                
                return (
                  <div
                    key={event.id}
                    className="group flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 cursor-pointer"
                    onClick={() => handleEventClick(event.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h2 className="font-semibold text-[#D3CEAD] group-hover:text-white transition-colors">
                          {event.title}
                        </h2>
                        <span className="text-sm text-[#D3CEAD]/70">({date})</span>
                        <span className={`px-2 py-1 text-xs uppercase ${eventTypeStyle}`}>
                          {event.eventType}
                        </span>
                        {event.isUpcoming && (
                          <span className="px-2 py-1 text-xs font-semibold bg-green-500/20 text-green-400">
                            UPCOMING
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-base text-[#D3CEAD]/80">
                        <span>{event.location}</span>
                        {event.venue && (
                          <>
                            <span className="text-[#D3CEAD]/40">•</span>
                            <span>{event.venue}</span>
                          </>
                        )}
                        {event.works && (
                          <>
                            <span className="text-[#D3CEAD]/40">•</span>
                            <span className="line-clamp-1">{event.works}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-5 h-5 text-[#D3CEAD]" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Summary */}
      {events.length > 0 && (
        <div className="mt-12 pt-8 text-center text-sm text-[#D3CEAD]/70">
          Showing {filteredEvents.length} of {events.length} events
        </div>
      )}
    </main>
  );
}