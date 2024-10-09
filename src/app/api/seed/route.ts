// // app/api/seed/route.ts
import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongoose';
// import Event from '@/models/Event';

// const events = [
//   {
//     title: "Annual Golf Tournament",
//     date: "June 15, 2024 - June 17, 2024",
//     image: "/clubhouse.jpg"
//   },
//   {
//     title: "Beginner Golf Clinic",
//     date: "July 1, 2024 - July 3, 2024",
//     image: "/clubhouse.jpg"
//   },
//   {
//     title: "Summer Golf Scramble",
//     date: "August 1, 2024 - August 3, 2024",
//     image: "/clubhouse.jpg"
//   },
//   {
//     title: "Intermediate Golf Clinic",
//     date: "September 1, 2024 - September 3, 2024",
//     image: "/clubhouse.jpg"
//   },
//   {
//     title: "Fall Golf Tournament",
//     date: "October 1, 2024 - October 3, 2024",
//     image: "/clubhouse.jpg"
//   },
//   {
//     title: "Advanced Golf Clinic",
//     date: "November 1, 2024 - November 3, 2024",
//     image: "/clubhouse.jpg"
//   }
// ];

export async function GET() {
  try {
    // await dbConnect();
    
    // // Clear existing events
    // await Event.deleteMany({});
    
    // // Insert new events
    // await Event.insertMany(events);
    
    return NextResponse.json({ message: 'Database seeded successfully' }, { status: 200 });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}