// app/courses/page.tsx
import { Suspense } from 'react';
import { getCourses } from './actions';
import CourseCarousel from './ImageCarousel';
import HoleGrid from './HoleGrid';
import { Skeleton } from "@/components/ui/skeleton";

export default async function CoursesPage() {
  const courses = await getCourses();
  
  return (
    <main className="min-h-screen pt-16 bg-background-alt">
      {/* Hero Section with Carousel */}
      <section className="container">
        <Suspense fallback={<div className="w-full h-[600px] bg-muted rounded-lg animate-pulse" />}>
          <CourseCarousel courses={courses} />
          <h1 className="text-4xl font-bold text-center w-[100vw] mt-8">Course View</h1>
        </Suspense>
      </section>

      {/* Course Information */}
      <section className="container mx-auto px-4 py-12 bg-background-alt">
        {courses.map((course: any) => (
          <div key={course._id} className="mb-16">
            <div className="mb-8 ">
              <h2 className="text-3xl font-semibold mb-4">{course.name}</h2>
              <p className="text-muted-foreground">{course.description}</p>
              
              {/* Course Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 ">
                <div className="bg-card rounded-lg p-4 bg-[#fae8b4] dark:bg-background">
                  <h3 className="font-medium mb-2">Course Details</h3>
                  <ul className="space-y-2">
                    <li>Type: {course.layout.courseType}</li>
                    <li>Total Par: {course.layout.totalPar}</li>
                    <li>Terrain: {course.layout.terrain}</li>
                  </ul>
                </div>
                
                <div className="bg-card rounded-lg p-4 bg-[#fae8b4] dark:bg-background">
                  <h3 className="font-medium mb-2">Ratings</h3>
                  <ul className="space-y-2">
                    <li>Difficulty: {course.overallRating.difficulty}/5</li>
                    <li>Maintenance: {course.overallRating.maintenance}/5</li>
                    <li>Scenic: {course.overallRating.scenic}/5</li>
                  </ul>
                </div>
                
                <div className="bg-card rounded-lg p-4 bg-[#fae8b4] dark:bg-background">
                  <h3 className="font-medium mb-2">Facilities</h3>
                  <ul className="space-y-2">
                    <li>Driving Range: {course.facilities.drivingRange.available ? 'Available' : 'Under Renovation'}</li>
                    <li>Putting Green: {course.facilities.practice.puttingGreen ? 'Yes' : 'No'}</li>
                    <li>Chipping Area: {course.facilities.practice.chippingArea ? 'Yes' : 'No'}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Hole Information */}
            <Suspense 
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(18)].map((_, i) => (
                    <Skeleton key={i} className="h-[200px] w-full" />
                  ))}
                </div>
              }
            >
              <HoleGrid courseId={course._id} />
            </Suspense>
          </div>
        ))}
      </section>
    </main>
  );
}