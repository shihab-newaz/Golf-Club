// app/admin/bookings/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from "@/lib/mongoose"
import Booking from "@/models/Booking"

export async function getBookings() {
  await dbConnect()
  const bookings = await Booking.find().populate('user', 'name').populate('teeTime', 'date time')
  return JSON.parse(JSON.stringify(bookings))
}

export async function deleteBooking(id: string) {
  await dbConnect()
  await Booking.findByIdAndDelete(id)
  revalidatePath('/admin/bookings')
}

export async function addBooking(bookingData: any) {
  await dbConnect()
  const newBooking = new Booking(bookingData)
  await newBooking.save()
  revalidatePath('/admin/bookings')
  return JSON.parse(JSON.stringify(newBooking))
}

export async function updateBooking(id: string, bookingData: any) {
  await dbConnect()
  const updatedBooking = await Booking.findByIdAndUpdate(id, bookingData, { new: true })
    .populate('user', 'name')
    .populate('teeTime', 'date time')
  revalidatePath('/admin/bookings')
  return JSON.parse(JSON.stringify(updatedBooking))
}