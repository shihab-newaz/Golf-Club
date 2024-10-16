// app/api/book-tee-time/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import dbConnect from '@/lib/mongoose';
import Booking from '@/models/Booking';
import User from '@/models/User';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { date, time, players } = await request.json();

  if (!date || !time || !players) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await dbConnect();

  try {
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const booking = new Booking({
      user: user._id,
      date: new Date(date),
      time,
      players,
      status: 'confirmed'
    });

    await booking.save();

    // Add booking to user's bookings array
    user.bookings.push(booking._id);
    await user.save();

    return NextResponse.json({ message: 'Booking successful', booking }, { status: 201 });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'An error occurred while booking' }, { status: 500 });
  }
}