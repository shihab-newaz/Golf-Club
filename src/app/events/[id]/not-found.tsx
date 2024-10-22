// app/events/[id]/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center px-4">
        <Calendar className="mx-auto h-24 w-24 text-gray-400 mb-8" />
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Event Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          The event you're looking for might have been cancelled, removed, or never existed.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/events">
            <Button variant="default">
              View All Events
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}