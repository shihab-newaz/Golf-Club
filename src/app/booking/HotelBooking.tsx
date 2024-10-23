import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
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
import { fetchAvailableRooms, bookTeeTime } from "./actions";
import { TeeTimeBooking } from "./types";

interface HotelRoom {
  _id: string;
  roomNumber: string;
  type: "standard" | "deluxe" | "suite";
  capacity: number;
  pricePerNight: number;
  amenities?: string[];
  description?: string;
}

interface HotelBookingFormProps {
  teeTimeBooking: TeeTimeBooking;
  onBack: () => void;
}

const inputStyles =
  "border-[1.5px] border-black dark:border-white focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black dark:focus-visible:border-white";

const calendarStyles =
  "rounded-md border-[1.5px] border-black dark:border-white w-[240px] xxs:w-[240px] xs:w-[280px] sm:w-[300px] md:w-[330px] lg:w-[330px]";

export function HotelBookingForm({ teeTimeBooking, onBack }: HotelBookingFormProps) {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();
  const [hotelRoomId, setHotelRoomId] = useState<string>("");
  const [availableRooms, setAvailableRooms] = useState<HotelRoom[]>([]);
  const { toast } = useToast();
  const { data: session } = useSession();

  const fetchRooms = useCallback(async (checkIn: Date, checkOut: Date) => {
    try {
      const rooms = await fetchAvailableRooms(
        checkIn.toISOString(),
        checkOut.toISOString()
      );
      setAvailableRooms(rooms);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch available rooms",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      fetchRooms(checkInDate, checkOutDate);
    }
  }, [checkInDate, checkOutDate, fetchRooms]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast({
        title: "Authentication Error",
        description: "Please login to complete your booking",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await bookTeeTime({
        teeTimeBooking: {
          ...teeTimeBooking,
          userId: session.user.id,
        },
        hotelBooking:
          hotelRoomId && checkInDate && checkOutDate
            ? {
                roomId: hotelRoomId,
                checkInDate,
                checkOutDate,
              }
            : undefined,
      });

      toast({
        title: "Booking Complete",
        description: result.message,
      });
    } catch (error) {
      toast({
        title: "Booking Error",
        description:
          error instanceof Error ? error.message : "Failed to complete booking",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full md:w-2/3 max-w-4xl mx-auto px-2 xxs:px-4 sm:px-6 lg:px-8"
    >
      <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader className="space-y-4 p-4 sm:p-6">
          <div className="flex flex-col xxs:flex-row gap-3 justify-between items-start xxs:items-center">
            <div className="space-y-1.5">
              <CardTitle className="text-lg sm:text-xl">Complete Your Booking</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Add a room to your tee time booking (Optional)
              </CardDescription>
            </div>
            <Button
              variant="outline"
              className={`${inputStyles} text-xs sm:text-sm py-1 px-2`}
              onClick={onBack}
              type="button"
            >
              Back to Tee Time
            </Button>
          </div>

          <div className="mt-2 p-2 xxs:p-3 sm:p-4 border-[1.5px] border-black dark:border-white rounded-md">
            <h3 className="font-medium mb-2 text-sm sm:text-base">Tee Time Booking Summary</h3>
            <div className="space-y-1 text-xs sm:text-sm">
              <p>Date: {teeTimeBooking.date.toLocaleDateString()}</p>
              <p>Time: {teeTimeBooking.time}</p>
              <p>Players: {teeTimeBooking.players}</p>
              <p>Phone: {teeTimeBooking.phoneNumber}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 xxs:p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Check-in Date</Label>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={setCheckInDate}
                  className={calendarStyles}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Check-out Date</Label>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={checkOutDate}
                  onSelect={setCheckOutDate}
                  className={calendarStyles}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Select Room</Label>
              <Select onValueChange={setHotelRoomId}>
                <SelectTrigger className={`${inputStyles} text-xs sm:text-sm`}>
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.map((room) => (
                    <SelectItem 
                      key={room._id} 
                      value={room._id}
                      className="text-xs sm:text-sm"
                    >
                      {`${room.roomNumber} - ${room.type} (${room.capacity} person${
                        room.capacity > 1 ? "s" : ""
                      }) - $${room.pricePerNight}/night`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {hotelRoomId && (
              <div className="space-y-2 border-[1.5px] border-black dark:border-white p-2 xxs:p-3 sm:p-4 rounded-md">
                <Label className="text-sm sm:text-base">Room Details</Label>
                {availableRooms.find((room) => room._id === hotelRoomId)?.description && (
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    {availableRooms.find((room) => room._id === hotelRoomId)?.description}
                  </p>
                )}
                {availableRooms.find((room) => room._id === hotelRoomId)?.amenities && (
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    Amenities:{" "}
                    {availableRooms
                      .find((room) => room._id === hotelRoomId)
                      ?.amenities?.join(", ")}
                  </p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base mt-4"
            >
              Complete Booking
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}