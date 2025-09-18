'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loading } from "@/components/Loading";

interface Work {
  id: number;
  title: string;
  year: number;
  instruments: string;
  slug: string | null;
  duration: string | null;
  information: string | null;
  programNotes: string | null;
  imageFileName: string | null;
  videoUrl: string | null;
  soundcloudUrl: string | null;
}

export default function DuosTriosWorks() {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      const response = await fetch('/api/works/duos-trios');
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setWorks(data.works || []);
    } catch (error) {
      console.error('Error fetching works:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a work has additional details to determine if it should be linked
  const hasDetails = (work: Work) => {
    return work.duration || work.information || work.programNotes || 
           work.imageFileName || work.videoUrl || work.soundcloudUrl;
  };

  if (isLoading) {
    return <Loading message="Loading ..." />;
  }

  return (
    <main className="works-container">
      <h1 className="works-title">Duos & Trios</h1>
      
      <div className="space-y-4">
        {works.map((work) => (
          <div key={work.id} className="text-lg text-gray-300 hover:text-white transition-colors">
            {hasDetails(work) && work.slug ? (
              <Link href={`/works/duos-trios/${work.slug}`} className="hover:underline">
                {work.title} ({work.year}) - <span className="text-sm">{work.instruments}</span>
              </Link>
            ) : (
              <>
                {work.title} ({work.year}) - <span className="text-sm">{work.instruments}</span>
              </>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-sm text-gray-400">
        Total Duos-Trios Works: {works.length}
      </div>
    </main>
  );
}