// app/admin/AdminDashboard.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Home,
  SquareMenu,
  Settings,
  Users,
  Calendar,
  Clock,
  LandPlot,Hotel
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const sidebarItems = [
  { name: "Dashboard", icon: Home, href: "/admin" },
  { name: "Bookings", icon: Clock, href: "/admin/bookings" },
  { name: "Events", icon: Calendar, href: "/admin/events" },
  { name: "Tee Times", icon: Clock, href: "/admin/teetimes" },
  { name: "Courses", icon: LandPlot, href: "/admin/courses" },
  { name: "Rooms", icon: Hotel, href: "/admin/rooms" },
  { name: "Members", icon: Users, href: "/admin/members" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

const Sidebar = ({ className = "" }) => (
  <div className={`flex flex-col h-full pt-5 overflow-y-auto ${className}`}>
    <div className="flex items-center flex-shrink-0 px-4">
      <img
        className="w-auto h-8"
        src="/placeholder.svg?height=32&width=32"
        alt="Golf Course Logo"
      />
      <span className="ml-2 text-xl font-semibold">Admin</span>
    </div>
    <nav className="flex-1 px-2 mt-5 space-y-1">
      {sidebarItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
        >
          <item.icon className="w-5 h-5 mr-3" />
          {item.name}
        </Link>
      ))}
    </nav>
  </div>
);

export default function AdminDashboard({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) {
  const pathname = usePathname();

  const getPageTitle = () => {
    const currentItem = sidebarItems.find((item) => item.href === pathname);
    return currentItem ? currentItem.name : "Admin";
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground-alt">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 z-40 h-1/2 w-64 bg-background mt-16">
        <Sidebar className="text-foreground-alt"/>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 md:ml-64">
        {/* Top bar */}
        <header className="fixed top-16 right-0 left-0 md:left-64 z-30 flex items-center justify-between px-4 py-4 bg-background lg:px-6">
          <h1 className="text-2xl font-semibold text-foreground-alt">{getPageTitle()}</h1>
          <div className="flex items-center gap-4">
           
            {/* Mobile Sidebar */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden  z-50"
                >
                  <SquareMenu className="h-6 w-6" />
                  <span className="sr-only">Open sidebar</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 pt-20 bg-background/60 backdrop-blur-md"
              >
                <Sidebar />
              </SheetContent>
            </Sheet>

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">View notifications</span>
            </Button>
            <Avatar>
              <AvatarImage
                src={user.image || "/placeholder.svg?height=32&width=32"}
                alt={user.name || "Admin"}
              />
              <AvatarFallback>{user.name?.[0] || "A"}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 mt-32 md:mt-36">
          {children}
        </main>
      </div>
    </div>
  );
}
