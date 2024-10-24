// app/dashboard/client.tsx
"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, LandPlot, Hotel, CreditCard } from "lucide-react";
import { cancelBooking } from "./actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id: string;
    membershipTier: string;
    role: "member" | "admin";
    username: string;
  };
  upcomingBookings: any[];
  completedBookings: any[];
  registeredEvents: any[];
  bookingCount: number;
  recentCourses: any[];
}

export default function DashboardClient({
  user,
  upcomingBookings,
  completedBookings,
  registeredEvents,
  bookingCount,
  recentCourses,
}: DashboardClientProps) {
  const router = useRouter();
  const quickLinks = [
    { name: "Book Tee Time", icon: Calendar, href: "/booking" },
    { name: "View Courses", icon: LandPlot, href: "/courses" },
    { name: "Book Room", icon: Hotel, href: "/book-room" },
    { name: "Membership", icon: CreditCard, href: "/subscription" },
  ];
  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await cancelBooking(bookingId);
        router.refresh();
      } catch (error: any) {
        console.error("Failed to cancel booking:", error);
        alert(error.message || "Failed to cancel booking. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-6 mt-16">
      {/* Welcome card */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, {user.name || user.username}!</CardTitle>
          <CardDescription>
            Here's an overview of your golfing activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {bookingCount} total bookings
          </div>
        </CardContent>
      </Card>
      {/* Quick links */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <Card key={link.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{link.name}</CardTitle>
              <link.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Link href={link.href}>
                <Button className="w-full">Go</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Bookings and Events Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
          <TabsTrigger value="completed">Past Bookings</TabsTrigger>
          <TabsTrigger value="events">Registered Events</TabsTrigger>
        </TabsList>

        {/* Upcoming Bookings Tab */}
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
              <CardDescription>
                Your next {upcomingBookings.length} tee times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingsTable
                bookings={upcomingBookings}
                onCancel={handleCancelBooking}
                showCancelButton
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Completed Bookings Tab */}
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Past Bookings</CardTitle>
              <CardDescription>
                Your previous {completedBookings.length} rounds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingsTable
                bookings={completedBookings}
                showCancelButton={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Registered Events</CardTitle>
              <CardDescription>Your upcoming events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {registeredEvents.map((event) => (
                  <Card key={event._id}>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-lg mb-2">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {event.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm">
                            Date: {new Date(event.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm">
                            Time: {event.startTime} - {event.endTime}
                          </p>
                        </div>
                        <Link href={`/events/${event._id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Bookings Table Component
function BookingsTable({
  bookings,
  onCancel,
  showCancelButton,
}: {
  bookings: any[];
  onCancel?: (id: string) => void;
  showCancelButton: boolean;
}) {
  return (
    <>
      {/* Desktop view */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Players</TableHead>
              <TableHead>Status</TableHead>
              {showCancelButton && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>
                  {new Date(booking.teeTime.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{booking.teeTime.time}</TableCell>
                <TableCell>{booking.teeTime.course.name}</TableCell>
                <TableCell>{booking.players}</TableCell>
                <TableCell>{booking.status}</TableCell>
                {showCancelButton && (
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onCancel?.(booking._id)}
                    >
                      Cancel
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {bookings.map((booking) => (
          <Card key={booking._id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-medium">
                    {new Date(booking.teeTime.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.teeTime.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{booking.teeTime.course.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.players} players
                  </p>
                </div>
              </div>
              {showCancelButton && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => onCancel?.(booking._id)}
                >
                  Cancel Booking
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
