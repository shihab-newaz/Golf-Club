// app/dashboard/actions.ts
"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { withAuth } from "@/lib/authError";
import dbConnect from "@/lib/mongoose";
import Booking from "@/models/Booking";
import Event from "@/models/Event";
import User from "@/models/User";
import TeeTime from "@/models/TeeTime";
import { DashboardData } from "./types";

export async function getDashboardData(
  page = 1,
  limit = 10
): Promise<DashboardData> {
  return withAuth(async () => {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const userId = session!.user.id;

    const user = await User.findById(userId);
    if (!user) {
      throw { type: 'NOT_FOUND', message: 'User not found' };
    }

    const [totalBookings, completedBookings, upcomingBookings, currentBookings] =
      await Promise.all([
        Booking.countDocuments({ user: userId }),
        Booking.countDocuments({ user: userId, status: "completed" }),
        Booking.countDocuments({
          user: userId,
          status: { $in: ["confirmed", "pending"] },
          "teeTime.date": { $gte: new Date() },
        }),
        Booking.find({
          user: userId,
          status: { $in: ["pending", "confirmed", "completed"] },
        })
          .sort({ "teeTime.date": -1 })
          .populate("teeTime"),
      ]);

    const events = await Event.find({
      registeredUsers: userId,
      date: { $gte: new Date() },
    })
      .sort({ date: 1 })
      .populate("createdBy", "name")
      .select(
        "title description date startTime endTime capacity availableSpots imageUrl createdBy"
      );

    const skip = (page - 1) * limit;
    const [teeTimes, totalTeeTimesCount] = await Promise.all([
      TeeTime.find({
        date: { $gte: new Date() },
        isAvailable: true,
        availableSlots: { $gt: 0 },
      })
        .sort({ date: 1, time: 1 })
        .skip(skip)
        .limit(limit),

      TeeTime.countDocuments({
        date: { $gte: new Date() },
        isAvailable: true,
        availableSlots: { $gt: 0 },
      }),
    ]);

    return {
      stats: {
        membershipStatus: user.membershipTier,
        name: user.name,
        totalBookings,
        completedBookings,
        upcomingBookings,
        registeredEvents: events.length,
        memberSince: user.createdAt,
      },
      bookings: JSON.parse(JSON.stringify(currentBookings)),
      events: JSON.parse(JSON.stringify(events)),
      teeTimes: {
        items: JSON.parse(JSON.stringify(teeTimes)),
        totalPages: Math.ceil(totalTeeTimesCount / limit),
        currentPage: page,
      },
    };
  });
}

export async function cancelBooking(bookingId: string) {
  return withAuth(async () => {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    const booking = await Booking.findOne({
      _id: bookingId,
      user: session!.user.id,
    });

    if (!booking) {
      throw { type: 'NOT_FOUND', message: 'Booking not found or unauthorized' };
    }

    const teeTime = await booking.populate("teeTime");
    const bookingDate = new Date(teeTime.teeTime.date);
    const now = new Date();
    const hoursDifference =
      (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDifference < 24) {
      throw { 
        type: 'VALIDATION', 
        message: 'Bookings must be cancelled at least 24 hours in advance'
      };
    }

    booking.status = "cancelled";
    await booking.save();

    return { success: true };
  });
}