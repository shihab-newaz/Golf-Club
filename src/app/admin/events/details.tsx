import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Users, Info } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  registeredUsers: User[];
  createdBy: User;
  imageUrl: string;
}

interface EventDetailsDialogProps {
  event: Event;
}

const EventDetailsDialog: React.FC<EventDetailsDialogProps> = ({ event }) => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  
  const totalPages = Math.ceil(event.registeredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = event.registeredUsers.slice(startIndex, endIndex);

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRegistrationStatus = () => {
    const spotsLeft = event.capacity - event.registeredUsers.length;
    if (spotsLeft === 0) return { text: 'Fully Booked', color: 'text-red-500' };
    if (spotsLeft <= 5) return { text: `${spotsLeft} spots left`, color: 'text-yellow-500' };
    return { text: `${spotsLeft} spots available`, color: 'text-green-500' };
  };

  const registrationStatus = getRegistrationStatus();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          See More
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span>{event.title}</span>
            <span className={`text-sm ${registrationStatus.color}`}>
              {registrationStatus.text}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Event Details */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Event Details</h3>
              <div className="space-y-3">
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Date:</span> {formatDate(event.date)}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Time:</span>
                  {event.startTime} - {event.endTime}
                </p>
                <p className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Capacity:</span>
                  {event.capacity} participants
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Image */}
          {event.imageUrl && (
            <Card>
              <CardContent className="pt-6">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Description</h3>
              <p className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-1 flex-shrink-0" />
                {event.description}
              </p>
            </CardContent>
          </Card>

          {/* Registered Users */}
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
                <span>Registered Users</span>
                <span className="text-sm text-muted-foreground">
                  {event.registeredUsers.length} registered
                </span>
              </h3>
              
              <div className="space-y-4">
                {/* Users list */}
                <div className="divide-y divide-border">
                  {currentUsers.map((user, index) => (
                    <div key={user._id} className="py-2 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        #{startIndex + index + 1}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <PaginationItem key={page}>
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Created By */}
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Event Organizer</h3>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-medium">Created by:</span>
                {event.createdBy.name} ({event.createdBy.email})
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsDialog;