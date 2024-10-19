// app/admin/bookings/BookingList.tsx
'use client';

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteBooking, addBooking, updateBooking } from "./actions";

interface Booking {
  _id: string;
  user: { name: string };
  teeTime: { date: string; time: string };
  players: number;
  status: string;
}

interface BookingListProps {
  initialBookings: Booking[];
}

export default function BookingList({ initialBookings }: BookingListProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      setIsLoading(true);
      try {
        await deleteBooking(id);
        setBookings(bookings.filter(booking => booking._id !== id));
      } catch (err) {
        console.error(err);
        setError("Failed to delete booking");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const bookingData = {
      user: formData.get('user'),
      teeTime: formData.get('teeTime'),
      players: Number(formData.get('players')),
    };

    try {
      const newBooking = await addBooking(bookingData);
      setBookings([...bookings, newBooking]);
      // Close the dialog (you might need to implement this logic)
    } catch (err) {
      console.error(err);
      setError("Failed to add booking");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingBooking) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const bookingData = {
      user: formData.get('user'),
      teeTime: formData.get('teeTime'),
      players: Number(formData.get('players')),
      status: formData.get('status'),
    };

    try {
      const updatedBooking = await updateBooking(editingBooking._id, bookingData);
      setBookings(bookings.map(booking => 
        booking._id === updatedBooking._id ? updatedBooking : booking
      ));
      setEditingBooking(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update booking");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">Add New Booking</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Booking</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddBooking} className="space-y-4">
            <div>
              <Label htmlFor="user">User</Label>
              <Input id="user" name="user" placeholder="User Name" />
            </div>
            <div>
              <Label htmlFor="teeTime">Tee Time</Label>
              <Input id="teeTime" name="teeTime" type="datetime-local" />
            </div>
            <div>
              <Label htmlFor="players">Number of Players</Label>
              <Input id="players" name="players" type="number" min="1" max="4" />
            </div>
            <Button type="submit">Add Booking</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingBooking} onOpenChange={(open) => !open && setEditingBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
          </DialogHeader>
          {editingBooking && (
            <form onSubmit={handleUpdateBooking} className="space-y-4">
              <div>
                <Label htmlFor="edit-user">User</Label>
                <Input id="edit-user" name="user" defaultValue={editingBooking.user.name} />
              </div>
              <div>
                <Label htmlFor="edit-teeTime">Tee Time</Label>
                <Input 
                  id="edit-teeTime" 
                  name="teeTime" 
                  type="datetime-local" 
                  defaultValue={`${editingBooking.teeTime.date}T${editingBooking.teeTime.time}`} 
                />
              </div>
              <div>
                <Label htmlFor="edit-players">Number of Players</Label>
                <Input 
                  id="edit-players" 
                  name="players" 
                  type="number" 
                  min="1" 
                  max="4" 
                  defaultValue={editingBooking.players} 
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Input id="edit-status" name="status" defaultValue={editingBooking.status} />
              </div>
              <Button type="submit">Update Booking</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Players</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking._id}>
              <TableCell>{booking.user.name}</TableCell>
              <TableCell>
                {booking.teeTime && booking.teeTime.date
                  ? new Date(booking.teeTime.date).toLocaleDateString()
                  : "N/A"}
              </TableCell>
              <TableCell>
                {booking.teeTime && booking.teeTime.time || "N/A"}
              </TableCell>
              <TableCell>{booking.players}</TableCell>
              <TableCell>{booking.status}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => setEditingBooking(booking)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(booking._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}