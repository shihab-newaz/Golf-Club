import mongoose, { Mongoose } from 'mongoose'

// Define global types for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  }
}

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const dbName = 'Golf-club-details'

// Enhanced options for serverless environment
const options = {
  bufferCommands: false,
  dbName: dbName,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  autoIndex: false,
  retryWrites: true,
  connectTimeoutMS: 10000,
} as const

// Using let instead of var for cached connection
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    console.log('Using cached connection')
    return cached.conn
  }

  if (!cached.promise) {
    console.log('Creating new connection')
    cached.promise = mongoose.connect(uri, options)
      .then((mongoose) => {
        console.log(`Successfully connected to MongoDB database: ${dbName}`)
        return mongoose
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error)
        cached.promise = null
        throw error
      })
  } else {
    console.log('Waiting for existing connection promise')
  }

  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (e) {
    cached.promise = null
    throw e
  }
}

export default dbConnect