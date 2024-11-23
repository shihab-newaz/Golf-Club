// app/admin/page.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users, Calendar, Clock, LandPlot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Event from "@/models/Event";
import Booking from "@/models/Booking";
import TeeTime from "@/models/TeeTime";
import Course from "@/models/Course";

async function getDashboardData() {
  await dbConnect();

  const userCount = await User.countDocuments();
  const eventCount = await Event.countDocuments();
  const bookingCount = await Booking.countDocuments();
  const teeTimeCount = await TeeTime.countDocuments();
  const courseCount = await Course.countDocuments();

  const recentBookings = await Booking.find()
    .sort({ createdAt: -1 })
    .limit(3)
    .populate("user", "name")
    .populate("teeTime", "date time");

  return {
    userCount,
    eventCount,
    bookingCount,
    teeTimeCount,
    courseCount,
    recentBookings,
  };
}

export default async function AdminDashboard() {
  const {
    userCount,
    eventCount,
    bookingCount,
    teeTimeCount,
    courseCount,
    recentBookings,
  } = await getDashboardData();

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Total Members */}
        <Card className="bg-card-alt">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Members
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount-1}</div>
          </CardContent>
        </Card>
        {/* Total Events */}
        <Card className="bg-card-alt">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Events
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventCount}</div>
          </CardContent>
        </Card>
        {/* Total Bookings */}
        <Card className="bg-card-alt">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingCount}</div>
          </CardContent>
        </Card>
        {/* Total Tee Times */}
        <Card className="bg-card-alt">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Tee Times
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teeTimeCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-card-alt">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Courses
            </CardTitle>
            <LandPlot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courseCount}</div>
          </CardContent>
        </Card>
      </div>
      {/* Recent Bookings */}
      <Card className="mt-4 bg-card-alt">
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>
            There are currently {bookingCount} total bookings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {recentBookings.map((booking) => (
              <div className="flex items-center" key={booking._id}>
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={`/placeholder.svg?height=36&width=36`}
                    alt={booking.user?.name || "User"}
                  />
                  <AvatarFallback>
                    {booking.user?.name
                      ? booking.user.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {booking.user?.name || "Unknown User"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.players || "N/A"} players
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  {booking.teeTime ? (
                    <>
                      <p>
                        {new Date(booking.teeTime.date).toLocaleDateString()}
                      </p>
                      <p>{booking.teeTime.time}</p>
                    </>
                  ) : (
                    "Tee time not available"
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}