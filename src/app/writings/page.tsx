'use client'

import { useState, useEffect } from "react";
import { BookOpen, User, FileText, Eye, ChevronRight } from "lucide-react";
import { Loading } from "@/components/Loading";

interface Writing {
  id: number;
  title: string;
  author: string;
  style: string | null;
  description: string | null;
  pdfUrl: string | null;
  order: number;
}

export default function WritingsPage() {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');

  useEffect(() => {
    fetchWritings();
  }, []);

  const fetchWritings = async () => {
    try {
      const response = await fetch('/api/writings');
      if (!response.ok) {
        throw new Error('Failed to fetch writings');
      }
      const data = await response.json();
      setWritings(data.writings || []);
    } catch (error) {
      console.error('Error fetching writings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredWritings = () => {
    return writings.filter(writing => {
      const matchesSearch = searchTerm === '' || 
        writing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        writing.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (writing.description && writing.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStyle = selectedStyle === 'all' || 
        (writing.style && writing.style === selectedStyle);
      
      return matchesSearch && matchesStyle;
    });
  };

  const getUniqueStyles = () => {
    const styles = new Set(writings.map(w => w.style).filter(s => s !== null) as string[]);
    return Array.from(styles).sort();
  };

  const filteredWritings = getFilteredWritings();

  if (isLoading) {
    return <Loading message="Loading ..." />;
  }

  return (
    <main className="works-container">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-[#D3CEAD] flex items-center gap-3">
              <BookOpen className="w-10 h-10" />
              Writings
            </h1>
            <p className="text-[#D3CEAD]/70">Articles, essays, and written publications</p>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/5 backdrop-blur-sm px-4 py-2">
              <div className="text-2xl font-bold text-[#D3CEAD]">{writings.length}</div>
              <div className="text-sm text-[#D3CEAD]/70">Total Publications</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by title, author, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 text-[#D3CEAD] placeholder-[#D3CEAD]/50 focus:outline-none focus:bg-white/10 transition-colors"
            />
          </div>
          
          {/* Style Filter */}
          {getUniqueStyles().length > 0 && (
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="px-4 py-3 bg-white/5 text-[#D3CEAD] focus:outline-none"
            >
              <option value="all">All Styles</option>
              {getUniqueStyles().map(style => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Results */}
      {filteredWritings.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-[#D3CEAD] mb-2">No writings found</h3>
          <p className="text-[#D3CEAD]/70">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-6 text-sm text-[#D3CEAD]/70">
            Showing {filteredWritings.length} of {writings.length} publications
          </div>

          {/* Writings List */}
          <div className="flex flex-col gap-4">
            {filteredWritings.map((writing) => (
              <div
                key={writing.id}
                className="group bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-[#D3CEAD] group-hover:text-white transition-colors mb-2">
                        {writing.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-[#D3CEAD]/70">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{writing.author}</span>
                        </div>
                        {writing.style && (
                          <>
                            <span className="text-[#D3CEAD]/40">•</span>
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs">
                              {writing.style}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* PDF Link */}
                    {writing.pdfUrl && (
                      <a
                        href={writing.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#D3CEAD] hover:bg-[#C3BE9D] text-black transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FileText className="w-4 h-4" />
                        <span className="font-medium">Read PDF</span>
                      </a>
                    )}
                  </div>
                  
                  {/* Description */}
                  {writing.description && (
                    <div className="mt-4 text-[#D3CEAD]/80 leading-relaxed">
                      <p className="line-clamp-3">{writing.description}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Summary Statistics */}
      {getUniqueStyles().length > 0 && (
        <div className="mt-16 pt-8 border-t border-white/10">
          <h3 className="text-xl font-semibold text-[#D3CEAD] mb-6 text-center">
            Publications by Style
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getUniqueStyles().map(style => {
              const count = writings.filter(w => w.style === style).length;
              return (
                <div key={style} className="text-center bg-white/5 p-4">
                  <div className="text-2xl font-bold text-[#D3CEAD] mb-1">{count}</div>
                  <div className="text-sm text-[#D3CEAD]/70">{style}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}