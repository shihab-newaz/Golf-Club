import "@/styles/globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { Navbar, Footer } from "@/components";
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Golf Club Website",
  description: "A minimalist golf club website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider>
          <ThemeProvider defaultTheme="system" enableSystem>
            <Navbar />
            <main className="">{children}</main>
            <Toaster />
            <Footer />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
