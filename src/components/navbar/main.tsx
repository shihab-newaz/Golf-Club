"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";
import WeatherWidget from "@/components/navbar/WeatherWidget";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import Link from "next/link";
import Image from "next/image";

const Logo = () => (
  <Link href="/" className="flex items-center space-x-3 rounded-md px-2 py-1 hover:bg-white/10 transition-colors duration-200 ">
    <div className="relative w-12 h-12">
      <Image
        src="/logo/logo(1).jpg"
        alt="Daeho Country Club Logo"
        width={48}
        height={48}
        className="object-contain"
      />
    </div>
    <div className="flex flex-col">
      <span className="text-lg font-bold">DAEHO</span>
      <span className="text-sm font-medium text-white/50">Country Club</span>
    </div>
  </Link>
);

const Navbar = () => {
  const { data: session } = useSession();
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header 
      className={`fixed text-white top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-[#020817]/80 backdrop-blur-md shadow-md" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />

          {isMobile ? (
            <div className="flex items-center gap-2">
              <WeatherWidget />
              <ThemeToggle />
              <MobileNav session={session} />
            </div>
          ) : (
            <>
              <DesktopNav session={session} />
              <div className="flex items-center gap-4">
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