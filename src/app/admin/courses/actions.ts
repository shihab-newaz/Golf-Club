// app/admin/courses/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from "@/lib/mongoose"
import  Course  from "@/models/Course"
import  Hole  from "@/models/Hole"

export async function getCourses() {
  await dbConnect()
  const courses = await Course.find().populate('holes')
  return JSON.parse(JSON.stringify(courses))
}

export async function deleteCourse(id: string) {
  await dbConnect()
  await Course.findByIdAndDelete(id)
  revalidatePath('/admin/courses')
}

export async function addCourse(courseData: any) {
  await dbConnect()
  const newCourse = new Course(courseData)
  await newCourse.save()
  revalidatePath('/admin/courses')
  return JSON.parse(JSON.stringify(newCourse))
}

export async function updateCourse(id: string, courseData: any) {
  await dbConnect()
  const updatedCourse = await Course.findByIdAndUpdate(id, courseData, { new: true })
  revalidatePath('/admin/courses')
  return JSON.parse(JSON.stringify(updatedCourse))
}
