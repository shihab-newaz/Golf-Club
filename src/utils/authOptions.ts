// src/utils/authOptions.ts

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoose";
import UserModel from "@/models/User";

// Define and export the NextAuth options
export const authOptions: NextAuthOptions = {
  // Configure authentication providers
  providers: [
    // Use CredentialsProvider for username/password authentication
    CredentialsProvider({
      name: "Credentials",
      // Define the fields for the login form
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // The authorize function is called when a user attempts to log in
      async authorize(credentials) {
        // Check if username and password are provided
        if (!credentials?.username || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          // Connect to the database
          await dbConnect();
          
          // Find the user in the database by username
          const user = await UserModel.findOne({ username: credentials.username });
          
          // If user is not found, return null (authentication fails)
          if (!user) {
            console.log("User not found");
            return null;
          }

          // Compare the provided password with the hashed password in the database
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          
          // If password is incorrect, return null (authentication fails)
          if (!isPasswordCorrect) {
            console.log("Incorrect password");
            return null;
          }

          console.log("Authentication successful");
          // If authentication is successful, return user data
          return {
            id: user._id.toString(),
            name: user.name,
            username: user.username,
            email: user.email,
            membershipTier: user.membershipTier,
            role: user.role,
          };
        } catch (error) {
          // Log any errors that occur during authentication
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  // Define callbacks for customizing JWT and session handling
  callbacks: {
    // The jwt callback is used to add custom fields to the JWT
    async jwt({ token, user }) {
      if (user) {
        // Add custom fields to the token
        token.membershipTier = user.membershipTier;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    // The session callback is used to customize the session object
    async session({ session, token }) {
      if (session.user) {
        // Add custom fields from the token to the session
        session.user.membershipTier = token.membershipTier as string;
        session.user.role = token.role as 'member' | 'admin';
        session.user.id = token.sub as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  // Configure session handling
  session: {
    strategy: "jwt", // Use JSON Web Tokens for session handling
  },
  // Custom pages configuration
  pages: {
    signIn: "/login", // Use a custom login page
  },
  // Secret used to encrypt the NextAuth.js JWT
  secret: process.env.NEXTAUTH_SECRET,
};