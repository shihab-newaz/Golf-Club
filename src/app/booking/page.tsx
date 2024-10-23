"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { TeeTimeBookingForm } from "./TeeTimeBooking";
import { HotelBookingForm } from "./HotelBooking";
import { TeeTimeBooking } from "./types";

export default function BookingPage() {
  const [bookingStep, setBookingStep] = useState<"teeTime" | "hotel">("teeTime");
  const [teeTimeBooking, setTeeTimeBooking] = useState<TeeTimeBooking | null>(null);

  const handleTeeTimeComplete = (booking: TeeTimeBooking) => {
    setTeeTimeBooking(booking);
    setBookingStep("hotel");
  };

  const handleBack = () => {
    setBookingStep("teeTime");
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800" />

      {/* Main content */}
      <main className="relative flex-grow">
        <section className="relative w-full min-h-screen py-10 sm:py-10 md:py-16 ">
          {/* Background image with proper mobile handling */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/golf.jpg"
              alt="Golf Course"
              fill
              priority
              sizes="100vw"
              style={{ 
                objectFit: "cover",
                objectPosition: "center"
              }}
              className="brightness-[0.85] dark:brightness-[0.7]"
            />
          </div>

          {/* Dark overlay with responsive opacity */}
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />

          {/* Content container */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-white space-y-4 mb-8 sm:mb-10 md:mb-12"
            >
              {/* Optional: Uncomment if you want to add titles */}
              {/* <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Book Your Perfect Round
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl font-light max-w-3xl mx-auto">
                Experience the finest golf at Daeho Country Club
              </p> */}
            </motion.div>

            {/* Booking form container with improved responsive layout */}
            <div className="flex justify-center items-start px-4 sm:px-6 md:px-8">
              <div className="w-full max-w-4xl">
                {bookingStep === "teeTime" ? (
                  <TeeTimeBookingForm onComplete={handleTeeTimeComplete} />
                ) : teeTimeBooking ? (
                  <HotelBookingForm 
                    teeTimeBooking={teeTimeBooking} 
                    onBack={handleBack}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}