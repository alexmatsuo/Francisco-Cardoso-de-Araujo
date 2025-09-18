'use client'

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loading } from "@/components/Loading";

interface WorkDetail {
  id: number;
  title: string;
  year: number;
  instruments: string;
  duration: string | null;
  information: string | null;
  programNotes: string | null;
  imageFileName: string | null;
  videoUrls: string[]; // Array of video URLs
  soundcloudUrl: string | null;
  slug: string | null;
}

export default function WorkDetailPage() {
  const params = useParams();
  const [work, setWork] = useState<WorkDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWork();
  }, [params.slug]);

  const fetchWork = async () => {
    try {
      const response = await fetch(`/api/works/multimedia-installations/${params.slug}`);
      if (!response.ok) throw new Error('Failed to fetch work');
      
      const data = await response.json();
      // Ensure videoUrls is always an array
      const processedWork = {
        ...data.work,
        videoUrls: Array.isArray(data.work.videoUrls) ? data.work.videoUrls : []
      };
      setWork(processedWork);
    } catch (error) {
      console.error('Error fetching work:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url: string | null) => {
    if (!url) return null;
    
    // Handle various YouTube URL formats
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    return null;
  };

  // Convert SoundCloud URL to embed format
  const getSoundCloudEmbedUrl = (url: string | null) => {
    if (!url) return null;
    
    // Basic SoundCloud URL conversion to embed
    if (url.includes('soundcloud.com')) {
      return url;
    }
    
    return null;
  };

  // Get all valid video embed URLs
  const getVideoEmbedUrls = () => {
    if (!work || !work.videoUrls) return [];
    return work.videoUrls
      .filter(url => url && url.trim())
      .map(url => getYouTubeEmbedUrl(url))
      .filter(url => url !== null);
  };

  if (isLoading) {
      return <Loading message="Loading ..." />;
  }

  if (!work) {
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <div className="text-center">Work not found</div>
        <Link href="/works/multimedia-installations" className="text-[#D3CEAD] hover:underline mt-4 inline-block">
          ← Back to Multimedia & Installations
        </Link>
      </main>
    );
  }

  const videoEmbedUrls = getVideoEmbedUrls();
  const soundcloudUrl = getSoundCloudEmbedUrl(work.soundcloudUrl);

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <Link href="/works/multimedia-installations" className="text-[#D3CEAD] hover:underline mb-6 inline-block">
        ← Back to Multimedia & Installations
      </Link>
      
      <h1 className="text-4xl font-bold mb-2">{work.title} ({work.year})</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Media Section */}
        <div className="lg:col-span-2">
          {/* Videos Section */}
          {videoEmbedUrls.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">
                Video{videoEmbedUrls.length > 1 ? 's' : ''}
              </h2>
              <div className="space-y-4">
                {videoEmbedUrls.map((embedUrl, index) => (
                  <div key={index} className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`${work.title} video ${index + 1}`}
                    ></iframe>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Audio Section */}
          {soundcloudUrl && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Audio</h2>
              <div className="bg-black rounded-lg p-4">
                <iframe
                  width="100%"
                  height="166"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(soundcloudUrl)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                ></iframe>
              </div>
            </div>
          )}
        </div>
        
        {/* Information Section */}
        <div className="space-y-6">
          {work.imageFileName && (
            <div className="mb-6">
              <img 
                src={`/uploads/${work.imageFileName}`} 
                alt={work.title}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Instrumentation</h2>
            <p className="text-gray-300">{work.instruments}</p>
          </div>
          
          {work.duration && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Duration</h2>
              <p className="text-gray-300">{work.duration}</p>
            </div>
          )}
          
          {work.information && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Information</h2>
              <p className="text-gray-300 whitespace-pre-line">{work.information}</p>
            </div>
          )}
          
          {work.programNotes && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Program Notes</h2>
              <p className="text-gray-300 whitespace-pre-line">{work.programNotes}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}