// app/courses/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const images = [
  '/clubhouse.jpg',
  '/upcoming.png',
  '/golf.jpg',
  '/ai.png',
];

const KoreaGolfCoursePage: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-green-50 to-blue-50 dark:from-black/90 dark:to-gray-900">
      <section className="relative h-[60vh] w-full overflow-hidden">
        {images.map((src, index) => (
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentImage ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image src={src} alt={`Korea golf course ${index + 1}`} layout="fill" objectFit="cover" />
          </motion.div>
        ))}
        <Button
          variant="ghost"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 hover:bg-black/70"
          onClick={prevImage}
        >
          <ChevronLeft size={24} />
        </Button>
        <Button
          variant="ghost"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 hover:bg-black/70"
          onClick={nextImage}
        >
          <ChevronRight size={24} />
        </Button>
      </section>

      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.h1 
          className="text-4xl font-bold mb-6 text-green-800 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Jeju Island Golf Resort
        </motion.h1>

        <motion.div 
          className="grid md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-white">Experience World-Class Golfing in Paradise</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Nestled on the breathtaking Jeju Island, our golf resort offers an unparalleled golfing experience amidst stunning natural beauty. With meticulously designed courses that blend seamlessly with the island's volcanic landscape, every hole presents a unique challenge and picturesque views.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Our championship 18-hole course, designed by renowned architect Tom Fazio, caters to golfers of all skill levels. Enjoy the gentle sea breezes, the lush green fairways, and the strategic bunkers that make every round memorable.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-white">Resort Amenities</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Luxurious clubhouse with panoramic ocean views</li>
              <li>State-of-the-art practice facilities and driving range</li>
              <li>Professional golf instruction and clinics</li>
              <li>Exquisite dining options featuring local and international cuisine</li>
              <li>Relaxing spa treatments for post-game rejuvenation</li>
              <li>Accommodation packages at our 5-star resort</li>
            </ul>
          </div>
        </motion.div>

        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-white">Book Your Golfing Getaway</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Experience the magic of golfing on Jeju Island. Whether you're planning a solo trip, a corporate event, or a golfing holiday with friends, we offer tailored packages to suit your needs.
          </p>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Reserve Your Tee Time
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default KoreaGolfCoursePage;