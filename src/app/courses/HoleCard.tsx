// app/courses/HoleCard.tsx
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Add this import
import { IHole } from "@/models/Hole";
import { Waves, Shell, ArrowRight } from "lucide-react"; // Add ArrowRight import
import Link from "next/link";

interface HoleCardProps {
  hole: IHole;
  courseId: string;
}

export default function HoleCard({ hole, courseId }: HoleCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-[#fae8b4] dark:bg-background">
      <div className="grid grid-cols-2 h-full">
        {/* Image Section */}
        <div className="relative">
          <div className="relative w-full h-full min-h-[300px]">
            <Image
              src={hole.imageUrl}
              alt={`Hole ${hole.number}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover object-center"
              priority={hole.number === 1}
            />
            <div className="absolute top-2 left-2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              Hole {hole.number}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-3 flex flex-col justify-between">
          <div>
            <div className="mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Par {hole.par}
              </h3>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Handicap {hole.handicapStroke}
              </p>
            </div>

            {/* Yardages */}
            <div className="space-y-1 text-xs font-medium">
              <div className="text-red-700 dark:text-red-500 flex justify-between">
                <span>Red:</span>
                <span>{hole.yardages.red}y</span>
              </div>
              <div className="text-gray-800 dark:text-white flex justify-between">
                <span>White:</span>
                <span>{hole.yardages.white}y</span>
              </div>
              <div className="text-amber-600 dark:text-yellow-500 flex justify-between">
                <span>Yellow:</span>
                <span>{hole.yardages.yellow}y</span>
              </div>
              <div className="text-blue-700 dark:text-blue-500 flex justify-between">
                <span>Blue:</span>
                <span>{hole.yardages.blue}y</span>
              </div>
            </div>
          </div>

          {/* Hazards */}
          <div className="space-y-2">
            <div className="flex flex-col gap-1">
              {(hole.waterHazards.left ||
                hole.waterHazards.right ||
                hole.waterHazards.front) && (
                <div className="flex items-center gap-1">
                  <Waves className="h-3 w-3 text-blue-700 dark:text-blue-500" />
                  <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                    Water
                  </span>
                </div>
              )}

              {hole.bunkers.count > 0 && (
                <div className="flex items-center gap-1">
                  <Shell className="h-3 w-3 text-amber-600 dark:text-yellow-600" />
                  <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                    {hole.bunkers.count} Bunkers
                  </span>
                </div>
              )}
            </div>

            {/* See Details Button */}
            <Link href={`/courses/${courseId}/holes/${hole._id}`}>
              <Button 
                className="w-full mt-2 bg-green-700 hover:bg-green-800 text-white dark:bg-green-600 dark:hover:bg-green-700"
                size="sm"
              >
                See Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}