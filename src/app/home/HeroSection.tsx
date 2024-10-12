"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-[60vh] flex items-center justify-center text-white">
      <Image
        src="/golf.jpg"
        alt="Beautiful golf course"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0"
      />
      <div className="relative z-10 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to Dae
        </h2>
        <p className="text-xl md:text-2xl mb-8">
          Experience the finest golf in the heart of nature
        </p>
        <Button
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full
          transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl">
        Book a Tee Time
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
