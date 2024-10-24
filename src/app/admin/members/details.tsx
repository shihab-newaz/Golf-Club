import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, CreditCard, LandPlot, CalendarRange } from 'lucide-react';

interface Booking {
  _id: string;
  teeTime: {
    date: string;
    time: string;
    course: {
      name: string;
    };
  };
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

interface Event {
  _id: string;
  title: string;
  date: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface Member {
  _id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  membershipTier: 'free' | 'silver' | 'gold' | 'platinum';
  createdAt: string;
  bookings?: Booking[];
  events?: Event[];
}

interface MemberDetailsDialogProps {
  member: Member;
}

const MemberDetailsDialog: React.FC<MemberDetailsDialogProps> = ({ member }) => {
  const [open, setOpen] = useState(false);

  // Get membership tier color
  const getTierColor = (tier: Member['membershipTier']): string => {
    const tierColors: Record<Member['membershipTier'], string> = {
      free: 'bg-gray-500',
      silver: 'bg-slate-400',
      gold: 'bg-yellow-500',
      platinum: 'bg-blue-600'
    };
    return tierColors[tier];
  };

  // Format date
  const formatDate = (date: string): string => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Format date and time together
  const formatDateTime = (date: string, time: string): string => {
    try {
      const formattedDate = formatDate(date);
      return `${formattedDate} at ${time}`;
    } catch (error) {
      return 'Invalid date/time';
    }
  };

  // Get status color for bookings and events
  const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-green-500',
      cancelled: 'bg-red-500',
      completed: 'bg-blue-500',
      upcoming: 'bg-purple-500'
    };
    return statusColors[status] || 'bg-gray-500';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          See Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span>Member Details</span>
            <Badge className={`${getTierColor(member.membershipTier)} text-white`}>
              {member.membershipTier.charAt(0).toUpperCase() + member.membershipTier.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Personal Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="space-y-3">
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Name:</span> {member.name}
                </p>
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Username:</span> {member.username}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium">Email:</span> {member.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">Phone:</span> {member.phoneNumber}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Membership Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Membership Information</h3>
              <div className="space-y-3">
                <p className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="font-medium">Tier:</span>
                  <Badge className={`${getTierColor(member.membershipTier)} text-white`}>
                    {member.membershipTier}
                  </Badge>
                </p>
                <p className="flex items-center gap-2">
                  <CalendarRange className="h-4 w-4" />
                  <span className="font-medium">Member Since:</span>
                  {formatDate(member.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          {member.bookings && member.bookings.length > 0 && (
            <Card className="md:col-span-2">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
                <div className="space-y-3">
                  {member.bookings.map((booking) => (
                    <div key={booking._id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <LandPlot className="h-4 w-4" />
                        <div>
                          {/* <p className="font-medium">{booking.teeTime.course.name}</p> */}
                          <p className="text-sm text-muted-foreground">
                            {/* {formatDateTime(booking.teeTime.date, booking.teeTime.time)} */}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Event Participation */}
          {member.events && member.events.length > 0 && (
            <Card className="md:col-span-2">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Event Participation</h3>
                <div className="space-y-3">
                  {member.events.map((event) => (
                    <div key={event._id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <CalendarRange className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(event.status)}`}>
                        {event.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MemberDetailsDialog;