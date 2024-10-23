// app/actions/member/booking.ts
"use server";

import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/mongoose";
import { TeeTimeBooking, HotelBooking } from "@/app/booking/types";
import { checkRole } from "../auth";
import Booking from "@/models/Booking";
import TeeTime from "@/models/TeeTime";
import HotelRoom from "@/models/HotelRoom";



// Define response types
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface TeeTimeResponse {
  _id: string;
  teeTimeId: string;
  date: Date;
  time: string;
  available: boolean;
  availableSlots: number;
  price: number;
  players: number;
  phoneNumber: string;
}

export interface HotelRoomResponse {
  _id: string;
  roomNumber: string;
  type: "standard" | "deluxe" | "suite";
  capacity: number;
  pricePerNight: number;
  amenities?: string[];
  description?: string;
}

// Server actions with proper typing
export async function fetchAvailableTimes(
  date: string
): Promise<ApiResponse<TeeTimeResponse[]>> {
  try {
    await dbConnect();
    
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const teeTimes = await TeeTime.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
      isAvailable: true,
      availableSlots: { $gt: 0 },
    }).sort({ time: 1 });

    const formattedTeeTimes = teeTimes.map((time) => ({
      _id: time._id.toString(),
      teeTimeId: time._id.toString(),
      date: time.date,
      time: time.time,
      available: time.isAvailable,
      availableSlots: time.availableSlots,
      price: time.price,
      players: 0,
      phoneNumber: "",
    }));

    return {
      success: true,
      message: "Tee times fetched successfully",
      data: formattedTeeTimes,
    };
  } catch (error) {
    console.error("Error fetching tee times:", error);
    return {
      success: false,
      message: "Failed to fetch tee times",
      data: [],
    };
  }
}

export async function fetchAvailableRooms(
  checkIn: string,
  checkOut: string
): Promise<ApiResponse<HotelRoomResponse[]>> {
  try {
    await dbConnect();
    const rooms = await HotelRoom.find({ isAvailable: true });
    const formattedRooms = JSON.parse(JSON.stringify(rooms));

    return {
      success: true,
      message: "Rooms fetched successfully",
      data: formattedRooms,
    };
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return {
      success: false,
      message: "Failed to fetch available rooms",
      data: [],
    };
  }
}

export async function bookTeeTime({
  teeTimeBooking,
  hotelBooking,
}: {
  teeTimeBooking: TeeTimeBooking;
  hotelBooking?: HotelBooking;
}): Promise<ApiResponse<null>> {
  try {
    await checkRole(["member"]);
    await dbConnect();

    // Create booking
    const booking = new Booking({
      user: teeTimeBooking.userId,
      teeTime: teeTimeBooking.teeTimeId,
      phoneNumber: teeTimeBooking.phoneNumber,
      players: teeTimeBooking.players,
      status: "pending",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      ...(hotelBooking && {
        room: hotelBooking.roomId,
        checkInDate: hotelBooking.checkInDate,
        checkOutDate: hotelBooking.checkOutDate,
      }),
    });

    await booking.save();

    // Update tee time availability
    await TeeTime.findByIdAndUpdate(teeTimeBooking.teeTimeId, {
      $inc: { availableSlots: -teeTimeBooking.players },
    });

    if (hotelBooking) {
      await HotelRoom.findByIdAndUpdate(hotelBooking.roomId, {
        isAvailable: false,
      });
    }

    revalidatePath("/booking");

    return {
      success: true,
      message: "Booking completed successfully",
      data: null,
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create booking",
      data: null,
    };
  }
}
export async function cancelBooking(
  bookingId: string
): Promise<ApiResponse<null>> {
  try {
    await checkRole(["member"]);
    await dbConnect();

    // Find the booking
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return {
        success: false,
        message: "Booking not found",
        data: null,
      };
    }

    // Check if booking can be cancelled (not already cancelled or completed)
    if (booking.status === "cancelled" || booking.status === "completed") {
      return {
        success: false,
        message: `Cannot cancel a booking that is already ${booking.status}`,
        data: null,
      };
    }

    // Start a session for transaction
    const session = await Booking.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Update booking status
        booking.status = "cancelled";
        await booking.save({ session });

        // Restore tee time availability
        if (booking.teeTime) {
          await TeeTime.findByIdAndUpdate(
            booking.teeTime,
            {
              $inc: { availableSlots: booking.players },
              isAvailable: true,
            },
            { session }
          );
        }

        // Restore hotel room availability if it was booked
        if (booking.room) {
          await HotelRoom.findByIdAndUpdate(
            booking.room,
            { isAvailable: true },
            { session }
          );
        }
      });

      revalidatePath("/booking");
      revalidatePath("/dashboard");

      return {
        success: true,
        message: "Booking cancelled successfully",
        data: null,
      };
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to cancel booking",
      data: null,
    };
  }
}