// app/dashboard/tables.tsx
"use client";

import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BookingData, EventData, TeeTimeData, TableProps } from "./types";

export const BookingsTable: React.FC<{ bookings: BookingData[] }> = ({
  bookings,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Players</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking._id}>
            <TableCell>
              {format(new Date(booking.teeTime.date), "MMM dd, yyyy")}
            </TableCell>
            <TableCell>{booking.teeTime.time}</TableCell>
            <TableCell>{booking.players}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const EventsTable: React.FC<{ events: EventData[] }> = ({ events }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Event</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Time</TableHead>
        <TableHead>Description</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {events.map((event) => (
        <TableRow key={event._id}>
          <TableCell className="font-medium">{event.title}</TableCell>
          <TableCell>{format(new Date(event.date), "MMM dd, yyyy")}</TableCell>
          <TableCell>{`${event.startTime} - ${event.endTime}`}</TableCell>
          <TableCell className="max-w-md truncate">
            {event.description}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export const TeeTimesTable: React.FC<{ teeTimes: TeeTimeData[] }> = ({
  teeTimes,
}) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Date</TableHead>
        <TableHead>Time</TableHead>
        <TableHead>Available Slots</TableHead>
        <TableHead>Price</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {teeTimes.map((teeTime) => (
        <TableRow key={teeTime._id}>
          <TableCell>{format(new Date(teeTime.date), "MMM dd, yyyy")}</TableCell>
          <TableCell>{teeTime.time}</TableCell>
          <TableCell>{teeTime.availableSlots}</TableCell>
          <TableCell>${teeTime.price}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);