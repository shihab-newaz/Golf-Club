import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Clock,
  Users,
  DollarSign,
  Flag,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface Course {
  _id: string;
  name: string;
}

interface TeeTime {
  _id: string;
  date: Date;
  time: string;
  course: Course;
  maxPlayers: number;
  availableSlots: number;
  price: number;
  isAvailable: boolean;
}

interface TeeTimeDetailsDialogProps {
  teeTime: TeeTime;
}

const TeeTimeDetailsDialog: React.FC<TeeTimeDetailsDialogProps> = ({ teeTime }) => {
  const [open, setOpen] = useState(false);

  // Format date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          See Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            {/* <span>{teeTime.course.name}</span> */}
            <Badge className={teeTime.isAvailable ? 'bg-green-500' : 'bg-red-500'}>
              {teeTime.isAvailable ? 'Available' : 'Unavailable'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4">
          {/* Time Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Schedule Information</h3>
              <div className="space-y-3">
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Date:</span> {formatDate(teeTime.date)}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Time:</span> {teeTime.time}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Availability Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Availability Details</h3>
              <div className="space-y-3">
                <p className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Maximum Players:</span> {teeTime.maxPlayers}
                </p>
                <p className="flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  <span className="font-medium">Available Slots:</span> {teeTime.availableSlots}
                </p>
                <p className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">Price:</span> ${teeTime.price.toLocaleString()}
                </p>
                <p className="flex items-center gap-2">
                  {teeTime.isAvailable ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium">Status:</span>
                  <span className={teeTime.isAvailable ? 'text-green-500' : 'text-red-500'}>
                    {teeTime.isAvailable ? 'Available for Booking' : 'Unavailable'}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Occupancy Visualization */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Slot Occupancy</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ 
                    width: `${((teeTime.maxPlayers - teeTime.availableSlots) / teeTime.maxPlayers) * 100}%` 
                  }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {teeTime.maxPlayers - teeTime.availableSlots} of {teeTime.maxPlayers} slots booked
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeeTimeDetailsDialog;