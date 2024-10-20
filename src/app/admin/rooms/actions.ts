// app/admin/hotel-rooms/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from "@/lib/mongoose"
import HotelRoom from "@/models/HotelRoom"

export async function getHotelRooms() {
  await dbConnect()
  const rooms = await HotelRoom.find()
  return JSON.parse(JSON.stringify(rooms))
}

export async function addHotelRoom(roomData: any) {
  await dbConnect()
  const newRoom = new HotelRoom(roomData)
  await newRoom.save()
  revalidatePath('/admin/hotel-rooms')
  return JSON.parse(JSON.stringify(newRoom))
}

export async function updateHotelRoom(id: string, roomData: any) {
  await dbConnect()
  const updatedRoom = await HotelRoom.findByIdAndUpdate(id, roomData, { new: true })
  revalidatePath('/admin/hotel-rooms')
  return JSON.parse(JSON.stringify(updatedRoom))
}

export async function deleteHotelRoom(id: string) {
  await dbConnect()
  await HotelRoom.findByIdAndDelete(id)
  revalidatePath('/admin/hotel-rooms')
}