// app/admin/holes/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from "@/lib/mongoose"
import  Hole  from "@/models/Hole"

export async function getHoles() {
  await dbConnect()
  const holes = await Hole.find().sort({ number: 1 })
  return JSON.parse(JSON.stringify(holes))
}

export async function deleteHole(id: string) {
  await dbConnect()
  await Hole.findByIdAndDelete(id)
  revalidatePath('/admin/holes')
}

export async function addHole(holeData: any) {
  await dbConnect()
  const newHole = new Hole(holeData)
  await newHole.save()
  revalidatePath('/admin/holes')
  return JSON.parse(JSON.stringify(newHole))
}

export async function updateHole(id: string, holeData: any) {
  await dbConnect()
  const updatedHole = await Hole.findByIdAndUpdate(id, holeData, { new: true })
  revalidatePath('/admin/holes')
  return JSON.parse(JSON.stringify(updatedHole))
}
