"use client";
import AuthForm from '@/components/authForm';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/home" });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-50 via-green-100 to-green-200 dark:from-green-900 dark:via-green-800 dark:to-green-700">
      {/* Left side */}
      <div className="hidden md:flex md:w-1/2 relative">
        <Image
          src="/ai.png"
          alt="Beautiful golf course"
          fill
          style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-md text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Welcome to Golf Club</h2>
            <p className="mb-6 text-lg">
              "This golf club has elevated my game to new heights. The pristine courses,
              expert instruction, and luxurious amenities have made every visit an unforgettable experience.
              It's truly a golfer's paradise."
            </p>
            <p className="font-semibold text-green-300">- James Thompson, Member since 2021</p>
          </motion.div>
        </div>
      </div>

      {/* Right side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-black">    
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold text-green-800 dark:text-green-300">Log In</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome back! Please sign in to continue.</p>
          </div>

          {/* Google Sign-in Button */}
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gradient-to-br from-gray-100 via-gray-200 to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-black px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <AuthForm mode="login" />
          
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link 
              href="/registration" 
              className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
            >
              Register here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}