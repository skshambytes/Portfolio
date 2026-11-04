import mongoose from 'mongoose';
import { ENV } from '../config/env.js';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = conn.connection.readyState === 1;
    console.log(`[Database] MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(`[Database Warning] MongoDB connection failed: ${errorMsg}. Running in resilient mode.`);
  }

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('[Database Warning] MongoDB disconnected.');
  });

  mongoose.connection.on('reconnected', () => {
    isConnected = true;
    console.log('[Database] MongoDB reconnected.');
  });
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
