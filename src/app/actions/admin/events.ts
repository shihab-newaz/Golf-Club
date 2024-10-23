// app/admin/events/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/mongoose";
import { checkRole, handleAuthError } from "../auth";
import Event, { IEvent } from "@/models/Event";



export async function getEvents() {
  try {
    await dbConnect();
    const events = await Event.find();
    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    return handleAuthError(error);
  }
}
export async function getEventById(id: string): Promise<IEvent | null> {
  try {
    await dbConnect();
    
    const event = await Event.findById(id);
    if (!event) {
      throw new Error("Event not found");
    }
    
    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}
export async function deleteEvent(id: string) {
  try {
    await checkRole(["admin"]);
    await dbConnect();
    await Event.findByIdAndDelete(id);
    revalidatePath("/admin/events");
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function addEvent(eventData: any) {
  try {
    await checkRole(["admin"]);
    await dbConnect();
    const newEvent = new Event(eventData);
    await newEvent.save();
    revalidatePath("/admin/events");
    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function updateEvent(id: string, eventData: any) {
  try {
    await checkRole(["admin"]);
    await dbConnect();
    const updatedEvent = await Event.findByIdAndUpdate(id, eventData, {
      new: true,
    });
    revalidatePath("/admin/events");
    return JSON.parse(JSON.stringify(updatedEvent));
  } catch (error) {
    return handleAuthError(error);
  }
}
