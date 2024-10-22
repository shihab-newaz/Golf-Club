import mongoose, { Mongoose } from 'mongoose'

// Define global types for TypeScript
declare global {
  var mongoose: {
    conn: Mongoose | null
    promise: Promise<Mongoose> | null
  }
}

// Define NodeJS.Process signal types
declare type NodeProcessSignal = 'SIGTERM' | 'SIGINT'

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
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    console.log('Using cached connection')
    return cached.conn
  }

  if (cached.promise) {
    console.log('Waiting for existing connection promise')
    try {
      cached.conn = await cached.promise
      return cached.conn
    } catch (e) {
      cached.promise = null
      console.error('Existing connection promise failed:', e)
    }
  }

  // Close any existing connections
  if (mongoose.connections.length > 0) {
    const closePromises = mongoose.connections.map(connection => {
      return connection.readyState !== 0 ? connection.close() : Promise.resolve()
    })
    await Promise.all(closePromises.filter(Boolean))
    console.log('Closed existing connections')
  }

  console.log('Creating new connection')
  cached.promise = mongoose.connect(uri, options)
    .then((mongoose) => {
      console.log(`Successfully connected to MongoDB database: ${dbName}`)
      return mongoose
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error)
      if (error instanceof Error) {
        console.error({
          name: error.name,
          message: error.message,
          stack: error.stack,
          cause: error.cause
        })
      }
      cached.promise = null
      throw error
    })

  try {
    cached.conn = await cached.promise
    
    // Set up connection error handlers
    cached.conn.connection.on('error', (err: Error) => {
      console.error('MongoDB connection error:', err)
      if (err.name === 'MongoNetworkError') {
        cached.conn = null
        cached.promise = null
      }
    })

    cached.conn.connection.on('disconnected', () => {
      console.log('MongoDB disconnected')
      cached.conn = null
      cached.promise = null
    })

    // Graceful shutdown handling with proper TypeScript types
    const signals: NodeProcessSignal[] = ['SIGTERM', 'SIGINT']
    
    signals.forEach((signal: NodeProcessSignal) => {
      process.on(signal, async () => {
        try {
          if (cached.conn) {
            await cached.conn.disconnect()
            cached.conn = null
            cached.promise = null
            console.log(`Disconnected MongoDB on ${signal}`)
            process.exit(0)
          }
        } catch (err) {
          console.error(`Error during ${signal} shutdown:`, err)
          process.exit(1)
        }
      })
    })

    return cached.conn
  } catch (e) {
    cached.promise = null
    throw e
  }
}

// Connection status interface
interface ConnectionStatus {
  isConnected: boolean
  readyState: number
  error?: string
}

// Helper function to check connection status
export async function getConnectionStatus(): Promise<ConnectionStatus> {
  try {
    const conn = await dbConnect()
    return {
      isConnected: !!conn?.connection?.readyState,
      readyState: conn?.connection?.readyState || 0
    }
  } catch (error) {
    return {
      isConnected: false,
      readyState: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export default dbConnect