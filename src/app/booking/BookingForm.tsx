// app/booking/BookingForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { fetchAvailableTimes, fetchAvailableRooms, bookTeeTime } from "./actions";
import { useSession } from "next-auth/react";

interface TeeTime {
  _id: string;
  time: string;
}

interface HotelRoom {
  _id: string;
  roomNumber: string;
  type: "standard" | "deluxe" | "suite";
  capacity: number;
  pricePerNight: number;
  amenities?: string[];
  description?: string;
}

export default function BookingForm() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("");
  const [teeTimeId, setTeeTimeId] = useState<string>("");
  const [players, setPlayers] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [bookRoom, setBookRoom] = useState<boolean>(false);
  const [hotelRoomId, setHotelRoomId] = useState<string>("");
  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();
  const [availableTimes, setAvailableTimes] = useState<TeeTime[]>([]);
  const [availableRooms, setAvailableRooms] = useState<HotelRoom[]>([]);
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    if (date) {
      handleFetchAvailableTimes(date);
    }
  }, [date]);

  useEffect(() => {
    if (bookRoom && checkInDate && checkOutDate) {
      handleFetchAvailableRooms(checkInDate, checkOutDate);
    }
  }, [bookRoom, checkInDate, checkOutDate]);

  const handleFetchAvailableTimes = async (selectedDate: Date) => {
    try {
      const times = await fetchAvailableTimes(selectedDate.toISOString());
      setAvailableTimes(times);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch available tee times",
        variant: "destructive",
      });
    }
  };

  const handleFetchAvailableRooms = async (checkIn: Date, checkOut: Date) => {
    try {
      const rooms = await fetchAvailableRooms(checkIn.toISOString(), checkOut.toISOString());
      setAvailableRooms(rooms);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch available rooms",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !teeTimeId || !players || !phoneNumber || !session?.user?.id) {
      toast({
        title: "Booking Error",
        description: "Please fill in all required fields and ensure you're logged in",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await bookTeeTime({
        userId: session.user.id,
        teeTimeId,
        hotelRoomId: bookRoom ? hotelRoomId : undefined,
        phoneNumber,
        players: parseInt(players),
        checkInDate: checkInDate?.toISOString(),
        checkOutDate: checkOutDate?.toISOString(),
      });

      toast({
        title: "Booking Submitted",
        description: result.message,
      });
      
      // Reset form and refetch available times
      handleFetchAvailableTimes(date);
      setTime("");
      setTeeTimeId("");
      setPlayers("");
      setPhoneNumber("");
      setBookRoom(false);
      setHotelRoomId("");
      setCheckInDate(undefined);
      setCheckOutDate(undefined);
    } catch (error) {
      toast({
        title: "Booking Error",
        description: error instanceof Error ? error.message : "Failed to book. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Reserve Your Tee Time and Hotel Room</CardTitle>
          <CardDescription>Select your preferred date, time, and optional accommodation</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Select onValueChange={(value) => {
                const [id, time] = value.split('|');
                setTeeTimeId(id);
                setTime(time);
              }}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.map((teeTime) => (
                    <SelectItem key={teeTime._id} value={`${teeTime._id}|${teeTime.time}`}>
                      {teeTime.time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="players">Number of Players</Label>
              <Select onValueChange={setPlayers}>
                <SelectTrigger id="players">
                  <SelectValue placeholder="Select number of players" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Player</SelectItem>
                  <SelectItem value="2">2 Players</SelectItem>
                  <SelectItem value="3">3 Players</SelectItem>
                  <SelectItem value="4">4 Players</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="bookRoom"
                checked={bookRoom}
                onCheckedChange={(checked) => setBookRoom(checked as boolean)}
              />
              <Label htmlFor="bookRoom">Book a hotel room</Label>
            </div>
            {bookRoom && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="checkInDate">Check-in Date</Label>
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    className="rounded-md border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkOutDate">Check-out Date</Label>
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    className="rounded-md border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotelRoom">Hotel Room</Label>
                  <Select onValueChange={setHotelRoomId}>
                    <SelectTrigger id="hotelRoom">
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRooms.map((room) => (
                        <SelectItem key={room._id} value={room._id}>
                          {`${room.roomNumber} - ${room.type} (${room.capacity} person${room.capacity > 1 ? 's' : ''}) - $${room.pricePerNight}/night`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {hotelRoomId && (
                  <div className="space-y-2">
                    <Label>Room Details</Label>
                    {availableRooms.find(room => room._id === hotelRoomId)?.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {availableRooms.find(room => room._id === hotelRoomId)?.description}
                      </p>
                    )}
                    {availableRooms.find(room => room._id === hotelRoomId)?.amenities && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Amenities: {availableRooms.find(room => room._id === hotelRoomId)?.amenities?.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Book Now
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}