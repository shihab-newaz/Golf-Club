// app/home/actions.ts
'use server'

import dbConnect from "@/lib/mongoose";
import Course from "@/models/Course";
import { cache } from 'react';
import { RawCourse, FeaturedCourse } from "@/types/course";

export const getFeaturedCourses = cache(async (): Promise<FeaturedCourse[]> => {
  try {
    await dbConnect();
    
    // First, let's see what fields are available in our courses
    const allCourses = await Course.find({})
      .lean()
      .exec();
    
    console.log('Available course fields:', Object.keys(allCourses[0] || {}));
    console.log('Sample course data:', allCourses[0]);

    // Now fetch the courses we want
    const courses = await Course.find({})
      .select('name description imageUrl difficulty par length rating')
      .limit(6)
      .lean<RawCourse[]>();

    const transformedCourses = courses.map(course => ({
      id: course._id.toString(),
      name: course.name,
      description: course.description || 'A beautiful golf course',
      imageUrl: course.imageUrl || '/images/course-placeholder.jpg',
      difficulty: course.difficulty || 'medium',
      par: course.par || 72,
      length: course.length || 6500,
      rating: course.rating || 4.5,
      isOpen: true,
    }));

    // console.log('Transformed courses:', transformedCourses);
    return transformedCourses;
  } catch (error) {
    console.error('Error in getFeaturedCourses:', error);
    throw error; // Let the error boundary handle it
  }
});