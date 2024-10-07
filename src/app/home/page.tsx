"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import Navbar from "./navbar";
import Footer from "./footer";
import SubscriptionTiers from "./subscription";

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
          <Navbar />

          <main className="flex-grow flex items-center">
            <motion.div
              className="bg-black bg-opacity-50 p-8 rounded-lg ml-16 max-w-[40rem]"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-white text-6xl font-bold mb-2">
                LUXURY
                <br />
                WITHOUT LIMITS
              </h1>
              <div className="w-full h-1 bg-white mb-6"></div>
              <p className="text-white mb-8">
                Discover the luxury golf and travel club where members can
                escape to their favorite corner of the world and discover new
                places worth embracing.
              </p>
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-black transition-colors"
              >
                Learn More
              </Button>
            </motion.div>
          </main>

          {/* Social Media Icons */}
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col space-y-6">
            <a
              href="#"
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Facebook size={30} />
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Instagram size={30} />
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Youtube size={30} />
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Twitter size={30} />
            </a>
          </div>
        </div>
      </section>
      <SubscriptionTiers />

      <Footer />
    </div>
  );
};

export default HomePage;
