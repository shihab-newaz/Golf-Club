// app/admin/bookings/page.tsx
import { Suspense } from 'react';
import BookingList from './client';
import { getBookings, getUsers, getTeeTimes, getResortRooms } from './actions';

export default async function AdminBookingsPage() {
  const [initialBookings, users, teeTimes, resortRooms] = await Promise.all([
    getBookings(),
    getUsers(),
    getTeeTimes(),
    getResortRooms()
  ]);

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-2xl font-bold mb-4">Manage Bookings</h1>
      <Suspense fallback={<div>Loading bookings...</div>}>
        <BookingList 
          initialBookings={initialBookings}
          users={users}
          teeTimes={teeTimes}
          resortRooms={resortRooms}
        />
      </Suspense>
    </div>
  );
}