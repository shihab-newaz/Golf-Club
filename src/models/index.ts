// lib/models/index.ts
import mongoose from 'mongoose';
import { ICourse, CourseSchema } from './Course';
import { ITeeTime, TeeTimeSchema } from './TeeTime';
import { IBooking, BookingSchema } from './Booking';

// Define the models object type
interface Models {
  Course: mongoose.Model<ICourse>;
  TeeTime: mongoose.Model<ITeeTime>;
  Booking: mongoose.Model<IBooking>;
}

// Create and export the models
export const Models: Models = {
  Course: mongoose.models.Course || mongoose.model('Course', CourseSchema),
  TeeTime: mongoose.models.TeeTime || mongoose.model('TeeTime', TeeTimeSchema),
  Booking: mongoose.models.Booking || mongoose.model('Booking', BookingSchema),
};

export default Models;