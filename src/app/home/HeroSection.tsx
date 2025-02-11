'use client';

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import YouTubeEmbed from "@/components/yt-embed";

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50 z-10" /> 
      <YouTubeEmbed
        videoId="ZI8yGtlH4YI"
        title="Daeho Golf Club"
      />
      <div className="absolute inset-0 z-20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-white/90 animate-fade-in">
            Welcome to Bueng Aram
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 text-white max-w-3xl mx-auto animate-fade-in-delay">
            Experience the finest golf in the heart of nature
          </p>
          <Button
            size="lg"
            className="bg-green-600/60 hover:bg-green-700/60 text-white font-bold py-3 px-6 rounded-full
            transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl
            animate-fade-in-delay-2"
          >
            <Link href="/booking">Book a Tee Time</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;