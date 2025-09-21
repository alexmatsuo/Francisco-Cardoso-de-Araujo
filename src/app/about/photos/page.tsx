'use client'
import { useState, useEffect } from "react";
import { Loading } from "@/components/Loading";
import React from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";

interface Photo {
  id: string;
  src: any; // For imported images or string for URLs
  alt: string;
  caption: string;
  category?: string;
}

export default function PhotosPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  const items = [
    {
      title: "Tyler Durden",
      image: "https://images.unsplash.com/photo-1732310216648-603c0255c000?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      className: "absolute top-[5%] left-[5%] rotate-[-8deg]",
    },
    {
      title: "The Narrator",
      image: "https://images.unsplash.com/photo-1697909623564-3dae17f6c20b?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      className: "absolute top-[15%] left-[65%] rotate-[-12deg]",
    },
    {
      title: "Iceland",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      className: "absolute top-[10%] left-[35%] rotate-[6deg]",
    },
    {
      title: "Japan",
      image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=3648&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      className: "absolute top-[40%] left-[20%] rotate-[12deg]",
    },
    {
      title: "Norway",
      image: "https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      className: "absolute top-[40%] right-[5%] rotate-[4deg]",
    },
    {
      title: "New Zealand",
      image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=3070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      className: "absolute top-[35%] left-[55%] rotate-[-6deg]",
    },
    {
      title: "Canada",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      className: "absolute top-[40%] left-[45%] rotate-[8deg]",
    },
  ];

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading message="Loading ..." />;
  }

  return (
    <main>
      {/* Desktop version - original scattered layout with dragging */}
      <div className="hidden md:block">
        <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
          <p className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-black text-gray-300 md:text-4xl">
            If its your first day at Fight Club, you have to fight.
          </p>
          {items.map((item, index) => (
            <DraggableCardBody key={index} className={item.className}>
              <img
                src={item.image}
                alt={item.title}
                className="pointer-events-none relative z-10 h-80 w-80 object-cover rounded-lg shadow-2xl"
              />
              <h3 className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
                {item.title}
              </h3>
            </DraggableCardBody>
          ))}
        </DraggableCardContainer>
      </div>

      {/* Mobile version - clean vertical scroll */}
      <div className="block md:hidden min-h-screen">
        {/* Header */}
        <div className="px-6 py-8 text-center">
          <p className="text-xl font-black text-gray-300 leading-tight">
            If its your first day at Fight Club, you have to fight.
          </p>
        </div>
        
        {/* Cards in vertical layout */}
        <div className="space-y-6 px-4 pb-8">
          {items.map((item, index) => (
            <div 
              key={index} 
              className={`transform transition-all duration-300 hover:scale-105 ${
                index % 2 === 0 ? 'rotate-1' : '-rotate-1'
              }`}
            >
              <div className="bg-[#D3CEAD] rounded-xl p-4 shadow-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <h3 className="mt-3 text-center text-lg font-bold text-neutral-700 dark:text-neutral-300">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}