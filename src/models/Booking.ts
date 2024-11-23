import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  teeTime: mongoose.Types.ObjectId;
  room?: mongoose.Types.ObjectId;
  phoneNumber: string;
  players: number;
  status: "n/a" | "pending" | "confirmed" | "cancelled" | "completed";
  available: boolean;
  checkInDate?: Date;
  checkOutDate?: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const BookingSchema: Schema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    teeTime: { type: mongoose.Types.ObjectId, ref: "TeeTime", required: true },
    room: { type: mongoose.Types.ObjectId, ref: "HotelRoom" },
    phoneNumber: { type: String, required: true },
    players: { type: Number, required: true, min: 1, max: 4 },
    status: {
      type: String,
      enum: ["n/a", "pending", "confirmed", "cancelled", "completed"],
      default: "n/a",
    },
    available: { type: Boolean, default: true },
    checkInDate: { type: Date },
    checkOutDate: { type: Date },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const Booking =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
export default Booking;
