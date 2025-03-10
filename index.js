import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

// Load environment variable from .env file to process.env
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3003;
const MongoDB_URL = process.env.MONGODB_URL;

app.get('/', (req, res) => {
  res.send('Hello Noders');
});

app.get('/nehal', (req, res) => {
  res.send('Route to Nehal');
});

app.get('/panchal', (req, res) => {
  res.send({ lastname: 'Panchal' });
});

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

mongoose
  .connect(MongoDB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('MongoDB connection error:');
  });

app.listen(PORT, () => {
  console.log(`Node server is running on port number: ${PORT}`);
});
