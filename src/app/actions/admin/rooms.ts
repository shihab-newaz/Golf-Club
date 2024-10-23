// app/admin/hotel-rooms/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/mongoose";
import { checkRole, handleAuthError } from "../auth";
import HotelRoom from "@/models/HotelRoom";


export async function getHotelRooms() {
  try {
    await checkRole(["admin"]);
    await dbConnect();
    const rooms = await HotelRoom.find();
    return JSON.parse(JSON.stringify(rooms));
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function addHotelRoom(roomData: any) {
  try {
    await checkRole(["admin"]);
    await dbConnect();
    const newRoom = new HotelRoom(roomData);
    await newRoom.save();
    revalidatePath("/admin/hotel-rooms");
    return JSON.parse(JSON.stringify(newRoom));
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function updateHotelRoom(id: string, roomData: any) {
  try {
    await checkRole(["admin"]);
    await dbConnect();
    const updatedRoom = await HotelRoom.findByIdAndUpdate(id, roomData, {
      new: true,
    });
    revalidatePath("/admin/hotel-rooms");
    return JSON.parse(JSON.stringify(updatedRoom));
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function deleteHotelRoom(id: string) {
  try {
    await checkRole(["admin"]);
    await dbConnect();
    await HotelRoom.findByIdAndDelete(id);
    revalidatePath("/admin/hotel-rooms");
  } catch (error) {
    return handleAuthError(error);
  }
}
