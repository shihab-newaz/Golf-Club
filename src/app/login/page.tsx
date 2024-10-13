// app/login/page.tsx
"use client";
import AuthForm from '@/components/authForm';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LoginPage() {
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
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-200
       dark:from-gray-800 dark:via-gray-900 dark:to-black">    
           <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <h1 className="text-4xl font-bold mb-8 text-green-800 dark:text-green-300">Log In</h1>
          <AuthForm mode="login" />
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link href="/registration" className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">
              Register here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}