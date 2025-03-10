import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MongoDB_URL = process.env.MONGODB_URL;

const dbConnect = async () => {
  mongoose
    .connect(MongoDB_URL)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.log('MongoDB connection error:');
    });
};

export { dbConnect };
