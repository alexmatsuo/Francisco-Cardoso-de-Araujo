'use client'
import { useState, useEffect } from "react";
import FranciscoImg from "@/assets/images/francisco.avif";
import { Loading } from "@/components/Loading";
import DiscloseImage from "@/components/Disclose";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

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
  const fallbackText = `Born in Curitiba, Francisco Cardoso de Araujo is a composer, researcher, clarinetist, and musical improviser with a passion for experimental contemporary music. His work explores the intersection of acoustic and electronic elements, creating immersive sonic landscapes that challenge traditional boundaries.

Francisco has developed a unique compositional voice that draws from diverse influences, ranging from Brazilian musical traditions to cutting-edge experimental techniques. His pieces have been performed internationally by renowned ensembles and soloists, establishing him as an emerging voice in contemporary classical music.

As a researcher, Francisco investigates new approaches to musical creation and performance, contributing to the academic discourse on contemporary composition. His work as a clarinetist and improviser informs his compositional practice, bringing a performer's perspective to his creative process.`;

  const words = `Francisco Cardoso de Araujo`;

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
    <main className="min-h-screen relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent z-10"></div>
        
        <div className="container mx-auto px-6 py-20 relative z-20">
          <div className="max-w-7xl mx-auto">
            
            {/* Mobile Layout: Title First */}
            <div className="lg:hidden">
              {/* Header */}
              <div className="space-y-4 mb-6">
                <TextGenerateEffect words={words} />
              </div>

              {/* Image Section */}
              <div className="relative group -mb-20">
                <div className="relative w-full max-w-sm mx-auto">
                  <div className="aspect-[3/4] w-full">
                    <DiscloseImage
                      src={FranciscoImg.src}
                      alt="Francisco Cardoso de Araujo"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 w-full h-full"
                      doorClassName="bg-black"
                      vertical={false}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
                </div>
              </div>

              {/* Bio Text */}
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  {displayText.split('\n\n').map((paragraph, index) => (
                    <p 
                      key={index} 
                      className="text-base leading-relaxed text-gray-300 mb-6 first:text-lg first:text-[#D3CEAD]/90 first:font-medium"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Metadata */}
                <div className="flex flex-col gap-4 pt-6 border-t border-[#D3CEAD]/20">
                  {aboutData && (
                    <div className="text-sm text-[#D3CEAD]/60">
                      Last updated: {new Date(aboutData.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                  
                  {error && !aboutData && (
                    <div className="text-sm text-[#D3CEAD]/80 bg-white/5 backdrop-blur-sm px-3 py-2 rounded">
                      ⚠️ Using default content due to loading issue
                    </div>
                  )}
                </div>

                {/* Call-to-action */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <a 
                    href="/works" 
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 rounded"
                  >
                    Explore Works
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                  
                  <a 
                    href="/contact" 
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 rounded"
                  >
                    Get in Touch
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Desktop Layout: Side by Side */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Image Section */}
              <div className="relative group">
                <div className="relative w-full max-w-md xl:max-w-lg mx-auto lg:mx-0">
                  <div className="aspect-[3/4] w-full">
                    <DiscloseImage
                      src={FranciscoImg.src}
                      alt="Francisco Cardoso de Araujo"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 w-full h-full"
                      doorClassName="bg-black"
                      vertical={false}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
                </div>
              </div>

              {/* Content Section */}
              <div className="space-y-8">
                {/* Header */}
                <div className="space-y-4">
                  <TextGenerateEffect words={words} />
                </div>

                {/* Bio Text */}
                <div className="space-y-6">
                  <div className="prose prose-lg max-w-none">
                    {displayText.split('\n\n').map((paragraph, index) => (
                      <p 
                        key={index} 
                        className="text-lg leading-relaxed text-gray-300 mb-6 first:text-xl first:text-[#D3CEAD]/90 first:font-medium"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-[#D3CEAD]/20">
                    {aboutData && (
                      <div className="text-sm text-[#D3CEAD]/60">
                        Last updated: {new Date(aboutData.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    )}
                    
                    {error && !aboutData && (
                      <div className="text-sm text-[#D3CEAD]/80 bg-white/5 backdrop-blur-sm px-3 py-2 rounded">
                        ⚠️ Using default content due to loading issue
                      </div>
                    )}
                  </div>
                </div>

                {/* Call-to-action */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <a 
                    href="/works" 
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 rounded"
                  >
                    Explore Works
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                  
                  <a 
                    href="/contact" 
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 rounded"
                  >
                    Get in Touch
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Optional: Additional decorative elements */}
      <div className="absolute top-1/4 right-10 w-32 h-32 bg-[#D3CEAD]/5 blur-3xl"></div>
      <div className="absolute bottom-1/4 left-10 w-48 h-48 bg-[#C3BE9D]/5 blur-3xl"></div>
    </main>
  );
}