import React from "react";

export default function Home() {
  return (
    <div className="mt-12 ml-12">
      <h1 className="text-left text-6xl text-[#C3BE9D]">Francisco</h1>
      <h2 className="text-left mt-3 text-6xl text-[#C3BE9D]">Cardoso</h2>
      <h3 className="text-left mt-3 text-6xl text-[#C3BE9D] inline-block relative">
        de Araujo
        <span className="absolute right-0 block text-3xl mt-2 text-[#C3BE9D]">
          Composer,
        </span>
        <span className="absolute right-0 block text-3xl mt-10 text-[#C3BE9D]">
          Researcher
        </span>
      </h3>
    </div>
  );
}
