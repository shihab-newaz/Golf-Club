// app/events/actions.ts
"use server";

import dbConnect from "@/lib/mongoose";
import Event from "@/models/Event";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { Types } from "mongoose";

interface EventDetails {
  _id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  registeredUsers: string[];
  createdBy: string;
  imageUrl: string;
}

// Type for the raw MongoDB document
interface EventDocument {
  _id: Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  capacity: number;
  registeredUsers: Types.ObjectId[];
  createdBy: {
    _id: Types.ObjectId;
    name: string;
  };
  imageUrl: string;
}

export const getEvent = cache(
  async (id: string): Promise<EventDetails | null> => {
    try {
      await dbConnect();

      const event = (await Event.findById(id)
        .populate("createdBy", "name")
        .lean()) as EventDocument | null;

      if (!event) return null;

      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Transform the MongoDB document to match EventDetails interface
      const transformedEvent: EventDetails = {
        _id: event._id.toString(),
        title: event.title,
        description: event.description,
        date: formattedDate,
        startTime: event.startTime,
        endTime: event.endTime,
        capacity: event.capacity,
        registeredUsers: event.registeredUsers.map((id) => id.toString()),
        createdBy: event.createdBy._id.toString(),
        imageUrl: event.imageUrl,
      };

      return transformedEvent;
    } catch (error) {
      console.error("Error fetching event:", error);
      return null;
    }
  }
);

export async function registerForEvent(eventId: string, userId: string) {
  try {
    await dbConnect();

    const event = await Event.findById(eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    if (event.registeredUsers.length >= event.capacity) {
      throw new Error("Event is full");
    }

    const userObjectId = new Types.ObjectId(userId);

    if (
      event.registeredUsers.some((id: Types.ObjectId) =>
        id.equals(userObjectId)
      )
    ) {
      throw new Error("Already registered for this event");
    }
    event.registeredUsers.push(userObjectId);
    await event.save();

    revalidatePath(`/events/${eventId}`);
    return true;
  } catch (error) {
    console.error("Error registering for event:", error);
    throw error;
  }
}

export async function unregisterFromEvent(eventId: string, userId: string) {
  try {
    await dbConnect();

    const event = await Event.findById(eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    const userObjectId = new Types.ObjectId(userId);

    event.registeredUsers = event.registeredUsers.filter(
      (id: Types.ObjectId) => !id.equals(userObjectId)
    );

    await event.save();

    revalidatePath(`/events/${eventId}`);
    return true;
  } catch (error) {
    console.error("Error unregistering from event:", error);
    throw error;
  }
}
