"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogIn, User, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const MobileMenu = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] text-black dark:text-white">
        <nav className="flex flex-col gap-4">
          <Link href="/courses" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">COURSES</Button>
          </Link>
          <Link href="/events" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">EVENTS</Button>
          </Link>
          <Link href="/about" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">ABOUT</Button>
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
              </Link>
              <Link href="/settings" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Settings</Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start" onClick={() => { signOut(); setIsOpen(false); }}>
                Sign out
              </Button>
            </>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <LogIn className="mr-2 h-5 w-5" />
                LOGIN
              </Button>
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-foreground-alt/60 dark:bg-background-alt/80 backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                <span className="text-primary font-bold">GC</span>
              </div>
              <span className="text-base font-semibold hover:text-link">
                GOLF CLUB
              </span>
            </Link>
          </div>

          {!isMobile && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/courses" legacyBehavior passHref>
                    <NavigationMenuLink className="px-4 py-2 text-sm font-medium text-foreground hover:text-link">
                      COURSES
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/events" legacyBehavior passHref>
                    <NavigationMenuLink className="px-4 py-2 text-sm font-medium text-foreground hover:text-link">
                      EVENTS
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink className="px-4 py-2 text-sm font-medium text-foreground hover:text-link">
                      ABOUT
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                {session ? (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="px-4 py-2 text-sm font-medium bg-transparent hover:bg-transparent text-foreground hover:text-link">
                      <User className="mr-2 h-5 w-5" />
                      <span>{session.user?.name}</span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                              href="/"
                            >
                              <User className="h-6 w-6" />
                              <div className="mb-2 mt-4 text-lg font-medium">
                                {session.user?.name}
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                Manage your account and settings
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <a
                              href="/dashboard"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">
                                Dashboard
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                View your stats and activity
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <a
                              href="/settings"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">
                                Settings
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Manage your preferences
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <button
                            onClick={() => signOut()}
                            className="w-full text-left select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              Sign out
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Log out of your account
                            </p>
                          </button>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem>
                    <Link href="/login" legacyBehavior passHref>
                      <NavigationMenuLink className="px-4 py-2 text-sm font-medium text-foreground hover:text-link flex items-center">
                        <LogIn className="mr-2 h-5 w-5" />
                        LOGIN
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          )}

          <div className="flex items-center">
            <ThemeToggle />
            {isMobile && <MobileMenu />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;