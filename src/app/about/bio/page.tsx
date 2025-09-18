'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import FranciscoImg from "@/assets/images/francisco.avif";
import { Loading } from "@/components/Loading";

interface AboutData {
  id: number;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export default function BioPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback text (your current bio) in case API fails or no data exists
  const fallbackText = `Born in Curitiba, Francisco Cardoso de Araujo is a composer, researcher, clarinetist, and musical improviser`;

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch("/api/about");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.about) {
        setAboutData(data.about);
      } else {
        console.log("No about data found, using fallback text");
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
      setError("Failed to load about data");
    } finally {
      setIsLoading(false);
    }
  };

  // Determine which text to display
  const displayText = aboutData?.text || fallbackText;

  if (isLoading) {
    return <Loading message="Loading ..." />;
  }

  return (
    <main className="flex flex-col md:flex-row items-center md:items-start p-12 gap-8">
      {/* Image section */}
      <div className="w-48 h-48 relative overflow-hidden shadow-lg z-10">
        <Image
          src={FranciscoImg}
          alt="Francisco"
          fill
          sizes="(max-width: 768px) 100vw, 352px"
          className="object-cover"
          priority
        />
      </div>

      {/* Text section */}
      <div className="max-w-2xl">
        <p className="text-lg leading-relaxed text-gray-300 whitespace-pre-wrap">
          {displayText}
        </p>
        
        {aboutData && (
          <div className="mt-4 text-xs text-gray-500">
            Last updated: {new Date(aboutData.updatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        )}
        
        {error && !aboutData && (
          <div className="mt-2 text-xs text-yellow-400">
            Note: Using default content due to loading issue
          </div>
        )}
      </div>
    </main>
  );
}