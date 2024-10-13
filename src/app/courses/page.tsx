// app/courses/page.tsx
import React from "react";
import ImageCarousel from "./ImageCarousel";
import WeatherSection from "./WeatherSection";
import CoursesSection from "./CourseSection";

const images = ["/clubhouse.jpg", "/upcoming.png", "/golf.jpg", "/ai.png"];

async function getWeatherData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/weather`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch weather data");
  }
  return res.json();
}

async function getCoursesData() {
  // This is a placeholder. In a real application, you would fetch this data from your API or database.
  return [
    {
      id: 1,
      name: "Pine Valley",
      description: "Challenging 18-hole course set in beautiful pine forests.",
      imageUrl: "/golf.jpg",
    },
    {
      id: 2,
      name: "Ocean Links",
      description: "Scenic coastal course with breathtaking ocean views.",
      imageUrl: "/golf.jpg",
    },
    {
      id: 3,
      name: "Mountain Peak",
      description: "High-altitude course offering unique golfing experience.",
      imageUrl: "/golf.jpg",
    },
  ];
}

export default async function KoreaGolfCoursePage() {
  const weatherData = await getWeatherData();
  const coursesData = await getCoursesData();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-green-50 to-blue-50 dark:from-black/90 dark:to-gray-900">
      <ImageCarousel images={images} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <CoursesSection courses={coursesData} />
        <WeatherSection weatherData={weatherData} />
      </main>
    </div>
  );
}
