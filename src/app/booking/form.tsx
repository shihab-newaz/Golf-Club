// app/booking/form.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { fetchAvailableTimes } from './actions'
import { TeeTimeBooking, TeeTimeResponse } from './types'

interface BookingFormProps {
  onComplete: (bookingDetails: TeeTimeBooking) => void
}

export function BookingForm({ onComplete }: BookingFormProps) {
  const [timeSlots, setTimeSlots] = useState<TeeTimeResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [selectedTimeId, setSelectedTimeId] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [players, setPlayers] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const { toast } = useToast()

  // Group time slots by date
  const timeSlotsByDate = timeSlots.reduce((acc, slot) => {
    const date = slot.formattedDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, TeeTimeResponse[]>);

  // Fetch initial time slots
  useEffect(() => {
    const fetchInitialTimeSlots = async () => {
      setLoading(true);
      try {
        const response = await fetchAvailableTimes(1);
        setTimeSlots(response.data);
        setHasMore(response.hasMore);
        setCurrentPage(1);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch available tee times",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialTimeSlots();
  }, [toast]);

  // Load more time slots
  const loadMoreTimeSlots = async () => {
    try {
      const nextPage = currentPage + 1;
      const response = await fetchAvailableTimes(nextPage);
      
      setTimeSlots(prev => [...prev, ...response.data]);
      setHasMore(response.hasMore);
      setCurrentPage(nextPage);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load more time slots",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSlot = timeSlots.find(slot => slot._id === selectedTimeId);

    if (!selectedSlot) return;

    const bookingDetails: TeeTimeBooking = {
      teeTimeId: selectedTimeId,
      date: selectedSlot.date,
      time: selectedSlot.time,
      players: parseInt(players),
      phoneNumber: phoneNumber
    };

    onComplete(bookingDetails);
  };

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4 text-center">
        Loading available tee times...
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 mt-10">
      <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Reserve Your Tee Time</CardTitle>
          <CardDescription>
            Select from available dates and times
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date and Time Selection */}
            <div className="space-y-2">
              <Label className="text-base">Available Dates & Times</Label>
              <div className="space-y-4">
                {Object.entries(timeSlotsByDate).map(([date, slots]) => (
                  <div 
                    key={date}
                    className="p-4 border-2 rounded-lg border-gray-200 dark:border-gray-700"
                  >
                    <div className="font-medium mb-2">
                      {date}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {slots.map((slot) => (
                        <Button
                          key={slot._id}
                          type="button"
                          variant={selectedTimeId === slot._id ? "default" : "outline"}
                          className={`text-sm ${
                            selectedTimeId === slot._id
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'hover:border-green-500'
                          }`}
                          onClick={() => {
                            setSelectedTimeId(slot._id);
                            setSelectedTime(slot.time);
                          }}
                          disabled={slot.availableSlots === 0}
                        >
                          {slot.time} ({slot.availableSlots} slots)
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {hasMore && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4"
                  onClick={loadMoreTimeSlots}
                >
                  Load More Times
                </Button>
              )}
            </div>

            {/* Players Selection */}
            <div className="space-y-2">
              <Label htmlFor="players">Number of Players</Label>
              <Select value={players} onValueChange={setPlayers}>
                <SelectTrigger id="players" className="border-2 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Select players" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Player{num > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border-2 border-gray-200 dark:border-gray-700"
                placeholder="Enter your phone number"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={!selectedTimeId || !players || !phoneNumber}
            >
              Book Tee Time
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}