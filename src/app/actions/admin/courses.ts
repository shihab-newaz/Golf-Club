// app/admin/courses/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/mongoose";
import { checkRole, handleAuthError } from "../auth";
import Course,{ ICourse } from "@/models/Course";

export async function getCourses() {
  try {
    await dbConnect();
    const courses = await Course.find();
    return JSON.parse(JSON.stringify(courses));
  } catch (error) {
    return handleAuthError(error);
  }
}
export async function getCourseById(id: string): Promise<ICourse | null> {
  try {
    await dbConnect();
    
    const course = await Course.findById(id);
    if (!course) {
      throw new Error("Course not found");
    }
    
    return JSON.parse(JSON.stringify(course));
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}
export async function deleteCourse(id: string) {
  try {
    await checkRole(["admin"]);
    await dbConnect();
    await Course.findByIdAndDelete(id);
    revalidatePath("/admin/courses");
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function addCourse(courseData: any) {
  try {
    await checkRole(["admin"]);
    await dbConnect();
    const newCourse = new Course(courseData);
    await newCourse.save();
    revalidatePath("/admin/courses");
    return JSON.parse(JSON.stringify(newCourse));
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function updateCourse(id: string, courseData: any) {
  try {
    await checkRole(["admin"]);
    await dbConnect();
    const updatedCourse = await Course.findByIdAndUpdate(id, courseData, {
      new: true,
    });
    revalidatePath("/admin/courses");
    return JSON.parse(JSON.stringify(updatedCourse));
  } catch (error) {
    return handleAuthError(error);
  }
}
