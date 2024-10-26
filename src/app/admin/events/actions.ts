// app/admin/events/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from "@/lib/mongoose"
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
  await dbConnect()
  const newEvent = new Event(eventData)
  await newEvent.save()
  
  // Fetch the newly created event with populated fields
  const populatedEvent = await Event.findById(newEvent._id)
    .populate('registeredUsers', 'name email')
    .populate('createdBy', 'name email')
    
  revalidatePath('/admin/events')
  return JSON.parse(JSON.stringify(populatedEvent))
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