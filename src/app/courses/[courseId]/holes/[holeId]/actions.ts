// app/courses/[courseId]/holes/[holeId]/actions.ts
"use server"

import dbConnect from "@/lib/mongoose";
import Hole from "@/models/Hole";
import { cache } from "react";

export const getHoleDetails = cache(async (courseId: string, holeId: string) => {
  await dbConnect();
  const hole = await Hole.findById(holeId);
  return hole ? JSON.parse(JSON.stringify(hole)) : null;
});