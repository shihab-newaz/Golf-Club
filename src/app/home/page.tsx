// app/home/page.tsx
import React from "react";
import HeroSection from "./HeroSection";
import FeaturedCourses from "./FeaturedCourses";
import MembershipSection from "./MembershipSection";
import Testimonials from "./Testimonials";
import LocationSection from "./LocationSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex-grow">
        <HeroSection />
        <FeaturedCourses />
        <MembershipSection />
        <LocationSection />
        <Testimonials />
      </main>
    </div>
  );
}