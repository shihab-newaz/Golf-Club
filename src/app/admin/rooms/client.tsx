// app/admin/hotel-rooms/client.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addHotelRoom, updateHotelRoom, deleteHotelRoom } from "./actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import HotelRoomDetailsDialog from "./details";

interface HotelRoom {
  _id: string;
  roomNumber: string;
  type: "standard" | "deluxe" | "suite";
  capacity: number;
  pricePerNight: number;
  isAvailable: boolean;
}

interface HotelRoomListProps {
  initialRooms: HotelRoom[];
}

export default function HotelRoomList({ initialRooms }: HotelRoomListProps) {
  const [rooms, setRooms] = useState<HotelRoom[]>(initialRooms);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingRoom, setEditingRoom] = useState<HotelRoom | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      setIsLoading(true);
      try {
        await deleteHotelRoom(id);
        setRooms(rooms.filter((room) => room._id !== id));
      } catch (err) {
        console.error(err);
        setError("Failed to delete room");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const roomData = {
      roomNumber: formData.get("roomNumber"),
      type: formData.get("type"),
      capacity: Number(formData.get("capacity")),
      pricePerNight: Number(formData.get("pricePerNight")),
      isAvailable: formData.get("isAvailable") === "true",
    };

    try {
      const newRoom = await addHotelRoom(roomData);
      setRooms([...rooms, newRoom]);
      // Close the dialog (you might need to implement this logic)
    } catch (err) {
      console.error(err);
      setError("Failed to add room");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingRoom) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const roomData = {
      roomNumber: formData.get("roomNumber"),
      type: formData.get("type"),
      capacity: Number(formData.get("capacity")),
      pricePerNight: Number(formData.get("pricePerNight")),
      isAvailable: formData.get("isAvailable") === "true",
    };

    try {
      const updatedRoom = await updateHotelRoom(editingRoom._id, roomData);
      setRooms(
        rooms.map((room) => (room._id === updatedRoom._id ? updatedRoom : room))
      );
      setEditingRoom(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update room");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Add new room dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">Add New Room</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddRoom} className="space-y-4">
            <div>
              <Label htmlFor="roomNumber">Room Number</Label>
              <Input id="roomNumber" name="roomNumber" required />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select name="type">
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                required
              />
            </div>
            <div>
              <Label htmlFor="pricePerNight">Price Per Night</Label>
              <Input
                id="pricePerNight"
                name="pricePerNight"
                type="number"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <Label htmlFor="isAvailable">Availability</Label>
              <Select name="isAvailable">
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Available</SelectItem>
                  <SelectItem value="false">Not Available</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Add Room</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Desktop view */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Price Per Night</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room._id}>
                <TableCell>{room.roomNumber}</TableCell>
                <TableCell>{room.type}</TableCell>
                <TableCell>{room.capacity}</TableCell>
                <TableCell>${room.pricePerNight}</TableCell>
                <TableCell>
                  {room.isAvailable ? "Available" : "Not Available"}
                </TableCell>
                <TableCell>
                  <HotelRoomDetailsDialog room={room} />

                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => setEditingRoom(room)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(room._id)}
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
        {rooms.map((room) => (
          <Card key={room._id}>
            <CardHeader>
              <CardTitle>Room {room.roomNumber}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Type:</strong> {room.type}
              </p>
              <p>
                <strong>Capacity:</strong> {room.capacity}
              </p>
              <p>
                <strong>Price Per Night:</strong> ${room.pricePerNight}
              </p>
              <p>
                <strong>Availability:</strong>{" "}
                {room.isAvailable ? "Available" : "Not Available"}
              </p>
              <div className="mt-4 space-x-2">
                <HotelRoomDetailsDialog room={room} />

                <Button variant="outline" onClick={() => setEditingRoom(room)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(room._id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit room dialog */}
      <Dialog
        open={!!editingRoom}
        onOpenChange={(open) => !open && setEditingRoom(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
          </DialogHeader>
          {editingRoom && (
            <form onSubmit={handleUpdateRoom} className="space-y-4">
              <div>
                <Label htmlFor="edit-roomNumber">Room Number</Label>
                <Input
                  id="edit-roomNumber"
                  name="roomNumber"
                  defaultValue={editingRoom.roomNumber}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-type">Type</Label>
                <Select name="type" defaultValue={editingRoom.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-capacity">Capacity</Label>
                <Input
                  id="edit-capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  defaultValue={editingRoom.capacity}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-pricePerNight">Price Per Night</Label>
                <Input
                  id="edit-pricePerNight"
                  name="pricePerNight"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={editingRoom.pricePerNight}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-isAvailable">Availability</Label>
                <Select
                  name="isAvailable"
                  defaultValue={editingRoom.isAvailable.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Available</SelectItem>
                    <SelectItem value="false">Not Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Update Room</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
