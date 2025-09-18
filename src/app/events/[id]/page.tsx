'use client'

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, MapPin, ExternalLink, Music, Users, ArrowLeft, FileText, ImageIcon } from "lucide-react";
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
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
      date: date.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  if (isLoading) {
    return <Loading message="Loading ..." />;
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
    <>
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
              <h1 className="text-3xl font-bold text-[#D3CEAD] mb-2">
                {event.title}
              </h1>
              {event.venue && (
                <p className="text-lg text-[#D3CEAD]/80">{event.venue}</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`px-4 py-2 text-sm font-medium uppercase ${
                  event.eventType === "concert"
                    ? "bg-blue-500/20 text-blue-400"
                    : event.eventType === "premiere"
                    ? "bg-green-500/20 text-green-400"
                    : event.eventType === "workshop"
                    ? "bg-purple-500/20 text-purple-400"
                    : event.eventType === "masterclass"
                    ? "bg-orange-500/20 text-orange-400"
                    : event.eventType === "festival"
                    ? "bg-pink-500/20 text-pink-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {event.eventType}
              </span>
              <span
                className={`px-3 py-1 text-sm font-medium ${
                  event.isUpcoming
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {event.isUpcoming ? "Upcoming" : "Past Event"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - Left side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event details */}
            <div className="bg-white/5 p-6">
              <h2 className="text-xl font-semibold text-[#D3CEAD] mb-4">
                Event Details
              </h2>

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
                      <div className="text-sm text-[#D3CEAD]/60">
                        {event.works}
                      </div>
                    </div>
                  </div>
                )}

                {event.performers && (
                  <div className="flex items-start gap-3 text-[#D3CEAD]">
                    <Users className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">Performers</div>
                      <div className="text-sm text-[#D3CEAD]/60">
                        {event.performers}
                      </div>
                    </div>
                  </div>
                )}

                {event.pdfUrl && (
                  <div className="flex items-center gap-3 text-[#D3CEAD]">
                    <FileText className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Program</div>
                      <a
                        href={event.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#D3CEAD]/60 hover:text-[#C3BE9D] transition-colors"
                      >
                        View Program PDF
                      </a>
                    </div>
                  </div>
                )}

                {event.website && (
                  <div className="flex items-center gap-3 text-[#D3CEAD]">
                    <ExternalLink className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Website</div>
                      <a
                        href={event.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#D3CEAD]/60 hover:text-[#C3BE9D] transition-colors"
                      >
                        Visit event website
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {event.description && (
                <div>
                  <h3 className="text-lg font-medium text-[#D3CEAD] mb-3">
                    Description
                  </h3>
                  <p className="text-[#D3CEAD]/80 leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              )}
            </div>

            {/* Additional images gallery */}
            {event.imageUrls && event.imageUrls.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-[#D3CEAD] mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Event Gallery
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.imageUrls.map((imageUrl, index) => (
                    <div 
                      key={index} 
                      className="relative cursor-pointer group"
                      onClick={() => setSelectedImage(imageUrl)}
                    >
                      <img
                        src={imageUrl}
                        alt={`${event.title} - Image ${index + 1}`}
                        className="w-full aspect-[4/3] object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right side */}
          <div className="space-y-6">
            {/* Event Poster */}
            {event.posterUrl && (
              <div>
                
                <div 
                  className="relative cursor-pointer group"
                  onClick={() => setSelectedImage(event.posterUrl!)}
                >
                  <img
                    src={event.posterUrl}
                    alt={`${event.title} - Poster`}
                    className="w-full aspect-[3/4] object-cover shadow-lg transition-transform group-hover:scale-[1.02]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Lightbox for enlarged images */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black/50 p-2 hover:bg-black/70 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}