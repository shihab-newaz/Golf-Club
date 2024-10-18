// app/api/seed/tee-time/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import TeeTime from "@/models/TeeTime";
import Course from "@/models/Course";

export async function GET() {
  try {
    await dbConnect();

    // Delete all existing tee times
    await TeeTime.deleteMany({});
    console.log("Deleted existing tee times");

    // Fetch a course for reference
    const course = await Course.findOne();

    if (!course) {
      throw new Error("No course found. Please seed courses first.");
    }

    // Generate tee times for the next 7 days
    const teeTimes = [];
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      // Generate tee times from 7:00 AM to 5:00 PM, every 1 hour
      for (let hour = 7; hour <= 17; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        teeTimes.push({
          date: new Date(currentDate),
          time: time,
          course: course._id,
          maxPlayers: 4,
          availableSlots: 4,
          price: Math.floor(Math.random() * (150 - 50 + 1) + 50), // Random price between 50 and 150
          isAvailable: true
        });
      }
    }

    const createdTeeTimes = await TeeTime.create(teeTimes);
    console.log(`Created ${createdTeeTimes.length} tee times`);

    return NextResponse.json(
      { message: "TeeTime data seeded successfully", count: createdTeeTimes.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: "Failed to seed TeeTime data" },
      { status: 500 }
    );
  }
}