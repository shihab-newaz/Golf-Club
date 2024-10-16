// src/types/next-auth.d.ts

import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      membershipTier: string
      role: 'member' | 'admin'
      username: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    membershipTier: string
    role: 'member' | 'admin'
    username: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    membershipTier: string
    role: 'member' | 'admin'
    username: string
  }
}