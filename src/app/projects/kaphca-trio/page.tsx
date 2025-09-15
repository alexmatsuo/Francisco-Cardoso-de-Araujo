'use client'

import { useState, useEffect } from "react";
import Image from "next/image";

interface KaphcaTrioData {
  id: number;
  description: string;
  albumInfo: string;
  credits: string;
  createdAt: string;
  updatedAt: string;
}

export default function KaphcaTrioPage() {
  const [kaphcaData, setKaphcaData] = useState<KaphcaTrioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback text in case API fails or no data exists
  const fallbackDescription = `Kaphca Trio is an experimental musical collective from Athens, GA. Founded in 2024 by Dan Phipps, Francisco Cardoso, and Daniel Karcher, the group improvises with an assortment of acoustic instruments and experimental electronics to create harsh and discordant soundscapes.`;
  
  const fallbackAlbumInfo = `The eponymous album of the Kaphca Trio was recorded at the Dancz Center for New Music and features two guided improvisations composed by Karcher and Cardoso (Transformation and through medium, respectively). The majority of the album combines the sound of no-input mixing boards along with Dan Phipps on saxophone, resulting in hosts of eerie textures and chaotic feedback loops. The name for the Kaphca trio comes from an amalgamation of the first letters of each of the member's last names (Karcher, Phipps, Cardoso) which coincidentally, is similar to the name of a certain writer.`;
  
  const fallbackCredits = `Released October 31, 2024
Performers: Dan Phipps, Francisco Cardoso, Daniel Karcher
Recording Engineer: Jared Bradley Tubbs
Mixer and Producer: Daniel Karcher
© All rights reserved`;

  useEffect(() => {
    fetchKaphcaData();
  }, []);

  const fetchKaphcaData = async () => {
    try {
      const response = await fetch("/api/kaphca-trio");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.kaphcaTrio) {
        setKaphcaData(data.kaphcaTrio);
      } else {
        console.log("No Kaphca Trio data found, using fallback text");
      }
    } catch (error) {
      console.error("Error fetching Kaphca Trio data:", error);
      setError("Failed to load Kaphca Trio data");
    } finally {
      setIsLoading(false);
    }
  };

  // Determine which text to display
  const displayDescription = kaphcaData?.description || fallbackDescription;
  const displayAlbumInfo = kaphcaData?.albumInfo || fallbackAlbumInfo;
  const displayCredits = kaphcaData?.credits || fallbackCredits;

  return (
    <>
      <main className="works-container">
        {/* Header */}
          <h1 className="works-title">Kaphca Trio</h1>
        {/* Images section */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-10">
          {/* Album Cover */}
          <div className="w-80 h-80 relative overflow-hidden shadow-lg">
            <Image
              src="/Kaphca Trio capa.jpg"
              alt="Kaphca Trio Album Cover"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Group Photo */}
          <div className="w-80 h-80 relative overflow-hidden shadow-lg">
            <Image
              src="/Kaphca Trio grupo.jpg"
              alt="Kaphca Trio Group Photo"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Content section */}
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="text-lg leading-relaxed text-center">
              Loading...
            </div>
          ) : (
            <div className="space-y-8">
              {/* Description */}
              <div>
                <p className="text-lg leading-relaxed text-gray-300 whitespace-pre-wrap">
                  {displayDescription}
                </p>
              </div>

              {/* Album Information */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">About the Album</h2>
                <p className="text-lg leading-relaxed text-gray-300 whitespace-pre-wrap">
                  {displayAlbumInfo}
                </p>
              </div>

              {/* Credits */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Credits</h2>
                <p className="text-base leading-relaxed text-gray-300 whitespace-pre-line font-mono">
                  {displayCredits}
                </p>
              </div>

         
              
              
            </div>
          )}
        </div>
      </main>
    </>
  );
}