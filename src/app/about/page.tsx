"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

const AboutPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-r from-white/90 via-gray-200/90 to-white/90 dark:from-black dark:via-gray-900 dark:to-black transition-colors duration-300">
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-black dark:text-white">
              ABOUT US
            </h1>
            <div className="w-24 h-1 bg-black dark:bg-white mx-auto mb-6"></div>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Experience golfing excellence at its finest. Our club offers a perfect blend of 
              challenging courses, luxurious amenities, and a welcoming community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Image
                src="/clubhouse.jpg"
                alt="Golf Club Clubhouse"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-black dark:text-white">Our Legacy</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Founded in 1925, our club has been a cornerstone of golfing excellence for nearly 
                a century. We've hosted numerous professional tournaments and have been the training 
                ground for several golf legends.
              </p>
              <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
                Explore Our History
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="mt-24 bg-black dark:bg-gray-300 text-white dark:text-black p-8 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center justify-center">
                <Mail className="mr-4" size={24} />
                <span>info@golfclub.com</span>
              </div>
              <div className="flex items-center justify-center">
                <Phone className="mr-4" size={24} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center justify-center">
                <MapPin className="mr-4" size={24} />
                <span>123 Fairway Lane, Golf City, GC 12345</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;