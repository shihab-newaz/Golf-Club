// app/booking/BookingForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/hooks/use-toast";

interface TeeTime {
  _id: string;
  time: string;
}

export default function BookingForm() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("");
  const [players, setPlayers] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<TeeTime[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (date) {
      fetchAvailableTimes(date);
    }
  }, [date]);

  const fetchAvailableTimes = async (selectedDate: Date) => {
    const response = await fetch(`/api/available-tee-times?date=${selectedDate.toISOString()}`);
    if (response.ok) {
      const data = await response.json();
      setAvailableTimes(data);
    } else {
      toast({
        title: "Error",
        description: "Failed to fetch available tee times",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time || !players) {
      toast({
        title: "Booking Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const bookingData = {
      date: date.toISOString(),
      time,
      players: parseInt(players),
    };

    const response = await fetch('/api/book-tee-time', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (response.ok) {
      toast({
        title: "Booking Submitted",
        description: "Your tee time has been booked successfully.",
      });
      // Refetch available times to update the list
      fetchAvailableTimes(date);
    } else {
      toast({
        title: "Booking Error",
        description: "Failed to book tee time. Please try again.",
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
          <CardTitle>Reserve Your Tee Time</CardTitle>
          <CardDescription>Select your preferred date and time</CardDescription>
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
              <div className="border border-gray-700 dark:border-white rounded-sm">
                <Select onValueChange={setTime}>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.map((teeTime) => (
                      <SelectItem key={teeTime._id} value={teeTime.time}>
                        {teeTime.time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="players">Number of Players</Label>
              <div className="border border-gray-700 dark:border-white rounded-sm">
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
            </div>
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