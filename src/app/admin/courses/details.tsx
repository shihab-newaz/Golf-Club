import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {LandPlot , CircleDot, Ruler, Gauge, CheckCircle2, Info, Image as ImageIcon } from 'lucide-react';

interface Course {
  _id: string;
  name: string;
  description?: string;
  holes: number;
  par: number;
  length?: number;
  difficulty: "easy" | "medium" | "hard";
  imageUrl?: string;
  isOpen: boolean;
}

interface CourseDetailsDialogProps {
  course: Course;
}

const CourseDetailsDialog: React.FC<CourseDetailsDialogProps> = ({ course }) => {
  // Get difficulty color based on level
  const getDifficultyColor = (difficulty: Course['difficulty']): string => {
    const difficultyColors: Record<Course['difficulty'], string> = {
      easy: 'text-green-500',
      medium: 'text-yellow-500',
      hard: 'text-red-500'
    };
    return difficultyColors[difficulty];
  };

  // Format length to include units
  const formatLength = (length?: number): string => {
    return length ? `${length.toLocaleString()} yards` : 'Not specified';
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          See More
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            Course Details
            <span className={`text-sm ${course.isOpen ? 'text-green-500' : 'text-red-500'}`}>
              ({course.isOpen ? 'Open' : 'Closed'})
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <LandPlot className="h-4 w-4" />
                  <span className="font-medium">Name:</span> {course.name}
                </p>
                <p className="flex items-center gap-2">
                  <CircleDot className="h-4 w-4" />
                  <span className="font-medium">Holes:</span> {course.holes}
                </p>
                <p className="flex items-center gap-2">
                  <CircleDot className="h-4 w-4" />
                  <span className="font-medium">Par:</span> {course.par}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Course Specifications */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Course Specifications</h3>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  <span className="font-medium">Length:</span> {formatLength(course.length)}
                </p>
                <p className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  <span className="font-medium">Difficulty:</span> 
                  <span className={`capitalize ${getDifficultyColor(course.difficulty)}`}>
                    {course.difficulty}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium">Status:</span>
                  <span className={course.isOpen ? 'text-green-500' : 'text-red-500'}>
                    {course.isOpen ? 'Open' : 'Closed'}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Description</h3>
              {course.description ? (
                <p className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-1" />
                  {course.description}
                </p>
              ) : (
                <p className="text-gray-500 italic flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  No description available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Image Information */}
          {course.imageUrl && (
            <Card className="md:col-span-2">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Course Image</h3>
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <img
                    src={course.imageUrl}
                    alt={`${course.name} course`}
                    className="object-cover w-full h-full"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseDetailsDialog;