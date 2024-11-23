"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

// Different aspects/views of the same course
const courseViews = [
  {
    id: '1',
    name: 'Daeho Golf Club - Main Course',
    description: 'Experience the stunning main course layout with strategically placed bunkers and pristine fairways.',
    imageUrl: '/courses/course-1.jpg',
    viewType: 'Main Course View',
  },
  {
    id: '2',
    name: 'Daeho Golf Club - Lake View',
    description: 'Enjoy the serene lake views from our signature holes, offering both beauty and challenge.',
    imageUrl: '/courses/course-2.jpg',
    viewType: 'Lakeside Holes',
  },
  {
    id: '3',
    name: 'Daeho Golf Club - Practice Area',
    description: 'Perfect your game at our world-class practice facilities with driving range and putting greens.',
    imageUrl: '/courses/course-3.jpg',
    viewType: 'Practice Facilities',
  },
  {
    id: '4',
    name: 'Daeho Golf Club - Clubhouse',
    description: 'Our luxurious clubhouse offers premium amenities and panoramic course views.',
    imageUrl: '/courses/clubhouse.jpg',
    viewType: 'Clubhouse',
  },
  {
    id: '5',
    name: 'Daeho Golf Club - Sunset View',
    description: 'Experience breathtaking sunset rounds with golden hour lighting across the course.',
    imageUrl: '/courses/course-5.jpg',
    viewType: 'Evening View',
  },
  {
    id: '6',
    name: 'Daeho Golf Club',
    description: 'Experience the stunning main course layout with strategically placed bunkers and pristine fairways.',
    imageUrl: '/courses/course-6.jpg',
    viewType: 'Pro Shop',
  }
];

export default function FeaturedCourses() {
  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
          Explore Our Course
        </h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {courseViews.map((view) => (
            <motion.div
              key={view.id}
              variants={itemVariants}
              className="h-full"
            >
              <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-64">
                  <Image
                    src={view.imageUrl}
                    alt={view.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                  <Badge 
                    className="absolute top-2 right-2 bg-green-600"
                  >
                    {view.viewType}
                  </Badge>
                </div>
                <CardContent className="flex-grow p-4 space-y-4">
                  <h3 className="text-xl text-center font-semibold text-gray-800 dark:text-white">
                    {view.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                    {view.description}
                  </p>
                </CardContent>
                <CardFooter className="p-4">
                  <Button
                    asChild
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Link href="/courses">
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}