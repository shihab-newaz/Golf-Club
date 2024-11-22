// app/admin/events/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from "@/lib/mongoose"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/utils/authOptions"
import { NextResponse } from "next/server"
import Event from "@/models/Event"

export async function getEvents() {
  await dbConnect()
  // Populate both registeredUsers and createdBy fields with necessary user information
  const events = await Event.find()
    .populate('registeredUsers', 'name email') // Only get name and email fields
    .populate('createdBy', 'name email')
    .sort({ date: -1 }) // Sort by date descending
  return JSON.parse(JSON.stringify(events))
}

export async function deleteEvent(id: string) {
  await dbConnect()
  await Event.findByIdAndDelete(id)
  revalidatePath('/admin/events')
}

export async function addEvent(eventData: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Authentication required', { status: 401 })
    }

    await dbConnect()
    
    // Add the current user's ID as createdBy
    const newEventData = {
      ...eventData,
      createdBy: session.user.id,
      availableSpots: eventData.capacity // Initialize availableSpots with capacity
    }

    const newEvent = new Event(newEventData)
    await newEvent.save()

    // Fetch the newly created event with populated fields
    const populatedEvent = await Event.findById(newEvent._id)
      .populate('registeredUsers', 'name email')
      .populate('createdBy', 'name email')

    revalidatePath('/admin/events')
    return JSON.parse(JSON.stringify(populatedEvent))
  } catch (error: unknown) {
    console.error('Error adding event:', error)
    if (error instanceof Error && error.name === 'ValidationError') {
      return new NextResponse(
        `Validation Error: ${error.message}`, 
        { status: 400 }
      )
    }
    return new NextResponse('Error adding event', { status: 500 })
  }
}

export async function updateEvent(id: string, eventData: any) {
  await dbConnect()
  const updatedEvent = await Event.findByIdAndUpdate(
    id, 
    eventData, 
    { 
      new: true,
      runValidators: true
    }
  )
    .populate('registeredUsers', 'name email')
    .populate('createdBy', 'name email')
    
  revalidatePath('/admin/events')
  return JSON.parse(JSON.stringify(updatedEvent))
}

// Additional helper function to get event details
export async function getEventDetails(id: string) {
  await dbConnect()
  const event = await Event.findById(id)
    .populate('registeredUsers', 'name email')
    .populate('createdBy', 'name email')
  
  if (!event) {
    throw new Error('Event not found')
  }
  
  return JSON.parse(JSON.stringify(event))
}