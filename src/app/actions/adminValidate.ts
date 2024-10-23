// app/actions/adminValidation.ts
"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/utils/authOptions"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

// Custom error for admin validation
class AdminValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AdminValidationError'
  }
}

export async function validateAdminAccess() {
  const headersList = headers()
  const ip = headersList.get('x-forwarded-for') ?? '127.0.0.1'
  
  try {
    // Get the session
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session || !session.user) {
      console.warn(`Unauthenticated access attempt from IP: ${ip}`)
      redirect("/login?callbackUrl=/admin")
    }

    // Check if user is an admin
    if (session.user.role !== "admin") {
      console.warn(`Unauthorized access attempt by user: ${session.user.id} from IP: ${ip}`)
      throw new AdminValidationError('Insufficient permissions')
    }

    // Log successful admin access
    console.info(`Admin access granted to: ${session.user.email}`)

    return {
      user: session.user,
      timestamp: new Date().toISOString()
    }

  } catch (error) {
    // Handle validation errors
    if (error instanceof AdminValidationError) {
      console.error('Admin validation failed:', error.message)
      redirect("/")
    }

    // Handle unexpected errors
    console.error('Unexpected error during admin validation:', error)
    redirect("/error")
  }
}