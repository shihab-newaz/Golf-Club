// app/home/FeaturedCourses.tsx
"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const featuredCourses = [
  { name: "Pine Valley", image: "/courses/course (2).JPG", description: "Challenging 18-hole course set in beautiful pine forests." },
  { name: "Ocean Links", image: "/courses/course (11).JPG", description: "Scenic coastal course with breathtaking ocean views." },
  { name: "Mountain Peak", image: "/courses/course (39).JPG", description: "High-altitude course offering unique golfing experience." },
  { name: "Bueng Ratchaburi", image: "/courses/course (23).JPG", description: "Scenic lakeside course with lush greenery." },
  { name: "Bueng Aram", image: "/courses/course (35).JPG", description: "Traditional Thai-style course with water hazards." },
  { name: "Bueng Kapit", image: "/courses/course (7).JPG", description: "Challenging course with stunning mountain views." },
];


const FeaturedCourses = () => {
  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">Featured Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCourses.map((course, index) => (
            <motion.div
              key={course.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="flex flex-col h-full"> 
                <Image
                  src={course.image}
                  alt={course.name}
                  width={400}
                  height={300}
                  priority
                  className="w-full h-48 object-cover"
                />
                <CardContent className="flex-grow p-4"> {/* flex-grow allows content to expand */}
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{course.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{course.description}</p>
                </CardContent>
                <CardFooter className="p-4">
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors duration-300">
                    <Link href={`/courses/${course.name.toLowerCase().replace(' ', '-')}`}>View Course</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;