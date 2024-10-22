// app/booking/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from "@/lib/mongoose"
import Booking from "@/models/Booking"
import TeeTime from "@/models/TeeTime"
import HotelRoom from "@/models/HotelRoom"
import { TeeTimeBooking, HotelBooking } from './types'

export async function fetchAvailableTimes(date: string) {
  await dbConnect()
  
  // Convert the input date to the start and end of the day
  const startDate = new Date(date)
  startDate.setHours(0, 0, 0, 0)
  
  const endDate = new Date(date)
  endDate.setHours(23, 59, 59, 999)

  const teeTimes = await TeeTime.find({
    date: {
      $gte: startDate,
      $lte: endDate
    },
    isAvailable: true,
    availableSlots: { $gt: 0 }
  }).sort({ time: 1 })

  // Transform the data to match TeeTimeBooking interface
  return teeTimes.map(time => ({
    _id: time._id.toString(),
    teeTimeId: time._id.toString(),
    date: time.date,
    time: time.time,
    available: time.isAvailable,
    availableSlots: time.availableSlots,
    price: time.price,
    players: 0,
    phoneNumber: ''
  }))
}

export async function fetchAvailableRooms(checkIn: string, checkOut: string) {
  await dbConnect()
  // Add logic to check room availability based on dates
  const rooms = await HotelRoom.find({ isAvailable: true })
  return rooms
}

export async function bookTeeTime({
  teeTimeBooking,
  hotelBooking
}: {
  teeTimeBooking: TeeTimeBooking
  hotelBooking?: HotelBooking
}) {
  await dbConnect()

  // Create booking
  const booking = new Booking({
    user: teeTimeBooking.userId,
    teeTime: teeTimeBooking.teeTimeId,
    phoneNumber: teeTimeBooking.phoneNumber,
    players: teeTimeBooking.players,
    status: 'pending',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    ...(hotelBooking && {
      resortRoom: hotelBooking.roomId,
      checkInDate: hotelBooking.checkInDate,
      checkOutDate: hotelBooking.checkOutDate
    })
  })

  await booking.save()

  // Update tee time availability
  await TeeTime.findByIdAndUpdate(teeTimeBooking.teeTimeId, {
    $inc: { availableSlots: -teeTimeBooking.players }
  })

  if (hotelBooking) {
    // Update hotel room availability
    await HotelRoom.findByIdAndUpdate(hotelBooking.roomId, {
      isAvailable: false
    })
  }

  revalidatePath('/booking')
  
  return {
    success: true,
    message: 'Booking completed successfully'
  }
}