// // app/api/seed/route.ts
// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongoose";
// import Event from "@/models/Event";
// import Booking from "@/models/Booking";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// export async function GET() {
//   try {
//     await dbConnect();

//     // Delete all existing entries
//     await Promise.all([
//       User.deleteMany({}),
//       Event.deleteMany({}),
//       Booking.deleteMany({}),
//     ]);

//     console.log("Deleted existing entries");
//     const password = process.env.ADMIN_PASSWORD;
//     if (!password) {
//       throw new Error("ADMIN_PASSWORD is not set in environment variables");
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     // Seed Users
//     const adminUser = await User.create({
//       name: "Admin",
//       username: "admin",
//       email: "admin@golfclub.com",
//       password: hashedPassword, // In a real scenario, ensure this is properly hashed
//       phoneNumber: "1234567890", // Added phone number
//       role: "admin",
//       membershipTier: "platinum",
//     });

//     const memberUser = await User.create({
//       name: "Member",
//       username: "member",
//       email: "member@golfclub.com",
//       password: hashedPassword, // In a real scenario, ensure this is properly hashed
//       phoneNumber: "1234567890", // Added phone number
//       role: "member",
//       membershipTier: "free",
//     });

//     // Seed Events
//     const events = [
//       {
//         title: "Summer Golf Tournament",
//         description: "Annual summer golf tournament for all members",
//         date: new Date("2024-07-15"),
//         startTime: "09:00",
//         endTime: "17:00",
//         capacity: 50,
//         createdBy: adminUser._id,
//       },
//       {
//         title: "Golf Clinic for Beginners",
//         description:
//           "Learn the basics of golf with our professional instructors",
//         date: new Date("2024-06-01"),
//         startTime: "10:00",
//         endTime: "12:00",
//         capacity: 20,
//         createdBy: adminUser._id,
//       },
//     ];

//     const createdEvents = await Event.insertMany(events);
//     console.log("Created events");

//     // Seed Bookings
//     const bookings = [
//       {
//         user: memberUser._id,
//         date: new Date("2024-05-20"),
//         time: "14:00",
//         players: 2,
//         status: "confirmed",
//       },
//       {
//         user: memberUser._id,
//         date: new Date("2024-06-05"),
//         time: "10:00",
//         players: 4,
//         status: "confirmed",
//       },
//     ];

//     const createdBookings = await Booking.insertMany(bookings);
//     console.log("Created bookings");

//     // Update users with bookings and events
//     await User.findByIdAndUpdate(memberUser._id, {
//       $push: {
//         bookings: { $each: createdBookings.map((booking) => booking._id) },
//         events: { $each: createdEvents.map((event) => event._id) },
//       },
//     });

//     console.log("Updated user with bookings and events");

//     return NextResponse.json(
//       { 
//         message: "Database seeded successfully", 
//         adminUser: adminUser.toObject(), 
//         memberUser: memberUser.toObject() 
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Seeding error:", error);
//     return NextResponse.json(
//       { error: "Failed to seed database" },
//       { status: 500 }
//     );
//   }
// }
