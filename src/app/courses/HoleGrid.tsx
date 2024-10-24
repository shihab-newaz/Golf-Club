// app/courses/components/HoleGrid.tsx
import { getHoles } from './actions';
import HoleCard from './HoleCard';

interface HoleGridProps {
  courseId: string;
}

export default async function HoleGrid({ courseId }: HoleGridProps) {
  const holes = await getHoles(courseId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {holes.map((hole: any) => (
        <HoleCard key={hole._id} hole={hole} />
      ))}
    </div>
  );
}