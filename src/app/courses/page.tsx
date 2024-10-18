// app/courses/page.tsx
import React, { Suspense } from "react";
import ImageCarousel from "./ImageCarousel";
import CoursesSection from "./CourseSection";
import dbConnect from "@/lib/mongoose";
import Course from "@/models/Course";
import { Types } from "mongoose";

interface LeanCourse {
  _id: Types.ObjectId;
  name: string;
  description: string;
  holes: number;
  par: number;
  length: number;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
  isOpen: boolean;
}

async function getCoursesData() {
  await dbConnect();
  const courses = await Course.find({}).lean().exec();
  return courses.map((course) => {
    const typedCourse = course as LeanCourse;

    return {
      id: typedCourse._id.toString(),
      name: typedCourse.name,
      description: typedCourse.description,
      holes: typedCourse.holes,
      par: typedCourse.par,
      length: typedCourse.length,
      difficulty: typedCourse.difficulty,
      imageUrl: typedCourse.imageUrl,
      isOpen: typedCourse.isOpen,
    };
  });
}

export default async function KoreaGolfCoursePage() {
  const coursesData = await getCoursesData();
  
  // Extract image URLs from course data
  const images = coursesData.map(course => course.imageUrl);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-green-50 to-blue-50 dark:from-black/90 dark:to-gray-900">
      <ImageCarousel images={images} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading courses...</div>}>
          <CoursesSection courses={coursesData} />
        </Suspense>
      </main>
    </div>
  );
}