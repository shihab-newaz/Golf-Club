// app/not-found.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Golf Ball SVG Illustration */}
        <div className="mb-8 relative">
          <svg
            className="w-48 h-48 mx-auto text-green-600 dark:text-green-400"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" />
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="currentColor"
              fontSize="24"
              fontWeight="bold"
            >
              404
            </text>
          </svg>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Out of Bounds!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Looks like your shot went a bit off course.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            The page you're looking for is under construction.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/">
              <Button 
                className="w-full sm:w-auto flex items-center justify-center gap-2"
                variant="default"
              >
                <Home className="w-4 h-4" />
                Return to Home
              </Button>
            </Link>
            <Button 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous Page
            </Button>
          </div>

          {/* Quick Links */}
          <div className="mt-8 space-x-4 text-sm">
            <Link 
              href="/courses" 
              className="text-green-600 dark:text-green-400 hover:underline"
            >
              View Courses
            </Link>
            <span className="text-gray-400">•</span>
            <Link 
              href="/booking" 
              className="text-green-600 dark:text-green-400 hover:underline"
            >
              Book a Tee Time
            </Link>
            <span className="text-gray-400">•</span>
            <Link 
              href="/about" 
              className="text-green-600 dark:text-green-400 hover:underline"
            >
              Contact Us
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            <p>Need assistance finding your way around?</p>
            <p>Our staff is ready to help at (+66) 99 065 6994</p>
          </div>
        </div>
      </div>
    </div>
  );
}