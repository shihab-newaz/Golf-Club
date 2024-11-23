// app/courses/components/HoleGrid.tsx
import { getHoles } from "./actions";
import HoleCard from "./HoleCard";
import Image from "next/image";

interface HoleGridProps {
  courseId: string;
}

export default async function HoleGrid({ courseId }: HoleGridProps) {
  const holes = await getHoles(courseId);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course Layout Section */}
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-6 text-center">Course Layout</h1>
        <div className="relative w-full aspect-[1.375/1] max-w-5xl mx-auto overflow-hidden rounded-lg shadow-lg">
          <Image
            src="/courses/layout.jpg"
            alt="Course Layout"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Optional Image Caption */}
        <p className="text-sm text-center text-muted-foreground mt-2">
          Full course layout view with all 18 holes
        </p>
      </section>

      {/* Hole Layout Section */}
      <section>
        <h1 className="text-3xl font-bold mb-6 text-center">Hole Layout</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {holes.map((hole: any) => (
            <HoleCard key={hole._id} hole={hole} courseId={courseId} />
          ))}
        </div>
      </section>
    </div>
  );
}