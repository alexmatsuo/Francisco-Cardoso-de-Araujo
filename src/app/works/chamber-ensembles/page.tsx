'use client'

import { useState, useEffect } from "react";

interface Work {
  id: number;
  title: string;
  year: number;
  instruments: string;
}

export default function ChamberEnsemblesWorks() {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      const response = await fetch('/api/works/chamber-ensembles');
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setWorks(data.works || []);
    } catch (error) {
      console.error('Error fetching works:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="works-container">
        <div className="text-center">Loading ...</div>
      </main>
    );
  }

  return (
    <main className="works-container">
      <h1 className="works-title">Chamber Ensembles</h1>
      
      <div className="space-y-4">
        {works.map((work) => (
          <div key={work.id} className="text-lg text-gray-300 hover:text-white transition-colors">
            {work.title} ({work.year}) - <span className="text-sm">{work.instruments}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-sm text-gray-400">
        Total Chamber Ensembles Works: {works.length}
      </div>
    </main>
  );
}