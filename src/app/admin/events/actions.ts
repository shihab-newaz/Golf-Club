// app/admin/events/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from "@/lib/mongoose"
import Event from "@/models/Event"

export async function getEvents() {
  await dbConnect()
  const events = await Event.find()
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
  revalidatePath('/admin/events')
  return JSON.parse(JSON.stringify(newEvent))
}

export async function updateEvent(id: string, eventData: any) {
  await dbConnect()
  const updatedEvent = await Event.findByIdAndUpdate(id, eventData, { new: true })
  revalidatePath('/admin/events')
  return JSON.parse(JSON.stringify(updatedEvent))
}