import Link from "next/link";
import { LogIn, User } from "lucide-react";
import { signOut } from "next-auth/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const navLinks = [
  { href: "/courses", label: "COURSE" },
  { href: "/events", label: "EVENTS" },
];

const serviceLinks = [
  { href: "/booking", title: "Tee Time Booking" },
  { href: "/booking", title: "Accommodation" },
  { href: "/services/location", title: "Location" },
  { href: "/services/airport-pickup", title: "Airport Pickup" },
  { href: "/services/local-trip", title: "Local Trip" },
  { href: "/subscription", title: "Senior Membership" },
];

const NavItem: React.FC<{ href: string; label: string }> = ({
  href,
  label,
}) => (
  <NavigationMenuItem>
    <Link href={href} legacyBehavior passHref>
      <NavigationMenuLink className="px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors duration-200 backdrop-blur-sm rounded-md">
        {label}
      </NavigationMenuLink>
    </Link>
  </NavigationMenuItem>
);

const DesktopNav: React.FC<{ session: any }> = ({ session }) => (
  <NavigationMenu>
    <NavigationMenuList>
      {navLinks.map((link) => (
        <NavItem key={link.href} href={link.href} label={link.label} />
      ))}
      <ServicesMenu />
      {session ? <UserMenu session={session} /> : <LoginItem />} 
      <NavItem href="/about" label="ABOUT US" />  
    </NavigationMenuList>
  </NavigationMenu>
);

const UserMenu: React.FC<{ session: any }> = ({ session }) => {
  const isAdmin = session?.user?.role === 'admin';
  const dashboardLink = isAdmin ? "/admin" : "/dashboard";
  const settingsLink = isAdmin ? "/admin" : "/settings";

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="px-4 py-2 text-sm font-medium bg-transparent hover:bg-white/10 hover:text-white transition-colors duration-200 ">
        <User className="mr-2 h-5 w-5" />
        <span>{session.user?.name}</span>
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid gap-3 p-4 lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
          <UserProfileLink session={session} />
          <MenuLink
            href={dashboardLink}
            title={isAdmin ? "Admin Dashboard" : "Dashboard"}
            description={isAdmin ? "Manage club settings and users" : "View your stats and activity"}
          />
          <MenuLink
            href={settingsLink}
            title="Settings"
            description="Manage your preferences"
          />
          <SignOutButton />
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

const UserProfileLink: React.FC<{ session: any }> = ({ session }) => (
  <li className="row-span-3">
    <NavigationMenuLink asChild>
      <a
        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline 
        outline-none focus:shadow-md hover:text-white"
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
);

const MenuLink: React.FC<{
  href: string;
  title: string;
  description: string;
}> = ({ href, title, description }) => (
  <li>
    <NavigationMenuLink asChild>
      <a
        href={href}
        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 "
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {description}
        </p>
      </a>
    </NavigationMenuLink>
  </li>
);

const SignOutButton: React.FC = () => (
  <li>
    <button
      onClick={() => signOut()}
      className="w-full text-left select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 "
    >
      <div className="text-sm font-medium leading-none">Sign out</div>
      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
        Log out of your account
      </p>
    </button>
  </li>
);

const LoginItem: React.FC = () => (
  <NavigationMenuItem>
    <Link href="/login" legacyBehavior passHref>
      <NavigationMenuLink className="px-4 py-2 text-sm font-medium flex items-center hover:bg-white/10 transition-colors duration-200  rounded-md">
        <LogIn className="mr-2 h-5 w-5" />
        LOGIN
      </NavigationMenuLink>
    </Link>
  </NavigationMenuItem>
);

const ServicesMenu: React.FC = () => (
  <NavigationMenuItem>
    <NavigationMenuTrigger className="px-4 py-2 text-sm font-medium bg-transparent hover:bg-white/10 hover:text-white transition-colors duration-200 ">
      SERVICES
    </NavigationMenuTrigger>
    <NavigationMenuContent>
      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
        {serviceLinks.map((link) => (
          <ServiceLink key={link.href} href={link.href} title={link.title} />
        ))}
      </ul>
    </NavigationMenuContent>
  </NavigationMenuItem>
);

const ServiceLink: React.FC<{ href: string; title: string }> = ({
  href,
  title,
}) => (
  <li>
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 "
      >
        <div className="text-sm font-medium leading-none">{title}</div>
      </Link>
    </NavigationMenuLink>
  </li>
);

export default DesktopNav;