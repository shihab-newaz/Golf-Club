import React from "react";
import HeroSection from "./HeroSection";
import FeaturedCourses from "./FeaturedCourses";
import MembershipSection from "./MembershipSection";
import WeatherSection from "./WeatherSection";
import Testimonials from "./Testimonials";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex-grow">
        <HeroSection />
        <FeaturedCourses />
        <MembershipSection />
        {/* <WeatherSection /> */}
        <Testimonials />
      </main>
    </div>
  );
}