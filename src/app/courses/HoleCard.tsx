// app/courses/components/HoleCard.tsx
'use client';

import Image from 'next/image';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { IHole } from '@/models/Hole';
import { Waves, Shell, Palmtree } from 'lucide-react';

interface HoleCardProps {
  hole: IHole;
}

export default function HoleCard({ hole }: HoleCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={hole.imageUrl}
            alt={`Hole ${hole.number}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 30vw"
            className="object-cover"
          />
          <div className="absolute top-2 left-2 bg-black/60 text-white px-3 py-1 rounded-full">
            Hole {hole.number}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-semibold">Par {hole.par}</h3>
            <p className="text-sm text-muted-foreground">
              Handicap {hole.handicapStroke}
            </p>
          </div>
          <div>
            <p className="text-sm">Layout: {hole.holeLayout.type}</p>
            <p className="text-sm">Width: {hole.holeLayout.fairwayWidth}</p>
          </div>
        </div>

        {/* Yardages */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Yardages</h4>
          <div className="grid grid-cols-4 gap-2 text-sm">
            <div className="text-red-500">Red: {hole.yardages.red}y</div>
            <div className="text-white">White: {hole.yardages.white}y</div>
            <div className="text-yellow-500">Yellow: {hole.yardages.yellow}y</div>
            <div className="text-blue-500">Blue: {hole.yardages.blue}y</div>
          </div>
        </div>

        {/* Hazards */}
        <div className="flex gap-4">
          {(hole.waterHazards.left || hole.waterHazards.right || hole.waterHazards.front) && (
            <div className="flex items-center gap-1">
              <Waves className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Water</span>
            </div>
          )}
          
          {hole.bunkers.count > 0 && (
            <div className="flex items-center gap-1">
              <Shell className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">{hole.bunkers.count} Bunkers</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}