import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Using a global declaration to properly type the global object
declare global {
  var mongoose: MongooseConnection | undefined;
}

// Ensure that `cached` has a proper type
let cached: MongooseConnection = global.mongoose || { conn: null, promise: null };

// If `global.mongoose` doesn't exist, initialize it
if (!global.mongoose) {
  global.mongoose = cached;
}

export const connectToDatabase = async (): Promise<Mongoose> => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) {
    throw new Error('Missing MONGODB_URL');
  }

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: 'imaginify',
      bufferCommands: false,
    });

  cached.conn = await cached.promise;
  return cached.conn;
};
