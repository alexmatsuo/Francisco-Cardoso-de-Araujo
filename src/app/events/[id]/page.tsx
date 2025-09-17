'use client'

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, MapPin, ExternalLink, Music, Users, Clock, ArrowLeft, Download, FileText } from "lucide-react";

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
  pdfFileName?: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchEvent(params.id as string);
    }
  }, [params.id]);

  const fetchEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`);
      if (!response.ok) {
        throw new Error("Event not found");
      }

      const data = await response.json();
      setEvent(data.event);
    } catch (error) {
      console.error("Error fetching event:", error);
      setError("Failed to load event details");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  if (isLoading) {
    return (
      <main className="works-container">
        <div className="text-center text-[#D3CEAD]">Loading event details...</div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="works-container">
        <div className="text-center text-[#B87333]">
          <p className="mb-4">{error || "Event not found"}</p>
          <button
            onClick={() => router.back()}
            className="text-[#D3CEAD] hover:text-[#C3BE9D] underline"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  const { date, time } = formatDateTime(event.date);

  return (
    <main className="works-container">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#D3CEAD] hover:text-[#C3BE9D] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Events
      </button>

      {/* Event header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#D3CEAD] mb-2">{event.title}</h1>
            {event.venue && (
              <p className="text-lg text-[#D3CEAD]/80">{event.venue}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-4 py-2 text-sm font-medium uppercase ${
              event.eventType === 'concert' ? 'bg-blue-500/20 text-blue-400' :
              event.eventType === 'premiere' ? 'bg-green-500/20 text-green-400' :
              event.eventType === 'workshop' ? 'bg-purple-500/20 text-purple-400' :
              event.eventType === 'masterclass' ? 'bg-orange-500/20 text-orange-400' :
              event.eventType === 'festival' ? 'bg-pink-500/20 text-pink-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {event.eventType}
            </span>
            <span className={`px-3 py-1 text-sm font-medium ${
              event.isUpcoming 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {event.isUpcoming ? 'Upcoming' : 'Past Event'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Event details */}
          <div className="bg-white/5 p-6 rounded">
            <h2 className="text-xl font-semibold text-[#D3CEAD] mb-4">Event Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-3 text-[#D3CEAD]">
                <Calendar className="w-5 h-5 flex-shrink-0" />
                <div>
                  <div className="font-medium">{date}</div>
                  <div className="text-sm text-[#D3CEAD]/60">{time}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#D3CEAD]">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <div>
                  <div className="font-medium">{event.location}</div>
                  {event.venue && (
                    <div className="text-sm text-[#D3CEAD]/60">{event.venue}</div>
                  )}
                </div>
              </div>

              {event.works && (
                <div className="flex items-start gap-3 text-[#D3CEAD]">
                  <Music className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Works</div>
                    <div className="text-sm text-[#D3CEAD]/60">{event.works}</div>
                  </div>
                </div>
              )}

              {event.performers && (
                <div className="flex items-start gap-3 text-[#D3CEAD]">
                  <Users className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Performers</div>
                    <div className="text-sm text-[#D3CEAD]/60">{event.performers}</div>
                  </div>
                </div>
              )}
            </div>

            {event.description && (
              <div>
                <h3 className="text-lg font-medium text-[#D3CEAD] mb-3">Description</h3>
                <p className="text-[#D3CEAD]/80 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            )}
          </div>

          {/* Event images - moved below details */}
          {event.imageFileNames && event.imageFileNames.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.imageFileNames.map((imageName, index) => (
                <div key={index} className="relative">
                  <img
                    src={`/api/files/images/${imageName}`}
                    alt={`${event.title} - Image ${index + 1}`}
                    className="w-full aspect-[4/3] object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar with files and quick info */}
        <div className="space-y-6">
          {/* Program/PDF */}
          {event.pdfFileName && (
            <div className="bg-white/5 p-6 rounded">
              <h3 className="text-lg font-medium text-[#D3CEAD] mb-4">Program</h3>
              <div className="space-y-3">
                <a
                  href={`/api/files/pdfs/${event.pdfFileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 bg-white/10 hover:bg-white/20 text-[#D3CEAD] hover:text-[#C3BE9D] transition-all duration-300"
                >
                  <Download className="w-4 h-4" />
                  Download Program
                </a>
              </div>
            </div>
          )}

          {/* Quick info card with website */}
          <div className="bg-white/5 p-6 rounded">
            <h3 className="text-lg font-medium text-[#D3CEAD] mb-4">Quick Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#D3CEAD]/60">Status:</span>
                <span className={event.isUpcoming ? 'text-[#C3BE9D]' : 'text-[#D3CEAD]/60'}>
                  {event.isUpcoming ? 'Upcoming' : 'Past Event'}
                </span>
              </div>
              
              {event.website && (
                <div className="pt-2">
                  <span className="text-[#D3CEAD]/60 text-xs block mb-2">Website:</span>
                  <a
                    href={event.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#D3CEAD] hover:text-[#C3BE9D] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit event website
                  </a>
                </div>
              )}
              
              {event.works && (
                <div className="pt-2">
                  <span className="text-[#D3CEAD]/60 text-xs">Works:</span>
                  <p className="text-[#D3CEAD] mt-1">{event.works}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}