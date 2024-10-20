// app/admin/hotel-rooms/page.tsx
import { Suspense } from 'react';
import HotelRoomList from './client';
import { getHotelRooms } from './actions';

export default async function AdminHotelRoomsPage() {
  const initialRooms = await getHotelRooms();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Hotel Rooms</h1>
      <Suspense fallback={<div>Loading hotel rooms...</div>}>
        <HotelRoomList initialRooms={initialRooms} />
      </Suspense>
    </div>
  );
}