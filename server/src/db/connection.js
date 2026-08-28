import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jansetu_db';
  
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 10000
    });
    isConnected = true;
    console.log();
  } catch (error) {
    isConnected = false;
    console.warn();
  }
};

export const isDBConnected = () => isConnected;
