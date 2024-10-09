// app/api/update-user-tier/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, tier } = await req.json();

    if (!email || !tier) {
      return NextResponse.json({ message: 'Email and tier are required' }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { tier },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User tier updated successfully', user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Error updating user tier:', error);
    return NextResponse.json({ message: 'An error occurred while updating user tier' }, { status: 500 });
  }
}