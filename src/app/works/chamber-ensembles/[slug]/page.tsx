'use client'

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface WorkDetail {
  id: number;
  title: string;
  year: number;
  instruments: string;
  duration: string | null;
  information: string | null;
  programNotes: string | null;
  imageFileName: string | null;
  videoUrl: string | null;
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
      const response = await fetch(`/api/works/chamber-ensembles/${params.slug}`);
      if (!response.ok) throw new Error('Failed to fetch work');
      
      const data = await response.json();
      setWork(data.work);
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
      // For SoundCloud, we need to use their widget API
      // This will be handled by the SoundCloud widget
      return url;
    }
    
    return null;
  };

  if (isLoading) {
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <div className="text-center text-white">Loading work details...</div>
      </main>
    );
  }

  if (!work) {
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <div className="text-center text-white">Work not found</div>
        <Link href="/works/chamber-ensembles" className="text-[#D3CEAD] hover:underline mt-4 inline-block">
          ← Back to Chamber Ensembles Works
        </Link>
      </main>
    );
  }

  const youtubeEmbedUrl = getYouTubeEmbedUrl(work.videoUrl);
  const soundcloudUrl = getSoundCloudEmbedUrl(work.soundcloudUrl);

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <Link href="/works/chamber-ensembles" className="text-[#D3CEAD] hover:underline mb-6 inline-block">
        ← Back to Chamber Ensembles Works
      </Link>
      
      <h1 className="text-4xl font-bold text-white mb-2">{work.title} ({work.year})</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Media Section */}
        <div>
          {youtubeEmbedUrl && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">Video</h2>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={youtubeEmbedUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${work.title} video`}
                ></iframe>
              </div>
            </div>
          )}
          
          {soundcloudUrl && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">Audio</h2>
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
            <h2 className="text-xl font-semibold text-white mb-2">Instrumentation</h2>
            <p className="text-gray-300">{work.instruments}</p>
          </div>
          
          {work.duration && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Duration</h2>
              <p className="text-gray-300">{work.duration}</p>
            </div>
          )}
          
          {work.information && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Information</h2>
              <p className="text-gray-300 whitespace-pre-line">{work.information}</p>
            </div>
          )}
          
          {work.programNotes && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Program Notes</h2>
              <p className="text-gray-300 whitespace-pre-line">{work.programNotes}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}