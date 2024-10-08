// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongoose"
import User from "@/models/User"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        await dbConnect()
        const user = await User.findOne({ email: credentials.email })

        if (!user) {
          return null
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordCorrect) {
          return null
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
  },
})

export { handler as GET, handler as POST }