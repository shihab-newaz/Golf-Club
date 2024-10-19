// app/admin/events/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getEvents, deleteEvent, addEvent, updateEvent } from "./actions";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
}

interface AdminEventsPageProps {
  initialEvents: Event[];
}

export default function AdminEventsPage({ initialEvents }: AdminEventsPageProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setIsLoading(true);
      try {
        await deleteEvent(id);
        setEvents(events.filter(event => event._id !== id));
      } catch (err) {
        console.error(err);
        setError('Failed to delete event');
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
      setError('Failed to add event');
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
      setEvents(events.map(event => 
        event._id === updatedEvent._id ? updatedEvent : event
      ));
      setEditingEvent(null);
    } catch (err) {
      console.error(err);
      setError('Failed to update event');
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
          <Button className="mb-4">Add New Event</Button>
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
      <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <form onSubmit={handleUpdateEvent} className="space-y-4">
              {/* Similar form fields as Add Event, but with defaultValue set to editingEvent properties */}
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event._id}>
              <TableCell>{event.title}</TableCell>
              <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
              <TableCell>{`${event.startTime} - ${event.endTime}`}</TableCell>
              <TableCell>{event.capacity}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2" onClick={() => setEditingEvent(event)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(event._id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}