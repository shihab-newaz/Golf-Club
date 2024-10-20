// app/admin/events/page.tsx
import { Suspense } from 'react';
import AdminEventsPageClient from './client';
import { getEvents } from './actions';

export default async function AdminEventsPage() {
  const initialEvents = await getEvents();

  return (
    <Suspense fallback={<div>Loading events...</div>}>
      <AdminEventsPageClient initialEvents={initialEvents} />
    </Suspense>
  );
}