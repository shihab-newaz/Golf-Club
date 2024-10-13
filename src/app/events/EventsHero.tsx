// app/events/EventsHero.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const EventsHero = () => (
  <motion.section 
    className="w-full py-16 sm:py-24 relative"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <Image
      src="/clubhouse.jpg"
      alt="Golf Course Events"
      fill
      style={{ objectFit: "cover" }}
      sizes='(100vw, 100vh)'
      quality={100}
      priority
    />
    <div className="absolute inset-0 bg-black bg-opacity-50" />
    <div className="relative z-10 container mx-auto px-4 text-center space-y-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
        Upcoming Golf Events
      </h1>
      <p className="max-w-[700px] mx-auto text-base sm:text-lg text-white drop-shadow-md">
        Join us for a variety of exciting golf events at our beautiful course. From tournaments to clinics, there's something for everyone to enjoy.
      </p>
    </div>
  </motion.section>
);

export default EventsHero;