'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Calendar, ChevronRight, Eye, Grid, List } from "lucide-react";
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

export default function ChamberEnsemblesWorks() {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedDecade, setSelectedDecade] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      const response = await fetch('/api/works/chamber-ensembles');
      if (!response.ok) {
        throw new Error('Failed to fetch works');
      }
      const data = await response.json();
      setWorks(data.works || []);
    } catch (error) {
      console.error('Error fetching works:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredWorks = () => {
    return works.filter(work => {
      const matchesSearch = searchTerm === '' || 
        work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.instruments.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDecade = selectedDecade === 'all' || 
        Math.floor(work.year / 10) * 10 === parseInt(selectedDecade);
      
      return matchesSearch && matchesDecade;
    });
  };

  const getDecades = () => {
    const decades = new Set(works.map(work => Math.floor(work.year / 10) * 10));
    return Array.from(decades).sort((a, b) => b - a);
  };

  const hasDetails = (work: Work) => {
    return work.duration || work.information || work.programNotes || 
           work.imageFileName || work.videoUrl || work.soundcloudUrl;
  };

  const getLinkPath = (work: Work) => {
    if (!hasDetails(work) || !work.slug) return null;
    return `/works/chamber-ensembles/${work.slug}`;
  };

  const filteredWorks = getFilteredWorks();

  if (isLoading) {
    return <Loading message="Loading ..." />;
  }

  return (
    <main className="works-container">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-[#D3CEAD]">Chamber Ensembles</h1>
            <p className="text-[#D3CEAD]/70">Works for Chamber Ensembles</p>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/5 backdrop-blur-sm px-4 py-2">
              <div className="text-2xl font-bold text-[#D3CEAD]">{works.length}</div>
              <div className="text-sm text-[#D3CEAD]/70">Total Works</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by title or instruments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 text-[#D3CEAD] placeholder-[#D3CEAD]/50 focus:outline-none focus:bg-white/10 transition-colors"
            />
          </div>
          
          {/* Decade Filter */}
          <select
            value={selectedDecade}
            onChange={(e) => setSelectedDecade(e.target.value)}
            className="px-4 py-3 bg-white/5 text-[#D3CEAD] focus:outline-none"
          >
            <option value="all">All Decades</option>
            {getDecades().map(decade => (
              <option key={decade} value={decade.toString()}>
                {decade}s
              </option>
            ))}
          </select>
          
          {/* View Mode Toggle */}
          <div className="flex bg-white/5 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-[#D3CEAD] text-black' 
                  : 'text-[#D3CEAD] hover:bg-white/10'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 transition-colors ${
                viewMode === 'list' 
                  ? 'bg-[#D3CEAD] text-black' 
                  : 'text-[#D3CEAD] hover:bg-white/10'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredWorks.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-[#D3CEAD] mb-2">No works found</h3>
          <p className="text-[#D3CEAD]/70">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-6 text-sm text-[#D3CEAD]/70">
            Showing {filteredWorks.length} of {works.length} works
          </div>

          {/* Works Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredWorks.map((work) => {
                const linkPath = getLinkPath(work);
                
                const content = (
                  <div className="group bg-white/5 backdrop-blur-sm p-3 hover:bg-white/10 transition-all duration-300 aspect-[3/2] flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#D3CEAD] group-hover:text-white transition-colors text-sm leading-tight line-clamp-2 mb-1">
                          {work.title}
                        </h3>
                        <div className="text-xs text-[#D3CEAD]/70">
                          {work.year}
                        </div>
                      </div>
                      {linkPath && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                          <Eye className="w-3 h-3 text-[#D3CEAD]" />
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-sm text-[#D3CEAD]/80 line-clamp-3 leading-tight">{work.instruments}</span>
                        
                        {work.duration && (
                          <div className="text-xs text-[#D3CEAD]/70 mt-2">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {work.duration}
                          </div>
                        )}
                      </div>
                      
                      {/* Chamber Ensembles Badge */}
                      <div className="mt-2">
                        <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 inline-block">
                          Chamber
                        </span>
                      </div>
                    </div>
                  </div>
                );
                
                return linkPath ? (
                  <Link key={work.id} href={linkPath} className="block">
                    {content}
                  </Link>
                ) : (
                  <div key={work.id}>
                    {content}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredWorks.map((work) => {
                const linkPath = getLinkPath(work);
                
                const content = (
                  <div className="group flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="font-semibold text-[#D3CEAD] group-hover:text-white transition-colors">
                          {work.title}
                        </h3>
                        <span className="text-sm text-[#D3CEAD]/70">({work.year})</span>
                        <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400">
                          Chamber Ensembles
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-base text-[#D3CEAD]/80">
                        <span>{work.instruments}</span>
                        {work.duration && (
                          <>
                            <span className="text-[#D3CEAD]/40">•</span>
                            <Clock className="w-3 h-3" />
                            <span>{work.duration}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {linkPath && (
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="w-5 h-5 text-[#D3CEAD]" />
                      </div>
                    )}
                  </div>
                );
                
                return linkPath ? (
                  <Link key={work.id} href={linkPath} className="block">
                    {content}
                  </Link>
                ) : (
                  <div key={work.id}>
                    {content}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Summary Statistics */}
      <div className="mt-16 pt-8 border-t border-white/10">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#D3CEAD] mb-1">{works.length}</div>
          <div className="text-sm text-[#D3CEAD]/70">Total Chamber Ensembles Works</div>
        </div>
      </div>
    </main>
  );
}