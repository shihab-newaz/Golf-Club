// app/admin/courses/AdminCoursesPageClient.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteCourse, addCourse, updateCourse } from "./actions";

interface Course {
  _id: string;
  name: string;
  holes: number;
  par: number;
  length: number;
}

interface AdminCoursesPageProps {
  initialCourses: Course[];
}

export default function AdminCoursesPageClient({ initialCourses }: AdminCoursesPageProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setIsLoading(true);
      try {
        await deleteCourse(id);
        setCourses(courses.filter(course => course._id !== id));
      } catch (err) {
        console.error(err);
        setError('Failed to delete course');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddCourse = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const courseData = {
      name: formData.get('name') as string,
      holes: Number(formData.get('holes')),
      par: Number(formData.get('par')),
      length: Number(formData.get('length')),
    };

    try {
      const newCourse = await addCourse(courseData);
      setCourses([...courses, newCourse]);
      setIsAddCourseOpen(false);
    } catch (err) {
      console.error(err);
      setError('Failed to add course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCourse = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingCourse) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const courseData = {
      name: formData.get('name') as string,
      holes: Number(formData.get('holes')),
      par: Number(formData.get('par')),
      length: Number(formData.get('length')),
    };

    try {
      const updatedCourse = await updateCourse(editingCourse._id, courseData);
      setCourses(courses.map(course => 
        course._id === updatedCourse._id ? updatedCourse : course
      ));
      setEditingCourse(null);
    } catch (err) {
      console.error(err);
      setError('Failed to update course');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-2xl font-bold mb-4">Manage Courses</h1>
      <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">Add New Course</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCourse} className="space-y-4">
            <div>
              <Label htmlFor="name">Course Name</Label>
              <Input id="name" name="name" placeholder="Course Name" required />
            </div>
            <div>
              <Label htmlFor="holes">Number of Holes</Label>
              <Input id="holes" name="holes" type="number" min="9" max="18" required />
            </div>
            <div>
              <Label htmlFor="par">Par</Label>
              <Input id="par" name="par" type="number" required />
            </div>
            <div>
              <Label htmlFor="length">Length (yards)</Label>
              <Input id="length" name="length" type="number" required />
            </div>
            <Button type="submit">Add Course</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={!!editingCourse} onOpenChange={(open) => !open && setEditingCourse(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          {editingCourse && (
            <form onSubmit={handleUpdateCourse} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Course Name</Label>
                <Input id="edit-name" name="name" defaultValue={editingCourse.name} required />
              </div>
              <div>
                <Label htmlFor="edit-holes">Number of Holes</Label>
                <Input id="edit-holes" name="holes" type="number" min="9" max="18" defaultValue={editingCourse.holes} required />
              </div>
              <div>
                <Label htmlFor="edit-par">Par</Label>
                <Input id="edit-par" name="par" type="number" defaultValue={editingCourse.par} required />
              </div>
              <div>
                <Label htmlFor="edit-length">Length (yards)</Label>
                <Input id="edit-length" name="length" type="number" defaultValue={editingCourse.length} required />
              </div>
              <Button type="submit">Update Course</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Holes</TableHead>
            <TableHead>Par</TableHead>
            <TableHead>Length (yards)</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell>{course.name}</TableCell>
              <TableCell>{course.holes}</TableCell>
              <TableCell>{course.par}</TableCell>
              <TableCell>{course.length}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2" onClick={() => setEditingCourse(course)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(course._id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}