// types/next-auth.d.ts

import NextAuth, { DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      tier: string
    } & DefaultUser
  }

  interface User extends DefaultUser {
    tier: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tier?: string
  }
}