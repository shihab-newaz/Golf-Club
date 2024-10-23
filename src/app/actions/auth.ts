// app/actions/auth.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { NextResponse } from "next/server";

export async function checkRole(allowedRoles: ('admin' | 'member')[]) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error('Authentication required');
  }

  if (!allowedRoles.includes(session.user.role as 'admin' | 'member')) {
    throw new Error('Unauthorized access');
  }

  return session.user;
}

export async function handleAuthError(error: any) {
  console.error('Authentication error:', error);
  if (error.message === 'Authentication required') {
    return new NextResponse('Please sign in to access this resource', { status: 401 });
  }
  if (error.message === 'Unauthorized access') {
    return new NextResponse('You do not have permission to access this resource', { status: 403 });
  }
  return new NextResponse('Internal server error', { status: 500 });
}