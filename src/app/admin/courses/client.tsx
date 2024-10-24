// app/admin/courses/AdminCoursesPageClient.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CourseForm } from "./form";
import { deleteCourse, addCourse, updateCourse } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CourseDetailsDialog from "./details";

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

interface AdminCoursesPageProps {
  initialCourses: Course[];
}

export default function CoursesClient({
  initialCourses,
}: AdminCoursesPageProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleSubmit = async (courseData: Partial<Course>) => {
    setIsLoading(true);
    setError(null);

    try {
      if (editingCourse) {
        const updatedCourse = await updateCourse(editingCourse._id, courseData);
        setCourses(
          courses.map((course) =>
            course._id === updatedCourse._id ? updatedCourse : course
          )
        );
      } else {
        const newCourse = await addCourse(courseData);
        setCourses([...courses, newCourse]);
      }
      setIsFormOpen(false);
      setEditingCourse(null);
    } catch (err) {
      console.error(err);
      setError(
        editingCourse ? "Failed to update course" : "Failed to add course"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setIsLoading(true);
      try {
        await deleteCourse(id);
        setCourses(courses.filter((course) => course._id !== id));
      } catch (err) {
        console.error(err);
        setError("Failed to delete course");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Courses</h1>
      <Button className="mb-4 text-white" onClick={() => setIsFormOpen(true)}>
        Add New Course
      </Button>

      <CourseForm
        course={editingCourse ?? undefined}
        onSubmit={handleSubmit}
        isOpen={isFormOpen || !!editingCourse}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingCourse(null);
        }}
      />

      {/* Desktop view */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Holes</TableHead>
              <TableHead>Par</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.holes}</TableCell>
                <TableCell>{course.par}</TableCell>
                <TableCell>{course.difficulty}</TableCell>
                <TableCell>{course.isOpen ? "Open" : "Closed"}</TableCell>
                <TableCell>
                  <CourseDetailsDialog course={course} />

                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => {
                      setEditingCourse(course);
                      setIsFormOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(course._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {courses.map((course) => (
          <Card key={course._id}>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Holes: {course.holes}</p>
              <p>Par: {course.par}</p>
              <p>Difficulty: {course.difficulty}</p>
              <p>Status: {course.isOpen ? "Open" : "Closed"}</p>
              <div className="mt-4 space-x-2">
                <CourseDetailsDialog course={course} />

                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingCourse(course);
                    setIsFormOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(course._id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
