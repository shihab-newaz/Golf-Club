// src/components/navbar.tsx

"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User, Settings, LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { HoverDropdownMenu } from "@/components/ui/hover-dropdown-menu";
import HamburgerMenu from "@/components/ui/hamburger-menu";

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dropdownItems = [
    {
      label: (
        <div className="flex items-center">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </div>
      ),
      onClick: () => console.log("Dashboard clicked"),
    },
    {
      label: (
        <div className="flex items-center">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </div>
      ),
      onClick: () => console.log("Settings clicked"),
    },
    {
      label: (
        <div className="flex items-center text-red-500 dark:text-red-400">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </div>
      ),
      onClick: () => signOut(),
    },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-400/50 via-gray-300/50 to-gray-400/50 dark:from-black/70 
    dark:via-gray-800/70 dark:to-black/70 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-black dark:border-white flex items-center justify-center">
                <Link href="/">
                  <span className="text-black font-bold dark:text-white">
                    GC
                  </span>
                </Link>
              </div>
              <Link href="/">
                {" "}
                <span className="text-black font-semibold dark:text-white">
                  GOLF CLUB
                </span>
              </Link>
            </div>
          </div>
          <div className="-mr-2 -my-2 md:hidden">
            <HamburgerMenu
              isOpen={isMenuOpen}
              toggle={() => setIsMenuOpen(!isMenuOpen)}
            />
          </div>
          <nav className="hidden md:flex space-x-10">
            <Link
              href="/courses"
              className="text-base font-medium text-black hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              COURSES
            </Link>
            <Link
              href="/events"
              className="text-base font-medium text-black hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              EVENTS
            </Link>
            <Link
              href="/about"
              className="text-base font-medium text-black hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              ABOUT
            </Link>
          </nav>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            {session ? (
              <HoverDropdownMenu
                trigger={
                  <div className="flex items-center cursor-pointer text-black dark:text-white hover:bg-gray-200 
                  dark:hover:bg-gray-700 px-3 py-2 rounded-md">
                    <User className="mr-2 h-5 w-5" />
                    <span>{session.user?.name}</span>
                  </div>
                }
                items={dropdownItems}
              />
            ) : (
              <Link href="/login" passHref>
                <Button
                  variant="ghost"
                  className="text-black font-semibold hover:bg-gray-200 hover:text-black dark:text-white dark:hover:bg-gray-700 
                  dark:hover:text-white flex items-center space-x-2"
                >
                  <LogIn size={18} />
                  <span>LOGIN</span>
                </Button>
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/about"
            className="block px-3 py-2 rounded-md text-base font-medium text-black hover:text-gray-700 hover:bg-gray-50 dark:text-gray-300
             dark:hover:text-white dark:hover:bg-gray-700"
          >
            ABOUT
          </Link>
          <Link
            href="/courses"
            className="block px-3 py-2 rounded-md text-base font-medium text-black hover:text-gray-700 hover:bg-gray-50 dark:text-gray-300 
            dark:hover:text-white dark:hover:bg-gray-700"
          >
            COURSES
          </Link>
          <Link
            href="/events"
            className="text-base font-medium text-black hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          >
            EVENTS
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center px-5">
            {session ? (
              <>
                <div className="flex-shrink-0">
                  <User className="h-10 w-10 rounded-full" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-gray-800 dark:text-white">
                    {session.user?.name}
                  </div>
                  <div className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">
                    {session.user?.email}
                  </div>
                </div>
              </>
            ) : (
              <Link href="/login" passHref>
                <Button
                  variant="ghost"
                  className="text-black font-semibold hover:bg-gray-200 hover:text-black dark:text-white dark:hover:bg-gray-700 
                  dark:hover:text-white flex items-center space-x-2"
                >
                  <LogIn size={18} />
                  <span>LOGIN</span>
                </Button>
              </Link>
            )}
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>
          {session && (
            <div className="mt-3 px-2 space-y-1">
              {dropdownItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 
                  dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
