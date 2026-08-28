import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jansetu_db';
  
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
      socketTimeoutMS: 5000
    });
    isConnected = true;
    console.log(`🍃 Connected to MongoDB Successfully: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️ MongoDB unavailable (${error.message}). JanSetu is running with high-performance persistent in-memory/JSON store fallback.`);
  }
};

export const isDBConnected = () => isConnected;
