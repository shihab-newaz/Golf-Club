// app/admin/events/EventClient.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {  deleteEvent, addEvent, updateEvent } from "./actions";
import EventDetailsDialog from './details';

interface User {
  _id: string;
  name: string;
  email: string;
}
interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  registeredUsers: User[];
  createdBy: User;
  imageUrl: string;
}

interface AdminEventsPageProps {
  initialEvents: Event[];
}

export default function AdminEventsPage({
  initialEvents,
}: AdminEventsPageProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);


  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setIsLoading(true);
      try {
        await deleteEvent(id);
        setEvents(events.filter((event) => event._id !== id));
      } catch (err) {
        console.error(err);
        setError("Failed to delete event");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddEvent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const eventData = Object.fromEntries(formData.entries());

    try {
      const newEvent = await addEvent(eventData);
      setEvents([...events, newEvent]);
      setIsAddEventOpen(false);
    } catch (err) {
      console.error(err);
      setError("Failed to add event");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEvent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingEvent) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const eventData = Object.fromEntries(formData.entries());

    try {
      const updatedEvent = await updateEvent(editingEvent._id, eventData);
      setEvents(
        events.map((event) =>
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );
      setEditingEvent(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update event");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Events</h1>
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4 bg-button text-white">Add New Event</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEvent} className="space-y-4">
            {/* Form fields remain the same */}
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!editingEvent}
        onOpenChange={(open) => !open && setEditingEvent(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <form onSubmit={handleUpdateEvent} className="space-y-4">
              {/* Form fields for editing */}
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-background-alt">
              <TableHead className="text-foreground-alt">Title</TableHead>
              <TableHead className="text-foreground-alt">Date</TableHead>
              <TableHead className="text-foreground-alt">Time</TableHead>
              <TableHead className="text-foreground-alt">Capacity</TableHead>
              <TableHead className="text-foreground-alt">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event._id} className="border-b border-border">
                <TableCell className="font-medium text-foreground">
                  {event.title}
                </TableCell>
                <TableCell className="text-foreground-alt">
                  {new Date(event.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-foreground-alt">{`${event.startTime} - ${event.endTime}`}</TableCell>
                <TableCell className="text-foreground-alt">
                  {event.capacity}
                </TableCell>
                <TableCell>
                <EventDetailsDialog event={event} />

                  <Button
                    variant="outline"
                    className="text-accent-foreground bg-accent mr-2"
                    onClick={() => setEditingEvent(event)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(event._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {events.map((event) => (
          <Card key={event._id}>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Time: {`${event.startTime} - ${event.endTime}`}</p>
              <p>Capacity: {event.capacity}</p>
              <div className="mt-4 space-x-2">
              <EventDetailsDialog event={event} />

                <Button
                  variant="outline"
                  className="text-accent-foreground bg-accent"
                  onClick={() => setEditingEvent(event)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(event._id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}