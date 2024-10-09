// app/models/Event.ts
import mongoose, { Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  date: string;
  image: string;
}

const EventSchema = new mongoose.Schema<IEvent>({
  title: {
    type: String,
    required: [true, 'Please provide a title for this event.'],
    maxlength: [60, 'Title cannot be more than 60 characters'],
  },
  date: {
    type: String,
    required: [true, 'Please provide the date for this event.'],
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL for this event.'],
  },
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);