// app/courses/page.tsx
import React, { Suspense } from "react";
import ImageCarousel from "./ImageCarousel";
import CoursesSection from "./CourseSection";
import { getAllCourses } from "./actions";
import { Skeleton } from "@/components/ui/skeleton";

// Loading component for Suspense fallback
function CoursesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default async function GolfCoursePage() {
  const coursesData = await getAllCourses();
  
  // Extract image URLs from course data
  const images = coursesData.map(course => course.imageUrl);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-green-50 to-blue-50 dark:from-black/90 dark:to-gray-900">
      <ImageCarousel images={images} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<CoursesSkeleton />}>
          <CoursesSection courses={coursesData} />
        </Suspense>
      </main>
    </div>
  );
}