// app/home/Testimonials.tsx
"use client";
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Eric Crutchfield",
    testimonial: "Course is improving, 2nd nine has better grassed fairways. Greens are pretty good. They are building a restaurant area, that will be great on hotter days. Worth a visit. 420 green fees, cart 400 :)",
    membership: "Gold Member"
  },
  {
    name: "Swan Pyae",
    testimonial: "I've been a member for 5 years and the experience keeps getting better. The staff is exceptional!",
    membership: "Platinum Member"
  },
  {
    name: "Tae-in Ahn",
    testimonial: "The amenities and course maintenance are top-notch. It's a golfer's paradise!",
    membership: "Silver Member"
  }
];

const MemberTestimonials: React.FC = () => {
  return (
    <section className="py-16 bg-gray-100 dark:bg-black/70">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">What Our Members Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">"{testimonial.testimonial}"</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.membership}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MemberTestimonials;