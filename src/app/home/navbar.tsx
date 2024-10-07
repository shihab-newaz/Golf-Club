"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const Navbar: React.FC = () => {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 bg-gradient-to-r from-white/50 via-gray-200/50 to-white/50 
    dark:from-black/70 dark:via-gray-800/70 dark:to-black/70 transition-colors duration-300"
    >
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full border-2 border-black dark:border-white flex items-center justify-center">
          <span className="text-black font-bold dark:text-white">GC</span>
        </div>
        <span className="text-black font-semibold dark:text-white">
          GOLF CLUB
        </span>
      </div>
      <nav className="flex items-center space-x-6">
        <ul className="flex space-x-6 text-black dark:text-white">
          <li>
            <a href="#about" className="hover:underline font-semibold">
              ABOUT
            </a>
          </li>
          <li>
            <a href="#lifestyle" className="hover:underline font-semibold">
              LIFESTYLE
            </a>
          </li>
        </ul>
        <Button
          variant="ghost"
          className="text-black font-semibold hover:underline hover:text-black dark:text-white dark:hover:text-white flex items-center space-x-2"
        >
          <LogIn size={18} />
          <span>MEMBER</span>
        </Button>
        <ThemeToggle />
      </nav>
    </header>
  );
};

export default Navbar;