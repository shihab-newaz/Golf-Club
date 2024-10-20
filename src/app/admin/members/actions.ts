// app/admin/members/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from "@/lib/mongoose"
import User from "@/models/User"

export async function getMembers() {
  await dbConnect()
  const members = await User.find({ role: 'member' }).select('-password')
  return JSON.parse(JSON.stringify(members))
}

export async function addMember(memberData: any) {
  await dbConnect()
  const newMember = new User({ ...memberData, role: 'member' })
  await newMember.save()
  revalidatePath('/admin/members')
  return JSON.parse(JSON.stringify(newMember))
}

export async function updateMember(id: string, memberData: any) {
  await dbConnect()
  const updatedMember = await User.findByIdAndUpdate(id, memberData, { new: true }).select('-password')
  revalidatePath('/admin/members')
  return JSON.parse(JSON.stringify(updatedMember))
}

export async function deleteMember(id: string) {
  await dbConnect()
  await User.findByIdAndDelete(id)
  revalidatePath('/admin/members')
}