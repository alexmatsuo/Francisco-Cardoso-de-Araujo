'use client';

import React, { useState, useEffect } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center relative overflow-hidden">
      {/* Main content */}
      <div className="relative z-10 flex-grow flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-32">
        <div className="space-y-1 sm:space-y-2 lg:space-y-3">
          {/* Name Section with staggered animations */}
          <h1 
            className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tight text-[#C3BE9D] leading-none transition-all duration-700 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Francisco
          </h1>
          <h2 
            className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tight text-[#C3BE9D] leading-none transition-all duration-700 ease-out delay-100 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Cardoso
          </h2>
          <h3 
            className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tight text-[#C3BE9D] leading-none transition-all duration-700 ease-out delay-200 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            de Araujo
          </h3>
        </div>

        {/* Divider line */}
        <div className="my-6 sm:my-8 lg:my-10 overflow-hidden">
          <div 
            className={`h-px w-full max-w-xs sm:max-w-72 lg:max-w-md bg-gradient-to-r from-transparent via-[#C3BE9D]/40 to-transparent transition-all duration-1000 ease-out delay-300 origin-left ${
              mounted ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
            }`}
          />
        </div>

        {/* Title/Role Section */}
        <div 
          className={`transition-all duration-700 ease-out delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-2xl lg:ml-20 sm:ml-14 sm:text-3xl md:text-4xl lg:text-5xl font-light text-[#C3BE9D]/90 tracking-wide">
            Composer
          </p>
        </div>
      </div>
    </div>
  );
}