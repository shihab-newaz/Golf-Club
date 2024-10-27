// app/lib/auth-utils.ts
import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

export type AuthError = {
  type: 'AUTH_REQUIRED' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'VALIDATION' | 'SYSTEM';
  message: string;
};

export async function withAuth<T>(
  action: () => Promise<T>,
  options?: {
    redirectUrl?: string;
    requireAdmin?: boolean;
  }
): Promise<T> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect(options?.redirectUrl || '/login');
  }

  if (options?.requireAdmin && session.user.role !== 'admin') {
    redirect('/unauthorized');
  }

  try {
    return await action();
  } catch (error) {
    const authError = error as AuthError;
    switch (authError.type) {
      case 'AUTH_REQUIRED':
        redirect('/login');
      case 'UNAUTHORIZED':
        redirect('/unauthorized');
      default:
        throw error;
    }
  }
}