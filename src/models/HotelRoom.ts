import exp from "constants";
import mongoose, { Document, Schema } from "mongoose";

export interface IHotelRoom extends Document {
  roomNumber: string;
  type: "standard" | "deluxe" | "suite";
  capacity: number;
  pricePerNight: number;
  amenities?: string[];
  isAvailable: boolean;
  description?: string;
}

const HotelRoomSchema: Schema = new Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["standard", "deluxe", "suite"],
      required: true,
    },
    capacity: { type: Number, required: true, min: 1 },
    pricePerNight: { type: Number, required: true },
    amenities: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    description: { type: String },
  },
  { timestamps: true }
);

const HotelRoom =  mongoose.models.HotelRoom || mongoose.model<IHotelRoom>("HotelRoom", HotelRoomSchema);
export default HotelRoom;
