// app/api/seed/event/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Event from "@/models/Event";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    // Delete all existing events
    await Event.deleteMany({});
    console.log("Deleted existing events");

    // Fetch an admin user for reference
    const adminUser = await User.findOne({ role: 'admin' });

    if (!adminUser) {
      throw new Error("No admin user found. Please seed users first.");
    }

    // Sample event data
    const events = [
      {
        title: "Summer Golf Tournament",
        description: "Join us for our annual summer golf tournament!",
        date: new Date("2024-07-15T09:00:00Z"),
        startTime: "09:00",
        endTime: "17:00",
        capacity: 50,
        createdBy: adminUser._id,
        imageUrl: "/ai.png"
      },

      {
        title: "Twilight Golf and Dinner",
        description: "Enjoy a round of golf followed by a gourmet dinner.",
        date: new Date("2024-08-10T18:00:00Z"),
        startTime: "18:00",
        endTime: "22:00",
        capacity: 30,
        createdBy: adminUser._id,
        imageUrl: "/clubhouse.jpg"
      },
      {
        title: "Summer Soirée",
        description: "An elegant evening of cocktails, music, and socializing on the clubhouse terrace.",
        date: new Date("2024-07-20T19:00:00Z"),
        startTime: "19:00",
        endTime: "23:00",
        capacity: 100,
        createdBy: adminUser._id,
        imageUrl: "/events/social2.webp"
      },
      {
        title: "Fairway Wedding Package",
        description: "Experience the wedding of your dreams with our all-inclusive Fairway Wedding Package.",
        date: new Date("2024-09-05T14:00:00Z"),
        startTime: "14:00",
        endTime: "23:00",
        capacity: 150,
        createdBy: adminUser._id,
        imageUrl: "/events/wedding.jpeg"
      },
      // New social gathering event
      {
        title: "Wine & Jazz Night",
        description: "Indulge in fine wines and smooth jazz at our monthly Wine & Jazz Night.",
        date: new Date("2024-08-25T20:00:00Z"),
        startTime: "20:00",
        endTime: "23:00",
        capacity: 75,
        createdBy: adminUser._id,
        imageUrl: "/events/social.webp"
      }
    ];

    const createdEvents = await Event.create(events);
    console.log(`Created ${createdEvents.length} events`);

    return NextResponse.json(
      { message: "Event data seeded successfully", count: createdEvents.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: "Failed to seed Event data" },
      { status: 500 }
    );
  }
}