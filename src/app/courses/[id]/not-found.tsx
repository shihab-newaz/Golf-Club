// app/courses/[id]/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Course Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          The course you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/courses">
          <Button>
            Return to Courses
          </Button>
        </Link>
      </div>
    </div>
  );
}