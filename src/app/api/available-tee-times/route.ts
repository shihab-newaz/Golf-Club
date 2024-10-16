// app/api/available-tee-times/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Booking from '@/models/Booking';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  await dbConnect();

  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  const availableSlots = await Booking.find({
    date: { $gte: startDate, $lt: endDate },
    available: true,
  }).sort('time');

  return NextResponse.json(availableSlots);
}