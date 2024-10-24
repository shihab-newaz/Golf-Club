// app/events/[id]/actions.ts
"use server";

import dbConnect from "@/lib/mongoose";
import Event from "@/models/Event";
import User from "@/models/User";
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
  availableSpots: number;
  registeredUsers: string[];
  createdBy: string;
  imageUrl: string;
}

interface EventDocument {
  _id: Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  capacity: number;
  availableSpots: number;
  registeredUsers: Types.ObjectId[];
  createdBy: Types.ObjectId;
  imageUrl: string;
}

export const getEvent = cache(async (id: string): Promise<EventDetails | null> => {
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

    const transformedEvent: EventDetails = {
      _id: event._id.toString(),
      title: event.title,
      description: event.description,
      date: formattedDate,
      startTime: event.startTime,
      endTime: event.endTime,
      capacity: event.capacity,
      availableSpots: event.capacity - event.registeredUsers.length,
      registeredUsers: event.registeredUsers.map((id) => id.toString()),
      createdBy: event.createdBy.toString(),
      imageUrl: event.imageUrl,
    };

    return transformedEvent;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
});

export async function registerForEvent(eventId: string, userId: string) {
  try {
    await dbConnect();

    const [event, user] = await Promise.all([
      Event.findById(eventId),
      User.findById(userId)
    ]);

    if (!event) {
      throw new Error("Event not found");
    }

    if (!user) {
      throw new Error("User not found");
    }

    if (event.registeredUsers.length >= event.capacity) {
      throw new Error("Event is full");
    }

    const userObjectId = new Types.ObjectId(userId);
    const eventObjectId = new Types.ObjectId(eventId);

    if (
      event.registeredUsers.some((id: Types.ObjectId) =>
        id.equals(userObjectId)
      )
    ) {
      throw new Error("Already registered for this event");
    }

    // Update both event and user
    event.registeredUsers.push(userObjectId);
    event.availableSpots = event.capacity - event.registeredUsers.length;
    user.events.push(eventObjectId);

    await Promise.all([
      event.save(),
      user.save()
    ]);

    revalidatePath(`/events/${eventId}`);
    revalidatePath('/dashboard'); // Revalidate dashboard if it shows user's events
    return true;
  } catch (error) {
    console.error("Error registering for event:", error);
    throw error;
  }
}

export async function unregisterFromEvent(eventId: string, userId: string) {
  try {
    await dbConnect();

    const [event, user] = await Promise.all([
      Event.findById(eventId),
      User.findById(userId)
    ]);

    if (!event) {
      throw new Error("Event not found");
    }

    if (!user) {
      throw new Error("User not found");
    }

    const userObjectId = new Types.ObjectId(userId);
    const eventObjectId = new Types.ObjectId(eventId);

    // Remove user from event and event from user
    event.registeredUsers = event.registeredUsers.filter(
      (id: Types.ObjectId) => !id.equals(userObjectId)
    );
    event.availableSpots = event.capacity - event.registeredUsers.length;

    user.events = user.events.filter(
      (id: Types.ObjectId) => !id.equals(eventObjectId)
    );

    await Promise.all([
      event.save(),
      user.save()
    ]);

    revalidatePath(`/events/${eventId}`);
    revalidatePath('/dashboard');
    return true;
  } catch (error) {
    console.error("Error unregistering from event:", error);
    throw error;
  }
}