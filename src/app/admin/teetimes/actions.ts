// app/admin/teetimes/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from "@/lib/mongoose"
import TeeTime from "@/models/TeeTime"

const COURSE_ID = "671ad356f6987a3c9676e957"; // You can set this to your actual course ID

export async function getTeeTimes() {
  await dbConnect()
  const teeTimes = await TeeTime.find()
    .sort({ date: 1, time: 1 }) // Sort by date and time
  return JSON.parse(JSON.stringify(teeTimes))
}

export async function getTeeTime(id: string) {
  await dbConnect()
  const teeTime = await TeeTime.findById(id)
  if (!teeTime) throw new Error("Tee time not found")
  return JSON.parse(JSON.stringify(teeTime))
}

export async function deleteTeeTime(id: string) {
  await dbConnect()
  await TeeTime.findByIdAndDelete(id)
  revalidatePath('/admin/teetimes')
}

export async function addTeeTime(teeTimeData: any) {
  await dbConnect()
  
  // Validate required fields
  if (!teeTimeData.date || !teeTimeData.time || !teeTimeData.price) {
    throw new Error("Missing required fields")
  }

  const newTeeTime = new TeeTime({
    date: teeTimeData.date,
    time: teeTimeData.time,
    course: COURSE_ID,
    maxPlayers: teeTimeData.maxPlayers || 4,
    availableSlots: teeTimeData.availableSlots || 4,
    price: teeTimeData.price,
    isAvailable: teeTimeData.isAvailable ?? true
  })

  try {
    await newTeeTime.save()
    revalidatePath('/admin/teetimes')
    return JSON.parse(JSON.stringify(newTeeTime))
  } catch (error: any) {
    // Handle duplicate date/time error
    if (error.code === 11000) {
      throw new Error("A tee time already exists for this date and time")
    }
    throw error
  }
}

export async function updateTeeTime(id: string, teeTimeData: any) {
  await dbConnect()
  
  // Validate required fields
  if (!teeTimeData.date || !teeTimeData.time || !teeTimeData.price) {
    throw new Error("Missing required fields")
  }

  try {
    const updatedTeeTime = await TeeTime.findByIdAndUpdate(
      id,
      {
        date: teeTimeData.date,
        time: teeTimeData.time,
        course: COURSE_ID,
        maxPlayers: teeTimeData.maxPlayers || 4,
        availableSlots: teeTimeData.availableSlots || 4,
        price: teeTimeData.price,
        isAvailable: teeTimeData.isAvailable ?? true
      },
      { 
        new: true,
        runValidators: true 
      }
    )

    if (!updatedTeeTime) {
      throw new Error("Tee time not found")
    }

    revalidatePath('/admin/teetimes')
    return JSON.parse(JSON.stringify(updatedTeeTime))
  } catch (error: any) {
    // Handle duplicate date/time error
    if (error.code === 11000) {
      throw new Error("A tee time already exists for this date and time")
    }
    throw error
  }
}