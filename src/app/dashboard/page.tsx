// app/dashboard/page.tsx
import { Suspense } from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { redirect } from "next/navigation";
import DashboardClient from './client';
import { getUserDashboardData } from './actions';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect('/login');
  }

  const dashboardData = await getUserDashboardData();

  // Ensure all required properties are present in the user object
  const user = {
    ...session.user,
    id: session.user.id || '',
    membershipTier: session.user.membershipTier || 'free',
    role: session.user.role || 'member',
    username: session.user.username || '',
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardClient 
        user={user}
        upcomingBookings={dashboardData.upcomingBookings}
        completedBookings={dashboardData.completedBookings}
        registeredEvents={dashboardData.registeredEvents}
        bookingCount={dashboardData.bookingCount}
        recentCourses={dashboardData.recentCourses}
      />
    </Suspense>
  );
}