// app/events/EventsList.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  date: string;
  image: string;
}

interface EventsListProps {
  events: Event[];
}

const EventsList: React.FC<EventsListProps> = ({ events }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
    {events.map((event, index) => (
      <motion.div
        key={event.id}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card className="group overflow-hidden bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-80 backdrop-blur-sm transition-all duration-300 hover:bg-opacity-100 dark:hover:bg-opacity-100 hover:shadow-xl">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={`${event.image}`}
              alt={event.title}
              fill
              style={{ objectFit: "cover" }}
              sizes='(100vw, 100vh)'
              className="group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <CardContent className="p-4 space-y-2">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">{event.title}</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{event.date}</p>
            <Button asChild className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white transition-colors duration-300">
              <Link href={`/events/${event.id}`}>
                Learn More
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
);

export default EventsList;