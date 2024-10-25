// app/home/page.tsx
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import HeroSection from "./HeroSection";
import FeaturedCourses from "./FeaturedCourses";
import MembershipSection from "./MembershipSection";
import Testimonials from "./Testimonials";
import LocationSection from "./LocationSection";

function FeaturedCoursesSkeleton() {
  return (
    <div className="py-16 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <Skeleton className="h-8 w-64 mx-auto mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  
  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex-grow">
        <HeroSection />
        <Suspense fallback={<FeaturedCoursesSkeleton />}>
        <FeaturedCourses />
        </Suspense>
        <MembershipSection />
        <LocationSection />
        <Testimonials />
      </main>
    </div>
  );
}