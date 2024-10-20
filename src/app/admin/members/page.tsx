// app/admin/members/page.tsx
import { Suspense } from 'react';
import MemberList from './client';
import { getMembers } from './actions';

export default async function AdminMembersPage() {
  const initialMembers = await getMembers();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Members</h1>
      <Suspense fallback={<div>Loading members...</div>}>
        <MemberList initialMembers={initialMembers} />
      </Suspense>
    </div>
  );
}