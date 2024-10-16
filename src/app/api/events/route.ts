// app/api/events/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import dbConnect from '@/lib/mongoose';
import Event from '@/models/Event';
import User from '@/models/User';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, date, startTime, endTime, capacity } = await request.json();

  if (!title || !description || !date || !startTime || !endTime || !capacity) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await dbConnect();

  try {
    const admin = await User.findOne({ email: session.user.email });

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    const event = new Event({
      title,
      description,
      date: new Date(date),
      startTime,
      endTime,
      capacity,
      createdBy: admin._id
    });

    await event.save();

    return NextResponse.json({ message: 'Event created successfully', event }, { status: 201 });
  } catch (error) {
    console.error('Event creation error:', error);
    return NextResponse.json({ error: 'An error occurred while creating the event' }, { status: 500 });
  }
}

export async function GET(request: Request) {
    await dbConnect();
  
    try {
      const events = await Event.find().populate('createdBy', 'name email');
      return NextResponse.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json({ error: 'An error occurred while fetching events' }, { status: 500 });
    }
  }