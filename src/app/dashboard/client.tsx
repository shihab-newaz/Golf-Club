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

const quickLinks = [
  { name: "Book Tee Time", icon: Calendar, href: "/booking" },
  { name: "View Courses", icon: LandPlot, href: "/courses" },
  { name: "Book Room", icon: Hotel, href: "/book-room" },
  { name: "Membership", icon: CreditCard, href: "/subscription" },
];

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
  bookingCount: number;
  recentCourses: any[];
}

export default function DashboardClient({ user, upcomingBookings, bookingCount, recentCourses }: DashboardClientProps) {
  const router = useRouter();

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await cancelBooking(bookingId);
        router.refresh();
      } catch (error) {
        console.error("Failed to cancel booking:", error);
        alert("Failed to cancel booking. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-6 mt-16">
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, {user.name || user.username}!</CardTitle>
          <CardDescription>Here's an overview of your golfing activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bookingCount} total bookings</div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <Card key={link.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {link.name}
              </CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Bookings</CardTitle>
          <CardDescription>
            Your next {upcomingBookings.length} tee times
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop view */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Players</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingBookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>{new Date(booking.teeTime.date).toLocaleDateString()}</TableCell>
                    <TableCell>{booking.teeTime.time}</TableCell>
                    <TableCell>{booking.players}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    <TableCell>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile view */}
          <div className="md:hidden space-y-4">
            {upcomingBookings.map((booking) => (
              <Card key={booking._id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-medium">{new Date(booking.teeTime.date).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">{booking.teeTime.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{booking.players} players</p>
                      <p className="text-sm text-muted-foreground">Status: {booking.status}</p>
                    </div>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => handleCancelBooking(booking._id)}
                  >
                    Cancel Booking
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}