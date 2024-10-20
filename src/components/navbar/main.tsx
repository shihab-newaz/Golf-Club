// components/Navbar/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";
import WeatherWidget from "@/components/navbar/WeatherWidget";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import Link from "next/link";


const Logo: React.FC = () => (
    <Link href="/" className="flex items-center space-x-2">
      <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
        <span className="text-primary font-bold">GC</span>
      </div>
      <span className="text-base font-semibold hover:text-link">
        GOLF CLUB
      </span>
    </Link>
  );

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-foreground-alt/60 dark:bg-background-alt/80 backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Logo />

          {isMobile ? (
            <div className="flex items-center">
              <ThemeToggle />
              <MobileNav session={session} />
            </div>
          ) : (
            <>
              <DesktopNav session={session} />
              <div className="flex items-center">
                <WeatherWidget />
                <ThemeToggle />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;