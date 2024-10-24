// app/admin/courses/page.tsx
import { Suspense } from 'react'
import CourseList from './client'
import { getCourses } from './actions'

export default async function AdminCoursesPage() {
  const initialCourses = await getCourses()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Golf Courses</h1>
      <Suspense fallback={<div>Loading courses...</div>}>
        <CourseList initialCourses={initialCourses} />
      </Suspense>
    </div>
  )
}