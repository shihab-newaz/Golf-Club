// app/dashboard/actions.ts
'use server'

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/lib/mongoose";
import Booking from "@/models/Booking";
import Course from "@/models/Course";
import Event from "@/models/Event";

export async function getUserDashboardData() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Not authenticated");
  }

  await dbConnect();

  const userId = session.user.id;
  console.log('User ID:', userId);

  // Fetch upcoming bookings (confirmed or pending)
  const upcomingBookings = await Booking.find({
    user: userId,
    status: { $in: ["confirmed", "pending"] },
    "teeTime.date": { $gte: new Date() }
  })
    .sort({ "teeTime.date": 1 })
    .limit(3)
    .populate({
      path: "teeTime",
      select: "date time",
      populate: {
        path: "course",
        select: "name"
      }
    });

  // Fetch completed bookings
  const completedBookings = await Booking.find({
    user: userId,
    status: "completed"
  })
    .sort({ "teeTime.date": -1 })
    .limit(5)
    .populate({
      path: "teeTime",
      select: "date time",
      populate: {
        path: "course",
        select: "name"
      }
    });

  // Fetch registered upcoming events
  const registeredEvents = await Event.find({
    registeredUsers: userId,
    date: { $gte: new Date() }
  })
    .sort({ date: 1 })
    .limit(3)
    .select('title description date startTime endTime');

  const bookingCount = await Booking.countDocuments({ user: userId });
  const recentCourses = await Course.find().limit(3);

  return {
    upcomingBookings: JSON.parse(JSON.stringify(upcomingBookings)),
    completedBookings: JSON.parse(JSON.stringify(completedBookings)),
    registeredEvents: JSON.parse(JSON.stringify(registeredEvents)),
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

  // Check if booking is within cancellation window (e.g., 24 hours)
  const teeTime = await booking.populate('teeTime');
  const bookingDate = new Date(teeTime.teeTime.date);
  const now = new Date();
  const hoursDifference = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursDifference < 24) {
    throw new Error("Bookings must be cancelled at least 24 hours in advance");
  }

  booking.status = "cancelled";
  await booking.save();

  return { success: true };
}