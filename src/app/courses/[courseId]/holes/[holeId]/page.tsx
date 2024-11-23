// app/courses/[courseId]/holes/[holeId]/page.tsx
import { getHoleDetails } from './actions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Waves, Shell, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PageProps {
  params: {
    courseId: string;
    holeId: string;
  };
}

export default async function HoleDetailPage({ params }: PageProps) {
  const hole = await getHoleDetails(params.courseId, params.holeId);
  
  if (!hole) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-4 mt-20 sm:py-8 pt-20 sm:pt-24 dark:bg-gray-800 ">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link href={`/courses#hole-${hole.number}`}>
          <Button variant="ghost" className="mb-4 sm:mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="text-sm sm:text-base">Back to Course Layout</span>
          </Button>
        </Link>

        {/* Main Content */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Image Section */}
          <div className="relative w-full h-[500px] sm:h-[600px] lg:h-full rounded-lg overflow-hidden shadow-md">
            <Image
              src={hole.imageUrl}
              alt={`Hole ${hole.number}`}
              fill
              priority
              className="object-contain"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
            />
          </div>

          {/* Details Section */}
          <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                Hole {hole.number}
              </h1>
              <p className="text-lg sm:text-xl mb-2 sm:mb-4">Par {hole.par}</p>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {hole.description}
              </p>
            </div>

            {/* Yardages */}
            <div className="bg-card p-3 sm:p-4 rounded-lg shadow-sm">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Yardages
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
                <div className="text-red-600 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-red-600 mr-2"></span>
                  Red: {hole.yardages.red}y
                </div>
                <div className="text-gray-800 dark:text-white flex items-center">
                  <span className="w-3 h-3 rounded-full bg-gray-200 dark:bg-white mr-2"></span>
                  White: {hole.yardages.white}y
                </div>
                <div className="text-yellow-600 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
                  Yellow: {hole.yardages.yellow}y
                </div>
                <div className="text-blue-600 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-blue-600 mr-2"></span>
                  Blue: {hole.yardages.blue}y
                </div>
              </div>
            </div>

            {/* Hazards */}
            <div className="bg-card p-3 sm:p-4 rounded-lg shadow-sm">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Hazards
              </h2>
              <div className="space-y-3">
                {/* Water Hazards */}
                {(hole.waterHazards.left || hole.waterHazards.right || hole.waterHazards.front) && (
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <Waves className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span>
                      Water hazards: 
                      {[
                        hole.waterHazards.left && 'Left',
                        hole.waterHazards.right && 'Right',
                        hole.waterHazards.front && 'Front'
                      ].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
                
                {/* Bunkers */}
                {hole.bunkers.count > 0 && (
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <Shell className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                    <span>{hole.bunkers.count} Bunkers ({hole.bunkers.positions.join(', ')})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Layout Details */}
            <div className="bg-card p-3 sm:p-4 rounded-lg shadow-sm">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Hole Layout
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
                <div className="flex items-center">
                  <span className="font-medium mr-2">Type:</span>
                  {hole.holeLayout.type}
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Fairway:</span>
                  {hole.holeLayout.fairwayWidth}
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Green Size:</span>
                  {hole.green.size}
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Green Shape:</span>
                  {hole.green.shape}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}