// app/actions/adminValidation.ts
"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/utils/authOptions"
import { redirect } from "next/navigation"

export async function validateAdminAccess() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  if (session.user.role !== "admin") {
    redirect("/")
  }

  return session.user
}