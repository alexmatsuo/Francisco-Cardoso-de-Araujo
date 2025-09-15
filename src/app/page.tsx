import React from "react";

export default function Home() {
  return (
    <div className="mt-12 ml-12">
      <h1 className="text-left sm:text-6xl lg:text-8xl text-[#C3BE9D]">Francisco</h1>
      <h2 className="text-left mt-3 sm:text-6xl lg:text-8xl text-[#C3BE9D]">Cardoso</h2>
      <h3 className="text-left mt-3 sm:text-6xl lg:text-8xl text-[#C3BE9D] inline-block relative">
        de Araujo
        <span className="absolute right-0 block sm:text-3xl lg:text-5xl mt-2 text-[#C3BE9D]">
          Composer,
        </span>
        <span className="absolute right-0 block sm:text-3xl lg:text-5xl sm:mt-10 lg:mt-14 text-[#C3BE9D]">
          Researcher
        </span>
      </h3>
    </div>
  );
}
