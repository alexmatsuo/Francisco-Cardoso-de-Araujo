'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import { Loading } from "@/components/Loading";
import FranciscoImg from "@/assets/images/francisco.avif";

interface Photo {
  id: string;
  src: any; // For imported images or string for URLs
  alt: string;
  caption: string;
  category?: string;
}

export default function PhotosPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Sample photos - you can expand this with more photos
  const photos: Photo[] = [
    {
      id: '1',
      src: FranciscoImg,
      alt: "Francisco Cardoso de Araujo",
      caption: "Francisco Cardoso de Araujo",
      category: "Portrait"
    }
  ];

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading message="Loading ..." />;
  }

  return (
    <main className="works-container">
      <h1 className="text-4xl font-bold mb-8 text-[#D3CEAD]">Photos</h1>
      
      {/* Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <div 
            key={photo.id}
            className="group cursor-pointer bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:border-[#D3CEAD]/30"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="aspect-square relative overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#D3CEAD] mb-1 line-clamp-1">
                {photo.caption}
              </h3>
              {photo.category && (
                <div className="text-xs text-[#D3CEAD]/70 bg-white/10 inline-block px-2 py-1">
                  {photo.category}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {photos.length === 0 && (
        <div className="text-center py-12">
          <div className="text-xl font-semibold text-[#D3CEAD] mb-2">No photos available</div>
          <p className="text-[#D3CEAD]/70">Photos will be added soon.</p>
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <div className="relative w-full h-full">
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-4">
              <h3 className="text-lg font-semibold text-[#D3CEAD] mb-1">
                {selectedPhoto.caption}
              </h3>
              {selectedPhoto.category && (
                <div className="text-sm text-[#D3CEAD]/70">
                  {selectedPhoto.category}
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </main>
  );
}