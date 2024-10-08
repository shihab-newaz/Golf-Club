"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import Link from "next/link";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <section className="hero relative h-screen w-full overflow-hidden">
        <Image
          src="/golf.jpg"
          alt="Luxury golf course"
          fill
          style={{ objectFit: "cover" }}
          quality={100}
          priority
        />

        <div className="relative z-10 flex flex-col h-full">
          <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <motion.div
              className="bg-black bg-opacity-50 p-6 sm:p-8 rounded-lg max-w-[40rem] w-full mx-auto lg:mx-0 lg:ml-16"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 text-center lg:text-left">
                LUXURY
                <br />
                WITHOUT LIMITS
              </h1>
              <div className="w-full h-1 bg-white mb-4 sm:mb-6"></div>
              <p className="text-white mb-6 sm:mb-8 text-center lg:text-left">
                Discover the luxury golf and travel club where members can
                escape to their favorite corner of the world and discover new
                places worth embracing.
              </p>
              <div className="flex justify-center lg:justify-start">
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-black transition-colors"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </main>

          {/* Social Media Icons */}
          <div className="absolute right-4 sm:right-6 bottom-4 sm:bottom-6 lg:top-1/2 lg:-translate-y-1/2 flex flex-row lg:flex-col space-x-4 lg:space-x-0 lg:space-y-6">
            <a
              href="#"
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Facebook size={24} />
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Instagram size={24} />
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Youtube size={24} />
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Twitter size={24} />
            </a>
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section
        className="bg-gradient-to-r from-gray-200/90 via-gray-100/90 to-gray-200/90 dark:from-black/90 dark:via-gray-900/90 dark:to-black/90
       text-black dark:text-white py-24 px-6 transition-colors duration-300"
      >
        <motion.div
          className="max-w-4xl w-full mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Elevate Your Golf Experience
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join our exclusive membership program and unlock a world of luxury
            amenities, pristine courses, and unforgettable experiences tailored
            for the discerning golfer.
          </p>
          <Link href="/subscription">
            <Button
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 
                         px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Explore Memberships
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
