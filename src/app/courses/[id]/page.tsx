// app/courses/[id]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dbConnect from "@/lib/mongoose";
import Course from "@/models/Course";

interface CoursePageProps {
  params: {
    id: string;
  };
}
type Difficulty = 'easy' | 'medium' | 'hard';

// Define the styles mapping
const difficultyStyles: Record<Difficulty, string> = {
  easy: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
};
async function getCourse(id: string) {
  await dbConnect();
  const course = await Course.findById(id);
  if (!course) return null;
  return JSON.parse(JSON.stringify(course));
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await getCourse(params.id);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/courses">
            <Button variant="outline" className="mb-4">
              ← Back to Courses
            </Button>
          </Link>
        </div>

        <Card className="overflow-hidden bg-white dark:bg-gray-800">
          <div className="relative h-[400px] w-full">
            <Image
              src={course.imageUrl}
              alt={course.name}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <CardContent className="p-8">
            <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  {course.name}
                </h1>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      course.isOpen
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    }`}
                  >
                    {course.isOpen ? "Open" : "Closed"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      difficultyStyles[course.difficulty as Difficulty]
                    }`}
                  >
                    {course.difficulty.charAt(0).toUpperCase() +
                      course.difficulty.slice(1)}{" "}
                    Difficulty
                  </span>
                </div>
              </div>

              <Link href="/booking">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Book Now
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Course Details
                </h2>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p>Number of Holes: {course.holes}</p>
                  <p>Course Par: {course.par}</p>
                  <p>Length: {course.length} yards</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Description
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {course.description}
                </p>
              </div>
            </div>

            {/* You can add more sections here like course features, rules, etc. */}
            <div className="border-t dark:border-gray-700 pt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Course Features
              </h2>
              <ul className="grid md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
                <li>Pro Shop</li>
                <li>Practice Facilities</li>
                <li>Golf Cart Rental</li>
                <li>Club Rental</li>
                <li>Driving Range</li>
                <li>Putting Green</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
