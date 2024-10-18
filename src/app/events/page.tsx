// app/events/page.tsx
import { Suspense } from "react";
import EventsList from "./EventsList";
import EventsHero from "./EventsHero";
import dbConnect from "@/lib/mongoose";
import Event from "@/models/Event";
import { Types } from "mongoose";

interface LeanEvent {
  _id: Types.ObjectId;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  imageUrl: string;
}

async function getEvents() {
  await dbConnect();
  const events = await Event.find({}).lean().exec();// Fetch all events
  return events.map((event) => {
    const typedEvent = event as LeanEvent;
    const eventDate = new Date(typedEvent.date);

    // Format date
    const formattedDate = eventDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return {
      id: typedEvent._id.toString(),
      title: typedEvent.title,
      date: formattedDate,
      time: `${typedEvent.startTime} - ${typedEvent.endTime}`,
      image: typedEvent.imageUrl,
    };
  });
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="flex flex-col min-h-screen">
      <EventsHero />
      <section className="w-full py-16 sm:py-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div>Loading events...</div>}>
            <EventsList events={events} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}