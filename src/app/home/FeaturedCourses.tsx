// app/home/FeaturedCourses.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeaturedCourse } from "@/types/course";

// Animation variants for staggered animation
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



export default function FeaturedCourses({ featuredCourses }: { featuredCourses: FeaturedCourse[] }) {
  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
          Featured Courses
        </h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {featuredCourses.map((course) => (
            <motion.div
              key={course.id}
              variants={itemVariants}
              className="h-full"
            >
              <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <Image
                    src={course.imageUrl}
                    alt={course.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <Badge 
                    className={`absolute top-2 right-2 bg-green-600`}
                  >
                    {course.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                </div>
                <CardContent className="flex-grow p-4 space-y-4">
                  <h3 className="text-xl text-center font-semibold text-gray-800 dark:text-white">
                    {course.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                    {course.description}
                  </p>
                  <div className="flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="font-extrabold">Par:</span> {course.par}
                    </div>
                    <div>
                      <span className="font-extrabold">Length:</span> {course.length}y
                    </div>

                  </div>
                </CardContent>
                <CardFooter className="p-4">
                  <Button
                    asChild
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Link href={`/courses/${course.id}`}>
                      View Course Details
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