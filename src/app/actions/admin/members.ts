// app/admin/members/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/mongoose";
import { checkRole, handleAuthError } from "../auth";
import User from "@/models/User";



export async function getMembers() {
  try {
    await checkRole(["admin"]);
    await dbConnect();
    const members = await User.find({ role: "member" }).select("-password");
    return JSON.parse(JSON.stringify(members));
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function addMember(memberData: any) {
  try {
    await checkRole(["admin"]);
    await dbConnect();
    const newMember = new User({ ...memberData, role: "member" });
    await newMember.save();
    revalidatePath("/admin/members");
    return JSON.parse(JSON.stringify(newMember));
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function updateMember(id: string, memberData: any) {
  try {
    await checkRole(["admin"]);
    await dbConnect();
    const updatedMember = await User.findByIdAndUpdate(id, memberData, {
      new: true,
    }).select("-password");
    revalidatePath("/admin/members");
    return JSON.parse(JSON.stringify(updatedMember));
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function deleteMember(id: string) {
  try {
    await checkRole(["admin"]);
    await dbConnect();
    await User.findByIdAndDelete(id);
    revalidatePath("/admin/members");
  } catch (error) {
    return handleAuthError(error);
  }
}
