// app/courses/CoursesSection.tsx
import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Course {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

interface CoursesSectionProps {
  courses: Course[];
}

const CoursesSection: React.FC<CoursesSectionProps> = ({ courses }) => {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-green-800 dark:text-white text-center">Our Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Card key={course.id} className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={course.imageUrl}
                alt={course.name}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{course.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white transition duration-300 ease-in-out transform hover:scale-105">
                Learn More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default CoursesSection;