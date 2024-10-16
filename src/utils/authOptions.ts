import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoose";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          await dbConnect();
          
          const user = await UserModel.findOne({ username: credentials.username });
          
          if (!user) {
            console.log("User not found");
            return null;
          }

          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordCorrect) {
            console.log("Incorrect password");
            return null;
          }

          console.log("Authentication successful");
          return {
            id: user._id.toString(),
            name: user.name,
            username: user.username,
            email: user.email,
            membershipTier: user.membershipTier,
            role: user.role,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.membershipTier = user.membershipTier;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.membershipTier = token.membershipTier as string;
        session.user.role = token.role as 'member' | 'admin';
        session.user.id = token.sub as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};