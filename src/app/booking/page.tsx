// app/booking/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import BookingForm from "./BookingForm";
import Features from "./Features";
import MembershipCTA from "./MembershipCTA";

export default function BookingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <main className="flex-grow">
        <section className="relative py-24">
          <Image
            src="/golf.jpg"
            alt="Golf Course"
            fill
            style={{ objectFit: "cover" }}
            className="absolute inset-0 z-0"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
          <div className="container mx-auto px-4 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-white mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Book Your Perfect Round
              </h1>
              <p className="text-xl md:text-2xl">
                Experience the finest golf at Daeho Country Club
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <BookingForm />
              <Features />
            </div>
          </div>
        </section>
        <MembershipCTA />
      </main>
    </div>
  );
}