// app/actions/courses.ts
'use server'

import dbConnect from "@/lib/mongoose";
import Course from "@/models/Course";
import { Types } from "mongoose";

// Raw course data from MongoDB
interface RawCourse {
  _id: Types.ObjectId;
  name: string;
  description: string;
  holes: number;
  par: number;
  length: number;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
  isOpen: boolean;
}

// Transformed course data for client use
export interface CourseData {
  id: string;
  name: string;
  description: string;
  holes: number;
  par: number;
  length: number;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
  isOpen: boolean;
}

export async function getAllCourses(): Promise<CourseData[]> {
  try {
    await dbConnect();
    const courses = await Course.find({})
      .lean<RawCourse[]>()
      .exec();

    return courses.map((course) => ({
      id: course._id.toString(),
      name: course.name,
      description: course.description,
      holes: course.holes,
      par: course.par,
      length: course.length,
      difficulty: course.difficulty,
      imageUrl: course.imageUrl,
      isOpen: course.isOpen,
    }));
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export async function getCourseById(id: string): Promise<CourseData | null> {
  try {
    await dbConnect();
    const course = await Course.findById(id)
      .lean<RawCourse>()
      .exec();

    if (!course) return null;

    return {
      id: course._id.toString(),
      name: course.name,
      description: course.description,
      holes: course.holes,
      par: course.par,
      length: course.length,
      difficulty: course.difficulty,
      imageUrl: course.imageUrl,
      isOpen: course.isOpen,
    };
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

export async function getOpenCourses(): Promise<CourseData[]> {
  try {
    await dbConnect();
    const courses = await Course.find({ isOpen: true })
      .lean<RawCourse[]>()
      .exec();

    return courses.map((course) => ({
      id: course._id.toString(),
      name: course.name,
      description: course.description,
      holes: course.holes,
      par: course.par,
      length: course.length,
      difficulty: course.difficulty,
      imageUrl: course.imageUrl,
      isOpen: course.isOpen,
    }));
  } catch (error) {
    console.error('Error fetching open courses:', error);
    return [];
  }
}