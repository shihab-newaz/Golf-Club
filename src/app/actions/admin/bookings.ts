// app/actions/admin/bookings.ts
import { checkRole, handleAuthError } from "../auth";
import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/mongoose";
import Booking from "@/models/Booking";


export async function getBookings() {
  try {
    await checkRole(["admin"]);
    await dbConnect();
    const bookings = await Booking.find()
      .populate("user", "name")
      .populate("teeTime", "date time");
    return JSON.parse(JSON.stringify(bookings));
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function deleteBooking(id: string) {
  try {
    await checkRole(["admin"]);
    await dbConnect();
    await Booking.findByIdAndDelete(id);
    revalidatePath("/admin/bookings");
  } catch (error) {
    return handleAuthError(error);
  }
}
export async function addBooking(bookingData: any) {
  try {
    await checkRole(["admin"]);
    await dbConnect();
    if (!bookingData.expiresAt) {
      bookingData.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    }
    const newBooking = new Booking(bookingData);
    await newBooking.save();

    const populatedBooking = await Booking.findById(newBooking._id) // Fetch the newly created booking with populated fields
      .populate("user", "name")
      .populate("teeTime", "date time")
      .populate("resortRoom", "roomNumber");

    revalidatePath("/admin/bookings");
    return JSON.parse(JSON.stringify(populatedBooking));
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function updateBooking(id: string, bookingData: any) {
  try {
    await checkRole(["admin"]);
    await dbConnect();
    if (!bookingData.expiresAt) {
      const existingBooking = await Booking.findById(id);
      bookingData.expiresAt =
        existingBooking?.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
    const updatedBooking = await Booking.findByIdAndUpdate(id, bookingData, {
      new: true,
    })
      .populate("user", "name")
      .populate("teeTime", "date time");
    revalidatePath("/admin/bookings");
    return JSON.parse(JSON.stringify(updatedBooking));
  } catch (error) {
    return handleAuthError(error);
  }
}
