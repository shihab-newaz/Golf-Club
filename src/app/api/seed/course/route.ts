// app/api/seed/course/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Course from "@/models/Course";

export async function GET() {
  try {
    await dbConnect();
    await Course.deleteMany({});

    const courses = [
      {
        name: "Pine Valley",
        description: "A challenging course set among beautiful pine forests.",
        holes: 18,
        par: 72,
        length: 7181,
        difficulty: "hard",
        imageUrl: "/courses/course (1).JPG",
        isOpen: true
      },
      {
        name: "Ocean Links",
        description: "A scenic coastal course with breathtaking ocean views.",
        holes: 18,
        par: 71,
        length: 6800,
        difficulty: "medium",
        imageUrl: "/courses/course (5).JPG",
        isOpen: true
      },
      {
        name: "Meadow Creek",
        description: "A beginner-friendly course with wide fairways and gentle slopes.",
        holes: 9,
        par: 35,
        length: 3200,
        difficulty: "easy",
        imageUrl: "/courses/course (7).JPG",
        isOpen: true
      },
      {
        name: "Mountain Peak",
        description: "A high-altitude course offering unique challenges and stunning vistas.",
        holes: 18,
        par: 73,
        length: 7500,
        difficulty: "hard",
        imageUrl: "/courses/course (12).JPG",
        isOpen: true
      },
      {
        name: "Bueng Ratchaburi",
        description: "A high-altitude course offering unique challenges and stunning vistas.",
        holes: 18,
        par: 73,
        length: 7500,
        difficulty: "hard",
        imageUrl: "/courses/course (23).JPG",
        isOpen: true
      },
      {
        name: "Bueng Aram",
        description: "A high-altitude course offering unique challenges and stunning vistas.",
        holes: 18,
        par: 73,
        length: 7500,
        difficulty: "hard",
        imageUrl: "/courses/course (40).JPG",
        isOpen: true
      }
    ];

    const createdCourses = await Course.create(courses);
    console.log(`Created ${createdCourses.length} courses`);

    return NextResponse.json(
      { message: "Course data seeded successfully", courses: createdCourses },
      { status: 200 }
    );
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: "Failed to seed Course data" },
      { status: 500 }
    );
  }
}