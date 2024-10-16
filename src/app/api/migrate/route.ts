import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';
import Booking from '@/models/Booking';
import Event from '@/models/Event';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: 'This route is not available in production' }, { status: 403 });
  }

  try {
    // Connect to your MongoDB database
    await mongoose.connect(process.env.MONGODB_URI as string);

    console.log('Connected to MongoDB. Starting migration...');

    // 1. Update User model
    console.log('Updating User model...');
    const users = await User.find({});
    for (const user of users) {
      if (!user.phoneNumber) {
        user.phoneNumber = 'Not provided'; // Default value
        await user.save();
      }
    }

    // 2. Update Booking model
    console.log('Updating Booking model...');
    const bookings = await Booking.find({});
    for (const booking of bookings) {
      if (booking.phoneNumber) {
        // Move phone number to associated user if it doesn't exist
        const user = await User.findById(booking.user);
        if (user && !user.phoneNumber) {
          user.phoneNumber = booking.phoneNumber;
          await user.save();
        }
        // Remove phoneNumber field from booking
        booking.phoneNumber = undefined;
        await booking.save();
      }
    }

    // 3. Update Event model
    console.log('Updating Event model...');
    const events = await Event.find({});
    for (const event of events) {
      if (event.contactPhoneNumber) {
        // Move contact phone number to created by user if it doesn't exist
        const user = await User.findById(event.createdBy);
        if (user && !user.phoneNumber) {
          user.phoneNumber = event.contactPhoneNumber;
          await user.save();
        }
        // Remove contactPhoneNumber field from event
        event.contactPhoneNumber = undefined;
        await event.save();
      }
    }

    await mongoose.disconnect();
    console.log('Migration completed successfully.');

    return NextResponse.json({ message: 'Migration completed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json({ message: 'Migration failed', error: error }, { status: 500 });
  }
}