// app/booking/actions.ts
'use server'

import dbConnect from "@/lib/mongoose";
import TeeTime from "@/models/TeeTime";
import Booking from "@/models/Booking";
import HotelRoom from "@/models/HotelRoom";

export async function fetchAvailableTimes(date: string) {
  await dbConnect();
  const selectedDate = new Date(date);
  const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

  const availableTimes = await TeeTime.find({
    date: { $gte: startOfDay, $lte: endOfDay },
    isAvailable: true,
  }).select('_id time');

  return JSON.parse(JSON.stringify(availableTimes));
}

export async function fetchAvailableRooms(checkInDate: string, checkOutDate: string) {
  await dbConnect();
  const availableRooms = await HotelRoom.find({
    isAvailable: true,
    // Add more complex logic here if needed to check room availability for the given dates
  }).select('_id roomNumber type capacity pricePerNight amenities description');

  return JSON.parse(JSON.stringify(availableRooms));
}

export async function bookTeeTime(bookingData: {
  userId: string;
  teeTimeId: string;
  hotelRoomId?: string;
  phoneNumber: string;
  players: number;
  checkInDate?: string;
  checkOutDate?: string;
}) {
  await dbConnect();
  const { userId, teeTimeId, hotelRoomId, phoneNumber, players, checkInDate, checkOutDate } = bookingData;

  const teeTime = await TeeTime.findById(teeTimeId);
  if (!teeTime || !teeTime.isAvailable) {
    throw new Error("Selected tee time is no longer available");
  }

  let hotelRoom;
  if (hotelRoomId) {
    hotelRoom = await HotelRoom.findById(hotelRoomId);
    if (!hotelRoom || !hotelRoom.isAvailable) {
      throw new Error("Selected hotel room is no longer available");
    }
  }

  const newBooking = new Booking({
    user: userId,
    teeTime: teeTimeId,
    resortRoom: hotelRoomId,
    phoneNumber,
    players,
    status: "confirmed",
    checkInDate: checkInDate ? new Date(checkInDate) : undefined,
    checkOutDate: checkOutDate ? new Date(checkOutDate) : undefined,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  });

  await newBooking.save();
  teeTime.isAvailable = false;
  await teeTime.save();

  if (hotelRoom) {
    hotelRoom.isAvailable = false;
    await hotelRoom.save();
  }

  return { success: true, message: "Booking confirmed successfully" };
}