import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  teeTime: mongoose.Types.ObjectId;
  resortRoom?: mongoose.Types.ObjectId;  // New field for resort room booking
  phoneNumber: string;
  players: number;
  status: "n/a" | "pending" | "confirmed" | "cancelled" | "completed";
  checkInDate?: Date;  // New field for room booking
  checkOutDate?: Date;  // New field for room booking
  available: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    teeTime: { type: mongoose.Types.ObjectId, ref: "TeeTime", required: true },
    resortRoom: { type: mongoose.Types.ObjectId, ref: "ResortRoom" },  // New field
    phoneNumber: { type: String, required: true },
    players: { type: Number, required: true, min: 1, max: 4 },
    status: {
      type: String,
      enum: ["n/a", "pending", "confirmed", "cancelled", "completed"],
      default: "n/a",
    },
    checkInDate: { type: Date },  // New field
    checkOutDate: { type: Date },  // New field
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);