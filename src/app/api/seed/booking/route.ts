// app/api/seed/booking/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Booking from "@/models/Booking";
import User from "@/models/User";
import TeeTime from "@/models/TeeTime";
import ResortRoom from "@/models/HotelRoom";

export async function GET() {
  try {
    await dbConnect();

    // Delete all existing bookings
    await Booking.deleteMany({});
    console.log("Deleted existing bookings");

    // Fetch a user, tee time, and resort room for reference
    const user = await User.findOne();
    const teeTime = await TeeTime.findOne();
    const resortRoom = await ResortRoom.findOne();

    if (!user || !teeTime) {
      throw new Error("Required seed data (User or TeeTime) not found");
    }

    // Create sample bookings
    const bookings = [
      {
        user: user._id,
        teeTime: teeTime._id,
        resortRoom: resortRoom ? resortRoom._id : undefined,
        phoneNumber: "1234567890",
        players: 2,
        status: "confirmed",
        checkInDate: resortRoom ? new Date("2024-06-01") : undefined,
        checkOutDate: resortRoom ? new Date("2024-06-03") : undefined,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
      },
      {
        user: user._id,
        teeTime: teeTime._id,
        phoneNumber: "9876543210",
        players: 4,
        status: "pending",
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // Expires in 2 hours
      },
    ];

    const createdBookings = await Booking.create(bookings);
    console.log("Created sample bookings");

    return NextResponse.json(
      { message: "Booking data seeded successfully", bookings: createdBookings },
      { status: 200 }
    );
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: "Failed to seed booking data" },
      { status: 500 }
    );
  }
}