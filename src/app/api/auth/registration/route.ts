// app/api/auth/registration/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'

export async function POST(req: Request) {
  try {
    await dbConnect()

    const { name,username, email, password, phoneNumber, membershipTier = 'free' } = await req.json()
    
    // Validate membershipTier
    if (!['free','silver', 'gold', 'platinum'].includes(membershipTier)) {
      return NextResponse.json({ message: 'Invalid membership tier' }, { status: 400 })
    }

    // Validate phoneNumber (you might want to add more sophisticated validation)
    if (!phoneNumber || phoneNumber.length < 10) {
      return NextResponse.json({ message: 'Invalid phone number' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      membershipTier,
      role: 'member'  // Default role
    })

    return NextResponse.json({ 
      message: 'User registered successfully', 
      user: { 
        id: user._id, 
        name: user.name,
        username: user.username, 
        email: user.email,
        phoneNumber: user.phoneNumber,
        membershipTier: user.membershipTier 
      } 
    }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'An error occurred during registration' }, { status: 500 })
  }
}