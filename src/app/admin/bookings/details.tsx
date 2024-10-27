import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Users, Phone, Hotel, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

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

interface BookingDetailsDialogProps {
  booking: Booking;
}

const BookingDetailsDialog: React.FC<BookingDetailsDialogProps> = ({ booking }) => {
  // Format date to local string with time
  const formatDateTime = (date: string): string => {
    return new Date(date).toLocaleString();
  };

  // Get status color based on booking status
  const getStatusColor = (status: Booking['status']): string => {
    const statusColors: Record<Booking['status'], string> = {
      pending: 'text-yellow-500',
      confirmed: 'text-green-500',
      cancelled: 'text-red-500',
      completed: 'text-blue-500'
    };
    return statusColors[status];
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          See More
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            Booking Details
            <span className={`text-sm ${getStatusColor(booking.status)}`}>
              ({booking.status.charAt(0).toUpperCase() + booking.status.slice(1)})
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* User Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">User Information</h3>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Name:</span> {booking.user?.name}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">Phone:</span> {booking.phoneNumber}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tee Time Details */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Tee Time</h3>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span className="font-medium">Date:</span>
                  {new Date(booking.teeTime.date).toLocaleDateString()}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Time:</span> {booking.teeTime.time}
                </p>
                <p className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Players:</span> {booking.players}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Room Details (if available) */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Accommodation</h3>
              {booking.room ? (
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <Hotel className="h-4 w-4" />
                    <span className="font-medium">Room:</span> {booking.room.roomNumber}
                  </p>
                  {booking.checkInDate && (
                    <p className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      <span className="font-medium">Check-in:</span>
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </p>
                  )}
                  {booking.checkOutDate && (
                    <p className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      <span className="font-medium">Check-out:</span>
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  No accommodation booked
                </p>
              )}
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Created:</span>
                  {formatDateTime(booking.createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Expires:</span>
                  {formatDateTime(booking.expiresAt)}
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium">Available:</span>
                  {booking.available ? 'Yes' : 'No'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsDialog;