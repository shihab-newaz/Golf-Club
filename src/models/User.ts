// app/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;  
  role: 'member' | 'admin';
  membershipTier: 'free'| 'silver' | 'gold' | 'platinum';
  bookings: mongoose.Types.ObjectId[];  // One-to-Many: One user can have many bookings
  events: mongoose.Types.ObjectId[];    // Many-to-Many: Users can register for many events
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true }, 
  role: { type: String, enum: ['member', 'admin'], default: 'member' },
  membershipTier: { type: String, enum: ['free','silver', 'gold', 'platinum'], default: 'free' },
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
  events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User