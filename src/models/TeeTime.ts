// app/models/TeeTime.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ITeeTime extends Document {
  date: Date;
  time: string;
  course: mongoose.Types.ObjectId;
  maxPlayers?: number;
  availableSlots?: number;
  price: number;
  isAvailable: boolean;
}

const TeeTimeSchema: Schema = new Schema(
  {
    date: { type: Date, required: true },
    time: { type: String, required: true },
    course: { type: mongoose.Types.ObjectId, ref: "Course", required: true },
    maxPlayers: { type: Number, default: 4 },
    availableSlots: { type: Number, default: 4 },
    price: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness of date and time combination
TeeTimeSchema.index({ date: 1, time: 1 }, { unique: true });

const TeeTime = mongoose.models.TeeTime || mongoose.model<ITeeTime>("TeeTime", TeeTimeSchema);

export default TeeTime;