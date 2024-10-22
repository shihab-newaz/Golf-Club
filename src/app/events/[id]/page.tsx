// app/events/[id]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Users, ArrowLeft } from "lucide-react";
import { getEvent } from './actions';
import  RegistrationButton from './RegistrationButton';

interface EventPageProps {
  params: {
    id: string;
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEvent(params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/events">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Button>
          </Link>
        </div>

        <Card className="overflow-hidden bg-white dark:bg-gray-800">
          <div className="relative h-[400px] w-full">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                  {event.title}
                </h1>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Calendar className="w-5 h-5" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Clock className="w-5 h-5" />
                    <span>{event.startTime} - {event.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Users className="w-5 h-5" />
                    <span>{event.registeredUsers.length} / {event.capacity} registered</span>
                  </div>
                </div>
              </div>

              <Suspense 
                fallback={
                  <Button size="lg" disabled>
                    Loading...
                  </Button>
                }
              >
                <RegistrationButton 
                  event={event} 
                  className="bg-green-600 hover:bg-green-700 text-white"
                />
              </Suspense>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {event.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}