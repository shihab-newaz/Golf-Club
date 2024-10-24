// app/models/Event.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  capacity: number;
  availableSpots: number;
  registeredUsers: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  imageUrl: string;  
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  capacity: { type: Number, required: true },
  availableSpots: { type: Number, default: 0 },
  registeredUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true }, 
}, { timestamps: true });

 const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
 export default Event;