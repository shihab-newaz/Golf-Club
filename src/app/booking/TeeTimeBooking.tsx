import React, { useState, useEffect, useCallback } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { fetchAvailableTimes } from "./actions";
import { TeeTimeBooking } from "./types";

interface TeeTimeBookingFormProps {
  onComplete: (bookingDetails: TeeTimeBooking) => void;
}

const inputStyles =
  "border-[1.5px] border-black dark:border-white focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black dark:focus-visible:border-white";
const calendarStyles =
  "rounded-md border-[1.5px] border-black dark:border-white";

export function TeeTimeBookingForm({ onComplete }: TeeTimeBookingFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("");
  const [teeTimeId, setTeeTimeId] = useState<string>("");
  const [players, setPlayers] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<TeeTimeBooking[]>([]);
  const { toast } = useToast();

  const fetchTimes = useCallback(
    async (selectedDate: Date) => {
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
    },
    [toast]
  );

  useEffect(() => {
    if (date) {
      fetchTimes(date);
    }
  }, [date, fetchTimes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !teeTimeId || !players || !phoneNumber) {
      toast({
        title: "Booking Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onComplete({
      _id: teeTimeId,
      teeTimeId: teeTimeId,
      date: date,
      time: time,
      players: parseInt(players),
      phoneNumber: phoneNumber,
      available: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
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
                className={calendarStyles}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Select
                onValueChange={(value) => {
                  const [id, time] = value.split("|");
                  setTeeTimeId(id);
                  setTime(time);
                }}
              >
                <SelectTrigger id="time" className={inputStyles}>
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent className={inputStyles}>
                  {availableTimes.map((teeTime) => (
                    <SelectItem
                      key={teeTime._id}
                      value={`${teeTime._id}|${teeTime.time}`}
                    >
                      {teeTime.time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="players">Number of Players</Label>
              <Select onValueChange={setPlayers}>
                <SelectTrigger id="players" className={inputStyles}>
                  <SelectValue placeholder="Select number of players" />
                </SelectTrigger>
                <SelectContent className={inputStyles}>
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
                className={inputStyles}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Book Tee Time
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
