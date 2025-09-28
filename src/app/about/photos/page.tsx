'use client'
import { useState, useEffect } from "react";
import { Loading } from "@/components/Loading";
import React from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";

interface Photo {
  id: string;
  src: any; // For imported images or string for URLs
  alt: string;
  caption: string;
  category?: string;
}

interface ImageItem {
  title: string;
  image: string;
  className: string;
}

export default function PhotosPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickTimeouts, setClickTimeouts] = useState<{[key: number]: NodeJS.Timeout}>({});
  
  const items = [
    {
      title: "My Photo 1",
      image: "/41436600_301080640705638_1608189809101795861_n.jpg",
      className: "absolute top-[5%] left-[5%] rotate-[-8deg]",
    },
    {
      title: "My Photo 2",
      image: "/IMG_5831.JPG",
      className: "absolute top-[5%] left-[75%] rotate-[-12deg]",
    },
    {
      title: "Iceland",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      className: "absolute top-[5%] left-[30%] rotate-[6deg]",
    },
    {
      title: "Japan",
      image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=3648&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      className: "absolute top-[40%] left-[20%] rotate-[12deg]",
    },
    {
      title: "Norway",
      image: "https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      className: "absolute top-[40%] right-[10%] rotate-[4deg]",
    },
    {
      title: "New Zealand",
      image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=3070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      className: "absolute top-[5%] left-[52%] rotate-[-6deg]",
    },
    {
      title: "Canada",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      className: "absolute top-[40%] left-[45%] rotate-[8deg]",
    },
  ];

  const handleImageClick = (item: ImageItem, index: number) => {
    if (clickTimeouts[index]) {
      clearTimeout(clickTimeouts[index]);
      openModal(item);
      setClickTimeouts(prev => {
        const newTimeouts = { ...prev };
        delete newTimeouts[index];
        return newTimeouts;
      });
    } else {
      const timeout = setTimeout(() => {
        setClickTimeouts(prev => {
          const newTimeouts = { ...prev };
          delete newTimeouts[index];
          return newTimeouts;
        });
      }, 300);
      setClickTimeouts(prev => ({ ...prev, [index]: timeout }));
    }
  };

  const openModal = (item: ImageItem) => {
    setSelectedImage(item);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
    Object.values(clickTimeouts).forEach(timeout => clearTimeout(timeout));
    setClickTimeouts({});
  };

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename.replace(/\s+/g, '_').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(imageUrl, '_blank');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      Object.values(clickTimeouts).forEach(timeout => clearTimeout(timeout));
    };
  }, [isModalOpen, clickTimeouts]);

  if (isLoading) {
    return <Loading message="Loading ..." />;
  }

  return (
    <>
      <main>
        {/* Desktop version */}
        <div className="hidden md:block">
          <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
            {items.map((item, index) => (
              <DraggableCardBody key={index} className={item.className}>
                <div className="relative group">
                  <div 
                    className="cursor-pointer transition-transform hover:scale-105 relative"
                    onClick={() => handleImageClick(item, index)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="pointer-events-none relative z-10 h-80 w-80 object-cover shadow-2xl"
                    />
                    {clickTimeouts[index] && (
                      <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20"></div>
                    )}
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadImage(item.image, item.title);
                    }}
                    className="absolute top-2 right-2 z-20 bg-black/70 hover:bg-black/90 text-white p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>

                  <h3 className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
                    {item.title}
                  </h3>
                </div>
              </DraggableCardBody>
            ))}
          </DraggableCardContainer>
        </div>

        {/* Mobile version */}
        <div className="block md:hidden min-h-screen">
          <div className="px-6 py-8 text-center"></div>
          <div className="space-y-6 px-4 pb-8">
            {items.map((item, index) => (
              <div 
                key={index} 
                className={`transform transition-all duration-300 hover:scale-105 cursor-pointer relative ${
                  index % 2 === 0 ? 'rotate-1' : '-rotate-1'
                }`}
                onClick={() => handleImageClick(item, index)}
              >
                <div className="bg-[#D3CEAD] p-4 shadow-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover"
                  />
                  <h3 className="mt-3 text-center text-lg font-bold text-neutral-700 dark:text-neutral-300">
                    {item.title}
                  </h3>
                  {clickTimeouts[index] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && selectedImage && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm pt-24"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-7xl mx-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end gap-2 mb-4">
              <button
                onClick={() => downloadImage(selectedImage.image, selectedImage.title)}
                className="bg-[#D3CEAD] hover:bg-[#C3BE9D] text-white p-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                title="Download image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>

              <button
                onClick={closeModal}
                className="bg-white/20 hover:bg-white/30 text-white p-3 transition-colors backdrop-blur-sm"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="max-w-full max-h-[calc(100vh-200px)] object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
