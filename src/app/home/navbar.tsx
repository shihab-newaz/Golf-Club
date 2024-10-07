"use client"
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogIn } from 'lucide-react';
import { ThemeToggle } from "@/components/theme-toggle";

const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 bg-gradient-to-b from-black/50 to-transparent">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-black flex items-center justify-center">
          <span className="text-white font-bold dark:text-black">GC</span>
        </div>
        <span className="text-white font-semibold dark:text-black">GOLF CLUB</span>
      </div>
      <nav className="flex items-center space-x-6">
        <ul className="flex space-x-6 text-white dark:text-black">
          <li><a href="#about" className="hover:underline">ABOUT</a></li>
          <li><a href="#lifestyle" className="hover:underline">LIFESTYLE</a></li>
        </ul>
        <Button variant="ghost" className="text-white hover:underline hover:text-white dark:text-black dark:hover:text-black flex items-center space-x-2">
          <LogIn size={18} />
          <span>MEMBER</span>
        </Button>
        <ThemeToggle />
      </nav>
    </header>
  );
};

export default Navbar;