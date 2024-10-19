// app/admin/bookings/page.tsx
import { Suspense } from 'react';
import BookingList from './BookingList';
import { getBookings } from './actions';

export default async function AdminBookingsPage() {
  const initialBookings = await getBookings();

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-2xl font-bold mb-4">Manage Bookings</h1>
      <Suspense fallback={<div>Loading bookings...</div>}>
        <BookingList initialBookings={initialBookings} />
      </Suspense>
    </div>
  );
}