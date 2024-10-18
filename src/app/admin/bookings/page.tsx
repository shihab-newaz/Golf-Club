// app/admin/bookings/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Booking {
  _id: string;
  user: { name: string; email: string };
  date: string;
  time: string;
  players: number;
  status: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    const response = await fetch('/api/bookings')
    const data = await response.json()
    if (data.success) {
      setBookings(data.data)
    }
  }

  const updateBookingStatus = async (id: string, newStatus: string) => {
    const response = await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (response.ok) {
      fetchBookings()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Manage Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Players</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>{booking.user.name}</TableCell>
                  <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>{booking.players}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                  <TableCell>
                    <Button onClick={() => updateBookingStatus(booking._id, 'confirmed')} className="mr-2">
                      Confirm
                    </Button>
                    <Button onClick={() => updateBookingStatus(booking._id, 'cancelled')} variant="destructive">
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}