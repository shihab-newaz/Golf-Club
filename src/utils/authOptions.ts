// src/utils/authOptions.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoose";
import UserModel from "@/models/User";

// Define and export the NextAuth options
export const authOptions: NextAuthOptions = {
  // Configure authentication providers
  providers: [
    // Use CredentialsProvider for username/password authentication
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
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
          const user = await UserModel.findOne({
            username: credentials.username,
          });

          // If user is not found, return null (authentication fails)
          if (!user) {
            console.log("User not found");
            return null;
          }

          // Compare the provided password with the hashed password in the database
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

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
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await dbConnect();
          const existingUser = await UserModel.findOne({ email: user.email });

          if (!existingUser) {
            // Create new user if doesn't exist
            const newUser = await UserModel.create({
              name: user.name,
              email: user.email,
              username: profile?.email?.split("@")[0] || user.email,
              password: await bcrypt.hash(Math.random().toString(36), 10),
              phoneNumber: "N/A", 
              membershipTier: "free",
              role: "member",
            });
            user.id = newUser._id.toString();
            user.membershipTier = "free";
            user.role = "member";
          } else {
            // Use existing user data
            user.id = existingUser._id.toString();
            user.membershipTier = existingUser.membershipTier;
            user.role = existingUser.role;
          }
        } catch (error) {
          console.error("Error in Google sign in:", error);
          return false;
        }
      }
      return true;
    },
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
        session.user.role = token.role as "member" | "admin";
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
