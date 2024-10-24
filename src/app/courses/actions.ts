// app/courses/actions.ts
'use server'

import dbConnect from '@/lib/mongoose';
import { Course } from '@/models/Course';
import { Hole } from '@/models/Hole';
import { cache } from 'react';

export const getCourses = cache(async () => {
  await dbConnect();
  const courses = await Course.find({});
  return JSON.parse(JSON.stringify(courses));
});

export const getHoles = cache(async (courseId: string) => {
  await dbConnect();
  const course = await Course.findById(courseId).populate('holes');
  return JSON.parse(JSON.stringify(course.holes));
});