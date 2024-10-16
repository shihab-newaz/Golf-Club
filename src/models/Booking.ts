// app/models/Booking.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;  // One-to-Many: One user can have many bookings
  phoneNumber: string;  
  date: Date;
  time: string;
  players: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  players: { type: Number, required: true, min: 1, max: 4 },
  status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);