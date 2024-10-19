// app/admin/courses/page.tsx
import { Suspense } from 'react';
import CoursesClient from './CoursesClient';
import { getCourses } from './actions';

export default async function AdminCoursesPage() {
  const initialCourses = await getCourses();

  return (
    <Suspense fallback={<div>Loading courses...</div>}>
      <CoursesClient initialCourses={initialCourses} />
    </Suspense>
  );
}