// app/admin/holes/page.tsx
import { Suspense } from 'react';
import HoleList from './client';
import { getHoles } from './actions';

export default async function AdminHolesPage() {
  const initialHoles = await getHoles();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Golf Holes</h1>
      <Suspense fallback={<div>Loading holes...</div>}>
        <HoleList initialHoles={initialHoles} />
      </Suspense>
    </div>
  );
}