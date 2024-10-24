// app/courses/components/CourseCarousel.tsx
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ICourse } from '@/models/Course';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CourseCarouselProps {
  courses: ICourse[];
}

export default function CourseCarousel({ courses }: CourseCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const currentCourse = courses[currentCourseIndex];
  
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    
    return () => clearInterval(timer);
  }, [currentImageIndex, currentCourseIndex]);

  const handleNext = () => {
    if (currentImageIndex < currentCourse.mainImageUrls.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else {
      setCurrentImageIndex(0);
      setCurrentCourseIndex(prev => 
        prev < courses.length - 1 ? prev + 1 : 0
      );
    }
  };

  const handlePrev = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    } else {
      const prevCourseIndex = currentCourseIndex > 0 
        ? currentCourseIndex - 1 
        : courses.length - 1;
      setCurrentCourseIndex(prevCourseIndex);
      setCurrentImageIndex(courses[prevCourseIndex].mainImageUrls.length - 1);
    }
  };

  return (
    <div className="relative h-[600px] w-[100vw]  overflow-hidden group">
      <Image
        src={currentCourse.mainImageUrls[currentImageIndex]}
        alt={`${currentCourse.name} view ${currentImageIndex + 1}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
        fill
        priority
        className="object-cover"
      />
      
      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handlePrev}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleNext}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Course Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
        <h2 className="text-xl font-semibold">{currentCourse.name}</h2>
        <p className="text-sm opacity-90">
          {currentCourse.layout.courseType} Course • {currentCourse.layout.totalPar} Par
        </p>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2">
        {currentCourse.mainImageUrls.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentImageIndex 
                ? "bg-white scale-125" 
                : "bg-white/50 hover:bg-white/75"
            )}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
