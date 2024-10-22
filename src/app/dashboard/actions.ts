// app/dashboard/actions.ts
'use server'

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/lib/mongoose";
import Booking from "@/models/Booking";
import Course from "@/models/Course";

export async function getUserDashboardData() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Not authenticated");
  }

  await dbConnect();

  const userId = session.user.id;

  const upcomingBookings = await Booking.find({ user: userId, status: "confirmed" })
    .sort({ "teeTime.date": 1 })
    .limit(3)
    .populate("teeTime", "date time")
    .populate("user", "name");

  const bookingCount = await Booking.countDocuments({ user: userId });

  const recentCourses = await Course.find().limit(3);

  return {
    upcomingBookings: JSON.parse(JSON.stringify(upcomingBookings)),
    bookingCount,
    recentCourses: JSON.parse(JSON.stringify(recentCourses)),
  };
}

export async function cancelBooking(bookingId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Not authenticated");
  }

  await dbConnect();

  const booking = await Booking.findById(bookingId);
  if (!booking || booking.user.toString() !== session.user.id) {
    throw new Error("Booking not found or not authorized");
  }

  booking.status = "cancelled";
  await booking.save();

  return { success: true };
}