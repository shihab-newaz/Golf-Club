// app/admin/teetimes/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/mongoose";
import { checkRole, handleAuthError } from "../auth";
import TeeTime from "@/models/TeeTime";
import Course from "@/models/Course";



export async function getTeeTimes() {
  await dbConnect();
  const teeTimes = await TeeTime.find().populate("course", "name");
  return JSON.parse(JSON.stringify(teeTimes));
}

export async function deleteTeeTime(id: string) {
  try {
    await dbConnect();
    await TeeTime.findByIdAndDelete(id);
    revalidatePath("/admin/teetimes");
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function addTeeTime(teeTimeData: any) {
  try {
    await checkRole(["admin"]);
    await dbConnect();

    // Find the course by name
    const course = await Course.findOne({ name: teeTimeData.course });
    if (!course) throw new Error("Course not found");

    const newTeeTime = new TeeTime({
      date: teeTimeData.date,
      time: teeTimeData.time,
      course: course._id,
      availableSlots: teeTimeData.availableSlots,
    });

    await newTeeTime.save();
    await newTeeTime.populate("course", "name");

    revalidatePath("/admin/teetimes");
    return JSON.parse(JSON.stringify(newTeeTime));
  } catch (error) {
    return handleAuthError(error);
  }
}
export async function updateTeeTime(id: string, teeTimeData: any) {
  try {
    await checkRole(["admin"]);
    await dbConnect();

    // Find the course by name
    const course = await Course.findOne({ name: teeTimeData.course });
    if (!course) throw new Error("Course not found");

    const updatedTeeTime = await TeeTime.findByIdAndUpdate(
      id,
      {
        date: teeTimeData.date,
        time: teeTimeData.time,
        course: course._id,
        availableSlots: teeTimeData.availableSlots,
      },
      { new: true }
    ).populate("course", "name");

    revalidatePath("/admin/teetimes");
    return JSON.parse(JSON.stringify(updatedTeeTime));
  } catch (error) {
    return handleAuthError(error);
  }
}
