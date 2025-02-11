import "@/styles/globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { Navbar, Footer } from "@/components";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: "Daeho Country Club ",
  description: "Experience golfing excellence at Daeho Country Club. Enjoy pristine courses, luxury amenities, and exclusive memberships in a stunning setting.",
  keywords: "golf club, luxury golf, DCC, golf membership, golf course, daeho, daeho country club",
  authors: [{ name: "Shihab Newaz" }],
  creator: "Shihab Newaz",
  publisher: "Shihab Newaz",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://daehocc.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "DCC - Luxury Golf Club Experience",
    description: "Experience golfing excellence at KGC. Enjoy pristine courses, luxury amenities, and exclusive memberships in a stunning setting.",
    url: 'https://daehocc.com',
    siteName: 'Daeho Country Club',
    images: [
      {
        url: 'https://daehocc.com/og-image.jpg', 
        width: 1200,
        height: 630,
        alt: 'DCC Golf Club',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: "DCC - Luxury Golf Club Experience",
    description: "Experience golfing excellence at KGC. Enjoy pristine courses, luxury amenities, and exclusive memberships in a stunning setting.",
    images: ['https://daehocc.com/twitter-image.jpg'],
    creator: '@shihab_newaz', 
  },

  category: 'sports',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <SessionProvider>
          <ThemeProvider defaultTheme="system" enableSystem>
            <Navbar />
            <main className="">{children}</main>
            <Toaster />
            <Footer />
            <Analytics />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}