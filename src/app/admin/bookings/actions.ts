// app/admin/bookings/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from "@/lib/mongoose"
import Booking from "@/models/Booking"
import User from "@/models/User"
import TeeTime from "@/models/TeeTime"
import HotelRoom from "@/models/HotelRoom"

export async function getBookings() {
  await dbConnect()
  const bookings = await Booking.find().populate('user', 'name').populate('teeTime', 'date time')
  return JSON.parse(JSON.stringify(bookings))
}

export async function getUsers() {
  await dbConnect()
  const users = await User.find({}, 'name')
  return JSON.parse(JSON.stringify(users))
}

export async function getTeeTimes() {
  await dbConnect()
  const teeTimes = await TeeTime.find({}, 'date time')
  return JSON.parse(JSON.stringify(teeTimes))
}

export async function getResortRooms() {
  await dbConnect()
  const resortRooms = await HotelRoom.find({}, 'roomNumber')
  return JSON.parse(JSON.stringify(resortRooms))
}

export async function deleteBooking(id: string) {
  await dbConnect()
  await Booking.findByIdAndDelete(id)
  revalidatePath('/admin/bookings')
}

export async function addBooking(bookingData: any) {
  await dbConnect()
  if (!bookingData.expiresAt) {
    bookingData.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
  }
  const newBooking = new Booking(bookingData)
  await newBooking.save()
  
  const populatedBooking = await Booking.findById(newBooking._id)// Fetch the newly created booking with populated fields
    .populate('user', 'name')
    .populate('teeTime', 'date time')
    .populate('resortRoom', 'roomNumber')

  revalidatePath('/admin/bookings')
  return JSON.parse(JSON.stringify(populatedBooking))
}

export async function updateBooking(id: string, bookingData: any) {
  await dbConnect()
  if (!bookingData.expiresAt) {
    const existingBooking = await Booking.findById(id)
    bookingData.expiresAt = existingBooking.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000)
  }
  const updatedBooking = await Booking.findByIdAndUpdate(id, bookingData, { new: true })
    .populate('user', 'name')
    .populate('teeTime', 'date time')
  revalidatePath('/admin/bookings')
  return JSON.parse(JSON.stringify(updatedBooking))
}