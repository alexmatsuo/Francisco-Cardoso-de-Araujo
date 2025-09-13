'use client'

import { useState, useEffect } from "react";

interface Work {
  id: number;
  title: string;
  year: number;
  instruments: string;
}

interface WorksByCategory {
  solo: Work[];
  duosTrios: Work[];
  chamberEnsembles: Work[];
  largeEnsembles: Work[];
  multimediaInstallations: Work[];
}

export default function AllWorks() {
  const [works, setWorks] = useState<WorksByCategory>({
    solo: [],
    duosTrios: [],
    chamberEnsembles: [],
    largeEnsembles: [],
    multimediaInstallations: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllWorks();
  }, []);

  const fetchAllWorks = async () => {
    try {
      // Fetch all categories in parallel
      const [soloRes, duosTriosRes, chamberRes, largeRes, multimediaRes] = await Promise.all([
        fetch('/api/works/solo'),
        fetch('/api/works/duos-trios'),
        fetch('/api/works/chamber-ensembles'),
        fetch('/api/works/large-ensembles'),
        fetch('/api/works/multimedia-installations')
      ]);

      // Check if all requests were successful
      if (!soloRes.ok || !duosTriosRes.ok || !chamberRes.ok || !largeRes.ok || !multimediaRes.ok) {
        throw new Error('Failed to fetch one or more work categories');
      }

      // Parse all responses
      const [soloData, duosTriosData, chamberData, largeData, multimediaData] = await Promise.all([
        soloRes.json(),
        duosTriosRes.json(),
        chamberRes.json(),
        largeRes.json(),
        multimediaRes.json()
      ]);

      setWorks({
        solo: soloData.works || [],
        duosTrios: duosTriosData.works || [],
        chamberEnsembles: chamberData.works || [],
        largeEnsembles: largeData.works || [],
        multimediaInstallations: multimediaData.works || []
      });
    } catch (error) {
      console.error('Error fetching works:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalWorks = () => {
    return works.solo.length + 
           works.duosTrios.length + 
           works.chamberEnsembles.length + 
           works.largeEnsembles.length + 
           works.multimediaInstallations.length;
  };

  const renderWorksSection = (title: string, worksArray: Work[]) => {
    if (worksArray.length === 0) return null;
    
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">{title}</h2>
        <div className="space-y-3">
          {worksArray.map((work) => (
            <div key={work.id} className="text-lg text-gray-300 hover:text-white transition-colors pl-4">
              {work.title} ({work.year}) - <span className="text-sm">{work.instruments}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-500 pl-4">
          {worksArray.length} composition{worksArray.length !== 1 ? 's' : ''}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <main className="works-container">
        <div className="text-center">Loading all compositions...</div>
      </main>
    );
  }

  return (
    <main className="works-container">
      <h1 className="works-title">Full Catalog</h1>
      
      {renderWorksSection("Solo Compositions", works.solo)}
      {renderWorksSection("Duos & Trios", works.duosTrios)}
      {renderWorksSection("Chamber Ensembles", works.chamberEnsembles)}
      {renderWorksSection("Large Ensembles", works.largeEnsembles)}
      {renderWorksSection("Multimedia & Installations", works.multimediaInstallations)}
      
      <div className="mt-16 pt-8 border-t border-gray-600">
        <div className="text-lg text-gray-300 font-medium">
          Total works across all categories: {getTotalWorks()}
        </div>
        <div className="mt-4 text-sm text-gray-400 space-y-1">
          <div>Solo: {works.solo.length}</div>
          <div>Duos & Trios: {works.duosTrios.length}</div>
          <div>Chamber Ensembles: {works.chamberEnsembles.length}</div>
          <div>Large Ensembles: {works.largeEnsembles.length}</div>
          <div>Multimedia & Installations: {works.multimediaInstallations.length}</div>
        </div>
      </div>
    </main>
  );
}