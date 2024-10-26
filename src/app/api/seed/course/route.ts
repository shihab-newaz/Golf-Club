// app/api/seed/courses/route.ts
import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoose"
import  Course  from "@/models/Course"
import  Hole from "@/models/Hole"
import { coursesData, holesData } from "./data"

export async function POST() {
  try {
    await dbConnect()
    console.log("Connected to database")

    // Clear existing data
    console.log("Clearing existing data...")
    await Course.deleteMany({})
    await Hole.deleteMany({})

    // Create holes first
    console.log("Creating holes...")
    const holesToCreate = holesData.generateHoles()
    const createdHoles = await Hole.create(holesToCreate)
    console.log(`Created ${createdHoles.length} holes`)

    // Create course with hole references
    console.log("Creating course...")
    const courseToCreate = {
      ...coursesData[0],
      holes: createdHoles.map(hole => hole._id)
    }

    const createdCourse = await Course.create(courseToCreate)
    console.log("Course created successfully")

    // Verify the creation
    const verifiedCourse = await Course.findById(createdCourse._id).populate('holes')
    
    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: {
        courseId: createdCourse._id,
        holesTotalCount: createdHoles.length,
        courseHolesCount: verifiedCourse?.holes?.length || 0
      }
    })

  } catch (error: any) {
    console.error("Seeding error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to seed database",
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    await dbConnect()
    
    const course = await Course.findOne().populate('holes')
    const holes = await Hole.find()

    if (!course) {
      return NextResponse.json({
        success: false,
        message: "No course found",
        data: {
          courseCount: 0,
          holeCount: holes.length
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        course: {
          id: course._id,
          name: course.name,
          description: course.description,
          imageUrls: course.mainImageUrls,
          holesCount: course.holes?.length || 0,
          holeLayouts: course.holeLayouts
        },
        totalHoles: holes.length
      }
    })
  } catch (error: any) {
    console.error("Error fetching data:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to get course data",
      error: error.message
    }, { status: 500 })
  }
}

// Add a cleanup route
export async function DELETE() {
  try {
    await dbConnect()
    await Course.deleteMany({})
    await Hole.deleteMany({})
    
    return NextResponse.json({
      success: true,
      message: "Database cleaned successfully"
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "Failed to clean database",
      error: error.message
    }, { status: 500 })
  }
}