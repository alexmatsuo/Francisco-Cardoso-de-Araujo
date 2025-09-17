import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center px-12 pb-32">
      <div className="flex-grow flex flex-col justify-center -mt-0">
        <h1 className="text-left sm:text-6xl lg:text-8xl text-[#C3BE9D] leading-tight">
          Francisco
        </h1>
        <h2 className="text-left mt-3 sm:text-6xl lg:text-8xl text-[#C3BE9D] leading-tight">
          Cardoso
        </h2>
        <h3 className="text-left mt-3 sm:text-6xl lg:text-8xl text-[#C3BE9D] inline-block relative leading-tight">
          de Araujo
        
          <div className="lg:w-96 sm:w-64 h-1 mt-8 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          
          {/* Desktop positioning - hidden on mobile */}
          <span className="hidden mt-6 sm:block absolute left-0 sm:text-3xl lg:text-5xl text-[#C3BE9D] sm:ml-12 lg:ml-20">
            Composer
          </span>
        </h3>
      </div>
    </div>
  );
}