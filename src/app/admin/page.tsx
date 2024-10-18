"use client";

import { useState } from "react";
import { Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function AdminDashboard() {
  const [resortInfo, setResortInfo] = useState({
    name: "Daeho Country Club",
    description:
      "Luxury golf resort with stunning views and world-class facilities.",
    address: "123 Golf Course Rd, Jeju Island, South Korea",
  });

  const updateResortInfo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    alert("Resort information updated!");
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-6 py-8 mt-12">
            {/* ... Other content ... */}
            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₩52,345,678</div>
                  <p className="text-xs text-muted-foreground">
                    +15.2% from last month
                  </p>
                </CardContent>
              </Card>
              {/* ... Other cards ... */}
            </div>

            <div className="grid gap-6 mb-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>
                    You have 5 new bookings today.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <span className="w-32 text-gray-600 dark:text-gray-400">
                        Kim Min-jun
                      </span>
                      <span className="flex-1">18-hole round, 2:00 PM</span>
                      <Badge>New</Badge>
                    </li>
                    {/* ... Other bookings ... */}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>
                    You have 3 events this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <span className="w-32 text-gray-600 dark:text-gray-400">
                        Jul 20, 2024
                      </span>
                      <span className="flex-1">Summer Golf Championship</span>
                    </li>
                    {/* ... Other events ... */}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="flex space-x-4 mb-8">
              <Button>
                <Calendar className="mr-2 h-4 w-4" /> Add New Event
              </Button>
              <Link href="/admin/bookings">
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" /> Manage Bookings
                </Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Update Resort Information</CardTitle>
                <CardDescription>
                  Make changes to your resort's details here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={updateResortInfo}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={resortInfo.name}
                        onChange={(e) =>
                          setResortInfo({ ...resortInfo, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={resortInfo.description}
                        onChange={(e) =>
                          setResortInfo({
                            ...resortInfo,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={resortInfo.address}
                        onChange={(e) =>
                          setResortInfo({
                            ...resortInfo,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button type="submit">Update Resort Information</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-800 dark:text-green-100">
      {children}
    </span>
  );
}
