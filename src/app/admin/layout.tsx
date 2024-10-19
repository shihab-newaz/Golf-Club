// app/admin/layout.tsx
import React from 'react';
import { validateAdminAccess } from "@/app/actions/adminValidate";
import AdminDashboard from './AdminDashboard';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await validateAdminAccess();

  return <AdminDashboard user={user}>{children}</AdminDashboard>;
}