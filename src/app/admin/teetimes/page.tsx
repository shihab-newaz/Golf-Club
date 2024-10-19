// app/admin/teetimes/page.tsx
import { Suspense } from 'react';
import AdminTeeTimesPageClient from './TeeTimeClient';
import { getTeeTimes } from './actions';

export default async function AdminTeeTimesPage() {
  const initialTeeTimes = await getTeeTimes();

  return (
    <Suspense fallback={<div>Loading tee times...</div>}>
      <AdminTeeTimesPageClient initialTeeTimes={initialTeeTimes} />
    </Suspense>
  );
}