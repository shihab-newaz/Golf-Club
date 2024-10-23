// app/actions/member/dashboard.ts
'use server'

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { dbConnect } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import Booking from "@/models/Booking";
import Event from "@/models/Event";
import User from "@/models/User";
import Course from "@/models/Course";
import TeeTime from "@/models/TeeTime";
import HotelRoom from "@/models/HotelRoom";



// Types for dashboard data
interface DashboardData {
  upcomingBookings: Array<{
    _id: string;
    teeTime: {
      date: Date;
      time: string;
      course: {
        name: string;
      };
    };
    status: string;
    players: number;
    room?: {
      roomNumber: string;
      type: string;
    };
  }>;
  pastBookings: Array<any>;
  upcomingEvents: Array<{
    _id: string;
    title: string;
    date: Date;
    description: string;
  }>;
  membershipDetails: {
    tier: string;
    bookingCount: number;
    joinedDate: Date;
  };
  recentCourses: Array<{
    _id: string;
    name: string;
    description: string;
    difficulty: string;
  }>;
}

// Get comprehensive dashboard data for member
export async function getMemberDashboardData(): Promise<DashboardData | NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Authentication required', { status: 401 });
    }

    await dbConnect();
    const userId = session.user.id;

    // Fetch upcoming bookings with detailed information
    const upcomingBookings = await Booking.find({
      user: userId,
      status: { $in: ['confirmed', 'pending'] },
      'teeTime.date': { $gte: new Date() }
    })
    .sort({ 'teeTime.date': 1 })
    .limit(5)
    .populate({
      path: 'teeTime',
      populate: {
        path: 'course',
        select: 'name'
      }
    })
    .populate('room', 'roomNumber type');

    // Fetch past bookings
    const pastBookings = await Booking.find({
      user: userId,
      status: 'completed',
      'teeTime.date': { $lt: new Date() }
    })
    .sort({ 'teeTime.date': -1 })
    .limit(3)
    .populate({
      path: 'teeTime',
      populate: {
        path: 'course',
        select: 'name'
      }
    });

    // Fetch upcoming events
    const upcomingEvents = await Event.find({
      date: { $gte: new Date() },
      registeredUsers: userId
    })
    .sort({ date: 1 })
    .limit(3)
    .select('title date description');

    // Get membership details
    const user = await User.findById(userId);
    const bookingCount = await Booking.countDocuments({ user: userId });

    // Fetch recent or featured courses
    const recentCourses = await Course.find()
    .sort({ createdAt: -1 })
    .limit(3)
    .select('name description difficulty');

    return {
      upcomingBookings: JSON.parse(JSON.stringify(upcomingBookings)),
      pastBookings: JSON.parse(JSON.stringify(pastBookings)),
      upcomingEvents: JSON.parse(JSON.stringify(upcomingEvents)),
      membershipDetails: {
        tier: user.membershipTier,
        bookingCount,
        joinedDate: user.createdAt
      },
      recentCourses: JSON.parse(JSON.stringify(recentCourses))
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return new NextResponse('Error fetching dashboard data', { status: 500 });
  }
}

// Cancel a booking
export async function cancelMemberBooking(bookingId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Authentication required', { status: 401 });
    }

    await dbConnect();

    const booking = await Booking.findOne({
      _id: bookingId,
      user: session.user.id
    });

    if (!booking) {
      return new NextResponse('Booking not found or unauthorized', { status: 404 });
    }

    // Check if booking is within cancellation window (e.g., 24 hours)
    const teeTime = await TeeTime.findById(booking.teeTime);
    const bookingDate = new Date(teeTime.date);
    const now = new Date();
    const hoursDifference = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDifference < 24) {
      return new NextResponse('Bookings must be cancelled at least 24 hours in advance', { status: 400 });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Increase available slots for the tee time
    await TeeTime.findByIdAndUpdate(booking.teeTime, {
      $inc: { availableSlots: booking.players }
    });

    // If there's a room booking, make it available again
    if (booking.room) {
      await HotelRoom.findByIdAndUpdate(booking.room, {
        isAvailable: true
      });
    }

    revalidatePath('/dashboard');
    return new NextResponse('Booking cancelled successfully', { status: 200 });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return new NextResponse('Error cancelling booking', { status: 500 });
  }
}

// Update member preferences
export async function updateMemberPreferences(preferences: {
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  language?: string;
  timezone?: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Authentication required', { status: 401 });
    }

    await dbConnect();

    await User.findByIdAndUpdate(session.user.id, {
      $set: preferences
    });

    revalidatePath('/dashboard/preferences');
    return new NextResponse('Preferences updated successfully', { status: 200 });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return new NextResponse('Error updating preferences', { status: 500 });
  }
}