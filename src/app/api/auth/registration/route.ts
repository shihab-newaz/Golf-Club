// app/api/auth/registration/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'

export async function POST(req: Request) {
  try {
    await dbConnect()

    const { name, email, password, tier = 'free' } = await req.json()
    
    // Validate tier
    if (!['free', 'basic', 'premium'].includes(tier)) {
      return NextResponse.json({ message: 'Invalid tier' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      tier
    })

    return NextResponse.json({ 
      message: 'User registered successfully', 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        tier: user.tier 
      } 
    }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'An error occurred during registration' }, { status: 500 })
  }
}