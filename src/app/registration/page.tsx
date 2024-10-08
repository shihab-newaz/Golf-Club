// app/register/page.tsx
"use client";
import AuthForm from '@/components/authForm';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
       <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-gray-500/50 via-gray-500/70 to-gray-500/50 
      dark:bg-gradient-to-br dark:from-black/70 dark:via-black/50 dark:to-black/70 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-4">Join Our Golf Club</h2>
            <p className="mb-6">
              "Becoming a member of this golf club was the best decision I've made for my golfing journey. 
              The challenging courses, top-notch facilities, and vibrant community have transformed my 
              weekends into unforgettable golfing adventures."
            </p>
            <p className="font-semibold">- Emily Parker, Member since 2022</p>
          </motion.div>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-200
       dark:from-gray-800 dark:via-gray-900 dark:to-black">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Register</h1>
          <AuthForm mode="registration" />
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              Log in here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}