// app/actions/member/events.ts
import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { checkRole } from "../auth";
import  { Types } from "mongoose";
import Event from "@/models/Event";
import User from "@/models/User";

interface RegistrationResponse {
  success: boolean;
  message: string;
  isRegistered?: boolean;
}

export async function registerForEvent(eventId: string): Promise<RegistrationResponse> {
  try {
    await checkRole(["member"]);
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    await dbConnect();

    // Convert string IDs to ObjectIds
    const eventObjectId = new Types.ObjectId(eventId);
    const userObjectId = new Types.ObjectId(session.user.id);

    const event = await Event.findById(eventObjectId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Check if event is at capacity
    if (event.registeredUsers.length >= event.capacity) {
      return {
        success: false,
        message: "Event is already at full capacity",
        isRegistered: false
      };
    }

    // Check if user is already registered
    if (event.registeredUsers.some((id: Types.ObjectId) => id.equals(userObjectId))) {
      return {
        success: false,
        message: "You are already registered for this event",
        isRegistered: true
      };
    }

    // Start a session for the transaction
    const mongoSession = await Event.startSession();
    
    try {
      await mongoSession.withTransaction(async () => {
        // Add user to event's registered users
        await Event.findByIdAndUpdate(
          eventObjectId,
          { $push: { registeredUsers: userObjectId } },
          { session: mongoSession }
        );

        // Add event to user's events
        await User.findByIdAndUpdate(
          userObjectId,
          { $push: { events: eventObjectId } },
          { session: mongoSession }
        );
      });

      await mongoSession.endSession();
      
      revalidatePath('/events');
      revalidatePath(`/events/${eventId}`);
      revalidatePath('/dashboard');

      return {
        success: true,
        message: "Successfully registered for the event",
        isRegistered: true
      };
    } catch (error) {
      await mongoSession.endSession();
      throw error;
    }
  } catch (error) {
    console.error("Error registering for event:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to register for event",
      isRegistered: false
    };
  }
}

export async function unregisterFromEvent(eventId: string): Promise<RegistrationResponse> {
  try {
    await checkRole(["member"]);
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    await dbConnect();

    // Convert string IDs to ObjectIds
    const eventObjectId = new Types.ObjectId(eventId);
    const userObjectId = new Types.ObjectId(session.user.id);

    const event = await Event.findById(eventObjectId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Check if user is actually registered
    if (!event.registeredUsers.some((id: Types.ObjectId) => id.equals(userObjectId))) {
      return {
        success: false,
        message: "You are not registered for this event",
        isRegistered: false
      };
    }

    // Check if event date has passed
    const eventDate = new Date(event.date);
    if (eventDate < new Date()) {
      return {
        success: false,
        message: "Cannot unregister from past events",
        isRegistered: true
      };
    }

    // Start a session for the transaction
    const mongoSession = await Event.startSession();
    
    try {
      await mongoSession.withTransaction(async () => {
        // Remove user from event's registered users
        await Event.findByIdAndUpdate(
          eventObjectId,
          { $pull: { registeredUsers: userObjectId } },
          { session: mongoSession }
        );

        // Remove event from user's events
        await User.findByIdAndUpdate(
          userObjectId,
          { $pull: { events: eventObjectId } },
          { session: mongoSession }
        );
      });

      await mongoSession.endSession();
      
      revalidatePath('/events');
      revalidatePath(`/events/${eventId}`);
      revalidatePath('/dashboard');

      return {
        success: true,
        message: "Successfully unregistered from the event",
        isRegistered: false
      };
    } catch (error) {
      await mongoSession.endSession();
      throw error;
    }
  } catch (error) {
    console.error("Error unregistering from event:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to unregister from event",
      isRegistered: true
    };
  }
}

export async function checkEventRegistration(eventId: string): Promise<boolean> {
  try {
    await checkRole(["member"]);
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return false;
    }

    await dbConnect();

    // Convert string IDs to ObjectIds
    const eventObjectId = new Types.ObjectId(eventId);
    const userObjectId = new Types.ObjectId(session.user.id);

    const event = await Event.findById(eventObjectId);
    if (!event) {
      return false;
    }

    return event.registeredUsers.some((id: Types.ObjectId) => id.equals(userObjectId));
  } catch (error) {
    console.error("Error checking event registration:", error);
    return false;
  }
}