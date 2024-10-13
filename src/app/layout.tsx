import "@/styles/globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { Navbar, Footer } from "@/components";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "DCC - Luxury Golf Club ",
  description: "Experience golfing excellence at DCC. Enjoy pristine courses, luxury amenities, and exclusive memberships in a stunning setting.",
  keywords: "golf club, luxury golf, DCC, golf membership, golf course",
  authors: [{ name: "DCC" }],
  creator: "KGC",
  publisher: "KGC",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://kgc.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "DCC - Luxury Golf Club Experience",
    description: "Experience golfing excellence at KGC. Enjoy pristine courses, luxury amenities, and exclusive memberships in a stunning setting.",
    url: 'https://kgc.vercel.app',
    siteName: 'KGC Golf Club',
    images: [
      {
        url: 'https://kgc.vercel.app/og-image.jpg', // Make sure to add this image to your public folder
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
    images: ['https://kgc.vercel.app/twitter-image.jpg'],
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
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}