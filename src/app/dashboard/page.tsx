// app/dashboard/page.tsx
import { Suspense } from "react";
import { getDashboardData } from "./actions";
import DashboardClient from "./client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="min-h-screen bg-[#121212] pt-20">
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <DashboardClient data={data} />
      </Suspense>
    </div>
  );
}