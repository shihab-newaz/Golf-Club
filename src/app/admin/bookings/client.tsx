// app/admin/bookings/page.tsx
"use client";
import React, { useState } from "react";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteBooking, addBooking, updateBooking } from "./actions";
import BookingDetailsDialog from "./details";

interface Room {
  _id: string;
  roomNumber: string;
}

interface User {
  _id: string;
  name: string;
}

interface TeeTime {
  _id: string;
  date: string;
  time: string;
}
interface Booking {
  _id: string;
  user: User;
  teeTime: TeeTime;
  room?: Room;
  phoneNumber: string;
  players: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  available: boolean;
  checkInDate?: string;
  checkOutDate?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingListProps {
  initialBookings: Booking[];
  users: { _id: string; name: string }[];
  teeTimes: { _id: string; date: string; time: string }[];
  resortRooms: { _id: string; roomNumber: string }[];
}

export default function BookingList({
  initialBookings,
  users,
  teeTimes,
  resortRooms,
}: BookingListProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      setIsLoading(true);
      try {
        await deleteBooking(id);
        setBookings(bookings.filter((booking) => booking._id !== id));
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
      user: formData.get("user"),
      teeTime: formData.get("teeTime"),
      resortRoom: formData.get("resortRoom"),
      phoneNumber: formData.get("phoneNumber"),
      players: Number(formData.get("players")),
      status: formData.get("status"),
      available: formData.get("available") === "true",
      expiresAt: formData.get("expiresAt"),
      checkInDate: formData.get("checkInDate"),
      checkOutDate: formData.get("checkOutDate"),
      createdAt:formData.get("createdAt"),
      updatedAt:formData.get("updatedAt"),
    };

    try {
      const newBooking = await addBooking(bookingData);
      setBookings([...bookings, newBooking]);
      // Close the dialog
    } catch (err) {
      console.error(err);
      setError("Failed to add booking");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBooking = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!editingBooking) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const bookingData = {
      user: formData.get("user"),
      teeTime: formData.get("teeTime"),
      resortRoom: formData.get("resortRoom"),
      phoneNumber: formData.get("phoneNumber"),
      players: Number(formData.get("players")),
      status: formData.get("status"),
      available: formData.get("available") === "true",
      expiresAt: formData.get("expiresAt"),
      checkInDate: formData.get("checkInDate"),
      checkOutDate: formData.get("checkOutDate"),
      createdAt:formData.get("createdAt"),
      updatedAt:formData.get("updatedAt"),
      
    };

    try {
      const updatedBooking = await updateBooking(
        editingBooking._id,
        bookingData
      );
      setBookings(
        bookings.map((booking) =>
          booking._id === updatedBooking._id ? updatedBooking : booking
        )
      );
      setEditingBooking(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update booking");
    } finally {
      setIsLoading(false);
    }
  };

  if (!users || !teeTimes || !resortRooms || isLoading) {
    return <div>Loading data...</div>;
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Add booking dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4 bg-button text-white">Add New Booking</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Booking</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddBooking} className="space-y-4">
            <div>
              <Label htmlFor="user">User</Label>
              <Select name="user">
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="teeTime">Tee Time</Label>
              <Select name="teeTime">
                <SelectTrigger>
                  <SelectValue placeholder="Select a tee time" />
                </SelectTrigger>
                <SelectContent>
                  {teeTimes.map((teeTime) => (
                    <SelectItem key={teeTime._id} value={teeTime._id}>
                      {`${new Date(teeTime.date).toLocaleDateString()} ${
                        teeTime.time
                      }`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="resortRoom">Resort Room (Optional)</Label>
              <Select name="resortRoom">
                <SelectTrigger>
                  <SelectValue placeholder="Select a resort room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No room</SelectItem>
                  {resortRooms.map((room) => (
                    <SelectItem key={room._id} value={room._id}>
                      {room.roomNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" name="phoneNumber" type="tel" required />
            </div>
            <div>
              <Label htmlFor="players">Number of Players</Label>
              <Input
                id="players"
                name="players"
                type="number"
                min="1"
                max="4"
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select name="status">
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expiresAt">Expires At</Label>
              <Input
                id="expiresAt"
                name="expiresAt"
                type="datetime-local"
                defaultValue={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>

            <div>
              <Label htmlFor="checkInDate">Check-in Date (Optional)</Label>
              <Input id="checkInDate" name="checkInDate" type="date" />
            </div>
            <div>
              <Label htmlFor="checkOutDate">Check-out Date (Optional)</Label>
              <Input id="checkOutDate" name="checkOutDate" type="date" />
            </div>
            <Button type="submit">Add Booking</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit booking dialog */}
      <Dialog
        open={!!editingBooking}
        onOpenChange={(open) => !open && setEditingBooking(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
          </DialogHeader>
          {editingBooking && (
            <form onSubmit={handleUpdateBooking} className="space-y-4">
              <div>
                <Label htmlFor="edit-user">User</Label>
                <Select name="user" defaultValue={editingBooking.user._id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-teeTime">Tee Time</Label>
                <Select
                  name="teeTime"
                  defaultValue={editingBooking.teeTime._id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tee time" />
                  </SelectTrigger>
                  <SelectContent>
                    {teeTimes.map((teeTime) => (
                      <SelectItem key={teeTime._id} value={teeTime._id}>
                        {`${new Date(teeTime.date).toLocaleDateString()} ${
                          teeTime.time
                        }`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-resortRoom">Resort Room (Optional)</Label>
                <Select
                  name="resortRoom"
                  defaultValue={editingBooking.room?._id || "none"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a resort room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No room</SelectItem>
                    {resortRooms.map((room) => (
                      <SelectItem key={room._id} value={room._id}>
                        {room.roomNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-phoneNumber">Phone Number</Label>
                <Input
                  id="edit-phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  defaultValue={editingBooking.phoneNumber}
                  required
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
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select name="status" defaultValue={editingBooking.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="expiresAt">Expires At</Label>
                <Input
                  id="expiresAt"
                  name="expiresAt"
                  type="datetime-local"
                  defaultValue={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-checkInDate">
                  Check-in Date (Optional)
                </Label>
                <Input
                  id="edit-checkInDate"
                  name="checkInDate"
                  type="date"
                  defaultValue={editingBooking.checkInDate}
                />
              </div>
              <div>
                <Label htmlFor="edit-checkOutDate">
                  Check-out Date (Optional)
                </Label>
                <Input
                  id="edit-checkOutDate"
                  name="checkOutDate"
                  type="date"
                  defaultValue={editingBooking.checkOutDate}
                />
              </div>
              <Button type="submit">Update Booking</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Desktop view */}
      <div className="hidden md:block">
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
                <TableCell>{booking.user?.name}</TableCell>
                <TableCell>
                  {booking.teeTime && booking.teeTime.date
                    ? new Date(booking.teeTime.date).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {(booking.teeTime && booking.teeTime.time) || "N/A"}
                </TableCell>
                <TableCell>{booking.players}</TableCell>
                <TableCell>{booking.status}</TableCell>
                <TableCell>
                <BookingDetailsDialog booking={booking} />

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
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {bookings.map((booking) => (
          <Card key={booking._id}>
            <CardHeader>
              <CardTitle>{booking.user?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Date:{" "}
                {booking.teeTime && booking.teeTime.date
                  ? new Date(booking.teeTime.date).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>Time: {(booking.teeTime && booking.teeTime.time) || "N/A"}</p>
              <p>Players: {booking.players}</p>
              <p>Status: {booking.status}</p>
              <div className="mt-4 space-x-2">
              <BookingDetailsDialog booking={booking} />

                <Button
                  variant="outline"
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
