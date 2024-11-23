// app/api/seed/courses/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import  Course  from "@/models/Course";
import  Hole  from "@/models/Hole";
import  {holes}  from "./holeData";

const generateCourseImages = () => {
  const images = [];
  for (let i = 1; i <= 18; i++) {
    images.push(`/courses/course-${i}.jpg`);
  }
  return images;
};const generateCourseData = () => ({
  name: "Bueng Aram Golf Club",
  description: "A premier championship golf course offering a challenging yet enjoyable experience for golfers of all skill levels.",
  layout: {
    totalHoles: 18,
    totalPar: 72,
    courseType: "lakeside",
    terrain: "Rolling hills with lakeside views",
    waterFeatures: {
      mainLake: true,
      streams: true,
      ponds: 8
    }
  },
  facilities: {
    drivingRange: {
      available: true,
      underRenovation: false
    },
    practice: {
      puttingGreen: true,
      chippingArea: true
    },
    clubhouse: {
      available: true,
      amenities: [
        "Pro Shop",
        "Restaurant",
        "Locker Rooms",
        "Meeting Rooms",
        "Golf Cart Rental"
      ]
    }
  },
  overallRating: {
    difficulty: 4,
    maintenance: 5,
    scenic: 5
  },
  gpsCoordinates: {
    latitude: 16.4321,
    longitude: 103.5065
  },
  mainImageUrls: generateCourseImages(), // Array of image URLs
});

export async function POST() {
  try {
    console.log("Starting database seeding...");
    await dbConnect();

    // Clear existing data
    console.log("Clearing existing data...");
    await Course.deleteMany({});
    await Hole.deleteMany({});

    // Create holes
    console.log("Creating holes...");
    const createdHoles = await Hole.create(holes);
    console.log(`Created ${createdHoles.length} holes`);

    // Create course
    console.log("Creating course...");
    const courseData = {
      ...generateCourseData(),
      holes: createdHoles.map(hole => hole._id),
      holeLayouts: createdHoles.map(hole => hole.imageUrl)
    };

    const course = await Course.create(courseData);
    console.log("Course created successfully");

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: {
        courseId: course._id,
        holesTotalCount: createdHoles.length
      }
    });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to seed database",
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    
    const course = await Course.findOne().populate('holes');
    const holesCount = await Hole.countDocuments();

    if (!course) {
      return NextResponse.json({
        success: false,
        message: "No course found",
        data: {
          courseCount: 0,
          holeCount: holesCount
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        course: {
          id: course._id,
          name: course.name,
          description: course.description,
          holesCount: course.holes.length,
          layout: course.layout,
          facilities: course.facilities,
          overallRating: course.overallRating,
          mainImageUrls: course.mainImageUrls, 
        },
        totalHoles: holesCount
      }
    });
  } catch (error: any) {
    console.error("Error fetching data:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to get course data",
      error: error.message
    }, { status: 500 });
  }
}