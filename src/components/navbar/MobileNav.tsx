// src/components/navbar/MobileNav.tsx
import { useState } from "react";
import Link from "next/link";
import { LogIn, Menu, ChevronDown, ChevronUp, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import WeatherWidget from "@/components/navbar/WeatherWidget";

const navLinks = [
  { href: "/courses", label: "COURSES" },
  { href: "/events", label: "EVENTS" },
  { href: "/about", label: "ABOUT" },
];

const serviceLinks = [
  { href: "/services/tee-time-booking", label: "Tee Time Booking" },
  { href: "/services/accommodation", label: "Accommodation" },
  { href: "/services/location", label: "Location" },
  { href: "/services/airport-pickup", label: "Airport Pickup" },
  { href: "/services/local-trip", label: "Local Trip" },
  { href: "/services/senior-membership", label: "Senior Membership" },
];

const MobileNav: React.FC<{ session: any }> = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const isAdmin = session?.user?.role === "admin";
  const dashboardLink = isAdmin ? "/admin" : "/dashboard";
  const settingsLink = isAdmin ? "/admin" : "/settings";

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden ml-2">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[300px] sm:w-[400px] text-black dark:text-white bg-white/80 dark:bg-black/80 backdrop-blur-md"
      >
        <nav className="flex flex-col gap-4">
          <div className="mb-4">
            <WeatherWidget />
          </div>
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              onClick={() => setIsOpen(false)}
            />
          ))}
          <div>
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => setIsServicesOpen(!isServicesOpen)}
            >
              SERVICES
              {isServicesOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {isServicesOpen && (
              <div className="ml-4 mt-2 flex flex-col gap-2">
                {serviceLinks.map((link) => (
                  <ServiceLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    onClick={() => setIsOpen(false)}
                  />
                ))}
              </div>
            )}
          </div>
          {session ? (
            <div>
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  {session.user?.name || "User"}
                </div>
                {isUserMenuOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              {isUserMenuOpen && (
                <div className="ml-4 mt-2 flex flex-col gap-2">
                  <NavLink
                    href={dashboardLink}
                    label={isAdmin ? "Admin Dashboard" : "Dashboard"}
                    onClick={() => setIsOpen(false)}
                  />{" "}
                  <NavLink
                    href={settingsLink}
                    label="Settings"
                    onClick={() => setIsOpen(false)}
                  />
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                  >
                    Sign out
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              href="/login"
              label="LOGIN"
              icon={<LogIn className="mr-2 h-5 w-5" />}
              onClick={() => setIsOpen(false)}
            />
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

const NavLink: React.FC<{
  href: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}> = ({ href, label, icon, onClick }) => (
  <Link href={href} onClick={onClick}>
    <Button variant="ghost" className="w-full justify-start">
      {icon}
      {label}
    </Button>
  </Link>
);

const ServiceLink: React.FC<{
  href: string;
  label: string;
  onClick: () => void;
}> = ({ href, label, onClick }) => (
  <Link href={href} onClick={onClick}>
    <Button variant="ghost" className="w-full justify-start text-sm">
      {label}
    </Button>
  </Link>
);

export default MobileNav;
