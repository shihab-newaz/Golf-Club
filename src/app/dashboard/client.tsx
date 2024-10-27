// app/dashboard/client.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  Activity,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import { BookingsTable, EventsTable, TeeTimesTable } from "./table";
import { DashboardData, StatsCardProps } from "./types";
import { cancelBooking } from "./actions";

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const DashboardClient: React.FC<{ data: DashboardData }> = ({ data }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    {
      title: "Membership Status",
      value: data.stats.membershipStatus.toUpperCase(),
      description: `Member since ${format(
        new Date(data.stats.memberSince),
        "MMM yyyy"
      )}`,
      icon: <Star className="h-4 w-4 text-yellow-500" />,
    },
    {
      title: "Total Bookings",
      value: data.stats.totalBookings,
      description: "All-time bookings",
      icon: <Calendar className="h-4 w-4 text-blue-500" />,
    },
    {
      title: "Completed Rounds",
      value: data.stats.completedBookings,
      description: "Rounds played",
      icon: <Trophy className="h-4 w-4 text-green-500" />,
    },
    {
      title: "Upcoming Events",
      value: data.stats.registeredEvents,
      description: "Registered events",
      icon: <Activity className="h-4 w-4 text-purple-500" />,
    },
  ];

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      // Refresh data or show success message
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      // Show error message
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col items-start">
        <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard</h2>
        <h4 className="text-xl font-bold text-white/60">Welcome, {data.stats.name}</h4>
      </div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="teetimes">Tee Times</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>
                View and manage all your bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingsTable bookings={data.bookings} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Registered Events</CardTitle>
              <CardDescription>
                All events you're registered for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventsTable events={data.events} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teetimes">
          <Card>
            <CardHeader>
              <CardTitle>Available Tee Times</CardTitle>
              <CardDescription>
                Browse and book available tee times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TeeTimesTable teeTimes={data.teeTimes.items} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardClient;