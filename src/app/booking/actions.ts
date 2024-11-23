// app/booking/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/utils/authOptions"
import dbConnect from "@/lib/mongoose"
import Models from "@/models"
import { TeeTimeBooking, ITeeTimeDocument, PaginatedTeeTimeResponse } from './types'
import mongoose from 'mongoose'
const ITEMS_PER_PAGE = 10;

interface IPopulatedTeeTime extends ITeeTimeDocument {
  course: {
    _id: mongoose.Types.ObjectId;
    name: string;
  };
}

export async function fetchAvailableTimes(
  page: number = 1
): Promise<PaginatedTeeTimeResponse> {
  await dbConnect();
  
  try {
    // Get current date and time
    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + 30); // Add 30 minutes buffer

    // Get total count for pagination
    const totalCount = await Models.TeeTime.countDocuments({
      date: { $gte: currentDate },
      isAvailable: true,
      availableSlots: { $gt: 0 }
    });

    // Calculate pagination values
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const skip = (page - 1) * ITEMS_PER_PAGE;

    // Fetch paginated results
    const teeTimes = await Models.TeeTime.find({
      date: { $gte: currentDate },
      isAvailable: true,
      availableSlots: { $gt: 0 }
    })
    .sort({ date: 1, time: 1 })
    .skip(skip)
    .limit(ITEMS_PER_PAGE)
    .populate('course', 'name')
    .lean<IPopulatedTeeTime[]>();

    // Format the tee times
    const formattedTimes = teeTimes.map((time: IPopulatedTeeTime) => ({
      _id: time._id.toString(),
      teeTimeId: time._id.toString(),
      date: time.date,
      time: time.time,
      available: time.isAvailable,
      availableSlots: time.availableSlots,
      price: time.price,
      courseName: time.course?.name || 'Main Course',
      players: 0,
      phoneNumber: '',
      formattedDate: new Date(time.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }));

    return {
      data: formattedTimes,
      totalPages,
      currentPage: page,
      hasMore: page < totalPages,
      totalCount
    };
  } catch (error: any) {
    console.error('Error fetching available times:', error);
    throw new Error('Failed to fetch available tee times');
  }
}
// Helper function to check booking limits
async function checkBookingLimits(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeBookings = await Models.Booking.countDocuments({
    user: userId,
    status: { $in: ['pending', 'confirmed'] },
    'teeTime.date': { $gte: today }
  });

  const MAX_ACTIVE_BOOKINGS = 3;
  
  if (activeBookings >= MAX_ACTIVE_BOOKINGS) {
    throw new Error(`You cannot have more than ${MAX_ACTIVE_BOOKINGS} active bookings`);
  }

  return true;
}



export async function bookTeeTime(teeTimeBooking: TeeTimeBooking) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error('Authentication required');
    }

    await checkBookingLimits(session.user.id);

    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
      const teeTime = await Models.TeeTime.findById(teeTimeBooking.teeTimeId)
        .session(dbSession);
      
      if (!teeTime) {
        throw new Error('Tee time not found');
      }

      if (!teeTime.isAvailable) {
        throw new Error('This tee time is no longer available');
      }

      if (teeTime.availableSlots < teeTimeBooking.players) {
        throw new Error('Not enough slots available');
      }

      const booking = new Models.Booking({
        user: session.user.id,
        teeTime: teeTimeBooking.teeTimeId,
        phoneNumber: teeTimeBooking.phoneNumber,
        players: teeTimeBooking.players,
        status: 'confirmed',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      await booking.save({ session: dbSession });

      await Models.TeeTime.findByIdAndUpdate(
        teeTimeBooking.teeTimeId,
        {
          $inc: { availableSlots: -teeTimeBooking.players },
          $set: { 
            isAvailable: teeTime.availableSlots - teeTimeBooking.players > 0 
          }
        },
        { session: dbSession }
      );

      await dbSession.commitTransaction();

      revalidatePath('/booking');
      revalidatePath('/dashboard');
      
      return {
        success: true,
        bookingId: booking._id,
        message: 'Booking completed successfully'
      };
    } catch (error) {
      await dbSession.abortTransaction();
      throw error;
    } finally {
      dbSession.endSession();
    }
  } catch (error: any) {
    console.error('Error booking tee time:', error);
    return {
      success: false,
      message: error.message || 'Failed to complete booking'
    };
  }
}

interface IBookingPopulated extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  teeTime: {
    _id: mongoose.Types.ObjectId;
    date: Date;
    time: string;
    course: {
      _id: mongoose.Types.ObjectId;
      name: string;
    };
  };
  phoneNumber: string;
  players: number;
  status: string;
  expiresAt: Date;
}

export async function getUpcomingBookings() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error('Authentication required');
    }

    await dbConnect();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await Models.Booking.find({
      user: session.user.id,
      status: { $in: ['pending', 'confirmed'] },
      'teeTime.date': { $gte: today }
    })
    .populate({
      path: 'teeTime',
      populate: {
        path: 'course',
        select: 'name'
      }
    })
    .sort({ 'teeTime.date': 1, 'teeTime.time': 1 })
    .lean<IBookingPopulated[]>();

    return JSON.parse(JSON.stringify(bookings));
  } catch (error: any) {
    console.error('Error fetching upcoming bookings:', error);
    throw new Error('Failed to fetch upcoming bookings');
  }
}

export async function cancelBooking(bookingId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error('Authentication required');
    }

    await dbConnect();

    const mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();

    try {
      const booking = await Models.Booking.findOne({
        _id: bookingId,
        user: session.user.id
      }).session(mongoSession);

      if (!booking) {
        throw new Error('Booking not found');
      }

      booking.status = 'cancelled';
      await booking.save({ session: mongoSession });

      await Models.TeeTime.findByIdAndUpdate(
        booking.teeTime,
        {
          $inc: { availableSlots: booking.players },
          $set: { isAvailable: true }
        },
        { session: mongoSession }
      );

      await mongoSession.commitTransaction();

      revalidatePath('/booking');
      revalidatePath('/dashboard');

      return {
        success: true,
        message: 'Booking cancelled successfully'
      };
    } catch (error) {
      await mongoSession.abortTransaction();
      throw error;
    } finally {
      mongoSession.endSession();
    }
  } catch (error: any) {
    console.error('Error cancelling booking:', error);
    return {
      success: false,
      message: error.message || 'Failed to cancel booking'
    };
  }
}